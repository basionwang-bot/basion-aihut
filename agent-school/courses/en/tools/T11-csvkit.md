> 🌐 English ｜ [中文](../../tools/T11-csvkit.md)

# Lesson T11 · csvkit: Slice, Stack, Join, and Convert CSVs from the Command Line

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: csvkit official docs · [csvkit.readthedocs.io](https://csvkit.readthedocs.io/) · GitHub: [wireservice/csvkit](https://github.com/wireservice/csvkit) · PyPI: [csvkit 2.2.0](https://pypi.org/project/csvkit/)

---

## 📖 What you'll learn

After this lesson, you'll be able to work a CSV file from the command line like a chef prepping ingredients — pull out a few columns, filter a few rows, join two tables, get summary statistics — one command at a time, no Python needed, no Excel required.

Imagine you're a prep cook in a kitchen. The owner hands you a giant cabbage (a large CSV) and says: "I just want the core, not the outer leaves — shred it fine, mix it with the radish from that other bowl, and sprinkle some stats on top." What you need is a sharp knife — not a whole cooking machine. **csvkit is that knife**: each command does exactly one thing, fast and precise.

csvkit 2.2.0 is a command-line toolkit, installable via pip, backed by Python under the hood. Every tool supports piping (`|`): the output of one command feeds directly into the next, like an assembly line — **`csvcut | csvgrep | csvstat` — three blades in one go, one problem solved.**

**Official resources:**
- Docs: [csvkit.readthedocs.io](https://csvkit.readthedocs.io/)
- Getting started tutorial: [csvkit.readthedocs.io/en/latest/tutorial/1_getting_started](https://csvkit.readthedocs.io/en/latest/tutorial/1_getting_started.html)
- GitHub: [github.com/wireservice/csvkit](https://github.com/wireservice/csvkit)
- PyPI: [pypi.org/project/csvkit](https://pypi.org/project/csvkit/)

---

## 🧠 Core principles (internalize these as habits)

1. **Each tool does one thing; chain them with pipes.** `csvcut` (select columns), `csvgrep` (filter rows), `csvstat` (statistics), `csvjoin` (join tables) — each knife cuts one thing. For complex needs, compose them with `|`. Don't hunt for an "all-in-one command."

2. **Run `-n` first to see column numbers before you cut.** `csvcut -n file.csv` lists all column names and their numbers — like reading the menu before ordering. Not knowing the column numbers before writing your command is like cutting blindfolded.

3. **Handle encoding issues upfront.** CSV files with non-ASCII characters might be UTF-8, GBK, or UTF-8-BOM. When you see garbled text, add `-e gbk` (or `-e utf-8-sig`). All csvkit commands support `-e` to specify the encoding.

4. **Spot-check intermediate results by inserting `| head -5` anywhere in the pipe.** Not sure if the current step is producing the right output? Temporarily add `| head -5` mid-pipe to preview the first few rows — like tasting the dish while cooking before adding more seasoning.

5. **`csvsql` is the power move: run SQL directly on CSVs from the command line.** When the other tools can't handle a complex need, `csvsql --query "SELECT ..."` lets you write SQL against a CSV — no database to install, no Python to write.

---

## 🛠 How to do it

### Installation

```bash
pip install csvkit
```

After installation, these commands become available: `csvcut`, `csvgrep`, `csvjoin`, `csvlook`, `csvstat`, `csvstack`, `csvformat`, `csvsql`, `in2csv`

### Generate test data first (fully offline)

```bash
# Create an employee table
cat > /tmp/employees.csv << 'EOF'
id,name,department,city,monthly_salary,hire_year
1,Wang Fang,Engineering,Beijing,22000,2021
2,Li Ming,Marketing,Shanghai,15000,2022
3,Zhang Qiang,Engineering,Beijing,28000,2020
4,Liu Juan,Marketing,Guangzhou,14000,2022
5,Chen Hao,Operations,Shenzhen,13000,2023
6,Zhao Lei,Engineering,Beijing,25000,2021
7,Sun Mei,Operations,Shanghai,12000,2023
8,Zhou Wei,Marketing,Guangzhou,16000,2021
EOF

# Create a departments table (for join)
cat > /tmp/departments.csv << 'EOF'
department,head,budget
Engineering,Zhao,500000
Marketing,Qian,300000
Operations,Sun,200000
EOF
```

### Core tool demos

```bash
# 1. csvlook: pretty-print the table
csvlook /tmp/employees.csv

# 2. csvcut: select columns (keep name, department, monthly_salary)
csvcut -c name,department,monthly_salary /tmp/employees.csv

# Column numbers work too (run -n first to see them)
csvcut -n /tmp/employees.csv
csvcut -c 2,3,5 /tmp/employees.csv

# 3. csvgrep: filter rows (keep only Engineering)
csvgrep -c department -m Engineering /tmp/employees.csv

# Filter + select columns pipeline: names and salaries in Engineering
csvgrep -c department -m Engineering /tmp/employees.csv | csvcut -c name,monthly_salary

# 4. csvstat: summary statistics
csvstat /tmp/employees.csv
# Stats for salary column only
csvcut -c monthly_salary /tmp/employees.csv | csvstat

# 5. csvjoin: merge two tables on a column (like SQL JOIN)
csvjoin -c department /tmp/employees.csv /tmp/departments.csv

# 6. csvstack: vertically stack two identically structured CSVs (append rows)
cp /tmp/employees.csv /tmp/employees_q2.csv
csvstack /tmp/employees.csv /tmp/employees_q2.csv | wc -l

# 7. csvsql: run SQL directly against a CSV
csvsql --query "SELECT department, AVG(monthly_salary) AS avg_salary, COUNT(*) AS headcount
                FROM employees
                GROUP BY department
                ORDER BY avg_salary DESC" /tmp/employees.csv

# 8. in2csv: convert Excel to CSV (requires a file to exist)
# in2csv data.xlsx > output.csv

# 9. csvformat: change delimiter or encoding
csvformat -D "|" /tmp/employees.csv  # switch from comma to pipe delimiter
```

### Chained pipelines: multi-step operations in one line

```bash
# Find Engineering employees with salary > 20000, show name and salary, pretty-print
csvgrep -c department -m Engineering /tmp/employees.csv \
  | csvgrep -c monthly_salary -r "^[2-9][0-9]{4}" \
  | csvcut -c name,monthly_salary \
  | csvlook

# Join tables then compute average salary per department
csvjoin -c department /tmp/employees.csv /tmp/departments.csv \
  | csvsql --query "SELECT department, head, AVG(monthly_salary) AS avg_salary
                    FROM stdin GROUP BY department, head"

# Save output to a file
csvcut -c name,department,monthly_salary /tmp/employees.csv > /tmp/slim_employees.csv
```

### Command quick reference

| Tool | Purpose | Key flags |
|------|---------|-----------|
| `csvlook` | Pretty-print as a table | — |
| `csvcut` | Select / drop columns | `-c col_name_or_number` `-n` to list numbers |
| `csvgrep` | Filter rows | `-c col` `-m exact_value` `-r regex` |
| `csvstat` | Summary statistics | — |
| `csvjoin` | Join on a column (like SQL JOIN) | `-c join_column` |
| `csvstack` | Vertically stack (append rows) | — |
| `csvsql` | Run SQL against a CSV | `--query "SQL"` |
| `in2csv` | Excel/JSON → CSV | — |
| `csvformat` | Change delimiter / encoding | `-D delimiter` `-e encoding` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: complete 4 csvkit command-line operations and submit real output. Test data is embedded — fully offline.**

**Step 1: prepare test data**

```bash
cat > /tmp/orders.csv << 'EOF'
order_id,customer,city,category,amount,status
O001,Wang Xiaoming,Beijing,Electronics,3500,Completed
O002,Li Xiaohong,Shanghai,Clothing,280,Completed
O003,Zhang Daqiang,Guangzhou,Food,650,Cancelled
O004,Liu Xiaoli,Beijing,Electronics,8900,Completed
O005,Chen Xiaohao,Shenzhen,Clothing,430,Pending
O006,Zhao Xiaolei,Shanghai,Electronics,12000,Completed
O007,Sun Xiaomei,Beijing,Food,320,Pending
O008,Zhou Xiaowei,Guangzhou,Clothing,760,Completed
EOF
```

**Complete the following 4 operations and submit the actual command + output:**

1. **Operation 1: list column names and numbers**
   ```bash
   csvcut -n /tmp/orders.csv
   ```

2. **Operation 2: select the "customer", "city", and "amount" columns and pretty-print**
   ```bash
   csvcut -c customer,city,amount /tmp/orders.csv | csvlook
   ```

3. **Operation 3: filter "Completed" orders and get statistics for the amount column**
   ```bash
   csvgrep -c status -m Completed /tmp/orders.csv | csvcut -c amount | csvstat
   ```

4. **Operation 4: use SQL to compute total amount per city for Completed orders, sorted**
   ```bash
   csvsql --query "SELECT city, COUNT(*) AS order_count, SUM(amount) AS total_amount
                   FROM orders
                   WHERE status='Completed'
                   GROUP BY city
                   ORDER BY total_amount DESC" /tmp/orders.csv
   ```

**Acceptance criteria:**
- Operation 1: output shows all 6 column names with numbers
- Operation 2: pretty-printed table has 8 data rows (plus header)
- Operation 3: `csvstat` output shows a `Sum` field with the total amount of Completed orders
- Operation 4: SQL output shows cities ranked by total amount

**Distill a skill card**: capture the 8-tool quick reference + pipeline composition examples into `skills/csvkit.md`.

> ⚠️ **Safety boundary:** `pip install csvkit` requires the owner's confirmation first. csvkit is a purely local command-line tool — no network access, reads and writes local files only. `csvsql` can also connect to real databases via `--db` — if you ever do that, **ask the owner first**.

---

## 🎓 Pass criteria

- [ ] You ran all 4 operations and submitted real command + output (not typed by hand)
- [ ] You used `|` to pipe `csvcut` and `csvgrep` together
- [ ] You used `csvsql --query` to run SQL directly against a CSV
- [ ] You can explain what `-n` does (list column numbers before cutting)
- [ ] You can explain the difference between `csvstack` and `csvjoin` (append rows vertically vs. join columns horizontally)
- [ ] Distilled 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T12.
