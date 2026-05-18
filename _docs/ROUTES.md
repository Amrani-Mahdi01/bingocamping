# BINGO — Route map

All routes go through `lib/routes.ts` — components never hardcode path strings.

## Public storefront — `app/(public)/`

| Path | Built in | Notes |
| --- | --- | --- |
| `/` | Phase 4 | Homepage (banner slider, trust band, categories, featured, new, promos, best, editorial, newsletter) |
| `/catalog` | Phase 4 | All products, filterable sidebar, sort, pagination |
| `/catalog/[category]` | Phase 4 | Same as catalog but filtered to category slug |
| `/product/[slug]` | Phase 4 | Gallery, info, variants, tabs (description/specs/reviews), related |
| `/compare` | Phase 5 | Up to 4 products, differing-cell highlight, accordion fallback on mobile |
| `/cart` | Phase 5 | Lines + sticky summary |
| `/checkout` | Phase 5 | Single-page form, react-hook-form + zod, redirects to confirmation |
| `/checkout/confirmation` | Phase 5 | Order number, 5-step timeline, summary |
| `/login` | Phase 6 | Split-screen, social placeholders |
| `/register` | Phase 6 | Full form, phone regex, CGV check |
| `/account/orders` | Phase 6 | Status pill tabs, search, table |
| `/account/orders/[id]` | Phase 6 | Timeline + summary + address card |
| `/account/favorites` | Phase 6 | ProductCard grid from favourites store |
| `/account/addresses` | Phase 6 | Address cards, set-default, remove |
| `/account/profile` | Phase 6 | 3-section form (info / password / preferences) |
| `/about` | Phase 6 | Hero + story + 3 values + team + CTA |
| `/contact` | Phase 6 | Coordinates + form + map placeholder |
| `/faq` | Phase 6 | 5 categories × 4 questions + filter |
| `/delivery` | Phase 6 | Region table + ZR Express callout |
| `/returns` | Phase 6 | 6 sections + CTA |
| `/cgv` | Phase 6 | 12 articles |
| `/design-system` | Phase 1 | QA showcase (`noindex/nofollow`) |

## Admin backoffice — `app/(admin)/admin/`

| Path | Built in | Notes |
| --- | --- | --- |
| `/admin` | Phase 7 | KPIs + 2 charts + recent orders/top products/alerts |
| `/admin/products` | Phase 7 | Filters, multi-select bulk actions, paginated table |
| `/admin/products/new` | Phase 7 | 8-section product form |
| `/admin/products/[id]` | Phase 7 | Same form, prefilled |
| `/admin/categories` | Phase 7 | Tree + editor panel, up/down reorder |
| `/admin/orders` | Phase 8 | Status pills + filters + table + bulk actions |
| `/admin/orders/[id]` | Phase 8 | Customer/shipping/items/totals + status changer + call attempts + ZR Express |
| `/admin/customers` | Phase 8 | Search + sort + Actif/Inactif badge |
| `/admin/customers/[id]` | Phase 8 | Header stats + 4 tabs + side panel |
| `/admin/statistics` | Phase 9 | 5 tabs incl. Algeria geo grid |
| `/admin/settings` | Phase 9 | 6 sections + sticky save |
| `/admin/banners` | Phase 9 | List + editor dialog |
| `/admin/shipping` | Phase 9 | ZR Express + 58-wilaya pricing table |

## API routes — `app/api/`

| Path | Built in | Notes |
| --- | --- | --- |
| `/api/placeholder/[...path]` | Phase 4 | Generates SVG placeholders (e.g. `/api/placeholder/800/600?text=Tente`) |

## Error pages

| Path | Notes |
| --- | --- |
| `app/(public)/error.tsx` | Public-facing error boundary, supports retry |
| `app/(admin)/admin/error.tsx` | Admin error boundary |
| `app/not-found.tsx` | Forest-themed 404 |
| `app/(public)/loading.tsx` (+ 7 nested) | Skeleton placeholders during data fetching |
