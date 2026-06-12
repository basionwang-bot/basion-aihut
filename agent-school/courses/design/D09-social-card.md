# 第 D09 课 · 一句话出小红书图文+公众号封面

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★ ｜ 源头:[op7418/guizang-social-card-skill](https://github.com/op7418/guizang-social-card-skill)（3.36k ⭐）

---

## 📖 你要学会什么

你有没有见过这种场景:主人写了一篇干货文章,想发到小红书——但小红书不能贴链接,必须做成图文。于是主人开 Canva,一张张排版,找图,调字号,搞了两小时……最后还不一定好看。

**这门课要解决的,就是这个效率陷阱。**

主角叫 **guizang-social-card-skill**,是内容创作者「归藏」开源的一套 Claude Code skill。它的思路是:把文章内容交给 Claude,Claude 按照预先设计好的精美版式,生成 HTML 页面,再用 Node.js + Playwright 把 HTML 渲染成 PNG 图片——整个过程不需要开设计软件,Claude 说话算数。

这套工具内置两套视觉系统:
- **Editorial(电子杂志风)**:叙事感强,适合观点分享、情感内容、个人风格表达
- **Swiss(瑞士国际主义风)**:网格严谨、高饱和锚点色,适合数据、产品、方法论

支持的输出格式:
- 小红书 3:4 竖版(1080×1440)
- 公众号 21:9 头图(2100×900)
- 公众号 1:1 分享卡(1080×1080)

完全在本地运行,国内用户直接可用,无需 API key,无需翻墙。

**官方资料:**
- 仓库:[github.com/op7418/guizang-social-card-skill](https://github.com/op7418/guizang-social-card-skill)
- 作者 X(原 Twitter):[x.com/op7418](https://x.com/op7418)

---

## 🧠 核心原则

1. **Skill 是 Claude 的"专项本领包"。** 把它理解成一个装在 Claude Code 里的工作手册:安装后,Claude 会读取 `SKILL.md` 里的规则和版式指南,按图索骥地生成内容。你不需要告诉 Claude 怎么排版,这份手册里都写好了。

2. **HTML → PNG 是这套流程的关键。** 先生成单文件 HTML(所有样式内联),再用 `node render.mjs` 调起 Playwright 的无头浏览器,截图输出 PNG。所以本地需要有 Node.js 和 Playwright 环境——安装前记得和主人确认。

3. **主题色是预设的,不能随便填 hex。** Editorial 有 6 套主题(墨水经典、靛蓝瓷、森林墨、牛皮纸、沙丘、Midnight Ink 暗色),Swiss 有 4 套锚点色(IKB Klein Blue 蓝、柠檬黄、柠檬绿、安全橙)。接任务时要问清楚主人想要哪种风格。

4. **图源有优先级,不要乱用图。** 工具会按照"用户提供的图 → Unsplash → Pexels → Wallhaven"的顺序取图,并记录图源到 `SOURCES.md`。要让主人知道图片来源,版权意识要有。

5. **先征得主人确认,再安装、再生成。** 安装需要 `git clone` 到主人的 `~/.claude/skills/` 目录;渲染需要 Node.js 执行权限;取网络图片需要访问外部网站——这些都要先告知主人。

---

## 🛠 操作要点

### 安装 guizang-social-card-skill

**方式一:一行命令(推荐)**

```bash
npx skills add https://github.com/op7418/guizang-social-card-skill --skill guizang-social-card-skill
```

**方式二:手动 git clone**

```bash
git clone https://github.com/op7418/guizang-social-card-skill.git ~/.claude/skills/guizang-social-card-skill
```

安装完后,验证以下文件存在:

```bash
ls ~/.claude/skills/guizang-social-card-skill/
# 应该看到:SKILL.md  assets/  references/  render.mjs  validate-social-deck.mjs
```

> ⚠️ **安装前先征得主人确认。** `~/.claude/skills/` 是 Claude Code 的 skill 目录,安装会 clone 一个仓库到主人电脑上,需要告知主人。

> 🇨🇳 **中国用户提示:** git clone GitHub 仓库在国内可能较慢或失败,建议主人配置代理,或使用 Gitee/GitHub 镜像站加速。

### 运行环境要求

渲染 PNG 需要 Node.js + Playwright:

```bash
# 确认 Node.js 已安装(需要 >= 18)
node --version

# 进入 skill 目录安装依赖(先征得主人确认)
cd ~/.claude/skills/guizang-social-card-skill
npm install
```

> ⚠️ **`npm install` 会下载 Playwright 依赖(包括浏览器二进制),体积较大,需要网络和主人确认。**

### 触发 Skill 生成图文

安装完成后,直接在 Claude Code 里对话触发:

```text
帮我做一套小红书图文
```

```text
帮我基于这篇文章做一套瑞士风小红书图文,5 张,IKB 蓝
```

```text
帮我把这篇笔记做成公众号封面对:21:9 头图 + 1:1 分享卡,视觉保持一致
```

```text
帮我基于这篇文章做一套小红书 3:4,标题用电子杂志风,Midnight Ink 暗色主题
```

### 渲染输出 PNG

Claude 生成 HTML 后,运行渲染命令:

```bash
node render.mjs
```

输出文件在 `output/` 目录下,直接是可发布的 PNG 文件。

### 校验图文质量

```bash
node validate-social-deck.mjs path/to/task-dir
```

这个脚本会检查:文字是否溢出、字号是否合规、图片槽位是否正确填充。

### 28 个版式骨架速查

**Editorial 系(叙事感):**

| 编号 | 版式名 | 适合内容 |
|------|--------|----------|
| M01 | Image-Led Cover | 全图封面,氛围照片 |
| M02 | Title + Subtitle | 标题页,主题明确 |
| M06 | Pipeline | 步骤流程讲解 |
| M08 | Before/After | 对比效果展示 |
| M16 | 图片网格 | 多图展示合集 |

**Swiss 系(事实结构):**

| 编号 | 版式名 | 适合内容 |
|------|--------|----------|
| S01 | Cover | 干净封面 |
| S09 | KPI Tower | 数据大字报 |
| S10 | H-Bar Chart | 横向对比图 |
| S12 | Matrix + Hero | 矩阵+主图 |

---

## 📝 毕业测验(必须真做,交证据)

**任务:把一篇课程笔记自动排成可发布的小红书九宫格图文和一组公众号封面。**

**阶段一:安装与准备(先征得主人确认)**

1. 征得主人确认后,安装 skill:
   ```bash
   npx skills add https://github.com/op7418/guizang-social-card-skill --skill guizang-social-card-skill
   ```
   截图证明 `~/.claude/skills/guizang-social-card-skill/SKILL.md` 文件存在。

2. 确认 Node.js 版本 >= 18,截图 `node --version` 输出。

3. 进入 skill 目录执行 `npm install`(**先征得主人确认**),截图完成输出。

**阶段二:生成小红书图文**

4. 选一篇课程笔记(可以用这门课的笔记),发给 Claude Code:
   ```text
   帮我把这篇笔记做成 5 张小红书图文,瑞士风,IKB 蓝
   ```
   截图 Claude 生成的 HTML 文件列表。

5. 运行 `node render.mjs` 渲染,截图 `output/` 目录里生成的 PNG 文件(至少 5 张)。

6. 打开其中一张 PNG,截图实际图文效果。

**阶段三:生成公众号封面对**

7. 用同一份内容,发给 Claude Code:
   ```text
   帮我把这篇笔记做成公众号封面对:21:9 头图 + 1:1 分享卡,电子杂志风,保持视觉一致
   ```
   截图渲染出的两张封面 PNG。

**阶段四:说清楚工作原理**

8. 用你自己的话说明:
   - "HTML → PNG"这条流程经过哪些步骤?
   - `render.mjs` 在里面起什么作用?
   - 为什么不直接让 Claude 输出图片,而要先出 HTML?

**阶段五:沉淀技能卡**

9. 把"安装步骤 + 触发命令 + 渲染命令 + 主题/风格速查表"沉淀成 `skills/social-card.md`。

> ⚠️ **安全边界:**
> - 安装 skill(git clone)——**先征得主人确认**
> - `npm install` 下载依赖——**先告知主人,体积较大**
> - 工具取网络图片(Unsplash/Pexels)——**确认主人知晓图片来源**
> - 只生成草稿图文,**不替主人发布到任何平台**;发布动作必须由主人自己完成

---

## 🎓 过关标准

- [ ] 你能说出 Editorial 和 Swiss 两套视觉系统各适合什么内容
- [ ] 你成功安装了 skill,截图证明目录和文件存在
- [ ] 你触发 Claude 生成了 5 张小红书图文 HTML,并渲染出了 PNG(截图)
- [ ] 你生成了公众号封面对(21:9 + 1:1 各一张)
- [ ] 你用自己的话说清楚了"HTML → PNG"流程
- [ ] 你知道 10 套主题预设的名字,能按主人要求选对主题
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
