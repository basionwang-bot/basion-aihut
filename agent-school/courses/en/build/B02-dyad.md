> 🌐 English ｜ [中文](../../build/B02-dyad.md)

# Lesson B02 · Dyad: Local-First, Privacy-First AI Website Builder — Code Is 100% Yours

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source: dyad-sh/dyad · [github.com/dyad-sh/dyad](https://github.com/dyad-sh/dyad)

---

## 📖 What you'll learn

Have you ever asked an AI to build you a website, only to find the code locked on someone else's server — and you have to pay a monthly fee just to change a color?

Dyad does the opposite. It is an **AI website builder that runs entirely on your own computer** — similar to Lovable, v0, or Bolt, but **no account required, no monthly fee, code stays on your local machine**. Bring your own AI API key, click a few times, generate a website, tweak it however you like — the code is 100% yours.

GitHub ~20.6k ★, Apache 2.0 open-source license (pro features use FSL 1.1).

After this lesson you'll be able to:
1. Install and run Dyad on your own computer
2. Configure an API key (supports OpenAI, Anthropic, Google Gemini, DeepSeek, Qwen, and more)
3. Use AI to generate a website, export the code, and preview it locally

> 🌍 **International note:** Dyad downloads and runs without any extra setup. Its supported AI providers include many international options (OpenAI, Anthropic, Google Gemini) as well as DeepSeek and Qwen. Choose whichever provider works best in your region.

**Official resources:**
- Dyad repository: [github.com/dyad-sh/dyad](https://github.com/dyad-sh/dyad)
- Download page: [dyad.sh](https://www.dyad.sh/#download)

---

## 🧠 Core principles

1. **Local = privacy + speed + no lock-in.** Think of Dyad as a "personal website assistant installed on your computer." All the code lives on your hard drive. No server knows what you're building. Even if the network goes down, as long as it's running locally you're fine. Stop using the service and you lose nothing.

2. **"Bring your own key" is the core design.** Dyad doesn't provide AI capability itself — it's a framework that needs your AI API key to function. The upside: the cost is yours, the usage is yours, the model choice is yours, no middleman taking a cut.

3. **The generated code is real, usable code.** Dyad produces real React / Next.js / HTML projects stored on your computer. You can open them in VS Code, keep developing, and deploy them anywhere you want. It's not "code you can only see inside the platform."

4. **Running locally ≠ ready to go live.** Previewing a website on your own machine and "publishing it to the internet for everyone to access" are completely different things. **You must ask your owner before deploying.** See the safety boundaries section.

5. **Bring Your Own Key — billing responsibility.** The API key you fill in is your owner's key. Every AI code generation consumes tokens and incurs a charge. **Always inform your owner before consuming API quota.**

---

## 🛠 How to use it

### Step 1: Download and install Dyad

**Option A: Download the installer (recommended — fastest for beginners)**

Visit [dyad.sh/#download](https://www.dyad.sh/#download) and pick your OS:
- Mac: download the `.dmg` file, double-click to install
- Windows: download the `.exe` installer, double-click to install

No registration needed — download, open, and start.

**Option B: Run from source (for developers)**

```bash
# Clone the repository
git clone https://github.com/dyad-sh/dyad.git
cd dyad

# Install dependencies
npm install

# Create the required directory
mkdir -p userData

# Start
npm start
```

> ⚠️ **Get your owner's confirmation before installing.** Tell your owner what this software is and where it will be installed before downloading the installer or running `npm install`.

### Step 2: Configure your AI API key

Open Dyad and click **Settings** or the API Key configuration entry. Fill in the key for your chosen AI provider.

**Internationally accessible providers:**

| Provider | Sign-up | Free tier |
|----------|---------|-----------|
| OpenAI | [platform.openai.com](https://platform.openai.com) | Limited |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) | Limited |
| DeepSeek | [platform.deepseek.com](https://platform.deepseek.com) | Yes |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com) | Yes |
| Qwen | [dashscope.aliyuncs.com](https://dashscope.aliyuncs.com) | Trial available |

> 💡 **Tip:** For users who want strong coding performance with a generous free tier, **DeepSeek** is a popular choice — widely supported and works well with Dyad.

### Step 3: Generate a website with AI

1. Describe the website you want in Dyad's chat box, for example:

```
Build me a personal profile page with: a photo placeholder, a one-line bio,
a skills list, and a contact section.
Modern, clean style with a light theme.
```

2. The AI automatically generates the code; Dyad's interface shows live progress.
3. Once finished, click the **Preview** button to view it in your browser.
4. Not satisfied? Keep chatting — "change the color to blue" or "add a portfolio section" — and iterate.

### Step 4: View and export the code

The code Dyad generates is stored in a local project folder on your computer. Open it directly in VS Code or any editor to keep developing.

### ⚠️ Safety boundaries

**A no-code/AI tool the moment it "connects to a real database, uses a production key, or goes public" stops being a toy and becomes a real system. Three things — connecting real data, going public, and incurring costs — all require an explicit "ask the owner first":**

```
□ Installing Dyad — get your owner's confirmation first (explain what the software is)
□ Filling in an API key — tell your owner this is their key and every generation consumes quota
□ If the API free quota runs out — inform your owner; do not silently incur charges
□ The generated website is fine to "preview locally," but to "deploy to the public internet" — must ask your owner first
□ If the website will collect user information or integrate payments — involves real data, ask your owner first
```

---

## 📝 Graduation test (must be done for real — submit evidence)

**Task: on your own computer, use Dyad + an AI provider API to generate a website you can preview locally.**

**Phase 1: Install and configure**

1. Install Dyad and open it. Take a screenshot showing the app is running.
2. Configure an AI provider API key. Take a screenshot of the configuration screen (**mask the actual key value** — only show "configured successfully" or the model dropdown).
3. In one sentence: which provider did you choose, and why?

**Phase 2: Generate a website (after informing your owner that API quota will be consumed)**

> ⚠️ **Tell your owner that API quota will be consumed. Proceed only after confirmation.**

4. Describe a small website in natural language and have Dyad generate it. Options include:
   - Personal homepage
   - Small team product landing page
   - Event sign-up page

5. Screenshot showing the preview (the website open in a browser).
6. In your own words: what files did the website generate? Which local directory is the code stored in?

**Phase 3: Consolidate**

7. **Write a skill card**: distill "Dyad installation steps + API configuration + usage workflow + safety boundaries" into `skills/dyad.md`.

---

## 🎓 Graduation criteria

- [ ] You can explain the core difference between Dyad and hosted platforms like bolt.new/Lovable (local vs. cloud-hosted)
- [ ] You successfully installed and launched Dyad, with screenshot evidence
- [ ] You configured at least one AI provider API and can explain how to obtain it
- [ ] You used AI to generate a website you can preview in a browser, with screenshot evidence
- [ ] You can explain where the generated code lives and know you can keep developing it in VS Code
- [ ] You completed all 5 items on the safety boundaries checklist
- [ ] You have added 1 skill card to your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-fi fallback per [School Rules §4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it on your report card and move on.
