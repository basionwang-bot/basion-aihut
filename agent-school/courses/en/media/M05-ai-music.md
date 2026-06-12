> 🌐 English ｜ [中文](../../media/M05-ai-music.md)

# Lesson M05 · YuE: AI Composition — Generate BGM From a Theme

> **Student: You, the AI agent currently enrolled** ｜ Prerequisites: J01–J07 foundations ｜ Difficulty: ★★★★ ｜ Source: [github.com/multimodal-art-projection/YuE](https://github.com/multimodal-art-projection/YuE) ｜ **⚠️ Advanced/optional: high VRAM requirements — if you don't have a high-end GPU, see the alternatives at the end**

---

## 📖 What You Will Learn

After this lesson, you can help your owner generate a complete song with vocals — or a pure instrumental BGM track — in a specified style, with given lyrics and mood, using AI. From lyrics input to final MP3, your owner doesn't need to know how to play an instrument, write a score, or sing.

Picture this: your owner needs an original intro theme for a video. Previously the options were: hire a musician (expensive), use licensed music (restricted), or loop a stock track (lazy). With **YuE (乐)**, you type "pop style, inspirational theme, female vocal, lyrics: …" and a few minutes later a fully arranged song with vocals is ready.

**YuE** is an open-source Chinese AI music model from the Tsinghua / CAS team. The name comes from the character 乐, meaning both "music" and "joy." It supports Chinese, English, Cantonese, Japanese, and Korean, is licensed under Apache 2.0, and is commercially usable.

> ⚠️ **Note on Meta MusicGen:** Meta also has an AI music model, [MusicGen](https://github.com/facebookresearch/audiocraft). Important: MusicGen uses a **CC BY-NC (non-commercial)** license — **audio generated with it cannot be used for commercial purposes**. YuE is Apache 2.0 and commercially usable. If your owner has commercial needs, choose YuE.

**Official resources:**
- Project repo: [github.com/multimodal-art-projection/YuE](https://github.com/multimodal-art-projection/YuE)
- HuggingFace models: [huggingface.co/m-a-p](https://huggingface.co/m-a-p)

---

## 🧠 Core Principles

1. **"Lyrics + style tags" is YuE's input language.** Unlike ChatGPT's free-form natural language, YuE uses structured prompts: genre tags (style, instruments, mood, vocal gender, timbre) plus structurally marked lyrics (`[verse]` / `[chorus]` / `[bridge]`). To get the sound you want, describe it in this "tag language."

2. **VRAM requirements are steep.** This is not a typical consumer-grade task:
   - Generating 30 seconds of audio: at least 24 GB VRAM (or use quantization tools to reduce footprint)
   - Generating a full song (4+ segments): requires 80 GB VRAM (A100/H800-class, or 4× RTX 4090)
   - **A single RTX 4090 takes roughly 6 minutes to produce one 30-second segment**
   - If the available GPU does not meet these thresholds, use an online platform instead (see below)

3. **Two generation modes, each with its use case.** ① CoT mode (Chain-of-Thought): the model "thinks" before generating — more stable quality. ② ICL mode (In-Context Learning): provide a reference audio clip and the model generates a new piece in a similar style. Use ICL when you want "something that sounds like this song."

4. **Licensing matters.** YuE itself is Apache 2.0 and commercially usable, but ownership of generated output still depends on the user agreement of whatever platform hosts the service. Also, if you provide someone else's song as an ICL reference, confirm that you have the rights to use it.

5. **Model download is large.** YuE's models are hosted on HuggingFace; the first run will automatically pull roughly 10–20 GB of model files. Plan for this in advance — use a mirror or download manually if HuggingFace is slow in your region.

---

## 🛠 How to Do It

### System Requirements

| Item | Requirement |
|------|-------------|
| OS | Linux / WSL (Windows Subsystem for Linux) |
| Python | 3.8 |
| CUDA | 11.8+ |
| GPU VRAM | 24 GB (basic) / 80 GB (full song) |

> ⚠️ **Ask your owner for confirmation before installing.** The steps below will download roughly 5–20 GB of dependencies and model files.

### Installation

```bash
# Step 1: create the environment
conda create -n yue python=3.8
conda activate yue

# Step 2: install PyTorch (CUDA 11.8)
conda install pytorch torchvision torchaudio cudatoolkit=11.8 -c pytorch -c nvidia

# Step 3: clone the repo
git clone https://github.com/multimodal-art-projection/YuE.git
cd YuE

# Step 4: install dependencies
pip install -r requirements.txt

# Step 5: install Flash Attention 2 (required — improves memory efficiency)
pip install flash-attn --no-build-isolation

# Step 6: download the audio codec model
cd inference/
git clone https://huggingface.co/m-a-p/xcodec_mini_infer
```

> **If HuggingFace is slow in your region, use a mirror:**
> ```bash
> # Route all HuggingFace downloads through a mirror
> export HF_ENDPOINT=https://hf-mirror.com
> # Then replace the git clone above with:
> git clone https://hf-mirror.com/m-a-p/xcodec_mini_infer
> ```
> The main model (7B-class) works the same way — find the corresponding repo at hf-mirror.com/m-a-p and clone from there.

---

### Preparing Input Files

**genre.txt (style tags — 5 dimensions, in English)**
```
pop electric_guitar emotional female powerful
```

**lyrics.txt (lyrics with structural markers)**
```
[verse]
Every morning sunlight floods through the pane
I carry my dreams and set out once again

[chorus]
Keep moving forward, no looking back
The road ahead is mine to blaze my own track
```

---

### Running Generation (CoT Mode)

```bash
cd YuE/inference/
python infer.py \
    --cuda_idx 0 \
    --stage1_model m-a-p/YuE-s1-7B-anneal-zh-cot \
    --stage2_model m-a-p/YuE-s2-1B-general \
    --genre_txt ../prompt_egs/genre.txt \
    --lyrics_txt ../prompt_egs/lyrics.txt \
    --run_n_segments 2 \
    --stage2_batch_size 4 \
    --output_dir ../output \
    --max_new_tokens 3000 \
    --repetition_penalty 1.1
```

Output files are placed in `../output/` as WAV files.

---

### Alternatives When a High-End GPU Is Not Available

If your owner's machine does not have 24 GB+ VRAM, the following online platforms let you experience YuE or similar models:

| Platform | Notes | Access |
|----------|-------|--------|
| [Suno](https://suno.com) | AI song generation, multilingual including Chinese | Free tier available; account required |
| [Udio](https://www.udio.com) | AI music generation, strong style control | Free tier available; account required |
| [Soundraw](https://soundraw.io) | Royalty-free AI BGM, good for video use | Subscription-based |
| Google Colab + YuE | Run YuE on Colab's A100 GPU | Google account required |

> **Tip:** Online platforms are best for quick results. Local deployment is better when you need privacy, batch generation, or full control over the pipeline.

---

### Safety Checklist

```
□ Asked owner for confirmation before installing (high VRAM and ~20 GB+ disk required)
□ If using ICL reference audio, confirmed the reference audio's copyright permissions
□ Owner is aware of the YuE Apache 2.0 license for commercial use of generated music
□ If using MusicGen instead, owner has been clearly informed of its CC BY-NC non-commercial restriction
```

---

## 📝 Graduation Quiz (Must Actually Do — Submit Evidence)

**Task: generate a BGM track or complete song segment on a given theme, and deliver the audio file.**

**Option A (have a qualifying GPU — full pipeline):**
1. Prepare `genre.txt` (pick a style) and `lyrics.txt` (write 4–8 lines with structural markers)
2. Get owner confirmation, then install and run YuE
3. Generate 2 segments (roughly 30–60 seconds of audio)
4. Describe the output: does the style match? How is the vocal quality?

**Option B (no qualifying GPU — research + online alternative):**
1. Write out the full YuE installation and run commands in detail
2. Explain the 5-dimension tag format for `genre.txt` and the structural markers for `lyrics.txt`
3. Explain the difference between CoT and ICL modes
4. Generate a piece of AI music using Suno or Udio and record a screenshot
5. Explain the difference between YuE (Apache 2.0) and MusicGen (CC BY-NC) for commercial use

**Both options must also complete:**
6. **Skill card:** distill "YuE installation steps + input format + run commands + online alternatives + licensing notes" into `skills/yue-music.md`.

> ⚠️ **Safety boundaries:**
> - Ask owner for confirmation before installing (high VRAM and disk requirements)
> - ICL reference audio must have confirmed copyright permissions
> - Confirm YuE license terms before any commercial release

---

## 🎓 Passing Criteria

- [ ] You can clearly state YuE's VRAM requirements and know the alternatives when a high-end GPU is not available
- [ ] You can write correct `genre.txt` and `lyrics.txt` formats (including structural markers)
- [ ] You can explain the difference between CoT and ICL generation modes
- [ ] You know that MusicGen is CC BY-NC (non-commercial) and YuE is Apache 2.0 (commercially usable)
- [ ] You have successfully run the generation (with GPU) or completed generation on an alternative platform (without GPU)
- [ ] You have deposited 1 skill card in your dorm's [`skills/`](../../../skills/)
- [ ] An **independent examiner** (fresh-context sub-agent, or the fallback method in [School Rules §4](../../../校规.md)) has ruled "Pass"

All boxes checked and examiner says pass — log it on your report card and move on to the next lesson.
