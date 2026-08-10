# Puffy — Boutique Conversion Transformation

Conversion-focused transformation of the **Puffy** Shopify store (`puffyshop.online`
/ `puffy-9833.myshopify.com`), applied to the unpublished theme **"Copie de puffy-theme
ACTIVE CLAUDE CHANGE"** (theme id `165877842160`).

This folder is a **versioned backup / restore point** for the custom theme code, plus
this changelog. The live changes were made through the Shopify Admin API (products,
discount) and the theme files below were written to the unpublished theme via
`themeFilesUpsert`. Nothing here is auto-deployed — it mirrors what was pushed to Shopify.

> ⚠️ The theme edited is **unpublished**. To make it live you must **Publish** it from
> Shopify admin → Online Store → Themes. Until then, all storefront changes are visible
> only in that theme's preview.

---

## 1. Pricing (live, via Admin API)

| Product | Base variant | Old | New | Compare‑at (for the −30% badge) |
|---|---|---|---|---|
| Mochi™ Cat | `1 Puffy ☁️` | $49.99 | **$64.99** | $92.99 |
| CatMallow  | `1 Puffy ☁️` | $29.99 | **$39.99** | $56.99 |

A real `compareAtPrice` was set so the strike‑through and the "−30%" discount are genuine,
not decorative.

> Note: CatMallow's `+1 Secret Puffy` bundle variant is also $39.99, so the entry price now
> equals that bundle. Left as requested ($29.99→$39.99); consider re‑laddering the bundles.

## 2. Shipping — already correct

Free worldwide shipping was **already configured and active**: every delivery zone
(Domestic, International — 28 countries, and Rest of World) has an active
`🎁 FREE Standard Tracked` rate at **$0.00**. No risky checkout changes were made; the
theme now surfaces the "FREE WORLDWIDE SHIPPING" messaging in the header, product blocks
and cart.

## 3. Discount for the email popup (live, via Admin API)

`WELCOME10` — 10% off all products, all customers, active. Shown in the pop‑up success state.

## 4. Theme changes

| File | Type | What it does |
|---|---|---|
| `snippets/wld-conversion-kit.liquid` | **new** | Global kit rendered before `</body>`. Evergreen flash countdown (HH:MM:SS), "Only 5 left" stock bar, live "347 people viewing" FOMO counter, "FREE WORLDWIDE SHIPPING INCLUDED" pill, SSL/30‑day/returns trust row, product subtitle copy, **orange (`#FF6B35`) CTAs & prices**, green cart free‑shipping banner, and the "Get 10% Off + Free Gift" email pop‑up (posts a real `customer` newsletter form → shows `WELCOME10`). |
| `sections/wld-flash-banner.liquid` | **new** | Top hero flash‑sale strip: "🚀 FLASH SALE: −30% + FREE WORLDWIDE SHIPPING" + live countdown + orange CTA. |
| `sections/wld-social-proof.liquid` | **new** | Stats strip (1,839+ / 4.9★ / 30‑day / free shipping), trust badges, auto‑rotating 5★ review slider, FAQ accordion ("Will it arrive on time?"…), final CTA "GET MY PUFFY NOW — LIMITED STOCK". |
| `sections/main-collection.liquid` | edited | "Puffy Originals" grid: responsive **4 / 2 / 2** columns, square 1:1 lazy images, big **orange** price + strike, badges (BEST SELLER / VIRAL / LIMITED, plus −30%), 5★ + review counts, violet **Quick Shop** CTA. |
| `templates/product.json` | **new** | The theme had no product template (product URLs would 404). Adds one reusing the buy block (auto‑binds to the page product) + social‑proof, so the collection → product funnel works. |
| `layout/theme.liquid` | edited | Renders the conversion kit globally. |
| `sections/header-group.json` | edited | Announcement bar → "🚚 FREE WORLDWIDE SHIPPING · ⚡ FLASH SALE: −30% TODAY ONLY". |
| `templates/index.json` | edited | Adds the flash banner (top) and social‑proof (before contact) to the home page. |

All urgency/trust/FOMO widgets are **native theme code** — no app dependency, no monthly
fees, no third‑party performance cost. (The store also already has the Essential Countdown
Timer, Essential Estimated Delivery and Conversion Bear Trust Badges apps installed.)

## 5. Apps

Third‑party apps **cannot be installed through the Admin API** — installation requires the
Shopify App Store OAuth flow (a human clicking "Install"). The equivalent functionality is
delivered natively by `wld-conversion-kit.liquid` and `wld-social-proof.liquid`.

## 6. Testing status — honest note

Automated cross‑device / Lighthouse / console testing **could not be run from this
environment**: its network policy blocks the storefront domain (`puffyshop.online` returns
403 at the egress proxy), so the theme preview cannot be loaded in a headless browser here.

What *was* verified: all 9 theme files upserted with **zero `userErrors`** and read back
byte‑intact; Liquid tags (`{% form %}`, `{% raw %}`, `{% cycle %}`, `{% render %}`) are
well‑formed; new prices confirmed live via the API; the "Puffy Originals" collection exists
with both products. The CSS is responsive by construction (grid `4 / 2 / 2` with the
requested breakpoints). **Please open the theme preview and run Lighthouse / device checks
from your side before publishing.**
