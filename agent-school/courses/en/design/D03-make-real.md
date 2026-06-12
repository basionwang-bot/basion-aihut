> 🌐 English ｜ [中文](../../design/D03-make-real.md)

# Lesson D03 · make-real-starter: Whiteboard Sketch → Real Web Page

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source: [github.com/tldraw/make-real-starter](https://github.com/tldraw/make-real-starter) (1.5k ⭐)

---

## 📖 What you'll learn

Imagine you sketch a few boxes on a piece of paper — a big rectangle on the left for navigation, a content area on the right, a button at the bottom. That rough sketch is called a "wireframe," the most primal language of product design. Traditionally, turning that paper sketch into a web page meant: designer makes a mockup, frontend slices it up, back-and-forth sign-offs — days at minimum, often a week.

**make-real-starter** does something wild: you draw wireframes on a digital whiteboard, select them, click "Make Real" — and within seconds the sketch becomes a real, running HTML page. Like magic, the sketch comes alive in an instant.

This is the official starter template from **tldraw** (an open-source whiteboard SDK), powered by GPT-4 Vision to translate your wireframe screenshot into code.

After this lesson you'll be able to:
1. Run make-real-starter locally
2. Draw a wireframe on the whiteboard and generate an HTML page with one click
3. Understand the full "sketch → code" workflow and know how to iterate

> ⚠️ **Note: this project uses the OpenAI GPT-4 Vision API by default, which requires an unrestricted network or a relay service in some regions.**

**Official resources:**
- Project homepage: [github.com/tldraw/make-real-starter](https://github.com/tldraw/make-real-starter)
- tldraw official site: [tldraw.com](https://tldraw.com)
- Live demo: [makereal.tldraw.com](https://makereal.tldraw.com) (requires unrestricted network)

---

## 🧠 Core principles

1. **A wireframe is a "draft of intent," not a polished spec.** You don't need to draw neatly or annotate colors — just communicate structure: "there's a nav here," "there's a button here," "there's a form here." The AI reads structure and intent, not aesthetics.

2. **The entire magic chain is just four steps: draw → select → send → see.**
   - Draw wireframes on the tldraw whiteboard
   - Select everything you want converted
   - Click "Make Real" (it takes a screenshot and sends it to GPT-4 Vision)
   - The generated HTML appears on the canvas as an iframe

3. **The generated page can be iterated.** Next to the generated iframe, draw a new annotation (e.g., draw an arrow with the note "make this red"), select both together, and click Make Real again — it reads your annotation and applies the change.

4. **API key is required and costs money.** GPT-4 Vision needs an OpenAI key. Some regions need a proxy or relay service. **Always confirm with your owner before using.**

5. **Security reminder: never hardcode an API key into source code.** The project stores the key in `.env.local` — never commit that file to a Git repository.

---

## 🛠 How to do it

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| Node.js 18+ | Frontend runtime |
| npm | Package manager |
| OpenAI API key | Required — needs access to GPT-4 Vision |

> 🌍 **Users in restricted regions:** OpenAI API requires a proxy or relay service. You can modify the `openai` initialization in the project's `makeReal.ts` file to add `baseURL: 'your-relay-address'`. **Confirm with your owner before touching API keys and network config.**

### Clone and install

```bash
# Clone the repo
git clone https://github.com/tldraw/make-real-starter.git
cd make-real-starter

# Install dependencies
npm install

# Create the env file (don't wrap the key in quotes)
echo "NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key" > .env.local
```

> ⚠️ **`.env.local` contains an API key — never `git commit` this file.** The project's `.gitignore` already excludes it by default, but double-check anyway.

### Start the project

```bash
npm run dev
```

Then visit `http://localhost:3000`.

### Draw a sketch and generate a page

1. Open `http://localhost:3000` in your browser — you'll see the tldraw whiteboard
2. Use the rectangle tool to draw boxes; use the text tool to label them: "Nav Bar," "Login Button," "User Avatar," etc.
3. Use the selection tool to select all your drawings
4. Click the **"Make Real"** button in the toolbar or panel on the right
5. Wait a few seconds (the AI is screenshotting and generating code) — an iframe preview will appear on the canvas

### Iterate and refine

- Draw a new shape or text next to the generated iframe as revision notes (e.g., draw an arrow pointing to the button and write "round corners")
- Select everything together (old iframe + new annotation)
- Click "Make Real" again — the AI will incorporate your annotations into a new generation

### Customize the prompt

To control the style of generated code, edit `prompt.ts` in the project root. You can specify:
- Tailwind vs. native CSS
- Whether to include interaction logic
- Code style preferences

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Task: Draw an "App Homepage Wireframe" on the whiteboard, generate an HTML page with one click, complete one iteration, and save evidence.**

> ⚠️ **Safety boundary: using an OpenAI API key and installing Node dependencies both require your owner's confirmation first.**

**Steps:**

1. **Get your owner's confirmation**: tell them you need an OpenAI API key (which costs money) and need to install Node.js dependencies. Wait for confirmation before proceeding.

2. **Complete installation**: follow the "How to do it" section to get the project running. Take a screenshot proving `http://localhost:3000` is accessible and the whiteboard UI looks normal.

3. **Draw a wireframe**: draw the following structure on the whiteboard (rough is fine — the goal is to convey intent):
   - Top: a horizontal bar (nav bar) labeled "Logo" and "Navigation Menu"
   - Middle: a large rectangle (Hero area) with "Main Headline" and "CTA Button" inside
   - Bottom: three small side-by-side rectangles (feature cards), each labeled "Feature 1/2/3"
   Save a screenshot of the sketch.

4. **Generate the page**: select all content, click "Make Real," wait for generation, and screenshot the iframe preview result.

5. **Iterate**: draw an arrow next to the iframe pointing at the CTA button, write "change to blue, add rounded corners," select everything together and click Make Real again. Screenshot the updated result.

6. **Write a retrospective (≥80 words)**: how good was the output? How well did it match the original sketch? Did the iterative change take effect? Did the AI misunderstand anything?

7. **Deposit a skill card**: distill "install steps + env config + sketch tips + Make Real workflow + iteration method" into `skills/make-real.md`.

**Evidence checklist:**
- [ ] Screenshot of the service running successfully
- [ ] Screenshot of the wireframe on the whiteboard
- [ ] Screenshot of the first generated HTML page (iframe preview)
- [ ] Screenshot of the page after iterative modification
- [ ] Retrospective report
- [ ] Skill card file `skills/make-real.md`

---

## 🎓 Pass criteria

- [ ] You can describe the four-step chain "draw → select → send → see," and explain what the AI receives (screenshot) and what it returns (HTML)
- [ ] You got the project running with the whiteboard UI working normally — screenshots as proof
- [ ] You drew a wireframe with at least 3 regions and successfully generated an HTML page
- [ ] You completed one iteration (added annotations on the whiteboard to regenerate)
- [ ] You can explain the network requirements for using this project and how to configure a relay API for restricted regions
- [ ] Your skill card explains `.env.local` usage conventions and security notes
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card and move on.
