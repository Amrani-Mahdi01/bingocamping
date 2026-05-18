"use client";

import * as React from "react";
import { CheckCircle2, RotateCw, Search, Truck } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AlgeriaGeoGrid } from "@/components/admin/AlgeriaGeoGrid";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Mono, Small } from "@/components/ui/typography";
import { wilayas as initial } from "@/lib/mock/wilayas";
import { cn } from "@/lib/utils";
import type { Wilaya, WilayaRevenue } from "@/lib/types";

interface RowState extends Wilaya {
  active: boolean;
}

export default function ShippingPage() {
  const [rows, setRows] = React.useState<RowState[]>(
    initial.map((w) => ({ ...w, active: true }))
  );
  const [search, setSearch] = React.useState("");
  const [bulkSelected, setBulkSelected] = React.useState<Set<string>>(new Set());
  const [bulkPrice, setBulkPrice] = React.useState("");

  const filtered = React.useMemo(
    () =>
      rows.filter((w) =>
        search.trim()
          ? `${w.code} ${w.name}`.toLowerCase().includes(search.toLowerCase())
          : true
      ),
    [rows, search]
  );

  const update = (id: string, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const applyBulkPrice = () => {
    const price = Number(bulkPrice);
    if (!Number.isFinite(price) || price < 0) {
      toast.error("Prix invalide");
      return;
    }
    setRows((prev) =>
      prev.map((r) =>
        bulkSelected.has(r.id) ? { ...r, shippingPrice: price } : r
      )
    );
    toast.success(
      `${bulkSelected.size} wilaya${bulkSelected.size > 1 ? "s" : ""} mise${
        bulkSelected.size > 1 ? "s" : ""
      } à jour`
    );
    setBulkSelected(new Set());
    setBulkPrice("");
  };

  // Build a "coverage" geo grid: active wilayas = revenue=1, inactive=0.
  const coverage: WilayaRevenue[] = rows.map((w) => ({
    wilayaCode: w.code,
    wilayaName: w.name,
    region: w.region,
    revenue: w.active ? 1 : 0,
    orderCount: w.active ? 1 : 0,
    deliveryRate: 0,
    averageBasket: 0,
  }));

  return (
    <>
      <AdminPageHeader
        eyebrow="Logistique"
        title="Configuration de la livraison"
        subtitle="ZR Express et tarifs par wilaya"
      />

      {/* ZR Express card */}
      <section className="mb-6 rounded-lg bg-forest-900 p-5 text-cream">
        <div className="flex flex-wrap items-center gap-4">
          <Truck className="size-7 text-wood-300" />
          <div className="flex-1">
            <Mono className="text-cream/70">Partenaire</Mono>
            <h2 className="mt-1 font-display text-md font-semibold">
              ZR Express — notre transporteur exclusif
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-3 py-1 text-2xs">
            <span className="size-1.5 rounded-full bg-forest-300" />
            Connecté
          </span>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <Mono className="text-cream/70">Clé API</Mono>
            <div className="mt-2 flex items-center gap-2">
              <Input
                value="••••••••••••••••"
                readOnly
                className="border-cream/20 bg-forest-950 text-cream"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toast.info("Édition de clé — backend à venir")}
                className="border-cream/30 bg-transparent text-cream hover:bg-forest-800 hover:text-cream hover:border-cream/50"
              >
                Éditer
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.success("Connexion OK")}
              className="flex-1 border-cream/30 bg-transparent text-cream hover:bg-forest-800 hover:text-cream hover:border-cream/50"
            >
              <CheckCircle2 className="size-3.5" />
              Tester la connexion
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.success("Statuts synchronisés")}
              className="flex-1 border-cream/30 bg-transparent text-cream hover:bg-forest-800 hover:text-cream hover:border-cream/50"
            >
              <RotateCw className="size-3.5" />
              Synchroniser les statuts
            </Button>
          </div>
        </div>
      </section>

      {/* Wilaya pricing */}
      <section className="rounded-lg bg-parchment p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <Mono className="text-wood-600">Tarifs</Mono>
            <h2 className="font-display text-lg font-semibold">
              Prix et délais par wilaya
            </h2>
            <Small>
              Éditez les valeurs en ligne. Les modifications sont enregistrées
              automatiquement.
            </Small>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-wood-600" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une wilaya…"
              className="h-9 bg-cream pl-9 text-xs"
            />
          </div>
        </div>

        {bulkSelected.size > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md bg-forest-900 px-4 py-2 text-cream">
            <span className="text-xs">
              <strong>{bulkSelected.size}</strong> sélectionnée
              {bulkSelected.size > 1 ? "s" : ""} — appliquer un prix commun :
            </span>
            <Input
              type="number"
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value)}
              placeholder="800"
              className="h-8 max-w-[140px] bg-cream font-mono text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={applyBulkPrice}
              className="border-cream/30 bg-transparent text-cream hover:bg-forest-800 hover:text-cream hover:border-cream/50"
            >
              Appliquer
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkSelected(new Set());
                setBulkPrice("");
              }}
              className="border-cream/30 bg-transparent text-cream hover:bg-forest-800 hover:text-cream hover:border-cream/50"
            >
              Annuler
            </Button>
          </div>
        ) : null}

        <div className="mt-4 max-h-[600px] overflow-y-auto rounded-md border border-wood-600/15 bg-cream">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10 bg-parchment">
              <tr className="text-left text-2xs font-mono uppercase tracking-wide text-wood-700">
                <th className="px-3 py-2.5">
                  <Checkbox
                    checked={
                      filtered.length > 0 &&
                      filtered.every((r) => bulkSelected.has(r.id))
                    }
                    onCheckedChange={(v) => {
                      setBulkSelected((prev) => {
                        const next = new Set(prev);
                        if (v) filtered.forEach((r) => next.add(r.id));
                        else filtered.forEach((r) => next.delete(r.id));
                        return next;
                      });
                    }}
                    aria-label="Tout sélectionner"
                  />
                </th>
                <th className="px-3 py-2.5">Code</th>
                <th className="px-3 py-2.5">Nom</th>
                <th className="px-3 py-2.5">Région</th>
                <th className="px-3 py-2.5 w-32">Frais (DZD)</th>
                <th className="px-3 py-2.5 w-24">Délai (j)</th>
                <th className="px-3 py-2.5 w-20">Actif</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className={cn(
                    "border-t border-wood-600/10",
                    bulkSelected.has(r.id) && "bg-wood-100",
                    !r.active && "opacity-50"
                  )}
                >
                  <td className="px-3 py-1.5">
                    <Checkbox
                      checked={bulkSelected.has(r.id)}
                      onCheckedChange={(v) => {
                        setBulkSelected((prev) => {
                          const next = new Set(prev);
                          if (v) next.add(r.id);
                          else next.delete(r.id);
                          return next;
                        });
                      }}
                      aria-label={`Sélectionner ${r.name}`}
                    />
                  </td>
                  <td className="px-3 py-1.5 font-mono">{r.code}</td>
                  <td className="px-3 py-1.5">{r.name}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">
                    {r.region}
                  </td>
                  <td className="px-3 py-1.5">
                    <Input
                      type="number"
                      value={r.shippingPrice}
                      onChange={(e) =>
                        update(r.id, {
                          shippingPrice: Number(e.target.value) || 0,
                        })
                      }
                      onBlur={() => toast.success(`${r.name} — tarif enregistré`)}
                      className="h-7 max-w-[100px] font-mono text-xs"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <Input
                      type="number"
                      value={r.deliveryDays}
                      onChange={(e) =>
                        update(r.id, {
                          deliveryDays: Number(e.target.value) || 0,
                        })
                      }
                      onBlur={() => toast.success(`${r.name} — délai enregistré`)}
                      className="h-7 max-w-[70px] font-mono text-xs"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <Checkbox
                      checked={r.active}
                      onCheckedChange={(v) =>
                        update(r.id, { active: v === true })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6">
        <AlgeriaGeoGrid data={coverage} />
      </div>
    </>
  );
}
