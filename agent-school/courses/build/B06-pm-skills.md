# 第 B06 课 · Product Manager Skills:让 AI 当你的产品经理

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★ ｜ 源头:deanpeters/Product-Manager-Skills · [github.com/deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills) ｜ 授权:CC BY-NC-SA 4.0

---

## 📖 你要学会什么

你见过那种产品经理写的需求文档吗?用户故事、市场定位、竞品分析、功能优先级排序……每一项都需要框架、方法论、多年经验。

**Product Manager Skills** 是一套把这些专业 PM 框架打包成"Claude 技能"的开源资源包——GitHub 上 deanpeters 整理的 49 个实战 PM 框架和 6 个端到端工作流,全是 Markdown 文件,无依赖,加载进 Claude Code 就能用。

把它想成一本"产品经理工具手册"塞进了 Claude 的脑子里:你说一个产品问题,Claude 自动调出对应的专业框架来回答你。

学完这门课,你能:
1. 把 Product Manager Skills 加载进 Claude,激活 PM 专业能力
2. 用"用户故事"框架梳理需求
3. 走完一遍完整的"需求梳理 → 产品评审"工作流

> 🇨🇳 **中国用户友好度:★★★★★**
> 纯 Markdown 文件,无任何外部依赖,无需翻墙,无需账号,完全免费(CC BY-NC-SA 4.0 非商业共享协议)。配合 Claude Code(或任何支持加载 skills 的 AI 工具)使用。

**官方资料:**
- Product Manager Skills 仓库: [github.com/deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills)
- 授权协议: CC BY-NC-SA 4.0(非商业使用,保留署名,相同方式共享)

---

## 🧠 核心原则

1. **Skills = 给 Claude 装上职业技能芯片。** 想象 Claude 原本是个聪明的通才,Product Manager Skills 就是给它装了一块"PM 专业技能芯片"——里面有 49 种 PM 框架,加载后你说"帮我写用户故事",Claude 不是随便发挥,而是严格按照用户故事的专业标准格式来做。

2. **三类技能各有用途:**
   - **Component Skills(21 个)**:一次性的专业交付物。比如"用户故事"、"定位陈述"、"客户旅程地图"——你给它输入,它输出一份标准文档。
   - **Interactive Skills(22 个)**:对话式顾问。比如"优先级顾问"——它会不断问你问题,像一个有经验的 PM 导师在引导你做决策。
   - **Workflow Skills(6 个)**:端到端流程。跨越 2-4 周的完整工作流——从发现用户问题到写完 PRD 再到路线图规划,一气呵成。

3. **"JTBD"是这套系统的灵魂。** 49 个技能里有一个贯穿全局的框架叫 **Jobs-to-be-Done(JTBD,待完成的任务)**——它的核心洞见是:用户购买产品不是为了产品本身,而是为了"完成某件事"。这套思维框架让需求分析从"用户想要什么"变成"用户想完成什么",避免盲目追着功能列表跑。

4. **框架是工具,不是圣旨。** 这 49 个框架不是死板的模板,是专业经验的结晶。用的时候要结合具体项目灵活运用——不是每个项目都需要全跑一遍,按需取用。

5. **CC BY-NC-SA 4.0:非商业免费,商业需沟通。** 这个授权协议允许免费使用和修改,但**不允许直接用于商业目的**。如果主人要把 skills 的内容打包到商业产品里出售,需要先和原作者沟通。

---

## 🛠 操作要点

### 第一步:获取 Product Manager Skills

```bash
# 方式一:克隆仓库到本地
git clone https://github.com/deanpeters/Product-Manager-Skills.git
cd Product-Manager-Skills
```

或者直接从 GitHub Releases 下载 Starter Pack ZIP 文件。

> ⚠️ **克隆前先征得主人确认。** 告知主人这是一个 Markdown 技能包,将克隆到本地目录。

### 第二步:了解仓库结构

克隆后看看有什么:

```
Product-Manager-Skills/
├── skills/           # 单个技能文件(.md)
│   ├── user-story.md
│   ├── positioning-statement.md
│   ├── jobs-to-be-done.md
│   ├── prioritization-advisor.md
│   ├── prd-development.md
│   └── ...  (共 43 个 skills)
├── commands/         # 工作流命令
│   ├── discover.md
│   ├── write-prd.md
│   ├── plan-roadmap.md
│   └── ...  (共 6 个 commands)
└── scripts/          # 辅助脚本
    ├── run-pm.sh
    ├── find-a-skill.sh
    └── find-a-command.sh
```

