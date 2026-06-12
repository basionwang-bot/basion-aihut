> 🌐 English ｜ [中文](../../tools/T14-python-pptx.md)

# Lesson T14 · python-pptx: Automatically Lay Out Content as a PowerPoint

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T13 (python-docx helps with the shared mental model) ｜ Difficulty: ★★☆ ｜ Source: python-pptx official docs · [python-pptx.readthedocs.io](https://python-pptx.readthedocs.io/en/latest/) · [github.com/scanny/python-pptx](https://github.com/scanny/python-pptx)

---

## 📖 What you'll learn

After this lesson, you'll be able to use python-pptx to turn structured content (title + bullet points + data) into a `.pptx` PowerPoint file automatically — the owner just opens it and it's ready to use, no page-by-page hand-assembly required.

Imagine you need to produce a weekly sales-report PPT for 10 cities — same structure in every deck, only the numbers and city names differ. Doing it by hand, copy-pasting alone would be exhausting. Now you step in: **like a print shop running different copy through the same plate, when the data changes the PPT updates automatically — 10 decks in one run.**

python-pptx is the standard Python library for working with PowerPoint files, runs entirely offline with no network access, and requires no Office installation. Many companies use it on their backends to auto-generate performance reviews, data weeklies, and client proposals.

**Official resources:**
- Docs: [python-pptx.readthedocs.io](https://python-pptx.readthedocs.io/en/latest/)
- GitHub: [github.com/scanny/python-pptx](https://github.com/scanny/python-pptx)
- PyPI: [pypi.org/project/python-pptx](https://pypi.org/project/python-pptx)
- Quick-start reference: [python-pptx.readthedocs.io/en/latest/user/quickstart.html](https://python-pptx.readthedocs.io/en/latest/user/quickstart.html)

---

## 🧠 Core principles (internalize these as habits)

1. **PPT structure: Presentation → Slide → Shape → TextFrame → Paragraph → Run.** Like a book is "book → chapter → paragraph → sentence → word," in python-pptx the smallest unit is a `run` (a contiguous stretch of text sharing the same style). Understand this hierarchy and you'll never be confused about "where do I add text?"

2. **Use slide layouts — don't paint from a blank canvas.** `prs.slide_layouts[N]` gives you built-in "page templates" (title slide, title+content, blank, title-only…). Using a layout is far faster than manually positioning text boxes, and the result is more consistent.

3. **Specify positions and sizes with `Inches` or `Pt`, never guess raw numbers.** `left=Inches(1)` is 100× clearer than `left=914400` — both are equivalent, but three months from now you'll still understand the first one.

4. **Separate data from presentation logic.** Put the content to present (cities, numbers, bullet points) in dicts or lists; write the presentation logic (add text boxes, add charts) as separate functions. **Swap the data without touching the code; swap the style without touching the data.**

5. **For complex layouts, design a real `.pptx` template first, then fill it with code.** python-pptx can read placeholders from an existing `.pptx`, which is far more efficient than drawing boxes from scratch — the owner designs the template, you fill in the numbers.

---

## 🛠 How to do it

### Installation

```bash
pip install python-pptx
```

> ⚠️ **Do not install or run without the owner's confirmation — present the plan first.**

### Minimal runnable script: auto-generate a 3-slide weekly sales report PPT

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
import os

# Data: 3 cities' weekly reports (in a real project, read from CSV/database)
city_data = [
    {"city": "Beijing", "sales": 128, "target": 120, "highlights": ["Renewed 3 enterprise accounts", "Acquired 5 new SMB clients"]},
    {"city": "Shanghai", "sales": 95,  "target": 110, "highlights": ["Stocked up for mid-year promo", "Team expanded by 2 hires"]},
    {"city": "Shenzhen", "sales": 143, "target": 130, "highlights": ["Broke quarterly record", "Entered new tech-park channel"]},
]

os.makedirs("output", exist_ok=True)
prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)

# Built-in layout indexes: 0=title slide, 1=title+content, 5=blank, 6=title-only
blank_layout = prs.slide_layouts[6]  # title-only

for d in city_data:
    slide = prs.slides.add_slide(blank_layout)

    # Title text box
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(12), Inches(1.2))
    tf = txBox.text_frame
    tf.text = f"{d['city']} Weekly Sales Report"
    tf.paragraphs[0].runs[0].font.size = Pt(36)
    tf.paragraphs[0].runs[0].font.bold = True
    tf.paragraphs[0].runs[0].font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    # Data section
    data_box = slide.shapes.add_textbox(Inches(0.5), Inches(1.8), Inches(5), Inches(3))
    dtf = data_box.text_frame
    dtf.word_wrap = True
    p1 = dtf.paragraphs[0]
    p1.text = f"This week's sales: ${d['sales']}K"
    p1.runs[0].font.size = Pt(20)

    p2 = dtf.add_paragraph()
    p2.text = f"Target: ${d['target']}K"
    p2.runs[0].font.size = Pt(16)

    gap = d['sales'] - d['target']
    p3 = dtf.add_paragraph()
    p3.text = f"{'Exceeded' if gap >= 0 else 'Gap'}: ${abs(gap)}K"
    p3.runs[0].font.size = Pt(16)
    p3.runs[0].font.color.rgb = RGBColor(0,150,0) if gap >= 0 else RGBColor(200,0,0)

    # Highlights section
    hl_box = slide.shapes.add_textbox(Inches(6.5), Inches(1.8), Inches(6), Inches(3))
    htf = hl_box.text_frame
    htf.word_wrap = True
    hp0 = htf.paragraphs[0]
    hp0.text = "Highlights This Week"
    hp0.runs[0].font.bold = True
    hp0.runs[0].font.size = Pt(18)
    for hl in d['highlights']:
        hp = htf.add_paragraph()
        hp.text = f"• {hl}"
        hp.runs[0].font.size = Pt(14)

path = "output/weekly_sales_report.pptx"
prs.save(path)
print(f"Saved: {path}")
```

### Common operations quick reference

| Goal | Code |
|------|------|
| Create a new presentation | `prs = Presentation()` |
| Open existing `.pptx` | `prs = Presentation("template.pptx")` |
| Add a slide | `slide = prs.slides.add_slide(prs.slide_layouts[1])` |
| Access a built-in placeholder | `slide.placeholders[0].text = "Title"` |
| Add a text box manually | `slide.shapes.add_textbox(left, top, width, height)` |
| Add an image | `slide.shapes.add_picture("img.png", left, top, width, height)` |
| Add a table | `slide.shapes.add_table(rows, cols, left, top, width, height)` |
| Set font size | `run.font.size = Pt(24)` |
| Set font color | `run.font.color.rgb = RGBColor(R, G, B)` |
| Save | `prs.save("output.pptx")` |

### Fill placeholders from an existing template (recommended workflow)

```python
from pptx import Presentation

prs = Presentation("my_template.pptx")
slide = prs.slides[0]

# Inspect what placeholders the template has
for ph in slide.placeholders:
    print(ph.placeholder_format.idx, ph.name, ph.text)

# Fill by idx
slide.placeholders[0].text = "Beijing Weekly Sales Report"
slide.placeholders[1].text = "This week's sales: $128K"

prs.save("output/filled.pptx")
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete plan for auto-generating a multi-slide PPT and produce a runnable script.**

Chosen scenario: use a product catalog (at least 4 products) to generate a PPT — one slide per product with product name, description, price, and 3 key features, plus a final "Thank You" slide.

You need to complete:

1. **Write a complete runnable script:**
   - A data list (4+ products as dicts)
   - A loop that adds multiple slides
   - Each slide includes a title and body content
   - A final "Thank You" slide appended at the end
   - Save to `output/product_catalog.pptx`

2. **Write acceptance criteria:**
   - `output/product_catalog.pptx` exists and is > 0 bytes
   - Re-open with python-pptx; slide count == number of products + 1
   - Title text of the first slide can be read back

3. **Write environment notes:** Python ≥ 3.7 required, `pip install python-pptx`, no Office needed.

4. **Write safety notes:** this task runs locally with no network access; risk is low. `pip install` and script execution **still require the owner's confirmation first**.

5. **Distill a skill card** to `agent-school/skills/python-pptx-auto.md`.

---

## 🎓 Pass criteria

- [ ] You wrote a complete runnable script (loop + multiple slides + save)
- [ ] You wrote clear acceptance criteria (verifiable by re-opening with python-pptx)
- [ ] You can explain roughly what `slide_layouts` indexes correspond to, and when to use a template vs. building from scratch
- [ ] You know the difference between "placeholder" and "manually added text box" and when to use each
- [ ] Distilled 1 skill card into [`agent-school/skills/python-pptx-auto.md`](../../../skills/python-pptx-auto.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T15.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: auto-generating PowerPoint presentations with python-pptx

- **When to use**: when you need to turn structured data (reports, product catalogs, city data) into a .pptx file
- **From**: Lesson T14 python-pptx

## Steps
1. pip install python-pptx (ask the owner first)
2. Prepare data list (dicts)
3. prs = Presentation() — create new or open a template
4. Loop: add_slide → fill text boxes / placeholders → next record
5. prs.save("output.pptx")

## Verification
- File exists and is > 0 bytes
- Re-open with Presentation; len(prs.slides) == expected slide count

## Notes
- slide_layouts indexes: 0=title slide, 1=title+content, 5=blank, 6=title-only
- Using an existing template and filling placeholders is more efficient than drawing from scratch
- Use Inches() / Pt() for positions and sizes — never guess raw EMU values
- pip install and execution both require the owner's confirmation first
```
