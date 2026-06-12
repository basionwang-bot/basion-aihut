> 🌐 English ｜ [中文](../../professions/Z33-crm-cleanup.md)

# Lesson Z33 · CRM Data Cleaning & Tagging

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T09-pandas, J14-data-minimization ｜ Difficulty: ★★☆ ｜ Source: pandas official docs [pandas.pydata.org](https://pandas.pydata.org/docs/) · Salesforce Data Quality Guide [help.salesforce.com/s/articleView?id=sf.data_quality.htm](https://help.salesforce.com/s/articleView?id=sf.data_quality.htm) · *Designing Data-Intensive Applications*, Chapter 3

---

## 📖 What you'll learn

After this lesson, you'll be able to take a CRM customer dataset that has grown into a complete mess over time and clean it into a well-structured, deduplicated, properly tagged data set — then hand back an Excel file ready to reimport into the CRM, along with a data quality improvement report.

First, let's talk about why CRM data gets dirty in the first place.

A CRM is filled in by multiple people, at different times, on different phones and computers. One person types "123 Main St, Brooklyn, NY"; another writes "Brooklyn"; a third enters "New York, 123 Main" — all referring to the same address, yet the database ends up with three distinct values. Worse: the same customer gets entered separately by two different sales reps, with slightly different name spellings. Now there are two records in the system, two reps both chasing the same lead, the customer gets contacted twice, and neither rep knows about the other.

This problem is rampant in small and mid-sized businesses using CRMs like Salesforce, Zoho CRM, or HubSpot — because nobody established a consistent data entry standard, and nobody takes ownership of "doing a regular clean-up."

Your job is to be the person who does that regular clean-up.

Think of yourself as a librarian. The library has thousands of books, but because no one has been maintaining it, the titles are a mess — the same novel appears as *Journey to the West*, *Journey to the West (Deluxe Edition)*, and *西游记* on three different shelves. Your task is to unify the titles, pull out the duplicates, and put the right genre label on every book — so that readers and staff can actually find what they're looking for.

**On CRM system accounts (iron rule: never log in, never touch directly):**

- The owner may be using Salesforce, Zoho CRM, HubSpot, or any other CRM platform.
- Your workflow: **the owner exports the data as Excel/CSV and hands it to you; you clean it and hand it back; the owner reimports it.**
- You **never log in to any CRM account**, and you **never touch the database directly**.

> ⚠️ **CRM customer data is a mix of highly sensitive business information and personal privacy.** Before processing anything, confirm with the owner: ① the data was obtained lawfully; ② the purpose is to improve data quality; ③ the processing environment is secure (no uploading to third-party cloud services). Follow the data minimisation principle: only process fields that are genuinely needed for the business goal — do not analyse or retain unrelated private fields.

---

## 🧠 Core principles (internalize these as habits)

**1. Understand what each field means before you touch anything**

Every company's CRM fields are defined differently. Take a "Customer Status" field: one company fills it with "Prospect / Closed / Churned," another uses "A/B/C/D," another uses "In Progress / Signed / Invalid." Before cleaning, ask the owner: "What do these values mean? What's your internal standard?"

**2. Clean, don't delete — and always back up first**

When you hit something questionable during cleaning, **don't just delete the row**. Deleted data is very hard to recover. The right approach is:
- Add a "Cleaning Notes" column and describe what's wrong with that row
- Flag suspected duplicates for the owner to confirm
- Keep both the cleaned version and the original

**3. Tags must have business meaning — don't tag for tagging's sake**

Slapping "Enterprise / Mid-market / SMB" labels on customers is useless — that dimension tells anyone nothing new. Useful tags are tied to specific business actions: "Churned – Winback Candidate" (triggers a re-engagement campaign), "Frequent Inquiries – Never Converted" (flags a pricing objection to follow up), "Closed – No Repeat Purchase in 6 Months" (triggers a repurchase activation flow).

**4. Hard limits on privacy fields**

During cleaning you will regularly encounter: mobile numbers, government ID numbers, home addresses, personal email addresses.

- Mobile numbers and work email addresses: format validation and deduplication are fine; do not display them in the report
- Government ID numbers / home addresses: unless the owner has a clear business need, remind the owner whether there's any reason to keep these in the CRM at all
- All processing must happen in the owner's local environment or a secure environment the owner has explicitly authorised

**5. The report should tell the owner "what was done and how much it improved"**

After cleaning, show a before-and-after comparison: "Before cleaning: 3,200 records. After deduplication: 2,870. After standardisation: field missing rate dropped from 34% to 9%." That is a hundred times more useful than simply saying "data has been cleaned."

---

## 🛠 How to do it

### Step 1: Data quality inspection

```python
import pandas as pd

df = pd.read_excel("crm_export.xlsx")

print("=== CRM Data Quality Report ===")
print(f"总记录数: {len(df)}")
print(f"字段列表: {df.columns.tolist()}")
print("\n各字段缺失率:")
missing = df.isnull().mean().round(3).sort_values(ascending=False)
print(missing[missing > 0])

# 检查常见问题字段
if "手机" in df.columns:
    print(f"\n手机号非空行数: {df['手机'].notna().sum()}")
if "客户名称" in df.columns:
    print(f"\n客户名称重复数(精确匹配): {df['客户名称'].duplicated().sum()}")
```

### Step 2: Field standardisation

```python
import re

def std_phone(val):
    """手机号格式标准化:提取11位数字,加 +86 前缀"""
    if pd.isna(val):
        return None
    digits = re.sub(r'\D', '', str(val))
    if len(digits) == 11 and digits.startswith('1'):
        return digits
    if len(digits) == 13 and digits.startswith('86'):
        return digits[2:]
    return None  # 格式异常,标注待核查

def std_region(val):
    """省份标准化:统一为两字简称"""
    REGION_MAP = {
        "北京市": "北京", "上海市": "上海", "广东省": "广东",
        "浙江省": "浙江", "江苏省": "江苏", "四川省": "四川",
        "Beijing": "北京", "Shanghai": "上海", "Guangdong": "广东",
        # ... 可继续扩展
    }
    if pd.isna(val):
        return None
    val_str = str(val).strip()
    for k, v in REGION_MAP.items():
        if k in val_str or val_str == k:
            return v
    return val_str  # 无法识别的保留原值,标注待核查

def std_industry(val):
    """行业标准化:合并同义词"""
    INDUSTRY_MAP = {
        "互联网": ["互联网", "IT", "软件", "科技", "tech", "internet"],
        "制造业": ["制造", "工厂", "生产", "manufacturing"],
        "金融": ["金融", "银行", "保险", "投资", "finance"],
        "医疗": ["医疗", "医院", "健康", "health", "pharma", "医药"],
    }
    if pd.isna(val):
        return None
    val_lower = str(val).lower()
    for standard, keywords in INDUSTRY_MAP.items():
        if any(k in val_lower for k in keywords):
            return standard
    return str(val)  # 无法识别,保留原值

df["手机_标准"] = df["手机"].apply(std_phone)
df["省份_标准"] = df.get("省份", df.get("地区", pd.Series())).apply(std_region)
df["行业_标准"] = df.get("行业", pd.Series()).apply(std_industry)
```

### Step 3: Deduplication

```python
from rapidfuzz import fuzz, process

# 精确去重:完全相同的客户名
exact_dups = df[df.duplicated(subset=["客户名称"], keep=False)]
print(f"精确重复客户名: {len(exact_dups)} 行")

# 模糊去重:名字相似的候选对
def find_fuzzy_dups(names, threshold=85):
    results = []
    name_list = list(names.dropna().unique())
    for i, name in enumerate(name_list):
        matches = process.extract(name, name_list[i+1:],
                                   scorer=fuzz.token_sort_ratio, limit=2)
        for match_name, score, _ in matches:
            if score >= threshold:
                results.append({"名称A": name, "名称B": match_name, "相似度": score})
    return pd.DataFrame(results)

fuzzy_dup_df = find_fuzzy_dups(df["客户名称"])
print(f"\n疑似模糊重复: {len(fuzzy_dup_df)} 对")
fuzzy_dup_df.to_excel("待确认重复.xlsx", index=False)
print("→ 请主人核查 '待确认重复.xlsx' 后告知哪些需要合并")
```

### Step 4: Tagging

```python
def assign_tag(row):
    """
    根据客户数据打业务标签
    标签是例子,实际标签定义须由主人提供
    """
    tags = []

    # 成交状态
    status = str(row.get("客户状态", "")).strip()
    if "成交" in status or "签约" in status:
        tags.append("已成交")
    elif "流失" in status or "无效" in status:
        tags.append("已流失")
    elif "跟进" in status or "意向" in status:
        tags.append("跟进中")

    # 最近活跃度(如果有最后联系日期字段)
    last_contact = row.get("最后联系日期")
    if pd.notna(last_contact):
        import datetime
        days_ago = (pd.Timestamp.now() - pd.Timestamp(last_contact)).days
        if days_ago > 180:
            tags.append("沉睡客户")
        elif days_ago <= 30:
            tags.append("近期活跃")

    # 规模标签(示例)
    scale = row.get("公司规模人数", 0)
    if isinstance(scale, (int, float)):
        if scale >= 500:
            tags.append("大客户")
        elif scale >= 50:
            tags.append("中客户")
        else:
            tags.append("小客户")

    return "、".join(tags) if tags else "待补充"

df["业务标签"] = df.apply(assign_tag, axis=1)
```

### Step 5: Deliver the cleaning report and clean data set

```
[CRM Data Cleaning Report]
Date processed: YYYY-MM-DD
Processed by: AI agent (initiated by owner)

[Data Overview — Before vs. After]
                         Before     After
Total records:           XXXX       XXXX
Exact duplicate rows:      XX         0  (flagged; awaiting owner confirmation to merge)
Valid mobile number rate:  XX%        XX%
Industry field fill rate:  XX%        XX%
Region field:           Multiple formats  Unified short form

[Main Issues Found]
1. XX exact duplicate customer names — flagged in "Cleaning Notes" column
2. XX suspected fuzzy duplicates — exported to "待确认重复.xlsx" for owner review
3. XX mobile numbers with invalid format (spaces / hyphens / wrong digit count etc.) — flagged
4. Industry field had XX distinct spellings — unified into XX standard categories
5. The following records contain unnecessary sensitive fields [e.g. government ID]: owner is advised to evaluate whether to retain these

[Tag Distribution]
Closed: XX  |  In Progress: XX  |  Churned: XX  |  To Be Filled: XX
Enterprise: XX  |  Mid-market: XX  |  SMB: XX
Dormant (no contact in 180+ days): XX

[Deliverables]
- crm_cleaned.xlsx: cleaned data set, ready to import into CRM
- 待确认重复.xlsx: fuzzy duplicate pairs awaiting owner's merge decision
- crm_original_backup.xlsx: backup of original data (store securely)

[Compliance Statement]
- Data source: CRM export file provided by owner
- Scope of processing: format standardisation, duplicate flagging, tag assignment
- Not uploaded to any third-party platform
- Sensitive field handling: [describe]
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use the simulated CRM data below to walk through the complete cleaning + tagging workflow end to end, and produce a deliverable clean data set and quality report.**

**Simulated data (generate it yourself):**

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)
n = 80

companies = [
    "上海锐达科技有限公司", "上海锐达科技", "北京智云软件",  # 模拟精确重复和模糊重复
    "北京智云软件有限公司", "广州明远制造", "广州明远制造厂",
    "成都天创医疗", "深圳优联网络科技", "杭州西子电商", "武汉鑫诚科技",
]
companies = companies + [f"客户公司{i}" for i in range(n - len(companies))]

df = pd.DataFrame({
    "客户名称": np.random.choice(companies[:10], n),  # 人为制造重复
    "联系人": [f"联系人{i}" for i in range(n)],
    "手机": (
        [f"138{np.random.randint(10000000, 99999999)}" for _ in range(60)] +
        ["13800-138-000", "abc123", "+86 13911112222", None, None,
         "021-12345678", "400-888-9999", "15000000000 ", "17712345678",
         "139 0000 1111", "13x00001111", "13000001111", "14012345678",
         "16000001111", "18000001111", "19912345678", "12345678901",
         "13812345", "138123456789", "1381234567"]
    )[:n],
    "邮箱": [f"user{i}@company{np.random.randint(1,20)}.com" if i % 5 != 0 else None for i in range(n)],
    "行业": np.random.choice(
        ["互联网", "IT", "软件", "制造", "生产", "制造业", "医疗", "health", "金融", "finance"],
        n
    ),
    "省份": np.random.choice(
        ["北京市", "上海市", "广东省", "Beijing", "Shanghai", "Guangdong", "浙江", "江苏省"],
        n
    ),
    "公司规模人数": np.random.choice([10, 50, 100, 200, 500, 1000, None], n),
    "客户状态": np.random.choice(["成交", "跟进中", "流失", "意向", "无效", "签约", None], n),
    "最后联系日期": [
        (datetime.now() - timedelta(days=np.random.randint(0, 400))).strftime("%Y-%m-%d")
        if i % 7 != 0 else None for i in range(n)
    ],
})

df.to_excel("/tmp/crm_export.xlsx", index=False)
print(f"模拟 CRM 数据已生成:{len(df)} 条记录")
```

**You must:**

1. **Run the inspection script** and report real field missing rates and duplicate counts.

2. **Complete field standardisation** for all three fields — mobile numbers, region, and industry — and show a before/after comparison with actual counts.

3. **Find exact duplicates and fuzzy duplicates**, flag them clearly, and export "待确认重复.xlsx".

4. **Assign a business tag to every record** and report the count distribution for each tag.

5. **Produce a complete cleaning report in the delivery format above**, including a compliance statement that reads "Simulated data; no real user privacy involved."

6. **Distill a skill card**: crystallize the CRM cleanup workflow into `skills/crm-cleanup.md`.

> ⚠️ **Iron rule, restated: only process exports provided by the owner. Never log in to any CRM account. Never upload data to a third-party platform. If you encounter unnecessary sensitive fields (e.g. government ID numbers), your first move is to alert the owner — not to process them yourself.**

---

## 🎓 Pass criteria

- [ ] Quality report contains **real output**: missing rates, duplicate counts, and anomaly counts all include actual numbers
- [ ] Field standardisation has a **before/after comparison**: how many mobile numbers, regions, and industry values were cleaned, and how many format anomalies were found
- [ ] Duplicate records are **flagged and annotated** — not automatically deleted (left for the owner to confirm)
- [ ] Business tags have **specific count distributions**, and the meaning of each tag is clearly explained
- [ ] The cleaning report includes a **compliance statement**
- [ ] Throughout, **no CRM account was logged into and no data was uploaded to any third party** (verifiable)
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card, then complete the [graduation report](../../../templates/graduation-report-template.md) and hand the clean data set and report directly to the owner.
