> 🌐 English ｜ [中文](../../tools/T17-ffmpeg.md)

# Lesson T17 · ffmpeg: Transcoding, Trimming, and Audio Extraction (Command Line)

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: FFmpeg official docs · [ffmpeg.org/documentation.html](https://ffmpeg.org/documentation.html) · [ffmpeg.org/ffmpeg.html](https://ffmpeg.org/ffmpeg.html)

---

## 📖 What you'll learn

After this lesson, you'll be able to use the ffmpeg command line to handle the most common video/audio processing tasks: converting a video from one format to another, trimming a clip, extracting the audio track as an MP3, compressing video file size — all from the terminal, no GUI, no editing software.

Picture ffmpeg as a **universal video-processing machine**: you feed it an MP4, tell it "clip from 1:30 to 2:20, scale it down to 720p, and save the audio separately" — the machine hums, and three files come out. No windows to click through, no mouse — just one command in the terminal.

FFmpeg is the genuine underlying tool of the film/streaming industry. The server backends at Bilibili, Douyin, and YouTube all run on it. It is open-source, free, and handles almost anything — the agent's weapon of choice for media files.

**Official resources:**
- Homepage: [ffmpeg.org](https://ffmpeg.org/)
- Full docs: [ffmpeg.org/documentation.html](https://ffmpeg.org/documentation.html)
- ffmpeg command reference: [ffmpeg.org/ffmpeg.html](https://ffmpeg.org/ffmpeg.html)
- Codec docs: [ffmpeg.org/ffmpeg-codecs.html](https://ffmpeg.org/ffmpeg-codecs.html)

---

## 🧠 Core principles (internalize these as habits)

1. **Every ffmpeg command has the same three-part skeleton: `input → options → output`.** `ffmpeg -i input_file [options] output_file` — memorize this formula and everything else is just filling in the options slot.

2. **Use `-c copy` to cut without re-encoding whenever you can.** Re-encoding takes time and loses quality. If you just want to trim a segment without touching quality, `-c copy` duplicates the stream directly — the same cut operation can be 20× faster.

3. **Specify time as `HH:MM:SS` or seconds — don't mix them up.** `-ss 00:01:30` and `-ss 90` are the same thing: jump to the 90-second mark. Remember the difference between `-ss` (start point), `-t` (duration), and `-to` (end point).

4. **`-y` silently overwrites; `-n` silently skips.** For batch processing, add `-y` so ffmpeg doesn't stop to ask "overwrite?"; `-n` means "skip if output already exists." Don't add either in interactive situations — let the user see the prompts.

5. **Use `ffprobe` to inspect the source file first.** Before processing any file, run `ffprobe -v quiet -print_format json -show_streams input_file` to see how many video streams and audio tracks it has, and what codecs are used — otherwise you might end up with a silent video or a black screen.

---

## 🛠 How to do it

### Installation

FFmpeg is a system-level binary, not a Python package. Installation varies by OS:

```bash
# macOS (via Homebrew)
brew install ffmpeg

# Ubuntu / Debian (Linux)
sudo apt update && sudo apt install ffmpeg

# Windows
# Download the Release Full build from https://www.gyan.dev/ffmpeg/builds/
# Unzip and add the bin/ directory to your system PATH

# Verify installation
ffmpeg -version
```

> ⚠️ **System-level installation — do not install or run without the user's confirmation. Give the plan first, execute after the user says yes.** If the user's network is slow, ask first whether ffmpeg is already installed (`ffmpeg -version` works if it is).

### Inspect a file

```bash
# See video details (stream info, duration, codec format)
ffprobe -v quiet -print_format json -show_streams input.mp4

# Concise human-readable version
ffprobe -hide_banner input.mp4
```

### The 6 most common scenarios

```bash
# 1. Format conversion: MP4 to MKV (no re-encoding, stream copy)
ffmpeg -i input.mp4 -c copy output.mkv

# 2. Format conversion: re-encode to H.264 (best compatibility)
ffmpeg -i input.avi -c:v libx264 -c:a aac -crf 23 output.mp4
#   -crf 23: quality setting, lower = better (18–28 is the typical range)

# 3. Trim a clip: extract 1:30–2:20 (50 seconds)
ffmpeg -ss 00:01:30 -to 00:02:20 -i input.mp4 -c copy clip.mp4
#   Note: -ss before -i = fast seek (acceptable frame accuracy)

# 4. Extract audio: save as MP3
ffmpeg -i input.mp4 -q:a 0 -map a output.mp3
#   -q:a 0: highest-quality variable bitrate  -map a: audio stream only

# 5. Compress video: scale to 720p + reduce bitrate
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -c:a aac output_720p.mp4

# 6. Batch transcode (shell loop): convert all .avi files in a directory to .mp4
for f in *.avi; do
    ffmpeg -i "$f" -c:v libx264 -crf 23 -c:a aac "${f%.avi}.mp4"
done
```

### Common options quick reference

| Option | Meaning |
|--------|---------|
| `-i file` | Input file |
| `-c copy` | Copy streams directly, no re-encoding |
| `-c:v libx264` | Video codec: H.264 |
| `-c:a aac` | Audio codec: AAC |
| `-crf N` | Quality (18=high / 28=low; default 23) |
| `-ss time` | Start time |
| `-to time` | End time |
| `-t seconds` | Duration |
| `-vf scale=W:H` | Scale resolution |
| `-map a` | Audio stream only |
| `-map v` | Video stream only |
| `-y` | Silently overwrite output file |
| `-n` | Skip if output file already exists |
| `-hide_banner` | Suppress version info output |

### Calling ffmpeg from Python (subprocess)

```python
import subprocess, os

def extract_audio(input_path: str, output_path: str) -> bool:
    """Extract audio from a video file; returns True on success."""
    cmd = [
        "ffmpeg", "-hide_banner", "-y",
        "-i", input_path,
        "-q:a", "0", "-map", "a",
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("Error:", result.stderr)
        return False
    return os.path.exists(output_path)

# Example (run only after confirming with the user)
# success = extract_audio("lecture.mp4", "output/lecture_audio.mp3")
# print("Success" if success else "Failed")
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "batch video processing" plan (including commands + a Python subprocess wrapper).**

Scenario: the user has a batch of lecture recordings (assume `.mp4` format) and needs: ① skip the first 10 seconds of intro from each video; ② extract the audio track as `.mp3`; ③ also produce a 720p compressed version. Provide a complete processing plan — do not execute it yourself.

You need to complete:

1. **Write the ffmpeg command for each subtask:**
   - Skip the intro (skip the first 10 seconds, keep everything after)
   - Extract audio as MP3
   - Compress to 720p

2. **Write a Python script** that wraps the three commands above using `subprocess`, takes a directory as input, and batch-processes all `.mp4` files in it, writing output to an `output/` subdirectory.

3. **Write the acceptance criteria:**
   - Each `.mp4` produces 3 output files (trimmed version, MP3, 720p)
   - Use `ffprobe` to verify the output file duration is approximately (original duration − 10 seconds)
   - Use `ffprobe` to verify the MP3 file contains an audio stream

4. **Write the safety notes:**
   - ffmpeg is a system-level tool — check `ffmpeg -version` before assuming it's installed
   - **Do not install or run without the user's confirmation**
   - Before processing videos, confirm that the source files are owned by the user or properly licensed — only process the user's own videos or content they have rights to

5. **Write the error troubleshooting guide:** what causes `No such file` / `Invalid data found` / `Output file already exists`, and how to fix each.

6. **Distill a skill card** into `agent-school/skills/ffmpeg-video.md`.

---

## 🎓 Pass criteria

- [ ] You wrote three ffmpeg commands (trim / extract audio / compress) and can explain every parameter
- [ ] You wrote a complete Python subprocess wrapper script (batch-processes a directory)
- [ ] You can explain the difference between `-c copy` and re-encoding, and when to use each
- [ ] You know the difference between placing `-ss` before vs. after `-i` (fast seek vs. frame-accurate seek)
- [ ] Distilled 1 skill card into [`agent-school/skills/ffmpeg-video.md`](../../../skills/ffmpeg-video.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T18.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: processing video/audio with ffmpeg

- **When to use**: when you need to transcode, trim, extract audio, or compress video
- **From**: Lesson T17 ffmpeg

## Steps
1. Verify installation: ffmpeg -version (if missing, ask the user before installing)
2. Inspect source file: ffprobe -hide_banner input.mp4
3. Choose command as needed:
   - Trim (fast, may not be frame-accurate): -ss start -to end -i in -c copy out
   - Transcode: ffmpeg -i in -c:v libx264 -crf 23 -c:a aac out.mp4
   - Extract audio: ffmpeg -i in -q:a 0 -map a out.mp3
   - Compress + scale: ffmpeg -i in -vf scale=1280:720 -c:v libx264 -crf 28 out.mp4
4. Python call: subprocess.run(cmd, capture_output=True)

## Verification
- Use ffprobe to check output file duration / codec / stream info
- returncode == 0 and output file exists and is > 0 bytes

## Notes
- -c copy skips re-encoding (fast, no quality loss); re-encoding requires -c:v libx264
- -ss before -i: fast seek (may be imprecise but fast); after -i: frame-accurate (slow)
- System-level installation requires user confirmation; confirm rights before processing others' videos
```
