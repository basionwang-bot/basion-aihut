# 第 M06 课 · DeepFilterNet:嘈杂录音一键降噪到广播级

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 基础课 ｜ 难度:★★☆ ｜ 源头:[github.com/Rikorose/DeepFilterNet](https://github.com/Rikorose/DeepFilterNet)

---

## 📖 你要学会什么

学完这一课,你能帮主人把一批嘈杂的录音——咖啡厅背景音、空调嗡嗡声、办公室键盘声——**批量清洗干净,输出接近录音棚水准的人声音频**,然后送进剪辑流程。

想象一下:主人在家里录了一期播客,全程空调声嗡嗡的,剪辑师听完叫苦连天。以前要么花钱买 iZotope RX(专业降噪软件,几千块),要么手动一段一段调均衡。有了 **DeepFilterNet**,你一行命令喂进去,几秒钟吐出来一个干净的音频——背景噪声几乎消失,说话声清晰如新。

**DeepFilterNet** 是德国学术机构开发的开源语音增强工具,用深度学习在 48kHz 全频段做降噪,在公开基准测试里达到业界领先水平。本地运行、CPU 即可、双协议授权(MIT/Apache 2.0)。

**官方资料:**
- 项目仓库:[github.com/Rikorose/DeepFilterNet](https://github.com/Rikorose/DeepFilterNet)
- PyPI:[pypi.org/project/deepfilternet/](https://pypi.org/project/deepfilternet/)

---

## 🧠 核心原则

1. **深度滤波器的直觉:区分"人在说话"和"背景在叫"。** DeepFilterNet 在频域上分析每一帧音频,用神经网络学会了"哪些频率分量是人声,哪些是噪音",然后把噪音分量压掉。就好比一个智能音响均衡器,只是它不用手动调,自己学会了。

2. **只支持 WAV + 48kHz。** 这是最重要的限制——DeepFilterNet 只处理 48kHz 采样率的 WAV 文件。MP3/M4A/其他采样率的文件,**必须先用 FFmpeg 转换**,否则工具会报错。转换命令:
   ```bash
   ffmpeg -i input.mp3 -ar 48000 input_48k.wav
   ```

3. **CPU 也能跑,GPU 更快。** PyPI 安装默认用 CPU。如果主人有 NVIDIA 显卡,安装 PyTorch GPU 版可以提速。对于大多数播客/口播录音场景,CPU 处理速度已经够用(实时比约 10:1,即 10 分钟音频 1 分钟处理完)。

4. **预编译二进制最简单。** 不想装 Python 依赖,可以直接去 [releases 页面](https://github.com/Rikorose/DeepFilterNet/releases) 下载对应系统的二进制文件,解压就能用,零配置。

5. **批量处理是杀手锏。** CLI 支持一次传入多个文件,整批录音一条命令处理完。对于做播客、课程、访谈的主人来说,这个功能每周能省一两个小时。

---

## 🛠 操作要点

### 安装方法一:PyPI(推荐,有 Python API)

> ⚠️ **安装前先征得主人确认。**

```bash
pip install deepfilternet
```

> 🇨🇳 **国内镜像加速:**
> ```bash
> pip install deepfilternet -i https://pypi.tuna.tsinghua.edu.cn/simple
> ```

安装后验证:
```bash
deepFilter --help
```

### 安装方法二:预编译二进制(无需 Python)

去 [github.com/Rikorose/DeepFilterNet/releases](https://github.com/Rikorose/DeepFilterNet/releases) 下载对应系统的二进制包,解压后得到 `deep-filter` 可执行文件。

---

### 前置步骤:音频格式转换

> ⚠️ **DeepFilterNet 只支持 WAV + 48kHz,其他格式必须先转换。**

```bash
# MP3 转 WAV 48kHz(需要先安装 FFmpeg)
ffmpeg -i 录音.mp3 -ar 48000 录音_48k.wav

# M4A 转 WAV 48kHz
ffmpeg -i 录音.m4a -ar 48000 录音_48k.wav

# 已是 WAV 但采样率不对时
ffmpeg -i 录音_44k.wav -ar 48000 录音_48k.wav
```

---

### 核心降噪命令

**处理单个文件(PyPI 版)**
```bash
deepFilter 录音_48k.wav --output-dir ./enhanced
```
输出:`./enhanced/录音_48k.wav`

**处理单个文件(二进制版)**
```bash
deep-filter -o ./enhanced 录音_48k.wav
```

**批量处理多个文件**
```bash
deepFilter ep01_48k.wav ep02_48k.wav ep03_48k.wav --output-dir ./enhanced
```

**指定模型版本(默认 DeepFilterNet2,也可用 DeepFilterNet3)**
```bash
deepFilter 录音_48k.wav -m DeepFilterNet3 --output-dir ./enhanced
```

---

### Python API——嵌入流程使用

```python
import torch
import torchaudio
from df import enhance, init_df

# 初始化模型(首次运行自动下载,约 30MB)
model, df_state, _ = init_df()

# 加载音频(必须是 48kHz WAV)
audio, sr = torchaudio.load("录音_48k.wav")

# 降噪
enhanced_audio = enhance(model, df_state, audio)

# 保存
torchaudio.save("录音_enhanced.wav", enhanced_audio, sr)
print("降噪完成!")
```

---

### 完整播客降噪工作流

```
① 主人录制原始音频(MP3/M4A/WAV,任意采样率)
     ↓
② 用 FFmpeg 批量转换为 WAV 48kHz
   ffmpeg -i input.mp3 -ar 48000 input_48k.wav
     ↓
③ 用 DeepFilterNet 批量降噪
   deepFilter *_48k.wav --output-dir ./enhanced
     ↓
④ 降噪后的干净 WAV 文件在 ./enhanced/ 目录
     ↓
⑤ 导入剪辑软件(达芬奇/剪映/Audacity)继续剪辑
     ↓
⑥ 导出成片发布(播客/视频/课程)
```

---

### 安全确认清单

```
□ 安装前已征得主人确认
□ 处理的音频为主人本人的录音或已获授权
□ 音频格式已转换为 WAV 48kHz(否则告知主人)
□ 降噪后的文件告知主人保存位置
□ 不删除原始文件(降噪后放单独目录)
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:对一批嘈杂录音批量降噪,交出降噪前后对比和输出文件。**

1. **准备素材**:和主人确认 2~3 个有背景噪音的录音文件(手机录音、麦克风录音均可)。

2. **格式转换**:用 FFmpeg 把录音转为 WAV 48kHz 格式。记录转换命令。

3. **安装并运行 DeepFilterNet**:征得主人确认后安装,对所有文件批量降噪。

4. **对比前后**:
   - 原始文件和降噪文件的文件大小对比
   - 主人试听后的评价(噪音是否消除?人声是否清晰?)

5. **沉淀技能卡**:把"DeepFilterNet 安装 + FFmpeg 转换命令 + 批量降噪命令 + 完整工作流"沉淀成 `skills/deepfilternet.md`。

> ⚠️ **安全边界:**
> - 安装前征得主人确认
> - 不处理包含他人隐私录音的文件,除非主人明确授权

---

## 🎓 过关标准

- [ ] 你能解释 DeepFilterNet 的工作原理(深度学习频域降噪)
- [ ] 你知道它只支持 WAV + 48kHz,并能写出 FFmpeg 格式转换命令
- [ ] 你跑通了批量降噪命令(`deepFilter file1.wav file2.wav --output-dir`)
- [ ] 你能描述降噪前后的音质变化(有主人试听反馈)
- [ ] 你知道如何在 Python 脚本中调用 DeepFilterNet API
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
