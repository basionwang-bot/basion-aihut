> 🌐 English ｜ [中文](../../professions/Z29-kpi-report.md)

# Lesson Z29 · KPI Report Automation

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T09-pandas (recommended), Z27-sales-analysis (suggested) ｜ Difficulty: ★★☆ ｜ Source: pandas official docs [pandas.pydata.org](https://pandas.pydata.org/docs/) · Jinja2 template docs [jinja.palletsprojects.com](https://jinja.palletsprojects.com/) · Python pathlib standard library [docs.python.org/3/library/pathlib.html](https://docs.python.org/3/library/pathlib.html)

---

## 📖 What you'll learn

After this lesson, you will take the weekly or monthly KPI report the owner has to produce repeatedly and turn it into **a reusable automated pipeline** — next time, just drop in the latest data file, the report generates itself in the same format, and all you need to do is review it before handing it over.

In plain terms, here's the pain you're eliminating:

Every Monday morning at 9 a.m., an operations coordinator named Alex opens last week's report template, manually updates the date in the title, pastes in the new data, hand-edits a dozen formula cells, and spends half an hour refreshing all the charts — two hours of work in total. Then the manager says: "Can you give me one of these every day?"

Alex's soul leaves their body.

After you step in, the whole process becomes: Alex drops the new data file into a folder, tells you "generate this week's report," and thirty seconds later it's done. Same format, same logic, same reference baselines every single time. Alex finishes the report in the time it takes to drink a cup of coffee.

That's the value of "turning repetitive labor into a reusable pipeline."

**On tools (research first, ask before installing):**

- **pandas**: reads data and drives KPI calculations. Docs: [pandas.pydata.org](https://pandas.pydata.org/docs/) — completely free.
- **Jinja2**: a Python template engine — it "fills in" calculated numbers into a report template. Docs: [jinja.palletsprojects.com](https://jinja.palletsprojects.com/) — completely free and open-source. `pip install jinja2`.
- **openpyxl**: export the report to Excel format if the owner needs it. `pip install openpyxl` — free and open-source. Ask the owner before installing.

> ⚠️ KPI data typically involves individual employee performance — this is HR-sensitive information. Before generating reports, confirm: the report will only be sent to those authorized to view it; if the report is to be distributed via Slack / Teams / email, the owner must explicitly know about and approve the delivery mechanism. This lesson does not connect to any HR system or send reports automatically.

---

## 🧠 Core principles (internalize these as habits)

**1. First clarify "who reads this report and what decision they need to make"**

The design of a KPI report depends on its audience. An executive's report should be concise, with green/yellow/red signals. A team lead's report needs line-item detail for root-cause tracing. Before automating anything, confirm with the owner who the audience is — otherwise you're automating a report nobody actually needs.

**2. The core of automation is "data changes, format doesn't"**

A well-built automated report has two completely separate pieces: "data calculation logic" (pandas) and "report template" (Jinja2 or a fixed format). Only the data file gets swapped out; the template and calculation logic stay untouched. Changes don't cascade through the whole system.

**3. Edge cases need handling**

What if the data file is missing? What if a column was renamed? What if values look anomalous? A robust automation pipeline doesn't "crash silently with no message" — it gives the owner a clear error: "File XX not found, please check" or "This week's data has XX anomalous values, flagged — please confirm."

**4. Documentation is as important as code**

The automation script you write needs to be understood by the owner or the next agent who picks it up. At the top of every script, write clearly: what input files are required, what output files are produced, what parameters can be tuned. This isn't padding — it's what makes the pipeline genuinely hand-off-able.

---

## 🛠 How to do it

### Step 1: Generate simulated KPI data (embedded — runs immediately)

```python
import pandas as pd
import numpy as np
from pathlib import Path

np.random.seed(99)

# Simulate 4 weeks of team KPI data
weeks = ["2024-W10", "2024-W11", "2024-W12", "2024-W13"]
members = ["Alice", "Bob", "Carol", "David", "Eve"]

records = []
for week in weeks:
    for member in members:
        records.append({
            "week":           week,
            "name":           member,
            "revenue":        round(np.random.normal(30000, 8000), 2),
            "client_visits":  np.random.randint(5, 20),
            "new_contracts":  np.random.randint(0, 5),
            "target_revenue": 35000,  # fixed target
        })

df = pd.DataFrame(records)
df["attainment_pct"] = (df["revenue"] / df["target_revenue"] * 100).round(1)

# Save one file per week — simulating "weekly data files"
Path("/tmp/kpi_data").mkdir(exist_ok=True)
for week, grp in df.groupby("week"):
    grp.to_csv(f"/tmp/kpi_data/{week}.csv", index=False, encoding="utf-8-sig")
    
print("Simulated KPI data ready — files saved to /tmp/kpi_data/")
print(df.groupby("week")["revenue"].sum())
```

### Step 2: KPI calculation engine (core logic)

```python
import pandas as pd
from pathlib import Path

def calc_kpi(week_str: str, data_dir: str = "/tmp/kpi_data") -> dict:
    """
    Read KPI data for the specified week and compute summary metrics.
    Returns a dictionary for filling the report template.
    
    Input:  {data_dir}/{week_str}.csv
    Output: dict containing this week's and comparison KPIs
    """
    fpath = Path(data_dir) / f"{week_str}.csv"
    if not fpath.exists():
        raise FileNotFoundError(f"Data file not found: {fpath}\nCheck the file path and week format (e.g. 2024-W13)")
    
    df = pd.read_csv(fpath, encoding="utf-8-sig")
    
    # Required field validation
    required_cols = {"name", "revenue", "target_revenue", "client_visits", "new_contracts"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Data file is missing columns: {missing}\nCheck that column names match the template")
    
    # Anomaly warnings
    negative_rows = df[df["revenue"] < 0]
    warnings = []
    if len(negative_rows) > 0:
        warnings.append(f"⚠️  {len(negative_rows)} row(s) with negative revenue — please verify: {negative_rows['name'].tolist()}")
    
    # Core KPI calculations
    total_revenue    = df["revenue"].sum()
    total_target     = df["target_revenue"].sum()
    attain_rate      = total_revenue / total_target * 100
    total_visits     = df["client_visits"].sum()
    total_contracts  = df["new_contracts"].sum()
    
    top_person       = df.loc[df["revenue"].idxmax(), "name"]
    top_revenue      = df["revenue"].max()
    
    # Traffic-light status
    if attain_rate >= 100:
        status = "Green ✅ On target"
    elif attain_rate >= 85:
        status = "Yellow ⚠️  Near target"
    else:
        status = "Red ❌ Below target"
    
    return {
        "week":            week_str,
        "total_revenue":   total_revenue,
        "total_target":    total_target,
        "attain_rate":     attain_rate,
        "status":          status,
        "total_visits":    total_visits,
        "total_contracts": total_contracts,
        "top_person":      top_person,
        "top_revenue":     top_revenue,
        "member_detail":   df[["name","revenue","attainment_pct","client_visits","new_contracts"]].to_dict("records"),
        "warnings":        warnings,
    }

# Test it
kpi = calc_kpi("2024-W13")
print(f"Weekly summary · {kpi['week']}")
print(f"  Total revenue: {kpi['total_revenue']:>10,.2f}")
print(f"  Target attainment: {kpi['attain_rate']:.1f}%  {kpi['status']}")
print(f"  This week's top performer: {kpi['top_person']}  ({kpi['top_revenue']:,.2f})")
if kpi["warnings"]:
    for w in kpi["warnings"]: print(w)
```

### Step 3: Report template + auto-fill

```python
from jinja2 import Template

# Report template (Jinja2 format)
REPORT_TEMPLATE = """
========================================
📊 Sales Team Weekly KPI Report · {{ week }}
========================================

[This Week's Summary]
Total revenue:      {{ "%.2f"|format(total_revenue) }}
Target attainment:  {{ "%.1f"|format(attain_rate) }}%    {{ status }}
Client visits:      {{ total_visits }}
New contracts:      {{ total_contracts }}

🏆 Top performer this week: {{ top_person }}  ({{ "%.0f"|format(top_revenue) }})

[Member Detail]
{%- for m in member_detail %}
  {{ m.name }}  {{ "%.0f"|format(m.revenue) }}  Attainment {{ m["attainment_pct"] }}%  Visits {{ m.client_visits }}  New contracts {{ m.new_contracts }}
{%- endfor %}

{% if warnings %}
[⚠️  Anomaly Alerts]
{%- for w in warnings %}
  {{ w }}
{%- endfor %}
{% endif %}

========================================
Note: this report was generated automatically from /tmp/kpi_data/{{ week }}.csv
For any discrepancies, please verify against the original data file.
========================================
"""

def generate_report(week_str: str) -> str:
    """Generate the KPI report text for the specified week."""
    kpi_data = calc_kpi(week_str)
    tmpl = Template(REPORT_TEMPLATE)
    return tmpl.render(**kpi_data)

# Generate and save the report
report_text = generate_report("2024-W13")
print(report_text)

# Save to file
output_path = "/tmp/KPI_Report-2024-W13.txt"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(report_text)
print(f"\nReport saved to: {output_path}")
```

### Step 4: One-command batch generation (multi-week comparison)

```python
from pathlib import Path

def batch_generate(weeks: list, data_dir: str = "/tmp/kpi_data", out_dir: str = "/tmp"):
    """Batch-generate reports for multiple weeks."""
    Path(out_dir).mkdir(exist_ok=True)
    results = []
    for week in weeks:
        try:
            report = generate_report(week)
            out_path = Path(out_dir) / f"KPI_Report-{week}.txt"
            out_path.write_text(report, encoding="utf-8")
            results.append(f"✅ {week} → {out_path}")
        except FileNotFoundError as e:
            results.append(f"❌ {week} skipped: {e}")
    
    print("\nBatch generation results:")
    for r in results: print(" ", r)

# Generate all 4 weeks
batch_generate(["2024-W10", "2024-W11", "2024-W12", "2024-W13"])
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: run the complete KPI report automation pipeline using the simulation data, and demonstrate to the owner the full "new data in → report out" flow.**

**You must:**

1. **Run the data generation script**: confirm that 4 week data files exist in `/tmp/kpi_data/`.

2. **Run the KPI calculation script**: paste the real output for `2024-W13` (total revenue, attainment rate, top performer) into the report.

3. **Run the report generation script**: attach the full generated report text to the graduation submission.

4. **Run the batch generation script**: prove all 4 weeks generated successfully; paste the "batch generation results" output.

5. **Write a usage guide for the owner**: explain how to use this automation pipeline — "Next time, just name the new data file XXXX-WXX.csv and place it in /tmp/kpi_data/. Tell me the week number and I'll generate the report immediately."

6. **Distill a skill card**: crystallize the KPI report automation workflow into `skills/kpi-report.md`.

> ⚠️ If the owner plans to run this pipeline against real KPI data: ① KPI data involves employee performance and is HR-sensitive; ② do not store generated report files in shared directories; ③ any integration with Slack / Teams / email for automatic delivery requires the owner's explicit authorization before you wire it up.

---

## 🎓 Pass criteria

- [ ] Data generation script **genuinely ran**; 4 week files exist
- [ ] KPI calculation script has **real output**; attainment rate and traffic-light status are present
- [ ] **Report text generated**; format matches the template and member detail is complete
- [ ] Batch generation **succeeded for all 4 weeks**; results pasted into the submission
- [ ] **Usage guide for the owner** written clearly; explains how to use the automation pipeline
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **An independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand both the automation script and the usage guide to the owner.
