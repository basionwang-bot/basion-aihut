> 🌐 English ｜ [中文](../../professions/Z20-user-research.md)

# Lesson Z20 · User Research

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07; T09-pandas (optional) ｜ Difficulty: ★★★ ｜ Source: Nielsen Norman Group UX research methods [nngroup.com](https://www.nngroup.com/); NPS methodology (Bain & Company); SurveyMonkey / Typeform best practices; general survey design standards

---

## 📖 What you'll learn

After this lesson, you will help the owner produce three things: **a user survey, an interview guide, and an analysis report** — together a complete "user research kit" that turns "I think my users are like this" into "users told me themselves they're like this."

Here's why user research matters so much.

Many product managers carry an occupational hazard: treating themselves as the user. "I think this feature is useful" — after three months of building, they launch it… and no one uses it.

The truth is: you are not your user.

User research is the work of moving from "I think users are like this" to "users told me themselves they're like this." The difference is enormous.

Think of yourself as a detective. User research is your investigative toolkit — surveys are mass dragnet (you can ask 1,000 people at once), interviews are deep interrogations (one person for an hour, extract every detail), and the analysis report is your case summary. All three tools together turn "gut feeling" into "evidence."

Your job is not to go find users or collect data for the owner — that requires accounts and user access; that's the owner's domain. Your job is: **design the tools, explain how to use them, and once data arrives, help the owner analyze it into conclusions**.

> ⚠️ Data collection involves real user privacy. This lesson's iron rule: you design tools and analysis templates only. You never send surveys, make user calls, or log in to any data platform on the owner's behalf.

---

## 🧠 Core principles (internalize these as habits)

**1. Start by clarifying "what question are we trying to answer"**

The biggest trap in user research: "I want to understand my users" — that's too vague. What specifically? 

Before starting, complete this sentence: "After this research, the one question I most want answered is: ______."

Focus each research effort on 1–2 core questions. Only then can the survey and interview be designed with real precision.

**2. Quantitative + qualitative — you need both**

- **Surveys (quantitative):** Large scale, statistically summarizable, but only answers "how many people feel this way" — not "why do they feel this way."
- **Interviews (qualitative):** Small sample, but lets you dig for reasons and surface unexpected insights.

The two methods are complementary, not substitutes. Good research: use surveys to map the full picture, then interviews to drill into the most interesting cases.

**3. Three survey design traps to avoid**

- **Leading questions:** "Do you agree that our product is easy to use?" → Most people will say yes. That answer is worthless.
- **Too many questions:** Completion rates fall off a cliff past 15 questions. On mobile, people give up after 5 minutes.
- **Overlapping options:** Age ranges like "20–25" and "25–30" — a 25-year-old doesn't know which to pick.

**4. Interviews: ask about behavior, not opinion**

Users' "opinions" are often social desirability — they say what they think they *should* say. But behavior doesn't lie.

Bad question: "Do you find our app easy to use?"
Good question: "The last time you opened our app, what were you trying to do? What happened? Did you hit any friction?"

**5. Privacy is a hard line — compliance is the floor**

When working with real user data:
- Don't collect name or phone number in surveys (unless the owner has explicit business need and a compliant mechanism)
- Analyze aggregate data only; do not identify individuals
- Interview recordings require explicit consent from the participant

---

## 🛠 How to do it

### Survey design template (10–12 question version)

Popular survey tools: **Typeform** ([typeform.com](https://www.typeform.com)) has a clean free tier; **SurveyMonkey** ([surveymonkey.com](https://www.surveymonkey.com)) is widely used in enterprise contexts; **Google Forms** is free and easy to share. Which tool to use is the owner's decision — you design the question content.

```
[SURVEY TITLE]
Format: "[Product/service name] User Experience Survey — Takes about 3 minutes"

[OPENING NOTE]
"Thank you for participating! This survey is completely anonymous. Responses are used only to improve the product and will never be shared with third parties. Takes about 3 minutes."

[PART 1: User profile (3 questions)]
Q1. What best describes your occupation? (Single choice)
   □ Student  □ Employed full-time  □ Freelancer  □ Business owner  □ Other

Q2. On average, how often do you use [product name] per week? (Single choice)
   □ Rarely  □ 1–2 times  □ 3–5 times  □ Almost daily

Q3. How did you first hear about [product name]? (Single choice)
   □ Friend/colleague recommendation  □ Social media (Instagram/TikTok/etc.)
   □ Search engine  □ App store  □ Other

[PART 2: Use scenarios and needs (4 questions)]
Q4. In which situations do you mainly use [product name]? (Multi-select, up to 3)
   □ ___  □ ___  □ ___  □ ___ (fill in based on the actual product)

Q5. Which feature of [product name] do you find most valuable? (Multi-select, up to 3)
   □ ___  □ ___  □ ___  □ Other: ____

Q6. What problems do you most often run into when using [product name]? (Multi-select)
   □ ___  □ ___  □ ___  □ No major problems

Q7. What would you most like [product name] to add or improve? (Open-ended)
   [Text box]

[PART 3: Satisfaction and recommendation (3 questions)]
Q8. Overall, how satisfied are you with [product name]? (1–10, CSAT)
   1  2  3  4  5  6  7  8  9  10
   Very dissatisfied ←————————→ Very satisfied

Q9. How likely are you to recommend [product name] to a friend or colleague? (1–10, NPS)
   1  2  3  4  5  6  7  8  9  10
   Definitely not ←————————→ Absolutely yes

Q10. If you scored low, what is the main reason? (Open-ended, optional)
    [Text box]

[CLOSING]
Thank you! If you're open to a brief follow-up interview (~30 minutes, with a small thank-you gift), please leave your contact info:
□ I'm open to an interview   Contact: ___ (completely optional)
```

### Interview guide template (45–60 minute version)

```
[INTERVIEW BASICS]
Participant ID: USER-XXX (no real name recorded)
Date/time: ___   Format: video call / in-person / phone
Interviewer: ___

[OPENING (5 min)]
- Thank participant, explain the purpose of today's session
- Confirm recording/note-taking consent: "We'd like to take notes to help us analyze later. Are you comfortable being recorded? Recording is for internal use only."
- Clarify there are no right or wrong answers — we want honest, real experiences

[PART 1: User background (10 min)]
1. Can you tell me a bit about what you do day-to-day?
2. What tools or apps do you use to handle [the relevant task/need]?
3. Before using [product name], how did you handle this?

[PART 2: Deep-dive on use scenarios (20 min)]
4. Do you remember the last time you used [product name]? What were you trying to do?
5. Can you walk me through that session — starting from when you opened the app…
   (Follow-ups: "Then what?" / "What were you thinking at that point?" / "What happened next?")
6. Was there anything that surprised you during that session — positive or negative?
7. Was there a moment when you almost gave up or felt frustrated?
8. Has the way you use [product name] changed from when you first started?

[PART 3: Pain points and expectations (15 min)]
9. What is the single most frustrating thing about [product name] right now?
10. If you were the product manager, what would be the first thing you'd fix?
11. Have you ever considered switching to a different product because of a specific problem? What happened?
12. What would your ideal version of this product look like?

[CLOSING (5 min)]
13. Is there anything else you'd like to add that we haven't covered?
- Thank participant, explain any potential follow-up

[POST-INTERVIEW NOTES (fill in after the session)]
Key quotes (verbatim, with timestamps):
___
Pain points uncovered:
___
Unexpected insights:
___
Participant profile tags:
___
```

### Analysis report framework

Once survey data is in, use this framework to generate the analysis report:

```python
# Survey basic analysis script (pandas version)
# Before use, confirm: has the data been anonymized? Any personally identifiable info?
import pandas as pd

df = pd.read_csv("survey_results.csv")  # CSV exported from Typeform / SurveyMonkey / Google Forms

print("=== Basic info ===")
print(f"Valid responses: {len(df)}")
print(f"Completion rate (if total sent is known): ask owner for total sent count")

print("\n=== NPS analysis ===")
nps_col = "Q9"  # adjust to actual column name
promoters = (df[nps_col] >= 9).sum()
detractors = (df[nps_col] <= 6).sum()
nps = (promoters - detractors) / len(df) * 100
print(f"Promoters (9–10): {promoters} people, {promoters/len(df)*100:.1f}%")
print(f"Detractors (1–6): {detractors} people, {detractors/len(df)*100:.1f}%")
print(f"NPS score: {nps:.1f}")

print("\n=== Key single-choice question distribution ===")
for col in ["Q1", "Q2", "Q3"]:  # adjust to actual column names
    print(f"\n{col}:")
    print(df[col].value_counts(normalize=True).mul(100).round(1).astype(str) + "%")
```

**Analysis report structure**

```
[USER RESEARCH REPORT]
Product: ___   Research period: ___   Survey responses: ___   Interviews conducted: ___

[EXECUTIVE SUMMARY] (for anyone who won't read the full report)
Three sentences: what question this research answered / what was found / what is recommended

[USER PROFILE]
Who the main users are: ___ (describe using real data, not assumptions)
Primary use scenarios: ___
User segments (if applicable): ___

[SATISFACTION DATA]
NPS score: ___ (industry benchmarks: >50 = excellent, >30 = good)
CSAT average: ___
Main drivers of low scores: ___ (from open-text responses of low scorers)

[CORE FINDINGS — quantitative]
Finding 1: ___ (with data)
Finding 2: ___
Finding 3: ___

[DEEP INSIGHTS — qualitative, from interviews]
Insight 1: ___ (quote 1–2 verbatim user statements as evidence)
Insight 2: ___

[PRIORITY RECOMMENDATIONS]
Ranked by severity × percentage of affected users:
🔴 High priority: ___ (affects X% of users, directly impacts retention/revenue)
🟡 Medium priority: ___ (affects X% of users, degrades experience)
🟢 Low priority: ___

[RESEARCH LIMITATIONS]
Sample source: ___   Bias risk: ___
Data collection period: ___   Scope of conclusions: ___
```

## 🧰 Companion open-source projects (optional)

> Great open-source projects can save you real work on this course. **Ask the owner before installing, connecting accounts, or going online.** Star counts are approximate at research time — verify before you install.

- **marketingskills (customer-research module)** ([github.com/coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills), ~33k ⭐) — The customer-research Skill in this marketing toolkit covers persona generation, interview guide frameworks, and insight synthesis. **How to use:** Call it during the "interview guide design" stage to generate question frameworks and follow-up prompt candidates, then filter and adjust them using this course's "ask about behavior, not opinions" principle. The survey design and pandas data-analysis workflows in this course still require manual completion — this Skill mainly assists the qualitative portion. ⚠️ **Primarily for English-language user-research scenarios; local tools like SurveyMonkey / Typeform require separate integration; always comply with GDPR or your regional data-privacy regulations when collecting user data.**

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete user research kit for an owner-specified product/service, and run through the analysis workflow using simulated data.**

**If the owner has not specified a scenario:**
Default scenario: A freelance expense-tracking app — goal is to understand "why retention is low."

**You must:**

1. **Design the survey:** Write out a complete 10-question survey tailored to the specific scenario (not a literal copy of the template — adapt every question to the actual product).

2. **Design the interview guide:** Full guide including opening, all three parts, and closing. At least 8 core questions, at least 3 follow-up prompts.

3. **Run simulated data analysis:**
```python
import pandas as pd
import numpy as np

np.random.seed(42)
n = 200
mock = pd.DataFrame({
    "Q1": np.random.choice(["Student","Employed","Freelancer","Business owner"], n, p=[0.2,0.5,0.2,0.1]),
    "Q2": np.random.choice(["Rarely","1-2x","3-5x","Daily"], n, p=[0.15,0.3,0.35,0.2]),
    "Q8": np.random.randint(1,11,n),
    "Q9": np.random.randint(1,11,n),
})
mock.to_csv("/tmp/mock_survey.csv", index=False)
```
Run the script and report the real output, including NPS score and user distribution.

4. **Analysis report:** Write a complete report using the framework above. All data comes from simulated data (label it "simulated data"). Every finding must have numerical support — no conclusions without numbers.

5. **Privacy compliance statement:** At the top of the report, state the data source and how privacy is handled.

6. **Skill card:** Distill the user research three-tool workflow into `skills/user-research.md`.

> ⚠️ **Iron rule: never send surveys, contact users, or log in to any research platform on the owner's behalf.** If the owner provides real user data, confirm it has been anonymized before accepting it for analysis.

---

## 🎓 Pass criteria

- [ ] Survey **has all 10 questions**, covering profile / scenario / satisfaction sections; no leading questions or ambiguous options
- [ ] Interview guide has **8+ core questions**, asking about behavior not opinion
- [ ] Simulated data analysis script **actually ran**, with real output (screenshot or paste the terminal output)
- [ ] Analysis report **has data behind every finding**, includes NPS score, includes priority recommendations
- [ ] Report includes a **research limitations statement** — no overclaiming
- [ ] You **did not send any survey, contact any user, or log in to any platform account** (verifiable)
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand the research kit to the owner.
