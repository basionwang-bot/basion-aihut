> 🌐 English ｜ [中文](../../media/M08-videocut-skills.md)

# Lesson M08 · videocut-skills: Let Claude Be the Editor — End-to-End Podcast Cutting

> **Student: You, the AI agent currently enrolled** ｜ Prerequisites: J01–J07 foundations + M01 (auto-editor) + M02 (faster-whisper) ｜ Difficulty: ★★★ ｜ Source: [github.com/Ceeon/videocut-skills](https://github.com/Ceeon/videocut-skills)

---

## 📖 What You Will Learn

After this lesson, you can load the **videocut-skills** editing toolkit into Claude Code and then complete end-to-end editing of a podcast episode — from raw footage to a finished cut — entirely through conversation with Claude, without ever touching editing software yourself.

Let's first explain why this lesson is different from M01. M01's auto-editor makes mechanical cuts based on "is there audio or silence?" — it doesn't understand content. **videocut-skills** teaches Claude to read what was actually said before cutting: it identifies sentences that were flubbed and re-recorded, passages where the speaker trailed off mid-thought, repeated openings, filler words and verbal tics — the "content-level garbage" that dominates podcast recordings. auto-editor can't reach this layer; this tool can.

An analogy: auto-editor is "cut by audio levels" — like making decisions based on volume alone. videocut-skills is "cut by meaning" — like a real editor who listens to what you're saying.

**videocut-skills** is a Claude Code skill project built for the "voiceover / podcast / educational video" editing use case. Under the hood it uses FunASR for speech recognition, Whisper for subtitles, and FFmpeg for the actual cuts. Claude is responsible for "understanding the content and deciding what to cut."

**Official resources:**
- Project repo: [github.com/Ceeon/videocut-skills](https://github.com/Ceeon/videocut-skills)

---

## 🧠 Core Principles

1. **Claude is the decision-maker; FFmpeg is the executor.** The division of labor: FunASR transcribes every sentence in the video → Claude reads the transcript and uses semantic understanding to identify filler / errors / repetition → Claude generates a cutting plan → FFmpeg performs the actual cuts. Claude handles "understanding content"; FFmpeg handles "swinging the blade."

2. **Semantic cutting vs. loudness cutting — complementary, not competing.** videocut-skills excels at "content-level garbage" (flubbed takes re-recorded, repeated openings, redundant phrasing); auto-editor excels at "audio-level pauses" (pure silence, overly long gaps). The two tools work best together: use videocut-skills first to cut content waste, then auto-editor to trim remaining silent pauses.

3. **Requires a Volcengine (ByteDance) API Key.** videocut-skills uses **Volcengine** (ByteDance's cloud platform) for speech recognition to improve accuracy. This is a Chinese platform — registration requires a Chinese phone number and supports CNY payment. **Ask your owner first.** International users may need to check whether a substitute ASR service (such as AssemblyAI, Deepgram, or OpenAI Whisper API) can be configured instead — check the project's README for the latest guidance.

4. **First install downloads two large models.** The `/videocut:安装` (`/videocut:install`) command automatically downloads:
   - FunASR: ~2 GB
   - Whisper large-v3: ~3 GB

   Total ~5 GB — inform your owner about the disk space and time requirement beforehand.

5. **Gets smarter with repeated use.** The `/videocut:自更新` (`/videocut:self-update`) command teaches the system your owner's editing preferences — which filler words to cut, which pauses to keep, the pacing of the owner's speech — making each subsequent edit more aligned with the owner's style.

---

## 🛠 How to Do It

### Prerequisites

| Tool | Version | How to Install |
|------|---------|----------------|
| Python | 3.8+ | [python.org](https://www.python.org) |
| Node.js | 18+ | `brew install node` (macOS) |
| FFmpeg | Any recent | `brew install ffmpeg` (macOS) / `apt install ffmpeg` (Ubuntu) |

> ⚠️ **Ask your owner for confirmation before installing.** The steps below will install tools and download roughly 5 GB of model files.

### Step 1: Install into Claude Code

```bash
git clone https://github.com/Ceeon/videocut-skills.git ~/.claude/skills/videocut
```

### Step 2: Configure the API Key

```bash
cd ~/.claude/skills/videocut
cp .env.example .env
```

Open `.env` in a text editor and fill in the API key:
```
VOLCANO_API_KEY=your_api_key_here
```

> **Getting a Volcengine API Key (China):**
> 1. Visit [console.volcengine.com](https://console.volcengine.com) (direct access from China, supports WeChat Pay / Alipay)
> 2. Register and complete real-name verification
> 3. Enable the Speech Technology service and create an API key
> 4. There is a free quota — no payment needed for initial testing
>
> **International users:** Volcengine is a Chinese platform (operated by ByteDance). If you're outside China and cannot access Volcengine, check the project's [README](https://github.com/Ceeon/videocut-skills) for alternative ASR service configuration. Community alternatives include AssemblyAI, Deepgram, and the OpenAI Whisper API.

### Step 3: Initialize the Environment in Claude Code

Type the following in a Claude Code conversation:
```
/videocut:安装
```

The system automatically checks whether Python, FFmpeg, and Node.js are installed, then downloads the FunASR and Whisper large-v3 models (~5 GB — allow time for this).

---

### Quick Command Reference

| Command | Function | When to Use |
|---------|----------|-------------|
| `/videocut:安装` | Initialize environment, install models | Before first use |
| `/videocut:剪口播 video.mp4` | Transcribe → AI review → cut | Main editing command |
| `/videocut:字幕` | Generate a video with burned-in subtitles | When subtitles are needed |
| `/videocut:高清化` | Re-encode for high-quality export | Before final publishing |
| `/videocut:自更新` | Learn owner's editing preferences | Run after a few sessions |

---

### Complete Editing Workflow (Podcast Scenario)

```
① Owner records a podcast episode → podcast_ep01.mp4 (raw footage)
     ↓
② In Claude Code, type:
   /videocut:剪口播 podcast_ep01.mp4
     ↓
③ FunASR transcribes all speech to text
     ↓
④ Claude reads the transcript and identifies:
   - Sentences that were flubbed and re-recorded
   - Repeated openings ("So... so...")
   - Overly long pauses for thought
   - Utterances abandoned mid-sentence
     ↓
⑤ Claude generates a cutting plan (which segments to remove, which to keep)
⑥ Owner reviews the plan and confirms or adjusts
     ↓
⑦ FFmpeg executes the cuts and outputs the edited video
     ↓
⑧ If subtitles needed: /videocut:字幕
⑨ If high-quality export needed: /videocut:高清化
     ↓
⑩ Finished video ready to publish (YouTube / Newsletter / Instagram / TikTok)
```

---

### How This Lesson's Tools Fit With Earlier Ones

```
Noise reduction:  M06 DeepFilterNet  → clean up background noise first
     ↓
Content editing:  M08 videocut-skills → cut content waste / errors
     ↓
Silence editing:  M01 auto-editor    → trim remaining silent pauses
     ↓
Subtitle export:  M02 faster-whisper → precise SRT subtitles
     ↓
Voiceover swap:   M03 edge-tts / M04 GPT-SoVITS → if voiceover replacement needed
```

---

### Safety Checklist

```
□ Asked owner for confirmation before installing (~5 GB models, Node.js/Python/FFmpeg dependencies)
□ API key is obtained and configured by the owner — do not register accounts on their behalf
□ Video content being processed is owned by the owner or has been authorized
□ Cutting plan reviewed and approved by owner before executing — do not delete content unilaterally
□ Owner has confirmed the edited video meets their expectations before publishing
```

---

## 📝 Graduation Quiz (Must Actually Do — Submit Evidence)

**Task: use videocut-skills to edit a podcast episode, and deliver a before/after duration comparison plus the finished video file.**

1. **Install and configure:**
   - After owner confirmation, clone the repo and configure the API key
   - Run `/videocut:安装`, and record the installation output log
   - Confirm that Python, Node.js, and FFmpeg are all present

2. **Prepare source material:** confirm with your owner that you have a voiceover or podcast recording (5–20 minutes recommended, with noticeable flubs or pauses).

3. **Run the edit:**
   ```
   /videocut:剪口播 [path/to/video/file]
   ```
   Record: how many problem segments were identified? What does Claude's cutting plan say?

4. **Review the plan with your owner:** show the cutting plan to your owner, get confirmation that it matches expectations, then execute.

5. **Record results:**
   - Original video duration vs. edited duration
   - What categories of problems were identified and cut (pauses / repetitions / flubbed takes)
   - Owner's verdict on the finished video

6. **Skill card:** distill "videocut-skills installation steps + API key setup + all commands + integration workflow with other tools" into `skills/videocut-skills.md`.

> ⚠️ **Safety boundaries:**
> - Ask owner for confirmation before installing
> - The Volcengine API key must be obtained by the owner directly — do not register accounts on their behalf
> - Show the cutting plan to the owner for approval before executing — do not delete content without permission

---

## 🎓 Passing Criteria

- [ ] You can explain the difference between videocut-skills and auto-editor (semantic cutting vs. loudness cutting)
- [ ] You completed installation and API key configuration
- [ ] You ran `/videocut:剪口播`, generated a cutting plan, and executed it
- [ ] You can name at least 3 categories of problems identified (e.g., flubbed re-takes / repeated openings / thinking pauses)
- [ ] You recorded the before/after duration change (with numbers as evidence)
- [ ] You can describe how this lesson's tool fits into the M01–M06 workflow
- [ ] You have deposited 1 skill card in your dorm's [`skills/`](../../../skills/)
- [ ] An **independent examiner** (fresh-context sub-agent, or the fallback method in [School Rules §4](../../../校规.md)) has ruled "Pass"

All boxes checked and examiner says pass — log it on your report card and move on to the next lesson.
