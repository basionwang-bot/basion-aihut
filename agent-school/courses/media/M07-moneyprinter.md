# 第 M07 课 · MoneyPrinterTurbo:输入选题,全自动出短视频成片

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 基础课 + M03(edge-tts) + M02(faster-whisper) ｜ 难度:★★★ ｜ 源头:[github.com/harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) ｜ **国内友好:默认 Edge TTS、支持 DeepSeek/通义/Ollama**

---

## 📖 你要学会什么

学完这一课,你能帮主人把"一个选题关键词"变成一条带配音、字幕、BGM、视频画面的完整短视频——就像有一条自动化流水线,你喂进去"原材料"(选题),流水线的另一头出来的是"成品"(可直接发布的视频)。

打个比方:以前做一条 60 秒的科普短视频,要写脚本(30 分钟)→ 找素材(1 小时)→ 录音或合成配音(20 分钟)→ 剪辑对齐(1 小时)→ 加字幕(30 分钟)→ 合成导出(10 分钟)。合计三四个小时。

有了 **MoneyPrinterTurbo**:你输入"选题:如何用 AI 提升工作效率",选好语言和配音声音,点击生成——工具自动完成"脚本生成→素材搜索→配音合成→字幕识别→BGM 混音→视频合成",10~20 分钟后一条成品视频出来。

**国内友好亮点:** 默认 TTS 是 Edge TTS(免费免 Key)、支持通义千问/DeepSeek/Ollama 作为大模型、字幕 Whisper 模型提供网盘下载——几乎不需要翻墙就能跑起来。

**官方资料:**
- 项目仓库:[github.com/harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo)

---

## 🧠 核心原则

1. **流水线思维:每一站都可以换零件。** MoneyPrinterTurbo 的架构是模块化的——大模型/TTS/字幕识别/素材来源,每一块都可以换。主人没有 OpenAI 账号?换 DeepSeek。没有 GPU?把 Whisper 换成更快的 edge 字幕。了解这个替换逻辑,才能灵活应对各种情况。

2. **素材来源是短板,提前说清楚。** 默认素材来源是 Pexels——这个平台国内访问**可能需要代理**。备选还有 Pixabay 和 Coverr。如果主人素材翻墙有障碍,需要提前告知。

3. **Whisper 字幕模型要预先下载。** 字幕使用 Whisper large-v3 模型(约 3GB),HuggingFace 下载国内不稳定。官方已提供国内网盘下载链接(百度网盘/夸克),下载后放到指定目录即可。

4. **LLM 选型要匹配主人的条件。** 支持的国内可用选项:
   - **DeepSeek**(推荐首选,便宜且效果好)
   - **通义千问(Qwen)**
   - **Ollama**(本地,零费用,速度取决于设备)
   - **百度文心一言**
   
5. **视频格式和比例先和主人确认。** 支持 9:16 竖屏(抖音/视频号/小红书)和 16:9 横屏(B站/YouTube)——生成前问清楚主人发哪个平台。

---

## 🛠 操作要点

### 系统要求

| 项目 | 最低 | 推荐 |
|------|------|------|
| CPU | 4 核 | 8+ 核 |
| 内存 | 4GB | 16GB+ |
| GPU 显存 | 无 GPU 可跑 | 8GB+(用 Whisper 时) |
| 操作系统 | Windows / macOS / Linux | - |

> ⚠️ **安装前先征得主人确认。**

### 安装方法一:Windows 一键包(最简单)

