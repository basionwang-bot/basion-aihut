> 🌐 English ｜ [中文](../../tools/T18-yt-dlp.md)

# Lesson T18 · yt-dlp: Downloading Public Audio and Video

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T17 (ffmpeg — yt-dlp calls it internally for merging) ｜ Difficulty: ★★☆ ｜ Source: yt-dlp official repo · [github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp) · [yt-dlp README](https://github.com/yt-dlp/yt-dlp/blob/master/README.md)

---

## 📖 What you'll learn

After this lesson, you'll be able to use yt-dlp from the command line to download **publicly available videos and audio from public platforms** — open-access YouTube lectures, public Bilibili videos, podcast audio from RSS feeds — one command to get it local, no browser extension required.

Think of yt-dlp as a tool that "captures a public broadcast playing online and saves it to your hard drive" — but far smarter than screen recording. It fetches the platform's original video stream directly, preserving full quality with no watermark, and can automatically download subtitles and merge separate audio and video tracks.

yt-dlp is an actively maintained fork of the widely respected youtube-dl, with numerous bug fixes and ongoing support for platform changes. It supports 1,000+ video sites (including Bilibili, Douyin, Weibo Video, and other platforms).

> 🔴 **Copyright and platform policy boundaries (commit these to memory):**
> - **Only download public content**: limited to content that is publicly visible and does not require a paid subscription or login to watch.
> - **Respect copyright**: downloading does not transfer copyright to you. Downloaded content is **for personal study, backup, or accessibility purposes only** — do not redistribute, use commercially, or re-publish with watermarks removed.
> - **Follow platform terms**: most platforms' terms of service explicitly prohibit unauthorized bulk downloading. Confirm your use case is within your local laws and the platform's terms before proceeding.
> - **Before actually running any download command, ask the owner first** — including confirming the target URL and confirming the intended use is compliant.

**Official resources:**
- GitHub (official repo): [github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp)
- Full README (options reference): [github.com/yt-dlp/yt-dlp/blob/master/README.md](https://github.com/yt-dlp/yt-dlp/blob/master/README.md)
- Supported sites list: [github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)
- PyPI: [pypi.org/project/yt-dlp](https://pypi.org/project/yt-dlp)

---

## 🧠 Core principles (internalize these as habits)

1. **Always run `--list-formats` first — know your options before downloading.** yt-dlp lists every quality and format option the platform offers (1080p / 720p / audio only…). Picking an ID consciously beats blindly taking the default.

2. **Merging video and audio usually requires ffmpeg.** Many platforms (YouTube, Bilibili) store video streams and audio streams separately. yt-dlp automatically calls ffmpeg to merge them — so install ffmpeg first (Lesson T17) or you'll end up with a silent video.

3. **`--no-playlist` prevents accidentally downloading an entire playlist.** When the URL contains a playlist ID, yt-dlp defaults to downloading the whole playlist. If you only want one video, you must add `--no-playlist`.

4. **For batch downloads, use `-a file.txt`.** Put a list of URLs into a text file (one per line) and run `yt-dlp -a urls.txt` — far less tedious than running one command per URL.

5. **Ask the owner before every actual download.** Being able to do something doesn't mean you should. Every time the target changes (different site, different use case), reconfirm that the owner understands and has agreed — this isn't a formality, it's **holding the legal and ethical line**.

---

## 🛠 How to do it

### Installation

```bash
# Option A: pip (recommended — easy to update)
pip install yt-dlp

# Option B: download the binary directly (Windows / macOS / Linux)
# See https://github.com/yt-dlp/yt-dlp/releases/latest
# Download yt-dlp or yt-dlp.exe and add it to your PATH

# ffmpeg also needs to be installed (for merging audio and video), see Lesson T17
# macOS: brew install ffmpeg
# Ubuntu: sudo apt install ffmpeg

# Verify installation
yt-dlp --version
```

> ⚠️ **This is a system-level tool. Both installation and execution require the owner's confirmation first — do not run on your own.**

### Step one: always scout first, never download blind

```bash
# Inspect video metadata without downloading
yt-dlp --no-download --print-json "https://www.bilibili.com/video/BV1xx411x7xx"

# List all available quality/format options
yt-dlp --list-formats "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
# Example output:
# ID   EXT   RESOLUTION  FPS  │ FILESIZE  TBR  PROTO
# 137  mp4   1920x1080   30   │  ~350MiB  ...  https   (video only)
# 140  m4a   audio only  -    │   ~50MiB  ...  https   (audio only)
# 22   mp4   1280x720    30   │  ~200MiB  ...  https   (merged audio+video)
```

### The most common commands

```bash
# 1. Download best quality (auto-merge audio+video, requires ffmpeg)
yt-dlp "https://url" -o "output/%(title)s.%(ext)s"

# 2. Audio only, saved as MP3
yt-dlp -x --audio-format mp3 -o "output/%(title)s.%(ext)s" "https://url"

# 3. Specify a format by ID (from --list-formats)
yt-dlp -f "137+140" -o "output/%(title)s.%(ext)s" "https://url"
# 137=1080p video stream + 140=m4a audio stream, yt-dlp auto-merges

# 4. Download video + subtitles (if available)
yt-dlp --write-sub --sub-lang en "https://url" -o "output/%(title)s.%(ext)s"

# 5. Batch download (urls.txt has one URL per line)
yt-dlp -a urls.txt -o "output/%(title)s.%(ext)s"

# 6. This video only — don't download the whole playlist
yt-dlp --no-playlist "https://url"

# 7. Bilibili video download (BV number URL supported)
yt-dlp "https://www.bilibili.com/video/BVxxxxxxxxx" -o "output/%(title)s.%(ext)s"

# 8. Rate-limited download (avoid hammering the server)
yt-dlp -r 1M "https://url" -o "output/%(title)s.%(ext)s"
```

### Common options quick reference

| Option | Meaning |
|--------|---------|
| `-o "output/%(title)s.%(ext)s"` | Output path template (recommended) |
| `--list-formats` | List all available formats |
| `-f "best"` | Download best merged format |
| `-f "bestvideo+bestaudio"` | Select highest quality video + audio separately, then merge |
| `-x` | Extract audio only |
| `--audio-format mp3` | Convert audio to MP3 |
| `--write-sub` | Download subtitle file |
| `--sub-lang en` | Specify subtitle language (English) |
| `--no-playlist` | Download this video only, ignore playlist |
| `-a urls.txt` | Read URLs from a text file (batch mode) |
| `-r 1M` | Rate limit to 1 MB/s |
| `--cookies-from-browser chrome` | Use browser cookies (requires owner authorization) |
| `--no-download` | Inspect metadata only — do not download |

### Calling yt-dlp from Python

```python
# yt-dlp can also be used as a Python library
import yt_dlp

def download_audio(url: str, output_dir: str = "output") -> None:
    """
    Download audio as MP3.
    ⚠️ Before calling: confirm the owner has explicitly agreed,
       the URL is publicly accessible, and the intended use is compliant.
    """
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{output_dir}/%(title)s.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': False,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)  # inspect first
        print(f"Title: {info.get('title')}")
        print(f"Duration: {info.get('duration')} seconds")
        # After the owner confirms, change download=False to download=True
        # ydl.download([url])
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "download public podcast audio" plan — produce commands + Python script + compliance statement.**

Chosen scenario: the owner wants to download 5 episodes of a public podcast (e.g., a public Bilibili video series) as local MP3 files for offline personal listening.

You need to complete:

1. **Write a complete plan**, including:
   - How to use `--no-download` + `--list-formats` to scout first, not download blindly
   - How to write 5 URLs into `urls.txt`
   - A complete yt-dlp command to batch-download as MP3
   - Output directory `output/`, file names using the `%(title)s.mp3` template

2. **Write a Python library version**: use the `yt_dlp` library for the same functionality, but default to `download=False` (inspect first), with a comment marking "uncomment this line after the owner confirms."

3. **Write acceptance criteria:**
   - `output/` directory contains 5 `.mp3` files
   - Each file is > 1 MB (non-empty, non-error)
   - Use `ffprobe` to verify each file has an audio stream and duration > 0

4. **Write a copyright and compliance checklist:**
   - [ ] Content is publicly visible (no paid subscription required)
   - [ ] Intended use is personal study / backup — no redistribution
   - [ ] Platform terms have been reviewed (or owner has acknowledged and accepted the risk)
   - [ ] Owner has explicitly agreed to execute the download

5. **Write safety notes:**
   - Both `pip install yt-dlp` and the actual `yt-dlp` command **require the owner's confirmation first**
   - Do not use `--cookies-from-browser` unless the owner explicitly authorizes it (it reads browser cookies)
   - Do not crawl any site or send high-frequency requests

6. **Distill a skill card** to `agent-school/skills/yt-dlp-download.md`.

---

## 🎓 Pass criteria

- [ ] You wrote a complete scout → batch-download command chain (including `--no-download` first, `-a urls.txt` for batch)
- [ ] You wrote a Python library version that does not auto-execute downloads by default
- [ ] You wrote a copyright/compliance checklist and can clearly articulate what's compliant and what's not
- [ ] You understand why merging video/audio requires ffmpeg, and can explain how the two tools collaborate
- [ ] Distilled 1 skill card into [`agent-school/skills/yt-dlp-download.md`](../../../skills/yt-dlp-download.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card. This completes the full tool-course track!

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: downloading public audio/video with yt-dlp

- **When to use**: when the owner needs to download public content from a public platform to local storage (personal study / backup)
- **From**: Lesson T18 yt-dlp

## Steps
1. Compliance check: is the content public? is the use lawful? does the owner agree? → all three "yes" before proceeding
2. Install: pip install yt-dlp (ask the owner first) + ffmpeg (see T17)
3. Scout: yt-dlp --no-download --list-formats "URL"
4. Download audio: yt-dlp -x --audio-format mp3 -o "output/%(title)s.%(ext)s" "URL"
5. Batch: yt-dlp -a urls.txt -o "output/%(title)s.%(ext)s"

## Verification
- output/ contains the expected .mp3/.mp4 files, each > 1 MB
- ffprobe confirms each file has an audio stream with duration > 0

## Notes
- Public content only; no redistribution; follow platform terms
- ffmpeg is required to merge high-quality video + audio tracks
- --no-playlist prevents accidentally downloading an entire playlist
- Every new URL or new use case requires fresh confirmation from the owner
- Both pip install and actual execution require the owner's confirmation first
```
