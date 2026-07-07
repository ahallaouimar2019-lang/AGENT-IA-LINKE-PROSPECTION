# FrostPaws™ — Design System

> *"Cold air, given form."* — the visual constitution for a premium self-cooling pet mat brand.

This is **Step 2**: the approved Step 1 design system, translated into living code. It is intentionally **framework-free** (plain CSS custom properties + a static HTML style guide) so it ports cleanly into Shopify Liquid, React, or anything else in Step 3.

## Files

| File | Purpose |
|------|---------|
| `tokens.css` | The single source of truth — every color, gradient, type ramp, spacing step, radius, shadow, and motion curve as CSS custom properties (`--fp-*`). Change a value here, it changes everywhere. |
| `base.css` | Reset, web-font loading (General Sans + Inter), the typographic scale (`.fp-display` → `.fp-overline`), layout primitives (`.fp-container`, `.fp-section`, grid), and accessibility (focus rings, reduced-motion, `sr-only`). |
| `components.css` | The component library: buttons, cards, glass, badges, trust row, gold star rating, review card, product card, FAQ accordion, nav, sticky mobile CTA, hero, and the Midnight Navy footer. |
| `../styleguide.html` | A **living style guide** that renders the entire system on one page. Open it in a browser to see every token and component. |

## Locked decisions

- **Display font:** General Sans (Satoshi as fallback) · **Body:** Inter
- **Review stars:** Gold `#E4B95B`
- **Footer:** Midnight Navy `#0E2338`

## How to use

Load in order — tokens → base → components:

```html
<link rel="stylesheet" href="design-system/tokens.css" />
<link rel="stylesheet" href="design-system/base.css" />
<link rel="stylesheet" href="design-system/components.css" />
```

## Principles (non-negotiable)

1. **Cooling is felt, not stated** — temperature comes from color, whitespace and glass, never the word "COLD" everywhere.
2. **Restraint is the luxury signal** — when in doubt, remove it.
3. **One idea per screen** — built for mobile / TikTok arrival.
4. Banned: saturated colors, harsh black shadows, countdown timers, more than 2 fonts, playful rounded fonts, cheap stock imagery.

## Next (Step 3)

Assemble real store sections (hero, benefits, social proof, comparison, FAQ, footer) on top of these tokens — awaiting approval before building.
