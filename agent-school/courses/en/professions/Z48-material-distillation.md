> 🌐 English ｜ [中文](../../professions/Z48-material-distillation.md)

# Lesson Z48 · Material Distillation

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: Anthropic prompt library [docs.anthropic.com/prompts](https://docs.anthropic.com/en/resources/tool-use-examples) · Claude long-document analysis best practices [docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/long-context-tips](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/long-context-tips) · NotebookLM feed-and-query knowledge management [notebooklm.google.com](https://notebooklm.google.com)

---

## 📖 What you'll learn

After this lesson, you will take a pile of scattered inputs — multiple articles, a long report, meeting notes, course handouts — and distill them into **knowledge outputs the owner can use immediately**: knowledge cards, key-point summaries, action checklists, or comparison tables. The format is determined by the task; the content must always be precise and usable.

Here's a picture: you're a new research assistant, and the owner dumps a stack of documents on your desk — "organize these for me." The question is: organize into what? A summary? An outline? Cards? Key numbers? Decision recommendations?

**Without a clear direction, any organization effort is wasted.**

This lesson teaches you two things: first, clarify (or infer from context) what format the owner actually needs before you start; second, distill at high density — **every output must trace back to something in the source material, no free invention.**

This underlying logic is the same as NotebookLM's "feed-and-query" approach: treat the raw materials as a database. Your job is to query and distill, not to create and embellish.

---

## 🧠 Core principles (internalize these as habits)

**1. Distillation ≠ copying, and ≠ rewriting**

Think of squeezing an orange. The orange is the source material; the juice is the output. You're not moving the orange to a different basket (copying). You're not drawing the orange as an apple (rewriting). You're pressing out the essence and leaving the pulp behind.

What counts as "essence" depends entirely on what problem the owner is trying to solve. An action-oriented owner wants decision rationale and next steps. A learning-oriented owner wants core concepts and memory anchors.

**2. Lock in the "distillation purpose" before touching anything**

Before you start, fill in these two blanks:
- "After reading through these materials, the owner needs to make a decision / solve a problem, and that decision / problem is: **______**."
- "If only 3 pieces of information could be kept, the most important 3 are: **______**."

Can't fill them in? Ask the owner, or state in your output: "I'm assuming your goal is…"

**3. Every output must correspond to something in the source**

This is called being "grounded." For every point you write, you should be able to name where in the source material it comes from. If it's something you inferred, label it explicitly "(inference)." Hallucinations must never enter knowledge cards — the entire value of a knowledge card rests on its trustworthiness.

**4. Format follows function — resist format compulsion**

Not every task calls for knowledge cards, and not every task calls for a table. Match format to task:

| Task type | Best format |
|-----------|-------------|
| Meeting notes → action items | To-do list grouped by responsible person |
| Multiple competitor reports → comparison | Comparison table (dimensions × competitors) |
| Long course handout → review aid | Knowledge cards (concept + definition + example) |
| Policy / regulatory document → compliance checklist | Numbered list with deadlines flagged |
| Multiple articles → viewpoint synthesis | Grouped by argument + source citations |

**5. Density: less is more**

Distilling a 50-page document into 50 "key points" is not distillation. Good distillation principle: **100 pages → 10 core takeaways.** For every additional item, ask yourself: "If this were deleted, what would the owner lose?" If the answer is "not much" — delete it.

---

## 🛠 How to do it

### The standard five-step distillation workflow

**Step 1: Scan for structure, build the map**

Don't start line-by-line. Skim all materials quickly and form a mental map: "What is this pile of materials about? How many main topics are there?" Summarize each document / section in one sentence.

**Step 2: Clarify the distillation goal**

Based on the owner's task (or inferred from context), determine:
- Output format (cards / summary / checklist / table)
- Density (3 items? 10 items? one page?)
- Perspective (learning lens? decision lens? execution lens?)

**Step 3: Close-read with a filter on**

On the second pass, read with the question "does this sentence belong in my distillation?" Tag anything valuable and record its source (article title / section).

**Step 4: Aggregate and deduplicate**

Merge different sources that make the same point. Remove repetition. Express the merged insight as concisely as possible. If there's a contradiction (two sources hold opposing views), flag it explicitly: "Source A argues … while Source B argues … — there is a conflict here."

**Step 5: Self-check and format for delivery**

Before outputting, check each item: is this from the source, or did I add it? If I inferred it, does it have an "(inference)" label? Format into the structure the owner requested and deliver.

### Knowledge card template

```
[Knowledge Card] Topic: ___________
Source: ___________ (article / document title)

■ Core definition / claim (1–2 sentences)
___________

■ Key details (2–4 items, one per line)
• ___________
• ___________

■ Memory anchor (an analogy or concrete example)
"Think of it like…"

■ Links to other cards
→ See card: ___________
```

### Priority ordering for bulk materials

If the owner sends you more than 5 documents at once, don't process them all at the same level. First apply this triage:

1. **Documents with clear conclusions / data**: process first — highest density of value
2. **Documents with operational steps**: process next — strong action orientation
3. **Background / contextual documents**: process last — distill into "context note"

### Delivery format for the owner

```
=== Material Distillation Report ===
Materials processed:
  1. [Title / filename] — source / date
  2. [Title / filename] — source / date
  ...

Distillation goal (my interpretation):
  The owner's problem / decision is: ___________
  Output format: ___________
  Target density: ___________ items

---
[Body: knowledge cards / key-point summary / comparison table / action checklist]
---

Completeness statement:
  All items above are grounded in the source materials, except those marked "(inference)."
  Total materials processed: X; total core outputs: X items.
  The following information was not included, because ___________: [brief summary of omitted content]
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: take 3–5 real articles or documents and produce a complete Material Distillation Report.**

**Recommended source sets (pick one):**

**Set A (AI tools)**: pick 3 articles the owner has already published in `content/posts/`; distill into "an AI-agent starter knowledge-card set for beginners."

**Set B (industry reports)**: find 3 publicly available articles about "children's coding education market trends" (search on Google, TechCrunch, education-sector publications, etc.); distill into a "key findings summary for Boolean Bear Coding market positioning."

**Set C (course materials)**: take 3 lessons from `agent-school/courses/` (e.g., J01, J02, J03 or your own choice); distill into a "new-agent quick-start guide" as a numbered checklist.

**You must:**

1. **Produce the delivery package**: use the "Delivery format for the owner" template above — complete with material list + distillation-goal statement + body output + completeness statement.

2. **Density control**: average no more than 3–5 core outputs per source document. If a document genuinely has low value density, contribute only 1 item from it and explain in the completeness statement why you reduced it.

3. **Traceability**: after each output item, note the source (article title or lesson number) so a proctor can verify it.

4. **Format justification**: choose the most appropriate output format for your chosen source set and explain your reasoning at the top of the report.

5. **Distill a skill card**: write the five-step distillation workflow and card template into `skills/material-distillation.md`.

> ⚠️ **Iron rule: stay grounded.** Every output must trace back to the source material. Do not invent content, do not add what you "think should be there." Inferences must be labeled "(inference)."

---

## 🎓 Pass criteria

- [ ] You produced the **complete delivery package**: material list + distillation-goal statement + body output + completeness statement
- [ ] Every output item **traces back to a specific source** (article title or document section)
- [ ] No **hallucinations or free additions** mixed in; inferences are labeled "(inference)"
- [ ] **Density is appropriate**: no filler (≤5 items per source), no major gaps (core arguments are covered)
- [ ] Format matches the task, and **you explained your format choice** in the report
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (fresh-context subagent, or the low-spec fallback in [校规 rule 4](../../../校规.md)) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, complete the [graduation report](../../../templates/graduation-report-template.md), and hand the distillation report to the owner.
