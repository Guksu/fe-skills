<div align="center">

# fe-skills

한국어: [README.md](README.md)

**Frontend skills for AI agents**

Animation and UI implementation patterns plus system design guides, as documents and code.

[![Deploy demo](https://github.com/Guksu/fe-skills/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/Guksu/fe-skills/actions/workflows/deploy-demo.yml)
![UI skills](https://img.shields.io/badge/fe--ui-53%20skills-6ea8fe)
![System skills](https://img.shields.io/badge/fe--system-1%20skill-a78bfa)
![Dependencies](https://img.shields.io/badge/runtime%20deps-0-34c759)
![Tests](https://img.shields.io/badge/tests-507%20passing-34c759)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[**Live demo**](https://guksu.github.io/fe-skills/) · [Installation](#installation) · [UI skills](#ui-skills-53--fe-ui) · [Design skill](#design-skill--fe-system) · [Development](#development) · [Contributing](#contributing)

</div>

## Overview

fe-skills is a set of manuals an AI reads before implementing. Each pattern collects when to use it, why it is built the way it is, the code, the options you can change, and the caveats in one place.

| Plugin | Purpose | Contents |
|---|---|---|
| **fe-ui** | Animation, UI and gesture implementation | 53 skills, implementation code, live demo |
| **fe-system** | Structure and design decisions before implementation | `design` skill, questions and selection criteria per screen type |

- **CSS first:** Anything CSS can do is done in CSS. Gestures and physics-based motion are handled in TypeScript without a runtime library.
- **Logic separated from React:** Framework-independent logic and React components are kept apart. In Vue or Svelte you can take the logic and wire it up yourself.
- **Accessibility:** Respects the reduced-motion setting and builds on native HTML elements to support keyboard and screen reader use.
- **Source linked to demo:** The demo imports each skill's implementation code directly. UI skills are verified by build, tests, structure checks, browser behavior and motion review.

## Installation

Skill documents follow the open Agent Skills format. Copy a skill folder into the folder your agent reads and it works in any tool.

### Claude Code

Register the marketplace, then install the plugins you need.

```text
/plugin marketplace add Guksu/fe-skills
/plugin install fe-ui@fe-skills
/plugin install fe-system@fe-skills
```

### Codex · Cursor · Gemini CLI · GitHub Copilot and others

Install with one line from the project root. Pick one of the two methods.

```bash
# Method 1 — skills CLI (detects installed agents and copies into each one's skill folder)
npx skills add Guksu/fe-skills

# Method 2 — this repo's install script (copies into .agents/skills/, needs only git)
curl -fsSL https://raw.githubusercontent.com/Guksu/fe-skills/main/scripts/install-skills.sh | sh
```

To pick specific skills with the skills CLI, run `npx skills add Guksu/fe-skills --skill bottom-sheet`.

| What you want | Command |
|---|---|
| UI skills only | `curl -fsSL …/install-skills.sh \| sh -s -- ui` |
| Design skill only | `… \| sh -s -- system` |
| Install into another folder | `… \| sh -s -- --dest .cursor/skills` |
| Use across your whole machine | `… \| sh -s -- --dest ~/.agents/skills` |
| Update | Run the same command again (only folders with the same name are replaced) |

You can also copy the files by hand without the script.

```bash
git clone --depth 1 https://github.com/Guksu/fe-skills.git
mkdir -p .agents/skills
cp -R fe-skills/plugins/ui/skills/* fe-skills/plugins/system/skills/* .agents/skills/
```

| Tool | Project skill folder | Personal global folder |
|---|---|---|
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `.agents/skills/` or `.cursor/skills/` | `~/.agents/skills/` or `~/.cursor/skills/` |
| Gemini CLI | `.agents/skills/` or `.gemini/skills/` | `~/.agents/skills/` or `~/.gemini/skills/` |
| GitHub Copilot | `.agents/skills/`, `.github/skills/` or `.claude/skills/` | `~/.agents/skills/` or `~/.copilot/skills/` |
| Claude Code | `.claude/skills/` (or the marketplace above) | `~/.claude/skills/` |

Paths follow each tool's documentation as of September 2026. If a tool changes, check that tool's documentation.

> A **skill** is one manual an AI reads; a **plugin** is a bundle of skills. This repository provides two plugins, and Claude Code can also install them through a **marketplace**.

### Usage examples

After installing, ask for what you want as usual. The agent picks the skill that fits the request.

| Request | Skill applied |
|---|---|
| "Let users pick menu options in a bottom sheet" | `bottom-sheet` |
| "Make feed photos pinch-zoomable" | `pinch-zoom` |
| "I want to build a product list + filter + detail screen" | Design Q&A with `design`, then implement |

## UI skills (53) — fe-ui

Click a name for the manual, or the demo link on the right for the working screen.

### Appearing and disappearing

| Skill | What it does | Demo |
|---|---|---|
| [Enter/exit animation](plugins/ui/skills/enter-exit/SKILL.md) | CSS animations when an element appears or disappears | [Demo](https://guksu.github.io/fe-skills/#/enter-exit) |
| [Scroll reveal](plugins/ui/skills/scroll-reveal/SKILL.md) | Content appears in sequence as you scroll | [Demo](https://guksu.github.io/fe-skills/#/scroll-reveal) |
| [Sticky header transition](plugins/ui/skills/sticky-header/SKILL.md) | When the large title scrolls away, the fixed header shows a small title | [Demo](https://guksu.github.io/fe-skills/#/sticky-header) |
| [List reorder (FLIP)](plugins/ui/skills/flip-list/SKILL.md) | Items move smoothly when the list order changes | [Demo](https://guksu.github.io/fe-skills/#/flip-list) |
| [Zoom lightbox](plugins/ui/skills/zoom-lightbox/SKILL.md) | Opens by scaling from the thumbnail position to the center of the screen | [Demo](https://guksu.github.io/fe-skills/#/zoom-lightbox) |
| [Modal dialog](plugins/ui/skills/modal-dialog/SKILL.md) | Open and close on the native `<dialog>`, with Esc key and focus handling | [Demo](https://guksu.github.io/fe-skills/#/modal-dialog) |
| [Spring physics motion](plugins/ui/skills/spring-physics/SKILL.md) | Motion that carries drag velocity and settles like a spring | [Demo](https://guksu.github.io/fe-skills/#/spring-physics) |
| [Dark mode toggle](plugins/ui/skills/theme-toggle/SKILL.md) | Circular theme transition from the press point, saves the choice and follows the device setting | [Demo](https://guksu.github.io/fe-skills/#/theme-toggle) |
| [Stretchy image header](plugins/ui/skills/stretchy-header/SKILL.md) | Large image header scrolls at a slower rate and darkens, and stretches then snaps back when pulled at the top | [Demo](https://guksu.github.io/fe-skills/#/stretchy-header) |
| [Card expand](plugins/ui/skills/card-expand/SKILL.md) | Shared-element transition: the pressed card grows in place into a detail screen and shrinks back on close | [Demo](https://guksu.github.io/fe-skills/#/card-expand) |
| [Card stack](plugins/ui/skills/card-stack/SKILL.md) | Stacked cards fan out vertically on press; the chosen card moves to the top and the rest fold beneath it | [Demo](https://guksu.github.io/fe-skills/#/card-stack) |

### While waiting

| Skill | What it does | Demo |
|---|---|---|
| [Skeleton shimmer](plugins/ui/skills/skeleton/SKILL.md) | Placeholder bones with a shimmer that hold the content area while loading | [Demo](https://guksu.github.io/fe-skills/#/skeleton) |
| [Count-up numbers](plugins/ui/skills/count-up/SKILL.md) | Balances, points and other numbers step toward a target value | [Demo](https://guksu.github.io/fe-skills/#/count-up) |
| [Story progress](plugins/ui/skills/story-progress/SKILL.md) | Story progress bars, long-press to pause, tap to move | [Demo](https://guksu.github.io/fe-skills/#/story-progress) |
| [Loading button](plugins/ui/skills/loading-button/SKILL.md) | Shows sending and done states and prevents duplicate submits | [Demo](https://guksu.github.io/fe-skills/#/loading-button) |
| [Infinite scroll](plugins/ui/skills/infinite-scroll/SKILL.md) | Loads the next page before the end of the list and prevents duplicate items | [Demo](https://guksu.github.io/fe-skills/#/infinite-scroll) |
| [Virtual list](plugins/ui/skills/virtual-list/SKILL.md) | Renders mainly the visible items to handle long lists | [Demo](https://guksu.github.io/fe-skills/#/virtual-list) |
| [Progress ring](plugins/ui/skills/progress-ring/SKILL.md) | SVG circle fills by value; three nested rings, over-target display, indeterminate loading | [Demo](https://guksu.github.io/fe-skills/#/progress-ring) |

### Responding to presses

| Skill | What it does | Demo |
|---|---|---|
| [Press feedback](plugins/ui/skills/press-feedback/SKILL.md) | Shrinks on press and restores on release | [Demo](https://guksu.github.io/fe-skills/#/press-feedback) |
| [Toast stack](plugins/ui/skills/toast-stack/SKILL.md) | Stacks multiple notifications at the bottom or top banner position and closes each after its own duration | [Demo](https://guksu.github.io/fe-skills/#/toast-stack) |
| [Like pop](plugins/ui/skills/like-pop/SKILL.md) | Pop effect on heart click or photo double-tap | [Demo](https://guksu.github.io/fe-skills/#/like-pop) |
| [Cart fly](plugins/ui/skills/cart-fly/SKILL.md) | Product flies into the cart icon | [Demo](https://guksu.github.io/fe-skills/#/cart-fly) |
| [Tooltip](plugins/ui/skills/tooltip/SKILL.md) | Shows on mouse or keyboard input and positions by available space | [Demo](https://guksu.github.io/fe-skills/#/tooltip) |
| [Form shake error](plugins/ui/skills/form-shake-error/SKILL.md) | Shakes fields with input errors and shows the error message | [Demo](https://guksu.github.io/fe-skills/#/form-shake-error) |

### Navigation

| Skill | What it does | Demo |
|---|---|---|
| [Tab indicator slide](plugins/ui/skills/tab-indicator/SKILL.md) | Underline slides smoothly to the selected tab | [Demo](https://guksu.github.io/fe-skills/#/tab-indicator) |
| [Snap carousel](plugins/ui/skills/carousel/SKILL.md) | Slider that snaps to card boundaries when swiped sideways | [Demo](https://guksu.github.io/fe-skills/#/carousel) |
| [Hamburger menu](plugins/ui/skills/hamburger-menu/SKILL.md) | Morphs the menu icon into a close icon and shows the panel | [Demo](https://guksu.github.io/fe-skills/#/hamburger-menu) |
| [Page transition](plugins/ui/skills/page-transition/SKILL.md) | Keeps the header and tab bar while transitioning screens in the direction of navigation | [Demo](https://guksu.github.io/fe-skills/#/page-transition) |
| [Dropdown menu](plugins/ui/skills/dropdown-menu/SKILL.md) | Action menu that repositions to fit the space and moves with arrow keys and first-letter typing | [Demo](https://guksu.github.io/fe-skills/#/dropdown-menu) |
| [Scroll-aware glass nav](plugins/ui/skills/glass-nav/SKILL.md) | Transparent at the top, glass once scrolled; hides on scroll down and returns on scroll up, or collapses into a single pill | [Demo](https://guksu.github.io/fe-skills/#/glass-nav) |

### Touch gestures (mobile)

| Skill | What it does | Demo |
|---|---|---|
| [Bottom sheet](plugins/ui/skills/bottom-sheet/SKILL.md) | Opens a sheet from the bottom; drag to resize or close | [Demo](https://guksu.github.io/fe-skills/#/bottom-sheet) |
| [Pull to refresh](plugins/ui/skills/pull-to-refresh/SKILL.md) | Pull the top of the list to refresh, with resistance | [Demo](https://guksu.github.io/fe-skills/#/pull-to-refresh) |
| [Swipe to delete](plugins/ui/skills/swipe-to-delete/SKILL.md) | Swipe sideways to reveal action buttons (a single delete, or several: archive, later, delete); swiping all the way runs the last action | [Demo](https://guksu.github.io/fe-skills/#/swipe-to-delete) |
| [Feed pinch zoom](plugins/ui/skills/pinch-zoom/SKILL.md) | Two-finger zoom on a photo, restores on release | [Demo](https://guksu.github.io/fe-skills/#/pinch-zoom) |
| [Swipe-dismiss viewer](plugins/ui/skills/swipe-dismiss-viewer/SKILL.md) | Drag a photo down to shrink and close it, returning to its original position | [Demo](https://guksu.github.io/fe-skills/#/swipe-dismiss-viewer) |
| [Drag to reorder](plugins/ui/skills/drag-to-reorder/SKILL.md) | Reorder a list by drag or arrow keys | [Demo](https://guksu.github.io/fe-skills/#/drag-to-reorder) |
| [Long-press menu](plugins/ui/skills/long-press-menu/SKILL.md) | Long-press or right-click lifts the item, blurs the background and shows an action menu beside it | [Demo](https://guksu.github.io/fe-skills/#/long-press-menu) |
| [Edge swipe back](plugins/ui/skills/edge-swipe-back/SKILL.md) | Drag from the left edge to pull in the previous screen; on release, distance and velocity decide whether to go back | [Demo](https://guksu.github.io/fe-skills/#/edge-swipe-back) |

### Input controls

| Skill | What it does | Demo |
|---|---|---|
| [Custom select](plugins/ui/skills/select/SKILL.md) | Dropdown with keyboard control and screen reader support | [Demo](https://guksu.github.io/fe-skills/#/select) |
| [Accordion](plugins/ui/skills/accordion/SKILL.md) | Expand and collapse content with a CSS height transition | [Demo](https://guksu.github.io/fe-skills/#/accordion) |
| [Toggle switch](plugins/ui/skills/switch/SKILL.md) | On/off switch built on a native checkbox | [Demo](https://guksu.github.io/fe-skills/#/switch) |
| [Floating label input](plugins/ui/skills/floating-label/SKILL.md) | Moves the placeholder text to a top label based on input state | [Demo](https://guksu.github.io/fe-skills/#/floating-label) |
| [Checkbox · Radio](plugins/ui/skills/checkbox-radio/SKILL.md) | Animates the check mark and radio dot to match the selected state | [Demo](https://guksu.github.io/fe-skills/#/checkbox-radio) |
| [OTP input](plugins/ui/skills/otp-input/SKILL.md) | Moves between cells on type and delete, supports pasting a code | [Demo](https://guksu.github.io/fe-skills/#/otp-input) |
| [Segmented control](plugins/ui/skills/segmented-control/SKILL.md) | Pill background slides behind the selected segment, built on a native radio group | [Demo](https://guksu.github.io/fe-skills/#/segmented-control) |
| [Wheel picker](plugins/ui/skills/wheel-picker/SKILL.md) | Drum picker that scrolls vertically and snaps to the center cell, with 3D tilt, click and keyboard | [Demo](https://guksu.github.io/fe-skills/#/wheel-picker) |
| [Search suggestions](plugins/ui/skills/search-suggest/SKILL.md) | Searches when typing pauses and keeps stale responses from overwriting the latest results | [Demo](https://guksu.github.io/fe-skills/#/search-suggest) |
| [Range slider](plugins/ui/skills/range-slider/SKILL.md) | Range input with two handles for minimum and maximum | [Demo](https://guksu.github.io/fe-skills/#/range-slider) |
| [Quantity stepper](plugins/ui/skills/quantity-stepper/SKILL.md) | Adjust quantity with buttons, long-press to accelerate, switches to delete at the minimum | [Demo](https://guksu.github.io/fe-skills/#/quantity-stepper) |
| [File upload](plugins/ui/skills/file-upload/SKILL.md) | File drop, preview and progress display, rejection reasons | [Demo](https://guksu.github.io/fe-skills/#/file-upload) |

### Surfaces and style

| Skill | What it does | Demo |
|---|---|---|
| [Glassmorphism surface](plugins/ui/skills/glass-surface/SKILL.md) | Translucent card, nav bar or modal with a blurred backdrop; falls back to an opaque surface when blur is unsupported | [Demo](https://guksu.github.io/fe-skills/#/glass-surface) |

### Principles and review

| Skill | What it does | Demo |
|---|---|---|
| [Motion principles & tokens](plugins/ui/skills/motion-principles/SKILL.md) | One token set of 5 durations, 5 easings, stagger and reduced-motion, plus rules for which value each kind of movement uses | [Demo](https://guksu.github.io/fe-skills/#/motion-principles) |
| [Motion audit](plugins/ui/skills/motion-audit/SKILL.md) | Scans CSS and JS for layout-property animations, missing reduced-motion, out-of-range durations and more, reports them as `file:line` and points to the skill that fixes each | [Demo](https://guksu.github.io/fe-skills/#/motion-audit) |


## Design skill — fe-system

[`design`](plugins/system/skills/design/SKILL.md) lays out the decisions to make before implementing. Together you decide whether filters live in the URL, whether scroll is restored when returning from a detail screen, when data is fetched, and more.

### How it works

1. **Inspect existing code:** Facts that can be read from the code, such as framework, router and API, come first.
2. **Design Q&A:** The remaining questions are presented in groups, each with a recommended choice and its trade-offs.
3. **Record decisions:** The decision, its rationale, the accepted downsides and the conditions for revisiting go into the project's `docs/design/`.

| Question type | How it is handled |
|---|---|
| **Fixed** | Applies an established principle without asking |
| **Recommended** | Presents a recommendation with trade-offs for the situation and confirms the choice |
| **Must confirm** | Payment provider policy, personal data retention rules and the like are confirmed, never guessed |

### Guides by screen type

Screens not in the list can still be designed from the core questions.

| Guide | Key decisions |
|---|---|
| [Core questions](plugins/system/skills/design/references/core-questions.md) | Requirements, data, runtime environment, state management, data loading, restoration, failure handling, trade-offs |
| [List + filter + detail](plugins/system/skills/design/references/cases/list-and-detail.md) | URL filters, data loading, pagination vs infinite scroll, scroll restoration |
| [Infinite feed](plugins/system/skills/design/references/cases/feed.md) | Cursor pagination, off-screen items, restoration on return, inserting new posts, when to load more |
| [Funnel form](plugins/system/skills/design/references/cases/funnel-form.md) | Keeping values across multi-step input, per-step URLs, when to validate, resuming, preventing duplicate submits |

The rationale behind each choice is in [`references/topics/`](plugins/system/skills/design/references/topics/).

## Skill layout

UI skills ship the manual together with the implementation code.

```text
plugins/ui/skills/bottom-sheet/
├─ SKILL.md                 When to use · why it's built this way · usage · options · caveats
└─ assets/
   ├─ createSheetDrag.ts    Framework-independent drag logic
   ├─ bottom-sheet.css      Motion and state definitions
   └─ BottomSheet.tsx       React component
```

You can copy the code in `assets/` into your project. Shared logic is included in each skill, so a skill can be taken on its own. The repository's check script verifies that shared files match their source.

The system design skill has no implementation code; it consists of `SKILL.md` and the question and rationale documents in `references/`.

## Repository structure

```text
fe-skills/
├─ AGENTS.md                        Working instructions for every coding agent (single source)
├─ CLAUDE.md                        Claude Code supplement (imports AGENTS.md)
├─ .agents/skills/add-skill/        Skill-adding procedure (auto-discovered by agents)
├─ .claude-plugin/marketplace.json   Claude Code plugin registration
├─ plugins/
│  ├─ ui/skills/{skill}/            UI skill source documents and code
│  └─ system/skills/design/         Design Q&A rules and reference documents
├─ demo/                            Vite + React demo site
├─ scripts/validateSkills.mjs        Skill structure and badge checks
├─ scripts/install-skills.sh         Copies skills into another project
└─ docs/                            Design · plans · work logs · rules
```

## Development

### Running the demo

```bash
npm install
npm run dev
```

Open the [local demo](http://localhost:5173/fe-skills/) in a browser. To check on a phone on the same network, run `npm run dev -- --host`.

### Verification

| Command | What it checks |
|---|---|
| `npm test` | Vitest + jsdom tests |
| `npm run lint` | Code lint |
| `npm run build` | Production build |
| `node scripts/validateSkills.mjs` | Skill structure, shared code consistency, README badge numbers |
| `node scripts/evalSelection.mjs` | Skill selection eval — whether the right skill is chosen for the request sentences in `evals/selection/*.json` |
| `npm run validate` | Both checks above in one run |

When changes land on `main`, the demo deploys to GitHub Pages automatically.

## Contributing

**The skill documents and code are the source of truth.** The demo imports `assets/` directly and never copies code.

If you work with a coding agent, [`AGENTS.md`](AGENTS.md) is the shared instruction set. Claude Code, Codex, Cursor, Gemini CLI and Copilot all read the same rules and the same skill-adding procedure (`.agents/skills/add-skill/`).

### Adding a UI skill

1. **Write the selection eval:** In `evals/selection/{name}.json`, first list 3 requests this skill should be chosen for and 3 neighboring requests it should not be chosen for.
2. **Write the manual:** Create `plugins/ui/skills/{name}/SKILL.md`. `name` matches the folder name, and `description` states in the third person only what it does and when to use it (80–300 characters). The body follows the order: when to use → why it's built this way → usage (React / plain JS) → options → caveats.
3. **Add the implementation:** Write the CSS and framework-independent logic in `assets/`. Write tests for the logic first, and respect the reduced-motion setting.
4. **Register the demo:** In `demo/src/demos/{name}/`, import from `@skills/{name}/assets/...` and register it in `demo/src/demos/index.ts`.
5. **Verify:** Run build, lint, tests, structure checks and the selection eval (`npm run validate`). Check the behavior in a browser and review the motion's speed, deceleration and accessibility settings.

When the number of skills or tests changes, update the README badges too or the structure check fails. System design skills are verified on their documents and references; demo and browser checks do not apply.

### Related documents

- [Agent working instructions](AGENTS.md)
- [Working rules](docs/harness-rules.md)
- [Repository design](docs/design/2026-08-19-fe-skills.md)
- [Planned skills and work plans](docs/plans/)

## License

[MIT](LICENSE) © 2026 Guksu
