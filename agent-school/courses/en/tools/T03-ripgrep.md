> 🌐 English ｜ [中文](../../tools/T03-ripgrep.md)

# Lesson T03 · ripgrep (rg) — Second-level search across giant codebases

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★☆☆ ｜ Source: ripgrep official repository · [github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep) · [GUIDE.md](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md)

---

## 📖 What you'll learn

After this lesson, you'll be able to locate any function name, error message, or config value in hundreds of thousands of lines of code within seconds — instead of waiting thirty seconds with `grep`, or flipping through files one by one with no direction.

Picture yourself walking into a massive library with hundreds of thousands of books. Regular `grep` is "ask the librarian to flip through every book by hand" — slow, no filtering. ripgrep is a **GPS-equipped scanner**: it knows which shelves are the "archive section — skip these" (files listed in `.gitignore`) and which volumes are "display props, not real books" (binary files), and automatically skips them, scanning only what matters — so it's dramatically faster.

ripgrep (the command is `rg`) is a line-search tool written in Rust. It's 5–100× faster than traditional `grep`, natively supports regular expressions, respects `.gitignore`, and automatically skips binary files.

**Official resources:**
- GitHub repository: [github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep)
- User guide: [github.com/BurntSushi/ripgrep/blob/master/GUIDE.md](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md)

---

## 🧠 Core principles

1. **The defaults are smart — just run it.** `rg keyword` runs right out of the box — it automatically skips files in `.gitignore`, skips `node_modules`, skips binary files. In most cases you don't need to add any flags at all.

2. **Regular expressions are your force multiplier.** `rg 'def.*login'` finds every function definition that starts with `def ` and has `login` in the name; `rg '\berror\b'` matches the complete word `error` but not `errors`. A handful of common regex patterns will double your search power.

3. **Filtering by file type is a lifesaver.** A large codebase may mix Python, JS, CSS, and JSON. `rg -t py 'keyword'` searches only Python files — clean and precise. Run `rg --type-list` to see all supported type names.

4. **Output is machine-readable.** `rg --json` produces JSON-formatted results that agents can parse directly; `rg -l` outputs only file names, perfect for batch processing.

5. **When in doubt, check `--help`.** `rg --help` produces extremely detailed documentation; `rg -h` is the condensed version. When exploring a new codebase, `rg --help | head -50` gives you a quick tour of available options.

---

## 🛠 How to do it

### Installation

```bash
# macOS (Homebrew)
brew install ripgrep

# Linux (Debian/Ubuntu)
sudo apt install ripgrep

# Linux (from source via cargo — requires Rust)
cargo install ripgrep

# Windows (WinGet)
winget install BurntSushi.ripgrep.MSVC
```

> **Network note:** `brew install ripgrep` and `apt install ripgrep` generally work fine without a VPN (Homebrew has mirrors; apt uses local sources). If you use `cargo install`, Rust's crates.io registry may need a mainland China mirror configured (ByteDance or Tsinghua mirrors both work).

### Basic usage

```bash
# Recursively search for "TODO" in the current directory
rg TODO

# Search in a specific directory
rg TODO src/

# Search in a specific file
rg TODO src/main.py

# Case-insensitive search
rg -i error

# Show line numbers (shown by default)
rg -n 'function login'
```

### Search by file type

```bash
# Search only Python files
rg -t py 'import requests'

# Search only JavaScript files
rg -t js 'console.log'

# Exclude a file type
rg -T json 'api_key'

# List all supported type names
rg --type-list
```

### Regular expression usage

```bash
# Find all function definitions whose name contains "user"
rg 'def \w*user\w*'

# Find email addresses inside quotes (simple version)
rg '[\w.]+@[\w.]+\.\w+'

# Match the complete word "error", not "errors"
rg '\berror\b'

# Find comments starting with TODO or FIXME
rg '# (TODO|FIXME)'
```

### Controlling output

```bash
# Output only file names (no match content)
rg -l 'api_key'

# Show 3 lines of context around each match
rg -C 3 'raise Exception'

# Show only the matched portion (not the full line)
rg -o '\d{3}-\d{4}'

# JSON output (for programmatic parsing)
rg --json 'TODO' | head -20

# Count matches per file
rg -c 'import'
```

### Quick-reference cheat sheet

| Goal | Command |
|------|---------|
| Find a keyword | `rg keyword` |
| Case-insensitive | `rg -i keyword` |
| Search a specific directory | `rg keyword src/` |
| Search only Python files | `rg -t py keyword` |
| Output file names only | `rg -l keyword` |
| Show context lines | `rg -C 3 keyword` |
| Show line numbers | `rg -n keyword` |
| Include hidden files | `rg --hidden keyword` |
| Don't skip .gitignore | `rg -u keyword` |
| No filtering at all | `rg -uuu keyword` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use `rg` to complete 3 locate-it missions in a real code repository, recording the command and real output each time.**

Steps (run in `/home/user/basion-aihut` or any directory that has code):

1. **Task 1: find all TODO/FIXME**
   ```bash
   rg -n '(TODO|FIXME)' --type-list | head -5  # first check what types are supported
   rg -n '(TODO|FIXME)'
   ```
   Record: which files and which lines appeared in the output?

2. **Task 2: search by file type**
   ```bash
   # Find all Markdown files containing "agent"
   rg -t md -i 'agent' -l
   ```
   Record: how many files were found?

3. **Task 3: use a regular expression to find function definitions**
   ```bash
   # Find all Python function definitions
   rg -t py 'def \w+\('
   ```
   Record: the real content of the first 10 output lines.

4. **Write out verification criteria:**
   - Each command exits with code 0 (matches found) or 1 (no matches — that's not an error)
   - Output format is `filename:line_number:content`
   - All three tasks produce non-empty real output

5. **Distill a skill card:** consolidate the cheat sheet above plus your 3 most-used regex patterns into `skills/ripgrep.md`.

> ⚠️ **Safety boundary:** `rg` is a read-only search tool — it never modifies any file, so it's extremely safe. The one thing to watch out for: **do not paste search results (containing code or keys) into public channels** — especially when searching for sensitive terms like `api_key`, `password`, or `secret`. Keep the output local; don't leak it.

---

## 🎓 Pass criteria

- [ ] You ran 3 different `rg` commands and included the real output (not hand-written approximations)
- [ ] You used `-t` type filtering at least once and a regular expression at least once
- [ ] You can clearly explain the difference between `rg -l` and `rg -n`
- [ ] You understand why `rg` is faster than plain `grep` (`.gitignore` filtering, binary file skipping)
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to the next lesson.
