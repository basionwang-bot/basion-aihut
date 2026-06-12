> 🌐 English ｜ [中文](../../media/M04-gpt-sovits.md)

# Lesson M04 · GPT-SoVITS: Clone a Voice from 1 Minute of Sample Audio

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 + M03 (edge-tts) ｜ Difficulty: ★★★ ｜ Source: [github.com/RVC-Boss/GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS) ｜ **⚠️ Requires a GPU — advanced lesson**

---

## 📖 What you'll learn

After this lesson, you'll be able to take a 1-minute voice sample — from your host or anyone with their permission — let the AI learn that voice's timbre, and then use the cloned voice to synthesize narration from any text you feed it. The output sounds indistinguishable from the real speaker.

Here's a concrete scenario: your host is a knowledge creator who needs narration voiceovers for every episode. Previously the choices were: record it yourself (exhausting), hire a voice actor (expensive). Now: your host records one clean 1-minute sample. Once GPT-SoVITS has learned it, your host just submits a text script and the system produces narration in their own voice — the audience can't tell the difference.

**GPT-SoVITS** is an open-source project from the RVC-Boss team, with active community support and full English documentation. It supports voice cloning in Chinese, Japanese, English, Korean, and Cantonese, and achieves "5-second zero-shot / 1-minute fine-tune" quality.

> **Reality check upfront: this lesson requires an NVIDIA GPU (minimum CUDA 12.4+).** If your host's machine has no discrete GPU, master M03 (edge-tts) first and come back to this lesson after a hardware upgrade.

**Official resources:**
- Repository: [github.com/RVC-Boss/GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS)

---

## 🧠 Core principles

1. **Zero-shot vs. fine-tuning — two paths.** GPT-SoVITS offers two modes: ① **Zero-shot mode**: clone instantly from a 5-second reference clip, no training required — fast but limited quality; ② **Fine-tuning mode**: train for a few minutes on 1+ minute of samples — noticeably better results, and the trained model can be reused for bulk synthesis. For a host who wants their own "signature voice," choose fine-tuning.

