# 第 T19 课 · Whisper 语音转文字/字幕

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★★ ｜ 源头:OpenAI Whisper 官方仓库 · [github.com/openai/whisper](https://github.com/openai/whisper) · faster-whisper · [github.com/SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)

---

## 📖 你要学会什么

学完这一课,你能把一段录音或视频里的语音,自动转成文字稿或 `.srt` 字幕文件——不需要人工听写,不需要付费服务,完全本地跑。

想象你手头有一节 40 分钟的课程录音,老师说话速度很快,你要整理成文字发给同学。以前你得盯着暂停键听一句打一句,3 小时才搞定。现在你丢给 Whisper,它就像一个**极快的速记员**:你把录音递给它,几分钟后它交给你一份逐句带时间戳的文字稿。

Whisper 是 OpenAI 在 2022 年开源的语音识别模型,支持 99 种语言(包括中文、粤语、日语等),中文识别效果尤其出色。**faster-whisper** 是社区做的加速版,用 CTranslate2 引擎重写,同等精度下速度快 2~4 倍、内存占用减半,是目前推荐用的版本。

**官方资料:**
- OpenAI Whisper 仓库: [github.com/openai/whisper](https://github.com/openai/whisper)
- faster-whisper 仓库: [github.com/SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper)
- faster-whisper PyPI: [pypi.org/project/faster-whisper](https://pypi.org/project/faster-whisper/)
- 支持语言列表: [github.com/openai/whisper/blob/main/whisper/tokenizer.py](https://github.com/openai/whisper/blob/main/whisper/tokenizer.py)

---

## 🧠 核心原则(内化成习惯)

1. **模型越大越准,也越慢越占内存——按需选。** Whisper 有五档模型:tiny / base / small / medium / large。就好比请速记员,tiny 是实习生又快又便宜但容易出错,large 是资深专家慢且贵但几乎不出错。中文任务建议从 `medium` 起步,预算充足或要求高精度用 `large-v3`。

2. **模型要下载到本地,国内很慢,提前想好方案。** 模型文件放在 HuggingFace Hub,small 约 244MB,medium 约 769MB,large-v3 约 1.5GB。国内直连 HuggingFace 经常超时。**推荐方案**:提前下载到本地或让主人用镜像站(如 `hf-mirror.com`)下载后放到指定目录。

3. **输入格式很宽容,但先用 ffmpeg 统一格式更稳。** Whisper 能接受 mp3/mp4/wav/m4a/flac 等格式,但如果遇到奇怪的编码格式,先用 ffmpeg 转成 wav(16kHz 单声道)再喂给它,能避免 90% 的格式报错。

4. **`word_timestamps=True` 能让你拿到每个词的时间点。** 默认是句子级时间戳;如果你要做卡拉 OK 字幕、精确对位或高亮显示,开启词级时间戳。

5. **有 GPU 就用 GPU,没有 GPU 用 CPU 也能跑(就是慢)。** faster-whisper 的 CPU 版本比原版快很多,一般家用机跑 medium 模型,10 分钟音频大约需要 3~5 分钟。

---

## 🛠 操作要点

### 安装

```bash
# 安装 faster-whisper(推荐,比原版快 2~4 倍)
pip install faster-whisper

# 如果需要处理视频文件,还需要 ffmpeg(系统级工具)
# macOS:
brew install ffmpeg
# Ubuntu/Debian:
sudo apt install ffmpeg

# 验证安装
python -c "from faster_whisper import WhisperModel; print('ok')"
```

> ⚠️ **未经主人确认不得真装真跑,只先给方案。**
>
> 🇨🇳 **国内网络特别提示**:模型文件从 HuggingFace 下载,国内直连可能很慢甚至失败。解决方案:
> - 方案 A:设置环境变量 `HF_ENDPOINT=https://hf-mirror.com` 再运行,走国内镜像
> - 方案 B:让主人手动从 [hf-mirror.com](https://hf-mirror.com) 下载模型文件夹放到本地,代码里 `model_size_or_path` 改用本地路径
> - 方案 C:科学上网后再下载

### 最小可运行脚本

```python
from faster_whisper import WhisperModel

# 1. 加载模型
# model_size: tiny / base / small / medium / large-v2 / large-v3
# device: "cpu" 或 "cuda"(有 NVIDIA GPU 时用 cuda 快很多)
# compute_type: "int8"(CPU 推荐) / "float16"(GPU 推荐)
model = WhisperModel("medium", device="cpu", compute_type="int8")

# 2. 转录音频(自动检测语言)
segments, info = model.transcribe("audio.mp3", beam_size=5)

print(f"检测到语言: {info.language}(置信度 {info.language_probability:.0%})")

# 3. 打印结果(带时间戳)
for segment in segments:
    print(f"[{segment.start:.1f}s → {segment.end:.1f}s] {segment.text}")
```

### 输出为 SRT 字幕文件

```python
from faster_whisper import WhisperModel

def transcribe_to_srt(audio_path: str, output_srt: str,
                       model_size: str = "medium",
                       language: str = "zh") -> int:
    """
    把音频转成 SRT 字幕文件,返回字幕条数。
    language: "zh"=中文, "en"=英文, None=自动检测
    """
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        audio_path,
        language=language,
        beam_size=5,
        word_timestamps=False,
    )

    def fmt_time(seconds: float) -> str:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds - int(seconds)) * 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    count = 0
    with open(output_srt, "w", encoding="utf-8") as f:
        for i, seg in enumerate(segments, 1):
            f.write(f"{i}\n")
            f.write(f"{fmt_time(seg.start)} --> {fmt_time(seg.end)}\n")
            f.write(f"{seg.text.strip()}\n\n")
            count = i

    return count

# 示例(需主人确认后才能真跑)
# n = transcribe_to_srt("lecture.mp3", "output/lecture.srt")
# print(f"生成 {n} 条字幕")
```

### 模型尺寸速查(国内下载大小参考)

| 模型 | 大小 | 中文效果 | CPU 速度(10min音频) | 适用场景 |
|------|------|----------|---------------------|----------|
| tiny | 39MB | 一般 | ~30秒 | 快速草稿 |
| base | 74MB | 一般 | ~1分钟 | 快速草稿 |
| small | 244MB | 良好 | ~2分钟 | 日常使用 |
| medium | 769MB | 很好 | ~5分钟 | 推荐默认 |
| large-v3 | 1.5GB | 最好 | ~12分钟 | 高精度要求 |

### 常见报错处理

| 报错 | 原因 | 解决 |
|------|------|------|
| `ConnectionError` / 下载超时 | HuggingFace 无法访问 | 用 `hf-mirror.com` 镜像或科学上网 |
| `CUDA out of memory` | GPU 显存不足 | 改 `device="cpu"` 或换小模型 |
| `ffmpeg not found` | 没装 ffmpeg | 先装 ffmpeg(询问主人) |
| 中文识别乱码 | 没指定语言 | 加参数 `language="zh"` |
| 输出全是英文 | 语言检测错误 | 手动指定 `language="zh"` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个"会议录音转文字稿+字幕"的完整方案。**

场景:主人有一段 30 分钟的中文会议录音(mp3 格式),需要:① 转成带时间戳的文字稿(txt);② 转成可以直接导入剪辑软件的 SRT 字幕。

你需要完成:

1. **写出完整 Python 脚本**,包含:
   - 加载 medium 模型(CPU 模式)
   - 转录中文音频
   - 输出 `output/transcript.txt`(纯文字,带时间戳)
   - 输出 `output/subtitle.srt`(标准 SRT 格式)
   - 打印转录完成的字幕条数和检测到的语言

2. **写出"怎么验证成功"的标准**:
   - `output/transcript.txt` 存在且内容包含中文字符
   - `output/subtitle.srt` 格式正确(含序号、时间轴 `-->` 和文字)
   - 时间轴的最后一条约等于原始音频时长(误差 ±5 秒以内)

3. **写出国内网络的下载方案**:
   - 三种方案(镜像站/本地路径/科学上网)各自的命令或代码

4. **写出安全提示**:
   - 音频涉及他人隐私(如会议录音)时,需获得相关人员同意
   - **未经主人确认不得真装真跑**
   - 模型下载前先确认磁盘剩余空间(large-v3 需要至少 3GB 含缓存)

5. **沉淀技能卡**到 `agent-school/skills/whisper-transcribe.md`。

> ⚠️ **安全边界**:这一课的毕业测验是**产出方案**,不是真跑。模型下载和脚本执行**必须先得到主人明确确认**,再动手。

---

## 🎓 过关标准

- [ ] 你写出了完整的转录脚本(输出 txt 和 srt 两种格式)
- [ ] 你能解释 tiny/medium/large-v3 的选型逻辑(精度 vs 速度 vs 模型大小)
- [ ] 你给出了国内下载 HuggingFace 模型的至少两种可行方案
- [ ] 你知道中文转录要加 `language="zh"`,以及怎么处理语言识别错误
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/whisper-transcribe.md`](../../skills/whisper-transcribe.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T20 课。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 faster-whisper 转录语音/生成字幕

- **什么时候用**:把音频或视频里的语音转成文字稿或 SRT 字幕
- **来自**:T19 课 Whisper

## 步骤
1. 安装:pip install faster-whisper(系统级 ffmpeg 也要装)
2. 国内下载模型:设 HF_ENDPOINT=https://hf-mirror.com 或用本地路径
3. 加载模型:WhisperModel("medium", device="cpu", compute_type="int8")
4. 转录中文:model.transcribe(path, language="zh", beam_size=5)
5. 迭代 segments,每条有 start/end/text
6. 输出 SRT:按 "序号\n时间轴\n文字\n" 格式写文件

## 验证
- 检查 srt 文件含 "-->" 时间轴标记
- 最后一条时间戳约等于音频总时长
- info.language == "zh"(或目标语言代码)

## 注意
- 模型按需选:日常用 medium,高精度用 large-v3
- 国内网络直连 HuggingFace 容易超时,优先用镜像站
- 指定 language="zh" 避免语言误判
- 处理他人录音需先征得同意
- 真装真跑前先征得主人确认
```
