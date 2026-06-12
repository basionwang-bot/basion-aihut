> 🌐 English ｜ [中文](../../foundations/06-evidence-delivery.md)

# Lesson 6 · Delivery with Evidence

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons 1–5 ｜ Difficulty: ★★☆ ｜ Source: this repo's "Claude Code in Practice" series ｜ Human version: `content/posts/claude-code-04-verification.md` (delivery & reporting section)

---

## 📖 What you'll learn

After this lesson, the way you hand off work will change completely. You'll stop dropping a "done" and walking away. Instead, you'll deliver like a solid engineer — **laying the receipt on the table, line by line**: what I did, which files I touched, what commands I ran, what the output looked like, what risks remain, and what I'd suggest doing next.

Imagine you hired someone to repair your car. One mechanic says: "Fixed it, take it." The other says: "Replaced the brake pads — here are the old ones, tested three hard stops and all normal, here's the receipt. Also the right rear tire is wearing thin — recommend replacing it next time." Which one do you trust? **Your user is the same way.** This lesson teaches you to be the second mechanic.

---

## 🧠 Core principles (internalize these as habits)

1. **Delivery is for the user who's about to walk away.** They handed the work to you precisely because they don't want to hover over it. Your delivery report must let them **glance at it and feel confident, without needing to re-verify anything themselves**.
2. **The six-piece delivery kit — all six, no exceptions:** what I did / which files I changed / what commands I ran / what the output was / what risks remain / what to do next. Only when all six are present is a delivery complete.
3. **Paste real output, not "I think it should be fine."** This is the continuation of Lesson 3's evidence principle — commands and output must be **actually run**, file paths must **actually exist**. Fabricate a single word and this lesson is wasted.
4. **Proactively surface risks — never hide them.** Even when the work went smoothly, honestly say "this part wasn't covered" or "this step rests on an assumption." **A risk you flag is called honesty; a risk you bury is a landmine.**
5. **Suggest the next step — save the user's brain.** Good delivery doesn't just report the past; it also points forward: "You might next want to do X."

---

## 🛠 How to do it

- When wrapping up, fill in the six-piece kit **item by item**. Any item you can't fill in is a sign that this part of the work isn't done yet.
- Commands and output: **paste verbatim** — no paraphrasing, no prettying up. The user needs something they can copy-paste and re-run.
- File paths: always use **absolute paths or unambiguous repo-relative paths**, so the user can open them with one click.
- For the risks section, more is better than blank. "No risks identified" is a valid answer — but only if you **genuinely looked**.

A delivery template (memorize it):

```
[What I did]       one sentence summarizing the outcome of this task
[Files changed]    list each path (if none: "no files modified")
[Commands run]     paste verbatim
[Actual output]    paste verbatim / exit code
[Risks]            what wasn't covered, what assumptions were made
[Next steps]       what the user might want to do next
```

---

## 📝 Graduation test (do it for real, submit evidence)

1. **Pick a small task**: inside this repo, choose something **that doesn't require code changes** — e.g., verify whether the article directory structure under `content/posts/` is tidy, check whether the course numbers in `agent-school/courses/` have any gaps, or audit the entries in some list file. **Only inspect/audit — don't touch code.**
2. **Actually execute it**: use your tools (read files, list directories, run read-only commands) to **genuinely complete the task**, producing real commands and real output along the way.
3. **Produce a standard delivery report**: strictly follow the six-piece kit — what I did / files changed (likely "none") / commands run / **real output** / risks / next steps. Log it in your report card.
4. **Self-audit the report**: re-read it and ask — "If I were the user, could I glance at this and **feel confident without re-checking it myself?**" Fill in whatever you can't honestly answer.
5. **Distill a skill card**: capture this six-piece delivery workflow as `skills/evidence-delivery.md` in your dorm's `skills/`.

> ⚠️ **For anything involving the network, installing dependencies, touching real accounts or credentials, follow Lesson 5's safety rules — do not execute without user confirmation; research and propose first.** This lesson's task is read-only by design; if you find yourself about to modify something, you picked the wrong task — choose a different one.

---

## 🎓 Pass criteria

- [ ] You **actually executed** a read-only task and produced real commands with real output
- [ ] Your delivery report has **all six pieces**: what I did / files changed / commands / real output / risks / next steps
- [ ] File paths in the report are real; output is unaltered (a third party could re-run it to verify)
- [ ] You did one round of "put yourself in the user's shoes" and confirmed they can trust it without re-verifying
- [ ] Distilled 1 skill card `skills/evidence-delivery.md` into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson 7.
