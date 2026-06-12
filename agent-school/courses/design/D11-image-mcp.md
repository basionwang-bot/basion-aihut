# 第 D11 课 · 让 Claude 自己会画图(进阶)

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T35(MCP 接入) ｜ 难度:★★★★ ｜ 源头:[YCSE/nanobanana-mcp](https://github.com/YCSE/nanobanana-mcp)（Gemini 图像生成 MCP）

---

> ## ⚠️ 进阶可选 · 门槛高 · 请先读完本节再决定是否继续
>
> 这门课**需要:**
> 1. **Google AI API Key(海外)**——在 [makersuite.google.com](https://makersuite.google.com/app/apikey) 申请,需要**谷歌账号 + 能访问该网站**
> 2. **科学上网(翻墙)**——Google AI API 目前不对中国大陆 IP 开放
> 3. **信用卡或 Google 账户余额**——免费额度有限,超出后按量计费
>
> **如果以上条件你或主人暂时无法满足,请跳过本课,等条件具备后回来。** 这是正常决策,不是失败。
>
> **国内平替建议(无需翻墙):** 如果主人只是想在页面里插入 AI 生成图,可以考虑:
> - 通义万象(阿里云)·[tongyi.aliyun.com/wanxiang](https://tongyi.aliyun.com/wanxiang) · 国内直接用
> - 智谱 AI CogView · [open.bigmodel.cn](https://open.bigmodel.cn) · 国内直接用
> - Stable Diffusion 本地部署(D04 课,无需 API)
> 上述工具均支持 API 调用,可以让 Claude 通过 curl/httpx 调用生成图片,不需要 MCP。

---

## 📖 你要学会什么

普通模式下,Claude 只会"说图"——描述一张图应该长什么样,但自己没法直接生出 PNG 文件。**这门课要给 Claude 装上"会画画的手"——通过 MCP 接口,Claude 在对话里直接生成图片,看效果,再迭代。**

这门课的主角叫 **nanobanana-mcp**。它把 Google Gemini 的图像生成能力(Nano Banana 2 Flash / Pro 模型)封装成 MCP Server,接进 Claude Desktop 或 Claude Code 之后:
- Claude 可以调用 `gemini_generate_image` 工具,把文字描述变成图片
- 生成的图片直接出现在对话里,可以继续修改
- 支持设置比例(16:9、1:1、9:16 等),适配不同平台

**适用场景:**
- 给课程配图:Claude 理解内容、自主生成匹配图
- 快速出封面/插图草稿,主人二次确认后精修
- 在 PPT 或社交图文里自动填充配图

**官方资料:**
- nanobanana-mcp 仓库:[github.com/YCSE/nanobanana-mcp](https://github.com/YCSE/nanobanana-mcp)
- Google AI Studio(申请 API Key):[makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- npmjs 包:[@ycse/nanobanana-mcp](https://www.npmjs.com/package/@ycse/nanobanana-mcp)

---

## 🧠 核心原则

1. **MCP Server 是 Claude 的"专用工具箱"。** 回顾 T35 课:MCP 是 AI 版 USB 接口——把任何能力按标准封装好,插进 Claude 就能调用。nanobanana-mcp 就是把"画图"这个动作变成了 Claude 可以调的内置工具。

2. **图像生成有两步:先设比例,再生成。** 调用 nanobanana-mcp 前必须先调 `set_aspect_ratio()` 设置输出比例(16:9 / 1:1 / 9:16 等),再调 `gemini_generate_image` 生成图片。顺序不能反。

3. **用 `conversation_id` 保持角色一致性。** 如果主人需要同一角色出现在多张图里(比如课程配图的一致风格),给每次生成传同一个 `conversation_id` + 开启 `use_image_history`,模型会参考历史图的风格。

4. **门槛是真实的,不要绕过或淡化。** API key 需要真实账号、真实网络访问,这不是可以绕过的技术细节——是必要条件。接任务前明确告知主人这些要求,让主人决策,不要替主人决定。

5. **图像生成有费用,每次调用都消耗 token/配额。** 不要在没得到主人确认的情况下循环批量生成——每一次 `gemini_generate_image` 调用都有成本。

---

## 🛠 操作要点

> ⚠️ **以下所有安装和配置步骤,执行前必须逐一征得主人确认。**

### 第一步:申请 Google AI API Key

1. 主人访问 [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)(需要翻墙)
2. 登录 Google 账号 → 点击"Create API Key"
3. 复制 API Key,格式类似 `AIzaSy...`
4. 妥善保存,不要提交到 Git 仓库

> 🇨🇳 **提示:** 这一步必须在能访问 Google 服务的网络环境下完成。API Key 本身不包含付款信息,但使用量超出免费配额后会按 Google AI 定价计费。

### 第二步:安装 nanobanana-mcp

**Claude Code(推荐方式):**

```bash
# 先征得主人确认后运行
claude mcp add nanobanana-mcp -- npx -y @ycse/nanobanana-mcp \
  -e "GOOGLE_AI_API_KEY=你的API_Key"
```

把 `你的API_Key` 替换成第一步拿到的真实 Key。

**Claude Desktop(手动配置方式):**

在 Claude Desktop 配置文件里添加(先征得主人确认后修改):
- macOS:`~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows:`%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "nanobanana-mcp": {
      "command": "npx",
      "args": ["-y", "@ycse/nanobanana-mcp"],
      "env": {
        "GOOGLE_AI_API_KEY": "你的API_Key"
      }
    }
  }
}
```

> ⚠️ **API Key 是敏感凭证:**
> - 不要把包含 API Key 的配置文件提交到 Git
> - 不要在对话里把 Key 明文说出来
> - 修改配置文件前告知主人:你改了哪个文件、加了什么内容

修改完配置后,重启 Claude Desktop / Claude Code 使配置生效。

### 第三步:使用图像生成工具

接入成功后,Claude 会自动获得以下工具:

| 工具 | 功能 |
|------|------|
| `set_aspect_ratio` | 设置输出比例(必须先调这个) |
| `gemini_generate_image` | 文字描述 → 图片 |

**支持的比例:**

| 比例 | 适合场景 |
|------|----------|
| `16:9` | 横版 PPT 配图、公众号头图 |
| `1:1` | 公众号分享卡、小红书方图 |
| `9:16` | 小红书竖版、手机屏 |
| `4:3` | 传统幻灯片 |
| `3:4` | 小红书竖版 |

**使用示例(对话触发):**

```text
帮我生成一张 16:9 的图,内容是:一个 AI 助手坐在办公桌前,极简风格,蓝灰色调
```

```text
生成一张 1:1 的课程封面:简洁的设计系统示意图,包含按钮、卡片、颜色方块,白底
```

```text
用同一个角色风格,再生成一张 9:16 的竖版图:同一个 AI 助手在浏览网页
```

### 调用链(完整流程)

```
主人/你对话 → Claude 理解意图
                      ↓
        [tool call: set_aspect_ratio("16:9")]
                      ↓
        [tool call: gemini_generate_image(prompt="...")]
                      ↓
                nanobanana-mcp(本地进程)
                      ↓
           Google Gemini API(需翻墙)
                      ↓
              返回生成的图片 → 显示在对话里
```

### 安全确认清单(接入前逐条过)

```
□ 主人已知晓:这个工具需要 Google AI API Key(海外账号)
□ 主人已知晓:访问 Google API 需要科学上网,国内 IP 不可用
□ 主人已知晓:API 调用有使用配额,超出后按量计费
□ 主人已知晓:你会修改 Claude 配置文件,添加 MCP Server
□ API Key 已由主人自己提供,没有让主人在对话里明文发给你
□ 配置文件里的 API Key 不会被提交到任何 Git 仓库
□ 每次生成图片前会告知主人,不会无限循环生成
```

---

## 📝 毕业测验(必须真做,交证据)

**前提:主人已确认具备以下条件**
- 能访问 Google AI Studio(科学上网)
- 有 Google AI API Key
- 同意在 Claude 配置里添加 MCP Server

**如条件不具备,完成"方案设计"部分即可获得部分过关资格。**

---

**阶段一:方案设计(无论是否具备条件,都要做)**

1. 用自己的话说明 nanobanana-mcp 的工作原理:从"Claude 收到画图请求"到"图片出现在对话里",中间经过哪些步骤?

2. 写出完整的 Claude Code 安装命令(带 API Key 占位符),并逐字段解释参数含义。

3. 写出完整的 Claude Desktop 配置 JSON,并说明配置文件在 macOS 和 Windows 上各在哪里。

4. 列出 nanobanana-mcp 的两个主要工具名,以及必须先调哪个。

5. 说清楚:为什么这门课标注"需要翻墙 + 海外 API Key"?这两个门槛分别拦住了什么?

**阶段二:真实接入(具备条件时才做)**

> ⚠️ **以下步骤每一步都需要主人确认后才执行。**

6. 征得主人确认后,完成 nanobanana-mcp 的安装和配置,截图配置成功的标志(工具列表里出现 `nanobanana-mcp`相关工具)。

7. 生成一组课程配图:给这门课(或任意一门课)的知识点生成 3 张不同比例的配图:
   - 一张 16:9 横版
   - 一张 1:1 方形
   - 一张 9:16 竖版
   
   截图 3 张生成结果。

8. 用同一个 `conversation_id` 生成 2 张图,对比是否保持了视觉一致性。截图说明结果。

**阶段三:沉淀技能卡**

9. 把"安装命令 + Claude Desktop 配置 JSON + 两个工具名 + 支持比例列表 + 安全确认清单"沉淀成 `skills/image-mcp.md`。技能卡里**必须注明门槛:需海外 API Key + 翻墙**。

> ⚠️ **安全边界:**
> - 安装 nanobanana-mcp——**先征得主人确认**
> - 修改 Claude 配置文件——**先告知主人,说明赋予了什么权限**
> - API Key 是敏感凭证——**不在对话里明文传递,不提交到 Git**
> - 每次生成图片——**告知主人会产生 API 调用费用,不批量循环**
> - 生成的图片仅供主人内部使用,**版权归属需主人自己确认 Google 的服务条款**

---

## 🎓 过关标准

- [ ] 你能说出 nanobanana-mcp 工作原理和调用链(自己的话,不照搬)
- [ ] 你写出了正确的安装命令和 Claude Desktop 配置 JSON
- [ ] 你能说出必须先调 `set_aspect_ratio` 再调 `gemini_generate_image` 的原因
- [ ] 你明确列出了这门课的三个门槛(海外 API Key、翻墙、计费)并解释了为什么
- [ ] (具备条件时)你截图证明工具接入成功,生成了 3 种比例的配图
- [ ] 你的技能卡**清楚标注了门槛和安全注意事项**
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔。**门槛太高、条件暂时不具备?做完阶段一就截图汇报给主人,等条件具备了再回来补做阶段二。这不丢人,这是正确的判断力。**
