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
import { Body } from "@/components/ui/typography";
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

      {/* Filter bar — borderless single row */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Nom, SKU, marque…"
            className="h-9 border-zinc-200 bg-white pl-9 text-xs"
          />
        </div>
        <FilterSelect
          value={categoryFilter}
          onChange={(v) => {
            setCategoryFilter(v);
            setPage(1);
          }}
          placeholder="Catégorie"
          options={[
            { value: "all", label: "Toutes catégories" },
            ...allCategories
              .filter((c) => !c.parentId)
              .map((c) => ({ value: c.slug, label: c.name })),
          ]}
        />
        <FilterSelect
          value={brandFilter}
          onChange={(v) => {
            setBrandFilter(v);
            setPage(1);
          }}
          placeholder="Marque"
          options={[
            { value: "all", label: "Toutes marques" },
            ...allBrands.map((b) => ({ value: b.slug, label: b.name })),
          ]}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          placeholder="Statut"
          options={[
            { value: "all", label: "Tous statuts" },
            { value: "in_stock", label: "En stock" },
            { value: "low_stock", label: "Stock faible" },
            { value: "out_of_stock", label: "Rupture" },
          ]}
        />
        <label className="ml-auto inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs">
          <Checkbox
            checked={promoOnly}
            onCheckedChange={(v) => {
              setPromoOnly(v === true);
              setPage(1);
            }}
          />
          <span className="text-zinc-700">Promo uniquement</span>
        </label>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-2.5 text-blue-900">
          <span className="text-xs font-medium">
            {selected.size} produit{selected.size > 1 ? "s" : ""} sélectionné
            {selected.size > 1 ? "s" : ""}
          </span>
          <div className="ml-auto flex flex-wrap gap-1.5">
            {["Activer", "Désactiver", "Supprimer", "Modifier prix…"].map(
              (label) => (
                <Button
                  key={label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => bulkAction(label)}
                  className="h-7 border-blue-300 bg-white text-xs text-blue-900 hover:bg-blue-100"
                >
                  {label}
                </Button>
              )
            )}
          </div>
        </div>
      ) : null}

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="w-10 px-4 py-3 font-medium">
                  <Checkbox
                    checked={
                      visible.length > 0 &&
                      visible.every((p) => selected.has(p.id))
                    }
                    onCheckedChange={toggleAllVisible}
                    aria-label="Tout sélectionner"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Produit</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Marque</th>
                <th className="px-4 py-3 font-medium text-right">Prix</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium text-right">Vues</th>
                <th className="px-4 py-3 font-medium text-right">Ventes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {visible.map((p) => {
                const isChecked = selected.has(p.id);
                return (
                  <tr
                    key={p.id}
                    className={cn(
                      "transition-colors",
                      isChecked ? "bg-blue-50/50" : "hover:bg-zinc-50/60"
                    )}
                  >
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative block size-10 shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-50">
                          <Image
                            src={p.images[0]?.url ?? "/api/placeholder/80/80"}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={routes.admin.product(p.id)}
                            className="line-clamp-1 text-sm font-medium text-zinc-900 hover:text-blue-600"
                          >
                            {p.name}
                          </Link>
                          <span className="block font-mono text-2xs text-zinc-500">
                            {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                      {p.category.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                      {p.brand.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums text-zinc-900">
                      <p className="font-medium">{formatDZD(p.price)}</p>
                      {p.oldPrice ? (
                        <span className="block text-2xs text-zinc-400 line-through">
                          {formatDZD(p.oldPrice)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 text-right font-mono tabular-nums text-zinc-700">
                          {p.stock}
                        </span>
                        <StockBadge status={p.stockStatus} compact />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums text-zinc-500">
                      {p.viewCount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums text-zinc-500">
                      {p.soldCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filtered && filtered.length > 0 ? (
        <div className="mt-4 flex items-center justify-between">
          <Body className="text-xs text-zinc-500">
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
        <p className="mt-6 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-12 text-center text-sm text-zinc-500">
          Aucun produit ne correspond aux filtres.
        </p>
      ) : null}
      {filtered === null ? (
        <p className="mt-6 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-12 text-center text-sm text-zinc-500">
          Chargement…
        </p>
      ) : null}
    </>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="h-9 w-[180px] border-zinc-200 bg-white text-xs">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
