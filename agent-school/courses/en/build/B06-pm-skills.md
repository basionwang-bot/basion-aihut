> 🌐 English ｜ [中文](../../build/B06-pm-skills.md)

# Lesson B06 · Product Manager Skills: Let AI Be Your Product Manager

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source: deanpeters/Product-Manager-Skills · [github.com/deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills) ｜ License: CC BY-NC-SA 4.0

---

## 📖 What you'll learn

You've seen the kind of requirements documents a product manager writes — user stories, market positioning, competitive analysis, feature prioritization… each piece requires a framework, a methodology, and years of experience.

**Product Manager Skills** is an open-source resource that packages these professional PM frameworks into "Claude skills" — 49 practical PM frameworks and 6 end-to-end workflows assembled by deanpeters on GitHub, all as Markdown files, no dependencies, load them into Claude Code and they're ready to use.

Think of it as a "product manager's tool handbook" slotted into Claude's brain. You describe a product problem; Claude automatically reaches for the right professional framework to answer it.

After this lesson you'll be able to:
1. Load Product Manager Skills into Claude to activate PM expertise
2. Use the "User Story" framework to structure requirements
3. Walk through a complete "requirements refinement → product review" workflow

> 🌍 **International users:** Pure Markdown files, no external dependencies, completely free (CC BY-NC-SA 4.0 — non-commercial share-alike license). Works with Claude Code or any AI tool that supports loading skills.

**Official resources:**
- Product Manager Skills repository: [github.com/deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills)
- License: CC BY-NC-SA 4.0 (non-commercial use, attribution required, share alike)

---

## 🧠 Core principles

1. **Skills = installing a professional skills chip into Claude.** Imagine Claude is a smart generalist. Product Manager Skills installs a "PM expertise chip" — loaded with 49 frameworks. When you say "help me write a user story," Claude doesn't improvise; it follows the professional user story standard format precisely.

2. **Three categories of skills, each with its own purpose:**
   - **Component Skills (21)**: one-off professional deliverables. E.g. "User Story," "Positioning Statement," "Customer Journey Map" — give it an input, get back a standard document.
   - **Interactive Skills (22)**: conversational advisors. E.g. "Prioritization Advisor" — it keeps asking you questions, like an experienced PM mentor guiding you through decisions.
   - **Workflow Skills (6)**: end-to-end processes spanning 2–4 weeks — from discovering user problems to writing a PRD to roadmap planning, all in one continuous flow.

3. **"JTBD" is the soul of this system.** Among the 49 skills, one framework runs through everything: **Jobs-to-be-Done (JTBD)**. Its core insight: users don't buy products for the products themselves — they buy to "get something done." This mindset shifts requirements analysis from "what does the user want?" to "what job is the user trying to accomplish?" — avoiding the trap of blindly chasing a feature list.

4. **Frameworks are tools, not commandments.** These 49 frameworks are crystallized professional experience, not rigid templates. Apply them flexibly to your specific project — not every project needs all of them. Pick the ones you need.

5. **CC BY-NC-SA 4.0: free for non-commercial use; commercial use requires discussion.** The license allows free use and modification, but **prohibits direct use for commercial purposes**. If your owner wants to package the skills content into a commercial product for sale, they need to contact the original author first.

---

## 🛠 How to use it

### Step 1: Get Product Manager Skills

```bash
# Option A: clone the repository locally
git clone https://github.com/deanpeters/Product-Manager-Skills.git
cd Product-Manager-Skills
```

Or download the Starter Pack ZIP directly from GitHub Releases.

> ⚠️ **Get your owner's confirmation before cloning.** Tell your owner this is a Markdown skills pack and will be cloned to a local directory.

### Step 2: Understand the repository structure

After cloning, see what's inside:

```
Product-Manager-Skills/
├── skills/           # Individual skill files (.md)
│   ├── user-story.md
│   ├── positioning-statement.md
│   ├── jobs-to-be-done.md
│   ├── prioritization-advisor.md
│   ├── prd-development.md
│   └── ...  (43 skills total)
├── commands/         # Workflow command files
│   ├── discover.md
│   ├── write-prd.md
│   ├── plan-roadmap.md
│   └── ...  (6 commands total)
└── scripts/          # Helper scripts
    ├── run-pm.sh
    ├── find-a-skill.sh
    └── find-a-command.sh
```

