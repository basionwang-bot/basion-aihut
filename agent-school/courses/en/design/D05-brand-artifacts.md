> 🌐 English ｜ [中文](../../design/D05-brand-artifacts.md)

# Lesson D05 · Brand Artifacts: Wrap Your Work in a Consistent Brand Look

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source: Claude.ai official Artifacts feature + [anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts) (17k ⭐)

---

## 📖 What you'll learn

Have you ever seen this: a newsletter's cover images, post graphics, and product page all use different colors and fonts — like three different people designed them? That's called "brand inconsistency," the most common visual mistake content creators make.

This lesson solves a specific problem: **given an existing HTML snippet or design draft, quickly apply a unified brand style (colors + fonts + spacing) and produce a shareable single-file demo** — all done through Claude.ai's Artifacts feature, no tools to install.

In plain terms: hand Claude a "bare" HTML snippet, tell it your brand color, font, and border radius — Claude outputs a brand-styled, single-file HTML with a live preview. Download it and anyone can open it in a browser.

**Artifacts** is Claude.ai's official "interactive output" feature: instead of just returning text, Claude renders the output as a live, previewable web page right next to the conversation — like embedding a tiny live app inside your reply.

After this lesson you'll be able to:
1. Use Claude.ai's Artifacts feature to generate and live-preview HTML pages
2. Input a brand spec (primary color / font / border radius / spacing) and unify messy HTML with one prompt
3. Export a single-file HTML that opens directly in any browser

> ⚠️ **Claude.ai requires an Anthropic account. An alternative approach using Claude Code works locally without a proxy.**

