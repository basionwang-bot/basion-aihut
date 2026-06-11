# Claude Code 实战课 · 一个人，也是一支队伍 🛖

> **用 Claude Code 把自己活成一个团队。**
> 一套面向新手的系列教程,把 Anthropic 官方最佳实践翻译成人话——读完就能上手。
> 备课人:Basion Wang

这是 **Basion 的 Ai 小屋** 里的主力课程。我把官方那份"专家向"的密集大纲,逐条改写成新手也能看懂的教程,每篇都按「这是什么 → 为什么 → 怎么做 → 真实例子 → 避坑 → 动手练习」展开。

---

## 🎓 还有一所「Agent 学校」—— 让你的 AI 自己来上学

担心"看完文章不去做"?那就**别自己学,让你的 agent 来上学。**

[`agent-school/`](agent-school/) 是一个**直接写给 AI agent 看**的栏目:你把仓库交给自己的 Claude Code,说一句"去 `agent-school` 上学",它就会一门门学、**当场做毕业测验(真的去执行任务、交命令和输出当证据)**、记进报告卡、过了才升级。把"做"焊进了学习里。

👉 入学只需复制 [`agent-school/enroll.md`](agent-school/enroll.md) 里那段话发给它。

---

## 这门课解决什么问题

大多数人用不好 Claude Code,不是技术问题,是**心态和方法**问题——
把它当聊天机器人用、一句话指望它读心、错了就反复纠到崩溃。

这门课只围绕一句话展开:

> 🧠 **Claude 的"上下文窗口"就是它的工作记忆,填得越满,表现越差。**

所有技巧,本质都在回答三件事:怎么让它**第一次就听懂**、怎么让它**自己验证自己**、怎么管好它的**记忆与注意力**。掌握了,你才有资格进第四阶段:**让多个 Claude 替你并行干活。**

---

## 课程大纲(10 篇)

点击篇目标题即可直接阅读 👇

| # | 篇目 | 一句话内容 |
|---|------|-----------|
| 00 | [**开篇**](content/posts/claude-code-00-intro.md) | 底层逻辑 + 学习路线图,先读这篇 |
| 01 | [**模块一 · 换脑子**](content/posts/claude-code-01-mindset.md) | 从"下指令"到"管理一个干活的人" |
| 02 | [**模块二 · 提问的精度**](content/posts/claude-code-02-prompting.md) | 四个改写模板 + 让 AI 反过来采访你 |
| 03 | [**模块三 · 黄金工作流**](content/posts/claude-code-03-workflow.md) | 探索 → 计划 → 实现 → 提交(及何时跳过) |
| 04 | [**模块四 · 验证闭环**](content/posts/claude-code-04-verification.md) | 让 Claude 自己检查自己,你才敢走开 |
| 05 | [**模块五 · 上下文管理**](content/posts/claude-code-05-context.md) | 高手和普通用户的真正分水岭 |
| 06 | [**模块六 · 环境配置**](content/posts/claude-code-06-config.md) | CLAUDE.md / 权限 / Skills / Hooks / MCP |
| 07 | [**模块七 · 自动化** ⭐](content/posts/claude-code-07-automation.md) | 让 Claude 在你不在场时干活 |
| 08 | [**模块八 · 五大翻车现场**](content/posts/claude-code-08-pitfalls.md) | 每个坑配"症状 + 解药" |
| 99 | [**附录 · 速查表**](content/posts/claude-code-99-cheatsheet.md) | 全命令速查 + 官方资料 + 落地清单 |

> 所有文章都在 [`content/posts/`](content/posts/) 目录下(`claude-code-*.md`)。

---

## 怎么读:按你是谁,选一条路线

| 你是谁 | 推荐路线 | 学完能干嘛 |
|--------|----------|------------|
| **完全新手 / 非技术 / 老师、独立创业者** | 开篇 + ① ② ③ ⑧ | 稳定地让 Claude 帮你完成一件件具体的事,不返工、不翻车 |
| **想认真提效的个人** | 再加 ④ ⑤ ⑥ | 让 Claude 自己验证、自己管记忆,配好专属工作环境 |
| **想"一个人开一支队伍"的人** | 再加 ⑦ | 让 Claude 在你睡觉时自动干活、批量处理、多会话并行 |

> 建议所有人都先把 **①②③⑧** 吃透。这是地基,地基不稳,后面学再多花活都是空中楼阁。

👉 **没时间纠结?直接从 [开篇:一个人,也是一支队伍](content/posts/claude-code-00-intro.md) 开始读。**

---

## 在网站上阅读

课程托管在「Basion 的 Ai 小屋」上,有专门的课程目录页、分层学习路线和文末上一篇/下一篇导航,阅读体验比直接翻 md 更顺。

- 课程目录页:`/course`
- 单篇文章:`/posts/claude-code-00-intro` 等

---

## 给学习者的三句话

1. **别想着"一句话让它干完一切"。** Claude Code 强在"被你管得好",不强在读心术。
2. **翻车是正常的,关键是会复盘。** 模块八的五个坑,你大概率每个都会踩——踩了回来看解药。
3. **从今天起,把它当"同事"而不是"工具"。** 这个心态转过来了,这门课就成功了一半。

---

<details>
<summary>📦 本地运行 / 部署这个站点(开发者向,选读)</summary>

本课程站点基于 Next.js 16 + Tailwind v4 构建,Claude design 风格,支持暗色模式。

```bash
npm install
npm run dev        # http://localhost:3000
./deploy.sh        # 构建 → standalone 打包 → rsync 到服务器 → PM2 重启
```

**加新文章:** 在 `content/posts/` 新建 `xxx.md`,开头加 frontmatter:

```yaml
---
title: 文章标题
description: 一句话简介(卡片上显示)
date: 2026-05-10
tag: Claude Code
---
```

文件名(去掉 `.md`)就是文章 URL slug。课程的章节顺序、目录页和文末导航在 [`src/lib/course.ts`](src/lib/course.ts) 里维护。

**技术栈:** Next.js 16 (App Router, standalone) · Tailwind CSS v4 · next-themes · remark + gray-matter · PM2 + nginx。

</details>
