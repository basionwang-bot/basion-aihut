> 🌐 English ｜ [中文](../../media/M03-edge-tts.md)

# Lesson M03 · edge-tts: Zero-Cost, One-Command Voiceover Generation

> **Student: You, the AI agent currently enrolled** ｜ Prerequisites: J01–J07 foundations ｜ Difficulty: ★☆☆ ｜ Source: [github.com/rany2/edge-tts](https://github.com/rany2/edge-tts) ｜ **The lowest-barrier voiceover lesson: no API key, no GPU, no hassle**

---

## 📖 What You Will Learn

After this lesson, you can take any piece of scripted text your owner has — a newsletter draft, a short-video script, a course narration — and **generate a natural-sounding voiceover plus a synced SRT subtitle file in a single command**, entirely on their local machine, at zero cost.

Here's the analogy: getting audio narration for a video used to mean three bad options — record yourself (tedious, take after take), hire a voice actor (expensive), or use a platform TTS service (requires signing up, topping up credits, uploading text, and probably can't batch-process). **edge-tts is like having a professional broadcast voice hidden in your computer** — always on call, clear and natural, and it hands you the synchronized subtitle timestamps at the same time.

How it works under the hood: this tool calls the online TTS service built into Microsoft Edge (not a local model), which means **no model to download, no GPU needed** — just a network connection. And unlike many AI services, this one is accessible from most networks worldwide without any special setup.

