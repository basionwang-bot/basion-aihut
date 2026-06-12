> 🌐 English ｜ [中文](../../professions/Z41-contract-review.md)

# Lesson Z41 · Contract Review Assistant

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: general contract review principles and commercial practice; jurisdiction-neutral — laws vary by jurisdiction, this is not legal advice, consult a qualified lawyer in your jurisdiction

---

> ## ⚠️ Important Disclaimer (Required Reading)
>
> **All contract review opinions produced in this course are for reference only and do not constitute legal advice.**
>
> Risk clauses flagged by AI are preliminary alerts based on general rules and common practice. They cannot replace the comprehensive judgment of a qualified lawyer who knows the specific case, the specific contract, and the applicable legal context.
>
> **For any contract involving significant interests — large sums, long terms, confidentiality / non-compete / guarantee clauses — please consult a licensed lawyer before signing.**
>
> Your role as AI agent is to help the owner identify suspicious clauses, explain potential risks in plain language, and let the owner arrive at a lawyer with specific, targeted questions — not to replace the lawyer's final judgment.

---

## 📖 What you'll learn

After this lesson, you will produce a **Contract Risk Review Report** — identifying clauses unfavorable to the owner's side, explaining why they carry risk, and proposing revision directions.

Think of yourself as a junior legal assistant at a company. The director hands you a draft contract from the other party: "Check this for traps." You're not a lawyer and can't guarantee "this contract is safe to sign" — but you can go through it carefully, flag every section that looks one-sided, write a clear explanation of why it's problematic, and produce a checklist of "questions to confirm with a lawyer." That way the director walks into the lawyer's office with specific questions rather than signing blind.

Three things in this lesson:
1. **Read and structure**: understand what this contract is, what the main obligations are
2. **Risk-clause scan**: mark unfavorable clauses one by one and explain why
3. **Produce the review report**: assemble it into a document the owner can use in negotiations or bring to a lawyer

> ⚠️ Contract text is highly sensitive commercial information. When handling a contract, **never transmit its content to any third-party API, tool, or web link**. All processing happens in the current conversation; the owner decides how to save the result.

---

## 🧠 Core principles (internalize these as habits)

1. **See the big picture before the fine print.** First understand what type of contract this is (procurement? services? employment? NDA? partnership? licensing?), who the parties are, how long it runs, and what the core transaction is. With that framework, the individual clauses make sense. Without it, you'll get lost in the details.

2. **Read from the perspective of "drafted by the other side."** Most contracts are drafted by the counterparty, who naturally tilts protections toward themselves. Your job is to stand in the owner's shoes and find phrasing that sounds neutral but is actually one-sided.

3. **Focus on three high-risk zones:**
   - **Asymmetric liability**: the counterparty has fewer obligations in equivalent situations
   - **Vague language**: phrases like "reasonable time," "appropriate scope," "mutually agreed" dodge specific commitments — they favor the drafter in disputes
   - **Unilateral rights**: the counterparty can unilaterally terminate / modify / delay, but the owner cannot

4. **Explain *why* it's risky, not just *that* it's risky.** "Clause 8 is a problem" is useless. Useful is: "Clause 8 imposes unlimited joint liability on our side without any cap. In a dispute, we could face damages far beyond our expectations."

5. **Propose revision directions, don't negotiate on the owner's behalf.** You can say "suggest revising this to mirror obligations on both sides, or add a liability cap." But you do not communicate with the counterparty, sign on the owner's behalf, or decide whether to sign.

---

## 🛠 How to do it

### Step 1: Contract overview (fill in this table first)

```
[Contract Basic Information]
Contract name: ____
Contract type: Procurement / Services / Employment / NDA / Partnership / Licensing / Other
Party A (our side): ____   Party B (counterparty): ____
Contract term: ____ to ____
Core transaction (one sentence): ____
Contract value: ____
Dispute resolution: Arbitration / Litigation   Jurisdiction / venue: ____
Governing law: ____

[Summary of Main Obligations]
Our main obligations:
  1.
  2.
Counterparty's main obligations:
  1.
  2.
```

### Step 2: Risk-clause scan — seven checklist areas

Work through these seven areas; record any issue you find:

```
[Area 1: Payment and Settlement]
⬜ Is the payment timeline specific? (Avoid "within a reasonable period after acceptance" and similar vague phrasing)
⬜ Is there a late-payment penalty? Is it symmetric for both sides?
⬜ Are invoicing and tax-documentation requirements clear?

[Area 2: Delivery and Acceptance]
⬜ Is the deliverable / service clearly described? Is there a technical specification annex?
⬜ Is the acceptance standard clear? Who has acceptance authority? What is the acceptance period?
⬜ Is the procedure for failed acceptance defined?

[Area 3: Breach and Liability]
⬜ Are penalty / liquidated-damages clauses proportionate? Many jurisdictions allow courts to reduce
  penalties that are grossly disproportionate to actual loss — flag any clause where penalties seem
  excessive and note "consult lawyer re: enforceability in your jurisdiction."
⬜ Are breach-of-contract liabilities symmetric for both sides?
⬜ Is there a force-majeure definition? Is its scope reasonable?
⬜ Is there an overall liability cap? If absent, flag this as high risk.

[Area 4: Intellectual Property and Confidentiality]
⬜ Is ownership of contract deliverables clearly assigned?
⬜ Is the confidentiality scope too broad? (Watch for "all information related to this contract" with
  no carve-outs)
⬜ Is the confidentiality period reasonable?

[Area 5: Variation and Termination]
⬜ Under what conditions can the contract be terminated unilaterally? Does one side have unilateral
  termination rights that the other lacks?
⬜ Is there a compensation clause for early termination?
⬜ Does contract variation require written consent of both parties?

[Area 6: Dispute Resolution]
⬜ Arbitration or litigation? Is the specified forum / venue convenient for our side?
⬜ Which law governs? Is this appropriate given where both parties operate?
⬜ Are the dispute-resolution clauses symmetric?

[Area 7: Other Special Clauses]
⬜ Is there a non-compete or exclusivity clause? Is its scope reasonable?
⬜ Is there a guarantee or surety clause? Is the mechanism appropriate?
⬜ Is there an auto-renewal clause? Is the opt-out window long enough?
```

