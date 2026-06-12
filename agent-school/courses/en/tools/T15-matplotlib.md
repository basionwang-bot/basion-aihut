> 🌐 English ｜ [中文](../../tools/T15-matplotlib.md)

# Lesson T15 · matplotlib: Turn Data into a Readable Chart

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: matplotlib official docs · [matplotlib.org/stable/tutorials](https://matplotlib.org/stable/tutorials/index.html) · [github.com/matplotlib/matplotlib](https://github.com/matplotlib/matplotlib)

---

## 📖 What you'll learn

After this lesson, you'll be able to use matplotlib to turn a pile of numbers into a readable, shareable, report-ready image — line chart, bar chart, pie chart — saved as a `.png` file, no GUI software needed.

Picture the owner handing you a sales table: Jan ¥120K, Feb ¥150K, Mar ¥90K… Just staring at numbers, the owner has to mentally reconstruct what's happening. But give them a line chart, and "March had a clear dip" is obvious at a glance — that's **translating numbers into a picture**.

matplotlib is Python's most established charting library. So established, in fact, that if you search "Python plot chart," nine out of ten results use it. It needs no network access, no GUI window (it can silently generate image files), and runs on servers without a display.

**Official resources:**
- Docs: [matplotlib.org/stable/tutorials](https://matplotlib.org/stable/tutorials/index.html)
- Chart gallery: [matplotlib.org/stable/gallery](https://matplotlib.org/stable/gallery/index.html) (not sure how to draw something? start here)
- GitHub: [github.com/matplotlib/matplotlib](https://github.com/matplotlib/matplotlib)
- PyPI: [pypi.org/project/matplotlib](https://pypi.org/project/matplotlib)

---

## 🧠 Core principles (internalize these as habits)

1. **First ask: "what story does this chart need to tell?"** Line charts show trends; bar charts compare magnitudes; pie charts show proportions; scatter plots reveal relationships. Choosing the wrong chart type makes accurate data incomprehensible — like using a bar chart to show "daily temperature changes over time."

2. **Remember the two-layer structure: Figure (canvas) and Axes (plot area).** A Figure is the whole blank sheet of paper; an Axes is the region on that sheet where axes and data are drawn. One Figure can have multiple Axes (subplots). For beginners, one Axes is enough: `fig, ax = plt.subplots()`.

3. **Silent (headless) mode is a must for servers and agents.** In an environment with no display, you must set `import matplotlib; matplotlib.use('Agg')` before importing `pyplot`, otherwise you'll get an error about no display being found.

4. **Title, axis labels, and legend — all three are required.** A chart without a title is like a map without labels — viewers don't know what they're looking at. `ax.set_title()`, `ax.set_xlabel()`, `ax.set_ylabel()`, `ax.legend()` — all four, every time.

5. **Chinese characters require a manual font setting, otherwise they show as boxes.** matplotlib's default font doesn't include Chinese glyphs. The common fix: specify a system font that includes Chinese (e.g., `'SimHei'`, `'Microsoft YaHei'`), or use a patch package like `matplotlib-font-zh`.

---

## 🛠 How to do it

### Installation

```bash
pip install matplotlib
```

> ⚠️ **Do not install or run without the owner's confirmation — present the plan first.**

### Handling non-ASCII characters

```python
import matplotlib
matplotlib.use('Agg')  # must come before importing pyplot in headless environments
import matplotlib.pyplot as plt

# Set a font that supports your script (Linux server example)
plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False  # prevent minus sign from rendering as a box
```

### Minimal runnable script: monthly sales line chart

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os

os.makedirs("output", exist_ok=True)

# Data
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
sales  = [12, 15, 9, 18, 21, 17]

# Create canvas
fig, ax = plt.subplots(figsize=(8, 5))

# Draw line
ax.plot(months, sales, marker='o', color='steelblue', linewidth=2, label='Revenue ($K)')

# Annotate each data point
for x, y in zip(months, sales):
    ax.annotate(f'${y}K', (x, y), textcoords="offset points", xytext=(0, 8), ha='center', fontsize=10)

# Titles and labels
ax.set_title('H1 2026 Monthly Sales Revenue', fontsize=14)
ax.set_xlabel('Month')
ax.set_ylabel('Revenue ($K)')
ax.legend()
ax.grid(axis='y', linestyle='--', alpha=0.5)

# Save
plt.tight_layout()
plt.savefig('output/sales_trend.png', dpi=150)
plt.close()
print("Chart saved to output/sales_trend.png")
```

### The three most common chart types

```python
# ---- Bar chart ----
fig, ax = plt.subplots()
cities = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen']
values = [128, 95, 110, 143]
bars = ax.bar(cities, values, color=['#4C72B0','#DD8452','#55A868','#C44E52'])
ax.bar_label(bars)  # show value above each bar
ax.set_title('Revenue by City')
plt.savefig('output/bar.png', dpi=150); plt.close()

# ---- Pie chart ----
fig, ax = plt.subplots()
labels = ['North', 'East', 'South', 'West']
sizes  = [35, 30, 25, 10]
ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
ax.set_title('Revenue Share by Region')
plt.savefig('output/pie.png', dpi=150); plt.close()

# ---- Scatter plot ----
import random
fig, ax = plt.subplots()
x = [random.randint(10, 100) for _ in range(30)]
y = [xi * 1.2 + random.gauss(0, 8) for xi in x]
ax.scatter(x, y, alpha=0.6, color='darkorange')
ax.set_title('Ad Spend vs. Revenue')
ax.set_xlabel('Ad Spend ($K)')
ax.set_ylabel('Revenue ($K)')
plt.savefig('output/scatter.png', dpi=150); plt.close()
```

### Common operations quick reference

| Goal | Code |
|------|------|
| Create a canvas | `fig, ax = plt.subplots(figsize=(width, height))` |
| Line chart | `ax.plot(x, y, marker='o')` |
| Bar chart | `ax.bar(x, y)` |
| Horizontal bar chart | `ax.barh(y, x)` |
| Pie chart | `ax.pie(sizes, labels=labels, autopct='%1.1f%%')` |
| Scatter plot | `ax.scatter(x, y)` |
| Multiple subplots | `fig, (ax1, ax2) = plt.subplots(1, 2)` |
| Set title | `ax.set_title("...")` |
| Set X-axis label | `ax.set_xlabel("...")` |
| Add legend | `ax.legend()` |
| Add grid | `ax.grid(True)` |
| Save | `plt.savefig("out.png", dpi=150)` |
| Close (free memory) | `plt.close()` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "data → chart" pipeline and produce a runnable script.**

Chosen scenario: use quarterly data (4 quarters, 3 product lines) to generate a **grouped bar chart** showing sales comparison across product lines by quarter, saved as `output/quarterly_report.png`.

You need to complete:

1. **Write a complete runnable script:**
   - Data structure (4 quarters × 3 product lines)
   - Use `matplotlib.use('Agg')` for headless mode
   - Handle font settings for non-ASCII characters
   - Generate a grouped bar chart (one group per quarter, bars colored by product line)
   - Include title, X-axis label, Y-axis label, and legend
   - Save to `output/quarterly_report.png`

2. **Write acceptance criteria:**
   - `output/quarterly_report.png` exists and is > 10 KB (not a blank image)
   - Image resolution is dpi=150 or higher

3. **Write a font-handling explanation:** describe which font name to use on Windows, macOS, and Linux respectively, and how to verify the font setting worked (no box characters in the output).

4. **Write safety notes:** this task involves no network access, no config file writes, only image generation — minimal risk. `pip install` and script execution **still require the owner's confirmation first**.

5. **Distill a skill card** to `agent-school/skills/matplotlib-chart.md`.

---

## 🎓 Pass criteria

- [ ] You wrote a complete runnable script (with Agg backend, font handling, grouped bar chart)
- [ ] You can explain the relationship between Figure and Axes, and what `plt.subplots()` returns
- [ ] You know how to silently generate images on a headless server without errors
- [ ] You know which story each chart type tells (line / bar / pie / scatter)
- [ ] Distilled 1 skill card into [`agent-school/skills/matplotlib-chart.md`](../../../skills/matplotlib-chart.md)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T16.

---

## 🃏 Skill card template (write to skills/ when you pass)

```markdown
# Skill: generating data charts with matplotlib

- **When to use**: when you need to turn numeric data into static images (line/bar/pie charts) for saving or inserting into a report
- **From**: Lesson T15 matplotlib

## Steps
1. pip install matplotlib (ask the owner first)
2. import matplotlib; matplotlib.use('Agg')  # must be set before any pyplot import in headless environments
3. Set font: plt.rcParams['font.sans-serif'] = ['SimHei', ...]
4. fig, ax = plt.subplots(figsize=(width, height))
5. Call ax.plot / ax.bar / ax.pie / ax.scatter depending on chart type
6. Add set_title / set_xlabel / set_ylabel / legend
7. plt.tight_layout(); plt.savefig("out.png", dpi=150); plt.close()

## Verification
- File exists and is > 10 KB
- Text in the chart renders correctly (no box characters)

## Notes
- Headless environments must call matplotlib.use('Agg') before importing pyplot
- In batch generation, call plt.close() after each chart to prevent memory leaks
- Fonts by OS: Windows=SimHei/Microsoft YaHei, macOS=PingFang SC, Linux=install font manually
- pip install and execution both require the owner's confirmation first
```
