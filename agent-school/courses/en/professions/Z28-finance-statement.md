> 🌐 English ｜ [中文](../../professions/Z28-finance-statement.md)

# Lesson Z28 · Financial Transaction Reconciliation

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T09-pandas (recommended), Z26-data-cleaning (suggested) ｜ Difficulty: ★★★ ｜ Source: pandas official docs [pandas.pydata.org](https://pandas.pydata.org/docs/) · IFRS Standards [ifrs.org](https://www.ifrs.org/)

---

## 📖 What you'll learn

After this lesson, you will take the owner's **raw bank transaction records** — hundreds or thousands of lines reading "payment received", "wire transfer", "bank fee", "payroll", "rent…" — and organize them into a **clearly categorized income-and-expense statement**, then attach a plain-English financial summary so the owner can understand exactly where their money went, whether the income profile is healthy, and whether there are any warning signals — without needing to know a single accounting term.

Here's a scene you can relate to.

The manager asks finance to summarize "last quarter's expenditures." Finance opens the bank-export Excel — 1,800 rows, with descriptions like "Online Payment #7783", "Quick Pay #1001", "Payroll Transfer 05/23"… each row has to be manually classified. Two days later.

The final report: "Total outflows: $450K, of which payroll $180K, rent $30K, advertising $80K, other $160K."

Then the manager asks: "'Other $160K' — what is that?" Finance says: "Not broken down."

**Your job is to make "other" disappear as a catch-all.** Map every transaction to the category it belongs in, then produce a clean categorized statement plus a plain-English narrative so the owner sees the full money picture at a glance.

**On tools (research first, ask before installing):**

- **pandas**: the workhorse for transaction classification, aggregation, and pivot tables. Docs: [pandas.pydata.org](https://pandas.pydata.org/docs/) — completely free.
- **openpyxl**: exports statements to Excel format for easy sharing. `pip install openpyxl` — free and open-source. Ask the owner before installing.

> ⚠️ **Financial transaction data is extremely sensitive.** It contains account balances, salary figures, supplier payments, and personal spending records — any leak can cause commercial or personal harm. Before processing, confirm with the owner: ① data runs locally only, ② full account numbers and other unnecessary details are redacted in advance, ③ the analysis report is shared only with those authorized to view it. This lesson never logs into any banking system, exports any transactions, or operates any financial account on the owner's behalf.

---

## 🧠 Core principles (internalize these as habits)

**1. Categorization is the core work — automation is an aid**

The hardest part of reconciliation isn't summing numbers; it's "is this $5,000 an advertising spend or a software purchase?" Keyword matching automates roughly 80%, but the remaining 20% that's ambiguous must be confirmed with the owner — **ask more, never guess categories**.

**2. Always analyze income and expenses separately**

Many people default to looking only at "net balance." That's risky. A positive net balance doesn't mean income structure is healthy — it may be because R&D spending was cut. Always analyze "where income came from" and "where money went" as two distinct questions.

**3. Recurring vs. one-time — label them clearly**

"This month's outflows: $800K" isn't enough. You also need: "Of which recurring costs (payroll / rent / fixed contracts) = $600K, one-time costs (equipment purchase) = $200K." Next-month projections can only rely on recurring costs; one-time items won't repeat.

**4. Write the financial summary in plain English — don't pile on accounting jargon**

The owner is not an accountant and doesn't need to hear "debit/credit direction," "account codes," or "amortization." Write: "This month: income $500K, outflows $450K, net $50K. Main expenditures were payroll ($180K) and advertising ($80K)." That's a useful financial summary.

**5. Note the data limitations**

Bank transactions are not a complete financial record — cash transactions don't appear in bank statements, and payment-app transactions (PayPal, Stripe, Venmo) need separate exports. The report must state: "This report covers [Bank name] account transactions only; PayPal / Stripe transactions and cash transactions are not included."

---

## 🛠 How to do it

### Step 1: Generate simulated transaction data (embedded — runs immediately)

```python
import pandas as pd
import numpy as np

np.random.seed(88)
n = 200

# Simulated transaction descriptions (modeled on real bank statement descriptions)
expense_items = [
    ("Payroll transfer",         "Payroll",        -15000),
    ("Social security payment",  "Payroll",         -3200),
    ("Rent payment",             "Operations",      -8000),
    ("Office supply purchase",   "Office supplies",  -500),
    ("Google Ads",               "Marketing",       -2000),
    ("Meta Ads top-up",          "Marketing",       -3000),
    ("AWS services",             "Tech costs",      -1200),
    ("Electricity bill",         "Operations",       -600),
    ("Travel reimbursement",     "Travel",          -1500),
    ("Business entertainment",   "Entertainment",    -800),
    ("Courier fees",             "Logistics",        -300),
    ("Online payment",           "Unclassified",    -1000),  # ambiguous
    ("Quick payment",            "Unclassified",     -500),  # ambiguous
]
income_items = [
    ("Customer payment",        "Core revenue",  20000),
    ("Service fee received",    "Core revenue",   8000),
    ("Interest income",         "Other income",    150),
    ("Refund received",         "Other income",    300),
]

records = []
for _ in range(n):
    if np.random.random() < 0.7:
        item = expense_items[np.random.randint(len(expense_items))]
    else:
        item = income_items[np.random.randint(len(income_items))]
    records.append({
        "date":        pd.Timestamp("2024-01-01") + pd.Timedelta(days=np.random.randint(0, 90)),
        "description": item[0] + f" {'%04d' % np.random.randint(9999)}",
        "amount":      round(item[2] * (0.8 + np.random.random() * 0.4), 2),
        "counterparty": f"Account{np.random.randint(1000, 9999)}",
    })

df = pd.DataFrame(records).sort_values("date").reset_index(drop=True)
df.to_csv("/tmp/bank_flow.csv", index=False, encoding="utf-8-sig")
print(f"Simulated transactions ready — {len(df)} rows, covering 2024-01 ~ 2024-03")
```

### Step 2: Keyword-based auto-classification

```python
import pandas as pd

df = pd.read_csv("/tmp/bank_flow.csv", encoding="utf-8-sig")
df["date"] = pd.to_datetime(df["date"])

# Classification rules (keyword → category)
# ⚠️ When using real data, confirm with the owner that this rule table fits the actual business
classify_rules = {
    "Payroll":         ["Payroll", "Social security", "Benefits"],
    "Operations":      ["Rent", "Electricity", "Utilities", "Water"],
    "Marketing":       ["Ads", "Google", "Meta", "LinkedIn", "Campaign"],
    "Tech costs":      ["AWS", "Azure", "GCP", "Hosting", "Domain"],
    "Office supplies": ["Office supply", "Stationery"],
    "Travel":          ["Travel", "Flight", "Hotel", "Rail"],
    "Entertainment":   ["Entertainment", "Dining", "Client event"],
    "Logistics":       ["Courier", "Shipping", "Freight"],
    "Core revenue":    ["Customer payment", "Service fee", "Invoice"],
    "Other income":    ["Interest", "Refund"],
}

def classify(description):
    for cat, keywords in classify_rules.items():
        for kw in keywords:
            if kw.lower() in str(description).lower():
                return cat
    return "Unclassified"

df["category"] = df["description"].apply(classify)
df["flow_type"] = df["amount"].apply(lambda x: "Income" if x > 0 else "Expense")

# Show unclassified items that need manual review
pending = df[df["category"] == "Unclassified"]
print(f"\n⚠️  {len(pending)} transactions require manual classification:")
print(pending[["date", "description", "amount"]].to_string(index=False))
print("\n→ Please tell me how to categorize the above items and I'll update the rules.")
```

### Step 3: Generate categorized summary statement

```python
import pandas as pd

df = pd.read_csv("/tmp/bank_flow.csv", encoding="utf-8-sig")
df["date"] = pd.to_datetime(df["date"])

# (Assume classification is done)
classify_rules = {
    "Payroll":         ["Payroll", "Social security"],
    "Operations":      ["Rent", "Electricity"],
    "Marketing":       ["Ads", "Google", "Meta"],
    "Tech costs":      ["AWS"],
    "Office supplies": ["Office supply"],
    "Travel":          ["Travel"],
    "Entertainment":   ["Entertainment", "Dining"],
    "Logistics":       ["Courier"],
    "Core revenue":    ["Customer payment", "Service fee"],
    "Other income":    ["Interest", "Refund"],
}
def classify(r):
    for cat, kws in classify_rules.items():
        for kw in kws:
            if kw.lower() in str(r).lower(): return cat
    return "Unclassified"

df["category"] = df["description"].apply(classify)
df["month"] = df["date"].dt.to_period("M")

# Monthly × category pivot table
pivot = df.groupby(["month", "category"])["amount"].sum().unstack(fill_value=0)
print("\nMonthly income & expense pivot:")
print(pivot.to_string())

# Overall income/expense summary
total_income  = df[df["amount"] > 0]["amount"].sum()
total_expense = df[df["amount"] < 0]["amount"].sum()
net           = total_income + total_expense

print(f"\n{'='*40}")
print(f"Total income:  {total_income:>12,.2f}")
print(f"Total expenses:{total_expense:>12,.2f}")
print(f"Net balance:   {net:>12,.2f}")
print(f"{'='*40}")

# Expense structure
expense_by_cat = df[df["amount"] < 0].groupby("category")["amount"].sum().abs().sort_values(ascending=False)
print("\nExpense breakdown:")
for cat, amt in expense_by_cat.items():
    pct = amt / abs(total_expense) * 100
    print(f"  {cat:16s}  {amt:>10,.2f}  {pct:5.1f}%")
```

### Step 4: Plain-English financial summary (owner's copy)

```
[Financial Transaction Report]
Data source: [Bank name] Account [last 4 digits]
Reporting period: {Month, Year} ~ {Month, Year}
Note: this report covers only the above account; PayPal / Stripe and cash transactions are not included.

[Income & Expense Overview]
Total income:   $XX,XXX
Total expenses: $XX,XXX
Net balance:    $XX,XXX  ← positive this period; balance is healthy

[Where did income come from?]
Core revenue (customer payments / service fees): $XX,XXX (X% of total income)
Other income: $X,XXX
→ Commentary: (one sentence on whether income structure is healthy — e.g., "Core revenue > 90% of total; income is concentrated and may be vulnerable to a single client loss")

[Where did the money go?]
#1 expense: Payroll — $XX,XXX (X% of total expenses)
#2 expense: Marketing — $XX,XXX (X% of total expenses)
#3 expense: Operations — $XX,XXX (X% of total expenses)
One-time large items: XX (equipment / deposits — will not recur next month)

→ Commentary: (one sentence assessing whether the expense structure is reasonable)

[⚠️  Signals to Watch]
- X unclassified transactions totalling $XX,XXX — owner review required (see attached detail)
- (If any: large transfers with unclear descriptions — list them for owner confirmation)

[Data Limitations]
- PayPal / Stripe transactions not included
- Cash transactions not included
- X transactions had descriptions too brief to classify; flagged as "Unclassified" — recommend reviewing line by line
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use the simulated transaction data above (or real transaction data provided by the owner) to complete classification and reconciliation, and produce a categorized statement + plain-English financial summary.**

**You must:**

1. **Run the classification script**: write the number and total value of "Unclassified" items into the report.

2. **Run the summary script**: paste the real output of the monthly pivot table and expense breakdown into the report.

3. **Write the complete financial summary**: fill in every section using the format above; every module must have substantive content.

4. **Provide 1–2 plain-English interpretations**: is the income structure healthy? Are there any signals in the expenses worth watching?

5. **Privacy compliance statement**: note data source and processing environment. (For simulation data: "Simulated data; no real account information.")

6. **Distill a skill card**: crystallize the financial transaction reconciliation workflow into `skills/finance-statement.md`.

> ⚠️ Iron rule: if the owner provides real bank transaction data, **full account numbers must be redacted beforehand**; counterparty account fields and other private details not required for analysis should be dropped before you proceed. The completed report goes only to those authorized to view it.

---

## 🎓 Pass criteria

- [ ] Categorized summary pivot table is **genuinely calculated**; monthly category breakdown is present
- [ ] "Unclassified" transactions are **listed separately**; count and total amount are present
- [ ] Plain-English financial summary has **substantive content in every section** — not just numbers with no commentary
- [ ] **Recurring costs and one-time costs are clearly distinguished**
- [ ] Report states **data limitations** ("PayPal / Stripe not included")
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **An independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand both the categorized statement and the financial summary to the owner.
