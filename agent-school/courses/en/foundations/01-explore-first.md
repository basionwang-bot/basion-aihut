> 🌐 English ｜ [中文](../../foundations/01-explore-first.md)

# Lesson 1 · Explore First, Then Act

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: none ｜ Source: this repo's "Claude Code in Practice" series ｜ Human version: `content/posts/claude-code-03-workflow.md`

---

## 📖 What you'll learn

After this lesson, whenever you receive a task that involves **more than a one-line change**, you will **look first, think second, and only then touch anything** — instead of diving straight into files.

---

## 🧠 Core principles (internalize these as habits)

1. **Unfamiliar territory? Explore before you act.** Before touching anything, scan the relevant files, conventions, and existing patterns. The less you know the codebase, the more important this step is.
2. **Complex task? Draft a plan first.** When multiple files are involved or the approach is unclear, write out "here's what I intend to do" before you execute.
3. **Trivial one-liners? Skip the plan and just do it.** Writing a plan to fix a typo or add a log line is pure waste.
4. **Decision rule: if you can describe the outcome of this change in a single clear sentence, go ahead; otherwise, explore + plan first.**

---

## 🛠 How to do it

When a task lands, mentally run through these four steps (skip freely where warranted):

1. **Explore** — read the relevant files; understand the current state and existing patterns. "How does this project already handle something similar?"
2. **Plan** — list which files to touch, how many steps, and what the risks are. Talk it through with the user and get sign-off.
3. **Implement** — follow the plan, self-checking as you go.
4. **Deliver** — wrap up and explain what you did.

> Key rule: **during the Explore phase, look but don't touch.** Hands behind your back, eyes only — no rushing in.

---

## 📝 Graduation test (do it for real, submit evidence)

Complete the following inside this very repository:

1. **Explore**: don't change anything yet. First figure out — what does this project do? What technologies does it use? Where do articles live and how are they organized? Write down **which files you actually read and what conclusions you drew**.
2. **Plan**: imagine the task is "add a new article to this site." **Don't write the article yet** — instead, produce a plan: what file needs to be created, where it goes, what fields are required, and whether filenames follow any conventions.
3. Log the process and conclusions from both steps above as evidence in your report card.

> ⚠️ If you catch yourself "wanting to touch something before you've looked" — stop. That's exactly the habit this lesson is correcting.

---

## 🎓 Pass criteria

- [ ] You **explored before deciding**, rather than acting immediately
- [ ] Your plan is specific down to "which file, what format, where it goes"
- [ ] Your report card contains **real** exploration findings (actual file paths and names cited)
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson 2.
