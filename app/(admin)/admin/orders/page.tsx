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
import { OrderStatusPill } from "@/components/order/OrderStatusPill";
import { api } from "@/lib/api/client";
import { wilayas } from "@/lib/mock/wilayas";
import { formatDZD } from "@/lib/format";
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

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "preparing", label: "Préparation" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
  { value: "returned", label: "Retournée" },
];

const DAYS_SHOWN = 7;
const MAX_PER_DAY = 50;

export default function AdminOrdersPage() {
  const [all, setAll] = React.useState<Order[] | null>(null);
  const [status, setStatus] = React.useState<OrderStatus | undefined>();
  const [wilayaId, setWilayaId] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    api.orders.list({ limit: 500 }).then((res) => setAll(res.items));
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
      return true;
    });
  }, [all, status, wilayaId, search]);

  // Group by calendar day, sorted by day desc.
  const dayGroups = React.useMemo(() => {
    if (!filtered) return null;
    const map = new Map<string, Order[]>();
    filtered.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    });
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .slice(0, DAYS_SHOWN)
      .map(([day, items]) => ({
        day,
        items: items
          .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
          .slice(0, MAX_PER_DAY),
      }));
  }, [filtered]);

  const handleStatusChange = async (orderId: string, next: OrderStatus) => {
    try {
      const updated = await api.orders.updateStatus(orderId, next);
      setAll((prev) =>
        prev ? prev.map((o) => (o.id === updated.id ? updated : o)) : prev
      );
      toast.success(
        `${updated.orderNumber} → ${STATUS_OPTIONS.find(
          (s) => s.value === next
        )?.label ?? next}`
      );
    } catch {
      toast.error("Impossible de mettre à jour le statut");
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Commerce"
        title="Commandes"
        subtitle={
          all === null
            ? "Chargement…"
            : `${all.length} commande${all.length > 1 ? "s" : ""} · groupées par jour`
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

      {/* Status tabs */}
      <div className="mb-4 border-b border-zinc-200">
        <ul className="-mb-px flex flex-wrap gap-1 overflow-x-auto">
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
                  onClick={() => setStatus(t.status)}
                  className={cn(
                    "inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors",
                    isActive
                      ? "border-zinc-900 text-zinc-900"
                      : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-2xs font-medium tabular-nums",
                      isActive
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-600"
                    )}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="N° commande, téléphone, nom…"
            className="h-10 border-zinc-200 bg-white pl-9 text-xs"
          />
        </div>
        <Select value={wilayaId} onValueChange={(v) => v && setWilayaId(v)}>
          <SelectTrigger className="h-10 w-[200px] border-zinc-200 bg-white text-xs">
            <SelectValue placeholder="Wilaya" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les wilayas</SelectItem>
            {wilayas.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.code} — {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-2.5 text-blue-900">
          <span className="text-xs font-medium">
            {selected.size} commande{selected.size > 1 ? "s" : ""} sélectionnée
            {selected.size > 1 ? "s" : ""}
          </span>
          <div className="ml-auto flex gap-1.5">
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
                className="h-7 border-blue-300 bg-white text-xs text-blue-900 hover:bg-blue-100"
              >
                {a}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Day-grouped tables */}
      {dayGroups === null ? (
        <p className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-12 text-center text-sm text-zinc-500">
          Chargement…
        </p>
      ) : dayGroups.length === 0 ? (
        <p className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-12 text-center text-sm text-zinc-500">
          Aucune commande ne correspond aux filtres.
        </p>
      ) : (
        <div className="space-y-5">
          {dayGroups.map((group) => (
            <DayTable
              key={group.day}
              day={group.day}
              orders={group.items}
              selected={selected}
              setSelected={setSelected}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </>
  );
}

function DayTable({
  day,
  orders,
  selected,
  setSelected,
  onStatusChange,
}: {
  day: string;
  orders: Order[];
  selected: Set<string>;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
  onStatusChange: (id: string, next: OrderStatus) => Promise<void>;
}) {
  const dayDate = new Date(`${day}T00:00:00`);
  const dayLabel = formatDayLabel(dayDate);
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const allChecked =
    orders.length > 0 && orders.every((o) => selected.has(o.id));
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allChecked) orders.forEach((o) => next.delete(o.id));
      else orders.forEach((o) => next.add(o.id));
      return next;
    });
  };

  return (
    <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
      {/* Day header */}
      <header className="flex flex-wrap items-center gap-3 border-b border-zinc-200 bg-zinc-50/60 px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-zinc-900">{dayLabel}</h2>
          <p className="font-mono text-2xs text-zinc-500">
            {dayDate.toLocaleDateString("fr-DZ", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs">
          <span className="text-zinc-500">
            <span className="font-mono font-medium text-zinc-900">
              {orders.length}
            </span>{" "}
            commande{orders.length > 1 ? "s" : ""}
          </span>
          {pendingCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-2xs font-medium text-amber-700">
              <span className="size-1.5 rounded-full bg-amber-500" />
              {pendingCount} à traiter
            </span>
          ) : null}
          <span className="font-mono tabular-nums font-medium text-zinc-900">
            {formatDZD(totalRevenue)}
          </span>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-[11px] uppercase tracking-wide text-zinc-500">
              <th className="w-10 px-4 py-2.5 font-medium">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={toggleAll}
                  aria-label="Tout sélectionner pour ce jour"
                />
              </th>
              <th className="px-4 py-2.5 font-medium">N°</th>
              <th className="px-4 py-2.5 font-medium">Heure</th>
              <th className="px-4 py-2.5 font-medium">Client</th>
              <th className="px-4 py-2.5 font-medium">Wilaya</th>
              <th className="px-4 py-2.5 font-medium">Articles</th>
              <th className="px-4 py-2.5 font-medium text-right">Total</th>
              <th className="px-4 py-2.5 font-medium">Appels</th>
              <th className="px-4 py-2.5 font-medium">Statut</th>
              <th className="w-10 px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {orders.map((o) => {
              const isChecked = selected.has(o.id);
              const isPending = o.status === "pending";
              return (
                <tr
                  key={o.id}
                  className={cn(
                    "transition-colors",
                    isPending
                      ? "bg-amber-50/40 hover:bg-amber-50/70"
                      : isChecked
                        ? "bg-blue-50/50"
                        : "hover:bg-zinc-50/60"
                  )}
                >
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 font-mono">
                    <Link
                      href={routes.admin.order(o.orderNumber)}
                      className="font-medium text-zinc-900 hover:text-blue-600"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono tabular-nums text-zinc-500">
                    {new Date(o.createdAt).toLocaleTimeString("fr-DZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">
                      {o.customer.firstName} {o.customer.lastName}
                    </p>
                    <span className="block font-mono text-2xs text-zinc-500">
                      {o.customer.phone}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                    {o.shipping.wilayaName}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {o.lines[0] ? (
                        <span className="relative size-7 shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-50">
                          <Image
                            src={o.lines[0].image || "/api/placeholder/60/60"}
                            alt=""
                            fill
                            sizes="28px"
                            className="object-cover"
                          />
                        </span>
                      ) : null}
                      <span className="font-mono tabular-nums text-zinc-700">
                        {o.lines.length}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-medium tabular-nums text-zinc-900">
                    {formatDZD(o.total)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex h-5 min-w-5 items-center justify-center rounded px-1.5 font-mono text-2xs",
                        o.callAttempts.length === 0
                          ? "text-zinc-400"
                          : o.callAttempts.length < 3
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      )}
                    >
                      {o.callAttempts.length}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <InlineStatusSelect
                      status={o.status}
                      onChange={(next) => onStatusChange(o.id, next)}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={routes.admin.order(o.orderNumber)}
                      aria-label={`Détail ${o.orderNumber}`}
                      className="inline-flex size-7 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
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
    </section>
  );
}

/** Status pill that opens a dropdown to change the order's status. */
function InlineStatusSelect({
  status,
  onChange,
}: {
  status: OrderStatus;
  onChange: (next: OrderStatus) => void | Promise<void>;
}) {
  return (
    <Select value={status} onValueChange={(v) => onChange(v as OrderStatus)}>
      <SelectTrigger
        aria-label="Changer le statut"
        className="h-auto w-auto border-0 bg-transparent p-0 shadow-none hover:opacity-80 focus:ring-0 focus-visible:ring-0 [&>svg]:hidden"
      >
        <OrderStatusPill status={status} />
      </SelectTrigger>
      <SelectContent align="end">
        {STATUS_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            <span className="inline-flex items-center gap-2">
              <OrderStatusPill status={opt.value} className="text-[10px]" />
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const RELATIVE_LABELS: Record<number, string> = {
  0: "Aujourd'hui",
  1: "Hier",
};

function formatDayLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((+today - +target) / 86_400_000);
  if (RELATIVE_LABELS[diff]) return RELATIVE_LABELS[diff]!;
  return date.toLocaleDateString("fr-DZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
