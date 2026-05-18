# BINGO — Design System (Phase 1)

> Stack note: this project ships on **Next.js 16 + Tailwind v4**. The Phase 1 prompt in `BINGO_PHASES.md` was written for Next 14 + Tailwind v3, so the *configuration mechanics* differ — tokens live in `app/globals.css` under `@theme { ... }` instead of `tailwind.config.ts`. The **semantic tokens, naming, and visual intent are unchanged**: `bg-forest-700`, `text-wood-600`, `shadow-md`, etc. all work identically.

---

## Visual identity

Theme: modern forest outfitter. Reference points: Filson, Snow Peak, Best Made Co. — premium, editorial, confident. NOT kitsch-cabin, NOT Pinterest-rustic. Wood, canvas, brass hardware, warm lantern light.

## Colour tokens

Defined in `app/globals.css` inside `@theme { ... }`.

### Forest (brand green)

| Token | Hex |
| --- | --- |
| `forest-50` | `#f3f6f3` |
| `forest-100` | `#e3ebe4` |
| `forest-200` | `#c7d7c9` |
| `forest-300` | `#9bb89f` |
| `forest-400` | `#6a9270` |
| `forest-500` | `#477352` |
| `forest-600` | `#345b3f` |
| **`forest-700`** | **`#215728`** — brand green (CTAs, headers) |
| `forest-800` | `#1a3f20` |
| `forest-900` | `#142e19` |
| `forest-950` | `#0a1a0d` |

### Wood (brand brown)

| Token | Hex |
| --- | --- |
| `wood-50` | `#fbf6f1` |
| `wood-100` | `#f4e8db` |
| `wood-200` | `#e8cfb4` |
| `wood-300` | `#d9af86` |
| `wood-400` | `#c88a58` |
| `wood-500` | `#a96535` |
| **`wood-600`** | **`#803e15`** — brand brown (warm accents, badges, secondary CTAs) |
| `wood-700` | `#6a3411` |
| `wood-800` | `#562c10` |
| `wood-900` | `#48260f` |

### Neutrals & accents

| Token | Hex | Use |
| --- | --- | --- |
| `cream` | `#faf6ef` | Page background — **NEVER pure white** |
| `parchment` | `#f1ead9` | Card surfaces |
| `ink` | `#1c1a14` | Default text |
| `moss` | `#7a8b5a` | Savings pills, secondary highlights |
| `ember` | `#c4441f` | **Only** for sale prices and low-stock warnings |

### Rules

- `forest-700` is the brand green (CTAs, headers).
- `wood-600` is the brand brown (warm accents, badges, secondary CTAs).
- `cream` is the page background — **never pure white**.
- `parchment` for cards.
- `ember` **only** for sale prices and low-stock warnings.
- **No other accent colors.**
- No arbitrary Tailwind values like `bg-[#215728]`. Always semantic: `bg-forest-700`.

### shadcn semantic mapping

shadcn primitives consume `--background / --foreground / --primary / --secondary / --destructive / --muted / --accent / --border / --ring / --card / --popover`. These live in `:root` in `globals.css` and are wired as follows:

| shadcn token | BINGO mapping |
| --- | --- |
| `--background` | `cream` |
| `--foreground` | `ink` |
| `--card` | `parchment` |
| `--popover` | `cream` |
| `--primary` | `forest-700` |
| `--secondary` | `wood-600` |
| `--accent` | `wood-100` (fg `wood-800`) |
| `--muted` | `parchment` |
| `--destructive` | `ember` |
| `--ring` | `forest-500` (focus uses wood-600 outline; ring is the soft halo) |
| `--border` / `--input` | `#d9d0bd` (warm cream-ash) |

## Typography

Fonts loaded in `app/layout.tsx` via `next/font/google`:

| Family | Role | CSS variable | Tailwind class |
| --- | --- | --- | --- |
| Fraunces (variable, opsz/SOFT/WONK axes) | Display headings | `--font-display` | `font-display` |
| Inter (variable) | Body text | `--font-body` | `font-body` / default |
| JetBrains Mono | Technical / SKU / labels | `--font-mono` | `font-mono` |

