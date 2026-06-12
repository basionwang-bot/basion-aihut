> 🌐 English ｜ [中文](../../professions/Z01-wechat-official.md)

# Lesson Z01 · Newsletter & Blog Content Operations

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: general Markdown-to-newsletter workflow; see tool links in body

---

## 📖 What you'll learn

After this lesson, you will deliver a **complete newsletter/blog content pack that the owner can use immediately** — not a "here's how you could approach this topic" analysis, but a bundled deliverable: headline options, full draft body, formatting notes, and a publishing placement rationale.

Think of yourself as a copy editor at a publishing house. Your job is to take a piece from "raw idea" to "ready to send to print": the topic must resonate with readers, the body must flow and carry information, the formatting must meet platform conventions — and then you push the draft to the editor's desk. Stamping it and mailing it out? That's the editor's job. Your value is making sure what lands on the editor's desk **needs no heavy revision and is decision-ready**.

The pipeline for newsletter/blog content looks like this:

**Topic selection → Draft → Formatting → Publish**

You own the first three stages. The Publish button always belongs to the owner, never to you.

**On ready-made tools (research first, ask before installing):**

- **Substack**: Full-featured newsletter platform with built-in subscriber management, paid tiers, and formatting. Works natively with Markdown. [substack.com](https://substack.com)
- **Ghost**: Open-source publishing platform; self-hostable or managed. Great for blogs with newsletter functionality. [ghost.org](https://ghost.org)
- **Markdown-to-email converters**: Many newsletter tools (Mailchimp, ConvertKit, Buttondown) accept Markdown or HTML directly.

> ⚠️ Do not connect to any real newsletter account or publishing backend without the owner's explicit approval. This lesson's focus is **producing content drafts**. Tool research is research; installation requires the owner's go-ahead.

---

## 🧠 Core principles (internalize these as habits)

1. **Understand the owner's voice before writing a single word.** Browse a few published posts in `content/posts/`. Is the tone analytical and dry, or warm and conversational? Is the audience technical, or general? Your draft must match that register.

2. **The subject line / headline is the first battleground.** Open rates live or die by headlines. A good headline passes one test: the reader glances at it and immediately knows whether it's relevant to them — either "this is my exact pain point" or "what does that even mean, I have to click." Always prepare at least 3 headline options for the owner to choose from.

3. **Every piece of writing needs a one-sentence core thesis.** Before writing, complete this sentence: "After reading this, the reader will walk away with the insight that: ______." If you can't fill in that blank, the topic isn't thought through yet. Don't start writing.

4. **Newsletter readers read on mobile, in an inbox, usually with one eye.** That means: short paragraphs (3–5 lines, then break), no tables (unreadable on mobile), bold for emphasis (not underlines), a few images but not a visual avalanche.

5. **Draft is draft, publish is publish.** Everything you produce is a modifiable draft. No matter how polished it is, you never connect to any newsletter backend or publishing service on the owner's behalf.

---

## 🛠 How to do it

### Three sources for topic selection

1. **Rewrite existing repo content**: Go to `content/posts/`, pick an existing article, and adapt it from "technical / detailed version" to "newsletter-friendly version."
2. **The owner's most-asked questions**: What questions do the owner's readers ask most often? What keeps them up at night? These topics get opened.
3. **Recent industry news + the owner's unique angle**: The news itself is not the scoop — the owner's distinctive take on it is.

### The content pack five-piece set (assemble all five every time)

```
[Headline options]    3 options, different styles (curiosity / self-interest / opinion)
[Content positioning] Who it's for / where it fits / why now
[Body draft]
  - Opening (hook): the first 3 lines decide whether the reader stays
  - Middle: 1–3 core arguments, each with a concrete example or data point
  - Closing: one call to action or a memorable closing line
[Formatting notes]    Paragraph length / whether sub-headers help / image direction
[Self-check verdict]  Does the tone match the owner's voice? Could this pass as theirs?
```

### Formatting quick-reference

- Body paragraphs: 3–5 lines each, blank line between paragraphs
- Sub-headers: use `**bold**` or horizontal rules; Markdown `##` headings are fine for blog posts; for plain-text emails, avoid them
- Hero image: 1200×630 px (standard Open Graph size); 2–4 inline images is a good range
- If using a Markdown-to-newsletter tool: write clean Markdown first — the tool handles conversion

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: pick a real topic and produce the complete newsletter/blog content pack.**

**Suggested topics (pick one or define your own):**
- "What an AI agent actually did for me — a 30-day report from an ordinary user"
- "Why your AI assistant keeps disappointing you — here's where the problem is"
- "For first-time Claude Code users: three ways to avoid rookie mistakes"

**You must:**

1. **Produce the five-piece set** (see How to do it above): 3 headline options + content positioning + complete body draft + formatting notes + self-check verdict.

2. **Body length**: 600–1,200 words — appropriate for a 3–5 minute newsletter read.

3. **Two self-checks**:
   - Pull out the first three lines of the body and ask yourself: "If I were the reader, would these three lines make me want to keep reading?"
   - Compare the overall tone of the body with published posts in `content/posts/`: "Does this sound like it comes from the same voice?"

4. **Tool research (optional, bonus credit)**: Visit [ghost.org](https://ghost.org) or [substack.com](https://substack.com) and write a ≤100-word "tool recommendation for the owner": what problem this tool solves and what prerequisites it requires. **Research is research; installation requires the owner's sign-off.**

5. **Skill card**: Distill the newsletter five-piece-set workflow into `skills/newsletter-content.md`.

> ⚠️ **Iron rule, restated: drafts only, never publish.** Do not log in to any newsletter account, do not connect to any content management backend, do not submit drafts to any live publishing service. Your job ends at "hand the five-piece set to the owner." The publish button is theirs, not yours.

---

## 🎓 Pass criteria

- [ ] You produced a **complete five-piece set** (3 headlines + positioning + body + formatting notes + self-check)
- [ ] Body is **600+ words**, copy-paste ready — not an outline
- [ ] You ran **both self-checks**: first-three-lines hook test + voice comparison against repo posts
- [ ] You **did not log in, publish, or operate any real account** at any point (verifiable)
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand the content pack to the owner.
