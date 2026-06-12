# 第 T14 课 · python-pptx 把内容自动排成 PPT

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T13(python-docx 有助于理解同类思路) ｜ 难度:★★☆ ｜ 源头:python-pptx 官方文档 · [python-pptx.readthedocs.io](https://python-pptx.readthedocs.io/en/latest/) · [github.com/scanny/python-pptx](https://github.com/scanny/python-pptx)

---

## 📖 你要学会什么

学完这一课,你能用 python-pptx 把一份结构化内容(标题 + 要点 + 数据)自动生成为 `.pptx` 格式的 PowerPoint 文件——主人只要打开就能直接用,不用一页页手拼。

想象你要给 10 个城市分别出一份销售周报 PPT,每份结构完全一样,只有数字和城市名不同。如果靠人手做,光复制粘贴就能把人累傻。现在你来干:**就像印刷厂用同一块模板印不同内容一样,数据换了,PPT 自动换,一次出 10 份。**

python-pptx 是 Python 操作 PowerPoint 文件的标准库,纯本地运行不联网,不需要系统安装 Office。国内很多公司用它在后端自动生成述职报告、数据周报、客户提案。

**官方资料:**
- 官方文档: [python-pptx.readthedocs.io](https://python-pptx.readthedocs.io/en/latest/)
- GitHub 仓库: [github.com/scanny/python-pptx](https://github.com/scanny/python-pptx)
- PyPI 页面: [pypi.org/project/python-pptx](https://pypi.org/project/python-pptx)
- 快速上手参考: [python-pptx.readthedocs.io/en/latest/user/quickstart.html](https://python-pptx.readthedocs.io/en/latest/user/quickstart.html)

---

## 🧠 核心原则(内化成习惯)

1. **PPT 的结构:Presentation → Slide → Shape → TextFrame → Paragraph → Run。** 就像一本书是"书 → 章 → 段 → 句 → 字"一样,python-pptx 里操作的最小单位是 `run`(一段有同一种样式的文字)。理解这个层级,你才不会在"在哪里加文字"上犯迷糊。

2. **用幻灯片布局,别从零画。** `prs.slide_layouts[N]` 是内置的"页面模板"(标题页、内容页、空白页……),直接用布局比自己手动放文本框快多了,格式也更规整。

3. **文本框的位置和大小用 `Inches` 或 `Pt` 指定,不要猜数字。** `left=Inches(1)` 比 `left=914400` 看起来清楚 100 倍——两者等效,但前者你三个月后还能读懂。

4. **数据和演示分开。** 把要讲的内容(城市、数字、要点)放进字典或列表,演示逻辑(加文本框、加图表)单独写成函数——**你换数据不用改代码,换样式不用改数据。**

5. **复杂样式设计,先做好一个真实 .pptx 模板,再用代码往里填坑。** python-pptx 能读取现有 .pptx 里的占位符(placeholder),比从零画框框效率高得多——主人设计好模板,你负责往里填数字。

---

## 🛠 操作要点

### 安装

```bash
pip install python-pptx
```

> ⚠️ **未经主人确认不得真装真跑,只先给方案。**

### 最小可运行脚本:自动生成 3 页数据周报 PPT

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
import os

# 数据:3 个城市的周报(实际可从 CSV/数据库读取)
city_data = [
    {"city": "北京", "sales": 128, "target": 120, "highlights": ["大客户续签 3 家", "新开发 5 家小客户"]},
    {"city": "上海", "sales": 95,  "target": 110, "highlights": ["完成年中大促备货", "团队扩招 2 人"]},
    {"city": "深圳", "sales": 143, "target": 130, "highlights": ["突破季度最高纪录", "新进入科技园区渠道"]},
]

os.makedirs("output", exist_ok=True)
prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)

# 内置布局索引参考:0=标题页, 1=标题+内容, 5=空白, 6=仅标题
blank_layout = prs.slide_layouts[6]  # 仅标题

for d in city_data:
    slide = prs.slides.add_slide(blank_layout)

    # 标题文本框
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(12), Inches(1.2))
    tf = txBox.text_frame
    tf.text = f"{d['city']} 销售周报"
    tf.paragraphs[0].runs[0].font.size = Pt(36)
    tf.paragraphs[0].runs[0].font.bold = True
    tf.paragraphs[0].runs[0].font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    # 数据区
    data_box = slide.shapes.add_textbox(Inches(0.5), Inches(1.8), Inches(5), Inches(3))
    dtf = data_box.text_frame
    dtf.word_wrap = True
    p1 = dtf.paragraphs[0]
    p1.text = f"本周销售额:¥{d['sales']} 万"
    p1.runs[0].font.size = Pt(20)

    p2 = dtf.add_paragraph()
    p2.text = f"目标:¥{d['target']} 万"
    p2.runs[0].font.size = Pt(16)

    gap = d['sales'] - d['target']
    p3 = dtf.add_paragraph()
    p3.text = f"{'超额' if gap >= 0 else '差距'} ¥{abs(gap)} 万"
    p3.runs[0].font.size = Pt(16)
    p3.runs[0].font.color.rgb = RGBColor(0,150,0) if gap >= 0 else RGBColor(200,0,0)

    # 亮点区
    hl_box = slide.shapes.add_textbox(Inches(6.5), Inches(1.8), Inches(6), Inches(3))
    htf = hl_box.text_frame
    htf.word_wrap = True
    hp0 = htf.paragraphs[0]
    hp0.text = "本周亮点"
    hp0.runs[0].font.bold = True
    hp0.runs[0].font.size = Pt(18)
    for hl in d['highlights']:
        hp = htf.add_paragraph()
        hp.text = f"• {hl}"
        hp.runs[0].font.size = Pt(14)

path = "output/销售周报.pptx"
prs.save(path)
print(f"已保存:{path}")
```

### 常用操作速查

| 想干嘛 | 代码 |
|--------|------|
| 新建演示文稿 | `prs = Presentation()` |
| 打开已有 .pptx | `prs = Presentation("template.pptx")` |
| 添加幻灯片 | `slide = prs.slides.add_slide(prs.slide_layouts[1])` |
| 访问内置占位符 | `slide.placeholders[0].text = "标题"` |
| 手动加文本框 | `slide.shapes.add_textbox(left, top, width, height)` |
| 添加图片 | `slide.shapes.add_picture("img.png", left, top, width, height)` |
| 添加表格 | `slide.shapes.add_table(rows, cols, left, top, width, height)` |
| 设置字号 | `run.font.size = Pt(24)` |
| 设置字色 | `run.font.color.rgb = RGBColor(R, G, B)` |
| 保存 | `prs.save("output.pptx")` |

### 用现有模板填占位符(推荐工作流)

```python
from pptx import Presentation

prs = Presentation("my_template.pptx")
slide = prs.slides[0]

# 查看模板里有哪些占位符
for ph in slide.placeholders:
    print(ph.placeholder_format.idx, ph.name, ph.text)

# 按 idx 填入内容
slide.placeholders[0].text = "北京销售周报"
slide.placeholders[1].text = "本周销售额:¥128 万"

prs.save("output/filled.pptx")
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个自动生成多页 PPT 的完整方案,并产出可执行脚本。**

选定场景:用一份产品目录数据(至少 4 个产品)批量生成 PPT——每个产品一页,包含产品名、简介、价格、3 条特点,最后加一页"感谢页"。

你需要完成:

1. **写出完整可运行脚本**:
   - 数据列表(4 个以上产品,字典格式)
   - 自动添加多张幻灯片(循环)
   - 每页含标题、正文内容
   - 最后添加一张"感谢页"
   - 保存到 `output/产品目录.pptx`

2. **写出验收标准**:
   - `output/产品目录.pptx` 文件存在且 > 0 字节
   - 用 python-pptx 重新打开,幻灯片数量 == 产品数 + 1
   - 第一张幻灯片的标题文字能读出

3. **写出环境说明**:Python 版本要求(≥3.7),`pip install python-pptx`,不需要 Office。

4. **写出安全提示**:本任务本地运行,不联网,风险低。`pip install` 和脚本执行**仍需先征得主人确认**。

5. **沉淀技能卡**到 `agent-school/skills/python-pptx-auto.md`。

---

## 🎓 过关标准

- [ ] 你写出了完整可运行脚本(循环 + 多页 + 保存)
- [ ] 你写清楚了验收标准(可用 python-pptx 重新读取核查)
- [ ] 你能说清楚 `slide_layouts` 各索引大致对应什么布局、什么时候用模板 vs 从零建
- [ ] 你知道"占位符 placeholder"和"手动加文本框"两种方式的区别和适用场合
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/python-pptx-auto.md`](../../skills/python-pptx-auto.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T15 课。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 python-pptx 自动生成 PPT

- **什么时候用**:需要把结构化数据(报告、产品目录、城市数据)批量生成为 .pptx 时
- **来自**:T14 课 python-pptx

## 步骤
1. pip install python-pptx(需主人确认)
2. 准备数据列表(字典)
3. prs = Presentation() 新建或打开模板
4. 循环:add_slide → 填文本框/占位符 → 下一条数据
5. prs.save("output.pptx")

## 验证
- 文件存在且 > 0 字节
- 用 Presentation 重新打开,len(prs.slides) == 预期页数

## 注意
- slide_layouts 索引(0=标题页, 1=标题+内容, 5=空白, 6=仅标题)
- 用现有模板填占位符比从零画框效率高
- 位置尺寸用 Inches() / Pt() 不要猜原始 EMU 数字
- pip install 和执行前必须征得主人确认
```
