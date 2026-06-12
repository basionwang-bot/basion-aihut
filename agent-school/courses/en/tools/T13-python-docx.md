> 🌐 English ｜ [中文](../../tools/T13-python-docx.md)

# Lesson T13 · python-docx: Batch-Generate Word Documents

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: python-docx official docs · [python-docx.readthedocs.io](https://python-docx.readthedocs.io/en/latest/) · [github.com/python-openxml/python-docx](https://github.com/python-openxml/python-docx)

---

## 📖 What you'll learn

After this lesson, you'll be able to use python-docx to automatically generate a batch of data (an employee roster, a set of contract templates, a stack of reports) into individual `.docx` files ready for the owner to use — without the owner having to type a single one by hand.

Picture this: the company's annual gala needs 200 award certificates — each one differs only in the recipient's name and award title. Doing it manually means copy-paste in Word over and over, at least three or four hours of work with plenty of room for mistakes. Now you step in: **like a factory stamping labels off the same master plate, you feed the list into the template, and 200 certificates come out in a minute — each saved separately, each formatted identically.**

python-docx is a pure-Python library for creating, reading, and modifying `.docx` files (Microsoft Word format), no Word installation required. It's widely used in the developer community for batch-generating contracts, reports, notices, and certificates.

**Official resources:**
- Docs: [python-docx.readthedocs.io](https://python-docx.readthedocs.io/en/latest/)
- GitHub: [github.com/python-openxml/python-docx](https://github.com/python-openxml/python-docx)
- PyPI: [pypi.org/project/python-docx](https://pypi.org/project/python-docx)

---

## 🧠 Core principles (internalize these as habits)

1. **Keep data and template separate — don't mix them.** Put the content to fill in (names, amounts, dates) in a list or dictionary; keep document styling separately — like a chef storing ingredients apart from the recipe. Swapping content or layout stays easy.

2. **Start with a Document object, then add things to it.** In python-docx's world, a `.docx` is a `Document` object. First `doc = Document()`, then call `.add_paragraph()`, `.add_heading()`, `.add_table()` in sequence — write top-to-bottom, don't try to "jump around and fill gaps."

3. **Prefer built-in style names over direct font tweaks.** Directly setting font sizes tends to produce inconsistent results. Prefer Word's built-in style names (e.g., `'Heading 1'`, `'Normal'`) or a pre-made `.docx` template — that way the formatting doesn't drift when the file is opened.

4. **For batch generation, create and save each document independently.** Don't "mutate the same object then save" — it gets messier with each iteration. The correct pattern is: inside the loop, call `Document()` fresh each time, fill it in, then `save`.

5. **After generating, take a look at the output yourself.** The script finishing only means "the files exist" — not that the formatting is right. Either take a thumbnail screenshot or note "please spot-check document N" in your report. **A deliverable, not just a script, counts as done.**

---

## 🛠 How to do it

### Installation

```bash
pip install python-docx
```

> ⚠️ **Do not install or run without the owner's confirmation — present the plan first, execute only after the owner says yes.**

### Minimal runnable script: batch-generate award certificates

```python
from docx import Document
from docx.shared import Pt, RGBColor
import os

# Data: recipient list (in a real project, read from CSV / Excel)
winners = [
    {"name": "Zhang San", "award": "Best Innovation Award"},
    {"name": "Li Si",     "award": "Best Team Award"},
    {"name": "Wang Wu",   "award": "Annual Contribution Award"},
]

os.makedirs("output", exist_ok=True)

for person in winners:
    doc = Document()  # create a fresh document for each person

    # Title
    heading = doc.add_heading("Award Certificate", level=0)
    heading.alignment = 1  # center (1 = CENTER)

    # Body
    p = doc.add_paragraph()
    p.alignment = 1
    run = p.add_run(f"\nDear {person['name']}:\n")
    run.font.size = Pt(16)
    run.font.bold = True

    p2 = doc.add_paragraph()
    p2.alignment = 1
    run2 = p2.add_run(f"You have been awarded "{person['award']}". Congratulations.")
    run2.font.size = Pt(14)

    # Date
    doc.add_paragraph("\nJune 2026")

    filename = f"output/Certificate_{person['name']}.docx"
    doc.save(filename)
    print(f"Generated: {filename}")

print("All done!")
```

### Common operations quick reference

| Goal | Code |
|------|------|
| Create a blank document | `doc = Document()` |
| Open existing `.docx` as template | `doc = Document("template.docx")` |
| Add a heading (H1/H2…) | `doc.add_heading("Heading text", level=1)` |
| Add a body paragraph | `doc.add_paragraph("content")` |
| Bold / color text | `run.font.bold = True` / `run.font.color.rgb = RGBColor(255,0,0)` |
| Add a table | `table = doc.add_table(rows=3, cols=4)` |
| Read a table cell | `table.cell(0, 0).text` |
| Insert an image | `doc.add_picture("logo.png", width=Inches(2))` |
| Save | `doc.save("output.docx")` |

### Batch placeholder replacement from a template (advanced)

```python
from docx import Document

def fill_template(template_path, replacements, output_path):
    """
    replacements: dict, e.g. {"{{name}}": "Zhang San", "{{award}}": "Best Innovation Award"}
    """
    doc = Document(template_path)
    for para in doc.paragraphs:
        for key, val in replacements.items():
            if key in para.text:
                for run in para.runs:
                    run.text = run.text.replace(key, val)
    doc.save(output_path)
```

> Note: when replacing template placeholders, Word may split a single visible string across multiple `run` objects. If simple replacement doesn't work, inspect the `.text` of each `run` in `para.runs`.

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete plan for batch-generating Word files and produce a runnable script.**

Chosen scenario: use a data list (at least 5 records) to batch-generate "Employee Onboarding Notices" — each file contains the employee's name, start date, department, and reporting location, saved to the `output/` directory.

You need to complete:

1. **Write a complete runnable Python script** that includes:
   - A data list (at least 5 records as dicts)
   - A loop that creates each document
   - Each document contains a title, body (4 fields), and closing date
   - Saves to `output/Notice_{name}.docx`
   - Prints a summary "Generated N documents"

2. **Write acceptance criteria:**
   - `output/` directory contains 5 `.docx` files
   - Each file is > 0 bytes (non-empty)
   - File names contain the corresponding employee's name
   - Re-open one file with python-docx and confirm the title text can be read

3. **Write environment notes:** Python version required, `pip install python-docx` needed, no system Word required.

4. **Write safety notes:**
   - This task involves no network requests; data is local; risk is low
   - But `pip install` and actually running the script **still require the owner's confirmation first**
   - If the data comes from a real employee list supplied by the owner, confirm it may be processed locally and doesn't violate privacy rules

5. **Compile everything into a report and save it** to your dorm's `agent-school/skills/python-docx-batch.md`.

---

## 🎓 Pass criteria

- [ ] You wrote a complete runnable script (loop + batch generation + save)
- [ ] You wrote clear acceptance criteria (verifiable file-checking conditions)
- [ ] You understand why each loop iteration must call `Document()` fresh, and can explain why reusing the same object is wrong
- [ ] You know how to use an existing `.docx` as a template and batch-replace placeholders
- [ ] Distilled 1 skill card into [`agent-school/skills/python-docx-batch.md`](../../../skills/python-docx-batch.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T14.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: batch-generating Word documents with python-docx

- **When to use**: when you need to turn a batch of data (rosters, contracts, notices) into individual .docx files
- **From**: Lesson T13 python-docx

## Steps
1. pip install python-docx (ask the owner first)
2. Prepare a data list (list of dicts, one dict per document)
3. Loop: doc = Document() fresh each time → fill content → doc.save(path)
4. Print summary "Generated N documents"

## Verification
- Number of files in output/ == number of data records
- Each file > 0 bytes
- Re-open with Document(path) and confirm the title text is readable

## Notes
- Always create Document() fresh in each loop iteration — never reuse the same object
- When replacing template placeholders, Word may split the same string across multiple runs
- pip install and script execution both require the owner's confirmation first
```
