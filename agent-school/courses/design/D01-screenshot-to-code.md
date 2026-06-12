# 第 D01 课 · screenshot-to-code:把截图变网页

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★ ｜ 源头:[github.com/abi/screenshot-to-code](https://github.com/abi/screenshot-to-code)(72.9k ⭐)

---

## 📖 你要学会什么

你见过这样的场景吗:设计师甩过来一张网页截图,说"就照这个做"——然后你要自己量间距、猜颜色、手写每一行 CSS?这种活儿既枯燥又容易出错。

**screenshot-to-code** 就是来干掉这个苦差事的。它背后接着 GPT-4 Vision 或 Claude Opus,看一眼你的截图,直接吐出可以运行的 Tailwind/HTML/React 代码——就像给你雇了一个眼神贼准、动手又快的前端学徒。

学完这一课,你能:
1. 在本地把 screenshot-to-code 跑起来
2. 上传一张网页截图,拿到能改的 HTML + Tailwind 代码
3. 知道背后调了哪个 AI API、怎么换模型

**官方资料:**
- 项目主页: [github.com/abi/screenshot-to-code](https://github.com/abi/screenshot-to-code)
- 在线体验(需海外): [screenshottocode.com](https://screenshottocode.com)

---

## 🧠 核心原则

1. **截图就是"设计稿的照片",AI 是"看图说话的前端"。** 你不需要导出 Figma 源文件,不需要标注稿——一张截图就够了。AI 会识别布局、配色、字体大小,然后用代码把它复原出来。当然,复原不是 100% 像素级精准,而是"够用、可改"的起点。

2. **后端和前端是两个进程,分开跑。** 后端(Python/FastAPI)负责接收截图、调 AI API、流式返回代码;前端(React/Vite)负责界面和实时展示。两个进程要同时开着,缺一不可。

3. **AI API key 是这个工具的"燃料",没有就跑不动。** 支持 OpenAI(GPT-4V)、Anthropic(Claude Opus)、Google Gemini。三选一就够,不需要全装。

4. **涉及 API key 的事,先征得主人确认。** API key 有费用,接入前要问清主人用哪家、谁来出钱。

5. **生成的代码是"起点",不是"终点"。** 生成出来的 Tailwind + HTML 需要人工检查、微调,尤其是交互逻辑和动态数据。把它当第一稿,而不是交付稿。

---

## 🛠 操作要点

### 前置条件

| 需要 | 说明 |
|------|------|
| Python 3.11+ | 后端环境 |
| Node.js 18+ / yarn | 前端环境 |
| Poetry | Python 包管理器 |
| AI API key(三选一) | OpenAI / Anthropic / Google Gemini |

> 🇨🇳 **中国用户重要提示:**
> - OpenAI API 在国内需要代理或中转服务(如 API2D、One API、CloseAI 等国内中转平台),可在 `backend/.env` 中设置 `OPENAI_BASE_URL=https://你的中转地址/v1`。
> - Anthropic API 同样需要代理或使用第三方国内中转。
> - Google Gemini API 在某些地区受限,使用前确认网络情况。
> - **安装前先征得主人确认**使用哪家 API、由谁承担费用。

### 拉代码、装依赖

```bash
# 第一步:克隆仓库
git clone https://github.com/abi/screenshot-to-code.git
cd screenshot-to-code

# 第二步:写入 API key(至少填一个)
# 进入 backend 目录
cd backend
cp .env.example .env  # 如果没有 .env.example 就手动创建 .env
```

编辑 `backend/.env`,填入你的 key:

```
# 至少填一个
OPENAI_API_KEY=sk-你的key
ANTHROPIC_API_KEY=你的anthropic-key
GEMINI_API_KEY=你的gemini-key

# 中国用户:如需中转 OpenAI,加这行
OPENAI_BASE_URL=https://你的中转地址/v1
```

```bash
# 第三步:安装 Python 依赖
cd backend   # 如果还没在这个目录
poetry install

# 第四步:启动后端(保持这个终端开着)
poetry run uvicorn main:app --reload --port 7001
```

```bash
# 开一个新终端:安装前端依赖并启动
cd screenshot-to-code/frontend
yarn
yarn dev
```

### Docker 一键启动(更简单)

如果嫌上面步骤麻烦,可以用 Docker:

```bash
# 在项目根目录
echo "OPENAI_API_KEY=sk-你的key" > .env
docker-compose up -d --build
```

启动后访问 `http://localhost:5173`。

### 使用流程

1. 浏览器打开 `http://localhost:5173`
2. 把网页截图拖进去(或点击上传)
3. 右上角选择目标技术栈:HTML + Tailwind / React + Tailwind / Vue + Tailwind / Bootstrap 等
4. 点击生成,看着代码实时流出来
5. 右侧即时预览效果;左侧可以切换"代码视图"复制代码

### 支持的技术栈

| 选项 | 适用场景 |
|------|----------|
| HTML + Tailwind | 最通用,直接能在浏览器跑 |
| React + Tailwind | 要接进 React 项目 |
| Vue + Tailwind | 要接进 Vue 项目 |
| Bootstrap | 偏好 Bootstrap 生态 |
| HTML + CSS | 不想用 Tailwind 的纯 CSS 版 |

### 支持的 AI 模型

| 模型 | API key 来源 | 中国可用性 |
|------|-------------|-----------|
| GPT-4.5 / GPT-4o | OpenAI | 需中转或代理 |
| Claude Opus 4 | Anthropic | 需中转或代理 |
| Gemini 3 Flash/Pro | Google | 部分地区受限 |

---

## 📝 毕业测验(必须真做,交证据)

**任务:给一张真实网页截图,用 screenshot-to-code 还原成可运行的 HTML + Tailwind 代码,并记录全过程。**

> ⚠️ **安全边界:本测验涉及 API 费用和网络配置,全程先征得主人确认再动手。**

**步骤:**

1. **征得主人确认**:告知主人你要安装 screenshot-to-code、需要使用哪家 AI API(及产生费用),等主人同意后再继续。

2. **准备截图**:截取任意一个公开网页的截图(推荐截一个简单的登录页、产品卡片或导航栏——区域不用太大,200×400 像素以上就够)。

3. **完成安装**:按照"操作要点"把后端和前端都跑起来,截图证明服务正在运行(浏览器打开 `http://localhost:5173` 的截图)。

4. **生成代码**:把截图上传,选择 HTML + Tailwind 技术栈,等代码生成完毕。保存生成的完整 HTML 代码。

5. **验证效果**:把生成的 HTML 代码存成一个 `.html` 文件,在浏览器里打开,截图对比"原始截图"和"还原页面"的相似度。

6. **写复盘报告(≥100 字)**:生成效果如何?哪里复原准确?哪里需要人工调整?用了哪个模型?

7. **沉淀技能卡**:把"安装步骤 + .env 配置 + 启动命令 + 技术栈选项"沉淀成 `skills/screenshot-to-code.md`。

**交证据清单:**
- [ ] 后端/前端启动成功的截图
- [ ] 上传截图并生成代码的界面截图
- [ ] 还原后的 HTML 文件在浏览器中的截图
- [ ] 复盘报告(写在报告卡里)
- [ ] 技能卡文件 `skills/screenshot-to-code.md`

---

## 🎓 过关标准

- [ ] 你能说出 screenshot-to-code 的工作原理:截图 → AI Vision → 代码生成,以及后端和前端各自的职责
- [ ] 你完成了后端 `.env` 配置,知道至少一家 API key 从哪里获取、如何在国内使用(中转或代理)
- [ ] 你让服务成功跑起来(后端 7001 端口 + 前端 5173 端口)并截图为证
- [ ] 你上传了一张真实截图,拿到了可运行的 HTML + Tailwind 代码
- [ ] 你能说出支持的 5 种以上技术栈名称和各自适用场景
- [ ] 你写了复盘报告,评估了生成质量并指出了哪里需要调整
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按[校规第四条](../../校规.md)的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
