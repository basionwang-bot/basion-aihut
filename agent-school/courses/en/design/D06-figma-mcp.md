> 🌐 English ｜ [中文](../../design/D06-figma-mcp.md)

# Lesson D06 · Figma MCP: Let the Agent Read Your Design Files

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★★ ｜ Source: [github.com/arinspunk/claude-talk-to-figma-mcp](https://github.com/arinspunk/claude-talk-to-figma-mcp) · Alternative: [github.com/GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP) (15.1k ⭐)

---

## 📖 What you'll learn

A designer finishes a product login page in Figma — primary color #1677FF, font PingFang SC 16px, button border-radius 8px — and sends you the design link with "code it up like this." Traditionally you'd measure each value by hand, copy them one by one, and still risk missing details.

**Figma MCP** opens a direct channel between Claude and Figma: Claude can read every layer and every style parameter in a Figma design file — colors, fonts, dimensions, spacing, component names, all of it — and generate corresponding code directly. It's like giving Claude a pair of eyes that can read architectural blueprints.

This lesson covers two approaches:

| Approach | Project | Best for | Requirements |
|----------|---------|---------|--------------|
| **Option A** | `claude-talk-to-figma-mcp` | Two-way operations (read + modify the design) | Figma Desktop + plugin |
| **Option B** | `Figma-Context-MCP` (Framelink) | Just reading design files and writing code | Only a Figma personal access token |

> ⚠️ **Both options require a Figma account. The Figma free plan works fine — no paid subscription needed.**

After this lesson you'll be able to:
1. Connect Figma MCP to Claude Code or Claude Desktop
2. Send a Figma design link to Claude and have it read the design parameters
3. Use those parameters to generate React/HTML code

**Official resources:**
- claude-talk-to-figma-mcp: [github.com/arinspunk/claude-talk-to-figma-mcp](https://github.com/arinspunk/claude-talk-to-figma-mcp)
- Figma-Context-MCP (Framelink): [github.com/GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP)
- Figma personal access tokens: [figma.com/developers/api#access-tokens](https://www.figma.com/developers/api#access-tokens)

---

## 🧠 Core principles

1. **MCP = a standard interface for plugging "extra sensors" into Claude.** Normal Claude can only read text and images; with Figma MCP, Claude can call the Figma API directly to read every element's exact parameters — not by "looking at pixels" but by "reading data."

2. **Two options, two use cases — use Framelink for read-then-code, use claude-talk-to-figma-mcp for in-file edits.** Framelink (Option B) is lighter: just a Figma token, Claude reads design parameters, you ask it to write code. claude-talk-to-figma-mcp (Option A) is more powerful: it can create layers and change colors directly in Figma, but has more setup steps.

3. **The Figma Personal Access Token is the key.** It lets Claude access your Figma files on your behalf. Keep the token secret — don't share it with others and don't commit it to Git.

4. **Some deviation from the design is normal.** Claude reads exact design parameters, but translating them into code can introduce small discrepancies (e.g., Figma uses absolute pixels while code may need relative units). Generated code is an 80-point starting draft; the remaining 20 points require human review.

5. **Confirm with your owner before connecting.** Configuring MCP modifies Claude's config file, and after connecting Claude can access your specified Figma files. Tell your owner about both before doing anything.

---

## 🛠 How to do it

### Option A: claude-talk-to-figma-mcp (two-way operations)

**Prerequisites:** Node.js, Figma Desktop, an MCP-compatible Claude client (Claude Desktop / Claude Code)

**Step 1: Start the WebSocket service**

```bash
# First-time use: global install
npx claude-talk-to-figma-mcp
```

On subsequent uses, from the project directory:
```bash
bun run socket
```

> ⚠️ **Confirm with your owner before running.** `npx` installs a Node package — needs network access.

**Step 2: Install the Figma plugin**

1. Open Figma Desktop
2. Menu → Plugins → Development → Import plugin from manifest
3. Select `src/claude_mcp_plugin/manifest.json` from the project directory

**Step 3: Configure Claude Desktop**

Download the latest `.dxt` file from the Releases page and double-click to install.

Or manually configure `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "ClaudeTalkToFigma": {
      "command": "npx",
      "args": ["-p", "claude-talk-to-figma-mcp@latest", "claude-talk-to-figma-mcp-server"]
    }
  }
}
```

**Step 4: Connect to Figma**

1. Open the installed plugin inside Figma
2. Copy the Channel ID shown in the green box
3. In the Claude conversation, type: `Connect to Figma, channel {your-ID}`

**What you can do:**
- Analyze design structure: "analyze the color scheme in this design file"
- Generate code: "generate React code with PropTypes for the CardProduct component"
- Accessibility audit: "find all text elements with contrast ratio below 4.5:1"
- Bulk edits: "change all primary button colors from #FF6B6B to #E63946"

---

### Option B: Figma-Context-MCP / Framelink (read-only, simpler)

**Step 1: Get a Figma personal access token**

1. Log into Figma → click your avatar (top-left) → Settings
2. Left menu: Personal access tokens → Generate new token
3. Copy the token immediately (it's only shown once — save it right away)

> ⚠️ **Keep the token secret** — don't put it in code, don't commit it to Git, don't share it.

**Step 2: Configure Claude Desktop or Claude Code**

macOS / Linux:
```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=your-token", "--stdio"]
    }
  }
}
```

Windows:
```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=your-token", "--stdio"]
    }
  }
}
```

Or use an environment variable (safer — keeps the key out of the JSON):
```json
{
  "mcpServers": {
    "Framelink MCP for Figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "your-token"
      }
    }
  }
}
```

> ⚠️ **Tell your owner before editing the config file** — explain what MCP Server you're adding and what it can access. Restart Claude for changes to take effect.

**Step 3: Use it**

Once the config is active, send a Figma design link in the Claude conversation:
```
Here's my Figma design link: https://www.figma.com/design/xxx
Please read this login page's design parameters and generate the corresponding React + Tailwind code.
```

Claude will automatically call the MCP tool to fetch the design data, then output the code.

### Comparison of use cases

| Scenario | Recommended option |
|----------|--------------------|
| Just read design file and write code | Option B (Framelink) |
| Need to edit the design directly in Figma | Option A (claude-talk-to-figma-mcp) |
| Accessibility audit | Option A |
| Quick start, fewer setup steps | Option B |
| Free Figma account | Both options supported |

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Task: Connect a Figma design file to Claude, have Claude read the design parameters, and generate corresponding HTML/CSS code.**

> ⚠️ **Safety boundary: requires a Figma account + modifying Claude's config file. Confirm with your owner first.**

**Steps:**

1. **Get your owner's confirmation**: tell them you're configuring Figma MCP, need a Figma personal access token, and will modify Claude's MCP config file. Wait for confirmation before proceeding.

2. **Choose your option**: Option A (two-way) or Option B (read-only, recommended for beginners). Tell your owner which one you chose.

3. **Get the token / complete setup**:
   - Option B: apply for a Figma personal access token, write it into the MCP config file
   - Option A: complete WebSocket service + Figma plugin + Claude config
   Screenshot proving MCP is connected (screenshot of Claude's config file, or a Claude conversation showing Figma tools available).

4. **Prepare a Figma design file**:
   - If your owner has an existing Figma design, use that
   - If not, create a simple login form in Figma (two inputs + one button) with colors and fonts set
   Record the design file link.

5. **Let Claude read and generate code**: send the Figma link to Claude and ask it to:
   - List the design file's color spec (hex values)
   - List the typography spec (font name, size, weight)
   - Generate the corresponding HTML + CSS code
   Screenshot Claude's response and the generated code.

6. **Verify the code**: open the generated HTML in a browser and compare it side-by-side with the original design file. Screenshot the comparison.

7. **Write a retrospective (≥100 words)**: were the parameters Claude read accurate? How close is the generated code to the design? Where are there discrepancies? What issues did you run into during setup?

8. **Deposit a skill card**: distill "Figma MCP setup steps + token application method + use case comparison + security notes" into `skills/figma-mcp.md`.

**Evidence checklist:**
- [ ] Screenshot of MCP config file (token redacted)
- [ ] Screenshot showing Claude successfully calling Figma tools
- [ ] Screenshot of the Figma design file
- [ ] Screenshot of Claude-generated code
- [ ] Screenshot of code rendered in a browser (compared to the design)
- [ ] Retrospective report
- [ ] Skill card file `skills/figma-mcp.md`

---

## 🎓 Pass criteria

- [ ] You can explain "why Figma MCP is more precise than a screenshot" — Claude is reading data, not doing pixel recognition
- [ ] You completed the full setup for Option A or Option B — screenshots as proof
- [ ] You had Claude read color and typography specs from a real Figma design file
- [ ] You received Claude-generated HTML/CSS code and verified it runs in a browser
- [ ] You can state the security rules for the Figma personal access token (don't commit to Git, don't put it in plain-text code)
- [ ] You can explain the best use case for Option A vs. Option B
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card and move on.
