# 第 B01 课 · bolt.diy:一句话造一个全栈应用

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★★ ｜ 源头:stackblitz-labs/bolt.diy · [github.com/stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy)

---

## 📖 你要学会什么

想象一下——主人说一句"帮我做一个记账小工具,前端漂亮一点,能加删改查",然后你眼睁睁看着代码从无到有生成出来,页面直接跑起来,还能在浏览器里实时预览。

这件事,**bolt.diy** 能做到。

bolt.diy 是 bolt.new 的完全开源版本(GitHub 约 19.5k ★),主要区别是:**你自己选用哪个 AI 模型**。闭源的 bolt.new 帮你托管好了一切,而 bolt.diy 把整个引擎给你,模型换成你自己的 key,本地跑,不交月费。

学完这门课,你能:
1. 在本地把 bolt.diy 跑起来
2. 配上国产模型(通义 Qwen、智谱 GLM、DeepSeek),不需要科学上网
3. 让主人说一句话,生成一个可跑的小应用并本地预览

> 🇨🇳 **中国用户友好度:★★★★**
> bolt.diy 本身完全开源可本地运行。核心挑战是 **AI 模型 API**——默认配置里大部分是海外模型(OpenAI、Anthropic 等,需要海外账号+信用卡)。但 bolt.diy 支持**兼容 OpenAI 接口的任意自定义 endpoint**,因此**通义千问 / 智谱 GLM / DeepSeek** 这类国内可直接开通的模型完全可以接入,这门课会详细讲。

**官方资料:**
- bolt.diy 仓库: [github.com/stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy)
- stable 分支(推荐新手使用): `git clone -b stable https://github.com/stackblitz-labs/bolt.diy.git`

---

## 🧠 核心原则

1. **bolt.diy = 浏览器里的全栈 IDE + AI 编程对话框。** 把它想成一个在浏览器里运行的"电脑工厂"——左边是聊天窗口,右边是实时预览,中间是 AI 写代码、跑命令、调试 bug。你不用摸任何代码编辑器,主人说需求,AI 在"工厂里"直接造好交出来。

2. **模型是可换的插头。** bolt.diy 内置了 19+ 个模型接口(OpenAI、DeepSeek、Moonshot/Kimi、Qwen 等)。就像台灯的插头——不管你家墙上是哪种插座,换个转接头就能用。中国用户换成国内模型 API,其它功能完全不变。

3. **"兼容 OpenAI 接口"是通行证。** 国内主流模型——通义千问(阿里云)、智谱 GLM(智谱 AI)、DeepSeek——都提供兼容 OpenAI 格式的 API。bolt.diy 的自定义 provider 功能可以接受任意这类 endpoint。只要 API 格式对,就能接。

4. **本地预览 ≠ 上线部署。** bolt.diy 生成的应用可以在本地浏览器里跑,但"本地跑得好"和"对外上线"是两码事。**在主人说"上线"之前,不能自行部署到任何公网服务器。** 见安全红线。

5. **生成的代码是真实代码,不是玩具。** 输出的是可以直接导出、继续开发的 React/Vue/HTML/Node.js 代码——你可以把它下载下来,放到任何你喜欢的地方继续改。

---

## 🛠 操作要点

### 第一步:克隆并安装

```bash
# 克隆 stable 分支(比 main 更稳定,新手推荐)
git clone -b stable https://github.com/stackblitz-labs/bolt.diy.git
cd bolt.diy

# bolt.diy 使用 pnpm 管理依赖,先全局装 pnpm
npm install -g pnpm

# 安装项目依赖
pnpm install
```

> ⚠️ **安装前先征得主人确认。** `npm install -g pnpm` 是全局安装;`pnpm install` 会拉取大量依赖包,需要网络,国内可能较慢——告知主人。

### 第二步:配置模型 API key

```bash
# 复制环境变量模板
cp .env.example .env.local
```

然后用编辑器打开 `.env.local`,填入你要用的模型 key。

**国内可直接使用的模型(推荐):**

```bash
# DeepSeek(国内直连,注册送免费额度)
DEEPSEEK_API_KEY=your_deepseek_key_here

# Moonshot / Kimi(国内直连)
MOONSHOT_API_KEY=your_moonshot_key_here
```

**通义千问 / 智谱 GLM(通过 OpenAI 兼容接口接入):**

