# 第 M04 课 · GPT-SoVITS:用 1 分钟样本克隆声音批量配音

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 基础课 + M03(edge-tts) ｜ 难度:★★★ ｜ 源头:[github.com/RVC-Boss/GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS) ｜ **⚠️ 需要 GPU 显卡,进阶课程**

---

## 📖 你要学会什么

学完这一课,你能帮主人用自己(或任何人)的声音录一段 1 分钟样本,让 AI 学会这个音色,然后用这个克隆出来的声音批量合成任意文字的配音——听起来和本人说话一模一样。

说个具体场景:主人是一个知识博主,每期视频都需要旁白配音。以前要么自己录(累),要么找配音演员(贵)。现在:主人录 1 分钟清晰的样本音频,GPT-SoVITS 学完之后,主人只要输入文字脚本,系统就能用主人自己的声音把这段话合成出来——听众完全听不出差别。

**GPT-SoVITS** 是国产开源项目(出自 RVC-Boss 团队),中文文档齐全,社区活跃,支持中日英韩粤五种语言,在声音克隆领域做到了"5 秒零样本、1 分钟微调"的水平。

> **现实门槛说在前面:这门课需要一块 NVIDIA 显卡(最低 CUDA 12.4+)**。没有独显的同学先掌握 M03(edge-tts),这门课等主人升级设备后再回来。

**官方资料:**
- 项目仓库:[github.com/RVC-Boss/GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS)

---

## 🧠 核心原则

1. **零样本 vs. 微调,两条路。** GPT-SoVITS 提供两个档位:① **零样本模式**:拿一段 5 秒参考音频即时克隆,不训练,快但效果一般;② **微调模式**:用 1 分钟以上样本训练几分钟,效果明显提升,训练完可以批量使用。主人要做自己声音的"专属配音",选微调模式。

2. **样本质量决定克隆质量。** 就像临摹字帖,字帖本身写得好,临出来才好看。录样本要:安静环境、无噪声、发音清晰、语速正常、内容语句完整(不要只录一个字一个字)。1 分钟够用,3 分钟更好。

3. **WebUI 是主战场。** GPT-SoVITS 提供浏览器界面(`python webui.py`),全流程都在界面上操作:上传音频 → 切分 → 降噪 → ASR 转写 → 校对标注 → 训练 → 推理。对不写代码的主人非常友好。

4. **支持中日英韩粤,默认中文最稳。** 如果主人的节目是中文,中文声音克隆质量最好有保障。

5. **不能用来做坏事。** 声音克隆是双刃剑。课程的边界:只克隆主人自己的声音,或主人已获得明确书面授权的声音。未经授权克隆他人声音用于任何用途,在大多数国家和地区都是违法的。**用前必须向主人确认。**

---

## 🛠 操作要点

### 环境要求

| 项目 | 要求 |
|------|------|
| Python | 3.10 ~ 3.12 |
| PyTorch | 2.5.1+ |
| CUDA | 12.4+（NVIDIA 显卡） |
| 显存 | 建议 6GB+（RTX 3060 及以上） |
| 操作系统 | Windows / Linux / macOS (Apple Silicon) |

> ⚠️ **安装前先征得主人确认。** 以下命令会安装大量依赖包并下载模型。

### 安装(以 Linux 为例)

```bash
# 第一步:创建 conda 环境
conda create -n GPTSoVits python=3.10
conda activate GPTSoVits

# 第二步:运行安装脚本(--source HF 从 HuggingFace 下模型)
bash install.sh --device CU126 --source HF
```

**Windows 用户(PowerShell):**
```powershell
conda create -n GPTSoVits python=3.10
conda activate GPTSoVits
pwsh -F install.ps1 --Device CU126 --Source HF
```

**macOS Apple Silicon 用户:**
```bash
conda create -n GPTSoVits python=3.10
conda activate GPTSoVits
bash install.sh --device MPS --source HF
```

