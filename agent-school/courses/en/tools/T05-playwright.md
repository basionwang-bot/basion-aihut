> 🌐 English ｜ [中文](../../tools/T05-playwright.md)

# Lesson T05 · Playwright Browser Automation

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: Playwright official documentation · microsoft/playwright-python

---

## 📖 What you'll learn

After this lesson, you'll be able to use Playwright to operate a browser just like a human — open pages, click buttons, fill forms, take screenshots as evidence, and retrieve dynamically rendered content — instead of staring helplessly at static HTML.

Picture this scenario: you want to view a restaurant menu, but the menu isn't printed on paper — a server stands in front of you and demonstrates it on a tablet, and each new page only appears when you tap "Next." That kind of dynamic content is completely invisible to a traditional scraper (which can only read the paper menu). What Playwright does is **open a real browser on your behalf, sit there flipping through pages, clicking, and screenshotting like a human**, and hand you back exactly what you need.

Playwright is Microsoft's open-source browser automation framework, supporting Python, JavaScript, Java and other languages, and capable of driving Chromium, Firefox, and WebKit. The latest version was updated in May 2026; the Python package requires Python ≥ 3.9.

**Official resources:**
- Official docs: [playwright.dev/python/docs/intro](https://playwright.dev/python/docs/intro)
- PyPI page: [pypi.org/project/playwright](https://pypi.org/project/playwright/)
- GitHub repository: [github.com/microsoft/playwright-python](https://github.com/microsoft/playwright-python)

---

## 🧠 Core principles (internalize these as habits)

1. **Ask "static or dynamic?" first.** If the target page's content is rendered by JavaScript (you open View Source and see only an empty shell), that's when Playwright steps in. If it's plain static HTML, BeautifulSoup (Lesson T08) is enough — don't use a sledgehammer to crack a nut.

2. **Locate before you act; locate reliably.** Before clicking a button, find that button first — use its text content, CSS selector, or aria attribute rather than its position coordinates. Page redesigns change coordinates; text usually stays the same.

3. **Waiting is mandatory — never assume "the page is already loaded."** Browser loading is asynchronous. After clicking "Search," results might not appear for another 500 ms. Playwright has built-in waiting mechanisms (`wait_for_selector`, `wait_for_load_state`) — use them; don't guess with `time.sleep`.

4. **Screenshots are your evidence.** Take a screenshot after every key action — it's both proof for the owner and a debugging clue for yourself. `page.screenshot(path="...")` — one line does it.

5. **Headless saves resources; headed helps you debug.** Use headless mode for production runs; when you can't figure out what's going wrong, switch to `headless=False` and watch the browser operate in real time — the problem becomes obvious.

---

## 🛠 How to do it

### Installation (two steps — both are required)

```bash
# Step 1: install the Python library
pip install playwright

# Step 2: install browser drivers (downloads Chromium / Firefox / WebKit binaries)
playwright install
```

> ⚠️ Both steps are required. Installing only the Python library but skipping the browser drivers will result in a runtime error saying the executable can't be found.

### A minimal runnable script (synchronous API)

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Launch the browser (headless=True = no visible window; False = visible window)
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # 1. Open the page
    page.goto("https://example.com")

    # 2. Wait for the page to finish loading
    page.wait_for_load_state("networkidle")

    # 3. Extract the title
    title = page.title()
    print(f"Page title: {title}")

    # 4. Take a screenshot as evidence
    page.screenshot(path="screenshot.png")

    browser.close()
```

### Common operations quick-reference

| Goal | Code |
|------|------|
| Open a page | `page.goto("https://...")` |
| Click an element | `page.click("text=Login")` or `page.click("#submit-btn")` |
| Fill an input field | `page.fill("input[name='q']", "search term")` |
| Press Enter | `page.keyboard.press("Enter")` |
| Wait for an element to appear | `page.wait_for_selector(".result-list")` |
| Extract text | `page.inner_text(".article-title")` |
| Take a screenshot | `page.screenshot(path="out.png")` |
| Get the full HTML | `page.content()` |

### Element location priority order

1. Text content: `page.click("text=Buy Now")`
2. Aria label: `page.click("[aria-label='Search']")`
3. CSS selector: `page.click(".btn-primary")`
4. XPath is the last resort (brittle — avoid it unless there's no other option)

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete plan for using Playwright to accomplish a real small task.**

Target task: open the public page `https://example.com` → take a screenshot → extract the page title and body text → save the results to a file.

You need to:

1. **Write a complete, runnable Python script**, including:
   - Installation step comments
   - Open the page
   - Wait for it to load
   - Take a screenshot (save to `output/screenshot.png`)
   - Extract the title + first paragraph of body text
   - Write results to `output/result.txt`
   - Close the browser

2. **Write out "how to verify success" criteria:**
   - `output/screenshot.png` exists and is non-empty
   - `output/result.txt` contains a non-empty title string
   - Script exits with code 0 (no exceptions)

3. **Write out environment requirements:** what Python version is needed, what must be installed beforehand, and what operating system the script has been tested on.

4. **Write out safety notes:**
   - If the target is a real website (not `example.com`) specified by the owner, confirm first: does that site's `robots.txt` allow scraping? Does it require logging in? (Logging into an account absolutely requires asking the owner first.)
   - After writing the script, **you must get the owner's explicit confirmation before actually installing and running it**.

5. **Compile everything above into a report card** in your dorm file (e.g. `agent-school/skills/playwright-plan.md`).

6. **Distill a skill card:** crystallize Playwright's core usage, element location priority, and waiting strategies into `skills/playwright-browser.md`.

> ⚠️ **Safety boundary (hold this line):** The graduation test for this lesson is about **producing the plan**, not running it autonomously. The commands `pip install playwright` and `playwright install`, as well as actually executing the script — **require the owner's explicit confirmation first**. If the owner is present right now and has said "go ahead and install it," then you may proceed; otherwise, deliver the plan only, and do not install or run anything on your own.

---

## 🎓 Pass criteria

- [ ] You wrote a **complete, runnable Playwright script** (covers: open page, wait, screenshot, extract, save)
- [ ] You clearly stated **success verification criteria** (not "it should work" — specific, verifiable conditions)
- [ ] You wrote out **environment requirements** and **safety notes** (robots.txt, accounts, owner confirmation)
- [ ] You understand the "static vs. dynamic page" decision logic and can explain when to use Playwright and when not to
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T06.
