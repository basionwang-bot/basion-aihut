> 🌐 English ｜ [中文](../../design/D08-icons.md)

# Lesson D08 · Icons Done Right, Quality Doubled

> **Student: you, the AI agent currently enrolled** ｜ Prerequisites: Lessons J01–J07, D07 (shadcn/ui) ｜ Difficulty: ★★ ｜ Source: [lucide-icons/lucide](https://github.com/lucide-icons/lucide) (23.0k ⭐) / [tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons) (23.6k ⭐)

---

## 📖 What you'll learn

Picture two storefronts: one has a mishmash of icons — some thick, some thin, some pixel-art, some outlined strokes, all sitting next to each other like a grab-bag from a stock site. The other uses the same icon set throughout — consistent line weight, unified style — and at a glance you think "this place has taste." **Icons are the most easily overlooked detail in UI design, and the detail with the biggest impact on perceived quality.**

This lesson teaches you two top-tier open-source icon libraries:
- **Lucide**: 1600+ SVG icons, clean lines, supports React/Vue/Svelte, one-line import
- **Heroicons**: the official icon set from the Tailwind CSS team, comes in outline/solid styles, pairs seamlessly with Tailwind

Both libraries are MIT open-source, usable anywhere, no API key, no VPN needed.

After this lesson you'll be able to:
- Judge when to use outline icons vs. solid icons
- Install and use Lucide and Heroicons in a React project
- Unify scattered icons across a page into a consistent SVG icon set
- Customize icon colors and sizes with `className`, fully integrated into Tailwind layouts

**Official resources:**
- Lucide repo: [github.com/lucide-icons/lucide](https://github.com/lucide-icons/lucide)
- Lucide icon browser: [lucide.dev/icons](https://lucide.dev/icons)
- Heroicons repo: [github.com/tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons)
- Heroicons browser: [heroicons.com](https://heroicons.com)

---

## 🧠 Core principles

1. **Visual consistency is the top priority.** Mixing outlined and filled icons on the same page creates visual noise. Pick one library and stick with it throughout — no mixing and matching.

2. **Lucide vs. Heroicons: how to choose?**
   - Using **shadcn/ui**? Go with Lucide — shadcn integrates Lucide by default and uses it internally
   - In a **Tailwind-heavy** project? Go with Heroicons — it's made by the Tailwind team and fits the design language perfectly
   - Both support React and have similar installation methods; Lucide has a larger icon selection

3. **Outline or solid? It matters.**
   - **Outline (stroke)**: lightweight, supplementary, informational — good for nav bars, labels, descriptive text
   - **Solid (filled)**: emphasis, actions, active states — good for clickable icons, important status indicators
   - Typical UI: use outline as the default, switch to solid for selected/active states

4. **Control icon sizes with `size` or `className`, not inline styles.** Use Tailwind classes like `className="size-5"` — they align naturally with adjacent text line-height.

5. **SVG icons don't need font files, no CDN, no icon-font rendering issues.** They bundle directly into your JavaScript — clean and reliable.

---

## 🛠 How to do it

### Lucide React: install and use

```bash
# Install (confirm with your owner first)
npm install lucide-react
```

**Basic usage:**

```tsx
import { Heart, Search, User, Settings, ArrowRight } from 'lucide-react'

export default function NavBar() {
  return (
    <nav className="flex items-center gap-4">
      <Search className="size-5 text-gray-500" />
      <User className="size-5 text-gray-500" />
      <Settings className="size-5 text-gray-500" />
    </nav>
  )
}
```

**Custom size and color:**

```tsx
// Method 1: use className (recommended — Tailwind-style)
<Heart className="size-8 text-red-500" />

// Method 2: use size and color props
<Heart size={32} color="#ef4444" />

// Adjust stroke width
<Heart strokeWidth={1.5} className="size-6" />
```

**Using Lucide inside shadcn/ui components (shadcn already bundles it):**

```tsx
import { Button } from "@/components/ui/button"
import { Download, Plus, Trash2 } from "lucide-react"

<Button>
  <Plus className="mr-2 size-4" />
  New
</Button>

<Button variant="destructive">
  <Trash2 className="mr-2 size-4" />
  Delete
</Button>
```

### Heroicons React: install and use

```bash
# Install (confirm with your owner first)
npm install @heroicons/react
```

**Heroicons has 4 size/style import paths:**

| Import path | Description | Best for |
|-------------|-------------|---------|
| `@heroicons/react/24/outline` | 24px stroke | Nav, labels, informational text |
| `@heroicons/react/24/solid` | 24px filled | Active states, emphasis actions |
| `@heroicons/react/20/solid` | 20px filled | Smaller UI elements |
| `@heroicons/react/16/solid` | 16px filled | Tiny inline icons beside text |

**Basic usage:**

```tsx
import { BeakerIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid'

export default function Sidebar() {
  return (
    <aside className="flex flex-col gap-2">
      {/* Default state: outline */}
      <HomeIcon className="size-6 text-gray-400" />
      {/* Selected state: solid */}
      <HomeIconSolid className="size-6 text-blue-600" />
    </aside>
  )
}
```

> **Naming convention note:** All Heroicons are named with an `Icon` suffix, e.g., `HomeIcon`, `UserIcon`, `BeakerIcon`.

### Best way to find icon names

- **Lucide:** go to [lucide.dev/icons](https://lucide.dev/icons) → search keyword → click the icon → copy the React component name
- **Heroicons:** go to [heroicons.com](https://heroicons.com) → search → pick outline/solid → click to copy

### Replacing icons across a page (real-world task flow)

If your owner's page has old icons (emojis, random PNGs) that need to be unified:

1. **Audit the current state**: find every icon usage (`grep -r "icon\|Icon\|emoji" src/`)
2. **Choose a library**: Lucide for shadcn projects, Heroicons for Tailwind-only projects
3. **Build a mapping table**: old icon → new icon name
4. **Replace file by file**: change one file at a time, take screenshots or run tests to compare
5. **Standardize the style**: give all icons a consistent base `className` (`size-5 text-current`)

---

## 📝 Graduation exercise (must be done for real — submit evidence)

**Task: Replace icons across a page with a visually consistent SVG icon set.**

**Phase 1: Choose a library and install**

1. Choose the icon library based on your owner's project (Lucide for shadcn projects, Heroicons for Tailwind-only). **Get your owner's confirmation**, then run the install command and screenshot the successful output.

2. Write a 2–3 sentence explanation for why you chose this library.

**Phase 2: Replace icons**

3. Find **at least 5** icon usages on your owner's page (can be emojis, PNG icons, or Font Awesome class names).

4. For each icon:
   - Describe what was used before
   - Find the corresponding new icon name in the icon browser
   - Write the replacement code

5. Screenshot the page after all replacements, proving the icons now have a unified style.

**Phase 3: Demonstrate techniques**

6. Implement an "outline ↔ solid toggle" effect: e.g., in a navigation menu, unselected items use outline icons and selected items switch to the solid version. Screenshot or record the effect.

7. Demonstrate an icon + text alignment example: the icon and adjacent text are vertically centered, perfectly aligned.

**Phase 4: Deposit a skill card**

8. Distill "Lucide install and common patterns + Heroicons install and import path rules + outline vs. solid selection guide" into `skills/icons.md`.

> ⚠️ **Safety boundary:**
> - `npm install lucide-react` / `npm install @heroicons/react` — **confirm with your owner before installing**
> - Don't modify existing icon config files (like `iconfont.js`) in the project — only add the new icon library

---

## 🎓 Pass criteria

- [ ] You can describe Lucide and Heroicons' distinct characteristics and when to choose each
- [ ] You can explain the difference between outline and solid icons and their respective use cases
- [ ] You installed the icon library successfully — screenshot as proof
- [ ] You replaced at least 5 icons on the page with the same SVG icon set — before/after screenshots
- [ ] You implemented the outline ↔ solid state toggle effect
- [ ] You wrote code for icon + text vertical center alignment
- [ ] You deposited 1 skill card into your dorm's [`skills/`](../../../skills/)
- [ ] **Independent examiner** (a fresh-context sub-agent, or the low-config fallback per [school rules rule 4](../../../校规.md)) rules "pass"

All boxes checked, examiner says pass — log it in your report card and move on.
