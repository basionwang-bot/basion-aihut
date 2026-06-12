# 第 T23 课 · pdfplumber 从 PDF 抠文字和表格

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:pdfplumber 官方文档 · [github.com/jsvine/pdfplumber](https://github.com/jsvine/pdfplumber) · [pypi.org/project/pdfplumber](https://pypi.org/project/pdfplumber/)

---

## 📖 你要学会什么

学完这一课,你能用 pdfplumber 打开 PDF 文件,精确提取里面的文字和表格——不是瞎猜,是逐字符、逐行、逐格地把数据取出来,存成 Python 字符串或列表,再交给你后续处理。

想象 PDF 是一个被锁进玻璃柜里的文件夹——你能看,但不能复制。pdfplumber 就是帮你**打开玻璃柜**的工具:它把 PDF 里的每个字符、每条线、每个表格格子,都摆到你面前,让你随意取用。

pdfplumber 是专门为"数字原生 PDF"(不是扫描件)设计的提取工具,在处理带表格的 PDF(财务报告、政府公告、合同)时尤其精准。它基于 pdfminer.six 构建,比直接用 pdfminer 更友好,比 PyMuPDF 在表格提取上更专注。

**官方资料:**
- GitHub 仓库: [github.com/jsvine/pdfplumber](https://github.com/jsvine/pdfplumber)
- PyPI 页面: [pypi.org/project/pdfplumber](https://pypi.org/project/pdfplumber/)
- 详细 README(含 API 参考): [github.com/jsvine/pdfplumber#readme](https://github.com/jsvine/pdfplumber#readme)

---

## 🧠 核心原则(内化成习惯)

1. **pdfplumber 只能处理"数字原生 PDF",不能处理扫描件。** 数字原生 PDF 是直接从 Word、Excel、打印机驱动生成的,里面有真实的文字信息;扫描件是纸张扫描后存成 PDF 的图片,里面只有图像,没有文字。判断方法:用 PDF 阅读器能不能框选复制文字——能复制就是数字原生,不能复制就是扫描件(扫描件要用 T22 课的 Tesseract)。

2. **逐页处理,不是一次性加载整个文件。** `with pdfplumber.open(path) as pdf:` 打开后,通过 `pdf.pages` 逐页迭代。大文件也不会把内存撑爆,因为每页按需读取。

3. **表格提取的准确率取决于 PDF 里有没有线条。** `page.extract_table()` 是根据 PDF 里的"线条/矩形"来判断单元格边界的——有规整边框线的表格识别率 90%+;没有边框、靠空格对齐的"假表格"就没那么准了,这时候要调 `table_settings` 参数或换策略(比如按列坐标切割文字)。

4. **`extract_text()` 是起点,`extract_words()` 是精细操作。** `page.extract_text()` 直接给你字符串,简单场景够用;`page.extract_words()` 给你每个词的文字+坐标,适合需要知道"这个词在哪里"的场景(比如找到特定关键词、再往右/下取数据)。

5. **用 `with` 语句打开 PDF,用完自动关闭。** pdfplumber 在处理期间持有文件句柄,不关闭的话批量处理时可能耗尽文件描述符。养成 `with pdfplumber.open(...) as pdf:` 的习惯。

---

## 🛠 操作要点

### 安装

```bash
pip install pdfplumber

# 验证安装
python -c "import pdfplumber; print(pdfplumber.__version__)"
```

> ⚠️ **未经主人确认不得真装真跑,只先给方案。**

### 最小可运行示例(内嵌测试数据)

以下示例用代码动态生成一个测试 PDF,**不依赖外部文件**,可以直接验证流程:

```python
# 先安装生成 PDF 的库(仅测试用)
# pip install reportlab

from reportlab.pdfgen import canvas
import pdfplumber, io

# ── 生成测试 PDF ──
buf = io.BytesIO()
c = canvas.Canvas(buf)
c.drawString(72, 750, "项目名称: 示例合同")
c.drawString(72, 720, "金额: 100,000 元")
c.drawString(72, 690, "日期: 2026-06-11")
c.save()
buf.seek(0)

# ── 用 pdfplumber 读取 ──
with pdfplumber.open(buf) as pdf:
    page = pdf.pages[0]
    text = page.extract_text()
    print("提取到的文字:")
    print(text)
    print(f"共 {len(pdf.pages)} 页")
# 预期输出包含: 项目名称: 示例合同
```

### 提取文字

```python
import pdfplumber

def extract_text_from_pdf(pdf_path: str) -> str:
    """提取 PDF 全部文字,逐页拼接"""
    all_text = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                all_text.append(f"--- 第 {i+1} 页 ---\n{text}")
    return "\n\n".join(all_text)

# 示例
# text = extract_text_from_pdf("report.pdf")
# with open("output/report.txt", "w", encoding="utf-8") as f:
#     f.write(text)
```

### 提取表格

```python
import pdfplumber
import csv

def extract_tables_from_pdf(pdf_path: str, output_csv: str):
    """提取 PDF 里所有表格,保存为 CSV"""
    all_rows = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, 1):
            tables = page.extract_tables()
            for t_idx, table in enumerate(tables):
                print(f"第 {page_num} 页,第 {t_idx+1} 个表格,{len(table)} 行")
                for row in table:
                    # 把 None 替换为空字符串
                    all_rows.append([cell or "" for cell in row])

    with open(output_csv, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerows(all_rows)
    print(f"共提取 {len(all_rows)} 行,保存到 {output_csv}")

# 示例(需主人确认后才能真跑)
# extract_tables_from_pdf("financial_report.pdf", "output/tables.csv")
```

### 精细操作:按坐标提取特定区域

```python
import pdfplumber

def extract_region(pdf_path: str, page_num: int,
                   bbox: tuple) -> str:
    """
    提取页面特定矩形区域内的文字。
    bbox: (x0, top, x1, bottom) — 坐标从左上角起,单位是点(1/72英寸)
    用 page.bbox 可以获取整页尺寸
    """
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[page_num - 1]
        region = page.crop(bbox)
        return region.extract_text() or ""

# 示例:提取第 1 页右上角区域(比如找日期)
# text = extract_region("contract.pdf", 1, bbox=(400, 0, 600, 100))
```

### 调整表格提取参数(没有边框线的表格)

```python
# 如果 extract_table() 效果不好,尝试自定义参数
table_settings = {
    "vertical_strategy": "lines",    # 或 "text"(按文字对齐), "explicit"
    "horizontal_strategy": "lines",  # 或 "text"
    "snap_tolerance": 5,             # 像素容差
    "join_tolerance": 5,
    "edge_min_length": 10,
    "min_words_vertical": 3,
    "min_words_horizontal": 1,
}
table = page.extract_table(table_settings=table_settings)
```

### 常用 API 速查

| 想干嘛 | 代码 |
|--------|------|
| 打开 PDF | `with pdfplumber.open("a.pdf") as pdf:` |
| 总页数 | `len(pdf.pages)` |
| 获取某页 | `pdf.pages[0]`(从 0 开始) |
| 提取全页文字 | `page.extract_text()` |
| 提取词+坐标 | `page.extract_words()` |
| 提取字符+坐标 | `page.extract_chars()` |
| 提取表格(单个) | `page.extract_table()` |
| 提取所有表格 | `page.extract_tables()` |
| 裁剪区域 | `page.crop((x0, top, x1, bottom))` |
| 页面尺寸 | `page.width, page.height` |
| 渲染为图片 | `page.to_image(resolution=150)` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个"PDF 报告自动解析"的完整方案,含可验证的最小测试。**

场景:主人收到一批 PDF 格式的财务报表,每份 PDF 包含文字说明和数据表格,需要:① 提取全部文字存为 txt;② 提取所有表格存为 CSV;③ 搜索关键词"合计"出现的页码。

你需要完成:

1. **用代码生成测试 PDF 并跑通提取流程**(用 reportlab 动态生成一个含文字的 PDF,再用 pdfplumber 提取,打印出来)——这部分**可以直接跑**,用于验证环境正常。

2. **写出完整的批量解析脚本**:
   - 遍历 `pdfs/` 目录所有 `.pdf` 文件
   - 对每份 PDF:提取文字 → 存 `output/<名>.txt`;提取表格 → 存 `output/<名>.csv`
   - 同时记录"合计"关键词在哪几页出现
   - 失败的记录到 `output/failed.txt`

3. **写出验收标准**:
   - txt 文件存在且不为空,编码为 UTF-8
   - CSV 文件用 Excel 打开没有乱码(`utf-8-sig` 编码)
   - 关键词搜索结果是页码列表(不是 True/False)

4. **写出什么时候 pdfplumber 不够用**(扫描件 → 指向 T22 课;需要修改 PDF → 指向 T24 课)

5. **写出安全提示**:
   - PDF 可能包含合同、财务等敏感信息,处理时确认数据权限
   - **未经主人确认不得真装真跑**

6. **沉淀技能卡**到 `agent-school/skills/pdfplumber-extract.md`。

> ⚠️ **安全边界**:第 1 步的最小测试在装好环境后可以直接跑验证;第 2 步批量脚本**必须先得到主人明确确认再执行**。

---

## 🎓 过关标准

- [ ] 你写出了用代码生成测试 PDF 再跑 pdfplumber 提取的最小可验证脚本
- [ ] 你写出了完整的批量文字+表格提取脚本
- [ ] 你能说清楚 `extract_text()` 和 `extract_words()` 的区别及各自适用场景
- [ ] 你知道什么时候 pdfplumber 搞不定(扫描件/加密PDF),并能指引替代方案
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/pdfplumber-extract.md`](../../skills/pdfplumber-extract.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T24 课。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 pdfplumber 提取 PDF 文字和表格

- **什么时候用**:从数字原生 PDF(非扫描件)提取文字或表格数据
- **来自**:T23 课 pdfplumber

## 步骤
1. 安装:pip install pdfplumber
2. 判断能否用:用阅读器能复制文字 → 数字原生 → 可以用;不能复制 → 扫描件 → 用 T22 Tesseract
3. 打开:with pdfplumber.open(path) as pdf:
4. 遍历:for page in pdf.pages:
5. 提取文字:page.extract_text()
6. 提取表格:page.extract_tables() → list of list of list
7. 批量时:try/except 每份 PDF,失败记录到日志

## 验证
- txt 文件不为空、含预期关键词
- CSV 用 utf-8-sig 编码避免 Excel 打开乱码

## 注意
- 只支持数字原生 PDF,扫描件要用 Tesseract(T22 课)
- 无边框线的表格需调整 table_settings 参数
- 用 with 语句打开,自动关闭文件句柄
- 加密 PDF 需先用 qpdf(T24 课)解密
```
