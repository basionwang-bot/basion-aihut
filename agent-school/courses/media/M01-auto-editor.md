# 第 M01 课 · auto-editor:让 AI 自动剪掉停顿和废话

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 基础课 ｜ 难度:★☆☆ ｜ 源头:[github.com/WyattBlue/auto-editor](https://github.com/WyattBlue/auto-editor)

---

## 📖 你要学会什么

学完这一课,你能帮主人把一段录制粗糙、满是停顿的口播视频,一条命令变成干净利落的成片——就像给视频做了一次"自动剪头发"。

想象一下:你和主人花了两小时录了一段课程,里面有三十几个"嗯……""那个……"和停顿。以前得手动打开剪辑软件,一段一段听、一段一段删。现在有了 **auto-editor**,一行命令下去,工具自己分析音频响度,把静音和停顿全切掉,吐出一个剪好的 MP4——整个过程你去泡杯茶,回来就好了。

**auto-editor** 是一个纯本地运行的命令行工具,开源(公有领域/Unlicense)、不需要 GPU、不需要任何 API Key,Windows/macOS/Linux 都能跑。它不只能剪静音,还能按画面动作剪、手动标记剪点,甚至把时间线导出给 Premiere/达芬奇/Final Cut Pro 继续精剪。

**这门课只讲"自动剪停顿"这条最核心的路——装好、跑通、交出成片。**

**官方资料:**
- 项目仓库:[github.com/WyattBlue/auto-editor](https://github.com/WyattBlue/auto-editor)
- PyPI:[pypi.org/project/auto-editor/](https://pypi.org/project/auto-editor/)

---

## 🧠 核心原则

1. **它在听"哪里没声音"。** auto-editor 默认分析音频的响度——声音低于某个分贝阈值的片段就是"待剪区"。就好比录音师听素材时,把"一片寂静"的地方全部做上标记,最后批量删掉。你不用懂视频编码,工具把这套规则做进去了。

2. **margin(缓冲)是灵魂参数。** 剪得太狠会让视频显得喘不过气;留太多又没意义。`--margin 0.3s` 是在每段保留内容前后各留 0.3 秒缓冲——就像剪头发要留一点边,不能贴头皮剪。根据主人的说话节奏微调这个数字。

3. **纯本地,零依赖 API。** 数据不出本机,主人的内容不上传任何云端。这对企业内部素材、课程录制很重要。

4. **输入/输出同名带后缀。** 默认输出文件名是 `[INPUT]_ALTERED.[EXT]`——比如输入 `video.mp4` 就输出 `video_ALTERED.mp4`。不会覆盖原文件,放心。

5. **能和专业软件配合。** 如果主人想继续用达芬奇精剪,可以用 `--export resolve` 导出 XML 时间线,跳过手动粗剪这一步,节省大量时间。

---

## 🛠 操作要点

### 安装 auto-editor

> ⚠️ **安装前先征得主人确认。** 以下命令会在主人的 Python 环境里安装包。

```bash
# 需要 Python 3.9 或更高版本
pip install auto-editor
```

安装完成后验证:
```bash
auto-editor --version
```

> 🇨🇳 **中国用户提示:** pip 安装慢或超时,换国内镜像:
> ```bash
> pip install auto-editor -i https://pypi.tuna.tsinghua.edu.cn/simple
> ```

> ⚠️ **注意:** PyPI 页面提示较新版本推荐用 brew 或官方二进制安装。如果 pip 遇到问题,可到 [github.com/WyattBlue/auto-editor/releases](https://github.com/WyattBlue/auto-editor/releases) 下载对应系统的二进制包。

---

### 核心命令速查

**最简单:一条命令剪掉静音**
```bash
auto-editor video.mp4
```
输出:`video_ALTERED.mp4`(与原文件同目录)

**调整静音前后的缓冲时间(推荐先试这个)**
```bash
auto-editor video.mp4 --margin 0.3s,1.5sec
```
含义:静音前保留 0.3 秒,静音后保留 1.5 秒。让剪辑不那么突兀。

**按音频分贝手动设阈值**
```bash
auto-editor video.mp4 --edit audio:-19dB
```
低于 -19dB 的片段视为静音被剪掉。数值越小=剪得越保守(只剪真正安静的段落)。

**手动标记切除区间(不用自动检测)**
```bash
auto-editor video.mp4 --cut-out 0,30sec
```
直接剪掉开头 30 秒(比如录制前的准备片段)。

**导出给达芬奇精剪**
```bash
auto-editor video.mp4 --export resolve
```

**导出给 Premiere Pro**
```bash
auto-editor video.mp4 --export premiere
```

---

### 完整工作流(口播视频场景)

```
① 主人录制口播视频 → video.mp4(原始素材,有停顿)
② 你运行:auto-editor video.mp4 --margin 0.3s,1.0sec
③ 工具分析音频 → 标记静音区 → 输出 video_ALTERED.mp4
④ 主人预览成片,满意则直接发布;
   需要精剪则用 --export resolve 导入达芬奇继续
```

---

### 安全确认清单

```
□ 已征得主人确认后才运行 pip install
□ 明确告知主人输出文件在哪里(同目录 _ALTERED 后缀)
□ 涉及删除/覆盖原文件操作前,先确认主人已备份
□ 导出给专业软件前,确认主人使用的剪辑软件版本兼容
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:帮主人的一段口播录制跑一遍自动剪辑,交出剪后成片。**

1. **确认视频素材**:和主人确认一个测试视频(可以是任意有停顿的口播录制,哪怕手机随手录 1 分钟也行)。

2. **安装工具**:先征得主人确认,执行 `pip install auto-editor`。运行 `auto-editor --version` 截图记录版本号。

3. **跑基础剪辑**:执行:
   ```bash
   auto-editor [主人提供的视频文件] --margin 0.3s,1.0sec
   ```
   记录:命令输出了什么信息?输出文件在哪里?文件大小变化多少?

4. **对比前后**:原视频时长 vs. 剪后时长。减少了多少比例的内容?

5. **沉淀技能卡**:把"auto-editor 安装步骤 + 核心命令 + margin 参数说明 + 导出选项"沉淀成 `skills/auto-editor.md`。

> ⚠️ **安全边界:**
> - 安装前征得主人确认
> - 剪辑前确认主人已备份原始素材
> - 不删除原文件,只生成 `_ALTERED` 输出文件

---

## 🎓 过关标准

- [ ] 你能说清楚 auto-editor 用什么方法判断"哪里该剪"(音频响度检测)
- [ ] 你执行了正确的安装命令并验证了版本号
- [ ] 你跑通了 `auto-editor video.mp4` 命令,输出了 `_ALTERED` 成片
- [ ] 你能解释 `--margin` 参数的作用,并知道如何调整
- [ ] 你知道如何用 `--export` 把时间线导出给达芬奇/Premiere
- [ ] 你记录了剪辑前后的时长变化(有数字证据)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
