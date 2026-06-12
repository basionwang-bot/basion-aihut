> 🌐 English ｜ [中文](../../tools/T21-imagemagick.md)

# Lesson T21 · ImageMagick: Batch Image Processing from the Command Line

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: ImageMagick official docs · [imagemagick.org/script/command-line-tools.php](https://imagemagick.org/script/command-line-tools.php) · [imagemagick.org/script/mogrify.php](https://imagemagick.org/script/mogrify.php)

---

## 📖 What you'll learn

After this lesson, you'll be able to use ImageMagick's command-line tools — mainly `convert` (single-file processing) and `mogrify` (batch in-place modification) — to handle nearly any image task from the terminal: format conversion, scaling, cropping, adding watermarks, rotation, compositing multiple images, adjusting brightness and contrast… one line, done.

Imagine you have a folder full of images and you want to convert all the PNGs to JPEG, scale them to 50%, and add a grey border. With Pillow (Lesson T20) you'd write a dozen lines of code. With ImageMagick you only need **one `mogrify` command** — it's like a Swiss Army knife for images, always on hand, with practically no image operation it can't handle.

ImageMagick was born in 1987, has been running on servers worldwide for 30+ years, and is one of the foundational tools in image processing (WordPress, Discourse, and many others call it in the background). The current stable version is ImageMagick 7.x.

**Official resources:**
- Official site: [imagemagick.org](https://imagemagick.org/)
- convert command reference: [imagemagick.org/script/convert.php](https://imagemagick.org/script/convert.php)
- mogrify command reference: [imagemagick.org/script/mogrify.php](https://imagemagick.org/script/mogrify.php)
- Full command-line options: [imagemagick.org/script/command-line-options.php](https://imagemagick.org/script/command-line-options.php)

---

## 🧠 Core principles (internalize these as habits)

1. **`convert` leaves the original file untouched; `mogrify` modifies it in place — know which one you're using.** `convert input.jpg output.png` writes the result to a new file, leaving the original alone. `mogrify -resize 50% *.jpg` **directly modifies** every jpg in the directory. Always back up or double-check before batch operations — don't destroy your originals.

2. **The order of options is the order of operations — different order, different result.** ImageMagick processes command-line options left to right, like stations on an assembly line. Scale then watermark, versus watermark then scale, produces a different watermark size in the output. Always keep this pipeline mental model in mind.

3. **Both `-resize` and `-thumbnail` scale images; the latter is faster but lower quality.** `-resize 800x600` scales while preserving aspect ratio. `-thumbnail 800x600` is optimized for thumbnails (aggressive downsampling followed by refinement) and is about twice as fast, but not suitable when high quality is needed.

4. **`%` means relative scaling; without `%` it means absolute pixels.** `-resize 50%` scales to half the original size. `-resize 800x600` sets a maximum bounding box in pixels (preserving aspect ratio, fitting the longer side). `-resize 800x600!` — the exclamation mark — forces an exact stretch to that size (ignoring aspect ratio).

5. **ImageMagick 7 uses the `magick` command; ImageMagick 6 uses `convert`.** The main command name depends on the installed version. Check with `magick -version`. If it's 7.x, prefer `magick convert` or just `magick`; if it's 6.x, use `convert`. Check the version in scripts before assuming which one to call.

---

## 🛠 How to do it

### Installation

ImageMagick is a system-level tool, not a Python package:

```bash
# macOS (Homebrew)
brew install imagemagick

# Ubuntu / Debian
sudo apt update && sudo apt install imagemagick

# CentOS / RHEL
sudo yum install ImageMagick

# Windows
# Download the installer from the official site:
# https://imagemagick.org/script/download.php#windows
# During installation, check "Add application directory to your system path"

# Verify installation (ImageMagick 7 uses magick; 6 uses convert)
magick -version
# or
convert -version
```

> ⚠️ **System-level installation — do not install or run without the owner's confirmation. Present the plan first.**
>
> Installing ImageMagick via Homebrew on macOS pulls in many dependencies (libjpeg, libpng, libwebp, etc.) and may take from a few minutes to half an hour. Ask the owner first whether it's already installed (`magick -version` succeeds if it is).

### Check version and capabilities

```bash
# Show version and supported formats
magick -version
magick -list format | grep -i "JPEG\|PNG\|WEBP"
```

### convert — single-file processing

```bash
# Format conversion: PNG to JPEG
magick convert input.png output.jpg

# Scale: proportional resize to 800px wide (height auto)
magick convert input.jpg -resize 800x output_800w.jpg

# Scale: proportional, longest side no more than 1200px
magick convert input.jpg -resize 1200x1200 output.jpg

# Force exact size 800×600 (ignores aspect ratio — will stretch)
magick convert input.jpg -resize 800x600! output.jpg

# Center-crop to a square (scale first, then crop)
magick convert input.jpg -resize 800x800^ -gravity center -extent 800x800 output_square.jpg
#   ^ means: scale so the short side equals 800 (the other side may exceed 800),
#   then -extent crops to the exact 800x800 bounding box, centered

# Rotation (auto-orient by EXIF with -auto-orient)
magick convert input.jpg -rotate 90 output_rotated.jpg
magick convert input.jpg -auto-orient output_corrected.jpg

# Adjust quality (JPEG compression; 85 is a common sweet spot)
magick convert input.jpg -quality 85 output_compressed.jpg

# Add text watermark (bottom-right corner)
magick convert input.jpg \
  -gravity SouthEast \
  -fill "rgba(255,255,255,0.6)" \
  -pointsize 24 \
  -annotate +20+20 "© BrandName" \
  output_watermark.jpg

# Composite image watermark (overlay logo in bottom-right)
magick convert input.jpg logo.png \
  -gravity SouthEast -geometry +20+20 \
  -composite output_logo.jpg

# Convert to grayscale
magick convert input.jpg -colorspace Gray output_gray.jpg

# Adjust brightness/contrast (range -100 to +100)
magick convert input.jpg -brightness-contrast 10x15 output_adjusted.jpg
```

### mogrify — batch in-place processing

```bash
# ⚠️ mogrify modifies original files directly — back up before batch operations!

# Batch format conversion: convert all PNGs in the current directory to JPEG
# (original PNGs are kept; same-named .jpg files are created)
magick mogrify -format jpg *.png

# Batch scale: resize all jpg files to 800px wide
magick mogrify -resize 800x *.jpg

# Batch watermark with output to a subdirectory
# (use -path to specify output dir — originals are NOT modified!)
mkdir -p output
magick mogrify -path output -resize 800x -quality 85 *.jpg
#   ✅ Adding -path output keeps originals safe — always use this

# Batch convert to WebP and save to output/
magick mogrify -path output -format webp -quality 85 *.jpg
```

### Calling ImageMagick from Python (subprocess)

```python
import subprocess
import os

def imagemagick_resize(src: str, dst: str, max_side: int = 1200, quality: int = 85) -> bool:
    """Scale and save an image using ImageMagick."""
    cmd = [
        "magick", "convert", src,
        "-resize", f"{max_side}x{max_side}",
        "-quality", str(quality),
        dst
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return False
    return os.path.exists(dst)

def batch_mogrify(input_dir: str, output_dir: str,
                  max_side: int = 1200, quality: int = 85):
    """Batch-process all JPEG files in a directory."""
    os.makedirs(output_dir, exist_ok=True)
    cmd = [
        "magick", "mogrify",
        "-path", output_dir,
        "-resize", f"{max_side}x{max_side}",
        "-quality", str(quality),
        os.path.join(input_dir, "*.jpg")
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0
```

### Common options quick reference

| Option | Meaning |
|--------|---------|
| `-resize 800x` | Proportional scale, width 800 |
| `-resize x600` | Proportional scale, height 600 |
| `-resize 800x600` | Proportional scale, longest side ≤ 800×600 |
| `-resize 800x600!` | Force stretch to exact 800×600 |
| `-resize 800x800^` | Short side scaled to 800 (may overflow) |
| `-gravity Center` | Anchor point: center |
| `-gravity SouthEast` | Anchor point: bottom-right |
| `-extent WxH` | Crop/extend canvas to specified size |
| `-quality N` | JPEG/WebP quality (1–95) |
| `-format webp` | mogrify output format |
| `-path dir` | mogrify output directory (does not modify originals) |
| `-annotate +x+y "text"` | Write text at the given offset |
| `-composite` | Composite two images (overlay a watermark image) |
| `-auto-orient` | Auto-rotate according to EXIF |
| `-colorspace Gray` | Convert to grayscale |
| `-strip` | Remove EXIF and other metadata (reduces file size) |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "batch image standardization" command-line plan.**

Scenario: the owner has a batch of photos (mixed JPEG/PNG) and needs: ① scale so the longest side is 1200px; ② strip EXIF privacy data; ③ convert to JPEG (quality=88); ④ add the text watermark "© basion 2026" in the bottom-right corner; ⑤ output to `output/` without modifying the originals.

You need to complete:

1. **Write the complete command plan:**
   - One `mogrify` command to batch-process all JPEG files (use `-path output` to protect originals)
   - A `convert` + `mogrify` combination command for PNG files
   - The full parameters for the watermark operation

2. **Write an equivalent Python subprocess script:**
   - Iterate the directory, handle JPEG and PNG separately
   - Build and execute a `magick convert` command for each file
   - Log successes and failures

3. **Write the acceptance criteria:**
   - Use `magick identify output/*.jpg` to verify dimensions (longest side ≤ 1200)
   - Use `magick identify -verbose output/xxx.jpg | grep -i exif` to confirm EXIF has been stripped

4. **Write the decision logic for convert vs. mogrify:** explain clearly when to use each one

5. **Write the safety notes:**
   - `mogrify` without `-path` overwrites originals — dangerous
   - **Do not install or run without the owner's confirmation**

6. **Distill a skill card** into `agent-school/skills/imagemagick-batch.md`.

> ⚠️ **Safety boundary**: the graduation test for this lesson is about **producing a plan**, not actually running it. Actual command and script execution **must have the owner's explicit confirmation before you proceed**.

---

## 🎓 Pass criteria

- [ ] You wrote a complete `mogrify -path` batch command (including scale, strip EXIF, watermark, format conversion)
- [ ] You can explain the core difference between `convert` and `mogrify` and when to use each
- [ ] You know the center-crop technique using `-resize 800x800^` combined with `-extent 800x800`
- [ ] You wrote a Python subprocess wrapper
- [ ] Distilled 1 skill card into [`agent-school/skills/imagemagick-batch.md`](../../../skills/imagemagick-batch.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T22.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: batch image processing with ImageMagick from the command line

- **When to use**: when you need a single command to batch-process large numbers of images (scale/crop/watermark/convert)
- **From**: Lesson T21 ImageMagick

## Steps
1. Verify installation: magick -version (or convert -version)
2. Single file: magick convert input [options] output
3. Batch (without modifying originals): magick mogrify -path output_dir [options] *.jpg
4. Center-crop to a square: -resize NxN^ -gravity center -extent NxN
5. Add text watermark: -gravity SouthEast -fill "rgba(255,255,255,0.6)" -pointsize 24 -annotate +20+20 "text"
6. Strip metadata: -strip
7. Call from Python: subprocess.run(["magick", "convert", ...])

## Verification
- magick identify output/*.jpg to check dimensions and format
- returncode == 0 and output directory is non-empty

## Notes
- mogrify without -path overwrites originals — always add -path to specify an output directory
- ImageMagick 7 uses the magick command; version 6 uses convert/mogrify
- Option order = pipeline order; different order produces different results
- Check magick -version before assuming it's installed
```