进入应用后,在界面的 ⚙️ **设置 → Providers** 里,找到 "OpenAI Like" 或自定义 Provider 选项,填入:
- **Base URL**:通义千问填 `https://dashscope.aliyuncs.com/compatible-mode/v1`(阿里云百炼);智谱填 `https://open.bigmodel.cn/api/paas/v4/`
- **API Key**:对应平台申请的 key
- **Model Name**:如 `qwen-plus`、`glm-4-flash`

> 🇨🇳 **国内模型开通渠道:**
> - DeepSeek: [platform.deepseek.com](https://platform.deepseek.com) — 国内手机注册,无需翻墙
> - Moonshot/Kimi: [platform.moonshot.cn](https://platform.moonshot.cn) — 国内手机注册
> - 通义千问: [dashscope.aliyun.com](https://dashscope.aliyun.com) — 阿里云账号,支持支付宝
> - 智谱 GLM: [bigmodel.cn](https://open.bigmodel.cn) — 国内手机注册,有免费额度

### 第三步:启动应用

```bash
pnpm run dev
```

启动后浏览器访问 `http://localhost:5173`,看到聊天界面就说明成功了。

### 第四步:说一句话,造一个应用

在聊天框里输入你的需求,比如:

```
帮我做一个每日任务清单应用:可以添加任务、打勾完成、删除任务,
界面简洁美观,用蓝白色调,不需要后端,数据存在浏览器里就行。
```

AI 会开始写代码,右侧预览窗口会实时更新——几十秒内你就能看到一个可以点击操作的真实网页。

### Docker 方式(可选,适合不想装 Node 环境的主人)

```bash
cp .env.example .env
cp .env.example .env.local
# 先在 .env.local 填好 API key
pnpm run dockerbuild
docker compose --profile development up
```

> ⚠️ **Docker 方式需要主人已安装 Docker Desktop,启动前先确认。**

### ⚠️ 安全红线

**无代码/AI工具一旦"连真实数据库、配生产key、对外部署"就从玩具变真系统。三件事——连真实数据、暴露上线、产生账单——都要明确"先问主人再做":**

```
□ 安装依赖(pnpm install)——先征得主人确认
□ 填写 API key 到 .env.local——告知主人这是你自己的 key,产生的调用费用由主人账号承担
□ 生成的应用"本地预览"没问题,但要"部署上线"——必须先问主人
□ 如果应用涉及用户数据、支付、登录——先问主人再决定是否接真实数据库或上线
□ 国内 API 的免费额度用完后会产生账单——告知主人注意额度提醒
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 bolt.diy + 国产模型,生成一个能跑的小工具,本地预览截图作为证据。**

**阶段一:环境配置(先做)**

1. 把 bolt.diy 克隆并启动,截图显示浏览器里出现了聊天界面(`http://localhost:5173`)。
2. 在 ⚙️ 设置里配置一个国产模型 API(DeepSeek / Kimi / 通义千问 / 智谱 GLM 任选一),截图显示模型已选中。
3. 用一句话描述你选了哪个模型、为什么选它(开通门槛、免费额度、速度等)。

**阶段二:生成应用(主人确认 API key 已填好后)**

> ⚠️ **这个阶段会消耗 API 额度,先告知主人再执行。**

4. 用自然语言描述一个小工具需求,发给 AI 生成。需求示例(可自选):
   - 每日习惯打卡表
   - 简单的 BMI 计算器
   - 英文单词随机抽背工具

5. 截图"生成完成后右侧预览窗口"的状态,证明应用可以在浏览器里交互。

6. 用自己的话描述:这个工具生成了哪些文件?它是什么技术栈?

**阶段三:沉淀**

7. **沉淀技能卡**:把"bolt.diy 启动步骤 + 国产模型接入配置 + 安全红线"沉淀成 `skills/bolt-diy.md`。

---

## 🎓 过关标准

- [ ] 你能说出 bolt.diy 和 bolt.new 的核心区别(开源自建 vs. 闭源托管)
- [ ] 你成功配置了至少一个国内可用的模型 API,并能说出它的开通渠道
- [ ] 你用自然语言生成了一个可在浏览器中交互的小应用,有截图证据
- [ ] 你能解释"本地预览"和"对外上线"的区别,并知道后者要先问主人
- [ ] 你完成了安全红线清单 5 条的逐项确认
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
