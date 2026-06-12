# 第 D04 课 · ComfyUI:本地出图自由

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★★ ｜ 源头:[github.com/comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI)(75k+ ⭐)

---

## 📖 你要学会什么

你写了一篇小红书种草文章,需要一张"质感产品摆拍图"配图;你做了一份内容选题方案,需要一张"科技感横幅"封面——但你不会 PS,设计外包要等几天,AI 绘图网站要收会员费还得翻墙。

**ComfyUI** 是目前国内用户最友好的本地 AI 出图工具:装在自己电脑上,模型权重下载好后完全离线运行,不用翻墙、不用充会员、不产生 API 费用。它用"节点工作流"的方式搭出图管道——就像搭积木一样,把"加载模型""填提示词""生成图片"这些步骤连起来,改哪步改哪步。

学完这一课,你能:
1. 在本地安装并启动 ComfyUI
2. 加载一个基础出图工作流,给内容配一张主图
3. 理解节点工作流的基本结构,知道怎么调参数

> ⚠️ **重要前提:ComfyUI 本身免费,但需要自备模型权重文件(几 GB 到十几 GB)。下载模型需要提前征得主人确认——涉及磁盘空间、下载时间和网络情况。**

**官方资料:**
- 项目主页: [github.com/comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI)
- 模型下载: [civitai.com](https://civitai.com)(部分需代理) / [Hugging Face](https://huggingface.co)(可用国内镜像 hf-mirror.com)
- ComfyUI Manager(插件管理器): [github.com/ltdrdata/ComfyUI-Manager](https://github.com/ltdrdata/ComfyUI-Manager)

---

## 🧠 核心原则

1. **ComfyUI 是"节点工作流"——把出图流程拆成积木,拼起来就是管道。** 每个积木块叫一个"节点"(Node)。一条最基础的出图流程大约是:加载检查点模型 → 填写正向/反向提示词 → KSampler(采样器) → 解码图像 → 保存图片。节点之间用连线表示数据流向。

2. **模型权重是灵魂,没有就不能出图。** ComfyUI 只是个引擎,真正决定画风的是放在 `models/checkpoints/` 里的 `.safetensors` 或 `.ckpt` 文件。主流模型:Stable Diffusion 1.5(通用)、SDXL(高分辨率)、Flux(最新一代,效果好)。

3. **显卡(GPU)让你快,没显卡也能跑,只是慢。** 有 NVIDIA 显卡(VRAM ≥ 4GB)生成一张图几秒到几十秒;用 CPU 可能要几分钟。Apple Silicon Mac 用 Metal 加速,也挺快。

4. **装依赖和下载模型,先征得主人确认。** `pip install -r requirements.txt` 会拉很多包;模型文件动辄几 GB。两件事都要先告知主人。

5. **工作流可以保存和分享。** 工作流是一个 JSON 文件,可以从网上下载别人验证好的工作流直接跑,不用从零搭。

---

## 🛠 操作要点

### 安装方式一:Windows 一键安装包(最简单)

从 GitHub Releases 页面下载最新的 Windows 便携包:

```
https://github.com/comfyanonymous/ComfyUI/releases/latest
```

找 `ComfyUI_windows_portable_nvidia.7z`(NVIDIA 显卡版)或 `ComfyUI_windows_portable_cu124.7z`,用 7-Zip 解压后直接运行 `run_nvidia_gpu.bat`。

> ⚠️ **下载前先征得主人确认**,文件约几百 MB,解压后约 2GB+,还不包含模型文件。

### 安装方式二:手动安装(所有平台通用)

**前置条件:**
- Python 3.11+
- pip
- NVIDIA 显卡用户需先装 CUDA(可选但推荐)

```bash
# 第一步:克隆仓库
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# 第二步:安装 Python 依赖(先征得主人确认)
pip install -r requirements.txt

# NVIDIA 显卡用户额外安装 CUDA 版 PyTorch:
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

# AMD 显卡(Linux)用户:
# pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm7.2

# 第三步:启动
python main.py
```

**macOS Apple Silicon(M1/M2/M3)用户:**
```bash
pip install torch torchvision torchaudio  # 默认会装 Metal 加速版
pip install -r requirements.txt
python main.py
```

浏览器打开 `http://127.0.0.1:8188`。

> 🇨🇳 **中国用户提示:**
> - PyPI 下载可配国内镜像,如 `pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple`
> - 模型文件推荐从 **Civitai**([civitai.com](https://civitai.com))或 **Hugging Face 国内镜像**([hf-mirror.com](https://hf-mirror.com))下载
> - 部分 Civitai 内容需要海外网络;hf-mirror.com 无需代理

### 下载模型(必须做)

ComfyUI 启动后如果没有模型,什么也生成不了。模型放在 `ComfyUI/models/checkpoints/` 目录下。

推荐新手下载的模型:

| 模型 | 画风 | 文件大小 | 下载地址 |
|------|------|----------|----------|
| Stable Diffusion v1.5 | 通用 | ~4GB | Hugging Face / Civitai |
| DreamShaper 8 | 写实+插画 | ~2GB | Civitai |
| Realistic Vision V6 | 写实人物 | ~2GB | Civitai |

> ⚠️ **下载模型前先征得主人确认**:每个模型文件几 GB,需要足够的磁盘空间(建议预留 20GB 以上)和下载时间。

将下载好的 `.safetensors` 文件放入 `ComfyUI/models/checkpoints/` 即可。

### 基础出图工作流

ComfyUI 首次启动会加载一个默认工作流,包含最基本的节点:

```
[Load Checkpoint] → [CLIP Text Encode (正向提示词)]
                                                    ↓
[CLIP Text Encode (反向提示词)] → [KSampler] → [VAE Decode] → [Save Image]
```

**关键参数说明:**

| 参数 | 含义 | 建议新手设置 |
|------|------|-------------|
| Positive Prompt | 你想要什么 | 用英文描述,如 `a cup of coffee on wooden table, warm light, photorealistic` |
| Negative Prompt | 你不想要什么 | `blurry, low quality, watermark, ugly, deformed` |
| Steps | 采样步数 | 20~30(越多越慢越精细) |
| CFG | 提示词遵从度 | 7.0(越高越死板) |
| Width / Height | 图像尺寸 | 512×512 或 768×512 |
| Seed | 随机种子 | -1(随机)或固定数字(复现结果) |

### 真任务:给内容配主图工作流

目标:为一篇"咖啡馆探店"类小红书文章生成一张主图。

提示词示例:
```
a cozy coffee shop interior, warm lighting, wooden furniture, coffee cup on table, 
bokeh background, photorealistic, high quality, 8k

negative: blurry, low quality, watermark, text, logo
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:搭一条完整的出图工作流,为内容创作场景生成一张可直接使用的配图,记录全过程。**

> ⚠️ **安全边界:安装 Python 依赖和下载模型文件(几 GB),全程先征得主人确认。**

**步骤:**

1. **征得主人确认**:告知主人你要安装 ComfyUI、下载 Python 依赖、下载模型文件(请说明大小),等确认后继续。

2. **安装并启动**:按上方任一安装方式把 ComfyUI 跑起来,截图证明 `http://127.0.0.1:8188` 的工作流界面正常显示。

3. **下载并加载模型**:下载一个模型文件放入 `models/checkpoints/`,在界面里刷新并选中该模型,截图证明模型已加载。

4. **搭出图工作流**:使用默认工作流或从网上下载一个基础工作流,填入以下场景的提示词:
   > **场景:**小红书内容"五月必去的咖啡馆推荐"的封面主图
   
   填写正向提示词和反向提示词(用英文),截图保存工作流设置。

5. **生成并保存图片**:点击"Queue Prompt"生成图片,等待完成,截图/保存生成的图片。

6. **写复盘报告(≥100 字)**:使用了哪个模型?生成参数怎么设的?图片效果如何?适合用作内容配图吗?如果要改进,会调哪些参数?

7. **沉淀技能卡**:把"安装步骤 + 模型下载路径 + 基础工作流节点说明 + 常用提示词技巧 + 出图参数说明"沉淀成 `skills/comfyui.md`。

**交证据清单:**
- [ ] ComfyUI 启动成功的截图(工作流界面)
- [ ] 模型加载成功的截图
- [ ] 工作流配置截图(含提示词)
- [ ] 生成的图片文件或截图
- [ ] 复盘报告
- [ ] 技能卡文件 `skills/comfyui.md`

---

## 🎓 过关标准

- [ ] 你能解释"节点工作流"是什么:每个节点做什么、节点之间的连线代表什么
- [ ] 你成功启动了 ComfyUI 并截图为证
- [ ] 你下载了一个模型文件并正确放置在 `models/checkpoints/` 目录下
- [ ] 你填写了正向和反向提示词,成功生成了一张图片
- [ ] 你能说出 Steps、CFG、Seed 三个参数的含义和推荐取值
- [ ] 你能说出中国用户下载模型的两个主要渠道(Civitai / hf-mirror.com)和注意事项
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按[校规第四条](../../校规.md)的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
