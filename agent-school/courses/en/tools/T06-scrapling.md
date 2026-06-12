> 🌐 English ｜ [中文](../../tools/T06-scrapling.md)

# Lesson T06 · Scrapling — Extracting Data from Public Web Pages

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 + T05 (Playwright) ｜ Difficulty: ★★★ ｜ Source: Scrapling official repository · [github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling) · [PyPI](https://pypi.org/project/scrapling/)

---

## 📖 What you'll learn

After this lesson, you'll be able to use Scrapling to **automatically extract structured data** from a public web page (a leaderboard, product listing, announcement page) — even if the page has been redesigned, added anti-scraping measures, or has JavaScript-rendered content.

Imagine you want to record a website's trending list every day. A regular scraper is like a stubborn delivery driver: **the first time it delivers, it memorizes "3rd floor, second door on the right" — and goes straight to that address every time**. But if the family moves, the driver is lost. Scrapling's killer feature is called **adaptive parsing**: instead of memorizing "which floor, which door," it remembers "the door with a red decoration, a plant out front" — **it recognizes by characteristics, not position, so a redesign doesn't throw it off**.

Even better, Scrapling has built-in ability to bypass anti-bot systems like Cloudflare, parses hundreds of times faster than BeautifulSoup, **and has a built-in MCP server** that can be plugged directly into Claude / Cursor — compressing extracted content before feeding it to the AI, saving tokens.

For a detailed overview of Scrapling in this repository, see: [content/posts/claude-code-90-arsenal.md](../../../../content/posts/claude-code-90-arsenal.md)

**Official resources:**
- GitHub repository: [github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling)
- PyPI page: [pypi.org/project/scrapling/](https://pypi.org/project/scrapling/)
- Chinese README: [github.com/D4Vinci/Scrapling/blob/main/docs/README_CN.md](https://github.com/D4Vinci/Scrapling/blob/main/docs/README_CN.md)

---

## 🧠 Core principles

1. **Determine static vs. dynamic first.** If you can see the data directly in View Source, the lightweight `Fetcher` (HTTP request) is enough. If the source code is just an empty shell and the data is rendered by JavaScript, then use `PlayWrightFetcher` or `StealthyFetcher` (the heavy artillery with a real browser). **Don't use a sledgehammer to crack a nut.**

2. **Adaptive mode is the key switch.** With `adaptive=True`, Scrapling memorizes the "characteristic fingerprint" of elements you've extracted before — so when the site redesigns, it can automatically re-locate the same element. Useful for long-running scheduled scraping tasks; for one-off jobs, you don't need to enable it.

3. **Check robots.txt and the terms of service first.** Before scraping, check the target site's `robots.txt` (just append `/robots.txt` to the URL) for any disallowed rules. Also check the site's terms of service — some sites explicitly prohibit automated access. **Violating robots.txt and terms of service is unethical, and in some jurisdictions illegal.**

4. **Rate limiting is courtesy — and self-preservation.** Scraping too fast puts load on the target server and makes you more likely to be blocked. Scrapling's Spider framework has concurrency control parameters. A polite, normal scraping pace: at least 1 second between requests.

5. **The MCP server is the AI integration bridge.** Scrapling's MCP server automatically denoises and compresses extracted content before handing it to the AI — significantly reducing token consumption for the same data. If you're doing scraping work inside Claude Code, consider connecting via MCP first.

---

## 🛠 How to do it

### Installation

```bash
# Base install (parsing only, no network fetching)
pip install scrapling

# Full install with network fetching (recommended)
pip install "scrapling[fetchers]"

# Install browser drivers (shared with Playwright)
scrapling install

# Version with MCP server
pip install "scrapling[ai]"

# Install everything at once
pip install "scrapling[all]"
```

> **Network note:**
> - `pip install scrapling` works well with a mainland China PyPI mirror (`-i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/`).
> - `scrapling install` downloads browser drivers (Chromium etc.) — downloads from mainland China may be slow; confirm your network environment before running.
> - Scrapling itself doesn't require a VPN. A proxy is only needed if the target website is inaccessible from your location.

### Quick start: extracting from a static page

```python
from scrapling.fetchers import Fetcher

# Simplest usage: HTTP request to get the page, CSS selector to extract
page = Fetcher.get('https://example.com')

# Extract the heading
title = page.css('h1', first=True)
print(title.text)

# Extract all links
links = page.css('a')
for link in links:
    print(link.attrib.get('href'), link.text)

# Extract list items
items = page.css('.item-class')
data = [item.text for item in items]
print(data)
```

### Bypassing anti-bot protection: dynamic pages

```python
from scrapling.fetchers import StealthyFetcher

# Headless mode (no visible window) with anti-bot bypass
page = StealthyFetcher.fetch('https://target-site.com', headless=True)

# Enable adaptive mode (still works after site redesign)
StealthyFetcher.adaptive = True
products = page.css('.product-card', adaptive=True)

for p in products:
    name = p.css('.product-name', first=True)
    price = p.css('.price', first=True)
    print(f"{name.text} — {price.text}")
```

### Saving results as JSON

```python
import json
from scrapling.fetchers import Fetcher

page = Fetcher.get('https://example.com')
items = page.css('.item')

result = []
for item in items:
    result.append({
        'title': item.css('h2', first=True).text if item.css('h2') else '',
        'link': item.css('a', first=True).attrib.get('href', '') if item.css('a') else '',
    })

# Save to file
with open('output/data.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(result)} items, saved to output/data.json")
```

### Connecting the MCP server (Claude Code integration)

```bash
# Install the MCP-enabled version
pip install "scrapling[ai]"

# Add the MCP server configuration to Claude Code's settings.json
# (See the Claude Code docs for the exact path and format)
```

### Common selector reference

| What to locate | CSS selector syntax |
|----------------|---------------------|
| Element with id="title" | `#title` |
| Element with class="item" | `.item` |
| All `<h2>` tags | `h2` |
| `<a>` whose href contains a keyword | `a[href*="keyword"]` |
| First `<li>` | `li:first-child` |
| Nested selection | `div.container h2.title` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete plan for using Scrapling to scrape a public listing page, including a runnable script, data output, and acceptance criteria.**

Target: scrape the title and body content from `https://example.com` (an IANA-maintained public example page with no robots.txt restrictions).

You need to complete:

1. **Check robots.txt:**
   ```bash
   curl https://example.com/robots.txt
   # If it returns 404 or doesn't disallow /, scraping is permitted
   ```

2. **Write a complete, runnable Python script** that:
   - Uses `Fetcher.get()` to fetch the page
   - Uses CSS selectors to extract the `<h1>` heading and `<p>` paragraphs
   - Writes results to `output/result.json`
   - Prints the number of extracted items

3. **Write out acceptance criteria:**
   - `output/result.json` exists and is non-empty
   - The JSON contains at least 1 record with `title` and `body` fields
   - Script exits with code 0

4. **Write out safety notes:**
   - Before switching the target to a real site: check robots.txt and read the terms of service
   - Never scrape pages that require a login (unless it's the owner's own account and they have explicitly authorized it)
   - **Installing (`pip install scrapling`) and actually running the script both require the owner's confirmation first**

5. **Distill a skill card:** crystallize the adaptive parsing concept, the selector cheat sheet, and the safety boundaries into `skills/scrapling.md`.

> ⚠️ **Safety boundary (hold this line):** The graduation test for this lesson is about **producing the plan and writing the script** — not running it on your own. Running `pip install scrapling` and actually executing any scraping script — **both require the owner's explicit confirmation**. Scraping copyright-protected content, pages behind a login, or paths explicitly blocked by robots.txt — **these are non-negotiable: never do them**.

---

## 🎓 Pass criteria

- [ ] You checked the target URL's `robots.txt` and stated the allow/disallow conclusion
- [ ] You wrote a complete Scrapling script (with CSS selectors, JSON output, and error handling)
- [ ] You clearly stated acceptance criteria (specific, verifiable conditions — not "it should be fine")
- [ ] You can explain what "adaptive parsing" means (recognizes elements by characteristics, not position)
- [ ] You understand why Scrapling is faster than BeautifulSoup, and what the MCP integration adds
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to the next lesson.
