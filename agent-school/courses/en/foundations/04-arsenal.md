> 🌐 English ｜ [中文](../../foundations/04-arsenal.md)

# Lesson 4 · Gear Up Your Arsenal

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons 1, 2, and 3 ｜ Difficulty: ★★☆ ｜ Source: this repo's "Claude Code in Practice" series ｜ Human versions: `content/posts/claude-code-90-arsenal.md` and `claude-code-06-config.md`

---

## 📖 What you'll learn

After this lesson, you will **know what tools you have in your hands and where to find more** — instead of starting from scratch with bare hands every single time.

---

## 🧠 Core principles (internalize these as habits)

1. **Look for something ready-made before you build your own.** Before starting any task, ask: "Is there already a skill or tool for this kind of work?"
2. **Know your four types of gear:**
   - **Skill** = a tool drawer you slide open for a particular kind of job;
   - **Subagent** = a specialist you can call in to help;
   - **Hook** = an automatic tripwire — fires whenever a specific action happens;
   - **Plugin** = a gift box that packages the above together — install it in one shot.
3. **Equip what you need, don't hoard.** Piling up tools you never use just adds clutter and noise.
4. **Any fixed process you repeat more than three times deserves to be packaged.** Turn it into a parameterized, one-call skill — stop re-building it by hand.

---

## 🛠 How to do it

- Where to find ready-made gear: the official plugin marketplace (`/plugin`), the official skills repository (github.com/anthropics/skills), and curated community collections (awesome-claude-skills, etc.).
- Deciding which type of gear to reach for:
  - Just "knowledge or a process for a certain job" → **Skill**;
  - "Needs to run in parallel, or risks blowing out the context" → **Subagent**;
  - "Must run every single time, zero exceptions" → **Hook**;
  - "Want to install a whole set at once" → **Plugin**.

---

## 📝 Graduation test (do it for real, submit evidence)

1. **Inventory your gear**: list the tools and capabilities you **actually have right now** — can you read files? run commands? dispatch subagents? Are there any skills or hooks already configured in this repo? Check `.claude/` and `AGENTS.md` / `CLAUDE.md`. Write down only what you **genuinely found** in your report card.
2. **Configure a workflow**: pick one thing "you might do repeatedly in this repo" (e.g., "add a new article and verify the site isn't broken"), and write out a **reusable step-by-step checklist** — the embryo of a skill.
3. **Gap analysis**: write down "what would I still need in order to turn the above into a one-click skill, and where would I go to find it?"
4. **Bring back a real tool**: skills teach you how to think, but some work needs real tools. Pick one off-the-shelf tool that solves a **genuine need for your user** (for example, `content/posts/claude-code-90-arsenal.md` covers **Scrapling** — a web-scraping framework with a built-in MCP server that plugs straight into Claude). Understand what it does, how to install it, and how to use it. In your graduation report, recommend it to the user as the **"tool you're bringing back"**: what specific problem it solves for them.

   > ⚠️ **Safety boundary (do not cross):** this step is "**understand + recommend**," not "go ahead and install." **Without explicit sign-off from the user, do not actually install new tools, do not scrape large amounts of data from the web, do not touch any real accounts.** Your job is to explain "what it is, how to install it, what problem it solves for you," and then **wait for the user's go-ahead before acting.** Do not install arbitrary dependencies or run scrapers just to tick a checkbox.

---

## 🎓 Pass criteria

- [ ] You **actually searched the repo** for existing configured gear (cited real files, e.g., `AGENTS.md`)
- [ ] You produced a reusable workflow checklist
- [ ] You can explain which of the four gear types to use in which situation
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then fill in the [Graduation Report](../../../templates/graduation-report-template.md) and **present it to the user in person**. 🎓
