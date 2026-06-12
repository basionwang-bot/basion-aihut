> 🌐 English ｜ [中文](../../media/M06-deepfilternet.md)

# Lesson M06 · DeepFilterNet: One Command to Denoise Noisy Recordings to Broadcast Quality

> **Student: You, the AI agent currently enrolled** ｜ Prerequisites: J01–J07 foundations ｜ Difficulty: ★★☆ ｜ Source: [github.com/Rikorose/DeepFilterNet](https://github.com/Rikorose/DeepFilterNet)

---

## 📖 What You Will Learn

After this lesson, you can help your owner take a batch of noisy recordings — café background chatter, air-conditioning hum, keyboard clatter from an open-plan office — **clean them all in one pass and deliver near-studio-quality voice audio** ready for the editing pipeline.

Picture this: your owner records a podcast episode at home while the air conditioner drones away in the background. The editor listens back and groans. Previously the options were: shell out for iZotope RX (professional noise-reduction software, several hundred dollars), or manually tweak EQ band by band. With **DeepFilterNet**, you feed the recording into a single command, and a clean audio file comes out in seconds — background noise nearly gone, the voice crystal clear.

**DeepFilterNet** is an open-source speech enhancement tool developed by a German research institution. It uses deep learning to perform noise reduction across the full 48 kHz frequency range, achieving state-of-the-art results on public benchmarks. It runs locally, works on CPU, and is dual-licensed (MIT/Apache 2.0).

**Official resources:**
- Project repo: [github.com/Rikorose/DeepFilterNet](https://github.com/Rikorose/DeepFilterNet)
- PyPI: [pypi.org/project/deepfilternet/](https://pypi.org/project/deepfilternet/)

---

## 🧠 Core Principles

1. **The intuition behind "deep filtering": tell apart "a person speaking" from "background noise."** DeepFilterNet analyzes each audio frame in the frequency domain. A neural network has learned which frequency components are voice and which are noise, and then suppresses the noise components. Think of it as a smart equalizer — except it doesn't need any manual tweaking; it figured out the settings by learning.

2. **WAV + 48 kHz only.** This is the single most important constraint — DeepFilterNet only processes WAV files at a 48 kHz sample rate. MP3, M4A, or WAV files at a different sample rate **must be converted with FFmpeg first**, or the tool will error out. Conversion command:
   ```bash
   ffmpeg -i input.mp3 -ar 48000 input_48k.wav
   ```

3. **CPU works fine; GPU is faster.** The PyPI install uses CPU by default. If your owner has an NVIDIA GPU, installing the PyTorch GPU build speeds things up. For typical podcast or voiceover recordings, CPU speed is already sufficient (roughly 10:1 real-time ratio — a 10-minute recording processes in about 1 minute).

4. **Pre-compiled binaries are the simplest path.** If you'd rather not deal with Python dependencies, go to the [releases page](https://github.com/Rikorose/DeepFilterNet/releases) and download the binary for your OS. Unzip and run — zero configuration.

5. **Batch processing is the killer feature.** The CLI accepts multiple files in one command, processing an entire folder of recordings in one shot. For owners who produce podcasts, courses, or interview series, this can save one to two hours every week.

---

## 🛠 How to Do It

### Install Method 1: PyPI (recommended — includes Python API)

> ⚠️ **Ask your owner for confirmation before installing.**

```bash
pip install deepfilternet
```

After installation, verify it works:
```bash
deepFilter --help
```

### Install Method 2: Pre-compiled Binary (no Python needed)

Go to [github.com/Rikorose/DeepFilterNet/releases](https://github.com/Rikorose/DeepFilterNet/releases), download the binary package for your OS, and unzip it to get the `deep-filter` executable.

---

### Pre-step: Convert Audio Format

> ⚠️ **DeepFilterNet only accepts WAV at 48 kHz. Any other format must be converted first.**

```bash
# MP3 to WAV at 48 kHz (requires FFmpeg)
ffmpeg -i recording.mp3 -ar 48000 recording_48k.wav

# M4A to WAV at 48 kHz
ffmpeg -i recording.m4a -ar 48000 recording_48k.wav

# Already WAV but wrong sample rate
ffmpeg -i recording_44k.wav -ar 48000 recording_48k.wav
```

---

### Core Denoising Commands

**Process a single file (PyPI version)**
```bash
deepFilter recording_48k.wav --output-dir ./enhanced
```
Output: `./enhanced/recording_48k.wav`

**Process a single file (binary version)**
```bash
deep-filter -o ./enhanced recording_48k.wav
```

**Batch-process multiple files**
```bash
deepFilter ep01_48k.wav ep02_48k.wav ep03_48k.wav --output-dir ./enhanced
```

**Specify model version (default is DeepFilterNet2; DeepFilterNet3 also available)**
```bash
deepFilter recording_48k.wav -m DeepFilterNet3 --output-dir ./enhanced
```

---

### Python API — Embedding in a Pipeline

```python
import torch
import torchaudio
from df import enhance, init_df

# Initialize model (auto-downloads on first run, ~30 MB)
model, df_state, _ = init_df()

# Load audio (must be 48 kHz WAV)
audio, sr = torchaudio.load("recording_48k.wav")

# Denoise
enhanced_audio = enhance(model, df_state, audio)

# Save
torchaudio.save("recording_enhanced.wav", enhanced_audio, sr)
print("Denoising complete!")
```

---

### Complete Podcast Denoising Workflow

```
① Owner records raw audio (MP3/M4A/WAV, any sample rate)
     ↓
② Batch-convert to WAV at 48 kHz with FFmpeg
   ffmpeg -i input.mp3 -ar 48000 input_48k.wav
     ↓
③ Batch-denoise with DeepFilterNet
   deepFilter *_48k.wav --output-dir ./enhanced
     ↓
④ Clean WAV files are in ./enhanced/
     ↓
⑤ Import into editing software (DaVinci Resolve / Audacity / Adobe Premiere) for further editing
     ↓
⑥ Export final product for publishing (podcast / video / course)
```

---

### Safety Checklist

```
□ Asked owner for confirmation before installing
□ Audio being processed belongs to the owner or has been authorized for processing
□ Audio format has been converted to WAV at 48 kHz (if not, inform the owner)
□ Owner has been told where the denoised files are saved
□ Original files are NOT deleted (denoised output goes to a separate directory)
```

---

## 📝 Graduation Quiz (Must Actually Do — Submit Evidence)

**Task: batch-denoise a set of noisy recordings, and deliver a before/after comparison plus the output files.**

1. **Gather source material:** confirm with your owner that you have 2–3 recordings with audible background noise (phone mic, conference mic, home recording — anything works).

2. **Format conversion:** use FFmpeg to convert the recordings to WAV at 48 kHz. Record the conversion commands.

3. **Install and run DeepFilterNet:** after getting owner confirmation, install it and batch-denoise all files.

4. **Compare before and after:**
   - File size comparison between original and denoised files
   - Owner's listening verdict (is the noise gone? is the voice clear?)

5. **Skill card:** distill "DeepFilterNet installation + FFmpeg conversion commands + batch denoising command + complete workflow" into `skills/deepfilternet.md`.

> ⚠️ **Safety boundaries:**
> - Ask owner for confirmation before installing
> - Do not process recordings that contain other people's private conversations unless the owner explicitly authorizes it

---

## 🎓 Passing Criteria

- [ ] You can explain how DeepFilterNet works (deep learning, frequency-domain noise reduction)
- [ ] You know it only accepts WAV at 48 kHz, and you can write the FFmpeg conversion command
- [ ] You have successfully run the batch denoising command (`deepFilter file1.wav file2.wav --output-dir`)
- [ ] You can describe the audio quality change before and after denoising (with owner listening feedback)
- [ ] You know how to call the DeepFilterNet API from a Python script
- [ ] You have deposited 1 skill card in your dorm's [`skills/`](../../../skills/)
- [ ] An **independent examiner** (fresh-context sub-agent, or the fallback method in [School Rules §4](../../../校规.md)) has ruled "Pass"

All boxes checked and examiner says pass — log it on your report card and move on to the next lesson.