### Step 3: Activate PM Skills in Claude Code

**Option A: Read a skill file directly**

In your Claude Code conversation, paste the content of the skill file you want to use, or have Claude read the local file:

```
Please read the ./skills/user-story.md file, then use this framework to analyze the following requirement…
```

**Option B: Use the scripts to find a skill quickly**

```bash
# Find relevant skills
./scripts/find-a-skill.sh --keyword onboarding

# Find relevant workflow commands
./scripts/find-a-command.sh --keyword prd
```

**Option C: Specify a skill manually and run it**

Reference the skill content directly in Claude Code:

```
Using the [skill name] framework from Product Manager Skills, help me complete the following task:
[your specific requirement]
```

### Step 4: Walk through a requirements-refinement workflow

**Example scenario: refining requirements for a "team knowledge base tool"**

**Step 1: JTBD analysis** — using `jobs-to-be-done.md`

```
Using the JTBD framework, help me analyze the target users of a "team knowledge base tool":
in what situations they would need it, and what "job" they are really trying to get done.
```

**Step 2: Write user stories** — using `user-story.md`

```
Based on the JTBD analysis above, use the user story framework to write 5 core user stories.
Format: As a [user role], I want to [do something], so that [I get some value].
```

**Step 3: Prioritize** — using `prioritization-advisor.md`

```
Using the prioritization advisor framework, help me decide which of the 5 user stories
above should come first and which can be deferred.
```

**Step 4: Problem statement** — using `problem-statement.md`

```
Synthesize the analysis above into a clear Problem Statement.
State: whose problem we're solving, what the current situation is,
and what the ideal state looks like after it's solved.
```

### Step 5: Run a full workflow (advanced)

Use the `write-prd.md` command to walk through the full PRD development process:

```
Please load the commands/write-prd.md workflow and guide me through completing a PRD for a "team knowledge base tool."
```

This workflow guides you through providing information step by step, ultimately outputting a structured product requirements document.

---

## 📝 Graduation test (must be done for real — submit evidence)

**Task: use Product Manager Skills to walk through a complete requirements-refinement process and produce real deliverables.**

**Phase 1: Load and explore**

1. Clone the repository locally. Use the `find-a-skill.sh` script to search for the keyword "user." Screenshot or record which skill files are returned.
2. List the 3 skills and 1 command you think are most useful, and explain why.

**Phase 2: Requirements refinement (main task)**

Choose a product idea that interests you or your owner (e.g. a meeting-notes tool for small teams, a family shared calendar app, a local shop loyalty program). Walk through the following 4 steps and produce a deliverable for each:

3. **JTBD analysis**: using `jobs-to-be-done.md`, output 3 core "jobs to be done" for the target user.
4. **User stories**: using `user-story.md`, output at least 5 correctly formatted user stories.
5. **Prioritization**: using `prioritization-advisor.md`, prioritize the 5 user stories and explain the reasoning.
6. **Problem statement**: using `problem-statement.md`, output a complete problem statement (under 200 words, sharp and specific).

**Phase 3: Review simulation**

7. Organize the deliverables above into a requirements-refinement summary of under 500 words, including:
   - Whose problem we're solving (JTBD)
   - Core user stories (select the 3 most important)
   - Prioritization conclusion
   - Problem statement

**Phase 4: Consolidate**

8. **Write a skill card**: distill "Product Manager Skills usage steps + core skills list + workflow descriptions + licensing notes" into `skills/pm-skills.md`.

---

## 🎓 Graduation criteria

- [ ] You can explain the differences between Component Skills / Interactive Skills / Workflow Skills and when to use each
- [ ] You used the JTBD framework to complete a target-user analysis and produced at least 3 "jobs to be done"
- [ ] You output at least 5 correctly formatted user stories
- [ ] You completed a prioritization and can explain the ranking rationale
- [ ] You output a clear and specific problem statement
- [ ] You can explain the CC BY-NC-SA 4.0 restriction on commercial use
- [ ] You have added 1 skill card to your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-fi fallback per [School Rules §4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it on your report card and move on.
