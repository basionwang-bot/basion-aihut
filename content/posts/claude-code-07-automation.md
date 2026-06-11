---
title: 模块七 · 自动化｜让 Claude 在你不在场时干活 ⭐
description: 实战班核心，也是"一个人也是一支队伍"的字面实现。非交互模式、批量扇出、Hooks 配方、定时任务、CI 集成、多会话并行。附自动化的安全边界。
date: 2026-06-04
tag: Claude Code
---

> **本模块教学目标：** 让 Claude 在你不在场的时候干活——这是"一个人，也是一支队伍"的字面实现，也是整门课的高潮。
>
> ⚠️ **前置提醒：** 本模块偏进阶。**没把模块四（验证闭环）吃透，别碰自动化。** 因为你不在场，唯一能兜底的就是它的自检能力。

---

## 自动化的正确"爬梯"顺序

别一上来就追求"完全无人值守"，那是翻车的捷径。正确的进阶路线是：

> **先在交互模式下把流程跑顺 → 封装成 Skill → 接入 hook / 定时任务 → 最后才是完全无人值守。**

下面按这个梯子，一级一级往上爬。

---

## 7.1 非交互模式 `claude -p` —— 一切自动化的地基

平时你用 `claude` 进入一个对话界面。但自动化需要的是：**一条命令，直接出结果，不进界面。** 这就是 `-p`（print 模式）：

```bash
# 一次性提问
claude -p "解释这个项目是做什么的"

# 结构化输出（JSON），给脚本消费
claude -p "列出所有 API 端点" --output-format json

# 管道串联：Claude 的输出喂给下一个命令
claude -p "你的提示词" --output-format json | your_command

# 管道灌入：把数据喂给 Claude
cat error.log | claude -p "找出报错的根本原因"
```

因为它就是一条普通命令，所以**能塞进任何脚本、CI 流水线、定时任务**。这是后面一切自动化的基础。

**几个配套参数（无人值守的安全绳）：**

- `--allowedTools "Edit,Bash(git commit *)"` —— **限定它能用哪些工具**。没人盯着时，这是你的安全绳。
- `--permission-mode auto` —— 自主运行，由后台分类器审查命令。（注意：`-p` 模式下如果分类器**反复拦截**，会自动中止，因为没人能兜底。）
- `--verbose` —— 开发调试时打开看细节，上生产关掉。

```bash
# 完整示例：全自动修 lint 错误
claude --permission-mode auto -p "fix all lint errors"
```

---

## 7.2 批量扇出（Fan-out）—— 一次处理两千个文件

要做大规模迁移 / 分析（比如"把 2000 个文件从 React 迁到 Vue"）？标准三步法：

1. **生成任务清单** —— 让 Claude 先列出所有要处理的文件，存进 `files.txt`。
2. **写循环脚本** —— 对每个文件跑一次 `claude -p`：
   ```bash
   for file in $(cat files.txt); do
     claude -p "把 $file 从 React 迁移到 Vue。只回答 OK 或 FAIL。" \
       --allowedTools "Edit,Bash(git commit *)"
   done
   ```
3. **先试 2-3 个，再全量跑** —— 拿几个文件试水，根据翻车情况**打磨提示词**，满意了再全量开跑。这一步千万别省，否则可能 2000 个文件一起翻车。

---

## 7.3 Hooks 自动化配方（七个拿来即用）

钩子会在 Claude 生命周期的特定节点自动执行 shell 命令。配置写在 `~/.claude/settings.json`（全局）或 `.claude/settings.json`（项目）。

**① 改完文件自动格式化**（PostToolUse 事件）

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command",
        "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write" }]
    }]
  }
}
```

**② 它需要你时，弹桌面通知**（Notification 事件，macOS）——你可以放心去干别的

```json
{
  "hooks": {
    "Notification": [{
      "matcher": "",
      "hooks": [{ "type": "command",
        "command": "osascript -e 'display notification \"Claude Code 需要你\" with title \"Claude Code\"'" }]
    }]
  }
}
```

matcher 还能细分：`permission_prompt`（等审批时）、`idle_prompt`（干完活等你下一步时）等。

**③ 保护敏感文件，禁止它改**（PreToolUse 事件 + 退出码 2 拦截）

写个脚本 `.claude/hooks/protect-files.sh`，检查目标路径是否命中 `.env`、`package-lock.json`、`.git/` 等保护名单，命中就 `exit 2` 拦截。Claude 会收到拦截原因，并自动调整方案。

**④ 上下文压缩后自动补回关键信息**（SessionStart 事件，matcher 为 compact）

```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "compact",
      "hooks": [{ "type": "command",
        "command": "echo '提醒：用 Bun 不用 npm。提交前跑 bun test。当前迭代：认证重构。'" }]
    }]
  }
}
```

`echo` 可以换成任何动态命令，比如 `git log --oneline -5` 注入最近提交记录。

**⑤ 配置变更审计日志**（ConfigChange 事件）—— 记录谁在会话中改了配置，合规留痕。

**⑥ 目录/文件变化时自动重载环境变量**（CwdChanged / FileChanged 事件，配合 direnv）。

**⑦ 自动批准特定权限弹窗**（PermissionRequest 事件）—— 比如自动放行 ExitPlanMode，计划一出来就直接执行，不用你点。

> 进阶：除了上面这种"命令型"钩子，还有 **prompt-based hooks** 和 **agent-based hooks**——让一个 Claude 模型来做"需要判断力（而非死规则）"的拦截决策。

---

## 7.4 Skills 作为"一键工作流"

把一套固定流程封装成技能，带参数调用：

```markdown
---
name: fix-issue
description: 修复一个 GitHub issue
disable-model-invocation: true
---
分析并修复 GitHub issue：$ARGUMENTS

