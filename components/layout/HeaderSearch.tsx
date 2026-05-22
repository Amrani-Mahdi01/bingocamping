"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Folder,
  FolderTree,
  Search,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";

import { adaptBrand, adaptCategory, adaptProduct } from "@/lib/api/adapters";
import { http, HttpError } from "@/lib/api/http";
import { routes } from "@/lib/routes";
import type { ApiBrand } from "@/lib/api/brands";
import type { ApiCategory } from "@/lib/api/categories";
import type { ApiProduct } from "@/lib/api/products";
import { cn } from "@/lib/utils";
import { useFormatDZD, useT } from "@/lib/i18n/LanguageProvider";
import type { Brand, Category, Product } from "@/lib/types";

interface SearchData {
  categories: Category[];
  brands: Brand[];
  products: Product[];
}

interface Results {
  categories: Category[];
  subcategories: Category[];
  brands: Brand[];
  products: Product[];
}

/**
 * Inline header search.
 *
 * Renders a visible <input> in the header. As the user types, a floating
 * dropdown below it surfaces matching categories, subcategories, brands and
 * products. Result corpus (categories + brands + 500 products) is loaded the
 * first time the input is focused and then filtered client-side.
 */
export function HeaderSearch({ className }: { className?: string }) {
  const formatPrice = useFormatDZD();
  const router = useRouter();
  const t = useT();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<SearchData | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Lazy-load corpus on first focus — straight from Laravel public APIs.
  // All three endpoints are unauthenticated so this works for guests too.
  const ensureLoaded = React.useCallback(() => {
    if (data) return;
    const fetchPub = <T,>(path: string) =>
      http
        .get<{ data: T }>(path, { auth: "none" })
        .then((r) => r.data)
        .catch(() => null);

    Promise.all([
      fetchPub<ApiCategory[]>("/api/categories"),
      fetchPub<ApiBrand[]>("/api/brands"),
      fetchPub<ApiProduct[]>("/api/products?perPage=500"),
    ])
      .then(([cats, brands, products]) => {
        const flatCats = (cats ?? []).flatMap((c) => [
          c,
          ...(c.children ?? []),
        ]);
        setData({
          categories: flatCats.map(adaptCategory),
          brands: (brands ?? []).map(adaptBrand),
          products: (products ?? []).map(adaptProduct),
        });
      })
      .catch((err) => {
        if (err instanceof HttpError && err.status !== 401) {
          console.error("[HeaderSearch] corpus load failed", err);
        }
      });
  }, [data]);

  // Close on outside click
  React.useEffect(() => {
    const onDocPointer = (e: PointerEvent) => {
      const node = containerRef.current;
      if (node && !node.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, []);

  // Focus shortcut: "/" anywhere (when not already typing)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      const tgt = e.target as HTMLElement | null;
      if (!tgt) return;
      const tag = tgt.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tgt.isContentEditable) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results: Results = React.useMemo(() => {
    if (!data) {
      return {
        categories: [],
        subcategories: [],
        brands: [],
        products: [],
      };
    }
    const q = query.trim().toLowerCase();
    const topCats = data.categories.filter((c) => !c.parentId);
    const subCats = data.categories.filter((c) => !!c.parentId);
    if (!q) {
      return {
        categories: topCats.slice(0, 6),
        subcategories: subCats.slice(0, 6),
        brands: data.brands.slice(0, 6),
        products: data.products.slice(0, 6),
      };
    }
    const matchCat = (c: Category) =>
      `${c.name} ${c.nameAr ?? ""} ${c.slug}`.toLowerCase().includes(q);
    const matchBrand = (b: Brand) =>
      `${b.name} ${b.slug ?? ""}`.toLowerCase().includes(q);
    const matchProduct = (p: Product) =>
      `${p.name} ${p.sku} ${p.brand.name} ${p.category.name} ${
        p.descriptionShort ?? ""
      }`
        .toLowerCase()
        .includes(q);
    return {
      categories: topCats.filter(matchCat).slice(0, 4),
      subcategories: subCats.filter(matchCat).slice(0, 5),
      brands: data.brands.filter(matchBrand).slice(0, 4),
      products: data.products.filter(matchProduct).slice(0, 8),
    };
  }, [data, query]);

  const parentSlugById = React.useMemo(() => {
    const m = new Map<string, string>();
    data?.categories.forEach((c) => m.set(c.id, c.slug));
    return m;
  }, [data]);

  const productCountByBrand = React.useMemo(() => {
    const m = new Map<string, number>();
    data?.products.forEach((p) => {
      m.set(p.brand.id, (m.get(p.brand.id) ?? 0) + 1);
    });
    return m;
  }, [data]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`${routes.catalog}?search=${encodeURIComponent(q)}`);
    close();
  };

  const totalResults =
    results.categories.length +
    results.subcategories.length +
    results.brands.length +
    results.products.length;
  const noResults = data !== null && query.trim().length > 0 && totalResults === 0;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={onSubmit}
        role="search"
        className={cn(
          // h-10 (40 px) on mobile for a comfortable touch target;
          // collapses back to h-9 on desktop where the bar is denser.
          "flex h-10 w-full items-center gap-2 rounded-full border bg-cream px-3 transition-colors md:h-9 md:gap-1.5 md:px-2.5",
          open
            ? "border-forest-500 ring-2 ring-forest-500/15"
            : "border-wood-600/25 hover:border-wood-600/40"
        )}
      >
        <Search
          className="size-4 shrink-0 text-wood-600 md:size-3.5"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            ensureLoaded();
          }}
          placeholder={t("header.searchPlaceholder")}
          aria-label={t("common.search")}
          // 16 px on mobile (text-base) → defeats iOS Safari's auto-zoom
          // on focus, which kicks in for any input under 16 px.
          // Desktop drops back to the dense text-xs (12 px) header look.
          className="h-full min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted-foreground md:text-xs"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Effacer la recherche"
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-wood-600 hover:bg-wood-100 hover:text-wood-800 md:size-5"
          >
            <X className="size-3.5 md:size-3" />
          </button>
        ) : (
          <kbd className="hidden shrink-0 rounded border border-wood-600/20 bg-cream px-1 py-0.5 font-mono text-[9px] text-wood-600 lg:inline-flex">
            /
          </kbd>
        )}
      </form>

      {open ? (
        <div
          role="listbox"
          // Mobile: stretch to the search bar's full width via inset-x-0,
          // and cap height at half the viewport so the on-screen keyboard
          // doesn't cover every result.
          // Desktop (md+): floating 420-px panel anchored to the trailing
          // edge of the input.
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-[50vh] overflow-y-auto rounded-xl border border-wood-600/15 bg-cream shadow-2xl ring-1 ring-wood-600/5 md:inset-x-auto md:end-0 md:max-h-[70vh] md:w-[min(420px,calc(100vw-2rem))]"
        >
          {data === null ? (
            <p className="px-4 py-6 text-center text-xs text-muted-foreground">
              Chargement…
            </p>
          ) : noResults ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Aucun résultat pour <strong>«&nbsp;{query}&nbsp;»</strong>
              </p>
              <Link
                href={`${routes.catalog}?search=${encodeURIComponent(query)}`}
                onClick={close}
                className="mt-3 inline-block text-xs font-medium text-forest-700 underline-offset-4 hover:underline"
              >
                Voir tous les produits ›
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-wood-600/10 py-1">
              {results.categories.length > 0 ? (
                <Group title="Catégories">
                  {results.categories.map((c) => (
                    <ResultRow
                      key={c.id}
                      href={routes.category(c.slug)}
                      onSelect={close}
                      icon={<Folder className="size-4 text-wood-700" />}
                      title={c.name}
                      meta={`${c.productCount} produit${
                        c.productCount > 1 ? "s" : ""
                      }`}
                    />
                  ))}
                </Group>
              ) : null}

              {results.subcategories.length > 0 ? (
                <Group title="Sous-catégories">
                  {results.subcategories.map((c) => {
                    const parentSlug = c.parentId
                      ? parentSlugById.get(c.parentId)
                      : undefined;
                    return (
                      <ResultRow
                        key={c.id}
                        href={routes.category(c.slug)}
                        onSelect={close}
                        icon={<FolderTree className="size-4 text-wood-700" />}
                        title={c.name}
                        meta={
                          parentSlug ? parentSlug.replace(/-/g, " ") : undefined
                        }
                      />
                    );
                  })}
                </Group>
              ) : null}

              {results.brands.length > 0 ? (
                <Group title="Marques">
                  {results.brands.map((b) => {
                    const count = productCountByBrand.get(b.id) ?? 0;
                    return (
                      <ResultRow
                        key={b.id}
                        href={`${routes.catalog}?brand=${encodeURIComponent(
                          b.slug
                        )}`}
                        onSelect={close}
                        icon={<Tag className="size-4 text-wood-700" />}
                        title={b.name}
                        meta={`${count} produit${count > 1 ? "s" : ""}`}
                      />
                    );
                  })}
                </Group>
              ) : null}

              {results.products.length > 0 ? (
                <Group title="Produits">
                  {results.products.map((p) => (
                    <ResultRow
                      key={p.id}
                      href={routes.product(p.slug)}
                      onSelect={close}
                      icon={<ShoppingBag className="size-4 text-wood-700" />}
                      title={p.name}
                      meta={`${p.brand.name} · ${formatPrice(p.price)}`}
                      sub={p.sku}
                    />
                  ))}
                </Group>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-1.5 py-1.5">
      <p className="px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-wood-600">
        {title}
      </p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function ResultRow({
  href,
  onSelect,
  icon,
  title,
  meta,
  sub,
}: {
  href: string;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  meta?: string;
  sub?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onSelect}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink hover:bg-wood-100/60"
      >
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-parchment">
          {icon}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium">{title}</span>
          {sub ? (
            <span className="truncate font-mono text-[10px] text-muted-foreground">
              {sub}
            </span>
          ) : null}
        </span>
        {meta ? (
          <span className="shrink-0 text-xs text-muted-foreground">{meta}</span>
        ) : null}
      </Link>
    </li>
  );
}
