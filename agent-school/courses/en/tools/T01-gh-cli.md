> 🌐 English ｜ [中文](../../tools/T01-gh-cli.md)

# Lesson T01 · Managing PRs and Issues with gh (GitHub CLI)

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: GitHub CLI official manual · [cli.github.com/manual/](https://cli.github.com/manual/) · [docs.github.com/en/github-cli](https://docs.github.com/en/github-cli)

---

## 📖 What you'll learn

After this lesson, you'll be able to use `gh` as a "command-line remote control" to operate GitHub — browse PRs, open PRs, check issues, add labels — without ever leaving the terminal or touching a browser.

Picture yourself as a courier working in a large building. Before, to get anything done (check what's in the elevator, deliver a package to a floor), you had to walk up to the front desk and tap through screens by hand. What `gh` does is **hand you a walkie-talkie: say one sentence from where you're standing, and the building answers**. Faster, leaves a record, and can be scripted to run automatically.

`gh` is GitHub's official command-line tool, works on macOS / Linux / Windows, and can drive the GitHub API to handle almost every repository operation.

**Official resources:**
- Official manual: [cli.github.com/manual/](https://cli.github.com/manual/)
- GitHub Docs: [docs.github.com/en/github-cli](https://docs.github.com/en/github-cli)
- GitHub repository: [github.com/cli/cli](https://github.com/cli/cli)

---

## 🧠 Core principles

1. **Authenticate first, work second.** Every `gh` operation requires a GitHub login. `gh auth login` is step zero — without it nothing works. Think of it like pairing a walkie-talkie to a channel: pair it first, then talk.

2. **Repository context is auto-detected.** When you run a `gh` command inside a git repository directory, it automatically figures out which repo you're in — no need to pass `--repo` manually. To target a different repo, add `--repo owner/name` explicitly.

3. **Commands read like plain English.** `gh pr list` (list PRs), `gh issue create` (create a new issue), `gh pr merge` (merge a PR) — verb + noun, far easier to remember than API paths.

4. **JSON output means pipeline power.** Every listing command supports `--json` + `--jq` filtering, so you can pipe directly into `jq` (see Lesson T04) and extract exactly the fields you need.

5. **Context-window efficiency first.** When an agent needs to interact with GitHub, `gh` uses 100× fewer tokens than "open a browser and take a screenshot." If a command can get it done, use a command.

---

## 🛠 How to do it

### Installation

```bash
# macOS (Homebrew)
brew install gh

# Linux (Debian/Ubuntu)
sudo apt install gh
# Or use the official script:
# https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Windows (WinGet)
winget install --id GitHub.cli
```

> **Network note:** GitHub itself can be unreliable from mainland China, and `gh` — being GitHub's own CLI — is affected the same way. If downloading the installer or running `gh auth login` times out, you'll need a VPN. Binaries for each platform can also be downloaded manually from [github.com/cli/cli/releases](https://github.com/cli/cli/releases).

### Authentication

```bash
# Interactive login (opens a browser or gives you a device code)
gh auth login

# Verify you're logged in
gh auth status
```

### PR quick-reference

```bash
# List all open PRs in the current repo
gh pr list

# View details for a specific PR (e.g. PR #42)
gh pr view 42

# Create a new PR from the current branch
gh pr create --title "Fix login bug" --body "Detailed description..."

# Check out (switch to) a PR's code
gh pr checkout 42

# Merge a PR
gh pr merge 42 --merge

# Check the CI status of a PR
gh pr checks 42
```

### Issue quick-reference

```bash
# List all open issues
gh issue list

# View a specific issue
gh issue view 7

# Create a new issue
gh issue create --title "Homepage crash" --body "Steps to reproduce..."

# Add a label to an issue
gh issue edit 7 --add-label "bug"

# Close an issue
gh issue close 7
```

### JSON output + filtering

```bash
# List PRs, keeping only number, title, and author
gh pr list --json number,title,author --jq '.[] | "\(.number) \(.title) by \(.author.login)"'
```

### Common flags

| Flag | Meaning |
|------|---------|
| `--repo owner/name` | Specify which repository to operate on |
| `--state closed` | Query closed PRs/issues |
| `--limit 20` | Return at most 20 results |
| `--assignee @me` | Show only items assigned to yourself |
| `--label bug` | Filter by label |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use `gh` on the command line to complete a full issue lifecycle, and submit a PR inspection report.**

Steps:

1. **Write out the complete command sequence**, running against a GitHub repository you can access (your own test repo works):
   - `gh auth status` — confirm you're logged in; copy or screenshot the output
   - `gh issue create --title "Test issue" --body "This is the gh CLI graduation test"` — create an issue
   - `gh issue list` — list issues and confirm the new one appears
   - `gh issue close <issue number>` — close it
   - `gh pr list --json number,title,state --jq '.[] | "\(.number) \(.title) [\(.state)]"'` — list the repo's PRs with formatted output

2. **Record each command's real output** (command + stdout, pasted verbatim).

3. **Write out your verification criteria:**
   - `gh auth status` shows an authenticated account and repo permissions
   - `gh issue list` shows the issue you just created
   - After `gh issue close`, running `gh issue list --state closed` shows that issue

4. **Write out safety notes:**
   - Before performing write operations on a real repository's PRs (merge / close), **you must confirm with the owner first** — accidentally merging the wrong PR causes a code incident.
   - `gh auth login` requests a GitHub OAuth authorization — **only operate on accounts and repositories the owner has approved**.

5. **Compile the command sequence + real output into a report card** in your dorm file (e.g. `agent-school/skills/gh-cli-report.md`).

6. **Distill a skill card:** crystallize the most commonly used `gh pr` / `gh issue` commands and JSON filtering techniques into `skills/gh-cli.md`.

> ⚠️ **Safety boundary (hold this line):** Authentication (`gh auth login`) and write operations on real repositories (create PR, merge PR, close issue) **require the owner's confirmation before execution**. Read-only operations (`gh pr list`, `gh issue view`) are relatively safe, but the owner should still know which repositories you're touching.

---

## 🎓 Pass criteria

- [ ] You ran `gh auth status` and the output shows you're authenticated (include the real output)
- [ ] You ran `gh issue create` and successfully created an issue (include the issue link or ID)
- [ ] You ran `gh pr list --json ...` and produced a formatted PR list (include the real output)
- [ ] You wrote out a "guard against accidental PR merges" safety note, demonstrating you understand that write operations need prior confirmation
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to the next lesson.