到 [github.com/harry0703/MoneyPrinterTurbo/releases](https://github.com/harry0703/MoneyPrinterTurbo/releases) 下载 Windows 整合包,解压后:

```
# 更新到最新版本
双击 update.bat

# 启动
双击 start.bat
```

浏览器打开显示的地址(通常是 `http://localhost:8501`)。

### 安装方法二:uv 手动安装(跨平台)

```bash
# 克隆仓库
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
cd MoneyPrinterTurbo

# 安装 Python 3.11
uv python install 3.11
uv sync --frozen
```

**启动 WebUI:**
```bash
# Windows
.\webui.bat

# macOS/Linux
uv run streamlit run ./webui/Main.py --browser.gatherUsageStats=False
```

**启动 API 服务:**
```bash
uv run python main.py
```

### 安装方法三:Docker

```bash
cd MoneyPrinterTurbo
docker-compose up
```

---

### 国内关键配置(必看)

#### 1. Whisper 模型国内下载

> 官方提供了网盘下载,不用去 HuggingFace!

- **百度网盘:** `https://pan.baidu.com/s/11h3Q6tsDtjQKTjUu3sc5cA?pwd=xjs9`
- **夸克网盘:** `https://pan.quark.cn/s/3ee3d991d64b`

下载后解压,放到 `MoneyPrinterTurbo/models/whisper-large-v3/` 目录。

#### 2. 配置 LLM(推荐 DeepSeek)

编辑 `config.toml`:

```toml
[app]
# 选择 LLM 提供商
llm_provider = "deepseek"

[deepseek]
# 去 platform.deepseek.com 申请 API Key
api_key = "your-deepseek-api-key"
```

> DeepSeek API 国内直连,按量付费,价格极低(千 token 约 0.001 元)。

#### 3. TTS 配置(默认 Edge TTS,无需配置)

Edge TTS 是默认 TTS,在 WebUI 里叫"Azure TTS V1",**完全免费、国内通常可直连**——无需任何配置,装完即用。

#### 4. 视频素材源(注意翻墙)

```toml
[app]
# 可选: pexels / pixabay / coverr
video_source = "pexels"

[pexels]
# 去 pexels.com/api 申请免费 API Key
api_keys = ["your-pexels-api-key"]
```

> ⚠️ **Pexels 和 Pixabay 国内访问可能需要代理。** 如果主人没有代理,建议提前告知这个限制。Coverr 需在 coverr.co/developers 注册获取免费 API(50 次/小时)。

---

### WebUI 操作流程(一图胜千言)

```
打开 http://localhost:8501
     ↓
① 填写视频主题(选题关键词)
② 选择语言(中文)
③ 选择视频尺寸(9:16 竖屏 or 16:9 横屏)
④ 选择 TTS 声音(默认 Edge TTS 晓晓)
⑤ 选择字幕风格(字体/颜色/位置)
⑥ 选择 BGM(内置音乐库 or 上传自定义)
⑦ 点击"生成视频"
     ↓
等待约 5~15 分钟(取决于设备和网络)
     ↓
⑧ 下载成品视频
```

---

### 命令行快速生成

```bash
uv run python cli.py --video-subject "如何用 AI 提升写作效率"
```

---

### 安全确认清单

```
□ 安装前已征得主人确认
□ 国内用户:Whisper 模型已从网盘下载并放到正确目录
□ LLM 提供商 API Key 已配置(推荐 DeepSeek,国内直连)
□ 素材来源(Pexels 等)的访问限制已告知主人
□ 生成视频中的素材版权符合使用场景(Pexels 素材大多免费商用)
□ 发布平台的 AI 生成内容规范已知悉
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:输入一个视频选题,跑通"脚本→画面→配音→字幕→成片"全流程,交出成品视频文件。**

1. **安装工具**:征得主人确认后,选择适合主人环境的安装方式(Windows 一键包最简单)。

2. **配置国内环境**:
   - 从网盘下载 Whisper 模型,放到对应目录
   - 配置 DeepSeek 或通义千问 API Key
   - 确认 Edge TTS 可用(通常无需额外配置)

3. **跑一条完整视频**:选一个简单选题(如"三个提高专注力的方法"),在 WebUI 里填写并点击生成。

4. **记录关键数据**:
   - 总耗时多少分钟?
   - 生成的脚本质量如何?
   - 视频时长?字幕是否准确?

5. **尝试调整**:改一个参数(语速/字幕样式/BGM),再生成一次,对比两版差异。

6. **沉淀技能卡**:把"MoneyPrinterTurbo 安装 + 国内环境配置 + WebUI 操作流程 + 常见问题"沉淀成 `skills/moneyprinter.md`。

> ⚠️ **安全边界:**
> - 安装前征得主人确认
> - 素材来源访问限制提前告知主人
> - 视频发布前确认 AI 生成内容符合目标平台规范

---

## 🎓 过关标准

- [ ] 你能描述 MoneyPrinterTurbo 的完整流水线(6 个自动化步骤)
- [ ] 你处理了国内关键配置(Whisper 网盘下载 + 国内 LLM 选型)
- [ ] 你跑通了完整流程,生成了一条可播放的成品视频
- [ ] 你能解释为什么素材来源(Pexels)可能需要代理,并知道备选方案
- [ ] 你知道如何调整 TTS 声音、字幕样式、视频比例等核心参数
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
