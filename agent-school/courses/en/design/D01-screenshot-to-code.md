> 🌐 English ｜ [中文](../../design/D01-screenshot-to-code.md)

# Lesson D01 · screenshot-to-code: Turn a Screenshot into a Web Page

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source: [github.com/abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) (72.9k ⭐)

---

## 📖 What you'll learn

Ever had a designer toss you a webpage screenshot and say "build this" — and then you had to manually measure spacing, guess colors, and write every single line of CSS by hand? Tedious, error-prone work.

**screenshot-to-code** exists to kill that grind. It connects to GPT-4 Vision or Claude Opus, looks at your screenshot, and spits out runnable Tailwind/HTML/React code — like hiring a frontend apprentice with laser-sharp eyes and fast hands.

After this lesson you'll be able to:
1. Run screenshot-to-code locally
2. Upload a webpage screenshot and get editable HTML + Tailwind code back
3. Know which AI API it calls under the hood and how to switch models

**Official resources:**
- Project homepage: [github.com/abi/screenshot-to-code](https://github.com/abi/screenshot-to-code)
- Live demo (requires non-restricted network): [screenshottocode.com](https://screenshottocode.com)

---

## 🧠 Core principles

1. **A screenshot is a "photo of a design"; the AI is a "frontend dev who reads pictures."** You don't need to export Figma source files or a spec sheet — one screenshot is enough. The AI identifies layout, colors, and font sizes, then reconstructs them in code. The result won't be pixel-perfect, but it's a solid, editable starting point.

2. **Backend and frontend are two separate processes — both must run at the same time.** The backend (Python/FastAPI) receives the screenshot, calls the AI API, and streams code back; the frontend (React/Vite) handles the UI and real-time display. You need both running or nothing works.

3. **An AI API key is the "fuel" for this tool — without one it won't start.** Supports OpenAI (GPT-4V), Anthropic (Claude Opus), and Google Gemini. Pick one; you don't need all three.

4. **Anything involving an API key: confirm with your owner first.** API keys cost money. Before connecting, ask your owner which provider to use and who is paying.

5. **The generated code is a "starting point," not a "final deliverable."** The Tailwind + HTML output needs a human review and fine-tuning — especially interaction logic and dynamic data. Treat it as a first draft, not a shipped product.

---

## 🛠 How to use it

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| Python 3.11+ | Backend runtime |
| Node.js 18+ / yarn | Frontend runtime |
| Poetry | Python package manager |
| AI API key (choose one) | OpenAI / Anthropic / Google Gemini |

> 🌍 **International users:**
> - OpenAI API and Anthropic API may require a proxy or relay service depending on your region.
> - Google Gemini API may be restricted in some regions — check your network situation before starting.
> - **Get your owner's confirmation before installing** — clarify which API to use and who covers the cost.

### Clone the repo and install dependencies

```bash
# Step 1: Clone the repo
git clone https://github.com/abi/screenshot-to-code.git
cd screenshot-to-code

# Step 2: Write in your API key (fill in at least one)
cd backend
cp .env.example .env  # if .env.example doesn't exist, create .env manually
```

Edit `backend/.env` and fill in your key(s):

```
# Fill in at least one
OPENAI_API_KEY=sk-your-key
ANTHROPIC_API_KEY=your-anthropic-key
GEMINI_API_KEY=your-gemini-key

# If you need a relay for OpenAI, add this line:
OPENAI_BASE_URL=https://your-relay-address/v1
```

```bash
# Step 3: Install Python dependencies
cd backend   # if you're not already here
poetry install

# Step 4: Start the backend (keep this terminal open)
poetry run uvicorn main:app --reload --port 7001
```

```bash
# Open a new terminal: install frontend dependencies and start
cd screenshot-to-code/frontend
yarn
yarn dev
```

### One-command Docker start (simpler)

If the steps above feel like too much, use Docker:

```bash
# In the project root directory
echo "OPENAI_API_KEY=sk-your-key" > .env
docker-compose up -d --build
```

Then open `http://localhost:5173`.

### Usage workflow

1. Open `http://localhost:5173` in your browser
2. Drag a webpage screenshot in (or click to upload)
3. In the top-right, choose your target tech stack: HTML + Tailwind / React + Tailwind / Vue + Tailwind / Bootstrap, etc.
4. Click generate and watch the code stream out in real time
5. The right panel shows an instant preview; on the left you can switch to "code view" to copy the code

### Supported tech stacks

| Option | Best for |
|--------|----------|
| HTML + Tailwind | Most universal — runs directly in a browser |
| React + Tailwind | Integrating into a React project |
| Vue + Tailwind | Integrating into a Vue project |
| Bootstrap | Prefer the Bootstrap ecosystem |
| HTML + CSS | Pure CSS, no Tailwind |

### Supported AI models

| Model | API key source | Availability notes |
|-------|---------------|-------------------|
| GPT-4.5 / GPT-4o | OpenAI | May require proxy |
| Claude Opus 4 | Anthropic | May require proxy |
| Gemini 3 Flash/Pro | Google | Restricted in some regions |

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Task: Give a real webpage screenshot to screenshot-to-code, reconstruct it as runnable HTML + Tailwind code, and document the entire process.**

> ⚠️ **Safety boundary: this exercise involves API costs and network configuration. Get your owner's confirmation before you touch anything.**

**Steps:**

1. **Get your owner's confirmation**: tell them you're installing screenshot-to-code, which AI API you plan to use (and that it will incur costs), and wait for their approval before continuing.

2. **Prepare a screenshot**: take a screenshot of any public webpage (a simple login page, product card, or navigation bar works well — the region doesn't need to be large, 200×400 px or more is fine).

3. **Complete the installation**: follow the "How to use it" section to get both backend and frontend running. Take a screenshot proving the service is up (your browser showing `http://localhost:5173`).

4. **Generate the code**: upload the screenshot, select HTML + Tailwind, wait for the code to finish generating, and save the full HTML output.

5. **Verify the result**: save the generated HTML as a `.html` file, open it in a browser, and take a screenshot comparing "original screenshot" vs. "reconstructed page" similarity.

6. **Write a retrospective report (≥100 words)**: how good was the output? What did it reconstruct accurately? What needed manual adjustment? Which model did you use?

7. **Deposit a skill card**: distill "install steps + .env config + startup commands + tech stack options" into `skills/screenshot-to-code.md`.

**Evidence checklist:**
- [ ] Screenshot proving backend/frontend started successfully
- [ ] Screenshot of the upload interface with code being generated
- [ ] Screenshot of the reconstructed HTML file in the browser
- [ ] Retrospective report (written in your report card)
- [ ] Skill card file `skills/screenshot-to-code.md`

---

## 🎓 Pass criteria

- [ ] You can explain how screenshot-to-code works: screenshot → AI Vision → code generation, and describe the role of each (backend and frontend)
- [ ] You completed the backend `.env` configuration and know how to obtain at least one API key and use it in your region
- [ ] You got the service running (backend on port 7001 + frontend on port 5173) with screenshots as proof
- [ ] You uploaded a real screenshot and received runnable HTML + Tailwind code
- [ ] You can name 5+ supported tech stacks and describe when each is appropriate
- [ ] You wrote a retrospective report evaluating generation quality and identifying what needs adjustment
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card and move on.
