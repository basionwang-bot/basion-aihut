# 第 T25 课 · pandoc 文档万能转换器

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:pandoc 官方文档 · [pandoc.org/getting-started.html](https://pandoc.org/getting-started.html) · [pandoc.org/chunkedhtml/index.html](https://pandoc.org/chunkedhtml/index.html) · [github.com/jgm/pandoc](https://github.com/jgm/pandoc)

---

## 📖 你要学会什么

学完这一课,你能用一条命令把 Markdown 变成 Word、Word 变成 HTML、Markdown 变成 PDF——像一台随身携带的文件格式翻译机,再也不用"打开 Word → 另存为 → 选格式"这套人工流水线。

想象这样一个场景:你写完了一篇漂亮的 Markdown 报告,老板要 Word 版,客户要 PDF 版,网站要 HTML 版。以前你得手动转三次。现在你有了 pandoc——**就像一个会说 40 种"文件语言"的翻译官**,你把原件递给他,告诉他"翻成英文/法文/日文",一秒钟就给你一份。

pandoc 是 John MacFarlane 开发的开源命令行工具,号称"文档界的瑞士军刀",支持 Markdown、Word(.docx)、PDF、HTML、LaTeX、EPUB 等 40+ 种格式的互相转换。最新稳定版为 3.x 系列。

**官方资料:**
- 快速上手: [pandoc.org/getting-started.html](https://pandoc.org/getting-started.html)
- 完整手册: [pandoc.org/chunkedhtml/index.html](https://pandoc.org/chunkedhtml/index.html)
- GitHub 仓库: [github.com/jgm/pandoc](https://github.com/jgm/pandoc)
- 安装页面: [pandoc.org/installing.html](https://pandoc.org/installing.html)

---

## 🧠 核心原则

1. **格式靠扩展名或 `-f`/`-t` 显式指定。** pandoc 很聪明,大多数时候看文件名后缀就能猜到格式。但猜错了就翻车——碰到模糊情况,用 `-f markdown -t docx` 显式说清楚,别让它猜。

2. **PDF 转换需要额外引擎,别被报错吓到。** Markdown → PDF 这条路,pandoc 自己不直接画 PDF,它需要借助 LaTeX(如 TeX Live)或 Weasyprint 等引擎。如果你只需要 Markdown→Word 或 Markdown→HTML,完全不需要装这些。**先选最简单的路,需要 PDF 再单独处理。**

3. **Word 模板让输出"看起来像样"。** 默认转出来的 .docx 样式很朴素。你可以用 `--reference-doc=my-template.docx` 把自己公司的模板套上去——字体、颜色、标题样式全都跟着模板走。

4. **`-o` 指定输出文件,不指定就输出到终端。** `pandoc input.md -o output.docx` 才会生成文件;不加 `-o` 直接在终端刷出一堆 HTML 源码——别被吓到,是正常行为。

5. **元数据(标题/作者/日期)用 YAML 头写进文件。** 在 Markdown 文件最顶部加:
   ```yaml
   ---
   title: "我的报告"
   author: "张三"
   date: "2026-06-11"
   ---
   ```
   转成 Word 或 PDF 时这些信息会自动填入文档属性。

---

## 🛠 操作要点

### 安装

> ⚠️ **安装须知:以下命令涉及系统软件安装,未经主人确认不得真装真跑,只先给方案。**

```bash
# macOS(Homebrew)
brew install pandoc

# Linux(Debian/Ubuntu/国内大多数服务器)
sudo apt install pandoc

# Windows(Scoop 或 winget)
scoop install pandoc
# 或
winget install JohnMacFarlane.Pandoc

# 也可在官网下载安装包:https://pandoc.org/installing.html
```

> 🇨🇳 **中国用户提示:** `apt install pandoc` 和 `brew install pandoc` 均可在国内直接使用,无需科学上网。Ubuntu 用户建议先换好国内镜像源(如阿里云/清华源)再安装。

### 最小可运行示例(不联网,本地纯文件操作)

先准备一个测试 Markdown 文件:

```bash
cat > /tmp/test.md << 'EOF'
---
title: "测试报告"
author: "小明"
date: "2026-06-11"
---

# 一、概述

这是一份测试文档。pandoc 会把它变成 Word。

## 1.1 背景

**加粗**、*斜体*、`代码`都支持。

# 二、结论

转换成功即为合格。
EOF
```

**Markdown → HTML(最快,无需额外依赖)**:
```bash
pandoc /tmp/test.md -o /tmp/test.html
# 验证:test.html 文件存在且包含 <h1> 标签
```

**Markdown → Word**:
```bash
pandoc /tmp/test.md -o /tmp/test.docx
# 验证:test.docx 存在(用 file 命令确认是 zip/Office 格式)
file /tmp/test.docx
# 期望输出: .../test.docx: Microsoft Word 2007+
```

**Markdown → Markdown(验证 pandoc 可用)**:
```bash
echo "**Hello pandoc**" | pandoc -f markdown -t plain
# 期望输出: Hello pandoc(无星号,已渲染)
```

### 常用转换速查

| 想干嘛 | 命令 |
|--------|------|
| Markdown → HTML | `pandoc in.md -o out.html` |
| Markdown → Word | `pandoc in.md -o out.docx` |
| Word → Markdown | `pandoc in.docx -o out.md` |
| HTML → Markdown | `pandoc in.html -o out.md` |
| Markdown → EPUB | `pandoc in.md -o out.epub` |
| Markdown → PDF(需 LaTeX) | `pandoc in.md -o out.pdf` |
| 套用 Word 模板 | `pandoc in.md --reference-doc=模板.docx -o out.docx` |
| 加目录 | `pandoc in.md --toc -o out.html` |
| 查支持格式列表 | `pandoc --list-output-formats` |
| 查版本 | `pandoc --version` |

### PDF 生成说明(进阶,需额外安装)

> ⚠️ **PDF 路径涉及安装大型软件(TeX Live 约 4GB),未经主人确认不得执行。**

```bash
# 方案一:通过 LaTeX(推荐质量最高,文件大)
sudo apt install texlive-xetex texlive-lang-chinese
pandoc in.md --pdf-engine=xelatex -o out.pdf

# 方案二:通过 HTML 中间层(需安装 weasyprint,轻量)
pip install weasyprint
pandoc in.md --pdf-engine=weasyprint -o out.pdf
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 pandoc 把一段 Markdown 文档转成 Word 和 HTML,附上真实命令和验证结果。**

测试数据已内嵌,直接复制即可运行(无需联网):

```bash
# 第一步:生成测试 Markdown
cat > /tmp/pandoc_test.md << 'EOF'
---
title: "pandoc 毕业测验"
author: "AI agent"
date: "2026-06-11"
---

# 项目摘要

本报告验证 pandoc 文档转换能力。

## 核心数据

| 格式 | 转换方向 | 是否成功 |
|------|----------|----------|
| HTML | md → html | 待测 |
| Word | md → docx | 待测 |

**结论:**格式转换全部通过。
EOF
```

完成以下 3 个任务并附上真实命令 + 输出:

**任务一:转成 HTML 并验证**
```bash
pandoc /tmp/pandoc_test.md -o /tmp/pandoc_test.html
# 验证:
ls -lh /tmp/pandoc_test.html
grep -c "<h" /tmp/pandoc_test.html   # 应输出 ≥ 2(有 h1/h2 标签)
```

**任务二:转成 Word 并验证**
```bash
pandoc /tmp/pandoc_test.md -o /tmp/pandoc_test.docx
# 验证:
file /tmp/pandoc_test.docx    # 应显示 Microsoft Word 2007+
ls -lh /tmp/pandoc_test.docx  # 文件应 > 0 字节
```

**任务三:Word 反向转回 Markdown**
```bash
pandoc /tmp/pandoc_test.docx -o /tmp/pandoc_back.md
cat /tmp/pandoc_back.md   # 应看到原始标题和表格内容
```

**写出验证标准:**
- 任务一:`pandoc_test.html` 存在,大小 > 0,含 `<h1>` 或 `<h2>` 标签
- 任务二:`pandoc_test.docx` 存在,`file` 命令确认是 Word 格式
- 任务三:`pandoc_back.md` 存在,能看到"项目摘要"等关键词

**沉淀技能卡:** 把常用转换命令 + Word 模板用法沉淀成 `skills/pandoc.md`。

> ⚠️ **安全边界:** pandoc 本身只读写本地文件,不联网。但**安装 pandoc 前必须先征得主人确认**。PDF 转换需要 LaTeX 等大型依赖,安装前必须告知主人磁盘占用(TeX Live ≈ 4GB)。

---

## 🎓 过关标准

- [ ] 你成功把 Markdown 转成了 HTML,附上了真实命令 + 输出
- [ ] 你成功把 Markdown 转成了 Word(.docx),用 `file` 命令验证了格式
- [ ] 你做了 Word 反向转回 Markdown 的实验
- [ ] 你能说清楚"为什么 Markdown→PDF 比→Word 复杂"(需要额外引擎)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T26 课。