### Step 3: Risk-clause record format (one card per clause)

```
[Risk Clause #N]

Location: Clause X / Section X, Article X
Quoted text: "[direct quote from contract]"

Risk type: ☐ Asymmetric liability  ☐ Vague language  ☐ Unilateral right  ☐ Other: ____

Risk explanation:
The problem with this clause is [specific explanation: why it disadvantages our side and what
consequences could follow].

Severity: 🔴 High risk (recommend negotiating revision or consulting a lawyer) /
          🟡 Medium risk (recommend monitoring) /
          🟢 Low risk (acceptable but should be noted)

Suggested revision direction:
Consider revising this clause to [direction], or adding a clause that [supplementary provision].

Note: the above is an AI preliminary analysis. Please consult a qualified lawyer for specific advice.
```

### Step 4: Review report assembly format

```markdown
# Contract Review Opinion (AI Draft)

Contract name: ____   Review date: ____
Reviewer: AI agent (draft)   Final review: Owner / Legal counsel / Lawyer

⚠️ This report is an AI-assisted review draft for reference only. It does not constitute legal
advice. Please consult a licensed lawyer for important matters.

---

## I. Contract Overview
[Insert the basic-information table from Step 1]

## II. Key Risk Clauses (ordered by severity)

### 🔴 High-Risk Clauses
[List each clause using the Step 3 format]

### 🟡 Medium-Risk Clauses
[List each clause]

### 🟢 Low Risk / Items to Note
[List each clause]

## III. Overall Assessment
- Risk count: High risk __ / Medium risk __
- Core recommendations: ____ (2–3 sentences summarizing the most important negotiation points)

## IV. Checklist of Points to Confirm (bring to negotiation or lawyer)
1.
2.
3.
...

---
> This report was generated with AI assistance for the owner's reference only. The decision to
> sign rests with the owner. For any contract of significance, please consult a licensed lawyer
> before signing.
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: review a sample services contract and produce a complete risk review report.**

**Practice contract excerpt (5 clauses, several intentional risk points):**

> **Party A** (Client): Acme Technology Ltd.
> **Party B** (Service Provider): Beta Information Technology Ltd.
>
> **Clause 3 — Payment**: Party A shall pay the service fee to Party B within a reasonable period after acceptance.
>
> **Clause 5 — Deliverables**: Party B shall complete the relevant service work as required by Party A; specific scope is subject to mutual confirmation through communication.
>
> **Clause 7 — Breach**: For each day Party B fails to deliver on time, Party B shall pay liquidated damages equal to 1% of the total contract value, with no cap. For delayed payment by Party A, interest at the prevailing benchmark lending rate published by [the applicable central bank] shall apply.
>
> **Clause 9 — Confidentiality**: Party B shall permanently keep strictly confidential all information related to this contract and Party A's business.
>
> **Clause 11 — Termination**: Party A may unilaterally terminate this contract by giving Party B 7 days' written notice, with no obligation to pay any compensation.

**You must:**

1. Fill in the **Contract Overview table** (Step 1).
2. Run through the **seven checklist areas** for all 5 clauses; identify the risk points (at least 4 obvious risks are embedded in the sample).
3. For each risk, complete a **Risk-Clause Record Card** (Step 3 format), with severity level and revision suggestion.
4. Assemble the **Review Report** (Step 4 format), including overall assessment and checklist.
5. Include the **disclaimer once at the top and once at the bottom** of the report.
6. **Distill a skill card**: write the "Seven-area contract review checklist + report format" to `skills/contract-review.md`.

---

## 🎓 Pass criteria

- [ ] You produced the **Contract Overview table**, clearly describing the main obligations
- [ ] You identified **at least 4 risk points** in the sample contract, each with a clause quote + risk explanation + revision suggestion
- [ ] Each risk has a **severity level** (red / yellow / green)
- [ ] You produced the **assembled Review Report** with overall assessment and lawyer/negotiation checklist
- [ ] The report has **a disclaimer at the top and at the bottom**, explicitly stating that AI opinion does not constitute legal advice
- [ ] At no point did you **transmit any contract content to any third-party interface or network**
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, hand the review report to the owner, and remind them: for any significant contract, please consult a licensed lawyer before signing.
