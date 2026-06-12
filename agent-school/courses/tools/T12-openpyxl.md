# 第 T12 课 · openpyxl 读写带格式的真实 Excel

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:openpyxl 官方文档 · [openpyxl.readthedocs.io](https://openpyxl.readthedocs.io/en/stable/) · PyPI: [openpyxl 3.1.5](https://pypi.org/project/openpyxl/)

---

## 📖 你要学会什么

学完这一课,你能用 Python 打开一个真实的 `.xlsx` Excel 文件,读出里面的数据、改掉指定单元格的值、给表头加粗加色、写入新数据并保存——整个过程不需要打开 Excel 软件,甚至不需要 Excel 装在电脑上。

想象你的主人每个月都要把一份销售数据表交给老板——格式固定:表头蓝色加粗、数字列右对齐、汇总行黄色背景。每次都要手动贴数据、再手动调格式,搞 2 个小时。**你来了之后,这件事应该是:你拿到新的数据,用 openpyxl 把它填进模板、格式自动就位,一分钟搞定,交给主人直接发邮件**。

openpyxl 当前版本 3.1.5,支持 Python ≥ 3.8,**只支持 `.xlsx`/`.xlsm` 格式**(微软 Office 2010 以后的格式)。老格式 `.xls` 要用 `xlrd`(只能读不能写)。日常工作中 90% 的 Excel 都是 `.xlsx`,openpyxl 够用。

**官方资料:**
- 官方文档: [openpyxl.readthedocs.io](https://openpyxl.readthedocs.io/en/stable/)
- 教程: [openpyxl.readthedocs.io/en/stable/tutorial](https://openpyxl.readthedocs.io/en/stable/tutorial.html)
- PyPI: [pypi.org/project/openpyxl](https://pypi.org/project/openpyxl/)

---

## 🧠 核心原则(内化成习惯)

1. **三层结构:Workbook → Worksheet → Cell。** 一个 Excel 文件是 `Workbook`(工作簿),里面有多个 `Worksheet`(工作表,就是"Sheet1"那些标签),每个工作表里有很多 `Cell`(单元格)。记住这三层,所有操作都在这个框架里。

2. **坐标两种写法都要会。** `ws["A1"]` 是字母列+行号,`ws.cell(row=1, column=1)` 是行列数字索引——两种都能用,循环里用数字更方便,直接指定位置用字母更直观。

3. **读数据和写数据分别用 `load_workbook` 和 `Workbook`。** 改已有文件用 `wb = load_workbook("file.xlsx")`;从零建新文件用 `wb = Workbook()`。改完了必须 `wb.save("file.xlsx")` 才生效——不 save 就白改了。

4. **格式是加在 Cell 上的,不是加在数据上的。** 字体、颜色、对齐、边框都是 `cell.font`、`cell.fill`、`cell.alignment` 等属性——你先写数据,再给这个格子"化妆"。一个 `Font`/`PatternFill`/`Alignment` 对象可以赋给多个格子。

5. **只能写公式字符串,不能写计算结果。** `cell.value = "=SUM(B2:B10)"` 是对的——openpyxl 写进去的是公式字符串,Excel 打开时才真正计算。如果你要在 Python 里知道公式的值,要用 `data_only=True` 参数打开文件读缓存值。

---

## 🛠 操作要点

### 安装

```bash
pip install openpyxl
```

> 🇨🇳 **中国用户提示:** pip 直接安装,无需科学上网。加速可用清华镜像:
> `pip install openpyxl -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/`

### 最小可运行示例(从零建 Excel,完全离线)

```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# 1. 创建工作簿和工作表
wb = Workbook()
ws = wb.active
ws.title = "销售数据"

# 2. 写表头
headers = ["月份", "产品", "销量", "单价", "销售额"]
for col_idx, header in enumerate(headers, start=1):
    cell = ws.cell(row=1, column=col_idx, value=header)
    # 表头样式:白色字体 + 蓝色背景 + 加粗 + 居中
    cell.font = Font(bold=True, color="FFFFFF", size=12)
    cell.fill = PatternFill(fill_type="solid", fgColor="2E75B6")
    cell.alignment = Alignment(horizontal="center", vertical="center")

# 3. 写数据行
data = [
    ["2024-01", "笔记本电脑", 120, 6500, None],
    ["2024-01", "手机",       350, 3200, None],
    ["2024-02", "笔记本电脑", 98,  6800, None],
    ["2024-02", "手机",       410, 3100, None],
    ["2024-03", "笔记本电脑", 145, 6600, None],
]

for row_idx, row_data in enumerate(data, start=2):
    for col_idx, value in enumerate(row_data, start=1):
        ws.cell(row=row_idx, column=col_idx, value=value)

# 4. E 列(销售额)写公式:= 销量 × 单价
for row_idx in range(2, 2 + len(data)):
    ws.cell(row=row_idx, column=5, value=f"=C{row_idx}*D{row_idx}")

# 5. 汇总行(黄色背景)
summary_row = 2 + len(data)
ws.cell(row=summary_row, column=1, value="合计")
ws.cell(row=summary_row, column=5, value=f"=SUM(E2:E{summary_row-1})")
for col_idx in range(1, 6):
    cell = ws.cell(row=summary_row, column=col_idx)
    cell.fill = PatternFill(fill_type="solid", fgColor="FFE699")
    cell.font = Font(bold=True)

# 6. 调整列宽
column_widths = [12, 15, 8, 10, 12]
for col_idx, width in enumerate(column_widths, start=1):
    ws.column_dimensions[get_column_letter(col_idx)].width = width

# 7. 保存
output_path = "/tmp/sales_report.xlsx"
wb.save(output_path)
print(f"Excel 已生成: {output_path}")
```

### 读取已有 Excel

```python
from openpyxl import load_workbook

# 打开文件
wb = load_workbook("/tmp/sales_report.xlsx")
ws = wb.active

print(f"工作表名称: {wb.sheetnames}")
print(f"最大行数: {ws.max_row},最大列数: {ws.max_column}")

# 读表头
headers = [ws.cell(row=1, column=c).value for c in range(1, ws.max_column + 1)]
print(f"列名: {headers}")

# 遍历数据行(跳过表头,跳过汇总行)
print("\n数据行:")
for row in ws.iter_rows(min_row=2, max_row=ws.max_row - 1, values_only=True):
    print(row)

# 读取公式缓存值(需要 data_only=True)
wb2 = load_workbook("/tmp/sales_report.xlsx", data_only=True)
ws2 = wb2.active
# 注意:如果文件从未被 Excel 打开过,公式缓存可能为 None
print(f"\n(缓存)E2 单元格值: {ws2['E2'].value}")
```

### 修改已有文件

```python
from openpyxl import load_workbook
from openpyxl.styles import Font

wb = load_workbook("/tmp/sales_report.xlsx")
ws = wb.active

# 修改某个单元格
ws["C2"] = 150  # 把第一行销量改为 150

# 给某格子改字体颜色
ws["A1"].font = Font(bold=True, color="FF0000", size=14)

# 添加新行
new_row = ["2024-04", "平板电脑", 200, 4500, "=C8*D8"]
ws.append(new_row)

wb.save("/tmp/sales_report_updated.xlsx")
print("已保存修改")
```

### 常用操作速查

```python
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter, column_index_from_string

# 工作簿操作
wb = Workbook()                        # 新建
wb = load_workbook("file.xlsx")        # 打开已有
wb.sheetnames                          # 所有工作表名
ws = wb.active                         # 当前激活的工作表
ws = wb["Sheet1"]                      # 按名字取
ws = wb.create_sheet("新Sheet")       # 新建工作表
wb.save("output.xlsx")                 # 保存

# 读写单元格
ws["A1"].value                         # 读值
ws["A1"] = "内容"                     # 写值
ws.cell(row=2, column=3, value=99)     # 行列数字写法

# 行列尺寸
ws.max_row                             # 最大行号
ws.max_column                          # 最大列号
ws.iter_rows(min_row=2, values_only=True)  # 遍历行(只取值)

# 样式
from openpyxl.styles import Font, PatternFill, Alignment
ws["A1"].font = Font(bold=True, size=12, color="FF0000")
ws["A1"].fill = PatternFill(fill_type="solid", fgColor="FFFF00")
ws["A1"].alignment = Alignment(horizontal="center")

# 列宽行高
ws.column_dimensions["A"].width = 20
ws.row_dimensions[1].height = 30

# 工具函数
get_column_letter(3)              # 3 → "C"
column_index_from_string("C")    # "C" → 3
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:生成一份带格式的月度工资表 Excel 文件,读回来验证内容。完全离线可跑。**

**完整脚本**(`/tmp/openpyxl_task.py`):

```python
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

# ---- 1. 创建带格式的工资表 ----
wb = Workbook()
ws = wb.active
ws.title = "2024年3月工资表"

# 表头
headers = ["工号", "姓名", "部门", "基本工资", "绩效奖金", "应发合计"]
header_style = {
    "font": Font(bold=True, color="FFFFFF", size=11),
    "fill": PatternFill(fill_type="solid", fgColor="1F4E79"),
    "alignment": Alignment(horizontal="center"),
}

for col, header in enumerate(headers, start=1):
    cell = ws.cell(row=1, column=col, value=header)
    cell.font = header_style["font"]
    cell.fill = header_style["fill"]
    cell.alignment = header_style["alignment"]

# 数据
employees = [
    ("E001", "王芳",  "技术", 18000, 5000),
    ("E002", "李明",  "市场", 12000, 3000),
    ("E003", "张强",  "技术", 22000, 8000),
    ("E004", "刘娟",  "市场", 13000, 2500),
    ("E005", "陈浩",  "运营",  9000, 1500),
]

for row_idx, emp in enumerate(employees, start=2):
    for col_idx, value in enumerate(emp, start=1):
        ws.cell(row=row_idx, column=col_idx, value=value)
    # 应发合计 = 基本工资 + 绩效奖金
    ws.cell(row=row_idx, column=6, value=f"=D{row_idx}+E{row_idx}")

# 汇总行
summary_row = len(employees) + 2
ws.cell(row=summary_row, column=2, value="合计")
ws.cell(row=summary_row, column=4, value=f"=SUM(D2:D{summary_row-1})")
ws.cell(row=summary_row, column=5, value=f"=SUM(E2:E{summary_row-1})")
ws.cell(row=summary_row, column=6, value=f"=SUM(F2:F{summary_row-1})")

# 汇总行样式
for col in range(1, 7):
    cell = ws.cell(row=summary_row, column=col)
    cell.fill = PatternFill(fill_type="solid", fgColor="FFF2CC")
    cell.font = Font(bold=True)

# 列宽
widths = [8, 10, 8, 12, 12, 12]
for col, w in enumerate(widths, start=1):
    ws.column_dimensions[get_column_letter(col)].width = w

output_path = "/tmp/salary_202403.xlsx"
wb.save(output_path)
print(f"Excel 已生成: {output_path}")

# ---- 2. 读回来验证 ----
wb2 = load_workbook(output_path)
ws2 = wb2.active

print(f"\n工作表名称: {ws2.title}")
print(f"数据行数(含表头): {ws2.max_row}")

# 验证表头
actual_headers = [ws2.cell(row=1, column=c).value for c in range(1, 7)]
assert actual_headers == headers, f"表头不对: {actual_headers}"

# 验证数据行数
assert ws2.max_row == len(employees) + 2, "行数不对"

# 打印数据
print("\n读回的数据:")
for row in ws2.iter_rows(min_row=1, values_only=True):
    print(row)

# 验证表头样式(字体加粗)
header_cell = ws2.cell(row=1, column=1)
assert header_cell.font.bold, "表头应为加粗"

print("\n验收通过 ✓")
```

**要交的证据:**
- 脚本完整输出(含"验收通过 ✓")
- 说明生成的文件路径 `/tmp/salary_202403.xlsx`

**沉淀技能卡**:把三层结构(Workbook/Worksheet/Cell)、读写操作、格式设置速查沉淀成 `skills/openpyxl.md`。

> ⚠️ **安全边界:** `pip install openpyxl` 需先经主人确认。openpyxl 是本地纯文件库,不联网。**读写主人的真实 Excel 文件前必须告知主人**,并在操作前备份原始文件(主人的原始数据非常重要)。

---

## 🎓 过关标准

- [ ] 你跑通了完整脚本,附上了真实输出(含"验收通过 ✓")
- [ ] 你用过 `Workbook()` 创建和 `load_workbook()` 读取两种方式
- [ ] 你给表头设置过样式(`Font + PatternFill + Alignment`)
- [ ] 你用过 `ws.cell(row=, column=)` 和 `ws["A1"]` 两种寻址方式
- [ ] 你用过 `iter_rows(values_only=True)` 遍历读取数据
- [ ] 你理解了 openpyxl 只能写公式字符串,读公式结果要用 `data_only=True`
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进下一门课。
