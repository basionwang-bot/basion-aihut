> 🌐 English ｜ [中文](../../build/B03-tooljet.md)

# Lesson B03 · ToolJet: No-Code Business Back-Office — Even a Small Shop Can Have Its Own Admin System

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, T31 (Docker) ｜ Difficulty: ★★★ ｜ Source: ToolJet/ToolJet · [github.com/ToolJet/ToolJet](https://github.com/ToolJet/ToolJet)

---

## 📖 What you'll learn

You've seen those custom-built internal management systems that cost tens of thousands — the kind small teams simply can't afford. Inventory tracking, customer management, order status… for small shops and small teams, those things might as well be luxury items.

ToolJet is here to change that. It is a **no-code/low-code internal tool builder**: drag and drop for a few hours and you have a real, usable admin back-office — connect your database or spreadsheet, control create/read/update/delete, set permissions, collaborate with teammates.

ToolJet is the leading open-source project in the "internal tool builder" category on GitHub (comparable to Retool and Appsmith). The Community Edition is free to self-host; the Enterprise Edition is paid.

After this lesson you'll be able to:
1. Start ToolJet with a single Docker command
2. Build an inventory-tracking or customer-management back-office (using the built-in database — no extra setup required)
3. Know exactly where the line is between "playing locally" and "a production system used by the whole team"

> 🌍 **International users:** ToolJet Community Edition is fully open-source and Docker self-hostable. The interface is in English and fully supports Unicode input. The built-in ToolJet Database is PostgreSQL-based and stores data on your own server.

**Official resources:**
- ToolJet repository: [github.com/ToolJet/ToolJet](https://github.com/ToolJet/ToolJet)
- Official docs: [docs.tooljet.com](https://docs.tooljet.com)

---

## 🧠 Core principles

1. **ToolJet = a LEGO-style back-office builder.** Imagine a box of building blocks — buttons, tables, forms, charts, dropdowns… 60+ UI components. Drag them onto a canvas, connect a data source, and you have a real management interface. No HTML, no CSS — logic is wired up through a visual flow editor.

2. **Data sources are its "blood vessels."** ToolJet's power comes from its connectors — it can link directly to PostgreSQL, MySQL, MongoDB, REST APIs, Google Sheets, and more. You're not working with fake data; you're operating real data. This is also where the safety boundary comes in: **the moment you connect a real database, it's no longer a toy.**

3. **The built-in database lowers the barrier to entry.** ToolJet ships with a no-code database called **ToolJet Database** (PostgreSQL-based). You can create tables and enter data directly in the interface, with no extra database software to install. Use this for getting started — no need to wrestle with PostgreSQL.

4. **Multi-user collaboration is its strong suit.** ToolJet supports inviting team members and setting role-based permissions (Admin / Developer / Viewer), making it genuinely suitable for a small team sharing one back-office. **But "sharing" means multiple people operating real data — confirm permissions with your owner before going live.**

5. **Community Edition vs. Enterprise Edition.** The Community Edition (CE) is free and open-source and is sufficient for small teams. The Enterprise Edition adds SSO, audit logs, custom SAML, and other enterprise features. This lesson covers the CE only.

---

## 🛠 How to use it

### Step 1: Start ToolJet with Docker

```bash
docker run \
  --name tooljet \
  --restart unless-stopped \
  -p 80:80 \
  --platform linux/amd64 \
  -v tooljet_data:/var/lib/postgresql/13/main \
  tooljet/try:ee-lts-latest
```

Command notes:
- `--name tooljet`: names the container for easy management
- `--restart unless-stopped`: auto-restarts after a system reboot
- `-p 80:80`: maps the container's port 80 to host port 80
- `-v tooljet_data:/var/lib/postgresql/13/main`: persists data to a local Docker volume — data survives even if the container is removed

After startup, open `http://localhost:80` in your browser. If you see the registration/login page, it worked.

> ⚠️ **Get your owner's confirmation before starting.** Docker will pull an image (several hundred MB), occupy port 80, and create a data volume on your machine — tell your owner all of this first.
>
> If your owner's port 80 is already in use, change it to `-p 3000:80` and access `http://localhost:3000`.

### Step 2: Register your first admin account

Visit `http://localhost:80` and follow the prompts to register the first admin account. **This is a local account — all data lives on your own machine.**

### Step 3: Build an inventory back-office (using the built-in database)

**Create tables:**
1. Click **Database → ToolJet DB** in the left menu
2. Click **+ New Table** and create three tables:
   - `products`: fields `name (text)`, `stock (number)`, `price (number)`, `category (text)`
   - `customers`: fields `name (text)`, `phone (text)`, `note (text)`
   - `orders`: fields `customer_name (text)`, `product_name (text)`, `qty (number)`, `total (number)`, `status (text)`

**Build the interface:**
1. Click **Apps → + New App** in the left menu, name it "Inventory Back-Office"
2. Drag a **Table** component onto the canvas, connect it to the `products` table to show a product list
3. Drag a **Form** component to let users add new products
4. Add an event to the "Add" button: trigger a Query that inserts data into the `products` table
5. Repeat the above steps for the `customers` and `orders` tables

> **Tip: ToolJet has AI assistance.** In the Query editor you can describe what you want in natural language and let the AI generate the SQL — owners who don't know SQL can use it too.

### Step 4: Preview and share

Click the **Preview** button in the top-right corner to enter the real interactive interface and test adding, viewing, and deleting data.

To let team members use it: go to Settings → Members, invite them, and set their permission roles.

### ⚠️ Safety boundaries

**A no-code/AI tool the moment it "connects to a real database, uses a production key, or goes public" stops being a toy and becomes a real system. Three things — connecting real data, going public, and incurring costs — all require an explicit "ask the owner first":**

```
□ Starting the Docker container — get your owner's confirmation; explain port and disk usage
□ Connecting an external real database (MySQL/PostgreSQL) — ask your owner first; this is not a test environment
□ Letting team members access the system — ask your owner to confirm permissions before opening access
□ Exposing ToolJet to the public internet (deploying on a cloud server) — ask your owner; security config required
□ In production, change the default password and configure HTTPS — inform your owner; let them decide
```

---

## 📝 Graduation test (must be done for real — submit evidence)

**Task: locally build a working inventory or customer management back-office and screenshot actual data operations.**

**Phase 1: Start and configure**

1. Start ToolJet with the Docker command above. Screenshot the browser showing the ToolJet login/home page.
2. Register the admin account and log in. Screenshot the main ToolJet interface.

**Phase 2: Create tables and build the back-office (inform your owner first)**

> ⚠️ **Using ToolJet Database will write data to a local Docker volume — tell your owner first.**

3. Create at least 2 tables in ToolJet Database (e.g. `products` and `orders`). Screenshot showing the tables are created.
4. Manually add a few test records to the tables. Screenshot showing the data exists.
5. Build an App that includes at least one Table component (displaying data) and one Form component (adding data). Screenshot the App preview interface showing the table correctly displays data and the form successfully adds a new record.

**Phase 3: Explain yourself**

6. In your own words, describe: what real-world problem does the back-office you built solve? If it were serving a small shop, what could the shopkeeper do with it?

**Phase 4: Consolidate**

7. **Write a skill card**: distill "ToolJet Docker startup command + table creation steps + app building flow + safety boundaries" into `skills/tooljet.md`.

---

## 🎓 Graduation criteria

- [ ] You successfully started ToolJet with Docker and logged in, with screenshot evidence
- [ ] You created at least 2 tables in ToolJet Database and added test data
- [ ] You built an App with a data-display table + an add-new-record form, with screenshot proof of normal interaction
- [ ] You can explain in one sentence the difference between "ToolJet Database" and "connecting an external PostgreSQL," including the associated risks
- [ ] You completed all 5 items on the safety boundaries checklist
- [ ] You have added 1 skill card to your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-fi fallback per [School Rules §4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it on your report card and move on.
