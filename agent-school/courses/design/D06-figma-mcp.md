# 第 D06 课 · Figma MCP:让 agent 读懂你的设计稿

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★★ ｜ 源头:[github.com/arinspunk/claude-talk-to-figma-mcp](https://github.com/arinspunk/claude-talk-to-figma-mcp) · 备选:[github.com/GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP)(15.1k ⭐)

---

## 📖 你要学会什么

设计师在 Figma 里做好了一个产品登录页的设计稿——配色是 #1677FF,字体是 PingFang SC 16px,按钮圆角 8px——然后把设计稿链接发给你,说"照这个写代码"。以前你要自己一个个量、一个个抄,还容易看漏。

**Figma MCP** 打通了 Claude 和 Figma 之间的"传送门":Claude 可以直接读取 Figma 设计稿里的每一个图层、每一个样式参数——颜色、字体、尺寸、间距、组件名称全拿到手——然后直接生成对应的代码。就像给 Claude 装了一双"能看懂设计图纸的眼睛"。

这一课介绍两个方案:

| 方案 | 项目 | 适用场景 | 门槛 |
|------|------|----------|------|
| **方案 A** | `claude-talk-to-figma-mcp` | 需要在 Figma 里双向操作(读+改设计) | 需 Figma Desktop + 插件 |
| **方案 B** | `Figma-Context-MCP`(Framelink) | 只需要读取设计稿然后写代码 | 只需 Figma 个人访问令牌 |

> ⚠️ **两个方案都需要 Figma 账号。Figma 免费计划即可使用,无需付费版。Figma 官网国内可访问。**

学完这一课,你能:
1. 把 Figma MCP 接进 Claude Code 或 Claude Desktop
2. 把一个 Figma 设计稿链接发给 Claude,让它读取设计参数
3. 用读到的参数生成对应的 React/HTML 代码

**官方资料:**
- claude-talk-to-figma-mcp: [github.com/arinspunk/claude-talk-to-figma-mcp](https://github.com/arinspunk/claude-talk-to-figma-mcp)
- Figma-Context-MCP(Framelink): [github.com/GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP)
- Figma 个人访问令牌申请: [figma.com/developers/api#access-tokens](https://www.figma.com/developers/api#access-tokens)

---

## 🧠 核心原则

1. **MCP = 给 Claude 装"外挂感知器"的标准接口。** 普通 Claude 只能看文字和图片;接入 Figma MCP 后,Claude 能直接调取 Figma API,把设计稿里的每个元素的精确参数(不是靠"看",而是靠"读数据")读出来。

2. **两种方案,各有侧重——读稿落代码用 Framelink,设计稿内操作用 claude-talk-to-figma-mcp。** Framelink(方案 B)更轻量:只需一个 Figma 令牌,Claude 读取设计稿参数,你再让它写代码。claude-talk-to-figma-mcp(方案 A)更强大:可以在 Figma 里直接创建图层、修改颜色,但配置步骤多一些。

3. **Figma 个人访问令牌(Personal Access Token)是钥匙。** 令牌让 Claude 以你的身份读取你有权限访问的 Figma 文件。令牌要保密,不要发给别人、不要提交到 Git。

4. **设计稿落代码的误差是正常的。** Claude 读取的是精确的设计参数,但把参数翻译成代码时可能有微小偏差(比如 Figma 用的是绝对像素,而代码可能需要相对单位)。生成的代码是 80分 的起点,剩下 20分 需要人工检查。

5. **先征得主人确认再接入。** 配置 MCP 会修改 Claude 的配置文件,接入后 Claude 能访问你指定的 Figma 文件。两件事都要先告知主人。

---

## 🛠 操作要点

### 方案 A:claude-talk-to-figma-mcp(双向操作)

**前置条件:** Node.js、Figma Desktop、一个支持 MCP 的 Claude 客户端(Claude Desktop / Claude Code)

**第一步:启动 WebSocket 服务**

```bash
# 首次使用,全局安装
npx claude-talk-to-figma-mcp
```

后续每次使用,在项目目录下运行:
```bash
bun run socket
```

> ⚠️ **执行前先征得主人确认**。`npx` 会安装 Node 包,需要网络。

**第二步:安装 Figma 插件**

1. 打开 Figma Desktop
2. 菜单 → Plugins → Development → Import plugin from manifest
3. 选择项目目录下的 `src/claude_mcp_plugin/manifest.json`

**第三步:配置 Claude Desktop**

下载最新 Release 里的 `.dxt` 文件,双击安装即可。

或者手动配置 `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "ClaudeTalkToFigma": {
      "command": "npx",
      "args": ["-p", "claude-talk-to-figma-mcp@latest", "claude-talk-to-figma-mcp-server"]
    }
  }
}
```

**第四步:连接 Figma**

1. 在 Figma 里打开你安装的插件
2. 复制插件里绿色框里显示的 Channel ID
3. 在 Claude 对话里说:`Connect to Figma, channel {你的ID}`

**可以做的事:**
- 分析设计稿文档结构:"分析这个设计稿的颜色规范"
- 生成代码:"把 CardProduct 组件生成带 PropTypes 的 React 代码"
- 可访问性审计:"找出所有对比度不足 4.5:1 的文字"
- 批量修改:"把所有主按钮的颜色从 #FF6B6B 改成 #E63946"

---

### 方案 B:Figma-Context-MCP / Framelink(只读,更简单)

**第一步:获取 Figma 个人访问令牌**

1. 登录 Figma → 左上角头像 → Settings
2. 左侧菜单 Personal access tokens → Generate new token
3. 复制生成的令牌(只显示一次,立刻保存)

> ⚠️ **令牌要保密**,不要放进代码、不要提交 Git、不要发给别人。

> 🇨🇳 **中国用户提示:** Figma 官网([figma.com](https://figma.com))在国内可正常访问;Figma Desktop 也可正常下载使用。

**第二步:配置 Claude Desktop 或 Claude Code**

macOS / Linux 配置:
```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=你的令牌", "--stdio"]
    }
  }
}
```

Windows 配置:
```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=你的令牌", "--stdio"]
    }
  }
}
```

或者用环境变量方式(更安全,不把 key 暴露在 JSON 里):
```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "你的令牌"
      }
    }
  }
}
```

> ⚠️ **修改配置文件前先告知主人**,说明你添加了什么 MCP Server、它能访问什么。配置生效需重启 Claude。

**第三步:使用**

配置生效后,在 Claude 对话里发送 Figma 设计稿链接:
```
这是我的 Figma 设计稿链接:https://www.figma.com/design/xxx
请读取这个登录页设计稿的设计参数,然后生成对应的 React + Tailwind 代码。
```

Claude 会自动调用 MCP 工具读取设计稿数据,然后输出代码。

### 使用场景对比

| 场景 | 推荐方案 |
|------|---------|
| 只需要读设计稿、写代码 | 方案 B(Framelink) |
| 需要在 Figma 里直接改稿 | 方案 A(claude-talk-to-figma-mcp) |
| 需要做可访问性审计 | 方案 A |
| 快速上手,配置步骤少 | 方案 B |
| 免费 Figma 账号 | 两个方案都支持 |

---

## 📝 毕业测验(必须真做,交证据)

**任务:把一个 Figma 设计稿接入 Claude,让 Claude 读取设计参数,生成对应的 HTML/CSS 代码。**

> ⚠️ **安全边界:需要 Figma 账号 + 修改 Claude 配置文件,全程先征得主人确认。**

**步骤:**

1. **征得主人确认**:告知主人你要配置 Figma MCP、需要 Figma 个人访问令牌,以及会修改 Claude 的 MCP 配置文件。等确认后继续。

2. **选择方案**:方案 A(双向操作)或方案 B(只读,推荐新手)。告知主人选了哪个。

3. **获取令牌/完成配置**:
   - 方案 B:申请 Figma 个人访问令牌,写入 MCP 配置文件
   - 方案 A:完成 WebSocket 服务 + Figma 插件 + Claude 配置
   截图证明 MCP 已接入成功(Claude 配置文件截图,或 Claude 对话里能调用 Figma 工具的截图)。

4. **准备一个 Figma 设计稿**:
   - 如果主人有现成的 Figma 设计稿,用那个
   - 如果没有,在 Figma 里新建一个简单的登录表单(两个输入框 + 一个按钮),并设置颜色/字体样式
   记录设计稿链接。

5. **让 Claude 读取并生成代码**:发送 Figma 链接给 Claude,要求它：
   - 列出设计稿中的颜色规范(hex 值)
   - 列出字体规范(字体名、字号、字重)
   - 生成对应的 HTML + CSS 代码
   截图保存 Claude 的回复和生成的代码。

6. **验证代码**:把生成的 HTML 代码在浏览器里打开,和原设计稿对比效果,截图对比。

7. **写复盘报告(≥100 字)**:Claude 读取的参数准确吗?生成的代码和设计稿有多接近?哪里有偏差?配置过程中遇到什么问题?

8. **沉淀技能卡**:把"Figma MCP 配置步骤 + 令牌申请方法 + 使用场景对比 + 安全注意事项"沉淀成 `skills/figma-mcp.md`。

**交证据清单:**
- [ ] MCP 配置文件截图(令牌已脱敏)
- [ ] Claude 成功调用 Figma 工具的截图
- [ ] Figma 设计稿截图
- [ ] Claude 生成的代码截图
- [ ] 代码在浏览器里的效果截图(与设计稿对比)
- [ ] 复盘报告
- [ ] 技能卡文件 `skills/figma-mcp.md`

---

## 🎓 过关标准

- [ ] 你能说清楚"为什么 Figma MCP 比截图更精确"——Claude 读到的是数据,不是像素识别
- [ ] 你完成了方案 A 或方案 B 的完整配置,截图为证
- [ ] 你从一个真实 Figma 设计稿中让 Claude 读取了颜色和字体规范
- [ ] 你得到了 Claude 生成的 HTML/CSS 代码,并在浏览器里验证可运行
- [ ] 你能说出 Figma 个人访问令牌的安全规范(不提交 Git、不明文写进代码)
- [ ] 你能说出方案 A 和方案 B 各自适合什么场景
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按[校规第四条](../../校规.md)的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
