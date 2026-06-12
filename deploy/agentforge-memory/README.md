# AgentForge 记忆植入器 · Memory Grafter

> 把"AgentForge 毕业生记忆"焊进你机器上**所有** agent 工具的全局记忆文件,
> 让**每个新会话**自动带着身份、条件反射和七条铁律——
> 彻底解决"换个新对话,agent 就忘了自己上过学、想不起来用技能"。

## 它解决的根本问题

Agent 没有跨会话记忆。在 AgentForge 学得再好,关掉对话就忘了。
真实测试里,毕业 agent 换个新会话后接到任务,**根本想不起来自己有技能库**,凭直觉直接干。

根因有二:**① 没有持久身份**(新会话不知道自己上过学)、**② 没有条件反射**(接任务不会先查技能)。
本植入器把这两样写进各 agent 工具"每次会话自动加载"的记忆文件,从此焊死生效。

## 一行命令

```bash
# 在克隆好的 AgentForge 仓库根目录
bash deploy/agentforge-memory/install.sh
```

它会自动探测你装了哪些 agent 工具,把一段精简的"毕业生记忆块"幂等写进它们的全局记忆文件。

## 覆盖的工具(三管齐下,真·全覆盖)

**① 已知工具大表**(2026-06 核实路径):

| 工具 | 全局记忆文件 |
|------|------------|
| Claude Code | `~/.claude/CLAUDE.md` ← 黄金落点(opencode 默认也读它) |
| opencode | `~/.config/opencode/AGENTS.md` |
| OpenClaw | `~/.openclaw/workspace/AGENTS.md` |
| Hermes | `~/.hermes/SOUL.md` |
| Codex CLI | `~/.codex/AGENTS.md` |
| Gemini CLI | `~/.gemini/GEMINI.md` |

默认只写"探测到的工具"+ Claude Code 黄金落点;`--all` 则大表全写。

**② 自动发现**:扫描 `~/.*/` 下现有的 `AGENTS.md` / `CLAUDE.md` / `MEMORY.md` / `SOUL.md` / `GEMINI.md`,
凡找到的统统植入——抓住大表没列到的工具(只要它用这些标准记忆文件名)。

**③ 手动指定**:任何冷门工具,显式加进来——

```bash
bash deploy/agentforge-memory/install.sh --target ~/.youragent/RULES.md
# 或环境变量(冒号分隔多个)
AGENTFORGE_TARGETS="~/.a/MEM.md:~/.b/rules.md" bash deploy/agentforge-memory/install.sh
```

## 植入的内容(精简反射块)

```
你是 Agent 养成所 · AgentForge 的毕业生。每次接到任务,先做这个条件反射,再动手:
① 查 ~/.agentforge/skills/index.md 有没有对口技能卡,有就先读再动手;
② 没把握的领域查 AgentForge 有没有对口课程;
③ 守七条铁律:先探索 · 管上下文 · 拿证据 · 先装备 · 守边界 · 证据交付 · 带回成果。
完整规则与技能库见: @~/.agentforge/AGENTS.md
```

- **内联反射**保证不支持 `@import` 的工具也有反射;末行 `@import` 让支持的工具(Claude Code/opencode)加载完整版 `~/.agentforge/AGENTS.md`。
- 前提:`~/.agentforge/AGENTS.md` 已由毕业流程生成(见 `agent-school/templates/dorm/`)。缺它时内联反射仍生效,只是 `@import` 加载不到全文。

## 常用命令

```bash
bash install.sh              # 植入(探测到的 + 自动发现)
bash install.sh --all        # 已知大表全部植入(连没探测到的也建)
bash install.sh --dry-run    # 预演,只看会改哪些文件,不实际写入
bash install.sh --list       # 打印已知工具表
bash install.sh --uninstall  # 卸载,移除所有植入块
```

## 安全保证

- **幂等**:植入块用 `>>> AgentForge memory >>>` … `<<<` 标记包裹,重复运行只更新、不堆叠。
- **备份**:每次写入前,把"去掉植入块的干净原文"存为 `<文件>.agentforge.bak`,重复运行也不污染。
- **可逆**:`--uninstall` 用标记块精确剥离,内容恢复如初。
- **不碰别的**:只写各工具的全局记忆文件,不动其它配置、不联网、不装东西。

## 验证生效

植入后**新开一个对话**,问 agent:「接到任务你第一步会做什么?」
它应该答出"先查 `~/.agentforge/skills/` 有没有对口技能 / 去 AgentForge 看有没有对口课程"——
而不是凭直觉直接动手。那就说明记忆焊进去了。
