"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Search } from "lucide-react";
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
import { OrderStatusPill } from "@/components/order/OrderStatusPill";
import { api } from "@/lib/api/client";
import { wilayas } from "@/lib/mock/wilayas";
import { formatDateTime, formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_TABS: Array<{ label: string; status?: OrderStatus }> = [
  { label: "Toutes" },
  { label: "En attente", status: "pending" },
  { label: "Confirmées", status: "confirmed" },
  { label: "En préparation", status: "preparing" },
  { label: "Expédiées", status: "shipped" },
  { label: "Livrées", status: "delivered" },
  { label: "Annulées", status: "cancelled" },
  { label: "Retournées", status: "returned" },
];

const PAGE_SIZE = 25;

export default function AdminOrdersPage() {
  const [all, setAll] = React.useState<Order[] | null>(null);
  const [status, setStatus] = React.useState<OrderStatus | undefined>();
  const [wilayaId, setWilayaId] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    api.orders.list({ limit: 100 }).then((res) => setAll(res.items));
  }, []);

  const filtered = React.useMemo(() => {
    if (!all) return null;
    return all.filter((o) => {
      if (status && o.status !== status) return false;
      if (wilayaId !== "all" && o.shipping.wilayaId !== wilayaId) return false;
      if (
        search.trim() &&
        !`${o.orderNumber} ${o.customer.phone} ${o.customer.firstName} ${o.customer.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      if (from && +new Date(o.createdAt) < +new Date(from)) return false;
      if (to && +new Date(o.createdAt) > +new Date(to) + 86_400_000) return false;
      return true;
    });
  }, [all, status, wilayaId, search, from, to]);

  const visible = filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];
  const totalPages = Math.max(1, Math.ceil((filtered?.length ?? 0) / PAGE_SIZE));

  const toggleAllVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (visible.every((o) => next.has(o.id))) {
        visible.forEach((o) => next.delete(o.id));
      } else {
        visible.forEach((o) => next.add(o.id));
      }
      return next;
    });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Commerce"
        title="Commandes"
        subtitle={
          all === null
            ? "Chargement…"
            : `${all.length} commande${all.length > 1 ? "s" : ""} au total`
        }
        actions={
          <button
            type="button"
            onClick={() => toast.info("Export CSV — backend à venir")}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Download className="size-3.5" /> Exporter CSV
          </button>
        }
      />

      {/* Status pills */}
      <ul className="mb-3 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => {
          const isActive = t.status === status;
          const count = all
            ? t.status
              ? all.filter((o) => o.status === t.status).length
              : all.length
            : 0;
          return (
            <li key={t.label}>
              <button
                type="button"
                onClick={() => {
                  setStatus(t.status);
                  setPage(1);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                  isActive
                    ? "bg-forest-700 text-cream"
                    : "border border-wood-600/20 bg-cream text-ink/80 hover:bg-wood-100"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 font-mono text-2xs",
                    isActive ? "bg-cream/20" : "bg-wood-100 text-wood-700"
                  )}
                >
                  {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Filters */}
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg bg-parchment p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-wood-600" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="N° commande, téléphone, nom…"
            className="h-9 bg-cream pl-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Mono className="text-wood-700">Du</Mono>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-9 w-[160px] bg-cream text-xs"
          />
          <Mono className="text-wood-700">au</Mono>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-9 w-[160px] bg-cream text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Mono className="text-wood-700">Wilaya</Mono>
          <Select value={wilayaId} onValueChange={(v) => v && setWilayaId(v)}>
            <SelectTrigger className="h-9 w-[200px] bg-cream text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {wilayas.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.code} — {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-md bg-forest-900 px-4 py-2 text-cream">
          <span className="text-xs">
            <strong>{selected.size}</strong> commande
            {selected.size > 1 ? "s" : ""} sélectionnée{selected.size > 1 ? "s" : ""}
          </span>
          <div className="ml-auto flex gap-2">
            {["Confirmer", "Imprimer bordereaux", "Annuler"].map((a) => (
              <Button
                key={a}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success(`${a} appliqué`);
                  setSelected(new Set());
                }}
                className="border-cream/30 bg-transparent text-cream hover:bg-forest-800 hover:text-cream hover:border-cream/50"
              >
                {a}
              </Button>
            ))}
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
                    visible.every((o) => selected.has(o.id))
                  }
                  onCheckedChange={toggleAllVisible}
                  aria-label="Tout sélectionner"
                />
              </th>
              <th className="px-3 py-2.5">N°</th>
              <th className="px-3 py-2.5">Date</th>
              <th className="px-3 py-2.5">Client</th>
              <th className="px-3 py-2.5">Wilaya</th>
              <th className="px-3 py-2.5">Articles</th>
              <th className="px-3 py-2.5">Total</th>
              <th className="px-3 py-2.5">Appels</th>
              <th className="px-3 py-2.5">Statut</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => {
              const isChecked = selected.has(o.id);
              return (
                <tr
                  key={o.id}
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
                          if (v) next.add(o.id);
                          else next.delete(o.id);
                          return next;
                        });
                      }}
                      aria-label={`Sélectionner ${o.orderNumber}`}
                    />
                  </td>
                  <td className="px-3 py-2.5 font-mono">
                    <Link
                      href={routes.admin.order(o.orderNumber)}
                      className="hover:text-forest-700"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {formatDateTime(o.createdAt)}
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="text-ink">
                      {o.customer.firstName} {o.customer.lastName}
                    </p>
                    <Small className="block font-mono">
                      {o.customer.phone}
                    </Small>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {o.shipping.wilayaName}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {o.lines[0] ? (
                        <span className="relative size-8 shrink-0 overflow-hidden rounded-md bg-parchment">
                          <Image
                            src={o.lines[0].image || "/api/placeholder/60/60"}
                            alt=""
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </span>
                      ) : null}
                      <span className="font-mono">{o.lines.length}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums">
                    {formatDZD(o.total)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center rounded-full bg-parchment px-2 py-0.5 font-mono text-2xs">
                      {o.callAttempts.length}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <OrderStatusPill status={o.status} />
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Link
                      href={routes.admin.order(o.orderNumber)}
                      aria-label={`Détail ${o.orderNumber}`}
                      className="inline-flex size-7 items-center justify-center rounded text-wood-700 hover:bg-wood-100"
                    >
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered && filtered.length > 0 ? (
        <div className="mt-4 flex items-center justify-between">
          <Body className="text-xs text-muted-foreground">
            Page {page} sur {totalPages} · {filtered.length} commande
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
          Aucune commande ne correspond aux filtres.
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
