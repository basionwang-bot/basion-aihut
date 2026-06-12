> 🌐 English ｜ [中文](../../tools/T27-sqlite.md)

# Lesson T27 · SQLite: Add a Local Database to Your Small Tool

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: SQLite official docs · [sqlite.org/docs.html](https://www.sqlite.org/docs.html) · [sqlite.org/cli.html](https://www.sqlite.org/cli.html) · [github.com/sqlite/sqlite](https://github.com/sqlite/sqlite)

---

## 📖 What you'll learn

After this lesson, you'll be able to give your small tool a genuine local database — create tables, insert data, query data — instead of re-reading CSV or JSON files every run and losing your data each time.

Picture yourself as a delivery driver who needs to track dozens of parcels every day. If you jot things down on random sticky notes, one lost note and the information is gone; if you write every parcel's details into one giant spreadsheet, searching it is painfully slow. SQLite feels like **a mini filing cabinet that fits in your pocket** — the entire database is a single file you can put anywhere, yet queries run against it use proper SQL: fast, precise, and nothing lost.

SQLite is the single most widely deployed database engine on the planet. It needs no server process — the entire database lives in one `.db` file. Mobile apps, browsers, WeChat's local storage — they all run on SQLite under the hood. Python's standard library ships with the `sqlite3` module, so if you have Python you already have SQLite: zero extra installation, zero extra `import` dependencies.

**Official resources:**
- Documentation overview: [sqlite.org/docs.html](https://www.sqlite.org/docs.html)
- Command-line tool manual: [sqlite.org/cli.html](https://www.sqlite.org/cli.html)
- SQL syntax reference: [sqlite.org/lang.html](https://www.sqlite.org/lang.html)
- Python sqlite3 module: [docs.python.org/3/library/sqlite3.html](https://docs.python.org/3/library/sqlite3.html)

---

## 🧠 Core principles (internalize these as habits)

1. **The entire database is one file — move it, copy it, no problem.** `mydata.db` is your database. `cp mydata.db mydata_backup.db` is your backup. Compare that to MySQL's server + config files + data directory and you'll appreciate the simplicity immediately.

2. **Always `conn.close()` when you're done, or use a `with` statement.** Write operations in SQLite are buffered in memory; if you never call `commit()` the data is lost, and a connection left open can lock the file. The `with sqlite3.connect(...)` context manager handles both commit and close automatically — that's the stress-free approach.

3. **Use `?` placeholders for query parameters — never concatenate strings.** `cursor.execute("SELECT * FROM users WHERE name = ?", (name,))` is correct. `"SELECT * FROM users WHERE name = '" + name + "'"` is an invitation to SQL injection — don't build bad habits even in tools you only use yourself.

4. **SQLite is designed for "single-machine, small data."** Tens of thousands or even hundreds of thousands of rows are no problem. When you have high-concurrency writes (multiple processes writing simultaneously) or data exceeding a few GB, it's time to consider PostgreSQL or MySQL. For an agent's local storage needs, SQLite is more than sufficient.

5. **`PRAGMA journal_mode=WAL` makes concurrent access more stable.** If your tool occasionally needs to read and write at the same time, this one line of configuration prevents write operations from locking out readers — both performance and stability improve noticeably.

---

## 🛠 How to do it

### Installation

**Python version (recommended, zero installation):** Python 3.x ships with `sqlite3` in the standard library — `import sqlite3` and you're ready to go. **Nothing to install.**

**Command-line client (optional):**
> ⚠️ Ask the owner first before running any of these installation commands.

```bash
# macOS (Homebrew)
brew install sqlite

# Linux (Debian/Ubuntu) — usually pre-installed, may not need this at all
sudo apt install sqlite3

# Windows: download the sqlite-tools-win zip from https://sqlite.org/download.html, unzip and run
```

### Minimal runnable example (Python, no extra dependencies)

```python
import sqlite3

# 1. Connect (auto-creates the file if it doesn't exist)
conn = sqlite3.connect("/tmp/myapp.db")
cursor = conn.cursor()

# 2. Create table (only if it doesn't already exist)
cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        title   TEXT NOT NULL,
        status  TEXT DEFAULT 'todo',
        created TEXT DEFAULT (datetime('now', 'localtime'))
    )
""")

# 3. Insert rows
cursor.execute("INSERT INTO tasks (title) VALUES (?)", ("Buy coffee",))
cursor.execute("INSERT INTO tasks (title) VALUES (?)", ("Write report",))
cursor.execute("INSERT INTO tasks (title, status) VALUES (?, ?)", ("Reply to email", "done"))
conn.commit()

# 4. Fetch all rows
print("=== All tasks ===")
for row in cursor.execute("SELECT id, title, status FROM tasks"):
    print(row)

# 5. Conditional query
print("\n=== Pending tasks ===")
for row in cursor.execute("SELECT title FROM tasks WHERE status = ?", ("todo",)):
    print(row[0])

# 6. Close connection
conn.close()
```

**Expected output:**
```
=== All tasks ===
(1, 'Buy coffee', 'todo')
(2, 'Write report', 'todo')
(3, 'Reply to email', 'done')

=== Pending tasks ===
Buy coffee
Write report
```

### Common SQL quick reference

```sql
-- Create table
CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT UNIQUE,
    score INTEGER DEFAULT 0
);

-- Insert
INSERT INTO users (name, email, score) VALUES ('Alice', 'alice@example.com', 88);

-- Fetch all
SELECT * FROM users;

-- Conditional query
SELECT name, score FROM users WHERE score > 80;

-- Update
UPDATE users SET score = 95 WHERE name = 'Alice';

-- Delete
DELETE FROM users WHERE score < 60;

-- Count
SELECT COUNT(*) FROM users;

-- Sort (descending by score)
SELECT name, score FROM users ORDER BY score DESC;

-- Limit results (top 3)
SELECT name FROM users ORDER BY score DESC LIMIT 3;
```

### Python sqlite3 operations quick reference

| What you want to do | Code |
|---------------------|------|
| Connect / create a database | `conn = sqlite3.connect("data.db")` |
| In-memory database (temporary) | `conn = sqlite3.connect(":memory:")` |
| Execute SQL | `cursor.execute("SQL statement", (param,))` |
| Batch insert | `cursor.executemany("INSERT ...", list_of_tuples)` |
| Commit writes | `conn.commit()` |
| Fetch one row | `cursor.fetchone()` |
| Fetch all rows | `cursor.fetchall()` |
| Results as dict-like objects | `conn.row_factory = sqlite3.Row` |
| Close connection | `conn.close()` |
| Context manager | `with sqlite3.connect("data.db") as conn:` |

### Command-line client basics

```bash
# Open a database (creates it if it doesn't exist)
sqlite3 /tmp/myapp.db

# At the sqlite3 prompt:
.tables             # list all tables
.schema tasks       # show the structure of the tasks table
SELECT * FROM tasks;
.mode column        # column-aligned display
.headers on         # show column names
.quit               # exit
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use Python sqlite3 to build a "notebook" database — complete all three steps (create table, insert data, query) — and attach real commands plus output.**

The test data is embedded directly; just run it (no network access, no extra dependencies needed):

```python
# Save as /tmp/notebook_test.py and run it
import sqlite3

DB_PATH = "/tmp/notebook.db"

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row   # rows accessible by column name
cursor = conn.cursor()

# Create table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS notes (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        tag     TEXT,
        content TEXT NOT NULL
    )
""")

# Insert test data
notes = [
    ("work",  "10 am team standup tomorrow"),
    ("work",  "Submit Q2 report"),
    ("life",  "Groceries: tomatoes, eggs"),
    ("study", "Review SQLite lesson"),
]
cursor.executemany("INSERT INTO notes (tag, content) VALUES (?, ?)", notes)
conn.commit()

# Query 1: all notes
print("=== All notes ===")
for row in cursor.execute("SELECT id, tag, content FROM notes"):
    print(f"[{row['id']}] [{row['tag']}] {row['content']}")

# Query 2: work notes only
print("\n=== Work notes ===")
for row in cursor.execute("SELECT content FROM notes WHERE tag = ?", ("work",)):
    print("-", row["content"])

# Query 3: count by tag
print("\n=== Tag counts ===")
for row in cursor.execute("SELECT tag, COUNT(*) as cnt FROM notes GROUP BY tag"):
    print(f"{row['tag']}: {row['cnt']} item(s)")

conn.close()
print("\nDatabase file:", DB_PATH)
```

**Acceptance criteria:**
- All notes output shows exactly 4 rows with `id` 1 through 4
- Work notes output shows exactly 2 rows
- Tag counts output shows 3 rows (work 2 / life 1 / study 1)
- `/tmp/notebook.db` file exists (verify with `ls -lh /tmp/notebook.db`)

**Distill a skill card:** condense the SQL quick reference + Python sqlite3 operations table into `skills/sqlite.md`.

> ⚠️ **Safety boundary:** Python's `sqlite3` module requires zero installation and is entirely safe to run. One important note: **do not commit `.db` files containing private data to a git repository** — add `*.db` to `.gitignore`.

---

## 🎓 Pass criteria

- [ ] You successfully created a `.db` file with Python and built a table
- [ ] You used `executemany` to batch-insert multiple rows
- [ ] You completed a conditional query and an aggregation (`GROUP BY`)
- [ ] You can explain why query parameters must use `?` instead of string concatenation
- [ ] You know when SQLite is no longer enough and it's time to move to a larger database
- [ ] Distilled 1 skill card into [`agent-school/skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T28.
