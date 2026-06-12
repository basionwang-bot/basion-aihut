> 🌐 English ｜ [中文](../../tools/T02-git-advanced.md)

# Lesson T02 · Advanced git — branch / rebase / cherry-pick / stash rescue

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: Git official documentation · [git-scm.com/docs](https://git-scm.com/docs) · [git-scm.com/book/en/v2](https://git-scm.com/book/en/v2)

---

## 📖 What you'll learn

After this lesson, when you hit any of these maddening situations, you'll be able to stay calm and reach for the right git command:

- "I made half my changes on the wrong branch — how do I transfer them?" — `stash`
- "I want one specific commit from another branch, not the whole thing" — `cherry-pick`
- "My branch history is a mess — I want to tidy it up before merging" — `rebase`
- "I just reset and lost some commits — how do I get them back?" — `reflog`

Picture git history as a **timeline rail**. A regular `commit` moves one step forward on the rail; a `branch` forks off a new rail; `merge` joins two rails into one. Then `rebase`, `cherry-pick`, and `stash` are your **time-travel, teleport, and pause superpowers**:

- **stash** = shove your unfinished work into a drawer, go handle something else, come back later and pull it right back out
- **cherry-pick** = pluck a single moment from another timeline and paste it onto your current one
- **rebase** = shift the starting point of your rail to the latest tip of another rail, so the history looks continuous
- **reflog** = git's black box — every operation is recorded here; if you lose something, come here to find it

**Official resources:**
- Git official docs: [git-scm.com/docs](https://git-scm.com/docs)
- Pro Git book: [git-scm.com/book/en/v2](https://git-scm.com/book/en/v2)
- cherry-pick docs: [git-scm.com/docs/git-cherry-pick](https://git-scm.com/docs/git-cherry-pick)

---

## 🧠 Core principles

1. **Branches are dirt cheap — open as many as you like.** A branch is just a pointer; it doesn't copy code. Creating a new branch costs almost nothing — whenever you're uncertain about an operation, branch first and experiment, then delete the branch if it goes wrong.

2. **rebase rewrites history; merge does not.** `git merge` adds a merge commit, keeping history fully traceable. `git rebase` grafts your commits onto someone else's latest code — the history looks cleaner but the original commit hashes change. **If you've already pushed commits to a remote, rebasing requires a force push — always tell the team first**, or their repos will break.

3. **cherry-pick is ordering à la carte; merge is getting the full set meal.** Just want one specific bug fix from someone else's branch? cherry-pick that one commit hash. Want all the changes from the entire branch? Use merge.

4. **stash is a temporary parking spot, not long-term storage.** `git stash` is for emergencies only — don't stash code and then forget about it. `git stash list` shows everything you've stashed; old stashes are easy to forget. Pop them with `git stash pop` or clear them with `git stash drop` promptly.

5. **reflog is the last lifeline.** `git reset --hard` "deleted" your commits? `git reflog` can find those commit hashes, and `git checkout <hash>` brings them back.

---

## 🛠 How to do it

### Branch basics

```bash
# Create and switch to a new branch
git switch -c feature/login-fix

# List all branches
git branch -a

# Switch to an existing branch
git switch main

# Delete a merged branch
git branch -d feature/login-fix

# Force-delete (even if unmerged)
git branch -D feature/abandoned
```

### stash: push work-in-progress into the drawer

```bash
# Stash all uncommitted changes
git stash

# Stash with a note (strongly recommended — prevents forgetting)
git stash push -m "login page half-done, to be continued"

# View all stashes
git stash list

# Pop the most recent stash (applies it and removes the stash entry)
git stash pop

# Apply a specific stash entry (stash@{2}) without removing it
git stash apply stash@{2}

# Delete a specific stash entry
git stash drop stash@{0}
```

### cherry-pick: pluck one commit from another branch

```bash
# First find the hash of the target commit
git log feature/hotfix --oneline

# Apply that commit to the current branch
git cherry-pick abc1234

# Pick multiple commits
git cherry-pick abc1234 def5678

# Pick a range of commits (exclusive start, inclusive end)
git cherry-pick abc1234..def5678

# If there's a conflict: resolve it, then continue
git cherry-pick --continue

# Or abort
git cherry-pick --abort
```

### rebase: shift your branch's base to the latest point

```bash
# Rebase current branch onto the latest main
git rebase main

# If there's a conflict: resolve it, then continue
git rebase --continue

# Or abort
git rebase --abort

# Interactive rebase: tidy up the last 3 commits (squash / reword / drop)
git rebase -i HEAD~3
```

In the editor opened by interactive rebase, each line is one commit — change the keyword at the front:

| Command | Effect |
|---------|--------|
| `pick` | Keep this commit as-is |
| `squash` / `s` | Merge into the previous commit |
| `reword` / `r` | Keep the commit but edit its message |
| `drop` / `d` | Delete this commit |
| `edit` / `e` | Pause here to let you amend the commit |

### reflog: recover "lost" commits

```bash
# View all recent operations (including reset, rebase, etc.)
git reflog

# Find the hash you want to recover and check it out
git checkout abc1234

# Or create a new branch to preserve it
git switch -c rescue/recovered abc1234

# Merge the recovered commit back in
git cherry-pick abc1234
```

### Rescue scenario cheat sheet

| Situation | Fix |
|-----------|-----|
| Made changes on the wrong branch (not yet committed) | `git stash` + `git switch <correct-branch>` + `git stash pop` |
| Want only one bug fix from another branch | `git cherry-pick <commit hash>` |
| Branch history is messy before merging into main | `git rebase -i HEAD~N` |
| Regretted a reset | `git reflog` to find hash + `git checkout <hash>` |
| Main was updated and you want the latest base | `git rebase main` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: create a chaotic local situation, then rescue it step by step with advanced git commands — recording every command and its output as you go.**

Set up the practice environment:

```bash
# Initialize a git repo in a temp directory
mkdir /tmp/git-rescue-lab && cd /tmp/git-rescue-lab
git init
git config user.name "Agent Student"
git config user.email "agent@school.test"

# Make a few commits
echo "First draft" > story.txt && git add . && git commit -m "initial draft"
echo "Second draft" > story.txt && git add . && git commit -m "revision"
echo "Third draft" > story.txt && git add . && git commit -m "polished"
```

Complete the following 3 rescue tasks, recording the command + real output for each:

**Task 1: stash rescue**
```bash
# Simulate "halfway through changes and suddenly need to switch branches"
echo "half-written, unfinished" >> story.txt
# Save with stash
git stash push -m "story half-done"
git stash list  # verify it was stashed
git stash pop   # retrieve it
```

**Task 2: cherry-pick**
```bash
# Open a temporary branch and make an emergency fix
git switch -c hotfix
echo "emergency fix content" > fix.txt && git add . && git commit -m "hotfix: emergency fix"
git log --oneline  # note the commit hash

# Go back to main and cherry-pick the fix
git switch main
git cherry-pick <the hash from above>  # replace with the real hash
git log --oneline  # verify it appears on main
```

**Task 3: interactive rebase to clean up history**
```bash
# View current history
git log --oneline
# Squash the last 3 commits into 1
git rebase -i HEAD~3
# (In the editor, change the second and third "pick" to "squash", save and exit)
git log --oneline  # verify 3 commits became 1
```

Compile the commands + output for all three tasks into a report card, and distill a skill card into `skills/git-advanced.md`.

> ⚠️ **Safety boundary (hold this line):** `git rebase` and `git reset --hard` **rewrite history**. Before running them on a real team repository, **you must confirm with the owner first**. Practice in a local repo under `/tmp` — never experiment directly in the owner's working repository. `git push --force` is especially dangerous — **never execute it without the owner's explicit authorization**.

---

## 🎓 Pass criteria

- [ ] You completed the stash rescue task and included the real `git stash list` output
- [ ] You completed the cherry-pick and included before/after `git log --oneline` comparisons
- [ ] You completed interactive rebase and showed 3 commits collapsing into 1 (with `git log --oneline` comparison)
- [ ] You can clearly explain the key difference between `rebase` and `merge` (rewrites history vs. preserves history)
- [ ] You can clearly explain when `reflog` is the lifesaver to reach for
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to the next lesson.
