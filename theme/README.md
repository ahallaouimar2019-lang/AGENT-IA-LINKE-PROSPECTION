# Puffy — Homepage Build (Hero + Carousel + 4 Widgets)

Source of record for the homepage build applied to the Puffy Shopify store
(`puffyshop.online`). All files here are byte-for-byte identical (verified via
MD5) to the files pushed into the Shopify draft theme:

> **CLAUDE GOOOOOOO — A-Z BUILD (hero+carousel+widgets)**
> `gid://shopify/OnlineStoreTheme/165952913648` — duplicated from
> **CLAUDE GOOOOOOO 3.47** (`165945409776`), UNPUBLISHED / draft.

## What was built

### PART 0 — Hero section (`sections/wld-hero-joy.liquid`) — NEW
"Transform Your Stress Into Joy" hero, placed at the top of the homepage.
- Desktop: 2-column (≈58% image left / 42% text right), 30px gap.
- Tablet (≤1119px): stacked, centered.
- Mobile (≤767px): full-width, headline 48→32px, badges stack vertically,
  full-width CTA (≥48px tap target).
- Violet gradient CTA (`#7C3AED → #6D28D9`), hover brighten + scale + glow, subtle pulse.
- Secondary "View All Products" text link, 3 trust badges with violet check icons.
- Load animations (image fade-in 0.8s, text slide-in 0.6s), `prefers-reduced-motion` respected.
- Background light-violet gradient `#F3F0FF → #FFFFFF`.

### PART 1 — Carousel upgrade (`sections/collection-carousel-14.liquid`)
Renders the **Puffy Collection Premium** (14 products) as a responsive 2-per-row grid.
- Violet brand button (was cyan) with hover brighten + scale.
- Per-card **urgency badges** cycling through 4 types (🔥 Trending Now, ⚡ Almost Gone,
  ⭐ Fan Favorite, 🎁 Perfect Gift), plus discount badge + Best Seller ribbon.
- **Trust-signals row** under the heading.
- Star ratings always shown: product metafields `custom.rating`/`custom.reviews`
  first, deterministic 4.6–5.0 fallback + review count otherwise.
- 1:1 images served at 400/800 (retina) via the Shopify CDN, lazy-loaded.

### PART 2 — 4 widgets (wired into the homepage)
- `sections/wld-countdown-bar.liquid` — sticky (top:0) violet countdown header, live timer.
- `sections/wld-trust-badges.liquid` — 4→2→1 responsive trust badges, below hero.
- `sections/wld-social-proof-bar.liquid` — fixed rotating "just bought" toast (real product names).
- `sections/wld-testimonials.liquid` — auto-rotating (5s) testimonials carousel with dots.

### Theme-wide
- `layout/theme.liquid` — loads Poppins (400–800) so all sections share one font.
- `templates/index.json` — homepage section order:
  flash banner → countdown bar → **hero** → **trust badges** → **carousel** →
  buy block → TikTok videos → our story → **testimonials** → social proof →
  apps → contact → social-proof toast.

## Testing performed
Rendered the real section CSS/JS with the 14 live products in headless Chromium
at 1920 / 768 / 375px:
- Horizontal overflow: **0** at every breakpoint.
- JavaScript page errors: **0** (countdown, testimonials, social-proof, analytics all run clean).
- Hero: 2-col on desktop, stacked on tablet/mobile; headline 48/45/32px.
- Trust badges: 4 / 2 / 1 columns.
- Carousel: 14 cards, 14 urgency badges, 14 rating blocks; violet gradient CTAs confirmed.
- Countdown bar `position: sticky` with live HH:MM:SS.

## Preview / publish
In Shopify admin → **Online Store → Themes**, find
*"CLAUDE GOOOOOOO — A-Z BUILD (hero+carousel+widgets)"* → **Preview** to review,
then **Publish** to make it live. The source theme *CLAUDE GOOOOOOO 3.47* was left untouched.
