> 🌐 English ｜ [中文](../../tools/T07-requests-httpx.md)

# Lesson T07 · requests / httpx — Calling Public APIs to Fetch Data

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: requests official docs · [docs.python-requests.org](https://docs.python-requests.org/) · httpx official docs · [python-httpx.org](https://www.python-httpx.org/) · PyPI: [requests](https://pypi.org/project/requests/) / [httpx](https://pypi.org/project/httpx/)

---

## 📖 What you'll learn

After this lesson, you'll be able to write Python code that "knocks on the door" of a public API — retrieves data and parses it down to the fields you need — just like checking the weather, exchange rates, or GitHub repository stats online, except you're writing the code to fetch it yourself.

Think of an API as a food delivery platform. You (the client) open the app, order "one serving of kung pao chicken" (send an HTTP request), and the platform (the server) packages it up (JSON data) and sends it back. You don't need to enter the kitchen or know how the chef cooked it — **you just place the order, receive the delivery, and eat**. `requests` and `httpx` are the delivery app in your hands.

The relationship between the two libraries: **`requests` is the veteran** — stable, concise, battle-tested for over a decade, with over 300 million weekly downloads, one of the most widely depended-upon Python libraries ever. **`httpx` is the next generation** — its API is highly compatible with requests, but it additionally supports HTTP/2 and async (`async`/`await`), making it suitable for scenarios where you need to fire off many requests simultaneously. Start with `requests` to build your foundation; upgrade to `httpx` only when you hit "fire 100 requests concurrently."

**Official resources:**
- requests docs: [docs.python-requests.org](https://docs.python-requests.org/en/latest/)
- requests PyPI: [pypi.org/project/requests](https://pypi.org/project/requests/)
- httpx docs: [python-httpx.org](https://www.python-httpx.org/)
- httpx PyPI: [pypi.org/project/httpx](https://pypi.org/project/httpx/)
- httpx GitHub: [github.com/encode/httpx](https://github.com/encode/httpx)

---

## 🧠 Core principles (internalize these as habits)

1. **Check the status code before looking at the data.** The status code is like a delivery status — 200 is "delivered," 404 is "address doesn't exist," 429 is "you ordered too fast and got rate-limited," 500 is "the kitchen had a problem." Always check `response.status_code` before reading the content. `response.raise_for_status()` is your automatic alarm: it throws an exception as soon as the status code is wrong.

2. **JSON is the most common "packaging format."** The vast majority of public APIs return JSON. `response.json()` unpacks it in one call, giving you a Python dict/list — like opening a delivery box right away.

3. **Always set a timeout — don't let requests wait forever.** `requests.get(url, timeout=10)` means "give up after 10 seconds with no response." A network request without a timeout is like an eternal phone call where you never hang up no matter how long the other side doesn't pick up — eventually your program freezes.

4. **Never put private keys in the source code.** API Keys, Tokens, and other credentials must be read from environment variables (`os.environ.get("API_KEY")`) — never hardcoded into a script that gets committed to git. This is the most basic security rule.

5. **Respect rate limits.** Most public APIs have request frequency limits — for example "at most 60 requests per minute." Read the API docs for rate limit details and don't blindly poll. When you get a 429, wait and retry.

---

## 🛠 How to do it

### Installation

```bash
# requests (the veteran — stable and reliable)
pip install requests

# httpx (next generation — supports async)
pip install httpx
```

> **Network note:** Both libraries install directly via pip without a VPN. If downloads are slow, add a mirror:
> `pip install requests -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/`

### Minimal runnable example: call the GitHub public API

```python
import requests
import json

# Call the GitHub API to get repository info (no login required, fully public)
url = "https://api.github.com/repos/python/cpython"

response = requests.get(url, timeout=10)

# Step 1: check the status code first
print(f"Status code: {response.status_code}")
response.raise_for_status()  # raises an exception if not 200

# Step 2: unpack the JSON
data = response.json()

# Step 3: pull out the fields you need
print(f"Repository: {data['full_name']}")
print(f"Stars: {data['stargazers_count']}")
print(f"Description: {data['description']}")
print(f"Language: {data['language']}")
print(f"Last updated: {data['updated_at']}")
```

> This example requires no API Key and no login — just run it.

### Requests with parameters (fetching multiple results)

```python
import requests

# GitHub Search API: find Python repos with >10k stars
url = "https://api.github.com/search/repositories"
params = {
    "q": "language:python stars:>10000",
    "sort": "stars",
    "order": "desc",
    "per_page": 5
}

response = requests.get(url, params=params, timeout=10)
response.raise_for_status()

data = response.json()
print(f"Found {data['total_count']} repositories, showing top 5:\n")

for repo in data['items']:
    print(f"  ⭐ {repo['stargazers_count']:>8,}  {repo['full_name']}")
    print(f"     {repo['description']}\n")
```

### httpx version comparison (nearly identical API)

```python
import httpx

# Synchronous usage — almost identical to requests
response = httpx.get("https://api.github.com/repos/encode/httpx", timeout=10)
response.raise_for_status()
data = response.json()
print(f"httpx stars: {data['stargazers_count']}")

# Async usage — this is where httpx outshines requests
import asyncio

async def fetch_many():
    async with httpx.AsyncClient() as client:
        urls = [
            "https://api.github.com/repos/python/cpython",
            "https://api.github.com/repos/django/django",
            "https://api.github.com/repos/pallets/flask",
        ]
        # Fire all 3 requests concurrently — much faster than sequential
        tasks = [client.get(url, timeout=10) for url in urls]
        responses = await asyncio.gather(*tasks)
        for r in responses:
            d = r.json()
            print(f"{d['full_name']}: ⭐ {d['stargazers_count']}")

asyncio.run(fetch_many())
```

### Saving results locally

```python
import requests
import json

response = requests.get("https://api.github.com/repos/python/cpython", timeout=10)
response.raise_for_status()
data = response.json()

# Keep only the useful fields
result = {
    "name": data["full_name"],
    "stars": data["stargazers_count"],
    "description": data["description"],
    "language": data["language"],
    "updated_at": data["updated_at"],
}

with open("/tmp/repo_info.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("Saved to /tmp/repo_info.json")
```

### Common operations quick-reference

| Goal | requests syntax |
|------|----------------|
| GET request | `requests.get(url, timeout=10)` |
| With URL parameters | `requests.get(url, params={"key": "val"})` |
| With request headers | `requests.get(url, headers={"Authorization": "Bearer xxx"})` |
| POST JSON | `requests.post(url, json={"key": "val"})` |
| Check status code | `response.raise_for_status()` |
| Parse JSON | `response.json()` |
| Read as text | `response.text` |
| Read as bytes | `response.content` |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: use `requests` to call the GitHub public API, retrieve data, parse it, and save it.**

This test **requires no API Key, no account, and no VPN** — the GitHub public API works directly.

**Steps:**

1. **Write the following complete script** (`/tmp/api_task.py`):

```python
import requests
import json
import sys

def fetch_repo(owner: str, repo: str) -> dict:
    """Call the GitHub API to fetch repository info, return key fields."""
    url = f"https://api.github.com/repos/{owner}/{repo}"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    data = response.json()
    return {
        "full_name": data["full_name"],
        "stars": data["stargazers_count"],
        "forks": data["forks_count"],
        "description": data["description"],
        "language": data["language"],
        "open_issues": data["open_issues_count"],
        "updated_at": data["updated_at"],
    }

if __name__ == "__main__":
    repos = [
        ("python", "cpython"),
        ("pandas-dev", "pandas"),
        ("encode", "httpx"),
    ]

    results = []
    for owner, repo in repos:
        print(f"Fetching: {owner}/{repo} ...")
        info = fetch_repo(owner, repo)
        results.append(info)
        print(f"  ✓ {info['full_name']} — ⭐{info['stars']:,}")

    # Save results
    output_path = "/tmp/github_repos.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\nFetched {len(results)} records, saved to {output_path}")

    # Acceptance check: file exists and is well-formed
    with open(output_path, "r", encoding="utf-8") as f:
        saved = json.load(f)
    assert len(saved) == 3, "should have 3 records"
    assert all("stars" in item for item in saved), "every record should have a stars field"
    print("Acceptance check passed ✓")
```

2. **Run the script and paste the real output** (including the "Acceptance check passed ✓" line).

3. **Write out verification criteria:**
   - Script exits with code 0 (no exceptions)
   - `/tmp/github_repos.json` exists, contains valid JSON, has 3 records
   - Each record has non-empty `full_name` and `stars` fields

4. **Write out security notes:**
   - This test uses GitHub's public read-only API — no key needed, run it directly
   - If you need to access private content with a Token, the Token must be read from an environment variable — **never hardcoded**
   - For any third-party API that requires a key or account — **ask the owner first before installing or calling**

5. **Distill a skill card:** crystallize core usage, status code explanations, and security principles into `skills/requests-httpx.md`.

> ⚠️ **Safety boundary:** `pip install requests/httpx` requires the owner's confirmation first. Calling any interface that requires an API Key or account **requires asking the owner first**. The GitHub public API used in this test is the exception — no key, runs directly.

---

## 🎓 Pass criteria

- [ ] You ran the complete script and attached the real output (including 3 repository records and "Acceptance check passed ✓")
- [ ] You understand what `raise_for_status()` does (throws an exception automatically when the status code indicates an error)
- [ ] You understand why `timeout` is necessary (prevents requests from waiting forever)
- [ ] You can clearly explain the difference between `requests` and `httpx` (synchronous vs. async-capable; requests is the battle-hardened veteran, httpx is the modern successor)
- [ ] You know API Keys must not be hardcoded and must be read from environment variables
- [ ] Distilled 1 skill card into your dorm's `skills/`
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T08.
