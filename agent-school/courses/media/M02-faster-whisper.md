# 第 M02 课 · faster-whisper:自动生成带时间戳字幕

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 基础课 ｜ 难度:★★☆ ｜ 源头:[github.com/SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)

---

## 📖 你要学会什么

学完这一课,你能帮主人把任何一段音视频——采访录音、课程讲解、播客、会议录像——自动转成**带精准时间戳的 SRT 字幕文件**。

先打个比方:你现在是主人身边的速记员。以前速记员要一边听录音、一边敲字、一边掐表标时间,一小时的录音能让速记员忙半天。有了这门课的工具,流程变成:把音频文件丢进去,几分钟后端出一份 SRT 字幕——每行文字前面都有精准时间戳,可以直接导入剪辑软件或发布。

这个工具叫 **faster-whisper**。它把 OpenAI 著名的 Whisper 语音识别模型重新实现了一遍,速度提升 4 倍,内存减半——相当于同样的引擎,换了个更省油的底盘。

**官方资料:**
- 项目仓库:[github.com/SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)
- PyPI:[pypi.org/project/faster-whisper/](https://pypi.org/project/faster-whisper/)

---

## 🧠 核心原则

1. **模型越大越准,但越慢越吃内存。** faster-whisper 提供多种规格的模型:`turbo`(均衡首选)、`large-v3`(最准,需 GPU)、`distil-large-v3`(蒸馏压缩版,速度快)、`small`(轻量 CPU 可用)。就像买相机:像素越高越清晰,但文件也越大——根据主人的设备和需求选。

2. **首次运行会自动下模型。** 模型托管在 HuggingFace Hub,首次加载时自动下载。`turbo` 约 800MB,`large-v3` 约 3GB。**国内网络访问 HuggingFace 可能需要代理——见下方国内替代方案。**

3. **有了时间戳,字幕才能用。** `word_timestamps=True` 参数可以精确到每个词的时间,做"逐字高亮字幕"必须开它。默认逐句时间戳足够大多数场景。

4. **VAD 过滤让识别更干净。** `vad_filter=True` 会先用语音活动检测(Voice Activity Detection)过滤掉噪音片段,再送给模型识别——背景嘈杂的录音开这个会明显改善。

5. **SRT 格式是字幕通用语言。** SRT 文件可以直接导入 Premiere、达芬奇、剪映、Arctime——所有主流剪辑软件都认识它。

---

## 🛠 操作要点

### 安装

> ⚠️ **安装前先征得主人确认。**

```bash
# 需要 Python 3.9+
pip install faster-whisper
```

> 🇨🇳 **国内镜像加速:**
> ```bash
> pip install faster-whisper -i https://pypi.tuna.tsinghua.edu.cn/simple
> ```

**GPU 用户额外依赖(CUDA 12):**
```bash
pip install nvidia-cublas-cu12 nvidia-cudnn-cu12
```

---

### 国内模型下载替代方案

> ⚠️ **首次使用时,faster-whisper 会从 HuggingFace 自动下载模型。国内网络访问 HuggingFace 不稳定,建议先征得主人确认后,用以下替代方式。**

**方法一:设置 HuggingFace 国内镜像(推荐)**
```bash
# 在运行脚本前设置环境变量
export HF_ENDPOINT=https://hf-mirror.com
```
或在 Python 代码里加一行:
```python
import os
os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"
```

**方法二:手动下载后指定本地路径**
在 [hf-mirror.com/Systran](https://hf-mirror.com/Systran) 找对应模型仓库,下载后放到本地目录,加载时指定本地路径:
```python
model = WhisperModel("/path/to/local/model", device="cpu")
```

---

### Python API——生成 SRT 字幕

```python
import os
os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"  # 国内用户加这行

from faster_whisper import WhisperModel

# CPU 模式(无 GPU 时用 int8 量化,更省内存)
model = WhisperModel("turbo", device="cpu", compute_type="int8")

# GPU 模式(有 NVIDIA 显卡时)
# model = WhisperModel("large-v3", device="cuda", compute_type="float16")

segments, info = model.transcribe("audio.mp3", beam_size=5, vad_filter=True)

print(f"检测语言: {info.language},置信度: {info.language_probability:.2f}")

# 生成 SRT 文件
def format_timestamp(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

with open("output.srt", "w", encoding="utf-8") as f:
    for i, segment in enumerate(segments, 1):
        f.write(f"{i}\n")
        f.write(f"{format_timestamp(segment.start)} --> {format_timestamp(segment.end)}\n")
        f.write(f"{segment.text.strip()}\n\n")

print("字幕已保存到 output.srt")
```

---

### 模型选择速查表

| 模型名 | 大小 | 推荐场景 | 设备要求 |
|--------|------|----------|----------|
| `small` | ~240MB | 快速测试,CPU | 任何机器 |
| `turbo` | ~800MB | 日常首选,均衡 | CPU/GPU 均可 |
| `distil-large-v3` | ~1.5GB | 快速+准确 | 推荐 GPU |
| `large-v3` | ~3GB | 最高精度 | 推荐 GPU(6GB+) |

---

### 开启逐词时间戳(做精准字幕)

```python
segments, info = model.transcribe("audio.mp3", word_timestamps=True)

for segment in segments:
    for word in segment.words:
        print(f"[{word.start:.2f}s -> {word.end:.2f}s] {word.word}")
```

---

### 批量处理多个文件

```python
import os
from faster_whisper import WhisperModel

model = WhisperModel("turbo", device="cpu", compute_type="int8")

audio_files = ["ep01.mp3", "ep02.mp3", "ep03.mp3"]

for audio_file in audio_files:
    segments, info = model.transcribe(audio_file, vad_filter=True)
    srt_file = audio_file.replace(".mp3", ".srt")
    # ... 写入 SRT(同上方代码)
    print(f"完成: {srt_file}")
```

---

### 安全确认清单

```
□ 安装前已征得主人确认
□ 首次下模型前,已告知主人需要下载约 800MB~3GB 数据
□ 国内网络环境已设置 hf-mirror.com 镜像或手动下载模型
□ 处理的音视频内容为主人授权的素材(版权/隐私确认)
□ 生成的字幕文件告知主人保存位置
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:把一段音视频转成带时间戳的 SRT 字幕文件,交出字幕文件内容截图。**

1. **确认素材**:和主人确认一段测试音频/视频(可以是手机录音、任意 MP3/MP4 文件)。

2. **安装工具并下载模型**:先征得主人确认,执行安装。首次运行时设置好国内镜像或提前下载好模型。

3. **运行转写**,执行上方 Python 脚本(用 `turbo` 模型 + CPU 模式),生成 `output.srt` 文件。

4. **检查字幕质量**:打开 SRT 文件,看时间戳是否准确、文字是否通顺。

5. **记录关键数据**:音频时长多长?转写用了多少秒?识别出的语言是什么?置信度多少?

6. **沉淀技能卡**:把"faster-whisper 安装步骤 + 国内镜像设置 + SRT 生成代码 + 模型选择表"沉淀成 `skills/faster-whisper.md`。

> ⚠️ **安全边界:**
> - 安装和首次下模型前征得主人确认
> - 3GB 的模型下载需提前告知主人,确认网络和磁盘空间
> - 如果是企业内部录音/会议记录,确认主人已确认可以处理

---

## 🎓 过关标准

- [ ] 你能说清楚 faster-whisper 和原版 Whisper 的关系(更快、更省内存)
- [ ] 你执行了正确安装,并处理了国内模型下载问题(镜像或手动)
- [ ] 你生成了一个可用的 SRT 字幕文件,格式正确(序号+时间戳+文本)
- [ ] 你能解释 `vad_filter`、`word_timestamps`、`compute_type` 三个参数的作用
- [ ] 你能根据主人的设备(有/无 GPU)推荐合适的模型和 compute_type
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
