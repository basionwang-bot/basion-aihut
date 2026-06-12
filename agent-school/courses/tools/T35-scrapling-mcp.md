# 第 T35 课 · scrapling-fetch-mcp:把反爬虫网页抓取接进 Claude

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 + T06(Scrapling) ｜ 难度:★★★ ｜ 源头:scrapling-fetch-mcp · [github.com/cyberchitta/scrapling-fetch-mcp](https://github.com/cyberchitta/scrapling-fetch-mcp) · PyPI · [pypi.org/project/scrapling-fetch-mcp/](https://pypi.org/project/scrapling-fetch-mcp/) · Scrapling 本体 · [github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling)

---

## 📖 你要学会什么

学完这一课,你能把 **scrapling-fetch-mcp** 接进 Claude Code(或 Claude Desktop),让 Claude 直接帮主人抓取那些有反爬保护的公开网页——就像给 Claude 装了一双"能穿墙的手"。

先讲个比喻。你现在是助理,主人每次想查一个电商页面的价格、一个招聘网站的职位列表,都要自己开浏览器——复制——粘贴——再转述给你,效率很低。有了这门课的工具,流程变成:主人说一句话,Claude 直接调用抓取工具,几秒后把干净文本端回来,主人再也不用自己动手翻页面。

这个"抓取工具"的名字叫 **scrapling-fetch-mcp**。它基于 Scrapling(T06 课学过的反爬虫采集库),把抓取能力按照 MCP(Model Context Protocol)标准封装好,接进 Claude 之后就变成 Claude 可以调用的内置工具。

**这一课是 T06 的进阶,不重复 Scrapling 基础用法——只讲"如何接进 Claude"和"接进之后能干什么"。**

**官方资料:**
- scrapling-fetch-mcp 仓库: [github.com/cyberchitta/scrapling-fetch-mcp](https://github.com/cyberchitta/scrapling-fetch-mcp)
- scrapling-fetch-mcp PyPI: [pypi.org/project/scrapling-fetch-mcp/](https://pypi.org/project/scrapling-fetch-mcp/)
- Scrapling 本体仓库: [github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling)
- MCP 协议官网: [modelcontextprotocol.io](https://modelcontextprotocol.io)

---

## 🧠 核心原则

1. **MCP = 给 Claude 装插件的标准接口。** 把 MCP 想成 AI 版的"USB 接口"——不管是爬虫、数据库、日历、文件系统,只要按 MCP 协议封装成"工具",Claude 就能调用。scrapling-fetch-mcp 就是把"抓取网页"这个动作封装成了标准工具,插进 Claude 就能用。

2. **MCP Server 是常驻进程,Claude 是调用方。** 工作流程是:Claude 发起一个 tool call 请求 → MCP Server 接收、执行、返回结果 → Claude 拿结果继续处理。MCP Server 和 Claude 是**分开运行的两个进程**,通过标准协议通信。用户看到的是 Claude 的回答,背后的抓取过程对用户透明。

3. **scrapling-fetch-mcp 只暴露两个工具,不多不少。** 它暴露的工具是:① **取页**(获取完整网页,支持分页);② **模式提取**(用正则在页面里匹配内容)。就这两个,够用、可靠、有据可查。**不要轻信任何"还有第三个工具"的说法,先核实源头。**

4. **先征得主人确认,再装、再接、再抓。** 这是三道门槛,一道都不能跳:① 装工具需要主人确认;② 改 Claude 配置文件需要告知主人;③ 抓取真实网站前需要确认目标站的 robots.txt 和主人的知情。

5. **只取公开内容,守好边界。** scrapling-fetch-mcp 能帮你突破一些反爬机制,但这不是"随便抓"的通行证。版权内容、需要登录才能看的内容、高频轰炸目标服务器——这三条线绝对不能碰。

---

## 🛠 操作要点

### 安装 scrapling-fetch-mcp

```bash
# 第一步:用 uv 安装工具本体(需先征得主人确认)
uv tool install scrapling-fetch-mcp

# 第二步:安装浏览器二进制(Scrapling 需要的浏览器驱动)
uvx --from scrapling-fetch-mcp scrapling install
```

> ⚠️ **安装前先征得主人确认。** `uv tool install` 会全局安装工具;第二步会下载浏览器二进制,体积较大,需要网络。两步都要先告知主人。

> 🇨🇳 **中国用户提示:** `uv` 是现代 Python 工具管理器,国内网络下载 uv 本身可在 [astral.sh/uv](https://astral.sh/uv) 找安装脚本;浏览器二进制下载可能需要代理——如遇超时,告知主人。

### 接入 Claude Desktop 或 Claude Code

在 Claude Desktop 的配置文件(通常是 `claude_desktop_config.json`)或 Claude Code 的 MCP 配置里,添加如下片段:

```json
{
  "mcpServers": {
    "scrapling-fetch": {
      "command": "uvx",
      "args": ["scrapling-fetch-mcp"]
    }
  }
}
```

配置字段说明:
- `"scrapling-fetch"`:你给这个 MCP Server 取的名字(可自定义)
- `"command": "uvx"`:用 uvx 启动工具(uvx 是 uv 的临时运行命令,不需要提前激活环境)
- `"args": ["scrapling-fetch-mcp"]`:告诉 uvx 启动哪个工具

> ⚠️ **修改配置文件前先告知主人**,说明你要添加什么、它启动后能访问什么权限。配置生效后需重启 Claude Desktop/Claude Code。

### scrapling-fetch-mcp 暴露的两个工具

| 工具 | 功能说明 |
|------|----------|
| **取页** | 获取完整网页文本内容;支持对长页面分页返回,不会一次性把几十 KB 的 HTML 全塞给 Claude |
| **模式提取** | 用正则表达式在页面里匹配特定内容(比如从页面里提取所有价格、日期、链接) |

**使用方式:**接入成功后,Claude 在对话中会自动识别"需要抓网页"的意图,自动触发工具调用——你不需要手写任何代码,说"帮我抓一下这个页面"就够了。

### 调用链(完整流程)

```
用户 → Claude → [tool call: scrapling-fetch 取页(url="...")]
                          ↓
               scrapling-fetch-mcp(本地运行进程)
                          ↓
          抓取目标网页 → Scrapling 反反爬处理 → 提取正文
                          ↓
               返回干净文本给 Claude → Claude 整理回复用户
```

### 安全确认清单(接入和使用前逐条过)

```
□ 已征得主人确认后才安装 uv tool + 浏览器二进制
□ 已告知主人修改了 Claude 配置文件、添加了 scrapling-fetch MCP Server
□ 目标网站有公开访问权限(不需要登录)
□ 目标网站的 robots.txt 允许爬取,或主人已知情并决策
□ 不会高频轰炸目标服务器(人工节奏,不循环批量)
□ 抓取内容不涉及版权付费墙、个人隐私数据
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:给主人设计一个完整的"scrapling-fetch-mcp 接入方案",说清楚从安装到用起来的每一步。**

**这次测验分两个阶段。**

**阶段一:写接入方案(可先做)**

1. **写出完整的安装命令**:两步走——先装工具本体,再装浏览器二进制。每条命令后面加注"这一步在做什么"。

2. **写出完整的 MCP 配置 JSON**:把上方"接入 Claude"那一段配置 JSON 默写出来,并逐字段解释——`command`、`args` 分别是什么意思?如果主人用的是 Claude Desktop,配置文件在哪里?

3. **画出调用链(文字版)**:从"用户说一句话"到"Claude 拿到抓取结果并回复",中间经过哪些步骤?用你自己的话说一遍,不要照搬课文。

4. **说清楚两个工具的用途**:取页 vs. 模式提取——各自适合什么场景?各举一个具体例子。

5. **逐条完成安全清单**:对"主人想抓取某技术博客的最新文章列表"这个场景,把上方安全确认清单里的 6 条逐一确认——说明每条为什么满足或需要额外确认。

**阶段二:真实探索(需要主人已完成接入后才能做)**

> ⚠️ **这个阶段需要先征得主人确认安装和配置,才能进行。** 如果主人还没接入,把阶段一的方案交给主人,等主人确认后再做阶段二。

6. **用取页工具抓一个公开页面**:和主人确认一个允许抓取的公开目标(如 GitHub 上某个开源项目的 README 页面,或某个公开技术博客的首页)。触发一次取页调用,记录返回结果的格式和内容。

7. **沉淀技能卡**:把"scrapling-fetch-mcp 安装步骤 + 配置 JSON + 两个工具说明 + 安全清单"沉淀成 `skills/scrapling-mcp.md`。

> ⚠️ **安全边界再强调:**
> - `uv tool install scrapling-fetch-mcp` ——**安装前先征得主人确认**
> - `uvx --from scrapling-fetch-mcp scrapling install` ——**同上,会下载浏览器二进制,先告知主人**
> - 修改 Claude 配置文件添加 MCP Server ——**配置前先告知主人,说明赋予了什么权限**
> - 触发取页工具访问真实网站 ——**执行前先确认目标网站 robots.txt + 主人知情**
> - 绝不抓取需要登录的内容,除非主人明确授权且使用主人自己的账号

---

## 🎓 过关标准

- [ ] 你写出了**正确的两步安装命令**(`uv tool install` + `uvx --from ... scrapling install`),并解释了每步做什么
- [ ] 你写出了**完整正确的 MCP 配置 JSON**,并逐字段解释
- [ ] 你用自己的话描述了从"用户发请求"到"Claude 拿到结果"的**完整调用链**
- [ ] 你能说出 scrapling-fetch-mcp **只有两个工具**是哪两个,并各举一个适用场景
- [ ] 你完成了**安全清单 6 条**的逐项确认,并能说出"为什么必须先问主人"
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
