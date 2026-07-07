# FrostPaws™ — Deploy to Shopify

Production-ready Online Store 2.0 theme. Follow these steps to go live.

## 1. Prerequisites
- A Shopify store (dev or live)
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) installed: `npm i -g @shopify/cli @shopify/theme`

## 2. Preview locally
```bash
shopify theme dev --store your-store.myshopify.com
```
This hot-reloads the theme against your store's data. Click through:
- Add to cart → **cart drawer** opens, free-shipping bar + count update
- Product page → **variant swatches** change price/availability, **sticky Add-to-Cart** appears on scroll
- Header search → **predictive results** as you type
- Collection → sort, filter, paginate

## 3. Push the theme
```bash
shopify theme push --unpublished    # uploads as a new, unpublished theme
```
Review it in **Online Store → Themes → Preview**, then **Publish** when ready.

## 4. Store setup (one-time, in Admin)
1. **Products** — create the FrostPaws mat with a **Size** option (XS, S, M, L, XL, XXL) and any **Color** option. Upload product media (these are the product gallery images).
2. **Collections** — create a collection (e.g. "Shop") and set the catalog/menu.
3. **Navigation** — set header + footer menus (defaults link to `/#why`, `/#size-guide`, etc.).
4. **Policies** — Settings → Policies: add refund, privacy, terms, shipping (rendered by `policy.liquid`).
5. **Customer accounts** — Settings → Customer accounts: enable to activate login/register/account.
6. **Markets/Shipping** — set your free-shipping rule to match the theme's threshold (Theme settings → Cart).

## 5. Theme Editor — upload your images
Every image is an editable picker with a premium placeholder until you upload. Notable slots:
- **Interactive size guide** (Homepage → Interactive size guide): `SIZE_XS_IMAGE`, `SIZE_S_IMAGE`, `SIZE_M_IMAGE`, `SIZE_L_IMAGE`, `SIZE_XL_IMAGE`, `SIZE_XXL_IMAGE` — each independent, auto-fills its card.
- Hero slides (4), How-it-works, Color variants, Lifestyle gallery, Benefits, Before/After, Story, Review avatars.
- **Theme settings → Logo & branding**: logo + favicon.

## 6. Configure theme settings
Theme Editor → **Theme settings**:
- Logo & branding, Cart (drawer vs page, free-shipping threshold), Product cards (wishlist/rating), Social links, Search.

## 7. Quality check (optional but recommended)
```bash
shopify theme check
```
Config is in `.theme-check.yml`.

## Notes
- Brand fonts (General Sans + Inter) load from CDN with `font-display: swap` and are non-blocking.
- The homepage template (`templates/index.json`) is the locked landing page.
- `design-system/` and `styleguide.html` are reference material (ignored by Theme Check) — safe to keep or remove before publishing.
- AJAX cart, predictive search, and variant switching use Shopify's documented Storefront/Section-Rendering APIs; verify them once in `shopify theme dev` against real products.
