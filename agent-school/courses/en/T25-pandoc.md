> 🌐 English ｜ [中文](../T25-pandoc.md)

# Lesson T25 · pandoc: The Universal Document Converter

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: pandoc official docs · [pandoc.org/getting-started.html](https://pandoc.org/getting-started.html) · [pandoc.org/chunkedhtml/index.html](https://pandoc.org/chunkedhtml/index.html) · [github.com/jgm/pandoc](https://github.com/jgm/pandoc)

---

## 📖 What you'll learn

After this lesson, you'll be able to use a single command to turn Markdown into Word, Word into HTML, or Markdown into PDF — like carrying a document format translator in your pocket, so you'll never need to go through "open Word → Save As → choose format" manually again.

Picture this: you've written a beautiful Markdown report. Your boss wants a Word version, your client wants a PDF, and your website needs HTML. In the old days you'd convert it three times by hand. Now you have pandoc — **like a translator who speaks 40 "file languages"**. Hand it the original, say "translate this to English/French/Japanese," and a second later you have the version you need.

pandoc is an open-source command-line tool developed by John MacFarlane, often called "the Swiss Army knife of documents." It supports 40+ formats including Markdown, Word (.docx), PDF, HTML, LaTeX, and EPUB. The latest stable release is the 3.x series.

**Official resources:**
- Getting started: [pandoc.org/getting-started.html](https://pandoc.org/getting-started.html)
- Full manual: [pandoc.org/chunkedhtml/index.html](https://pandoc.org/chunkedhtml/index.html)
- GitHub repo: [github.com/jgm/pandoc](https://github.com/jgm/pandoc)
- Installation page: [pandoc.org/installing.html](https://pandoc.org/installing.html)

---

## 🧠 Core principles

1. **Formats are specified by file extension or explicitly with `-f`/`-t`.** pandoc is smart — most of the time it can infer the format from the filename extension. But when it guesses wrong, things break. In ambiguous cases, be explicit with `-f markdown -t docx` instead of letting it guess.

2. **PDF conversion requires an extra engine — don't be alarmed by the error.** The Markdown → PDF path doesn't work out of the box. pandoc doesn't draw PDFs directly; it needs a helper like LaTeX (e.g., TeX Live) or Weasyprint. If all you need is Markdown→Word or Markdown→HTML, you don't need any of that. **Start with the simplest path; only tackle PDF when you specifically need it.**

3. **A Word template makes the output look professional.** The default `.docx` output is plain. Use `--reference-doc=my-template.docx` to apply your organization's template — font, colors, and heading styles all follow the template.

4. **`-o` specifies the output file; without it, output goes to the terminal.** `pandoc input.md -o output.docx` creates a file. Without `-o`, pandoc dumps HTML source to your terminal — don't be startled, that's normal behavior.

5. **Write metadata (title/author/date) as a YAML front matter block.** At the very top of your Markdown file, add:
   ```yaml
   ---
   title: "My Report"
   author: "Jane Smith"
   date: "2026-06-11"
   ---
   ```
   When converting to Word or PDF, this information is automatically populated into the document properties.

---

## 🛠 How to do it

### Installation

> ⚠️ **Installation note: the commands below involve system-level software installation. Do not install or run without the owner's confirmation — present the plan first.**

```bash
# macOS (Homebrew)
brew install pandoc

# Linux (Debian/Ubuntu)
sudo apt install pandoc

# Windows (Scoop or winget)
scoop install pandoc
# or
winget install JohnMacFarlane.Pandoc

# You can also download an installer from the official site:
# https://pandoc.org/installing.html
```

> Both `apt install pandoc` and `brew install pandoc` work without a VPN. Ubuntu users should set up a fast mirror (such as aliyun or tsinghua) before installing.

### Minimal runnable example (offline, local file operations only)

First, prepare a test Markdown file:

```bash
cat > /tmp/test.md << 'EOF'
---
title: "Test Report"
author: "Alex"
date: "2026-06-11"
---

# Section 1: Overview

This is a test document. pandoc will convert it to Word.

## 1.1 Background

**Bold**, *italic*, and `code` are all supported.

# Section 2: Conclusion

A successful conversion means it's working.
EOF
```

**Markdown → HTML (fastest, no extra dependencies)**:
```bash
pandoc /tmp/test.md -o /tmp/test.html
# Verify: test.html exists and contains <h1> tags
```

**Markdown → Word**:
```bash
pandoc /tmp/test.md -o /tmp/test.docx
# Verify: test.docx exists (use the file command to confirm it's Office format)
file /tmp/test.docx
# Expected output: .../test.docx: Microsoft Word 2007+
```

**Markdown → Markdown (verify pandoc is working)**:
```bash
echo "**Hello pandoc**" | pandoc -f markdown -t plain
# Expected output: Hello pandoc (no asterisks — rendered)
```

### Common conversion quick reference

| What you want | Command |
|---------------|---------|
| Markdown → HTML | `pandoc in.md -o out.html` |
| Markdown → Word | `pandoc in.md -o out.docx` |
| Word → Markdown | `pandoc in.docx -o out.md` |
| HTML → Markdown | `pandoc in.html -o out.md` |
| Markdown → EPUB | `pandoc in.md -o out.epub` |
| Markdown → PDF (requires LaTeX) | `pandoc in.md -o out.pdf` |
| Apply Word template | `pandoc in.md --reference-doc=template.docx -o out.docx` |
| Add table of contents | `pandoc in.md --toc -o out.html` |
| List supported formats | `pandoc --list-output-formats` |
| Check version | `pandoc --version` |

### PDF generation (advanced — requires additional installation)

> ⚠️ **The PDF path involves installing large software (TeX Live ~4 GB). Do not proceed without the owner's confirmation.**

```bash
# Option 1: via LaTeX (recommended — highest quality, larger files)
sudo apt install texlive-xetex texlive-lang-chinese
pandoc in.md --pdf-engine=xelatex -o out.pdf

# Option 2: via HTML intermediate layer (requires weasyprint — lighter)
pip install weasyprint
pandoc in.md --pdf-engine=weasyprint -o out.pdf
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use pandoc to convert a Markdown document into Word and HTML — show the real commands and verification results.**

The test data is embedded below; copy and run it directly (no internet connection needed):

```bash
# Step 1: generate the test Markdown
cat > /tmp/pandoc_test.md << 'EOF'
---
title: "pandoc Graduation Test"
author: "AI agent"
date: "2026-06-11"
---

# Project Summary

This report verifies pandoc's document conversion capabilities.

## Core Data

| Format | Direction | Status |
|--------|-----------|--------|
| HTML | md → html | pending |
| Word | md → docx | pending |

**Conclusion:** all format conversions passed.
EOF
```

Complete the following 3 tasks and include the real commands + output:

**Task 1: Convert to HTML and verify**
```bash
pandoc /tmp/pandoc_test.md -o /tmp/pandoc_test.html
# Verify:
ls -lh /tmp/pandoc_test.html
grep -c "<h" /tmp/pandoc_test.html   # should output ≥ 2 (h1/h2 tags present)
```

**Task 2: Convert to Word and verify**
```bash
pandoc /tmp/pandoc_test.md -o /tmp/pandoc_test.docx
# Verify:
file /tmp/pandoc_test.docx    # should show Microsoft Word 2007+
ls -lh /tmp/pandoc_test.docx  # file should be > 0 bytes
```

**Task 3: Convert Word back to Markdown**
```bash
pandoc /tmp/pandoc_test.docx -o /tmp/pandoc_back.md
cat /tmp/pandoc_back.md   # should show the original headings and table content
```

**Write the acceptance criteria:**
- Task 1: `pandoc_test.html` exists, size > 0, contains `<h1>` or `<h2>` tags
- Task 2: `pandoc_test.docx` exists, `file` command confirms it's Word format
- Task 3: `pandoc_back.md` exists and contains "Project Summary" and other keywords

**Distill a skill card** with common conversion commands and Word template usage into `skills/pandoc.md`.

> ⚠️ **Safety boundary**: pandoc only reads and writes local files — it does not access the network. However, **pandoc must be installed with the owner's confirmation first**. PDF conversion requires large dependencies like LaTeX — inform the owner of the disk space requirement (TeX Live ≈ 4 GB) before installing.

---

## 🎓 Pass criteria

- [ ] You successfully converted Markdown to HTML and provided real commands + output
- [ ] You successfully converted Markdown to Word (.docx) and verified the format with the `file` command
- [ ] You performed the reverse conversion of Word back to Markdown
- [ ] You can explain why Markdown → PDF is more complex than → Word (requires an extra engine)
- [ ] Distilled 1 skill card into [`skills/`](../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T26.
