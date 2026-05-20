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
import { Small } from "@/components/ui/typography";
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

      {/* Filter bar — borderless single row */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Nom, email, téléphone…"
            className="h-9 border-zinc-200 bg-white pl-9 text-xs"
          />
        </div>
        <Select value={wilayaId} onValueChange={(v) => v && setWilayaId(v)}>
          <SelectTrigger className="h-9 w-[200px] border-zinc-200 bg-white text-xs">
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
        <Select
          value={sort}
          onValueChange={(v) =>
            v && setSort(v as NonNullable<CustomerListParams["sort"]>)
          }
        >
          <SelectTrigger className="h-9 w-[180px] border-zinc-200 bg-white text-xs">
            <SelectValue placeholder="Tri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="top_spender">Plus dépensé</SelectItem>
            <SelectItem value="most_orders">Plus de commandes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Wilaya</th>
                <th className="px-4 py-3 font-medium text-right">Cmds</th>
                <th className="px-4 py-3 font-medium text-right">Total dépensé</th>
                <th className="px-4 py-3 font-medium">Dernière</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {visible.map((c) => {
                const active = isActive(c);
                const w = getWilayaById(c.wilayaId);
                return (
                  <tr key={c.id} className="transition-colors hover:bg-zinc-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 shrink-0 border border-zinc-200">
                          <AvatarFallback className="bg-zinc-100 text-2xs font-medium text-zinc-700">
                            {c.firstName[0]}
                            {c.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Link
                          href={routes.admin.customer(c.id)}
                          className="text-sm font-medium text-zinc-900 hover:text-blue-600"
                        >
                          {c.firstName} {c.lastName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-zinc-700">{c.email}</p>
                      <span className="block font-mono text-2xs text-zinc-500">
                        {c.phone}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                      {w?.name ?? c.wilayaId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums text-zinc-700">
                      {c.orderCount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-medium tabular-nums text-zinc-900">
                      {formatDZD(c.totalSpent)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                      {c.lastOrderDate ? formatDate(c.lastOrderDate) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-2xs font-medium",
                          active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-600"
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            active ? "bg-emerald-500" : "bg-zinc-400"
                          )}
                        />
                        {active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={routes.admin.customer(c.id)}
                        aria-label={`Voir ${c.firstName} ${c.lastName}`}
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
