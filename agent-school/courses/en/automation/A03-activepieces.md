> 🌐 English ｜ [中文](../../automation/A03-activepieces.md)

# Lesson A03 · Activepieces: MIT-Licensed Open Source + 280 Tools Exposed as MCP for Claude to Call

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 + A01 or A02 ｜ Difficulty: ★★★ ｜ Source: [github.com/activepieces/activepieces](https://github.com/activepieces/activepieces) (approx. 22.7k ⭐, MIT, self-described as "the largest open-source MCP toolbox")

---

⚠️ **College-wide safety baseline (repeated at the start of every lesson)**

Tools like this **connect to real accounts and can send real emails or modify real data**. Three non-negotiable rules:
1. **Start with a test account or sandbox** — do not connect production accounts on day one;
2. **Add a human-confirmation node before any destructive action (send / delete)** — let your principal review before it fires;
3. **Ask your principal before connecting any production account** — get explicit consent first.

When granting an AI access to external capabilities, always use the minimum permissions needed.

---

## 📖 What you'll learn

If A01 and A02 were about "manually wiring" automations, Activepieces' most interesting move is this: **it takes 280+ ready-made automation tools and exposes them directly as MCP interfaces, so Claude can call them in plain English**.

Here's the analogy: before, if Claude wanted to help you send a Gmail, append a row to Google Sheets, or post a message in Slack, you had to write the code yourself or do it by hand. Activepieces does one elegant thing — it wraps all 280+ integrations (called "Pieces") as standard MCP tools. Once Claude is connected, you just say "put this record into that spreadsheet" and Claude can do it.

By the end of this lesson you'll be able to:
- Start Activepieces locally with Docker Compose
- Understand the "Piece = one callable tool unit" model
- Generate an MCP access token and connect Activepieces to Claude Desktop or Claude Code
- Let Claude call real tools via MCP to complete an actual automation task

**Official resources:**
- Repository: [github.com/activepieces/activepieces](https://github.com/activepieces/activepieces)
- Official docs: [activepieces.com/docs](https://www.activepieces.com/docs)
- MCP guide: "MCP Server" section in the README
- Discord community: [discord.gg/2jUXBKDdP8](https://discord.gg/2jUXBKDdP8)

---

## 🧠 Core principles

1. **Piece = a LEGO brick, each one encapsulates one external service's operations.** Google Sheets is one brick, Gmail is one brick, Slack is one brick, HTTP request is one brick… Activepieces has 280+ bricks, 60% of which are community-contributed. Your job is: pick the bricks, snap them together, let them run.

2. **MCP = the standard interface for installing plugins into Claude.** Activepieces' most distinctive feature: all 280+ Pieces can be exposed as an MCP server for Claude. Claude calls these Pieces through the MCP protocol — it's like Claude suddenly growing 280 pairs of hands, each pair skilled at a different task.

3. **Two usage modes that are more powerful together.** Activepieces has two dimensions: ① **Visual pipeline**: drag Pieces and wire them in the editor, similar to A01 and A02; ② **MCP interface**: expose ready-made Pieces for an AI to call directly — this is the focus of this lesson. Both can be used simultaneously.

4. **MIT license — the most permissive open-source license.** The community edition is pure MIT: personal use, commercial use, modify and sell — all fine (just keep the copyright notice). The enterprise edition has extra features (SSO, etc.) requiring a commercial license, but the community edition covers everyday use.

5. **Get your principal's approval before installing, connecting accounts, or granting Claude access.** Installing the Docker service needs principal confirmation. Generating an API token and connecting it to Claude is effectively granting Claude the ability to control external services — that decision must be made by your principal.

---

## 🛠 How-to

### Start Activepieces with Docker Compose

Activepieces' `docker-compose.yml` is in the repository root. Verify Docker is installed first:

```bash
docker --version
docker compose version
```

Clone the repository and start the services:

```bash
git clone https://github.com/activepieces/activepieces.git
cd activepieces
docker compose up -d
```

> ⚠️ **Get your principal's approval before running `docker compose up`.** This step will create a local PostgreSQL database, a Redis cache, and the Activepieces application service.

Once the service is up, open a browser to:

```
http://localhost:8080
```

Your first visit will walk you through creating an admin account. **Use a strong password** — do not use a weak test password in any environment that will persist.

> 🌐 **Docker image tip:** If `ghcr.io` registry pulls are slow, ask your principal to configure a Docker pull-through cache or try pulling at off-peak hours. `ghcr.io` may be blocked or throttled in some regions.

### Understanding the Piece structure

A Piece works much like a function:

```
Input parameters (account credentials + operation parameters) → [Piece processes] → Output result
```

For example, the "Google Sheets: Append Row" Piece:
- Input: Google account (OAuth) + spreadsheet ID + row data
- Output: success/failure + info about the row that was written

In the visual editor, you fill in the parameters, wire the Piece between other nodes, and it runs.

### Generate an MCP token and connect to Claude

This is the core operation of this lesson: expose Activepieces Pieces as an MCP interface so Claude can call them directly.

**Step 1: Generate an MCP access token inside Activepieces**

1. Log in to the Activepieces dashboard at `http://localhost:8080`
2. Go to **Settings** → find the **MCP** or **API Keys** section
3. Generate an API token (save it — it is only shown once)

> ⚠️ **This step must be performed by your principal**, because this token represents your principal authorizing Claude to call all capabilities inside Activepieces.

**Step 2: Configure Claude Desktop or Claude Code**

Add the following to Claude Desktop's `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "activepieces": {
      "command": "npx",
      "args": [
        "@activepieces/mcp",
        "--api-key", "YOUR-AP-TOKEN",
        "--base-url", "http://localhost:8080"
      ]
    }
  }
}
```

Or use the Claude Code CLI:

```bash
claude mcp add activepieces \
  -e AP_API_KEY=YOUR-AP-TOKEN \
  -e AP_BASE_URL=http://localhost:8080 \
  -- npx @activepieces/mcp
```

> ⚠️ **Tell your principal before modifying the config**, and explain clearly what permissions you are adding. Restart Claude Desktop / Claude Code for the change to take effect.

> ⚠️ **Token security:** Never commit a token to a git repository or share it with others. A token stored in a config file is "the key your principal gave Claude" — if it leaks, someone else can use it to operate your principal's Activepieces instance.

**Step 3: Verify the connection**

After restarting Claude Desktop/Code, ask in a conversation:
```
What MCP tools do you have available right now?
```
Or run `/mcp` inside Claude Code and check whether `activepieces` appears in the tool list.

### Let Claude call a Piece via MCP (live demonstration)

Once connected, you can direct Claude to complete automation tasks in plain language:

**Example conversation:**

> User: "Please append this record to the first sheet of the Google Sheet called 'Project Progress': project=Project A, status=In Progress, date=today."

Claude will:
1. Identify that it needs to call the Google Sheets Piece
2. Issue an MCP tool call
3. Activepieces executes the write operation
4. Returns the result to Claude
5. Claude replies "Done — the row has been written"

**Key insight: Claude doesn't inherently know how to operate Google Sheets — it completes the task by calling Activepieces' Piece through MCP.**

### Activepieces common Piece categories

| Category | Examples |
|----------|---------|
| Productivity / Spreadsheets | Google Sheets, Airtable, Excel |
| Email | Gmail, Outlook, SMTP |
| Messaging | Slack, Discord, DingTalk (community Piece) |
| Storage | Google Drive, Dropbox |
| Code / HTTP | HTTP request, execute JS/Python code |
| AI | OpenAI, various LLMs |
| Database | MySQL, PostgreSQL |

> 🌐 **Note:** Community-contributed Pieces for regional platforms (DingTalk, Feishu/Lark, etc.) exist but have varying maintenance levels — check the latest support status before relying on them.

### Safety confirmation checklist

```
□ Got principal's approval before running docker compose up
□ Created an admin account with a strong password — no weak defaults
□ MCP token generation and authorization to Claude was decided by the principal
□ Token has not been committed to a git repository or placed in a public location
□ Informed the principal which external services Claude can now operate via MCP
□ External service accounts being connected use test accounts / test workspaces, not production
□ Got the principal's explicit confirmation again before connecting any production account
```

---

## 📝 Graduation quiz (must actually do it — provide evidence)

**Task: let Claude call an Activepieces Piece via MCP to complete a real automation operation.**

**Phase 1: Conceptual (can be done first)**

1. **Explain the role MCP plays here:** Why is Activepieces described as "Claude's toolbox"? Draw the call chain "User → Claude → MCP → Activepieces Piece → External Service" and explain in your own words what each arrow represents.

2. **MIT license vs. AGPL — what's the difference:** Compared with Automatisch from A02 (AGPL-3.0), what does Activepieces' MIT license mean differently for your principal? Under what scenarios does this difference matter most?

3. **Why API token security is critical:** If the API token leaked, what is the worst-case scenario? What is the right way to protect a token?

**Phase 2: Hands-on (requires your principal to have confirmed Docker is installed)**

> ⚠️ **Get your principal's confirmation that Docker is installed before starting this phase.**

4. **Start Activepieces:** Run `docker compose up -d`, wait for the service to be ready, and visit `http://localhost:8080`. Screenshot the login page.

5. **Create an admin account and log in:** Screenshot the main dashboard.

6. **Build a simple visual pipeline in the editor:** Use a **Schedule** (timed trigger) + **HTTP Request** (call a public API) + **Send message** (send to a Webhook or the built-in Debug output). Screenshot the wired pipeline.

7. **Generate an MCP token** and connect Activepieces to Claude Desktop or Claude Code (your principal performs the OAuth/token steps). Screenshot Claude showing the activepieces MCP tool list.

8. **Have Claude execute an operation via MCP:** In a conversation, instruct Claude to call any Piece and complete a real operation (e.g. send a Webhook, send a test email, write a row to a Sheet). Screenshot Claude's reply and the execution result.

9. **Deposit a skill card:** Distill "Activepieces start command + MCP connection config + common Piece categories + safety checklist" into `skills/activepieces-mcp.md`.

> ⚠️ **Safety reminders:**
> - `docker compose up -d` — **get your principal's approval before running**
> - MCP token generation and connecting to Claude — **this decision must be made by your principal; you only help them operate**
> - Calling external service Pieces — **start with test accounts / test environments**
> - Token never goes in git — **this is a hard rule**

---

## 🎓 Passing criteria

- [ ] You can draw the complete call chain "User → Claude → MCP → Activepieces → External Service" and explain it step by step
- [ ] You can state the core difference between the MIT license and AGPL
- [ ] You successfully started Activepieces and created an admin account (screenshot as proof)
- [ ] You built at least one visual pipeline in the editor (screenshot as proof)
- [ ] You connected Activepieces to Claude (visible in the MCP tool list) and had Claude execute a real operation via MCP (screenshot as proof)
- [ ] You have deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent examiner** (fresh-context sub-agent, or the low-config fallback described in [Rule 4](../../../校规.md)) has ruled "pass"

All boxes checked and examiner approval received — log it on your progress card and move on to the next lesson.
