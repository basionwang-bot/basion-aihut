---
title: 附录 · Claude Code 命令速查表 + 官方资料
description: 全套常用命令/快捷键速查，新手随用随查。附官方文档链接（持续更新）和一份"从今天起就动手"的落地清单。
date: 2026-06-02
tag: Claude Code
---

> 这是《Claude Code 实战课》的收尾篇。**建议收藏**，干活时随手翻。

---

## 附录 A：常用命令速查表

| 命令 / 快捷键 | 作用 |
|---|---|
| `claude` | 启动交互会话 |
| `claude -p "..."` | 非交互模式，脚本 / 自动化用 |
| `claude --continue` | 续上最近一次会话 |
| `claude --resume` | 从列表里挑一个会话续上 |
| `Shift + Tab` | 切换权限模式（含 Plan Mode 计划模式） |
| `Esc` | 打断它当前的动作（上下文保留） |
| `Esc + Esc` | 打开回滚菜单 |
| `Ctrl + G` | 在编辑器里编辑计划 |
| `/init` | 自动生成 CLAUDE.md 初稿 |
| `/clear` | 清空上下文 |
| `/compact <指示>` | 定向压缩上下文（告诉它保留什么） |
| `/btw` | 问小问题，不占用 / 不污染上下文 |
| `/rewind` | 回滚对话 / 代码 |
| `/rename` | 给当前会话命名 |
| `/permissions` | 管理工具 / 域名白名单 |
| `/sandbox` | 沙箱隔离 |
| `/hooks` | 查看已配置的钩子 |
| `/plugin` | 浏览插件市场 |
| `/loop <间隔> <提示词>` | 会话内定时循环任务 |
| `/goal` | 设定回合级验证条件 |
| `/code-review` | 在干净子代理里审查当前 diff |
| `@文件名` | 把文件引用进上下文 |

> 速查口诀：**管记忆看 `/clear` `/compact` `/btw` `/rewind`；管流程看 `Shift+Tab` `/init` `/hooks`；管自动化看 `claude -p` `/loop` `/code-review`。**

---

## 附录 B：八个模块速链

按顺序读，或按下面的路线挑着读：

- **开篇**：一个人，也是一支队伍（底层逻辑 + 学习路线）
- **模块一**：换脑子——从"下指令"到"管理一个干活的人"
- **模块二**：提问的精度，决定返工的次数
- **模块三**：黄金工作流——探索 → 计划 → 实现 → 提交
- **模块四**：验证闭环——让 Claude 自己检查自己
- **模块五**：上下文管理——高手和普通用户的分水岭
- **模块六**：环境配置——一次配置，长期省力
- **模块七**：自动化——让 Claude 在你不在场时干活 ⭐
- **模块八**：五大典型翻车现场——症状 + 解药

**新手路线：** 开篇 → ① → ② → ③ → ⑧（先把地基打牢）
**进阶路线：** 加学 ④ ⑤ ⑥
**实战路线：** 再加 ⑦

---

## 附录 C：官方文档来源（持续更新）

这门课的主干全部来自 Anthropic 官方文档。想深入，直接读源头：

- **最佳实践**（本课主干）：https://code.claude.com/docs/en/best-practices
- **定时任务**：https://code.claude.com/docs/en/scheduled-tasks
- **Hooks 自动化指南**：https://code.claude.com/docs/en/hooks-guide
- **无头 / 编程式调用（Agent SDK）**：https://code.claude.com/docs/en/headless
- **Agent Teams**：https://code.claude.com/docs/en/agent-teams
- **GitHub Actions**：https://code.claude.com/docs/en/github-actions
- **Channels（事件推送）**：https://code.claude.com/docs/en/channels
- **功能总览（何时用 Skill / Hook / MCP / 子代理）**：https://code.claude.com/docs/en/features-overview
- **常见工作流**：https://code.claude.com/docs/en/common-workflows
- **完整文档索引**：https://code.claude.com/docs/llms.txt

---

## 附录 D：从今天起就动手（落地清单）

学完十篇不如落地三件。给自己定个小目标——**带走三个自动化**：

- [ ] **配一个 CLAUDE.md**：跑 `/init`，然后对照模块六的黄金标准表无情删减。
- [ ] **配一个 Hook**：让 Claude 帮你写一个"改完文件自动跑格式化 / lint"的钩子。
- [ ] **配一个定时任务**：用 `/loop` 或云端定时任务，让它替你定期盯一件事（构建、部署、PR 状态）。

外加三个**每日习惯**：

- [ ] 换不相关任务，先 `/clear`。
- [ ] 每个任务都给它一个"自己能跑的验证"。
- [ ] 同一问题纠两次还不对，就清空重来，别硬刚。

> **"带走三个自动化"，比"听懂十个概念"更有交付感。** 这门课到此结束，但你的"一个人的队伍"才刚刚开始组建。

—— 完 ·  备课人 Basion Wang
