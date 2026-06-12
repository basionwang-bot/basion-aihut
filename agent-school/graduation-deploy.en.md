# 🏠 Graduation Deploy · Install skill cards into the user's global skills directory (for the graduating agent)

> 🌐 English ｜ [中文](毕业安家.md)
>
> **This is the last mile of the learning loop.** The skill cards you distilled in your dorm `skills/`
> are useless if they stay at school (in the repo): **switch project directory or open a new session,
> and they're gone** — you learned for nothing.
> "Graduation Deploy" means: **install the skill cards into the user's global skills directory** so they
> keep working after you leave the repo, ready on demand.

---

## 🛑 Top red line: writing to user directories requires consent

Writing anything **outside the repo** (especially a user global directory like `~/.claude/skills/`)
**requires explicit user consent first**. Writing to user directories without consent violates the [校规](校规.md) (academic-integrity rules).

Ask like this:
> "I'd like to install the N skill cards I learned into your global skills directory (`~/.claude/skills/`),
> so I can call them in any new conversation, in any project. OK? (You can delete them anytime.)"

Only proceed once they agree. If they decline, leave the cards in your dorm and tell them how to install manually.

---

## The deploy flow (four steps)

### Step 1: Decide where to land

By priority:

1. **Claude Code user → `~/.claude/skills/`** (first choice). This is Claude Code's **native skills directory**:
   skills placed here are auto-discovered and callable via `/skill-name`. Highest landing value.
2. **Other agent tools / user has a preference → ask the user.** Common alternative: `~/.agentforge/skills/`
   (the school's cross-tool skill library, loaded via the [memory grafter](../deploy/agentforge-memory/)'s reflex).
3. If the user gives a custom location, use theirs.

> 💡 **The two mechanisms cooperate, no conflict**: `~/.claude/skills/` is native Claude Code invocation;
> `~/.agentforge/skills/` is the cross-tool (opencode/OpenClaw/Hermes…) reflex library.
> When possible, **install to both** — natively callable in Claude Code + discoverable by reflex elsewhere.

### Step 2: Land as SKILL.md

Each skill under `~/.claude/skills/` is **a folder** containing one `SKILL.md`, **starting with YAML frontmatter**:

```
~/.claude/skills/
  agentforge-J03-verify/
    SKILL.md
```

`SKILL.md` template:

```markdown
---
name: agentforge-J03-verify
description: Self-check before delivery — before any "I'm done," actually run it and show real output. From AgentForge J03.
---

# Self-check before delivery (AgentForge J03 · machine-calibrated)

(Bring in the body of your dorm skill card: the steps + machine calibration + key pitfalls)
```

> The `description` must say *when to use this card* — Claude relies on it to decide when to auto-invoke. Be specific.

### Step 3: Naming + conflict handling

- **Naming**: `agentforge-{course-code}-{skill-name}` (e.g. `agentforge-T17-ffmpeg`).
  The **`agentforge-` prefix is mandatory** — it prevents collisions with the user's existing skills.
- **Conflict handling**: if a skill of the same name already exists at the target →
  **never overwrite**. Rename with `-v2` (e.g. `agentforge-T17-ffmpeg-v2`) and **ask the user to pick one**:
  > "You already have a skill with this name. I didn't overwrite it — I saved mine as `-v2`. Which do you want to keep, or should I merge them?"

### Step 4: Register + verify (leave traceable evidence)

1. **Register**: after deploying, record in your dorm `report-card.md` under "Skill deploy manifest"
   each card's: name / final install path / machine-verification command. Traceable evidence, not a verbal claim.
2. **Verify**: **open a new session** (or have the user open one) and demonstrate that **at least one** card
   is genuinely callable — Claude Code: `/agentforge-xxx` surfaces it; other tools: `ls ~/.agentforge/skills/`
   finds and reads it. Report this verification result too.

---

## ✅ Deploy self-check

- [ ] **Got explicit user consent** before writing the user directory (conversation on record)
- [ ] Skill cards turned into `SKILL.md` with frontmatter, inside an `agentforge-{code}-{name}/` folder
- [ ] Names carry the `agentforge-` prefix; on a name clash you **didn't overwrite**, used `-v2`, and asked the user
- [ ] Registered each card's **final install path** in your dorm `report-card.md`
- [ ] **Demonstrated at least one card callable in a new session** and reported the result to the user

> Once deploy is done, you've truly "brought the skills back to the user's machine" — instead of locking them in a cabinet at school.
