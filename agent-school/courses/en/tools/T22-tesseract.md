> 🌐 English ｜ [中文](../../tools/T22-tesseract.md)

# Lesson T22 · Tesseract OCR: Extracting Text from Images

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T20-pillow or T21-imagemagick ｜ Difficulty: ★★★ ｜ Source: Tesseract official docs · [tesseract-ocr.github.io/tessdoc/](https://tesseract-ocr.github.io/tessdoc/) · pytesseract · [github.com/madmaze/pytesseract](https://github.com/madmaze/pytesseract)

---

## 📖 What you'll learn

After this lesson, you'll be able to extract text from images (screenshots, scanned documents, photos) and save it as editable text — what is commonly called OCR (Optical Character Recognition). Supports Chinese, English, and dozens of other languages in mixed recognition.

Imagine you receive a scanned PDF — an old paper contract, all images, nothing you can copy. Typing it out character by character is out of the question, but Tesseract can. Think of it as **a pair of eyes that can read images**: it converts every character in a picture into a string your code can work with. Developed by HP in the 1980s and maintained by Google ever since, Tesseract is the longest-running open-source OCR engine in the industry.

pytesseract is Python's wrapper around Tesseract, letting you complete recognition in a single line of Python code.

**Official resources:**
- Tesseract docs: [tesseract-ocr.github.io/tessdoc/](https://tesseract-ocr.github.io/tessdoc/)
- Tesseract GitHub: [github.com/tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)
- pytesseract GitHub: [github.com/madmaze/pytesseract](https://github.com/madmaze/pytesseract)
- pytesseract PyPI: [pypi.org/project/pytesseract](https://pypi.org/project/pytesseract/)
- Language data downloads: [github.com/tesseract-ocr/tessdata](https://github.com/tesseract-ocr/tessdata)

---

## 🧠 Core principles (internalize these as habits)

1. **Image quality determines recognition quality — garbage in, garbage out.** Tesseract is a good student, but hand it a blurry, skewed, low-contrast image and it will still struggle. Pre-process the image before recognition: ① convert to grayscale; ② binarize (black and white); ③ deskew; ④ upscale to 300 DPI or above. These four preprocessing steps can lift accuracy from 60% to 90%+.

2. **Chinese recognition requires installing the Chinese language pack.** The default installation only includes English (eng). To recognize Chinese you must additionally install `chi_sim` (Simplified Chinese) or `chi_tra` (Traditional Chinese); for mixed Chinese-English use `lang="chi_sim+eng"`. This is not optional — it is a **mandatory prerequisite**.

3. **PSM (page segmentation mode) directly affects results — learn to choose the right one.** `--psm 3` is "full page, auto-analysis" (default, suitable for full-document pages); `--psm 6` is "assume a uniform block of text" (suitable for single paragraphs or tables); `--psm 7` is "treat the image as a single line of text" (suitable for single-line screenshots, captchas). Picking the wrong mode can reduce an entire paragraph to just a few characters.

4. **Output is not just plain text — you can also get position data and confidence scores.** `pytesseract.image_to_data()` gives you the bounding box (left/top/width/height) and confidence score (conf) for every word. This is crucial for tasks like automated form filling or document structure analysis.

5. **Know Tesseract's limits — don't force it into situations where it will fail.** In the following cases Tesseract performs poorly; consider switching to PaddleOCR or a commercial API: artistic or handwritten text, images rotated more than 15° without deskewing, densely nested tables, low-contrast colored backgrounds.

---

## 🛠 How to do it

### Installation (two steps — both are required)

```bash
# Step 1: Install the Tesseract engine (system-level tool)
# macOS:
brew install tesseract tesseract-lang
# Ubuntu/Debian:
sudo apt install tesseract-ocr
# Install only the Simplified Chinese language pack:
sudo apt install tesseract-ocr-chi-sim
# Install all language packs (~400 MB):
sudo apt install tesseract-ocr-all

# Windows:
# Download the installer maintained by UB-Mannheim:
# https://github.com/UB-Mannheim/tesseract/wiki
# During installation, select "Additional language data (Download)" → Chinese Simplified

# Step 2: Install the Python wrapper
pip install pytesseract Pillow

# Verify: list installed language packs
tesseract --list-langs
# Output should include chi_sim and eng
```

> ⚠️ **System-level installation — do not install or run without the owner's confirmation. Present the plan first.**
>
> If the default apt repository is slow, consider switching to a faster mirror before installing.

### Minimal runnable example (with embedded test data)

The following example **does not require an external image file** — it generates a test image in code so you can verify the pipeline right away:

```python
from PIL import Image, ImageDraw, ImageFont
import pytesseract

# ── Generate a test image (no real file needed) ──
test_img = Image.new("RGB", (400, 100), color="white")
draw = ImageDraw.Draw(test_img)
draw.text((20, 30), "Hello World 2026", fill="black")
test_img.save("/tmp/test_ocr.png")

# ── English OCR ──
result = pytesseract.image_to_string(test_img, lang="eng")
print("Recognition result:", result.strip())
# Expected output: Hello World 2026
```

### Recognizing a real image

```python
from PIL import Image
import pytesseract

def ocr_image(image_path: str, lang: str = "chi_sim+eng") -> str:
    """
    Recognize text in an image.
    lang: "chi_sim"=Simplified Chinese, "chi_tra"=Traditional,
          "eng"=English, "chi_sim+eng"=mixed (most common)
    """
    img = Image.open(image_path)
    # PSM 3 = full-page auto analysis (default)
    # PSM 6 = assume a single uniform text block
    # PSM 7 = single line of text
    config = "--psm 3 --oem 3"
    text = pytesseract.image_to_string(img, lang=lang, config=config)
    return text.strip()

# Example (run only after confirming with the owner)
# text = ocr_image("screenshot.png")
# print(text)
```

### Image preprocessing (improving accuracy)

```python
from PIL import Image, ImageFilter, ImageEnhance
import pytesseract

def preprocess_and_ocr(image_path: str, lang: str = "chi_sim+eng") -> str:
    """Preprocess the image before OCR for higher accuracy."""
    img = Image.open(image_path)

    # 1. Convert to grayscale
    img = img.convert("L")

    # 2. Upscale low-resolution images (2× helps recognition)
    w, h = img.size
    if w < 1000:
        img = img.resize((w * 2, h * 2), Image.LANCZOS)

    # 3. Enhance contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2.0)

    # 4. Binarize (threshold 128 → black and white)
    img = img.point(lambda x: 0 if x < 128 else 255, "1")

    # 5. OCR
    config = "--psm 6 --oem 3"
    text = pytesseract.image_to_string(img, lang=lang, config=config)
    return text.strip()
```

### Getting recognition results with position data

```python
import pytesseract
from PIL import Image
import pandas as pd

def ocr_with_positions(image_path: str, lang: str = "chi_sim+eng"):
    """Return each word's text, bounding box, and confidence score."""
    img = Image.open(image_path)
    data = pytesseract.image_to_data(img, lang=lang,
                                      output_type=pytesseract.Output.DATAFRAME)
    # Filter out empty words and low-confidence results
    data = data[(data["conf"] > 60) & (data["text"].str.strip() != "")]
    return data[["text", "left", "top", "width", "height", "conf"]]
```

### PSM mode quick reference

| PSM value | Best for |
|-----------|----------|
| `--psm 3` | Full-page document, auto layout analysis (default) |
| `--psm 6` | Single uniform text block, no complex layout |
| `--psm 7` | Single line of text (screenshot, single-line label) |
| `--psm 11` | Sparse text — find as much text as possible |
| `--psm 13` | Single line, no language processing (captchas) |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "screenshot text extraction" plan.**

Scenario: the owner has a batch of screenshots (from chat logs, web pages, etc.) and needs to extract all the text from each one and save it as a `.txt` file.

You need to complete:

1. **Generate a test image containing text in code** (no external file dependency), run OCR on this self-made image, and print the recognition result — this is the **directly runnable** minimum verification.

2. **Write a complete batch extraction script** that:
   - Iterates over all PNG/JPG files in `screenshots/`
   - Preprocesses each image (grayscale + contrast enhancement + binarization)
   - Runs mixed recognition with `chi_sim+eng`
   - Writes results to `output/<filename>.txt`
   - Logs failures to `output/failed.txt`

3. **Write the acceptance criteria:**
   - The test image (self-generated) recognition result contains the keywords you wrote into it
   - Output txt files are UTF-8 encoded
   - Words with confidence below 60 are excluded from the final output

4. **Write the troubleshooting steps for failed Chinese recognition:**
   - `tesseract --list-langs` — confirm chi_sim is installed
   - Check whether the `--psm` mode matches the image type
   - Check whether image resolution is too low (below 150 DPI — upscale first)

5. **Write the safety notes:**
   - Screenshots may contain private information — verify the source before processing
   - **Do not install or run without the owner's confirmation**

6. **Distill a skill card** into `agent-school/skills/tesseract-ocr.md`.

> ⚠️ **Safety boundary**: step 1's minimal test can be run in an already-installed environment to verify the pipeline; the batch script in step 2 **must have the owner's explicit confirmation before execution**.

---

## 🎓 Pass criteria

- [ ] You wrote a minimal verifiable script that generates a test image in code and runs OCR on it (English recognition part has no external file dependency)
- [ ] You wrote a complete preprocessing + batch recognition script
- [ ] You can explain the appropriate use cases for PSM 3, 6, and 7
- [ ] You know that Chinese recognition requires the chi_sim language pack to be installed
- [ ] Distilled 1 skill card into [`agent-school/skills/tesseract-ocr.md`](../../../skills/tesseract-ocr.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T23.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: OCR with Tesseract + pytesseract

- **When to use**: extract text from images, screenshots, or scanned documents (Chinese and English)
- **From**: Lesson T22 Tesseract OCR

## Steps
1. Install: system-level tesseract + chi_sim language pack; pip install pytesseract Pillow
2. Verify language pack: tesseract --list-langs (confirm chi_sim is present)
3. Preprocess: grayscale → upscale (if low resolution) → enhance contrast → binarize
4. Recognize: pytesseract.image_to_string(img, lang="chi_sim+eng", config="--psm 6")
5. With positions: pytesseract.image_to_data(..., output_type=Output.DATAFRAME)
6. Batch: iterate directory, wrap each image in try/except, log failures

## Verification
- Run recognition on a self-generated test image (code-created), confirm keywords appear in output
- Chinese characters appear in the output (not garbled)

## Notes
- Chinese recognition requires the chi_sim language pack installed
- PSM 3 = full page / PSM 6 = single block / PSM 7 = single line — wrong choice has a big impact
- Images below 150 DPI should be upscaled 2× before recognition
- Tesseract struggles with handwriting, artistic fonts, and severely skewed images — consider PaddleOCR for those
- Check tesseract --version before assuming it's installed
```
