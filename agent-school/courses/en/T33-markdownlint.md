> 🌐 English ｜ [中文](../T33-markdownlint.md)

# Lesson T33 · markdownlint: Batch-Checking Markdown Document Standards

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★☆☆ ｜ Source: markdownlint official repo · [github.com/DavidAnson/markdownlint](https://github.com/DavidAnson/markdownlint) · markdownlint-cli2 · [github.com/DavidAnson/markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)

---

## 📖 What you'll learn

After this lesson, you'll be able to use markdownlint to scan an entire folder of Markdown files in one pass — catching heading levels that skip a rank, inconsistent list indentation, extra blank lines, trailing spaces at line ends … these small issues are invisible to the naked eye, but they make rendered articles look odd and cause automated processing tools to fail.

Imagine you have a stack of dozens of article drafts to upload to a website. Checking the format of each one by one would strain your eyes and still miss things. markdownlint is like a **"copy-editor robot that has seen thousands of documents"**: it works through a rulebook, scanning from the first character to the last, marking every deviation — with the line number pinpointed and the reason stated clearly.

This repository's `content/posts/` directory is a perfect demonstration target — you can run a scan directly on it and see which articles have formatting issues.

**Official resources:**
- markdownlint (Node.js library): [github.com/DavidAnson/markdownlint](https://github.com/DavidAnson/markdownlint)
- markdownlint-cli2 (command-line tool, recommended): [github.com/DavidAnson/markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)
- Complete rules list: [github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- Python version (pymarkdownlnt): [github.com/jackdewinter/pymarkdown](https://github.com/jackdewinter/pymarkdown)

---

## 🧠 Core principles (internalize these as habits)

1. **It checks "standards", not "whether the content is good".** markdownlint doesn't care whether your article makes logical sense or has typos — it only checks structure: does a heading have a blank line before it, is indentation consistent, are there duplicate `<h1>` headings. This is a **structural compliance** tool, not a content review tool.

2. **Rules can be turned off as needed.** markdownlint has 50+ rules, but not every rule fits every project. For example, rule `MD013` requires lines to be no longer than 80 characters — but that's often unrealistic for prose. In your `.markdownlint.json` config file, you can disable any rules that don't apply to your project, keeping only the ones you actually care about.

3. **Scan first, ask before fixing.** `markdownlint-cli2` scans by default and does not modify files. It has a `--fix` mode that auto-corrects some issues — but **before running `--fix` on the owner's article directory, you must get the owner's confirmation.** Articles are content assets; they must not be modified arbitrarily.

4. **The config file determines the rule set.** `.markdownlint.json` (or `.markdownlint.yaml`), placed in the project root or a subdirectory, takes effect automatically when scanning. You can enable/disable rules globally or adjust parameters for specific rules (e.g., allow line lengths up to 120 instead of 80).

5. **Wiring it into CI is standard practice.** Many open-source projects add a markdownlint scan step in GitHub Actions — when documentation is committed, it's automatically checked, and a failed format check blocks the merge. This is the guardian of documentation quality.

---

## 🛠 How to do it

### Installation (choose one)

**Option 1: Node.js version (recommended — more features)**

```bash
# Install the command-line tool globally
npm install -g markdownlint-cli2

# Verify installation
markdownlint-cli2 --version
```

**Option 2: Python version (when the project has only a Python environment)**

```bash
pip install pymarkdownlnt

# Verify
pymarkdown --version
```

> ⚠️ **Ask the owner before installing.** A global install affects the system environment.

### Ready-to-use scan commands (no installation needed, via npx)

```bash
# No installation required — npx downloads and runs it temporarily
# Scan all .md files in the current directory
npx markdownlint-cli2 "**/*.md"

# Scan a specific directory
npx markdownlint-cli2 "content/posts/**/*.md"

# Scan a single file
npx markdownlint-cli2 README.md
```

> Good news: this command only **reads files and outputs a report — it does not modify any files** — making it relatively safe to run as a live demonstration in this repo.

### Config file (`.markdownlint.json`)

```json
{
  "default": true,
  "MD013": false,
  "MD033": false,
  "MD041": false,
  "MD007": { "indent": 2 }
}
```

Config notes:
- `"default": true` → enable all rules by default
- `"MD013": false` → disable "line length limit" (friendlier for prose)
- `"MD033": false` → disable "no inline HTML" (some articles use HTML tags)
- `"MD041": false` → disable "first line must be an h1 heading"
- `"MD007": { "indent": 2 }` → require 2-space list indentation consistently

### Most common errors and their meanings

| Rule ID | Meaning | Example |
|---------|---------|---------|
| MD001 | Heading levels must not skip ranks (h1 jumping directly to h3) | `# Title` followed immediately by `### Third level` |
| MD009 | Trailing spaces at end of line | `trailing spaces here   ` |
| MD010 | Tab used for indentation (should use spaces) | Tab key pressed inside a list |
| MD012 | Multiple consecutive blank lines | Three blank lines between two paragraphs |
| MD022 | Headings must be surrounded by blank lines | Body text immediately above or below a heading |
| MD025 | Multiple `# h1` headings in the same file | Two occurrences of `# Title` |
| MD031 | Fenced code blocks must be surrounded by blank lines | Code block touching body text directly |
| MD034 | Bare URL not wrapped in angle brackets or a link | Naked `https://...` in the text |

### Live demo on this repo's content/posts (read-only — no files modified)

```bash
# Run from the repo root
# First, count how many .md files there are
ls content/posts/*.md | wc -l

# Scan all articles and output the report
npx markdownlint-cli2 "content/posts/**/*.md"

# View just a summary of the error count
npx markdownlint-cli2 "content/posts/**/*.md" 2>&1 | tail -5
```

> This is a read-only operation — no files are modified. Safe to run as a live demonstration.

### Auto-fix (use cautiously — ask the owner first)

```bash
# --fix modifies files directly (fixes auto-fixable issues)
# Back up first! Or confirm git status is clean so you can roll back if needed
npx markdownlint-cli2 --fix "content/posts/**/*.md"
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: run a markdownlint scan on this repo's `content/posts/` directory, analyze the results, and propose improvement recommendations.**

1. **Write out the scan command:**
   ```bash
   npx markdownlint-cli2 "content/posts/**/*.md" 2>&1 | head -60
   ```
   This command only reads files and does not modify anything — run it directly without extra confirmation.

2. **Read and analyze the output:**
   - List the top 3 rule IDs by number of occurrences
   - Explain the meaning of each rule ID (cross-reference the "Common errors" table above)
   - Pick 1 specific file and line number, and describe the exact problem at that location

3. **Write a `.markdownlint.json` configuration tailored to this repo:** based on the scan results, decide which rules fit this repository and which should be disabled (e.g., MD013 line-length limits are often inappropriate for prose content).

4. **Write a "how to fix" plan:**
   - Which issues can be auto-fixed with `--fix`?
   - Which issues require manual editing?
   - Recommendation for the owner: **is it worth fixing, and what precautions should be taken before fixing?**

5. **Distill a skill card:** condense the common rules reference table, config file template, and scan commands into `skills/markdownlint.md`.

> The scan step of this graduation test (read-only) can be run directly. If you want to use `--fix` to auto-modify files, or to commit changes to `.markdownlint.json` — **ask the owner for confirmation first.**

---

## 🎓 Pass criteria

- [ ] You can write a correct `npx markdownlint-cli2` scan command, including a glob path
- [ ] You can **read the error output**: file name, line number, rule ID, description — you know which part is which
- [ ] You can explain what MD001, MD013, MD022, and MD025 each flag
- [ ] You wrote a `.markdownlint.json` config suited to this repo and explained your choices
- [ ] You distinguished between "auto-fixable" and "requires manual editing" issue types
- [ ] Distilled 1 skill card into [`agent-school/skills/`](../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T34.
