# Puffy Collection Carousel (14 products)

High-conversion Shopify product carousel modeled on the Meow Meow Wang "Chubby Cat
Collection" reference. Built on the **Puffy** store (`puffyshop.online`) using the
Shopify Admin API.

## What's included

| File | Purpose |
|------|---------|
| `sections/collection-carousel-14.liquid` | The carousel section (Liquid + scoped CSS + vanilla JS). |
| `templates/index.json` | Homepage template with the section added below the TikTok videos block. |

## Shopify resources created (via Admin API)

- **Collection:** `Puffy Collection Premium` (handle `puffy-collection-premium`), manual sort, draft.
- **14 products** (all `DRAFT`), in order Cat Mallow → Smoke Cloud, each with:
  - `price` and `compare_at_price` (drives the strikethrough + auto `-XX%` badge)
  - metafields `custom.rating` (decimal), `custom.reviews` (integer), `custom.position` (integer)
  - added to the collection; the best seller is tagged `best-seller`.

| # | Product | Price | Compare-at | Rating | Reviews |
|---|---------|-------|-----------|--------|---------|
| 1 | Cat Mallow (Best Seller) | $39.99 | $64.99 | 5.0 | 48 |
| 2 | Caramel Whisper | $49.99 | $79.99 | 4.8 | 37 |
| 3 | Peach Dream | $49.99 | $79.99 | 4.7 | 35 |
| 4 | The MoonStone | $46.99 | $74.99 | 4.8 | 46 |
| 5 | Honey Butter | $51.99 | $79.99 | 4.7 | 41 |
| 6 | Ginger Amber | $45.99 | $74.99 | 5.0 | 42 |
| 7 | Creamy Grey | $39.99 | $64.99 | 4.9 | 33 |
| 8 | Khaki Cream | $42.99 | $69.99 | 4.9 | 31 |
| 9 | Cloudy Sunset | $39.99 | $64.99 | 4.9 | 44 |
| 10 | Amethyst Rubis | $53.99 | $79.99 | 4.9 | 30 |
| 11 | Matcha Mint | $47.99 | $74.99 | 4.8 | 45 |
| 12 | Sakura Cat | $43.99 | $69.99 | 5.0 | 38 |
| 13 | Rabbit Cat | $52.99 | $79.99 | 5.0 | 39 |
| 14 | Smoke Cloud | $42.99 | $69.99 | 4.6 | 29 |

## Design / features

- Responsive grid: **4 columns desktop / 2 tablet / 1 mobile** with smooth horizontal
  snap-scroll.
- Left/right arrow navigation (auto-disabled at ends), keyboard arrows, touch/swipe,
  optional auto-scroll that pauses on hover/touch/focus and when the tab is hidden.
- Product card: 1:1 lazy-loaded image (WebP via Shopify CDN, responsive `srcset`),
  `-XX%` promo badge, `Best Seller` ribbon, name, fractional gold star rating +
  review count, strikethrough + sale price, `Quick Shop` CTA linking to the product.
- Hover: image zoom 5%, card shadow lift, CTA darken + scale.
- Colors/typography per spec (Poppins, sale red `#E74C3C`, CTA blue `#00B4D8`,
  stars `#FFD700`).
- Fires a `product_view_from_carousel` analytics event (dataLayer + Shopify analytics)
  on card click.
- All settings (heading, collection, max products, CTA label, background, padding,
  auto-scroll) are editable from the theme editor.

## Where it's installed

Section and updated homepage template were pushed to the unpublished theme
**"CLAUDE GOOOOOOO 22.14"**. Preview:

```
https://puffyshop.online/?preview_theme_id=165945409776
```

## Notes

- Products and collection are **draft/unpublished** — publish them (and the theme)
  when ready to go live.
- Product images were not uploaded (no source assets were provided); cards fall back
  to a placeholder until images are added. Upload a 1:1 WebP per product and the
  carousel picks it up automatically via `product.featured_image`.
