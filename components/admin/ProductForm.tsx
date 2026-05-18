"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mono, Small } from "@/components/ui/typography";
import { brands } from "@/lib/mock/brands";
import { categories } from "@/lib/mock/categories";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Product, ProductAttribute } from "@/lib/types";

interface ProductFormProps {
  /** When set, the form is in edit mode. Otherwise create. */
  product?: Product;
}

interface VariantAxis {
  name: string;
  values: string[];
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  // Wide form state — local state suffices for the mock layer.
  const [name, setName] = React.useState(product?.name ?? "");
  const [slug, setSlug] = React.useState(product?.slug ?? "");
  const [descShort, setDescShort] = React.useState(
    product?.descriptionShort ?? ""
  );
  const [descLong, setDescLong] = React.useState(product?.description ?? "");
  const [categorySlug, setCategorySlug] = React.useState(
    product?.category.slug ?? ""
  );
  const [brandSlug, setBrandSlug] = React.useState(product?.brand.slug ?? "");
  const [sku, setSku] = React.useState(product?.sku ?? "");
  const [price, setPrice] = React.useState(String(product?.price ?? ""));
  const [oldPrice, setOldPrice] = React.useState(
    product?.oldPrice ? String(product.oldPrice) : ""
  );
  const [stock, setStock] = React.useState(String(product?.stock ?? ""));
  const [lowStockThreshold, setLowStockThreshold] = React.useState("5");
  const [trackStock, setTrackStock] = React.useState(true);
  const [allowBackorder, setAllowBackorder] = React.useState(false);
  const [hasVariants, setHasVariants] = React.useState(
    (product?.variants.length ?? 0) > 0
  );
  const [axes, setAxes] = React.useState<VariantAxis[]>(
    product?.variants.length
      ? guessAxesFromVariants(product)
      : []
  );
  const [attributes, setAttributes] = React.useState<ProductAttribute[]>(
    product?.attributes ?? []
  );
  const [isActive, setIsActive] = React.useState(true);
  const [isFeatured, setIsFeatured] = React.useState(
    product?.isFeatured ?? false
  );
  const [draft, setDraft] = React.useState(false);

  // Auto-slug from name unless user has edited slug. Derived in onChange
  // handlers — no effect needed.
  const [slugDirty, setSlugDirty] = React.useState(false);

  const onNameChange = (next: string) => {
    setName(next);
    if (!slugDirty) setSlug(slugify(next));
  };

  // Auto-SKU when category changes and SKU is empty (create-mode only).
  const onCategoryChange = (next: string) => {
    setCategorySlug(next);
    if (!isEdit && !sku && next) {
      const prefix = next.slice(0, 3).toUpperCase();
      setSku(`BIN-${prefix}-${Math.floor(Math.random() * 9000 + 1000)}`);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) {
      toast.error("Nom et prix sont requis");
      return;
    }
    // Mock save — would call api.products.create / update.
    await new Promise((r) => setTimeout(r, 500));
    toast.success(
      isEdit ? "Produit mis à jour" : "Produit créé",
      { description: draft ? "Enregistré en brouillon" : "Publié" }
    );
    router.push(routes.admin.products);
  };

