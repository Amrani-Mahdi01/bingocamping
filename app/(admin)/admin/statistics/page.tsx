"use client";

import * as React from "react";
import {
  Download,
  FileSpreadsheet,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  OrdersBarChart,
  RevenueAreaChart,
} from "@/components/admin/DashboardCharts";
import { StatCard } from "@/components/admin/StatCard";
import {
  CategoryPieChart,
  Funnel,
  HorizontalBars,
} from "@/components/admin/StatsCharts";
import { AlgeriaGeoGrid } from "@/components/admin/AlgeriaGeoGrid";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import { formatDZD, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  DashboardStats,
  Product,
  WilayaRevenue,
} from "@/lib/types";

const PRESETS = [
  { label: "7 jours", days: 7 },
  { label: "30 jours", days: 30 },
  { label: "90 jours", days: 90 },
  { label: "1 an", days: 365 },
];

const TABS = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "products", label: "Produits" },
  { id: "orders", label: "Commandes" },
  { id: "customers", label: "Clients" },
  { id: "geo", label: "Géographie" },
] as const;

const CATEGORY_PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function StatisticsPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [byWilaya, setByWilaya] = React.useState<WilayaRevenue[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [preset, setPreset] = React.useState(30);
  const [tab, setTab] = React.useState<TabId>("overview");

  React.useEffect(() => {
    Promise.all([
      api.stats.dashboard(),
      api.stats.revenueByWilaya(),
      api.products.list({ limit: 200 }),
    ]).then(([s, w, p]) => {
      setStats(s);
      setByWilaya(w);
      setProducts(p.items);
    });
  }, []);

  if (!stats) {
    return (
      <p className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-12 text-center text-sm text-zinc-500">
        Chargement…
      </p>
    );
  }

  const totalOrders = stats.recentOrders.length + stats.ordersPending;
  const avgBasket = totalOrders
    ? stats.revenueMonth / Math.max(1, totalOrders)
    : 0;

  return (
    <>
      <AdminPageHeader
        eyebrow="Reporting"
        title="Statistiques"
        subtitle="Analyse commerciale sur la période sélectionnée."
        actions={
          <>
            <div className="inline-flex h-9 overflow-hidden rounded-md border border-zinc-200 bg-white">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPreset(p.days)}
                  className={cn(
                    "px-3 text-xs font-medium transition-colors",
                    preset === p.days
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => toast.info("Export PDF — backend à venir")}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Download className="size-3.5" /> PDF
            </button>
            <button
              type="button"
              onClick={() => toast.info("Export Excel — backend à venir")}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <FileSpreadsheet className="size-3.5" /> Excel
            </button>
          </>
        }
      />

      {/* Underline tabs */}
      <div className="mb-6 border-b border-zinc-200">
        <ul className="-mb-px flex flex-wrap gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center border-b-2 px-4 py-2.5 text-xs font-medium transition-colors",
                  tab === t.id
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
                )}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab — Overview */}
      {tab === "overview" ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="CA total"
              value={formatDZDCompact(stats.revenueMonth)}
              change={stats.revenueDayChange}
              subtitle="Sur la période"
              icon={TrendingUp}
            />
            <StatCard
              label="Commandes"
              value={String(totalOrders)}
              subtitle="Toutes statuts"
              icon={ShoppingCart}
            />
            <StatCard
              label="Panier moyen"
              value={formatDZDCompact(avgBasket)}
              subtitle="Par commande"
              icon={ShoppingBag}
            />
            <StatCard
              label="Taux de conversion"
              value={formatPercent(stats.confirmationRate, 1)}
              subtitle="Pending → confirmées"
              icon={Users}
            />
          </div>

          <SectionCard title="Évolution du CA" meta="Tendance sur la période">
            <RevenueAreaChart data={stats.revenueLast7} />
          </SectionCard>

          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard
              title="Entonnoir de conversion"
              meta="Visiteurs → livrés"
            >
              <Funnel steps={buildFunnelSteps(stats)} />
            </SectionCard>
            <SectionCard
              title="Produits les plus rentables"
              meta="Top 5 par CA"
            >
              <HorizontalBars
                data={topRevenueProducts(products)}
                formatValue={(v) => formatDZD(v)}
              />
            </SectionCard>
          </div>
        </div>
      ) : null}

      {/* Tab — Products */}
      {tab === "products" ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
            <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-900">
                Performance produit
              </h2>
              <span className="text-xs text-zinc-500">Top 20 par CA</span>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-[11px] uppercase tracking-wide text-zinc-500">
                    <th className="px-4 py-2.5 font-medium">Produit</th>
                    <th className="px-4 py-2.5 font-medium text-right">Vues</th>
                    <th className="px-4 py-2.5 font-medium text-right">Ventes</th>
                    <th className="px-4 py-2.5 font-medium text-right">CA</th>
                    <th className="px-4 py-2.5 font-medium text-right">Conv.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products
                    .slice()
                    .sort(
                      (a, b) => b.soldCount * b.price - a.soldCount * a.price
                    )
                    .slice(0, 20)
                    .map((p) => {
                      const conv =
                        p.viewCount === 0
                          ? 0
                          : (p.soldCount / p.viewCount) * 100;
                      return (
                        <tr
                          key={p.id}
                          className="transition-colors hover:bg-zinc-50/60"
                        >
                          <td className="px-4 py-2.5 text-zinc-900">
                            <span className="line-clamp-1">{p.name}</span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono tabular-nums text-zinc-500">
                            {p.viewCount}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono tabular-nums text-zinc-700">
                            {p.soldCount}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono font-medium tabular-nums text-zinc-900">
                            {formatDZD(p.soldCount * p.price)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono tabular-nums text-zinc-500">
                            {conv.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
          <SectionCard
            title="CA par catégorie"
            meta="Répartition"
          >
            <CategoryPieChart data={revenueByCategory(products)} />
            <ul className="mt-4 space-y-2 text-xs">
              {revenueByCategory(products)
                .slice(0, 6)
                .map((c, i) => (
                  <li key={c.name} className="flex items-center gap-2">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: CATEGORY_PALETTE[i % 6],
                      }}
                    />
                    <span className="flex-1 truncate text-zinc-700">
                      {c.name}
                    </span>
                    <span className="font-mono tabular-nums font-medium text-zinc-900">
                      {formatDZDCompact(c.value)}
                    </span>
                  </li>
                ))}
            </ul>
          </SectionCard>
        </div>
      ) : null}

      {/* Tab — Orders */}
      {tab === "orders" ? (
        <div className="space-y-5">
          <SectionCard title="Volume de commandes" meta="14 derniers jours">
            <OrdersBarChart data={stats.ordersLast14} />
          </SectionCard>
          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard title="Répartition par statut" meta="Pipeline">
              <Funnel
                steps={[
                  { label: "Reçues", value: 60 },
                  { label: "Confirmées", value: 48 },
                  { label: "Livrées", value: 38 },
                  { label: "Retournées", value: 2 },
                ]}
              />
            </SectionCard>
            <SectionCard title="Temps moyens de transition" meta="Performance">
              <dl className="divide-y divide-zinc-100">
                {[
                  ["Pending → Confirmée", "12 h"],
                  ["Confirmée → Expédiée", "1,8 j"],
                  ["Expédiée → Livrée", "2,4 j"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between py-2.5"
                  >
                    <dt className="text-xs text-zinc-600">{k}</dt>
                    <dd className="text-base font-semibold tabular-nums tracking-tight text-zinc-900">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </SectionCard>
          </div>
        </div>
      ) : null}

      {/* Tab — Customers */}
      {tab === "customers" ? (
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard
              title="Inscriptions"
              meta="Nouveaux clients sur 7 jours"
            >
              <OrdersBarChart
                data={stats.ordersLast14.slice(-7).map((d) => ({
                  date: d.date,
                  orders: Math.max(1, Math.round(d.orders * 0.6)),
                }))}
              />
            </SectionCard>
            <SectionCard
              title="Clients à plus forte valeur"
              meta="Top 10 LTV"
            >
              <ul className="divide-y divide-zinc-100">
                {Array.from({ length: 10 }, (_, i) => ({
                  name: `Client #${i + 1}`,
                  value: 38000 - i * 2400,
                })).map((d, i) => (
                  <li
                    key={d.name}
                    className="flex items-center gap-3 py-2.5 text-xs"
                  >
                    <span className="w-5 shrink-0 text-center font-mono text-2xs text-zinc-400">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-zinc-700">{d.name}</span>
                    <span className="font-mono tabular-nums font-medium text-zinc-900">
                      {formatDZD(d.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
          <SectionCard
            title="Rétention simplifiée"
            meta="Nouveaux vs récurrents"
          >
            <HorizontalBars
              data={[
                { label: "Nouveaux clients", value: 64 },
                { label: "Récurrents", value: 36 },
                { label: "Mono-commande", value: 28 },
                { label: "Multi-commandes (2+)", value: 72 },
              ]}
              formatValue={(v) => `${v} %`}
              max={100}
            />
          </SectionCard>
        </div>
      ) : null}

      {/* Tab — Geography */}
      {tab === "geo" ? (
        <div className="space-y-5">
          <AlgeriaGeoGrid data={byWilaya} />
          <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
            <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-900">
                Performance par wilaya
              </h2>
              <span className="text-xs text-zinc-500">
                {byWilaya.filter((w) => w.revenue > 0).length} actives
              </span>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-[11px] uppercase tracking-wide text-zinc-500">
                    <th className="px-4 py-2.5 font-medium">Code</th>
                    <th className="px-4 py-2.5 font-medium">Wilaya</th>
                    <th className="px-4 py-2.5 font-medium">Région</th>
                    <th className="px-4 py-2.5 font-medium text-right">Cmds</th>
                    <th className="px-4 py-2.5 font-medium text-right">CA</th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      Panier
                    </th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      Livraison
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {byWilaya
                    .slice()
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((w) => (
                      <tr
                        key={w.wilayaCode}
                        className="transition-colors hover:bg-zinc-50/60"
                      >
                        <td className="px-4 py-2.5 font-mono text-zinc-500">
                          {w.wilayaCode}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-zinc-900">
                          {w.wilayaName}
                        </td>
                        <td className="px-4 py-2.5 text-zinc-500">
                          {w.region}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono tabular-nums text-zinc-700">
                          {w.orderCount}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono font-medium tabular-nums text-zinc-900">
                          {formatDZD(w.revenue)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono tabular-nums text-zinc-500">
                          {formatDZD(w.averageBasket)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono tabular-nums text-zinc-500">
                          {formatPercent(w.deliveryRate, 0)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* Tight, dashboard-style card with a single-line header row. */
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

/* Compact DZD formatter — 1 992 450 → "1,99M DZD", 249 056 → "249k DZD".
   Keeps KPI cards aligned even when values get wide. */
function formatDZDCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2).replace(".", ",")} M DZD`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${Math.round(value / 1_000)} k DZD`;
  }
  return formatDZD(value);
}

function buildFunnelSteps(stats: DashboardStats) {
  const orders = stats.recentOrders.length + stats.ordersPending;
  return [
    { label: "Visiteurs", value: orders * 28 },
    { label: "Vues produit", value: orders * 12 },
    { label: "Ajouts panier", value: orders * 3 },
    { label: "Commandes", value: orders },
    { label: "Livrées", value: Math.round(orders * stats.deliveryRate) },
  ];
}

function topRevenueProducts(products: Product[]) {
  return products
    .slice()
    .sort((a, b) => b.soldCount * b.price - a.soldCount * a.price)
    .slice(0, 5)
    .map((p) => ({ label: p.name, value: p.soldCount * p.price }));
}

function revenueByCategory(products: Product[]) {
  const map = new Map<string, number>();
  products.forEach((p) => {
    map.set(
      p.category.name,
      (map.get(p.category.name) ?? 0) + p.soldCount * p.price
    );
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
