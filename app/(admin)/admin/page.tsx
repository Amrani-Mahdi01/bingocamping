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
import { Small } from "@/components/ui/typography";
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

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              ? `${stats.ordersPending} à traiter`
              : "Aucune action requise"
          }
          icon={ShoppingCart}
        />
        <StatCard
          label="Taux de confirmation"
          value={formatPercent(stats.confirmationRate, 1)}
          subtitle="30 derniers jours"
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
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <SectionCard
            title="Chiffre d'affaires"
            meta="7 derniers jours"
          >
            <RevenueAreaChart data={stats.revenueLast7} className="mt-2" />
          </SectionCard>
          <SectionCard title="Commandes" meta="14 derniers jours">
            <OrdersBarChart data={stats.ordersLast14} className="mt-2" />
          </SectionCard>
        </div>

        <div className="space-y-5">
          {/* Recent orders */}
          <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
            <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-zinc-900">
                Commandes récentes
              </h3>
              <span className="text-xs text-zinc-500">
                {Math.min(stats.recentOrders.length, 8)}
              </span>
            </header>
            <ul className="divide-y divide-zinc-100">
              {stats.recentOrders.slice(0, 8).map((o) => (
                <li
                  key={o.id}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <Link
                    href={routes.admin.order(o.orderNumber)}
                    className="min-w-0 flex-1"
                  >
                    <p className="font-mono text-xs font-medium text-zinc-900 hover:text-blue-600">
                      {o.orderNumber}
                    </p>
                    <p className="line-clamp-1 text-xs text-zinc-500">
                      {o.customer.firstName} {o.customer.lastName}
                    </p>
                  </Link>
                  <p className="font-mono text-xs tabular-nums text-zinc-700">
                    {formatDZD(o.total)}
                  </p>
                  <OrderStatusPill status={o.status} className="shrink-0" />
                </li>
              ))}
            </ul>
            <Link
              href={routes.admin.orders}
              className="flex items-center justify-center gap-1 border-t border-zinc-200 py-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              Voir toutes les commandes
              <ArrowRight className="size-3" />
            </Link>
          </section>

          {/* Top products */}
          <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
            <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-zinc-900">
                Top produits
              </h3>
              <span className="text-xs text-zinc-500">par unités vendues</span>
            </header>
            <ul className="divide-y divide-zinc-100">
              {stats.topProducts.map((p, i) => (
                <li
                  key={p.productId}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span className="w-4 shrink-0 text-center font-mono text-2xs text-zinc-400">
                    {i + 1}
                  </span>
                  <span className="relative size-9 shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-50">
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
                    className="min-w-0 flex-1 line-clamp-2 text-xs text-zinc-700 hover:text-blue-600"
                  >
                    {p.name}
                  </Link>
                  <p className="shrink-0 font-mono text-xs tabular-nums text-zinc-500">
                    {p.unitsSold}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Alerts */}
          <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
            <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-zinc-900">Alertes</h3>
              {stats.alerts.length > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-50 px-1.5 text-2xs font-medium text-red-700">
                  {stats.alerts.length}
                </span>
              ) : null}
            </header>
            {stats.alerts.length === 0 ? (
              <p className="px-4 py-4 text-xs text-zinc-500">
                Aucune alerte. Tout va bien.
              </p>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {stats.alerts.map((a) => {
                  const Icon = ALERT_ICONS[a.icon] ?? TriangleAlert;
                  return (
                    <li
                      key={a.id}
                      className="flex items-start gap-3 px-4 py-3"
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded",
                          a.severity === "danger" && "bg-red-50 text-red-600",
                          a.severity === "warning" &&
                            "bg-amber-50 text-amber-700",
                          a.severity === "info" && "bg-blue-50 text-blue-700"
                        )}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <p className="text-xs text-zinc-900">{a.message}</p>
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

/** Tight, dashboard-style card with a single-line header row. */
function SectionCard({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {meta ? <p className="text-xs text-zinc-500">{meta}</p> : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
