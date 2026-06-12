> 🌐 English ｜ [中文](../../tools/T30-rsync.md)

# Lesson T30 · rsync: Reliable File Sync and Backup

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: rsync official manual · [man7.org/linux/man-pages/man1/rsync.1.html](https://man7.org/linux/man-pages/man1/rsync.1.html) · [rsync.samba.org](https://rsync.samba.org)

---

## 📖 What you'll learn

After this lesson, you'll be able to use rsync to reliably sync files between two directories — whether that's a local backup or a push to a remote server — and you'll use `--dry-run` to preview "what would change" before actually executing anything.

Picture two warehouses: one is your active "primary warehouse" where you work every day, and the other is a "backup warehouse" in a different building. You want the backup to stay in sync with the primary at the end of each workday — but you don't want to haul every single item over each time; that's far too slow. rsync is **the smart courier who only moves what changed** — it first takes stock of what's different on both sides, then moves only the new or modified items, leaving everything unchanged untouched.

rsync was created by Andrew Tridgell and is the de facto standard for Linux server backup. Its "delta transfer algorithm" is extremely efficient: even with a multi-GB file, if only a few lines changed, rsync transfers only those lines — not the whole file.

**Official resources:**
- rsync manual: [man7.org/linux/man-pages/man1/rsync.1.html](https://man7.org/linux/man-pages/man1/rsync.1.html)
- Official homepage: [rsync.samba.org](https://rsync.samba.org)
- How rsync works: [rsync.samba.org/how-rsync-works.html](https://rsync.samba.org/how-rsync-works.html)

---

## 🧠 Core principles (internalize these as habits)

1. **`--dry-run` (or `-n`) is your safety net — rehearse before the real run.** With `--dry-run`, rsync only prints "here's what I would do" without actually doing it. Whenever you're unsure, do a dry run first, review the change list, and only then remove the flag and run for real. This is an iron rule.

2. **The trailing slash on the source path matters enormously — one character changes everything.**
   - `rsync -a /src/dir/ /dst/` → syncs the **contents of** `dir/` into `dst/`
   - `rsync -a /src/dir /dst/` → syncs the **directory itself** into `dst/` (result: `dst/dir/...`)
   This detail is the single most common source of surprises. Check that trailing slash consciously every time you write the command.

3. **`-a` (archive) is the standard all-in-one flag.** `-a` expands to `-rlptgoD` — recursive, preserve symlinks, preserve permissions, preserve timestamps, preserve owner, and more. For virtually all backup scenarios, `-a` alone does the job.

4. **`--delete` makes destination match source exactly, but it deletes files — deletion operations require the owner's confirmation first.** Without `--delete`, files you deleted from the source still remain in the destination. With `--delete`, the destination becomes a mirror of the source — convenient, but risky: you might accidentally delete important files. **Before using `--delete`, always dry-run first, confirm the list of files that would be deleted, tell the owner what will be removed, get explicit confirmation, then run for real.**

5. **Remote sync goes over SSH; host format is `user@host:/path/`.** `rsync -a /local/dir/ user@192.168.1.100:/backup/dir/` transfers over SSH — the usage is identical to a local sync, just with `user@host:` prepended to the destination path. Requires SSH access to the remote host.

---

## 🛠 How to do it

### Installation

> ⚠️ **Ask the owner first before running any of these installation commands.**

```bash
# Verify installation (usually pre-installed on Linux/macOS)
rsync --version
# Expected: rsync  version 3.x.x ...

# macOS (Homebrew — upgrades to newer version)
brew install rsync

# Linux (Debian/Ubuntu)
sudo apt install rsync

# Windows — recommended to use WSL (Windows Subsystem for Linux) and run rsync inside WSL
```

### Minimal runnable example (purely local, zero risk)

**Set up test directories:**
```bash
# Create source directory and files
mkdir -p /tmp/rsync_src /tmp/rsync_dst
echo "Content of file A" > /tmp/rsync_src/fileA.txt
echo "Content of file B" > /tmp/rsync_src/fileB.txt
mkdir -p /tmp/rsync_src/subdir
echo "File in subdirectory" > /tmp/rsync_src/subdir/fileC.txt
```

**Step 1: dry-run first (strongly recommended as a habit)**
```bash
rsync -av --dry-run /tmp/rsync_src/ /tmp/rsync_dst/
# Sample output:
# sending incremental file list
# fileA.txt
# fileB.txt
# subdir/
# subdir/fileC.txt
#
# Number of files: 4 (reg: 3, dir: 1)
# Number of created files: 4 (reg: 3, dir: 1)
# Number of files transferred: 3
# (This is a rehearsal — nothing was actually copied)
```

**Step 2: confirmed — run the real sync**
```bash
rsync -av /tmp/rsync_src/ /tmp/rsync_dst/
# Executes for real; output looks the same but without "(DRY RUN)"

# Verify
ls /tmp/rsync_dst/
```

**Step 3: sync again (observe incremental behavior)**
```bash
# Modify one file
echo "New content for file A" > /tmp/rsync_src/fileA.txt

# Dry-run to see which file would be transferred
rsync -av --dry-run /tmp/rsync_src/ /tmp/rsync_dst/
# Expected: only fileA.txt appears — unchanged files are skipped
```

### Common options quick reference

| Option | Meaning |
|--------|---------|
| `-a` | Archive mode: recursive + preserve permissions + timestamps, etc. |
| `-v` | Verbose: print each transferred filename |
| `-n` / `--dry-run` | Rehearsal mode: print what would happen without actually doing it |
| `--delete` | Delete files from destination that were removed from source (dangerous — dry-run first) |
| `--exclude='*.log'` | Exclude files matching the given pattern |
| `--include='*.py'` | Include files matching the pattern (used together with `--exclude`) |
| `-z` | Compress during transfer (saves bandwidth for remote syncs) |
| `-P` | Show progress + enable resumable transfers |
| `--bwlimit=1000` | Limit bandwidth to 1000 KB/s (avoids saturating the connection) |
| `-e ssh` | Use SSH as the transport channel (default for remote syncs anyway) |
| `--checksum` | Detect changes by checksum rather than timestamp+size (more accurate, slower) |
| `--stats` | Print a summary of transfer statistics |
| `--progress` | Show per-file real-time progress |

### Remote sync (over SSH)

> ⚠️ Remote sync requires SSH access. Confirm the target server address and credentials with the owner before proceeding.

```bash
# Local → remote (push backup)
rsync -avz /local/project/ user@192.168.1.100:/backup/project/

# Remote → local (pull)
rsync -avz user@192.168.1.100:/data/logs/ /local/logs/

# Dry-run before pushing
rsync -avz --dry-run /local/project/ user@server:/backup/project/
```

### `--delete` scenario: mirror sync (high-risk — ask the owner first)

```bash
# Dry-run to see which files would be deleted
rsync -avz --dry-run --delete /tmp/rsync_src/ /tmp/rsync_dst/
# Lines starting with "deleting xxx" show what would be removed

# Owner confirmed — run for real
rsync -avz --delete /tmp/rsync_src/ /tmp/rsync_dst/
```

### Common backup script template

```bash
#!/bin/bash
# backup.sh — daily backup script template

SRC="/home/user/projects/"
DST="/backup/projects/"
LOG="/var/log/rsync_backup.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting backup..." >> "$LOG"

rsync -av --delete \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='__pycache__/' \
  --exclude='*.pyc' \
  "$SRC" "$DST" >> "$LOG" 2>&1

echo "[$DATE] Backup complete" >> "$LOG"
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: complete a full rsync sync cycle on a local directory — dry-run → real sync → incremental verification — and attach the actual commands and output.**

Test data can be generated locally; no network access needed:

**Setup (safe — operations confined to /tmp)**
```bash
# Create test environment
mkdir -p /tmp/rstest_src/{docs,code}
echo "Project overview" > /tmp/rstest_src/README.md
echo "def hello(): pass" > /tmp/rstest_src/code/main.py
echo "Requirements spec" > /tmp/rstest_src/docs/spec.txt
mkdir /tmp/rstest_dst
```

**Task 1: dry-run rehearsal — attach the output**
```bash
rsync -av --dry-run /tmp/rstest_src/ /tmp/rstest_dst/
# Copy the full output into your report, showing which files "would be" synced
```

**Task 2: real sync — verify files are in place**
```bash
rsync -av /tmp/rstest_src/ /tmp/rstest_dst/
# Verify:
ls -R /tmp/rstest_dst/
# Expected: directory structure identical to rstest_src
```

**Task 3: incremental sync — verify only the changed file is transferred**
```bash
# Modify one file only
echo "Version 2.0" >> /tmp/rstest_src/README.md

# Dry-run again — should show only README.md
rsync -av --dry-run /tmp/rstest_src/ /tmp/rstest_dst/
# Expected: only README.md appears in the list; other files do not

# Real sync
rsync -av /tmp/rstest_src/ /tmp/rstest_dst/
# Verify:
diff /tmp/rstest_src/README.md /tmp/rstest_dst/README.md
# Expected: no output (files are identical)
```

**Acceptance criteria:**
- Task 1 output shows 4 files "would be" transferred, including directory structure
- Task 2 `ls -R /tmp/rstest_dst/` shows the complete directory tree
- Task 3 dry-run lists only `README.md`
- `diff` confirms both files are identical

**Distill a skill card:** condense the common options reference + backup script template + trailing-slash trap explanation into `skills/rsync.md`.

> ⚠️ **Safety boundary (strictly observe):**
> - **Local testing in `/tmp`** (as above) is completely safe — go ahead.
> - **`--delete` flag** will delete files in the destination — **always dry-run first, then explicitly tell the owner "these files will be deleted", get confirmation, and only then run for real.**
> - **Remote sync (any path containing `user@host`)** requires confirming the target server address, login credentials, and scope of changes with the owner. Do not proceed without that confirmation.
> - **Production data backup:** before running, double-check both source and destination paths are correct — one extra or missing slash changes the result entirely. When in doubt, do one more dry-run.

---

## 🎓 Pass criteria

- [ ] You completed a dry-run rehearsal and produced the correct file list
- [ ] You completed a real sync and verified the destination directory structure is correct
- [ ] You performed incremental sync verification and proved only changed files were transferred
- [ ] You can explain the difference between a source path with and without a trailing slash
- [ ] You can explain why `--delete` operations must be dry-run first and confirmed with the owner
- [ ] Distilled 1 skill card into [`agent-school/skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card. Congratulations on completing Lesson T30!
