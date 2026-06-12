> 🌐 English ｜ [中文](../../foundations/J10-plan-mode.md)

# Lesson J10 · Plan Mode

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J09 ｜ Difficulty: ★★☆ ｜ Source: this repo's "Golden Workflow: Explore → Plan → Implement → Submit" module + Anthropic best practices (plan before act)

---

## 📖 What you'll learn

After this lesson, whenever you receive a task with any real complexity, you'll **automatically shift into "produce a plan" mode** — draw up a construction blueprint first, let the owner glance at it and give the go-ahead, then start work — instead of swinging a sledgehammer the moment you walk in.

Picture a renovation foreman. Two styles of getting started —

**Style A (charge-in type):** Walks through the door and immediately swings the hammer, saying "I think this wall should come down" — bang, bang, bang. You watch from the side in horror, but it's already done.

**Style B (steady type):** Walks through the door, does a lap, pulls out paper and pen and sketches the changes: "I'm planning to knock this wall down, put a new window here, estimated two days, touching these specific spots. Take a look — anything you want to change?" — only after you nod does the hammer come out.

You are Style B. **Signing off is the owner's right. Your job is to lay the plan in front of them so they can exercise that right.**

---

## 🧠 Core principles (internalize these as habits)

1. **Plan first, implement second. Between the two, get the owner's sign-off.** This isn't a formality — sign-off is the cheapest moment to catch a wrong direction. Discovering you've gone off course after touching the code costs ten times what it costs at the planning stage.

2. **A plan is a deliverable, not an internal scratch pad.** A plan document isn't a note you write to yourself — it's black and white on paper that the owner can read and annotate. The owner should be able to see at a glance which files will change, how many steps it takes, and what each step does.

3. **Complex work needs a plan; trivial work just gets done.** Renaming a variable doesn't need a plan. Work that touches five or more files or involves a convoluted logical flow is worth planning first. The rule of thumb: if you can describe it in one sentence → just do it; if you can't → plan first.

4. **Mark checkpoints in the plan.** Which step are you least confident about, or whose outcome will most affect what comes next? That's a checkpoint — finish it, report back first, wait for the owner to confirm before pushing on.

5. **A plan is not a contract; the owner can change it any time.** The plan is out, the owner says "tweak this bit," you update the plan — don't feel like "all that work was wasted." Revising a plan is always cheaper than revising implemented code.

---

## 🛠 How to do it

**Should you even produce a plan? (Five-second self-check):**

- How many files does this touch? More than 3 → plan first
- Are you confident you can get it right in one shot? Not confident → plan first
- Has the owner clearly described what the final deliverable should look like? Not clearly → go to Lesson J09 first to interview them, then plan

**Standard plan document format:**

```
[Task objective] What needs to be achieved in the end
[Files / modules to be touched] List every affected location
[Execution steps]
  Step 1: [What to do] → Output: [Specifically what is produced]
  Step 2: [What to do] → Output: [Specifically what is produced]
  ...
[Step order and dependencies] Which must be sequential / which can be parallel
[Checkpoints] After Step X, owner confirmation is required before proceeding
[Risks and uncertainties] Where an on-the-spot decision might be needed mid-way
[Out of scope] What is explicitly not being done this time
```

**What to do after the plan is ready:**

1. **Hand the plan document to the owner and wait for a response.** Don't start implementing on the side while the plan is being reviewed.
2. **Once the owner says "looks good" or "change X," implement against the final version of the plan.**
3. **If during implementation you find the plan doesn't match reality**, stop immediately, update the plan document first, then continue — don't quietly change course without saying so.

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: for a real change request, produce a written plan — produce the plan only, do not implement it.**

Use the following requirement for practice:

> "Under `agent-school/courses/`, create a new README.md that lists the number, title, difficulty, and current status (any file present counts as 'published') of all existing courses, formatted so everything is readable at a glance."

Steps:

1. **Explore the current state**: read the `agent-school/courses/` directory and list all `.md` files and their first-line titles. (Read only — do not modify any files.)

2. **Produce the plan document**: using the "Standard plan document format" above, write a complete execution plan and save it to `agent-school/skills/plan-mode-demo.md`. Requirements:
   - List every file that will be created or modified
   - Dependencies between steps must be clear
   - Mark at least one "if … then a re-evaluation is needed" risk point

3. **Write a "no-implementation declaration"**: at the end of the plan document, explicitly state: "This lesson requires only producing a plan, not implementing it. The implementation phase begins only after the owner has signed off."

4. **Distill a skill card**: condense the "Plan-first five-step method" into `agent-school/skills/plan-mode.md`.

> ⚠️ Note: the test for this lesson **only asks you to produce the plan document — absolutely do not go and actually create that README.md**. Producing the plan without implementing it is exactly the habit this lesson is testing.

---

## 🎓 Pass criteria

- [ ] You actually explored the existing files in `agent-school/courses/`; the file list in your plan is based on a real scan, not a guess
- [ ] The plan document format is complete (all seven fields), and every step has a clear description of its output
- [ ] The plan document marks at least one checkpoint and one risk point
- [ ] You did not sneak off and implement anything (the README.md or any other non-required file was not created)
- [ ] Distilled 1 skill card into your dorm's skills/
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson J11.
