<div align="center">

# suta

한국어: [README.md](README.md)

**UI without AI slop**

An agent skill that removes the tell-tale signs of AI-made UI.<br>
Install it once and Claude Code or Codex reads it automatically whenever they build UI.

[![Deploy demo](https://github.com/Guksu/suta/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/Guksu/suta/actions/workflows/deploy-demo.yml)
![Patterns](https://img.shields.io/badge/suta-53%20patterns-6ea8fe)
![Dependencies](https://img.shields.io/badge/runtime%20deps-0-34c759)
![Tests](https://img.shields.io/badge/tests-530%20passing-34c759)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[**Live demo**](https://guksu.github.io/suta/) · [What it removes](#what-it-removes) · [Installation](#installation) · [How it works](#how-it-works) · [53 patterns](#53-patterns) · [Development](#development) · [Contributing](#contributing)

</div>

## Overview

Hand a screen to an AI and it shows quickly. Every element gets `transition: all`, animations that move `height` make the page stutter, the reduced-motion setting is ignored, and buttons built from `div` can't be pressed with a keyboard. Output that looks plausible but never went through a careful hand is called **AI slop**.

**suta removes the UI that AI slop produces.** Once installed, the agent reads suta every time it works on UI. It keeps to the AI-slop rules below and adapts code from 53 patterns that come with tests, accessibility and reduced-motion support.

The name comes from the Korean *suta* (手打), "hand-made" — like noodles pulled by hand instead of pressed by a machine. The goal is UI finished by hand, not stamped out.

## What it removes

| What AI usually makes | With suta |
|---|---|
| `transition: all 0.3s ease` on everything | Only the properties that move, with durations and easing sized to the motion (motion tokens) |
| Animating `height` or `top`, so the page stutters | Only `transform` and `opacity` — the grid technique for height, FLIP for position changes |
| Ignoring the reduced-motion setting | Reduced-motion support in every stylesheet |
| `div` buttons that a keyboard can't reach | Native HTML elements with keyboard and screen reader support |
| Modals that leave focus, Esc and background scroll alone | Focus moves in and returns, Esc closes, the background is locked |
| Drag-to-dismiss that doesn't follow the finger | Follows the finger and decides from the release velocity |
| A lone spinner for loading, double submits on rapid taps | Skeletons that hold the layout, buttons locked while pending |
| Code written from scratch every time | 53 tested patterns copied and adapted to the project |

## Installation

Install once. After that, ask for UI as you normally would.

### Claude Code

```text
/plugin marketplace add Guksu/suta
/plugin install suta@suta
```

### Codex · Cursor · Gemini CLI · GitHub Copilot and others

Install with one line from the project root. Pick one of the two methods.

```bash
# Method 1 — skills CLI (detects installed agents and copies into each one's skill folder)
npx skills add Guksu/suta --skill suta

# Method 2 — this repo's install script (copies into .agents/skills/suta, needs only git)
curl -fsSL https://raw.githubusercontent.com/Guksu/suta/main/scripts/install-skills.sh | sh
```

| What you want | Command |
|---|---|
| Install into another folder | `… \| sh -s -- --dest .cursor/skills` |
| Use across your whole machine | `… \| sh -s -- --dest ~/.agents/skills` |
| Update | Run the same command again (only the `suta` folder is replaced) |

You can also copy the files by hand without the script.

```bash
git clone --depth 1 https://github.com/Guksu/suta.git
mkdir -p .agents/skills
cp -R suta/skills/suta .agents/skills/
```

| Tool | Project skill folder | Personal global folder |
|---|---|---|
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `.agents/skills/` or `.cursor/skills/` | `~/.agents/skills/` or `~/.cursor/skills/` |
| Gemini CLI | `.agents/skills/` or `.gemini/skills/` | `~/.agents/skills/` or `~/.gemini/skills/` |
| GitHub Copilot | `.agents/skills/`, `.github/skills/` or `.claude/skills/` | `~/.agents/skills/` or `~/.copilot/skills/` |
| Claude Code | `.claude/skills/` (or the marketplace above) | `~/.claude/skills/` |

Paths follow each tool's documentation as of September 2026. If a tool changes, check that tool's documentation.

### Moving from the old version (fe-skills)

- **Claude Code:** remove the old marketplace with `/plugin marketplace remove fe-skills`, then install with the commands above. If you installed the design Q&A plugin `fe-system`, remove it with `/plugin uninstall fe-system@fe-skills`.
- **Install script or skills CLI:** the old version installed a separate skill folder per pattern (`bottom-sheet/` and so on). They overlap with suta on the same requests, so delete them; the install script lists any that remain. Delete the design Q&A `design` folder too.

## How it works

1. **Install** — suta is a single skill. At startup the agent reads only suta's description.
2. **Ask as usual** — say "build a login screen" or "polish this button animation" and the agent recognises UI work and opens suta. You don't need to name the skill.
3. **Pick patterns** — the agent picks matching patterns from suta's catalog and reads each pattern's manual (`PATTERN.md`).
4. **Bring in tested code** — it copies the pattern code and adapts it to the project's framework and styling.
5. **Check** — the motion audit script finds layout animations, `transition: all` and missing reduced-motion support so they get fixed.

| Request | Patterns suta picks |
|---|---|
| "Build the order screen for our noodle shop" | `quantity-stepper` · `bottom-sheet` · `loading-button` · `toast-stack` |
| "Let users pick menu options in a bottom sheet" | `bottom-sheet` |
| "Make feed photos pinch-zoomable" | `pinch-zoom` |
| "Every screen animates differently" | `motion-principles` · `motion-audit` |

To call it explicitly, use `/suta:suta` in Claude Code or `$suta` in Codex. To make every UI task use it, add a line such as "Follow the suta skill for UI work" to the project's `AGENTS.md` or `CLAUDE.md`.

> A **skill** is a manual an AI reads. suta holds 53 patterns inside one skill and reads only the ones it needs, so it doesn't crowd the agent's skill list even next to other skills.

## 53 patterns

Click a name for the manual, or the demo link on the right for the working screen.

### Appearing and disappearing

| Pattern | What it does | Demo |
|---|---|---|
| [Enter/exit animation](skills/suta/patterns/enter-exit/PATTERN.md) | CSS animations when an element appears or disappears | [Demo](https://guksu.github.io/suta/#/enter-exit) |
| [Scroll reveal](skills/suta/patterns/scroll-reveal/PATTERN.md) | Content appears in sequence as you scroll | [Demo](https://guksu.github.io/suta/#/scroll-reveal) |
| [Sticky header transition](skills/suta/patterns/sticky-header/PATTERN.md) | When the large title scrolls away, the fixed header shows a small title | [Demo](https://guksu.github.io/suta/#/sticky-header) |
| [List reorder (FLIP)](skills/suta/patterns/flip-list/PATTERN.md) | Items move smoothly when the list order changes | [Demo](https://guksu.github.io/suta/#/flip-list) |
| [Zoom lightbox](skills/suta/patterns/zoom-lightbox/PATTERN.md) | Opens by scaling from the thumbnail position to the center of the screen | [Demo](https://guksu.github.io/suta/#/zoom-lightbox) |
| [Modal dialog](skills/suta/patterns/modal-dialog/PATTERN.md) | Open and close on the native `<dialog>`, with Esc key and focus handling | [Demo](https://guksu.github.io/suta/#/modal-dialog) |
| [Spring physics motion](skills/suta/patterns/spring-physics/PATTERN.md) | Motion that carries drag velocity and settles like a spring | [Demo](https://guksu.github.io/suta/#/spring-physics) |
| [Dark mode toggle](skills/suta/patterns/theme-toggle/PATTERN.md) | Circular theme transition from the press point, saves the choice and follows the device setting | [Demo](https://guksu.github.io/suta/#/theme-toggle) |
| [Stretchy image header](skills/suta/patterns/stretchy-header/PATTERN.md) | Large image header scrolls at a slower rate and darkens, and stretches then snaps back when pulled at the top | [Demo](https://guksu.github.io/suta/#/stretchy-header) |
| [Card expand](skills/suta/patterns/card-expand/PATTERN.md) | Shared-element transition: the pressed card grows in place into a detail screen and shrinks back on close | [Demo](https://guksu.github.io/suta/#/card-expand) |
| [Card stack](skills/suta/patterns/card-stack/PATTERN.md) | Stacked cards fan out vertically on press; the chosen card moves to the top and the rest fold beneath it | [Demo](https://guksu.github.io/suta/#/card-stack) |

### While waiting

| Pattern | What it does | Demo |
|---|---|---|
| [Skeleton shimmer](skills/suta/patterns/skeleton/PATTERN.md) | Placeholder bones with a shimmer that hold the content area while loading | [Demo](https://guksu.github.io/suta/#/skeleton) |
| [Count-up numbers](skills/suta/patterns/count-up/PATTERN.md) | Balances, points and other numbers step toward a target value | [Demo](https://guksu.github.io/suta/#/count-up) |
| [Story progress](skills/suta/patterns/story-progress/PATTERN.md) | Story progress bars, long-press to pause, tap to move | [Demo](https://guksu.github.io/suta/#/story-progress) |
| [Loading button](skills/suta/patterns/loading-button/PATTERN.md) | Shows sending and done states and prevents duplicate submits | [Demo](https://guksu.github.io/suta/#/loading-button) |
| [Infinite scroll](skills/suta/patterns/infinite-scroll/PATTERN.md) | Loads the next page before the end of the list and prevents duplicate items | [Demo](https://guksu.github.io/suta/#/infinite-scroll) |
| [Virtual list](skills/suta/patterns/virtual-list/PATTERN.md) | Renders mainly the visible items to handle long lists | [Demo](https://guksu.github.io/suta/#/virtual-list) |
| [Progress ring](skills/suta/patterns/progress-ring/PATTERN.md) | SVG circle fills by value; three nested rings, over-target display, indeterminate loading | [Demo](https://guksu.github.io/suta/#/progress-ring) |

### Responding to presses

| Pattern | What it does | Demo |
|---|---|---|
| [Press feedback](skills/suta/patterns/press-feedback/PATTERN.md) | Shrinks on press and restores on release | [Demo](https://guksu.github.io/suta/#/press-feedback) |
| [Toast stack](skills/suta/patterns/toast-stack/PATTERN.md) | Stacks multiple notifications at the bottom or top banner position and closes each after its own duration | [Demo](https://guksu.github.io/suta/#/toast-stack) |
| [Like pop](skills/suta/patterns/like-pop/PATTERN.md) | Pop effect on heart click or photo double-tap | [Demo](https://guksu.github.io/suta/#/like-pop) |
| [Cart fly](skills/suta/patterns/cart-fly/PATTERN.md) | Product flies into the cart icon | [Demo](https://guksu.github.io/suta/#/cart-fly) |
| [Tooltip](skills/suta/patterns/tooltip/PATTERN.md) | Shows on mouse or keyboard input and positions by available space | [Demo](https://guksu.github.io/suta/#/tooltip) |
| [Form shake error](skills/suta/patterns/form-shake-error/PATTERN.md) | Shakes fields with input errors and shows the error message | [Demo](https://guksu.github.io/suta/#/form-shake-error) |

### Navigation

| Pattern | What it does | Demo |
|---|---|---|
| [Tab indicator slide](skills/suta/patterns/tab-indicator/PATTERN.md) | Underline slides smoothly to the selected tab | [Demo](https://guksu.github.io/suta/#/tab-indicator) |
| [Snap carousel](skills/suta/patterns/carousel/PATTERN.md) | Slider that snaps to card boundaries when swiped sideways | [Demo](https://guksu.github.io/suta/#/carousel) |
| [Hamburger menu](skills/suta/patterns/hamburger-menu/PATTERN.md) | Morphs the menu icon into a close icon and shows the panel | [Demo](https://guksu.github.io/suta/#/hamburger-menu) |
| [Page transition](skills/suta/patterns/page-transition/PATTERN.md) | Keeps the header and tab bar while transitioning screens in the direction of navigation | [Demo](https://guksu.github.io/suta/#/page-transition) |
| [Dropdown menu](skills/suta/patterns/dropdown-menu/PATTERN.md) | Action menu that repositions to fit the space and moves with arrow keys and first-letter typing | [Demo](https://guksu.github.io/suta/#/dropdown-menu) |
| [Scroll-aware glass nav](skills/suta/patterns/glass-nav/PATTERN.md) | Transparent at the top, glass once scrolled; hides on scroll down and returns on scroll up, or collapses into a single pill. Links scroll to their section and the active pill follows | [Demo](https://guksu.github.io/suta/#/glass-nav) |

### Touch gestures (mobile)

| Pattern | What it does | Demo |
|---|---|---|
| [Bottom sheet](skills/suta/patterns/bottom-sheet/PATTERN.md) | Opens a sheet from the bottom; drag to resize or close | [Demo](https://guksu.github.io/suta/#/bottom-sheet) |
| [Pull to refresh](skills/suta/patterns/pull-to-refresh/PATTERN.md) | Pull the top of the list to refresh, with resistance | [Demo](https://guksu.github.io/suta/#/pull-to-refresh) |
| [Swipe to delete](skills/suta/patterns/swipe-to-delete/PATTERN.md) | Swipe sideways to reveal action buttons (a single delete, or several: archive, later, delete); swiping all the way runs the last action | [Demo](https://guksu.github.io/suta/#/swipe-to-delete) |
| [Feed pinch zoom](skills/suta/patterns/pinch-zoom/PATTERN.md) | Two-finger zoom on a photo, restores on release | [Demo](https://guksu.github.io/suta/#/pinch-zoom) |
| [Swipe-dismiss viewer](skills/suta/patterns/swipe-dismiss-viewer/PATTERN.md) | Drag a photo down to shrink and close it, returning to its original position | [Demo](https://guksu.github.io/suta/#/swipe-dismiss-viewer) |
| [Drag to reorder](skills/suta/patterns/drag-to-reorder/PATTERN.md) | Reorder a list by drag or arrow keys | [Demo](https://guksu.github.io/suta/#/drag-to-reorder) |
| [Long-press menu](skills/suta/patterns/long-press-menu/PATTERN.md) | Long-press or right-click lifts the item, blurs the background and shows an action menu beside it | [Demo](https://guksu.github.io/suta/#/long-press-menu) |
| [Edge swipe back](skills/suta/patterns/edge-swipe-back/PATTERN.md) | Drag from the left edge to pull in the previous screen; on release, distance and velocity decide whether to go back | [Demo](https://guksu.github.io/suta/#/edge-swipe-back) |

### Input controls

| Pattern | What it does | Demo |
|---|---|---|
| [Custom select](skills/suta/patterns/select/PATTERN.md) | Dropdown with keyboard control and screen reader support | [Demo](https://guksu.github.io/suta/#/select) |
| [Accordion](skills/suta/patterns/accordion/PATTERN.md) | Expand and collapse content with a CSS height transition | [Demo](https://guksu.github.io/suta/#/accordion) |
| [Toggle switch](skills/suta/patterns/switch/PATTERN.md) | On/off switch built on a native checkbox | [Demo](https://guksu.github.io/suta/#/switch) |
| [Floating label input](skills/suta/patterns/floating-label/PATTERN.md) | Moves the placeholder text to a top label based on input state | [Demo](https://guksu.github.io/suta/#/floating-label) |
| [Checkbox · Radio](skills/suta/patterns/checkbox-radio/PATTERN.md) | Animates the check mark and radio dot to match the selected state | [Demo](https://guksu.github.io/suta/#/checkbox-radio) |
| [OTP input](skills/suta/patterns/otp-input/PATTERN.md) | Moves between cells on type and delete, supports pasting a code | [Demo](https://guksu.github.io/suta/#/otp-input) |
| [Segmented control](skills/suta/patterns/segmented-control/PATTERN.md) | Pill background slides behind the selected segment, built on a native radio group | [Demo](https://guksu.github.io/suta/#/segmented-control) |
| [Wheel picker](skills/suta/patterns/wheel-picker/PATTERN.md) | Drum picker that scrolls vertically and snaps to the center cell, with 3D tilt, click and keyboard | [Demo](https://guksu.github.io/suta/#/wheel-picker) |
| [Search suggestions](skills/suta/patterns/search-suggest/PATTERN.md) | Searches when typing pauses and keeps stale responses from overwriting the latest results | [Demo](https://guksu.github.io/suta/#/search-suggest) |
| [Range slider](skills/suta/patterns/range-slider/PATTERN.md) | Range input with two handles for minimum and maximum | [Demo](https://guksu.github.io/suta/#/range-slider) |
| [Quantity stepper](skills/suta/patterns/quantity-stepper/PATTERN.md) | Adjust quantity with buttons, long-press to accelerate, switches to delete at the minimum | [Demo](https://guksu.github.io/suta/#/quantity-stepper) |
| [File upload](skills/suta/patterns/file-upload/PATTERN.md) | File drop, preview and progress display, rejection reasons | [Demo](https://guksu.github.io/suta/#/file-upload) |

### Surfaces and style

| Pattern | What it does | Demo |
|---|---|---|
| [Glassmorphism surface](skills/suta/patterns/glass-surface/PATTERN.md) | Translucent card, nav bar or modal with a blurred backdrop; falls back to an opaque surface when blur is unsupported | [Demo](https://guksu.github.io/suta/#/glass-surface) |

### Principles and review

| Pattern | What it does | Demo |
|---|---|---|
| [Motion principles & tokens](skills/suta/patterns/motion-principles/PATTERN.md) | One token set of 5 durations, 5 easings, stagger and reduced-motion, plus rules for which value each kind of movement uses | [Demo](https://guksu.github.io/suta/#/motion-principles) |
| [Motion audit](skills/suta/patterns/motion-audit/PATTERN.md) | Scans CSS and JS for layout-property animations, missing reduced-motion, out-of-range durations and more, reports them as `file:line` and points to the pattern that fixes each | [Demo](https://guksu.github.io/suta/#/motion-audit) |

## Layout

```text
skills/suta/                         The skill that gets installed
├─ SKILL.md                         Workflow · AI-slop rules · motion values · pattern catalog
└─ patterns/bottom-sheet/
   ├─ PATTERN.md                    When to use · why it's built this way · usage · options · caveats
   └─ assets/
      ├─ createSheetDrag.ts         Framework-independent drag logic
      ├─ bottom-sheet.css           Motion and state definitions
      └─ BottomSheet.tsx            React component
```

Pattern code can be copied one pattern at a time. Logic shared by several patterns is included in each as the same file, and the repository's check script verifies that the copies match their source.

## Repository structure

```text
suta/
├─ skills/suta/                     The installed skill — SKILL.md + 53 patterns (patterns/)
├─ .claude-plugin/                  Claude Code marketplace and plugin info (the repo root is the plugin)
├─ AGENTS.md                        Working instructions for every coding agent (single source)
├─ CLAUDE.md                        Claude Code supplement (imports AGENTS.md)
├─ .agents/skills/add-skill/        Pattern-adding procedure (for maintainers, hidden from normal installs)
├─ demo/                            Vite + React demo site
├─ evals/                           Selection evals — trigger (trigger.json) and patterns (selection/)
├─ scripts/                         Checks · selection eval · catalog generation · install script
└─ docs/                            Design · plans · work logs · rules
```

## Development

### Running the demo

```bash
npm install
npm run dev
```

Open the [local demo](http://localhost:5173/suta/) in a browser. To check on a phone on the same network, run `npm run dev -- -- --host`.

### Verification

| Command | What it checks |
|---|---|
| `npm test` | Vitest + jsdom tests |
| `npm run lint` | Code lint |
| `npm run build` | Production build |
| `npm run catalog` | Rebuilds the entry skill's pattern catalog from each `PATTERN.md` and the demo list |
| `node scripts/validateSkills.mjs` | Entry skill and pattern structure, catalog sync, shared-code matches, README badge numbers |
| `node scripts/evalSelection.mjs` | Selection eval — whether UI requests trigger suta (`evals/trigger.json`) and requests pick the right pattern (`evals/selection/`) |
| `npm run validate` | Both checks above plus the motion audit in one go |

When changes land on `main`, the demo deploys to GitHub Pages automatically.

## Contributing

**The pattern documents and code are the source.** The demo imports `assets/` directly and never copies code.

If you work with a coding agent, [`AGENTS.md`](AGENTS.md) holds the shared instructions. Claude Code, Codex, Cursor, Gemini CLI and Copilot all read the same rules and the same pattern-adding procedure (`.agents/skills/add-skill/`).

### Adding a pattern

1. **Write the selection eval:** in `evals/selection/{name}.json`, first list 3 requests that should pick this pattern and 3 neighbouring requests that shouldn't.
2. **Write the manual:** create `skills/suta/patterns/{name}/PATTERN.md`. `name` matches the folder name, and `description` states in the third person only what it does and when to use it (80–300 characters). Its first sentence becomes the one-line summary in the catalog. The body follows the order: when to use → why it's built this way → usage (React / plain JS) → options → caveats.
3. **Add the implementation:** write the CSS and framework-independent logic in `assets/`. Write tests for the logic first, and respect the reduced-motion setting.
4. **Register the demo:** in `demo/src/demos/{name}/`, import from `@skills/{name}/assets/...` and register it in `demo/src/demos/index.ts`.
5. **Update the catalog:** run `npm run catalog` to rebuild the entry skill's pattern catalog.
6. **Verify:** run build, lint, tests, structure checks and the selection eval (`npm run validate`). Check the behavior in a browser and review the motion's speed, deceleration and accessibility settings.

When the number of patterns or tests changes, update the README badges too or the structure check fails.

### Related documents

- [Agent working instructions](AGENTS.md)
- [Working rules](docs/harness-rules.md)
- [Repository design](docs/design/2026-08-19-fe-skills.md)
- [Planned patterns and work plan](docs/plans/)

## License

[MIT](LICENSE) © 2026 Guksu
