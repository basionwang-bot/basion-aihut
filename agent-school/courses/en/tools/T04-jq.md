> 🌐 English ｜ [中文](../../tools/T04-jq.md)

# Lesson T04 · jq — Slice JSON down to exactly the fields you need

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: jq official website · [jqlang.org](https://jqlang.org/) · [jqlang.org/manual/](https://jqlang.org/manual/) · [jqlang.org/tutorial/](https://jqlang.org/tutorial/)

---

## 📖 What you'll learn

After this lesson, you'll be able to take a lump of raw JSON — say, 500 lines of deeply nested data from the GitHub API — and cut out precisely the few fields you actually need, instead of either feeding the whole blob to an AI (wasting tokens) or copy-pasting by hand (wasting time).

Imagine JSON is a set of Russian nesting dolls, one inside another. You want the smallest doll at the very center, but every time you have to carry the entire set away. `jq` is the **precision scalpel**: tell it "I want the third layer, left doll, right hand," and it cuts that piece out for you — touching nothing else.

`jq` is a command-line JSON processor, often called "sed for JSON." The latest version is 1.8, and it supports complex filtering, transformation, and aggregation operations.

**Official resources:**
- Official website: [jqlang.org](https://jqlang.org/)
- Full manual: [jqlang.org/manual/](https://jqlang.org/manual/)
- Tutorial: [jqlang.org/tutorial/](https://jqlang.org/tutorial/)
- GitHub repository: [github.com/jqlang/jq](https://github.com/jqlang/jq)

---

## 🧠 Core principles

1. **`.` (dot) means "the entire current JSON."** Every `jq` filter starts from `.`. `.name` gets the name field; `.[0]` gets the first element of an array; `.users[].name` iterates over the users array and gets each person's name. Think of it like asking for directions: you start by saying "from where I'm standing right now," then give the route.

2. **Pipe `|` chains operations together.** `.users[] | .name` means "first expand every item in the users array, then extract name from each item." The jq pipe follows the same logic as the shell pipe: the output of the previous step is the input for the next.

3. **`select` is a filter, not a selector.** `.[] | select(.age > 18)` means "iterate over all elements and keep those where age is greater than 18." Expand first, filter second, transform third — memorize that order and you can handle 80% of use cases.

4. **String interpolation with double quotes: `"\(.field)"`.** To concatenate multiple fields into a single line: `"\(.name) is \(.age) years old"` — inside the parentheses is a jq expression; outside is a regular string.

5. **`-r` strips the outer quotes from results.** By default, output strings include double quotes (`"hello"`). Add `-r` (raw output) to produce plain text (`hello`), which is convenient for piping or writing to a file.

---

## 🛠 How to do it

### Installation

```bash
# macOS (Homebrew)
brew install jq

# Linux (Debian/Ubuntu)
sudo apt install jq

# Windows (Chocolatey)
choco install jq

# Windows (WinGet)
winget install jqlang.jq
```

> **Network note:** `apt install jq` and `brew install jq` work directly without a VPN. Windows users can also download the `.exe` manually from [github.com/jqlang/jq/releases](https://github.com/jqlang/jq/releases).

### Minimal runnable example

```bash
# Create a JSON value inline with echo
echo '{"name":"Alice","age":25,"city":"Seattle"}' | jq '.'

# Get a single field
echo '{"name":"Alice","age":25}' | jq '.name'
# Output: "Alice"

# Strip quotes (-r = raw)
echo '{"name":"Alice","age":25}' | jq -r '.name'
# Output: Alice

# Get a field from every element of an array
echo '[{"name":"Alice"},{"name":"Bob"}]' | jq '.[].name'
# Output:
# "Alice"
# "Bob"
```

### Common filter operations

```bash
# Get a nested field (user's city)
cat data.json | jq '.user.address.city'

# Get the first element of an array
cat data.json | jq '.[0]'

# Get a field from every element of an array
cat data.json | jq '.[].name'

# Filter: keep only elements where age > 18
cat data.json | jq '.[] | select(.age > 18)'

# Filter: keep only elements where status is "open"
cat data.json | jq '.[] | select(.status == "open")'

# Reshape into a new JSON object (keeping only name and age)
cat data.json | jq '.[] | {name: .name, age: .age}'

# Concatenate into a string
cat data.json | jq -r '.[] | "\(.name) age \(.age)"'

# Count array length
cat data.json | jq 'length'

# Sort by a field
cat data.json | jq 'sort_by(.age)'
```

### Working with GitHub CLI (real-world scenario)

```bash
# List all open PRs, showing only number and title
gh pr list --json number,title,state \
  | jq -r '.[] | "\(.number)\t\(.title)"'

# Find all issues authored by "alice"
gh issue list --json number,title,author \
  | jq -r '.[] | select(.author.login == "alice") | "\(.number) \(.title)"'

# Count how many open PRs there are
gh pr list --json number | jq 'length'
```

### Quick-reference cheat sheet

| Goal | jq expression |
|------|--------------|
| Pretty-print the full JSON | `.` |
| Get a field | `.field` |
| Get a nested field | `.a.b.c` |
| Get all array elements | `.[]` |
| Get the Nth element | `.[N]` |
| Filter by condition | `select(.x > 1)` |
| Reshape an object | `{a: .a, b: .b}` |
| Concatenate a string | `"\(.a) \(.b)"` |
| Strip quotes from output | `-r` flag |
| Array length | `length` |
| Sort by field | `sort_by(.field)` |
| Unique values | `unique_by(.field)` |
| Array to object | `from_entries` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use `jq` to process a real JSON dataset — complete 3 data-extraction operations, with real commands and output attached.**

Prepare the test data:

```bash
# Save this JSON to test.json
cat > /tmp/test.json << 'EOF'
[
  {"name":"Alice","age":22,"city":"Seattle","score":88},
  {"name":"Bob","age":17,"city":"Portland","score":95},
  {"name":"Carol","age":30,"city":"Seattle","score":72},
  {"name":"Dana","age":25,"city":"Austin","score":91}
]
EOF
```

Complete the following 3 tasks and attach the real output:

1. **Task 1: extract every person's name and score**
   ```bash
   cat /tmp/test.json | jq -r '.[] | "\(.name) scored \(.score)"'
   ```

2. **Task 2: filter to people 18 or older, keeping only name and city**
   ```bash
   cat /tmp/test.json | jq '[.[] | select(.age >= 18) | {name, city}]'
   ```

3. **Task 3: sort by score and get the top scorer's name**
   ```bash
   cat /tmp/test.json | jq -r 'sort_by(-.score) | .[0].name'
   ```

4. **Write out verification criteria:**
   - Task 1 outputs 4 strings
   - Task 2 outputs an array of 3 objects (Bob, age 17, is filtered out)
   - Task 3 outputs `Bob` (highest score: 95)

5. **Distill a skill card:** crystallize the cheat sheet and the `gh`-integration commands into `skills/jq.md`.

> ⚠️ **Safety boundary:** `jq` is a purely local text-processing tool — no network, no file writes (unless you redirect output). It's very safe. The one rule: **do not pipe JSON containing keys or private information to uncontrolled destinations** (e.g. pasting into an AI chat or a public issue).

---

## 🎓 Pass criteria

- [ ] You ran 3 `jq` commands and attached the real command + output (not hand-written)
- [ ] You used `select()` for conditional filtering
- [ ] You used string interpolation `"\(.field)"`
- [ ] You can explain what the `-r` flag does (strips outer quotes)
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to the next lesson.
