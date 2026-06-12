> 🌐 English ｜ [中文](../../design/D04-comfyui.md)

# Lesson D04 · ComfyUI: Local AI Image Generation, Total Freedom

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: [github.com/comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI) (75k+ ⭐)

---

## 📖 What you'll learn

You write a product review post for Instagram and need a "high-quality flat-lay product photo" to go with it. You put together a content brief and need a "tech-banner cover image." But you don't know Photoshop, design outsourcing takes days, and AI image websites charge subscriptions and may need a VPN.

**ComfyUI** is the most flexible local AI image generation tool available: installed on your own machine, it runs completely offline once the model weights are downloaded — no proxy needed, no subscription, no API fees. It uses a "node workflow" system to build the image pipeline — like assembling building blocks, connecting "load model," "fill prompt," "generate image," and so on. Each block is individually adjustable.

After this lesson you'll be able to:
1. Install and launch ComfyUI locally
2. Load a basic image-generation workflow and create a featured image for content
3. Understand the basic structure of a node workflow and know how to tune parameters

> ⚠️ **Important prerequisite: ComfyUI itself is free, but you need model weight files (a few GB to tens of GB). Downloading models requires your owner's prior confirmation — it involves disk space, download time, and network bandwidth.**

**Official resources:**
- Project homepage: [github.com/comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI)
- Model downloads: [civitai.com](https://civitai.com) / [Hugging Face](https://huggingface.co)
- ComfyUI Manager (plugin manager): [github.com/ltdrdata/ComfyUI-Manager](https://github.com/ltdrdata/ComfyUI-Manager)

---

## 🧠 Core principles

1. **ComfyUI is a "node workflow" — break the image pipeline into building blocks and connect them.** Each block is called a "Node." A minimal generation pipeline looks roughly like: Load Checkpoint → Positive/Negative Text Encode → KSampler → VAE Decode → Save Image. Lines between nodes represent data flow.

2. **Model weights are the soul — without them nothing generates.** ComfyUI is just an engine. What determines the visual style are the `.safetensors` or `.ckpt` files in `models/checkpoints/`. Common models: Stable Diffusion 1.5 (general), SDXL (high resolution), Flux (latest generation, best quality).

3. **A GPU makes it fast; no GPU still works — just slower.** With an NVIDIA GPU (VRAM ≥ 4 GB), one image takes seconds to tens of seconds. CPU-only may take a few minutes. Apple Silicon Macs use Metal acceleration and are also reasonably fast.

4. **Installing dependencies and downloading models both require your owner's confirmation.** `pip install -r requirements.txt` pulls many packages; model files can be several GB each. Tell your owner about both before doing either.

5. **Workflows can be saved and shared.** A workflow is a JSON file — you can download verified workflows from the community and run them immediately without building from scratch.

---

## 🛠 How to do it

### Installation option 1: Windows portable package (simplest)

Download the latest Windows portable package from GitHub Releases:

```
https://github.com/comfyanonymous/ComfyUI/releases/latest
```

Find `ComfyUI_windows_portable_nvidia.7z` (for NVIDIA GPUs) or `ComfyUI_windows_portable_cu124.7z`, extract with 7-Zip, and run `run_nvidia_gpu.bat`.

> ⚠️ **Confirm with your owner before downloading** — the archive is a few hundred MB; unpacked it's 2 GB+, not counting model files.

### Installation option 2: Manual install (all platforms)

**Prerequisites:**
- Python 3.11+
- pip
- NVIDIA GPU users: install CUDA first (optional but recommended)

```bash
# Step 1: Clone the repo
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Step 2: Install Python dependencies (confirm with owner first)
pip install -r requirements.txt

# NVIDIA GPU users — install the CUDA-enabled PyTorch:
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

# AMD GPU (Linux) users:
# pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm7.2

# Step 3: Launch
python main.py
```

**macOS Apple Silicon (M1/M2/M3):**
```bash
pip install torch torchvision torchaudio  # Metal-accelerated build installs by default
pip install -r requirements.txt
python main.py
```

Then open `http://127.0.0.1:8188` in your browser.

> 🌍 **Tip:** If PyPI downloads are slow, configure a mirror: `pip install -r requirements.txt -i https://pypi.org/simple`. Model files can be downloaded from [Hugging Face](https://huggingface.co) or [Civitai](https://civitai.com).

### Download models (required)

ComfyUI can't generate anything without models. Place model files in `ComfyUI/models/checkpoints/`.

Recommended models for beginners:

| Model | Style | File size | Download |
|-------|-------|-----------|----------|
| Stable Diffusion v1.5 | General | ~4 GB | Hugging Face / Civitai |
| DreamShaper 8 | Realistic + illustration | ~2 GB | Civitai |
| Realistic Vision V6 | Realistic portraits | ~2 GB | Civitai |

> ⚠️ **Confirm with your owner before downloading models** — each file is several GB. Reserve at least 20 GB of disk space and plan for download time.

Place the downloaded `.safetensors` file in `ComfyUI/models/checkpoints/`.

### Basic image generation workflow

ComfyUI loads a default workflow on first launch, containing the essential nodes:

```
[Load Checkpoint] → [CLIP Text Encode (positive prompt)]
                                                         ↓
[CLIP Text Encode (negative prompt)] → [KSampler] → [VAE Decode] → [Save Image]
```

**Key parameters explained:**

| Parameter | Meaning | Beginner recommendation |
|-----------|---------|------------------------|
| Positive Prompt | What you want | English description, e.g. `a cup of coffee on wooden table, warm light, photorealistic` |
| Negative Prompt | What you don't want | `blurry, low quality, watermark, ugly, deformed` |
| Steps | Sampling steps | 20–30 (more = slower but finer) |
| CFG | Prompt adherence | 7.0 (higher = more rigid) |
| Width / Height | Image dimensions | 512×512 or 768×512 |
| Seed | Random seed | -1 (random) or a fixed number (for reproducibility) |

### Real task: generate a featured image for content

Goal: create a featured image for a "cozy coffee shop" type blog post.

Example prompt:
```
a cozy coffee shop interior, warm lighting, wooden furniture, coffee cup on table, 
bokeh background, photorealistic, high quality, 8k

negative: blurry, low quality, watermark, text, logo
```

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Task: Build a complete image generation workflow, produce a usable featured image for a content creation scenario, and document the entire process.**

> ⚠️ **Safety boundary: installing Python dependencies and downloading model files (several GB) both require your owner's confirmation first.**

**Steps:**

1. **Get your owner's confirmation**: tell them you're going to install ComfyUI, download Python dependencies, and download model files (specify the sizes). Wait for confirmation before continuing.

2. **Install and launch**: follow either installation method above. Take a screenshot proving `http://127.0.0.1:8188` shows the workflow UI correctly.

3. **Download and load a model**: download a model file into `models/checkpoints/`, refresh in the UI, and select the model. Screenshot proving the model is loaded.

4. **Build the generation workflow**: use the default workflow or download a community workflow. Fill in prompts for this scenario:
   > **Scenario:** a cover image for a blog post titled "Top Coffee Shops to Visit in May"
   
   Write both positive and negative prompts (in English). Screenshot the workflow configuration.

5. **Generate and save the image**: click "Queue Prompt," wait for completion, screenshot or save the generated image.

6. **Write a retrospective (≥100 words)**: which model did you use? How did you set the generation parameters? How does the image look? Is it suitable for content use? If you were to improve it, which parameters would you tweak?

7. **Deposit a skill card**: distill "install steps + model download location + basic workflow node explanation + common prompt techniques + generation parameter guide" into `skills/comfyui.md`.

**Evidence checklist:**
- [ ] Screenshot of ComfyUI launched successfully (workflow UI visible)
- [ ] Screenshot of model loaded successfully
- [ ] Screenshot of workflow configuration (including prompts)
- [ ] Generated image file or screenshot
- [ ] Retrospective report
- [ ] Skill card file `skills/comfyui.md`

---

## 🎓 Pass criteria

- [ ] You can explain "node workflow": what each node does and what the connecting lines between nodes represent
- [ ] You launched ComfyUI successfully — screenshot as proof
- [ ] You downloaded a model file and placed it correctly in `models/checkpoints/`
- [ ] You wrote positive and negative prompts and successfully generated an image
- [ ] You can explain the meaning and recommended values for Steps, CFG, and Seed
- [ ] You can name two main channels for downloading models and explain any relevant notes
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card and move on.
