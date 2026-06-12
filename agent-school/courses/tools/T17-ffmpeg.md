# 第 T17 课 · ffmpeg 转码/剪切/提取音轨(命令行)

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★★ ｜ 源头:FFmpeg 官方文档 · [ffmpeg.org/documentation.html](https://ffmpeg.org/documentation.html) · [ffmpeg.org/ffmpeg.html](https://ffmpeg.org/ffmpeg.html)

---

## 📖 你要学会什么

学完这一课,你能用 ffmpeg 命令行完成最常见的视频/音频处理任务:把视频从一种格式转成另一种、剪切某一段、提取音轨存成 MP3、压缩视频体积——全在终端里搞定,不需要 PR、不需要剪映。

想象 ffmpeg 是一台**万能的视频加工机器**:你往里面塞一个 MP4,告诉它"帮我截取 1 分 30 秒到 2 分 20 秒,顺便把分辨率压到 720p,音轨单独存一份",机器嗡的一声,三个文件出来了。它不弹界面,不用鼠标点点点——只需要你在终端打一行命令。

FFmpeg 是影视/流媒体行业真正的底层工具。B 站、抖音、YouTube 的服务器后端用的就是它。它开源、免费、几乎无所不能,是 agent 处理媒体文件的首选武器。

**官方资料:**
- 官方主页: [ffmpeg.org](https://ffmpeg.org/)
- 完整文档: [ffmpeg.org/documentation.html](https://ffmpeg.org/documentation.html)
- ffmpeg 命令参考: [ffmpeg.org/ffmpeg.html](https://ffmpeg.org/ffmpeg.html)
- 编码器文档: [ffmpeg.org/ffmpeg-codecs.html](https://ffmpeg.org/ffmpeg-codecs.html)

---

## 🧠 核心原则(内化成习惯)

1. **每条 ffmpeg 命令的骨架就三段:`输入 → 参数 → 输出`。** `ffmpeg -i 输入文件 [参数] 输出文件`——这个公式记住了,剩下的都是往"参数"里填不同选项。

2. **先用 `-c copy` 能剪就别重新编码。** 重新编码(re-encoding)既耗时又损画质,如果你只是想剪掉某段、不改画质,用 `-c copy` 直接复制流——同样的剪切操作,可能快 20 倍。

3. **时间用 `HH:MM:SS` 或秒数,别搞混。** `-ss 00:01:30` 和 `-ss 90` 是一个意思,都是跳到第 90 秒。记住 `-ss`(起点)和 `-t`(持续时长)或 `-to`(终点)的区别。

4. **`-y` 静默覆盖,`-n` 静默跳过。** 批量处理时加 `-y` 让 ffmpeg 不问"要不要覆盖"直接干;-n 则是"有就跳过"。交互场合不加,让主人自己看提示。

5. **先用 `ffprobe` 看清楚原始文件。** 在处理一个文件之前,先 `ffprobe -v quiet -print_format json -show_streams 输入文件` 看清楚它有几条视频流、几条音轨、编码格式是什么——否则可能出现"静音视频"或"黑屏"的奇怪结果。

---

## 🛠 操作要点

### 安装

FFmpeg 是系统级二进制工具,不是 Python 包,安装方式因系统而异:

```bash
# macOS (用 Homebrew)
brew install ffmpeg

# Ubuntu / Debian (Linux)
sudo apt update && sudo apt install ffmpeg

# Windows
# 从 https://www.gyan.dev/ffmpeg/builds/ 下载 Release Full 版本
# 解压,把 bin/ 目录加入系统 PATH

# 验证安装
ffmpeg -version
```

> ⚠️ **系统级安装,未经主人确认不得真装真跑,只先给方案。** 如果主人当场明确同意,再执行。
>
> 国内网络下载 Homebrew/apt 源有时较慢,可先询问主人是否已安装(`ffmpeg -version` 能跑就是装了)。

### 查看文件信息

```bash
# 查看视频基本信息(流信息、时长、编码格式)
ffprobe -v quiet -print_format json -show_streams input.mp4

# 简洁版(人类可读)
ffprobe -hide_banner input.mp4
```

### 最常用的 6 个场景

```bash
# 1. 格式转换:MP4 转 MKV(不重编码,直接复制流)
ffmpeg -i input.mp4 -c copy output.mkv

# 2. 格式转换:需要重新编码(例如转 H.264,兼容性最好)
ffmpeg -i input.avi -c:v libx264 -c:a aac -crf 23 output.mp4
#   -crf 23: 画质参数,数值越低画质越高(18~28 是常用范围)

# 3. 剪切片段:取 1:30 ~ 2:20 这段(50 秒)
ffmpeg -ss 00:01:30 -to 00:02:20 -i input.mp4 -c copy clip.mp4
#   注意:-ss 放在 -i 之前(快速定位),不损帧精度可接受

# 4. 提取音轨:存为 MP3
ffmpeg -i input.mp4 -q:a 0 -map a output.mp3
#   -q:a 0: 最高质量可变比特率,-map a: 只要音频流

# 5. 压缩视频:降低分辨率到 720p + 降低比特率
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -c:a aac output_720p.mp4

# 6. 批量转码(Shell 循环):把一个目录里所有 .avi 转为 .mp4
for f in *.avi; do
    ffmpeg -i "$f" -c:v libx264 -crf 23 -c:a aac "${f%.avi}.mp4"
done
```

### 常用参数速查

| 参数 | 含义 |
|------|------|
| `-i 文件` | 输入文件 |
| `-c copy` | 直接复制流,不重编码 |
| `-c:v libx264` | 视频编码器用 H.264 |
| `-c:a aac` | 音频编码器用 AAC |
| `-crf N` | 画质(18=高质 / 28=低质;默认 23) |
| `-ss 时间` | 起始时间 |
| `-to 时间` | 结束时间 |
| `-t 秒数` | 持续时长 |
| `-vf scale=W:H` | 缩放分辨率 |
| `-map a` | 只要音频流 |
| `-map v` | 只要视频流 |
| `-y` | 静默覆盖输出文件 |
| `-n` | 输出文件已存在则跳过 |
| `-hide_banner` | 隐藏版本信息输出 |

### 用 Python 调用 ffmpeg(subprocess)

```python
import subprocess, os

def extract_audio(input_path: str, output_path: str) -> bool:
    """从视频提取音轨,返回是否成功"""
    cmd = [
        "ffmpeg", "-hide_banner", "-y",
        "-i", input_path,
        "-q:a", "0", "-map", "a",
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("错误:", result.stderr)
        return False
    return os.path.exists(output_path)

# 示例(需主人确认后才能真跑)
# success = extract_audio("lecture.mp4", "output/lecture_audio.mp3")
# print("成功" if success else "失败")
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个"视频批量处理"的完整方案(含命令 + Python 调用包装)。**

选定场景:主人有一批课程录像(假设 `.mp4` 格式),需要:① 把每个视频剪掉前 10 秒片头;② 提取音轨存为 `.mp3`;③ 顺便压一个 720p 版本。你要给出完整的处理方案,不自行执行。

你需要完成:

1. **写出每个子任务对应的 ffmpeg 命令**:
   - 剪去片头(跳过前 10 秒,保留剩余全部)
   - 提取音轨为 MP3
   - 压缩到 720p

2. **写出一个 Python 脚本**,用 `subprocess` 封装上述三条命令,输入一个目录,对目录内所有 `.mp4` 文件批量执行,输出到 `output/` 子目录。

3. **写出验收标准**:
   - 每个 `.mp4` 对应 3 个输出文件(剪切版、MP3、720p)
   - 用 `ffprobe` 验证输出文件的时长约等于原始时长 - 10 秒
   - 用 `ffprobe` 验证 MP3 文件有音频流

4. **写出安全提示**:
   - ffmpeg 是系统级工具,安装前需确认 `ffmpeg -version` 是否已存在
   - **未经主人确认不得真装真跑**
   - 处理视频前,确认来源文件版权归属——只处理主人自己的视频或已获授权的内容

5. **写出常见报错处理**:`No such file` / `Invalid data found` / `Output file already exists` 分别是什么原因、怎么解。

6. **沉淀技能卡**到 `agent-school/skills/ffmpeg-video.md`。

---

## 🎓 过关标准

- [ ] 你写出了三个 ffmpeg 命令(剪切/提取音轨/压缩),且参数含义都能解释清楚
- [ ] 你写出了完整的 Python subprocess 封装脚本(批量处理目录)
- [ ] 你能说清楚 `-c copy` 和重新编码的区别,以及各自适用场景
- [ ] 你知道 `-ss` 放在 `-i` 前后有什么不同(快速定位 vs 精确定位)
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/ffmpeg-video.md`](../../skills/ffmpeg-video.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T18 课。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 ffmpeg 处理视频/音频

- **什么时候用**:需要转码、剪切、提取音轨、压缩视频时
- **来自**:T17 课 ffmpeg

## 步骤
1. 验证安装:ffmpeg -version(没装则询问主人再安装)
2. 查看原始文件:ffprobe -hide_banner input.mp4
3. 按需选命令:
   - 剪切(快速,可能帧不准):-ss 起点 -to 终点 -i in -c copy out
   - 转码:ffmpeg -i in -c:v libx264 -crf 23 -c:a aac out.mp4
   - 提取音轨:ffmpeg -i in -q:a 0 -map a out.mp3
   - 压缩+缩放:ffmpeg -i in -vf scale=1280:720 -c:v libx264 -crf 28 out.mp4
4. Python 调用:subprocess.run(cmd, capture_output=True)

## 验证
- 用 ffprobe 检查输出文件的时长/编码/流信息
- returncode == 0 且输出文件存在且 > 0 字节

## 注意
- -c copy 不重编码(快/无损质量),重编才需要 -c:v libx264
- -ss 在 -i 前:快速跳帧(可能不精确但快);在 -i 后:逐帧解码(精确但慢)
- 系统级安装需主人确认;处理他人视频需确认版权
```
