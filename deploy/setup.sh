#!/usr/bin/env bash
# AgentForge 一键装备 / Setup
#
# 在【用户本机】跑一次,就把 AgentForge 的「毕业生记忆 + 条件反射 + 七铁律 + 技能库」
# 装进 ~/.agentforge/,并焊进你所有 agent 工具的全局记忆文件;可选注册远程 MCP。
# 从此每个新对话,agent 都自动带着这套本事。
#
# 两种用法:
#   ① 免上学直接装:还没走完整毕业流程也能先把核心规则装上(以后上学再丰富技能库)。
#   ② 上学后装:若 ~/.agentforge/ 已有毕业记忆,则沿用、不覆盖。
#
# 命令:
#   bash deploy/setup.sh                  # 装备(自动探测所有 agent 工具)
#   bash deploy/setup.sh --mcp <url>      # 顺便注册远程 MCP(如 http://IP:8479/mcp)
#   bash deploy/setup.sh --dry-run        # 预演,不实际写入
#   bash deploy/setup.sh --uninstall      # 移除植入的记忆块
#
# 安全:植入用标记块、可 --uninstall;写入前自动备份;不联网装东西、不碰别的配置。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DORM_TPL="$REPO_ROOT/agent-school/templates/dorm"
AF_HOME="$HOME/.agentforge"
GRAFTER="$SCRIPT_DIR/agentforge-memory/install.sh"

MCP_URL=""; DRY=""; UNINSTALL=0
while [ $# -gt 0 ]; do
  case "$1" in
    --mcp) shift; MCP_URL="${1:-}" ;;
    --dry-run) DRY="--dry-run" ;;
    --uninstall) UNINSTALL=1 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "未知参数:$1(用 --help 看用法)"; exit 1 ;;
  esac
  shift
done

if [ "$UNINSTALL" = 1 ]; then
  bash "$GRAFTER" --uninstall ${DRY:+$DRY}
  echo "(~/.agentforge/ 与 MCP 注册未自动删除,如需请手动清理)"
  exit 0
fi

echo "AgentForge 一键装备"
echo "==================="

# 1) 确保 ~/.agentforge/ 有核心记忆;没有就用模板 bootstrap(实现"免上学直接装")
mkdir -p "$AF_HOME/skills"
if [ ! -f "$AF_HOME/AGENTS.md" ]; then
  echo "· 未发现毕业记忆 → 用模板先装一份核心规则(以后上学可丰富技能库)"
  if [ -n "$DRY" ]; then
    echo "  [dry-run] 将从 $DORM_TPL 复制 AGENTS.md / skills/index.md / README.md 到 $AF_HOME"
  else
    if [ ! -f "$DORM_TPL/AGENTS.md" ]; then
      echo "  ✗ 找不到模板 $DORM_TPL/AGENTS.md —— 请在 AgentForge 仓库根目录运行本脚本"; exit 1
    fi
    sed -e 's/\[YYYY-MM-DD\]/(直接装备,未走完整毕业流程)/' \
        -e 's/\[例：[^]]*\]/(待上学补全)/' \
        -e 's/\[你的学籍名[^]]*\]/direct-equip/' \
        -e 's/\[students[^]]*\]/(无)/' \
        "$DORM_TPL/AGENTS.md" > "$AF_HOME/AGENTS.md"
    [ -f "$AF_HOME/skills/index.md" ] || cp "$DORM_TPL/skills/index.md" "$AF_HOME/skills/index.md"
    [ -f "$AF_HOME/README.md" ] || cp "$DORM_TPL/README.md" "$AF_HOME/README.md"
    echo "  ✓ 已在 $AF_HOME 写入核心记忆"
  fi
else
  echo "· 已存在毕业记忆 $AF_HOME/AGENTS.md → 沿用,不覆盖"
fi

# 2) 把记忆焊进所有 agent 工具
echo ""
echo "→ 植入记忆到所有 agent 工具……"
bash "$GRAFTER" ${DRY:+$DRY}

# 3) 可选:注册远程 MCP
if [ -n "$MCP_URL" ]; then
  echo ""
  echo "→ 注册远程 MCP:$MCP_URL"
  if [ -n "$DRY" ]; then
    echo "  [dry-run] 将尝试 claude mcp add,并打印其它工具的手动配置"
  else
    if command -v claude >/dev/null 2>&1; then
      if claude mcp add --transport http agentforge "$MCP_URL" 2>/dev/null; then
        echo "  ✓ 已注册到 Claude Code"
      else
        echo "  · Claude Code:跳过(可能已注册,或需手动 claude mcp add)"
      fi
    fi
    echo "  其它工具(opencode / Cursor / Cline)手动加这段 MCP 配置:"
    printf '    { "mcpServers": { "agentforge": { "url": "%s" } } }\n' "$MCP_URL"
  fi
fi

echo ""
if [ -n "$DRY" ]; then
  echo "✅ 预演结束(未实际写入)。去掉 --dry-run 即真正装备。"
else
  echo "✅ 装备完成!以后每个新对话,agent 都会先查技能库、先看有没有对口课程。"
  echo "   验证:新开一个对话,问 agent「接到任务你第一步会做什么」——"
  echo "   它应答出'先查 ~/.agentforge/skills / 看 AgentForge 有没有对口课程'。"
fi