1. 用 `gh issue view` 获取 issue 详情
2. 理解 issue 描述的问题
3. 在代码库中搜索相关文件
4. 实现修复
5. 编写并运行测试验证
6. 确保通过 lint 和类型检查
7. 写清晰的提交信息
8. 推送并创建 PR
```

之后只需输入 `/fix-issue 1234`，整条流水线自动跑完。

`disable-model-invocation: true` 的意思是：**这种有副作用的流程，只允许你手动触发**，Claude 不会自作主张去调用它。

---

## 7.5 定时任务：让它按时间表自动干活 ⭐

**三种定时方案对比：**

| | Cloud 云端 | Desktop 桌面 | `/loop`（会话内） |
|---|---|---|---|
| 运行位置 | Anthropic 云端 | 你的电脑 | 你的电脑 |
| 需要开机 | 否 | 是 | 是 |
| 需要会话开着 | 否 | 否 | 是 |
| 重启后保留 | 是 | 是 | 否 |
| 访问本地文件 | 否（全新克隆） | 是 | 是 |
| 最小间隔 | 1 小时 | 1 分钟 | 1 分钟 |

**选择口诀：** 要稳定无人值守用**云端**；要碰本地文件用**桌面**；会话里临时盯个进度用 **`/loop`**。

**`/loop` 快速上手：**

```text
/loop 5m 检查部署是否完成，告诉我结果
/loop 每 2 小时检查一次构建状态
/loop 20m /review-pr 1234        ← 定时循环执行另一个技能
```

间隔支持 s / m / h / d，不写默认每 10 分钟。

**一次性提醒，直接用自然语言：**

```text
下午 3 点提醒我推 release 分支
45 分钟后检查集成测试过了没有
```

**管理任务：** 直接问"我现在有哪些定时任务？" / "取消那个部署检查任务"。（底层是 CronCreate / CronList / CronDelete 三个工具，标准五段 cron 表达式，单会话最多 50 个任务。）

**⚠️ 讲课必提的几个坑：**

- `/loop` 是**会话级**的：**关了终端就全没了**；循环任务 7 天后自动过期。
- 任务在你的回合**之间**触发，Claude 正忙的时候会排队等。
- 时间按你**本地时区**解释。
- 需要真正无人值守的，用 **Cloud 定时任务**或 **GitHub Actions 的 schedule 触发器**。

**事件驱动（比轮询更高级）：** 用 **Channels** 让 CI、监控、聊天消息**主动推送**进正在运行的会话——构建挂了不用等下次轮询，失败信息直接进会话，Claude 当场响应。

---

## 7.6 CI/CD 集成：GitHub Actions

- Claude Code 官方支持 **GitHub Actions** 与 **GitLab CI/CD** 集成。
- 典型用法：**PR 自动代码审查**（多个 agent 分析整个代码库，抓逻辑错误、安全漏洞、回归）、**issue 自动修复**、用 schedule 触发器实现**真正不依赖你电脑**的定时自动化。
- 内置 **`/code-review`** 技能：在干净的子代理里审查当前 diff，把发现直接返回会话。

---

## 7.7 多会话并行 & Agent Teams：真正的"一支队伍"

**四种并行方式（按你想亲自协调的程度来选）：**

1. **Git Worktrees** —— 多个 CLI 会话在隔离的检出目录里跑，互不冲突。
2. **桌面端** —— 可视化管理多个本地会话，每个自带 worktree。
3. **Claude Code on the web** —— 跑在 Anthropic 云端的隔离 VM 里。
4. **Agent Teams** —— 自动协调多个会话：共享任务列表、互发消息、有一个"队长"统筹。

**Writer / Reviewer 双会话模式（最实用的并行）：**

| 会话 A（写手） | 会话 B（审查员） |
|---|---|
| "给 API 端点实现一个限流器" | |
| | "审查 @src/middleware/rateLimiter.ts 的限流实现。找边界情况、竞态条件、和现有中间件模式的一致性问题" |
| "这是审查意见：[B 的输出]。逐条解决" | |

为什么有效？**干净上下文的会话不会偏袒自己刚写的代码。**（呼应模块四的"第二意见"原则。）同理，可以让一个会话写测试、另一个写代码去通过测试。

**对抗性审查（无人值守跑得越久越重要）：**

```text
用子代理对照 PLAN.md 审查限流器的 diff。
检查每条需求都实现了、列出的边界情况都有测试、
没有改动任务范围之外的东西。只报告缺口，不报告风格偏好。
```

> ⚠️ 注意：被要求"挑刺"的审查者**总会挑出点什么**。一定要告诉它**只标记影响正确性或既定需求的缺口**，否则你会陷入过度工程——多余的抽象层、防御性代码、为不可能发生的用例写测试。

---

## 7.8 自动化的安全边界（务必读完）

无人值守 ≠ 撒手不管。安全的无人值守 = **验证闭环（模块四）+ 工具白名单（`--allowedTools`）+ 沙箱或容器**，三者缺一不可。

- `--dangerously-skip-permissions` 会跳过一切审批：**只建议在"无网络访问的容器"里用**，否则有数据丢失和提示词注入的风险。
- 再强调一遍那个爬梯顺序：**交互模式跑顺 → 封装 Skill → 接 hook / 定时 → 最后才完全无人值守。** 别跳级。

---

## 本模块一句话总结

> **`claude -p` 是地基，验证闭环是安全绳，循序渐进是铁律。** 把这三样握住，你才能放心地让一队 Claude 在你睡觉时替你干活——这就是"一个人，也是一支队伍"。

下一篇：**模块八·五大典型翻车现场。**
