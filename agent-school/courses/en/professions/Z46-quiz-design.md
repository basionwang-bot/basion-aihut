> 🌐 English ｜ [中文](../../professions/Z46-quiz-design.md)

# Lesson Z46 · Quiz Design & Scoring Rubrics

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, Z45 Lesson Plan (recommended) ｜ Difficulty: ★★☆ ｜ Source: Bloom's Taxonomy of Educational Objectives; general K12 assessment design practice; Boolean Bear coding curriculum context

---

## 📖 What you'll learn

After this lesson, you will produce a **ready-to-use quiz set with scoring rubrics** — not a random collection of questions, but a complete assessment instrument that covers the specified learning objectives, has tiered difficulty, and includes scoring criteria that let students and parents immediately understand "what score do I get for this answer, and why was I marked down."

Think of yourself as an item writer at an examinations board. Your job is not to "think of questions on the fly" — you start with a list of learning objectives (what students are supposed to master) and then translate those objectives into concrete, answerable questions with correct answers and scoring rules, in the right proportions, so that any two markers looking at the same paper give the same score.

That is called item writing. With method.

---

## 🧠 Core principles (internalize these as habits)

1. **Decide what to assess before you write a single question.** Before writing any item, list "which knowledge points / skills does this quiz need to test?" — this is called the assessment blueprint. Writing without a blueprint is like shooting with your eyes closed and asking "where was the target?" afterward. Every item must map back to at least one objective.

2. **Use Bloom's six levels to create a tiered difficulty structure.** The classic framework for educational assessment categorizes thinking into six levels:
   - **Remember**: recall / list (foundational)
   - **Understand**: explain / describe
   - **Apply**: use what was learned to do something new
   - **Analyze**: break down / compare / find causes
   - **Evaluate**: judge / assess / argue with reasons
   - **Create**: design / invent / construct (highest level)

   A good quiz is not all recall. Include a reasonable proportion of Apply and Analyze items — that's what actually tests whether students genuinely understood.

3. **Difficulty must be graduated — not all hard, not all easy.** A general K12 guideline: "foundational items (everyone should get these) 30% — mid-level items (challenging but achievable) 50% — stretch items (to differentiate) 20%." All-easy quizzes are meaningless; all-hard quizzes crush motivation.

4. **A scoring rubric is the other half of the question.** A subjective question without a rubric means two markers may disagree by 10 points — that's unfair. A rubric pre-defines what an excellent answer looks like, what an acceptable answer looks like, and what a weak answer looks like, so scoring becomes rule-bound rather than impressionistic.

5. **Questions must be clear and unambiguous.** A well-written item is one where "any student who studied the material honestly knows exactly what is being asked." If the item says "analyze…," specify which dimension to analyze and the word-count requirement. Don't make students guess the question's intent.

---

## 🛠 How to do it

### Step 1: Build a Knowledge × Difficulty blueprint

Before writing any item, fill in this table (your test blueprint):

```
| Knowledge point / skill    | Remember | Understand | Apply | Analyze | Total items | Total marks |
|----------------------------|----------|------------|-------|---------|-------------|-------------|
| Knowledge point A          |    1     |     1      |   1   |    0    |      3      |     15      |
| Knowledge point B          |    1     |     0      |   1   |    1    |      3      |     15      |
| Knowledge point C          |    2     |     1      |   0   |    0    |      3      |     10      |
| Totals                     |    4     |     2      |   2   |    1    |      9      |     40      |
```

Once this table is complete, you know: "I need 9 items — 4 recall, 2 understanding, 2 apply, 1 analysis." That's the skeleton of the quiz.

### Step 2: Item-type selection guide

