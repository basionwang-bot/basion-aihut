> 🌐 English ｜ [中文](../../media/M02-faster-whisper.md)

# Lesson M02 · faster-whisper: Auto-Generate Timestamped Subtitles

> **Student: You, the AI agent currently enrolled** ｜ Prerequisites: J01–J07 foundations ｜ Difficulty: ★★☆ ｜ Source: [github.com/SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)

---

## 📖 What You Will Learn

After this lesson, you can help your owner take any audio or video — interview recordings, course lectures, podcast episodes, meeting recordings — and automatically convert them into **an SRT subtitle file with precise timestamps**.

Here's an analogy: imagine you're a stenographer working alongside your owner. The old way meant listening to a recording, typing everything out, and manually noting timestamps — an hour of audio could eat up half a workday. With the tool from this lesson, the workflow becomes: drop in the audio file, and a few minutes later you have a ready-to-use SRT subtitle file — each line of text has a precise timestamp, importable directly into any editing software or ready for publishing.

The tool is called **faster-whisper**. It's a complete reimplementation of OpenAI's famous Whisper speech-recognition model, running 4× faster at half the memory — same engine, much more fuel-efficient chassis.

**Official resources:**
- Project repo: [github.com/SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)
- PyPI: [pypi.org/project/faster-whisper/](https://pypi.org/project/faster-whisper/)

---

## 🧠 Core Principles

1. **Larger model = more accurate, but slower and more memory-hungry.** faster-whisper offers several model sizes: `turbo` (balanced, recommended default), `large-v3` (most accurate, requires GPU), `distil-large-v3` (distilled/compressed, fast), `small` (lightweight, runs on CPU). Think of it like cameras: higher resolution gives you sharper images, but bigger file sizes — pick based on your owner's hardware and needs.

2. **The model downloads automatically on first run.** Models are hosted on HuggingFace Hub and are fetched automatically when first loaded. `turbo` is around 800 MB; `large-v3` is around 3 GB. Plan accordingly for disk space and bandwidth.

3. **Timestamps are what make subtitles usable.** The `word_timestamps=True` parameter gives you per-word timing — essential for "karaoke-style" word-by-word highlighting. Default sentence-level timestamps are sufficient for most use cases.

4. **VAD filtering makes transcriptions cleaner.** Setting `vad_filter=True` runs Voice Activity Detection first, stripping out silent or noisy segments before sending audio to the model. For recordings with background noise, this makes a noticeable difference.

5. **SRT is the universal subtitle language.** SRT files import directly into Premiere, DaVinci Resolve, CapCut, Arctime — every major editing tool understands this format.

---

## 🛠 How to Do It

### Installation

> ⚠️ **Ask your owner for confirmation before installing.**

```bash
# Requires Python 3.9+
pip install faster-whisper
```

**GPU users — additional dependencies (CUDA 12):**
```bash
pip install nvidia-cublas-cu12 nvidia-cudnn-cu12
```

---

### Python API — Generating SRT Subtitles

```python
from faster_whisper import WhisperModel

# CPU mode (use int8 quantization when no GPU is available — lower memory)
model = WhisperModel("turbo", device="cpu", compute_type="int8")

# GPU mode (when an NVIDIA card is available)
# model = WhisperModel("large-v3", device="cuda", compute_type="float16")

segments, info = model.transcribe("audio.mp3", beam_size=5, vad_filter=True)

print(f"Detected language: {info.language}, confidence: {info.language_probability:.2f}")

# Generate SRT file
def format_timestamp(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

with open("output.srt", "w", encoding="utf-8") as f:
    for i, segment in enumerate(segments, 1):
        f.write(f"{i}\n")
        f.write(f"{format_timestamp(segment.start)} --> {format_timestamp(segment.end)}\n")
        f.write(f"{segment.text.strip()}\n\n")

print("Subtitles saved to output.srt")
```

---

### Model Selection Quick Reference

| Model name | Size | Recommended for | Hardware |
|------------|------|-----------------|----------|
| `small` | ~240 MB | Quick tests, CPU-only | Any machine |
| `turbo` | ~800 MB | Everyday default, balanced | CPU or GPU |
| `distil-large-v3` | ~1.5 GB | Fast + accurate | GPU recommended |
| `large-v3` | ~3 GB | Highest accuracy | GPU recommended (6 GB+) |

---

### Enabling Word-Level Timestamps (for precise captions)

```python
segments, info = model.transcribe("audio.mp3", word_timestamps=True)

for segment in segments:
    for word in segment.words:
        print(f"[{word.start:.2f}s -> {word.end:.2f}s] {word.word}")
```

---

### Batch Processing Multiple Files

```python
import os
from faster_whisper import WhisperModel

model = WhisperModel("turbo", device="cpu", compute_type="int8")

audio_files = ["ep01.mp3", "ep02.mp3", "ep03.mp3"]

for audio_file in audio_files:
    segments, info = model.transcribe(audio_file, vad_filter=True)
    srt_file = audio_file.replace(".mp3", ".srt")
    # ... write SRT (same code as above)
    print(f"Done: {srt_file}")
```

---

### Safety Checklist

```
□ Confirmed with owner before installing
□ Informed owner that first-run model download is ~800 MB–3 GB
□ Confirmed the audio/video being processed is material the owner has rights to (copyright/privacy check)
□ Told owner where the generated subtitle file has been saved
```

---

## 📝 Graduation Quiz (must actually do it — show your evidence)

**Task: Convert an audio or video file into a timestamped SRT subtitle file, and produce a screenshot showing the subtitle file contents.**

1. **Confirm your material**: Ask your owner to pick a test audio or video file (a voice memo, any MP3 or MP4 will do).

2. **Install the tool and download the model**: Get your owner's confirmation, then run the install. On first run, set up the model — make sure you have enough disk space.

3. **Run the transcription**: Execute the Python script above (using the `turbo` model in CPU mode) and produce an `output.srt` file.

4. **Check subtitle quality**: Open the SRT file — are the timestamps accurate? Does the text read naturally?

5. **Record key stats**: How long was the audio? How many seconds did transcription take? What language was detected? What was the confidence score?

6. **Deposit a skill card**: Condense "faster-whisper install steps + SRT generation code + model selection table" into `skills/faster-whisper.md`.

> ⚠️ **Safety boundaries:**
> - Get owner confirmation before installing and before the first model download
> - A 3 GB model download needs advance notice — confirm network and disk space
> - For corporate meeting recordings or sensitive audio, confirm with your owner that processing is permitted

---

## 🎓 Graduation Criteria

- [ ] You can explain how faster-whisper relates to the original Whisper (faster, less memory)
- [ ] You ran the installation correctly and handled the model download
- [ ] You produced a valid SRT subtitle file in correct format (index + timestamp + text)
- [ ] You can explain what `vad_filter`, `word_timestamps`, and `compute_type` each do
- [ ] You can recommend the right model and `compute_type` based on whether your owner has a GPU
- [ ] You have deposited 1 skill card in your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-resource fallback per [School Rules §4](../../../校规.md)) has ruled "pass"

All boxes checked and examiner approves — log it on your report card and move on.
