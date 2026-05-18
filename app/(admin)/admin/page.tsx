import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  RotateCcw,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  OrdersBarChart,
  RevenueAreaChart,
  Sparkline,
} from "@/components/admin/DashboardCharts";
import { StatCard } from "@/components/admin/StatCard";
import { OrderStatusPill } from "@/components/order/OrderStatusPill";
import { Mono, Small } from "@/components/ui/typography";
import { api } from "@/lib/api/client";
import { formatDZD, formatPercent } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const ALERT_ICONS: Record<string, LucideIcon> = {
  TriangleAlert,
  Clock,
  RotateCcw,
};

export default async function AdminDashboardPage() {
  const stats = await api.stats.dashboard();
  const ordersTotal30 = stats.revenueLast7.length; // sanity-check placeholder

  return (
    <>
      <AdminPageHeader
        eyebrow="Vue d'ensemble"
        title="Tableau de bord"
        subtitle="Activité commerciale et alertes opérationnelles."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="CA aujourd'hui"
          value={formatDZD(stats.revenueDay)}
          change={stats.revenueDayChange}
          subtitle="vs hier"
          icon={TrendingUp}
        >
          <Sparkline data={stats.revenueLast7.map((p) => p.revenue)} />
        </StatCard>
        <StatCard
          label="Commandes en attente"
          value={String(stats.ordersPending)}
          subtitle={
            stats.ordersPending > 0
              ? `${stats.ordersPending} commande${
                  stats.ordersPending > 1 ? "s nécessitent" : " nécessite"
                } votre attention`
              : "Aucune action requise"
          }
          icon={ShoppingCart}
        />
        <StatCard
          label="Taux de confirmation"
          value={formatPercent(stats.confirmationRate, 1)}
          subtitle="Sur les 30 derniers jours"
          icon={ShoppingBag}
        />
        <StatCard
          label="Taux de livraison"
          value={formatPercent(stats.deliveryRate, 1)}
          subtitle="Confirmées → livrées"
          icon={ShoppingBag}
        />
      </div>

      {/* Charts + side panel */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Évolution</Mono>
            <h2 className="mt-1 font-display text-lg font-semibold">
              Chiffre d&apos;affaires — 7 derniers jours
            </h2>
            <RevenueAreaChart data={stats.revenueLast7} className="mt-4" />
          </div>
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Activité</Mono>
            <h2 className="mt-1 font-display text-lg font-semibold">
              Commandes — 14 derniers jours
            </h2>
            <OrdersBarChart data={stats.ordersLast14} className="mt-4" />
          </div>
        </div>

        <div className="space-y-4">
          {/* Recent orders */}
          <section className="rounded-lg bg-cream shadow-sm">
            <header className="border-b border-wood-600/10 px-5 py-3">
              <Mono className="text-wood-600">Commandes récentes</Mono>
              <h3 className="mt-1 font-display text-sm font-semibold">
                Les 8 dernières
              </h3>
            </header>
            <ul>
              {stats.recentOrders.slice(0, 8).map((o, i) => (
                <li
                  key={o.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-2.5",
                    i > 0 && "border-t border-wood-600/10"
                  )}
                >
                  <Link
                    href={routes.admin.order(o.orderNumber)}
                    className="min-w-0 flex-1 hover:text-forest-700"
                  >
                    <p className="font-mono text-2xs text-ink">
                      {o.orderNumber}
                    </p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {o.customer.firstName} {o.customer.lastName}
                    </p>
                  </Link>
                  <p className="font-mono text-xs tabular-nums">
                    {formatDZD(o.total)}
                  </p>
                  <OrderStatusPill status={o.status} className="shrink-0" />
                </li>
              ))}
            </ul>
            <Link
              href={routes.admin.orders}
              className="flex items-center justify-center gap-1 border-t border-wood-600/10 py-2 text-xs font-medium text-wood-700 hover:bg-parchment hover:text-forest-700"
            >
              Voir toutes les commandes
              <ArrowRight className="size-3" />
            </Link>
          </section>

          {/* Top products */}
          <section className="rounded-lg bg-cream shadow-sm">
            <header className="border-b border-wood-600/10 px-5 py-3">
              <Mono className="text-wood-600">Top produits</Mono>
              <h3 className="mt-1 font-display text-sm font-semibold">
                Top 5 par unités vendues
              </h3>
            </header>
            <ul>
              {stats.topProducts.map((p, i) => (
                <li
                  key={p.productId}
                  className={cn(
                    "flex items-center gap-3 px-5 py-2.5",
                    i > 0 && "border-t border-wood-600/10"
                  )}
                >
                  <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-parchment">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : null}
                  </span>
                  <Link
                    href={routes.product(p.slug)}
                    className="min-w-0 flex-1 line-clamp-2 text-xs hover:text-forest-700"
                  >
                    {p.name}
                  </Link>
                  <p className="shrink-0 font-mono text-2xs text-wood-700">
                    {p.unitsSold} u.
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Alerts */}
          <section className="rounded-lg bg-cream shadow-sm">
            <header className="border-b border-wood-600/10 px-5 py-3">
              <Mono className="text-wood-600">Alertes</Mono>
              <h3 className="mt-1 font-display text-sm font-semibold">
                À traiter rapidement
              </h3>
            </header>
            {stats.alerts.length === 0 ? (
              <p className="px-5 py-4 text-xs text-muted-foreground">
                Aucune alerte. Tout va bien.
              </p>
            ) : (
              <ul>
                {stats.alerts.map((a, i) => {
                  const Icon = ALERT_ICONS[a.icon] ?? TriangleAlert;
                  return (
                    <li
                      key={a.id}
                      className={cn(
                        "flex items-start gap-3 px-5 py-3",
                        i > 0 && "border-t border-wood-600/10"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full",
                          a.severity === "danger" && "bg-ember/10 text-ember",
                          a.severity === "warning" && "bg-wood-100 text-wood-800",
                          a.severity === "info" && "bg-forest-100 text-forest-700"
                        )}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <p className="text-xs text-ink">{a.message}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Reference unused symbol so prettier doesn't strip the import */}
          <Small className="sr-only">{ordersTotal30} pts</Small>
        </div>
      </div>
    </>
  );
}
