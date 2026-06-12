> 🌐 English ｜ [中文](../../foundations/J13-review-regression.md)

# Lesson J13 · Review and Regression

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J12 ｜ Difficulty: ★★★ ｜ Source: school rules rule 6 "revisit graduated lessons periodically (prevent regression)" + Anthropic best practices (evals & regression testing) + this repo's "Verification Loop" module

---

## 📖 What you'll learn

After this lesson, you'll understand one thing: **learning something doesn't mean you can always do it** — and then you'll build a mechanism that proactively finds which habits have "regressed," and patches them in time.

Imagine you learned to swim. The week you got your certificate, your form was solid, your breathing was smooth. Three months out of the water, you jump back in — your technique has drifted, your breathing is panicked, half the muscle memory is gone. **Skills atrophy without use, and an agent's habits are no different.**

What this lesson teaches you is not "learning a new skill" — it's building a guardrail that **keeps already-learned skills from quietly slipping away**. Think of the follow-up appointment system at a hospital: not because you're sick, but to proactively confirm you haven't been sliding backward.

---

## 🧠 Core principles (internalize these as habits)

1. **"Learned" ≠ "can always do it."** When you passed a lesson, that was your state at that moment. Change the environment, let time pass, go through tasks where the skill wasn't needed — habits will degrade without you noticing.

2. **Review is proactive prevention, not reactive rescue.** You don't wait for a problem to surface before reviewing — you check on a schedule, catch signs of regression early, fix them while the cost is still low.

3. **The ruler for review is the original lesson's pass criteria, not self-assessment.** "I think I still remember it" does not count as a review. A review means going through the original rubric line by line — doing one real thing, laying the results out to compare.

4. **Major changes trigger mandatory review.** Switching to a new type of task, switching to a new owner, going a long time without using a skill — any of these three triggers a quick review to confirm the foundational habits are still intact.

5. **Reviews themselves need evidence.** Running through things mentally does not count as a review. There must be a check action and an observed result, written down — only then can an independent proctor (or your future self) know "this review was actually done."

---

## 🛠 How to do it

**What a "regression suite" is:**

Every lesson you've graduated is like a feature module that has passed its tests. The regression suite is the "health checklist" for those modules — run it periodically to see which module has quietly started failing.

**Standard structure for a review checklist:**

```
[Lesson name and number] Lesson JXX · XXX
[Core habit] One sentence describing the most critical behavior this lesson covers
[Review micro-task] A small task completable in 5–10 minutes that verifies this habit is still present
  - Task description: ...
  - Expected output: ...
  - Pass standard: ...
[Regression symptom] If this habit has regressed, what observable symptoms will appear?
[When to trigger a review] Proactively run a review when any of the following occurs:
  - [ ] More than [time period] has passed without exercising this lesson's skill
  - [ ] Switched to a new task type
  - [ ] Caught myself making a mistake this lesson taught me to avoid
```

**How to manage the regression suite:**

- Each time you graduate a lesson, create a review checklist for it and add it to `agent-school/skills/regression-suite/`
- After major changes (new owner, extended break, model upgrade), go through all checklists in the suite
- When you find regression, run a "quick review" using the original lesson's flow — complete the micro-task, write the evidence, confirm recovery

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a review checklist for one previously graduated lesson, and demonstrate one quick review.**

Steps:

1. **Choose a lesson**: from the lessons J01–J12 you have already studied, pick the one you think is "most prone to regression."

2. **Design the review checklist**: following the "Standard structure for a review checklist" above, write a complete checklist for that lesson. The review micro-task must be **something you can genuinely do in this repo** (no more than 10 minutes).

3. **Demonstrate one quick review**: using the checklist you wrote, **actually carry out the review micro-task** — record what you did, what you observed, and what standard you used to judge "this habit is still intact." Produce real evidence (the action you took + its result).

4. **Give a review conclusion**: is the habit for this lesson currently "holding strong" or "showing signs of regression"? Support the conclusion with your evidence.

5. **Write all of the above into** a new file under `agent-school/skills/regression-suite/` (name it `<lesson-number>-regression-check.md`, e.g. `J06-regression-check.md`).

6. **Distill a skill card**: condense the "Regression suite: building and using it" method into `agent-school/skills/review-regression.md`.

> ⚠️ The review micro-task in step 3 must be **genuinely executed** — if the task is "read a certain file," you must actually read it and use what you found as evidence. Writing "assume I read it, conclusion is…" is not allowed.

---

## 🎓 Pass criteria

- [ ] You wrote a **fully formatted** review checklist for one previously studied lesson (all five fields have substantive content)
- [ ] The review micro-task is **genuinely doable in the repo**, and you **actually did it** and left verifiable evidence
- [ ] Your review conclusion is **supported by specific evidence**, not "feels like it should be fine"
- [ ] The `agent-school/skills/regression-suite/` directory and the review file have been created
- [ ] Distilled 1 skill card into your dorm's skills/
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson J14.
