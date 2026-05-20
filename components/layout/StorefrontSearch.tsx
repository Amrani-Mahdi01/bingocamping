"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Folder, FolderTree, Search, ShoppingBag, Tag } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { api } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import type { Brand, Category, Product } from "@/lib/types";

interface SearchData {
  categories: Category[];
  brands: Brand[];
  products: Product[];
}

interface StorefrontSearchProps {
  /** Optional custom trigger; defaults to the magnifying-glass icon. */
  children?: React.ReactNode;
}

/**
 * Global storefront search palette. Mounted in the Header.
 *
 * - Cmd/Ctrl+K opens the dialog from anywhere on the storefront.
 * - On first open, lazily fetches categories, brands, and a wide product
 *   slice (500). All subsequent filtering is client-side so it stays snappy.
 * - Empty query shows the most recent / popular results so the panel is never
 *   blank.
 * - Selecting a result navigates to the correct destination: product detail,
 *   category page, or catalog filtered by brand.
 */
export function StorefrontSearch({ children }: StorefrontSearchProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [data, setData] = React.useState<SearchData | null>(null);

  // ⌘K / Ctrl+K shortcut
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "/" && e.target instanceof HTMLElement) {
        // Don't intercept when the user is already typing in an input.
        const tag = e.target.tagName;
        if (
          tag !== "INPUT" &&
          tag !== "TEXTAREA" &&
          !e.target.isContentEditable
        ) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lazy-load the search corpus the first time the dialog opens.
  React.useEffect(() => {
    if (!open || data) return;
    Promise.all([
      api.categories.list(),
      api.brands.list(),
      api.products.list({ limit: 500 }),
    ]).then(([categories, brands, prodPage]) => {
      setData({ categories, brands, products: prodPage.items });
    });
  }, [open, data]);

  const results = React.useMemo(() => {
    if (!data) {
      return {
        categories: [] as Category[],
        subcategories: [] as Category[],
        brands: [] as Brand[],
        products: [] as Product[],
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
        products: data.products.slice(0, 8),
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
      categories: topCats.filter(matchCat).slice(0, 5),
      subcategories: subCats.filter(matchCat).slice(0, 6),
      brands: data.brands.filter(matchBrand).slice(0, 6),
      products: data.products.filter(matchProduct).slice(0, 10),
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

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const noResults =
    data !== null &&
    results.categories.length === 0 &&
    results.subcategories.length === 0 &&
    results.brands.length === 0 &&
    results.products.length === 0;

  return (
    <>
      {children ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Rechercher"
          className="contents"
        >
          {children}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Rechercher"
          className="relative inline-flex size-10 items-center justify-center rounded-md text-ink hover:bg-parchment hover:text-tangerine-600"
        >
          <Search className="size-5" />
        </button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Recherche"
        description="Recherchez catégories, marques et produits."
      >
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Catégorie, marque, produit, référence…"
        />
        <CommandList>
          {data === null ? (
            <div className="px-4 py-6 text-center text-xs text-zinc-500">
              Chargement…
            </div>
          ) : noResults ? (
            <CommandEmpty>Aucun résultat.</CommandEmpty>
          ) : null}

          {results.categories.length > 0 ? (
            <>
              <CommandGroup heading="Catégories">
                {results.categories.map((c) => (
                  <CommandItem
                    key={c.id}
                    value={`cat ${c.name} ${c.slug}`}
                    onSelect={() => go(routes.category(c.slug))}
                  >
                    <Folder className="size-4 text-wood-700" />
                    <span className="flex-1 text-sm">{c.name}</span>
                    <span className="font-mono text-2xs text-muted-foreground">
                      {c.productCount} produit{c.productCount > 1 ? "s" : ""}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {(results.subcategories.length > 0 ||
                results.brands.length > 0 ||
                results.products.length > 0) && <CommandSeparator />}
            </>
          ) : null}

          {results.subcategories.length > 0 ? (
            <>
              <CommandGroup heading="Sous-catégories">
                {results.subcategories.map((c) => {
                  const parentSlug = c.parentId
                    ? parentSlugById.get(c.parentId)
                    : undefined;
                  return (
                    <CommandItem
                      key={c.id}
                      value={`sub ${c.name} ${c.slug}`}
                      onSelect={() => go(routes.category(c.slug))}
                    >
                      <FolderTree className="size-4 text-wood-700" />
                      <span className="flex-1 truncate text-sm">{c.name}</span>
                      {parentSlug ? (
                        <span className="truncate text-2xs text-muted-foreground">
                          {parentSlug.replace(/-/g, " ")}
                        </span>
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {(results.brands.length > 0 || results.products.length > 0) && (
                <CommandSeparator />
              )}
            </>
          ) : null}

          {results.brands.length > 0 ? (
            <>
              <CommandGroup heading="Marques">
                {results.brands.map((b) => {
                  const count = productCountByBrand.get(b.id) ?? 0;
                  return (
                    <CommandItem
                      key={b.id}
                      value={`brand ${b.name}`}
                      onSelect={() =>
                        go(`${routes.catalog}?brand=${encodeURIComponent(b.slug)}`)
                      }
                    >
                      <Tag className="size-4 text-wood-700" />
                      <span className="flex-1 text-sm">{b.name}</span>
                      <span className="font-mono text-2xs text-muted-foreground">
                        {count} produit{count > 1 ? "s" : ""}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {results.products.length > 0 && <CommandSeparator />}
            </>
          ) : null}

          {results.products.length > 0 ? (
            <CommandGroup heading="Produits">
              {results.products.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`product ${p.name} ${p.sku} ${p.brand.name}`}
                  onSelect={() => go(routes.product(p.slug))}
                >
                  <ShoppingBag className="size-4 text-wood-700" />
                  <div className="flex min-w-0 flex-1 items-baseline gap-2">
                    <span className="truncate text-sm font-medium">
                      {p.name}
                    </span>
                    <span className="shrink-0 font-mono text-2xs text-muted-foreground">
                      {p.sku}
                    </span>
                  </div>
                  <span className="text-2xs text-muted-foreground">
                    {p.brand.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}
