> 🌐 English ｜ [中文](../../media/M07-moneyprinter.md)

# Lesson M07 · MoneyPrinterTurbo: Input a Topic, Get a Finished Short Video — Fully Automated

> **Student: You, the AI agent currently enrolled** ｜ Prerequisites: J01–J07 foundations + M03 (edge-tts) + M02 (faster-whisper) ｜ Difficulty: ★★★ ｜ Source: [github.com/harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) ｜ **China-friendly: defaults to Edge TTS, supports DeepSeek / Qwen / Ollama**

---

## 📖 What You Will Learn

After this lesson, you can help your owner turn "a topic keyword" into a complete short video — with voiceover, subtitles, background music, and footage — as if a fully automated assembly line takes in "raw material" (the topic) at one end and produces "finished goods" (a ready-to-publish video) at the other.

Consider what making a 60-second explainer video used to take: write a script (30 min) → find footage (1 hour) → record or synthesize voiceover (20 min) → edit and sync (1 hour) → add subtitles (30 min) → render and export (10 min). Three to four hours total.

With **MoneyPrinterTurbo**: you type "Topic: How to boost work efficiency with AI," choose a language and a voice, click Generate — and the tool automatically chains together "script generation → footage search → voiceover synthesis → subtitle recognition → BGM mixing → video composition." Ten to twenty minutes later, a finished video is ready.

**International note:** The stock footage providers (Pexels, Pixabay, Coverr) are globally accessible. LLM options include OpenAI GPT, as well as DeepSeek, Qwen, and Ollama for users who want non-OpenAI alternatives. Edge TTS is free and works worldwide.

**Official resources:**
- Project repo: [github.com/harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo)

---

## 🧠 Core Principles

1. **Pipeline thinking: every stage is swappable.** MoneyPrinterTurbo's architecture is modular — the LLM, TTS engine, subtitle recognizer, and footage source can each be replaced. Owner doesn't have an OpenAI account? Swap in DeepSeek. No GPU? Replace Whisper with a faster subtitle option. Understanding this substitution logic is what lets you adapt to whatever situation you face.

2. **Footage source is the weak link — address it upfront.** The default footage source is Pexels. Pexels, Pixabay, and Coverr all work globally. You will need a free API key for Pexels or Pixabay — take a minute to register and get one before starting.

3. **The Whisper subtitle model must be downloaded in advance.** Subtitles use the Whisper large-v3 model (~3 GB). If HuggingFace is slow in your region, the project provides mirror download links. After downloading, place the files in the specified directory.

4. **Choose an LLM that fits your owner's situation.** Options include:
   - **OpenAI GPT** (default, requires OpenAI API key)
   - **DeepSeek** (recommended cost-effective alternative, direct access from China)
   - **Qwen (Tongyi Qianwen)** (Alibaba Cloud, China-friendly)
   - **Ollama** (fully local, zero cost, speed depends on your hardware)
   - **Azure OpenAI** (enterprise option)

5. **Confirm the video format and aspect ratio with your owner first.** The tool supports 9:16 portrait (TikTok / Instagram Reels / YouTube Shorts) and 16:9 landscape (YouTube / Substack video / LinkedIn). Ask your owner which platform they're publishing to before generating.

---

## 🛠 How to Do It

### System Requirements

| Item | Minimum | Recommended |
|------|---------|-------------|
| CPU | 4 cores | 8+ cores |
| RAM | 4 GB | 16 GB+ |
| GPU VRAM | No GPU required | 8 GB+ (for Whisper) |
| OS | Windows / macOS / Linux | — |

> ⚠️ **Ask your owner for confirmation before installing.**

### Install Method 1: Windows One-Click Package (Simplest)

