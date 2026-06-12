> 🌐 English ｜ [中文](../../build/B05-plane.md)

# Lesson B05 · Plane: Open-Source Project Management — Self-Host a Team Board and Run Sprints

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T31 (Docker) ｜ Difficulty: ★★★ ｜ Source: makeplane/plane · [github.com/makeplane/plane](https://github.com/makeplane/plane)

---

## 📖 What you'll learn

Jira is too heavy — just figuring out the config takes half a day. Trello is too light — anything slightly complex slips through the cracks. Linear is great, but the monthly fee adds up and your data lives on their servers.

Plane is an **open-source project management tool**, GitHub ~50.7k ★ (AGPL 3.0), positioned as the modern open-source alternative to Jira/Linear. It has Issues (tasks), Cycles (Sprints), Modules, Views, Pages (docs), and Analytics — all self-deployable, with data you control.

After this lesson you'll be able to:
1. Get Plane running via Plane Cloud (free hosted) or Docker self-hosting
2. Create a project and set up a task list
3. Start a Cycle (Sprint) and run through a full iteration workflow
4. Know exactly where the boundary lies when self-hosting Plane for a real team

> 🌍 **International users:** Plane Cloud ([app.plane.so](https://app.plane.so)) is free to register — supports email or Google sign-in. The self-hosted version uses Docker Compose. The interface is in English throughout.

**Official resources:**
- Plane repository: [github.com/makeplane/plane](https://github.com/makeplane/plane)
- Plane Cloud (free hosted): [app.plane.so](https://app.plane.so)
- Self-hosting docs: [developers.plane.so/self-hosting/overview](https://developers.plane.so/self-hosting/overview)

---

## 🧠 Core principles

1. **Issues = task cards; everything builds on them.** Think of them as sticky notes — each note is a task (Issue) with a title, description, priority, assignee, due date, and labels. All the organizational tools (boards, Sprints, modules) are fundamentally just different ways of arranging these notes.

2. **Cycle = Sprint (iteration period).** Software teams talk about "what we're building this sprint." In Plane, that iteration period is called a Cycle. You drag a set of Issues into a Cycle, set start and end dates, and Plane automatically draws a **burn-down chart** — a visual showing how much work remains and whether you're on track to finish on time.

3. **Module = sub-module within a project.** Say you're building an app — you might create three Modules: User System, Payment, Push Notifications. Each Module manages a group of related Issues, making it easy to report progress by feature area.

4. **Views = filters + custom perspectives.** The same Issues can have multiple Views: "Tasks assigned to me," "Due this week," "High-priority, incomplete"… Each view is a saved set of filter conditions — no need to keep searching.

5. **Pages = the team's shared notebook.** Plane has built-in document support for meeting notes, product requirements, and discussion records, with the ability to cross-reference Issues. AI-assisted writing is also available here.

---

## 🛠 How to use it

### Option A: Plane Cloud (fastest — no deployment required)

Go to [app.plane.so](https://app.plane.so) and register a free account.

> Plane Cloud registration supports email and Google sign-in. No credit card required; the free tier is sufficient for individuals and small teams.

### Option B: Docker Compose self-hosting

The official recommended self-hosting method uses Docker Compose. Full steps are at [developers.plane.so/self-hosting/methods/docker-compose](https://developers.plane.so/self-hosting/methods/docker-compose).

Core steps (confirm with your owner before running the following commands):

```bash
# Download the official deployment script
curl -fsSL https://raw.githubusercontent.com/makeplane/plane/master/deploy/selfhost/install.sh | sed 's/update_host/# update_host/g' | bash

# Enter the generated directory
cd plane-selfhost

# Edit the .env file (configure domain, secret keys, etc.)
# Must change: SECRET_KEY (replace with a random string)
# Optional: WEB_URL (set your domain or IP)

# Start
docker compose up -d
```

> ⚠️ **You must inform your owner before self-hosting:**
> - Pulling images and starting up takes time and uses disk space and memory
> - `SECRET_KEY` must be changed to a random value before any production use
> - Public access requires firewall and HTTPS configuration
> - Self-hosting means your owner is responsible for maintenance and backups

### Step 1: Create your first Workspace and Project

1. After logging in, create a **Workspace** (your organization or company name).
2. Click **+ Create Project** and fill in:
   - Project name (e.g. "Q3 2024 Product Sprint")
   - Identifier (3 letters — prefix for Issue numbers)
   - Access level (Secret = visible to members only)

### Step 2: Create Issues

1. Go into the project, click **Issues → + Create Issue**
2. Fill in the title, description (supports rich text and file uploads)
3. Set:
   - **State**: Backlog / Todo / In Progress / Done / Cancelled
   - **Priority**: Urgent / High / Medium / Low / None
   - **Assignees**: specify who's responsible
   - **Due Date**: deadline

Aim to create 10–15 Issues covering different states and priorities — you'll need them for the Cycle exercise below.

### Step 3: Start a Cycle (Sprint)

1. Click **Cycles → + New Cycle** in the left menu
2. Enter a Cycle name (e.g. "Sprint 1"), start date, and end date (1–2 weeks recommended)
3. Go into the Cycle detail and drag in the relevant Issues (or click **+ Add Issues**)
4. Click **Analytics** to view the burn-down chart — it updates in real time showing remaining workload

### Step 4: Update Issue states, advance the Sprint

Drag Issues from "Todo" to "In Progress," and when finished drag them to "Done." Watch the burn-down chart change.

### Step 5: Sprint wrap-up

At the end of the Cycle:
- Incomplete Issues can be "transferred" to the next Cycle
- Screenshot the Cycle's Analytics page as data for the Sprint retrospective

### ⚠️ Safety boundaries

**A no-code/AI tool the moment it "connects to a real database, uses a production key, or goes public" stops being a toy and becomes a real system. Three things — connecting real data, going public, and incurring costs — all require an explicit "ask the owner first":**

```
□ Self-hosting with Docker Compose — get your owner's confirmation; explain resource usage and maintenance responsibility
□ Inviting real team members to the Workspace — ask your owner; confirm data is ready to be visible to members
□ Exposing self-hosted Plane to the public internet (public IP/domain) — ask your owner; HTTPS and security config required
□ SECRET_KEY in production must be changed to a random value — tell your owner; cannot use the default value
□ If your owner records sensitive information in Plane Pages (business plans, salaries, etc.) — confirm access permissions are correctly configured
```

---

## 📝 Graduation test (must be done for real — submit evidence)

**Task: build a complete project in Plane, run through one full Cycle (Sprint), and submit screenshot evidence.**

**Phase 1: Get started**

1. Register a Plane Cloud account ([app.plane.so](https://app.plane.so)) — recommended, fastest — or start self-hosted. Screenshot showing you are logged in.
2. Create a Project. Screenshot showing the project has been created.

**Phase 2: Create a task list**

3. Create at least 10 Issues in the project, covering different priorities (High/Medium/Low) and states (Backlog/Todo/In Progress). Screenshot the Issues list.

**Phase 3: Run a Cycle**

4. Create a Cycle (set the start/end dates to this week or the next 2 weeks), add 5–8 Issues. Screenshot the Cycle detail and the added Issues.
5. Change 2–3 Issues to "In Progress," then change 1–2 to "Done." Screenshot the updated Cycle burn-down chart (Analytics).

**Phase 4: Explain yourself**

6. In your own words: what is the difference between a Cycle and a Module? What scenarios does each suit?

**Phase 5: Consolidate**

7. **Write a skill card**: distill "Plane quick-start steps + Cycle workflow + core concept comparison table (Issue/Cycle/Module/View) + safety boundaries" into `skills/plane.md`.

---

## 🎓 Graduation criteria

- [ ] You successfully created a Plane account and Project, with screenshot evidence
- [ ] You created at least 10 Issues spanning different states and priorities
- [ ] You created a Cycle and ran through one full iteration (including a burn-down chart screenshot)
- [ ] You can explain in your own words the difference between Issue / Cycle / Module / View
- [ ] You completed all 5 items on the safety boundaries checklist
- [ ] You have added 1 skill card to your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-fi fallback per [School Rules §4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it on your report card and move on.
