"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mono, Small } from "@/components/ui/typography";
import { banners as initial } from "@/lib/mock/banners";
import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/types";

export default function BannersPage() {
  const [list, setList] = React.useState<Banner[]>(initial);
  const [editing, setEditing] = React.useState<Banner | null>(null);

  const reorder = (id: string, direction: -1 | 1) => {
    const sorted = [...list].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
    const idx = sorted.findIndex((b) => b.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx]!;
    const b = sorted[swapIdx]!;
    setList((prev) =>
      prev.map((banner) => {
        if (banner.id === a.id) return { ...banner, displayOrder: b.displayOrder };
        if (banner.id === b.id) return { ...banner, displayOrder: a.displayOrder };
        return banner;
      })
    );
    toast.success("Ordre mis à jour");
  };

  const toggleActive = (id: string) => {
    setList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const remove = (id: string) => {
    if (!confirm("Supprimer cette bannière ?")) return;
    setList((prev) => prev.filter((b) => b.id !== id));
    toast.success("Bannière supprimée");
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Marketing"
        title="Bannières de la page d'accueil"
        actions={
          <BannerEditorTrigger
            onSubmit={(b) => {
              setList((prev) => [...prev, b]);
              toast.success("Bannière créée");
            }}
          />
        }
      />

      <ul className="space-y-3">
        {list
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((b) => (
            <li
              key={b.id}
              className="flex flex-wrap items-center gap-4 rounded-lg bg-parchment p-4"
            >
              <span className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md bg-cream">
                <Image
                  src={b.image}
                  alt={b.title ?? ""}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <Mono className="text-wood-600">Ordre {b.displayOrder}</Mono>
                <h3 className="font-display text-md font-semibold text-ink line-clamp-1">
                  {b.title}
                </h3>
                <Small className="line-clamp-1">{b.subtitle}</Small>
                {b.link ? (
                  <p className="mt-0.5 font-mono text-2xs text-wood-700 line-clamp-1">
                    {b.link}
                  </p>
                ) : null}
              </div>
              <label className="flex items-center gap-2 text-xs">
                <Checkbox
                  checked={b.isActive}
                  onCheckedChange={() => toggleActive(b.id)}
                />
                <span>Actif</span>
              </label>
              <div className="flex items-center gap-1">
                <IconBtn label="Monter" onClick={() => reorder(b.id, -1)}>
                  <ArrowUp className="size-3.5" />
                </IconBtn>
                <IconBtn label="Descendre" onClick={() => reorder(b.id, 1)}>
                  <ArrowDown className="size-3.5" />
                </IconBtn>
                <BannerEditorTrigger
                  banner={b}
                  onSubmit={(updated) => {
                    setList((prev) =>
                      prev.map((x) => (x.id === updated.id ? updated : x))
                    );
                    toast.success("Bannière mise à jour");
                  }}
                  triggerEl={
                    <button
                      type="button"
                      aria-label="Éditer"
                      className="inline-flex size-7 items-center justify-center rounded text-wood-700 hover:bg-wood-100"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  }
                />
                <IconBtn
                  label="Supprimer"
                  onClick={() => remove(b.id)}
                  destructive
                >
                  <Trash2 className="size-3.5" />
                </IconBtn>
              </div>
            </li>
          ))}
      </ul>
      {/* Force unused-state reference for ESLint when no edits happen */}
      <span className="sr-only">{editing?.id}</span>
    </>
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
        "inline-flex size-7 items-center justify-center rounded text-wood-700 hover:bg-wood-100",
        destructive && "hover:bg-ember/10 hover:text-ember"
      )}
    >
      {children}
    </button>
  );
}

function BannerEditorTrigger({
  banner,
  triggerEl,
  onSubmit,
}: {
  banner?: Banner;
  triggerEl?: React.ReactNode;
  onSubmit: (banner: Banner) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(banner?.title ?? "");
  const [subtitle, setSubtitle] = React.useState(banner?.subtitle ?? "");
  const [cta, setCta] = React.useState(banner?.ctaLabel ?? "");
  const [link, setLink] = React.useState(banner?.link ?? "");

  const isEdit = !!banner;

  const trigger = triggerEl ?? (
    <button
      type="button"
      className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
    >
      <Plus className="size-3.5" /> Ajouter une bannière
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Éditer la bannière" : "Nouvelle bannière"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="b-title">Titre</Label>
            <Input
              id="b-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-subtitle">Sous-titre</Label>
            <Textarea
              id="b-subtitle"
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="b-cta">Libellé CTA</Label>
              <Input
                id="b-cta"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-link">Lien</Label>
              <Input
                id="b-link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/catalog?sort=new"
              />
            </div>
          </div>
          <div className="rounded-md border-2 border-dashed border-wood-600/30 bg-cream p-6 text-center">
            <Small>Téléverser une image — backend à venir</Small>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              const next: Banner = {
                id: banner?.id ?? `banner-${Date.now()}`,
                image: banner?.image ?? "/api/placeholder/1600/640/Nouvelle-bannire",
                title,
                subtitle,
                ctaLabel: cta,
                link,
                isActive: banner?.isActive ?? true,
                displayOrder: banner?.displayOrder ?? Date.now(),
              };
              onSubmit(next);
              setOpen(false);
            }}
          >
            {isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