**Official resources:**
- Claude.ai: [claude.ai](https://claude.ai)
- Anthropic developer docs: [docs.anthropic.com](https://docs.anthropic.com)
- Claude quickstarts (including web app examples): [github.com/anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts)

---

## 🧠 Core principles

1. **Artifacts = making Claude's output "come alive."** A regular reply is text; Artifacts is live-rendered HTML/SVG/React code. Say "create a login page" and Claude doesn't just give you code — it shows the page in a side panel in real time. What you see is what you get.

2. **Brand spec is the "visual constitution."** A solid brand spec only needs 5 elements: primary color / accent color, font name, border radius, spacing base unit, and shadow style. Give Claude these 5 and it can transform any messy HTML into a consistent, on-brand piece.

3. **Single-file HTML is the most universal sharing format.** With all CSS inlined into a `<style>` tag and all JS embedded in one `.html` file, anyone can open it in a browser — no server, no installation needed. That's the value of a "shareable single-file demo."

4. **Iteration is normal — don't expect to nail it in one shot.** After the first draft appears, keep going: "change the primary color to #1677FF," "switch the title font to Inter," "increase the card border radius" — each change updates the Artifacts preview in real time.

5. **If using a real Claude.ai account or API, confirm with your owner first.** If your owner doesn't have a Claude.ai account or can't access it, using the API requires an Anthropic API key.

---

## 🛠 How to do it

### Route 1: Claude.ai web app (simplest — nothing to install)

> 🌍 **Users needing local access:** If claude.ai isn't accessible in your region, use the Claude Code approach below (Route 2) — it runs locally and produces the same result.

**Steps for using Claude.ai Artifacts:**

1. Log in at [claude.ai](https://claude.ai), start a new conversation
2. Paste your "brand spec" and "HTML to transform," send the following prompt:

```
Please transform the HTML below into a unified brand style and produce a single-file HTML that opens directly in a browser.

Brand spec:
- Primary color: #1677FF (tech blue)
- Accent color: #F0F5FF (light blue background)
- Font: system-default sans-serif (prefer Inter, Arial, Helvetica)
- Border radius: 8px (cards), 4px (buttons)
- Spacing unit: multiples of 8px
- Shadow: 0 2px 8px rgba(0,0,0,0.1)

Please inline all CSS into a <style> tag and package everything into a single-file HTML so the Artifacts panel can preview it directly.

HTML to transform:
[paste your HTML code here]
```

3. The right-side Artifacts panel will render a live preview
4. Not satisfied? Keep the conversation going: "make the buttons 20px border-radius," "change the card background to white"
5. When satisfied, click the download or copy button in the top-right of the Artifacts panel to get the single-file HTML

---

### Route 2: Claude Code (command-line, runs locally)

If you're in a Claude Code environment, ask Claude directly to generate a brand-styled HTML file.

**Step 1: Prepare a brand spec prompt template**

Save the following as `brand-spec.md`:

```markdown
## My Brand Spec

- Primary color: #1677FF
- Accent color: #F0F5FF
- Background: #FFFFFF
- Text color: #333333
- Font: "Inter", "Helvetica Neue", sans-serif
- Heading weight: 600
- Body font size: 14px
- Border radius (cards): 12px
- Border radius (buttons): 6px
- Spacing unit: 8px
- Shadow: 0 2px 12px rgba(0,0,0,0.08)
```

**Step 2: Ask Claude Code to run the transformation**

In the conversation, type:
```
Read the brand spec in brand-spec.md, then transform the HTML below into a brand-compliant single-file HTML,
inlining all styles as <style>...</style>, and save the output to branded-demo.html.

[paste your original HTML here]
```

Claude Code will create `branded-demo.html` directly — open it in a browser to preview.

---

### A "messy HTML" sample you can use right away

Don't have HTML handy? Use this:

```html
<!DOCTYPE html>
<html>
<head><title>Product Introduction</title></head>
<body>
  <div style="margin:20px">
    <h1 style="color:green;font-size:30px">Our Product</h1>
    <p style="font-size:12px;color:#999">The best AI tools platform</p>
    <div style="border:1px solid black;padding:10px;margin:10px 0">
      <h2 style="color:red">Feature 1: Smart Analytics</h2>
      <p>Analyze your data and generate reports</p>
      <button style="background:blue;color:white;border:none;padding:5px 10px">Learn More</button>
    </div>
    <div style="border:1px solid black;padding:10px;margin:10px 0">
      <h2 style="color:red">Feature 2: Content Generation</h2>
      <p>Auto-generate marketing copy and images</p>
      <button style="background:blue;color:white;border:none;padding:5px 10px">Learn More</button>
    </div>
  </div>
</body>
</html>
```

After transformation, all colors, fonts, spacing, and border radii will unify to match the brand spec you defined.

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Task: Transform a "messy HTML" into a unified brand style with one prompt, produce a shareable single-file demo, and document the entire process.**

> ⚠️ **Safety boundary: claude.ai requires an account; Claude Code runs locally. Tell your owner which route you're taking before you start.**

**Steps:**

1. **Choose your route**: tell your owner whether you're using the claude.ai web app or Claude Code command-line.

2. **Prepare materials**:
   - Prepare a brand spec (you can use the example above or define your own)
   - Prepare a "messy" HTML snippet (you can use the example above)

3. **Run the transformation**:
   - Follow the corresponding route and ask Claude to output the brand-styled single-file HTML
   - Screenshot: the original HTML rendered in a browser vs. the transformed version

4. **Verify single-file format**: save the generated HTML as `branded-demo.html`, open it directly in a browser (no server needed), confirm it displays correctly, and screenshot it.

5. **Iterate once**: on top of the brand spec, add one more change request (e.g., "add a top navigation bar with the primary color as background" or "cards should have a light-blue shadow on hover"), ask Claude to update, and screenshot the result.

6. **Write a retrospective (≥80 words)**: how different does it look before vs. after? Was the brand spec applied accurately? Where does it need manual tweaking?

7. **Deposit a skill card**: distill "brand spec template + transformation prompt template + single-file HTML techniques" into `skills/brand-artifacts.md`.

**Evidence checklist:**
- [ ] Screenshot of original HTML in the browser
- [ ] Screenshot of transformed HTML in the browser
- [ ] `branded-demo.html` file (the shareable single-file)
- [ ] Screenshot after iterative modification
- [ ] Retrospective report
- [ ] Skill card file `skills/brand-artifacts.md`

---

## 🎓 Pass criteria

- [ ] You can explain what Artifacts is and how it differs from "a regular code reply"
- [ ] You can list the 5 core elements of a brand spec (primary color / font / border radius / spacing / shadow)
- [ ] You completed the "messy HTML → brand-styled HTML" transformation with before/after screenshots as proof
- [ ] You produced a single-file `branded-demo.html` that opens directly in a browser
- [ ] You completed at least one iteration
- [ ] You can explain Claude Code as an alternative route and how to use it locally
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card and move on.
