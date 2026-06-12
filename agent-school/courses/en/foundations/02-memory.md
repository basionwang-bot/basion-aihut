> 🌐 English ｜ [中文](../../foundations/02-memory.md)

# Lesson 2 · Manage Your Working Memory

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lesson 1 ｜ Source: this repo's "Claude Code in Practice" series ｜ Human version: `content/posts/claude-code-05-context.md`

---

## 📖 What you'll learn

After this lesson, you will **manage your attention the way you'd manage a desk with limited surface area**: never pile it with junk, clear it when needed, and when broad research is required, send a helper to do the digging — rather than spreading papers all over your own desk.

---

## 🧠 Core principles (internalize these as habits)

1. **Your context = a desk with limited space.** Every file you read and every command output you see gets laid out on that desk. Once it's full, you start forgetting things, losing the thread, and making dumb mistakes.
2. **Keep the scope narrow.** When handed an open-ended "go research X" task, narrow it down first ("only this directory," "only answer this one question") — don't read hundreds of files until the desk collapses.
3. **Wide-ranging research? Send a subagent.** Let the helper read a pile of files on *its own desk*, then bring only the conclusions back to yours — your desktop stays clean.
4. **Between unrelated tasks, clear the desk.** When one job is done and you move on to something unrelated, sweep the surface before you start fresh.
5. **Wrong twice in a row? Don't push harder — restart.** At that point the desk is already contaminated by failed attempts. Clear it, begin with a better starting point, and you'll almost always get there faster.

---

## 🛠 How to do it

- Before any research, ask yourself: "How much do I need to read for this? Can I narrow the scope, or hand it to a subagent?"
- While working, watch your desk: **is it filling up with output that has nothing to do with the current task?**
- When stuck, don't fight it: **rather than thrashing in a polluted context, take the lesson and start over.**

---

## 📝 Graduation test (do it for real, submit evidence)

1. **Send a helper to do the research**: use a **subagent** to investigate "how articles in this repo are organized (directory structure, naming conventions, frontmatter fields)". The subagent should report back with only its **conclusions**. In your report card, explain: why you chose to use a subagent instead of reading everything yourself, and what it found.
2. **Demonstrate scope control**: write one **bad example** and one **good example** — for the same research request, show what an "unbounded question" looks like versus what a "scoped-down question" looks like.
3. Log the above in your report card.

> ⚠️ If you just read a pile of files into your main context instead of using a subagent — that's fine. Reflect on what that did to your desk, and write the reflection in your report card. That is also learning.

---

## 🎓 Pass criteria

- [ ] You **actually dispatched a subagent** to do research, and explained why
- [ ] You can articulate how an overly broad scope overloads the context, and how to narrow it
- [ ] Your report card shows that you are beginning to **consciously protect your working memory**
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson 3.
