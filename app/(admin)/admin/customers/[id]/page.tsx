"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Mail, MapPin, Phone, ShoppingBag, Wallet } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Mono, Small } from "@/components/ui/typography";
import { OrderStatusPill } from "@/components/order/OrderStatusPill";
import { api } from "@/lib/api/client";
import { getWilayaById } from "@/lib/mock/wilayas";
import { formatDate, formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Customer, Order } from "@/lib/types";

export default function AdminCustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = React.useState<Customer | null | undefined>(
    undefined
  );
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [tags, setTags] = React.useState<string[]>(["VIP"]);
  const [newTag, setNewTag] = React.useState("");
  const [internalNote, setInternalNote] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    api.customers.get(params.id).then(async (c) => {
      if (cancelled) return;
      setCustomer(c);
      if (c) {
        const res = await api.orders.list({ customerId: c.id, limit: 100 });
        if (!cancelled) setOrders(res.items);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (customer === undefined) {
    return (
      <p className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-12 text-center text-sm text-zinc-500">
        Chargement…
      </p>
    );
  }
  if (!customer) notFound();

  const wilaya = getWilayaById(customer.wilayaId);
  const averageBasket =
    customer.orderCount > 0 ? customer.totalSpent / customer.orderCount : 0;

  return (
    <>
      <AdminPageHeader
        eyebrow="CRM"
        title={`${customer.firstName} ${customer.lastName}`}
        subtitle={`Inscrit le ${formatDate(customer.createdAt)}`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* Header card */}
          <section className="rounded-md border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border border-zinc-200">
                <AvatarFallback className="bg-zinc-700 text-zinc-100 text-lg">
                  {customer.firstName[0]}
                  {customer.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-lg font-semibold text-zinc-900">
                  {customer.firstName} {customer.lastName}
                </p>
                <ul className="mt-1 grid gap-y-1 text-xs text-zinc-500 sm:grid-cols-2">
                  <li className="flex items-center gap-1.5">
                    <Mail className="size-3.5 text-zinc-700" />
                    {customer.email}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-zinc-700" />
                    {customer.phone}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-zinc-700" />
                    {wilaya?.name ?? customer.wilayaId}
                  </li>
                </ul>
              </div>
            </div>

            {/* Stat tiles */}
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              <li className="rounded-md border border-zinc-200 bg-white p-3 text-center">
                <ShoppingBag className="mx-auto size-4 text-zinc-700" />
                <p className="mt-2 font-sans text-xl tabular-nums">
                  {customer.orderCount}
                </p>
                <Mono className="text-zinc-500">Commandes</Mono>
              </li>
              <li className="rounded-md border border-zinc-200 bg-white p-3 text-center">
                <Wallet className="mx-auto size-4 text-zinc-700" />
                <p className="mt-2 font-sans text-xl tabular-nums">
                  {formatDZD(customer.totalSpent)}
                </p>
                <Mono className="text-zinc-500">Total dépensé</Mono>
              </li>
              <li className="rounded-md border border-zinc-200 bg-white p-3 text-center">
                <Wallet className="mx-auto size-4 text-zinc-700" />
                <p className="mt-2 font-sans text-xl tabular-nums">
                  {formatDZD(averageBasket)}
                </p>
                <Mono className="text-zinc-500">Panier moyen</Mono>
              </li>
            </ul>
          </section>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="rounded-md border border-zinc-200 bg-white p-5">
            <TabsList>
              <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
              <TabsTrigger value="orders">
                Commandes ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="addresses">
                Adresses ({customer.addresses.length})
              </TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-5">
              <h2 className="font-sans text-md font-semibold">
                Dernières commandes
              </h2>
              <ul className="mt-3 space-y-2">
                {orders.slice(0, 5).map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center gap-3 rounded-md bg-zinc-50 px-3 py-2"
                  >
                    <Link
                      href={routes.admin.order(o.orderNumber)}
                      className="font-mono text-xs hover:text-zinc-900"
                    >
                      {o.orderNumber}
                    </Link>
                    <Small className="ml-auto">{formatDate(o.createdAt)}</Small>
                    <p className="w-24 text-right font-mono text-sm tabular-nums">
                      {formatDZD(o.total)}
                    </p>
                    <OrderStatusPill status={o.status} />
                  </li>
                ))}
                {orders.length === 0 ? (
                  <Small>Aucune commande encore.</Small>
                ) : null}
              </ul>
            </TabsContent>

            <TabsContent value="orders" className="mt-5">
              <ul className="space-y-2">
                {orders.map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center gap-3 rounded-md bg-zinc-50 px-3 py-2"
                  >
                    <Link
                      href={routes.admin.order(o.orderNumber)}
                      className="font-mono text-xs hover:text-zinc-900"
                    >
                      {o.orderNumber}
                    </Link>
                    <Small className="ml-auto">{formatDate(o.createdAt)}</Small>
                    <p className="w-24 text-right font-mono text-sm tabular-nums">
                      {formatDZD(o.total)}
                    </p>
                    <OrderStatusPill status={o.status} />
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="addresses" className="mt-5">
              {customer.addresses.length === 0 ? (
                <Small>Aucune adresse enregistrée.</Small>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {customer.addresses.map((a) => (
                    <li key={a.id} className="rounded-md bg-zinc-50 p-3">
                      <Mono className="text-zinc-500">{a.label}</Mono>
                      {a.isDefault ? (
                        <Mono className="ml-2 inline-flex rounded-full bg-zinc-900 px-1.5 py-0.5 text-zinc-100">
                          Par défaut
                        </Mono>
                      ) : null}
                      <p className="mt-2 text-sm text-zinc-900">
                        {a.firstName} {a.lastName}
                      </p>
                      <p className="text-xs text-zinc-500">{a.street}</p>
                      <p className="text-xs text-zinc-500">
                        {a.commune},{" "}
                        {getWilayaById(a.wilayaId)?.name ?? a.wilayaId}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="activity" className="mt-5">
              <ul className="space-y-2 text-xs">
                {orders.slice(0, 12).map((o) => (
                  <li
                    key={`act-${o.id}`}
                    className="flex items-baseline gap-3 border-b border-zinc-200 pb-2 last:border-0 last:pb-0"
                  >
                    <Small className="w-32 shrink-0 font-mono">
                      {formatDate(o.createdAt)}
                    </Small>
                    <p className="flex-1 text-zinc-900">
                      Commande{" "}
                      <Link
                        href={routes.admin.order(o.orderNumber)}
                        className="font-mono hover:text-zinc-900"
                      >
                        {o.orderNumber}
                      </Link>
                      — statut <strong>{o.status}</strong>
                    </p>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side panel */}
        <aside className="space-y-4">
          <section className="rounded-md border border-zinc-200 bg-white p-5">
            <Mono className="text-zinc-500">Tags</Mono>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-1 text-2xs"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((x) => x !== t))}
                    aria-label={`Retirer ${t}`}
                    className="text-zinc-700 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nouveau tag"
                  className="h-8 w-32 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!newTag.trim()) return;
                    setTags([...tags, newTag.trim()]);
                    setNewTag("");
                  }}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-zinc-200 bg-white p-5">
            <Mono className="text-zinc-500">Notes internes</Mono>
            <Label htmlFor="cust-note" className="sr-only">
              Notes
            </Label>
            <Textarea
              id="cust-note"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              rows={4}
              placeholder="VIP, sensible aux délais, etc."
              className="mt-3"
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => toast.success("Note enregistrée")}
              disabled={!internalNote.trim()}
              className="mt-3 w-full"
            >
              Enregistrer
            </Button>
          </section>

          <section className="rounded-md border border-zinc-200 bg-white p-5">
            <Mono className="text-zinc-500">Actions</Mono>
            <div className="mt-3 space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toast.info("Envoyer un email — backend à venir")}
                className={cn("w-full")}
              >
                <Mail className="size-3.5" /> Envoyer un email
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toast.info("Bloquer le client — backend à venir")}
                className={cn("w-full")}
              >
                Bloquer le client
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
