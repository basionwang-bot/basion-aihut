#!/usr/bin/env bash
# AgentForge 记忆植入器 / Memory Grafter
#
# 作用:把"AgentForge 毕业生记忆"(身份 + 接任务的条件反射 + 七条铁律 + 技能库指针)
#       幂等地写进你机器上【所有】agent 工具的全局记忆文件,让以后每个新会话自动加载。
#       —— 解决"换个新对话,agent 就忘了自己上过学、想不起来用技能"的根本问题。
#
# 覆盖三管齐下:
#   ① 已知工具大表(Claude Code / opencode / OpenClaw / Hermes / Codex / Gemini CLI …)
#   ② 自动发现:扫描 ~/.*/ 下现有的 AGENTS.md / CLAUDE.md / MEMORY.md / SOUL.md / GEMINI.md
#   ③ 手动指定:--target <file> 可重复,或环境变量 AGENTFORGE_TARGETS="f1:f2:..."
#
# 用法:
#   bash install.sh                      # 植入(探测到的工具 + 自动发现)
#   bash install.sh --all                # 已知大表全部植入(连没探测到的也建)
#   bash install.sh --target ~/.foo/X.md # 追加任意工具的记忆文件
#   bash install.sh --uninstall          # 卸载(移除所有植入块)
#   bash install.sh --dry-run            # 预演,只看会改哪些文件
#   bash install.sh --list               # 打印已知工具表
#
# 安全:每次写入前自动备份为 <文件>.agentforge.bak;植入块用标记包裹,重复运行只更新不堆叠。

set -euo pipefail

HOME_DIR="${HOME:?HOME 未设置}"
AF_HOME="$HOME_DIR/.agentforge"
AF_RULES="$AF_HOME/AGENTS.md"
REPO_URL="https://github.com/basionwang-bot/AgentForge"

BEGIN_MARK="<!-- >>> AgentForge memory (managed by install.sh — do not edit by hand) >>> -->"
END_MARK="<!-- <<< AgentForge memory <<< -->"

# ── 已知工具大表:标签|全局记忆文件|探测目录 ──────────────────────────
# 依据(2026-06 核实):
#   Claude Code : ~/.claude/CLAUDE.md            (opencode 默认也合并读它 → 黄金落点,总是写)
#   opencode    : ~/.config/opencode/AGENTS.md   (opencode 全局规则)
#   OpenClaw    : ~/.openclaw/workspace/AGENTS.md (开机自动加载 AGENTS.md/MEMORY.md 等 8 文件)
#   Hermes      : ~/.hermes/SOUL.md              (instance-wide 个性源,每会话注入)
#   Codex CLI   : ~/.codex/AGENTS.md
#   Gemini CLI  : ~/.gemini/GEMINI.md
KNOWN="
Claude Code|$HOME_DIR/.claude/CLAUDE.md|$HOME_DIR/.claude
opencode|$HOME_DIR/.config/opencode/AGENTS.md|$HOME_DIR/.config/opencode
OpenClaw|$HOME_DIR/.openclaw/workspace/AGENTS.md|$HOME_DIR/.openclaw
Hermes|$HOME_DIR/.hermes/SOUL.md|$HOME_DIR/.hermes
Codex CLI|$HOME_DIR/.codex/AGENTS.md|$HOME_DIR/.codex
Gemini CLI|$HOME_DIR/.gemini/GEMINI.md|$HOME_DIR/.gemini
"

DRY_RUN=0; UNINSTALL=0; ALL=0
EXTRA_TARGETS=""
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --uninstall) UNINSTALL=1 ;;
    --all) ALL=1 ;;
    --target) shift; EXTRA_TARGETS="$EXTRA_TARGETS $1" ;;
    --list) printf '已知工具 → 全局记忆文件:\n'; printf '%s\n' "$KNOWN" | sed '/^$/d' | awk -F'|' '{printf "  %-14s %s\n",$1,$2}'; exit 0 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "未知参数:$1(用 --help 看用法)"; exit 1 ;;
  esac
  shift
done
# 环境变量追加目标(冒号分隔)
if [ -n "${AGENTFORGE_TARGETS:-}" ]; then
  EXTRA_TARGETS="$EXTRA_TARGETS $(printf '%s' "$AGENTFORGE_TARGETS" | tr ':' ' ')"
fi

