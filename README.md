# FrostPaws™ — Shopify Theme (Online Store 2.0)

> *"Cold air, given form."* — a premium, mobile-first landing experience for a self-cooling pet mat, built natively as modular Shopify sections.

Every section below is a standalone, reusable **Online Store 2.0 section** with its own `{% schema %}`, blocks and settings — fully editable in the **Theme Editor**. Nothing is hard-coded copy or a throwaway prototype.

## Structure

```
layout/theme.liquid          Base layout (fonts, CSS/JS, header & footer groups, SEO head, skip-link)
templates/index.json         Landing page — assembles sections 3–15 in order
sections/
  header-group.json          Announcement bar + sticky header group
  footer-group.json          Footer group
  announcement-bar.liquid    1 · Announcement bar
  header.liquid              2 · Sticky header (glass, mobile menu)
  hero.liquid                3 · Hero — 4-image auto slider (slides are blocks)
  why-frostpaws.liquid       4 · Why FrostPaws
  how-it-works.liquid        5 · How it works
  size-guide.liquid          6 · Interactive size guide (6 image slots)
  color-variants.liquid      7 · Color variants (swatch → image)
  lifestyle-gallery.liquid   8 · Lifestyle gallery
  benefits.liquid            9 · Benefits
  comparison-table.liquid    10 · Comparison table
  reviews.liquid             11 · Customer reviews (+ gold stars)
  before-after.liquid        12 · Before / after drag slider
  faq.liquid                 13 · FAQ (+ FAQPage JSON-LD for SEO)
  guarantee.liquid           14 · Guarantee
  final-cta.liquid           15 · Final CTA
  footer.liquid              16 · Midnight Navy footer (+ sticky mobile CTA)
snippets/
  frostpaws-image.liquid     Editable image container → fills card via object-fit, or branded placeholder
  frostpaws-icon.liquid      Cool stroke-icon set
  frostpaws-stars.liquid     Gold star rating
assets/
  frostpaws.css              Design system + all section styles (one flat asset)
  frostpaws.js               Hero slider, size-guide sync, colors, before/after, menu, reveals
config/                      settings_schema.json · settings_data.json
locales/en.default.json
design-system/               The design system spec + living style guide (Step 1–2 reference)
```

## Editable image slots

Every image is an `image_picker` setting. When empty it renders a **premium FrostPaws placeholder** (frost gradient + cyan halo + the slot ID), never a grey box. Upload an image in the Theme Editor and it **auto-fills the card** (`object-fit: cover`, responsive `srcset`) with zero code changes.

**Size guide slots (exact IDs, as specified):**
`SIZE_XS_IMAGE` · `SIZE_S_IMAGE` · `SIZE_M_IMAGE` · `SIZE_L_IMAGE` · `SIZE_XL_IMAGE` · `SIZE_XXL_IMAGE`

Other slots include `HERO_IMAGE_1–4`, `HOW_IT_WORKS_IMAGE`, `COLOR_*_IMAGE`, `GALLERY_IMAGE_*`, `BENEFITS_IMAGE`, `BEFORE_IMAGE`, `AFTER_IMAGE`, `REVIEW_AVATAR_*`.

## Interactive size guide

- **Desktop:** responsive premium 6-card grid. **Mobile:** horizontal snap-scroll carousel.
- Each card: large image, size label, dimensions, recommended pet, recommended weight, short description.
- Selecting a card **enlarges it**, adds the **FrostPaws-blue outline**, strengthens the shadow, shows a check, and **highlights the matching size** in the product selector below (and vice-versa). Keyboard-accessible.

## Built for
Mobile-first conversion · fast loading (responsive `srcset`, lazy-loading, deferred JS, `font-display: swap`) · accessibility (skip link, focus states, `prefers-reduced-motion`, ARIA) · SEO (semantic headings, canonical, meta, FAQ structured data) · Online Store 2.0 (JSON templates, section groups, blocks, presets).

## Scope note
This delivers the **landing page** (homepage) theme. Standard store templates (`product`, `collection`, `cart`, `404`, etc.) are the next step for a full storefront upload.
