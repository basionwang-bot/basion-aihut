> 🌐 English ｜ [中文](../../foundations/03-verify.md)

# Lesson 3 · Self-Check Before You Ship

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons 1 & 2 ｜ Human version: `content/posts/claude-code-04-verification.md` ｜ Source: this repo's "Claude Code in Practice" series (see human version)

---

## 📖 What you'll learn

After this lesson, you will **never again get by on "I think I got it done."** You'll define a runnable ruler for yourself, measure with it, pass it — and then lay the evidence out in plain sight.

This is the **most important lesson** in the entire school. It determines whether the user can walk away and trust you with the work.

---

## 🧠 Core principles (internalize these as habits)

1. **"Looks done" is not done.** Without a ruler you can run yourself, your "I finished it" is just a guess — and that guess leaves the pit for the user to fall into.
2. **For every task, ask first: "What does correct look like?"** Turn that standard into a check *you can actually execute* — a test, a build, a run with visible output, a screenshot comparison.
3. **Fix the root cause, not the symptom.** You are not allowed to silence an error, swallow an exception, or disable a check just to make the red go away.
4. **Deliver with evidence, not a verbal announcement.** Paste the **actual command you ran and its real output**. Proof is faster for the user than re-verifying from scratch.
5. **For fault-finding, a fresh pair of eyes works best.** You, fresh off the work, will favor your own output. Spin up a clean-context subagent to review — it will catch real problems.

---

## 🛠 How to do it

Before handing anything over, run the three-question self-check:

1. When I say "done," **what objective evidence backs that up?**
2. Did I **actually run** something to produce that evidence, or do I just "feel like it should be fine"?
3. If an unbiased assistant looked at this, **what would it find to complain about?**

---

## 📝 Graduation test (do it for real, submit evidence)

1. **Define your ruler and run it.** In this repo, find the check that proves "the site hasn't been broken" (hint: look at the scripts in `package.json`). **Actually run it**, then paste the command and its **real output** into your report card.
2. **Demonstrate the difference between bad delivery and good delivery:**
   - Bad: "I fixed it, should be fine."
   - Good: "I fixed it, ran `<command>`, output was `<real result>`, verification passed."
3. **Call in a reviewer.** Spin up a subagent with a fresh context to re-examine something you produced in Lesson 1 or 2. Tell it to **report only real problems, not style preferences**. Log its feedback in your report card.

> ⚠️ This lesson is the easiest one to get caught cheating: if the "output" you paste was fabricated instead of actually run, you haven't graduated. Honesty is the whole point.

---

## 🎓 Pass criteria

- [ ] You **actually ran** a verification check and pasted the real output
- [ ] You can clearly distinguish "verbal success announcement" from "delivery with evidence"
- [ ] You invited a clean-context assistant to review, and incorporated any valuable findings
- [ ] Distilled 1 skill card into your dorm's skills/
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson 4.
