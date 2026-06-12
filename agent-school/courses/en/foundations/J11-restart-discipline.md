> 🌐 English ｜ [中文](../../foundations/J11-restart-discipline.md)

# Lesson J11 · Error-Correction and Restart Discipline

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J10 ｜ Difficulty: ★★☆ ｜ Source: this repo's "Core Law: Two Failed Corrections → Clear and Restart" module + "Crash Scene ②: Endless Corrections" module + Anthropic best practices (context hygiene)

---

## 📖 What you'll learn

After this lesson, you'll have mastered one habit that is **counterintuitive but extremely valuable**: when the same problem has been corrected twice and still isn't right, call it off decisively, clear the context, and start fresh — instead of continuing to dig deeper into a dead end.

Imagine you're looking for your keys in a dark room. First search — not found. Second search — still not found. Now you have two choices:

**Choice A (fixated type):** I've gone through this drawer twice already, I must have missed something — one more pass, another pass… End up going through it ten times, and the keys were never in this drawer to begin with.

**Choice B (wise type):** Two passes and nothing — the keys aren't in this drawer. Turn on the light, try a different angle, search again.

You are Choice B. **Two failures are a piece of information: the current approach is wrong. You don't need more repetition — you need a fresh perspective and a restart.**

---

## 🧠 Core principles (internalize these as habits)

1. **Two corrections without success means no third correction.** This is an iron rule, not a suggestion. A third correction attempt is usually worse than the first two — because the context has already been contaminated by two rounds of failed drafts, and continuing to twist it only makes things more tangled.

2. **Failed attempts are liabilities, not assets.** Every failed correction piles up in the context — the desk gets messier and messier, more and more expensive to work on. Dragging it along only burns your efficiency.

3. **Restarting is a strategy, not surrendering.** The proper meaning of "restart" is: I distill the lessons earned by two failures, carry that smarter opening, and launch again on a clean desk. This is an advance, not a retreat.

4. **The restart prompt must be better than last time.** Restarting is not playing back the last attempt word for word. Two failures gave you information — "it didn't understand this phrasing," "that edge condition wasn't stated clearly." Fold those insights into the new first message — that is the value of restarting.

5. **Knowing when to restart and knowing how to restart are equally important.** You need all three: the judgment to call it, the action to do it, and the ability to write a better opening prompt.

---

## 🛠 How to do it

**"Time to restart" checklist (trigger a restart when any of the following applies):**

- The same problem or error has been corrected twice and the second result is still wrong
- You sense the context is "muddled by all those previous failed attempts" — it's starting to forget things, say contradictory things, drift further with each edit
- You find yourself saying more and more to explain the same thing, with decreasing effect
- The current session's goal has drifted far from the original task and it's hard to pull it back

**Three-step restart method:**

```
Step 1: Summarize
  Write down what the two failures told you:
  - What phrasing did it misunderstand?
  - What edge condition wasn't stated clearly?
  - What assumption was wrong?

Step 2: Distill
  Condense those lessons into a better opening prompt:
  - Add the constraints that were missing before
  - Replace the phrasing that caused misunderstanding
  - Explicitly write out "what counts as doing it correctly"

Step 3: Restart
  Clear the current context (/clear or start a new session),
  begin again with the new prompt, carrying none of the old baggage.
```

**Bad restart prompt vs. good restart prompt:**

| | Bad restart prompt | Good restart prompt |
|---|---|---|
| Content | "You didn't do it right last time, try again" | "The task is X. Note: from previous attempts I discovered [specific lesson]. This time it needs to satisfy [clear constraint], judged correct by [specific standard]." |
| Character | Brings the memory of failure in | Brings the wisdom earned by failure in; the failure itself stays in the old context |

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: write a decision framework for "when to restart" plus an example of a better restart opening prompt.**

Steps:

1. **Write the decision framework**: based on this lesson's principles, write in your own words a checklist of "the conditions under which I will trigger a restart" (at least 5 entries; they must be concrete and actionable — not copied verbatim from the lesson).

2. **Write a restart opening prompt**: design a specific scenario — imagine you are helping the owner fix the formatting of one of the lessons under `agent-school/courses/`, and after two corrections it still isn't right. Based on this scenario, write out:
   - What each of the two failures told you (use specific hypothetical details)
   - A **better restart opening prompt** (in the format above, with the lessons folded in)

3. **Write all of the above into** `agent-school/skills/restart-discipline-demo.md`.

4. **Distill a skill card**: condense the "Error-correction and restart three-step method" into `agent-school/skills/restart-discipline.md`.

> ⚠️ This lesson requires no internet access, no real accounts, and no changes to any lesson files. All you need to do is think and write files. The test scenario is hypothetical — do not actually go and edit the lesson file.

---

## 🎓 Pass criteria

- [ ] Your decision checklist has at least 5 entries and each is **concrete and actionable** (not vague like "restart when something feels off")
- [ ] Your restart prompt example has a **specific scenario** and clearly shows "folding the lessons in" (not replaying the last attempt)
- [ ] You can clearly explain what "restarting is a strategy, not surrendering" means (expressed in your own words in the file, not copied from the lesson)
- [ ] Both files have been produced (the demo file + the skill card)
- [ ] Distilled 1 skill card into your dorm's skills/
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson J12.
