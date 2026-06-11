# 第 T33 课 · markdownlint 批量校验 Markdown 文档规范

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★☆☆ ｜ 源头:markdownlint 官方仓库 · [github.com/DavidAnson/markdownlint](https://github.com/DavidAnson/markdownlint) · markdownlint-cli2 · [github.com/DavidAnson/markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)

---

## 📖 你要学会什么

学完这一课,你能用 markdownlint 一次性扫描一整个文件夹里所有的 Markdown 文件,揪出格式不规范的地方——标题层级乱跳、列表缩进不统一、多余的空行、行末多余空格……这些小毛病肉眼看不出来,但会让渲染出来的文章版面奇奇怪怪,还会让自动化处理工具出错。

想象你手上有一叠几十篇文章草稿,老板要上传到官网。你一篇一篇翻看格式,眼睛花了也未必能查全。markdownlint 就像一个**见过成千上万份文章的"文字编辑机器人"**:它拿着一份规则手册,从第一个字符扫到最后一个字符,哪里不对就标出来——位置精确到行号,原因说得清清楚楚。

本仓库的 `content/posts/` 目录就是很好的演示对象——可以直接对它跑扫描,看看哪些文章有格式问题。

**官方资料:**
- markdownlint(Node.js 库): [github.com/DavidAnson/markdownlint](https://github.com/DavidAnson/markdownlint)
- markdownlint-cli2(命令行工具,推荐): [github.com/DavidAnson/markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)
- 规则完整列表: [github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- Python 版本(pymarkdownlnt): [github.com/jackdewinter/pymarkdown](https://github.com/jackdewinter/pymarkdown)

---

## 🧠 核心原则

1. **它查的是"规范",不是"内容好不好"。** markdownlint 不关心你写的文章逻辑通不通、有没有错别字——它只管格式:标题有没有空行、缩进是不是一致、有没有重复的 `<h1>`。这是个**结构合规**的工具,不是内容评审工具。

2. **规则可以按需关闭。** markdownlint 有 50+ 条规则,但不是每条都适合每个项目。比如规则 `MD013` 要求行长度不超过 80 字符——但中文文章常常一句话就超了。可以在 `.markdownlint.json` 配置文件里把不适用的规则关掉,只保留你真正在意的那些。

3. **扫描前先看,修改前先问。** `markdownlint-cli2` 默认只扫描、不修改文件。它有 `--fix` 模式可以自动修复部分问题——但**在主人的文章目录里跑 `--fix` 前,必须先征得主人确认**。文章是内容资产,不能随意改动。

4. **配置文件决定规则集。** `.markdownlint.json`(或 `.markdownlint.yaml`)放在项目根目录或子目录,扫描时自动生效。可以全局开/关规则,也可以针对某条规则调整参数(比如允许行长度 120 而不是 80)。

5. **在 CI 里接上它是标配。** 很多开源项目会在 GitHub Actions 里加一步 markdownlint 扫描——提交文档时自动检查,格式不过不让合并。这是文档质量的守门员。

---

## 🛠 操作要点

### 安装(两种方式任选)

**方式一:Node.js 版(推荐,功能更全)**

```bash
# 全局安装命令行工具
npm install -g markdownlint-cli2

# 验证安装
markdownlint-cli2 --version
```

**方式二:Python 版(项目只有 Python 环境时)**

```bash
pip install pymarkdownlnt

# 验证
pymarkdown --version
```

> ⚠️ **安装前先问主人。** 全局安装会影响系统环境。

### 立刻可用的扫描命令(无需安装,用 npx)

```bash
# 不安装也能用——npx 临时下载并执行
# 扫描当前目录下所有 .md 文件
npx markdownlint-cli2 "**/*.md"

# 扫描特定目录
npx markdownlint-cli2 "content/posts/**/*.md"

# 只扫描单个文件
npx markdownlint-cli2 README.md
```

> 好消息:这个命令只**读文件、输出报告,不改任何文件**——相对安全,可以在本仓库直接演示。

### 配置文件(`.markdownlint.json`)

```json
{
  "default": true,
  "MD013": false,
  "MD033": false,
  "MD041": false,
  "MD007": { "indent": 2 }
}
```

配置说明:
- `"default": true` → 默认开启所有规则
- `"MD013": false` → 关掉"行长度限制"(中文文章友好)
- `"MD033": false` → 关掉"不允许 HTML 标签"(有些文章用了 HTML)
- `"MD041": false` → 关掉"第一行必须是 h1 标题"
- `"MD007": { "indent": 2 }` → 列表缩进统一用 2 格

### 最常见的报错及含义

| 规则 ID | 含义 | 例子 |
|---------|------|------|
| MD001 | 标题层级不能跳跃(h1 直接跳到 h3) | `# 标题` 后面直接 `### 三级` |
| MD009 | 行末有多余空格 | `这里有空格   ` |
| MD010 | 使用了 Tab 缩进(应该用空格) | 列表里按了 Tab 键 |
| MD012 | 连续多个空行 | 两段之间有 3 个空行 |
| MD022 | 标题前后没有空行 | 正文紧接着标题没空行 |
| MD025 | 文件里有多个 `# h1` 标题 | 出现了两个 `# 标题` |
| MD031 | 代码块前后没有空行 | 代码块紧贴正文 |
| MD034 | URL 没有包在尖括号或链接里 | 裸露的 `https://...` |

### 在本仓库 content/posts 上演示(只读,不改文件)

```bash
# 在本仓库根目录执行
# 先看看有多少 md 文件
ls content/posts/*.md | wc -l

# 扫描所有文章,输出报告
npx markdownlint-cli2 "content/posts/**/*.md"

# 只看报错条数汇总
npx markdownlint-cli2 "content/posts/**/*.md" 2>&1 | tail -5
```

> 这是只读操作,不修改任何文件,可以安全演示。

### 自动修复(谨慎使用,用前问主人)

```bash
# --fix 会直接修改文件(修复可自动修复的问题)
# 执行前先备份!或者确认 git 状态干净,改坏了可以回滚
npx markdownlint-cli2 --fix "content/posts/**/*.md"
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:对本仓库 `content/posts/` 目录做一次 markdownlint 扫描,分析结果并提出改进建议。**

1. **写出扫描命令**:
   ```bash
   npx markdownlint-cli2 "content/posts/**/*.md" 2>&1 | head -60
   ```
   这个命令只读取文件,不修改任何内容——直接执行,无需额外确认。

2. **读取并分析输出**:
   - 列出出现次数最多的前 3 个规则 ID
   - 解释每个规则 ID 的含义(对照上面的"常见报错"表)
   - 选 1 个具体的文件和行号,把那个具体的问题描述出来

3. **写出针对本仓库的 `.markdownlint.json` 配置**:根据扫描结果,决定哪些规则适合这个仓库、哪些该关掉(比如中文内容不适合 MD013 行长度限制)。

4. **写出"如果要修复"的方案**:
   - 哪些问题可以用 `--fix` 自动修复?
   - 哪些问题需要人工修改?
   - 给主人的建议:**是否值得修复,修复前有什么注意事项?**

5. **沉淀技能卡**:把常见规则速查表、配置文件模板、扫描命令沉淀成 `skills/markdownlint.md`。

> 本课毕业测验的扫描步骤(只读)可以直接执行;如果要用 `--fix` 自动修改文件、或修改 `.markdownlint.json` 配置文件并提交——**必须先征得主人确认**。

---

## 🎓 过关标准

- [ ] 你能写出正确的 `npx markdownlint-cli2` 扫描命令,包含 glob 路径
- [ ] 你能**读懂报错输出**:文件名、行号、规则 ID、描述,各是哪部分
- [ ] 你能解释 MD001、MD013、MD022、MD025 各自是什么问题
- [ ] 你写出了适合本仓库的 `.markdownlint.json` 配置,并说明选择原因
- [ ] 你区分了"可自动修复"和"需人工修复"的问题类型
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T34 课。
