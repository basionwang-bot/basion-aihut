> 🌐 English ｜ [中文](../../build/B01-bolt-diy.md)

# Lesson B01 · bolt.diy: Build a Full-Stack App in One Sentence

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: stackblitz-labs/bolt.diy · [github.com/stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy)

---

## 📖 What you'll learn

Picture this — your owner says "build me a little bookkeeping tool, nice-looking frontend, with add/edit/delete," and you watch the code materialise from nothing, the page springs to life, and there's a live preview right in the browser.

That's exactly what **bolt.diy** can do.

bolt.diy is the fully open-source version of bolt.new (GitHub ~19.5k ★). The key difference: **you choose which AI model to use**. The closed-source bolt.new manages everything for you in the cloud, while bolt.diy hands you the entire engine — swap in your own API key, run it locally, no monthly fee.

After this lesson you'll be able to:
1. Get bolt.diy running on your local machine
2. Hook it up to internationally accessible models (OpenAI, Anthropic, etc.) or any OpenAI-compatible endpoint
3. Have your owner describe an idea in one sentence, generate a working mini-app, and preview it locally

> 🌍 **International user note:** bolt.diy is fully open-source and runs locally. The main consideration is the **AI model API** — the default configuration supports many providers (OpenAI, Anthropic, DeepSeek, etc.). bolt.diy supports **any OpenAI-compatible custom endpoint**, so you can plug in whichever provider works best for your region.

**Official resources:**
- bolt.diy repository: [github.com/stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy)
- stable branch (recommended for beginners): `git clone -b stable https://github.com/stackblitz-labs/bolt.diy.git`

---

## 🧠 Core principles

1. **bolt.diy = a full-stack IDE in the browser + an AI coding chat panel.** Think of it as a "computer factory" running in your browser — chat window on the left, live preview on the right, and in the middle an AI writing code, running commands, and fixing bugs. Your owner never touches a code editor; they describe what they need, and the AI builds it right there in the factory.

2. **The model is a swappable plug.** bolt.diy ships with 19+ model integrations (OpenAI, DeepSeek, Moonshot/Kimi, Qwen, Anthropic, and more). It's like a lamp with a universal adapter — whatever socket your wall has, swap in the right plug and it works. Changing the model leaves all other functionality untouched.

3. **"OpenAI-compatible API" is the universal passport.** Many popular models provide OpenAI-format APIs. bolt.diy's custom provider feature accepts any such endpoint. As long as the API format is correct, it works.

4. **Local preview ≠ going live.** The app bolt.diy generates can run in your local browser, but "runs fine locally" and "deployed publicly on the internet" are two completely different things. **Do not deploy to any public server without your owner explicitly saying so.** See the safety boundaries section.

5. **The generated code is real code, not a toy.** The output is exportable, production-ready React/Vue/HTML/Node.js code — you can download it and keep developing it anywhere you like.

---

## 🛠 How to use it

### Step 1: Clone and install

```bash
# Clone the stable branch (more stable than main, recommended for beginners)
git clone -b stable https://github.com/stackblitz-labs/bolt.diy.git
cd bolt.diy

# bolt.diy uses pnpm — install it globally first
npm install -g pnpm

# Install project dependencies
pnpm install
```

> ⚠️ **Get your owner's confirmation before installing.** `npm install -g pnpm` is a global install; `pnpm install` pulls a large number of packages and requires network access — let your owner know it may take a while.

### Step 2: Configure your model API key

```bash
# Copy the environment variable template
cp .env.example .env.local
```

Open `.env.local` in a text editor and fill in the key for the model you want to use.

**Example providers:**

```bash
# OpenAI
OPENAI_API_KEY=your_openai_key_here

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_key_here

# DeepSeek
DEEPSEEK_API_KEY=your_deepseek_key_here
```

**Using any OpenAI-compatible endpoint:**

In the app, go to ⚙️ **Settings → Providers**, find the "OpenAI Like" or custom Provider option, and enter:
- **Base URL**: the provider's API base URL
- **API Key**: the key from that provider
- **Model Name**: e.g. `qwen-plus`, `glm-4-flash`, or any supported model name

### Step 3: Start the app

```bash
pnpm run dev
```

Open `http://localhost:5173` in your browser. If you see the chat interface, you're good to go.

### Step 4: Describe an idea, generate an app

Type your requirements in the chat box, for example:

```
Build me a daily task list app: I can add tasks, check them off, and delete them.
Clean and minimal UI, blue-and-white color scheme, no backend needed,
store data in the browser.
```

The AI will start writing code, and the right-side preview window updates in real time — within seconds you'll have a real, interactive webpage you can click around in.

### Docker option (optional — for owners who don't want to install Node)

```bash
cp .env.example .env
cp .env.example .env.local
# Fill in API keys in .env.local first
pnpm run dockerbuild
docker compose --profile development up
```

> ⚠️ **The Docker option requires Docker Desktop to be installed. Confirm with your owner first.**

### ⚠️ Safety boundaries

**A no-code/AI tool the moment it "connects to a real database, uses a production key, or goes public" stops being a toy and becomes a real system. Three things — connecting real data, going public, and incurring costs — all require an explicit "ask the owner first":**

```
□ Installing dependencies (pnpm install) — get your owner's confirmation first
□ Filling in an API key in .env.local — tell your owner this is their key and every call incurs charges on their account
□ The generated app is fine to "preview locally," but to "deploy it publicly" — you must ask your owner first
□ If the app involves user data, payments, or login — ask your owner before connecting a real database or going live
□ When the free API quota runs out, charges will begin — remind your owner to watch their usage alerts
```

---

## 📝 Graduation test (must be done for real — submit evidence)

**Task: use bolt.diy with an AI model of your choice to generate a working mini-tool, and provide a local-preview screenshot as evidence.**

**Phase 1: Environment setup (do this first)**

1. Clone and start bolt.diy, take a screenshot showing the chat interface in the browser (`http://localhost:5173`).
2. In ⚙️ Settings configure an AI model API, take a screenshot showing the model is selected.
3. In one sentence, describe which model you chose and why (availability, free tier, speed, etc.).

**Phase 2: Generate an app (after your owner confirms the API key is set)**

> ⚠️ **This phase will consume API quota — inform your owner before proceeding.**

4. Describe a small tool in natural language and send it to the AI. Example ideas (or pick your own):
   - Daily habit tracker
   - Simple BMI calculator
   - Random English vocabulary flashcard tool

5. Screenshot the right-side preview window after generation is complete, proving the app is interactive in the browser.

6. In your own words, describe: what files did the tool generate? What is its tech stack?

**Phase 3: Consolidate**

7. **Write a skill card**: distill "bolt.diy startup steps + model API configuration + safety boundaries" into `skills/bolt-diy.md`.

---

## 🎓 Graduation criteria

- [ ] You can explain the core difference between bolt.diy and bolt.new (open-source self-hosted vs. closed-source hosted)
- [ ] You successfully configured at least one AI model API and can explain how to obtain it
- [ ] You generated an interactive mini-app in the browser using natural language, with screenshot evidence
- [ ] You can explain the difference between "local preview" and "deploying publicly," and know the latter requires asking your owner first
- [ ] You completed all 5 items on the safety boundaries checklist
- [ ] You have added 1 skill card to your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-fi fallback per [School Rules §4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it on your report card and move on.
