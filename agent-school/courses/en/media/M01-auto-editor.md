> 🌐 English ｜ [中文](../../media/M01-auto-editor.md)

# Lesson M01 · auto-editor: Let AI Automatically Cut Pauses and Filler

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★☆☆ ｜ Source: [github.com/WyattBlue/auto-editor](https://github.com/WyattBlue/auto-editor)

---

## 📖 What you'll learn

After this lesson, you'll be able to take a rough, pause-filled talking-head recording your host made, and with a single command produce a clean, polished final cut — like giving the video an "automatic haircut."

Picture this: you and your host spent two hours recording a course, and the footage is littered with thirty-odd "um…", "uh…", and dead-air pauses. Before, you'd have to open editing software and manually listen through every segment, deleting each one by hand. With **auto-editor**, one command is all it takes — the tool analyzes the audio loudness, cuts every silence and pause, and hands back a finished MP4. The whole time you were making a cup of tea.

**auto-editor** is a purely local command-line tool: open-source (Public Domain / Unlicense), no GPU required, no API key needed, runs on Windows/macOS/Linux. It doesn't only cut silence — it can also cut based on motion in the frame, accept manual cut-point markers, and even export a timeline for Premiere/DaVinci Resolve/Final Cut Pro for further fine-editing.

**This lesson covers only the single most essential path — cutting pauses: install, run, ship the final cut.**

**Official resources:**
- Repository: [github.com/WyattBlue/auto-editor](https://github.com/WyattBlue/auto-editor)
- PyPI: [pypi.org/project/auto-editor/](https://pypi.org/project/auto-editor/)

---

## 🧠 Core principles

1. **It listens for "where there's no sound."** By default, auto-editor analyzes audio loudness — any segment whose level falls below a certain dB threshold is a "cut zone." Think of a recording engineer marking all the "dead silence" stretches in raw footage, then batch-deleting them. You don't need to understand video encoding; the tool has that logic built in.

2. **`margin` (padding) is the soul parameter.** Cut too aggressively and the video feels breathless; leave too much padding and there's no point. `--margin 0.3s` keeps 0.3 seconds of buffer before and after each retained segment — like leaving a little edge when cutting hair, rather than shaving to the scalp. Fine-tune this number to match your host's speaking rhythm.

3. **Fully local, zero API dependency.** Data never leaves the machine; the host's content is never uploaded to any cloud. That matters for enterprise material and recorded courses.

4. **Input/output share the same name with a suffix.** The default output filename is `[INPUT]_ALTERED.[EXT]` — so `video.mp4` becomes `video_ALTERED.mp4`. The original is never overwritten.

5. **Works alongside professional software.** If your host wants to continue fine-editing in DaVinci Resolve, use `--export resolve` to export an XML timeline, skipping the rough-cut stage entirely and saving a ton of time.

---

## 🛠 How to use it

### Installing auto-editor

> ⚠️ **Get your host's confirmation before installing.** The command below installs a package into the host's Python environment.

```bash
# Requires Python 3.9 or higher
pip install auto-editor
```

Verify after installation:
```bash
auto-editor --version
```

> ⚠️ **Note:** The PyPI page suggests newer versions prefer brew or official binary installation. If pip has issues, download the binary for your OS from [github.com/WyattBlue/auto-editor/releases](https://github.com/WyattBlue/auto-editor/releases).

---

### Quick command reference

**Simplest: cut silences with one command**
```bash
auto-editor video.mp4
```
Output: `video_ALTERED.mp4` (same directory as the original)

**Adjust the buffer before and after silence (try this first)**
```bash
auto-editor video.mp4 --margin 0.3s,1.5sec
```
Meaning: keep 0.3 s before a silent section, 1.5 s after. Makes edits less abrupt.

**Manually set the dB threshold**
```bash
auto-editor video.mp4 --edit audio:-19dB
```
Segments below −19 dB are treated as silence and cut. A smaller value = more conservative (only truly quiet passages are cut).

**Manually mark a cut-out range (bypass auto-detection)**
```bash
auto-editor video.mp4 --cut-out 0,30sec
```
Cuts the first 30 seconds directly (e.g., pre-recording setup footage).

**Export timeline for DaVinci Resolve**
```bash
auto-editor video.mp4 --export resolve
```

**Export timeline for Premiere Pro**
```bash
auto-editor video.mp4 --export premiere
```

---

### Full workflow (talking-head video scenario)

```
① Host records talking-head video → video.mp4 (raw footage with pauses)
② You run: auto-editor video.mp4 --margin 0.3s,1.0sec
③ Tool analyzes audio → marks silent zones → outputs video_ALTERED.mp4
④ Host previews the final cut; if happy, publish directly.
   If further editing is needed, use --export resolve to import into DaVinci.
```

---

### Safety checklist

```
□ Got host's confirmation before running pip install
□ Clearly told the host where the output file is (same directory, _ALTERED suffix)
□ Confirmed host has backed up originals before any delete/overwrite operations
□ Confirmed the host's editing software version is compatible before exporting timelines
```

---

## 📝 Graduation exercise (must actually do it — submit evidence)

**Task: run an automatic edit pass on one of the host's talking-head recordings and deliver the finished cut.**

1. **Confirm the source video**: agree with your host on a test video (any talking-head recording with pauses — even a 1-minute phone recording works).

2. **Install the tool**: get the host's confirmation, then run `pip install auto-editor`. Run `auto-editor --version` and record the version number.

3. **Run the basic edit**:
   ```bash
   auto-editor [host's video file] --margin 0.3s,1.0sec
   ```
   Record: what did the command output? Where is the output file? How much did the file size change?

4. **Compare before and after**: original duration vs. edited duration. What percentage of content was removed?

5. **Save a skill card**: document "auto-editor installation steps + core commands + margin parameter explanation + export options" as `skills/auto-editor.md`.

> ⚠️ **Safety boundaries:**
> - Get host's confirmation before installing
> - Confirm host has backed up source material before editing
> - Do not delete the original; only produce a `_ALTERED` output file

---

## 🎓 Passing criteria

- [ ] You can explain how auto-editor decides what to cut (audio loudness detection)
- [ ] You ran the correct install command and verified the version number
- [ ] You ran `auto-editor video.mp4` successfully and produced an `_ALTERED` final cut
- [ ] You can explain the `--margin` parameter and how to adjust it
- [ ] You know how to use `--export` to send a timeline to DaVinci/Premiere
- [ ] You recorded before-and-after duration (with numerical evidence)
- [ ] Saved 1 skill card to your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (fresh-context sub-agent, or the low-config fallback per [School Rules §4](../../../校规.md)) passes you

All boxes checked and examiner says pass — log it on your report card and continue to the next lesson.
