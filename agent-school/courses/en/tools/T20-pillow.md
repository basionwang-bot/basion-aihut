> 🌐 English ｜ [中文](../../tools/T20-pillow.md)

# Lesson T20 · Pillow: Batch Image Processing

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: Pillow official docs · [pillow.readthedocs.io](https://pillow.readthedocs.io/en/stable/) · [github.com/python-pillow/Pillow](https://github.com/python-pillow/Pillow)

---

## 📖 What you'll learn

After this lesson, you'll be able to use Pillow to batch-process images: crop them to a uniform size, add watermarks in bulk, compress file sizes, and convert between formats — hundreds of images in one go, without opening any image editor.

Imagine you're running an e-commerce store with 200 product photos. Each one needs to be cropped to an 800×800 square, branded with a watermark in the bottom-right corner, and compressed to under 200 KB before you can upload. Doing it in Photoshop one by one would take four hours. Write a Pillow script instead, and all 200 images are done before your tea goes cold — **Pillow is your automated image assembly line**.

Pillow is Python's most mainstream image-processing library (the actively maintained fork of PIL). It supports 30+ image formats and offers the most complete feature set and ecosystem of any pure-Python solution. As of 2025, the stable release is Pillow 11.x, which requires Python ≥ 3.9.

**Official resources:**
- Official docs: [pillow.readthedocs.io/en/stable/](https://pillow.readthedocs.io/en/stable/)
- API reference: [pillow.readthedocs.io/en/stable/reference/](https://pillow.readthedocs.io/en/stable/reference/)
- GitHub repo: [github.com/python-pillow/Pillow](https://github.com/python-pillow/Pillow)
- PyPI page: [pypi.org/project/Pillow](https://pypi.org/project/Pillow/)

---

## 🧠 Core principles (internalize these as habits)

1. **An Image object is a canvas in memory — operations don't touch the original file until you call `.save()`.** Opening an image gives you an in-memory canvas. You can crop, filter, and resize it all you like — the original file on disk won't change by a single byte. Only `.save()` writes the result to disk. In batch processing, always keep the output path **separate** from the input path so you don't overwrite originals.

2. **Inspect before you modify: use `.size`, `.mode`, and `.format` to know what you're working with.** Different images can be RGB, RGBA (with transparency), or grayscale (L) mode. Before saving as JPEG you must convert RGBA to RGB first — otherwise you'll get an error. Think of it like this: you can't print a transparent overlay directly onto plain white paper; you have to lay down a white background first.

3. **The `quality` parameter controls compression — it's not a guess.** For JPEG, the `quality` range is 1–95 (not 100 — 95 is the practical maximum). 85 is the sweet spot between visual quality and file size. WebP compresses even better: the same perceived quality is 25–35% smaller than JPEG.

4. **Use `thumbnail` to scale proportionally, `resize` to force exact dimensions.** `thumbnail((800, 800))` means "scale down proportionally to fit within 800×800 without stretching"; `resize((800, 800))` means "force the image to exactly 800×800 regardless of aspect ratio." Confuse the two and your images will be distorted.

5. **Wrap each image in a try-except during batch processing — one bad file shouldn't kill the whole batch.** Real-world jobs always contain a few corrupted or wrong-format files. Wrap each image's processing in `try/except`, log the failed filenames, and keep running. Don't let one bad apple ruin the whole basket.

---

## 🛠 How to do it

### Installation

```bash
pip install Pillow

# Verify installation
python -c "from PIL import Image; print(Image.__version__)"
```

> ⚠️ **Do not install or run without the owner's confirmation — present the plan first.**

### Minimal runnable example

```python
from PIL import Image

# Open an image
img = Image.open("photo.jpg")
print(f"Size: {img.size}, Mode: {img.mode}, Format: {img.format}")

# Proportional scale (longest side no more than 800)
img.thumbnail((800, 800), Image.LANCZOS)

# Save (quality=85 is the sweet spot for JPEG)
img.save("output/photo_small.jpg", quality=85, optimize=True)
print("Done!")
```

### The 4 most common operations

```python
from PIL import Image, ImageDraw, ImageFont
import os

# ── Operation 1: Crop ──
# crop() takes a (left, upper, right, lower) tuple; origin is top-left
def crop_center(img: Image.Image, size: tuple) -> Image.Image:
    """Center-crop to a specific square size."""
    w, h = img.size
    target = min(w, h, size[0])
    left = (w - target) // 2
    top = (h - target) // 2
    return img.crop((left, top, left + target, top + target)).resize(size, Image.LANCZOS)

# ── Operation 2: Add text watermark ──
def add_text_watermark(img: Image.Image, text: str, opacity: int = 128) -> Image.Image:
    """Add a semi-transparent text watermark in the bottom-right corner."""
    # Convert to RGBA to support transparency
    img = img.convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Position: bottom-right with 20px margin
    w, h = img.size
    # Note: without a specified font the default is used;
    # for non-ASCII text pass the path to a .ttf font file
    draw.text((w - 150, h - 40), text, fill=(255, 255, 255, opacity))
    result = Image.alpha_composite(img, overlay)
    return result.convert("RGB")  # convert back to RGB for JPEG saving

# ── Operation 3: Format conversion ──
def convert_format(src: str, dst_format: str = "webp") -> str:
    """Convert an image to the target format; returns the new file path."""
    img = Image.open(src)
    if img.mode == "RGBA" and dst_format.lower() == "jpeg":
        img = img.convert("RGB")  # JPEG does not support transparency
    base = os.path.splitext(src)[0]
    dst = f"{base}.{dst_format}"
    img.save(dst, quality=85, optimize=True)
    return dst

# ── Operation 4: Batch compress a directory ──
def batch_compress(input_dir: str, output_dir: str,
                   max_side: int = 1200, quality: int = 85):
    """Batch-compress all JPEG/PNG files in a directory into output_dir."""
    os.makedirs(output_dir, exist_ok=True)
    ok, fail = 0, []
    for fname in os.listdir(input_dir):
        if not fname.lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        src = os.path.join(input_dir, fname)
        dst = os.path.join(output_dir, fname)
        try:
            with Image.open(src) as img:
                if img.mode == "RGBA":
                    img = img.convert("RGB")
                img.thumbnail((max_side, max_side), Image.LANCZOS)
                img.save(dst, quality=quality, optimize=True)
            ok += 1
        except Exception as e:
            fail.append((fname, str(e)))
    print(f"Done: {ok} succeeded, {len(fail)} failed: {fail}")
```

### Common operations quick reference

| What you want | Code |
|---------------|------|
| Open an image | `img = Image.open("a.jpg")` |
| Get dimensions | `img.size` → `(width, height)` |
| Proportional scale | `img.thumbnail((800, 800), Image.LANCZOS)` |
| Force resize | `img.resize((800, 800), Image.LANCZOS)` |
| Crop | `img.crop((left, top, right, bottom))` |
| Rotate | `img.rotate(90, expand=True)` |
| Flip horizontal | `img.transpose(Image.FLIP_LEFT_RIGHT)` |
| Convert to grayscale | `img.convert("L")` |
| Convert to RGB | `img.convert("RGB")` |
| Save as JPEG | `img.save("out.jpg", quality=85, optimize=True)` |
| Save as WebP | `img.save("out.webp", quality=85)` |
| Get pixel value | `img.getpixel((x, y))` |

### Notes on non-ASCII text watermarks

```python
# Pillow's default font does not include all character sets.
# For non-ASCII text you need to specify a system font file.
# macOS:
font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", size=24)
# Ubuntu:
font = ImageFont.truetype("/usr/share/fonts/truetype/wqy/wqy-microhei.ttc", size=24)
# Windows:
font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", size=24)

draw.text((x, y), "Watermark text", font=font, fill=(255, 255, 255, 180))
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "e-commerce image batch processing" plan.**

Scenario: the owner has a batch of product images (mixed JPEG/PNG) in an `images/` directory and needs: ① crop each image to an 800×800 center square; ② add a "© BrandName" text watermark in the bottom-right corner; ③ compress at quality=85 and convert to JPEG; ④ output to an `output/` directory.

You need to complete:

1. **Write a complete Python script** that:
   - Iterates over all JPEG/PNG files in `images/`
   - Center-crops to 800×800
   - Adds the bottom-right text watermark
   - Saves as JPEG (quality=85) into `output/`
   - Handles RGBA images (convert to RGB before saving)
   - Wraps each image in try/except and logs failures to `output/failed.txt`

2. **Write the acceptance criteria:**
   - Every `.jpg` in `output/` has dimensions 800×800 (verified with `Image.open().size`)
   - File sizes are reduced (compression is working)
   - `failed.txt` exists (even if empty), confirming the script ran to completion

3. **Write the font configuration for non-ASCII watermarks** (one command or path per operating system, for three systems)

4. **Write the safety notes:**
   - Keep output and input directories separate — never overwrite the originals
   - **Do not install or run without the owner's confirmation**
   - Confirm authorization before processing copyrighted images

5. **Distill a skill card** into `agent-school/skills/pillow-image.md`.

> ⚠️ **Safety boundary**: the graduation test for this lesson is about **producing a plan**, not actually running it. Script execution **must have the owner's explicit confirmation before you proceed**.

---

## 🎓 Pass criteria

- [ ] You wrote a complete batch-processing script (crop + watermark + compress + format conversion)
- [ ] You can explain the difference between `thumbnail` and `resize`
- [ ] You know why you must `convert("RGB")` before saving an RGBA image as JPEG
- [ ] You provided font configuration for non-ASCII watermarks on three operating systems
- [ ] Distilled 1 skill card into [`agent-school/skills/pillow-image.md`](../../../skills/pillow-image.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T21.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: batch image processing with Pillow

- **When to use**: batch crop, watermark, compress, or convert image formats
- **From**: Lesson T20 Pillow

## Steps
1. Install: pip install Pillow
2. Open: img = Image.open(path)
3. Inspect: img.size / img.mode / img.format
4. RGBA→RGB conversion (required before saving as JPEG): img.convert("RGB")
5. Proportional scale: img.thumbnail((max_side, max_side), Image.LANCZOS)
6. Center crop: img.crop((left, top, right, bottom))
7. Add watermark: ImageDraw.Draw(overlay).text(...) + alpha_composite
8. Save: img.save(dst, quality=85, optimize=True)
9. In batch: wrap each image in try/except, log failures

## Verification
- Image.open(output).size equals the target dimensions
- Output file size is smaller than the original (compression working)

## Notes
- Keep output and input directories separate — never overwrite originals
- Non-ASCII watermarks require specifying a system .ttf font file path
- JPEG quality: the meaningful upper limit is 95, not 100
- WebP is more space-efficient than JPEG and is supported by all modern browsers
```
