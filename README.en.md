<div align="center">

# suta

**UI without AI slop**

An agent skill that removes the tell-tale signs of AI-made UI.<br>
Install it once and Claude Code or Codex reads it automatically whenever they build UI.

[![Deploy demo](https://github.com/Guksu/suta/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/Guksu/suta/actions/workflows/deploy-demo.yml)
![Patterns](https://img.shields.io/badge/suta-55%20patterns-6ea8fe)
![Dependencies](https://img.shields.io/badge/runtime%20deps-0-34c759)
![Tests](https://img.shields.io/badge/tests-584%20passing-34c759)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[**Live demo**](https://guksu.github.io/suta/) · [Full guide](docs/guide.en.md) · [한국어](README.md)

</div>

## Benchmark

We gave the same 8 requests to Claude Code twice each and measured the resulting pages in a browser. One side had nothing installed; the other had only suta. Model and settings were the same. Below is round 2, after adding the type, color and surface rules.

| 16 pages (lower is better) | Plain Claude Code | With suta |
|---|---|---|
| Accessibility violations (axe, total) | 87 | 13 |
| Boxes nested in boxes (total) | 41 | 1 |
| Gradients, blurs, large shadows (total) | 47 | 0 |
| Touch targets under 24px (total) | 27 | 0 |
| Pages with text under 12px | 4 | 0 |
| Pages that scroll sideways at 320px | 2 | 0 |
| Pages whose primary button is blue, indigo or violet | 10 | 0 |

Defects dropped sharply. The size of the most-used text (16px) and the use of surfaces also moved close to well-made sites.

When a model compared screenshots blind, the result depended on the judge. Out of 32, suta was picked 11 times by the default judge (round 1: 7) and 19 times by a different judge (round 1: 14).

Each page takes longer, from 61 to 103 seconds. Method, the judges' reasons and limitations are in the [benchmark doc](docs/benchmark.en.md).

## What it does

Hand a screen to an AI and every section ends up boxed in a card, gaps vary at random, and `transition: all` shows up everywhere. That output is called **AI slop**. suta makes the agent keep to a set of rules and use code from 55 tested patterns whenever it builds UI.

| What AI often builds | With suta |
|---|---|
| Every screen on the same template, every section in a card | A skeleton per screen type, grouping by spacing and thin lines |
| Random spacing, type and radius values, 9px text | Values only from tokens (scales), text at 12px or more |
| Default blue accent, white page with only lines, faint secondary text | One chosen accent carried through, two surface tones, three text tones |
| Gradients, badges and filled buttons everywhere | Emphasis in one or two places per screen |
| `transition: all`, animations that move height | Only `transform` and `opacity`, durations sized to the motion |
| Keyboard, screen readers and reduced motion ignored | Accessibility and reduced-motion support in every pattern |

The full list is in the [full guide — What it removes](docs/guide.en.md#what-it-removes).

## Installation

**Claude Code**

```text
/plugin marketplace add Guksu/suta
/plugin install suta@suta
```

**Codex** — after installing, approve suta's post-edit check in `/hooks`.

```bash
codex plugin marketplace add Guksu/suta
codex plugin add suta@suta
```

**Cursor · Gemini CLI · GitHub Copilot and others** — installs the skill only.

```bash
npx skills add Guksu/suta --skill suta
```

The install script, install folders and moving from the old version are in the [full guide — Installation](docs/guide.en.md#installation).

## Usage

Ask as you normally would. Say "build a login screen" or "polish this button animation", and the agent opens suta and picks the patterns that fit.

- **Post-edit check:** installed as a plugin, suta runs layout and motion checks every time a file is edited. Only problems on the lines just changed come back. [More](docs/guide.en.md#post-edit-check)
- **55 patterns:** try bottom sheets, toasts, carousels, form inputs and more in the [live demo](https://guksu.github.io/suta/). [List](docs/guide.en.md#55-patterns)

## Learn more

- [Full guide](docs/guide.en.md) — every install option, how it works, the post-edit check, 55 patterns, development and contributing
- [Benchmark](docs/benchmark.en.md) — method, all metrics and the judges' reasons for plain Claude Code vs suta
- [Agent instructions](AGENTS.md) — for coding agents working in this repository
- Research (Korean): [Layout principles](docs/research/2026-10-06-layout-principles.md) · [Screen conventions](docs/research/2026-10-07-screen-conventions.md)

## License

[MIT](LICENSE) © 2026 Guksu
