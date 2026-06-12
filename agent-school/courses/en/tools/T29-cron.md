> 🌐 English ｜ [中文](../../tools/T29-cron.md)

# Lesson T29 · cron: Running Tasks on a Schedule

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: GNU cron manual · [man7.org/linux/man-pages/man5/crontab.5.html](https://man7.org/linux/man-pages/man5/crontab.5.html) · crontab.guru · [crontab.guru](https://crontab.guru)

---

## 📖 What you'll learn

After this lesson, you'll be able to write a crontab expression that makes a script "run automatically every morning at 8 a.m.", "check something every 15 minutes", or "do a backup every Monday at midnight" — no more manually triggering things every single time.

Imagine you have a diligent assistant. You tell them: "Every morning at 8, email me today's weather report." You say it once and walk away. From that day on, they do it at 8 a.m. every single day — you never have to think about it again. cron is that **ever-punctual scheduling assistant** — you write the task and its timing into a crontab file, and from then on it fires automatically, with no further attention needed.

cron is the built-in task scheduler in UNIX systems, available on virtually every Linux server and macOS machine. No installation required, no code needed — just a config file (crontab) that tells it "what to run and when."

**Official resources:**
- crontab manual: [man7.org/linux/man-pages/man5/crontab.5.html](https://man7.org/linux/man-pages/man5/crontab.5.html)
- Online syntax validator: [crontab.guru](https://crontab.guru) (highly recommended — what-you-see-is-what-you-get)
- Modern alternative (systemd timers): [systemd.io/TIME_FORMAT/](https://systemd.io/TIME_FORMAT/)

---

## 🧠 Core principles (internalize these as habits)

1. **A cron expression is five fields, left to right: "minute hour day month weekday."** Memorize that order: **minute · hour · day · month · weekday**. `30 8 * * *` means "every day at 8:30". `0 0 * * 1` means "every Monday at 00:00". All five fields are required — none can be omitted.

2. **`*` means "every", and "every N" is written as `*/N`.** A bare `*` in the minute field means "every minute". `*/15` in the minute field means "every 15 minutes". `*/6` in the hour field means "every 6 hours".

3. **The cron environment is not your terminal environment — use full absolute paths.** When cron runs a command, `$PATH` is very limited and many commands can't be found. Either write **absolute paths** (`/usr/bin/python3 /home/user/script.py`) or explicitly set `PATH=` at the top of your crontab.

4. **All output is emailed by default (and silently discarded if no mail is set up) — redirect to a file to keep logs.** Appending `>> /home/user/cron.log 2>&1` sends both stdout and stderr to a log file. This tail is essentially required for every cron job.

5. **Test your script manually before adding it to cron.** When cron fails, you often won't notice immediately. The safe workflow: run the script by hand first to confirm it works, then add it to crontab. After adding it, wait for the next trigger time and check the log file to confirm it ran.

---

## 🛠 How to do it

### Basic crontab operations

> ⚠️ **Important: editing crontab affects scheduled system tasks. Reading it (read-only) is safe to do directly; adding, modifying, or deleting entries requires the owner's confirmation.**

```bash
# View the current user's crontab (read-only, safe)
crontab -l

# Edit crontab (opens an editor; changes take effect after saving)
crontab -e

# Delete all crontab entries (dangerous! do not run without explicit confirmation)
crontab -r
```

### cron expression format

```
┌───────────── minute (0-59)
│ ┌─────────── hour (0-23)
│ │ ┌───────── day of month (1-31)
│ │ │ ┌─────── month (1-12)
│ │ │ │ ┌───── day of week (0-7, both 0 and 7 = Sunday)
│ │ │ │ │
* * * * *  command to run
```

### Common time expressions quick reference (self-contained, verifiable)

| Meaning | cron expression | Plain English |
|---------|-----------------|---------------|
| Every minute | `* * * * *` | Runs once every minute |
| Every 5 minutes | `*/5 * * * *` | Runs at 0, 5, 10, 15 … minutes |
| Every 15 minutes | `*/15 * * * *` | Runs at 0, 15, 30, 45 minutes |
| Every day at 2 a.m. | `0 2 * * *` | Daily at 02:00 |
| Every day at 8:30 a.m. | `30 8 * * *` | Daily at 08:30 |
| Every Monday at midnight | `0 0 * * 1` | Monday 00:00 |
| 1st of every month at 9 a.m. | `0 9 1 * *` | First day of month, 09:00 |
| Weekdays (Mon–Fri) at 9 a.m. | `0 9 * * 1-5` | Monday through Friday, 09:00 |
| Every hour | `0 * * * *` | Every top of the hour |

### A complete crontab example

```bash
# Write the following into crontab -e:

# Set PATH (fixes "command not found" issues)
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# Run backup script every day at 07:00, log to backup.log
0 7 * * * /home/user/scripts/backup.sh >> /home/user/logs/backup.log 2>&1

# Check service status every 15 minutes
*/15 * * * * /usr/bin/python3 /home/user/scripts/check_service.py >> /home/user/logs/check.log 2>&1

# Clean up temp files every Monday at 00:30
30 0 * * 1 /bin/rm -rf /tmp/myapp_cache/* >> /home/user/logs/cleanup.log 2>&1
```

### Python script with timestamped logging (makes debugging easy)

```python
#!/usr/bin/env python3
# Save as /home/user/scripts/hello_cron.py
import datetime

with open("/tmp/cron_hello.log", "a") as f:
    f.write(f"[{datetime.datetime.now()}] cron triggered successfully!\n")
```

Corresponding crontab entry (fires every minute — good for quick verification):
```
* * * * * /usr/bin/python3 /home/user/scripts/hello_cron.py
```

Verification: wait 1 minute, then `cat /tmp/cron_hello.log` — you should see a timestamped line.

### macOS notes

macOS has both cron and `launchd` (Apple's own scheduler). For simple scheduled tasks, cron on macOS works fine. One important caveat: **cron does not fire while the Mac is asleep** — if you need tasks to run even when the machine is sleeping, use `launchd` instead.

### Timezone pitfall

cron uses the system timezone. Many cloud servers (e.g., AWS EC2, some Linux VPS providers) default to UTC. If you write `0 8 * * *` intending it to run at 8 a.m. local time but it runs at a different hour, the timezone is off. Check with `timedatectl` and set `TZ=Your/Timezone` in your script if needed.

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: design a scheduled script and write the corresponding crontab entries, plus a verification plan. (You may run the verification script yourself, but adding a new crontab entry requires the owner's confirmation.)**

**Step 1: write the test script (reads only local files — safe)**

```bash
cat > /tmp/cron_test_script.py << 'EOF'
#!/usr/bin/env python3
"""
On each run: appends one timestamped line to a log file.
"""
import datetime

LOG_FILE = "/tmp/cron_test.log"
now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

with open(LOG_FILE, "a") as f:
    f.write(f"[{now}] scheduled task triggered successfully\n")

print(f"Written to log: {LOG_FILE}")
EOF
chmod +x /tmp/cron_test_script.py
```

**Step 2: manually verify the script runs (no cron involved — safe)**
```bash
/usr/bin/python3 /tmp/cron_test_script.py
cat /tmp/cron_test.log
# Expected: one timestamped line in the log
```

**Step 3: write out the crontab entries (plan only — do not install yet)**

Provide crontab entries for three scenarios:

```bash
# Scenario 1: fire every minute (for debugging)
* * * * * /usr/bin/python3 /tmp/cron_test_script.py >> /tmp/cron_test.log 2>&1

# Scenario 2: fire every day at 8:30 (real-world use case)
30 8 * * * /usr/bin/python3 /tmp/cron_test_script.py >> /tmp/cron_test.log 2>&1

# Scenario 3: run a backup every Monday at 1 a.m.
0 1 * * 1 /usr/bin/python3 /tmp/cron_test_script.py >> /tmp/cron_test.log 2>&1
```

**Step 4: validate syntax (zero side effects — safe)**
```bash
# Validate online at https://crontab.guru
# Or explain each expression using Python

python3 -c "
exprs = {
    '* * * * *':    'every minute',
    '30 8 * * *':   'every day at 08:30',
    '0 1 * * 1':    'every Monday at 01:00',
    '*/15 * * * *': 'every 15 minutes',
}
for expr, meaning in exprs.items():
    print(f'{expr}  ->  {meaning}')
"
```

**Acceptance criteria:**
- Manual script run succeeded and `/tmp/cron_test.log` contains a timestamped record
- You can correctly interpret the trigger time of each crontab expression
- You know why absolute paths and log redirection are required

**Distill a skill card:** condense the common time expressions reference + debugging method into `skills/cron.md`.

> ⚠️ **Safety boundary (strictly observe):**
> - **Reading crontab (`crontab -l`)** is safe — do it freely.
> - **Adding or modifying crontab entries** causes scripts to run automatically on a schedule and can have unexpected side effects — **you must get the owner's confirmation first, clearly explaining "what this task will do and how often it will run", before executing `crontab -e`.**
> - **`crontab -r` (delete everything)** is a destructive operation and must never be run without explicit instruction.

---

## 🎓 Pass criteria

- [ ] You wrote a complete, correct five-field crontab expression and can explain each field
- [ ] You ran the test script manually and verified that log entries were written
- [ ] You know why cron jobs need `>> log 2>&1` appended
- [ ] You can explain why commands in cron must use absolute paths
- [ ] You know the two common pitfalls: macOS sleep behavior and timezone offsets
- [ ] Distilled 1 skill card into [`agent-school/skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T30.
