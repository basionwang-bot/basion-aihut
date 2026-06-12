> 🌐 English ｜ [中文](../../tools/T23-pdfplumber.md)

# Lesson T23 · pdfplumber: Extracting Text and Tables from PDFs

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: pdfplumber official docs · [github.com/jsvine/pdfplumber](https://github.com/jsvine/pdfplumber) · [pypi.org/project/pdfplumber](https://pypi.org/project/pdfplumber/)

---

## 📖 What you'll learn

After this lesson, you'll be able to use pdfplumber to open a PDF file and precisely extract its text and tables — not guessing, but pulling out data character by character, line by line, and cell by cell, storing it as Python strings or lists for further processing.

Think of a PDF as a document locked inside a glass case — you can see it, but you can't copy from it. pdfplumber is the tool that **opens the case**: it lays out every character, every line, and every table cell from the PDF right in front of you, ready to use however you like.

pdfplumber is designed specifically for extracting data from "digitally native PDFs" (not scanned documents). It is especially precise with PDFs that contain tables (financial reports, government notices, contracts). It is built on pdfminer.six — more user-friendly than raw pdfminer, and more table-focused than PyMuPDF.

**Official resources:**
- GitHub repo: [github.com/jsvine/pdfplumber](https://github.com/jsvine/pdfplumber)
- PyPI page: [pypi.org/project/pdfplumber](https://pypi.org/project/pdfplumber/)
- Detailed README (with API reference): [github.com/jsvine/pdfplumber#readme](https://github.com/jsvine/pdfplumber#readme)

---

## 🧠 Core principles (internalize these as habits)

1. **pdfplumber only works with "digitally native PDFs" — not scanned documents.** A digitally native PDF is generated directly from Word, Excel, or a print driver and contains real text data. A scanned PDF is a paper document photographed and saved as images — there is no text layer, only pixels. How to tell the difference: open the PDF in a viewer and try to select and copy text. If you can copy it, it's native; if you can't, it's a scan (use Tesseract from Lesson T22 instead).

2. **Process page by page — don't load the whole file at once.** After `with pdfplumber.open(path) as pdf:`, iterate through `pdf.pages` one page at a time. Even large files won't blow up your memory, because each page is read on demand.

3. **Table extraction accuracy depends on whether there are visible border lines in the PDF.** `page.extract_table()` determines cell boundaries by looking for lines and rectangles in the PDF. Tables with clean, visible borders have 90%+ accuracy. "Pseudo-tables" that align columns with spaces rather than lines are less reliable — in those cases, tune the `table_settings` parameter or use a coordinate-based text-slicing strategy.

4. **`extract_text()` is your starting point; `extract_words()` is for precision work.** `page.extract_text()` gives you a plain string — sufficient for simple cases. `page.extract_words()` gives you each word's text plus its coordinates, which is useful when you need to know "where is this word on the page" (for example, to find a keyword and then grab the value to its right or below).

5. **Open PDFs with a `with` statement so they close automatically.** pdfplumber holds a file handle while processing. If you forget to close it, batch-processing many files can exhaust your available file descriptors. Make `with pdfplumber.open(...) as pdf:` a habit.

---

## 🛠 How to do it

### Installation

```bash
pip install pdfplumber

# Verify installation
python -c "import pdfplumber; print(pdfplumber.__version__)"
```

> ⚠️ **Do not install or run without the owner's confirmation — present the plan first.**

### Minimal runnable example (with embedded test data)

The following example generates a test PDF in code — **no external file needed** — so you can verify the pipeline immediately:

```python
# Install the PDF generation library (for testing only)
# pip install reportlab

from reportlab.pdfgen import canvas
import pdfplumber, io

# ── Generate a test PDF ──
buf = io.BytesIO()
c = canvas.Canvas(buf)
c.drawString(72, 750, "Project: Sample Contract")
c.drawString(72, 720, "Amount: $100,000")
c.drawString(72, 690, "Date: 2026-06-11")
c.save()
buf.seek(0)

# ── Read with pdfplumber ──
with pdfplumber.open(buf) as pdf:
    page = pdf.pages[0]
    text = page.extract_text()
    print("Extracted text:")
    print(text)
    print(f"Total pages: {len(pdf.pages)}")
# Expected output includes: Project: Sample Contract
```

### Extracting text

```python
import pdfplumber

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract all text from a PDF, page by page, concatenated."""
    all_text = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                all_text.append(f"--- Page {i+1} ---\n{text}")
    return "\n\n".join(all_text)

# Example
# text = extract_text_from_pdf("report.pdf")
# with open("output/report.txt", "w", encoding="utf-8") as f:
#     f.write(text)
```

### Extracting tables

```python
import pdfplumber
import csv

def extract_tables_from_pdf(pdf_path: str, output_csv: str):
    """Extract all tables from a PDF and save as CSV."""
    all_rows = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, 1):
            tables = page.extract_tables()
            for t_idx, table in enumerate(tables):
                print(f"Page {page_num}, table {t_idx+1}: {len(table)} rows")
                for row in table:
                    # Replace None cells with empty strings
                    all_rows.append([cell or "" for cell in row])

    with open(output_csv, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerows(all_rows)
    print(f"Extracted {len(all_rows)} rows, saved to {output_csv}")

# Example (run only after confirming with the owner)
# extract_tables_from_pdf("financial_report.pdf", "output/tables.csv")
```

### Precision work: extract text from a specific region

```python
import pdfplumber

def extract_region(pdf_path: str, page_num: int,
                   bbox: tuple) -> str:
    """
    Extract text from a specific rectangular region of a page.
    bbox: (x0, top, x1, bottom) — coordinates from top-left, in points (1/72 inch)
    Use page.bbox to get the full page dimensions.
    """
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[page_num - 1]
        region = page.crop(bbox)
        return region.extract_text() or ""

# Example: extract from the top-right of page 1 (e.g., to find a date)
# text = extract_region("contract.pdf", 1, bbox=(400, 0, 600, 100))
```

### Tuning table extraction parameters (for tables without border lines)

```python
# If extract_table() gives poor results, try custom settings
table_settings = {
    "vertical_strategy": "lines",    # or "text" (align by text) or "explicit"
    "horizontal_strategy": "lines",  # or "text"
    "snap_tolerance": 5,             # pixel tolerance
    "join_tolerance": 5,
    "edge_min_length": 10,
    "min_words_vertical": 3,
    "min_words_horizontal": 1,
}
table = page.extract_table(table_settings=table_settings)
```

### Common API quick reference

| What you want | Code |
|---------------|------|
| Open a PDF | `with pdfplumber.open("a.pdf") as pdf:` |
| Total pages | `len(pdf.pages)` |
| Get a page | `pdf.pages[0]` (0-indexed) |
| Extract full-page text | `page.extract_text()` |
| Extract words + coordinates | `page.extract_words()` |
| Extract characters + coordinates | `page.extract_chars()` |
| Extract one table | `page.extract_table()` |
| Extract all tables | `page.extract_tables()` |
| Crop a region | `page.crop((x0, top, x1, bottom))` |
| Page dimensions | `page.width, page.height` |
| Render page as image | `page.to_image(resolution=150)` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "automated PDF report parsing" plan, including a verifiable minimum test.**

Scenario: the owner receives a batch of PDF financial reports. Each PDF contains descriptive text and data tables, and needs: ① extract all text into a txt file; ② extract all tables into a CSV; ③ find which pages contain the keyword "Total".

You need to complete:

1. **Generate a test PDF in code and run the extraction pipeline** (use reportlab to dynamically generate a PDF with text, then extract with pdfplumber and print the result) — this part **can be run directly** to verify the environment.

2. **Write a complete batch parsing script** that:
   - Iterates over all `.pdf` files in `pdfs/`
   - For each PDF: extracts text → saves to `output/<name>.txt`; extracts tables → saves to `output/<name>.csv`
   - Records which pages contain the keyword "Total"
   - Logs failures to `output/failed.txt`

3. **Write the acceptance criteria:**
   - txt files exist and are non-empty, encoded in UTF-8
   - CSV files open without garbled characters in Excel (`utf-8-sig` encoding)
   - Keyword search results are a list of page numbers (not True/False)

4. **Write when pdfplumber is not enough** (scanned PDF → point to Lesson T22; need to modify PDF → point to Lesson T24)

5. **Write the safety notes:**
   - PDFs may contain contracts, financial data, or other sensitive information — verify data permissions before processing
   - **Do not install or run without the owner's confirmation**

6. **Distill a skill card** into `agent-school/skills/pdfplumber-extract.md`.

> ⚠️ **Safety boundary**: step 1's minimum test can be run after the environment is set up; the batch script in step 2 **must have the owner's explicit confirmation before execution**.

---

## 🎓 Pass criteria

- [ ] You wrote a minimal verifiable script that generates a test PDF in code and then extracts from it with pdfplumber
- [ ] You wrote a complete batch text + table extraction script
- [ ] You can explain the difference between `extract_text()` and `extract_words()` and their respective use cases
- [ ] You know when pdfplumber won't work (scanned PDFs / encrypted PDFs) and can point to alternative solutions
- [ ] Distilled 1 skill card into [`agent-school/skills/pdfplumber-extract.md`](../../../skills/pdfplumber-extract.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T24.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: extracting PDF text and tables with pdfplumber

- **When to use**: extract text or table data from digitally native PDFs (not scanned documents)
- **From**: Lesson T23 pdfplumber

## Steps
1. Install: pip install pdfplumber
2. Eligibility check: if you can select and copy text in a viewer → native PDF → use this; if not → scanned → use T22 Tesseract
3. Open: with pdfplumber.open(path) as pdf:
4. Iterate: for page in pdf.pages:
5. Extract text: page.extract_text()
6. Extract tables: page.extract_tables() → list of list of list
7. Batch: wrap each PDF in try/except, log failures

## Verification
- txt file is non-empty and contains expected keywords
- CSV uses utf-8-sig encoding to avoid garbled characters in Excel

## Notes
- Only works on digitally native PDFs — use Tesseract (Lesson T22) for scanned documents
- Tables without visible border lines need tuned table_settings parameters
- Always use a with statement to open PDFs — ensures file handles are closed
- Encrypted PDFs need to be decrypted first with qpdf (Lesson T24)
```
