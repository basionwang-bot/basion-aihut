> 🌐 English ｜ [中文](../../design/D10-slides-as-code.md)

# Lesson D10 · Slides as Code

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source A: [op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) (16.7k ⭐) ｜ Source B: [slidevjs/slidev](https://github.com/slidevjs/slidev) (47.1k ⭐)

---

## 📖 What you'll learn

A slide deck is the speaker's visual backdrop — not a Word document. Its essence is **visual impact + rhythm**. But every time your owner needs a deck, they open PowerPoint or Keynote, drag boxes around, adjust font sizes, and three hours later they've finished four slides.

**This lesson tells you: decks can be made by writing code — drop in a Markdown outline, get beautifully formatted slides in seconds.**

This lesson covers two tools — pick the one that fits your owner's situation:

### Tool A: guizang-ppt-skill (recommended for Claude Code users)
An agent skill open-sourced by guizang. Exclusive to Claude Code — send your content to Claude, and Claude generates a single-file HTML slide deck using gorgeous preset layouts, ready to present in a browser with no build step and no server. **Works directly without any proxy needed, no extra API key.**

### Tool B: Slidev (recommended for developers to use themselves)
`slidevjs/slidev` is the most popular Markdown presentation tool in the developer community (47.1k stars). Write content in Markdown, Vite hot-reload drives it, export to PDF/PNG/PPTX, and you can embed Vue components. Great for developers writing their own talks and technical presentations. **Needs Node.js >= 20.12.0; npm is all you need.**

After this lesson you'll be able to:
- Use guizang-ppt-skill to turn a Markdown outline into a polished HTML deck
- Use Slidev to create a project, write Markdown slides, and export to PDF
- Decide which tool fits which situation

**Official resources:**
- guizang-ppt-skill: [github.com/op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)
- Slidev repo: [github.com/slidevjs/slidev](https://github.com/slidevjs/slidev)
- Slidev docs: [sli.dev](https://sli.dev)

---

## 🧠 Core principles

1. **Decks are text, and agents are best at handling text.** HTML/CSS is plain text; Markdown is plain text — agents can read, write, edit, and validate them directly. `.pptx` is a binary format; operating on it blindly is like defusing a bomb. Using text formats for slides is the natural choice in the agent era.

2. **guizang-ppt-skill's core is "layout skeletons + visual rules."** It ships with Style A (digital magazine, 10 layouts) and Style B (Swiss International Style, 22 locked layouts). Claude fills in content based on these rules — you don't need to know design; Claude does.

3. **Slidev's core is "Markdown + separators."** Each slide is separated by `---`, frontmatter in the header sets theme and transitions, body is Markdown — as simple as writing notes, with results that put PowerPoint to shame.

4. **The single-file HTML advantage is "grab and go."** guizang-ppt-skill outputs a single-file HTML — no server deployment, just open in a browser and present, navigate with ← → keys or scroll. Hand your owner one file and they're set.

5. **Confirm with your owner before installing anything.** Both tools involve npm/Node.js operations and modify your owner's file system — tell them first.

---

## 🛠 How to do it

---

### Tool A: guizang-ppt-skill

#### Installation

**Option 1: One-liner (recommended)**

```bash
npx skills add https://github.com/op7418/guizang-ppt-skill --skill guizang-ppt-skill
```

**Option 2: Manual install**

```bash
git clone https://github.com/op7418/guizang-ppt-skill.git ~/.claude/skills/guizang-ppt-skill
```

Verify installation:

```bash
ls ~/.claude/skills/guizang-ppt-skill/
# Should see: SKILL.md  assets/  references/  checklist.md
```

> ⚠️ **Confirm with your owner before installing.** Files will be written to `~/.claude/skills/`.

#### How to use

After installation, tell Claude Code directly:

```text
Based on this article, make me a Swiss-style deck, about 7 slides
```

```text
Turn this Markdown outline into a magazine-style presentation deck, 6–10 slides
```

```text
Based on this deck's key ideas, generate a 21:9 newsletter hero banner
```

#### Visual style comparison

| Style | Name | Layouts | Best for |
|-------|------|---------|---------|
| Style A | Digital magazine | 10 | Narrative, opinion-sharing, personal style, live presentations |
| Style B | Swiss International | 22 locked | Data, product analysis, methodology, factual content |

#### Style B quick reference

| Layout | Name | Use |
|--------|------|-----|
| Cover | Cover slide | Opening slide |
| Statement | Key claim | Core argument page |
| KPI Tower | Data tower | Large number emphasis |
| Duo Compare | Side-by-side | Two-option comparison |
| Image Hero | Hero image | Image-dominant slide |
| Closing Manifesto | Closing statement | Final slide |

---

### Tool B: Slidev

#### Install and create a project

```bash
# Requires Node.js >= 20.12.0
node --version  # check version first

# Create a new Slidev project (confirm with owner first)
npm init slidev
```

This command asks interactively about project name, theme, etc., then auto-installs dependencies and launches the dev server.

> ⚠️ **`npm init slidev` installs dependencies and uses disk space — tell your owner before running.**

#### Start the dev server

```bash
# In the project directory
npx slidev slides.md
```

Browser opens automatically with live preview — edit Markdown and changes refresh instantly.

#### Slidev Markdown basics

```markdown
---
theme: seriph
background: https://cover.sli.dev
class: text-center
---

# Presentation Title

Subtitle goes here

---
transition: slide-left
---

# Second Slide

- Point one
- Point two
- Point three

---

# Code slide (syntax highlighted automatically)

```python
def hello():
    print("Hello, Slidev!")
```

---
layout: two-cols
---

# Left Column Title

Left side content

::right::

# Right Column

Right side content
```

#### Common layouts

| layout value | Effect |
|-------------|--------|
| `default` | Normal slide |
| `cover` | Cover (large centered text) |
| `two-cols` | Left-right two columns |
| `center` | Centered content |
| `quote` | Pull quote |
| `image-right` | Image on the right |
| `fact` | Big-number data page |

#### Export

```bash
# Export to PDF (requires Playwright)
npx slidev export slides.md --format pdf

# Export to PNG (one image per slide)
npx slidev export slides.md --format png

# Export to PPTX
npx slidev export slides.md --format pptx
```

---

### Comparison: which tool to choose

| Scenario | Recommended | Why |
|----------|-------------|-----|
| Using Claude Code, want polished visuals | guizang-ppt-skill | No frontend knowledge needed — just chat to get a beautiful deck |
| Developer writing their own talk | Slidev | Native Markdown experience, great for technical presentations |
| Sharing a single file with your owner | guizang-ppt-skill | Single-file HTML, open and present immediately |
| Need PDF/PPTX export | Slidev | Official multi-format export support |
| No VPN, don't want friction | Either | Neither requires a proxy |

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Task: Turn a Markdown outline into a polished, presentable slide deck.**

Pick **Tool A or Tool B** — your choice — but explain why you chose it.

**Phase 1: Prepare an outline**

1. Prepare a Markdown outline (you can use notes from this lesson or owner-provided content) that includes at least: a theme, 4–6 key points, and at least one data point or comparison.

**Phase 2A (if you chose Tool A): guizang-ppt-skill**

2. With owner confirmation, install the skill. Screenshot proving `SKILL.md` exists.

3. Send the outline to Claude Code with this request:
   ```text
   Based on this outline, make me a Swiss-style deck, about 6 slides, IKB blue
   ```
   Screenshot the generated HTML file and its browser preview.

4. Explain: which layouts did Claude choose? Why are they appropriate for your content?

**Phase 2B (if you chose Tool B): Slidev**

2. With owner confirmation, run `npm init slidev`. Screenshot the successful project creation and dev server output.

3. Write at least 6 slides in Markdown:
   - Opening slide uses `layout: cover`
   - At least one use of `layout: two-cols` or `layout: fact`
   - At least one slide with a code block
   - A transition animation set with `transition:`
   
   Screenshot the live browser preview.

4. Run the export command to export the deck as PDF. Screenshot the successful export output and the PDF file.

**Phase 3: Reflection and comparison**

5. Write a reflection (under 200 words):
   - What's the fundamental difference between making a deck with code vs. PowerPoint?
   - Which types of owners/scenarios are ideal for this tool? Which aren't?

**Phase 4: Deposit a skill card**

6. Distill "install steps + trigger commands / Markdown syntax + export method + tool selection guide" into `skills/slides-as-code.md`.

> ⚠️ **Safety boundary:**
> - Installing skill / `npm init slidev` — **both require owner confirmation first**
> - Slidev PDF export needs Playwright (downloads browser binaries — tell your owner)
> - Generated decks are drafts only — **do not distribute to third parties on your owner's behalf**

---

## 🎓 Pass criteria

- [ ] You can name the best use case for guizang-ppt-skill vs. Slidev
- [ ] You completed the full flow for Tool A or Tool B — screenshots proving the deck was generated
- [ ] Your deck has at least 5 slides using different layouts
- [ ] (If Slidev) You exported to PDF successfully
- [ ] (If guizang-ppt-skill) You explained the reasoning behind the layouts Claude chose
- [ ] You wrote your "why I chose this tool" analysis
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card and move on.
