"use client";

import * as React from "react";
import { Download, FileSpreadsheet } from "lucide-react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Mono, Small } from "@/components/ui/typography";
import { api } from "@/lib/api/client";
import { formatDZD, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import type {
  DashboardStats,
  Product,
  WilayaRevenue,
} from "@/lib/types";

const PRESETS = [
  { label: "7j", days: 7 },
  { label: "30j", days: 30 },
  { label: "90j", days: 90 },
  { label: "1 an", days: 365 },
];

export default function StatisticsPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [byWilaya, setByWilaya] = React.useState<WilayaRevenue[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [preset, setPreset] = React.useState(30);

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
      <p className="rounded-lg bg-parchment px-4 py-12 text-center text-sm text-muted-foreground">
        Chargement…
      </p>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Reporting"
        title="Statistiques"
        actions={
          <>
            <div className="inline-flex overflow-hidden rounded-md border border-wood-600/20 bg-cream">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPreset(p.days)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium",
                    preset === p.days
                      ? "bg-forest-700 text-cream"
                      : "text-ink/80 hover:bg-wood-100"
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
          <TabsTrigger value="geo">Géographie</TabsTrigger>
        </TabsList>

        {/* Tab 1 — Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="CA total"
              value={formatDZD(stats.revenueMonth)}
              change={stats.revenueDayChange}
              subtitle="Sur la période"
              icon={TrendingUp}
            />
            <StatCard
              label="Commandes"
              value={String(
                stats.recentOrders.length + stats.ordersPending
              )}
              subtitle="Toutes statuts"
              icon={ShoppingCart}
            />
            <StatCard
              label="Panier moyen"
              value={formatDZD(
                stats.recentOrders.length
                  ? stats.revenueMonth /
                      Math.max(1, stats.recentOrders.length)
                  : 0
              )}
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

          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Évolution du CA</Mono>
            <h2 className="mt-1 font-display text-lg font-semibold">
              Tendance sur la période
            </h2>
            <RevenueAreaChart data={stats.revenueLast7} className="mt-4" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg bg-parchment p-5">
              <Mono className="text-wood-600">Entonnoir de conversion</Mono>
              <h2 className="mt-1 font-display text-lg font-semibold">
                Visiteurs → livrés
              </h2>
              <div className="mt-5">
                <Funnel
                  steps={buildFunnelSteps(stats)}
                />
              </div>
            </div>
            <div className="rounded-lg bg-parchment p-5">
              <Mono className="text-wood-600">Top 5 par CA</Mono>
              <h2 className="mt-1 font-display text-lg font-semibold">
                Produits les plus rentables
              </h2>
              <div className="mt-5">
                <HorizontalBars
                  data={topRevenueProducts(products, stats)}
                  formatValue={(v) => formatDZD(v)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2 — Products */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-lg border border-wood-600/15 bg-cream">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-parchment text-left text-2xs font-mono uppercase tracking-wide text-wood-700">
                    <th className="px-3 py-2.5">Produit</th>
                    <th className="px-3 py-2.5">Vues</th>
                    <th className="px-3 py-2.5">Ventes</th>
                    <th className="px-3 py-2.5">CA</th>
                    <th className="px-3 py-2.5">Conv.</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .slice()
                    .sort((a, b) => b.soldCount * b.price - a.soldCount * a.price)
                    .slice(0, 20)
                    .map((p) => {
                      const conv =
                        p.viewCount === 0
                          ? 0
                          : (p.soldCount / p.viewCount) * 100;
                      return (
                        <tr key={p.id} className="border-t border-wood-600/10">
                          <td className="px-3 py-2 text-ink line-clamp-1">
                            {p.name}
                          </td>
                          <td className="px-3 py-2 font-mono tabular-nums">
                            {p.viewCount}
                          </td>
                          <td className="px-3 py-2 font-mono tabular-nums">
                            {p.soldCount}
                          </td>
                          <td className="px-3 py-2 font-mono tabular-nums">
                            {formatDZD(p.soldCount * p.price)}
                          </td>
                          <td className="px-3 py-2 font-mono tabular-nums text-muted-foreground">
                            {conv.toFixed(1)} %
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="rounded-lg bg-parchment p-5">
              <Mono className="text-wood-600">Répartition</Mono>
              <h2 className="mt-1 font-display text-lg font-semibold">
                CA par catégorie
              </h2>
              <CategoryPieChart data={revenueByCategory(products)} />
              <ul className="mt-3 space-y-1 text-xs">
                {revenueByCategory(products)
                  .slice(0, 6)
                  .map((c, i) => (
                    <li key={c.name} className="flex items-center gap-2">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            ["#215728", "#803e15", "#6a9270", "#c88a58", "#477352", "#7a8b5a"][
                              i % 6
                            ],
                        }}
                      />
                      <span className="flex-1 truncate text-ink">{c.name}</span>
                      <span className="font-mono tabular-nums">
                        {formatDZD(c.value)}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3 — Orders */}
        <TabsContent value="orders" className="space-y-6">
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Commandes par jour</Mono>
            <h2 className="mt-1 font-display text-lg font-semibold">
              Volume sur 14 jours
            </h2>
            <OrdersBarChart data={stats.ordersLast14} className="mt-4" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg bg-parchment p-5">
              <Mono className="text-wood-600">Répartition</Mono>
              <h2 className="mt-1 font-display text-lg font-semibold">
                Par statut
              </h2>
              <div className="mt-5">
                <Funnel
                  steps={[
                    { label: "Reçues", value: 60 },
                    { label: "Confirmées", value: 48 },
                    { label: "Livrées", value: 38 },
                    { label: "Retournées", value: 2 },
                  ]}
                />
              </div>
            </div>
            <div className="rounded-lg bg-parchment p-5">
              <Mono className="text-wood-600">Temps moyens</Mono>
              <h2 className="mt-1 font-display text-lg font-semibold">
                Transitions
              </h2>
              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["Pending → Confirmée", "12h"],
                  ["Confirmée → Expédiée", "1.8j"],
                  ["Expédiée → Livrée", "2.4j"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between border-b border-wood-600/10 pb-2 last:border-0"
                  >
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-display text-base font-semibold tabular-nums">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4 — Customers */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg bg-parchment p-5">
              <Mono className="text-wood-600">Nouveaux clients</Mono>
              <h2 className="mt-1 font-display text-lg font-semibold">
                Inscriptions sur 7 jours
              </h2>
              <OrdersBarChart
                data={stats.ordersLast14.slice(-7).map((d) => ({
                  date: d.date,
                  orders: Math.max(1, Math.round(d.orders * 0.6)),
                }))}
                className="mt-4"
              />
            </div>
            <div className="rounded-lg bg-parchment p-5">
              <Mono className="text-wood-600">Top 10 LTV</Mono>
              <h2 className="mt-1 font-display text-lg font-semibold">
                Clients à plus forte valeur
              </h2>
              <ul className="mt-4 space-y-2 text-xs">
                {Array.from({ length: 10 }, (_, i) => ({
                  name: `Client #${i + 1}`,
                  value: 38000 - i * 2400,
                })).map((d) => (
                  <li
                    key={d.name}
                    className="flex items-center gap-3 border-b border-wood-600/10 pb-1.5 last:border-0"
                  >
                    <span className="flex-1 text-ink">{d.name}</span>
                    <span className="font-mono tabular-nums">
                      {formatDZD(d.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Rétention simplifiée</Mono>
            <h2 className="mt-1 font-display text-lg font-semibold">
              Nouveaux vs récurrents
            </h2>
            <div className="mt-5">
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
            </div>
          </div>
        </TabsContent>

        {/* Tab 5 — Geography */}
        <TabsContent value="geo" className="space-y-6">
          <AlgeriaGeoGrid data={byWilaya} />

          <div className="overflow-x-auto rounded-lg border border-wood-600/15 bg-cream">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-parchment text-left text-2xs font-mono uppercase tracking-wide text-wood-700">
                  <th className="px-3 py-2.5">Code</th>
                  <th className="px-3 py-2.5">Wilaya</th>
                  <th className="px-3 py-2.5">Région</th>
                  <th className="px-3 py-2.5">Commandes</th>
                  <th className="px-3 py-2.5">CA</th>
                  <th className="px-3 py-2.5">Panier moyen</th>
                  <th className="px-3 py-2.5">Taux livraison</th>
                </tr>
              </thead>
              <tbody>
                {byWilaya
                  .slice()
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((w) => (
                    <tr
                      key={w.wilayaCode}
                      className="border-t border-wood-600/10"
                    >
                      <td className="px-3 py-2 font-mono">{w.wilayaCode}</td>
                      <td className="px-3 py-2 text-ink">{w.wilayaName}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {w.region}
                      </td>
                      <td className="px-3 py-2 font-mono tabular-nums">
                        {w.orderCount}
                      </td>
                      <td className="px-3 py-2 font-mono tabular-nums">
                        {formatDZD(w.revenue)}
                      </td>
                      <td className="px-3 py-2 font-mono tabular-nums">
                        {formatDZD(w.averageBasket)}
                      </td>
                      <td className="px-3 py-2 font-mono tabular-nums">
                        {formatPercent(w.deliveryRate, 0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function buildFunnelSteps(stats: DashboardStats) {
  // Mock funnel — real numbers will come from analytics integration.
  const orders = stats.recentOrders.length + stats.ordersPending;
  return [
    { label: "Visiteurs", value: orders * 28 },
    { label: "Vues produit", value: orders * 12 },
    { label: "Ajouts panier", value: orders * 3 },
    { label: "Commandes", value: orders },
    { label: "Livrées", value: Math.round(orders * stats.deliveryRate) },
  ];
}

function topRevenueProducts(products: Product[], _stats: DashboardStats) {
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
