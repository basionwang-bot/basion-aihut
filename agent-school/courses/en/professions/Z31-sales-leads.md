> 🌐 English ｜ [中文](../../professions/Z31-sales-leads.md)

# Lesson Z31 · Sales Lead Management

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T09-pandas (recommended) ｜ Difficulty: ★★★ ｜ Source: HubSpot sales lead best practices [blog.hubspot.com/sales/lead-generation](https://blog.hubspot.com/sales/lead-generation) · Apollo.io [apollo.io](https://apollo.io/) · LinkedIn Sales Navigator [linkedin.com/sales](https://www.linkedin.com/sales/) · Clearbit [clearbit.com](https://clearbit.com/) · pandas official docs [pandas.pydata.org](https://pandas.pydata.org/docs/)

---

## 📖 What you'll learn

After this lesson, you will help the owner turn a pile of scattered "potential customer records" — maybe an Excel list, a batch of business card scans from a trade show, a set of notes from a CRM export — into **a qualified, enriched lead list that's ready for the sales team to act on**.

Let me explain what's actually hard about this.

When you receive a batch of "leads," they typically look like this: company names in inconsistent formats ("Acme Corp Ltd" and "Acme Corp" — same company? unclear); contact info incomplete (phone number but no email, or email but no job title); duplicate records everywhere (three people from the same company all in the list — who to call?).

The most painful thing in sales is getting a "list of thousands" that turns out to be 90% waste. The reason is simple: no one did the **enrichment** step — filling in missing information, scoring lead quality, ranking by potential value.

Your job is to do that enrichment. Think of yourself as a detective's research assistant. The owner hands you a suspect list; you need to verify each person's "file": company size, industry, whether their contact info is valid, whether there are any buying intent signals — then sort by likelihood from highest to lowest and hand it back to the owner to decide who to pursue.

**On data sources and platform access (iron rule: real API calls and platform scraping require the owner's explicit confirmation first):**

Two categories of data sources are commonly used for lead enrichment:

- **Public business registries**: SEC EDGAR (US public companies: [sec.gov/cgi-bin/browse-edgar](https://sec.gov/cgi-bin/browse-edgar)), Companies House (UK: [find-and-update.company-information.service.gov.uk](https://find-and-update.company-information.service.gov.uk/)), OpenCorporates ([opencorporates.com](https://opencorporates.com/)) — registration info, legal entity type, filings. Free or limited free access.
- **Sales intelligence platforms** (API access requires a paid account; confirm with the owner before calling): Apollo.io ([apollo.io](https://apollo.io/)), Clearbit ([clearbit.com](https://clearbit.com/)), LinkedIn Sales Navigator ([linkedin.com/sales](https://www.linkedin.com/sales/)). **Any real API calls require the owner's explicit authorization and a verified right to use the data.**
- **The owner's own data**: CRM exports, trade show attendee lists, historical customer records — this is the cleanest and most compliant raw material.

> ⚠️ **Iron rule: LinkedIn, Twitter/X, and other social platforms explicitly prohibit automated scraping. Never use any crawler or scraping tool to collect personal information from these platforms.** If the owner wants this kind of data, they must export it manually or provide it themselves. For third-party enrichment APIs (Apollo, Clearbit, etc.) — confirm with the owner that they have a valid paid account and legal authorization to use the data before making any real API call.

---

## 🧠 Core principles (internalize these as habits)

**1. Lead quality beats lead quantity — define "what a good lead looks like" first**

Before you touch the list, ask the owner: "What kind of customers does your business mainly serve? What does your ideal customer look like?"

A good lead typically scores on several dimensions: industry fit (does what you sell create value for this industry?), size fit (too small to afford it, too large to care about you?), contact seniority (decision-makers first; reaching an intern gets you nowhere), and intent signals (have they actively searched for you or a competitor?).

This is called an **ICP (Ideal Customer Profile)**. Write it down clearly first, then use it to screen leads.

**2. Deduplication before enrichment**

Enrich without deduplicating first, and you're doing the work twice. The hard part of deduplication is fuzzy matching: the company name is spelled differently but it's the same company. Use a string similarity library (e.g., `rapidfuzz`) to flag candidates, then hand the uncertain ones to the owner for confirmation.

**3. Enrichment has a boundary — only add fields "needed for the first outreach"**

Don't stuff in every piece of data you can find. Phone, work email, company website, approximate headcount, industry — enough for a sales rep to make a first call. Founder's home address, personal social media — not needed, and not compliant.

**4. Scoring must explain its logic**

When you give the owner a "priority score," explain it: "This company scores A because — size matches ICP, hiring signals indicate expansion, they previously contacted you." No black-box scoring.

**5. Deliver the list — don't make the calls**

Your output is an "enriched lead list." How to follow up, when to send the first email, what to say — those are decisions for the owner and the sales team, not you.

---

## 🛠 How to do it

### Step 1: Receive raw data and quality check

```python
import pandas as pd

# Read the owner's raw lead file (supports xlsx/csv)
df = pd.read_excel("raw_leads.xlsx")  # or read_csv

print("Total rows:", len(df))
print("Fields:", df.columns.tolist())
print("\nMissing rate per field:")
print(df.isnull().mean().round(2))
print("\nFirst 5 rows:")
print(df.head())
```

**Quality check must state:**
- Total lead count
- Missing rate for each critical field (company name, contact name, phone/email)
- Any obvious format issues (e.g., phone numbers stored as text strings)

### Step 2: Deduplication (fuzzy matching)

```python
from rapidfuzz import fuzz, process

def find_duplicates(names, threshold=85):
    """Find company name pairs with similarity above threshold — for manual confirmation."""
    duplicates = []
    name_list = list(names)
    for i, name in enumerate(name_list):
        matches = process.extract(name, name_list[i+1:], scorer=fuzz.token_sort_ratio, limit=3)
        for match_name, score, _ in matches:
            if score >= threshold:
                duplicates.append({
                    "Name A": name,
                    "Name B": match_name,
                    "Similarity": score
                })
    return pd.DataFrame(duplicates)

dup_df = find_duplicates(df["company_name"].dropna())
print(f"Found {len(dup_df)} suspected duplicate pairs — owner confirmation required before merging")
dup_df.to_csv("pending_duplicates.csv", index=False)
```

> ⚠️ Fuzzy matching only identifies "duplicate candidates" — never auto-merge. Always output a pending-confirmation list for the owner or sales team to judge.

### Step 3: Field normalization and basic enrichment

```python
import re

def clean_phone(phone):
    """Extract digits-only phone number."""
    if pd.isna(phone):
        return None
    digits = re.sub(r'\D', '', str(phone))
    # Accept 10-digit US numbers or 11-digit with country code
    return digits if len(digits) in (10, 11) else None

def clean_email(email):
    """Validate email format."""
    if pd.isna(email):
        return None
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return str(email).strip() if re.match(pattern, str(email).strip()) else None

df["phone_clean"] = df["phone"].apply(clean_phone)
df["email_clean"] = df["email"].apply(clean_email)

# Contact completeness score
df["contact_completeness"] = (df["phone_clean"].notna().astype(int) +
                               df["email_clean"].notna().astype(int))
```

### Step 4: ICP match scoring

Based on the owner's ideal customer profile, score each lead:

```python
# Example ICP: target customers are 50–500 headcount companies in manufacturing/tech/software/healthcare
ICP_INDUSTRIES = ["Manufacturing", "Technology", "Software", "Healthcare", "SaaS"]
ICP_SIZE_MIN = 50
ICP_SIZE_MAX = 500

def icp_score(row):
    score = 0
    # Industry fit
    industry = str(row.get("industry", ""))
    if any(k.lower() in industry.lower() for k in ICP_INDUSTRIES):
        score += 40
    # Size fit (if headcount field is available)
    size = row.get("headcount", 0)
    if isinstance(size, (int, float)) and ICP_SIZE_MIN <= size <= ICP_SIZE_MAX:
        score += 30
    # Contact completeness
    score += row.get("contact_completeness", 0) * 15
    return score

df["icp_score"] = df.apply(icp_score, axis=1)
df["priority"] = pd.cut(df["icp_score"], bins=[0, 30, 60, 100],
                         labels=["C (Low)", "B (Medium)", "A (High)"])
```

### Step 5: Enriched lead list deliverable format

```
[Enriched Lead List]
Generated: YYYY-MM-DD
Raw leads received: XX
Valid leads after dedup: XX
A (priority): XX  /  B (standard): XX  /  C (low priority): XX

[ICP Definition (scoring basis for this run)]
- Target industries: ____
- Target headcount range: ____
- Required contact seniority: ____

[A-Grade Leads (priority outreach)]
Company | Industry | Headcount | Contact | Title | Phone | Email | ICP Score | Score Rationale
--------|----------|-----------|---------|-------|-------|-------|-----------|----------------
Acme Corp | Manufacturing | 200 | Jane Smith | VP Procurement | +1-555-xxxx | j@acme.com | 85 | Industry + size + full contact

[Data Quality Notes]
- Valid phone rate: X%
- Valid email rate: X%
- Missing industry field: XX leads (cannot participate in ICP scoring)
- Suspected duplicate pairs: X (pending-confirmation file exported; owner judgment required)

[Compliance Statement]
- Data source: ____
- Authorization to process confirmed: ____
- Sensitive field handling: this list does not include personal ID numbers, home addresses, or other non-essential private information
```

## 🧰 Companion open-source projects (optional)

> Great open-source projects can save you real work on this course. **Ask the owner before connecting to real databases, customer data, or accounts.** Prefer read-only access, anonymize first, delete when done. Star counts are approximate — verify before installing.

- **Twenty** ([github.com/twentyhq/twenty](https://github.com/twentyhq/twenty), ~45k ⭐) — A modern AI-era open-source CRM with a clean interface that supports self-hosting, ideal for storing and managing enriched lead data. **How to use:** Import the enriched lead list produced in this course into Twenty, assign leads by priority to sales reps, and track follow-up status and next-contact dates. Self-deployable so data stays on your own server.

- **Mautic** ([github.com/mautic/mautic](https://github.com/mautic/mautic), ~7k ⭐) — An open-source marketing automation platform with lead scoring, behavioral tracking, and automated nurture workflows. **How to use:** Set up scoring rules (viewed pricing page +10 pts, opened email +5 pts) so high-scoring leads automatically surface to sales for priority follow-up. Requires self-hosting.

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use the simulated lead data below to walk through the complete lead enrichment flow and produce an enriched list ready for the sales team.**

**Simulation data (generate it yourself as a stand-in for real data):**

```python
import pandas as pd
import numpy as np

np.random.seed(42)

mock_leads = pd.DataFrame({
    "company_name": [
        "Apex Solutions Inc", "Apex Solutions", "Blue Ridge Software", "Blue Ridge Software LLC",
        "Summit Manufacturing", "Cedar Valley Medical", "Horizon Digital", "Lakeside Commerce",
        "Ironworks Tech", "Northgate Analytics LLC", "Westfield Trading", "Precision Engineering Co"
    ],
    "contact_name": ["James Wu", "Linda Park", "Tom Lane", "Sarah Kim", "Dan Ford", "Lisa Yang",
                     "Amy Zhou", "Mark Chen", "Nina Patel", "Eric Zhao", "Paul Grant", "Xu Min"],
    "title": ["VP Procurement", "Receptionist", "CTO", "Sales Manager", "Plant Director",
              "Director of Operations", "Head of Marketing", "CEO", "IT Manager",
              "Procurement Manager", "Admin", "Technical Director"],
    "phone": ["2025550101", "abc", "5550001111", "5550001111", "5550112222",
              "5550223333", None, "5550334444", "8880445555", "7070556666",
              "5550667777", "8090778888"],
    "email": ["james@apexsolutions.com", None, "tom@blueridgesw.com", "sarah@blueridgesw.com",
              "dan@summitmfg.com", "lisa@cedarvalley.com", "amy@horizondigital.com",
              "mark@lakesidecommerce.com", None, "eric@northgateanalytics.com",
              "invalid-email", "xu@precisioneng.com"],
    "industry": ["Technology", "Technology", "Software", "Software", "Manufacturing",
                 "Healthcare", "Digital Marketing", "E-commerce", "Technology",
                 "Technology", "Trading", "Manufacturing"],
    "headcount": [120, 120, 350, 350, 800, 60, 200, 15, 90, 280, 30, 450]
})

mock_leads.to_excel("/tmp/raw_leads.xlsx", index=False)
print("Simulation data ready:", len(mock_leads), "leads")
```

**You must:**

1. **Run the quality check script** and write out the real output.

2. **Identify suspected duplicate pairs**, list them, and state whether to merge — and the reasoning. (The simulation data contains several obvious pairs.)

3. **Clean the phone and email fields**; flag which ones have invalid formats.

4. **Score and rank using the example ICP (50–500 headcount; Manufacturing / Technology / Software / Healthcare)**, producing A / B / C tiers.

5. **Produce the complete enriched list** in the deliverable format above, including a compliance statement (write: "Simulated data; no real user privacy involved").

6. **Distill a skill card**: crystallize the lead enrichment workflow into `skills/sales-leads.md`.

> ⚠️ **Iron rule repeated: this lesson processes only data provided by the owner or simulation data. Do not independently call any external platform API to pull real company or personal information. If the owner has not explicitly authorized it, do not touch any real personal data. Privacy minimization: retain only the fields needed for follow-up.**

---

## 🎓 Pass criteria

- [ ] Quality report has **real output**; missing rates and data quality conclusion are present
- [ ] Deduplication **found the suspected pairs**; a judgment on whether to merge (with reasoning) is given — no auto-merging
- [ ] Phone / email fields **have been cleaned**; invalid formats are flagged
- [ ] ICP scoring has **clear rationale**; A / B / C counts are all stated
- [ ] Enriched list **includes a compliance statement**; no non-essential sensitive fields
- [ ] Throughout, **no real external API was called and no real personal information was scraped** (verifiable)
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **An independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand the enriched lead list to the owner.
