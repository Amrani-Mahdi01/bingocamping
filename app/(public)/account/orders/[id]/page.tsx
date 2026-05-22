"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Mail, Phone } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Body, H1, Mono, Small } from "@/components/ui/typography";
import { OrderStatusPill } from "@/components/order/OrderStatusPill";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { api } from "@/lib/api/client";
import { formatDateTime, formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import { mailHref, telHref } from "@/lib/site-contact";
import { useSiteContact } from "@/lib/site-contact-context";
import { cn } from "@/lib/utils";
import type { Order } from "@/lib/types";

export default function AccountOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const contact = useSiteContact();
  const [order, setOrder] = React.useState<Order | null | undefined>(undefined);

  React.useEffect(() => {
    let cancelled = false;
    api.orders.get(params.id).then((o) => {
      if (!cancelled) setOrder(o);
    });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (order === undefined) {
    return (
      <p className="rounded-lg bg-parchment px-4 py-12 text-center text-sm text-muted-foreground">
        Chargement de la commande…
      </p>
    );
  }
  if (!order) notFound();

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <H1 className="mt-2 text-2xl">{order.orderNumber}</H1>
          <Small>Passée le {formatDateTime(order.createdAt)}</Small>
        </div>
        <OrderStatusPill status={order.status} className="px-3 py-1 text-xs" />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Suivi</Mono>
            <h2 className="mt-1 font-display text-lg font-semibold">
              Étapes de la commande
            </h2>
            <div className="mt-5">
              <OrderTimeline
                current={order.status}
                history={order.statusHistory}
              />
            </div>
          </div>

          <div className="rounded-lg bg-cream p-5 shadow-md">
            <Mono className="text-wood-600">Articles</Mono>
            <h2 className="mt-1 font-display text-lg font-semibold">
              {order.lines.length} produit{order.lines.length > 1 ? "s" : ""}
            </h2>
            <ul className="mt-4 space-y-3">
              {order.lines.map((l) => (
                <li
                  key={l.productId + (l.variant ?? "")}
                  className="flex items-center gap-3 border-b border-wood-600/10 pb-3 last:border-0 last:pb-0"
                >
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-parchment">
                    <Image
                      src={l.image || "/api/placeholder/120/120"}
                      alt={l.productName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm text-ink">
                      {l.productName}
                    </p>
                    {l.variant ? <Small>{l.variant}</Small> : null}
                    <Small>SKU {l.sku}</Small>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm tabular-nums">
                      {formatDZD(l.total)}
                    </p>
                    <Small>
                      {l.quantity} × {formatDZD(l.unitPrice)}
                    </Small>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-5 border-t border-wood-600/15 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Sous-total</dt>
                <dd className="font-mono tabular-nums">
                  {formatDZD(order.subtotal)}
                </dd>
              </div>
              <div className="mt-1 flex justify-between">
                <dt className="text-muted-foreground">Livraison</dt>
                <dd className="font-mono tabular-nums">
                  {formatDZD(order.shippingFee)}
                </dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-wood-600/10 pt-2">
                <dt className="font-display text-base font-semibold">Total</dt>
                <dd className="font-display text-lg font-semibold tabular-nums">
                  {formatDZD(order.total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg bg-parchment p-4">
            <Mono className="text-wood-600">Adresse de livraison</Mono>
            <p className="mt-2 font-display text-sm font-semibold text-ink">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.shipping.address}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.shipping.commune}, {order.shipping.wilayaName}
            </p>
            <p className="mt-2 font-mono text-xs text-wood-700">
              {order.customer.phone}
            </p>
            {order.shipping.notes ? (
              <p className="mt-2 rounded bg-cream px-2 py-1 text-2xs text-muted-foreground">
                Note livreur : {order.shipping.notes}
              </p>
            ) : null}
          </div>

          <div className="rounded-lg bg-parchment p-4">
            <Mono className="text-wood-600">Support</Mono>
            <p className="mt-2 text-xs text-muted-foreground">
              Une question sur votre commande ?
            </p>
            <ul className="mt-3 space-y-2 text-xs">
              {contact.phone ? (
                <li className="flex items-center gap-2">
                  <Phone className="size-3.5 text-wood-700" />
                  <a
                    href={telHref(contact.phone)}
                    dir="ltr"
                    className="hover:text-forest-700"
                  >
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact.email ? (
                <li className="flex items-center gap-2">
                  <Mail className="size-3.5 text-wood-700" />
                  <a
                    href={mailHref(contact.email)}
                    dir="ltr"
                    className="hover:text-forest-700"
                  >
                    {contact.email}
                  </a>
                </li>
              ) : null}
            </ul>
            <Link
              href={routes.contact}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3 w-full"
              )}
            >
              Nous écrire
            </Link>
          </div>

          {order.status === "pending" || order.status === "confirmed" ? (
            <button
              type="button"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full border-ember/40 text-ember hover:bg-ember/5"
              )}
              onClick={() => {
                // Cancellation lands in Phase 8 (admin only); user-facing for
                // now is a no-op with a toast on the contact page.
                window.location.href = routes.contact;
              }}
            >
              Annuler la commande
            </button>
          ) : null}
        </aside>
      </div>

      <Body className="text-xs text-muted-foreground">
        <Link href={routes.account.orders} className="hover:text-forest-700">
          ← Retour à mes commandes
        </Link>
      </Body>
    </section>
  );
}
