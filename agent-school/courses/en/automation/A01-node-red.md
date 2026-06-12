> 🌐 English ｜ [中文](../../automation/A01-node-red.md)

# Lesson A01 · Node-RED: Draw Your First Automation Pipeline by "Connecting the Dots"

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source: [github.com/node-red/node-red](https://github.com/node-red/node-red) (approx. 23.3k ⭐, Apache 2.0, maintained by the OpenJS Foundation)

---

⚠️ **College-wide safety baseline (repeated at the start of every lesson)**

Tools like this **connect to real accounts and can send real emails or modify real data**. Three non-negotiable rules:
1. **Start with a test account or sandbox** — do not connect production accounts on day one;
2. **Add a human-confirmation node before any destructive action (send / delete)** — let your principal review before it fires;
3. **Ask your principal before connecting any production account** — get explicit consent first.

When granting an AI access to external capabilities, always use the minimum permissions needed.

---

## 📖 What you'll learn

Imagine you work on a factory floor. Every day the job is: goods arrive → inspection → sort by condition → route into different channels. In the old world, that entire workflow had to be written out in code line by line. **Node-RED turns this into a "connect-the-dots" game** — you drag-and-drop "nodes" onto a web canvas, wire them together, and the pipeline is live. No code required.

By the end of this lesson you'll be able to:
- Start Node-RED locally and open it in a browser
- Understand the "Node → Wire → Flow" mental model
- Build a real, running automation pipeline: timed page fetch → change detection → push notification when something changes

**Official resources:**
- Website: [nodered.org](https://nodered.org)
- Repository: [github.com/node-red/node-red](https://github.com/node-red/node-red)
- Node library: [flows.nodered.org](https://flows.nodered.org)

---

## 🧠 Core principles

1. **Pipeline thinking: data is "cargo" that flows.** In Node-RED every "message" is a piece of cargo — it enters from the left, gets processed by each node in turn, and exits from the right. Your job is to design what each node does and which route the cargo travels.

2. **Node = one action, wire = execution order.** Each node does exactly one thing — "fire on a schedule," "make an HTTP request," "evaluate a condition," "send an email." Connecting nodes means putting those actions in order. Think of LEGO bricks: each piece has a fixed shape, but the combinations are endless.

3. **Tripwire thinking: act only when triggered.** Node-RED is event-driven. You don't ask it to "check every second" — instead you plant a tripwire, something like "every morning at 8 AM" or "whenever an HTTP request arrives." Only when the wire trips does the pipeline run. When nothing trips it, the system sits perfectly quiet.

4. **Runs locally — data never leaves your machine.** Node-RED runs on your own hardware. No account registration, no fees, no internet required for local tasks. Works fine on any network setup — install and go.

5. **Get your principal's approval before installing or connecting external services.** Installing Node-RED requires an npm/Node.js environment; a global npm install changes system-level config, so tell your principal first. Connecting external services like Feishu/Lark, email, or Slack requires credentials — your principal must type those in themselves. You cannot do it on their behalf.

---

## 🛠 How-to

### Installing Node-RED

Node-RED is a Node.js application. Verify Node.js is present before installing:

```bash
# Check the Node.js version (18.x or higher required)
node --version
```

Install Node-RED (ask your principal first — this is a global install):

```bash
sudo npm install -g --unsafe-perm node-red
```

Once installed, start it:

```bash
node-red
```

> ⚠️ **Tell your principal before installing:** `sudo npm install -g` installs globally and modifies the system npm directory. Get the go-ahead before running this.

After starting, open a browser to:

```
http://localhost:1880
```

> 🌐 **npm tip:** If npm install is slow, switch to a faster registry: `npm config set registry https://registry.npmmirror.com`

### Understanding the editor layout

When you open `http://localhost:1880` you'll see a three-panel layout:

```
┌──────────────┬─────────────────────────────┬──────────────┐
│  Left panel  │   Center canvas (drag area)  │ Right panel  │
│  inject      │                              │              │
│  debug       │ [inject] ──→ [http req] ──→ [debug]        │
│  http request│                              │ node config  │
│  function    │                              │ shown here   │
│  change      │                              │              │
└──────────────┴─────────────────────────────┴──────────────┘
```

- **Left:** All available nodes, grouped by category — drag them onto the canvas
- **Center:** Your "pipeline canvas" — this is where you draw the wires
- **Right:** When you click a node, its configuration appears here for editing

### Installing community nodes (e.g. node-red-contrib-http-request)

Node-RED has thousands of community nodes. To install one:

1. Click the ☰ menu in the top-right → **Manage palette**
2. Search for the node name → click **Install**
3. The node automatically appears in the left panel when done

> ⚠️ **Tell your principal before installing community nodes:** These are third-party packages. Explain what you're installing and why before proceeding.

### Real-world pipeline: timed page fetch → change detection → push notification

This is the core hands-on pipeline for this lesson — five nodes total:

```
[inject (schedule)] → [http request (fetch page)] → [function (extract content)] → [change (compare with last run)] → [debug / notification]
```

**Step 1: Plant a "timed tripwire"**

Drag in an **inject** node, double-click to configure:
- Payload: empty (no data — just a trigger signal)
- Repeat: interval → every 60 minutes (or whatever interval you want)
- This is your "alarm clock" node — at each interval it automatically fires a message downstream

**Step 2: Fetch the page**

Drag in an **http request** node, double-click to configure:
- Method: GET
- URL: the target page you want to monitor (e.g. a job listing page, an announcement page)
- Return: select **a UTF-8 string**
- When this node receives a message from upstream, it immediately fetches the HTML at that URL and passes it downstream

**Step 3: Extract the content you care about**

Drag in a **function** node, double-click and write JavaScript:

```javascript
// Extract the text you care about from the HTML
// This example uses simple string matching; use regex in real projects
var html = msg.payload;
// For example, pull out just what's inside the <title> tag
var match = html.match(/<title>(.*?)<\/title>/i);
msg.payload = match ? match[1] : "Title not found";
return msg;
```

**Step 4: Compare with the previous run**

Drag in another **function** node for change detection:

```javascript
// Use context.get/set to remember the value from the previous call
var last = context.get('lastContent') || '';
var current = msg.payload;

if (current !== last) {
    // Something changed!
    context.set('lastContent', current);
    msg.changed = true;
    msg.payload = "Change detected! New content: " + current;
    return msg;  // Pass it downstream
} else {
    return null;  // Nothing changed — break the circuit here
}
```

**Step 5: Send the alert**

- For local testing: drag in a **debug** node — changes will print in the right-side debug panel
- To push to Feishu/Lark, DingTalk, or Slack: install the corresponding community node (e.g. `node-red-contrib-feishu-webhook` or `node-red-node-slack`) and configure the webhook URL
- To send email: use the built-in **email** node (requires installing `node-red-node-email`)

> ⚠️ **Ask your principal before connecting any notification channel:** Webhook URLs, email addresses, and credentials must be entered by your principal. Your job is to configure the node structure only.

**Finally: click the Deploy button in the top-right**

The blue **Deploy** button = "make the pipeline you drew actually run." Every time you change the pipeline you must re-deploy for changes to take effect.

### Debugging tips

- Attach a **debug** node after any wire to see exactly what the data looks like at that point in the right-side debug panel
- The inject node has a small square on its left side — click it to manually fire a trigger immediately without waiting for the timer
- The **debug tab** in the right-side sidebar prints all debug node output in real time

---

## 📝 Graduation quiz (must actually do it — provide evidence)

**Task: build a "web page change monitor" pipeline and get it running for real.**

**Phase 1: Conceptual (can be done without a running environment)**

1. **Draw the pipeline structure in text:** List your 5 nodes. For each node, explain "what it does," "what it receives as input," and "what it produces as output." Do not copy from the lesson — use your own words.

2. **Explain the "tripwire" concept:** What role does the inject node play? Why is Node-RED described as "event-driven"? Give a real-life analogy.

3. **Explain what `return null` does:** In the change-detection node, what happens when there is no change and the code returns `null`? What mechanism in a physical pipeline does this resemble?

**Phase 2: Hands-on (requires Node-RED already installed by your principal)**

> ⚠️ **Get your principal's confirmation that Node-RED is installed before starting this phase.**

4. **Start Node-RED locally and take a screenshot of `http://localhost:1880`** to prove it is running.

5. **Build the complete 5-node pipeline:** timed inject → HTTP fetch a public page (e.g. `https://example.com`) → function to extract the title → change detection → debug output. Screenshot the wired pipeline.

6. **Manually trigger the inject node twice:** Record the debug panel output after the first trigger. The second trigger (content unchanged) should produce no debug output — screenshot both results to prove "no change = silence."

7. **Deposit a skill card:** Distill "Node-RED install command + 5-node pipeline config + debugging tips + safety checklist" into `skills/node-red-monitor.md`.

> ⚠️ **Safety reminders:**
> - `sudo npm install -g --unsafe-perm node-red` — **get your principal's approval before running**
> - Connecting external notification channels (Feishu/Lark, DingTalk, Slack, email) — **your principal must enter account credentials themselves**
> - Monitoring real websites — **keep the fetch frequency low and respect the target server**

---

## 🎓 Passing criteria

- [ ] You can explain the "Node → Wire → Flow" model and make it clear with a real-life analogy
- [ ] You have written out the full 5-node pipeline structure and can describe the role of each node
- [ ] You understand what `context.get/set` does — "remembering" the previous value between two trigger calls
- [ ] You can explain how `return null` "breaks the circuit" and why that matters
- [ ] You successfully started Node-RED locally and got the pipeline running (screenshot as proof)
- [ ] You have deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent examiner** (fresh-context sub-agent, or the low-config fallback described in [Rule 4](../../../校规.md)) has ruled "pass"

All boxes checked and examiner approval received — log it on your progress card and move on to the next lesson.
