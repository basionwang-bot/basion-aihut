> 🌐 English ｜ [中文](../../tools/T19-whisper.md)

# Lesson T19 · Whisper: Speech-to-Text and Subtitles

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: OpenAI Whisper official repo · [github.com/openai/whisper](https://github.com/openai/whisper) · faster-whisper · [github.com/SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)

---

## 📖 What you'll learn

After this lesson, you'll be able to automatically transcribe speech from a recording or video into a text document or `.srt` subtitle file — no manual transcription, no paid services, running entirely on your local machine.

Picture this: you have a 40-minute lecture recording, the instructor talks fast, and you need to turn it into text for your classmates. In the old days you'd stare at the pause button, typing one sentence at a time — three hours of work. Now you hand it to Whisper and it acts like an **ultra-fast stenographer**: pass it the recording, and a few minutes later it hands back a transcript with timestamps on every sentence.

Whisper is the speech-recognition model that OpenAI open-sourced in 2022. It supports 99 languages (including Mandarin, Cantonese, Japanese, and more) and is especially strong on Chinese. **faster-whisper** is the community-built accelerated version, rewritten with the CTranslate2 engine — same accuracy, 2–4× faster, and half the memory footprint. It is the recommended version to use today.

**Official resources:**
- OpenAI Whisper repo: [github.com/openai/whisper](https://github.com/openai/whisper)
- faster-whisper repo: [github.com/SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)
- faster-whisper on PyPI: [pypi.org/project/faster-whisper](https://pypi.org/project/faster-whisper/)
- Supported languages list: [github.com/openai/whisper/blob/main/whisper/tokenizer.py](https://github.com/openai/whisper/blob/main/whisper/tokenizer.py)

---

## 🧠 Core principles (internalize these as habits)

1. **Bigger model = more accurate, but also slower and more memory-hungry — choose by need.** Whisper comes in five tiers: tiny / base / small / medium / large. Think of hiring a stenographer: tiny is the intern — fast and cheap but error-prone; large is the senior expert — slow and expensive but nearly flawless. For Chinese tasks, start with `medium`; use `large-v3` when budget allows or high precision is required.

2. **Models must be downloaded locally; connections from China are often slow — plan ahead.** Model files are hosted on HuggingFace Hub: small is ~244 MB, medium is ~769 MB, large-v3 is ~1.5 GB. Direct connections to HuggingFace from mainland China frequently time out. **Recommended approaches**: download the model in advance, or ask the owner to use a mirror site (such as `hf-mirror.com`) and place the files in the designated directory.

3. **The input format is forgiving, but pre-converting with ffmpeg is more reliable.** Whisper accepts mp3/mp4/wav/m4a/flac and more, but if you encounter an unusual codec, convert to wav (16 kHz, mono) with ffmpeg first — that eliminates 90% of format errors.

4. **`word_timestamps=True` gives you a timestamp for every individual word.** The default is sentence-level timestamps. If you need karaoke-style subtitles, precise alignment, or word highlighting, turn on word-level timestamps.

5. **Use GPU if you have one; CPU works too (just slower).** The faster-whisper CPU build is much faster than the original, so a typical home machine running the medium model can process a 10-minute audio clip in roughly 3–5 minutes.

---

## 🛠 How to do it

### Installation

```bash
# Install faster-whisper (recommended — 2–4× faster than the original)
pip install faster-whisper

# If you also need to handle video files, install ffmpeg (system-level tool)
# macOS:
brew install ffmpeg
# Ubuntu/Debian:
sudo apt install ffmpeg

# Verify installation
python -c "from faster_whisper import WhisperModel; print('ok')"
```

> ⚠️ **Do not install or run without the owner's confirmation — present the plan first.**
>
> **Network note**: Model files are downloaded from HuggingFace. Direct access may be slow or fail. Workarounds:
> - Option A: Set the environment variable `HF_ENDPOINT=https://hf-mirror.com` before running, to route through a mirror
> - Option B: Ask the owner to manually download the model folder from [hf-mirror.com](https://hf-mirror.com) and point `model_size_or_path` to the local path in your code
> - Option C: Use a VPN and then download

### Minimal runnable script

```python
from faster_whisper import WhisperModel

# 1. Load the model
# model_size: tiny / base / small / medium / large-v2 / large-v3
# device: "cpu" or "cuda" (much faster with an NVIDIA GPU)
# compute_type: "int8" (recommended for CPU) / "float16" (recommended for GPU)
model = WhisperModel("medium", device="cpu", compute_type="int8")

# 2. Transcribe audio (language auto-detected)
segments, info = model.transcribe("audio.mp3", beam_size=5)

print(f"Detected language: {info.language} (confidence {info.language_probability:.0%})")

# 3. Print results (with timestamps)
for segment in segments:
    print(f"[{segment.start:.1f}s → {segment.end:.1f}s] {segment.text}")
```

### Output as SRT subtitle file

```python
from faster_whisper import WhisperModel

def transcribe_to_srt(audio_path: str, output_srt: str,
                       model_size: str = "medium",
                       language: str = "zh") -> int:
    """
    Transcribe audio to an SRT subtitle file; returns the subtitle count.
    language: "zh"=Chinese, "en"=English, None=auto-detect
    """
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        audio_path,
        language=language,
        beam_size=5,
        word_timestamps=False,
    )

    def fmt_time(seconds: float) -> str:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds - int(seconds)) * 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    count = 0
    with open(output_srt, "w", encoding="utf-8") as f:
        for i, seg in enumerate(segments, 1):
            f.write(f"{i}\n")
            f.write(f"{fmt_time(seg.start)} --> {fmt_time(seg.end)}\n")
            f.write(f"{seg.text.strip()}\n\n")
            count = i

    return count

# Example (run only after confirming with the owner)
# n = transcribe_to_srt("lecture.mp3", "output/lecture.srt")
# print(f"Generated {n} subtitle entries")
```

### Model size quick reference (download size guide)

| Model | Size | Quality | CPU speed (10-min audio) | Best for |
|-------|------|---------|--------------------------|----------|
| tiny | 39 MB | Fair | ~30 sec | Quick drafts |
| base | 74 MB | Fair | ~1 min | Quick drafts |
| small | 244 MB | Good | ~2 min | Everyday use |
| medium | 769 MB | Very good | ~5 min | Recommended default |
| large-v3 | 1.5 GB | Best | ~12 min | High-accuracy tasks |

### Common error troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `ConnectionError` / download timeout | HuggingFace unreachable | Use `hf-mirror.com` mirror or VPN |
| `CUDA out of memory` | GPU VRAM insufficient | Switch to `device="cpu"` or use a smaller model |
| `ffmpeg not found` | ffmpeg not installed | Install ffmpeg first (ask the owner) |
| Garbled output | Language not specified | Add `language="zh"` parameter |
| All output in English | Language detection error | Manually set `language="zh"` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "meeting recording → transcript + subtitles" plan.**

Scenario: the owner has a 30-minute Chinese meeting recording (mp3 format) and needs: ① a timestamped text transcript (txt); ② an SRT subtitle file that can be imported directly into video editing software.

You need to complete:

1. **Write a complete Python script** that:
   - Loads the medium model (CPU mode)
   - Transcribes Chinese audio
   - Outputs `output/transcript.txt` (plain text with timestamps)
   - Outputs `output/subtitle.srt` (standard SRT format)
   - Prints the total subtitle count and the detected language

2. **Write the acceptance criteria:**
   - `output/transcript.txt` exists and contains Chinese characters
   - `output/subtitle.srt` is properly formatted (sequence number, `-->` timeline, and text)
   - The last timestamp is approximately equal to the original audio duration (within ±5 seconds)

3. **Write the download plan for slow network environments:**
   - All three options (mirror site / local path / VPN) with their respective commands or code

4. **Write the safety notes:**
   - Audio involving other people's privacy (such as meeting recordings) requires the consent of all participants
   - **Do not install or run without the owner's explicit confirmation**
   - Verify available disk space before downloading the model (large-v3 needs at least 3 GB including cache)

5. **Distill a skill card** into `agent-school/skills/whisper-transcribe.md`.

> ⚠️ **Safety boundary**: the graduation test for this lesson is about **producing a plan**, not actually running it. Model downloads and script execution **must have the owner's explicit confirmation before you proceed**.

---

## 🎓 Pass criteria

- [ ] You wrote a complete transcription script (outputting both txt and srt formats)
- [ ] You can explain the model selection logic for tiny / medium / large-v3 (accuracy vs. speed vs. model size)
- [ ] You provided at least two workable methods for downloading HuggingFace models on a slow network
- [ ] You know to add `language="zh"` for Chinese transcription, and how to handle language detection errors
- [ ] Distilled 1 skill card into [`agent-school/skills/whisper-transcribe.md`](../../../skills/whisper-transcribe.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T20.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: transcribing speech and generating subtitles with faster-whisper

- **When to use**: convert speech in audio or video files into a text transcript or SRT subtitles
- **From**: Lesson T19 Whisper

## Steps
1. Install: pip install faster-whisper (also install system-level ffmpeg)
2. Download model on slow networks: set HF_ENDPOINT=https://hf-mirror.com or use a local path
3. Load model: WhisperModel("medium", device="cpu", compute_type="int8")
4. Transcribe Chinese: model.transcribe(path, language="zh", beam_size=5)
5. Iterate segments — each has start/end/text
6. Output SRT: write in "index\ntimeline\ntext\n" format

## Verification
- Check that the srt file contains "-->" timeline markers
- Last timestamp is approximately equal to the total audio duration
- info.language == "zh" (or the target language code)

## Notes
- Choose model size by need: medium for everyday use, large-v3 for high accuracy
- Direct HuggingFace access from mainland China often times out — prefer a mirror
- Specify language="zh" to avoid misdetection
- Obtain consent before processing recordings of other people
- Always confirm with the owner before installing or running
```
