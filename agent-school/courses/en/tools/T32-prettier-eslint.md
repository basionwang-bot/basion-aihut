> 🌐 English ｜ [中文](../../tools/T32-prettier-eslint.md)

# Lesson T32 · Prettier + ESLint: Auto-formatting and Linting

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 + T01 (gh-cli), T02 (git-advanced) ｜ Difficulty: ★★☆ ｜ Source: Prettier official docs · [prettier.io/docs/](https://prettier.io/docs/) · ESLint official docs · [eslint.org/docs/latest/](https://eslint.org/docs/latest/)

---

## 📖 What you'll learn

After this lesson, you'll be able to use Prettier and ESLint to automatically clean up the code style of a JavaScript/TypeScript project and catch potential problems — like having an tireless "code aesthetics officer + quality inspector" sitting next to you, grooming your code every time you finish writing and picking out obvious bug seeds along the way.

Picture a team of 10 developers writing code together: some use 2-space indentation, some use 4-space; some use single quotes, some double; some add semicolons at line ends, some don't. When merging code, differences are everywhere. During code review, half your mental energy goes to "why did this line wrap?" instead of the actual logic. That's life without a formatter.

**Prettier** does **forced cosmetic work** — it doesn't negotiate with you; it simply reformats your code to a unified standard, ending all style debates. **ESLint** does **problem detection** — things like variables declared but never used, unreachable code, and unsafe patterns. Together: Prettier handles "does it look good?", ESLint handles "is it correct?".

**Official resources:**
- Prettier docs: [prettier.io/docs/](https://prettier.io/docs/)
- Prettier config options: [prettier.io/docs/options](https://prettier.io/docs/options)
- ESLint docs: [eslint.org/docs/latest/](https://eslint.org/docs/latest/)
- ESLint rules list: [eslint.org/docs/latest/rules/](https://eslint.org/docs/latest/rules/)
- eslint-config-prettier (prevents conflicts): [github.com/prettier/eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)

---

## 🧠 Core principles (internalize these as habits)

1. **Prettier owns formatting; ESLint owns logic — they are two different people.** Don't let them fight each other. By default, ESLint also has formatting rules (indentation, quotes, semicolons) that conflict with Prettier. The fix is to install `eslint-config-prettier`, which disables all ESLint rules that overlap with Prettier, letting each do its own job.

2. **Config files are a contract — the whole team signs it.** `.prettierrc` and `eslint.config.js` must both be committed to the git repository. That way every developer and every CI machine uses the same rules — no more "passes locally, fails in CI."

3. **Run Prettier first, then ESLint.** Order matters: format first, then check logic. The reverse can produce conflicts.

4. **`--check` mode and `--write` mode are completely different.** `--check` only tells you "there's a problem" without touching files — right for CI. `--write` modifies files directly — right for local fixes. **Before running `--write` in an unfamiliar repository, ask the owner first** — it rewrites files in place.

5. **Not every file should be formatted.** Use `.prettierignore` to exclude auto-generated files (e.g., `dist/`, `build/`, `.next/`) — those are build artifacts; reformatting them is pointless and creates mountains of noisy git diffs.

---

## 🛠 How to do it

### Installation

```bash
# Install locally in your project (local install preferred over global — avoids version conflicts)
npm install --save-dev prettier eslint

# Also install the bridge package that prevents conflicts
npm install --save-dev eslint-config-prettier

# For TypeScript projects, also install:
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

> ⚠️ **Ask the owner before installing.** `npm install` modifies `package.json` and `node_modules/` — that's a project-level change.

### Prettier config file (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

Plain-English translation:
- `semi: true` → add semicolons at line ends
- `singleQuote: true` → use single quotes
- `printWidth: 100` → wrap only if the line exceeds 100 characters
- `tabWidth: 2` → 2-space indentation
- `trailingComma: "es5"` → trailing comma on last item in objects/arrays (keeps git diffs cleaner)

### ESLint config file (`eslint.config.js` — ESLint v9 flat config format)

```javascript
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,  // ESLint recommended rules
  prettierConfig,           // disable formatting rules that conflict with Prettier
  {
    rules: {
      'no-unused-vars': 'warn',     // variable declared but never used: warning
      'no-console': 'warn',         // don't leave console.log in production code: warning
      'eqeqeq': 'error',            // must use === not ==: error
    }
  }
];
```

### `.prettierignore` example

```
# .prettierignore
node_modules/
dist/
build/
.next/
*.min.js
package-lock.json
```

### Common commands quick reference

```bash
# Prettier: check which files don't match the format (does not modify files)
npx prettier --check "src/**/*.{js,ts,tsx}"

# Prettier: format and overwrite files (ask the owner before running this!)
npx prettier --write "src/**/*.{js,ts,tsx}"

# ESLint: check for problems (does not modify files)
npx eslint "src/**/*.{js,ts}"

# ESLint: auto-fix fixable problems (will modify files!)
npx eslint --fix "src/**/*.{js,ts}"

# Check the entire project in one command (good to add to package.json scripts)
npx prettier --check . && npx eslint .
```

### `scripts` section to add to `package.json`

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "check": "prettier --check . && eslint ."
  }
}
```

Once added, `npm run check` runs all checks in one shot.

### Embedded quiz: answer without running anything

**Q1.** Which of these commands modifies files?
- A) `npx prettier --check src/`
- B) `npx prettier --write src/`
- C) `npx eslint src/`

**Q2.** Why do you need to install `eslint-config-prettier`?

**Q3.** What directories are typically listed in `.prettierignore`? Name at least 2.

**Q4.** Which of these is Prettier's responsibility and which is ESLint's?
- `"semi": true` (add semicolons at line ends)
- `'no-unused-vars': 'warn'` (warn about unused variables)

> Reference answers: Q1 → B; Q2 → prevents ESLint's formatting rules from conflicting with Prettier; Q3 → `node_modules/`, `dist/`, `build/`, `.next/`, and other build artifact directories; Q4 → the first is Prettier, the second is ESLint.

---

## 📝 Graduation test (do it for real, submit evidence)

**Task: set up a complete Prettier + ESLint workflow for a sample JS project and produce a check report.**

1. **Write out the complete contents of these 4 config files:**
   - `.prettierrc`
   - `.prettierignore`
   - `eslint.config.js`
   - The `scripts` section in `package.json` (including `format:check` and `lint`)

2. **Write a "deliberately ugly" test file `src/demo.js`:**
   ```javascript
   // Intentional issues: mixed quotes, inconsistent indentation, unused variable
   const unusedVar = 42
   function greet(name){
     console.log("Hello, "+name)
       return name
   }
   greet('world')
   ```

3. **Predict the results** (without actually running anything):
   - What would `npx prettier --check src/demo.js` report? (What formatting issues?)
   - What would `npx eslint src/demo.js` report? (What logic/quality issues?)

4. **Write the corrected version of `src/demo.js`** that passes both Prettier and ESLint.

5. **Write the acceptance criteria:**
   - `npm run format:check` exits with code 0 (all formatting correct)
   - `npm run lint` exits with code 0 (no errors; warnings acceptable)
   - No need to actually run these — reasoned inference counts, but you must explain the logic of each step

6. **Distill a skill card:** condense the core Prettier/ESLint config, commands reference, and conflict resolution approach into `skills/prettier-eslint.md`.

> ⚠️ **Safety boundary:** `npm install` and `--write` / `--fix` commands **will modify files or dependencies** — in the owner's project, you must get explicit confirmation before running them. `--check` mode is read-only and safe to run first.

---

## 🎓 Pass criteria

- [ ] You wrote a **complete `.prettierrc` and `eslint.config.js`** and can explain every field
- [ ] You can distinguish **what Prettier vs. ESLint each covers**, and why `eslint-config-prettier` is needed
- [ ] You can explain the difference between `--check` and `--write`, and when `--write` is safe to use
- [ ] You predicted and listed the formatting + logic problems in `src/demo.js`, and wrote the fixed version
- [ ] You understand the purpose of `.prettierignore` and know which directories should be excluded
- [ ] Distilled 1 skill card into [`agent-school/skills/`](../../../skills/)
- [ ] An **independent proctor** (a fresh-context subagent, or the low-spec fallback in ../../../校规.md rule 4) marks it "pass"

All boxes checked and proctor says pass — log it in your report card and move on to Lesson T33.
