# BINGO — Frontend → Backend Handoff

This document is the wire contract for the Laravel backend. The frontend reads everything through `lib/api/client.ts`, and that file's signatures are the source of truth. The mock implementation lives in the same file — to swap in real fetch calls, replace each method body while keeping the input/output shapes unchanged.

> **Stack note:** the frontend ships Next.js 16 + Tailwind v4. Mock dataset lives in `lib/mock/*.ts`. Authentication is currently mocked (`lib/stores/auth.ts`); the real backend should expose `/auth/login`, `/auth/register`, `/auth/logout` returning a JWT-or-cookie session.

## Conventions

- All amounts are **integer DZD** (no decimals).
- All timestamps are **ISO 8601 UTC** strings.
- Pagination uses `{ items, total, page, totalPages }`.
- Phone numbers stored as `+213 5XX XXX XXX` / `+213 6XX XXX XXX` / `+213 7XX XXX XXX`.
- Wilaya IDs are two-digit zero-padded strings (`"01"` … `"58"`).
- Order numbers follow `BIN-2026-XXXXX` (5-digit zero-padded sequence).
- Slugs are lowercase ASCII, hyphen-separated, no diacritics.

## Auth (to add)

| Method | Returns |
| --- | --- |
| `POST /auth/login {email, password}` | `{ user: Customer, token: string }` |
| `POST /auth/register {firstName, lastName, email, phone, password}` | same |
| `POST /auth/logout` | `204` |
| `GET /auth/me` | `{ user: Customer }` (or 401) |

Frontend `useAuth` store needs replacing with a hook that reads from `/auth/me` and stores the token in an HttpOnly cookie.

## Products

| Frontend method | HTTP | Notes |
| --- | --- | --- |
| `api.products.list(params)` | `GET /products?...` | Params: `category`, `brand[]`, `minPrice`, `maxPrice`, `search`, `sort`, `page`, `limit`, `inStockOnly`, `promoOnly`, `minRating`. Returns `ProductListResult`. |
| `api.products.get(slug)` | `GET /products/by-slug/:slug` | Returns `Product` or `null`. |
| `api.products.getById(id)` | `GET /products/:id` | Returns `Product` or `null`. |
| `api.products.getFeatured()` | `GET /products/featured` | Limit 12. |
| `api.products.getNew()` | `GET /products/new` | Sorted by `createdAt` desc. |
| `api.products.getBestSellers()` | `GET /products/best-sellers` | Sorted by `soldCount` desc. |
| `api.products.getPromotions()` | `GET /products/promotions` | `isPromo == true`. |
| `api.products.getRelated(productId, limit)` | `GET /products/:id/related?limit=` | Same category, excluding source, ordered by views. |
| `api.products.search(query)` | `GET /products/search?q=` | Autocomplete, max 8. |

`Product` shape — see `lib/types.ts`. Notable fields:
- `images[]` — array of `{ id, url, alt, displayOrder }`. Source resolutions: 800×800 for gallery, 600×450 for cards.
- `variants[]` — flat list; axis is in `name` ("Couleur" / "Taille" / "Pointure" / "Couleur / Taille").
- `attributes[]` — `{ id, label, value }` pairs displayed on the spec tab.
- `stockStatus` is derived: `in_stock` (>5), `low_stock` (1-5), `out_of_stock` (0).

## Categories

| Method | HTTP |
| --- | --- |
| `api.categories.list()` | `GET /categories` (full tree, parent + children flat) |
| `api.categories.get(slug)` | `GET /categories/by-slug/:slug` |

Children are identified by `parentId === parent.id`. Admin tree page mutates `displayOrder` via drag/up/down — backend will need `PATCH /categories/:id/reorder` accepting `{ displayOrder }`.

## Brands & wilayas

| Method | HTTP |
| --- | --- |
| `api.brands.list()` | `GET /brands` |
| `api.wilayas.list()` | `GET /wilayas` |
| `api.wilayas.get(id)` | `GET /wilayas/:id` |

Wilayas are seeded data; admins edit `shippingPrice` + `deliveryDays` + `active` flag from `/admin/shipping`. Backend should expose `PATCH /wilayas/:id`.

## Orders