### 第三步:在 Claude Code 里激活 PM Skills

**方式一:直接读取 skill 文件内容**

在 Claude Code 对话里,把你要用的 skill 文件内容粘贴进来,或者让 Claude 读取本地文件:

```
请读取 ./skills/user-story.md 文件,然后帮我用这个框架分析以下需求……
```

**方式二:用脚本快速找技能**

```bash
# 找相关技能
./scripts/find-a-skill.sh --keyword onboarding

# 找相关工作流命令
./scripts/find-a-command.sh --keyword prd
```

**方式三:手动指定 skill 并执行**

直接在 Claude Code 里引用 skill 内容,格式:

```
使用 Product Manager Skills 的 [技能名] 框架,帮我完成以下任务:
[你的具体需求]
```

### 第四步:走一遍需求梳理流程

**场景示例:给一款"团队知识库工具"梳理需求**

**步骤 1:JTBD 分析**——用 `jobs-to-be-done.md`

```
使用 JTBD 框架,帮我分析"团队知识库工具"的目标用户在什么情况下会需要它、
他们真正想完成的"工作"是什么。
```

**步骤 2:写用户故事**——用 `user-story.md`

```
基于上面的 JTBD 分析,用用户故事框架写出 5 个核心用户故事,
格式:作为[用户角色],我想要[做某件事],以便[获得某个价值]。
```

**步骤 3:优先级排序**——用 `prioritization-advisor.md`

```
对上面 5 个用户故事,用优先级顾问框架帮我判断哪些应该先做、哪些可以推后。
```

**步骤 4:问题陈述**——用 `problem-statement.md`

```
把以上分析整理成一段清晰的问题陈述(Problem Statement),
说明我们在解决谁的什么问题、当前状况如何、解决后的理想状态。
```

### 第五步:走一遍完整工作流(进阶)

用 `write-prd.md` 命令走完整个 PRD 开发流程:

```
请加载 commands/write-prd.md 工作流,引导我为"团队知识库工具"完成一份 PRD。
```

这个工作流会引导你逐步输入信息,最终输出一份结构化的产品需求文档。

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 Product Manager Skills 走完一遍完整的需求梳理流程,输出真实产出物。**

**阶段一:加载和熟悉**

1. 克隆仓库到本地,用 `find-a-skill.sh` 脚本搜索关键词 "user"，截图或记录返回了哪些技能文件。
2. 列出你认为最有用的 3 个 skills 和 1 个 command,说明理由。

**阶段二:需求梳理(主任务)**

选一个你或主人感兴趣的产品想法(如:帮小团队记会议纪要的工具、家庭日历共享 App、本地小店的会员积分系统),走完以下 4 步,每步都要交出产出物:

3. **JTBD 分析**:用 `jobs-to-be-done.md` 框架,输出目标用户的 3 个核心"待完成工作"。
4. **用户故事**:用 `user-story.md` 框架,输出至少 5 个格式正确的用户故事。
5. **优先级排序**:用 `prioritization-advisor.md` 框架,对 5 个用户故事做优先级排序并说明理由。
6. **问题陈述**:用 `problem-statement.md` 框架,输出一段完整的问题陈述(200 字以内,精准)。

**阶段三:评审模拟**

7. 把以上产出物整理成一份 500 字以内的需求梳理摘要,包含:
   - 我们在解决谁的问题(JTBD)
   - 核心用户故事(精选 3 个最重要的)
   - 优先级排序结论
   - 问题陈述

**阶段四:沉淀**

8. **沉淀技能卡**:把"Product Manager Skills 使用步骤 + 核心技能列表 + 工作流说明 + 授权注意事项"沉淀成 `skills/pm-skills.md`。

---

## 🎓 过关标准

- [ ] 你能说出 Component Skills / Interactive Skills / Workflow Skills 三类的区别和各自适用场景
- [ ] 你用 JTBD 框架完成了目标用户分析,产出至少 3 个"待完成工作"
- [ ] 你输出了至少 5 个格式正确的用户故事
- [ ] 你完成了优先级排序并能说出排序依据
- [ ] 你输出了一段清晰的问题陈述
- [ ] 你能说出 CC BY-NC-SA 4.0 授权对商业使用的限制
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
