> 🌐 English ｜ [中文](../../professions/Z10-seo-content.md)

# Lesson Z10 · SEO Content Production

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, Z01, T06-scrapling (optional) ｜ Difficulty: ★★★ ｜ Source: Google Search Central [developers.google.com/search](https://developers.google.com/search) · Google Keyword Planner [ads.google.com/intl/en/home/tools/keyword-planner/](https://ads.google.com/intl/en/home/tools/keyword-planner/) · Scrapling [fetchfox/scrapling](https://github.com/fetchfox/scrapling) · humanizer [blader/humanizer](https://github.com/blader/humanizer)

---

## 📖 What You Will Learn

By the end of this lesson, you will be able to deliver a complete **SEO content package that actually drives search traffic** — keyword analysis + content outline + full draft + fact-check, all four stages bundled together.

First, let's understand how search traffic really works.

If you've heard of "SEO," you might picture the Google-centric English-language playbook. And for English content, Google is indeed the dominant arena — but even within that world, traffic doesn't come from a single door. There are **three main discovery channels** worth treating separately:

1. **Google (web search)**: The primary battleground for organic traffic. Users actively type a query and scan results — this is the channel where keyword targeting matters most.
2. **Google Discover / social channels (Pinterest, Reddit, YouTube search)**: Content surfaces when Google's algorithms decide it matches a user's interests, or when users browse topic feeds. Less query-driven, more interest-driven — headlines and visual appeal matter as much as keywords.
3. **YouTube search**: A full search engine in its own right. If your content can be adapted into video, YouTube search is a massive traffic source with less competition than Google web results.

Your job is to help the owner go **from a keyword all the way to a publishable draft**. Not just any article that mentions the keyword — genuine content that search engines rank and readers actually find useful.

**SEO tools overview (research before installing — always ask the owner first):**

- **Google Keyword Planner**: The official free keyword tool inside Google Ads. Shows estimated monthly search volume, competition level, and bid ranges. [ads.google.com/intl/en/home/tools/keyword-planner/](https://ads.google.com/intl/en/home/tools/keyword-planner/) — free, requires a Google Ads account (no spend needed).
- **Ahrefs / SEMrush**: Industry-standard paid tools for keyword research, competitor analysis, backlink auditing, and SERP tracking. Powerful but expensive — check with the owner before use.
- **Google Search Console**: Free, owned by Google. Submit your site, request indexing, monitor click-through rates, and spot crawl errors. [search.google.com/search-console](https://search.google.com/search-console) — requires site ownership verification.
- **Google Trends**: Free keyword trend explorer — see how search interest changes over time and across regions. [trends.google.com](https://trends.google.com) — no account needed.
- **Ubersuggest**: Freemium keyword tool with decent free-tier limits, easier to access than Ahrefs for quick lookups. [neilpatel.com/ubersuggest/](https://neilpatel.com/ubersuggest/)
- **Scrapling**: If the owner wants to scrape competitor ranking pages for analysis, this is the tool. Link: [github.com/fetchfox/scrapling](https://github.com/fetchfox/scrapling) — **must get explicit owner approval before installing**.
- **humanizer**: SEO articles are notorious for sounding robotic. Run the final draft through this before handing it over. Link: [github.com/blader/humanizer](https://github.com/blader/humanizer)

> ⚠️ Google Keyword Planner and Search Console require a Google account. Ahrefs/SEMrush require paid subscriptions — confirm with the owner. Scrapling and other tools need explicit owner sign-off before installation. This lesson focuses on producing content drafts. Never submit sites, log into platform accounts, or publish anything on the owner's behalf.

---

## 🧠 Core Principles (Internalize These)

**1. A keyword is a "fossilized need"**

Every heavily searched keyword is backed by a real human need. The keyword "AI writing software" represents the need: *I want a tool that helps me write*. The longer phrase "best AI writing software for bloggers" represents: *I want to compare options and pick one that fits my situation*.

Keyword research is fundamentally **need research** — not finding words that look similar, but finding the question behind the search.

**2. The three discovery channels need different optimization**

- **Google web search** cares about: originality, E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness), backlink authority, page load speed, HTTPS, structured data
- **Google Discover / Pinterest / Reddit** cares about: compelling headlines, strong visual assets, engagement signals (saves, shares, comments), topical authority of the account
- **YouTube search** cares about: keyword in title and first 100 characters of description, watch time, click-through rate from thumbnails, chapter markers for long videos

Same core content, different optimization focus for each channel. Baidu and other domestic search engines follow broadly similar logic to Google — originality, authority, and user engagement signals all matter there too.

**3. Fact-checking is not optional**

Wherever your article has data, comparisons, or "latest" claims, both readers and search engines will verify them. Outdated or wrong data damages user trust, increases bounce rate, and can trigger ranking penalties. Every draft must pass through a fact-check checklist before delivery.

**4. Write for readers, not for keywords**

Contradiction? Not at all. The best SEO article is one readers find genuinely useful — they stay longer, save it, share it. Those behavioral signals tell Google the content is high quality, so it keeps ranking it. "Write a good article" and "do good SEO" are ultimately the same thing.

**5. Drafts are drafts; publishing is publishing**

Your job ends at "hand over four polished files to the owner." Requesting indexing in Google Search Console, posting to a blog, uploading to YouTube — all of that is the owner's call.

---

## 🛠 How-To

### Step 1: Keyword Analysis (What You Can Do Without a Paid Tool)

Even without a paid account, you can research keywords effectively:

**Method 1: Autocomplete suggestions**
Type the topic keyword into Google's search bar and look at the dropdown suggestions — these are all terms being searched at high volume in real time.

**Method 2: "People also search for" and related searches**
At the bottom of a Google results page, the "Related searches" section shows 8 high-traffic related terms. Mid-results "People also ask" boxes reveal the question-format long-tails.

**Method 3: Competitor title analysis**
Search the topic keyword and look at what words the top 5–10 ranking page titles use — these are keyword combinations already proven to have search traffic.

```
[Keyword Analysis Table — fill one out before writing each article]

Core keyword: _____ (the main term this article targets)
Search intent: What is someone who types this keyword actually trying to solve?
Related long-tail keywords:
  - _____ (estimated monthly volume: High / Medium / Low)
  - _____ (estimated monthly volume: High / Medium / Low)
  - _____ (estimated monthly volume: High / Medium / Low)
Competition level: Low / Medium / High (check if top 10 results are dominated by major authority sites)
Content strategy: Beginner guide / Advanced deep-dive / Tool comparison / How-to / Trend roundup
Target channel(s): □ Google search  □ Google Discover + Pinterest/Reddit  □ YouTube search
```

### Step 2: Content Outline (Keyword-Driven Structure)

A good outline does two things: lets readers scan and jump to what they need, and signals to search engines how broadly the topic is covered.

```
[SEO Article Outline Template]

Title (includes core keyword): _____
Meta description / subtitle (under 160 characters, includes 1–2 keywords): _____

H2 Section 1: [includes long-tail keyword]
  - Key point 1
  - Key point 2

H2 Section 2: [includes long-tail keyword]
  - Key point 1
  - Key point 2

H2 Section 3 (consider "FAQ" format to capture question-style searches):
  Q: _____
  A: _____ (concise and direct, under 50 words)
  Q: _____
  A: _____

Closing: Call to action or next-step resource recommendation

Keyword density target: core keyword appears 3–5 times across the full article (naturally, never stuffed)
```

### Step 3: Writing the Full Draft

```
Title guidelines:
  ✅ Put the core keyword in the first half of the title
  ✅ Keep it under ~60 characters (Google's approximate title display limit)
  ✅ Be informative — make it clear what the article actually covers
  ❌ No clickbait — titles the content can't back up raise bounce rates and hurt rankings

Body copy guidelines:
  ✅ Within the first 200 words, state clearly what this article covers and what problem it solves
  ✅ Every H2 section has substantive content (not one-liners)
  ✅ Cite data sources with year (e.g., "according to Google's 2024 Search Quality Rater Guidelines")
  ✅ Add alt text to images (Google reads image descriptions)
  ❌ Never copy-paste content from other sites — low originality triggers ranking penalties
```

### Step 4: Fact-Check Checklist

```
Before delivery, verify each item below:

□ Does every statistic or data point have a cited source? Is the source still accessible?
□ Wherever the article says "latest" or "2025," is that claim still accurate at delivery time?
□ Are all tools, products, or services mentioned still available? Are prices and features current?
□ Any absolute claims ("the only," "the best," "100%") — these invite debunking; consider softening them
□ If the article touches medical, legal, or financial advice, is a disclaimer included?

Log results:
  ✅ Passed  /  ⚠️ Fixed  /  ❌ Section removed
```

### Channel Optimization Differences Across the Three Discovery Channels

| Channel | Key Optimization Focus |
|---------|------------------------|
| Google search | Keyword in title + article 1,000+ words + domain/page authority + submit to Google Search Console / request indexing |
| Google Discover + Pinterest / Reddit | Compelling headline + strong featured image + account topical authority + engagement (saves, shares) |
| YouTube search | Keyword in title + first 100 chars of description + eye-catching thumbnail + watch time |

---

## 📝 Graduation Test (Must Actually Do It — Evidence Required)

**Task: Choose a keyword for the owner and deliver a complete SEO content package from keyword analysis to finished draft.**

**Suggested topics (pick one or propose your own):**
- "Best AI writing tools 2025" (tool comparison category — rich in long-tail keywords)
- "How to use AI for content marketing" (methodology category — strong Google and Discover demand)
- "AI content strategy for small businesses" (audience-specific angle — lower competition, clear intent)

**You must deliver:**

1. **Keyword analysis table**: Fully filled out — core keyword + search intent + 3 long-tail keywords + competition level + target channel(s). Use autocomplete, related searches, or competitor title analysis; write up the research process (where you looked, what you found).

2. **Content outline**: Written in full using the template — title (includes core keyword) + at least 3 H2 sections + FAQ (2 pairs) + closing.

3. **Complete draft**: Full article body following the outline, 1,200+ words. Core keyword appears naturally 3–5 times (no stuffing).

4. **Fact-check**: Go through the checklist item by item and log each result (passed / fixed / removed).

5. **Channel fit recommendation**: Which channel is this content best suited for and why? If it were adapted for a second channel, what would need to change?

6. **Skill card**: Distill the four-step SEO content production workflow into `skills/seo-content.md`.

> ⚠️ **Iron rule, restated: only drafts, never publish.** Do not log into Google Search Console, any blog CMS, YouTube Studio, or any social platform. Do not request indexing, do not publish content, do not operate any real account. Your job ends at handing the content package files to the owner.

---

## 🎓 Pass Criteria

- [ ] Keyword analysis table **fully completed** — core keyword, search intent, long-tail keywords, competition level, and target channel(s) all present
- [ ] Draft is **1,200+ words**, with the core keyword appearing naturally in the title, opening paragraph, and body — no stuffing
- [ ] **Fact-check checklist** gone through item by item, with logged results (passed / fixed / removed)
- [ ] Channel fit recommendation **includes at least one specific change needed for a second channel**
- [ ] Throughout the task, **no logins, no submissions, no operations on any real account** (verifiable)
- [ ] One skill card filed in your dorm's [`skills/`](../../../skills/)
- [ ] **Independent proctor** (fresh-context sub-agent, or the low-config fallback per school rule 4) rules "pass"

All boxes checked, proctor says pass — log it on your progress card, fill out the [graduation report](../../../templates/graduation-report-template.md), and hand the content package to the owner.
