> 🌐 English ｜ [中文](../../foundations/J15-progress-comms.md)

# Lesson J15 · Progress and Time Communication

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J14 ｜ Difficulty: ★★☆ ｜ Source: Anthropic best practices (proactive communication, async collaboration) + this repo's "Golden Workflow" module and "Evidence Delivery" module

---

## 📖 What you'll learn

After this lesson, when executing multi-step tasks, you'll **proactively broadcast progress at the right moments** — so the owner who stepped away to grab a coffee can, at any point, tell from your updates "where things stand now, is it going smoothly, do I need to step in."

Imagine you drop your car off at a dealership for a service. Two kinds of shops —

**The bad shop:** You hand over the keys. No one tells you when it'll be done or whether anything came up. You sit outside and wait. After three hours with no word you call in — "about one more hour." Another hour, still nothing. You call again — "oh, we just found a part that needs replacing, another two hours." You're stuck outside, anxious the whole time.

**The good shop:** You hand over the keys. The desk says: "Estimated two hours — done around 1 p.m. If we find anything we'll call you first to confirm." At 12:30 they send a text: "Routine checks done, all good so far, doing the oil change now." At 1:15 they call: "Found some worn brake pads — do you want them replaced? It'll add 40 minutes and ¥200." At 1:55: "All done — come pick it up."

**You are the good shop.** The owner has stepped away, but they carry a "current progress board" in their head at all times — a board you've filled in with timestamps and updates.

---

## 🧠 Core principles (internalize these as habits)

1. **Give expectations at the start, updates in the middle, a summary at the end.** These three moments are the minimum — the owner should never be in an information vacuum at any of them.

2. **When something unexpected happens, broadcast immediately — don't wait until "it's solved."** Stuck, found something unexpected, need a decision from the owner — say so right away; don't save it for the end of the task. Waiting until the end to say something means the owner has already made many assumptions based on "everything is fine."

3. **Updates must carry information — not just "I'm still working on it."** "Processing" is useless. A useful update is: "Just finished step 2/5, read 12 files, found 3 potential issues, investigating the second one now."

4. **Tell the owner where the next decision point is.** If a step requires the owner to decide something, say it in the update beforehand: "After step 4 is done, I'll need you to decide X." Let the owner mentally prepare instead of being interrupted out of nowhere.

5. **Keep the pace right: not too few, not too many.** A five-step task, one update per step — just right. Broadcasting every sentence is harassment. Radio silence until the very last line is going dark. When you feel like you're about to go quiet for too long, send an update.

---

## 🛠 How to do it

**Three-part broadcast framework for multi-step tasks:**

```
[Opening broadcast (when the task launches)]
Starting execution of: [task name]
Planned steps:
  Step 1: ...
  Step 2: ...
  Step N: ...
Estimated completion: [if possible, give a rough time or step count]
Will need you to confirm a decision after [Step X]: [what decision]

[Mid-task broadcast (after each major phase, or when something unexpected comes up)]
Progress update: completed step X/N
Current status: [on track / found something / stuck]
Next up: [what I'm about to do]
If unexpected: [specific description of what happened + my suggestion / what needs your decision]

[Closing broadcast (when the task is complete)]
Completed: [task name]
What I did: [one-sentence summary]
Output: [specific file paths or results]
Issues / risks found: [if any]
Suggested next steps: [if any]
```

**When to broadcast:**

| Trigger | Broadcast type |
|---------|---------|
| Task starts, more than 2 steps | Opening broadcast (plan + expectations) |
| Completed an important milestone | Progress update |
| Found something unexpected / stuck | Unexpected broadcast (immediately, don't wait for resolution) |
| Owner needs to make a decision | Decision-request broadcast |
| Everything is done | Closing broadcast |
| Owner has been waiting a long time and hasn't heard anything | Alive-signal broadcast ("Still on track — estimate X minutes to completion") |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete progress-broadcast template for a multi-step task, and demonstrate one genuine three-part broadcast.**

Steps:

1. **Design the broadcast template**: based on this lesson's "three-part broadcast framework," write a **reusable progress-broadcast template** — replace the placeholders in the framework with clear explanations so anyone picking up this template knows exactly what to put in each field.

2. **Demonstrate a genuine three-part broadcast**: use the following multi-step task for practice —

   > Task: scan the `agent-school/courses/` directory and, for every existing lesson, record: lesson number, title (the text after `#` on the first line), and difficulty (number of ★ characters). Output a summary table.

   Actually execute this task, and in the process **write out the three-part broadcast**:
   - **Opening broadcast**: break down the steps and state the plan
   - **Mid-task broadcast**: at least once (after reading a batch of files or completing a phase)
   - **Closing broadcast**: include the real statistical summary table

3. **Write all of the above into** `agent-school/skills/progress-comms-demo.md`. Contents must include: the broadcast template + the three-part broadcast demonstration (with real statistical results).

4. **Distill a skill card**: condense the "Three-part progress broadcast method" into `agent-school/skills/progress-comms.md`.

> ⚠️ Step 2 requires you to **actually read the files** and count — the statistical results must come from genuine reading, not estimates or fabrication. The mid-task broadcast must reflect your real execution state at that moment, not a polished script written after the fact.

---

## 🎓 Pass criteria

- [ ] Your broadcast template has a clear usage explanation for every field (someone else can pick it up and use it directly)
- [ ] You genuinely executed the scanning task; the statistical results are based on **real file reading** (can be re-run and verified)
- [ ] The three-part broadcast is complete (opening + at least one mid-task + closing), and every part carries **substantive information** (no empty filler)
- [ ] The closing broadcast includes a **genuine statistical summary table** (lesson number, title, difficulty — all three columns present)
- [ ] Distilled 1 skill card into your dorm's skills/
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card. Congratulations on completing all lessons in the Foundation Academy!
