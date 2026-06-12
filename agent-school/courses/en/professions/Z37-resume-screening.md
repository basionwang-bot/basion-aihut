> 🌐 English ｜ [中文](../../professions/Z37-resume-screening.md)

# Lesson Z37 · Resume Screening Assistant

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: Anthropic official best practices (tool use & structured output) · LinkedIn / Indeed job description best practices

---

## 📖 What you'll learn

By the end of this lesson, you'll produce a **resume screening report your principal can use straight away** — not a vague "these people seem decent" gut-feel, but a per-criterion scorecard benchmarked against the job description, a ranked candidate list, and a short "recommend / pass" note for each person.

Picture this: HR has 200 resumes piling up on their desk and the deadline is tomorrow. You're the sharp intern who can scan all 200 against the job's key criteria in 10 minutes, stamp a score on each one, and hand over a tidy top-10 list. HR just confirms your findings instead of re-reading the whole stack from scratch.

**Three things you need to do:**

1. **Understand the role** — extract scoring dimensions from the JD (job description) your principal gives you
2. **Score each resume** — rate every resume against those dimensions and document your reasoning
3. **Produce a ranked report** — compile everything into a ready-to-use recommendation list

> ⚠️ **Iron rule on candidate data privacy: resumes contain highly sensitive personal information.** Every piece of data you use for scoring must stay within the current conversation only. Never send candidate names, phone numbers, ID numbers, photos, or any other personal details to third-party tools, APIs, or external network requests. Minimum-necessary principle: use only work history and skills to complete the scoring task; treat all other private fields as invisible.

---

## 🧠 Core principles (internalize these as habits)

1. **The JD sets the rules — your personal taste doesn't.** The only measuring stick is the JD your principal gave you. You think someone "looks impressive," but the JD doesn't require that skill? Then don't add points. Likewise, anything the JD explicitly requires is a deduction if it's missing.

2. **Dimensions must be measurable, not just feelings.** "Strong communicator" is a feeling. "3+ years of cross-functional project management experience" is a measurable dimension. Every dimension you extract from the JD must have a corresponding "evidence sentence" you can point to in the resume.

3. **Scoring is not a life sentence.** Your report is a draft; HR or your principal is the final decision-maker. A low scorer may have qualities you can't see; a high scorer may not fit the company culture. Your job is to organize information clearly — the decision belongs to the human.

4. **Stay consistent.** Apply the same standard to resume #1 as to resume #100. Don't loosen the scoring just because you're in a good mood today. Pin the dimension table in your mind before you start each batch.

5. **Resumes are other people's private data.** The screening report goes to your principal only — don't forward it, don't archive it to third parties, don't share screenshots.

---

## 🛠 How to do it

### Step 1: Extract a scoring dimension table from the JD

As soon as you have the JD, break it down using this template:

```
[Job title] ____
[Hard thresholds] (fail here = immediate disqualification)
  - e.g. Bachelor's degree or above
  - e.g. 5+ years in the same role
  - e.g. Holds XX industry certification

[Core capability dimensions] (0–10 points each)
  Dimension 1: ____  (keywords from JD)  Weight ___%
  Dimension 2: ____  Weight ___%
  Dimension 3: ____  Weight ___%
  Dimension 4: ____  Weight ___%
  (Aim for 3–5 dimensions; weights must total 100%)

[Bonus factors] (add 1–3 points each if present)
  - e.g. FAANG / top-tier tech company background
  - e.g. Overseas study experience (only counts if role has international scope)

[Penalty factors] (deduct 1–3 points each if present)
  - e.g. Job-hopping (average tenure under 1 year)
  - e.g. Suspected falsification (contradictions within the resume)
```

> Practical tip: ask your principal to paste the full JD text directly to you, then do the breakdown yourself. Once you've drafted the dimension table, confirm it with your principal before scoring anything — this prevents rework later.

### Step 2: Score each resume (single-resume processing template)

```
[Candidate ID] #001  (use IDs, not names, to protect privacy)
[Hard thresholds] ✅ All passed / ❌ Failed  (if failed, note reason and stop — no further scoring)

[Dimension scores]
  Dimension 1 - [name]:  _/10  Evidence: "direct quote from resume"
  Dimension 2 - [name]:  _/10  Evidence: "direct quote from resume"
  Dimension 3 - [name]:  _/10  Evidence: "direct quote from resume"
  Dimension 4 - [name]:  _/10  Evidence: "direct quote from resume"

[Bonus / penalty]  +_ / -_  Reason: ____

[Weighted total]  ___/100

[One-line verdict]  Recommend for next round / Backup / Not recommended
[Reasoning]  Under 50 words — state the single most decisive point
```

### Step 3: Summary report (the final format delivered to your principal)

```markdown
# Resume Screening Report
Role: ____  Resumes received: __  Screening date: ____
Generated by: AI draft — final review: HR / principal

## Recommended for next round (top N)
| Rank | ID    | Weighted score | One-line highlight |
|------|-------|----------------|--------------------|
| 1    | #005  | 87/100         | 5 years in the same space + led 15-person team |
| 2    | #012  | 82/100         | Full certifications + quantifiable project results |
| ...  |       |                |                    |

## Backup candidates (worth a look)
(same format as above)

## Not shortlisted
Total: __ candidates. Primary reasons: __ (education mismatch / insufficient experience / excessive job-hopping)

## Notes on this screening
- Scoring dimensions sourced from [job JD, dated: ____]
- AI scores are for reference only; final decisions confirmed by HR or principal
- Original resumes handled securely; this report contains no phone numbers, ID numbers, or other sensitive fields
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: take one real JD plus at least 5 simulated resumes, run through the full process, and produce a screening report.**

If your principal doesn't have a real JD handy, use this practice JD:

> **Practice JD: Product Operations Specialist**
> Requirements: Bachelor's degree or above, 1–3 years of internet product/operations experience, proficient in data analysis tools (Excel/SQL), experience with user growth or retention projects; bonus: short video or live-streaming platform operations experience.

**What you need to accomplish:**

1. Extract a **scoring dimension table** from the JD above (3–5 dimensions + weights); confirm it with your principal before scoring.
2. Fill in a complete **scorecard** for at least **5 simulated resumes** (invent 5 candidates with different backgrounds yourself).
3. Compile a **screening report** using the exact format in Step 3 above.
4. Self-check: does the report contain any candidate phone numbers, ID numbers, or other private fields? Remove them if so.

> ⚠️ If your principal provides real resumes: use them only within the conversation — never send any candidate information to an external API, tool, or link. Once scoring is done, let your principal know the report is ready, and let them decide how to store and share it.

5. **Distill a skill card**: write "The 3-step resume screening method" into `skills/resume-screening.md`.

---

## 🎓 Pass criteria

- [ ] You extracted a **dimension table** from the JD (3–5 dimensions + weights + hard thresholds), confirmed by your principal
- [ ] You filled in a complete **scorecard** for every resume (per-dimension scores + evidence quotes + one-line verdict)
- [ ] You produced a **summary screening report** (ranked table + backup list + not-shortlisted explanation)
- [ ] The report **contains no phone numbers, ID numbers, photos, or other sensitive private fields** and follows the minimum-necessary principle (verifiable)
- [ ] Throughout the process, **no candidate information was sent to any third-party interface or external link**
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor gives the green light — log it on your report card and hand the screening report to your principal.
