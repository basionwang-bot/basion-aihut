# 第 A03 课 · Activepieces:MIT 开源 + 280 个工具直接变 MCP,让 Claude 调用

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 基础课 + A01 或 A02 ｜ 难度:★★★ ｜ 源头:[github.com/activepieces/activepieces](https://github.com/activepieces/activepieces)（约 22.7k ⭐,MIT,自称"最大开源 MCP 工具箱"）

---

⚠️ **全院统一安全红线(每门课开头重申)**

这类工具会**连接真实账号、真的发邮件改数据**。铁律三连:
1. **先用测试账号/沙箱**,不要上来就接生产账号;
2. **关键动作(发送/删除)先加人工确认节点**,让主人看一眼再放行;
3. **接生产账号前先问主人**,征得明确同意。

给 AI 接能力要设最小权限。

---

## 📖 你要学会什么

如果说 A01、A02 是"人工连线"的自动化,Activepieces 最有意思的一步是:**把 280 多个现成的自动化工具,直接暴露成 MCP 接口,让 Claude 用人话调用它们**。

打个比方:以前 Claude 想帮你发一封 Gmail、往 Google Sheet 写一行、在飞书发一条消息,都得你自己写代码或手动操作。现在 Activepieces 做了一件事——把这 280 多个集成(Piece)全部包装成标准 MCP 工具。Claude 接上之后,直接说"帮我把这条记录写进那个表格",Claude 就能干了。

学完这一课,你能:
- 用 Docker Compose 在本地启动 Activepieces
- 理解"Piece = 一个可调用工具单元"的模型
- 生成 MCP 访问 Token,把 Activepieces 接进 Claude Desktop 或 Claude Code
- 让 Claude 通过 MCP 调用现成工具,完成一个真实的自动化任务

**官方资料:**
- 仓库: [github.com/activepieces/activepieces](https://github.com/activepieces/activepieces)
- 官网文档: [activepieces.com/docs](https://www.activepieces.com/docs)
- MCP 说明: README 中"MCP Server"章节
- Discord 社区: [discord.gg/2jUXBKDdP8](https://discord.gg/2jUXBKDdP8)

---

## 🧠 核心原则

1. **Piece = 乐高积木,每块封装一个外部服务的操作。** Google Sheets 是一块,Gmail 是一块,Slack 是一块,HTTP 请求是一块……Activepieces 有 280+ 块,其中 60% 是社区贡献的。你的工作是:选积木、拼积木、放行。

2. **MCP = 给 Claude 装插件的标准接口。** Activepieces 最特别的地方:所有 280+ Piece 都可以作为 MCP 服务器暴露给 Claude。Claude 通过 MCP 协议调用这些 Piece,就好比 Claude 多了 280 双手——每双手都会一种技能。

3. **两种用法,配合才强大。** Activepieces 有两个维度的用法:① **可视化流水线**:在编辑器里拖 Piece 连线,类似 A01、A02;② **MCP 接口**:把现成 Piece 暴露给 AI 直接调用,这是本课重点。两者可以同时用。

4. **MIT 许可证,最宽松的开源。** 社区版是纯 MIT,个人用、商业用、改了卖都行(要保留版权声明)。企业版有额外功能(SSO 等)需要商业许可证,但日常使用社区版就够了。

5. **先征得主人确认,再安装、再接账号、再给 Claude 权限。** 安装 Docker 服务需要主人确认;生成 API Token 并接进 Claude 相当于给 Claude 能操控外部服务的权力,这个决定必须由主人来做。

---

## 🛠 操作要点

### 用 Docker Compose 启动 Activepieces

Activepieces 的 `docker-compose.yml` 在仓库根目录。先确认 Docker 已安装:

```bash
docker --version
docker compose version
```

拉取仓库并启动:

```bash
git clone https://github.com/activepieces/activepieces.git
cd activepieces
docker compose up -d
```

> ⚠️ **`docker compose up` 前先征得主人确认。** 这一步会在本地创建 PostgreSQL 数据库、Redis 缓存和 Activepieces 应用服务。

服务启动后,浏览器打开:

```
http://localhost:8080
```

首次访问会引导你创建管理员账号。**使用一个强密码**,不要用测试弱密码在生产环境。

> 🇨🇳 **国内友好提示:** Activepieces 完全本地运行。Docker 镜像如果拉取慢,配置 Docker 镜像加速(如阿里云、DaoCloud)。`ghcr.io` 镜像仓库在国内访问可能需要代理,告知主人。

### 理解 Piece 的结构

一个 Piece 的工作方式很像一个函数:

```
输入参数(账号凭据 + 操作参数) → [Piece 处理] → 输出结果
```

比如"Google Sheets: 追加一行"这个 Piece:
- 输入:Google 账号(OAuth)+ 表格 ID + 行数据
- 输出:操作成功/失败 + 写入后的行信息

在可视化编辑器里,你给 Piece 填好参数、连好前后节点,它就跑起来了。

### 生成 MCP Token 并接进 Claude

这是本课的核心操作:把 Activepieces 的 Piece 暴露成 MCP 接口,让 Claude 直接调用。

**第一步:在 Activepieces 里生成 MCP 访问 Token**

1. 登录 Activepieces 后台 `http://localhost:8080`
2. 进入 **Settings**(设置)→ 找到 **MCP** 或 **API Keys** 相关选项
3. 生成一个 API Token(记下来,只显示一次)

> ⚠️ **生成 Token 这一步必须由主人操作**,因为这个 Token 代表主人授权 Claude 可以调用 Activepieces 里的所有功能。

**第二步:配置 Claude Desktop 或 Claude Code**

在 Claude Desktop 的 `claude_desktop_config.json` 里添加:

```json
{
  "mcpServers": {
    "activepieces": {
      "command": "npx",
      "args": [
        "@activepieces/mcp",
        "--api-key", "你的-AP-TOKEN",
        "--base-url", "http://localhost:8080"
      ]
    }
  }
}
```

或者用 Claude Code CLI:

```bash
claude mcp add activepieces \
  -e AP_API_KEY=你的-AP-TOKEN \
  -e AP_BASE_URL=http://localhost:8080 \
  -- npx @activepieces/mcp
```

> ⚠️ **修改配置前先告知主人**,说清楚你在添加什么权限。配置生效后需重启 Claude Desktop / Claude Code。

> ⚠️ **Token 安全:** Token 不要写进 git 仓库、不要发给别人。放配置文件里的 Token 是"主人给 Claude 的钥匙",一旦泄漏别人可以用它操作主人的 Activepieces。

**第三步:验证连接**

Claude Desktop/Code 重启后,在对话里问:
```
你现在有哪些可用的 MCP 工具?
```
或在 Claude Code 里运行 `/mcp`,看 activepieces 是否出现在工具列表里。

### 让 Claude 通过 MCP 调用 Piece(真任务演示)

接好后,你可以直接用自然语言让 Claude 完成自动化任务:

**示例对话:**

> 用户:"帮我把下面这条记录追加到 Google Sheet '项目进度' 的第一个 Sheet 里:项目名=A项目,状态=进行中,日期=今天。"

Claude 会:
1. 识别到需要调用 Google Sheets Piece
2. 发起 MCP tool call
3. Activepieces 执行写入操作
4. 返回结果给 Claude
5. Claude 回复用户"已写入"

**关键点:Claude 不是自己知道怎么操作 Google Sheet,而是通过 MCP 调用 Activepieces 的 Piece 来完成的。**

### Activepieces 常用 Piece 类别

| 类别 | 举例 |
|------|------|
| 办公/表格 | Google Sheets、Airtable、Excel |
| 邮件 | Gmail、Outlook、SMTP |
| 通讯 | Slack、Discord、钉钉(社区 Piece) |
| 存储 | Google Drive、Dropbox |
| 代码/HTTP | HTTP 请求、执行 JS/Python 代码 |
| AI | OpenAI、各类 LLM |
| 数据库 | MySQL、PostgreSQL |

> 🇨🇳 **国内用户提示:** 钉钉、飞书等国内平台有社区贡献的 Piece,但覆盖程度和官方维护的不同,使用前先查一下最新支持情况。

### 安全确认清单

```
□ 已征得主人确认后才运行 docker compose up
□ 创建了强密码的管理员账号,不用默认弱密码
□ MCP Token 由主人决定是否生成并授权给 Claude
□ Token 没有写进 git 仓库或暴露在公开位置
□ 告知主人:接上 MCP 后 Claude 可以操作哪些外部服务
□ 接入的外部服务账号使用测试账号/测试工作区,不直接用生产账号
□ 生产环境接入前,再次征得主人明确确认
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:让 Claude 通过 MCP 调用 Activepieces 的 Piece,完成一个真实的自动化操作。**

**第一阶段:理解(可先做)**

1. **解释 MCP 在这里扮演什么角色**:为什么说 Activepieces 是"Claude 的工具箱"?画出"用户 → Claude → MCP → Activepieces Piece → 外部服务"这条调用链,并用你自己的话解释每个箭头是什么。

2. **MIT 许可证和 AGPL 的区别**:相比 A02 的 Automatisch(AGPL-3.0),Activepieces 的 MIT 许可证对主人有什么不同意义?哪种场景下这个区别很重要?

3. **Token 安全的重要性**:如果 API Token 泄漏了,最坏可能发生什么?保护 Token 的正确做法是什么?

**第二阶段:真做(需要主人已确认安装 Docker)**

> ⚠️ **先征得主人确认安装 Docker 后再做此阶段。**

4. **启动 Activepieces**:运行 `docker compose up -d`,等待服务就绪,访问 `http://localhost:8080`。截图登录页面。

5. **创建管理员账号并登录**:截图主界面。

6. **在编辑器里创建一条简单的可视化流水线**:用 **Schedule**(定时触发)+ **HTTP Request**(请求一个公开 API)+ **Send message**(发到 Webhook 或内置 Debug),截图流水线连线图。

7. **生成 MCP Token**,并把 Activepieces 接进 Claude Desktop 或 Claude Code(由主人操作完成 OAuth/Token 步骤)。截图 Claude 端看到 activepieces MCP 工具列表。

8. **让 Claude 通过 MCP 执行一个操作**:在对话里让 Claude 调用任意一个 Piece 完成一个真实操作(如发一条 Webhook、发一封测试邮件、写一行到 Sheet)。截图 Claude 的回复和执行结果。

9. **沉淀技能卡**:把"Activepieces 启动命令 + MCP 接入配置 + 常用 Piece 类别 + 安全清单"沉淀成 `skills/activepieces-mcp.md`。

> ⚠️ **安全边界再强调:**
> - `docker compose up -d` ——**运行前先征得主人确认**
> - MCP Token 生成和接入 Claude ——**这个决定必须由主人做,你只负责帮主人操作**
> - 调用外部服务 Piece ——**先用测试账号/测试环境**
> - Token 不进 git ——**这是铁律**

---

## 🎓 过关标准

- [ ] 你能画出"用户 → Claude → MCP → Activepieces → 外部服务"的完整调用链,并逐步解释
- [ ] 你能说出 MIT 许可证和 AGPL 的核心区别
- [ ] 你成功启动 Activepieces 并创建了管理员账号(有截图)
- [ ] 你在编辑器里搭出了至少一条可视化流水线(有截图)
- [ ] 你把 Activepieces 接进了 Claude(MCP 工具列表里可见),并让 Claude 通过 MCP 执行了一个真实操作(有截图)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
