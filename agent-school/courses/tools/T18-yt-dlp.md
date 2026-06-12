# 第 T18 课 · yt-dlp 下载公开音视频

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T17(ffmpeg,yt-dlp 内部调用它来合并) ｜ 难度:★★☆ ｜ 源头:yt-dlp 官方仓库 · [github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp) · [yt-dlp.org](https://github.com/yt-dlp/yt-dlp/blob/master/README.md)

---

## 📖 你要学会什么

学完这一课,你能用 yt-dlp 命令行下载**公开平台上的公开视频/音频**——YouTube 公开课、B 站公开视频、播客 RSS 里的音频……一条命令拿到本地,不需要装任何浏览器插件。

想象 yt-dlp 是一个帮你"把网上的公开播放画面录下来存到硬盘"的工具——但比录屏聪明得多:它直接拿到平台原始的视频流文件,不损画质、不带水印,还能自动下载字幕、自动合并音视频轨道。

yt-dlp 是广受开源社区认可的 youtube-dl 的活跃分叉版本,修复了大量 bug 并持续跟进平台变化,支持 1000+ 个视频网站(包括 B 站、抖音、微博视频等国内平台)。

> 🔴 **版权与平台条款边界(必须铭记):**
> - **只下载公开内容**:仅限公开可见、不需要付费会员或登录才能播放的视频。
> - **尊重版权**:下载不代表版权归你。下载内容**只用于个人学习、备份、无障碍**等合理使用场景,不得用于传播、商业用途、去水印后二次发布。
> - **遵守平台条款**:大多数平台的服务条款明确禁止未经授权的批量下载。使用前确认你的使用方式在当地法律和平台条款框架内。
> - **真正执行下载命令前,必须先征得主人确认**——包括确认目标 URL、确认用途合规。

**官方资料:**
- GitHub 仓库(官方源): [github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp)
- 完整 README(选项文档): [github.com/yt-dlp/yt-dlp/blob/master/README.md](https://github.com/yt-dlp/yt-dlp/blob/master/README.md)
- 支持站点列表: [github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)
- PyPI 页面: [pypi.org/project/yt-dlp](https://pypi.org/project/yt-dlp)

---

## 🧠 核心原则(内化成习惯)

1. **下载前先 `--list-formats`,看清楚有哪些格式可选。** yt-dlp 会列出平台提供的所有画质/音质选项(1080p/720p/仅音频……),你选 ID 下载比盲目下默认的更可控。

2. **合并视频和音频通常需要 ffmpeg。** 很多平台(YouTube/B 站)把视频流和音频流分开存,yt-dlp 会自动调用 ffmpeg 合并——所以先装 ffmpeg(T17 课)才能拿到有声音的完整视频。

3. **`--no-playlist` 防止误下一整个播放列表。** 当 URL 里带播放列表 ID 时,yt-dlp 默认会下载整个列表——如果你只要一个视频,必须加 `--no-playlist`。

4. **批量下载要用 `-a 文件.txt`。** 把一批 URL 每行一个存进文本文件,`yt-dlp -a urls.txt` 一次性处理,比你一条一条跑命令省事得多。

5. **真正执行下载前,必须先问主人。** yt-dlp 能做到不代表应该做。每次下载目标变了(换了网站、换了用途),都要重新确认主人已经了解并同意——这不是走过场,是**守住法律和伦理的边界**。

---

## 🛠 操作要点

### 安装

```bash
# 方法 A:pip 安装(推荐,方便更新)
pip install yt-dlp

# 方法 B:直接下载二进制(Windows / macOS / Linux)
# 见 https://github.com/yt-dlp/yt-dlp/releases/latest
# 下载 yt-dlp 或 yt-dlp.exe,放进 PATH

# ffmpeg 也需要安装(合并音视频用),参考 T17 课
# macOS: brew install ffmpeg
# Ubuntu: sudo apt install ffmpeg

# 验证
yt-dlp --version
```

> ⚠️ **系统级工具,安装和运行均需先征得主人确认,不得自行执行。**
>
> 国内访问 GitHub Releases 可能需要科学上网,pip 安装通常无此问题。

### 第一步:永远先侦察,不要直接下载

```bash
# 查看视频信息,不下载
yt-dlp --no-download --print-json "https://www.bilibili.com/video/BV1xx411x7xx"

# 查看所有可用画质/格式列表
yt-dlp --list-formats "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
# 输出示例:
# ID   EXT   RESOLUTION  FPS  │ FILESIZE  TBR  PROTO
# 137  mp4   1920x1080   30   │  ~350MiB  ...  https   (仅视频)
# 140  m4a   audio only  -    │   ~50MiB  ...  https   (仅音频)
# 22   mp4   1280x720    30   │  ~200MiB  ...  https   (音视频合并)
```

### 最常用的命令

```bash
# 1. 下载最佳画质(自动合并音视频,需要 ffmpeg)
yt-dlp "https://url" -o "output/%(title)s.%(ext)s"

# 2. 只下载音频,存为 MP3
yt-dlp -x --audio-format mp3 -o "output/%(title)s.%(ext)s" "https://url"

# 3. 指定画质(用 --list-formats 看到的 ID)
yt-dlp -f "137+140" -o "output/%(title)s.%(ext)s" "https://url"
# 137=1080p视频流 + 140=m4a音频流,yt-dlp 自动合并

# 4. 下载视频 + 字幕(如有)
yt-dlp --write-sub --sub-lang zh-Hans "https://url" -o "output/%(title)s.%(ext)s"

# 5. 批量下载(urls.txt 每行一个 URL)
yt-dlp -a urls.txt -o "output/%(title)s.%(ext)s"

# 6. 只要这一个视频,不要整个播放列表
yt-dlp --no-playlist "https://url"

# 7. B 站视频下载(支持 BV 号 URL)
yt-dlp "https://www.bilibili.com/video/BVxxxxxxxxx" -o "output/%(title)s.%(ext)s"

# 8. 限速下载(避免对服务器造成过大压力)
yt-dlp -r 1M "https://url" -o "output/%(title)s.%(ext)s"
```

### 常用参数速查

| 参数 | 含义 |
|------|------|
| `-o "output/%(title)s.%(ext)s"` | 输出路径模板(推荐) |
| `--list-formats` | 列出所有可用格式 |
| `-f "best"` | 下载最佳合并格式 |
| `-f "bestvideo+bestaudio"` | 分别选最高画质/音质再合并 |
| `-x` | 仅提取音频 |
| `--audio-format mp3` | 音频转为 MP3 |
| `--write-sub` | 下载字幕文件 |
| `--sub-lang zh-Hans` | 指定字幕语言(简体中文) |
| `--no-playlist` | 只下这一个视频,忽略播放列表 |
| `-a urls.txt` | 从文本文件批量读 URL |
| `-r 1M` | 限速 1 MB/s |
| `--cookies-from-browser chrome` | 使用浏览器 Cookie(需主人授权) |
| `--no-download` | 只查看信息不下载 |

### 用 Python 调用 yt-dlp

```python
# yt-dlp 也可以作为 Python 库调用
import yt_dlp

def download_audio(url: str, output_dir: str = "output") -> None:
    """
    下载音频为 MP3。
    ⚠️ 调用前必须确认:主人已明确同意、URL 内容公开且用途合规。
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
        info = ydl.extract_info(url, download=False)  # 先查信息
        print(f"标题: {info.get('title')}")
        print(f"时长: {info.get('duration')} 秒")
        # 确认主人同意后,再把 download=False 改为 download=True
        # ydl.download([url])
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个"下载公开播客音频"的完整方案,产出命令 + Python 脚本 + 合规说明。**

选定场景:主人想把某公开播客(比如 B 站某 UP 主的公开视频系列)里的 5 期节目下载成本地 MP3 文件用于个人离线收听。

你需要完成:

1. **写出完整方案**,包括:
   - 如何用 `--no-download` + `--list-formats` 先侦察,不盲目执行
   - 如何把 5 个 URL 写进 `urls.txt`
   - 用一条命令批量下载为 MP3 的完整 yt-dlp 命令
   - 输出目录 `output/`,文件名用 `%(title)s.mp3` 模板

2. **写出 Python 脚本版本**:用 `yt_dlp` 库实现同样功能,但默认 `download=False`(先查信息),并在注释里标注"主人确认后把这行打开"。

3. **写出验收标准**:
   - `output/` 目录下有 5 个 `.mp3` 文件
   - 每个文件 > 1MB(非空/非错误文件)
   - 用 `ffprobe` 验证有音频流且时长 > 0

4. **写出版权与合规清单**:
   - [ ] 视频/音频内容公开可见(无需付费会员)
   - [ ] 用途为个人学习/备份,不二次传播
   - [ ] 平台条款已查阅(或主人已确认可接受风险)
   - [ ] 主人已明确同意执行下载

5. **写出安全提示**:
   - `pip install yt-dlp` 和实际 `yt-dlp` 命令**均需主人先确认**
   - 不使用 `--cookies-from-browser` 除非主人明确授权(会读取浏览器 Cookie)
   - 不对任何网站进行爬取/高频请求

6. **沉淀技能卡**到 `agent-school/skills/yt-dlp-download.md`。

---

## 🎓 过关标准

- [ ] 你写出了完整的侦察 → 批量下载命令链(含 `--no-download` 先查、`-a urls.txt` 批量)
- [ ] 你写出了 Python 库版本,且默认不自动执行下载
- [ ] 你写出了版权/合规清单,能清楚说明哪些行为合规、哪些不合规
- [ ] 你理解了为什么合并视频/音频需要 ffmpeg,能说清楚二者的协作关系
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/yt-dlp-download.md`](../../skills/yt-dlp-download.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,这批工具课全部结业!

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 yt-dlp 下载公开音视频

- **什么时候用**:主人需要把公开平台的公开内容下载到本地时(个人学习/备份)
- **来自**:T18 课 yt-dlp

## 步骤
1. 确认合规:内容公开?用途合法?主人同意?→ 三个 yes 才继续
2. 安装:pip install yt-dlp(需主人确认)+ ffmpeg(见 T17)
3. 侦察:yt-dlp --no-download --list-formats "URL"
4. 下载音频:yt-dlp -x --audio-format mp3 -o "output/%(title)s.%(ext)s" "URL"
5. 批量:yt-dlp -a urls.txt -o "output/%(title)s.%(ext)s"

## 验证
- output/ 下有对应 .mp3/.mp4 文件且 > 1MB
- ffprobe 验证有音频流、时长 > 0

## 注意
- 只下公开内容;不二次传播;遵守平台条款
- 需要 ffmpeg 才能合并高清视频+音频轨道
- --no-playlist 防止意外下载整个列表
- 每次新 URL/新用途都要重新确认主人同意
- pip install 和实际执行前必须征得主人确认
```
