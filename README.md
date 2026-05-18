# BINGO — Frontend

E-commerce frontend for an Algerian outdoor outfitter (product comparison + sales, COD via ZR Express). Built with **Next.js 16 (App Router) + Tailwind v4 + TypeScript**.

The full build was structured as 10 phases — see `BINGO_PHASES.md` for the original brief and `_docs/` for the design system, route map, and backend handoff contract.

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check only |

## Stack

- **Next.js 16** (App Router, route groups, Turbopack)
- **React 19**
- **Tailwind v4** with CSS-first config in `app/globals.css` (see `_docs/DESIGN_SYSTEM.md` for the token mapping)
- **shadcn/ui** built on `@base-ui/react` (note: components use `render` prop, not `asChild`)
- **Zustand** for cart/compare/favourites/ui/auth stores
- **React Hook Form + Zod** for checkout/auth forms
- **Recharts** for dashboard + statistics
- **Sonner** for toast notifications
- **lucide-react v1** for icons (brand icons inlined in `components/decorative/SocialIcons.tsx`)

## Project layout

```
app/
  (public)/                # storefront — Header + Footer + CompareBar
  (admin)/admin/           # backoffice — sidebar + topbar
  api/placeholder/         # SVG placeholder generator
  globals.css              # Tailwind v4 @theme tokens + base layer
  layout.tsx               # root <html>, font variables, metadata defaults
components/
  ui/                      # shadcn primitives, re-skinned with brand tokens
  decorative/              # WoodGrainPattern, TopoLines, PineDivider, SocialIcons
  layout/                  # Header, Footer, MobileNav, PageStub, StaticPageShell
  admin/                   # AdminSidebar, AdminTopbar, StatCard, charts, AlgeriaGeoGrid, ProductForm
  product/                 # ProductCard, ProductGallery, PriceDisplay, StockBadge, VariantSelector, QuantityStepper, CompareBar, AddToCartPanel
  catalog/                 # FilterSidebar, CatalogSort, CatalogPagination
  order/                   # OrderStatusPill, OrderTimeline
  checkout/                # WilayaSelector, CopyOrderNumber
  auth/                    # AuthSplitLayout
  home/                    # BannerSlider, CategoryTile, TrustBand
lib/
  api/client.ts            # mocked API surface — the contract for the Laravel backend
  mock/*.ts                # 58 wilayas, 27 categories, 15 brands, 80 products, 40 customers, 60 orders, 3 banners
  stores/*.ts              # cart / compare / favorites / ui / auth
  types.ts                 # domain types — Product, Order, Customer, etc.
  routes.ts                # typed route constants + nav menus
  format.ts                # Intl-based formatters (DZD, dates, percent)
  utils.ts                 # cn() helper
_docs/
  DESIGN_SYSTEM.md         # tokens, typography, component-level rules
  ROUTES.md                # every route + which phase built it
  HANDOFF_TO_BACKEND.md    # API contract for the Laravel team
  PHASES.md                # canonical phase prompts (mirror of /BINGO_PHASES.md)
```

## Mock data layer

Everything renders from frozen in-memory arrays in `lib/mock/*.ts`. The dataset is **deterministic** — seeded RNG so the same products/orders appear on every refresh, which keeps screenshots and tests stable. `lib/api/client.ts` returns shallow clones with a 200-500ms simulated delay so loading skeletons feel real.

Swapping to a real backend is a one-file change: edit each method body in `lib/api/client.ts` to `fetch` against the Laravel endpoints documented in `_docs/HANDOFF_TO_BACKEND.md`.

## Conventions

- **No arbitrary Tailwind colour values.** Use the semantic tokens (`bg-forest-700`, `text-wood-600`, `bg-cream`, `bg-parchment`, `text-ink`, `text-ember`, `text-moss`). Never `bg-[#xxx]`.
- **No hardcoded paths in components.** Always import from `lib/routes.ts`.
- **Server components by default.** Only flip to `"use client"` when the page needs interactivity (stores, forms, charts).
- **Hydration guards on store reads.** Zustand stores are client-only — components that conditionally render based on store state should track a `hydrated` flag to keep SSR markup stable.
- **Sonner is the toast layer.** `toast.success / error / info` — every mutation surfaces feedback.
