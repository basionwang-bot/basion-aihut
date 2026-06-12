> 🌐 English ｜ [中文](../../design/D09-social-card.md)

# Lesson D09 · One Sentence → Social Media Graphics + Cover Images

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source: [op7418/guizang-social-card-skill](https://github.com/op7418/guizang-social-card-skill) (3.36k ⭐)

---

## 📖 What you'll learn

Picture this: your owner writes a great article and wants to post it on Instagram — but Instagram doesn't allow links, so it has to become a visual post. Your owner opens Canva, lays out page after page, hunts for images, tweaks font sizes, two hours go by… and it still might not look great.

**This lesson tackles that efficiency trap.**

The star is **guizang-social-card-skill**, an open-source Claude Code skill by content creator "guizang." The idea: hand your article to Claude, and Claude uses pre-designed layouts to generate a single-file HTML page, then uses Node.js + Playwright to render that HTML into PNG images — no design software needed, Claude handles everything.

This toolkit has two built-in visual systems:
- **Editorial (digital magazine style)**: narrative, expressive — good for opinions, personal style, emotional content
- **Swiss (Swiss International Style)**: strict grid, high-saturation accent colors — good for data, products, methodologies

Supported output formats:
- Instagram/Pinterest 3:4 portrait (1080×1440)
- Newsletter/blog hero banner 21:9 (2100×900)
- Newsletter/blog share card 1:1 (1080×1080)

Runs entirely locally, no API key required, no VPN needed.

**Official resources:**
- Repo: [github.com/op7418/guizang-social-card-skill](https://github.com/op7418/guizang-social-card-skill)
- Author's X (formerly Twitter): [x.com/op7418](https://x.com/op7418)

---

## 🧠 Core principles

1. **A skill is Claude's "specialized expertise pack."** Think of it as an instruction manual installed inside Claude Code: once installed, Claude reads the rules and layout guidelines in `SKILL.md` and follows them precisely. You don't need to tell Claude how to lay things out — it's all in that manual.

2. **HTML → PNG is the key step in this pipeline.** First generate a single-file HTML (all styles inlined), then run `node render.mjs` to launch Playwright's headless browser and render the HTML to PNG. So you need Node.js and Playwright locally — remember to confirm with your owner before installing.

3. **Theme colors are preset — you can't just type in any hex.** Editorial has 6 themes (Ink Classic, Indigo Porcelain, Forest Ink, Kraft Paper, Dune, Midnight Ink dark mode); Swiss has 4 accent colors (IKB Klein Blue, Lemon Yellow, Lime Green, Safety Orange). Ask your owner which style they want before starting.

4. **Images have a priority order — don't use random images.** The tool pulls images in this order: user-provided → Unsplash → Pexels → Wallhaven, and logs sources to `SOURCES.md`. Make sure your owner knows where images come from — copyright awareness matters.

5. **Confirm with your owner before installing and generating.** Installation requires `git clone` into `~/.claude/skills/`; rendering requires Node.js execution permissions; fetching images requires outbound network access — tell your owner about all three.

---

## 🛠 How to do it

### Install guizang-social-card-skill

**Option 1: One-liner (recommended)**

```bash
npx skills add https://github.com/op7418/guizang-social-card-skill --skill guizang-social-card-skill
```

**Option 2: Manual git clone**

```bash
git clone https://github.com/op7418/guizang-social-card-skill.git ~/.claude/skills/guizang-social-card-skill
```

After installing, verify the following files exist:

```bash
ls ~/.claude/skills/guizang-social-card-skill/
# Should see: SKILL.md  assets/  references/  render.mjs  validate-social-deck.mjs
```

> ⚠️ **Get your owner's confirmation before installing.** `~/.claude/skills/` is the Claude Code skills directory — installing clones a repo onto your owner's machine.

### Runtime requirements

Rendering to PNG requires Node.js + Playwright:

```bash
# Verify Node.js is installed (needs >= 18)
node --version

# Install dependencies in the skill directory (confirm with owner first)
cd ~/.claude/skills/guizang-social-card-skill
npm install
```

> ⚠️ **`npm install` downloads Playwright dependencies (including browser binaries) — sizable download; confirm with your owner first.**

### Trigger skill to generate graphics

Once installed, chat with Claude Code to trigger:

```text
Make me a set of Instagram/social media graphics
```

```text
Based on this article, make me a set of Swiss-style Instagram graphics, 5 cards, IKB blue
```

```text
Turn this post into a newsletter cover pair: 21:9 hero + 1:1 share card, visually consistent
```

```text
Based on this article, make a set of 3:4 portrait cards, magazine style, Midnight Ink dark theme
```

### Render to PNG

After Claude generates the HTML, run:

```bash
node render.mjs
```

Output files appear in the `output/` directory — ready-to-publish PNG files.

### Validate graphics quality

```bash
node validate-social-deck.mjs path/to/task-dir
```

This script checks: text overflow, font size compliance, and whether image slots are filled correctly.

### Quick reference: 28 layout skeletons

**Editorial system (narrative):**

| ID | Layout name | Best for |
|----|-------------|---------|
| M01 | Image-Led Cover | Full-bleed cover, atmospheric photo |
| M02 | Title + Subtitle | Title card, clear theme |
| M06 | Pipeline | Step-by-step process explanation |
| M08 | Before/After | Comparison, contrast |
| M16 | Image Grid | Multi-image collection |

**Swiss system (fact-driven):**

| ID | Layout name | Best for |
|----|-------------|---------|
| S01 | Cover | Clean cover |
| S09 | KPI Tower | Large-number data callout |
| S10 | H-Bar Chart | Horizontal comparison |
| S12 | Matrix + Hero | Matrix + hero image |

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Task: Auto-layout a course note into publishable Instagram-style graphics and a set of newsletter cover images.**

**Phase 1: Install and prepare (confirm with owner first)**

1. With your owner's confirmation, install the skill:
   ```bash
   npx skills add https://github.com/op7418/guizang-social-card-skill --skill guizang-social-card-skill
   ```
   Screenshot proving `~/.claude/skills/guizang-social-card-skill/SKILL.md` exists.

2. Confirm Node.js version >= 18 — screenshot `node --version` output.

3. Run `npm install` inside the skill directory (**confirm with owner first**) — screenshot the completion output.

**Phase 2: Generate Instagram graphics**

4. Pick a course note (you can use notes from this lesson) and send it to Claude Code:
   ```text
   Turn this note into 5 Instagram-style graphics, Swiss style, IKB blue
   ```
   Screenshot the list of HTML files Claude generated.

5. Run `node render.mjs` to render. Screenshot the `output/` directory showing the generated PNG files (at least 5).

6. Open one of the PNGs and screenshot the actual graphic result.

**Phase 3: Generate newsletter cover pair**

7. Use the same content, send to Claude Code:
   ```text
   Turn this note into a newsletter cover pair: 21:9 hero banner + 1:1 share card, magazine style, visually consistent
   ```
   Screenshot the two rendered cover PNGs.

**Phase 4: Explain the mechanism**

8. In your own words, explain:
   - What steps does the "HTML → PNG" pipeline go through?
   - What role does `render.mjs` play?
   - Why output HTML first instead of having Claude generate images directly?

**Phase 5: Deposit a skill card**

9. Distill "install steps + trigger commands + render command + theme/style quick reference table" into `skills/social-card.md`.

> ⚠️ **Safety boundary:**
> - Installing the skill (git clone) — **confirm with your owner first**
> - `npm install` downloads dependencies — **tell your owner, download is sizable**
> - Tool fetches network images (Unsplash/Pexels) — **confirm your owner knows the image sources**
> - Only generate draft graphics — **do not publish to any platform on your owner's behalf; publishing is always done by the owner**

---

## 🎓 Pass criteria

- [ ] You can explain what Editorial and Swiss visual systems are each best suited for
- [ ] You installed the skill successfully — screenshots proving the directory and files exist
- [ ] You triggered Claude to generate 5 Instagram-style graphic HTML files and rendered them to PNG (screenshot)
- [ ] You generated a newsletter cover pair (21:9 + 1:1)
- [ ] You explained the "HTML → PNG" pipeline in your own words
- [ ] You know the names of all 10 preset themes and can pick the right one for a given request
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card and move on.
