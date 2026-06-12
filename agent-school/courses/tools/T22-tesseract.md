# 第 T22 课 · Tesseract OCR 从图片抠出文字

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T20-pillow 或 T21-imagemagick ｜ 难度:★★★ ｜ 源头:Tesseract 官方文档 · [tesseract-ocr.github.io/tessdoc/](https://tesseract-ocr.github.io/tessdoc/) · pytesseract · [github.com/madmaze/pytesseract](https://github.com/madmaze/pytesseract)

---

## 📖 你要学会什么

学完这一课,你能从图片(截图、扫描件、照片)里把文字抠出来,存成可编辑的文本——俗称 OCR(光学字符识别)。支持中文、英文以及几十种语言的混合识别。

想象你拿到一份 PDF 扫描件,里面是古早的纸质合同,全是图片,没有可以复制的文字。你不可能一个字一个字手打,但 Tesseract 可以。它就像一双能读图的眼睛:**把图片里的每一个字,转化成你能用代码操作的字符串**。20 世纪 80 年代 HP 研发、Google 维护至今,Tesseract 是业界历史最悠久的开源 OCR 引擎。

pytesseract 是 Tesseract 的 Python 包装器,让你能在 Python 里一行代码完成识别。

**官方资料:**
- Tesseract 文档: [tesseract-ocr.github.io/tessdoc/](https://tesseract-ocr.github.io/tessdoc/)
- Tesseract GitHub: [github.com/tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)
- pytesseract GitHub: [github.com/madmaze/pytesseract](https://github.com/madmaze/pytesseract)
- pytesseract PyPI: [pypi.org/project/pytesseract](https://pypi.org/project/pytesseract/)
- 语言包下载: [github.com/tesseract-ocr/tessdata](https://github.com/tesseract-ocr/tessdata)

---

## 🧠 核心原则(内化成习惯)

1. **图片质量决定识别质量——垃圾进垃圾出。** Tesseract 是个好学生,但你给它一张模糊、歪斜、低对比度的图片,它也读不出好结果。识别前先"整容":① 转灰度;② 二值化(黑白);③ 纠偏(deskew);④ 放大到 300DPI 以上。这四步预处理能让准确率从 60% 跳到 90%+。

2. **中文识别必须安装中文语言包。** 默认安装只有英文(eng)。识别中文要额外安装 `chi_sim`(简体中文)或 `chi_tra`(繁体中文)语言包;混合中英文识别用 `lang="chi_sim+eng"`。这不是选项,是**必须**的前置条件。

3. **PSM(页面分割模式)直接影响结果——要会选。** `--psm 3` 是"完整页面,自动分析"(默认,适合全页文档);`--psm 6` 是"假设是一块均匀的文字"(适合单段落或表格);`--psm 7` 是"把整行当成一行文字"(适合单行截图、验证码)。选错模式,整段文字可能只输出几个字。

4. **输出不只有纯文本——可以带位置信息和置信度。** `pytesseract.image_to_data()` 能给你每个词的坐标框(left/top/width/height)和置信度(conf)。做自动化表单填写、文档结构分析时,这个功能很关键。

5. **Tesseract 不擅长的别硬刚——知道边界才不踩坑。** 以下场景 Tesseract 效果差,考虑换方案(如 PaddleOCR 或商业 API):艺术字/手写字、图片旋转超过 15°且没纠偏、密集表格嵌套、低对比度彩色背景。

---

## 🛠 操作要点

### 安装(两步,缺一不可)

```bash
# 第一步:安装 Tesseract 引擎(系统级工具)
# macOS:
brew install tesseract tesseract-lang
# Ubuntu/Debian:
sudo apt install tesseract-ocr
# 仅安装简体中文包:
sudo apt install tesseract-ocr-chi-sim
# 安装所有语言包(约 400MB):
sudo apt install tesseract-ocr-all

# Windows:
# 从 UB-Mannheim 维护的安装包下载: https://github.com/UB-Mannheim/tesseract/wiki
# 安装时勾选"Additional language data(Download)" → Chinese Simplified

# 第二步:安装 Python 包装器
pip install pytesseract Pillow

# 验证:列出已安装的语言包
tesseract --list-langs
# 应该包含 chi_sim 和 eng
```

> ⚠️ **系统级安装,未经主人确认不得真装真跑,只先给方案。**
>
> 🇨🇳 **国内下载提示**:apt 安装语言包速度取决于软件源配置。如果官方源慢,可先换阿里云/清华源:
> ```bash
> # 换阿里云源(Ubuntu 22.04 示例)
> sudo sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
> ```

### 最小可运行示例(内嵌测试数据)

以下示例**不需要真实图片文件**,用代码生成一张测试图就能验证流程:

```python
from PIL import Image, ImageDraw, ImageFont
import pytesseract

# ── 生成测试图片(不需要真实文件)──
test_img = Image.new("RGB", (400, 100), color="white")
draw = ImageDraw.Draw(test_img)
draw.text((20, 30), "Hello World 2026", fill="black")
test_img.save("/tmp/test_ocr.png")

# ── 英文 OCR ──
result = pytesseract.image_to_string(test_img, lang="eng")
print("识别结果:", result.strip())
# 预期输出: Hello World 2026
```

### 识别真实图片

```python
from PIL import Image
import pytesseract

def ocr_image(image_path: str, lang: str = "chi_sim+eng") -> str:
    """
    识别图片中的文字。
    lang: "chi_sim"=简体中文, "chi_tra"=繁体, "eng"=英文
          "chi_sim+eng"=中英混合(最常用)
    """
    img = Image.open(image_path)
    # PSM 3 = 全页自动分析(默认)
    # PSM 6 = 假设为单块均匀文字
    # PSM 7 = 单行文字
    config = "--psm 3 --oem 3"
    text = pytesseract.image_to_string(img, lang=lang, config=config)
    return text.strip()

# 示例(需主人确认后才能真跑)
# text = ocr_image("screenshot.png")
# print(text)
```

### 图片预处理(提升准确率)

```python
from PIL import Image, ImageFilter, ImageEnhance
import pytesseract

def preprocess_and_ocr(image_path: str, lang: str = "chi_sim+eng") -> str:
    """预处理后再 OCR,准确率更高"""
    img = Image.open(image_path)

    # 1. 转灰度
    img = img.convert("L")

    # 2. 放大(低分辨率图片放大 2x,帮助识别)
    w, h = img.size
    if w < 1000:
        img = img.resize((w * 2, h * 2), Image.LANCZOS)

    # 3. 增强对比度
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2.0)

    # 4. 二值化(阈值 128,黑白图)
    img = img.point(lambda x: 0 if x < 128 else 255, "1")

    # 5. OCR
    config = "--psm 6 --oem 3"
    text = pytesseract.image_to_string(img, lang=lang, config=config)
    return text.strip()
```

### 获取带位置的识别结果

```python
import pytesseract
from PIL import Image
import pandas as pd

def ocr_with_positions(image_path: str, lang: str = "chi_sim+eng"):
    """返回每个词的文字、坐标、置信度"""
    img = Image.open(image_path)
    data = pytesseract.image_to_data(img, lang=lang,
                                      output_type=pytesseract.Output.DATAFRAME)
    # 过滤掉空字和低置信度
    data = data[(data["conf"] > 60) & (data["text"].str.strip() != "")]
    return data[["text", "left", "top", "width", "height", "conf"]]
```

### PSM 模式速查

| PSM 值 | 适用场景 |
|--------|----------|
| `--psm 3` | 全页文档,自动分析(默认) |
| `--psm 6` | 单段文字块,无复杂布局 |
| `--psm 7` | 单行文字(截图、单行标签) |
| `--psm 11` | 稀疏文字,尽可能多找文字 |
| `--psm 13` | 单行,不做语言处理(验证码) |

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个"截图文字提取"的完整方案。**

场景:主人有一批带文字的截图(来自聊天记录、网页截图等),需要把里面的中英文文字全部提取出来,保存为 `.txt` 文件。

你需要完成:

1. **用代码生成一张含中英文的测试图片**(不依赖外部文件),对这张自制图片跑 OCR,把识别结果打印出来——这是**可以直接跑**的最小验证。

2. **写出完整的批量提取脚本**:
   - 遍历 `screenshots/` 目录的所有 PNG/JPG 文件
   - 对每张图进行预处理(灰度 + 增强对比度 + 二值化)
   - 用 `chi_sim+eng` 混合识别
   - 把结果写到 `output/<文件名>.txt`
   - 失败的记录到 `output/failed.txt`

3. **写出验收标准**:
   - 测试图片(自制)的识别结果包含你写进去的关键词
   - 输出的 txt 文件编码为 UTF-8
   - 置信度低于 60 的词不纳入最终输出

4. **写出中文识别失败的排查步骤**:
   - `tesseract --list-langs` 确认 chi_sim 已安装
   - `--psm` 模式是否匹配图片类型
   - 图片分辨率是否太低(小于 150DPI 需先放大)

5. **写出安全提示**:
   - 截图可能包含隐私内容,处理前确认来源
   - **未经主人确认不得真装真跑**

6. **沉淀技能卡**到 `agent-school/skills/tesseract-ocr.md`。

> ⚠️ **安全边界**:第 1 步的最小测试可以在已安装环境下运行验证;第 2 步的批量脚本**必须先得到主人明确确认再执行**。

---

## 🎓 过关标准

- [ ] 你写出了能生成测试图并跑通 OCR 的最小可验证脚本(英文识别部分不依赖外部图片)
- [ ] 你写出了完整的预处理 + 批量识别脚本
- [ ] 你能解释 PSM 3/6/7 三种模式的适用场景
- [ ] 你知道中文识别必须装 chi_sim 语言包,以及国内如何快速安装
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/tesseract-ocr.md`](../../skills/tesseract-ocr.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T23 课。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 Tesseract + pytesseract 做 OCR

- **什么时候用**:从图片/截图/扫描件中提取文字(中英文均可)
- **来自**:T22 课 Tesseract OCR

## 步骤
1. 安装:系统装 tesseract + chi_sim 语言包;pip install pytesseract Pillow
2. 验证语言包:tesseract --list-langs(确认含 chi_sim)
3. 预处理:灰度 → 放大(低分辨率图) → 增强对比度 → 二值化
4. 识别:pytesseract.image_to_string(img, lang="chi_sim+eng", config="--psm 6")
5. 带位置:pytesseract.image_to_data(..., output_type=Output.DATAFRAME)
6. 批量:遍历目录,try/except 包住每张,失败记录到日志

## 验证
- 对自制测试图(代码生成)跑识别,确认关键词被识别出来
- 中文字符出现在输出中(不是乱码)

## 注意
- 中文识别必须安装 chi_sim 语言包
- PSM 3=全页 / PSM 6=单块 / PSM 7=单行 — 选错影响很大
- 图片分辨率低于 150DPI 先放大 2x 再识别
- Tesseract 不擅长手写体、艺术字、严重歪斜 — 这些考虑换 PaddleOCR
- 安装前先 tesseract --version 检查是否已存在
```