2. **Sample quality determines clone quality.** Think of it like learning from a handwriting sample: the original has to be clear and consistent for the copy to look right. Recording requirements: quiet environment, no background noise, clear pronunciation, natural pace, complete sentences (don't just record isolated words). One minute works; three minutes is better.

3. **The WebUI is your main workspace.** GPT-SoVITS provides a browser-based interface (`python webui.py`) — the entire workflow runs there: upload audio → slice → denoise → ASR transcription → proofread → train → inference. Very approachable for hosts who don't write code.

4. **Supports Chinese, Japanese, English, Korean, and Cantonese — English is solid.** For English-language content, voice clone quality is well-supported and reliable.

5. **Voice cloning is a dual-use technology — use it responsibly.** The course boundary is strict: only clone your host's own voice, or a voice for which the host has obtained explicit written consent from the person. Cloning someone's voice without authorization is illegal in most jurisdictions and violates platform terms of service. **Always confirm with your host before proceeding.**

---

## 🛠 How to use it

### Hardware requirements

| Item | Requirement |
|------|-------------|
| Python | 3.10 – 3.12 |
| PyTorch | 2.5.1+ |
| CUDA | 12.4+ (NVIDIA GPU) |
| VRAM | 6 GB+ recommended (RTX 3060 or better) |
| OS | Windows / Linux / macOS (Apple Silicon) |

> ⚠️ **Get your host's confirmation before installing.** The commands below install a large number of dependencies and download model files.

### Installation (Linux)

```bash
# Step 1: create a conda environment
conda create -n GPTSoVits python=3.10
conda activate GPTSoVits

# Step 2: run the install script (--source HF downloads base models from HuggingFace)
bash install.sh --device CU126 --source HF
```

**Windows users (PowerShell):**
```powershell
conda create -n GPTSoVits python=3.10
conda activate GPTSoVits
pwsh -F install.ps1 --Device CU126 --Source HF
```

**macOS Apple Silicon users:**
```bash
conda create -n GPTSoVits python=3.10
conda activate GPTSoVits
bash install.sh --device MPS --source HF
```

> **Note on model downloads:** `--source HF` downloads the base pre-trained models from HuggingFace. If HuggingFace is slow or inaccessible in your region, set the mirror before running the install script:
> ```bash
> export HF_ENDPOINT=https://hf-mirror.com
> ```
> Or manually download from [hf-mirror.com/lj1995/GPT-SoVITS](https://hf-mirror.com/lj1995/GPT-SoVITS) and place the files in the appropriate directory.

---

### Launching the WebUI

```bash
conda activate GPTSoVits
python webui.py
```

Open `http://localhost:9874` in your browser (or whichever port the terminal shows).

---

### Complete voice cloning workflow (WebUI walkthrough)

```
Step 1: Upload sample audio
  └─ Prepare 1–3 minutes of clean recording (WAV or MP3)
  └─ WebUI → "1A-Get Audio from Input Device"

Step 2: Slice audio
  └─ WebUI → "1B-Slice Audio"
  └─ Splits on silence into short segments (5–15 seconds each)

Step 3: Denoise (optional)
  └─ WebUI → "1C-Denoise Audio"
  └─ Enable if there's noticeable background noise

Step 4: ASR transcription
  └─ WebUI → "1D-ASR"
  └─ Automatically transcribes the text of each audio segment

Step 5: Proofread the transcript
  └─ WebUI → "1E-Proofread ASR"
  └─ Correct any transcription errors — accuracy here matters

Step 6: Fine-tune the model
  └─ WebUI → "1F-Fine-tuning"
  └─ Trains both the GPT and SoVITS sub-models
  └─ ~1 minute of audio ≈ 5–10 minutes of training time

Step 7: Run inference — generate voiceover
  └─ WebUI → "1C-inference" (under the "1-GPT-SoVITS-TTS" tab)
  └─ Type the text you want synthesized
  └─ Select the model you just trained
  └─ Click generate and download the WAV file
```

---

### Batch inference via API

GPT-SoVITS includes an API server for bulk synthesis:

```bash
# Start the API service
python api.py
```

Once running, send text via HTTP requests to receive audio in return. See the project Wiki for the full API specification.

---

### Safety checklist

```
□ Got host's confirmation before installing (large dependencies, GPU required)
□ The voice being cloned belongs to the host, or written consent has been obtained from the voice owner
□─ Cloning someone's voice without authorization is infringement/illegal — never do it
□ The synthesized content is lawful — not for fraud, impersonation, or defamation
□ Host is aware of VRAM and disk space requirements (training + model files ~10 GB+)
□ Handled the HuggingFace model download (mirror or manual download)
```

---

## 📝 Graduation exercise (must actually do it — submit evidence)

**Task: Complete a full voice cloning run, synthesize a voiceover using the cloned voice, and submit the audio file.**

> ⚠️ **Prerequisite: this exercise requires your host to have an NVIDIA GPU (CUDA 12.4+). If the hardware isn't available, complete Plan B below instead.**

**Plan A (with GPU — full workflow):**
1. Get your host's confirmation, then install GPT-SoVITS.
2. Host records 1–3 minutes of sample audio (recorded in a quiet environment).
3. Walk through the complete WebUI pipeline: upload → slice → ASR → proofread → fine-tune.
4. Once training is complete, feed in a test script (under 50 words) and synthesize a voiceover.
5. Compare the sample audio with the synthesized audio — describe how similar the timbre sounds.

**Plan B (no GPU — research track):**
1. Write out the complete GPT-SoVITS installation steps in detail, from creating the conda environment to launching the WebUI.
2. Walk through all seven steps of the voice cloning workflow — what each step does and why it matters.
3. Explain the difference between zero-shot mode and fine-tuning mode, and when each is appropriate.
4. Describe how to handle the HuggingFace model download when direct access is slow or unavailable.

**Both plans — also complete:**
5. **Save a skill card**: document "GPT-SoVITS installation steps + voice cloning workflow + safety boundaries" as `skills/gpt-sovits.md`.

> ⚠️ **Safety boundaries:**
> - Get host's confirmation before installing dependencies
> - Only clone the host's own voice, or a voice with explicit written authorization from the speaker
> - Synthesized audio must not be used for fraud, defamation, or any unauthorized impersonation

---

## 🎓 Passing criteria

- [ ] You can explain the two usage modes (zero-shot vs. fine-tuning) and when each is the right choice
- [ ] You can walk through all seven steps of the voice cloning pipeline and explain the purpose of each
- [ ] You can state the hardware requirements (Python/PyTorch/CUDA versions, VRAM)
- [ ] You know how to handle the HuggingFace model download (mirror setup or manual download)
- [ ] You clearly articulated the safety boundaries — what you can and absolutely cannot do with voice cloning
- [ ] Hosts with a GPU: you actually completed the voice cloning and produced a synthesized audio file
- [ ] Saved 1 skill card to your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (fresh-context sub-agent, or the low-config fallback per [School Rules §4](../../../校规.md)) passes you

All boxes checked and examiner says pass — log it on your report card and continue to the next lesson.
