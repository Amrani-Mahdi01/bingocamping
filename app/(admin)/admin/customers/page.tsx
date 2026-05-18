"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Download, Search } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mono, Small } from "@/components/ui/typography";
import { api } from "@/lib/api/client";
import { wilayas, getWilayaById } from "@/lib/mock/wilayas";
import { formatDate, formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Customer, CustomerListParams } from "@/lib/types";

const PAGE_SIZE = 25;

export default function AdminCustomersPage() {
  const [list, setList] = React.useState<Customer[] | null>(null);
  const [search, setSearch] = React.useState("");
  const [wilayaId, setWilayaId] = React.useState("all");
  const [sort, setSort] =
    React.useState<NonNullable<CustomerListParams["sort"]>>("recent");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    api.customers
      .list({
        search: search || undefined,
        wilayaId: wilayaId === "all" ? undefined : wilayaId,
        sort,
        limit: 100,
      })
      .then((res) => setList(res.items));
  }, [search, wilayaId, sort]);

  const visible = list?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];
  const totalPages = Math.max(1, Math.ceil((list?.length ?? 0) / PAGE_SIZE));
  // Active = last order within 90 days. We snapshot the "now" reference
  // once on mount; refreshing the page picks up a fresh threshold.
  const [nowRef] = React.useState(() => Date.now());
  const isActive = (c: Customer) =>
    c.lastOrderDate ? nowRef - +new Date(c.lastOrderDate) < 90 * 86_400_000 : false;

  return (
    <>
      <AdminPageHeader
        eyebrow="CRM"
        title="Clients"
        subtitle={
          list === null
            ? "Chargement…"
            : `${list.length} client${list.length > 1 ? "s" : ""}`
        }
        actions={
          <button
            type="button"
            onClick={() => toast.info("Export en cours…")}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Download className="size-3.5" /> Exporter
          </button>
        }
      />

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
            placeholder="Nom, email, téléphone…"
            className="h-9 bg-cream pl-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Mono className="text-wood-700">Wilaya</Mono>
          <Select
            value={wilayaId}
            onValueChange={(v) => v && setWilayaId(v)}
          >
            <SelectTrigger className="h-9 w-[180px] bg-cream text-xs">
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
        <div className="flex items-center gap-1.5">
          <Mono className="text-wood-700">Tri</Mono>
          <Select
            value={sort}
            onValueChange={(v) =>
              v && setSort(v as NonNullable<CustomerListParams["sort"]>)
            }
          >
            <SelectTrigger className="h-9 w-[180px] bg-cream text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="top_spender">Plus dépensé</SelectItem>
              <SelectItem value="most_orders">Plus de commandes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-wood-600/15 bg-cream">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-parchment text-left text-2xs font-mono uppercase tracking-wide text-wood-700">
              <th className="px-3 py-2.5">Client</th>
              <th className="px-3 py-2.5">Email</th>
              <th className="px-3 py-2.5">Téléphone</th>
              <th className="px-3 py-2.5">Wilaya</th>
              <th className="px-3 py-2.5">Commandes</th>
              <th className="px-3 py-2.5">Total dépensé</th>
              <th className="px-3 py-2.5">Dernière</th>
              <th className="px-3 py-2.5">Statut</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => {
              const active = isActive(c);
              const w = getWilayaById(c.wilayaId);
              return (
                <tr
                  key={c.id}
                  className="border-t border-wood-600/10 hover:bg-parchment/40"
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8 shrink-0 border border-wood-600/20">
                        <AvatarFallback className="bg-wood-600 text-cream text-2xs">
                          {c.firstName[0]}
                          {c.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={routes.admin.customer(c.id)}
                        className="font-display text-sm font-semibold hover:text-forest-700"
                      >
                        {c.firstName} {c.lastName}
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {c.email}
                  </td>
                  <td className="px-3 py-2.5 font-mono">{c.phone}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {w?.name ?? c.wilayaId}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums">
                    {c.orderCount}
                  </td>
                  <td className="px-3 py-2.5 font-mono tabular-nums">
                    {formatDZD(c.totalSpent)}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {c.lastOrderDate ? formatDate(c.lastOrderDate) : "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium",
                        active
                          ? "bg-forest-100 text-forest-800"
                          : "bg-zinc-100 text-zinc-700"
                      )}
                    >
                      {active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Link
                      href={routes.admin.customer(c.id)}
                      aria-label={`Voir ${c.firstName} ${c.lastName}`}
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

      {list && list.length > 0 ? (
        <div className="mt-4 flex items-center justify-between">
          <Small>
            Page {page} sur {totalPages}
          </Small>
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
    </>
  );
}
