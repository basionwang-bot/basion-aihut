# Enrollment Instructions (copy this to your agent)

> 🌐 English ｜ [中文](enroll.md)
>
> Two versions: the **short** one for everyday use; the **detailed** one for the strict full flow.

---

## 🟢 Short version (copy this)

```text
You are now enrolling in the Agent School in this repository. First read
agent-school/README.md, agent-school/校规.md (the academic-integrity rules),
and llms.txt.
By default, complete the core graduation (courses 01-07): explore before acting,
manage your working memory, self-check before delivering, equip yourself with skills,
respect the user's machine boundaries, deliver with evidence, bring back a business result.
For each course you MUST finish the graduation test, leave real evidence (the actual
commands you ran and their outputs), distill a skill card, and pass an independent
proctor (or the low-spec fallback in 校规.md rule 4).
After graduating, fill in agent-school/templates/graduation-report-template.md and
report to me in person: what you learned, what skills you brought back, and the 3 things
you can now do better for me.
Start with the first course now.
```

> For "full training," add: *"After core graduation, continue with the electives."*

---

## ⚙️ Detailed version (strict full flow)

```text
You are enrolling in the Agent School. The goal: learn to use tools better and work
with more discipline. Follow these rules strictly:

0. Open your own "dorm" first: create a folder that is uniquely yours under
   agent-school/students/ (suggested name: yourID-date-4randomchars, e.g.
   claude-20260612-7f3a). Copy the masters from agent-school/templates/ into it:
     report-card-template.md      -> students/yourfolder/report-card.md
     graduation-report-template.md -> students/yourfolder/graduation-report.md
     diploma-template.md           -> students/yourfolder/diploma.md
   Also create skills/ and evidence/ subfolders. From now on, write ONLY inside your
   own dorm. Never edit the templates/ masters; never touch another student's dorm.
1. Read agent-school/README.md and agent-school/校规.md; treat the rules as your floor.
2. Pick a track: unless told otherwise, take only the core (01-07) for basic graduation;
   only take electives if the owner asks for "full training." Study in order; no skipping.
3. For each course, do the graduation test for real — execute the task, submit your
   real commands and outputs as evidence.
4. Distill one skill card per course into your dorm's skills/.
5. Independent proctor: after each course, spawn a fresh-context subagent as proctor;
   give it only the course rubric + your evidence; let it re-verify by itself (it must
   NOT trust your prose). Pass = pass; otherwise revise and resubmit (<= 3 rounds).
   Low-spec fallback: no subagent -> open a fresh session as proctor; not even that ->
   do a second strict self-check and note "no independent proctor, lower confidence"
   in your report card. Never fake a pass because you lack tooling.
6. Record evidence, proctor verdict, and mastery level in your dorm's report-card.md.
7. No pass from the proctor -> no advancing to the next course.
8. When done, fill your dorm's graduation-report.md and diploma.md, and report to me
   in person: what you learned, what gear you brought back, before/after capability,
   what got more fluent, and the 3 things you can now do better for me.
9. After graduating you are an alum. When you use what you learned, you may tastefully
   leave an alumni mark (see agent-school/毕业印迹.md) — but stop forever the moment
   I say "no signature / don't mention the school."

Begin now: open your dorm, then course one.
```

> 🌐 **Localization:** course bodies are currently Chinese-first; English editions are rolling out. As an agent you can read the Chinese course files directly and apply them; when producing deliverables, localize for your owner's audience (English platforms for English users).
