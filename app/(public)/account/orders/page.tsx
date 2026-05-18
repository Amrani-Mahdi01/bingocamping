"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, Search } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Body, H1, Mono, Small } from "@/components/ui/typography";
import { OrderStatusPill } from "@/components/order/OrderStatusPill";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/stores/auth";
import { routes } from "@/lib/routes";
import { formatDate, formatDZD } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_TABS: Array<{ label: string; status?: OrderStatus }> = [
  { label: "Toutes" },
  { label: "En attente", status: "pending" },
  { label: "Confirmées", status: "confirmed" },
  { label: "Livrées", status: "delivered" },
  { label: "Annulées", status: "cancelled" },
];

export default function AccountOrdersPage() {
  const user = useAuth((s) => s.user);
  const [orders, setOrders] = React.useState<Order[] | null>(null);
  const [activeStatus, setActiveStatus] = React.useState<OrderStatus | undefined>();
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    api.orders.list({ customerId: user.id, limit: 100 }).then((res) => {
      if (!cancelled) setOrders(res.items);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const filtered = React.useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      if (activeStatus && o.status !== activeStatus) return false;
      if (
        search.trim() &&
        !o.orderNumber.toLowerCase().includes(search.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [orders, activeStatus, search]);

  return (
    <section>
      <H1 className="mt-2 text-2xl">Mes commandes</H1>
      <Body className="mt-2 text-muted-foreground">
        Historique complet et statut en temps réel.
      </Body>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ul className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => {
            const isActive = t.status === activeStatus;
            return (
              <li key={t.label}>
                <button
                  type="button"
                  onClick={() => setActiveStatus(t.status)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium",
                    isActive
                      ? "bg-forest-700 text-cream"
                      : "border border-wood-600/20 bg-cream text-ink/80 hover:bg-wood-100"
                  )}
                >
                  {t.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-wood-600" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Numéro de commande…"
            className="h-9 bg-cream pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6">
        {orders === null ? (
          <p className="rounded-lg bg-parchment px-4 py-12 text-center text-sm text-muted-foreground">
            Chargement de vos commandes…
          </p>
        ) : filtered.length === 0 ? (
          <EmptyState hasOrders={(orders.length ?? 0) > 0} />
        ) : (
          <div className="overflow-hidden rounded-lg border border-wood-600/15 bg-cream">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-parchment text-left text-2xs font-mono uppercase tracking-wide text-wood-700">
                  <th className="px-4 py-3">Numéro</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Articles</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-wood-600/10 hover:bg-parchment/50"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link
                        href={routes.account.order(o.orderNumber)}
                        className="text-ink hover:text-forest-700"
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ItemStack lines={o.lines.slice(0, 3)} />
                        <Small>
                          {o.lines.length} article{o.lines.length > 1 ? "s" : ""}
                        </Small>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {formatDZD(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusPill status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={routes.account.order(o.orderNumber)}
                        aria-label={`Détail de la commande ${o.orderNumber}`}
                        className="inline-flex size-8 items-center justify-center rounded-md text-wood-700 hover:bg-wood-100"
                      >
                        <ArrowRight className="size-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function ItemStack({ lines }: { lines: Order["lines"] }) {
  return (
    <ul className="flex -space-x-2">
      {lines.map((l, i) => (
        <li
          key={l.productId + (l.variant ?? "")}
          className="relative size-8 overflow-hidden rounded-full border-2 border-cream bg-parchment"
          style={{ zIndex: lines.length - i }}
        >
          <Image
            src={l.image || "/api/placeholder/80/80"}
            alt={l.productName}
            fill
            sizes="32px"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ hasOrders }: { hasOrders: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-parchment px-6 py-16 text-center">
      <Package className="size-16 text-wood-400" strokeWidth={1.2} />
      <H1 as="p" className="mt-4 text-xl">
        {hasOrders
          ? "Aucune commande ne correspond"
          : "Vous n'avez pas encore passé de commande"}
      </H1>
      <Body className="mt-2 max-w-md text-muted-foreground">
        {hasOrders
          ? "Essayez de modifier vos filtres ou parcourez la liste complète."
          : "Découvrez notre sélection et passez votre première commande."}
      </Body>
      <Link
        href={routes.catalog}
        className={cn(buttonVariants({ variant: "primary" }), "mt-6")}
      >
        Découvrir le catalogue
      </Link>
    </div>
  );
}