| Method | HTTP | Notes |
| --- | --- | --- |
| `api.orders.create(input)` | `POST /orders` | Returns the created `Order` with `status: "pending"`. |
| `api.orders.list(params)` | `GET /orders` | Params: `status` (single or array), `wilayaId`, `from`, `to`, `search` (order number/phone/name), `customerId`, `page`, `limit`. Returns `{ items, total, page, totalPages }`. |
| `api.orders.get(id)` | `GET /orders/:id` | Accepts either internal ID or order number. |
| `api.orders.updateStatus(id, status)` | `PATCH /orders/:id/status` | Appends to `statusHistory`. When transitioning to `shipped` and `zrTrackingNumber` is absent, backend generates `ZR{8 digits}DZ` and forwards to ZR Express. |
| `api.orders.addCallAttempt(id, attempt)` | `POST /orders/:id/call-attempts` | `attempt: { result, notes }`. Server timestamps + IDs. |

`CreateOrderInput`:
```ts
{
  customer: { firstName, lastName, phone, email? },
  shipping: { wilayaId, commune, address, notes? },
  lines: Array<{ productId, variant?, quantity }>,
}
```
Server computes `wilayaName` from `wilayaId`, prices from current product state, and `shippingFee` from wilaya config.

### Status transitions (server-enforced)

```
pending   → confirmed | cancelled
confirmed → preparing | cancelled
preparing → shipped
shipped   → delivered | returned
delivered → returned
```

Cancelled and returned are terminal. The admin UI lists only allowed transitions, but the backend must reject illegal ones with 422.

### ZR Express integration

When `status === "shipped"`:
1. Generate `zrTrackingNumber = ZR + 8 random digits + DZ`.
2. POST to ZR Express API with `{ orderNumber, customer, shipping, lines, total }`.
3. Persist tracking number.
4. Webhook `/zr/webhooks/status` updates orders when ZR reports `delivered` or `returned`.

API key stored in `app/admin/shipping` (encrypted). `Tester la connexion` button hits `/zr/health`. `Synchroniser les statuts` button triggers a re-fetch of pending tracking numbers.

## Customers

| Method | HTTP |
| --- | --- |
| `api.customers.list(params)` | `GET /customers` (search/wilayaId/sort/page/limit) |
| `api.customers.get(id)` | `GET /customers/:id` |

`Customer.totalSpent` / `orderCount` / `lastOrderDate` are derived — backend should compute these in a view or denormalise them with triggers.

## Banners

| Method | HTTP |
| --- | --- |
| `api.banners.list()` | `GET /banners?active=true` (sorted by `displayOrder`) |

Admin CRUD: `POST/PATCH/DELETE /banners`, plus `PATCH /banners/reorder` accepting `[{ id, displayOrder }]`.

## Stats

| Method | HTTP | Notes |
| --- | --- | --- |
| `api.stats.dashboard()` | `GET /stats/dashboard` | Returns `DashboardStats` — revenue tiles, pending count, confirmation/delivery rates, top 5 products, alerts, last 7 days revenue series, last 14 days order count series. |
| `api.stats.revenueByPeriod(period, from, to)` | `GET /stats/revenue?period=&from=&to=` | Period: day/week/month. |
| `api.stats.revenueByWilaya()` | `GET /stats/by-wilaya` | All 58 wilayas, zeros included. |

`DashboardAlert.severity` is one of `info / warning / danger`. `icon` is a lucide icon name (the frontend maps it).

## Settings

`/admin/settings` writes to a single key/value config table. Suggested key namespace:
- `site.*` — name, slogan, language, currency.
- `contact.*` — address, phone, email, whatsapp, hours.
- `social.*` — facebook, instagram, tiktok, youtube, whatsappBusiness URLs.
- `notif.*` — booleans for each notification stream + template bodies.
- `policy.*` — `delivery`, `returns`, `cgv` rich-text content.

## Authentication for `/admin/*`

The admin layout currently has no auth gate. When backend ships, add middleware that requires `role: admin` for everything under `/admin` (excluding `/admin/login` if you add one).

## File uploads

Two upload points are placeholder dropzones in this build:
- **Product images** (`/admin/products/[id|new]` → Médias section).
- **Banner images** (`/admin/banners` dialog).

Wire to your storage of choice (S3-compatible). The frontend just needs an upload endpoint returning a URL — drop into the existing `<img src>` arrays.

## Localisation roadmap

The codebase uses Western patterns today. Phase 10 documented an intent to centralise strings in `lib/i18n/fr.ts` and add Arabic; that work is deferred. Note that logical CSS properties (`ps-`, `pe-`, `ms-`, `me-`, `text-start/end`) should be preferred when touching components going forward.
