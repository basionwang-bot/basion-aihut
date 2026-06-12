> 🌐 English ｜ [中文](../../automation/A02-automatisch.md)

# Lesson A02 · Automatisch: Build Your First "When A Happens, Do B" Automation from Scratch

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source: [github.com/automatisch/automatisch](https://github.com/automatisch/automatisch) (approx. 13.9k ⭐, AGPL-3.0, v0.15.0)

---

⚠️ **College-wide safety baseline (repeated at the start of every lesson)**

Tools like this **connect to real accounts and can send real emails or modify real data**. Three non-negotiable rules:
1. **Start with a test account or sandbox** — do not connect production accounts on day one;
2. **Add a human-confirmation node before any destructive action (send / delete)** — let your principal review before it fires;
3. **Ask your principal before connecting any production account** — get explicit consent first.

When granting an AI access to external capabilities, always use the minimum permissions needed.

---

## 📖 What you'll learn

Have you ever envied the magic of Zapier — "when A happens, automatically do B"? Every incoming email auto-saved to a spreadsheet, every post automatically synced across platforms…

**Automatisch is an open-source, self-hosted Zapier alternative** — you bring that same magic onto your own server. Your data never leaves your infrastructure, never sits in someone else's cloud, and you never have to worry about a privacy breach. For scenarios involving sensitive data or teams that want full data ownership, this is an excellent choice.

Honest caveat: **Automatisch is a growing project**. It currently has a few dozen integration connectors (far fewer than Zapier's 6,000+), and its release cadence is moderate (roughly one release every three months — v0.15.0 shipped in August 2025). Features are being added steadily, but the ecosystem is not yet as mature as n8n's. The core reason to choose it is: **it is the simplest, most Zapier-like, most beginner-friendly automation tool available**.

By the end of this lesson you'll be able to:
- Get Automatisch running locally in under 5 minutes using Docker
- Understand the "Trigger → Action" core concept
- Build your first real "when A happens, do B" automation workflow

**Official resources:**
- Repository: [github.com/automatisch/automatisch](https://github.com/automatisch/automatisch)
- Website: [automatisch.io](https://automatisch.io)
- Docs: [automatisch.io/docs](https://automatisch.io/docs)

---

## 🧠 Core principles

1. **Trigger + Action = the entire logic of automation.** Imagine a motion-sensor light you install at home: someone walks by (trigger) → the light turns on (action). Every automation in Automatisch works exactly like this: one "when / under what conditions" trigger, plus one or more "then go do this" actions. That's all there is.

2. **Your data stays home.** Automatisch's core value proposition: all data is stored on your own server, meeting GDPR compliance requirements. If your principal is sensitive about data privacy — for example, handling customer information or internal files — Automatisch is safer than cloud-based services.

3. **The license is AGPL-3.0 — understand what that means.** AGPL-3.0 is an open-source license, but it has a "copyleft" (viral) clause: if you modify it and offer it as a public service, you must also open-source your modifications. **Personal use and internal use** are completely fine. If you plan to offer it as a commercial external service, check with your principal first. A commercial license is available for enterprise use. *(Not legal advice — review the license text yourself before any commercial use.)*

4. **Connector count is limited — verify before assuming.** Automatisch has far fewer connectors than n8n or Zapier right now. Before building a workflow for a particular platform, check the official docs to confirm it's supported. Don't assume "it probably has it."

5. **Get your principal's approval before installing or connecting accounts.** Docker Compose will create a local database and service processes — confirm with your principal first. Connecting external OAuth accounts (GitHub, Slack, Twitter, etc.) requires your principal to complete the OAuth authorization flow themselves.

---

## 🛠 How-to

### Start Automatisch with Docker Compose

Automatisch's official deployment method is Docker Compose. Verify Docker and Docker Compose are installed first:

```bash
docker --version
docker compose version
```

> ⚠️ **Get your principal's approval before installing Docker.**

Clone the repository and start the services:

```bash
git clone https://github.com/automatisch/automatisch.git
cd automatisch
docker compose up
```

Wait for images to download and containers to start (the first run may take a few minutes). When you see a log line like `Server is running on port 3000`, the service is ready.

Open a browser to:

```
http://localhost:3000
```

**Default login credentials:**
- Email: `user@automatisch.io`
- Password: `sample`

> ⚠️ **Change the default password immediately after logging in!** Go to Settings → Profile and replace the default password. Leaving it as-is is the equivalent of leaving the front door wide open.

> 🌐 **Docker image tip:** If pulling images is slow, configure a Docker registry mirror (e.g., your cloud provider's mirror, or a Docker Hub pull-through cache).

### Understanding the interface

After logging in, the main interface looks roughly like this:

```
Left navigation:
├── Flows  (workflow list)
├── Connections  (connected external accounts)
├── Admin  (admin settings)
└── ...

Center content area:
- Workflow editor: Trigger → Action → Action...
```

- **Connections:** First connect your external service accounts here (think of it as "plugging in the cables")
- **Flows:** Then create workflows here, referencing the accounts you've already connected

### Connecting external service accounts

Before creating a workflow, connect the accounts you'll need:

1. Go to **Connections** in the left navigation → **Add connection**
2. Select a service (e.g. GitHub, Slack, Twitter, etc.)
3. Click **Connect** — you'll be redirected to that service's OAuth authorization page
4. **Your principal completes the authorization** — this step cannot be done by you, because it requires your principal's account credentials

> ⚠️ **OAuth authorization must be performed by your principal.** You can help them find the right screen and explain what each step is doing, but you cannot enter account credentials or click Authorize on their behalf.

### Creating your first automation workflow

Here's an example: "New GitHub Issue → push a Slack notification" (assuming your principal has already connected both accounts):

**Step 1: Create a new Flow**

1. Click **Flows** in the left navigation → **Create Flow**
2. Give the Flow a name, e.g. "GitHub Issue Alerts"

**Step 2: Set up the trigger**

1. Click "+" on the canvas to choose a trigger
2. Select **GitHub** → **New Issue**
3. Choose the GitHub account you already connected
4. Select the repository you want to monitor
5. Save

**Step 3: Set up the action**

1. Click "+" below the trigger to add an action
2. Select **Slack** → **Send Message**
3. Choose the connected Slack account and the target channel
4. In the message body you can use data from the trigger, such as the `{{issue.title}}` variable
5. Save

**Step 4: Activate the Flow**

After editing, find the Flow's toggle switch and set the status to **Active**. The Flow will now start listening.

> ⚠️ **Make sure your principal knows before activating a Flow:** In Active state the Flow will make real calls to external services. During testing, make sure the trigger conditions won't accidentally generate a flood of noise.

### Automatisch connector reference

The list of supported connectors is growing. **Check the latest list at:**
- [automatisch.io/docs/apps](https://automatisch.io/docs/apps) or browse the `packages/backend/src/apps/` directory in the repository

> 📌 **Important reminder:** Automatisch has a limited number of connectors. If the service you need isn't on the list, this lesson's approach may not apply — consider A03 (Activepieces, 280+) or A04 (n8n, 400+) instead.

### Safety confirmation checklist

```
□ Got principal's approval before running docker compose up
□ Changed the default password (no longer "sample")
□ OAuth authorization for external accounts was completed by the principal personally
□ Told the principal what a new Flow will do before activating it
□ Using test accounts / test channels during testing — not connected to production
□ Understand the meaning of AGPL-3.0; check with principal before offering it as a commercial external service
```

---

## 📝 Graduation quiz (must actually do it — provide evidence)

**Task: get Automatisch running in 5 minutes and build your first real workflow.**

**Phase 1: Conceptual (can be done first)**

1. **Explain the "Trigger + Action" model:** Use an everyday life scenario as an analogy — explain what this pair of concepts means. You are not allowed to use the phrase "when A happens execute B" — use a picture, a story.

2. **Honestly assess Automatisch's use cases:** Compared with Zapier and n8n, where does it shine? Where does it fall short? In what situation would you recommend your principal use it, and when would you suggest switching to n8n instead?

3. **Explain the key points of AGPL-3.0:** What does "viral" / copyleft mean? Personal use is fine, but under what circumstances does your principal need to pay extra attention?

**Phase 2: Hands-on (requires your principal to have confirmed Docker is installed)**

> ⚠️ **Get your principal's confirmation that Docker is installed before starting this phase.**

4. **Start Automatisch:** Run `docker compose up`, wait for the service to be ready, and confirm you can see the login page at `http://localhost:3000`. Screenshot as proof.

5. **Change the default password:** Go to Settings and change the password. Screenshot the success confirmation.

6. **Connect at least one external service account** (your principal completes the OAuth authorization): Show the connected service on the Connections page. Screenshot as proof.

7. **Create and activate a workflow:** Connect a trigger to at least one action, and screenshot the Flow editor. Manually trigger it once (if supported) and show the execution result.

8. **Deposit a skill card:** Distill "Automatisch start command + workflow creation steps + connector lookup method + safety checklist" into `skills/automatisch.md`.

> ⚠️ **Safety reminders:**
> - `docker compose up` — **get your principal's approval before running**
> - OAuth account authorization — **must be completed by your principal; you cannot do it on their behalf**
> - Activating a Flow — **tell your principal before activating and explain what actions it will trigger**
> - Default password `"sample"` — **must be changed immediately after first login**

---

## 🎓 Passing criteria

- [ ] You can explain "Trigger + Action" using a real-life analogy that a newcomer would instantly understand
- [ ] You have honestly described Automatisch's limitations (connector count, release cadence) — not just the positives
- [ ] You have explained the core meaning of the AGPL-3.0 license
- [ ] You successfully started Automatisch locally and changed the default password (screenshot as proof)
- [ ] You created and activated at least one workflow (screenshot as proof)
- [ ] You have deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent examiner** (fresh-context sub-agent, or the low-config fallback described in [Rule 4](../../../校规.md)) has ruled "pass"

All boxes checked and examiner approval received — log it on your progress card and move on to the next lesson.
