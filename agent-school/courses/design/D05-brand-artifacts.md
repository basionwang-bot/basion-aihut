# 第 D05 课 · Brand Artifacts:给作品套上统一品牌脸

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★ ｜ 源头:Claude.ai 官方 Artifacts 功能 + [anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts)(17k ⭐)

---

## 📖 你要学会什么

你有没有见过这种情况:一个公众号账号的封面图、推文配图、产品介绍页,各用各的颜色,各用各的字体——看起来像三个不同的人做的?这叫"品牌不统一",是内容创作者最常犯的视觉错误。

这一课要解决的问题是:**给一段现有的 HTML/设计稿,快速套上统一的品牌风格(配色+字体+间距),产出一个可分享的单文件 demo**——全程用 Claude.ai 的 Artifacts 功能完成,不需要装任何工具。

说白了就是:你把一段"裸" HTML 交给 Claude,告诉它你的品牌颜色是什么、字体是什么、圆角多大——Claude 直接输出一个带实时预览的、统一风格的单文件 HTML,你下载后发给任何人打开都能看。

**Artifacts** 是 Claude.ai 官方推出的"可交互产出"功能:Claude 回复的内容不再只是文字,而是一个可以在对话旁边实时渲染、实时预览的代码块或网页——就像你的回复里直接嵌入了一个活的小程序。

学完这一课,你能:
1. 用 Claude.ai 的 Artifacts 功能生成并实时预览 HTML 网页
2. 输入一段品牌规范(主色调/字体/圆角/间距),把杂乱的 HTML 一键统一风格
3. 导出单文件 HTML,可直接在浏览器里打开分享

> ⚠️ **使用 Claude.ai 需要 Anthropic 账号,国内访问需要代理。国内替代方案见下方提示。**

