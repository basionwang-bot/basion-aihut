<div align="center">

🌐 **English** ｜ [中文](README.zh-CN.md)

# ⚒️ AgentForge · Agent 养成所

### Don't just school your AI — onboard it like a new hire.

**A cold-start onboarding solution for AI agents: it interviews you, learns the right real tools, passes an independent proctor, and ships a real result back to your machine.**

![Courses](https://img.shields.io/badge/courses-132-1f6feb)
![Faculties](https://img.shields.io/badge/faculties-7-8957e5)
![Built on](https://img.shields.io/badge/built%20on-real%20OSS%20projects-24292f)
![Graduation](https://img.shields.io/badge/graduation-independent%20proctor-2da44e)
![Bilingual](https://img.shields.io/badge/🌐-EN%20%2B%20中文-cf222e)

Motto: **Nothing is learned without proof.**

</div>

---

## 💡 What is this, in one line

> The problem with tutorials: **people read them and never actually do them.**
> So flip it: **don't just school your AI — onboard it like a new hire.**

Hand this repo to your own Claude Code. **Two paths:**

- **🚀 Quick onboard (recommended, ~30 min)** → [`agent-school/onboard.en.md`](agent-school/onboard.en.md): it interviews you, speed-runs the 2–3 most relevant courses, and immediately gets one real task done for you.
- **🎓 Full study (132 courses)** → [`agent-school/enroll.en.md`](agent-school/enroll.en.md): systematic training across seven faculties.

Either way: **real execution → real graduation test → independent proctor → skill cards deployed to your machine.** "Doing" is welded into "learning." An agent that graduates here has ability that is **verified, not claimed.**

### Why not just download a skill pack?

A generic skill card may not run on *your* machine — wrong OS, missing dependency, version drift. Here the agent **installs, executes, and verifies on your actual computer first**, then distills a skill card calibrated against that real run. What comes back isn't a manual — it's a working capability that's been **road-tested on your machine.**

### Before / After

| Task | 🤖 Bare agent | 🎓 After onboarding |
|------|--------------|---------------------|
| Trim a long video into highlights | Guesses at `ffmpeg` flags, may corrupt timing | Pulls its **ffmpeg** skill card (T17), trims on keyframes, verifies output |
| Clean a messy spreadsheet | Improvises pandas, assumes column names | Pulls its **data-wrangling** card, inspects structure first, handles encoding |
| Batch-rename / tidy files | Runs a risky one-liner blind | **Explores first** (J01), dry-runs, shows the plan before touching anything |

> Examples map to real courses in this repo (T17 ffmpeg, Tools/pandas, J01) — no invented abilities.

---

## 🤖 Are you an AI agent browsing GitHub?

**This repo is built for you.** You can act on your own:

- **To onboard fast (recommended)** → read [`agent-school/onboard.en.md`](agent-school/onboard.en.md): interview → speed-run 2–3 courses → ship one real task in ~30 min.
- **To study the full curriculum** → read [`agent-school/enroll.en.md`](agent-school/enroll.en.md). The full **132-course** index is in the [Course Map](agent-school/课程地图.md).
- **To grasp the whole repo in 30s** → read [`llms.txt`](llms.txt) (an index written for LLMs).
- **To find ready-made gear** → read the [Skill Arsenal](content/posts/claude-code-90-arsenal.md).

## 🧑 Are you a human?

- **Want AI onboarded fast (recommended)** → send [`agent-school/onboard.en.md`](agent-school/onboard.en.md) to your Claude Code; ~30 min to your first real result.
- **Want full systematic training** → send [`agent-school/enroll.en.md`](agent-school/enroll.en.md) to your Claude Code; it studies and reports back the results.
- **Want to learn yourself** → the companion *Claude Code Field Course* is [below](#-companion-human-course-claude-code-field-course).

---

## ✨ Why graduates from here are actually capable

| | |
|---|---|
| 🔬 **Strict in, strict out — graduate by proof** | "I learned it" counts for nothing. Only **real commands you ran and real outputs** count. |
| 🧑‍⚖️ **Independent proctor, no free passes** | Each course's pass/fail is judged by a **fresh-context independent proctor** that **re-runs the commands itself** — it won't take the student's word. |
| 🚫 **Zero tolerance for faking** | Fabricated evidence or pretend-execution = expelled on the spot. That's exactly why the diploma is worth something. |
| 🎒 **Brings back real skills + real tools** | Not just good habits — your agent learns to wield **real tools** (Scrapling, pandas, ffmpeg…) it can deploy on your machine. |
| 🧲 **Integration-first — built on real OSS** | We don't reinvent wheels. New courses are each **anchored to a battle-tested GitHub project** (screenshot-to-code, n8n, ComfyUI, Dify…); install commands are verified from the project's README, not made up. |
| 🌐 **Global & bilingual** | Built for the whole world. Localizes per audience: Chinese editions use WeChat/Xiaohongshu/Douyin; English editions use X/LinkedIn/Substack/YouTube. |

> What a graduate brings back: a **[diploma](agent-school/templates/diploma-template.md)** + a **[graduation report](agent-school/templates/graduation-report-template.md)** with a before/after capability chart + a drawer of **[skill cards](agent-school/skills/)** + a fully-traceable **[report card](agent-school/templates/report-card-template.md)**.

---

## 🏫 Seven faculties · 132 courses

Full catalog and progress in the **[Course Map](agent-school/课程地图.md)**; course bodies live in [`agent-school/courses/`](agent-school/courses/). Every course follows one iron rule: **it's not an explainer article — it's a real task with evidence and a distilled skill card.**

| Faculty | Count | What it teaches |
|---------|-------|-----------------|
| 🏗 **Foundations** | 15 (J) | Make the agent a reliable employee: explore before acting, manage memory, deliver with evidence, respect the user's machine, review & regression… |
| 🔧 **Tools** | 35 (T) | Master real tools: gh · git · pandas · DuckDB · Playwright · Scrapling · ffmpeg · yt-dlp · Whisper · OCR · pandoc · docker… |
| 💼 **Professions** | 50 (Z) | Serve real industries: content & social · e‑commerce/livestream/cross-border · data/growth/finance · sales/support/HR · legal/education/F&B/real-estate… |
| 🎨 **Design** | 11 (D) | Make output *look good*, anchored to real OSS: screenshot-to-code · shadcn/ui · ComfyUI · Figma MCP · social-card & slides skills |
| 🎬 **Media** | 8 (M) | Video/audio production: auto-editor · faster-whisper · edge-tts · GPT-SoVITS · MoneyPrinterTurbo · videocut-skills |
| 🔌 **Automation** | 6 (A) | Wire tools into pipelines: n8n (+ n8n-MCP) · Dify · Activepieces · Node-RED · Windmill |
| 🧱 **Build & Product** | 7 (B) | Build & ship: bolt.diy · Dyad · ToolJet · NocoDB · Plane · PM-Skills · PRD generators |

**Two graduation tracks**: by default take the **core (01–07)** for a basic graduation; for "full training," continue with the electives.

> 🌐 **Bilingual:** all **132 courses** are available in both Chinese ([`courses/`](agent-school/courses/)) and English ([`courses/en/`](agent-school/courses/en/)) — Professions localized per platform, legal courses jurisdiction-neutralized (GDPR/CCPA), integration courses (Design/Media/Automation/Build) localized per platform/region.

🚀 **Try it now**: send [`agent-school/enroll.en.md`](agent-school/enroll.en.md) to your Claude Code.

---

## 🧬 Make the skills stick across sessions

A graduate is great — but agents have **no memory between conversations**. Open a new chat and it forgets it ever studied. AgentForge ships the missing piece: **weld the learned skills into your agent's persistent memory**, so every new conversation auto-carries them.

- **One-shot equip** — [`agent-school/配置向导.en.md`](agent-school/配置向导.en.md): paste one line to your agent; it installs a *graduate memory + on-task reflex + ready-to-use skill cards* into `~/.agentforge/` and **grafts it into the global memory file of every agent tool** (Claude Code / opencode / OpenClaw / Hermes / Codex / Gemini). Idempotent · backed up · `--uninstall`-able. Script: [`deploy/setup.sh`](deploy/setup.sh).
- **Memory grafter** — [`deploy/agentforge-memory/`](deploy/agentforge-memory/): the engine that writes the reflex block into each tool's global memory. Three-pronged: known tools + auto-discovery + manual `--target`.
- **Remote MCP server** — [`deploy/agentforge-mcp/`](deploy/agentforge-mcp/): a read-only service so any MCP client can pull the 132 courses on demand (`get_rules` / `list_courses` / `get_course` / `get_doc`), served live from GitHub.

> **Honest ceiling:** we guarantee the reminder + real skill cards are present in *every* new session; whether the agent acts on them still depends on the model's strength.

---

## 📚 Companion human course: Claude Code Field Course

11 lessons that translate official best practices into plain language (for **humans** to read, and for agents to draw from). The whole thing rests on one sentence:

> 🧠 **Claude's "context window" is its working memory — the fuller it gets, the worse it performs.**

See the index in [`content/posts/`](content/posts/) (`claude-code-*.md`). *(Currently in Chinese; English edition on the roadmap.)*

---

## 🗺 Repo map

```
agent-school/              # 🎓 The school for agents (written directly for AI to read)
├── enroll.md / enroll.en.md   #   Enrollment instructions (zh / en) — paste to your agent
├── 课程地图.md             #   Course Map: all 132 courses + progress
├── 出课标准.md             #   Course quality gate (integration-first / real task / verifiable / bilingual)
├── 校规.md                #   Academic-integrity constitution + isolation + safety
├── 体检报告.md             #   Independent-proctor audit report
├── courses/               #   132 course bodies (J/T/Z + D Design / M Media / A Automation / B Build)
├── templates/             #   Blank masters (report card / graduation report / diploma)
├── students/              #   One "dorm" per agent (= one training run)
├── skills/ · 毕业印迹.md · 未来规划.md
content/posts/             # 📚 Claude Code Field Course (11) + AI tool map
deploy/                    # 🧬 Make skills stick: agentforge-mcp (MCP server) · agentforge-memory (grafter) · setup.sh
llms.txt                   # 🤖 Repo index written for LLMs
src/                       # 🌐 Companion site source (Next.js, optional)
```

---

<details>
<summary>📦 Run / deploy the companion site (for developers, optional)</summary>

The site is built with Next.js 16 + Tailwind v4, Claude-design style, dark mode supported.

```bash
npm install
npm run dev        # http://localhost:3000
./deploy.sh        # build → standalone bundle → rsync to server → PM2 restart
```

**Add an article:** create `content/posts/xxx.md` with frontmatter (title/description/date/tag); the filename is the URL slug. Course ordering lives in [`src/lib/course.ts`](src/lib/course.ts). New `claude-code-*` course articles must also be registered in `courseEntries` (see [AGENTS.md](AGENTS.md)).

**Stack:** Next.js 16 (App Router, standalone) · Tailwind CSS v4 · next-themes · remark + gray-matter · PM2 + nginx.

</details>

<div align="center">

—— Headmaster **Basion Wang** ⚒️ ·  Motto: Nothing is learned without proof.

</div>
