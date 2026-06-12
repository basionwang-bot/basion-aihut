> 🌐 English ｜ [中文](../../foundations/J09-reverse-interview.md)

# Lesson J09 · Reverse-Interview the Requirements: Four Question Types + Seven-Field SPEC

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J08 ｜ Difficulty: ★★☆ ｜ Source: this repo's practical series, Module 2 "Let Claude interview you back" + Anthropic best practices (clarification before action)

---

## 📖 What you'll learn

After this lesson, when you receive a vague task, you will **never again put your head down and start guessing** — instead you'll play the role of a seasoned interviewer, draw out every unclear question one by one, lock the requirements into a black-and-white SPEC, and only then start working.

Picture a contractor who gets a "help me redo the kitchen" request and starts knocking down walls without asking a single question — two days later you discover the tile color is wrong, the cooker is in the wrong spot, and the bill came in twice the budget. **When things go wrong, everyone loses.** The experienced contractor does it differently: walks around, asks what feel you're going for, what the budget is, which wall can't be touched, where the cooker should go — writes the answers down, gets a signature, then starts work.

You are that contractor.

---

## 🧠 Core principles (internalize these as habits)

1. **Vague tasks: always interview first, then act.** Any "help me build a thing" description almost certainly hides ten different versions of "which kind of thing exactly" — surface those questions first, and you'll save yourself several rounds of rework.

2. **Only ask what the user hasn't thought of — never ask the obvious.** "Should this be in English?" is not worth asking. Focus your questions on: edge cases, trade-offs, unstated constraints, and success criteria.

3. **Ask everything at once — no drip-drip questioning.** Organize your questions and put them all on the table in one go. The worst thing for the user is "just answered that, and here comes another one" — that rhythm feels like an interrogation.

4. **Crystallize the interview into a SPEC.** What you talked through is vapor; SPEC is text. SPEC is the anchor for requirements — all execution, evaluation, and rework afterward is measured against it, not against memory.

5. **After the interview, open a fresh context to execute.** The interview phase accumulates rounds of back-and-forth; the context is already messy. A new session + clean desk + SPEC file is the optimal starting point for execution.

---

## 🛠 How to do it

**When to interview (trigger conditions):**

- The task description is under two sentences and has no concrete deliverable
- You can see "this could be done several different ways," but don't know which one the user wants
- The requirements contain subjective words like "appropriate," "nice-looking," or "optimized"
- The task touches multiple files or systems, or needs information only the user can provide

**Four categories of interview questions (match each to the right bucket):**

| Category | What to ask | Example |
|----------|-------------|---------|
| Scope | Where are the edges? What's explicitly out of scope this time? | "Just the home page, or all pages?" |
| Success criteria | How will you know it's correct when it's done? | "How will you know this feature works well?" |
| Constraints | What can't be touched or introduced? | "Any files or dependencies that are off-limits?" |
| Priority | If time runs short, what matters most? | "Speed vs. aesthetics — which comes first?" |

**After the interview, lock the conclusions in a SPEC with seven fields:**

The SPEC is the anchor for requirements — all execution, evaluation, and rework afterward is measured against it, not against memory. All seven fields must be filled in — none can be left blank:

```
[Task name]        ...
[Background & motivation]  why does this need to be done?
[Expected deliverable]     what is the final output? (file / feature / report)
[Out of scope]             what are we explicitly not doing this time?
[Success criteria]         how do we judge "done well"?
[Constraints]              boundaries, dependencies, files that can't be touched
[Open questions]           things without answers yet, to be confirmed later
```

How the seven fields map to the four interview categories: Scope → "Expected deliverable" + "Out of scope"; Success criteria → "Success criteria"; Constraints → "Constraints"; Priority → informs the ranking inside "Background & motivation." Once the interview is done, you can fill the table directly — no extra steps needed.

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: take a vague requirement, conduct a complete reverse interview, and produce a SPEC.**

Use the following intentionally vague requirement as your test case:

> "Help me tidy up the course files in agent-school."

Steps:

1. **Genuinely explore the repo first** (this is the foundation of the test — do not skip it):
   - List all files and subdirectories under `agent-school/`
   - Read `agent-school/课程地图.md` to understand the status distribution of courses (which are ✅, which are 🟡, which are ❌)
   - Randomly read the opening of 2–3 course files to understand filename conventions and formatting
   - Read `agent-school/出课标准.md` to understand what "tidying" might entail
   - **Record the concrete current state you observed**: file count, naming patterns, anomalies already spotted (e.g., filenames not matching the map, files missing a number, etc.)

2. **Design interview questions based on real observations**: list the questions you would ask the user (at least 6, covering all four categories: scope / success criteria / constraints / priority).
   - Every question must be traceable to something you observed in step 1 — not invented from thin air
   - Focus on "difficulties the user didn't think of" (e.g., how to handle inconsistent status labels? how to merge duplicate courses? are there broken prerequisite links?)
   - Do not ask non-questions like "should this be in Chinese?"

3. **Write out plausible simulated answers**: based on your real understanding of the repo, answer each question using reasonable assumptions (mark each as "Simulated user answer:"). Answers must be consistent with what you observed in step 1 — no self-contradictions.

4. **Produce a complete SPEC file**: using the seven-field format, consolidate the interview conclusions into a complete SPEC, written to `agent-school/skills/reverse-interview-spec-demo.md`. All seven fields must be filled in; success criteria and constraints must have specific content (not "TBD").

5. **Distill a skill card**: capture "trigger conditions + four interview question types + seven-field SPEC template" as `agent-school/skills/reverse-interview.md`.

> ⚠️ This lesson requires no internet access, no real accounts, and no changes to any course files. You only need to read directories/files and create two skills-related files.

---

## 🎓 Pass criteria

- [ ] You **genuinely explored the repo**: read `agent-school/课程地图.md`, `出课标准.md`, and at least 2–3 course file headers, and recorded specific observations
- [ ] You have **at least 6 interview questions**, covering all four categories (scope / success criteria / constraints / priority), and every question can be traced back to a real observation from step 1
- [ ] Interview questions focus on "difficulties the user didn't think of" — no filler questions like "should it be in Chinese?"
- [ ] Your **simulated answers are consistent with the actual state of the repo**, not fabricated
- [ ] Your **SPEC has all seven fields**, with specific content in success criteria and constraints (not "TBD")
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson J10.
