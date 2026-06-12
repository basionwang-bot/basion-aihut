> 🌐 English ｜ [中文](../../professions/Z25-dashboard.md)

# Lesson Z25 · Business Dashboard

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T09-pandas (recommended) ｜ Difficulty: ★★★ ｜ Source: pandas official docs [pandas.pydata.org](https://pandas.pydata.org/docs/) · matplotlib official docs [matplotlib.org/stable](https://matplotlib.org/stable/contents.html) · plotly official docs [plotly.com/python](https://plotly.com/python/)

---

## 📖 What you'll learn

After this lesson, you will take the owner's business data — a heap of dry number tables — and turn it into **a business dashboard that speaks for itself**, then hand over the chart files alongside a plain-English summary the owner can use immediately.

Let me explain why this is worth taking seriously.

Have you ever seen the kind of weekly Excel report a manager stares at every Monday? Forty or fifty columns of numbers, not a single line, not a single color, wall-to-wall figures. It takes ten minutes just to figure out "did sales go up or down last week?"

**That's the problem with "naked data."**

A business dashboard does something different: it compresses those fifty columns into four or five charts, so a single glance can answer the three most important questions:

- Is the business in good shape right now? (health)
- Better or worse than last week / last month? (trend)
- Where is something going wrong? (anomaly)

Your job is to make sure the owner knows, within the first second of looking at the dashboard, whether this week's business is "green" or "red."

**On data visualization tools (research first, ask before installing):**

- **matplotlib**: Python's classic plotting library — full-featured, great for static charts. Docs: [matplotlib.org/stable](https://matplotlib.org/stable/contents.html) — completely free and open-source.
- **plotly**: the go-to for interactive charts — users can pan, zoom, and click individual data points; export as an HTML file that works in any browser. Docs: [plotly.com/python](https://plotly.com/python/) — free and open-source; there's a paid cloud edition, but this lesson doesn't need it.
- **pandas built-in `.plot()`**: call `.plot()` directly on a DataFrame; uses matplotlib under the hood; ideal for quick charts.

> ⚠️ Confirm with the owner before using any tool. **Business data may be commercially sensitive** — before running anything, ask: can this data be processed locally? Are there sensitive fields (e.g., individual user IDs) that should not appear in a chart?

---

## 🧠 Core principles (internalize these as habits)

**1. A dashboard is a decision-making tool, not a "place to display numbers"**

Before any chart goes live, ask yourself: "What decision can the owner make after seeing this chart?" If you can't answer that, the chart doesn't need to be in the dashboard.

**2. One dashboard, at most 5 questions**

More is less. A dashboard stuffed with twelve charts, each answering a different thing, ends up saying nothing clearly. Pick the 3–5 most critical metrics and explain them well.

**3. Color carries meaning — it is not decoration**

Red = warning / declining, green = healthy / rising, yellow = caution. Don't use a rainbow palette — a dashboard is not candy packaging.

**4. Numbers only mean something when compared to a reference point**

"This week's revenue: $80,000" — good or bad? No idea. "This week: $80K, last week: $75K, same period last year: $68K" — now it's clear. Every key number on the dashboard needs a reference baseline next to it.

**5. Chart first, then interpretation**

Charts and written commentary are two different things. Charts let the owner "see what the numbers look like." Text lets the owner "know what the numbers mean." Both are essential.

---

## 🛠 How to do it

### Step 1: Confirm dashboard requirements with the owner

Before touching anything, clarify three things:

```
1. Who is this dashboard for? (executive? ops team? finance?)
   → determines metric granularity and presentation style
2. Which core questions need to be answered?
   → determines which charts to include
3. How often does the data update? (daily? weekly? monthly?)
   → determines the time-axis granularity
```

### Step 2: Load and preprocess data

```python
# Embedded simulation data — no network needed, runs immediately
import pandas as pd
import numpy as np

np.random.seed(42)

# Simulate 90 days of business data
dates = pd.date_range("2024-01-01", periods=90, freq="D")
df = pd.DataFrame({
    "date": dates,
    "revenue": np.random.normal(50000, 8000, 90).clip(0),          # daily revenue
    "orders": np.random.randint(80, 200, 90),                       # daily orders
    "new_customers": np.random.randint(10, 40, 90),                 # new customers
    "channel": np.random.choice(["Social", "Organic", "Paid"], 90), # acquisition channel
})

# Weekly rollup
df["week"] = df["date"].dt.isocalendar().week
weekly = df.groupby("week").agg(
    revenue=("revenue", "sum"),
    orders=("orders", "sum"),
    new_customers=("new_customers", "sum")
).reset_index()

# Week-over-week growth
weekly["revenue_wow"] = weekly["revenue"].pct_change() * 100  # WoW %
print(weekly.tail(5))
```

### Step 3: Build the four core dashboard charts

```python
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.font_manager as fm

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("Weekly Business Dashboard", fontsize=16, fontweight="bold", y=1.01)

# Chart 1: Daily revenue trend + 7-day moving average
ax1 = axes[0, 0]
ax1.plot(df["date"], df["revenue"], color="#a8c8e8", alpha=0.6, linewidth=1, label="Daily revenue")
ax1.plot(df["date"], df["revenue"].rolling(7).mean(), color="#2166ac", linewidth=2, label="7-day MA")
ax1.set_title("Daily Revenue Trend", fontsize=12)
ax1.set_ylabel("Amount ($)")
ax1.legend()
ax1.xaxis.set_major_formatter(mdates.DateFormatter("%m/%d"))

# Chart 2: Orders by channel (pie chart)
ax2 = axes[0, 1]
channel_cnt = df.groupby("channel")["orders"].sum()
ax2.pie(channel_cnt, labels=channel_cnt.index, autopct="%1.1f%%",
        colors=["#2166ac", "#4dac26", "#d01c8b"])
ax2.set_title("Orders by Channel", fontsize=12)

# Chart 3: Weekly revenue WoW growth (bar chart)
ax3 = axes[1, 0]
colors = ["#4dac26" if x >= 0 else "#d01c8b" for x in weekly["revenue_wow"].fillna(0)]
ax3.bar(weekly["week"].astype(str), weekly["revenue_wow"].fillna(0), color=colors)
ax3.axhline(0, color="black", linewidth=0.8)
ax3.set_title("Weekly Revenue WoW Growth (%)", fontsize=12)
ax3.set_xlabel("Week number")
ax3.set_ylabel("Growth rate (%)")

# Chart 4: New customer trend
ax4 = axes[1, 1]
ax4.fill_between(df["date"], df["new_customers"], alpha=0.4, color="#4dac26")
ax4.plot(df["date"], df["new_customers"], color="#4dac26", linewidth=1.5)
ax4.set_title("Daily New Customers", fontsize=12)
ax4.set_ylabel("Count")
ax4.xaxis.set_major_formatter(mdates.DateFormatter("%m/%d"))

plt.tight_layout()
plt.savefig("/tmp/dashboard.png", dpi=150, bbox_inches="tight")
print("Dashboard saved to /tmp/dashboard.png")
```

### Step 4: Key metrics summary card (text version)

```python
# Compare most recent week vs. the week before
last_week = weekly.iloc[-1]
prev_week = weekly.iloc[-2]

def delta_str(now, prev):
    d = (now - prev) / prev * 100
    arrow = "▲" if d >= 0 else "▼"
    direction = "up" if d >= 0 else "down"
    return f"{arrow} {abs(d):.1f}% ({direction})"

summary = f"""
========================================
📊 Dashboard Summary (most recent week vs. prior week)
========================================
Revenue:       ${last_week['revenue']:>10,.0f}  {delta_str(last_week['revenue'], prev_week['revenue'])}
Orders:        {last_week['orders']:>10,.0f}    {delta_str(last_week['orders'], prev_week['orders'])}
New customers: {last_week['new_customers']:>10,.0f}    {delta_str(last_week['new_customers'], prev_week['new_customers'])}
========================================
"""
print(summary)
```

### Step 5: Deliverable format

```
[Business Dashboard Report]
Generated: YYYY-MM-DD
Data range: YYYY-MM-DD ~ YYYY-MM-DD

[This Week's Key Metrics]
Revenue:       $XX,XXX  (WoW ▲X.X%)
Orders:        XX       (WoW ▼X.X%)
New customers: XX       (WoW ▲X.X%)

[Chart Notes]
- Chart 1 (daily revenue trend): There is a clear spike around the Xth — likely related to the XX campaign...
- Chart 2 (channel breakdown): Paid channel now accounts for X%, up X percentage points from last month...
- Chart 3 (WoW bar chart): Three consecutive weeks of positive growth, but momentum is slowing...
- Chart 4 (new customer trend): New customers have dropped noticeably over the past two weeks — acquisition effectiveness needs attention...

[Signals to Watch]
⚠️ (1–2 anomalies or issues requiring follow-up, with specific numbers)

[Data Notes]
(Note data source, time range, any missing fields)
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use the simulation data above (or real business data provided by the owner) to generate a complete business dashboard — deliver chart files + a dashboard report ready for the owner.**

**You must:**

1. **Run the script to generate four charts**: write out the real file path of `/tmp/dashboard.png` and describe each chart.

2. **Generate the key metrics summary card**: paste the real script output into the report.

3. **Write the complete dashboard report**: fill in every section of the deliverable format above; every chart must have 1–2 sentences of plain-English interpretation — not just numbers with no commentary.

4. **Identify 1 anomaly or signal worth watching**: genuinely observed from the charts, not made up.

5. **Privacy compliance statement**: note the data source and whether there are any sensitive fields. (For simulation data, write: "Simulated data; no real user privacy involved.")

6. **Distill a skill card**: crystallize the business dashboard generation workflow into `skills/dashboard.md`.

> ⚠️ If the owner provides real business data, confirm before running: the data can be processed locally, and it does not contain user personal information that cannot be shared externally. The dashboard deliverable goes only to the owner — do not upload it to any external platform.

---

## 🎓 Pass criteria

- [ ] Four charts **genuinely generated**; chart file path and descriptions written into the report (not just "charts generated")
- [ ] Key metrics summary card has **real calculated numbers**, including WoW comparisons
- [ ] Every chart has **plain-English interpretation** (1–2 sentences) — not just "as shown in the figure"
- [ ] At least **1 anomaly signal** identified, with numerical support
- [ ] Report includes **data source and privacy compliance statement**
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **An independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand the dashboard to the owner.
