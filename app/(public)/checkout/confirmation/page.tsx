import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Check,
  CheckCircle,
  Clock,
  Package,
  PhoneCall,
  Truck,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Body, H1, Lead, Mono, Small } from "@/components/ui/typography";
import { PineDivider } from "@/components/decorative/PineDivider";
import { CopyOrderNumber } from "@/components/checkout/CopyOrderNumber";
import { api } from "@/lib/api/client";
import { formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Confirmation de commande",
  description: "Merci pour votre commande — récapitulatif et suivi.",
};

interface SearchParams {
  orderNumber?: string;
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { orderNumber } = await searchParams;
  const order = orderNumber ? await api.orders.get(orderNumber) : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <H1>Commande introuvable</H1>
        <Body className="mt-3 text-muted-foreground">
          Nous n&apos;avons pas trouvé de commande avec ce numéro. Retournez à
          l&apos;accueil pour réessayer.
        </Body>
        <Link
          href={routes.home}
          className={cn(buttonVariants({ variant: "primary" }), "mt-6")}
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-forest-100">
          <CheckCircle className="size-9 text-forest-700" strokeWidth={1.4} />
        </span>
        <H1 className="mt-6 text-2xl sm:text-3xl">
          Merci pour votre commande !
        </H1>
        <Lead className="mt-3">
          Nous avons bien reçu votre commande. Vous recevrez un appel de
          confirmation sous 24h.
        </Lead>
        <div className="mt-4 inline-flex items-center gap-3 rounded-md border border-wood-600/20 bg-parchment px-4 py-2 font-mono text-sm">
          <span className="text-wood-700">Numéro :</span>
          <span className="text-ink">{order.orderNumber}</span>
          <CopyOrderNumber orderNumber={order.orderNumber} />
        </div>
      </div>

      <PineDivider className="my-10" />

      {/* Timeline */}
      <section aria-label="Étapes de la commande">
        <h2 className="font-display text-lg font-semibold text-ink">
          Et maintenant ?
        </h2>
        <ol className="mt-5 space-y-4">
          <TimelineStep
            state="done"
            icon={<Check className="size-4" />}
            title="Commande reçue"
            detail="Votre commande est dans notre système."
            timestamp={formatDateLight(order.createdAt)}
          />
          <TimelineStep
            state="active"
            icon={<PhoneCall className="size-4" />}
            title="Appel de confirmation"
            detail="Notre équipe vous contactera pour valider la commande."
            timestamp="Sous 24h"
          />
          <TimelineStep
            state="pending"
            icon={<Package className="size-4" />}
            title="Préparation"
            detail="Votre commande est emballée et étiquetée."
            timestamp="1-2 jours"
          />
          <TimelineStep
            state="pending"
            icon={<Truck className="size-4" />}
            title="Expédition"
            detail="ZR Express prend en charge votre colis."
            timestamp="ZR Express"
          />
          <TimelineStep
            state="pending"
            icon={<Clock className="size-4" />}
            title="Livraison"
            detail={`Vers ${order.shipping.wilayaName}, paiement à la livraison.`}
            timestamp={`Estimée ${estimateDelivery(order.shipping.wilayaId)}`}
          />
        </ol>
      </section>

      <PineDivider className="my-10" />

      {/* Order summary */}
      <section className="rounded-lg bg-parchment p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Récapitulatif
        </h2>

        <ul className="mt-4 space-y-3 border-b border-wood-600/15 pb-4">
          {order.lines.map((l) => (
            <li
              key={`${l.productId}-${l.variant ?? ""}`}
              className="flex items-center gap-3"
            >
              <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-cream">
                <Image
                  src={l.image || "/api/placeholder/100/100"}
                  alt={l.productName}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm text-ink">
                  {l.productName}
                </p>
                {l.variant ? <Small>{l.variant}</Small> : null}
                <Small>Quantité : {l.quantity}</Small>
              </div>
              <p className="font-mono text-sm tabular-nums">
                {formatDZD(l.total)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Sous-total</dt>
            <dd className="font-mono tabular-nums">{formatDZD(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Livraison</dt>
            <dd className="font-mono tabular-nums">{formatDZD(order.shippingFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-wood-600/10 pt-2">
            <dt className="font-display text-base font-semibold text-ink">Total</dt>
            <dd className="font-display text-lg font-semibold tabular-nums text-ink">
              {formatDZD(order.total)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-wood-600/15 pt-4 text-sm">
          <Mono className="text-wood-600">Adresse de livraison</Mono>
          <p className="mt-2 text-ink">
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p className="text-muted-foreground">{order.shipping.address}</p>
          <p className="text-muted-foreground">
            {order.shipping.commune}, {order.shipping.wilayaName}
          </p>
          <p className="mt-1 font-mono text-xs text-wood-700">
            {order.customer.phone}
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
        <Link
          href={routes.account.order(order.orderNumber)}
          className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
        >
          Suivre ma commande
        </Link>
        <Link
          href={routes.home}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

function TimelineStep({
  state,
  icon,
  title,
  detail,
  timestamp,
}: {
  state: "done" | "active" | "pending";
  icon: React.ReactNode;
  title: string;
  detail: string;
  timestamp: string;
}) {
  return (
    <li className="flex gap-4">
      <span
        className={cn(
          "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full",
          state === "done" && "bg-forest-700 text-cream",
          state === "active" &&
            "bg-wood-400 text-cream ring-4 ring-wood-200 animate-pulse",
          state === "pending" && "bg-parchment text-wood-600"
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-display text-sm font-semibold",
            state === "pending" ? "text-muted-foreground" : "text-ink"
          )}
        >
          {title}
        </p>
        <Small>{detail}</Small>
      </div>
      <span className="shrink-0 font-mono text-2xs text-wood-700">
        {timestamp}
      </span>
    </li>
  );
}

function formatDateLight(iso: string): string {
  return new Intl.DateTimeFormat("fr-DZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function estimateDelivery(wilayaId: string): string {
  // Mock lookup; api/wilayas/get would be ideal but keep the page sync-free.
  // The actual numbers come from the order's wilaya.
  // For confirmation copy we just say "2-5 jours" generically when missing.
  void wilayaId;
  return "2-5 jours";
}