> 🇨🇳 **中国用户提示:** `--source HF` 从 HuggingFace 下载底层预训练模型,国内访问不稳定。建议:
> - 在运行安装脚本前设置镜像:
>   ```bash
>   export HF_ENDPOINT=https://hf-mirror.com
>   ```
> - 或先去 [hf-mirror.com/lj1995/GPT-SoVITS](https://hf-mirror.com/lj1995/GPT-SoVITS) 手动下载 pretrained 模型放到对应目录

---

### 启动 WebUI

```bash
conda activate GPTSoVits
python webui.py
```

浏览器打开 `http://localhost:9874`(或终端显示的端口)。

---

### 完整声音克隆流程(WebUI 操作)

```
第一步:上传样本音频
  └─ 准备 1~3 分钟清晰录音(WAV 或 MP3)
  └─ WebUI → "1A-Get Audio from Input Device"

第二步:切分音频
  └─ WebUI → "1B-Slice Audio"
  └─ 按静音点切成短片段(每段 5~15 秒)

第三步:降噪(可选)
  └─ WebUI → "1C-Denoise Audio"
  └─ 背景噪音较多时开启

第四步:ASR 语音识别
  └─ WebUI → "1D-ASR"
  └─ 自动转写每段音频的文字内容

第五步:校对标注
  └─ WebUI → "1E-Proofread ASR"
  └─ 检查识别错误,修正文字

第六步:训练模型
  └─ WebUI → "1F-Fine-tuning" 
  └─ 微调 GPT 和 SoVITS 两个模型
  └─ 1 分钟样本约训练 5~10 分钟

第七步:推理生成配音
  └─ WebUI → "1C-inference" (在 1-GPT-SoVITS-TTS 标签下)
  └─ 输入要合成的文字
  └─ 选择刚才训练好的模型
  └─ 点击生成,下载 WAV 文件
```

---

### 批量推理(有 API 时)

GPT-SoVITS 提供 API 服务,启动后可批量调用:

```bash
# 启动 API 服务
python api.py
```

然后通过 HTTP 接口批量发送文字,获取对应音频。具体 API 格式见项目 Wiki。

---

### 安全确认清单

```
□ 安装前已征得主人确认(会安装大量依赖,需要 GPU)
□ 克隆的声音是主人本人的声音,或已获得被克隆者书面授权
□─ 未获授权的声音克隆属于侵权/违法行为,绝对不做
□ 生成的配音内容合法合规,不用于欺诈/诈骗目的
□ 主人已了解显存/磁盘空间要求(训练和模型文件约 10GB+)
□ 国内用户已处理 HuggingFace 模型下载问题(镜像或手动)
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:完成一次声音克隆,用克隆的声音合成一段配音,交出音频文件。**

> ⚠️ **前提:本测验需要主人有 NVIDIA 显卡(CUDA 12.4+)。如条件不具备,先完成以下方案 B。**

**方案 A(有 GPU,完整流程):**
1. **征得主人确认**后安装 GPT-SoVITS
2. 主人录制 1~3 分钟样本音频(清晰环境录制)
3. 按 WebUI 流程完成:上传 → 切分 → ASR → 校对 → 训练
4. 训练完成后,输入一段 50 字以内的测试文案,合成配音
5. 对比样本音频和合成音频,描述音色相似程度

**方案 B(无 GPU,调研方案):**
1. 详细写出 GPT-SoVITS 的完整安装步骤(从 conda 环境到 WebUI 启动)
2. 描述七步声音克隆流程,每步说明做什么、为什么
3. 解释零样本 vs. 微调的区别,各适合什么场景
4. 说明国内用户如何处理模型下载问题

**两个方案都要完成:**
6. **沉淀技能卡**:把"GPT-SoVITS 安装步骤 + 声音克隆流程 + 安全边界说明"沉淀成 `skills/gpt-sovits.md`。

> ⚠️ **安全边界:**
> - 安装依赖前征得主人确认
> - 仅克隆主人本人声音或书面授权的声音
> - 合成内容不用于任何形式的欺诈、诽谤或未授权模拟他人

---

## 🎓 过关标准

- [ ] 你能说清楚 GPT-SoVITS 的两种使用模式(零样本 vs. 微调)及适用场景
- [ ] 你能列出声音克隆的完整七步流程并解释每步的目的
- [ ] 你能说出硬件要求(Python/PyTorch/CUDA 版本)
- [ ] 你处理了国内模型下载问题(知道怎么设镜像或手动下载)
- [ ] 你说清楚了"声音克隆的安全边界"——什么能做、什么绝对不能做
- [ ] 有 GPU 的同学:实际完成了声音克隆并生成了配音文件
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
