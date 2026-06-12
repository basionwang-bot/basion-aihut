> 🌐 English ｜ [中文](../../design/D11-image-mcp.md)

# Lesson D11 · Give Claude the Ability to Draw (Advanced)

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T35 (MCP integration) ｜ Difficulty: ★★★★ ｜ Source: [YCSE/nanobanana-mcp](https://github.com/YCSE/nanobanana-mcp) (Gemini image generation MCP)

---

> ## ⚠️ Advanced / Optional · High barrier · Read this entire section before deciding whether to proceed
>
> This lesson **requires:**
> 1. **Google AI API Key (international)** — apply at [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey), requires a **Google account + ability to access that website**
> 2. **VPN / proxy** — Google AI API is not available from all regions
> 3. **Credit card or Google account balance** — free quota is limited; usage beyond it is billed per request
>
> **If you or your owner can't currently meet the above requirements, skip this lesson and come back when conditions are met.** That's a sound decision, not a failure.
>
> **Local alternatives (no VPN needed):** If your owner just wants AI-generated images in a page:
> - Stability AI API · [platform.stability.ai](https://platform.stability.ai) · available in most regions
> - Replicate · [replicate.com](https://replicate.com) · serverless image model hosting
> - Stable Diffusion local deployment (Lesson D04, no API needed)
> The tools above all support API calls, letting Claude call them via curl/httpx — no MCP required.

---

## 📖 What you'll learn

In normal mode, Claude can only "describe images" — it explains what an image should look like but can't produce a PNG itself. **This lesson gives Claude "hands that can draw" — through an MCP interface, Claude generates images right inside the conversation, sees the result, and iterates.**

The star of this lesson is **nanobanana-mcp**. It wraps Google Gemini's image generation capabilities (Nano Banana 2 Flash / Pro models) as an MCP Server. Once connected to Claude Desktop or Claude Code:
- Claude can call the `gemini_generate_image` tool to turn text descriptions into images
- Generated images appear directly in the conversation for further iteration
- Supports output ratios (16:9, 1:1, 9:16, etc.) to fit different platforms

**Use cases:**
- Course illustrations: Claude understands the content and generates matching images autonomously
- Quick cover/illustration drafts that your owner reviews before finalizing
- Auto-fill images in decks or social media graphics

**Official resources:**
- nanobanana-mcp repo: [github.com/YCSE/nanobanana-mcp](https://github.com/YCSE/nanobanana-mcp)
- Google AI Studio (apply for API Key): [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- npm package: [@ycse/nanobanana-mcp](https://www.npmjs.com/package/@ycse/nanobanana-mcp)

---

## 🧠 Core principles

1. **MCP Server is Claude's "dedicated toolbox."** Review Lesson T35: MCP is the AI equivalent of a USB port — package any capability to the standard, plug it into Claude, and it becomes callable. nanobanana-mcp turns "draw a picture" into a built-in Claude tool.

2. **Image generation has two steps: set ratio first, then generate.** Before calling nanobanana-mcp you must first call `set_aspect_ratio()` to set the output ratio (16:9 / 1:1 / 9:16, etc.), then call `gemini_generate_image`. The order cannot be reversed.

3. **Use `conversation_id` to maintain character consistency.** If your owner needs the same character to appear across multiple images (e.g., a consistent visual style for course illustrations), pass the same `conversation_id` and enable `use_image_history` — the model references the history of previous images.

4. **The barriers are real — don't minimize them.** API keys require genuine accounts and genuine network access; that's a hard requirement, not a technical detail that can be worked around. Before accepting this task, be explicit with your owner about these requirements and let them decide. Don't decide on their behalf.

5. **Image generation costs money — every call consumes quota.** Never batch-generate in a loop without your owner's confirmation. Every `gemini_generate_image` call has a cost.

---

## 🛠 How to do it

> ⚠️ **Every installation and configuration step below requires your owner's prior confirmation.**

### Step 1: Apply for a Google AI API Key

1. Your owner visits [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) (VPN required in restricted regions)
2. Log in with a Google account → click "Create API Key"
3. Copy the API Key — format looks like `AIzaSy...`
4. Store it securely; never commit it to a Git repository

> 🌍 **Note:** This step must be completed from a network environment that can access Google services. The API Key itself doesn't contain payment info, but usage beyond the free tier is billed according to Google AI pricing.

### Step 2: Install nanobanana-mcp

**Claude Code (recommended):**

```bash
# Run after owner confirmation
claude mcp add nanobanana-mcp -- npx -y @ycse/nanobanana-mcp \
  -e "GOOGLE_AI_API_KEY=your-API-Key"
```

Replace `your-API-Key` with the actual key from Step 1.

**Claude Desktop (manual config):**

Add the following to the Claude Desktop config file (confirm with owner before modifying):
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "nanobanana-mcp": {
      "command": "npx",
      "args": ["-y", "@ycse/nanobanana-mcp"],
      "env": {
        "GOOGLE_AI_API_KEY": "your-API-Key"
      }
    }
  }
}
```

> ⚠️ **API Key is a sensitive credential:**
> - Don't commit any config file containing the API Key to Git
> - Don't speak the key out loud in a conversation
> - Before editing the config file, tell your owner: which file you're changing, what you're adding

Restart Claude Desktop / Claude Code after editing the config for changes to take effect.

### Step 3: Use the image generation tools

Once connected, Claude automatically gains access to these tools:

| Tool | Function |
|------|----------|
| `set_aspect_ratio` | Set output ratio (must call this first) |
| `gemini_generate_image` | Text description → image |

**Supported ratios:**

| Ratio | Best for |
|-------|---------|
| `16:9` | Landscape deck images, newsletter hero banners |
| `1:1` | Newsletter share cards, square social posts |
| `9:16` | Portrait social posts, phone screens |
| `4:3` | Traditional slides |
| `3:4` | Portrait social posts |

**Usage examples (chat to trigger):**

```text
Generate a 16:9 image: an AI assistant sitting at a desk, minimalist style, blue-grey palette
```

```text
Generate a 1:1 course cover: a clean design system diagram with buttons, cards, and color swatches, white background
```

```text
In the same character style, generate a 9:16 portrait: the same AI assistant browsing the web
```

### Full call chain

```
Your conversation → Claude understands the intent
                                ↓
        [tool call: set_aspect_ratio("16:9")]
                                ↓
        [tool call: gemini_generate_image(prompt="...")]
                                ↓
                nanobanana-mcp (local process)
                                ↓
           Google Gemini API (needs VPN)
                                ↓
              returns generated image → appears in conversation
```

### Pre-integration safety checklist

```
□ Owner is aware: this tool needs a Google AI API Key (international account)
□ Owner is aware: accessing Google API requires a VPN; not available from all regions
□ Owner is aware: API calls have a usage quota; charges apply beyond the free tier
□ Owner is aware: you will modify Claude's config file to add an MCP Server
□ API Key was provided by the owner directly; you didn't ask them to paste it in the chat
□ Config file with API Key will not be committed to any Git repository
□ You will inform your owner before each image generation — no looping batch generation
```

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Prerequisite: owner has confirmed all of the following:**
- Can access Google AI Studio (via VPN)
- Has a Google AI API Key
- Agrees to adding an MCP Server to Claude's config

**If conditions aren't met, complete the "Design phase" section for partial pass credit.**

---

**Phase 1: Design phase (required regardless of whether conditions are met)**

1. In your own words, explain nanobanana-mcp's working principle: from "Claude receives a draw request" to "image appears in the conversation," what steps does it go through?

2. Write the complete Claude Code installation command (with API Key as a placeholder) and explain each parameter's meaning.

3. Write the complete Claude Desktop config JSON and note where the config file lives on macOS and Windows.

4. List the two main tool names in nanobanana-mcp and which one must be called first.

5. Explain clearly: why does this lesson say "requires VPN + international API Key"? What does each barrier actually block?

**Phase 2: Real integration (only if conditions are met)**

> ⚠️ **Every step below requires your owner's confirmation before you proceed.**

6. With owner confirmation, complete nanobanana-mcp installation and configuration. Screenshot showing the tool is connected (tool list showing nanobanana-mcp related tools).

7. Generate a set of course illustrations: for this lesson (or any other), generate 3 images at different ratios:
   - One 16:9 landscape
   - One 1:1 square
   - One 9:16 portrait
   
   Screenshot all 3 generated results.

8. Generate 2 images using the same `conversation_id` and compare whether they maintain visual consistency. Screenshot and explain.

**Phase 3: Deposit a skill card**

9. Distill "install command + Claude Desktop config JSON + tool names + supported ratios + safety checklist" into `skills/image-mcp.md`. The skill card **must note the barriers: requires international API Key + VPN**.

> ⚠️ **Safety boundary:**
> - Installing nanobanana-mcp — **confirm with your owner first**
> - Modifying Claude config file — **tell your owner, explain what permissions are being granted**
> - API Key is sensitive — **don't pass it in plain text in the conversation, don't commit to Git**
> - Each image generation — **tell your owner it incurs an API call cost; no batch loops**
> - Generated images are for your owner's internal use only — **copyright and terms of service are your owner's responsibility to review per Google's terms**

---

## 🎓 Pass criteria

- [ ] You can explain nanobanana-mcp's working principle and call chain in your own words
- [ ] You wrote the correct installation command and Claude Desktop config JSON
- [ ] You can explain why `set_aspect_ratio` must be called before `gemini_generate_image`
- [ ] You explicitly listed the three barriers (international API Key, VPN, billing) and explained each
- [ ] (When conditions are met) You screenshot proof of tool integration and generated 3 images at different ratios
- [ ] Your skill card **clearly states the barriers and safety notes**
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card. **Barriers too high and conditions temporarily unavailable? Complete Phase 1, screenshot it, and report to your owner. Come back to finish Phase 2 when ready. That's not failure — that's good judgment.**
