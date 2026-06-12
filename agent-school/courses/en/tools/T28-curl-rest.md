> 🌐 English ｜ [中文](../../tools/T28-curl-rest.md)

# Lesson T28 · curl + REST: Debugging an API by Hand

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★☆ ｜ Source: curl official docs · [curl.se/docs/manpage.html](https://curl.se/docs/manpage.html) · [curl.se/book.html](https://curl.se/book.html) · [httpbin.org](https://httpbin.org)

---

## 📖 What you'll learn

After this lesson, you'll be able to call a real REST API from the command line using curl — sending GET requests, POST requests, custom headers, and auth tokens — like having Postman baked right into your terminal, ready to fire off an API request at any moment.

Think of an API as the kitchen of a takeout restaurant. You (the client) want to place an order, so you have to fill out a proper order slip — what you want (URL), how you're ordering (GET/POST), whether you have a membership card (Authorization header), and the exact item and customization (request body). The kitchen (server) receives it and sends back a receipt (JSON response).

curl is **the tool that writes and submits that order slip for you** — no app to open, no code to write, one command and you're talking directly to the kitchen. When debugging an API, it's the fastest way to verify what's going on.

curl was created by Daniel Stenberg, first released in 1998, and remains the most widely used HTTP client in the world. It comes pre-installed on virtually every Linux and macOS system, and Windows 10/11 ships it by default.

**Official resources:**
- curl manual: [curl.se/docs/manpage.html](https://curl.se/docs/manpage.html)
- *Everything curl* (online book): [curl.se/book.html](https://curl.se/book.html)
- Online API testing sandbox: [httpbin.org](https://httpbin.org) (open-source, self-hostable)
- GitHub repository: [github.com/curl/curl](https://github.com/curl/curl)

---

## 🧠 Core principles (internalize these as habits)

1. **`-v` for the full picture, `-s` for silence, `-o` to save to a file.** When something's wrong, add `-v` (verbose) to print both request and response headers — that's ten times faster than guessing. Add `-s` (silent) in scripts to suppress progress bars. Use `-o output.json` to save the response body to a file.

2. **GET is the default; POST must be stated explicitly.** No extra flags means GET. Adding `-d '...'` (data) causes curl to automatically switch to POST. To specify a method explicitly, use `-X PUT` or `-X DELETE`.

3. **Content-Type must match the body format.** When sending JSON, you must add `-H "Content-Type: application/json"` — otherwise many APIs will reject or misparse your request. For form data, use `application/x-www-form-urlencoded`.

4. **There are three common auth patterns — don't mix them up.**
   - Bearer Token: `-H "Authorization: Bearer your_token"`
   - Basic Auth: `-u username:password`
   - API Key in header: `-H "X-API-Key: your_key"` (naming varies by provider, check the docs)

5. **Never hard-code tokens or secrets in command-line history.** Use environment variables: `TOKEN=$(cat ~/.mytoken)` and then `-H "Authorization: Bearer $TOKEN"`.

---

## 🛠 How to do it

### Installation

curl is pre-installed on most systems:

```bash
# Verify installation
curl --version
# Expected output: curl 8.x.x ... followed by a list of supported protocols
```

> ⚠️ If curl is not installed, the following commands require the owner's confirmation before running.

```bash
# macOS (Homebrew — upgrades to latest version)
brew install curl

# Linux (Debian/Ubuntu)
sudo apt install curl

# Windows — Windows 10/11 ships curl built-in; search "curl" from the Start menu
```

### Minimal runnable examples (calling public APIs)

**GET request — the simplest hello:**
```bash
curl https://httpbin.org/get
# Returns your request info (IP, headers, etc.) in JSON format
```

**Add `-s` (silent) and `jq` (pretty-print):**
```bash
curl -s https://httpbin.org/get | jq '.'
```

**POST request — sending JSON data:**
```bash
curl -s -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","score":95}'
# The .json field in the response will echo back exactly what you sent
```

**Request with an Authorization header:**
```bash
curl -s https://httpbin.org/headers \
  -H "Authorization: Bearer my-secret-token" \
  -H "X-Custom-Tag: test"
# The .headers field in the response shows all headers you sent
```

**Basic Auth:**
```bash
curl -s -u admin:password123 https://httpbin.org/basic-auth/admin/password123
# Success returns: {"authenticated": true, "user": "admin"}
```

**View response headers only:**
```bash
curl -s -I https://httpbin.org/get
# -I fetches response headers only, no body
```

**Download a file:**
```bash
curl -s -o /tmp/downloaded.json https://httpbin.org/json
ls -lh /tmp/downloaded.json
```

### Common flags quick reference

| What you want to do | Flag |
|---------------------|------|
| Specify HTTP method | `-X GET/POST/PUT/DELETE` |
| Send request body | `-d '{"key":"value"}'` |
| Add a header | `-H "Content-Type: application/json"` |
| Basic Auth | `-u username:password` |
| Bearer Token | `-H "Authorization: Bearer TOKEN"` |
| Save response to file | `-o output.json` |
| Silent mode (no progress) | `-s` |
| Verbose output (debugging) | `-v` |
| Response headers only | `-I` |
| Follow redirects | `-L` |
| Set timeout (seconds) | `--max-time 10` |
| Ignore TLS certificate (not recommended) | `-k` |
| Send form data | `-d "name=Alice&age=25"` |
| Upload a file | `-F "file=@/path/to/file"` |

### Real-world example: calling a public weather API

> Note: the example below uses the public, free `wttr.in` API — no registration required.

```bash
# Get current weather for London (JSON format)
curl -s "https://wttr.in/London?format=j1" | jq '.current_condition[0] | {temp_C, weatherDesc}'

# Expected output (live data, numbers will vary):
# {
#   "temp_C": "15",
#   "weatherDesc": [{"value": "Partly cloudy"}]
# }
```

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: make 4 API calls with curl — covering GET, POST, custom headers, and auth — and attach the real commands and output.**

All of these use public endpoints on `httpbin.org`, no account required:

**Task 1: GET request — extract your IP address**
```bash
curl -s https://httpbin.org/ip | jq -r '.origin'
# Expected output: your public IP (e.g. 1.2.3.4)
```

**Task 2: POST JSON data — verify the server received it**
```bash
curl -s -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"task":"graduation test","agent":"me","score":100}' \
  | jq '.json'
# Expected output:
# {
#   "agent": "me",
#   "score": 100,
#   "task": "graduation test"
# }
```

**Task 3: custom headers — verify headers were received**
```bash
curl -s https://httpbin.org/headers \
  -H "X-Agent-Name: MyAgent" \
  -H "Authorization: Bearer test-token-12345" \
  | jq '.headers | {"X-Agent-Name", "Authorization"}'
# Expected output includes both header fields you sent
```

**Task 4: Basic Auth**
```bash
curl -s -u testuser:testpass \
  https://httpbin.org/basic-auth/testuser/testpass
# Expected output: {"authenticated": true, "user": "testuser"}
```

**Acceptance criteria:**
- Task 1 returns a non-empty IP string
- Task 2's `.json` field shows the three key-value pairs you sent
- Task 3's headers contain both `X-Agent-Name` and `Authorization`
- Task 4 returns `"authenticated": true`

**Distill a skill card:** condense the common flags reference + three auth patterns into `skills/curl-rest.md`.

> ⚠️ **Safety boundary:** curl itself is safe, but keep this in mind: **never write real tokens or passwords directly on the command line** — they get saved in shell history. Use environment variables instead: `-H "Authorization: Bearer $MY_TOKEN"`. If you need to call a production API that requires a real account, confirm with the owner first.

---

## 🎓 Pass criteria

- [ ] You completed a GET request and retrieved an IP address
- [ ] You completed a POST request with a JSON body and the server echoed your data back
- [ ] You sent a request with custom headers and verified the server received them
- [ ] You completed Basic Auth and received `"authenticated": true`
- [ ] You can explain why tokens must not be hard-coded on the command line
- [ ] Distilled 1 skill card into [`agent-school/skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T29.
