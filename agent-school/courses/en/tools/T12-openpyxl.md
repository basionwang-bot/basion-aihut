> 🌐 English ｜ [中文](../../tools/T12-openpyxl.md)

# Lesson T12 · openpyxl: Reading and Writing Real Excel Files with Formatting

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: openpyxl official docs · [openpyxl.readthedocs.io](https://openpyxl.readthedocs.io/en/stable/) · PyPI: [openpyxl 3.1.5](https://pypi.org/project/openpyxl/)

---

## 📖 What you'll learn

After this lesson, you'll be able to open a real `.xlsx` Excel file in Python, read its data, modify specific cell values, make the header row bold and colored, write in new data, and save — the entire process without ever opening Excel, or even having Excel installed on the machine.

Picture this: the owner has to hand the boss a monthly sales report every month — fixed format: blue bold headers, right-aligned numbers, yellow-background totals row. Each month means manually pasting in data and manually fixing the formatting, two hours every time. **After you arrive, the job becomes: you take the new data, drop it into the template with openpyxl, the formatting snaps into place automatically, done in a minute — the owner just hits send.**

openpyxl current version 3.1.5, supports Python ≥ 3.8, **works only with `.xlsx` / `.xlsm` format** (Microsoft Office 2010 and later). The old `.xls` format requires `xlrd` (read-only). In day-to-day work, 90% of Excel files are `.xlsx` — openpyxl covers it.

**Official resources:**
- Docs: [openpyxl.readthedocs.io](https://openpyxl.readthedocs.io/en/stable/)
- Tutorial: [openpyxl.readthedocs.io/en/stable/tutorial](https://openpyxl.readthedocs.io/en/stable/tutorial.html)
- PyPI: [pypi.org/project/openpyxl](https://pypi.org/project/openpyxl/)

---

## 🧠 Core principles (internalize these as habits)

1. **Three-level structure: Workbook → Worksheet → Cell.** An Excel file is a `Workbook`, containing multiple `Worksheet` objects (those "Sheet1" tabs), each with many `Cell` objects. Remember these three layers — all operations live within this framework.

2. **Know both coordinate styles.** `ws["A1"]` uses the letter-column + row-number style; `ws.cell(row=1, column=1)` uses numeric row and column indexes. Both work — numeric is more convenient in loops, letter-style is more readable for direct references.

3. **Use `load_workbook` to modify existing files, `Workbook()` to create new ones.** To edit an existing file: `wb = load_workbook("file.xlsx")`. To build from scratch: `wb = Workbook()`. After making changes, you **must** call `wb.save("file.xlsx")` — unsaved changes are lost.

4. **Formatting is applied to Cells, not to data.** Font, color, alignment, and border are properties on the cell object — `cell.font`, `cell.fill`, `cell.alignment`, etc. Write the data first, then "style" the cell. A single `Font` / `PatternFill` / `Alignment` object can be assigned to multiple cells.

5. **You can only write formula strings, not computed results.** `cell.value = "=SUM(B2:B10)"` is correct — openpyxl writes the formula string; Excel computes it when the file is opened. If you need the formula's computed value inside Python, open the file with `data_only=True` to read the cached result.

---

## 🛠 How to do it

### Installation

```bash
pip install openpyxl
```

### Minimal runnable example (create Excel from scratch, fully offline)

```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# 1. Create workbook and worksheet
wb = Workbook()
ws = wb.active
ws.title = "Sales Data"

# 2. Write headers
headers = ["Month", "Product", "Qty", "Unit Price", "Revenue"]
for col_idx, header in enumerate(headers, start=1):
    cell = ws.cell(row=1, column=col_idx, value=header)
    # Header style: white text + blue background + bold + center-aligned
    cell.font = Font(bold=True, color="FFFFFF", size=12)
    cell.fill = PatternFill(fill_type="solid", fgColor="2E75B6")
    cell.alignment = Alignment(horizontal="center", vertical="center")

# 3. Write data rows
data = [
    ["2024-01", "Laptop",      120, 6500, None],
    ["2024-01", "Smartphone",  350, 3200, None],
    ["2024-02", "Laptop",      98,  6800, None],
    ["2024-02", "Smartphone",  410, 3100, None],
    ["2024-03", "Laptop",      145, 6600, None],
]

for row_idx, row_data in enumerate(data, start=2):
    for col_idx, value in enumerate(row_data, start=1):
        ws.cell(row=row_idx, column=col_idx, value=value)

# 4. Column E (Revenue): formula = Qty × Unit Price
for row_idx in range(2, 2 + len(data)):
    ws.cell(row=row_idx, column=5, value=f"=C{row_idx}*D{row_idx}")

# 5. Summary row (yellow background)
summary_row = 2 + len(data)
ws.cell(row=summary_row, column=1, value="Total")
ws.cell(row=summary_row, column=5, value=f"=SUM(E2:E{summary_row-1})")
for col_idx in range(1, 6):
    cell = ws.cell(row=summary_row, column=col_idx)
    cell.fill = PatternFill(fill_type="solid", fgColor="FFE699")
    cell.font = Font(bold=True)

# 6. Adjust column widths
column_widths = [12, 15, 8, 12, 12]
for col_idx, width in enumerate(column_widths, start=1):
    ws.column_dimensions[get_column_letter(col_idx)].width = width

# 7. Save
output_path = "/tmp/sales_report.xlsx"
wb.save(output_path)
print(f"Excel generated: {output_path}")
```

### Reading an existing Excel file

```python
from openpyxl import load_workbook

# Open the file
wb = load_workbook("/tmp/sales_report.xlsx")
ws = wb.active

print(f"Sheet names: {wb.sheetnames}")
print(f"Max row: {ws.max_row}, Max column: {ws.max_column}")

# Read headers
headers = [ws.cell(row=1, column=c).value for c in range(1, ws.max_column + 1)]
print(f"Columns: {headers}")

# Iterate data rows (skip header, skip summary row)
print("\nData rows:")
for row in ws.iter_rows(min_row=2, max_row=ws.max_row - 1, values_only=True):
    print(row)

# Read cached formula values (requires data_only=True)
wb2 = load_workbook("/tmp/sales_report.xlsx", data_only=True)
ws2 = wb2.active
# Note: if the file has never been opened in Excel, the cached value may be None
print(f"\n(cached) E2 value: {ws2['E2'].value}")
```

### Modifying an existing file

```python
from openpyxl import load_workbook
from openpyxl.styles import Font

wb = load_workbook("/tmp/sales_report.xlsx")
ws = wb.active

# Change a specific cell
ws["C2"] = 150  # update Qty in the first data row to 150

# Change font color of a cell
ws["A1"].font = Font(bold=True, color="FF0000", size=14)

# Append a new row
new_row = ["2024-04", "Tablet", 200, 4500, "=C8*D8"]
ws.append(new_row)

wb.save("/tmp/sales_report_updated.xlsx")
print("Changes saved")
```

### Common operations quick reference

```python
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter, column_index_from_string

# Workbook operations
wb = Workbook()                        # create new
wb = load_workbook("file.xlsx")        # open existing
wb.sheetnames                          # list all sheet names
ws = wb.active                         # active worksheet
ws = wb["Sheet1"]                      # access by name
ws = wb.create_sheet("NewSheet")       # create a new sheet
wb.save("output.xlsx")                 # save

# Read / write cells
ws["A1"].value                         # read value
ws["A1"] = "content"                   # write value
ws.cell(row=2, column=3, value=99)     # numeric row/col style

# Dimensions
ws.max_row                             # last row number
ws.max_column                          # last column number
ws.iter_rows(min_row=2, values_only=True)  # iterate rows (values only)

# Styles
from openpyxl.styles import Font, PatternFill, Alignment
ws["A1"].font = Font(bold=True, size=12, color="FF0000")
ws["A1"].fill = PatternFill(fill_type="solid", fgColor="FFFF00")
ws["A1"].alignment = Alignment(horizontal="center")

# Column width / row height
ws.column_dimensions["A"].width = 20
ws.row_dimensions[1].height = 30

# Utility functions
get_column_letter(3)              # 3 → "C"
column_index_from_string("C")    # "C" → 3
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: generate a formatted monthly payroll Excel file and read it back to verify the contents. Fully runnable offline.**

**Complete script** (`/tmp/openpyxl_task.py`):

```python
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

# ---- 1. Create a formatted payroll sheet ----
wb = Workbook()
ws = wb.active
ws.title = "March 2024 Payroll"

# Headers
headers = ["Employee ID", "Name", "Department", "Base Salary", "Bonus", "Total Pay"]
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

# Data
employees = [
    ("E001", "Wang Fang",  "Engineering", 18000, 5000),
    ("E002", "Li Ming",    "Marketing",   12000, 3000),
    ("E003", "Zhang Qiang","Engineering", 22000, 8000),
    ("E004", "Liu Juan",   "Marketing",   13000, 2500),
    ("E005", "Chen Hao",   "Operations",   9000, 1500),
]

for row_idx, emp in enumerate(employees, start=2):
    for col_idx, value in enumerate(emp, start=1):
        ws.cell(row=row_idx, column=col_idx, value=value)
    # Total Pay = Base Salary + Bonus
    ws.cell(row=row_idx, column=6, value=f"=D{row_idx}+E{row_idx}")

# Summary row
summary_row = len(employees) + 2
ws.cell(row=summary_row, column=2, value="Total")
ws.cell(row=summary_row, column=4, value=f"=SUM(D2:D{summary_row-1})")
ws.cell(row=summary_row, column=5, value=f"=SUM(E2:E{summary_row-1})")
ws.cell(row=summary_row, column=6, value=f"=SUM(F2:F{summary_row-1})")

# Summary row style
for col in range(1, 7):
    cell = ws.cell(row=summary_row, column=col)
    cell.fill = PatternFill(fill_type="solid", fgColor="FFF2CC")
    cell.font = Font(bold=True)

# Column widths
widths = [12, 14, 14, 14, 10, 12]
for col, w in enumerate(widths, start=1):
    ws.column_dimensions[get_column_letter(col)].width = w

output_path = "/tmp/salary_202403.xlsx"
wb.save(output_path)
print(f"Excel generated: {output_path}")

# ---- 2. Read back and verify ----
wb2 = load_workbook(output_path)
ws2 = wb2.active

print(f"\nSheet name: {ws2.title}")
print(f"Total rows (including header): {ws2.max_row}")

# Verify headers
actual_headers = [ws2.cell(row=1, column=c).value for c in range(1, 7)]
assert actual_headers == headers, f"Header mismatch: {actual_headers}"

# Verify row count
assert ws2.max_row == len(employees) + 2, "Row count mismatch"

# Print all data
print("\nData read back:")
for row in ws2.iter_rows(min_row=1, values_only=True):
    print(row)

# Verify header style (bold font)
header_cell = ws2.cell(row=1, column=1)
assert header_cell.font.bold, "Header should be bold"

print("\nAll checks passed ✓")
```

**Evidence to submit:**
- Complete script output (including "All checks passed ✓")
- The output file path `/tmp/salary_202403.xlsx`

**Distill a skill card**: capture the three-level structure (Workbook/Worksheet/Cell), read/write operations, and formatting cheat sheet into `skills/openpyxl.md`.

> ⚠️ **Safety boundary:** `pip install openpyxl` requires the owner's confirmation first. openpyxl is a purely local file library with no network access. **Always notify the owner before reading or writing their real Excel files**, and back up the original file before making changes (the owner's raw data is precious).

---

## 🎓 Pass criteria

- [ ] You ran the complete script and submitted real output (including "All checks passed ✓")
- [ ] You used both `Workbook()` to create and `load_workbook()` to open a file
- [ ] You applied formatting to headers (`Font + PatternFill + Alignment`)
- [ ] You used both `ws.cell(row=, column=)` and `ws["A1"]` addressing styles
- [ ] You used `iter_rows(values_only=True)` to iterate and read data
- [ ] You understand that openpyxl can only write formula strings, and that reading computed results requires `data_only=True`
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to the next lesson.
