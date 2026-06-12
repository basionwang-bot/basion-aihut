# 第 T13 课 · python-docx 批量生成 Word 文档

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:python-docx 官方文档 · [python-docx.readthedocs.io](https://python-docx.readthedocs.io/en/latest/) · [github.com/python-openxml/python-docx](https://github.com/python-openxml/python-docx)

---

## 📖 你要学会什么

学完这一课,你能用 python-docx 把一批数据(比如一张员工名单、一堆合同模板、一组报告)自动生成为独立的 `.docx` 文件,交给主人直接用——而不是让主人一份一份手敲。

想象这样一个场景:公司年会要发 200 张获奖证书,每张上面只有姓名和奖项不一样。如果靠人手做,在 Word 里改了又改、复制了又粘贴,至少要三四个小时,还容易出错。现在你来干这件事:**就像流水线贴标签一样,把名单往模板里一套,一分钟出 200 张,每张独立保存、格式一模一样。**

python-docx 是一个纯 Python 库,能创建、读取、修改 `.docx` 文件(Microsoft Word 格式),不需要系统里装 Word。它在国内开发圈用得很广,适合批量生成合同、报告、通知、证书等文档。

**官方资料:**
- 官方文档: [python-docx.readthedocs.io](https://python-docx.readthedocs.io/en/latest/)
- GitHub 仓库: [github.com/python-openxml/python-docx](https://github.com/python-openxml/python-docx)
- PyPI 页面: [pypi.org/project/python-docx](https://pypi.org/project/python-docx)

---

## 🧠 核心原则(内化成习惯)

1. **数据和模板分开,别混写。** 把要填的内容(姓名、金额、日期)放在列表或字典里,把文档样式单独管——就像厨师把食材和菜谱分开放,要换菜换食材都方便。

2. **先建 Document 对象,再往里加东西。** python-docx 的世界里,一个 `.docx` 就是一个 `Document` 对象。先 `doc = Document()`,再往里 `.add_paragraph()`、`.add_heading()`、`.add_table()`——顺序往下写,别想着"跳着填"。

3. **样式优先用内置样式名,别乱改字体。** 直接改字体大小容易乱,优先用 Word 内置样式名(比如 `'Heading 1'`、`'Normal'`)或预先建好的 `.docx` 模板文件——这样打开后格式不会串。

4. **批量生成时,每份文档独立创建、独立保存。** 不要"改同一个对象然后 save"——改来改去会越来越混乱。正确姿势是循环里每次 `Document()` 重新建一个,填好就 `save`。

5. **生成完了先自己打开看一眼。** 脚本跑完只是"生成了文件",不代表格式对。要么截一张 thumbnail,要么汇报"请主人抽查第 N 份"——**有交付物,才是真完成。**

---

## 🛠 操作要点

### 安装

```bash
pip install python-docx
```

> ⚠️ **未经主人确认不得真装真跑,只先给方案。** 如果主人当场在场并明确同意,再执行。

### 最小可运行脚本:批量生成获奖证书

```python
from docx import Document
from docx.shared import Pt, RGBColor
import os

# 数据:名单(实际项目可以从 CSV / Excel 读取)
winners = [
    {"name": "张三", "award": "最佳创新奖"},
    {"name": "李四", "award": "最佳团队奖"},
    {"name": "王五", "award": "年度贡献奖"},
]

os.makedirs("output", exist_ok=True)

for person in winners:
    doc = Document()  # 每人独立建一份

    # 标题
    heading = doc.add_heading("获奖证书", level=0)
    heading.alignment = 1  # 居中(1=CENTER)

    # 正文
    p = doc.add_paragraph()
    p.alignment = 1
    run = p.add_run(f"\n{person['name']} 同学:\n")
    run.font.size = Pt(16)
    run.font.bold = True

    p2 = doc.add_paragraph()
    p2.alignment = 1
    run2 = p2.add_run(f"荣获"{person['award']}",特此证明。")
    run2.font.size = Pt(14)

    # 日期
    doc.add_paragraph("\n2026 年 6 月").alignment  # 右对齐可进一步设置

    filename = f"output/证书_{person['name']}.docx"
    doc.save(filename)
    print(f"已生成: {filename}")

print("全部完成!")
```

### 常用操作速查

| 想干嘛 | 代码 |
|--------|------|
| 新建空文档 | `doc = Document()` |
| 打开已有 .docx 当模板 | `doc = Document("template.docx")` |
| 加标题(H1/H2…) | `doc.add_heading("标题文字", level=1)` |
| 加正文段落 | `doc.add_paragraph("内容")` |
| 给文字加粗/变色 | `run.font.bold = True` / `run.font.color.rgb = RGBColor(255,0,0)` |
| 加一张表格 | `table = doc.add_table(rows=3, cols=4)` |
| 读取某个单元格 | `table.cell(0, 0).text` |
| 插入图片 | `doc.add_picture("logo.png", width=Inches(2))` |
| 保存 | `doc.save("output.docx")` |

### 用已有模板批量替换(进阶)

```python
from docx import Document

def fill_template(template_path, replacements, output_path):
    """
    replacements: dict, 例如 {"{{姓名}}": "张三", "{{奖项}}": "最佳创新奖"}
    """
    doc = Document(template_path)
    for para in doc.paragraphs:
        for key, val in replacements.items():
            if key in para.text:
                for run in para.runs:
                    run.text = run.text.replace(key, val)
    doc.save(output_path)
```

> 注意:替换模板占位符时,同一段文字的 `run` 可能被 Word 拆成好几段。如果简单替换失效,检查一下 `para.runs` 里每个 run 的 `.text` 是什么。

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个批量生成 Word 文件的完整方案,并产出可执行脚本。**

选定场景:用一张数据列表(至少 5 条)批量生成"员工入职通知书"，每份文件包含员工姓名、入职日期、部门、报到地点,保存到 `output/` 目录下。

你需要完成:

1. **写出完整可运行的 Python 脚本**,包含:
   - 数据列表(至少 5 条记录,用字典)
   - 用循环批量创建每一份文档
   - 每份文档包含标题、正文(4 个字段)、落款日期
   - 保存到 `output/通知_{姓名}.docx`
   - 打印"已生成 N 份"的汇总

2. **写出验收标准**:
   - `output/` 目录下生成了 5 个 `.docx` 文件
   - 每个文件大小 > 0 字节(非空)
   - 文件名包含对应员工姓名
   - 用 python-docx 重新读取一个文件,能读出标题文字

3. **写出环境说明**:Python 版本、需要 `pip install python-docx`、不需要系统装 Word。

4. **写出安全提示**:
   - 本任务不涉及网络请求,数据是本地的,风险较低
   - 但 `pip install` 和实际运行脚本,**仍需先征得主人确认,再执行**
   - 如果数据来自主人提供的真实员工名单,需确认数据可以在本地处理、不违反隐私规定

5. **把以上内容整理成报告卡**,写进你宿舍 `agent-school/skills/python-docx-batch.md`。

---

## 🎓 过关标准

- [ ] 你写出了完整可运行的脚本(循环 + 批量 + 保存)
- [ ] 你写清楚了验收标准(可核查的文件检查条件)
- [ ] 你理解了"每次循环重新建 Document"的原因,能解释为什么不能共用同一个对象
- [ ] 你知道怎么用已有 `.docx` 当模板、批量替换占位符
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/python-docx-batch.md`](../../skills/python-docx-batch.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T14 课。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 python-docx 批量生成 Word 文档

- **什么时候用**:需要把一批数据(名单、合同、通知)批量生成为独立 .docx 文件时
- **来自**:T13 课 python-docx

## 步骤
1. pip install python-docx(需主人确认)
2. 准备数据列表(字典列表,每条一份文档)
3. 循环:每次 doc = Document() 新建 → 填内容 → doc.save(路径)
4. 汇总打印"已生成 N 份"

## 验证
- output/ 目录下文件数 == 数据条数
- 每个文件 > 0 字节
- 用 Document(path) 重新读取,能读出标题

## 注意
- 批量时每次必须 Document() 重新建,不要复用同一对象
- 模板替换时注意 Word 可能把同一段文字拆成多个 run
- pip install 和脚本执行前必须征得主人确认
```
