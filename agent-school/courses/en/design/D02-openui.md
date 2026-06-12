> 🌐 English ｜ [中文](../../design/D02-openui.md)

# Lesson D02 · OpenUI: Describe a Component, See It Instantly

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source: [github.com/wandb/openui](https://github.com/wandb/openui) (22.4k ⭐)

---

## 📖 What you'll learn

Picture this: you have a mental image of a login card — white rounded card, logo on the left, inputs on the right — but you can't write code and don't want to wait for a designer. Can you just describe it in plain language and see it appear immediately?

**OpenUI** does exactly that. It's an open-source UI component generator from Weights & Biases (W&B): describe the component you want in natural language, watch it render in real time, refine it until it's right, then export as React, Vue, or HTML code. It's like having a frontend developer living inside the browser — you say the word, they get to work.

**Biggest highlight: supports Ollama local models, completely offline, zero API cost.** A huge win if you can't or don't want to use cloud APIs.

After this lesson you'll be able to:
1. Run OpenUI with Docker or from source (including using an Ollama local model)
2. Describe a component in one sentence and generate a real rendered UI
3. Export the generated component as a usable code framework (React/Vue/HTML)

**Official resources:**
- Project homepage: [github.com/wandb/openui](https://github.com/wandb/openui)
- Live demo: [openui.fly.dev](https://openui.fly.dev) (requires unrestricted network)

---

## 🧠 Core principles

1. **OpenUI's core loop: describe → render → refine → render.** Unlike tools that "generate once and done," OpenUI supports continuous iteration — "change the button to blue," "add a forgot-password link" — each change reflects instantly in the preview. That's what "what you see is what you get" really means.

2. **Local model vs. cloud model: both work.** Have an API key (OpenAI/Anthropic)? Use the cloud for better quality. Don't have one or don't want the cost? Run an Ollama local model — fully offline, zero fees. Prefer local models if you want to avoid cloud costs.

3. **It generates component code, not a full application.** OpenUI focuses on individual UI components (a login card, a nav bar, a data table). The output is a component snippet you plug into your own project.

4. **API keys: ask your owner first.** Cloud models cost money; Ollama only needs local compute — no key needed.

---

## 🛠 How to use it

### Route 1: Ollama local model (recommended — no cloud cost)

**Step 1: Install Ollama and pull a model**

```bash
# Install Ollama (download from ollama.ai or use the command below)
# macOS/Linux:
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a vision/code-capable model (about 4–8 GB — confirm with your owner first)
ollama pull llava
# Or pull a code-focused model:
ollama pull qwen2.5-coder:7b
```

> ⚠️ **Get your owner's confirmation before installing**: Ollama downloads several GB of model files and needs disk space and download time.

**Step 2: Start OpenUI with Docker (connected to Ollama)**

```bash
docker run --rm --name openui -p 7878:7878 \
  -e OLLAMA_HOST=http://host.docker.internal:11434 \
  ghcr.io/wandb/openui
```

Open `http://localhost:7878` in your browser, then pick the Ollama model in Settings.

---

### Route 2: Docker + cloud API (better quality)

```bash
export OPENAI_API_KEY=sk-your-key
# or
export ANTHROPIC_API_KEY=your-key

docker run --rm --name openui -p 7878:7878 \
  -e OPENAI_API_KEY \
  -e ANTHROPIC_API_KEY \
  ghcr.io/wandb/openui
```

> 🌍 **International users:** OpenAI/Anthropic APIs may require a proxy or relay in some regions.

---

### Route 3: Run from source (for developers)

```bash
git clone https://github.com/wandb/openui
cd openui/backend
uv sync --frozen --extra litellm
source .venv/bin/activate
export OPENAI_API_KEY=xxx   # or set OLLAMA_HOST
python -m openui
```

---

### Docker Compose (easiest)

```bash
git clone https://github.com/wandb/openui
cd openui
docker-compose up -d
# If using Ollama, pull the model:
docker exec -it openui-ollama-1 ollama pull llava
```

Open `http://localhost:7878`.

---

### Usage workflow

1. Open `http://localhost:7878`
2. Click the gear icon (top-left) → Settings → select your model (Ollama models appear automatically)
3. Type a component description in the input box, for example:
   - `"A login card: white background, rounded corners, email and password inputs, blue login button, and a 'Don't have an account? Sign up' text link"`
   - `"A product card with image on top, title, price, and add to cart button"`
4. Click generate and watch the preview
5. Not happy? Just say: "change the button to red," "add a remember me checkbox"
6. When satisfied, click Export and choose React / Vue / HTML format

### Supported output formats

| Format | Use case |
|--------|----------|
| HTML | Runs directly in a browser |
| React | Plug into a React project |
| Vue | Plug into a Vue project |
| Web Components | Framework-agnostic, universal |
| Svelte | Plug into a Svelte project |

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Task: Use OpenUI to generate a "login card" component, iterate on it, export the code, and display it in a browser.**

> ⚠️ **Safety boundary: get your owner's confirmation before installing Ollama or Docker.**

**Steps:**

1. **Choose a route**: tell your owner whether you plan to use the Ollama local model or a cloud API (Ollama is recommended — no cost). Wait for confirmation before continuing.

2. **Start the service**: follow any route above to get OpenUI running. Take a screenshot proving `http://localhost:7878` is accessible.

3. **Generate the login card**: enter the following description (or rephrase it):
   > `"A clean login card: white background, rounded shadow, product logo placeholder at the top, email input, password input, a blue login button, and a 'No account? Sign up now' text link"`
   Take a screenshot of the generated result.

4. **Iterate**: on the existing output, say one sentence to modify it (e.g., "change the login button to green and add a remember me checkbox"). Screenshot the modified result.

5. **Export the code**: export as HTML, save the code as `login-card.html`, open it in a browser, and take a screenshot.

6. **Write a retrospective report (≥80 words)**: Ollama or cloud model? How was the generation quality? How did iteration feel?

7. **Deposit a skill card**: distill "startup commands + model selection + usage workflow + export methods" into `skills/openui.md`.

**Evidence checklist:**
- [ ] Screenshot of OpenUI started successfully (`http://localhost:7878`)
- [ ] Screenshot of the login card first generation
- [ ] Screenshot after iterative modification
- [ ] Screenshot of `login-card.html` in the browser
- [ ] Retrospective report (written in your report card)
- [ ] Skill card file `skills/openui.md`

---

## 🎓 Pass criteria

- [ ] You can explain the core difference between OpenUI and screenshot-to-code (D01): one restores from a screenshot, the other generates from a description
- [ ] You got OpenUI running — using either Ollama local model or cloud API — with screenshots as proof
- [ ] You used natural language to generate a real rendered UI component
- [ ] You completed at least one iteration (adding or changing an element on the existing component)
- [ ] You exported HTML code and verified it runs in a browser
- [ ] You can explain the advantages of the Ollama route (offline, no cost) and how to connect it when starting Docker
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card and move on.
