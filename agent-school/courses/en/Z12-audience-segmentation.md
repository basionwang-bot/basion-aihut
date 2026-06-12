> 🌐 English ｜ [中文](../Z12-audience-segmentation.md)

# Lesson Z12 · Audience Segmentation & Product Analysis

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T04-jq, T09-pandas (optional) ｜ Difficulty: ★★★ ｜ Source: pandas docs [pandas.pydata.org/docs](https://pandas.pydata.org/docs/) · DuckDB docs [duckdb.org/docs](https://duckdb.org/docs/) · Shopify Analytics Help [help.shopify.com/en/manual/reports-and-analytics](https://help.shopify.com/en/manual/reports-and-analytics) · Jungle Scout [junglescout.com](https://www.junglescout.com/)

---

## 📖 What You'll Learn

By the end of this lesson, you'll be able to take a real set of **order and customer data**, analyze it to answer "who are the different types of buyers, what do they each buy, and how do we keep them," and deliver **data-backed product selection recommendations** — both in one package.

Let's start with why this matters.

Most store owners have a fuzzy gut feeling about their customers: "My buyers are probably young women" or "They tend to be price-sensitive shoppers" — but are those feelings actually correct?

Honestly? You don't know. A feeling is just a feeling.

Great operators can say this instead: "I have three types of buyers — Group A is 60% of my base, orders twice a month on average, and gravitates toward Category X. Group B is 25% of my base, has a high average order value, and tends to make one-time big-ticket purchases. Group C is dormant — they haven't come back in three months and need a win-back campaign."

With that segmentation in hand, product decisions stop being guesswork: "Group A is ready for cross-sells in Category X. Group B is worth building a premium product line for. Group C might come back if you send them an exclusive discount code."

Your job is to turn **a pile of order data** into **actionable operational insights**.

**About the data tools (research first — ask the owner before installing anything):**

- **pandas**: The go-to Python library for data analysis — perfect for segmentation, data cleaning, and pivot summaries. Docs: [pandas.pydata.org/docs](https://pandas.pydata.org/docs/) — completely free, requires a Python environment.
- **DuckDB**: No database server needed — run SQL queries directly against CSV files, millions of rows in seconds. Docs: [duckdb.org/docs](https://duckdb.org/docs/) — free and open source.
- **Jungle Scout / Helium 10**: Amazon product research platforms for spotting competitor trends and top-selling SKUs. [junglescout.com](https://www.junglescout.com/) — free tiers available, full access requires a paid plan. Similarweb ([similarweb.com](https://www.similarweb.com/)) is useful for broader traffic and category trend analysis.

> ⚠️ Always get the owner's confirmation before using any tool. **Customer data is extremely sensitive** — before touching it, confirm with the owner that the data source is compliant and whether it has been properly anonymized. This lesson never logs in to any e-commerce backend to export data on the owner's behalf.

---

## 🧠 Core Principles (internalize these as habits)

**1. Before analyzing data, ask "what decision does this support?"**

Getting a raw order table and digging in without direction is a waste of time. Before you start, ask the owner: "What's the one thing you most want to figure out from this analysis?"

- Want to know which customers are the most profitable? → Segmentation + value tiering
- Want to know which products sell best? → Product selection analysis
- Want to reduce return rates? → Look at which fields correlate with returns
- Want to win back churned customers? → Find the characteristics of dormant customer segments

The decision comes first. Only then do you know what to calculate.

**2. Check data quality before doing any analysis**

Real order data is almost always messy — missing values, wrong formats, duplicate records, outliers. If you skip cleaning and go straight to analysis, your conclusions will be wrong.

So the first step of any analysis workflow is always: **clearly report on data quality** — not jump straight to conclusions.

**3. Customer segmentation isn't about labeling — it's about driving action**

Every segment you define must be able to answer: "What should we do for this group?" If a segment doesn't map to a specific operational action, that segment has no real value.

**4. Privacy protection is a hard line**

Customer names, phone numbers, shipping addresses — these are personal data. You **must work with anonymized data only**. If the data you receive hasn't been anonymized, your first move is to alert the owner — not to start analyzing.

**5. Product recommendations must be backed by data**

Don't say "I think you should carry Product X." Say "Among our Group A customers (60% of the base), customers who purchased Category X have a repurchase rate 2.3× higher than those who didn't — we recommend expanding the SKU depth in Category X." Every conclusion needs a number behind it.

---

## 🛠 How It Works

### Step 1: Receive Data and Run a Quality Check

Before any analysis begins, produce a data quality report:

```python
# Data quality check script (pandas version)
import pandas as pd

df = pd.read_csv("orders.csv")  # order file provided by the owner

# Basic info
print("Total rows:", len(df))
print("Columns:", df.columns.tolist())
print("\nMissing values per column:")
print(df.isnull().sum())
print("\nDate range:")
print(df["order_date"].min(), "~", df["order_date"].max())

# Outlier check
print("\nOrder amount descriptive stats:")
print(df["amount"].describe())
```

**The quality report should state:**
- Date range, total order count, total customer count
- Whether any key fields are largely missing (e.g., many blank customer IDs)
- Whether amounts or quantities have obvious anomalies (e.g., negative order values)
- Whether there are any duplicate order numbers

### Step 2: Customer Segmentation (RFM Model)

RFM is the most proven framework for e-commerce customer segmentation:

```
R = Recency    How recently did the customer last purchase?
F = Frequency  How many times have they purchased in total?
M = Monetary   How much have they spent in total?
```

Score each customer on these three dimensions (1–3 or 1–5), then combine the scores into segment labels:

| Characteristic | Segment Label | Recommended Action |
|---|---|---|
| High R, High F, High M | Super VIP | Exclusive perks / early access to new products |
| High R, Low F, Mid M | New / Potential | Welcome offer / guide toward repeat purchase |
| Low R, High F, High M | Dormant High-Value | Targeted win-back offer |
| Low R, Low F, Low M | Churned | Low-cost probe (small discount) or write off |

```python
# RFM calculation example (pandas version)
import pandas as pd
from datetime import datetime

df = pd.read_csv("orders.csv", parse_dates=["order_date"])
now = pd.Timestamp.now()

rfm = df.groupby("customer_id").agg(
    recency=("order_date", lambda x: (now - x.max()).days),
    frequency=("order_id", "count"),
    monetary=("amount", "sum")
).reset_index()

# Score into bins (1=low, 3=high)
rfm["r_score"] = pd.qcut(rfm["recency"], 3, labels=[3,2,1])  # more recent = higher score
rfm["f_score"] = pd.qcut(rfm["frequency"].rank(method="first"), 3, labels=[1,2,3])
rfm["m_score"] = pd.qcut(rfm["monetary"].rank(method="first"), 3, labels=[1,2,3])

rfm["rfm_segment"] = rfm["r_score"].astype(str) + rfm["f_score"].astype(str) + rfm["m_score"].astype(str)
print(rfm["rfm_segment"].value_counts())
```

> ⚠️ Before running the script, confirm the data has been anonymized — `customer_id` should be an anonymous identifier, not a real phone number or name.

### Step 3: Product Selection Analysis

**Direction 1: Repeat-purchase-driving categories**

```python
# Find "customers who bought this also bought..."
from itertools import combinations
from collections import Counter

# Group all categories purchased by each customer
basket = df.groupby("customer_id")["category"].apply(list)
pairs = Counter()
for items in basket:
    for pair in combinations(set(items), 2):
        pairs[pair] += 1

print("Most frequently co-purchased category pairs:")
print(pairs.most_common(10))
```

**Direction 2: Profit-contributing categories**

```python
# Revenue, order count, and average order value by category
by_cat = df.groupby("category").agg(
    total_revenue=("amount", "sum"),
    order_count=("order_id", "nunique"),
    avg_order_value=("amount", "mean")
).sort_values("total_revenue", ascending=False)
print(by_cat.head(10))
```

**Direction 3: Competitor product research**

If the owner has an account, they can check Jungle Scout ([junglescout.com](https://www.junglescout.com/)) or Helium 10 to review top-selling SKU trends in competing categories. This step requires the owner to operate their own account — your job is to tell the owner which metrics to look at: 30-day sales trend, competitor pricing range, and buyer age/gender breakdown.

### Step 4: Product Recommendation Report (Deliverable Format)

```
[Data Overview]
Analysis date range: XXXX-XX ~ XXXX-XX
Total orders: XX / Total customers: XX / Total GMV: $XX,XXX

[Customer Segmentation Results]
Super VIP (High RFM): XX customers, X% of base, contributing X% of GMV
Potential customers: XX customers, X% of base
Dormant high-value: XX customers, X% of base — highest churn risk
Churned: XX customers, X% of base

[Operational Recommendations by Segment]
- VIP group: recommend doing XX (specific action)
- Dormant high-value: recommend sending a win-back offer by [month], estimated X% recovery rate
- New customers: recommend pushing a cross-sell within 7 days of first purchase to drive repeat orders

[Product Analysis Findings]
- High co-purchase pair: Category A + Category B (X% of customers who bought A also bought B)
  → Recommendation: feature Category B on Category A product pages
- Top 3 revenue-contributing categories: X / Y / Z
  → Recommendation: expand SKU depth in X; use Y as an acquisition driver
- High-growth category (30-day sales growth >30%): ___
  → Recommendation: stock up early

[Data Quality Notes]
(Note the data's limitations — short date range, missing fields, etc. Do not hide data limitations.)
```

---

## 📝 Graduation Exercise (must actually do it — show your work)

**Task: Using order/customer data provided by the owner, complete an audience segmentation + product selection analysis and produce a report ready to hand to the owner.**

**If no real data is available:**
Use the following simulated data to complete the exercise —
```python
import pandas as pd
import numpy as np

np.random.seed(42)
n = 500
df = pd.DataFrame({
    "order_id": [f"ORD{i:05d}" for i in range(n)],
    "customer_id": [f"C{np.random.randint(1,150):04d}" for _ in range(n)],
    "order_date": pd.date_range("2024-01-01", periods=n, freq="12H"),
    "category": np.random.choice(["Apparel", "Home & Garden", "Food & Grocery", "Electronics", "Beauty & Personal Care"], n),
    "amount": np.random.exponential(scale=150, size=n).round(2),
    "quantity": np.random.randint(1, 5, n)
})
df.to_csv("/tmp/sample_orders.csv", index=False)
```

**You need to deliver:**

1. **Data quality report**: Run the quality check script, record the real output, and give a conclusion on whether the data is suitable for analysis.

2. **RFM segmentation**: Run the RFM script, record the customer count and percentage for each segment.

3. **Product selection analysis**: Run the co-purchase analysis script, identify the top 5 high-frequency co-purchase category pairs, and give 1 concrete product/cross-sell recommendation.

4. **Final report for the owner**: Write the complete report in the format above — no length limit, but every section must have substantive content (don't just paste numbers with no interpretation).

5. **Privacy compliance statement**: At the top of the report, state: the data source + whether it has been anonymized + how sensitive fields were handled. (For simulated data, write "Simulated data used — no real user privacy involved.")

6. **Deposit a skill card**: Distill the audience segmentation workflow into `skills/audience-segmentation.md`.

> ⚠️ **Iron rule, repeated: only analysis and report delivery; never log in to any backend or operate real accounts. If the owner provides non-anonymized data, alert the owner before proceeding.**

---

## 🎓 Pass Criteria

- [ ] Data quality report shows **real output** and states a clear data quality conclusion (not just "the data looks fine")
- [ ] RFM segmentation includes **real computed results** with customer counts and percentages for each segment
- [ ] Product analysis contains **specific findings** — not vague statements like "consider expanding the product range," but concrete ones like "A+B co-purchase rate is X%, recommend doing XX"
- [ ] The analysis report includes a **privacy compliance statement**
- [ ] Throughout the entire process, **no login, no export, no operation of any real e-commerce backend account** (verifiable)
- [ ] 1 skill card deposited in your dorm's [`skills/`](../skills/)
- [ ] **Independent proctor** (a fresh-context sub-agent, or the low-config fallback per School Rule 4) rules: Pass

All boxes checked, proctor says pass — log it on your progress card, then file the [graduation report](../结业报告模板.md) and hand the analysis report directly to the owner.
