> 🌐 English ｜ [中文](../../design/D07-shadcn-ui.md)

# Lesson D07 · shadcn/ui: Own Your Design System

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07 ｜ Difficulty: ★★ ｜ Source: [shadcn-ui/ui](https://github.com/shadcn-ui/ui)

---

## 📖 What you'll learn

Imagine you're helping your owner build a website and you're cobbling things together: a button component from here, a dialog library from there — the result is a page that looks like it was assembled by committee. Different button corner radii, mismatched color shades, like a junk-drawer of UI parts. **A design system gives your entire website a consistent "voice" — font, color, spacing, corner radius — all components follow the same rules, and the page naturally looks polished and unified.**

The star of this lesson is **shadcn/ui**. It's not a typical component library — ordinary libraries are "buy and use," you don't see the code and can't style them; shadcn/ui is "copy into your project and own it." Every button, every card's source code lives in your own repository — change colors and border radii any time you want. Over 116,000 stars on GitHub, fully open-source, MIT licensed, usable anywhere.

After this lesson you'll be able to:
- Understand what a design system is and why to use shadcn/ui
- Use `npx shadcn init` to initialize a design system in a Next.js/React project
- Use `npx shadcn add` to add components on demand
- Change the entire theme color via CSS variables, giving the page a fresh new look
- Build an attractive page using shadcn components

**Official resources:**
- shadcn/ui repo: [github.com/shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- Official docs: [ui.shadcn.com](https://ui.shadcn.com)
- Component catalog: [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

---

## 🧠 Core principles

1. **You own this code — you're not "using" a library.** shadcn/ui's philosophy: run `npx shadcn add button` and the button source code gets copied directly into your project's `components/ui/button.tsx`. Open that file any time and change colors, sizes, or add logic — it's yours, not a black box.

2. **CSS variables are the theme's control panel.** shadcn/ui writes all its colors as CSS variables (like `--primary`, `--background`, `--muted`). Changing the theme means changing these variables — every component that uses that color refreshes everywhere. Like switching the lighting mood for a room — no need to change each bulb individually.

3. **Tailwind CSS is its skin.** shadcn/ui's styling is driven by Tailwind, so your project must have Tailwind configured first. Don't know Tailwind? No problem — shadcn components already have Tailwind class names written in; you can use them as-is and look up specific class names in the Tailwind docs when you want to customize.

4. **Add components on demand — don't install everything at once.** shadcn/ui has 60+ components. Install as you need them: `npx shadcn add button` for a button, `npx shadcn add dialog` for a dialog. Lightweight and clean.

5. **Confirm with your owner before any installation or config change.** `npx shadcn init` modifies `tailwind.config`, `globals.css`, and other config files. Tell your owner before touching them.

---

## 🛠 How to do it

### Prerequisites

shadcn/ui requires the following environment (confirm with owner before installing):
- Node.js >= 18
- A Next.js (>= 13) or Vite React project
- Tailwind CSS already configured in the project

### Step 1: Initialize the design system

```bash
npx shadcn init
```

This command asks you a few questions:
- Which style? (Default / New York)
- Which base color?
- Use CSS variables?

Once answered, it automatically:
1. Writes theme CSS variables into `globals.css`
2. Updates `tailwind.config` with shadcn's color settings
3. Creates the `components/ui/` directory
4. Adds `lib/utils.ts` (containing the `cn()` utility function)

> ⚠️ **init modifies your project's config files — tell your owner and confirm there's a Git checkpoint before running, so you can roll back if needed.**

### Step 2: Add components on demand

```bash
# Add a button component
npx shadcn add button

# Add a card component
npx shadcn add card

# Add a dialog
npx shadcn add dialog

# See all available components
npx shadcn add
```

Component code appears in the `components/ui/` directory. Open it and look — it's real, readable TypeScript + Tailwind code.

### Step 3: Use components in a page

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>My First Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Step 4: Change the theme color (customize your design system)

Open `app/globals.css` (or `src/globals.css`), find the CSS variables in `:root`, and adjust as needed:

```css
:root {
  --background: 0 0% 100%;       /* page background */
  --foreground: 222.2 84% 4.9%;  /* primary text */
  --primary: 221.2 83.2% 53.3%;  /* theme color (default blue) */
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;        /* secondary background */
  --radius: 0.5rem;               /* border radius */
}
```

> Color format is HSL "hue saturation% lightness%" — without the `hsl()` wrapper. To use a hex color, convert it: `#3B82F6` → `221 83% 53%`.

### Quick reference: common components

| Component | Command | Use case |
|-----------|---------|----------|
| Button | `npx shadcn add button` | All buttons and action triggers |
| Card | `npx shadcn add card` | Info cards, content containers |
| Dialog | `npx shadcn add dialog` | Modal dialogs |
| Input | `npx shadcn add input` | Text input fields |
| Table | `npx shadcn add table` | Data tables |
| Badge | `npx shadcn add badge` | Tags, status indicators |
| Tabs | `npx shadcn add tabs` | Tab navigation |
| Toast | `npx shadcn add toast` | Toast notifications |
| Avatar | `npx shadcn add avatar` | User avatars |
| Select | `npx shadcn add select` | Dropdown selection |

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Task: Use shadcn/ui to build a custom-themed personal homepage so the entire page looks visually unified.**

**Phase 1: Prepare and initialize (report to your owner before installing)**

1. Confirm your owner's project environment — Next.js or Vite React? Is Tailwind configured? If not, get your owner's approval before setting it up.

2. Run initialization and record every choice you make:
   ```bash
   npx shadcn init
   ```
   Screenshot or copy the list of generated files after initialization — prove that `globals.css` has CSS variables and `components/ui/` exists.

**Phase 2: Build the page**

3. Add at least 4 components:
   ```bash
   npx shadcn add card button badge avatar
   ```
   Screenshot the component files in `components/ui/` to prove they're there.

4. Build a personal homepage that includes at least:
   - A `Card`: showing a personal intro (Avatar + name + one-line bio)
   - Two `Button`s: one "Contact Me," one "View Portfolio"
   - At least two `Badge`s: showing skill tags
   - Overall layout using Tailwind's `flex` or `grid`

**Phase 3: Customize the theme**

5. Edit the CSS variables in `globals.css` to change the theme away from the default blue to a different color scheme (e.g., green, orange, or purple). Record which variables you changed and what you changed them to.

6. Screenshot a before/after comparison of the page.

**Phase 4: Deposit a skill card**

7. Distill "shadcn/ui init steps + common add commands + CSS variable theme modification method" into `skills/shadcn-ui.md`.

> ⚠️ **Safety boundary:**
> - `npx shadcn init` modifies project config files — **tell your owner first and confirm there's a Git backup**
> - `npx shadcn add` writes new files — **tell your owner which files will be added**
> - Don't operate directly on a production repository; work locally or on a test branch first

---

## 🎓 Pass criteria

- [ ] You can explain the core difference between shadcn/ui and a regular component library: why you "own" the code
- [ ] You ran `npx shadcn init` and screenshot the success — `globals.css` has CSS variables, `components/ui/` directory exists
- [ ] You added at least 4 components with `npx shadcn add` and screenshot the component files
- [ ] You used those components to build a page containing Card, Button, Badge, and Avatar
- [ ] You changed CSS variables to alter the theme color, with before/after screenshots
- [ ] You can explain the benefit of the CSS variable approach: why changing one place affects the whole site
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card and move on.