Go to [github.com/harry0703/MoneyPrinterTurbo/releases](https://github.com/harry0703/MoneyPrinterTurbo/releases), download the Windows bundle, unzip it, then:

```
# Update to the latest version
Double-click update.bat

# Launch
Double-click start.bat
```

Open the address shown in the terminal in your browser (usually `http://localhost:8501`).

### Install Method 2: uv Manual Install (Cross-platform)

```bash
# Clone the repo
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
cd MoneyPrinterTurbo

# Install Python 3.11
uv python install 3.11
uv sync --frozen
```

**Start the WebUI:**
```bash
# Windows
.\webui.bat

# macOS/Linux
uv run streamlit run ./webui/Main.py --browser.gatherUsageStats=False
```

**Start the API service:**
```bash
uv run python main.py
```

### Install Method 3: Docker

```bash
cd MoneyPrinterTurbo
docker-compose up
```

---

### Key Configuration

#### 1. Whisper Model Download

If HuggingFace is slow in your region, use a mirror or download manually:

```bash
# Mirror option
export HF_ENDPOINT=https://hf-mirror.com
```

The project also provides direct download links in the README for users in regions where HuggingFace is unreliable. After downloading, unzip and place the files in `MoneyPrinterTurbo/models/whisper-large-v3/`.

#### 2. Configure the LLM

Edit `config.toml`:

```toml
[app]
# Choose your LLM provider
llm_provider = "openai"   # or "deepseek", "qwen", "ollama", etc.

[openai]
api_key = "your-openai-api-key"
model_name = "gpt-4o"

# --- Alternative: DeepSeek (cost-effective, no VPN needed) ---
# llm_provider = "deepseek"
# [deepseek]
# api_key = "your-deepseek-api-key"
```

> DeepSeek API is extremely affordable (roughly $0.001 per 1 000 tokens) and accessible worldwide.

#### 3. TTS Configuration (Edge TTS is the default — no setup needed)

Edge TTS is the default TTS engine, labeled "Azure TTS V1" in the WebUI. It is **completely free, requires no API key, and works globally** — install and use immediately, no configuration needed.

#### 4. Footage Source

```toml
[app]
# Options: pexels / pixabay / coverr
video_source = "pexels"

[pexels]
# Get a free API key at pexels.com/api
api_keys = ["your-pexels-api-key"]
```

> Pexels and Pixabay are globally accessible. Most Pexels footage is free for commercial use — check the license on individual clips. Coverr requires registration at coverr.co/developers for a free API key (50 requests/hour).

---

### WebUI Workflow

```
Open http://localhost:8501
     ↓
① Enter video topic (keyword or phrase)
② Select language
③ Select aspect ratio (9:16 portrait or 16:9 landscape)
④ Select TTS voice (default: Edge TTS)
⑤ Select subtitle style (font / color / position)
⑥ Select BGM (built-in library or upload custom)
⑦ Click "Generate Video"
     ↓
Wait roughly 5–15 minutes (depends on hardware and network)
     ↓
⑧ Download the finished video
```

---

### Quick CLI Generation

```bash
uv run python cli.py --video-subject "How to improve writing efficiency with AI"
```

---

### Safety Checklist

```
□ Asked owner for confirmation before installing
□ Whisper model downloaded and placed in the correct directory
□ LLM provider API key configured (OpenAI, DeepSeek, or Ollama)
□ Owner is aware of footage source access requirements (API key needed for Pexels/Pixabay)
□ Footage licenses are compatible with the intended use (most Pexels footage is free for commercial use)
□ Owner is aware of the target platform's policy on AI-generated content
```

---

## 📝 Graduation Quiz (Must Actually Do — Submit Evidence)

**Task: enter a video topic and run the full pipeline — script → footage → voiceover → subtitles → finished video — then deliver the output file.**

1. **Install the tool:** after getting owner confirmation, choose the install method that fits your owner's environment (the Windows bundle is the simplest).

2. **Configure the environment:**
   - Download the Whisper model and place it in the correct directory
   - Configure a DeepSeek or OpenAI API key in `config.toml`
   - Confirm Edge TTS is working (usually no extra setup needed)

3. **Generate a complete video:** pick a simple topic (e.g., "Three techniques for better focus"), fill in the WebUI, and click Generate.

4. **Record key metrics:**
   - Total generation time (minutes)?
   - How is the quality of the generated script?
   - Video length? Are the subtitles accurate?

5. **Try adjusting:** change one parameter (speech speed / subtitle style / BGM), generate again, and compare the two versions.

6. **Skill card:** distill "MoneyPrinterTurbo installation + environment setup + WebUI workflow + common issues" into `skills/moneyprinter.md`.

> ⚠️ **Safety boundaries:**
> - Ask owner for confirmation before installing
> - Inform the owner about any footage source access requirements upfront
> - Before publishing, confirm the AI-generated content complies with the target platform's guidelines

---

## 🎓 Passing Criteria

- [ ] You can describe MoneyPrinterTurbo's full pipeline (6 automated steps)
- [ ] You handled the key configuration (Whisper model download + LLM selection)
- [ ] You ran the full pipeline and generated a playable finished video
- [ ] You can explain the footage source options and their respective requirements
- [ ] You know how to adjust the TTS voice, subtitle style, and video aspect ratio
- [ ] You have deposited 1 skill card in your dorm's [`skills/`](../../../skills/)
- [ ] An **independent examiner** (fresh-context sub-agent, or the fallback method in [School Rules §4](../../../校规.md)) has ruled "Pass"

All boxes checked and examiner says pass — log it on your report card and move on to the next lesson.
