# 第 M05 课 · YuE:AI 作曲——按主题生成一段 BGM

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 基础课 ｜ 难度:★★★★ ｜ 源头:[github.com/multimodal-art-projection/YuE](https://github.com/multimodal-art-projection/YuE) ｜ **⚠️ 进阶可选:显存门槛高,无高端 GPU 请看文末替代方案**

---

## 📖 你要学会什么

学完这一课,你能帮主人按照指定的风格、歌词、情绪,让 AI 生成一段完整的带人声的歌曲或纯器乐 BGM——从歌词输入到最终 MP3,整个过程不需要主人会弹琴、写曲、唱歌。

想象一下:主人要给一期视频配一首原创片头曲,以前要么找音乐人(贵),要么用版权音乐(受限),要么用循环素材(敷衍)。现在有了 **YuE(乐)**,你输入"流行风格,励志主题,女声,歌词是……",几分钟后一首带完整编曲和人声的歌曲就生成出来了。

**YuE** 是国产 AI 音乐大模型(来自清华/中科院团队),名字取自"乐"字,意为音乐与快乐。支持中文、英文、粤语、日语、韩语,Apache 2.0 开源,可商用。

> ⚠️ **Meta MusicGen 参考提示:** Meta 也有一个 AI 音乐模型 [MusicGen](https://github.com/facebookresearch/audiocraft)。注意:MusicGen 采用 **CC BY-NC(非商业用途)**授权,**生成的音频不可用于商业目的**。YuE 是 Apache 2.0 可商用,如果主人有商业需求请优先选 YuE。

**官方资料:**
- 项目仓库:[github.com/multimodal-art-projection/YuE](https://github.com/multimodal-art-projection/YuE)
- HuggingFace 模型:[huggingface.co/m-a-p](https://huggingface.co/m-a-p)

---

## 🧠 核心原则

1. **"歌词 + 风格标签"是 YuE 的输入语言。** 和 ChatGPT 用自然语言不一样,YuE 用的是结构化的提示词:genre 标签(风格、乐器、情绪、人声性别、音色)+ 带结构标记的歌词(`[verse]`/`[chorus]`/`[bridge]`)。想要什么风格,就用这套"标签语言"描述清楚。

2. **显存要求比较硬。** 这不是普通消费级任务:
   - 生成 30 秒音频:至少 24GB 显存(或用量化工具压缩)
   - 生成完整歌曲(4 段以上):需要 80GB 显存(A100/H800 级别,或 4×RTX 4090)
   - **RTX 4090 单卡大约 6 分钟出一段 30 秒音频**
   - 没有满足条件的 GPU,本课程建议用在线平台替代(见下方)

3. **两种生成模式各有用途。** ① CoT 模式(Chain-of-Thought):先"思考"再生成,质量更稳定;② ICL 模式(In-Context Learning):提供参考音频,生成风格接近的新曲。想要"类似某首歌的风格"用 ICL。

4. **授权是关键。** YuE 本身 Apache 2.0 开源可商用,但生成物的版权仍需主人自行确认所在平台的用户协议。另外,如果用 ICL 提供了别人的歌曲作为参考,需要确认版权许可。

5. **国内用户网盘替代。** YuE 模型托管在 HuggingFace,国内下载不稳定——首次运行会自动拉取约 10~20GB 的模型文件。必须提前处理(镜像或手动下载)。

---

## 🛠 操作要点

### 环境要求

| 项目 | 要求 |
|------|------|
| 操作系统 | Linux / WSL(Windows Subsystem for Linux) |
| Python | 3.8 |
| CUDA | 11.8+ |
| GPU 显存 | 24GB(基础)/ 80GB(完整歌曲) |

> ⚠️ **安装前先征得主人确认。** 以下步骤会下载约 5~20GB 依赖和模型。

### 安装

```bash
# 第一步:创建环境
conda create -n yue python=3.8
conda activate yue

# 第二步:安装 PyTorch(CUDA 11.8)
conda install pytorch torchvision torchaudio cudatoolkit=11.8 -c pytorch -c nvidia

# 第三步:克隆仓库
git clone https://github.com/multimodal-art-projection/YuE.git
cd YuE

# 第四步:安装依赖
pip install -r requirements.txt

# 第五步:安装 Flash Attention 2(必须,提升内存效率)
pip install flash-attn --no-build-isolation

# 第六步:下载音频编解码器模型
cd inference/
git clone https://huggingface.co/m-a-p/xcodec_mini_infer
```

> 🇨🇳 **国内用户:HuggingFace 下载替代**
> ```bash
> # 设置镜像(所有 huggingface 下载都走镜像)
> export HF_ENDPOINT=https://hf-mirror.com
> # 然后 git clone 改为:
> git clone https://hf-mirror.com/m-a-p/xcodec_mini_infer
> ```
> 主模型(7B 级别)同理,从 hf-mirror.com/m-a-p 找对应仓库下载。

---

### 准备输入文件

**genre.txt(风格标签,5 个维度,英文)**
```
pop electric_guitar emotional female powerful
```

**lyrics.txt(歌词,带结构标记)**
```
[verse]
每一天清晨 阳光照进窗
我带着梦想 出发在路上

[chorus]
向前走 不回头
未来的路 我自己来走
```

---

### 运行生成(CoT 模式)

```bash
cd YuE/inference/
python infer.py \
    --cuda_idx 0 \
    --stage1_model m-a-p/YuE-s1-7B-anneal-zh-cot \
    --stage2_model m-a-p/YuE-s2-1B-general \
    --genre_txt ../prompt_egs/genre.txt \
    --lyrics_txt ../prompt_egs/lyrics.txt \
    --run_n_segments 2 \
    --stage2_batch_size 4 \
    --output_dir ../output \
    --max_new_tokens 3000 \
    --repetition_penalty 1.1
```

输出文件在 `../output/` 目录下,格式为 WAV。

---

### 没有高端 GPU 的替代方案(国内用户)

如果主人设备没有 24GB+ 显存,可以用以下在线平台体验 YuE 或类似模型:

| 平台 | 说明 | 门槛 |
|------|------|------|
| [Suno](https://suno.com) | AI 歌曲生成,有中文支持 | 需海外账号,免费有限额 |
| [网易天音](https://tianyin.music.163.com/) | 国内平台,中文友好 | 需网易账号 |
| [万兴播爆](https://virbo.wondershare.cn) | 国内 AI 视频配乐工具 | 收费 |
| Google Colab + YuE | 用 Colab 的 A100 跑 YuE | 需谷歌账号,可能需翻墙 |

> **提示:**在线平台适合快速出结果,本地部署适合有隐私要求或需要批量生成的场景。

---

### 安全确认清单

```
□ 安装前已征得主人确认(GPU 要求、磁盘空间约 20GB+)
□ 国内用户已处理 HuggingFace 下载问题(镜像或手动)
□ 如使用 ICL 参考音频,已确认参考音频版权许可
□ 生成的音乐用于商业目的时,主人已了解 YuE Apache 2.0 协议
□ 对比:若使用 MusicGen,已明确告知主人其 CC BY-NC 非商用限制
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:按主题生成一段 BGM 或完整歌曲片段,交出音频文件。**

**方案 A(有满足条件的 GPU,完整流程):**
1. 准备 genre.txt(选一个风格)和 lyrics.txt(写 4~8 行带结构的歌词)
2. 征得主人确认后安装并运行 YuE
3. 生成 2 个 segment(约 30~60 秒音频)
4. 描述生成效果:风格是否匹配?人声质量如何?

**方案 B(无满足条件 GPU,调研+在线替代):**
1. 详细写出 YuE 的完整安装和运行命令
2. 解释 genre.txt 的 5 个维度标签格式和 lyrics.txt 的结构标记
3. 解释 CoT 和 ICL 两种模式的区别
4. 用网易天音或 Suno 生成一段 AI 音乐,截图记录
5. 说明 YuE(Apache 2.0)和 MusicGen(CC BY-NC)在商业用途上的区别

**两个方案都要完成:**
6. **沉淀技能卡**:把"YuE 安装步骤 + 输入格式 + 运行命令 + 在线替代方案 + 版权说明"沉淀成 `skills/yue-music.md`。

> ⚠️ **安全边界:**
> - 安装前征得主人确认(显存和磁盘要求高)
> - ICL 模式的参考音频必须确认版权
> - 商业发布前确认 YuE 协议条款

---

## 🎓 过关标准

- [ ] 你能说清楚 YuE 的显存要求,并知道没有高端 GPU 时的替代方案
- [ ] 你能写出正确的 genre.txt 和 lyrics.txt 格式(包括结构标记)
- [ ] 你能解释 CoT 和 ICL 两种生成模式的区别
- [ ] 你明确知道 MusicGen 是 CC BY-NC 非商用、YuE 是 Apache 2.0 可商用
- [ ] 你跑通了生成(有 GPU)或在替代平台完成了生成(无 GPU)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