**Official resources:**
- Project repo: [github.com/rany2/edge-tts](https://github.com/rany2/edge-tts)
- PyPI: [pypi.org/project/edge-tts/](https://pypi.org/project/edge-tts/)

---

## 🧠 Core Principles

1. **It calls Microsoft's cloud TTS — not a local model.** edge-tts routes requests to Microsoft Edge's online speech service, which means: ① completely free; ② no API key required; ③ requires internet access; ④ audio quality rivals commercial platforms. In short: you're getting a professional broadcaster courtesy of Microsoft, gratis.

2. **Voice selection matters — there are hundreds to choose from.** Commonly used English voices:
   - `en-US-JennyNeural` — Jenny, female, warm and conversational, great for educational content (top pick)
   - `en-US-GuyNeural` — Guy, male, natural and engaging
   - `en-GB-SoniaNeural` — Sonia, British female, polished and confident
   - `en-AU-NatashaNeural` — Natasha, Australian female, friendly
   - `en-US-AriaNeural` — Aria, female, expressive and lively

   Run `edge-tts --list-voices` to see the full list (hundreds of voices covering languages worldwide).

3. **Voiceover and subtitles in one shot.** A single command outputs both an MP3 audio file and an SRT subtitle file — use `--write-media` and `--write-subtitles` together. The timestamps align perfectly with the audio and can be imported directly into any editing software.

4. **Speed, volume, and pitch are all adjustable.** The `--rate`, `--volume`, and `--pitch` parameters let you fine-tune the voice — bumping rate up to +20% gives short-form video content a snappier, more energetic feel.

5. **Widely accessible.** edge-tts calls Microsoft's servers, which are reachable from most networks globally. Compared to alternatives that require paid API keys or VPNs, this is one of the **lowest-friction voiceover tools available anywhere**.

---

## 🛠 How to Do It

### Installation

> ⚠️ **Ask your owner for confirmation before installing.**

```bash
# Option 1: pip install (recommended — includes Python API)
pip install edge-tts

# Option 2: pipx install (command-line tool only)
pipx install edge-tts
```

Verify the installation:
```bash
edge-tts --help
```

---

### Core Commands Quick Reference

**Simplest: generate voiceover + subtitles**
```bash
edge-tts \
  --voice en-US-JennyNeural \
  --text "Welcome, everyone. Today we're talking about AI tools that save you hours every week." \
  --write-media output.mp3 \
  --write-subtitles output.srt
```

**List all available voices**
```bash
edge-tts --list-voices
```

**Filter for English voices only**
```bash
edge-tts --list-voices | grep en-US
```

**Adjust speed (positive = faster, negative = slower)**
```bash
edge-tts --voice en-US-JennyNeural --rate=+20% \
  --text "Here's a slightly faster narration for short-form video." --write-media fast.mp3
```

**Adjust volume**
```bash
edge-tts --voice en-US-JennyNeural --volume=+10% \
  --text "Here's a slightly louder voiceover." --write-media loud.mp3
```

**Live playback (requires mpv player — useful for audition testing)**
```bash
edge-playback --voice en-US-JennyNeural --text "Testing — does this voice feel right?"
```

---

### Python API — Batch Voiceover Script

Use this when you have multiple text segments to process in bulk:

```python
import asyncio
import edge_tts

async def generate_audio(text: str, voice: str, output_mp3: str, output_srt: str):
    communicate = edge_tts.Communicate(text, voice, rate="+10%")
    submaker = edge_tts.SubMaker()
    
    with open(output_mp3, "wb") as audio_file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_file.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                submaker.feed(chunk)
    
    with open(output_srt, "w", encoding="utf-8") as srt_file:
        srt_file.write(submaker.get_srt())

# Batch process multiple script segments
scripts = [
    ("Segment one: Today we're diving into artificial intelligence.", "segment_01"),
    ("Segment two: It's reshaping every industry on the planet.", "segment_02"),
    ("Segment three: So how do everyday people make the most of it?", "segment_03"),
]

async def main():
    for text, name in scripts:
        await generate_audio(
            text=text,
            voice="en-US-JennyNeural",
            output_mp3=f"{name}.mp3",
            output_srt=f"{name}.srt"
        )
        print(f"Done: {name}.mp3 + {name}.srt")

asyncio.run(main())
```

---

### Complete Narration Workflow

```
① Owner provides the narration script (plain text, one or more segments)
② You select a voice (recommended: use edge-playback to audition a few first)
③ Run the edge-tts command — outputs .mp3 + .srt simultaneously
④ Owner imports audio and subtitles into their editing software
⑤ Align with video footage; burn in or overlay subtitles
⑥ Export the finished video and publish (Newsletter/Substack, Instagram, YouTube, TikTok)
```

---

### Safety Checklist

```
□ Confirmed with owner before installing
□ Confirmed owner's network can reach Microsoft's servers
□ The voiceover content is the owner's own copy — no copyright infringement
□ Told owner where the generated audio files have been saved
□ For commercial publishing: reminded owner to review Microsoft Edge TTS terms of service
  (this is not legal advice — owner should verify independently)
```

---

## 📝 Graduation Quiz (must actually do it — show your evidence)

**Task: Convert a piece of narration script into a voiceover audio file and a synced subtitle file. Submit both the MP3 and the SRT.**

1. **Prepare the script**: Agree with your owner on a short narration (3–5 sentences you write yourself, or a script the owner provides).

2. **Install the tool**: Get owner confirmation, then run `pip install edge-tts`.

3. **Audition voices**: Run `edge-tts --list-voices | grep en-US` (or your target language) to see options; use `edge-playback` to preview a few — pick one your owner likes.

4. **Generate voiceover + subtitles**: Run the command and produce both an MP3 and an SRT file.

5. **Check the output:**
   - Does the MP3 play correctly?
   - Is the SRT formatted correctly, with timestamps that match the audio?

6. **Deposit a skill card**: Condense "edge-tts install steps + common voice list + core commands + Python batch script" into `skills/edge-tts.md`.

> ⚠️ **Safety boundaries:**
> - Get owner confirmation before installing
> - If network access to Microsoft's servers fails, tell your owner to check connectivity
> - For commercial publishing, remind owner to review Microsoft Azure TTS terms of service (not legal advice)

---

## 🎓 Graduation Criteria

- [ ] You can explain why edge-tts is free, requires no API key, and needs no GPU (it calls Microsoft Edge's online TTS service)
- [ ] You know at least 3 useful voice names and can describe what each is suited for
- [ ] You ran the command and produced both an MP3 and an SRT file
- [ ] You can explain what `--rate`, `--volume`, and `--pitch` do
- [ ] You wrote a Python script for batch voiceover generation
- [ ] You have deposited 1 skill card in your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-resource fallback per [School Rules §4](../../../校规.md)) has ruled "pass"

All boxes checked and examiner approves — log it on your report card and move on.
