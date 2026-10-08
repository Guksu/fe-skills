<div align="center">

# suta

An agent skill that fixes the parts of a UI that look AI-made.<br>
Install it in Claude Code or Codex, and they read it every time they build UI.

[![Deploy demo](https://github.com/Guksu/suta/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/Guksu/suta/actions/workflows/deploy-demo.yml)
![Patterns](https://img.shields.io/badge/suta-56%20patterns-1b1e24)
![Dependencies](https://img.shields.io/badge/runtime%20deps-0-555555)
![Tests](https://img.shields.io/badge/tests-615%20passing-555555)
[![License: MIT](https://img.shields.io/badge/license-MIT-555555)](LICENSE)

[**Live demo**](https://guksu.github.io/suta/) · [Full guide](docs/guide.en.md) · [한국어](README.md)

</div>

## AS-IS / TO-BE

We gave Claude Code the request below twice. The first time nothing was installed. The second time only suta was installed. Model and settings were the same.

> Build the e-commerce screens for a mobile webview: home, product list, product detail, my page, cart, settings, and a GNB (bottom navigation). *(Translated from the original Korean request.)*

![Shopping app screens built from the same request. Top row without suta (AS-IS), bottom row with suta (TO-BE). From left: home, product list, product detail, cart, my page, settings](docs/assets/as-is-to-be.jpg)

From left: home, product list, product detail, cart, my page, settings. Captured at 390px wide. The food photos are credited in [Image credits](docs/assets/CREDITS.md).

| | AS-IS (without suta) | TO-BE (with suta) |
|---|---|---|
| Color | Orange on the banner, categories, badges, stars and buttons | One brown accent. Only the discount rate is red |
| Icons | Emoji | Line icons of one size and stroke |
| Product cards | Orange BEST, NEW and "popular" pills | Discount rate, price and rating only |
| Home | No way to search | A search field at the top |
| Detail bottom bar | Four controls: wish, quantity, add to cart, buy | Wish and Buy. Options and quantity are picked in a sheet that opens from Buy |
| Bottom tabs (GNB) | Cart is a tab, so the cart screen pins both the tab bar and the order button | Cart is an icon in the header. Tabs are hidden on detail and cart |
| Accessibility violations (axe, 6 screens) | 111 color-contrast issues | 0 |

Method and the other runs are in the [mobile webview e-commerce study](docs/research/2026-10-08-commerce-webview.md) (Korean).

## Benchmark

We wrote requests for 8 screen types (detail, form, settings, dashboard, landing, cart, list, interaction) and gave each to both sides twice. The resulting pages were measured in a browser. Below is round 2, after adding the type, color and surface rules.

| 16 pages (lower is better) | Plain Claude Code | With suta |
|---|---|---|
| Accessibility violations (axe, total) | 87 | 13 |
| Boxes nested in boxes (total) | 41 | 1 |
| Gradients, blurs, large shadows (total) | 47 | 0 |
| Touch targets under 24px (total) | 27 | 0 |
| Pages with text under 12px | 4 | 0 |
| Pages that scroll sideways at 320px | 2 | 0 |
| Pages whose primary button is blue, indigo or violet | 10 | 0 |

On the suta side the most-used text size is 16px. That matches the median of reference websites measured the same way.

We also showed a model the two pages without labels and asked which was better. Out of 32, suta was picked 11 or 19 times, depending on the judge model.

The median time per page went from 61 to 103 seconds. Method, the judges' reasons and limitations are in the [benchmark doc](docs/benchmark.en.md).

## What it prevents

AI slop is output that looks AI-made. suta makes the agent keep to the rules below and reuse code from 56 patterns whenever it builds UI.

| What AI often builds | With suta |
|---|---|
| Every screen on the same template, every section in a card | Each screen type starts from its own skeleton. Groups are made with spacing and thin lines |
| Random spacing, type and radius values, 9px text | Values come only from tokens (scales). Text is 12px or larger |
| The framework's default blue as the accent, and a pastel per status | One accent plus error red |
| Gradients, badges and filled buttons everywhere | Emphasis in one or two places per screen |
| `transition: all`, animating height | Only `transform` and `opacity` move, with durations sized to the motion |
| Keyboard, screen readers and reduced motion ignored | Every pattern supports accessibility and reduced motion |

The full list is in the [full guide, "What it removes"](docs/guide.en.md#what-it-removes).

## Installation

Claude Code:

```text
/plugin marketplace add Guksu/suta
/plugin install suta@suta
```

In Codex, approve suta's post-edit check in `/hooks` after installing.

```bash
codex plugin marketplace add Guksu/suta
codex plugin add suta@suta
```

Other agents such as Cursor, Gemini CLI and GitHub Copilot install the skill only.

```bash
npx skills add Guksu/suta --skill suta
```

The install script, install folders and moving from the old version are in the [full guide, "Installation"](docs/guide.en.md#installation).

## Usage

Ask as you normally would. Say "build a login screen" or "polish this button animation", and the agent reads suta and picks the patterns that fit.

Installed as a plugin, suta runs layout and motion checks every time a file is edited. The agent gets back only the problems on the lines it just changed. Details are in [Post-edit check](docs/guide.en.md#post-edit-check).

You can try the 56 patterns in the [live demo](https://guksu.github.io/suta/). The list is in the [full guide](docs/guide.en.md#56-patterns).

## Learn more

- [Full guide](docs/guide.en.md): every install option, how it works, the post-edit check, 56 patterns, development and contributing
- [Benchmark](docs/benchmark.en.md): method, all metrics and the judges' reasons for plain Claude Code vs suta
- [Agent instructions](AGENTS.md): for coding agents working in this repository
- Research (Korean): [Layout principles](docs/research/2026-10-06-layout-principles.md) · [Screen conventions](docs/research/2026-10-07-screen-conventions.md) · [Color count and AI chat](docs/research/2026-10-08-chat-color.md) · [Mobile webview e-commerce](docs/research/2026-10-08-commerce-webview.md)

## License

The code is [MIT](LICENSE) (© 2026 Guksu). Licenses for the photos in the README comparison image are in [Image credits](docs/assets/CREDITS.md).
