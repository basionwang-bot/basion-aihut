> 🌐 English ｜ [中文](../../build/B04-nocodb.md)

# Lesson B04 · NocoDB: Turn Your Database Into Airtable — Self-Hosted, No-Code Data Management

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T31 (Docker) ｜ Difficulty: ★★ ｜ Source: nocodb/nocodb · [github.com/nocodb/nocodb](https://github.com/nocodb/nocodb)

---

## 📖 What you'll learn

Airtable is great, but it stores your data on someone else's servers. The free tier is limited, and advanced features cost a monthly subscription.

NocoDB is the **open-source, self-hosted version of Airtable** — GitHub ~63.4k ★. Install it on your own machine or server and you get an interface nearly identical to Airtable: spreadsheets, forms, kanban boards, galleries, calendars… with your data 100% under your own control, completely free.

After this lesson you'll be able to:
1. Start NocoDB with a single Docker command
2. Turn a dataset (Excel/CSV or manually entered) into a NocoDB table
3. Build a form to collect data and a kanban board to manage status
4. Know exactly where the line is between "local testing" and "publicly collecting real data"

> 🌍 **International users:** NocoDB is fully open-source and Docker self-hostable, with no external account or VPN required. The interface supports multiple languages including English. It can replace Airtable for almost all small-to-medium team data management needs.

**Official resources:**
- NocoDB repository: [github.com/nocodb/nocodb](https://github.com/nocodb/nocodb)
- Official docs: [docs.nocodb.com](https://docs.nocodb.com)

---

## 🧠 Core principles

1. **NocoDB = putting a "friendly face" on your database.** Picture this: underneath is a PostgreSQL or SQLite database (cold, raw tables and SQL commands). NocoDB wraps it in an Airtable-style friendly interface. Your team members don't need to know SQL — they open a browser and work with data like a spreadsheet.

2. **Views are NocoDB's magic.** The same data can take on different forms by adding a "view":
   - **Grid**: spreadsheet, shows all data
   - **Gallery**: image-card layout, great for product catalogs
   - **Kanban**: board view, great for status workflows (To Do → In Progress → Done)
   - **Form**: a shareable link for anyone to fill in and submit data
   - **Calendar**: calendar view, great for data with date fields

3. **Data lives on your own machine.** When started with Docker and a mounted local directory, the database file sits in the location you specify. This is what Airtable can't give you: data sovereignty.

4. **Shared forms = publicly collecting data.** NocoDB can generate a public link that anyone can use through a browser to submit records into your database. **Once this feature is enabled, real data flows into your system — ask your owner before sharing.**

5. **REST API is its hidden gem.** NocoDB auto-generates a REST API for every table, usable by external systems. **Connecting external systems is production-level usage — ask your owner first.**

---

## 🛠 How to use it

### Step 1: Start NocoDB with Docker

**SQLite version (local testing, simplest):**

```bash
docker run -d \
  --name noco \
  -v "$(pwd)"/nocodb:/usr/app/data/ \
  -p 8080:8080 \
  nocodb/nocodb:latest
```

After startup, open `http://localhost:8080/dashboard`.

Command notes:
- `-v "$(pwd)"/nocodb:/usr/app/data/`: mounts the `nocodb` folder in the current directory into the container — data persists locally
- `-p 8080:8080`: maps port 8080
- Uses SQLite, stored in the mounted directory — lightweight and simple, good for local testing and small teams

**PostgreSQL version (more stable for team use):**

```bash
docker run -d \
  --name noco \
  -v "$(pwd)"/nocodb:/usr/app/data/ \
  -p 8080:8080 \
  -e NC_DB="pg://host.docker.internal:5432?u=root&p=password&d=d1" \
  -e NC_AUTH_JWT_SECRET="569a1821-0a93-45e8-87ab-eb857f20a010" \
  nocodb/nocodb:latest
```

> ⚠️ **Get your owner's confirmation before starting.** Docker will pull an image, occupy a port, and create a data directory locally — tell your owner all of this first. The PostgreSQL version also requires a working PostgreSQL database. **`NC_AUTH_JWT_SECRET` must be replaced with a random string in production — never use the example value.**

### Step 2: First login and create a base

Go to `http://localhost:8080/dashboard`, create an admin account following the prompts, then click **+ New Base** to create a database and give it a name.

### Step 3: Import data or create tables manually

**Option A: Import Excel/CSV (fastest)**

1. Inside your Base, click **+ → Upload File** in the top-left
2. Upload a `.xlsx` or `.csv` file
3. NocoDB auto-detects column names and data types and creates the corresponding table and data

**Option B: Create tables manually**

1. Click **+ New Table**, enter a table name
2. Click **+** to add fields and choose field types:
   - Single-line text, long text, number, currency, percentage
   - Date, checkbox, dropdown, multi-select tags
   - Attachment, link (foreign key relationship)

### Step 4: Add different views

In the left view list, click **+ Add view** and choose from:
- **Gallery**: click **+ Add view → Gallery**, select an image field as the cover
- **Kanban**: choose a dropdown or single-select field as the "column grouping field" (e.g. a status field: To Do / In Progress / Done)
- **Form**: auto-generates a shareable fill-in link

### Step 5: Build a data collection form

1. In the view list click **+ Add view → Form**
2. Drag fields to reorder them; hide any fields you don't want respondents to see
3. Click **Share Form** to get a public link

> ⚠️ **Ask your owner before sharing the form** — a public link means anyone can write data to your database. Make sure your owner knows and agrees.

### ⚠️ Safety boundaries

**A no-code/AI tool the moment it "connects to a real database, uses a production key, or goes public" stops being a toy and becomes a real system. Three things — connecting real data, going public, and incurring costs — all require an explicit "ask the owner first":**

```
□ Starting Docker — get your owner's confirmation; explain port and local storage usage
□ Sharing the form public link — ask your owner; public means external parties can write to your database
□ Enabling REST API for external systems — ask your owner; this is production-level integration
□ Exposing NocoDB to the public internet — ask your owner; HTTPS and security config required
□ In production, NC_AUTH_JWT_SECRET must be changed to a random value — tell your owner; never use the example value
```

---

## 📝 Graduation test (must be done for real — submit evidence)

**Task: turn a real or simulated dataset into a NocoDB multi-view database and demonstrate at least 3 view types.**

**Phase 1: Start up**

1. Start NocoDB using the SQLite Docker command. Screenshot showing `http://localhost:8080/dashboard` has loaded.
2. Create an admin account and log in. Screenshot the main interface.

**Phase 2: Import and create tables**

3. Prepare a mock dataset (e.g. 20 product records with name/price/stock/category/status). Import via CSV or create tables manually. Screenshot showing the data in Grid view.

**Phase 3: Build multiple views (inform your owner before operating)**

4. Based on the same table, create the following views and screenshot each:
   - **Gallery view**: select a text field as the title display
   - **Kanban view**: group by the "status" field, showing a card-based board
   - **Form view**: generate a fill-in form (screenshot the form interface — **do not share the public link**)

**Phase 4: Summarize**

5. In your own words: what practical problem can this NocoDB database solve for a small team? What advantages does it have over a plain Excel spreadsheet?

**Phase 5: Consolidate**

6. **Write a skill card**: distill "NocoDB Docker startup command + table creation/import steps + view type descriptions + safety boundaries" into `skills/nocodb.md`.

---

## 🎓 Graduation criteria

- [ ] You successfully started NocoDB with Docker and logged in, with screenshot evidence
- [ ] You imported or manually created at least 20 data records
- [ ] You showed screenshots of Grid / Gallery / Kanban — three view types
- [ ] You can explain the security risk of NocoDB's Form view "share form" feature, and why you need to ask your owner first
- [ ] You completed all 5 items on the safety boundaries checklist
- [ ] You have added 1 skill card to your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-fi fallback per [School Rules §4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it on your report card and move on.
