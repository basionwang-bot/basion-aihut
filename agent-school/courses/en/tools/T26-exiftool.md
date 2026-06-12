> 🌐 English ｜ [中文](../../tools/T26-exiftool.md)

# Lesson T26 · exiftool: Reading and Writing File Metadata

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: exiftool official docs · [exiftool.org](https://exiftool.org/) · [exiftool.org/faq.html](https://exiftool.org/faq.html) · [github.com/exiftool/exiftool](https://github.com/exiftool/exiftool)

---

## 📖 What you'll learn

After this lesson, you'll be able to read all the hidden secrets stored in a photo — the time it was taken, the phone model, **the exact GPS coordinates** — and also wipe that information clean before sharing the image, to protect your privacy.

Think of every photo as a letter. Inside the envelope, alongside the image you can see, there's a **small slip of paper** — densely packed with notes: when the photo was taken, which phone, what aperture and shutter speed, and **the precise location where you were standing**. This slip of paper is called "metadata" and ordinary viewers can't see it, but any program that understands the file format can read it in an instant.

exiftool is the tool specifically designed to **read, write, and erase that slip of paper**. Whether it's a photo (JPEG, PNG, RAW), a video (MP4, MOV), or a PDF, exiftool can open it up, make changes, and seal it back. As a privacy habit: run one command to strip GPS data before sharing a photo.

exiftool is developed by Phil Harvey, written in Perl, and is the most authoritative open-source tool in the metadata domain. It supports 200+ file formats.

**Official resources:**
- Official site: [exiftool.org](https://exiftool.org/)
- Installation guide: [exiftool.org/install.html](https://exiftool.org/install.html)
- FAQ: [exiftool.org/faq.html](https://exiftool.org/faq.html)
- GitHub repo: [github.com/exiftool/exiftool](https://github.com/exiftool/exiftool)

---

## 🧠 Core principles

1. **Reading doesn't change the file — writing does.** Running `exiftool photo.jpg` on its own only reads the information; it does not touch the original file. Only operations with `-TagName=value` or `-all=` are writes. **Read first to understand what's there, then write.**

2. **exiftool automatically backs up the original file on any write operation.** After a write, it renames the original file to `photo.jpg_original`. This is a safety mechanism — if something goes wrong, the original is still there. Once you've confirmed the result looks right, delete the backup manually.

3. **"Clear all metadata" does not mean "delete the content."** The `-all=` command only strips metadata tags. The image pixels and video frames are completely unaffected — use it freely.

4. **GPS data is the most sensitive.** Photos taken with a phone almost always carry GPS coordinates (sometimes accurate to within a few meters). Before posting to social media, strip the GPS data with `-GPS*=` specifically. That's the principle of least disclosure — remove only what's sensitive, leave other useful camera parameters intact.

5. **Before batch operations, run a read-only pass to verify the scope.** exiftool has no built-in dry-run flag, but you can use a plain read command to verify "which files will be affected." Confirm the scope is correct, then run the write command.

---

## 🛠 How to do it

### Installation

> ⚠️ **Installation note: the commands below involve system-level software installation. Do not install or run without the owner's confirmation — present the plan first.**

```bash
# macOS (Homebrew)
brew install exiftool

# Linux (Debian/Ubuntu)
sudo apt install libimage-exiftool-perl

# Windows (Chocolatey)
choco install exiftool

# You can also download a standalone executable from the official site:
# https://exiftool.org/install.html
# Windows users: download exiftool(-k).exe, rename to exiftool.exe, place in PATH
```

> Both `apt` and `brew` installs work without a VPN. You can also download from [exiftool.org](https://exiftool.org/) — the file is small (<5 MB) and generally downloads fine without special network access.

### Minimal runnable example (read-only — does not modify files)

**View all metadata in an image:**
```bash
exiftool photo.jpg
# Output is long — includes Make, Model, GPS, DateTime, and dozens more fields
```

**View only GPS-related fields:**
```bash
exiftool -GPS* photo.jpg
# Example output:
# GPS Latitude  : 39 deg 54' 27.60" N
# GPS Longitude : 116 deg 23' 17.40" E
# GPS Altitude  : 50 m Above Sea Level
```

**View a few specific fields:**
```bash
exiftool -Make -Model -DateTimeOriginal -ImageSize photo.jpg
# Example output:
# Make              : Apple
# Model             : iPhone 15 Pro
# Date/Time Original: 2026:05:20 14:33:01
# Image Size        : 4032x3024
```

### Write operations: removing private metadata

**Strip all GPS data (essential before sharing photos):**
```bash
# Remove only GPS fields, keep everything else
exiftool -GPS*= photo.jpg
# Creates photo.jpg_original (backup of the original)
# Once confirmed, delete the backup:
rm photo.jpg_original
```

**Nuclear option: clear all metadata:**
```bash
exiftool -all= photo.jpg
# All tags stripped — only pixel data remains
```

**Batch strip GPS from all jpg files in a folder:**
```bash
exiftool -GPS*= /path/to/photos/*.jpg
# Each file gets a _original backup
```

**Modify/overwrite a field (e.g., change the capture timestamp):**
```bash
exiftool -DateTimeOriginal="2026:01:01 00:00:00" photo.jpg
```

### Common command quick reference

| What you want | Command |
|---------------|---------|
| Read all metadata | `exiftool file.jpg` |
| Read only GPS | `exiftool -GPS* file.jpg` |
| Read specific fields | `exiftool -Make -Model file.jpg` |
| Strip GPS | `exiftool -GPS*= file.jpg` |
| Strip all metadata | `exiftool -all= file.jpg` |
| Strip then delete backup | `rm file.jpg_original` |
| Modify a field | `exiftool -Author="Jane Smith" file.jpg` |
| Batch process a folder | `exiftool -GPS*= /path/to/dir/` |
| Output as JSON | `exiftool -json file.jpg` |
| Skip creating backup | `exiftool -overwrite_original -GPS*= file.jpg` |
| Check version | `exiftool -ver` |

### Privacy checklist (run through this before sharing a photo)

```bash
# Step 1: read — check for sensitive information
exiftool -GPS* -Make -Model -SerialNumber photo.jpg

# If GPS is present → strip it
exiftool -GPS*= photo.jpg

# If a serial number is present (some cameras include this) → strip if needed
exiftool -SerialNumber= photo.jpg

# Verify the strip worked
exiftool -GPS* photo.jpg
# Expected output: empty (no GPS fields at all)
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: complete the full privacy protection workflow on a photo — read metadata, strip GPS, verify the result.**

If you don't have a photo with GPS data handy, use the following to generate a test file with embedded metadata:

```bash
# Option A: if exiftool is already installed and you have any JPEG, use it directly
# Option B: write fake GPS data into a file with exiftool (requires exiftool installed)
# Find any jpg (even a system image will do)
cp /usr/share/pixmaps/debian-logo.png /tmp/test_photo.png 2>/dev/null || \
  curl -s -o /tmp/test_photo.jpg "https://httpbin.org/image/jpeg"

# Write fake GPS (simulating coordinates for a well-known landmark)
exiftool -GPSLatitude=39.9087 -GPSLatitudeRef=N \
          -GPSLongitude=116.3975 -GPSLongitudeRef=E \
          /tmp/test_photo.jpg
```

Complete the following 3 tasks and include the real commands + output:

**Task 1: Read metadata — confirm GPS is present**
```bash
exiftool -GPS* /tmp/test_photo.jpg
# Expected output: shows GPSLatitude and GPSLongitude fields
```

**Task 2: Strip GPS data**
```bash
exiftool -GPS*= /tmp/test_photo.jpg
# Expected output: 1 image files updated
```

**Task 3: Verify GPS has been removed**
```bash
exiftool -GPS* /tmp/test_photo.jpg
# Expected output: empty (no output at all) — GPS data is completely gone
```

**Acceptance criteria:**
- Task 1 output includes at least `GPS Latitude` and `GPS Longitude` fields
- Task 2 output shows `1 image files updated`
- Task 3 output is empty (no GPS fields)
- A `_original` backup file exists in the same directory

**Distill a skill card** with the privacy checklist and common command quick reference into `skills/exiftool.md`.

> ⚠️ **Safety boundary**: exiftool only operates on local files and does not access the network — it is very safe to use. However, be aware: **write operations modify files**. Even though exiftool automatically backs up originals, stripping metadata is effectively irreversible once the backup is deleted. **Before batch operations, always confirm the file scope first with a read-only pass, or run a single-file test before processing the full batch.** Installation requires the owner's confirmation first.

---

## 🎓 Pass criteria

- [ ] You can read the GPS information from an image (or prove it has none)
- [ ] You used `-GPS*=` to successfully strip GPS fields and included the real "1 image files updated" output as evidence
- [ ] You verified that GPS fields are empty after stripping
- [ ] You can explain the purpose of the `_original` backup file
- [ ] You know the meaning and risk of `-overwrite_original`
- [ ] Distilled 1 skill card into [`skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T27.
