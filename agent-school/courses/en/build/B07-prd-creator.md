> 🌐 English ｜ [中文](../../build/B07-prd-creator.md)

# Lesson B07 · PRD Creator: Turn an Idea Into a Professional Product Requirements Document

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07; B06 (PM Skills) recommended first ｜ Difficulty: ★★ ｜ Source: AungMyoKyaw/prd-creator · [github.com/AungMyoKyaw/prd-creator](https://github.com/AungMyoKyaw/prd-creator) + TechNomadCode/AI-Product-Development-Toolkit · [github.com/TechNomadCode/AI-Product-Development-Toolkit](https://github.com/TechNomadCode/AI-Product-Development-Toolkit)

---

## 📖 What you'll learn

You have an idea: "build a loyalty-points mini-app for a local shop." But between idea and product there's a gap — you can't clearly answer: what features exactly? What technology? What's the UI logic? What does the dev team need to see before they can start?

The solution to that gap is called a **PRD (Product Requirements Document)**. PRD Creator is an open-source tool that generates a professional PRD with AI in one pass (GitHub ~25 ★): describe your idea → AI generates → export Markdown. Three steps.

Paired with TechNomadCode's AI Product Development Toolkit (a prompt-template library), you can also continue from the PRD to generate a UX spec, MVP plan, and test strategy — the complete workflow from idea to product.

After this lesson you'll be able to:
1. Run PRD Creator locally (or call the templates directly from any AI)
2. Turn a product idea into a complete PRD with all 9 sections
3. Export a Markdown file to hand off to the dev team

> 🌍 **International users:** PRD Creator originally defaults to **Google Gemini API** (requires a Google account). If you have a Gemini API key, use Option A. If you prefer OpenAI, Anthropic, or another provider, use **Option B** (the AI Product Development Toolkit + your preferred model) — it achieves the same result and is straightforward.

**Official resources:**
- PRD Creator repository: [github.com/AungMyoKyaw/prd-creator](https://github.com/AungMyoKyaw/prd-creator)
- AI Product Development Toolkit: [github.com/TechNomadCode/AI-Product-Development-Toolkit](https://github.com/TechNomadCode/AI-Product-Development-Toolkit)

---

## 🧠 Core principles

1. **PRD = the product's "architectural blueprint."** Before construction begins, you need blueprints — otherwise the crew doesn't know how many floors, what each floor does, or what materials to use. A PRD is the product's blueprint. Engineers, UI designers, and QA engineers read this document and know exactly what to build. Starting without a PRD is how you end up "realizing you're going the wrong direction halfway through."

2. **AI's core value in generating a PRD is "scaffolding."** The AI-generated PRD is not the final version — it gives you a fully structured draft (all 9 sections filled in) in 15 minutes. You refine the details from there. That's 10× faster than starting from a blank document.

3. **9 sections cover the main dimensions of product decision-making.** PRD Creator generates a PRD containing: product overview, target users, core features, user stories, tech stack, design constraints, success metrics, milestone plan, and risks & dependencies. Miss any one section and you have a blind spot.

4. **Gemini ≠ the only choice.** PRD Creator originally requires Google Gemini, but the heart of "using AI to generate a PRD" is the prompt — any capable conversational AI can complete the same task. Swap in any provider you have access to; the output quality is the same or better.

5. **PRD is a starting point, not an endpoint.** After writing the PRD, use subsequent templates from the AI Product Development Toolkit to keep going — generate a UX User Flow, MVP development plan, test strategy… building out a complete product development pipeline.

---

## 🛠 How to use it

### Option A: Run PRD Creator locally (requires a Gemini API key)

> ⚠️ **Gemini API note:** Google Gemini API requires a Google account. If you have one, proceed as follows. If not, go straight to **Option B**.

```bash
# Clone the repository
git clone https://github.com/AungMyoKyaw/prd-creator.git
cd prd-creator

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:3000` (or the default Next.js port) after startup.

Click ⚙️ Settings and enter your Gemini API key (obtain from [aistudio.google.com](https://aistudio.google.com) — requires a Google account).

> ⚠️ **Get your owner's confirmation before installing.** `npm install` will pull dependency packages.

### Option B: Use the template library + any AI model (recommended)

This option requires no software deployment — just an AI model API or web interface (OpenAI, Anthropic Claude, DeepSeek, Gemini, or any capable model).

**Step 1: Get the AI Product Development Toolkit templates**

```bash
git clone https://github.com/TechNomadCode/AI-Product-Development-Toolkit.git
cd AI-Product-Development-Toolkit
```

**Step 2: Generate your PRD using the template**

Open the `PRD.md` file (or the corresponding prompt template file) and paste its contents into your AI chat interface (Claude, GPT-4, DeepSeek, etc.), then add your product idea:

```
[paste template content]

My product idea is:
[describe your product idea in 200–500 words, covering: who the target users are,
what problem it solves, and what the main features are roughly]
```

The AI will guide you section by section through completing the PRD.

**Step 3: Generate UX spec and MVP plan (follow-up)**

After the PRD is generated, continue with the `UX-User-Flow.md` template:
```
[paste UX-User-Flow template]
Here is my PRD: [paste the PRD from the previous step]
Please generate the UX spec based on the PRD.
```

Then use `MVP-Concept.md` to define the MVP scope:
```
[paste MVP-Concept template]
Here is my PRD: [paste PRD]
Please help me define a focused MVP scope.
```

### The 9 PRD sections explained

| Section | Content | Why it matters |
|---------|---------|---------------|
| Product Overview | What it is in one sentence | The shared starting point for everyone |
| Target Users | Who will use it | Avoids "designing for everyone = designing for no one" |
| Core Features | What it does and doesn't do | Prevents scope creep |
| User Stories | Use scenarios from the user's perspective | Helps engineers understand "why this feature" |
| Tech Stack | What technology will implement it | Lets engineers assess feasibility |
| Design Constraints | What can't be done; what must be met | Surfaces hidden limitations |
| Success Metrics | How you define "built successfully" | Enables objective evaluation of results |
| Milestone Plan | What to deliver and when | Keeps the project moving rhythmically |
| Risks & Dependencies | What might make it fail | Anticipate and mitigate early |

### ⚠️ Safety boundaries

**A no-code/AI tool the moment it "connects to a real database, uses a production key, or goes public" stops being a toy and becomes a real system. Three things — connecting real data, going public, and incurring costs — all require an explicit "ask the owner first":**

```
□ Entering an API key (Gemini / OpenAI / Anthropic / DeepSeek / etc.) — tell your owner this consumes API quota
□ Using AI to generate a PRD that includes real business data or competitor info — confirm your owner allows sending it to the AI
□ Sharing the PRD document with the dev team — confirm your owner has reviewed it and approves sharing
□ Starting actual development based on the PRD — this goes beyond "writing a document"; confirm your owner has approved the development phase
□ The PRD includes plans to integrate external APIs or third-party services — confirm service terms and costs first
```

---

## 📝 Graduation test (must be done for real — submit evidence)

**Task: turn a product idea into a complete PRD and export it as a Markdown document.**

**Phase 1: Choose your approach**

1. Tell your owner which option you plan to use (Option A: PRD Creator + Gemini; Option B: AI Product Development Toolkit + your preferred model) and explain why. Proceed after your owner confirms.

**Phase 2: Generate the PRD (inform your owner that API quota will be consumed first)**

> ⚠️ **Tell your owner that API quota will be consumed. Proceed only after confirmation.**

2. Choose a product idea (options: a self-ordering mini-app for a local restaurant, a family shared shopping list app, a personal knowledge management tool, a daily stand-up notes tool for a team — your choice or your own idea).
3. Use your chosen approach to generate a complete PRD. The PRD must include all 9 sections (if using the Toolkit templates, complete each section in turn).
4. Export the PRD as a Markdown file. Screenshot or show the first 30 lines of the final Markdown file.

**Phase 3: Review the PRD**

5. Review the generated PRD yourself. Find 2–3 places where "the AI was too vague and needs more specific detail," and manually flesh them out. Screenshot your changes.
6. In one sentence, describe what "success metrics" the PRD sets — do you think they are reasonable? Why?

**Phase 4: Follow-up (optional)**

7. (Optional) Use the `UX-User-Flow.md` or `MVP-Concept.md` template to generate a UX spec or MVP scope document.

**Phase 5: Consolidate**

8. **Write a skill card**: distill "PRD Creator usage steps + AI Product Development Toolkit workflow + PRD 9-section guide + alternative model options + safety boundaries" into `skills/prd-creator.md`.

---

## 🎓 Graduation criteria

- [ ] You can name all 9 PRD sections and explain the core purpose of each
- [ ] You chose an appropriate tool option and can explain your reasoning (trade-offs between different AI options)
- [ ] You generated a PRD with all sections complete — exported Markdown file or screenshot evidence provided
- [ ] You reviewed the generated PRD and made manual improvements — can explain what you changed
- [ ] You can explain the value of "AI-generated PRD" (scaffolding) and its limitation (details need human review)
- [ ] You completed all 5 items on the safety boundaries checklist
- [ ] You have added 1 skill card to your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-fi fallback per [School Rules §4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it on your report card and move on.
