> 🌐 English ｜ [中文](../../professions/Z26-data-cleaning.md)

# Lesson Z26 · Data Cleaning & Quality Inspection

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T09-pandas (recommended) ｜ Difficulty: ★★☆ ｜ Source: pandas official docs [pandas.pydata.org](https://pandas.pydata.org/docs/) · Great Expectations docs [docs.greatexpectations.io](https://docs.greatexpectations.io/)

---

## 📖 What you'll learn

After this lesson, you will take a piece of **dirty data** the owner hands you — full of missing values, inconsistent formats, duplicate rows, and out-of-range numbers — and clean it into a table that's safe to analyze. At the same time you'll produce a **data quality inspection report** to hand back to the owner.

Why start here? Because **there is an iron law in data analysis: garbage in, garbage out.**

Imagine you're the head chef at a restaurant. Ingredients come in from customers. Your first job is inspection — are there rotten vegetables? Is the meat fresh? Any foreign objects mixed in? Only after you've inspected and cleaned the ingredients do you fire up the stove. A chef who skips inspection and goes straight to cooking — can you trust what comes out?

Data cleaning is exactly that "inspection + prep" step.

Just how dirty is the data you'll encounter in the real world? Here are situations you will definitely run into:
- The same customer ID appears 3 times (duplicate records)
- The "order date" column has entries like "2024/01/05", "January 5, 2024", and blank
- Order amounts include "-99999" (a system error placeholder)
- The phone number column has email addresses mixed in
- A dataset that should have 5,000 rows has 800 rows where the "city" field is empty

Your job: **clean the dirty data step by step, then produce a quality inspection report that tells the owner the state of the data, what you did to fix it, and what limitations remain.**

**On data quality tools (research first, ask before installing):**

- **pandas**: the workhorse for cleaning operations — deduplication, null handling, format normalization, outlier treatment. Docs: [pandas.pydata.org](https://pandas.pydata.org/docs/) — completely free.
- **Great Expectations**: a professional data quality assertion library; you define rules like "the phone number column must have no nulls" and it validates them automatically. Docs: [docs.greatexpectations.io](https://docs.greatexpectations.io/) — open-source and free. Ask the owner before installing.

> ⚠️ During data cleaning, **never delete the original file**. All operations are performed on a copy; the original data is preserved for reference. If the data contains phone numbers, names, ID numbers, or other personal information, your first action is to alert the owner that this data needs to be de-identified before you proceed.

---

## 🧠 Core principles (internalize these as habits)

**1. Observe first, act later**

Don't rush in as soon as you receive data. Spend 5 minutes scanning the whole table — how many rows? How many columns? What type is each column? How many nulls? Any obvious anomalies at a glance? Only after this reconnaissance do you know what to clean.

**2. Only fix what you're certain is wrong — don't guess**

Sometimes data is ambiguous — an age field showing "0": is it a system default or genuinely a zero-age user? In these cases do not make assumptions and fill in your guess. **Ask the owner for confirmation.** Better to leave a question mark than to fill in a wrong answer.

**3. Every cleaning operation must be explainable to the owner**

Every action you take should be describable in one sentence: what you did and why. "Dropped 12 rows where order amount was negative, because negative amounts are not valid in this business context" — that's a useful operation log.

**4. Never touch the original data**

All cleaning happens on a copy. If any step goes wrong, the owner can still retrieve the original and start over. This is the most basic data safety habit.

**5. The quality inspection report is for humans, not machines**

Don't just stack numbers at the end of the report. Tell the owner in plain English: "The overall data quality is moderate. The main issues are concentrated in the XX field. I've addressed XX problems. After cleaning, the data can support XX types of analysis, but note that it is not suitable for XX."

---

## 🛠 How to do it

### Step 1: Generate dirty data (embedded simulation — runs immediately)

```python
import pandas as pd
import numpy as np

np.random.seed(7)
n = 300

# Create simulated dirty data
df_raw = pd.DataFrame({
    "order_id":     [f"ORD{i:04d}" for i in range(n)],
    "customer_name": [f"User{np.random.randint(1,100):03d}" for _ in range(n)],
    "phone":        [f"138{np.random.randint(10000000,99999999)}" for _ in range(n)],
    "order_date":   [f"2024-{np.random.randint(1,13):02d}-{np.random.randint(1,28):02d}"
                     for _ in range(n)],
    "amount":       np.where(np.random.random(n) < 0.05, -99999,
                        np.random.normal(200, 80, n).round(2)),  # 5% are error placeholders
    "city":         [np.random.choice(["New York", "London", "Sydney", "Toronto", None, ""])
                     for _ in range(n)],
    "category":     [np.random.choice(["Apparel", "Home", "Electronics", None]) for _ in range(n)],
})

# Inject 10 duplicate rows
df_raw = pd.concat([df_raw, df_raw.sample(10, random_state=1)], ignore_index=True)

df_raw.to_csv("/tmp/dirty_data.csv", index=False)
print(f"Dirty data saved — {len(df_raw)} rows total")
```

### Step 2: Quality inspection (global scan)

```python
import pandas as pd

df = pd.read_csv("/tmp/dirty_data.csv")

print("=" * 50)
print("📋 Data Quality Report · Step 1: Global Overview")
print("=" * 50)
print(f"Total rows: {len(df)}")
print(f"Total columns: {len(df.columns)}")
print(f"Column list: {df.columns.tolist()}")

print("\nColumn data types:")
print(df.dtypes)

print("\nNull value counts per column:")
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(1)
missing_report = pd.DataFrame({"Null count": missing, "Null rate (%)": missing_pct})
print(missing_report[missing_report["Null count"] > 0])

print("\nDuplicate row count:", df.duplicated().sum())

print("\namount column summary statistics:")
print(df["amount"].describe())
print("Anomalous amount values (< 0):", (df["amount"] < 0).sum())
```

### Step 3: Step-by-step cleaning

```python
import pandas as pd

df = pd.read_csv("/tmp/dirty_data.csv")
df_clean = df.copy()  # work on a copy; leave original untouched

# ── 1. Remove fully duplicate rows ──
before = len(df_clean)
df_clean = df_clean.drop_duplicates()
print(f"Dedup: removed {before - len(df_clean)} duplicate rows")

# ── 2. Handle anomalous amount placeholders (-99999 treated as missing) ──
bad_amount = (df_clean["amount"] < 0).sum()
df_clean.loc[df_clean["amount"] < 0, "amount"] = None
print(f"Anomalous amounts: flagged {bad_amount} negative values as missing (pending owner confirmation)")

# ── 3. Normalize date format ──
df_clean["order_date"] = pd.to_datetime(df_clean["order_date"], errors="coerce")
date_fail = df_clean["order_date"].isnull().sum()
if date_fail > 0:
    print(f"Date parsing: {date_fail} rows could not be parsed, flagged as NaT — owner review required")
else:
    print("Date format: all rows parsed successfully")

# ── 4. Normalize empty strings to NaN ──
df_clean["city"] = df_clean["city"].replace("", None)

# ── 5. Handle nulls (conservative strategy: flag, don't fill yet) ──
remaining_missing = df_clean.isnull().sum()
print("\nRemaining nulls per column after cleaning:")
print(remaining_missing[remaining_missing > 0])

# ── 6. Save clean data ──
df_clean.to_csv("/tmp/clean_data.csv", index=False)
print(f"\nCleaning complete — {len(df_clean)} rows saved to /tmp/clean_data.csv")
```

### Step 4: Quality inspection report format (the owner's copy)

```
[Data Quality Inspection Report]
Data file: orders.csv
Inspection date: YYYY-MM-DD
Original row count: XXX rows / XXX columns

[Issues Found & Actions Taken]
✅ Resolved:
  - Duplicate rows: found X, removed
  - Anomalous amounts: found X rows with -99999, flagged as missing
  - Date format: normalized to YYYY-MM-DD
  - Empty strings: city column empty strings normalized to null

⚠️ Pending owner confirmation:
  - city field missing in X rows (X%) — fill with "Unknown" or drop rows?
  - category field missing in X rows — required for category-level analysis

[Post-Cleaning Data Quality Assessment]
Overall rating: Moderate / Good / Poor (describe actual condition)
Suitable for: order trend analysis, revenue aggregation, city distribution (if city null rate < 5%)
Not suitable for: individual customer behaviour analysis (too many missing fields)

[Important Note]
(If phone numbers / names / personal data are present, write: "Owner has been notified to verify de-identification status")
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: run the scripts above, walk through the complete data inspection + cleaning flow, and produce a quality inspection report ready for the owner.**

**You must:**

1. **Generate dirty data and run the inspection script**: paste the real script output into the report (row count, null stats, duplicate count — all must be present).

2. **Run the cleaning script**: record the actual number of items processed at each step (how many duplicate rows removed, how many anomalous values, etc.).

3. **Write the complete quality inspection report**: fill in every section using the format above; every "Resolved" and "Pending confirmation" item must have actual numbers — not just "there were issues."

4. **State a one-sentence data quality conclusion**: what is the overall quality of this data? After cleaning, what types of analysis is it suitable for? What are the limitations?

5. **Privacy compliance statement**: note data source and whether it contains personal information. (For simulation data: "Simulated data; fields are anonymous IDs; no real user privacy involved.")

6. **Distill a skill card**: crystallize the data cleaning workflow into `skills/data-cleaning.md`.

> ⚠️ Iron rule: if the owner provides real data containing phone numbers, names, ID numbers, or other personal information, you must stop and remind the owner to de-identify it first. Only then proceed.

---

## 🎓 Pass criteria

- [ ] Inspection script's **real output** is in the report (row count, null stats, duplicate rows, anomalous values — all with numbers)
- [ ] Cleaning script **genuinely ran**; per-step counts are recorded (not just "script completed")
- [ ] Quality report distinguishes between "Resolved" and "Pending owner confirmation" issues
- [ ] A **data quality conclusion** is stated: what it's suitable for, what it isn't
- [ ] Throughout, **all operations were performed on a copy**; original file was not modified (verifiable)
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **An independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand both the quality inspection report and the clean data file to the owner.
