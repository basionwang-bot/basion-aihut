# 第 D02 课 · OpenUI:一句话造组件,所见即所得

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★ ｜ 源头:[github.com/wandb/openui](https://github.com/wandb/openui)(22.4k ⭐)

---

## 📖 你要学会什么

想象一个场景:你脑子里有一个登录卡片的样子——白色圆角卡片、左边放 Logo、右边是输入框——但你不会写代码,也不想等设计师。你能不能直接用一句话说出来,然后立刻看到它长什么样?

**OpenUI** 就是干这个的。它是 Weights & Biases(W&B)开源的 UI 组件生成器:你用自然语言描述想要的组件,它实时渲染出来让你看,不满意就继续改,满意了导出成 React、Vue 或 HTML 代码。就像有个前端开发住在网页里,你说一句话他立刻动手。

**最大的亮点:支持 Ollama 本地模型,完全不用翻墙、不产生 API 费用。** 这对中国用户来说极度友好。

学完这一课,你能:
1. 用 Docker 或源码把 OpenUI 跑起来(包括接 Ollama 本地模型)
2. 用一句中文或英文描述,生成一个真实可渲染的 UI 组件
3. 把生成的组件导出成可用的代码框架(React/Vue/HTML)

**官方资料:**
- 项目主页: [github.com/wandb/openui](https://github.com/wandb/openui)
- 在线体验: [openui.fly.dev](https://openui.fly.dev)(需要海外网络)

---

## 🧠 核心原则

1. **OpenUI 的核心循环:描述 → 渲染 → 改 → 渲染。** 不像传统工具"生成一次就完事",OpenUI 支持你反复迭代——"把按钮改成蓝色"、"加一个忘记密码链接"——每次改动实时反映在预览里。这才是"所见即所得"的精髓。

2. **本地模型 vs 云端模型:两条路都通。** 有 API key(OpenAI/Anthropic)就走云端,效果更好;没有或不想花钱就跑 Ollama 本地模型,完全离线,零费用。中国用户优先考虑 Ollama 路线。

3. **生成的是组件代码,不是整个应用。** OpenUI 聚焦在单个 UI 组件(一个登录卡片、一个导航栏、一个数据表格),生成的代码是组件片段,需要你自己把它接进项目里。

4. **涉及 API key 的,先问主人。** 如果选择云端模型,API 有费用;如果选 Ollama,只需要本地算力,不需要问主人拿 key。

---

## 🛠 操作要点

### 路线一:Ollama 本地模型(国内用户推荐,不翻墙)

**第一步:装 Ollama 并拉模型**

```bash
# 安装 Ollama(访问 ollama.ai 下载,或用命令行)
# macOS/Linux:
curl -fsSL https://ollama.ai/install.sh | sh

# 拉一个支持视觉/代码的模型(体积约 4-8GB,先征得主人确认)
ollama pull llava
# 或者拉 qwen2.5-coder 等国产代码模型
ollama pull qwen2.5-coder:7b
```

> ⚠️ **安装前先征得主人确认**:Ollama 会下载几 GB 的模型文件,需要磁盘空间和下载时间。

> 🇨🇳 **中国用户提示:** Ollama 官网 [ollama.ai](https://ollama.ai) 国内可正常访问;模型文件从 Hugging Face 拉取,如遇超时可使用国内镜像(如 hf-mirror.com)或告知主人。

**第二步:用 Docker 启动 OpenUI(接 Ollama)**

```bash
docker run --rm --name openui -p 7878:7878 \
  -e OLLAMA_HOST=http://host.docker.internal:11434 \
  ghcr.io/wandb/openui
```

浏览器打开 `http://localhost:7878`,在设置里选择 Ollama 模型即可。

---

### 路线二:Docker + 云端 API(效果更好)

```bash
export OPENAI_API_KEY=sk-你的key
# 或
export ANTHROPIC_API_KEY=你的key

docker run --rm --name openui -p 7878:7878 \
  -e OPENAI_API_KEY \
  -e ANTHROPIC_API_KEY \
  ghcr.io/wandb/openui
```

> 🇨🇳 **中国用户提示:** OpenAI/Anthropic API 需要代理或国内中转服务才能使用。

---

### 路线三:源码启动(开发者用)

```bash
git clone https://github.com/wandb/openui
cd openui/backend
uv sync --frozen --extra litellm
source .venv/bin/activate
export OPENAI_API_KEY=xxx   # 或设置 OLLAMA_HOST
python -m openui
```

---

### Docker Compose(最省心)

```bash
git clone https://github.com/wandb/openui
cd openui
docker-compose up -d
# 如果用 Ollama,拉模型:
docker exec -it openui-ollama-1 ollama pull llava
```

访问 `http://localhost:7878`。

---

### 使用流程

1. 打开 `http://localhost:7878`
2. 左上角齿轮图标 → 设置 → 选择模型(Ollama 模型会自动出现)
3. 在输入框里描述你想要的组件,比如:
   - `"一个登录卡片,白色背景,圆角,有邮箱和密码输入框,还有一个蓝色登录按钮"`
   - `"A product card with image on top, title, price, and add to cart button"`
4. 点击生成,实时看预览
5. 不满意?直接说:"把按钮改成红色"、"加一个注册链接"
6. 满意后点导出,选择 React / Vue / HTML 格式

### 支持的输出格式

| 格式 | 用途 |
|------|------|
| HTML | 直接在浏览器运行 |
| React | 接进 React 项目 |
| Vue | 接进 Vue 项目 |
| Web Components | 框架无关,通用 |
| Svelte | 接进 Svelte 项目 |

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 OpenUI 生成一个"登录卡片"组件,完成迭代修改,导出代码并在浏览器中展示。**

> ⚠️ **安全边界:安装 Ollama 或 Docker 前先征得主人确认。**

**步骤:**

1. **选择路线**:告知主人你打算用 Ollama 本地模型还是云端 API(推荐 Ollama,无费用)。等主人确认后继续。

2. **启动服务**:按上方任一路线把 OpenUI 跑起来,截图证明 `http://localhost:7878` 可访问。

3. **生成登录卡片**:输入以下描述(或用中文改写):
   > `"一个简洁的登录卡片:白色背景,圆角阴影,顶部有产品 Logo 占位符,下方是邮箱输入框、密码输入框,底部是一个蓝色登录按钮,还有一行'没有账号?立即注册'的文字链接"`
   截图保存生成结果。

4. **迭代修改**:在原基础上说一句话修改它(例如:"把登录按钮改成绿色,加一个记住我的复选框"),截图保存修改后效果。

5. **导出代码**:选择 HTML 格式导出,把代码保存成 `login-card.html`,在浏览器里打开,截图。

6. **写复盘报告(≥80 字)**:Ollama 还是云端模型?生成质量怎样?迭代体验如何?

7. **沉淀技能卡**:把"启动命令 + 模型选择 + 使用流程 + 导出方式"沉淀成 `skills/openui.md`。

**交证据清单:**
- [ ] OpenUI 启动成功的截图(`http://localhost:7878`)
- [ ] 登录卡片第一次生成的截图
- [ ] 迭代修改后的截图
- [ ] `login-card.html` 在浏览器里的截图
- [ ] 复盘报告(写在报告卡里)
- [ ] 技能卡文件 `skills/openui.md`

---

## 🎓 过关标准

- [ ] 你能说出 OpenUI 和 screenshot-to-code(D01)的核心区别:一个是从截图还原,一个是从描述生成
- [ ] 你让 OpenUI 成功跑起来——用 Ollama 本地模型或云端 API 均可——并截图为证
- [ ] 你用自然语言描述生成了一个真实可渲染的 UI 组件
- [ ] 你完成了至少一次迭代修改(在原组件上增加/改变某个元素)
- [ ] 你导出了 HTML 格式的代码并在浏览器里验证可运行
- [ ] 你能说出 Ollama 路线的优势(不翻墙、无费用)以及如何在 Docker 启动时接入 Ollama
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按[校规第四条](../../校规.md)的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