**官方资料:**
- Claude.ai: [claude.ai](https://claude.ai)
- Anthropic 开发者文档: [docs.anthropic.com](https://docs.anthropic.com)
- Claude quickstarts(含 Web 应用示例): [github.com/anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts)

---

## 🧠 核心原则

1. **Artifacts = 让 Claude 的输出"活起来"。** 普通回复是文字,Artifacts 是可以实时渲染的 HTML/SVG/React 代码。你写一句"生成一个登录页",Claude 不只给你代码,还在右侧面板直接展示页面效果——所见即所得。

2. **品牌规范就是"视觉宪法"。** 一套好的品牌规范只需要 5 个要素:主色/辅色、字体名称、圆角大小、间距基准、阴影风格。把这 5 样告诉 Claude,它就能把任何一段杂乱 HTML 改造成风格统一的作品。

3. **单文件 HTML 是最通用的分享格式。** 把所有 CSS 内联、所有 JS 内嵌进一个 `.html` 文件,发给任何人用浏览器打开就能看,不需要服务器、不需要安装任何东西。这就是"可分享的单文件 demo"的价值。

4. **迭代是常态,不要指望一次出活。** 第一稿生成后,继续说:"把主色改成 #1677FF"、"标题字体改成 PingFang SC"、"卡片圆角加大"——每次修改 Claude 直接更新 Artifacts 里的预览。

5. **涉及真实账号(claude.ai)和可能的 API 费用,先征得主人确认。** 如果主人没有 Claude.ai 账号或无法访问,使用 API 调用方式需要 Anthropic API key。

---

## 🛠 操作要点

### 路线一:Claude.ai 网页端(最简单,无需装任何东西)

> 🇨🇳 **中国用户提示:** claude.ai 需要海外网络(代理/VPN)才能访问。国内替代方案:
> - 通过 **API 中转服务**(如 API2D、One API)调用 Anthropic API,配合本地代码实现同样效果
> - 使用 **Claude Code**(本课程主工具,本地运行)直接让 Claude 生成 HTML 文件
> - 使用下方"路线二"(API 方式)——不依赖 claude.ai 网页

**使用 claude.ai Artifacts 的步骤:**

1. 登录 [claude.ai](https://claude.ai),新建对话
2. 直接粘贴你的"品牌规范"和"待改造的 HTML",发送以下提示词:

```
请帮我把下面这段 HTML 改造成统一的品牌风格,产出一个可以直接在浏览器打开的单文件 HTML。

品牌规范:
- 主色:#1677FF(科技蓝)
- 辅色:#F0F5FF(浅蓝背景)
- 字体:系统默认 sans-serif(优先使用 PingFang SC / 苹方)
- 圆角:8px(卡片),4px(按钮)
- 间距基准:8px 的倍数
- 阴影:0 2px 8px rgba(0,0,0,0.1)

请在输出里把所有 CSS 内联到 <style> 标签里,所有内容打包成一个单文件 HTML,右侧 Artifacts 面板可以直接预览。

待改造的 HTML:
[粘贴你的 HTML 代码]
```

3. 右侧 Artifacts 面板会实时出现预览
4. 如不满意,继续对话:"把按钮改成圆角 20px"、"卡片背景改为白色"
5. 满意后点击 Artifacts 右上角的下载或复制按钮,拿到单文件 HTML

---

### 路线二:Claude Code(命令行方式,本地运行,无需翻墙)

如果你在 Claude Code 环境中,直接让 Claude 帮你生成品牌化 HTML:

**第一步:准备一份品牌规范 Prompt 模板**

把以下内容保存为 `brand-spec.md`:

```markdown
## 我的品牌规范

- 主色: #1677FF
- 辅色: #F0F5FF
- 背景色: #FFFFFF
- 文字色: #333333
- 字体: "PingFang SC", "Hiragino Sans GB", sans-serif
- 标题字重: 600
- 正文字号: 14px
- 圆角(卡片): 12px
- 圆角(按钮): 6px
- 间距单位: 8px
- 阴影: 0 2px 12px rgba(0,0,0,0.08)
```

**第二步:让 Claude Code 执行改造任务**

在对话中输入:
```
读取 brand-spec.md 里的品牌规范,然后把我下面这段 HTML 改造成符合规范的单文件 HTML,
把所有样式内联为 <style>...</style>,输出到文件 branded-demo.html。

[粘贴你的原始 HTML]
```

Claude Code 会直接创建 `branded-demo.html`,在浏览器里打开即可预览。

---

### 一个可以直接改造的"杂乱 HTML"示例

没有现成 HTML?用这段:

```html
<!DOCTYPE html>
<html>
<head><title>产品介绍</title></head>
<body>
  <div style="margin:20px">
    <h1 style="color:green;font-size:30px">我们的产品</h1>
    <p style="font-size:12px;color:#999">最好的 AI 工具平台</p>
    <div style="border:1px solid black;padding:10px;margin:10px 0">
      <h2 style="color:red">功能一:智能分析</h2>
      <p>帮你分析数据,生成报告</p>
      <button style="background:blue;color:white;border:none;padding:5px 10px">了解更多</button>
    </div>
    <div style="border:1px solid black;padding:10px;margin:10px 0">
      <h2 style="color:red">功能二:内容生成</h2>
      <p>自动生成营销文案和图片</p>
      <button style="background:blue;color:white;border:none;padding:5px 10px">了解更多</button>
    </div>
  </div>
</body>
</html>
```

改造后,所有颜色、字体、间距、圆角都会统一成品牌规范里定义的样子。

---

## 📝 毕业测验(必须真做,交证据)

**任务:把一段"杂乱 HTML"一键统一成品牌风格,产出可分享的单文件 demo,记录全过程。**

> ⚠️ **安全边界:使用 claude.ai 需要账号(海外网络);使用 Claude Code 无需翻墙。选哪条路线先告知主人。**

**步骤:**

1. **选择路线**:告知主人你打算用 claude.ai 网页端还是 Claude Code 命令行方式。

2. **准备材料**:
   - 准备一份品牌规范(可以用上方示例,或自定义一套)
   - 准备一段"杂乱"的 HTML(可以用上方示例)
   
3. **执行改造**:
   - 按对应路线操作,让 Claude 输出品牌化后的单文件 HTML
   - 截图保存:原始 HTML 在浏览器里的效果 vs. 改造后的效果

4. **验证单文件**:把生成的 HTML 文件保存为 `branded-demo.html`,在浏览器里直接打开(不需要服务器),确认可以正常显示,截图。

5. **迭代一次**:在品牌规范基础上再提一个修改要求(例如:"加一个顶部导航栏,背景用主色"或"卡片悬停时有淡蓝色阴影"),让 Claude 更新,截图保存修改后效果。

6. **写复盘报告(≥80 字)**:改造前后视觉差异如何?品牌规范是否被准确执行?哪里需要人工微调?

7. **沉淀技能卡**:把"品牌规范模板 + 改造 Prompt 模板 + 单文件 HTML 技巧"沉淀成 `skills/brand-artifacts.md`。

**交证据清单:**
- [ ] 原始 HTML 在浏览器的截图
- [ ] 改造后的 HTML 在浏览器的截图
- [ ] `branded-demo.html` 文件(可分享的单文件)
- [ ] 迭代修改后的截图
- [ ] 复盘报告
- [ ] 技能卡文件 `skills/brand-artifacts.md`

---

## 🎓 过关标准

- [ ] 你能说出 Artifacts 是什么,以及它和"普通代码回复"的区别
- [ ] 你能列出品牌规范的 5 个核心要素(主色/字体/圆角/间距/阴影)
- [ ] 你完成了"杂乱 HTML → 品牌化 HTML"的改造,有改造前后对比截图为证
- [ ] 你产出了一个可以直接在浏览器打开的单文件 `branded-demo.html`
- [ ] 你完成了至少一次迭代修改
- [ ] 你能说出中国用户使用 claude.ai 的门槛,以及 Claude Code 命令行作为替代方案的操作方法
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按[校规第四条](../../校规.md)的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