  const variantMatrix = React.useMemo(() => buildMatrix(axes, sku), [axes, sku]);

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-32">
      {/* Header bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={routes.admin.products}
          className="inline-flex items-center gap-1 text-xs text-wood-700 hover:text-forest-700"
        >
          <ArrowLeft className="size-3.5" />
          Retour à la liste
        </Link>
        {isEdit && product ? (
          <span className="ml-auto inline-flex items-center gap-2">
            <Link
              href={routes.product(product.slug)}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Eye className="size-3.5" /> Aperçu
            </Link>
            <Small className="font-mono">
              MAJ : {new Date(product.updatedAt).toLocaleDateString("fr-DZ")}
            </Small>
          </span>
        ) : null}
      </div>

      {/* 1. Informations de base */}
      <Section title="Informations de base" subtitle="Nom, slug et descriptions">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom du produit" id="pf-name" required>
            <Input
              id="pf-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Tente 4 places Quechua Arpenaz"
            />
          </Field>
          <Field
            label="Slug URL"
            id="pf-slug"
            hint="Généré automatiquement à partir du nom"
          >
            <Input
              id="pf-slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugDirty(true);
              }}
              placeholder="tente-4-places-quechua-arpenaz"
            />
          </Field>
          <Field label="Catégorie" id="pf-category" required>
            <Select
              value={categorySlug}
              onValueChange={(v) => v && onCategoryChange(v)}
            >
              <SelectTrigger id="pf-category">
                <SelectValue placeholder="Sélectionner…" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => !c.parentId)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Marque" id="pf-brand" required>
            <Select value={brandSlug} onValueChange={(v) => v && setBrandSlug(v)}>
              <SelectTrigger id="pf-brand">
                <SelectValue placeholder="Sélectionner…" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.slug}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field
            label="SKU"
            id="pf-sku"
            hint="Référence interne"
            className="sm:col-span-2"
          >
            <Input
              id="pf-sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="BIN-TEN-0001"
              className="font-mono"
            />
          </Field>
        </div>
        <Field
          label="Description courte"
          id="pf-short"
          hint="2-3 phrases — visible sur la fiche et les listings"
          className="mt-4"
        >
          <Textarea
            id="pf-short"
            value={descShort}
            onChange={(e) => setDescShort(e.target.value)}
            rows={3}
          />
        </Field>
        <Field label="Description longue" id="pf-long" className="mt-4">
          <Textarea
            id="pf-long"
            value={descLong}
            onChange={(e) => setDescLong(e.target.value)}
            rows={8}
          />
        </Field>
      </Section>

      {/* 2. Prix et promotion */}
      <Section title="Prix et promotion">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Prix de vente (DZD)" id="pf-price" required>
            <Input
              id="pf-price"
              type="number"
              min={0}
              step={100}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="font-mono"
            />
          </Field>
          <Field
            label="Ancien prix (DZD)"
            id="pf-oldprice"
            hint="Active la mention promotion"
          >
            <Input
              id="pf-oldprice"
              type="number"
              min={0}
              step={100}
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              className="font-mono"
            />
          </Field>
          <Field label="Marge (auto)" id="pf-margin" hint="Calculée">
            <Input
              id="pf-margin"
              readOnly
              value={
                oldPrice && price
                  ? `${Math.round(
                      ((Number(oldPrice) - Number(price)) / Number(oldPrice)) *
                        100
                    )} %`
                  : "—"
              }
              className="bg-parchment"
            />
          </Field>
        </div>
      </Section>

      {/* 3. Médias */}
      <Section title="Médias" subtitle="Glissez-déposez les images du produit">
        <div className="rounded-md border-2 border-dashed border-wood-600/30 bg-cream p-8 text-center">
          <Upload className="mx-auto size-8 text-wood-600" />
          <p className="mt-3 text-sm">
            Déposez vos images ici, ou{" "}
            <button
              type="button"
              onClick={() => toast.info("Upload — backend à venir")}
              className="font-medium text-forest-700 underline-offset-4 hover:underline"
            >
              parcourir
            </button>
          </p>
          <Small className="mt-2 block">
            PNG, JPG, WebP — 2 Mo max. 4 à 6 images recommandées.
          </Small>
        </div>
        {product?.images.length ? (
          <ul className="mt-4 flex flex-wrap gap-3">
            {product.images.map((img) => (
              <li
                key={img.id}
                className="relative size-24 overflow-hidden rounded-md border border-wood-600/15 bg-parchment"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      {/* 4. Inventaire */}
      <Section title="Inventaire">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stock initial" id="pf-stock">
            <Input
              id="pf-stock"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="font-mono"
            />
          </Field>
          <Field label="Seuil de stock faible" id="pf-lowstock">
            <Input
              id="pf-lowstock"
              type="number"
              min={0}
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="font-mono"
            />
          </Field>
        </div>
        <div className="mt-4 space-y-3 rounded-md bg-cream p-4">
          <label className="flex items-center gap-3">
            <Checkbox
              checked={trackStock}
              onCheckedChange={(v) => setTrackStock(v === true)}
            />
            <span className="text-sm">Suivre le stock</span>
          </label>
          <label className="flex items-center gap-3">
            <Checkbox
              checked={allowBackorder}
              onCheckedChange={(v) => setAllowBackorder(v === true)}
            />
            <span className="text-sm">
              Autoriser les commandes en rupture de stock
            </span>
          </label>
        </div>
      </Section>

      {/* 5. Variantes */}
      <Section title="Variantes">
        <label className="flex items-center gap-3 rounded-md bg-cream p-4">
          <Checkbox
            checked={hasVariants}
            onCheckedChange={(v) => {
              setHasVariants(v === true);
              if (v && axes.length === 0) {
                setAxes([{ name: "Couleur", values: ["Olive", "Sable"] }]);
              }
            }}
          />
          <span className="text-sm">Ce produit a des variantes</span>
        </label>

        {hasVariants ? (
          <div className="mt-4 space-y-4">
            {axes.map((axis, axisIndex) => (
              <div
                key={axisIndex}
                className="space-y-3 rounded-md border border-wood-600/15 bg-cream p-4"
              >
                <div className="flex items-center gap-3">
                  <Input
                    value={axis.name}
                    onChange={(e) => {
                      const next = [...axes];
                      next[axisIndex] = { ...axis, name: e.target.value };
                      setAxes(next);
                    }}
                    placeholder="Nom de l'axe (Couleur, Taille…)"
                    className="max-w-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setAxes(axes.filter((_, i) => i !== axisIndex))
                    }
                    className="ml-auto text-ember hover:bg-ember/10 hover:text-ember"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {axis.values.map((value, valueIndex) => (
                    <span
                      key={valueIndex}
                      className="inline-flex items-center gap-1.5 rounded-md border border-wood-600/30 bg-cream px-2 py-1 text-xs"
                    >
                      {value}
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...axes];
                          next[axisIndex] = {
                            ...axis,
                            values: axis.values.filter((_, i) => i !== valueIndex),
                          };
                          setAxes(next);
                        }}
                        className="text-wood-600 hover:text-ember"
                        aria-label={`Retirer ${value}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const v = prompt("Nouvelle valeur ?");
                      if (v && v.trim()) {
                        const next = [...axes];
                        next[axisIndex] = {
                          ...axis,
                          values: [...axis.values, v.trim()],
                        };
                        setAxes(next);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-dashed border-wood-600/30 px-2 py-1 text-xs text-wood-700 hover:bg-wood-100"
                  >
                    <Plus className="size-3" /> Valeur
                  </button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setAxes([...axes, { name: "Nouvel axe", values: [] }])
              }
            >
              <Plus className="size-3.5" /> Ajouter un axe
            </Button>

            {variantMatrix.length > 0 ? (
              <div className="overflow-hidden rounded-md border border-wood-600/15">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-parchment text-left text-2xs font-mono uppercase tracking-wide text-wood-700">
                      <th className="px-3 py-2.5">Combinaison</th>
                      <th className="px-3 py-2.5">SKU</th>
                      <th className="px-3 py-2.5">Stock</th>
                      <th className="px-3 py-2.5">Δ Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantMatrix.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-wood-600/10 bg-cream"
                      >
                        <td className="px-3 py-2">{row.label}</td>
                        <td className="px-3 py-2">
                          <Input
                            defaultValue={row.sku}
                            className="h-8 font-mono text-xs"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            defaultValue={0}
                            className="h-8 max-w-[80px] font-mono text-xs"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            defaultValue={0}
                            className="h-8 max-w-[80px] font-mono text-xs"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        ) : null}
      </Section>

      {/* 6. Caractéristiques */}
      <Section
        title="Caractéristiques"
        subtitle="Liste libre de paires libellé/valeur"
      >
        <ul className="space-y-2">
          {attributes.map((attr, i) => (
            <li
              key={attr.id}
              className="flex flex-wrap items-center gap-2 rounded-md bg-cream p-2"
            >
              <Input
                value={attr.label}
                onChange={(e) => {
                  const next = [...attributes];
                  next[i] = { ...attr, label: e.target.value };
                  setAttributes(next);
                }}
                placeholder="Libellé"
                className="max-w-xs"
              />
              <Input
                value={attr.value}
                onChange={(e) => {
                  const next = [...attributes];
                  next[i] = { ...attr, value: e.target.value };
                  setAttributes(next);
                }}
                placeholder="Valeur"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAttributes(attributes.filter((_, j) => j !== i))}
                className="text-ember hover:bg-ember/10 hover:text-ember"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setAttributes([
              ...attributes,
              { id: `attr-${Date.now()}`, label: "", value: "" },
            ])
          }
          className="mt-3"
        >
          <Plus className="size-3.5" /> Ajouter une caractéristique
        </Button>
      </Section>

      {/* 7. SEO */}
      <Section title="SEO">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titre meta" id="pf-meta-title">
            <Input id="pf-meta-title" placeholder="Auto à partir du nom" />
          </Field>
          <Field label="Slug" id="pf-meta-slug">
            <Input
              id="pf-meta-slug"
              value={slug}
              readOnly
              className="bg-parchment font-mono"
            />
          </Field>
          <Field
            label="Description meta"
            id="pf-meta-desc"
            className="sm:col-span-2"
            hint="150-160 caractères"
          >
            <Textarea id="pf-meta-desc" rows={3} />
          </Field>
        </div>
      </Section>

      {/* 8. Visibilité */}
      <Section title="Visibilité">
        <div className="space-y-3 rounded-md bg-cream p-4">
          <label className="flex items-center gap-3">
            <Checkbox
              checked={isActive}
              onCheckedChange={(v) => setIsActive(v === true)}
            />
            <span className="text-sm">Produit actif (visible sur le site)</span>
          </label>
          <label className="flex items-center gap-3">
            <Checkbox
              checked={isFeatured}
              onCheckedChange={(v) => setIsFeatured(v === true)}
            />
            <span className="text-sm">Produit vedette (homepage)</span>
          </label>
        </div>
      </Section>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-wood-600/15 bg-cream/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Link
            href={routes.admin.products}
            className="text-xs text-wood-700 underline-offset-4 hover:underline"
          >
            Annuler
          </Link>
          <div className="flex items-center gap-3">
            <Mono
              className={cn(
                "rounded-full px-2 py-0.5",
                draft
                  ? "bg-wood-100 text-wood-800"
                  : "bg-forest-100 text-forest-800"
              )}
            >
              {draft ? "Brouillon" : "Publié"}
            </Mono>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDraft((v) => !v)}
            >
              Basculer
            </Button>
            <Button type="submit" variant="primary" size="default">
              {isEdit ? "Enregistrer les modifications" : "Créer le produit"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg bg-parchment p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  id,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required ? <span className="text-ember">*</span> : null}
      </Label>
      {children}
      {hint ? <Small>{hint}</Small> : null}
    </div>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildMatrix(axes: VariantAxis[], baseSku: string) {
  if (axes.length === 0 || axes.some((a) => a.values.length === 0)) return [];
  const cartesian = axes
    .reduce<string[][]>(
      (acc, axis) =>
        acc.length === 0
          ? axis.values.map((v) => [v])
          : acc.flatMap((row) => axis.values.map((v) => [...row, v])),
      []
    )
    .map((combination, i) => ({
      id: `${baseSku}-${i}`,
      label: combination.join(" / "),
      sku: `${baseSku}-${combination
        .map((v) => v.slice(0, 3).toUpperCase())
        .join("-")}`,
    }));
  return cartesian;
}

function guessAxesFromVariants(product: Product): VariantAxis[] {
  const axisMap = new Map<string, Set<string>>();
  product.variants.forEach((v) => {
    const set = axisMap.get(v.name) ?? new Set<string>();
    set.add(v.value);
    axisMap.set(v.name, set);
  });
  return Array.from(axisMap.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values),
  }));
}
