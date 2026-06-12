> 🌐 English ｜ [中文](../../professions/Z35-ticket-handling.md)

# Lesson Z35 · Ticket Triage and Draft Replies

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, Z34-customer-faq (recommended) ｜ Difficulty: ★★☆ ｜ Source: Zendesk ticketing best practices [zendesk.com/blog/ticketing-system](https://www.zendesk.com/blog/what-is-a-ticketing-system/) · Zendesk / Freshdesk ticketing systems documentation · ITIL Service Desk Practice Guide

---

## 📖 What you'll learn

By the end of this lesson you'll be able to take a backlog of customer support tickets and **automatically categorize them, assign priority labels, and draft initial replies** — so instead of handing the support team a pile of undifferentiated "unprocessed" items, you hand them four tidy stacks: Urgent Complaints / Shipping Issues / Feature Questions / Account Issues, each with a draft reply already attached.

First, a quick explanation of what a ticket actually is.

In any company handling a meaningful volume of customer contact, a "ticket" turns each piece of customer feedback into a task card. The customer submits a question, the system auto-generates a card, an agent picks it up and works it, then closes it when done. The beauty of this system is that nothing falls through the cracks, and you get clean data for analysis.

The problem is: once ticket volume grows, triage becomes a mess. "My package hasn't arrived" and "the app keeps crashing" sit in the same queue, and every agent has to fully read and mentally classify each ticket before they can even decide how to handle it. At high volume, just the "read-and-categorize" step can eat hours every day.

Your job is to automate that step: given a batch of ticket text, **quickly determine each ticket's category and urgency, then draft an initial reply** — so the support team receives tickets that are already sorted and annotated with draft responses. They just review, adjust if needed, and send.

Think of yourself as a sorting clerk at a distribution depot. Parcels (tickets) come in, you glance at the delivery address (type of issue), drop each one into the right bin (category), and slap on an "Express / Standard" label (priority) — then the couriers (support agents) pull directly from the bins without having to read every address themselves. You eliminate the repetitive grunt work and free up their expert judgment for what actually needs it.

> ⚠️ **Iron rule: you draft replies, you do not send replies. Every draft must be reviewed and approved by a human support agent before it goes to any customer. You do not log in to any ticketing system account. You do not directly change the status of any ticket.**

---

## 🧠 Core principles (internalize these as habits)

**1. Keep your taxonomy stable — agree on it with your principal before you start**

Don't invent a new classification scheme every time. Before you begin, confirm these points with your principal:
- Does your current ticketing system already have a defined category taxonomy?
- What are the highest-volume categories? (Shipping / Feature issues / Account issues / Refunds / Complaints)
- Are there any industry-specific categories unique to your business?

Once the taxonomy is fixed, stick to it consistently. Consistent categorization is what makes the data valuable over time — for example, "Complaint tickets rose 30% last month; we should investigate why."

**2. Priority must follow rules, not gut feeling**

A missed P0 ticket can turn into a serious incident. Confirm the priority rules with your principal before you start:

```
P0 (Handle immediately, within 1 hour): financial security threat / account compromised / physical safety / media exposure threat
P1 (Handle same day): formal complaint / actively disrupting normal use / customer visibly angry
P2 (Within 24 hours): feature malfunction / shipping delay / refund request
P3 (Within 48 hours): general inquiry / feature suggestion / information request
```

**3. Know the limits of what you should draft**

Draft freely when:
- The issue type is clear and a matching FAQ answer exists (see the Z34 lesson reply library)
- It's a standard acknowledgment or status-update reply ("We've received your ticket and expect to resolve it within X hours")

Hold off on drafting until a human has reviewed when:
- The conversation involves negotiating a specific compensation amount
- The customer's description is unusual and needs a business-system lookup to verify
- The customer is upset and needs a personalized, empathetic response

Skip the draft entirely and flag as "requires human handling" when:
- There is potential legal liability
- A media outlet is involved
- The compensation request exceeds authorized limits

**4. Make your classifications auditable**

Alongside every classification, explain your reasoning: which keyword or which sentence tipped the decision. That way, if an agent spots a wrong classification, they can quickly tell you exactly where to adjust.

**5. Personal data — process the ticket text, don't extract and store sensitive fields**

Tickets commonly contain sensitive information: names, phone numbers, order IDs, addresses.

Your goal is classification and drafting, not data collection. **You should not extract these fields and store them separately.** After processing, the original ticket content should only live in the system your principal has authorized.

---

## 🛠 How to do it

### Ticket classification approach (keyword matching + LLM second-pass)

#### Method 1: Keyword rule classification (fast and controllable)

```python
import pandas as pd
import re

# 分类规则:每个类别对应一组关键词(主人可以修改和扩充)
CATEGORY_RULES = {
    "发货物流": ["快递", "发货", "物流", "配送", "没到", "延迟", "包裹", "运单", "快递单"],
    "退款退货": ["退款", "退货", "退钱", "申请退", "要退", "不想要了", "七天无理由"],
    "功能问题": ["无法", "不能", "报错", "闪退", "崩溃", "打不开", "故障", "登录不上", "卡住"],
    "账号问题": ["密码", "账号", "登录", "忘记密码", "账户", "注册", "无法登录", "验证码"],
    "支付问题": ["支付", "付款", "扣款", "支付失败", "没有到账", "重复扣费"],
    "产品咨询": ["怎么用", "功能", "是否支持", "可以", "有没有", "介绍一下", "什么是"],
    "投诉建议": ["投诉", "差评", "不满意", "要求赔偿", "态度", "服务很差", "12315"],
}

# 优先级规则
PRIORITY_KEYWORDS = {
    "P0": ["账号被盗", "资金被盗", "人身", "媒体", "曝光", "律师"],
    "P1": ["投诉", "不满意", "要求赔偿", "差评", "严重", "无法正常使用"],
    "P2": ["退款", "退货", "发货延迟", "功能异常", "报错"],
    "P3": [],  # 默认
}

def classify_ticket(text):
    """对单条工单文本进行分类"""
    text_lower = str(text).lower()
    
    # 分类
    matched_categories = []
    for category, keywords in CATEGORY_RULES.items():
        if any(kw in text_lower for kw in keywords):
            matched_categories.append(category)
    
    category = matched_categories[0] if matched_categories else "其他/待人工判断"
    
    # 优先级
    priority = "P3"
    for p_level in ["P0", "P1", "P2"]:
        if any(kw in text_lower for kw in PRIORITY_KEYWORDS[p_level]):
            priority = p_level
            break
    
    # 找到匹配的关键词(用于解释依据)
    matched_kw = []
    if matched_categories:
        for kw in CATEGORY_RULES.get(category, []):
            if kw in text_lower:
                matched_kw.append(kw)
    
    return {
        "分类": category,
        "优先级": priority,
        "分类依据": "、".join(matched_kw[:3]) if matched_kw else "无明显关键词",
        "多分类候选": "、".join(matched_categories[1:]) if len(matched_categories) > 1 else "无"
    }

# 批量处理
def process_tickets(df, text_column="工单内容"):
    results = df[text_column].apply(classify_ticket)
    results_df = pd.DataFrame(results.tolist())
    return pd.concat([df, results_df], axis=1)
```

#### Method 2: AI-assisted judgment (for complex tickets)

For tickets where keyword matching fails or the result lands in "Other," use this prompt template to get an AI second opinion:

```
Prompt template (for your principal to use):

You are a customer support ticket classification assistant. Please classify the following ticket using these categories:
- Shipping & Logistics: related to delivery, courier, or shipment status
- Refund & Return: customer wants a refund or to return an item
- Feature / Product Issue: product or software not functioning correctly
- Account Issue: login, password, or account access related
- Payment Issue: payment, charge, or billing related
- Product Inquiry: customer wants to learn about features or how to use the product
- Complaint / Feedback: customer explicitly expresses dissatisfaction or requests compensation
- Other: does not fit any of the above

Also determine the priority:
- P0 (Immediate): financial security threat / account compromised / media exposure threat
- P1 (Same day): formal complaint / actively disrupting normal use / customer visibly upset
- P2 (Within 24 hours): feature malfunction / shipping delay / refund request
- P3 (Within 48 hours): general inquiry

Ticket content: [paste ticket text here]

Please reply in the format: Category=XXX, Priority=PX, Reasoning=XXX (one sentence)
```

### Draft reply templates (by category)

```python
REPLY_TEMPLATES = {
    "发货物流": """您好！感谢您的联系。

关于您反映的发货/物流问题，我已查看您的订单情况。[查询结果]

[如未发货]: 您的订单预计将在[时间]内安排发货，届时会短信通知您。
[如已发货]: 您的包裹物流单号为[单号]，您可以在[平台]查询实时物流。
[如异常]: 我已帮您联系物流方排查，预计[时间]内给您反馈，感谢您的耐心等待。

如有其他问题请随时联系我们！""",

    "退款退货": """您好！感谢您的联系。

关于您的退[款/货]申请，我已收到您的请求。

[符合政策]: 您的申请符合我们的[X天无理由退换]政策，请您[操作步骤]，退款将在[X个工作日]内原路返回，请注意查收。
[需要确认]: 请您提供一下[订单号/购买凭证]，我帮您进一步核实。

感谢您的理解与支持！""",

    "功能问题": """您好！非常抱歉您遇到了这个问题。

关于您反映的[问题描述]，请您先尝试以下步骤：
1. [操作步骤1]
2. [操作步骤2]
3. [操作步骤3]

如果以上步骤不能解决，请将[截图/错误信息]发给我，我为您进一步排查。

感谢您的反馈，您的问题对我们改进产品很有帮助！""",

    "投诉建议": """您好！非常理解您现在的感受，对于给您带来的不便，我们深感抱歉。

您反映的[问题]是我们需要认真对待和改进的地方。我已将您的情况标记为优先处理，[主管姓名/客服主管]将在[时间]内联系您，给您一个满意的答复。

再次诚挚道歉，感谢您给我们改进的机会。""",

    "其他/待人工判断": """[⚠️ 此工单关键词匹配失败,需人工阅读后手动写回复]

工单内容摘要:[请客服人员填写]
建议处理方式:[请客服人员填写]""",
}

def generate_reply_draft(category):
    """根据分类生成回复草稿"""
    template = REPLY_TEMPLATES.get(category, REPLY_TEMPLATES["其他/待人工判断"])
    return f"【草稿回复——发送前请核对修改】\n\n{template}"
```

### Output format (what you deliver to the support team)

```
[Ticket Batch Processing Report]
Processing date: YYYY-MM-DD
Total tickets in this batch: XX

[Priority breakdown]
P0 (Immediate):        X tickets
P1 (Same day):         X tickets
P2 (Within 24 hours):  X tickets
P3 (Within 48 hours):  X tickets

[Category breakdown]
Shipping & Logistics: XX  |  Refund & Return: XX  |  Feature / Product Issue: XX
Account Issue: XX         |  Payment Issue: XX     |  Product Inquiry: XX
Complaint / Feedback: XX  |  Other / Needs review: XX

[Tickets requiring special attention]
Ticket ID | Priority | Summary                          | Notes
----------|----------|----------------------------------|-------------------------------
T001      | P0       | User reports account compromised | Escalate to security team immediately
T015      | P1       | Complaint about agent attitude   | Draft apology attached; needs supervisor review

[Classification confidence notes]
The following X tickets had weak keyword signals and uncertain classifications — please manually verify:
[list of ticket IDs]
```

## 🧰 Companion open-source projects (optional)

> Great open-source projects can save you real work on this course. **Ask the owner before connecting to real databases, customer data, or accounts.** Prefer read-only access, anonymize first, delete when done. Star counts are approximate — verify before installing.

- **Chatwoot** ([github.com/chatwoot/chatwoot](https://github.com/chatwoot/chatwoot), ~29k ⭐) — An omnichannel open-source customer service platform with ticket management, label classification, priority settings, and AI-assisted reply drafting. **How to use:** Configure the ticket classification logic and reply templates from this course inside Chatwoot so AI automatically labels incoming tickets and drafts initial replies for agents to review and send with one click. **⚠️ Safety rule:** Every AI-drafted reply must go through a human-review draft workflow — **ask the owner before connecting a real customer service account.** AI must never send messages directly to customers without human sign-off.

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: complete classification + draft replies for the mock ticket batch below, and produce a full processing report.**

**Mock ticket data:**

```python
mock_tickets = [
    {"工单编号": "T001", "提交时间": "2024-01-15 09:23", "工单内容": "我昨天下的单,快递单号查不到物流信息,都24小时了还没更新,什么情况?"},
    {"工单编号": "T002", "提交时间": "2024-01-15 09:45", "工单内容": "我要退货!产品质量太差了根本不是描述的那样,我要投诉你们!"},
    {"工单编号": "T003", "提交时间": "2024-01-15 10:02", "工单内容": "请问这个产品支持企业批量采购吗?有没有优惠?"},
    {"工单编号": "T004", "提交时间": "2024-01-15 10:15", "工单内容": "我的账号登录不上去,显示密码错误,但是我明明没改过密码,是不是被盗号了?"},
    {"工单编号": "T005", "提交时间": "2024-01-15 10:33", "工单内容": "软件一直闪退,重启了三次还是不行,很影响工作"},
    {"工单编号": "T006", "提交时间": "2024-01-15 11:00", "工单内容": "我申请退款三天了还没到账,钱扣了但是货我也退了,这是什么情况?"},
    {"工单编号": "T007", "提交时间": "2024-01-15 11:20", "工单内容": "你们服务太差了!等了两周快递才到,客服还推诿,我要去12315投诉你们,让媒体曝光"},
    {"工单编号": "T008", "提交时间": "2024-01-15 11:45", "工单内容": "请问发票怎么申请?我需要增值税专用发票"},
    {"工单编号": "T009", "提交时间": "2024-01-15 14:00", "工单内容": "我忘记注册邮箱了,验证码收不到,怎么找回账号?"},
    {"工单编号": "T010", "提交时间": "2024-01-15 14:30", "工单内容": "感谢客服小A的耐心解答,问题已经解决了,希望表扬这位客服"},
]
```

Note: T007 mentions "12315" (the Chinese consumer complaints hotline) and threatens media exposure — this is an automatic P0.

**What you need to do:**

1. **Classify all 10 tickets and assign a priority level**, with a written rationale for each classification decision.

2. **Draft a reply for each ticket**: fill in template placeholders where a template applies; mark as "requires human handling" with a reason where it does not.

3. **Flag tickets needing special attention**: which ones need immediate action? Which classifications are uncertain?

4. **Produce the processing report** in the format shown above, including the full priority breakdown and category breakdown.

5. **Distill a skill card**: document the ticket triage and reply workflow as `skills/ticket-handling.md`.

> ⚠️ **Iron rule — restated: the reply drafts you produce are drafts only. You may not send them to customers on your principal's behalf. You do not log in to any ticketing system. You do not change the status of any ticket. For tickets like T007 that involve threats of media exposure, you must append a note to your draft: "Recommend immediate escalation to a supervisor — do not have a frontline agent reply directly."**

---

## 🎓 Pass criteria

- [ ] All 10 tickets have a **classification and priority judgment**, each with a written rationale
- [ ] Reply drafts are **complete and specific** — not just a single "[requires human handling]" line and nothing more
- [ ] **T007 is correctly marked P0** with an escalation recommendation attached
- [ ] **T010 is handled correctly** (it's a compliment, not a problem to solve — figure out the right approach yourself)
- [ ] The processing report includes **numeric breakdowns by priority and by category**
- [ ] You **never logged in to any ticketing system account and never sent any reply** (verifiable)
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor sign-off received — log it on your progress card, then fill out the [graduation report](../../../templates/graduation-report-template.md) and hand the processing report and draft replies directly to your principal.
