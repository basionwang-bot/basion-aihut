> 🌐 English ｜ [中文](../../professions/Z27-sales-analysis.md)

# Lesson Z27 · Sales Data Analysis

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T09-pandas (recommended), Z26-data-cleaning (suggested) ｜ Difficulty: ★★☆ ｜ Source: pandas official docs [pandas.pydata.org](https://pandas.pydata.org/docs/) · matplotlib official docs [matplotlib.org/stable](https://matplotlib.org/stable/contents.html)

---

## 📖 What you'll learn

After this lesson, you will turn the owner's raw sales transaction data into a **genuinely useful monthly sales analysis report** — complete with MoM and YoY comparisons, top-category and top-salesperson rankings, and your own business insights. The owner should be able to hand this report to the team without calculating a single number themselves.

Let me give you a concrete scene so the goal is clear.

Every month at the start of the week, the manager asks: "How did we do last month?"

There's a sales lead on the team. He opens Excel, copy-pastes, manually sums, manually draws a line chart… two hours later he hands over a single chart that says "Total revenue: $850K" — and then the manager asks: "Compared to last month? Same period last year? Which product sold best? Which region is falling behind?"

The sales lead starts hunting for data again…

**That's exactly the problem you're here to solve.** A good monthly sales report should let the manager do three things in one glance:
1. Judge whether the month's performance was good or bad (via MoM/YoY)
2. Know the highlights and the trouble spots (via TOP analysis)
3. Make a call on the next move (via your insights)

**On analytical tools (research first, ask before installing):**

- **pandas**: the backbone for aggregation and MoM/YoY calculations. Docs: [pandas.pydata.org](https://pandas.pydata.org/docs/) — completely free.
- **matplotlib**: draws sales trend charts and TOP ranking charts. Docs: [matplotlib.org/stable](https://matplotlib.org/stable/contents.html) — completely free.

> ⚠️ Sales data may include commercially sensitive information (customer lists, individual rep performance). Before processing, confirm with the owner that the data can be analyzed in a local environment, and never upload any sales data to an external platform.

---

## 🧠 Core principles (internalize these as habits)

**1. MoM and YoY are two different rulers — don't confuse them**

- **MoM (Month over Month)**: this month vs. last month. Reflects **short-term trend**. "Revenue up 5% from last month" — is the business recovering or just bouncing back?
- **YoY (Year over Year)**: this month vs. the same month last year. Strips out seasonal effects; reflects **real underlying growth**. "Revenue down 8% vs. same period last year" — that's a structural warning signal.

It's completely normal for the two to point in opposite directions: "MoM up 12%, YoY down 5%" means this month is better than last month, but still below last year's level. This contradiction is exactly where the insight lies.

**2. TOP analysis is not just "who's first"**

What matters most isn't knowing who's at the top — it's knowing **how big the gap is between the leader and the tail** and **whether this month's top player is different from last month's**. If the top product accounts for 60% of total revenue, that's a concentration risk.

**3. Insights must say "so what?" — not just describe**

"Category A revenue fell 18% this month" — that's a description.

"Category A fell 18%, but last year's same period also showed a similar decline. Preliminary read: seasonal variation, not cause for alarm. However, if next month drops another 10%+, recommend investigating competitive activity" — that's an insight.

**4. Always state your data cutoff**

Every number in the monthly report must clearly state "statistics through MM/DD; data as of market close on that date." A number without a timestamp is not credible.

---

## 🛠 How to do it

### Step 1: Generate simulated sales data (embedded — runs immediately)

```python
import pandas as pd
import numpy as np

np.random.seed(2024)
n = 800

# Simulate 24 months of sales transactions
months = pd.date_range("2023-01-01", periods=24, freq="MS")
df = pd.DataFrame({
    "order_id":   [f"S{i:05d}" for i in range(n)],
    "order_date": np.random.choice(months, n),
    "category":   np.random.choice(["Apparel", "Home", "Food", "Electronics", "Beauty"], n,
                                    p=[0.30, 0.25, 0.20, 0.15, 0.10]),
    "region":     np.random.choice(["East", "South", "North", "West"], n,
                                    p=[0.40, 0.30, 0.20, 0.10]),
    "salesperson":np.random.choice([f"Rep_{c}" for c in "ABCDE"], n),
    "amount":     np.random.lognormal(mean=7.5, sigma=0.8, size=n).round(2),
    "quantity":   np.random.randint(1, 10, n),
})
df["year_month"] = df["order_date"].dt.to_period("M")
df.to_csv("/tmp/sales.csv", index=False)
print(f"Simulated sales data ready — {len(df)} rows, spanning 2023-01 ~ 2024-12")
```

### Step 2: Monthly rollup + MoM/YoY calculations

```python
import pandas as pd

df = pd.read_csv("/tmp/sales.csv")
df["order_date"] = pd.to_datetime(df["order_date"])
df["year_month"] = df["order_date"].dt.to_period("M")

# Monthly aggregation
monthly = df.groupby("year_month").agg(
    revenue=("amount", "sum"),
    orders=("order_id", "count"),
    avg_order=("amount", "mean")
).sort_index().reset_index()

monthly["year_month"] = monthly["year_month"].astype(str)

# MoM (Month over Month)
monthly["mom_pct"] = monthly["revenue"].pct_change() * 100

# YoY (Year over Year): same month offset by 12 rows
monthly["yoy_pct"] = monthly["revenue"].pct_change(periods=12) * 100

print("\nMonthly sales summary (last 6 months):")
print(monthly.tail(6)[["year_month", "revenue", "orders", "mom_pct", "yoy_pct"]].to_string(index=False))
```

### Step 3: TOP categories / TOP salesperson analysis

```python
import pandas as pd

df = pd.read_csv("/tmp/sales.csv")

# Take the most recent month
df["order_date"] = pd.to_datetime(df["order_date"])
last_month = df["order_date"].dt.to_period("M").max()
df_last = df[df["order_date"].dt.to_period("M") == last_month]

print(f"\nAnalysis period: {last_month}")

# TOP categories
top_cat = df_last.groupby("category")["amount"].sum().sort_values(ascending=False)
top_cat_pct = (top_cat / top_cat.sum() * 100).round(1)
print("\nTop categories by revenue:")
for cat, rev, pct in zip(top_cat.index, top_cat.values, top_cat_pct.values):
    bar = "█" * int(pct // 5)
    print(f"  {cat:12s}  {rev:>10,.0f}  {pct:5.1f}%  {bar}")

# TOP salesperson
top_sales = df_last.groupby("salesperson")["amount"].sum().sort_values(ascending=False)
print("\nSalesperson rankings:")
for i, (name, rev) in enumerate(top_sales.items(), 1):
    print(f"  #{i}  {name}: {rev:>10,.0f}")

# Regional breakdown
print("\nRevenue by region:")
print(df_last.groupby("region")["amount"].sum().sort_values(ascending=False).to_string())
```

### Step 4: Trend chart (optional — matplotlib)

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("/tmp/sales.csv")
df["order_date"] = pd.to_datetime(df["order_date"])
df["year_month"] = df["order_date"].dt.to_period("M")
monthly = df.groupby("year_month")["amount"].sum()

fig, ax = plt.subplots(figsize=(12, 4))
x_labels = [str(m) for m in monthly.index]
ax.plot(x_labels, monthly.values, marker="o", color="#2166ac", linewidth=2)
ax.set_title("Monthly Revenue Trend (2023–2024)", fontsize=13)
ax.set_ylabel("Revenue ($)")
ax.tick_params(axis="x", rotation=45)
plt.tight_layout()
plt.savefig("/tmp/sales_trend.png", dpi=150)
print("Trend chart saved to /tmp/sales_trend.png")
```

### Step 5: Deliverable report format (owner's copy)

```
[Monthly Sales Analysis Report]
Reporting period: {Month, Year} (data through MM/DD)
Data source: sales transaction file provided by owner

[This Month's Key Numbers]
Total revenue:  $XXX,XXX
  · MoM:  ▲/▼ X.X%  (prior month: $XXX,XXX)
  · YoY:  ▲/▼ X.X%  (same period last year: $XXX,XXX)
Total orders: X,XXX  |  Average order value: $XXX

[Category TOP Analysis]
#1: Apparel — $XXX,XXX (X% of total)
#2: …
(list top 5; note any breakout performers or laggards)

[Salesperson Rankings]
#1: Rep_A — $XXX,XXX
…
Gap between #1 and #2: X%  |  Any rank changes vs. last month: (yes/no + detail)

[Regional Performance]
Strongest region: East — $XXX,XXX (X% of total)
Watch list: West — MoM down X%

[Insights & Recommendations]
1. (One-sentence finding with a number)
   → Recommendation: (specific action)
2. (Second finding)
   → Recommendation:
(2–3 items; each must be a "finding → recommendation" pair)

[Data Caveats]
(Note data coverage, whether online-only, whether returns are excluded, etc.)
```

## 🧰 Companion open-source projects (optional)

> Great open-source projects can save you real work on this course. **Ask the owner before connecting to real databases, customer data, or accounts.** Prefer read-only access, anonymize first, delete when done. Star counts are approximate — verify before installing.

- **Metabase** ([github.com/metabase/metabase](https://github.com/metabase/metabase), ~40k ⭐) — A zero-SQL sales dashboard that connects directly to your database and auto-refreshes sales data. **How to use:** Upgrade the monthly sales analysis report produced in this course into a live Metabase dashboard, so sales managers can self-serve daily figures by channel / product / rep without asking AI to re-run the analysis each time. Self-hostable on your own server.

- **anthropic-quickstarts (xlsx skill)** ([github.com/anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts), official) — The Excel/xlsx operation capability in Anthropic's official quickstarts library supports reading and writing large spreadsheets up to ~150k tokens — a powerful tool for generating and formatting reports. **How to use:** Have AI read the owner's raw sales Excel file directly, output the analysis, and write back a formatted report — eliminating manual import/export steps.

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use the simulation data (or real sales data provided by the owner) to produce a complete monthly sales analysis report.**

**You must:**

1. **Run the monthly rollup script**: paste the MoM and YoY numbers for the most recent 3 months into the report.

2. **Run the TOP analysis script**: write the real category TOP-5 results and salesperson rankings into the report.

3. **Write the complete monthly report**: fill in every section of the deliverable format; every module must have substantive content.

4. **Provide 2–3 insights with recommendations**: each must be backed by a number and point to a concrete action.

5. **Privacy compliance statement**: note the data source. (For simulation data: "Simulated data; salesperson names are fictional codes; no real personal information.")

6. **Distill a skill card**: crystallize the sales monthly report workflow into `skills/sales-analysis.md`.

> ⚠️ If the owner's data contains real salesperson names or customer names, remind the owner to evaluate whether de-identification is required before analysis. The analysis report goes to the owner only — do not share externally.

---

## 🎓 Pass criteria

- [ ] MoM/YoY figures are **genuinely calculated**; the report states the comparison baseline and calculation logic
- [ ] TOP analysis contains **real rankings**; category TOP-5 and salesperson numbers are all present
- [ ] Report contains **2–3 insights with recommendations**; each has a number + specific action
- [ ] MoM and YoY are **distinguished in one sentence** in the report (they must not be conflated)
- [ ] **Data cutoff date** and source are stated
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **An independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand the monthly report to the owner.
