# 第 B07 课 · PRD Creator:把一个想法变成一份专业产品需求文档

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、B06(PM Skills)建议先读 ｜ 难度:★★ ｜ 源头:AungMyoKyaw/prd-creator · [github.com/AungMyoKyaw/prd-creator](https://github.com/AungMyoKyaw/prd-creator) + TechNomadCode/AI-Product-Development-Toolkit · [github.com/TechNomadCode/AI-Product-Development-Toolkit](https://github.com/TechNomadCode/AI-Product-Development-Toolkit)

---

## 📖 你要学会什么

你有个想法:"做一个帮小店管会员积分的微信小程序"。但想法和产品之间有一道鸿沟——你说不清楚:它到底要做什么功能?技术用什么实现?用户界面是什么逻辑?开发团队看到什么才能动工?

这道鸿沟的解法叫 **PRD(Product Requirements Document,产品需求文档)**。PRD Creator 是一个用 AI 一键生成专业 PRD 的开源工具(GitHub 约 25 ★),三步走:填想法 → AI 生成 → 导出 Markdown。

搭配 TechNomadCode 的 AI Product Development Toolkit(一套 Prompt 模板库),你还可以在 PRD 基础上继续生成 UX 规格、MVP 计划、测试方案——把想法做成产品的完整流程。

学完这门课,你能:
1. 在本地把 PRD Creator 跑起来(或用 AI 直接调用模板)
2. 把一个产品想法生成一份包含 9 个章节的完整 PRD
3. 导出 Markdown 文件交给开发团队

> 🇨🇳 **中国用户重要提示:★★★**
> PRD Creator 原版默认使用 **Google Gemini API**——需要海外账号且国内无法直连。**本课会教你如何替换成国产模型(DeepSeek / 通义千问),或绕过 PRD Creator 直接用模板库配合国产模型完成同等任务。** 对于国内用户,推荐优先使用"模板库 + 国产模型"方案。

**官方资料:**
- PRD Creator 仓库: [github.com/AungMyoKyaw/prd-creator](https://github.com/AungMyoKyaw/prd-creator)
- AI Product Development Toolkit: [github.com/TechNomadCode/AI-Product-Development-Toolkit](https://github.com/TechNomadCode/AI-Product-Development-Toolkit)

---

## 🧠 核心原则

1. **PRD = 产品的"建筑蓝图"。** 盖楼之前得有蓝图,施工队才知道建几层、每层什么功能、用什么材料。PRD 就是产品的蓝图——开发工程师、UI 设计师、测试工程师读完这份文档,就知道要做什么。没有 PRD 就开工,大概率会"建到一半发现方向错了"。

2. **AI 生成 PRD 的核心价值是"搭架子"。** AI 生成的 PRD 不是最终版——它帮你在 15 分钟内搭好一个结构完整的草稿(9 个章节都有内容),你再在草稿上修改细节,比从空白文档开始快 10 倍。

3. **9 个章节覆盖了产品决策的主要维度。** PRD Creator 生成的 PRD 包含:产品概述、目标用户、核心功能、用户故事、技术栈方案、设计约束、成功指标、里程碑计划、风险与依赖。缺一个章节,产品决策就有盲区。

4. **Gemini ≠ 唯一选择。** PRD Creator 原版绑定 Google Gemini,但"用 AI 生成 PRD"这件事的核心是 Prompt——任何好的对话式 AI 都能完成相同任务。换成国产模型,效果相同甚至更好(中文理解更准)。

5. **PRD 是起点,不是终点。** 写完 PRD 之后,用 AI Product Development Toolkit 里的后续模板,可以继续生成 UX 规格书(UX User Flow)、MVP 开发计划、测试方案……形成完整的产品开发链路。

---

## 🛠 操作要点

### 方案一:本地跑 PRD Creator 原版(需要 Gemini API Key)

> ⚠️ **Gemini API 国内限制说明:** Google Gemini API 在中国大陆无法直连,需要科学上网 + Google 账号。如果主人有条件使用,按以下步骤操作。如没有,直接跳到**方案二**。

```bash
# 克隆仓库
git clone https://github.com/AungMyoKyaw/prd-creator.git
cd prd-creator

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

启动后访问 `http://localhost:3000`(或 Next.js 默认端口)。

点 ⚙️ 设置,填入 Gemini API Key(从 [aistudio.google.com](https://aistudio.google.com) 获取,需 Google 账号 + 科学上网)。

> ⚠️ **安装前先征得主人确认。** `npm install` 会拉取依赖包。

### 方案二:直接用模板库 + 国产模型(中国用户推荐)

这个方案不需要部署任何软件,只需要你有一个国产模型的 API 或网页版(DeepSeek、通义千问、智谱 GLM 等均可)。

**第一步:获取 AI Product Development Toolkit 模板**

```bash
git clone https://github.com/TechNomadCode/AI-Product-Development-Toolkit.git
cd AI-Product-Development-Toolkit
```

**第二步:用 PRD 模板生成需求文档**

打开 `PRD.md` 文件(或对应的 prompt 模板文件),把模板内容粘贴到你的 AI 对话框(Claude、DeepSeek、通义千问等均可),然后填入你的产品想法:

使用格式:
```
[粘贴模板内容]

我的产品想法是:
[用 200-500 字描述你的产品想法,包括:目标用户是谁、解决什么问题、大概有哪些功能]
```

AI 会按照模板引导你完成 PRD 的各个章节。

**第三步:后续生成 UX 规格和 MVP 计划**

PRD 生成后,用 `UX-User-Flow.md` 模板继续:
```
[粘贴 UX-User-Flow 模板]
这是我的 PRD:[粘贴上一步生成的 PRD]
请基于 PRD 生成 UX 规格说明。
```

接着用 `MVP-Concept.md` 生成 MVP 范围定义:
```
[粘贴 MVP-Concept 模板]
这是我的 PRD:[粘贴 PRD]
请帮我定义一个聚焦的 MVP 范围。
```

### PRD 的 9 个章节说明

| 章节 | 内容 | 为什么重要 |
|------|------|-----------|
| 产品概述 | 一句话说清楚是什么 | 所有人对齐认知的起点 |
| 目标用户 | 谁会用它 | 避免"为所有人设计=为没有人设计" |
| 核心功能 | 做什么不做什么 | 防止需求无限膨胀 |
| 用户故事 | 用户视角的使用场景 | 让工程师理解"为什么这个功能" |
| 技术栈方案 | 用什么技术实现 | 工程师评估可行性的依据 |
| 设计约束 | 不能做什么、必须满足什么 | 发现隐藏的限制条件 |
| 成功指标 | 怎么算"做成功了" | 有了它才能客观评价结果 |
| 里程碑计划 | 什么时候交付什么 | 让项目有节奏推进 |
| 风险与依赖 | 什么可能让它失败 | 提前预判和应对 |

### ⚠️ 安全红线

**无代码/AI工具一旦"连真实数据库、配生产key、对外部署"就从玩具变真系统。三件事——连真实数据、暴露上线、产生账单——都要明确"先问主人再做":**

```
□ 填入 API key(Gemini / DeepSeek / 通义)——告知主人这会消耗 API 额度
□ 用 AI 生成 PRD——文档里如涉及真实业务数据、竞品信息——确认主人允许发送给 AI
□ 把 PRD 文档分享给开发团队——确认主人已审阅内容,同意共享
□ 基于 PRD 开始实际开发——这超出了"写文档"范畴,先确认主人已批准进入开发阶段
□ 在 PRD 里涉及外部 API 或第三方服务的集成计划——先确认服务条款和费用
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:把一个产品想法变成一份完整的 PRD,并导出 Markdown 文档。**

**阶段一:选定工具方案**

1. 告知主人你打算用哪个方案(方案一:PRD Creator + Gemini;方案二:AI Product Development Toolkit + 国产模型)。说明理由。获得主人确认后进行。

**阶段二:生成 PRD(告知主人会消耗 API 额度后执行)**

> ⚠️ **先告知主人会消耗 API 额度,确认后再执行。**

2. 选一个产品想法(可以是:帮本地餐厅做自助点餐小程序、家庭共享购物清单 App、个人知识管理工具、团队每日站会记录工具——任选或自拟)。
3. 用你选择的方案,生成完整 PRD。PRD 必须包含完整的 9 个章节(如果使用 Toolkit 模板,逐章完成)。
4. 把 PRD 导出为 Markdown 格式文件。截图或展示最终 Markdown 文件的内容(前 30 行即可)。

**阶段三:评审 PRD**

5. 自己审阅生成的 PRD,找出 2-3 处"AI 生成得比较泛、需要补充具体细节"的地方,手动完善它们。截图显示你做的修改。
6. 用一句话描述:这份 PRD 中"成功指标"章节设定了什么——你觉得这个指标合理吗?为什么?

**阶段四:后续延伸(可选)**

7. (可选)用 `UX-User-Flow.md` 或 `MVP-Concept.md` 模板,继续生成 UX 规格或 MVP 范围定义文档。

**阶段五:沉淀**

8. **沉淀技能卡**:把"PRD Creator 使用步骤 + AI Product Development Toolkit 工作流 + PRD 9 章节说明 + 国产模型替代方案 + 安全红线"沉淀成 `skills/prd-creator.md`。

---

## 🎓 过关标准

- [ ] 你能说出 PRD 的 9 个章节分别是什么,以及每个章节的核心作用
- [ ] 你选择了合适的工具方案并能说明原因(Gemini 方案 vs. 国产模型方案的取舍)
- [ ] 你生成了一份包含完整章节的 PRD,有导出的 Markdown 文件或截图证据
- [ ] 你对生成的 PRD 做了人工审阅和补充修改,能说出改了什么
- [ ] 你能说出"AI 生成 PRD"的价值(搭架子)和局限(细节需要人审)
- [ ] 你完成了安全红线清单 5 条的逐项确认
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
