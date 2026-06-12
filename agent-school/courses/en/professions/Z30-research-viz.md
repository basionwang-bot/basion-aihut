> 🌐 English ｜ [中文](../../professions/Z30-research-viz.md)

# Lesson Z30 · Survey Data Visualization

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T09-pandas (recommended), Z26-data-cleaning (suggested) ｜ Difficulty: ★★☆ ｜ Source: pandas official docs [pandas.pydata.org](https://pandas.pydata.org/docs/) · matplotlib official docs [matplotlib.org/stable](https://matplotlib.org/stable/contents.html) · plotly official docs [plotly.com/python](https://plotly.com/python/) · SurveyMonkey help center [help.surveymonkey.com](https://help.surveymonkey.com/)

---

## 📖 What you'll learn

After this lesson, you will take a **survey dataset** the owner collected — the Excel export from SurveyMonkey, Google Forms, Typeform, or any similar platform — and transform it into **a set of charts plus a report with clear conclusions** that the owner can present or publish directly.

Why does this deserve serious attention?

Many people finish collecting survey responses, then hit a wall — they list the counts for every question's options, make a heap of pie charts and bar charts, and say "as shown, 35 respondents chose A and 28 chose B…"

That's not analysis. That's counting.

A real survey report answers three things:
1. **Who are the respondents?** (sample profile — confirms the quality of data collection)
2. **What do they think?** (answer distributions on key questions — find consensus and divergence)
3. **Do different groups differ?** (cross-tabulation: do older respondents answer the same way as younger ones?)

Then translate all three findings into **3–5 conclusions that can guide a decision** — that's the value of a survey.

**On tools (research first, ask before installing):**

- **SurveyMonkey**: widely used survey platform with Excel export of raw response data. [surveymonkey.com](https://www.surveymonkey.com/) — free tier available.
- **Google Forms**: free and widely available; exports to Google Sheets or Excel. [forms.google.com](https://forms.google.com/) — free.
- **Typeform**: polished UX; also exports to Excel/CSV. [typeform.com](https://www.typeform.com/) — free tier available.
- **pandas**: data processing and statistics. Docs: [pandas.pydata.org](https://pandas.pydata.org/docs/) — free.
- **matplotlib / plotly**: chart generation. matplotlib for static exports; plotly for interactive charts.

> ⚠️ Survey data may contain respondents' real names, email addresses, or company names. Before processing, confirm with the owner: has this data been de-identified? When the analysis report and charts are published externally, does individual information need to be anonymized?

---

## 🧠 Core principles (internalize these as habits)

**1. Understand what the question is asking before choosing a chart type**

Single-choice → pie chart or bar chart (shows proportions);
Multiple-choice → grouped bar chart (shows individual option selection rates — **never use a pie chart!**);
Rating question (e.g., 1–5 scale) → mean bar chart + note on standard deviation;
Open-ended (fill-in) → word frequency analysis, or manually group responses then bar chart.

Using the wrong chart type misleads. Applying a pie chart to a multiple-choice question is the most common mistake — the percentages will sum to more than 100%.

**2. Sample quality before conclusions**

You collected 200 responses, but 30 came from the same IP address and 15 were completed in under 10 seconds — if you use those "junk" responses without cleaning them first, your conclusions will be skewed. The report must state upfront: "Valid sample: X (original: X; removed X invalid responses)."

**3. Cross-tabulation is where the interesting findings live**

Looking at just the overall distribution of each question usually yields no surprises — everyone is generally satisfied, everyone thinks pricing is fine. But then you cross-tabulate: "Respondents under 25: 82% satisfied; respondents over 45: 51% satisfied" — that's a finding worth acting on.

**4. Conclusions must connect to decisions**

"60% of respondents find the product difficult to use" — that's a finding.
"Recommend improving the onboarding flow for [specific feature]; this is estimated to reduce drop-off at the [specific point]" — that's a conclusion.

**5. Charts should speak for themselves**

Every chart needs a title, data labels, and the necessary legend. "Read the chart and describe it" is not your job. Your job is to make the chart say it clearly enough that it doesn't need you to explain it.

---

## 🛠 How to do it

### Step 1: Generate simulated survey data (embedded — runs immediately)

```python
import pandas as pd
import numpy as np

np.random.seed(55)
n = 150

# Simulate a product satisfaction survey (similar to SurveyMonkey export format)
df = pd.DataFrame({
    "submission_time":    pd.date_range("2024-03-01", periods=n, freq="2H"),
    "age_group":          np.random.choice(["18-24","25-34","35-44","45+"], n,
                                           p=[0.20, 0.40, 0.25, 0.15]),
    "usage_frequency":    np.random.choice(["Daily","2-3x/week","Weekly","Occasionally"], n,
                                           p=[0.30, 0.35, 0.20, 0.15]),
    "overall_satisfaction": np.random.choice([1,2,3,4,5], n, p=[0.05,0.10,0.20,0.40,0.25]),
    "feature_A":          np.random.choice([0,1], n, p=[0.4,0.6]),  # multi-select: UI design
    "feature_B":          np.random.choice([0,1], n, p=[0.5,0.5]),  # multi-select: smooth operation
    "feature_C":          np.random.choice([0,1], n, p=[0.7,0.3]),  # multi-select: feature-rich
    "feature_D":          np.random.choice([0,1], n, p=[0.6,0.4]),  # multi-select: good value
    "recommend_likelihood": np.random.choice(["Definitely","Likely","Neutral","Unlikely","Never"], n,
                                             p=[0.25,0.35,0.25,0.10,0.05]),
    "top_pain_point":     np.random.choice(["Slow loading","Hard to navigate","Slow support","Too expensive","Other"], n),
})

df.to_csv("/tmp/survey.csv", index=False, encoding="utf-8-sig")
print(f"Simulated survey data ready — {len(df)} responses")
print(df["overall_satisfaction"].value_counts().sort_index())
```

### Step 2: Sample quality check + descriptive statistics

```python
import pandas as pd

df = pd.read_csv("/tmp/survey.csv", encoding="utf-8-sig")

print("=" * 50)
print("📋 Sample Quality Check")
print("=" * 50)
print(f"Original collected: {len(df)} responses")
# In a real project, filter out responses with completion_time < 30s or all identical answers
valid_df = df.copy()  # all valid in this simulation
print(f"Valid sample: {len(valid_df)} responses")

print("\nSample profile (age group distribution):")
age_dist = valid_df["age_group"].value_counts()
for age, cnt in age_dist.items():
    pct = cnt / len(valid_df) * 100
    print(f"  {age}: {cnt} ({pct:.1f}%)")

print("\nOverall satisfaction mean:", round(valid_df["overall_satisfaction"].mean(), 2))
print("Satisfaction score distribution:")
print(valid_df["overall_satisfaction"].value_counts().sort_index())
```

### Step 3: Charts (satisfaction + multiple-choice + cross-tab)

```python
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv("/tmp/survey.csv", encoding="utf-8-sig")

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("Product Satisfaction Survey · Chart Pack", fontsize=14, fontweight="bold")

# Chart 1: Overall satisfaction distribution (bar chart)
ax1 = axes[0, 0]
sat_cnt = df["overall_satisfaction"].value_counts().sort_index()
colors_sat = ["#d01c8b","#f1b6da","#b8b8b8","#92c5de","#2166ac"]
bars = ax1.bar(sat_cnt.index.astype(str), sat_cnt.values, color=colors_sat)
ax1.set_title("Overall Satisfaction (1=Very dissatisfied, 5=Very satisfied)")
ax1.set_xlabel("Score")
ax1.set_ylabel("Responses")
for bar, val in zip(bars, sat_cnt.values):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
             str(val), ha="center", va="bottom", fontsize=10)

# Chart 2: Multiple-choice (most liked features) — selection rates
ax2 = axes[0, 1]
features = {"UI design":       "feature_A",
            "Smooth operation": "feature_B",
            "Feature-rich":     "feature_C",
            "Good value":       "feature_D"}
rates = {k: df[v].mean() * 100 for k, v in features.items()}
ax2.barh(list(rates.keys()), list(rates.values()), color="#2166ac")
ax2.set_title("Most Liked Features (multiple-choice; selection rate %)")
ax2.set_xlabel("Selection rate (%)")
for i, (k, v) in enumerate(rates.items()):
    ax2.text(v + 0.5, i, f"{v:.1f}%", va="center")
ax2.set_xlim(0, 100)

# Chart 3: Top pain points distribution
ax3 = axes[1, 0]
pain_cnt = df["top_pain_point"].value_counts()
ax3.pie(pain_cnt.values, labels=pain_cnt.index, autopct="%1.1f%%",
        colors=["#d01c8b","#f1b6da","#4dac26","#92c5de","#b8b8b8"])
ax3.set_title("Top Pain Points")

# Chart 4: Cross-tab — satisfaction mean by age group
ax4 = axes[1, 1]
age_order = ["18-24","25-34","35-44","45+"]
age_sat = df.groupby("age_group")["overall_satisfaction"].mean().reindex(age_order)
bars4 = ax4.bar(age_sat.index, age_sat.values, color=["#2166ac","#4dac26","#f1a340","#d01c8b"])
ax4.set_title("Avg Satisfaction by Age Group (cross-tabulation)")
ax4.set_ylabel("Mean score (max 5)")
ax4.set_ylim(0, 5.5)
for bar, val in zip(bars4, age_sat.values):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
             f"{val:.2f}", ha="center", va="bottom")

plt.tight_layout()
plt.savefig("/tmp/survey_charts.png", dpi=150, bbox_inches="tight")
print("Charts saved to /tmp/survey_charts.png")
```

### Step 4: Cross-tab text extraction + conclusion generation

```python
import pandas as pd

df = pd.read_csv("/tmp/survey.csv", encoding="utf-8-sig")

# Satisfaction by age group
age_order = ["18-24","25-34","35-44","45+"]
age_sat = df.groupby("age_group")["overall_satisfaction"].mean().reindex(age_order).round(2)

# Recommendation likelihood breakdown
recommend_map = {"Definitely":2,"Likely":1,"Neutral":0,"Unlikely":-1,"Never":-1}
df["recommend_score"] = df["recommend_likelihood"].map(recommend_map)
promoters_pct  = (df["recommend_score"] == 2).mean() * 100
detractors_pct = (df["recommend_score"] < 0).mean() * 100

print(f"Would recommend (Likely + Definitely): {(df['recommend_score'] > 0).mean()*100:.1f}%")
print(f"Would not recommend: {detractors_pct:.1f}%")
print("\nSatisfaction by age group:")
print(age_sat)
max_age = age_sat.idxmax()
min_age = age_sat.idxmin()
print(f"\nHighest satisfaction: {max_age} (mean {age_sat[max_age]})")
print(f"Lowest satisfaction: {min_age} (mean {age_sat[min_age]})")
gap = age_sat[max_age] - age_sat[min_age]
print(f"Gap: {gap:.2f} points {'(significant — worth investigating)' if gap > 0.5 else '(small)'}")
```

### Step 5: Survey report format (owner's copy)

```
[Survey Data Analysis Report]
Survey topic: Product Satisfaction Survey
Data source: SurveyMonkey export / Google Forms export (note actual source)
Valid sample: XXX responses (original collected: XXX; removed X invalid)
Data through: YYYY-MM-DD

[Sample Profile]
Age breakdown: 25–34 is the largest group (X%); sample skews young-to-mid adult
Usage frequency: X% use daily — core user stickiness is healthy

[Key Findings]
1. Overall satisfaction: mean X.XX / 5
   → X% gave 4 or 5 stars (satisfied or very satisfied)
   
2. Most loved feature: UI design (X% selected); followed by smooth operation (X%)
   → Users value "ease of use" over "breadth of features"
   
3. Top pain point: slow loading (X% of responses)
   → Recommend prioritizing load-time optimization for core user flows

4. Recommendation likelihood: X% willing to recommend; X% would not
   → Word-of-mouth potential is (strong / needs improvement)

[⚠️  Notable Group Differences]
Respondents aged 45+ scored satisfaction at X.XX, notably lower than the 25–34 group (X.XX).
→ Gap of X.X points — product may not be well-adapted to older users.
→ Recommendation: increase font sizes; simplify key workflows.

[Conclusions & Recommendations (3 items)]
1. (Finding) → (Recommended action)
2. (Finding) → (Recommended action)
3. (Finding) → (Recommended action)

[Data Limitations]
- Sample source: (note whether distribution channel was limited)
- Potential bias: (e.g., if most respondents came from one channel, representativeness is limited)
- Open-ended questions: (if word frequency analysis was not done, state "open-ended responses not quantified")
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use the simulation survey data above (or real survey data from the owner) to complete the visualization analysis and produce a chart pack + survey report.**

**You must:**

1. **Sample quality check**: write the valid sample count and age distribution statistics into the report.

2. **Generate four charts**: note the real file path of `/tmp/survey_charts.png` in the report, and provide 1 plain-English sentence describing each chart.

3. **Cross-tabulation**: write the comparison of mean satisfaction by age group into the report and state whether the gap is significant.

4. **Write the complete survey report**: fill in every section using the format above; at least 3 conclusions, each backed by a number and a specific recommended action.

5. **Find one counter-intuitive insight**: from the cross-tab or distribution charts, identify one finding you wouldn't have expected — something "the data said that you didn't predict" — and write it into the "Notable Group Differences" section.

6. **Privacy compliance statement**: note data source and handling. (For simulation data: "Simulated data; no real respondent information.")

7. **Distill a skill card**: crystallize the survey visualization analysis workflow into `skills/research-viz.md`.

> ⚠️ If the owner provides real survey data, confirm before processing whether it contains respondents' names, phone numbers, or email addresses; when publishing the analysis report and charts externally, anonymize individual information.

---

## 🎓 Pass criteria

- [ ] Sample quality check complete; valid sample count and age distribution have **real statistics**
- [ ] **Four charts genuinely generated**; each has 1 plain-English sentence of description
- [ ] Multiple-choice question used a **bar chart, not a pie chart** (hold this common-sense line)
- [ ] Report contains **cross-tabulation findings** with a statement on whether the gap is significant
- [ ] At least **3 conclusions**; each backed by a number + specific recommended action
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **An independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand both the chart pack and the survey report to the owner.