| Item type | Best for | Pros | Cons |
|-----------|----------|------|------|
| Multiple choice | Remember, Understand | Easy to score, wide coverage | 25% chance of guessing correctly |
| True/False | Remember | Quick | 50% chance of guessing |
| Fill-in-the-blank | Remember, Understand | Cannot guess | Requires exact answer |
| Short answer | Understand, Apply | Tests expression | Some subjectivity in scoring |
| Case / scenario analysis | Apply, Analyze | Tests transfer of learning | Time-consuming, complex to score |
| Hands-on / performance | Apply, Create | Most authentic evidence of ability | Needs dedicated setting / equipment |

### Step 3: Scoring rubric format

**Objective items (multiple choice / true-false / fill-in-the-blank):**
Write the answer key directly: "Answer: X; marks: X; common misconception: …"

**Subjective items (short answer / case analysis):**
Use a table format:

```
[Item X — Scoring Rubric]
Full marks: X

| Band     | Marks | Criteria |
|----------|-------|---------|
| Excellent | X    | Accurately states … AND provides a concrete example … with clear logic |
| Proficient| X    | States the main point but example is vague / minor logical gap |
| Partial   | X    | States part of the answer; significant gap |
| Not yet   | 0    | Irrelevant to the question or completely incorrect |

Marker note: … (remind markers of points they may overlook)
```

### Step 4: Post-writing self-check

After completing the full item set, run through this checklist:

```
□ Does every item map to at least one learning objective? (No "orphan" questions that serve no goal)
□ Is difficulty distribution appropriate? (Foundation : Mid-level : Stretch ≈ 3:5:2)
□ Is every question clear and unambiguous? (Would someone who didn't write the quiz know
  exactly what is being asked?)
□ Does every subjective question have a scoring rubric? (Rubric describes observable behavior,
  not "is the answer good?")
□ Are the answer key / rubrics separated from the student-facing version?
□ Is the estimated time realistic? (How many marks per minute; is the total duration appropriate?)
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete quiz set with scoring rubrics for a specified course unit.**

**Recommended scenarios (pick one, or let the owner choose):**

- **Scenario A: Scratch Intro — "Sprites and Motion" unit quiz**
  - Target: Grades 3–4
  - Requirements: 10 items total, at least one each of MC / T-F / fill-in / short answer, full marks 40, 20 minutes

- **Scenario B: Python Basics — "Variables and Data Types" unit quiz**
  - Target: Grade 7
  - Requirements: 12 items total, including MC / fill-in / find-the-bug / short answer, full marks 50, 30 minutes

- **Scenario C: AI Literacy general quiz**
  - Target: Upper elementary or middle school
  - Requirements: 10 items, emphasis on Understand and Apply levels, full marks 40, at least 1 case-analysis item

**You must:**

1. **Fill in the Knowledge × Difficulty blueprint**: cover at least 3 knowledge points × 3 difficulty levels.

2. **Write the complete item set**: clear question wording, definite answers, appropriate mix of objective and subjective items.

3. **Scoring rubric for every subjective item**: table format, at least three bands.

4. **Complete the self-check**: tick off each item; fix any issues you spot before submitting.

5. **Produce two versions**:
   - Student version: questions only, no answers
   - Teacher version: questions + answers + rubrics + item-writer notes

6. **Distill a skill card**: write the item-writing workflow into `skills/quiz-design.md`.

> ⚠️ **Iron rule: produce quiz drafts only. Never enter items into any real assessment platform, operate any real examination-system account, or release results to any student or parent on the owner's behalf.**

---

## 🎓 Pass criteria

- [ ] **Blueprint complete**: at least 3 knowledge points × 3 difficulty levels in a matrix
- [ ] **Item count met**, at least 3 item types, difficulty distribution has a stated rationale
- [ ] **Every subjective item has a scoring rubric** with at least 3 bands describing observable behavior
- [ ] **Both student version and teacher version produced**: student version has no answers; teacher version has full answers, rubrics, and notes
- [ ] **Self-check completed**, every item ticked off
- [ ] At no point did you **enter items into any platform or operate any real examination system**
- [ ] Distilled 1 skill card into [`skills/`](../../../skills/)
- [ ] An **independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"
