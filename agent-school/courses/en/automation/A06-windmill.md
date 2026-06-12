> 🌐 English ｜ [中文](../../automation/A06-windmill.md)

# Lesson A06 · Windmill: Turn a Python/TypeScript Script into a Scheduled or Webhook-Triggered Service

> **Student: you (AI agent, currently enrolled)** ｜ Prerequisites: J01–J07 + A01–A05 ｜ Difficulty: ★★★★★ ｜ Source: [github.com/windmill-labs/windmill](https://github.com/windmill-labs/windmill) (~16.7k ⭐, AGPLv3 + optional commercial license)

---

⚠️ **College-wide safety baseline (restated at the start of every lesson)**

Tools like these **connect to real accounts and can send real emails or modify real data**. Three ironclad rules:
1. **Start with test accounts / sandboxes** — never hook up production accounts right away;
2. **Add a human-confirmation node before any critical action (send / delete)** — let your host review before it fires;
3. **Ask your host before connecting any production account** — get explicit approval.

Always grant AI the minimum permissions it needs.

---

## 📖 What You Will Learn

The first five lessons all focused on "drag-and-connect" automation — well suited for low-code or no-code scenarios. Lesson A06 crosses a new threshold: **using code to drive automation**.

Windmill's pitch is this: you have an existing Python or TypeScript script that produces the results you want — but it only runs manually on your own machine. **Windmill wraps that script in a shell** — giving it a web interface, scheduled execution, Webhook-triggered execution, and a button non-technical hosts can click to run it — **without you needing to write a server, configure cron, or set up an API endpoint**.

An analogy: you wrote a script that "auto-organises a folder." Before Windmill, running it meant opening a terminal and typing a command every time. Windmill gives that script a web wrapper — your host clicks a button in the browser and the script runs; or you set a timer and it runs automatically every night; or when someone sends a request to a certain URL, the script is triggered.

Languages Windmill supports: Python, TypeScript, Go, Bash, SQL, GraphQL, PowerShell, Rust.

After this lesson you will be able to:
- Deploy Windmill with Docker Compose
- Publish a script as a Script and give it Webhook-triggered execution
- Set up a Schedule to run a script automatically on a timetable
- Chain multiple scripts together into a Flow workflow

**Official resources:**
- Repository: [github.com/windmill-labs/windmill](https://github.com/windmill-labs/windmill)
- Website: [windmill.dev](https://windmill.dev)
- Docs: [windmill.dev/docs](https://windmill.dev/docs)

---

## 🧠 Core Principles

1. **Script is Windmill's smallest unit.** Every piece of code is a Script: it has a name, input parameters, and an output. Windmill automatically generates a web form from the script's parameters — your host does not need to read any code; they fill in the form and click run.

2. **Three trigger modes, three use cases.** Once you have written a Script you can:
   - **Manual run**: click the button in the Web UI — good for "on-demand operations"
   - **Schedule**: like cron — good for "recurring batch tasks"
   - **Webhook**: a POST request to a URL triggers execution — good for "being called by other systems"

3. **Flow = chaining multiple Scripts together.** For complex processes a single Script cannot handle, use a Flow to wire multiple Scripts in sequence — similar to the A01 Node-RED pipeline, but each node is a real piece of code logic.

4. **AGPLv3 license — understand the "copyleft" effect.** Windmill's core is AGPLv3, the same as A02's Automatisch: it has a copyleft effect. **Personal use and internal use are completely unrestricted.** However, if you offer a service to external users built on Windmill, any modifications you make must also be open-sourced; commercial deployments serving the public require a commercial license. Windmill's Community Edition can be used internally for free without restriction. (Not legal advice — review the license text before any commercial use.)

5. **Get your host's confirmation before installing, running scripts, or wiring Webhooks to external systems.** Scripts on Windmill can access the Resources (account credentials) your host has configured — that is significant access, and your host must be kept informed at every step.

---

## 🛠 Key Operations

### Deploy Windmill with Docker Compose

```bash
# Download the three configuration files
curl https://raw.githubusercontent.com/windmill-labs/windmill/main/docker-compose.yml -o docker-compose.yml
curl https://raw.githubusercontent.com/windmill-labs/windmill/main/Caddyfile -o Caddyfile
curl https://raw.githubusercontent.com/windmill-labs/windmill/main/.env -o .env

# Start the services
docker compose up -d
```

> ⚠️ **Get your host's confirmation before starting.** Windmill spins up a Windmill Server, one or more Workers (the processes that execute scripts), and a PostgreSQL database.

Once the services are ready, open your browser to:

```
http://localhost
```

**Default login credentials:**
- Email: `admin@windmill.dev`
- Password: `changeme`

> ⚠️ **Change the password immediately after logging in!** `changeme` is a well-known default — leaving it in place is the equivalent of leaving your front door unlocked.

> 🌐 **Config file tip:** If downloading from GitHub raw is slow in your region, you can manually copy the file contents from the repository and save them locally.

### Understanding the Windmill interface

```
Left navigation:
├── Scripts     (script library)
├── Flows       (workflows)
├── Apps        (auto-generated Web UIs)
├── Schedules   (scheduled tasks)
├── Resources   (external account credentials)
└── Variables   (environment variables / secrets)

Key concepts:
- Workspace: a working space, similar to a "project"
- Script:    a runnable piece of code
- Flow:      a workflow of multiple chained Scripts
- Resource:  stored credentials (e.g. database connections, API keys)
```

### Write your first Script

This is the most fundamental operation in Windmill. We will write a Python script that fetches data from an API, filters it, and returns the result.

**Create a new Script in Windmill:**

1. Left navigation → **Scripts** → **New Script**
2. Name the script, e.g. `fetch_and_filter`
3. Select language **Python 3**
4. Write the code in the editor:

```python
# Windmill Python script structure
# The entry function must be named main; its parameters become the web form fields

import requests

def main(
    api_url: str,           # Parameter 1: API endpoint URL
    keyword: str = "",      # Parameter 2: filter keyword (optional, has a default)
    limit: int = 10         # Parameter 3: maximum number of results to return
):
    """
    Fetch data from the given API, filter by keyword, and return results.
    """
    response = requests.get(api_url)
    response.raise_for_status()
    
    data = response.json()
    
    # If a keyword was provided, keep only items that contain it
    if keyword:
        if isinstance(data, list):
            data = [item for item in data
                    if keyword.lower() in str(item).lower()]
    
    # Cap the number of results
    result = data[:limit] if isinstance(data, list) else data
    
    return {"count": len(result) if isinstance(result, list) else 1,
            "data": result}
```

5. Click **Save**

Windmill **automatically generates a web form from the `main` function's parameters** — `api_url` becomes a text input, `limit` becomes a number input. Your host never needs to see the code; they fill in the form and click run.

> 📌 **Key rule:** The entry function in a Windmill Python script must be named `main` (other languages follow the same pattern). Windmill analyses the function signature to generate the UI and handle parameters.

### Add a Webhook trigger to a Script

After saving a Script, Windmill automatically generates a Webhook URL for it:

1. Go to the Script's detail page
2. Click the **Webhooks** tab
3. You will see a POST endpoint in the format:
   ```
   http://localhost/api/w/{workspace}/jobs/run/p/{script_path}
   ```
4. Requests must include an authentication token: add the header `Authorization: Bearer {YOUR_TOKEN}`

**Generate a token:**
1. Click your avatar (top-right) → **Account Settings**
2. Find **Tokens** → generate a new token

> ⚠️ **Tokens must be generated by your host** — this token grants permission to run scripts. Never expose it in a public location.

**Test the Webhook:**

```bash
curl -X POST \
  "http://localhost/api/w/default/jobs/run/p/u/admin/fetch_and_filter" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"api_url": "https://jsonplaceholder.typicode.com/posts", "limit": 3}'
```

> ⚠️ **Use a publicly accessible API for testing (e.g. jsonplaceholder.typicode.com)** — do not point at real services that require authentication.

### Set up a scheduled task (Schedule)

Have a script run automatically once a day:

1. Left navigation → **Schedules** → **New Schedule**
2. Select the Script you want to schedule
3. Enter a cron expression:
   ```
   0 9 * * *    # Every day at 09:00 UTC
   0 */6 * * *  # Every 6 hours
   30 8 * * 1   # Every Monday at 08:30 UTC
   ```
4. Set the parameter values the script should receive at runtime
5. Enable the Schedule

> 🌐 **Timezone note:** Windmill defaults to UTC. Adjust your cron times to match your local timezone — for example, if you want 9 AM in UTC+5:30 (IST), use `0 3:30 * * *`; for UTC+9 (JST), 9 AM local = `0 0 * * *`. You can change the workspace timezone in Workspace settings.

### Chain multiple Scripts into a Flow

Flow is Windmill's pipeline feature:

1. Left navigation → **Flows** → **New Flow**
2. Add steps: each step can be an existing Script or new inline code
3. Data passes between steps: the previous step's output `results.step1.data` can be used as the next step's input
4. Supports branching (If/Else), looping (For Each), and parallel execution

Example three-step Flow:
```
[Step 1: Fetch data] → [Step 2: AI processing (call LLM API)] → [Step 3: Write to database]
```

### Safety checklist

```
□ docker compose up -d confirmed with host before running
□ Default password changeme changed immediately after login
□ Webhook token generated by host, not exposed in a public location
□ Credentials used by scripts stored in Windmill Resources (not hardcoded)
□ Host informed before setting up any scheduled task: what it does and how often
□ Script run with test data or a test account on first execution
□ AGPLv3 copyleft implications understood; license reviewed before offering any public-facing service
□ Host's explicit confirmation obtained again before production deployment
```

### Best practice: store credentials in Resources — never hardcode them

**Wrong approach** — credentials baked into the code:
```python
def main():
    api_key = "sk-xxxxxxxx"  # ❌ Never do this
```

**Correct approach** — use Windmill Variables / Resources:
```python
import wmill  # Windmill built-in library

def main():
    # Safely read from a Windmill variable
    api_key = wmill.get_variable("u/admin/MY_API_KEY")
    # Or use a typed Resource
```

Store sensitive values in **Variables** via the Windmill dashboard; scripts read them with `wmill.get_variable()`. Credentials are encrypted at rest and will never appear in code history.

---

## 📝 Graduation Quiz (must be done for real — submit evidence)

**Task: publish a script as a Windmill Script, make it triggerable via Webhook, and set it up to run on a schedule.**

**Phase 1: Understanding (can be done first)**

1. **Explain Windmill's three trigger modes**: what real-world scenario fits manual / Schedule / Webhook best? Give one concrete life-like example for each.

2. **Explain the AGPLv3 "copyleft" effect**: what is the difference between personal internal use and "offering a service to external users"? Give one specific scenario that would require purchasing a commercial license.

3. **Why credentials must never be hardcoded**: what are the risks of putting an API key directly in code? How does Windmill Variables solve those risks?

**Phase 2: Hands-on (requires host to confirm installation)**

> ⚠️ **Get your host's confirmation to install Docker before starting this phase.**

4. **Start Windmill**: run the three `curl` commands to download the config files, then `docker compose up -d`. Screenshot the main interface at `http://localhost` after logging in.

5. **Change the default password**: screenshot the confirmation message after successfully changing the password.

6. **Write a Python Script and publish it**: write a `main` function with at least 2 parameters that performs a meaningful operation (e.g. fetch data from a public API, process a string, etc.). Screenshot the web form Windmill automatically generates.

7. **Run it manually once**: fill in the form parameters, click run, then screenshot the job result page (showing input parameters and output).

8. **Get the Webhook URL and test it with curl**: have your host generate a token, then send a POST request with curl to trigger the script. Screenshot the curl command and the returned Job ID.

9. **Set up a Schedule**: configure the script to run automatically at a specific time each day. Screenshot the Schedule configuration page.

10. **Create a skill card**: capture "Windmill startup command + Script format rules + Webhook call syntax + Schedule cron patterns + AGPLv3 explanation + safety checklist" as `skills/windmill-script.md`.

> ⚠️ **Safety boundaries — a reminder:**
> - `docker compose up -d` — **get host's confirmation before running**
> - Default password `changeme` — **change immediately after first login**
> - Webhook token — **host generates it; never commit to git**
> - Credentials — **use Windmill Variables; never hardcode**
> - Scheduled tasks — **inform host of the frequency and what it will do before enabling**

---

## 🎓 Completion Criteria

- [ ] You can explain Windmill's three trigger modes (manual / Schedule / Webhook) and their respective use cases
- [ ] You can explain AGPLv3 copyleft and articulate the boundary between personal internal use and public commercial service
- [ ] You understand why credentials should be stored in Variables, not hardcoded
- [ ] You successfully started Windmill locally and changed the default password (screenshots on file)
- [ ] You wrote a correctly formatted Python Script that runs in Windmill (screenshots on file)
- [ ] You successfully triggered the script via Webhook (curl) (screenshots on file)
- [ ] You set up a Schedule for automated execution (screenshots on file)
- [ ] You deposited 1 skill card in your dorm's [`skills/`](../../../skills/)
- [ ] An **independent examiner** (fresh-context sub-agent, or the fallback described in [School Rules §4](../../../校规.md)) has marked this "passed"

All boxes checked and examiner approved — log it on your progress card and move on to the next lesson.
