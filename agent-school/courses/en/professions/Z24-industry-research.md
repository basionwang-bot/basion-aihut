> 🌐 English ｜ [中文](../../professions/Z24-industry-research.md)

# Lesson Z24 · Industry Research: How to Find Reliable Data

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T04-jq ｜ Difficulty: ★★★ ｜ Source: GitHub Awesome series [github.com/topics/awesome](https://github.com/topics/awesome) · Statista [statista.com](https://www.statista.com/) · SimilarWeb [similarweb.com](https://www.similarweb.com/) · OSS Insight open-source analytics platform [ossinsight.io](https://ossinsight.io/) · World Bank Open Data [data.worldbank.org](https://data.worldbank.org/)

---

## 📖 What you'll learn

After this lesson, you will deliver a **data-backed industry research report** for the owner — one that clearly describes the current state of an industry, identifies trustworthy data sources, and rates each source's credibility. More importantly, you will know **how to find data and how to judge whether data is reliable**.

Let's start with an uncomfortable truth: AI agents are very prone to "fabricating data."

Ask an AI to analyze "the global SaaS market size" and it may confidently say "The global SaaS market reached $XXX billion in 2024, growing XX% year-on-year" — but where did that number come from? Is there an original report? Which institution published it?

If you never ask those questions, you may be handing the owner a number that simply does not exist.

This lesson is about building your "data hygiene" habit — every number that appears in a report must have **a traceable original source**.

Think of yourself as a journalist. Journalists follow one iron rule: no story runs without a source. Numbers are no different — "the market is big" is meaningless. You need the original data, labelled with who measured it, when, and by what method.

Your mission: teach yourself the complete "find data → verify data → use data → cite data" workflow.

---

## 🧠 Core principles (internalize these as habits)

**1. Measured vs. Estimated: you must distinguish these two**

- **Measured data**: has a clear statistical methodology and original source — e.g., government statistics, IPO prospectus disclosures, audited company financials.
- **Estimated data**: calculated by an analyst firm using models and samples, with a margin of error — e.g., Statista market size reports, SimilarWeb traffic estimates.

Every number in your report must be labelled as Measured or Estimated. For Estimated data, note the estimating organization and the date of the estimate.

**2. Never cite second-hand data — trace it to the primary source**

Second-hand: "According to Statista, the global XX market is worth $XX billion."
Primary source: the original Statista report PDF, page X, figure X.

The same number is only verifiable from the primary source. Second-hand data often introduces errors in transcription (numbers misread, taken out of context).

**3. Watch out for "data aging"**

Tech industries move fast; data from two years ago may be completely obsolete. Always note the year when citing. Rule of thumb: prefer data from the past 12 months; data older than 2 years should be cited only for historical trend analysis.

**4. GitHub is a goldmine for tech industry research — but you need to read it right**

For tech, AI, and developer-tool industries, GitHub data is one of the few truly "counted" public data sources:
- Stars = interest signal (with bias: stars can be inflated, but trends are real)
- Forks = actual intent to use
- Issue/PR activity = community health
- Contributor count = ecosystem vitality

OSS Insight ([ossinsight.io](https://ossinsight.io/)) turns GitHub public data into a queryable analytics platform where you can compare project trends directly.

**5. Every report must include a "Limitations" statement**

No research is perfect. Every report must honestly disclose at the end:
- The scope and time window of the data
- Data you were unable to obtain (and why)
- The boundaries within which the conclusions apply

This is not self-deprecation — it protects the owner from being misled.

---

## 🛠 How to do it

### Reliable data source priority list (international context)

```
[Tier 1: Measured — cite directly]

① World Bank Open Data  data.worldbank.org
   — GDP, population, industry output, and macroeconomic data
   — Completely free; authoritative

② Company financials / IPO prospectuses
   — Self-disclosed by companies; audited
   — SEC EDGAR (US public companies): sec.gov/cgi-bin/browse-edgar
   — UK Companies House: companieshouse.gov.uk
   — EU XBRL filings: eba.europa.eu/risk-analysis-and-data

③ Government / official statistical agencies
   — US Bureau of Labor Statistics: bls.gov
   — Eurostat: ec.europa.eu/eurostat
   — OECD: stats.oecd.org

④ GitHub raw data
   — Star / Fork / Contributor / Issue counts (real-time fetch)
   — OSS Insight ossinsight.io for visual queries

[Tier 2: Estimated — note source + date]

⑤ Statista  statista.com
   — Market size, survey data across many industries
   — Some reports free; full access paid
   — Label: "Source: Statista, [report title], [date], estimated data"

⑥ SimilarWeb  similarweb.com
   — Website traffic, app engagement, digital market share
   — Free tier available; deeper data paid
   — Useful for tech and digital industry competitive analysis

⑦ Gartner / IDC
   — Enterprise technology market sizing
   — Usually cited via press releases; original reports are paid

⑧ CB Insights / PitchBook
   — Startup funding, VC trends, private market data
   — Limited free access; primarily paid

[Tier 3: Reference only — note "indicative data" when citing]

⑨ Reddit / Twitter / LinkedIn discussion volume
   — Reflects user attention, not market size
   — Use for qualitative judgment only, not quantitative citation

⑩ Google Trends
   — Search popularity trends, not actual market data
   — Useful for directional signals, not hard numbers

⑪ News articles (TechCrunch / The Information / Bloomberg)
   — Must be traced to the original source before citing
   — Do not cite "According to TechCrunch" — find the underlying data
```

### GitHub industry research guide

```bash
# GitHub API queries (no authentication needed for basic data)
# Example: querying AI coding tool projects

# Method 1: use GitHub's search UI
# At github.com, use filters like:
# topic:llm stars:>1000 language:python
# This finds Python LLM-related projects with more than 1,000 stars

# Method 2: use curl to call the GitHub API (free; 60 requests/hour unauthenticated)
curl "https://api.github.com/search/repositories?q=topic:llm+language:python&sort=stars&order=desc&per_page=10"

# Response JSON key fields:
# items[].full_name         — project name
# items[].stargazers_count  — star count
# items[].forks_count       — fork count
# items[].open_issues_count — open issues
# items[].pushed_at         — last updated

# Method 3: parse results with jq
curl -s "https://api.github.com/search/repositories?q=topic:llm+stars:>5000&sort=stars&per_page=5" | \
jq '.items[] | {name: .full_name, stars: .stargazers_count, forks: .forks_count, updated: .pushed_at}'
```

```python
# Python GitHub data collection script
# Read-only access to public data — no login required
import requests
import json
from datetime import datetime

def search_github_repos(query, max_results=20):
    """
    Query public GitHub repository data.
    Example query: "topic:llm language:python stars:>1000"
    """
    url = "https://api.github.com/search/repositories"
    params = {
        "q": query,
        "sort": "stars",
        "order": "desc",
        "per_page": min(max_results, 30)
    }
    headers = {"Accept": "application/vnd.github.v3+json"}

    response = requests.get(url, params=params, headers=headers)

    if response.status_code == 200:
        data = response.json()
        results = []
        for item in data.get("items", []):
            results.append({
                "name": item["full_name"],
                "description": item.get("description", ""),
                "stars": item["stargazers_count"],
                "forks": item["forks_count"],
                "open_issues": item["open_issues_count"],
                "language": item.get("language", ""),
                "last_updated": item["pushed_at"][:10],
                "url": item["html_url"]
            })
        print(f"Query complete, returned {len(results)} results")
        print(f"Data timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M')} (Measured)")
        return results
    elif response.status_code == 403:
        print("Rate limit hit — unauthenticated requests are limited to 60/hour")
        return []
    else:
        print(f"Request failed: {response.status_code}")
        return []

# Example: query active AI agent projects
repos = search_github_repos("topic:ai-agent stars:>500", max_results=10)
for r in repos:
    print(f"{r['stars']:>6} ★  {r['name']}  ({r['last_updated']})")
```

### Industry research report structure

```
[Industry Research Report: {Industry Name}]
Research date: YYYY-MM-DD
Data as of: YYYY-MM
Author: AI agent draft (owner review required before external use)

━━━━━━━━━━━━━━━━━━━━━━━━
I. Background & Research Objective
━━━━━━━━━━━━━━━━━━━━━━━━
This report aims to answer: [specific question — not just "understand the industry"]

━━━━━━━━━━━━━━━━━━━━━━━━
II. Market Size & Growth
━━━━━━━━━━━━━━━━━━━━━━━━
[Key data table]

| Metric | Value | Data Type | Source | Date |
|--------|-------|-----------|--------|------|
| Global XX market size | $XX bn | Estimated | Statista, [report title] | Q3 2024 |
| Growth rate | XX% | Estimated | Same as above | Same as above |
| Regional comparison | XX | Estimated | Gartner (via press release) | 2024 |

[Chart suggestion: market size trend line chart]

━━━━━━━━━━━━━━━━━━━━━━━━
III. Open-Source Ecosystem (GitHub data, if applicable)
━━━━━━━━━━━━━━━━━━━━━━━━
Source: GitHub API + OSS Insight | Data type: Measured
Data retrieved: [script run timestamp]

[Key project comparison: project name / stars / 90-day star growth / community activity]

Key findings:
- [Finding 1: data-backed]
- [Finding 2: data-backed]

━━━━━━━━━━━━━━━━━━━━━━━━
IV. User Base & Behavior (if data available)
━━━━━━━━━━━━━━━━━━━━━━━━
[Source: SimilarWeb / Statista / official platform reports]

━━━━━━━━━━━━━━━━━━━━━━━━
V. Competitive Landscape
━━━━━━━━━━━━━━━━━━━━━━━━
[Use the competitive analysis framework from lesson Z23]

━━━━━━━━━━━━━━━━━━━━━━━━
VI. Core Judgments & Conclusions
━━━━━━━━━━━━━━━━━━━━━━━━
[Concrete opinions pointing to actionable decisions, backed by data]

━━━━━━━━━━━━━━━━━━━━━━━━
VII. Data Sources & Limitations
━━━━━━━━━━━━━━━━━━━━━━━━

[DATA SOURCES]
[List each source individually: label Measured/Estimated, date, URL or publication name]

[LIMITATIONS]
- The XX data in this report is estimated; margin of error is approximately ±XX%
- The following data was not collected due to no reliable public source: ___
- Conclusions are based on public information as of [date]; the industry evolves quickly — recommend re-checking by [review cycle]
- This report does not constitute investment advice
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: produce a data-backed industry research report on the "AI coding tools" space.**

**You must:**

1. **GitHub data collection**: run the GitHub API query script, search for AI coding-related projects (e.g., query: `"ai coding assistant stars:>1000"`), output real data for at least 10 projects (star count, fork count, last updated date) — paste the actual script output.

2. **Public data citations**: find data related to AI developer tools from at least 2 of these sources: Statista, SimilarWeb, World Bank, or a publicly available Gartner/IDC press release. For each data point, note the source URL, report title, publication date, and label it Measured or Estimated.

3. **Complete industry research report**: write the full report using the template above, including: market size (with source), open-source ecosystem (real GitHub data), competitive landscape (at least 3 companies), and core judgments. Every number in the report has a citation.

4. **Data credibility assessment**: for all data used, produce a "data credibility table" — is each data point Measured or Estimated, what tier is the source (Tier 1/2/3), and any notes on confidence level.

5. **Limitations statement**: honestly disclose which data you were unable to obtain, which estimates you relied on, and the boundaries within which your conclusions apply.

6. **Distill a skill card**: crystallize the industry research data-finding workflow into `skills/industry-research.md`.

> ⚠️ **Iron rule on data hygiene: every number that appears in the report either comes from a real script output or from a traceable public document. Fabricating numbers is not allowed.** If you cannot find data, write exactly that: "No reliable public source found for this data point."

---

## 🎓 Pass criteria

- [ ] GitHub API script **actually ran**; real output data is present (not manually typed numbers)
- [ ] Every cited data point **has a source label**: report name / organization / date / URL
- [ ] Every data point **is labelled Measured or Estimated**
- [ ] **No unsourced numbers** in the report (any unsourced number = fail)
- [ ] **Complete limitations statement** honestly describes the boundaries of the research
- [ ] **Data credibility assessment table** is present
- [ ] Throughout, **only public data interfaces and public reports were used** — no data scraped in violation of terms of service (verifiable)
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **An independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand the industry research report to the owner.
