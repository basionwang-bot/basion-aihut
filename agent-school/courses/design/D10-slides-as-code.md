# 第 D10 课 · 代码做 PPT

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★ ｜ 源头 A:[op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)（16.7k ⭐）｜ 源头 B:[slidevjs/slidev](https://github.com/slidevjs/slidev)（47.1k ⭐）

---

## 📖 你要学会什么

PPT 是演讲人的配图,不是 Word 文档——它的核心是**视觉冲击 + 节奏感**。但主人每次要做 PPT,都得打开 PowerPoint 或 Keynote,一张张拖方块、调字号,三小时过去了还没做完第四页。

**这门课要告诉你:PPT 可以用写代码的方式来做——Markdown 大纲丢进去,几秒出来精美幻灯片。**

这门课介绍两套工具,你可以根据主人的场景选其一:

### 工具 A:guizang-ppt-skill(推荐给 Claude Code 用户)
归藏开源的 Agent skill。Claude Code 专属,把内容发给 Claude,Claude 按照预设的精美版式生成单文件 HTML 幻灯片,直接在浏览器打开演示,无需构建、无需服务器。**国内直接用,无需翻墙,无需额外 API key。**

### 工具 B:Slidev(推荐给开发者自用)
`slidevjs/slidev` 是开发者界最流行的 Markdown 演示工具(47.1k 星)。用 Markdown 写内容,Vite 热重载驱动,支持导出 PDF/PNG/PPTX,还能嵌 Vue 组件。适合开发者自己写演讲稿、技术分享。**Node.js >= 20.12.0,npm 可用即可。**

学完这一课,你能:
- 用 guizang-ppt-skill 把一份 Markdown 大纲变成精美 HTML PPT
- 用 Slidev 创建项目,写 Markdown 出幻灯片,导出 PDF
- 判断两套工具各自的最佳适用场景

**官方资料:**
- guizang-ppt-skill:[github.com/op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)
- Slidev 仓库:[github.com/slidevjs/slidev](https://github.com/slidevjs/slidev)
- Slidev 文档:[sli.dev](https://sli.dev)
- Slidev 中文文档:[cn.sli.dev](https://cn.sli.dev)

---

## 🧠 核心原则

1. **PPT 是文本,Agent 最擅长处理文本。** HTML/CSS 是纯文本,Markdown 也是纯文本——Agent 能直接读、写、改、验证,而 .pptx 是二进制文件,Agent 操作起来像在蒙眼拆炸弹。用文本格式做 PPT,是 Agent 时代的自然选择。

2. **guizang-ppt-skill 的核心是"版式骨架 + 视觉规则"。** 它预置了 Style A(电子杂志风,10 种布局)和 Style B(瑞士国际主义,22 种锁定版式),Claude 按这些规则填充内容——你不需要懂设计,Claude 懂。

3. **Slidev 的核心是"Markdown + 分隔符"。** 每张幻灯片用 `---` 分隔,前置 frontmatter 设置主题、过渡动画,正文写 Markdown——简洁如同写笔记,演示效果比 PowerPoint 惊艳。

4. **单文件 HTML 的优势是"拿起就走"。** guizang-ppt-skill 输出的是单文件 HTML,不需要部署服务器,浏览器打开就能翻页演示,用键盘 ← → 或滚轮控制——分享给主人一个文件就够了。

5. **先征得主人确认,再安装任何东西。** 两套工具都需要 npm/Node.js 操作,改动主人的文件系统——动之前告知。

---

## 🛠 操作要点

---

### 工具 A:guizang-ppt-skill

#### 安装

**方式一:一行命令(推荐)**

```bash
npx skills add https://github.com/op7418/guizang-ppt-skill --skill guizang-ppt-skill
```

**方式二:手动安装**

```bash
git clone https://github.com/op7418/guizang-ppt-skill.git ~/.claude/skills/guizang-ppt-skill
```

验证安装:

```bash
ls ~/.claude/skills/guizang-ppt-skill/
# 应看到:SKILL.md  assets/  references/  checklist.md
```

> ⚠️ **安装前先征得主人确认。** 会在 `~/.claude/skills/` 目录写入文件。

> 🇨🇳 **中国用户提示:** clone GitHub 仓库可能需要代理加速。安装后无需额外 API key,完全本地运行。

#### 使用方式

安装后直接对 Claude Code 说:

```text
帮我基于这篇文章做一份瑞士风 PPT,控制在 7 页左右
```

```text
帮我把这份 Markdown 大纲做成杂志风演讲 PPT,6-10 页
```

```text
基于这份 PPT 的核心观点,生成一张公众号 21:9 头图
```

#### 两套视觉风格对照

| 风格 | 名称 | 版式数 | 适合场景 |
|------|------|--------|----------|
| Style A | 电子杂志风 | 10 种 | 叙事、观点分享、个人风格、线下分享 |
| Style B | 瑞士国际主义 | 22 种锁定版式 | 数据、产品分析、方法论、事实陈述 |

#### Style B 常用版式速查

| 版式 | 名称 | 用途 |
|------|------|------|
| Cover | 封面 | 开场第一页 |
| Statement | 观点陈述 | 核心观点页 |
| KPI Tower | 数据塔 | 数字强调 |
| Duo Compare | 双列对比 | 两个方案对比 |
| Image Hero | 大图主视觉 | 图片为主的页面 |
| Closing Manifesto | 结语宣言 | 最后一页 |

---

### 工具 B:Slidev

#### 安装与创建项目

```bash
# 需要 Node.js >= 20.12.0
node --version  # 先确认版本

# 创建新的 Slidev 项目(先征得主人确认)
npm init slidev
```

这个命令会交互式问你:项目名、主题等,然后自动安装依赖并启动开发服务器。

> ⚠️ **`npm init slidev` 会安装依赖,占用磁盘空间,执行前先告知主人。**

#### 启动开发服务器

```bash
# 项目目录里
npx slidev slides.md
```

浏览器自动打开,实时预览,改 Markdown 立刻刷新。

#### Slidev Markdown 基础语法

```markdown
---
theme: seriph
background: https://cover.sli.dev
class: text-center
---

# 演示标题

副标题写在这里

---
transition: slide-left
---

# 第二页

- 要点一
- 要点二
- 要点三

---

# 代码页(自带高亮)

```python
def hello():
    print("Hello, Slidev!")
```

---
layout: two-cols
---

# 左栏标题

左边的内容

::right::

# 右栏内容

右边的内容
```

#### 常用布局(layout)

| layout 值 | 效果 |
|-----------|------|
| `default` | 普通页 |
| `cover` | 封面页(大字居中) |
| `two-cols` | 左右两栏 |
| `center` | 内容居中 |
| `quote` | 引用语 |
| `image-right` | 右侧放图 |
| `fact` | 大数据页 |

#### 导出

```bash
# 导出为 PDF(需要安装 Playwright)
npx slidev export slides.md --format pdf

# 导出为 PNG(每页一张)
npx slidev export slides.md --format png

# 导出为 PPTX
npx slidev export slides.md --format pptx
```

> 🇨🇳 **中国用户提示:** Slidev 文档有官方中文版 [cn.sli.dev](https://cn.sli.dev),国内可正常访问。

---

### 两套工具对比选择

| 场景 | 推荐工具 | 理由 |
|------|----------|------|
| 用 Claude Code,要精美视觉效果 | guizang-ppt-skill | 无需懂前端,直接对话出精美 PPT |
| 开发者自己写演讲稿 | Slidev | Markdown 原生体验,技术演讲感更强 |
| 需要分享单文件给主人 | guizang-ppt-skill | 单文件 HTML,打开即用 |
| 需要导出 PDF/PPTX | Slidev | 官方支持多格式导出 |
| 国内网络,不想折腾 | 两者均可 | 都不需要翻墙 |

---

## 📝 毕业测验(必须真做,交证据)

**任务:把一份 Markdown 大纲变成能讲的精美幻灯片。**

这次测验你选 **工具 A 或 工具 B 任选其一**完成,但要说清楚你为什么选这个。

**阶段一:准备大纲**

1. 准备一份 Markdown 大纲(可以用这门课的笔记,或主人提供的内容),至少包含:一个主题、4-6 个要点、至少一组数据或对比。

**阶段二(选 A):guizang-ppt-skill**

2. 征得主人确认后安装 skill,截图证明 `SKILL.md` 存在。

3. 把大纲发给 Claude Code,要求做一份 PPT:
   ```text
   帮我基于这份大纲做一份瑞士风 PPT,6 页左右,IKB 蓝
   ```
   截图 Claude 生成的 HTML 文件和在浏览器里的预览效果。

4. 说清楚:Claude 选用了哪些版式?为什么这些版式适合你的内容?

**阶段二(选 B):Slidev**

2. 征得主人确认后运行 `npm init slidev`,截图项目创建成功和开发服务器启动的输出。

3. 用 Markdown 写出至少 6 页幻灯片,要求:
   - 封面用 `layout: cover`
   - 至少用一次 `layout: two-cols` 或 `layout: fact`
   - 至少一页包含代码块
   - 设置一种过渡动画 `transition:`
   
   截图浏览器里的实时预览效果。

4. 运行导出命令,把幻灯片导出为 PDF,截图导出成功的输出和 PDF 文件。

**阶段三:反思与对比**

5. 写 200 字以内的反思:
   - 用代码写 PPT 和用 PowerPoint 有什么本质区别?
   - 什么类型的主人/场景适合用这个工具?哪些不适合?

**阶段四:沉淀技能卡**

6. 把"安装步骤 + 触发命令/Markdown 语法 + 导出方法 + 工具选择建议"沉淀成 `skills/slides-as-code.md`。

> ⚠️ **安全边界:**
> - 安装 skill / `npm init slidev` ——**均需先征得主人确认**
> - 涉及导出 PDF 时 Slidev 需要 Playwright(会下载浏览器二进制,先告知主人)
> - 生成的 PPT 只是草稿,**不替主人发布或分享给第三方**

---

## 🎓 过关标准

- [ ] 你能说出 guizang-ppt-skill 和 Slidev 各自的最佳使用场景
- [ ] 你完成了工具 A 或工具 B 的完整流程,截图证明 PPT 生成成功
- [ ] 你的 PPT 至少 5 页,包含不同版式/布局
- [ ] (选 Slidev)你成功导出了 PDF
- [ ] (选 guizang-ppt-skill)你说清楚了 Claude 选用的版式理由
- [ ] 你写出了"为什么选这个工具"的分析
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
