"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Plus, Search, Upload } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Body, Mono, Small } from "@/components/ui/typography";
import { StockBadge } from "@/components/product/StockBadge";
import { api } from "@/lib/api/client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { formatDZD } from "@/lib/format";
import type { Brand, Category, Product } from "@/lib/types";

const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const [allProducts, setAllProducts] = React.useState<Product[] | null>(null);
  const [allCategories, setAllCategories] = React.useState<Category[]>([]);
  const [allBrands, setAllBrands] = React.useState<Brand[]>([]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [brandFilter, setBrandFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [promoOnly, setPromoOnly] = React.useState(false);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    Promise.all([
      api.products.list({ limit: 200 }),
      api.categories.list(),
      api.brands.list(),
    ]).then(([res, cats, brands]) => {
      setAllProducts(res.items);
      setAllCategories(cats);
      setAllBrands(brands);
    });
  }, []);

  const filtered = React.useMemo(() => {
    if (!allProducts) return null;
    return allProducts.filter((p) => {
      if (
        search.trim() &&
        !`${p.name} ${p.sku} ${p.brand.name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      if (categoryFilter !== "all" && p.category.slug !== categoryFilter)
        return false;
      if (brandFilter !== "all" && p.brand.slug !== brandFilter) return false;
      if (statusFilter !== "all" && p.stockStatus !== statusFilter) return false;
      if (promoOnly && !p.isPromo) return false;
      return true;
    });
  }, [allProducts, search, categoryFilter, brandFilter, statusFilter, promoOnly]);

  const visible = filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];
  const totalPages = Math.max(1, Math.ceil((filtered?.length ?? 0) / PAGE_SIZE));

  const toggleAllVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (visible.every((p) => next.has(p.id))) {
        visible.forEach((p) => next.delete(p.id));
      } else {
        visible.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const bulkAction = (action: string) => {
    toast.success(
      `${action} appliqué à ${selected.size} produit${selected.size > 1 ? "s" : ""}`
    );
    setSelected(new Set());
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Produits"
        subtitle={
          allProducts === null
            ? "Chargement…"
            : `${allProducts.length} produit${allProducts.length > 1 ? "s" : ""} au catalogue`
        }
        actions={
          <>
            <button
              type="button"
              onClick={() => toast.info("Import CSV — backend à venir")}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Upload className="size-3.5" /> Importer CSV
            </button>
            <button
              type="button"
              onClick={() => toast.info("Export en cours…")}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Download className="size-3.5" /> Exporter
            </button>
            <Link
              href={routes.admin.productNew}
              className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
            >
              <Plus className="size-3.5" /> Ajouter un produit
            </Link>
          </>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-parchment p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-wood-600" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Nom, SKU, marque…"
            className="h-9 bg-cream pl-9 text-xs"
          />
        </div>
        <FilterSelect
          label="Catégorie"
          value={categoryFilter}
          onChange={(v) => {
            setCategoryFilter(v);
            setPage(1);
          }}
          options={[
            { value: "all", label: "Toutes" },
            ...allCategories
              .filter((c) => !c.parentId)
              .map((c) => ({ value: c.slug, label: c.name })),
          ]}
        />
        <FilterSelect
          label="Marque"
          value={brandFilter}
          onChange={(v) => {
            setBrandFilter(v);
            setPage(1);
          }}
          options={[
            { value: "all", label: "Toutes" },
            ...allBrands.map((b) => ({ value: b.slug, label: b.name })),
          ]}
        />
        <FilterSelect
          label="Statut"
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          options={[
            { value: "all", label: "Tous" },
            { value: "in_stock", label: "En stock" },
            { value: "low_stock", label: "Stock faible" },
            { value: "out_of_stock", label: "Rupture" },
          ]}
        />
        <label className="ml-auto flex items-center gap-2 text-xs">
          <Checkbox
            checked={promoOnly}
            onCheckedChange={(v) => {
              setPromoOnly(v === true);
              setPage(1);
            }}
          />
          <span>Promo uniquement</span>
        </label>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-md bg-forest-900 px-4 py-2 text-cream">
          <span className="text-xs">
            <strong>{selected.size}</strong> produit{selected.size > 1 ? "s" : ""}{" "}
            sélectionné{selected.size > 1 ? "s" : ""}
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            {["Activer", "Désactiver", "Supprimer", "Modifier prix…"].map(
              (label) => (
                <Button
                  key={label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => bulkAction(label)}
                  className="border-cream/30 bg-transparent text-cream hover:bg-forest-800 hover:text-cream hover:border-cream/50"
                >
                  {label}
                </Button>
              )
            )}
          </div>
        </div>
      ) : null}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-wood-600/15 bg-cream">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-parchment text-left text-2xs font-mono uppercase tracking-wide text-wood-700">
              <th className="w-10 px-3 py-2.5">
                <Checkbox
                  checked={
                    visible.length > 0 &&
                    visible.every((p) => selected.has(p.id))
                  }
                  onCheckedChange={toggleAllVisible}
                  aria-label="Tout sélectionner"
                />
              </th>
              <th className="w-12 px-3 py-2.5">Image</th>
              <th className="px-3 py-2.5">Nom</th>
              <th className="px-3 py-2.5">Catégorie</th>
              <th className="px-3 py-2.5">Marque</th>
              <th className="px-3 py-2.5">Prix</th>
              <th className="px-3 py-2.5">Stock</th>
              <th className="px-3 py-2.5">Vues</th>
              <th className="px-3 py-2.5">Ventes</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const isChecked = selected.has(p.id);
              return (
                <tr
                  key={p.id}
                  className={cn(
                    "border-t border-wood-600/10 transition-colors",
                    isChecked ? "bg-wood-100" : "hover:bg-parchment/40"
                  )}
                >
                  <td className="px-3 py-2.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(v) => {
                        setSelected((prev) => {
                          const next = new Set(prev);
                          if (v) next.add(p.id);
                          else next.delete(p.id);
                          return next;
                        });
                      }}
                      aria-label={`Sélectionner ${p.name}`}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="relative block size-10 overflow-hidden rounded-md bg-parchment">
                      <Image
                        src={p.images[0]?.url ?? "/api/placeholder/80/80"}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={routes.admin.product(p.id)}
                      className="line-clamp-1 font-display text-sm font-semibold text-ink hover:text-forest-700"
                    >
                      {p.name}
                    </Link>
                    <Small className="block font-mono">{p.sku}</Small>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {p.category.name}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {p.brand.name}
                  </td>
                  <td className="px-3 py-2.5">
                    <div>
                      <p className="font-mono tabular-nums">
                        {formatDZD(p.price)}
                      </p>
                      {p.oldPrice ? (
                        <Small className="block font-mono line-through">
                          {formatDZD(p.oldPrice)}
                        </Small>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono tabular-nums">{p.stock}</span>
                      <StockBadge status={p.stockStatus} compact />
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-muted-foreground">
                    {p.viewCount}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums text-muted-foreground">
                    {p.soldCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered && filtered.length > 0 ? (
        <div className="mt-4 flex items-center justify-between">
          <Body className="text-xs text-muted-foreground">
            Page {page} sur {totalPages} · {filtered.length} produit
            {filtered.length > 1 ? "s" : ""}
          </Body>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Précédent
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      ) : null}

      {filtered !== null && filtered.length === 0 ? (
        <p className="mt-6 rounded-lg bg-parchment px-4 py-12 text-center text-sm text-muted-foreground">
          Aucun produit ne correspond aux filtres.
        </p>
      ) : null}
      {filtered === null ? (
        <p className="mt-6 rounded-lg bg-parchment px-4 py-12 text-center text-sm text-muted-foreground">
          Chargement…
        </p>
      ) : null}
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Mono className="text-wood-700">{label}</Mono>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="h-9 w-[160px] bg-cream text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
