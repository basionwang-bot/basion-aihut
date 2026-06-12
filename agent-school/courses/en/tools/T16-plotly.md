> 🌐 English ｜ [中文](../../tools/T16-plotly.md)

# Lesson T16 · plotly: Interactive Charts and Dashboards

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T15 (matplotlib — foundational charting concepts) ｜ Difficulty: ★★☆ ｜ Source: Plotly official docs · [plotly.com/python](https://plotly.com/python/) · [github.com/plotly/plotly.py](https://github.com/plotly/plotly.py)

---

## 📖 What you'll learn

After this lesson, you'll be able to use plotly to produce **hover, click, and zoom-enabled interactive charts**, exported as a self-contained HTML file — the owner opens it in any browser, hovers over any data point to see its exact value, no more squinting at a static image.

Think of a matplotlib chart as a **printed map** — beautiful, but you can only look at it. A plotly chart is **Google Maps** — you can zoom in, zoom out, click a location for details, or draw a box to select a region. When the owner wants to "explore the data" rather than just "read a conclusion," plotly is the better choice.

plotly.py is the open-source Python charting library from Plotly Inc. Core features are free. The charts it generates are JavaScript-based (D3.js/WebGL) and export to HTML — opens directly in any browser, no plugins, no special configuration.

**Official resources:**
- Docs: [plotly.com/python](https://plotly.com/python/)
- Chart gallery: [plotly.com/python/basic-charts](https://plotly.com/python/basic-charts/)
- GitHub: [github.com/plotly/plotly.py](https://github.com/plotly/plotly.py)
- PyPI: [pypi.org/project/plotly](https://pypi.org/project/plotly)
- Express quick-start: [plotly.com/python/plotly-express](https://plotly.com/python/plotly-express/)

---

## 🧠 Core principles (internalize these as habits)

1. **`plotly.express` (px) is the fastest path for newcomers.** plotly has two APIs: the low-level `plotly.graph_objects` (go) — full-featured but verbose; and the high-level `plotly.express` (px) — one line produces a chart. Start with px; drop into go only when you need finer control. **Don't start with graph_objects.**

2. **Save interactive charts as HTML; static charts as PNG/SVG.** `fig.write_html("out.html")` preserves full interactivity and is the simplest path. `fig.write_image("out.png")` requires installing the additional `kaleido` package. Use HTML when delivering interactive charts to the owner; use images when inserting into Word or PPT.

3. **Dash is plotly's dashboard framework — they're siblings, not the same thing.** This lesson covers plotly charting only. If the owner wants a "multi-chart linked dashboard," that's Dash (a separate topic). Don't confuse the two.

4. **Feed data to px as a pandas DataFrame.** px is designed around DataFrames: one column as the X axis, one as Y, one to determine color — very intuitive. Plain Python lists work too, but DataFrames are smoother.

5. **Chinese text is not painful the way it is in matplotlib.** plotly charts render in the browser, which natively handles any Unicode — just write Chinese strings directly, no font configuration needed.

---

## 🛠 How to do it

### Installation

```bash
pip install plotly

# If you also need to export static images (PNG/SVG):
pip install kaleido
```

> ⚠️ **Do not install or run without the owner's confirmation — present the plan first.**

### Minimal runnable script: monthly sales line chart (interactive)

```python
import plotly.express as px
import os

os.makedirs("output", exist_ok=True)

# Data
data = {
    "Month":   ["Jan","Feb","Mar","Apr","May","Jun"],
    "Beijing": [128, 134, 119, 145, 152, 141],
    "Shanghai":[95,  102, 88,  110, 118, 107],
    "Shenzhen":[143, 148, 135, 160, 171, 158],
}

import pandas as pd
df = pd.DataFrame(data)
df_long = df.melt(id_vars="Month", var_name="City", value_name="Revenue ($K)")

fig = px.line(
    df_long,
    x="Month",
    y="Revenue ($K)",
    color="City",
    markers=True,
    title="H1 2026 Monthly Sales Revenue by City",
    labels={"Revenue ($K)": "Revenue ($K)", "Month": "Month"},
)
fig.update_layout(hovermode="x unified")  # show all cities on hover at same X

# Save as interactive HTML
fig.write_html("output/sales_trend.html")
print("Interactive chart saved: output/sales_trend.html")

# Save as static image (requires kaleido)
# fig.write_image("output/sales_trend.png")
```

### Quick examples for common chart types

```python
import plotly.express as px
import pandas as pd

# ---- Bar chart ----
df = pd.DataFrame({
    "City":     ["Beijing","Shanghai","Guangzhou","Shenzhen"],
    "Q1 Sales": [128, 95, 110, 143],
    "Q2 Sales": [145, 110, 125, 160],
})
df_long = df.melt("City", var_name="Quarter", value_name="Revenue")
fig = px.bar(df_long, x="City", y="Revenue", color="Quarter", barmode="group", title="Q1 vs Q2 Revenue by City")
fig.write_html("output/bar.html")

# ---- Pie chart ----
fig = px.pie(values=[35,30,25,10], names=["North","East","South","West"], title="Revenue Share by Region")
fig.write_html("output/pie.html")

# ---- Scatter plot (with bubble size) ----
df2 = pd.DataFrame({
    "Ad Spend": [10,20,35,50,70,90],
    "Revenue":  [18,30,48,65,88,112],
    "City":     ["Beijing","Shanghai","Guangzhou","Shenzhen","Chengdu","Hangzhou"],
    "Team Size":[5,8,12,15,10,7],
})
fig = px.scatter(df2, x="Ad Spend", y="Revenue", size="Team Size", color="City",
                 hover_name="City", title="Ad Spend vs. Revenue")
fig.write_html("output/scatter.html")
```

### Common operations quick reference

| Goal | Code |
|------|------|
| Line chart | `px.line(df, x=..., y=..., color=...)` |
| Bar chart | `px.bar(df, x=..., y=..., barmode='group')` |
| Scatter plot | `px.scatter(df, x=..., y=..., size=..., color=...)` |
| Pie chart | `px.pie(values=..., names=...)` |
| Heatmap | `px.imshow(matrix)` |
| Multiple subplots | `from plotly.subplots import make_subplots` |
| Update title | `fig.update_layout(title="...")` |
| Hover mode | `fig.update_layout(hovermode="x unified")` |
| Save as HTML | `fig.write_html("out.html")` |
| Save as image | `fig.write_image("out.png")` (requires kaleido) |
| Display in Jupyter | `fig.show()` |

### Combine multiple charts into one HTML dashboard

```python
from plotly.subplots import make_subplots
import plotly.graph_objects as go

fig = make_subplots(rows=1, cols=2, subplot_titles=("Monthly Trend", "City Comparison"))

fig.add_trace(go.Scatter(x=["Jan","Feb","Mar"], y=[12,15,9], name="Trend"), row=1, col=1)
fig.add_trace(go.Bar(x=["Beijing","Shanghai","Shenzhen"], y=[128,95,143], name="City"), row=1, col=2)

fig.update_layout(title_text="Sales Dashboard · H1 2026")
fig.write_html("output/dashboard.html")
print("Dashboard saved: output/dashboard.html")
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "multi-chart data dashboard" plan and produce a runnable script.**

Chosen scenario: use e-commerce data (at least 3 product categories × 6 months) to generate a single-page HTML dashboard containing: ① a line chart (monthly trend per category) and ② a bar chart (total revenue comparison by category). Both charts go in one HTML file, saved as `output/ecommerce_dashboard.html`.

You need to complete:

1. **Write a complete runnable script:**
   - Data structure (3 categories × 6 months)
   - Use `make_subplots` to put both charts in a single figure
   - Title, legend, and hover tooltips all present
   - `fig.write_html("output/ecommerce_dashboard.html")`

2. **Write acceptance criteria:**
   - `output/ecommerce_dashboard.html` exists and is > 50 KB
   - Open in a browser — two charts are visible
   - Hovering over the line chart shows value tooltips

3. **Write environment notes:** `pip install plotly pandas` (pandas is recommended for DataFrame handling).

4. **Write an HTML vs. PNG export comparison:** when to deliver HTML, when to deliver a static image, and the trade-offs of each.

5. **Write safety notes:** this task runs locally with no network access; risk is low. `pip install` and script execution **still require the owner's confirmation first**.

6. **Distill a skill card** to `agent-school/skills/plotly-dashboard.md`.

---

## 🎓 Pass criteria

- [ ] You wrote a complete runnable script (multiple charts + make_subplots + write_html)
- [ ] You can explain when `px` (Express) vs. `go` (graph_objects) is the right choice
- [ ] You know the difference between `write_html` and `write_image`, and when to use each
- [ ] You can explain why Chinese text handling feels different between plotly and matplotlib
- [ ] Distilled 1 skill card into [`agent-school/skills/plotly-dashboard.md`](../../../skills/plotly-dashboard.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T17.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: generating interactive charts and HTML dashboards with plotly

- **When to use**: when you need interactive charts (hover for values, zoom, multi-chart linkage) delivered as HTML
- **From**: Lesson T16 plotly

## Steps
1. pip install plotly pandas (ask the owner first)
2. Prepare data (DataFrame or list)
3. Simple chart: px.line/bar/scatter/pie(...) → fig
4. Multi-chart dashboard: make_subplots + fig.add_trace(go.Xxx, row, col)
5. fig.update_layout(title, hovermode...)
6. fig.write_html("out.html") or fig.write_image("out.png") (needs kaleido)

## Verification
- HTML file exists and is > 50 KB
- Opens in browser; charts visible; hover interaction works

## Notes
- px is the quick entry point; go is for fine-grained control — start with px
- write_image requires pip install kaleido
- plotly charts don't need special font config for non-ASCII text (browser renders it)
- pip install and execution both require the owner's confirmation first
```
