"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
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
import { Body, Mono, Small } from "@/components/ui/typography";
import { categories as initial } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [tree, setTree] = React.useState<Category[]>(initial);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<Set<string>>(
    new Set(initial.filter((c) => !c.parentId).map((c) => c.id))
  );

  const tops = tree.filter((c) => !c.parentId);
  const childrenOf = (parentId: string) =>
    tree.filter((c) => c.parentId === parentId);

  const selected = selectedId ? tree.find((c) => c.id === selectedId) : null;

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const reorder = (id: string, direction: -1 | 1) => {
    const node = tree.find((c) => c.id === id);
    if (!node) return;
    const siblings = node.parentId
      ? childrenOf(node.parentId)
      : tree.filter((c) => !c.parentId);
    siblings.sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = siblings.findIndex((s) => s.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;
    const swap = siblings[swapIdx]!;
    setTree((prev) =>
      prev.map((c) => {
        if (c.id === id) return { ...c, displayOrder: swap.displayOrder };
        if (c.id === swap.id) return { ...c, displayOrder: node.displayOrder };
        return c;
      })
    );
    toast.success("Ordre mis à jour");
  };

  const remove = (id: string) => {
    const subtree = collectSubtree(tree, id);
    setTree((prev) => prev.filter((c) => !subtree.has(c.id)));
    if (selectedId === id) setSelectedId(null);
    toast.success("Catégorie supprimée");
  };

  const createCategory = (parentId?: string) => {
    const siblings = parentId
      ? tree.filter((c) => c.parentId === parentId)
      : tree.filter((c) => !c.parentId);
    const order =
      siblings.reduce((max, c) => Math.max(max, c.displayOrder), 0) + 1;
    const id = `cat-new-${Date.now()}`;
    const newCat: Category = {
      id,
      slug: `nouvelle-${order}`,
      name: parentId
        ? "Nouvelle sous-catégorie"
        : "Nouvelle catégorie",
      parentId,
      icon: parentId
        ? tree.find((c) => c.id === parentId)?.icon ?? "Folder"
        : "Folder",
      productCount: 0,
      displayOrder: order,
    };
    setTree((prev) => [...prev, newCat]);
    if (parentId) {
      setExpanded((prev) => {
        const next = new Set(prev);
        next.add(parentId);
        return next;
      });
    }
    setSelectedId(id);
    toast.success(
      parentId
        ? "Sous-catégorie créée — renseignez ses informations à droite"
        : "Catégorie créée — renseignez ses informations à droite"
    );
  };

  const updateCategory = (
    id: string,
    patch: Partial<Pick<Category, "name" | "slug" | "icon" | "parentId" | "nameAr">>
  ) => {
    setTree((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Catégories"
        subtitle="Arborescence et métadonnées."
        actions={
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => createCategory()}
          >
            <Plus className="size-3.5" />
            Ajouter une catégorie racine
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Tree */}
        <section className="rounded-md border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
          <Mono className="text-zinc-500">Hiérarchie</Mono>
          <h2 className="mt-1 font-sans text-lg font-semibold">
            {tops.length} catégories racines
          </h2>
          <ul className="mt-4 space-y-1">
            {tops
              .slice()
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((cat) => (
                <TreeNode
                  key={cat.id}
                  cat={cat}
                  childList={childrenOf(cat.id).sort(
                    (a, b) => a.displayOrder - b.displayOrder
                  )}
                  expanded={expanded.has(cat.id)}
                  onToggle={() => toggleExpand(cat.id)}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onMoveUp={(id) => reorder(id, -1)}
                  onMoveDown={(id) => reorder(id, 1)}
                  onRemove={remove}
                  onAddChild={() => createCategory(cat.id)}
                />
              ))}
          </ul>
        </section>

        {/* Editor panel */}
        <aside className="rounded-md border border-zinc-200 bg-white p-5">
          {selected ? (
            <CategoryEditor
              key={selected.id}
              category={selected}
              allCategories={tree}
              onChange={(patch) => updateCategory(selected.id, patch)}
            />
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <Mono className="text-zinc-500">Édition</Mono>
              <h2 className="mt-2 font-sans text-lg font-semibold">
                Sélectionnez une catégorie
              </h2>
              <Body className="mt-2 max-w-xs text-zinc-500">
                Cliquez sur une entrée à gauche pour la modifier ou créez-en
                une nouvelle.
              </Body>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

function TreeNode({
  cat,
  childList,
  expanded,
  onToggle,
  selectedId,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  onAddChild,
}: {
  cat: Category;
  childList: Category[];
  expanded: boolean;
  onToggle: () => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onRemove: (id: string) => void;
  onAddChild: () => void;
}) {
  const hasChildren = childList.length > 0;
  const isSelected = cat.id === selectedId;
  return (
    <li>
      <div
        className={cn(
          "group flex items-center gap-2 rounded-md px-2 py-2 text-sm",
          isSelected
            ? "bg-blue-50 text-zinc-900"
            : "hover:bg-zinc-100/60"
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-label={expanded ? "Replier" : "Déplier"}
          className="inline-flex size-5 items-center justify-center text-zinc-700 hover:text-zinc-900"
        >
          {expanded ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onSelect(cat.id)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span className="truncate">{cat.name}</span>
          <span className="inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-1.5 py-0.5 font-mono text-2xs text-zinc-900">
            {cat.productCount}
          </span>
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onAddChild}
            className="inline-flex items-center gap-1 rounded-md border border-dashed border-blue-300 bg-blue-50 px-2 py-1 font-mono text-2xs font-medium uppercase tracking-wide text-blue-700 transition-colors hover:border-blue-500 hover:bg-blue-100"
          >
            <Plus className="size-3" />
            Sous-cat.
          </button>
          <IconBtn label="Monter" onClick={() => onMoveUp(cat.id)}>
            <ArrowUp className="size-3.5" />
          </IconBtn>
          <IconBtn label="Descendre" onClick={() => onMoveDown(cat.id)}>
            <ArrowDown className="size-3.5" />
          </IconBtn>
          <IconBtn label="Éditer" onClick={() => onSelect(cat.id)}>
            <Pencil className="size-3.5" />
          </IconBtn>
          <IconBtn
            label="Supprimer"
            onClick={() => {
              if (
                confirm(
                  `Supprimer "${cat.name}" et ses sous-catégories ?`
                )
              ) {
                onRemove(cat.id);
              }
            }}
            destructive
          >
            <Trash2 className="size-3.5" />
          </IconBtn>
        </div>
      </div>
      {expanded ? (
        <ul className="ml-6 mt-0.5 space-y-0.5 border-l border-zinc-200 pl-3">
          {childList.map((child) => (
            <li
              key={child.id}
              className={cn(
                "group flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
                child.id === selectedId
                  ? "bg-blue-50 text-zinc-900"
                  : "hover:bg-zinc-100/60"
              )}
            >
              <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />
              <button
                type="button"
                onClick={() => onSelect(child.id)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <span className="truncate">{child.name}</span>
                <span className="inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-1.5 py-0.5 font-mono text-2xs text-zinc-900">
                  {child.productCount}
                </span>
              </button>
              <div className="flex items-center gap-1">
                <IconBtn label="Monter" onClick={() => onMoveUp(child.id)}>
                  <ArrowUp className="size-3" />
                </IconBtn>
                <IconBtn label="Descendre" onClick={() => onMoveDown(child.id)}>
                  <ArrowDown className="size-3" />
                </IconBtn>
                <IconBtn
                  label="Supprimer"
                  onClick={() => {
                    if (confirm(`Supprimer "${child.name}" ?`)) {
                      onRemove(child.id);
                    }
                  }}
                  destructive
                >
                  <Trash2 className="size-3" />
                </IconBtn>
              </div>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={onAddChild}
              className="flex w-full items-center gap-2 rounded-md border border-dashed border-zinc-300 px-2 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus className="size-3.5" />
              Ajouter une sous-catégorie à {cat.name}
            </button>
          </li>
        </ul>
      ) : null}
    </li>
  );
}

function IconBtn({
  label,
  onClick,
  children,
  destructive,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex size-6 items-center justify-center rounded text-zinc-700 hover:bg-zinc-100",
        destructive && "hover:bg-red-50 hover:text-red-600"
      )}
    >
      {children}
    </button>
  );
}

function CategoryEditor({
  category,
  allCategories,
  onChange,
}: {
  category: Category;
  allCategories: Category[];
  onChange: (
    patch: Partial<
      Pick<Category, "name" | "slug" | "icon" | "parentId" | "nameAr">
    >
  ) => void;
}) {
  const [name, setName] = React.useState(category.name);
  const [nameAr, setNameAr] = React.useState(category.nameAr ?? "");
  const [slug, setSlug] = React.useState(category.slug);
  const [icon, setIcon] = React.useState(category.icon);
  const [parentId, setParentId] = React.useState(category.parentId ?? "_root");
  const [active, setActive] = React.useState(true);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onChange({
          name: name.trim() || category.name,
          nameAr: nameAr.trim() || undefined,
          slug: slug.trim() || category.slug,
          icon: icon.trim() || category.icon,
          parentId: parentId === "_root" ? undefined : parentId,
        });
        toast.success("Catégorie enregistrée");
      }}
    >
      <Mono className="text-zinc-500">Édition</Mono>
      <h2 className="mt-1 font-sans text-lg font-semibold">{name}</h2>
      <Small>
        ID : <span className="font-mono">{category.id}</span> ·{" "}
        {category.productCount} produits
      </Small>

      <div className="mt-5 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Nom (FR)</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-namear">Nom (AR)</Label>
            <Input
              id="cat-namear"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              dir="rtl"
              lang="ar"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cat-slug">Slug</Label>
          <Input
            id="cat-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cat-icon">Icône (lucide)</Label>
            <Input
              id="cat-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-parent">Parent</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger id="cat-parent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_root">— Racine —</SelectItem>
                {allCategories
                  .filter((c) => !c.parentId && c.id !== category.id)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cat-desc">Description (optionnel)</Label>
          <Textarea id="cat-desc" rows={3} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cat-order">Ordre d&apos;affichage</Label>
          <Input
            id="cat-order"
            type="number"
            defaultValue={category.displayOrder}
            className="font-mono"
          />
        </div>
        <label className="flex items-center gap-3 rounded-md bg-zinc-50 p-3">
          <Checkbox
            checked={active}
            onCheckedChange={(v) => setActive(v === true)}
          />
          <span className="text-sm">Catégorie active</span>
        </label>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Button type="submit" variant="primary" size="sm">
          Enregistrer
        </Button>
        <button
          type="button"
          onClick={() => toast.info("Upload image — backend à venir")}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Téléverser une image
        </button>
      </div>
    </form>
  );
}

function collectSubtree(all: Category[], rootId: string): Set<string> {
  const ids = new Set<string>([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of all) {
      if (c.parentId && ids.has(c.parentId) && !ids.has(c.id)) {
        ids.add(c.id);
        changed = true;
      }
    }
  }
  return ids;
}