# 植入到各记忆文件里的精简块(内联反射,保证不支持 @import 的工具也有反射;
# 末行 @import 指向完整版,支持的工具会加载全文)。
read -r -d '' GRAFT_BODY <<EOF || true
你是 **Agent 养成所 · AgentForge** 的毕业生。每次接到任务,先做这个条件反射,再动手:
① 查 \`~/.agentforge/skills/index.md\` 有没有对口技能卡,有就先读再动手;
② 没把握的领域查 AgentForge 有没有对口课程($REPO_URL,或 MCP \`list_courses\`/\`get_course\`);
③ 守七条铁律:先探索 · 管上下文 · 拿证据 · 先装备 · 守边界 · 证据交付 · 带回成果。
完整规则与技能库见: @~/.agentforge/AGENTS.md
EOF

log() { printf '%s\n' "$*"; }
PROCESSED=" "   # 去重:已处理过的文件路径(空格分隔)

strip_block() {  # 输出去掉植入块后的文件内容
  local f="$1"; [ -f "$f" ] || return 0
  awk -v b="$BEGIN_MARK" -v e="$END_MARK" '
    $0==b {skip=1; next} $0==e {skip=0; next} skip!=1 {print}
  ' "$f"
}

graft() {  # graft <file> <label>
  local f="$1" label="$2"
  case "$PROCESSED" in *" $f "*) return 0 ;; esac   # 已处理,跳过
  PROCESSED="$PROCESSED$f "

  if [ "$UNINSTALL" = 1 ]; then
    [ -f "$f" ] || return 0
    grep -qF "$BEGIN_MARK" "$f" 2>/dev/null || return 0
    if [ "$DRY_RUN" = 1 ]; then log "  ✗ [dry-run] 将从 $label 移除植入块"; return 0; fi
    strip_block "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    log "  ✗ 已从 $label 移除植入块($f)"
    return 0
  fi

  if [ "$DRY_RUN" = 1 ]; then
    local verb="写入"; grep -qsF "$BEGIN_MARK" "$f" 2>/dev/null && verb="更新"
    log "  ✓ [dry-run] 将$verb $label → $f"; return 0
  fi

  mkdir -p "$(dirname "$f")"
  # 备份始终存"去掉植入块后的干净原文",重复运行也不会污染
  local existed=0; [ -f "$f" ] && { existed=1; strip_block "$f" > "$f.agentforge.bak"; }
  local base; base="$(strip_block "$f")"
  {
    [ -n "$base" ] && printf '%s\n\n' "$base"
    printf '%s\n%s\n%s\n' "$BEGIN_MARK" "$GRAFT_BODY" "$END_MARK"
  } > "$f.tmp"
  mv "$f.tmp" "$f"
  if [ "$existed" = 1 ]; then log "  ✓ 已更新 $label → $f"; else log "  ✓ 已写入 $label → $f(新建)"; fi
}

log "AgentForge 记忆植入器"
log "===================="

if [ "$UNINSTALL" != 1 ] && [ ! -f "$AF_RULES" ]; then
  log "⚠ 没找到完整记忆 $AF_RULES —— agent 可能还没毕业。"
  log "  请先走 AgentForge 上学流程,或先把 agent-school/templates/dorm/AGENTS.md 复制到该路径。"
  log "  (缺它时 @import 加载不到全文,但植入块里的内联反射仍生效。)"
  log ""
fi

[ "$UNINSTALL" = 1 ] && log "正在卸载……" || log "正在植入(全局记忆文件,所有 agent 工具)……"

# ① 已知工具大表
while IFS='|' read -r label file detect; do
  [ -n "$label" ] || continue
  if [ "$label" = "Claude Code" ] || [ "$ALL" = 1 ] || [ -d "$detect" ] || [ "$UNINSTALL" = 1 ]; then
    graft "$file" "$label"
  else
    log "  · $label:未检测到 $detect,跳过(可用 --all 强制,或已被 ~/.claude/CLAUDE.md 覆盖)"
  fi
done < <(printf '%s\n' "$KNOWN" | sed '/^$/d')

# ② 自动发现:~/.*/ 下现有的标准记忆文件(抓住大表没列到的工具)
if command -v find >/dev/null 2>&1; then
  while read -r found; do
    [ -n "$found" ] && graft "$found" "自动发现"
  done < <(find "$HOME_DIR" -mindepth 2 -maxdepth 3 -type f \
    \( -name 'AGENTS.md' -o -name 'CLAUDE.md' -o -name 'MEMORY.md' -o -name 'SOUL.md' -o -name 'GEMINI.md' \) \
    -path "$HOME_DIR/.*" ! -path "*/.agentforge/*" ! -name '*.agentforge.bak' 2>/dev/null)
fi

# ③ 手动指定的目标
for t in $EXTRA_TARGETS; do
  # 展开 ~ 前缀
  case "$t" in "~/"*) t="$HOME_DIR/${t#~/}" ;; esac
  graft "$t" "手动指定"
done

log ""
if [ "$UNINSTALL" = 1 ]; then
  log "✅ 卸载完成。"
else
  log "✅ 植入完成。以后每个新会话,agent 都会自动带着这套反射与铁律。"
  log "   验证:新开一个对话,问它「接到任务你第一步会做什么」,应答出'先查技能库/课程'。"
  log "   漏网的工具,手动把下面这段贴进它的全局记忆文件即可——"
  log "   ----------------------------------------"
  printf '%s\n%s\n%s\n' "$BEGIN_MARK" "$GRAFT_BODY" "$END_MARK"
  log "   ----------------------------------------"
fi
