# 第 M03 课 · edge-tts:零成本一键生成中文旁白配音

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 基础课 ｜ 难度:★☆☆ ｜ 源头:[github.com/rany2/edge-tts](https://github.com/rany2/edge-tts) ｜ **最低门槛配音课:免 Key、免 GPU、免翻墙**

---

## 📖 你要学会什么

学完这一课,你能帮主人把一篇口播文案——公众号推文、短视频脚本、课程旁白——**一键合成真人感中文配音,同时输出 SRT 字幕文件**,整套流程在本机完成,零费用。

打个比方:以前给视频配音,要么自己录(麻烦、容错率低),要么找配音演员(要钱),要么用各大平台的 TTS(要注册/充值/上传,还不一定能批量)。**edge-tts 就像在你电脑里藏了一个微软的播音员**——随叫随到,说中文说得又快又标准,还顺手帮你把字幕时间戳也标好了。

背后的原理:这个工具调用的是微软 Edge 浏览器内置的在线 TTS 服务(不是本地模型),所以**不需要下载任何模型、不需要 GPU**——只需要网络连接。而且这个服务在国内大多数网络环境可以直接连,不用翻墙。

**官方资料:**
- 项目仓库:[github.com/rany2/edge-tts](https://github.com/rany2/edge-tts)
- PyPI:[pypi.org/project/edge-tts/](https://pypi.org/project/edge-tts/)

---

## 🧠 核心原则

1. **调用的是微软云端 TTS,不是本地模型。** edge-tts 是调用 Microsoft Edge 的在线语音服务,这意味着:① 完全免费;② 不需要 API Key;③ 需要网络;④ 音质媲美商业平台。说白了就是"白嫖了微软的播音员"。

2. **中文声音很多,选对很重要。** 常用中文声音:
   - `zh-CN-XiaoxiaoNeural` — 晓晓,女声,温暖亲切,适合知识类/口播(最推荐)
   - `zh-CN-YunxiNeural` — 云希,男声,活泼自然
   - `zh-CN-YunjianNeural` — 云健,男声,沉稳大气,适合商务/纪录片
   - `zh-CN-XiaoyiNeural` — 晓伊,女声,活泼可爱
   - `zh-TW-HsiaoChenNeural` — 台湾繁体中文女声
   
   用 `edge-tts --list-voices` 查看完整列表(有几百个,覆盖全球语言)。

3. **配音+字幕一次出。** 一条命令同时输出 MP3 音频和 SRT 字幕——`--write-media` 和 `--write-subtitles` 配合用。字幕时间戳和语音完全对齐,可以直接导入剪辑软件烧录。

4. **语速/音量/音调可以调。** `--rate`/`--volume`/`--pitch` 三个参数微调声音特性——语速调到 +20% 配短视频节奏感更好。

5. **国内可用性说明。** edge-tts 调用微软服务器,国内大多数情况直连可用。但如果主人网络有限制,可能需要确认。和 OpenAI TTS 等需要翻墙/付费的方案相比,这是目前**中国用户门槛最低的配音工具**。

---

## 🛠 操作要点

### 安装

> ⚠️ **安装前先征得主人确认。**

```bash
# 方法一:pip 安装(推荐,附带 Python API)
pip install edge-tts

# 方法二:pipx 安装(只要命令行工具)
pipx install edge-tts
```

> 🇨🇳 **国内镜像加速:**
> ```bash
> pip install edge-tts -i https://pypi.tuna.tsinghua.edu.cn/simple
> ```

安装后验证:
```bash
edge-tts --help
```

---

### 核心命令速查

**最简单:生成中文配音 + 字幕**
```bash
edge-tts \
  --voice zh-CN-XiaoxiaoNeural \
  --text "大家好,欢迎收看今天的节目。" \
  --write-media output.mp3 \
  --write-subtitles output.srt
```

**查看所有可用声音**
```bash
edge-tts --list-voices
```

**只看中文声音**
```bash
edge-tts --list-voices | grep zh-CN
```

**调语速(正数加快,负数减慢)**
```bash
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+20% \
  --text "这是一段语速稍快的旁白。" --write-media fast.mp3
```

**调音量**
```bash
edge-tts --voice zh-CN-XiaoxiaoNeural --volume=+10% \
  --text "这是一段音量稍大的配音。" --write-media loud.mp3
```

**实时播放(需要 mpv 播放器,适合测试声音效果)**
```bash
edge-playback --voice zh-CN-XiaoxiaoNeural --text "测试一下这个声音好不好听"
```

---

### Python API——批量配音脚本

适合有多段文字需要批量生成配音的场景:

```python
import asyncio
import edge_tts

async def generate_audio(text: str, voice: str, output_mp3: str, output_srt: str):
    communicate = edge_tts.Communicate(text, voice, rate="+10%")
    submaker = edge_tts.SubMaker()
    
    with open(output_mp3, "wb") as audio_file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_file.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                submaker.feed(chunk)
    
    with open(output_srt, "w", encoding="utf-8") as srt_file:
        srt_file.write(submaker.get_srt())

# 批量处理多段文字
scripts = [
    ("第一段:今天我们来聊一聊人工智能。", "segment_01"),
    ("第二段:它正在改变每一个行业。", "segment_02"),
    ("第三段:普通人该怎么用好它?", "segment_03"),
]

async def main():
    for text, name in scripts:
        await generate_audio(
            text=text,
            voice="zh-CN-XiaoxiaoNeural",
            output_mp3=f"{name}.mp3",
            output_srt=f"{name}.srt"
        )
        print(f"完成: {name}.mp3 + {name}.srt")

asyncio.run(main())
```

---

### 完整口播配音工作流

```
① 主人提供口播脚本(纯文本,一段或多段)
② 你选好声音(推荐先用 edge-playback 试听几个)
③ 运行 edge-tts 命令,同时生成 .mp3 + .srt
④ 主人在剪辑软件里导入音频和字幕
⑤ 和视频画面对齐,字幕直接烧录或叠加
⑥ 成片导出发布(公众号/B站/视频号/抖音)
```

---

### 安全确认清单

```
□ 安装前已征得主人确认
□ 确认主人网络能正常访问微软服务器(国内大多数可用)
□ 配音内容为主人自己的文案,不涉及侵权内容
□ 生成的音频文件告知主人保存位置
□ 如有特殊版权要求(如商业发布),提醒主人了解微软 Edge TTS 服务条款
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:把一段口播文案一键生成中文旁白配音和同步字幕,交出 MP3 音频文件和 SRT 字幕文件。**

1. **准备文案**:和主人确认一段口播文字(可以是你随手写的 3~5 句话,也可以是主人提供的脚本)。

2. **安装工具**:征得主人确认后执行 `pip install edge-tts`。

3. **试听声音**:用 `edge-tts --list-voices | grep zh-CN` 看中文声音列表,选一个主人满意的声音(建议先用 `edge-playback` 试听)。

4. **生成配音+字幕**:执行命令,同时输出 MP3 和 SRT 文件。

5. **检查成果**:
   - MP3 文件能正常播放?
   - SRT 文件格式正确,时间戳和语音对应?

6. **沉淀技能卡**:把"edge-tts 安装步骤 + 常用中文声音列表 + 核心命令 + Python 批量脚本"沉淀成 `skills/edge-tts.md`。

> ⚠️ **安全边界:**
> - 安装前征得主人确认
> - 如网络不通,告知主人检查能否访问微软服务器(国内通常可用)
> - 商业用途发布前提醒主人了解 Microsoft Azure TTS 服务条款

---

## 🎓 过关标准

- [ ] 你能解释 edge-tts 为什么免费、免 Key、免 GPU(调用微软 Edge 在线 TTS)
- [ ] 你知道至少 3 个常用中文声音名,并能说出各自适合的场景
- [ ] 你跑通了命令,同时生成了 MP3 + SRT 两个文件
- [ ] 你能解释 `--rate`、`--volume`、`--pitch` 参数的用法
- [ ] 你写出了批量生成配音的 Python 脚本
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
