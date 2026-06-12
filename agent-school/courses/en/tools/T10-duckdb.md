> 🌐 English ｜ [中文](../../tools/T10-duckdb.md)

# Lesson T10 · DuckDB: Query a Giant CSV with SQL in Seconds

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: DuckDB official docs · [duckdb.org/docs](https://duckdb.org/docs/current/) · GitHub: [duckdb/duckdb](https://github.com/duckdb/duckdb)

---

## 📖 What you'll learn

After this lesson, you'll be able to point SQL at a CSV file with hundreds of thousands of rows and get results in seconds — group-by, aggregate, filter, sort — without loading the entire table into memory first.

Picture yourself as a warehouse clerk faced with 500,000 shipping slips. You need to find "which product category had the highest outbound volume last year." The old way: haul all 500,000 slips into the office and count them one by one. The pandas way: load all 500,000 rows into RAM and then compute. **DuckDB is different** — think of it as a SQL superserver that fits in your pocket. You shout into the warehouse, "summarize outbound volume by category," and it tallies everything right there on the warehouse floor and hands you the answer. **Not a single row needs to be moved.**

DuckDB is an **embedded OLAP database** — no server to install, no config to fiddle with, it runs directly inside your Python process. Version 1.3.x (latest as of 2025) uses a vectorized execution engine that typically queries million-row CSVs 5–50× faster than pandas, with much lower memory usage.

**Official resources:**
- Docs: [duckdb.org/docs](https://duckdb.org/docs/current/)
- Python API docs: [duckdb.org/docs/current/clients/python/overview](https://duckdb.org/docs/current/clients/python/overview.html)
- GitHub: [github.com/duckdb/duckdb](https://github.com/duckdb/duckdb)
- PyPI: [pypi.org/project/duckdb](https://pypi.org/project/duckdb)

---

## 🧠 Core principles (internalize these as habits)

1. **You don't need to "load" data into DuckDB — just query the file directly.** DuckDB's most jaw-dropping feature: `SELECT * FROM 'data.csv' WHERE ...` — write SQL straight at the file, no import step required. Works on Parquet, JSON, and even files on S3. The file stays put; the data doesn't move.

2. **Standard SQL — no new language to learn.** DuckDB speaks standard SQL. If you know MySQL or PostgreSQL syntax, DuckDB is virtually zero friction. The only things worth learning are a few DuckDB-specific sugar features (like `SUMMARIZE` and `PIVOT`) — look them up when you need them.

3. **A Connection is a door — close the door when you're done.** When using the Python API, form the habit of using `with duckdb.connect() as con:` so the connection closes automatically and you don't leak resources.

4. **Results convert directly to a pandas DataFrame.** `con.execute("SELECT ...").df()` produces a DataFrame in one step — perfect interop with pandas. Use DuckDB for the fast query, then switch to pandas for display or complex transformations.

5. **In-memory database vs. persistent database.** `duckdb.connect()` is in-memory: everything is gone when it closes. `duckdb.connect("mydb.db")` persists data to a file. For one-off analysis in a script, the in-memory version is enough; only create a file-backed database if you want to keep intermediate results.

---

## 🛠 How to do it

### Installation

```bash
pip install duckdb
```

### Minimal runnable example (offline — generates test CSV first)

```python
import duckdb
import csv

# ---- Step 1: generate a test CSV (100,000 rows of simulated sales data) ----
import random
import datetime

random.seed(42)
categories = ["Electronics", "Clothing", "Food", "Home", "Books"]
cities = ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"]

with open("/tmp/sales.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["order_id", "date", "category", "city", "amount", "qty"])
    for i in range(100_000):
        date = datetime.date(2024, random.randint(1, 12), random.randint(1, 28))
        writer.writerow([
            f"ORD{i:07d}",
            date.isoformat(),
            random.choice(categories),
            random.choice(cities),
            round(random.uniform(50, 5000), 2),
            random.randint(1, 10),
        ])

print("Test CSV generated: /tmp/sales.csv (100,000 rows)")
```

```python
import duckdb

# ---- Step 2: run SQL directly on the file — no import needed ----
with duckdb.connect() as con:

    # Count total rows
    total = con.execute("SELECT COUNT(*) FROM '/tmp/sales.csv'").fetchone()[0]
    print(f"Total rows: {total:,}")

    # Aggregate sales by category, top 3
    print("\nTop 3 categories by revenue:")
    result = con.execute("""
        SELECT
            category,
            COUNT(*)  AS order_count,
            ROUND(SUM(amount), 2) AS total_revenue,
            ROUND(AVG(amount), 2) AS avg_order_value
        FROM '/tmp/sales.csv'
        GROUP BY category
        ORDER BY total_revenue DESC
        LIMIT 3
    """).fetchall()
    for row in result:
        print(f"  {row[0]:12s}  orders:{row[1]:6,}  total:{row[2]:>12,.2f}  avg:{row[3]:,.2f}")

    # Group by city + month (date functions)
    print("\nQ1 2024 sales by city:")
    df = con.execute("""
        SELECT
            city,
            MONTH(CAST(date AS DATE)) AS month,
            ROUND(SUM(amount), 2) AS revenue
        FROM '/tmp/sales.csv'
        WHERE MONTH(CAST(date AS DATE)) <= 3
        GROUP BY city, month
        ORDER BY city, month
    """).df()  # convert directly to a pandas DataFrame
    print(df.to_string(index=False))
```

### Common operations quick reference

```python
import duckdb

with duckdb.connect() as con:
    # Query a CSV directly (simplest form)
    con.execute("SELECT * FROM 'data.csv' LIMIT 5").fetchall()

    # Register a DataFrame as a table (mix with pandas)
    import pandas as pd
    df = pd.read_csv("data.csv")
    con.register("my_table", df)
    con.execute("SELECT COUNT(*) FROM my_table").fetchone()

    # Quick summary (DuckDB-specific)
    con.execute("SUMMARIZE SELECT * FROM 'data.csv'").df()

    # Save query result to a new CSV
    con.execute("""
        COPY (
            SELECT category, SUM(amount) AS total
            FROM 'data.csv'
            GROUP BY category
        ) TO '/tmp/summary.csv' (HEADER, DELIMITER ',')
    """)

    # Result to DataFrame
    df_result = con.execute("SELECT * FROM 'data.csv' WHERE amount > 1000").df()

    # Result to list of tuples
    rows = con.execute("SELECT * FROM 'data.csv' LIMIT 10").fetchall()

    # Result to list of dicts
    records = con.execute("SELECT * FROM 'data.csv' LIMIT 10").fetchdf().to_dict("records")
```

### Common SQL quick reference (DuckDB dialect)

| Goal | SQL snippet |
|------|------------|
| Count rows | `SELECT COUNT(*) FROM 'f.csv'` |
| Quick summary | `SUMMARIZE SELECT * FROM 'f.csv'` |
| Group and aggregate | `GROUP BY col` |
| Extract month from date | `MONTH(CAST(col AS DATE))` |
| String contains | `WHERE col LIKE '%keyword%'` |
| Rename a column | `col AS alias` |
| Write result to CSV | `COPY (...) TO 'out.csv' (HEADER)` |
| Read Parquet | `FROM 'data.parquet'` |
| Unpivot columns to rows | `UNPIVOT ...` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: generate a 100,000-row orders CSV, run 3 analytical queries with DuckDB SQL, and write a result file. Fully runnable offline.**

**Complete script** (`/tmp/duckdb_task.py`):

```python
import duckdb
import csv
import random
import datetime

# ---- 1. Generate test data ----
random.seed(99)
categories = ["Electronics", "Clothing", "Food", "Home", "Books"]
cities = ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"]
data_path = "/tmp/orders_100k.csv"

with open(data_path, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["order_id", "date", "category", "city", "amount", "qty"])
    for i in range(100_000):
        date = datetime.date(2024, random.randint(1,12), random.randint(1,28))
        w.writerow([f"ORD{i:07d}", date, random.choice(categories),
                    random.choice(cities), round(random.uniform(50, 8000), 2),
                    random.randint(1, 10)])

print(f"Data generated: {data_path}")

# ---- 2. Three queries ----
with duckdb.connect() as con:

    # Query 1: total revenue ranking by category
    print("\n[Query 1] Total revenue by category:")
    q1 = con.execute(f"""
        SELECT category, COUNT(*) AS order_count, ROUND(SUM(amount),2) AS total_revenue
        FROM '{data_path}'
        GROUP BY category
        ORDER BY total_revenue DESC
    """).df()
    print(q1.to_string(index=False))

    # Query 2: high-value orders (single order > 7000) by city
    print("\n[Query 2] Orders > 7000 by city:")
    q2 = con.execute(f"""
        SELECT city, COUNT(*) AS high_value_orders
        FROM '{data_path}'
        WHERE amount > 7000
        GROUP BY city
        ORDER BY high_value_orders DESC
    """).df()
    print(q2.to_string(index=False))

    # Query 3: monthly revenue trend
    print("\n[Query 3] Monthly total revenue for 2024:")
    q3 = con.execute(f"""
        SELECT
            MONTH(CAST(date AS DATE)) AS month,
            ROUND(SUM(amount), 2) AS monthly_revenue,
            COUNT(*) AS order_count
        FROM '{data_path}'
        GROUP BY month
        ORDER BY month
    """).df()
    print(q3.to_string(index=False))

    # ---- 3. Save summary result ----
    con.execute(f"""
        COPY (
            SELECT category, ROUND(SUM(amount),2) AS total_sales
            FROM '{data_path}'
            GROUP BY category
            ORDER BY total_sales DESC
        ) TO '/tmp/category_summary.csv' (HEADER, DELIMITER ',')
    """)
    print("\nCategory summary saved to /tmp/category_summary.csv")

    # ---- 4. Acceptance checks ----
    row_count = con.execute(f"SELECT COUNT(*) FROM '{data_path}'").fetchone()[0]
    assert row_count == 100_000, f"Expected 100,000 rows, got {row_count}"
    assert len(q1) == 5, "Expected 5 categories"
    assert len(q3) == 12, "Expected 12 months"
    print("\nAll checks passed ✓")
```

**Evidence to submit:**
- Real output from all three queries (including the table output and "All checks passed ✓")
- A note on how long the queries took (100,000 rows typically finishes in under 1 second)

**Distill a skill card**: capture the "direct-file SQL pattern + result to DataFrame + save to CSV" workflow into `skills/duckdb.md`.

> ⚠️ **Safety boundary:** `pip install duckdb` requires the owner's confirmation first. DuckDB is a purely local computation library — no network access, no persistence by default (in-memory mode). Confirm the scope with the owner before reading any real data files.

---

## 🎓 Pass criteria

- [ ] You ran the complete script and submitted real output (including "All checks passed ✓")
- [ ] You used `FROM 'file.csv'` to query a file directly without importing it first
- [ ] You used `GROUP BY + SUM/COUNT` for aggregation analysis
- [ ] You used `.df()` to convert query results into a pandas DataFrame
- [ ] You used `COPY (...) TO 'output.csv'` to save query results
- [ ] You can explain the core reason DuckDB is faster than pandas (vectorized execution, no full in-memory load)
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T11.
