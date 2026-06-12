> 🌐 English ｜ [中文](../../professions/Z22-growth-experiment.md)

# Lesson Z22 · Growth Experiments: A/B Test Design

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07; Z20-User Research (recommended) ｜ Difficulty: ★★★ ｜ Source: Two-proportion z-test / sample size estimation methodology; statsmodels documentation [statsmodels.org](https://www.statsmodels.org/); Evan Miller sample size calculator [evanmiller.org/ab-testing](https://www.evanmiller.org/ab-testing/sample-size.html); general A/B testing principles

---

## 📖 What you'll learn

After this lesson, you will help the owner design a complete **A/B test plan** — from "I have an idea" to "I can prove with data whether this idea actually works." You'll guide that entire middle journey.

First, let's talk about why we A/B test instead of just "change it and see."

Suppose your app has a green "Buy Now" button. Someone says: "Would changing it to red increase click-through?" You think, "maybe?"

If you just swap the button to red and click-through goes up — how do you know it was the color? What if you also just happened to run a promotion that week?

A/B testing solves exactly this: simultaneously show half your users the green button (control group) and the other half the red button (treatment group), at the same time under the same conditions — that's **controlling the variable**. Only then can you say "the red button caused higher click-through."

Think of yourself as a chef testing a new recipe. The scientific approach: randomly split tonight's 100 tables into two groups — 50 get the old recipe, 50 get the new one — then see which group has more returning customers. That's an A/B test.

Your job: turn "an idea" into a runnable experiment plan — hypothesis written precisely, sample size calculated correctly, anti-contamination measures thought through, results analyzed without errors.

> ⚠️ This lesson produces plans only. Do not operate any experiment platform account or modify any production code on the owner's behalf.

---

## 🧠 Core principles (internalize these as habits)

**1. Test only one variable per experiment**

The most common reason experiments fail: three things changed at once, and you have no idea which one worked.

Rule: between the control group and treatment group, **only one thing can be different**.

**2. Define "what success looks like" before you start**

Before running the experiment, decide: if this hypothesis is correct, which metric will move, and by how much to count as success?

This metric is your "Primary Metric." Lock it in before the experiment begins. You cannot declare success by pointing at a metric that happened to improve after the fact — that's p-hacking.

**3. Sample size must be sufficient, or conclusions are meaningless**

A widely overlooked trap. With insufficient sample size, the "difference" you observe may just be random noise, not a real effect.

Statistics has a term for this: "statistical significance." Your conclusion needs ≥95% confidence (p < 0.05) before you can say "this difference is real."

Running an experiment with too-small a sample, then drawing a conclusion, is roughly equivalent to flipping a coin.

**4. Anti-contamination measures are not optional**

Experiments get polluted. Common contamination sources:
- Users see both versions (leakage): A/B users share page links with each other
- Same user counted multiple times: one person enters on two devices, counted twice
- Bot traffic: non-human traffic mixed into experiment data

**5. Watch out for the multiple-testing trap**

If you run 10 experiments simultaneously, each has a 5% chance of producing a false-positive result — statistically, that's roughly half a "fake success" on average. Control the number of concurrent experiments, and apply multiple-testing corrections.

---

## 🛠 How to do it

### A/B experiment plan standard template

```
[EXPERIMENT PLAN DOCUMENT v1.0]
Project name: ___
Author: ___   Date: ___
Status: Draft / Under review / Running / Completed

═══════════════════════════
I. Background and hypothesis
═══════════════════════════

[BUSINESS CONTEXT]
(2–3 sentences: why are we running this experiment? what problem exists?)
Current [metric name] is ___%, below industry average of ___%. We believe the cause may be ____.

[EXPERIMENT HYPOTHESIS]
Standard format: If we [change X], then [who]'s [what metric] will [change how], because [reason].

Example: "If we change the homepage primary button copy from 'Sign Up' to 'Try Free for 14 Days', then new visitor registration conversion will increase, because emphasizing free trial reduces the decision barrier."

[VARIABLE DEFINITIONS]
- Independent variable (what we're changing): ___
- Dependent variable (what we're measuring): ___
- Controlled variables (what stays the same): ___

═══════════════════════════
II. Metric design
═══════════════════════════

[PRIMARY METRIC]
Metric name: ___
How to calculate: ___
Baseline (current level before experiment): ___
Minimum Detectable Effect (MDE): ___% (the smallest improvement that has business value)

[SECONDARY METRICS]
(2–3, used to detect side-effects of the experiment)
Metric 1: ___   Desired direction: we want it to ___   Baseline: ___
Metric 2: ___   Desired direction: ___   Baseline: ___

[GUARDRAIL METRICS]
(Metrics that absolutely cannot get worse — if they do, stop the experiment immediately)
Guardrail 1: ___   Current value: ___   Maximum acceptable decline: ___% 

═══════════════════════════
III. Experiment design and sample
═══════════════════════════

[GROUP DESIGN]
Control group: Describe what the current version looks like
Treatment group: Describe what we changed

[TRAFFIC ALLOCATION]
Control : Treatment = 50% : 50%
(For multiple treatment groups, allocate equally)

[ASSIGNMENT UNIT]
□ User ID (recommended: same user always sees the same version)
□ Device ID (for logged-out users)
□ Session (not recommended: same user may see both versions)

[SAMPLE SIZE CALCULATION]
Parameters:
- Current conversion rate (baseline): ___%
- Minimum Detectable Effect (MDE): ___%
- Statistical significance level: α = 0.05 (95% confidence)
- Statistical power: 80%

Calculated result (use the script below):
Per-group sample size: ___ people
Both groups combined: ___ people
Current daily traffic: ___ people/day
Estimated experiment duration: ___ days
```

### Sample size calculation script

```python
# Sample size calculation (runs locally — no external platform needed)
from scipy import stats
import math

def calculate_sample_size(
    baseline_rate,    # Current conversion rate, e.g. 0.05 for 5%
    mde,              # Minimum Detectable Effect, e.g. 0.01 for 1 percentage point
    alpha=0.05,       # Significance level, typically 0.05
    power=0.8         # Statistical power, typically 0.8
):
    """Calculate the minimum sample size per group for an A/B test"""
    p1 = baseline_rate
    p2 = baseline_rate + mde

    z_alpha = stats.norm.ppf(1 - alpha/2)  # two-tailed test
    z_beta = stats.norm.ppf(power)

    p_bar = (p1 + p2) / 2
    n = (z_alpha * math.sqrt(2 * p_bar * (1 - p_bar)) +
         z_beta * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2 / (p2 - p1) ** 2

    return math.ceil(n)

# Example: current registration conversion 5%, want to detect a 1-percentage-point improvement (to 6%)
baseline = 0.05
mde = 0.01

n_per_group = calculate_sample_size(baseline, mde)
print(f"Current conversion rate: {baseline*100}%")
print(f"Minimum Detectable Effect (MDE): +{mde*100} percentage points")
print(f"Per-group sample size needed: {n_per_group:,} people")
print(f"Both groups combined: {n_per_group*2:,} people")

# Estimate experiment duration
daily_traffic = 1000  # replace with actual daily traffic
days_needed = math.ceil(n_per_group * 2 / daily_traffic)
print(f"At {daily_traffic} people/day, approximately {days_needed} days needed")

# Experiments should run for complete natural cycles (usually multiples of 7 days) to avoid day-of-week effects
min_days = max(days_needed, 14)
print(f"Recommended experiment duration: at least {min_days} days (minimum sample + full cycle)")
```

### Results analysis script

```python
# A/B test significance analysis (use after experiment concludes)
from scipy import stats
import numpy as np

# Input experiment data (owner exports from experiment platform and provides here)
# Do not process raw data containing user personal information directly
control_conversions = 482    # Control group: conversions
control_total = 10000        # Control group: total sample
treatment_conversions = 531  # Treatment group: conversions
treatment_total = 10000      # Treatment group: total sample

# Calculate conversion rates
p_control = control_conversions / control_total
p_treatment = treatment_conversions / treatment_total
lift = (p_treatment - p_control) / p_control

print(f"Control group conversion rate: {p_control*100:.2f}%")
print(f"Treatment group conversion rate: {p_treatment*100:.2f}%")
print(f"Relative lift: {lift*100:.1f}%")

# Hypothesis test (two-proportion z-test)
from statsmodels.stats.proportion import proportions_ztest

count = np.array([treatment_conversions, control_conversions])
nobs = np.array([treatment_total, control_total])
z_stat, p_value = proportions_ztest(count, nobs)

print(f"\nStatistical test result:")
print(f"Z-statistic: {z_stat:.4f}")
print(f"P-value: {p_value:.4f}")

if p_value < 0.05:
    print(f"✅ Conclusion: difference is statistically significant (p={p_value:.4f} < 0.05)")
    print(f"   Treatment group conversion is {lift*100:.1f}% higher than control, at ≥95% confidence")
else:
    print(f"❌ Conclusion: difference is NOT significant (p={p_value:.4f} ≥ 0.05)")
    print(f"   Current data is insufficient to prove treatment is better; collect more data or re-examine hypothesis")

# 95% confidence interval
from statsmodels.stats.proportion import proportion_confint
ci_low, ci_high = proportion_confint(treatment_conversions, treatment_total, alpha=0.05)
print(f"\nTreatment group conversion 95% confidence interval: [{ci_low*100:.2f}%, {ci_high*100:.2f}%]")
```

### Anti-contamination checklist

```
[PRE-LAUNCH ANTI-CONTAMINATION CHECKS]

□ A/A test passed: before running the real experiment, run an A/A test (both groups get control)
  to verify no significant difference at baseline (significant result in A/A = assignment problem)

□ Assignment unit is correct: user ID, not session — prevents same user seeing both versions

□ Mutually exclusive samples: each user is in only one experiment group; no cross-experiment contamination

□ Bot traffic filtered out: experiment data excludes crawler/bot traffic
  (typically via user-agent filtering, configured by engineering)

□ Leakage prevention: the treatment change cannot "leak" to control users via social sharing, etc.

□ Complete time window: experiment covers full natural cycles (recommended: multiples of 7 days)
  to avoid day-of-week effects (weekend behavior differs significantly from weekdays)

[IN-EXPERIMENT MONITORING]
□ Check guardrail metrics daily: if a guardrail metric deteriorates past threshold, stop immediately
□ Don't peek at results early: stopping when you see a positive trend causes false positives (p-hacking)
□ Verify even traffic split: both groups should receive roughly equal sample volume each day
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete A/B experiment plan for the given scenario, run the sample size calculation and results analysis scripts.**

**Scenario (use this fixed scenario):**
> An online education app. Current course purchase page conversion rate is 3.2%. Approximately 5,000 visitors reach the purchase page daily. The product team wants to test: changing the price display from "$299/year" to "$0.82/day" — will it increase purchase conversion? The minimum business-meaningful improvement is defined as 0.5 percentage points (from 3.2% to 3.7%).

**You must:**

1. **Full experiment plan document:** Write the complete plan using the template above, including: business context, hypothesis, metric design (primary + secondary + guardrail), group design, and sample size calculation results.

2. **Sample size calculation:** Run the script with the given data (baseline=0.032, MDE=0.005, daily traffic=5,000). Report the real output — per-group sample size and estimated experiment duration.

3. **Results analysis drill:** Assume the experiment ran for 28 days. Control group: 140,000 people (5,000 × 28), of which 4,480 purchased (3.2%). Treatment group: 140,000 people, of which 5,460 purchased (3.9%). Run the results analysis script, report the full output and conclusion.

4. **Anti-contamination checklist:** For this specific scenario (price display experiment), analyze all 8 checklist items — explain what each means in this context and how you'd handle it specifically.

5. **One-page summary for the owner:** Write a ≤200-word plain-language explanation of the experiment result — so the owner can understand "what difference does running this experiment make" without knowing what a p-value is.

6. **Skill card:** Distill the A/B experiment design workflow into `skills/growth-experiment.md`.

> ⚠️ **Iron rule: never operate any experiment platform, never modify any production environment configuration.** Scripts run locally. Results are for the owner's reference. All execution is done by the owner or engineering team.

---

## 🎓 Pass criteria

- [ ] Experiment plan **hypothesis follows the standard format**: "If we change X, then Y's Z metric will W, because…"
- [ ] **All three metric types defined**: primary, secondary, and guardrail — with calculation methods
- [ ] **Sample size calculation script actually ran**, with real numerical output
- [ ] **Results analysis script actually ran**, p-value calculated correctly, conclusion states "significant / not significant"
- [ ] Anti-contamination checklist **analyzed for the specific scenario** — not a copy-paste without modification
- [ ] Owner summary **uses plain language** — no p-values, z-statistics, or statistical jargon
- [ ] You **did not operate any experiment platform or production system account** (verifiable)
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand the experiment plan to the owner.