Scale (`text-2xs` → `text-4xl`): 12 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 56 / 72.

Body line-height **1.6**, display line-height **1.15**, display tracking `-0.02em` from 40px+.

### Typography components — `components/ui/typography.tsx`

- `H1`, `H2`, `H3` → `font-display`, polymorphic via `as` prop
- `H4` → `font-body` semibold (subhead role)
- `Lead`, `Body`, `Small` → `font-body`
- `Mono` → `font-mono`, uppercase, `text-wood-700`

## Decorative components — `components/decorative/`

- **`WoodGrainPattern.tsx`** — SVG overlay using `<feTurbulence baseFrequency="0.04 0.6" numOctaves="2" />` + `<feDisplacementMap>` composited over the parent's wood colour. Accepts an `opacity` prop (defaults to `0.10` — within the 8-12% spec window). **MUST be visible on every wood-600 surface larger than a button.**
- **`TopoLines.tsx`** — faint topographic contour SVG drawn as nested ridges. Defaults to `var(--color-forest-100)` stroke on cream. Renders absolutely-positioned for hero backgrounds.
- **`PineDivider.tsx`** — section-break ornament: two wood-400 hairlines flanking a small pine motif.

## Shadows

Defined in `@theme`. No harsh black anywhere — all use `rgba(28,26,20, ...)` (tinted ink).

| Token | Definition |
| --- | --- |
| `shadow-sm` | `0 1px 2px rgba(28,26,20,0.04)` |
| `shadow-md` | `0 2px 8px rgba(28,26,20,0.06), 0 8px 24px rgba(28,26,20,0.04)` |
| `shadow-lg` | `0 4px 16px rgba(28,26,20,0.08), 0 16px 48px rgba(28,26,20,0.06)` |

## Globals (`app/globals.css`)

- `body`: bg `cream`, text `ink`, font `var(--font-body)`, line-height 1.6.
- Smooth scroll (`html { scroll-behavior: smooth }`).
- Selection: `forest-100` bg, `forest-900` text.
- Focus-visible (a11y): `wood-600` 2px outline, 2px offset.
- `.wood-grain` + `.wood-grain-overlay`: utility scaffold for `WoodGrainPattern` (overlay is absolute, pointer-events disabled, content z-1).
- `prefers-reduced-motion`: respected globally.

## shadcn primitives installed

`button`, `input`, `textarea`, `label`, `select`, `dialog`, `sheet`, `tabs`, `table`, `dropdown-menu`, `command`, `popover`, `tooltip`, `badge`, `avatar`, `separator`, `skeleton`, `accordion`, `checkbox`, `radio-group`, `slider`, `sonner` (replaces deprecated `toast`), `breadcrumb`, `pagination`, plus bonus `input-group`.

### Custom variants

- **Button** (`components/ui/button.tsx`):
  - `primary` (default) — `bg-forest-700 text-cream`
  - `secondary` — `bg-wood-600 text-cream`, with `<WoodGrainPattern opacity={0.18} />` overlay
  - `outline` — `border-wood-600/40 bg-cream text-ink`
  - `ghost` — transparent, hover `bg-wood-100`
  - `destructive` — solid `bg-ember`
  - `link` — `text-forest-700` underline-on-hover
  - Sizes: `sm` (h-9), `default` (h-11), `lg` (h-12), `icon` (size-11)
- **Badge** (`components/ui/badge.tsx`):
  - `primary` (forest-700) / `secondary` (wood-600) / `success` (forest-100) / `warning` (wood-100) / `destructive` (ember) / `outline` / `ghost` / `link`

## QA route

`/design-system` (at `app/design-system/page.tsx`) — showcases every token and primitive. Marked `noindex / nofollow`. In Phase 2 this is moved into the `(public)` route group.

## Anti-patterns (enforced)

- No arbitrary Tailwind values like `bg-[#215728]`. Always semantic.
- No CSS-in-JS / styled-components.
- No additional UI libraries (MUI, Chakra, etc.).
- No motion libraries used yet (framer-motion is acceptable to install but unused in Phase 1).
- No `dark:` variants used in storefront code — light only.
