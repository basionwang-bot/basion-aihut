# 第 M08 课 · videocut-skills:让 Claude 当剪辑师,端到端剪播客

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 基础课 + M01(auto-editor) + M02(faster-whisper) ｜ 难度:★★★ ｜ 源头:[github.com/Ceeon/videocut-skills](https://github.com/Ceeon/videocut-skills)

---

## 📖 你要学会什么

学完这一课,你能把 **videocut-skills** 这个剪辑技能包装进 Claude Code,然后端到端完成一期播客视频的剪辑——从原始录像到剪好的成片——全程只需要你和 Claude 对话,不用手碰剪辑软件。

先说说为什么这门课和 M01 不一样。M01 的 auto-editor 是按"有没有声音"机械切割——它不懂内容。而 **videocut-skills** 让 Claude 读懂讲话内容再剪:识别说错了重说的句子、讲到一半停下来想的段落、重复的开头、语气助词的啰嗦——这些"内容层面的废话"才是播客录制的大头,auto-editor 剪不到,这个工具能。

打个比方:auto-editor 是"按录音电平剪",就像按音量大小来判断;videocut-skills 是"按语义剪",就像一个真正的剪辑师在听你说什么。

**videocut-skills** 是国产 Claude Code Skill 项目,中文交互,专门针对"口播/播客/知识视频"剪辑场景优化。底层用 FunASR 做语音识别、Whisper 做字幕、FFmpeg 做实际剪切,Claude 负责"看懂内容、决定哪里该剪"。

**官方资料:**
- 项目仓库:[github.com/Ceeon/videocut-skills](https://github.com/Ceeon/videocut-skills)

---

## 🧠 核心原则

1. **Claude 是剪辑决策者,FFmpeg 是执行者。** 整套工具的分工是:FunASR 把视频里的每句话识别成文字 → Claude 读文字,用语义理解判断哪些是废话/错误/重复 → 生成剪辑计划 → FFmpeg 执行实际剪切。Claude 负责"懂内容",FFmpeg 负责"动刀子"。

2. **语义剪辑 vs. 响度剪辑,互补不替代。** videocut-skills 擅长处理"内容层面的废话"(说错了重说、重复开头、冗余句式);auto-editor 擅长处理"音频层面的停顿"(纯静音、过长停顿)。两个工具配合使用效果最好:先用 videocut-skills 剪内容废话,再用 auto-editor 剪静音停顿。

3. **需要火山引擎 API Key。** videocut-skills 使用**火山引擎(字节跳动)**的语音识别服务来提升识别准确率。这是国内平台,注册不需要翻墙、支持人民币付款——但需要主人去 [console.volcengine.com](https://console.volcengine.com) 申请 API Key。**先问主人。**

4. **首次安装会下载两个大模型。** `/videocut:安装` 命令会自动下载:
   - FunASR 约 2GB
   - Whisper large-v3 约 3GB
   
   总计约 5GB,需要磁盘空间和时间,提前告知主人。

5. **反复使用越来越聪明。** `/videocut:自更新` 命令会让系统学习主人的剪辑偏好——哪些语气词要剪、哪种停顿保留、主人的说话节奏——下次剪辑更符合主人风格。

---

## 🛠 操作要点

### 系统前置要求

| 工具 | 版本要求 | 安装方法 |
|------|----------|----------|
| Python | 3.8+ | [python.org](https://www.python.org) |
| Node.js | 18+ | `brew install node` (macOS) |
| FFmpeg | 任意新版 | `brew install ffmpeg` (macOS) / `apt install ffmpeg` (Ubuntu) |

> ⚠️ **安装前先征得主人确认。** 以下步骤会安装工具和下载约 5GB 模型文件。

### 第一步:装入 Claude Code

```bash
git clone https://github.com/Ceeon/videocut-skills.git ~/.claude/skills/videocut
```

### 第二步:配置火山引擎 API Key

```bash
cd ~/.claude/skills/videocut
cp .env.example .env
```

用编辑器打开 `.env`,填入火山引擎 API Key:
```
VOLCANO_API_KEY=your_api_key_here
```

> 🇨🇳 **申请火山引擎 API Key:**
> 1. 访问 [console.volcengine.com](https://console.volcengine.com)(国内直连,支持微信/支付宝)
> 2. 注册并实名认证
> 3. 开通语音技术服务,创建 API Key
> 4. 有免费额度,初期试用无需付费

### 第三步:在 Claude Code 里初始化环境

在 Claude Code 对话框里输入:
```
/videocut:安装
```

系统自动检测 Python/FFmpeg/Node.js 是否已安装,然后安装 FunASR 和 Whisper large-v3 模型(约 5GB,需要等待)。

---

### 所有命令速查

| 命令 | 功能 | 适用场景 |
|------|------|----------|
| `/videocut:安装` | 初始化环境,安装模型 | 首次使用前 |
| `/videocut:剪口播 video.mp4` | 转写→AI审阅→剪辑 | 主要剪辑命令 |
| `/videocut:字幕` | 生成烧录字幕的视频 | 需要字幕时 |
| `/videocut:高清化` | 二次编码高质量导出 | 最终发布时 |
| `/videocut:自更新` | 学习主人剪辑偏好 | 使用几次后运行 |

---

### 完整剪辑工作流(播客场景)

```
① 主人录制一期播客视频 → podcast_ep01.mp4(原始素材)
     ↓
② 在 Claude Code 里对话:
   /videocut:剪口播 podcast_ep01.mp4
     ↓
③ FunASR 识别全段语音文字
     ↓
④ Claude 读懂内容,识别:
   - 说错了重说的句子
   - 重复的开头("那个...那个...")
   - 过长的停顿思考
   - 说到一半放弃的话
     ↓
⑤ Claude 生成剪辑计划(哪些片段剪掉,哪些保留)
⑥ 主人审阅计划,确认或调整
     ↓
⑦ FFmpeg 执行剪切,输出剪后视频
     ↓
⑧ 如需字幕:/videocut:字幕
⑨ 如需高清导出:/videocut:高清化
     ↓
⑩ 成片发布(B站/视频号/小红书/播客平台)
```

---

### 与其他课程工具的配合

```
降噪阶段:M06 DeepFilterNet → 先清理背景噪音
     ↓
内容剪辑:M08 videocut-skills → 剪内容废话/错误
     ↓
静音剪辑:M01 auto-editor → 再剪残留停顿
     ↓
字幕生成:M02 faster-whisper → 精准 SRT 字幕
     ↓
配音替换:M03 edge-tts / M04 GPT-SoVITS → 如需配音
```

---

### 安全确认清单

```
□ 安装前已征得主人确认(~5GB 模型、Node.js/Python/FFmpeg 依赖)
□ 火山引擎 API Key 由主人自行申请后配置,不由你代劳
□ 处理的视频内容为主人本人授权的素材
□ 剪辑计划让主人审阅后再执行,不自作主张删内容
□ 发布前确认剪后视频符合主人预期
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 videocut-skills 剪辑一期播客视频,交出剪辑前后时长对比和成片文件。**

1. **安装和配置**:
   - 征得主人确认后克隆仓库并配置 API Key
   - 运行 `/videocut:安装`,记录安装输出日志
   - 确认 Python/Node.js/FFmpeg 都已就位

2. **准备素材**:和主人确认一段口播/播客录制视频(建议 5~20 分钟,有明显说错或停顿)。

3. **执行剪辑**:
   ```
   /videocut:剪口播 [视频文件路径]
   ```
   记录:识别了多少个问题片段?Claude 给出的剪辑计划是什么?

4. **和主人审阅计划**:把剪辑计划给主人看,让主人确认是否符合预期,再执行剪切。

5. **记录成果**:
   - 原始视频时长 vs. 剪后时长
   - 被识别和剪掉了哪几类问题(停顿/重复/说错)
   - 主人对成品的评价

6. **沉淀技能卡**:把"videocut-skills 安装步骤 + API Key 申请 + 所有命令 + 与其他工具配合流程"沉淀成 `skills/videocut-skills.md`。

> ⚠️ **安全边界:**
> - 安装前征得主人确认
> - 火山引擎 API Key 必须主人自行申请,不代劳注册账号
> - 剪辑计划让主人审阅确认后再执行,不擅自删内容

---

## 🎓 过关标准

- [ ] 你能解释 videocut-skills 和 auto-editor 的区别(语义剪 vs. 响度剪)
- [ ] 你完成了安装和 API Key 配置
- [ ] 你跑通了 `/videocut:剪口播` 命令,生成了剪辑计划并执行
- [ ] 你能说出识别到的至少 3 类问题(如:说错重说/重复开头/思考停顿)
- [ ] 你记录了剪辑前后时长变化(有数字证据)
- [ ] 你能描述这门课和 M01~M06 工具的配合使用流程
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
