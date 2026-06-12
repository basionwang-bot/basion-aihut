> 🌐 English ｜ [中文](../../tools/T24-qpdf.md)

# Lesson T24 · qpdf: Split, Merge, Rotate, and Decrypt PDFs

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: qpdf official docs · [qpdf.readthedocs.io](https://qpdf.readthedocs.io/en/stable/) · [github.com/qpdf/qpdf](https://github.com/qpdf/qpdf)

---

## 📖 What you'll learn

After this lesson, you'll be able to use qpdf from the command line to perform "surgery" on PDFs: split a 100-page contract into per-chapter files, merge multiple reports into one, rotate a scanned document to the correct orientation, encrypt a PDF or remove its password — all locally, no Adobe Acrobat, no online tool required.

Think of a PDF as a bound stack of papers. qpdf is your **document surgeon**: grab the scalpel (command line), cut out a few pages, stitch a few together, flip one over, add a lock — precise, fast, and without damaging the original content. Best of all: qpdf works on the underlying PDF structure, not by re-rendering. Text quality, fonts, and tables are all preserved exactly as they were.

qpdf is an open-source command-line tool written in C++, maintained by Jay Berkenbilt. As of 2025 the stable version is qpdf 11.x. It specializes in PDF structural transformations and is one of the most reliable low-level tools for PDF work. On the Python side, `pikepdf` (formerly PyPDF2 was something different — pikepdf is the Python binding built directly on qpdf) provides similar functionality with a friendlier API.

**Official resources:**
- Official docs: [qpdf.readthedocs.io/en/stable/](https://qpdf.readthedocs.io/en/stable/)
- GitHub repo: [github.com/qpdf/qpdf](https://github.com/qpdf/qpdf)
- Command-line reference: [qpdf.readthedocs.io/en/stable/cli.html](https://qpdf.readthedocs.io/en/stable/cli.html)
- pikepdf (Python binding for qpdf): [pikepdf.readthedocs.io](https://pikepdf.readthedocs.io/en/latest/)

---

## 🧠 Core principles (internalize these as habits)

1. **qpdf does not re-render content — it only restructures the PDF. That's why it's fast and lossless.** Unlike re-printing a PDF, qpdf operates on the page objects and byte streams inside the PDF structure, bypassing any rendering engine. No matter how many operations you apply, text clarity never degrades, and the speed is extraordinary (merging a 100-page PDF typically takes under a second).

2. **Command skeleton: `qpdf [input options] input_file [operation options] output_file`.** Like ffmpeg, qpdf follows an "input → operation → output" three-part pattern. Both input and output are file paths; operations go in the middle.

3. **Page numbers start at 1; `z` represents the last page.** `--pages . 1-10 --` means pages 1 through 10. `--pages . 5-z --` means page 5 through the last page. `--pages . 1,3,5 --` means only pages 1, 3, and 5. This page range syntax is qpdf's signature feature — master it and you can do any kind of cutting.

4. **Merging multiple PDFs uses `--pages` syntax; `.` (dot) refers to the current input file.** When merging, specify an empty or first-file input, then use `--pages file1.pdf 1-z file2.pdf 1-z --` to list each source and its page range. It looks a bit unusual at first, but the pattern is fixed — memorize the template and it becomes second nature.

5. **Decryption should only be used on PDFs you are legally entitled to use.** qpdf can remove "print/copy restrictions" (the so-called owner password permissions) and can decrypt user-password-protected files if you know the password. Before using this feature, confirm: you are the legitimate owner of the PDF, or you have explicit authorization. This is both a legal and an ethical boundary.

---

## 🛠 How to do it

### Installation

qpdf is a system-level command-line tool:

```bash
# macOS (Homebrew)
brew install qpdf

# Ubuntu / Debian
sudo apt install qpdf

# CentOS / RHEL
sudo yum install qpdf

# Windows
# Download the installer from the official GitHub Releases page:
# https://github.com/qpdf/qpdf/releases
# Extract and add the bin/ directory to your system PATH

# Verify installation
qpdf --version

# Python binding (pikepdf, built on qpdf — richer API)
pip install pikepdf
```

> ⚠️ **System-level installation — do not install or run without the owner's confirmation. Present the plan first.**
>
> apt and brew installs are generally fast and do not require a VPN.

### Common operations

```bash
# ── Inspect a PDF ──
qpdf --show-pages input.pdf          # List all page information
qpdf --check input.pdf               # Check PDF structure for errors

# ── Split a PDF ──
# Extract pages 1–5
qpdf --empty --pages input.pdf 1-5 -- chapter1.pdf

# Extract page 6 to the last page
qpdf --empty --pages input.pdf 6-z -- chapter2.pdf

# Extract only pages 1, 3, and 5
qpdf --empty --pages input.pdf 1,3,5 -- selected.pdf

# Batch split into single pages (shell loop)
for i in $(seq 1 $(qpdf --show-npages input.pdf)); do
    qpdf --empty --pages input.pdf $i -- "output/page_${i}.pdf"
done

# ── Merge PDFs ──
# Merge file1.pdf and file2.pdf (file1 first)
qpdf --empty --pages file1.pdf 1-z file2.pdf 1-z -- merged.pdf

# Merge three or more files
qpdf --empty --pages a.pdf 1-z b.pdf 1-z c.pdf 1-z -- merged_all.pdf

# ── Rotate pages ──
# Rotate all pages 90 degrees clockwise
qpdf input.pdf --rotate=+90 output.pdf

# Rotate only page 1
qpdf input.pdf --rotate=+90:1 output.pdf

# Rotate counter-clockwise (−90 degrees)
qpdf input.pdf --rotate=-90 output.pdf

# Rotate 180 degrees
qpdf input.pdf --rotate=180 output.pdf

# ── Encryption and decryption ──
# Encrypt (set user password and owner password)
qpdf --encrypt user_password owner_password 256 -- input.pdf encrypted.pdf
#   Third argument is key length: 40 / 128 / 256 (256 recommended)

# Decrypt (requires knowing the password)
qpdf --decrypt --password=known_password encrypted.pdf decrypted.pdf

# Remove print/copy restrictions (owner-password-only PDFs)
qpdf --decrypt input.pdf unlocked.pdf

# ── Linearize (optimize for web viewing) ──
qpdf --linearize input.pdf optimized.pdf

# ── Compress file size ──
qpdf --compress-streams=y --object-streams=generate input.pdf compressed.pdf
```

### Python wrapper: using pikepdf (built on qpdf)

```python
import pikepdf
import os

def split_pdf(src: str, output_dir: str):
    """Split a PDF into single pages, one file per page."""
    os.makedirs(output_dir, exist_ok=True)
    with pikepdf.open(src) as pdf:
        total = len(pdf.pages)
        for i, page in enumerate(pdf.pages, 1):
            out = pikepdf.Pdf.new()
            out.pages.append(page)
            out.save(os.path.join(output_dir, f"page_{i:03d}.pdf"))
    print(f"Split complete: {total} pages → {output_dir}/")

def merge_pdfs(src_list: list, dst: str):
    """Merge multiple PDF files into one."""
    merged = pikepdf.Pdf.new()
    for src in src_list:
        with pikepdf.open(src) as pdf:
            merged.pages.extend(pdf.pages)
    merged.save(dst)
    print(f"Merged {len(src_list)} files → {dst} ({len(merged.pages)} pages)")

def rotate_pages(src: str, dst: str, degrees: int = 90, pages: list = None):
    """Rotate specified pages (pages=None means all pages)."""
    with pikepdf.open(src) as pdf:
        target_pages = pages or range(len(pdf.pages))
        for i in target_pages:
            page = pdf.pages[i]
            page.rotate(degrees, relative=True)
        pdf.save(dst)
    print(f"Rotated {degrees}° → {dst}")

def decrypt_pdf(src: str, dst: str, password: str = ""):
    """Decrypt a PDF (requires knowing the password)."""
    with pikepdf.open(src, password=password) as pdf:
        pdf.save(dst)
    print(f"Decrypted → {dst}")

# Examples (run only after confirming with the owner)
# split_pdf("big_report.pdf", "output/pages/")
# merge_pdfs(["part1.pdf", "part2.pdf", "part3.pdf"], "output/full_report.pdf")
```

### qpdf command quick reference

| What you want | Command |
|---------------|---------|
| Get page count | `qpdf --show-npages input.pdf` |
| Get page info | `qpdf --show-pages input.pdf` |
| Extract pages | `qpdf --empty --pages input.pdf 1-5 -- out.pdf` |
| Merge files | `qpdf --empty --pages a.pdf 1-z b.pdf 1-z -- out.pdf` |
| Rotate all pages | `qpdf input.pdf --rotate=+90 out.pdf` |
| Rotate specific pages | `qpdf input.pdf --rotate=+90:1-3 out.pdf` |
| Encrypt | `qpdf --encrypt password password 256 -- in.pdf out.pdf` |
| Decrypt | `qpdf --decrypt --password=password in.pdf out.pdf` |
| Remove restrictions | `qpdf --decrypt in.pdf out.pdf` |
| Compress | `qpdf --compress-streams=y in.pdf out.pdf` |
| Validate structure | `qpdf --check in.pdf` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "batch PDF reorganization" plan, including a verifiable minimum test.**

Scenario: the owner receives a batch of PDF reports (some scanned horizontally and need rotating; others need to be split by chapter). The tasks are: ① split a multi-chapter PDF into one file per chapter; ② rotate each chapter to portrait orientation; ③ re-merge all chapters into a complete ordered document.

You need to complete:

1. **Write the complete qpdf command sequence:**
   - Command to check the total page count of `report.pdf`
   - Assuming 30 pages total, three split commands for three chapters (1–10 / 11–20 / 21–30)
   - Command to rotate chapter 1 by 90 degrees to fix orientation
   - Command to re-merge the three chapters into `output/full.pdf`

2. **Write an equivalent Python pikepdf script:**
   - Functional encapsulation (split / rotate / merge)
   - Include a complete usage example

3. **Write a verifiable minimum test:** generate a 3-page test PDF in code (with reportlab), then use pikepdf to split it into 3 single-page files and verify that each file has exactly 1 page — this part can be run directly once the environment is set up.

4. **Write the acceptance criteria:**
   - Each chapter PDF has the expected page count (verified with `qpdf --show-npages`)
   - The merged `full.pdf` has a page count equal to the sum of all chapters
   - The rotated PDF displays in the correct orientation when opened in a viewer

5. **Write the safety notes:**
   - Only decrypt PDFs that you are legally entitled to use
   - **Do not install or run without the owner's confirmation**
   - Back up original files before batch operations

6. **Distill a skill card** into `agent-school/skills/qpdf-operations.md`.

> ⚠️ **Safety boundary**: step 3's minimum test can be run directly once the environment is set up; batch scripts and qpdf commands **must have the owner's explicit confirmation before execution**.

---

## 🎓 Pass criteria

- [ ] You wrote complete qpdf commands for split, merge, and rotate operations (with parameter explanations)
- [ ] You wrote a pikepdf-based Python script
- [ ] You can explain qpdf's page range syntax (`1-5`, `6-z`, `1,3,5`)
- [ ] You provided a directly runnable minimum verification script (generate test PDF in code + pikepdf split verification)
- [ ] Distilled 1 skill card into [`agent-school/skills/qpdf-operations.md`](../../../skills/qpdf-operations.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to the next lesson.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: split/merge/rotate/decrypt PDFs with qpdf/pikepdf

- **When to use**: restructure PDF page layout (split/merge/rotate/encrypt/decrypt)
- **From**: Lesson T24 qpdf

## Steps
1. Install: brew/apt install qpdf; pip install pikepdf
2. Get page count: qpdf --show-npages input.pdf
3. Split: qpdf --empty --pages input.pdf start-end -- output.pdf
4. Merge: qpdf --empty --pages a.pdf 1-z b.pdf 1-z -- merged.pdf
5. Rotate: qpdf input.pdf --rotate=+90 output.pdf (+90/−90/180)
6. Decrypt: qpdf --decrypt --password=password in.pdf out.pdf
7. Python: use pikepdf.open / pdf.pages.extend / pdf.save

## Verification
- qpdf --show-npages output.pdf to confirm page count
- qpdf --check output.pdf to confirm structure is valid

## Notes
- qpdf operations are lossless (no re-rendering), extremely fast
- Page range: 1-z means through the last page; z represents the last page number
- Only decrypt PDFs you are legally entitled to use
- Back up originals before batch operations
- pikepdf is the Python binding for qpdf with a friendlier API
```
