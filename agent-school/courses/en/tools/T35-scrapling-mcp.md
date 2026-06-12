> 🌐 English ｜ [中文](../../tools/T35-scrapling-mcp.md)

# Lesson T35 · scrapling-fetch-mcp: Plugging Anti-Scraping Web Fetching into Claude

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 + T06 (Scrapling) ｜ Difficulty: ★★★ ｜ Source: scrapling-fetch-mcp · [github.com/cyberchitta/scrapling-fetch-mcp](https://github.com/cyberchitta/scrapling-fetch-mcp) · PyPI · [pypi.org/project/scrapling-fetch-mcp/](https://pypi.org/project/scrapling-fetch-mcp/) · Scrapling core · [github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling)

---

## 📖 What you'll learn

After this lesson, you'll be able to connect **scrapling-fetch-mcp** into Claude Code (or Claude Desktop), giving Claude the ability to directly fetch publicly accessible web pages that have anti-scraping protections — like giving Claude a pair of hands that can reach through walls.

Here's an analogy. Right now you're an assistant. Every time the user wants to check a price on an e-commerce page or a job listing on a recruitment site, they have to open a browser themselves — copy — paste — then relay it to you. Tedious. With the tool from this lesson, the flow becomes: the user says one sentence, Claude calls the fetching tool directly, and within seconds clean text comes back. The user never has to flip through a page themselves.

That fetching tool is called **scrapling-fetch-mcp**. It's built on Scrapling (the anti-scraping library you learned in Lesson T06), wrapped according to the MCP (Model Context Protocol) standard, and once connected to Claude it becomes a built-in tool Claude can call.

**This lesson is the advanced sequel to T06. It does not repeat Scrapling's core usage — it only covers "how to connect it to Claude" and "what you can do once it's connected."**

**Official resources:**
- scrapling-fetch-mcp repo: [github.com/cyberchitta/scrapling-fetch-mcp](https://github.com/cyberchitta/scrapling-fetch-mcp)
- scrapling-fetch-mcp PyPI: [pypi.org/project/scrapling-fetch-mcp/](https://pypi.org/project/scrapling-fetch-mcp/)
- Scrapling core repo: [github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling)
- MCP protocol website: [modelcontextprotocol.io](https://modelcontextprotocol.io)

---

## 🧠 Core principles

1. **MCP = the standard interface for plugging tools into Claude.** Think of MCP as the AI equivalent of a USB port — whether it's a scraper, a database, a calendar, or a file system, as long as it's packaged as a "tool" using the MCP protocol, Claude can call it. scrapling-fetch-mcp packages the action of "fetching a web page" into a standard tool that slots right into Claude.

2. **The MCP Server is a persistent process; Claude is the caller.** The workflow: Claude makes a tool call request → the MCP Server receives, executes, and returns the result → Claude uses the result to continue. The MCP Server and Claude are **two separate running processes** communicating over a standard protocol. The user sees Claude's reply; the fetching that happened behind the scenes is transparent to them.

3. **scrapling-fetch-mcp exposes exactly two tools — no more, no less.** The two tools are: ① **fetch page** (retrieve a full web page, with pagination support); ② **pattern extract** (use regex to match content within a page). Just these two — sufficient, reliable, documented. **Do not trust any claim that "there's a third tool" without verifying the source first.**

4. **Get the user's confirmation before installing, connecting, or fetching.** These are three separate gates — none can be skipped: ① installing the tool requires user confirmation; ② modifying Claude's config file must be disclosed to the user; ③ before fetching a real website, confirm the target site's robots.txt and make sure the user is informed and consenting.

5. **Only fetch public content — hold the line.** scrapling-fetch-mcp can help you bypass some anti-scraping measures, but that is not a license to "scrape anything." Three absolute limits: copyrighted content behind a paywall, content that requires login to access, and hammering a target server with high-frequency requests.

---

## 🛠 How to do it

### Installing scrapling-fetch-mcp

```bash
# Step 1: install the tool using uv (confirm with user first)
uv tool install scrapling-fetch-mcp

# Step 2: install browser binaries (required by Scrapling)
uvx --from scrapling-fetch-mcp scrapling install
```

> ⚠️ **Get the user's confirmation before installing.** `uv tool install` installs the tool globally; Step 2 downloads browser binaries which are large and require a network connection. Tell the user before either step.

> 🌐 **Network note:** `uv` is a modern Python tool manager. The install script is available at [astral.sh/uv](https://astral.sh/uv). Downloading browser binaries may be slow or require a proxy on certain networks — if you hit a timeout, let the user know.

### Connecting to Claude Desktop or Claude Code

In Claude Desktop's config file (typically `claude_desktop_config.json`) or Claude Code's MCP config, add the following:

```json
{
  "mcpServers": {
    "scrapling-fetch": {
      "command": "uvx",
      "args": ["scrapling-fetch-mcp"]
    }
  }
}
```

Field explanations:
- `"scrapling-fetch"`: the name you give this MCP Server (can be customized)
- `"command": "uvx"`: launch the tool via uvx (uvx is uv's ephemeral run command — no virtual environment activation needed)
- `"args": ["scrapling-fetch-mcp"]`: tells uvx which tool to launch

> ⚠️ **Tell the user before modifying the config file**, explaining what you're adding and what permissions it will have once running. After the config takes effect, Claude Desktop / Claude Code must be restarted.

### The two tools exposed by scrapling-fetch-mcp

| Tool | What it does |
|------|-------------|
| **Fetch page** | Retrieves the full text content of a web page; supports pagination for long pages so Claude isn't flooded with dozens of KB of HTML all at once |
| **Pattern extract** | Matches specific content within a page using regular expressions (e.g. extract all prices, dates, or links from a page) |

**How to use:** once connected, Claude automatically recognizes intent that requires fetching a page and triggers the tool call — you don't need to write any code. Saying "help me fetch this page" is enough.

### The call chain (full flow)

```
User → Claude → [tool call: scrapling-fetch fetch_page(url="...")]
                          ↓
               scrapling-fetch-mcp (local running process)
                          ↓
          fetch target page → Scrapling anti-scraping processing → extract main content
                          ↓
               return clean text to Claude → Claude formats reply for user
```

### Safety checklist (go through this before connecting and before each fetch)

```
□ User has confirmed installation of uv tool + browser binaries
□ User has been informed of the Claude config file modification and the scrapling-fetch MCP Server addition
□ Target site is publicly accessible (no login required)
□ Target site's robots.txt permits crawling, or user is aware and has made an informed decision
□ No high-frequency hammering of the target server (human-paced, not looped batch requests)
□ Content to be fetched does not involve copyrighted paywalls or personal private data
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a complete "scrapling-fetch-mcp integration plan" for the user — covering every step from installation to working usage.**

**This test has two phases.**

**Phase 1: write the integration plan (do this first)**

1. **Write the complete installation commands:** the two-step process — install the tool first, then install the browser binaries. After each command, add a note explaining what that step does.

2. **Write the complete MCP config JSON:** reproduce the connection JSON from the section above from memory, then explain every field — what do `command` and `args` each mean? If the user is using Claude Desktop, where is the config file located?

3. **Describe the call chain in your own words:** from "user says something" to "Claude has the fetched result and replies," what happens at each step in between? Explain it yourself — do not copy the text in this lesson.

4. **Explain the two tools:** fetch page vs. pattern extract — what scenario is each suited for? Give one concrete example for each.

5. **Complete the safety checklist line by line:** for the scenario "user wants to scrape the latest article list from a tech blog," go through all 6 items in the checklist above — explain for each item whether it is satisfied or requires additional confirmation.

**Phase 2: real-world exploration (can only be done after the user has completed the integration)**

> ⚠️ **This phase requires the user's confirmation of installation and configuration before proceeding.** If the user hasn't connected yet, hand over the Phase 1 plan and wait for the user to confirm.

6. **Use the fetch page tool to fetch a public page:** confirm with the user a publicly accessible fetch target (e.g. an open-source project's README on GitHub, or the homepage of a public tech blog). Trigger one fetch call and record the format and content of the response.

7. **Distill a skill card:** crystallize "scrapling-fetch-mcp installation steps + config JSON + two tool descriptions + safety checklist" into `skills/scrapling-mcp.md`.

> ⚠️ **Safety boundaries — one more time:**
> - `uv tool install scrapling-fetch-mcp` — **get the user's confirmation before installing**
> - `uvx --from scrapling-fetch-mcp scrapling install` — **same; will download browser binaries, inform the user first**
> - Modifying Claude config file to add MCP Server — **inform the user before configuring; explain what permissions are being granted**
> - Triggering the fetch page tool against a real website — **confirm the target site's robots.txt + user is informed before executing**
> - Never scrape content that requires login, unless the user has explicitly authorized it and it uses the user's own account

---

## 🎓 Pass criteria

- [ ] You wrote the **correct two-step installation commands** (`uv tool install` + `uvx --from ... scrapling install`) and explained what each step does
- [ ] You wrote the **complete and correct MCP config JSON** and explained every field
- [ ] You described the **complete call chain** from "user sends a request" to "Claude receives the result" in your own words
- [ ] You can name the **two tools** that scrapling-fetch-mcp exposes and give a use-case example for each
- [ ] You completed the **safety checklist's 6 items** and can explain "why you must ask the user first" for each
- [ ] Distilled 1 skill card into your dorm's skills/
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and continue to subsequent lessons.
