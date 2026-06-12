> 🌐 English ｜ [中文](../../foundations/J08-task-decomposition.md)

# Lesson J08 · Task Decomposition

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: Anthropic best practices (planning / decomposition) + this repo's practical series, Module 3

---

## 📖 What you'll learn

After this lesson, when you receive a large task, you will **no longer barrel straight in and start hacking** — instead you'll first slice that elephant into manageable pieces, get each piece inspected before cutting the next.

Picture someone moving a warehouse. The new worker rushes in and grabs whatever is at hand — spends half the day hauling the wrong stuff while everything that actually matters is still buried at the back. The experienced mover does it differently: stands at the door and scans — how many rows, what's heavy, what's fragile, what order to take things out — **thinks it through, says it aloud, writes it down, and only then starts moving.** That is task decomposition.

The core of decomposition isn't "doing more steps" — it's ensuring **every step can be inspected independently**: once this step is done, how do you know it was done correctly? Is there a standard you can check against? If yes, it's a genuinely self-contained step. If not, slice it finer.

---

## 🧠 Core principles (internalize these as habits)

1. **Survey from above before diving in.** Your first instinct on receiving a task should be "roughly how many phases does this break into?" — not "open a file and start editing." Step back, scan the whole picture, then decide where to begin.

2. **Every step must be inspectable on its own.** A well-defined step has one property: once done, you can **judge whether it's correct without looking at any other step**. "Finish the introduction" can be inspected. "Do the first half" cannot.

3. **Make dependencies explicit.** Which step needs which other step to finish before it can begin? Write this relationship down — don't let yourself accidentally work in the wrong order.

4. **The decomposition itself is a deliverable.** The plan you produce isn't a private scratch pad — it's an **engineering blueprint you can show the user for sign-off**. Show the plan first; only start executing once it's approved.

5. **Flag uncertain steps when you spot them.** Which steps are you shaky on, or can't progress without information from the user? Mark them during decomposition — don't hide them.

---

## 🛠 How to do it

**The seven-question checklist for decomposing any large task (run through it every time):**

1. **Where does it end?** What is the final deliverable? Who signs off on it?
2. **What are the major phases?** Break the whole thing into 3–5 natural stages (e.g., explore → draft → verify → deliver).
3. **What steps does each phase contain?** Each step's description must answer "once done, how do I know it's right?"
4. **In what order do the steps go?** Which must run in series (one depends on the previous)? Which can run in parallel?
5. **Which steps carry risk or uncertainty?** Insert a **checkpoint** there — report in before continuing.
6. **Which steps require the user to intervene?** E.g., information only they can provide, decisions only they can make.
7. **Keep total steps between 5 and 8.** Fewer than 5 likely means too coarse; more than 8 and you'll lose yourself.

**Report card format (fill this in once decomposition is done):**

```
[Task name]          ...
[Endpoint/deliverable] ...
[Phase overview]     ...
[Step details]
  Step 1: [what] → [how to inspect]
  Step 2: [what] → [how to inspect]
  ...
[Checkpoints]        report after Step X before continuing
[Requires user input] ...
[Risky / uncertain steps] ...
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: pick a genuinely sizeable task in this repo and do a complete decomposition of it.**

Specifically, choose one of the following (or pick a 🟡 course from the course map yourself):

- **Write the body of `agent-school/courses/J09-requirement-interview.md`**
- **Write the body of the T01 course (gh CLI) in the course map**
- **Write the body of the Z02 course (Xiaohongshu operations)**

Whichever you choose, **you only do the decomposition — you don't actually write the course**.

Steps:

1. **Explore first**: read the description row for that course in `agent-school/课程地图.md`, then read 1–2 existing courses under `agent-school/courses/` to understand the format.
2. **Decompose**: use the seven-question checklist above to produce 5–8 independently inspectable steps.
3. **Produce a report card**: fill in the report card format above and write it to your dorm's `agent-school/skills/task-decomposition-report.md` (create the file if it doesn't exist yet).
4. **Self-check**: re-read each step — "once this step is done, what standard do I use to judge it correct?" For any step where you can't answer, cut it finer.
5. **Distill a skill card**: capture "the seven-step task decomposition method" as `skills/task-decomposition.md`.

> ⚠️ This lesson **requires no internet access, no real accounts, and no new tools installed**. All you need is to read files, think, and write files. Work entirely inside the repo.

---

## 🎓 Pass criteria

- [ ] You **actually chose a concrete task** and produced a complete decomposition of it (no made-up tasks)
- [ ] Your report card has 5–8 steps, each with an **inspection standard**
- [ ] You marked **checkpoints** and **steps requiring user input**
- [ ] You did one round of self-checking and sliced down any steps where you couldn't fill in an inspection standard
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson J09.
