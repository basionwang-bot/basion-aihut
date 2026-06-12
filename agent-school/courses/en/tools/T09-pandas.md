> 🌐 English ｜ [中文](../../tools/T09-pandas.md)

# Lesson T09 · Cleaning Messy Spreadsheets with pandas

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: pandas official docs · [pandas.pydata.org/docs](https://pandas.pydata.org/docs/) · PyPI: [pandas](https://pypi.org/project/pandas/) · GitHub: [pandas-dev/pandas](https://github.com/pandas-dev/pandas)

---

## 📖 What you'll learn

After this lesson, you'll be able to take a "dirty table" — rows duplicated, cells missing, dates and numbers in every conceivable format — and run it through pandas to produce a clean table with **correct field types, no duplicates, and no missing values**.

Picture this: you've been handed a manually-filled attendance sheet, 500 rows hiding these landmines — someone's name appears twice, someone's leave day was never filled in, dates are a mix of "2024/1/5" and "2024-01-05", and the salary column has stray characters like "—" and "N/A" scattered through it. What you need to hand back is a table clean enough to import directly into a system. pandas is your **eraser-and-correction-fluid combo** — find in bulk, fix in bulk, verify in bulk — 500 rows done in a blink.

pandas current version is 3.0.3. It is the de-facto standard for Python data analysis, uses NumPy under the hood, and its core data structure is a **DataFrame** — essentially a table with labelled rows and columns, where each column is a **Series**.

**Official resources:**
- Official docs: [pandas.pydata.org/docs](https://pandas.pydata.org/docs/)
- Getting started: [pandas.pydata.org/docs/getting_started](https://pandas.pydata.org/docs/getting_started/index.html)
- PyPI: [pypi.org/project/pandas](https://pypi.org/project/pandas/)
- GitHub: [github.com/pandas-dev/pandas](https://github.com/pandas-dev/pandas)

---

## 🧠 Core principles (internalize these as habits)

1. **A DataFrame is a table; a Series is one column.** Use `df["column_name"]` to get a single column (a Series), and `df[["col_A", "col_B"]]` to get multiple columns (a DataFrame). Build the mental model of "a table" first — every operation is just slicing, modifying columns, or filtering rows.

2. **Run `df.info()` and `df.head()` before you touch anything.** When you receive an unfamiliar table, your first move is reconnaissance: `df.info()` tells you how many columns there are, each column's type, and how many non-null values; `df.head()` shows you what the first few rows look like; `df.describe()` gives you a numeric summary. Understand the terrain before you clean it.

3. **Chained operations are a pipeline — change one thing per step.** pandas operations can be chained: `df.dropna().drop_duplicates().reset_index(drop=True)` is three processing stations on the line, executed in order. For more complex custom steps, `.pipe()` chains them cleanly.

4. **Type conversion is the heart of data cleaning.** Much "bad data" is fundamentally **wrong types** — numbers stored as strings, dates stored as plain text. Use `pd.to_numeric()`, `pd.to_datetime()`, and `.astype()` to correct the types, and the calculations and filters that follow will work correctly.

5. **Verify after every cleaning step.** Run `df.info()` after each cleanup to confirm no unexpected NaN values appeared; run `df.duplicated().sum()` to confirm duplicates are gone; run `df.dtypes` to confirm types are right. Cleaning is surgery — check the wound when you're done.

---

## 🛠 How to do it

### Installation

```bash
pip install pandas
# If you also need to read/write Excel files, pair it with openpyxl
pip install pandas openpyxl
```

> 🌐 **Network tip:** To speed up installation from mainland China, use the Tsinghua mirror:
> `pip install pandas -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/`

### Minimal runnable example: clean dirty data in three steps (fully offline)

```python
import pandas as pd
import io

# ---- Dirty data (embedded — no network needed) ----
raw_csv = """
姓名,部门,入职日期,月薪,绩效
小明,技术,2023/3/1,15000,A
小红,市场,2023-04-15,12000,B
小明,技术,2023/3/1,15000,A
小刚,技术,,18000,S
小丽,市场,2023-06-01,—,B
小强,运营,2023-07-20,9000,
"""

df = pd.read_csv(io.StringIO(raw_csv.strip()))
print("=== Raw data ===")
print(df)
print(f"\nShape: {df.shape}  (rows × columns)")
df.info()
```

### Step 1: Remove duplicates

```python
# Check for duplicate rows
print(f"\nDuplicate row count: {df.duplicated().sum()}")
print(df[df.duplicated(keep=False)])  # Show all duplicate rows

# Drop completely identical duplicates
df = df.drop_duplicates()
print(f"Row count after dedup: {len(df)}")
```

### Step 2: Handle missing values

```python
# See missing counts per column
print("\nNull count per column:")
print(df.isnull().sum())

# Strategy 1: drop rows where the critical "月薪" column is missing
df = df.dropna(subset=["月薪"])

# Strategy 2: fill missing "绩效" with a default value "C"
df["绩效"] = df["绩效"].fillna("C")

# Strategy 3: fill missing "入职日期" with a fallback date
df["入职日期"] = df["入职日期"].fillna("2023-01-01")

print(f"\nRow count after handling nulls: {len(df)}")
```

### Step 3: Fix types

```python
# "月薪" column contains "—" — coerce non-numeric to NaN, then drop
df["月薪"] = pd.to_numeric(df["月薪"], errors="coerce")
df = df.dropna(subset=["月薪"])
df["月薪"] = df["月薪"].astype(int)

# Date column: parse uniformly to datetime (handles mixed formats like 2023/3/1 and 2023-04-15)
df["入职日期"] = pd.to_datetime(df["入职日期"], format="mixed", dayfirst=False)

print("\n=== Cleaned data ===")
print(df)
print("\nField types:")
print(df.dtypes)
```

### Quick-reference: common cleaning operations

```python
# Read CSV / Excel
df = pd.read_csv("data.csv", encoding="utf-8")
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")

# Reconnaissance trio
df.info()          # column names, types, non-null counts
df.head(5)         # first 5 rows
df.describe()      # statistical summary of numeric columns

# Deduplication
df.duplicated().sum()           # count duplicate rows
df.drop_duplicates()            # drop all duplicates
df.drop_duplicates(subset=["姓名"])  # deduplicate by one column

# Missing values
df.isnull().sum()               # null count per column
df.dropna()                     # drop any row with a null
df.dropna(subset=["critical_col"])    # drop only when critical column is null
df.fillna({"col_A": 0, "col_B": "unknown"})  # fill per-column defaults

# Type conversion
pd.to_numeric(df["col"], errors="coerce")     # string → number (invalid → NaN)
pd.to_datetime(df["col"], format="mixed")     # string → datetime
df["col"].astype(str)                         # force to string

# Filter rows
df[df["月薪"] > 10000]            # conditional filter
df[df["部门"].isin(["技术","市场"])]  # multi-value match

# Add / modify columns
df["年薪"] = df["月薪"] * 12
df["姓名"] = df["姓名"].str.strip()   # strip leading/trailing spaces
df["部门"] = df["部门"].str.replace("　", " ")  # replace full-width space

# Save
df.to_csv("/tmp/clean.csv", index=False, encoding="utf-8-sig")  # utf-8-sig prevents Excel garble
df.to_excel("/tmp/clean.xlsx", index=False)
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: clean a "dirty employee table" — complete deduplication, null handling, and type correction in three steps, then output the clean data. Test data is embedded — fully runnable offline.**

```bash
# Write the dirty data to a local file
cat > /tmp/dirty_employees.csv << 'EOF'
姓名,部门,入职日期,月薪,级别
王芳,技术,2022/5/10,22000,P6
李明,市场,2022-06-15,15000,M4
王芳,技术,2022/5/10,22000,P6
张强,技术,,28000,P7
刘娟,市场,2022-09-01,—,M3
陈浩,运营,2023-01-20,13000,
赵磊,技术,2023/3/15,25000,P6
刘娟,市场,2022-09-01,,M3
EOF
```

**Complete cleaning script** (`/tmp/pandas_task.py`):

```python
import pandas as pd

# 1. Read data
df = pd.read_csv("/tmp/dirty_employees.csv")
print(f"Raw data: {df.shape[0]} rows")
print(df)

# 2. Deduplicate (fully identical rows)
before = len(df)
df = df.drop_duplicates()
print(f"\nDedup: {before} → {len(df)} rows (removed {before - len(df)})")

# 3. Salary column: remove non-numeric values, convert to int
df["月薪"] = pd.to_numeric(df["月薪"], errors="coerce")
dropped_salary = df["月薪"].isna().sum()
df = df.dropna(subset=["月薪"])
df["月薪"] = df["月薪"].astype(int)
print(f"\nSalary cleanup: dropped {dropped_salary} non-numeric rows")

# 4. Date column: normalize format, fill nulls with default
df["入职日期"] = pd.to_datetime(df["入职日期"], format="mixed", errors="coerce")
missing_date = df["入职日期"].isna().sum()
df["入职日期"] = df["入职日期"].fillna(pd.Timestamp("2023-01-01"))
print(f"Date cleanup: {missing_date} missing dates filled with 2023-01-01")

# 5. Level column: fill nulls with "未知"
df["级别"] = df["级别"].fillna("未知")

# 6. Reset index
df = df.reset_index(drop=True)

print(f"\n=== Cleaned data ({len(df)} rows) ===")
print(df)
print("\nField types:")
print(df.dtypes)

# 7. Save
output_path = "/tmp/clean_employees.csv"
df.to_csv(output_path, index=False, encoding="utf-8-sig")
print(f"\nSaved to {output_path}")

# 8. Acceptance assertions
assert df.duplicated().sum() == 0, "should have no duplicate rows"
assert df.isnull().sum().sum() == 0, "should have no null values"
assert df["月薪"].dtype in ["int32", "int64"], "salary should be integer type"
assert str(df["入职日期"].dtype).startswith("datetime"), "date should be datetime type"
print("Acceptance check passed ✓")
```

**Evidence to submit:**
- Full script output (including "Acceptance check passed ✓")
- Final `df.dtypes` output

**Distill a skill card:** crystallize the four-step "recon → dedup → nulls → types" cleaning workflow plus the quick-reference function table into `skills/pandas-cleaning.md`.

> ⚠️ **Safety boundary:** `pip install pandas` requires the user's confirmation first. pandas is a purely local computation library — no network access, and reading/writing local files is perfectly safe. **You must confirm scope with the user before reading their real data**, and never discard the original file after cleaning (keep a backup).

---

## 🎓 Pass criteria

- [ ] You ran the cleaning script and submitted the full output (including "Acceptance check passed ✓")
- [ ] You used all three operation families: `drop_duplicates()`, `dropna()`, `fillna()`
- [ ] You used `pd.to_numeric(errors="coerce")` to handle a column containing non-numeric characters
- [ ] You used `pd.to_datetime()` to normalize date formats
- [ ] You can explain why "recon first" matters (blind cleaning without reconnaissance causes surprises)
- [ ] Distilled 1 skill card into your dorm's skills/
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T10.
