"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  Copy,
  ExternalLink,
  Mail,
  Phone,
  Printer,
  Truck,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mono, Small } from "@/components/ui/typography";
import { OrderStatusPill } from "@/components/order/OrderStatusPill";
import { api } from "@/lib/api/client";
import { formatDateTime, formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type {
  CallAttemptResult,
  Order,
  OrderStatus,
} from "@/lib/types";

// Valid forward transitions per status — admin can only pick a legal next state.
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["shipped"],
  shipped: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  returned: "Retournée",
};

const CALL_RESULT_LABEL: Record<CallAttemptResult, string> = {
  answered: "Réponse",
  no_answer: "Pas de réponse",
  wrong_number: "Mauvais numéro",
  callback_requested: "Rappel demandé",
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = React.useState<Order | null | undefined>(undefined);
  const [internalNote, setInternalNote] = React.useState("");

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
        Chargement…
      </p>
    );
  }
  if (!order) notFound();

  const allowedNext = NEXT_STATUSES[order.status];
  const failedAttempts = order.callAttempts.filter(
    (a) => a.result !== "answered"
  ).length;

  const refresh = async () => {
    const next = await api.orders.get(order.orderNumber);
    if (next) setOrder(next);
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Commande"
        title={order.orderNumber}
        subtitle={`Créée le ${formatDateTime(order.createdAt)}`}
        actions={
          <>
            <OrderStatusPill status={order.status} className="px-3 py-1.5 text-xs" />
            <button
              type="button"
              onClick={() => toast.info("Bordereau — backend à venir")}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Printer className="size-3.5" /> Bordereau
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT */}
        <div className="space-y-4">
          {/* Customer */}
          <section className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Client</Mono>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-display text-md font-semibold text-ink">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <Link
                href="#"
                className="text-xs text-wood-700 underline-offset-4 hover:underline"
              >
                Historique client →
              </Link>
            </div>
            <ul className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 text-wood-700" />
                <a href={`tel:${order.customer.phone}`} className="hover:text-forest-700">
                  {order.customer.phone}
                </a>
              </li>
              {order.customer.email ? (
                <li className="flex items-center gap-2">
                  <Mail className="size-3.5 text-wood-700" />
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="hover:text-forest-700"
                  >
                    {order.customer.email}
                  </a>
                </li>
              ) : null}
            </ul>
          </section>

          {/* Shipping */}
          <section className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Livraison</Mono>
            <p className="mt-3 font-display text-sm font-semibold">
              {order.shipping.wilayaName} ({order.shipping.commune})
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {order.shipping.address}
            </p>
            {order.shipping.notes ? (
              <p className="mt-2 rounded bg-cream px-2 py-1 text-2xs text-muted-foreground">
                Note : {order.shipping.notes}
              </p>
            ) : null}
          </section>

          {/* Items */}
          <section className="rounded-lg bg-cream p-5 shadow-sm">
            <Mono className="text-wood-600">Articles</Mono>
            <ul className="mt-3 space-y-3">
              {order.lines.map((l) => (
                <li
                  key={l.productId + (l.variant ?? "")}
                  className="flex items-center gap-3 border-b border-wood-600/10 pb-3 last:border-0 last:pb-0"
                >
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-parchment">
                    <Image
                      src={l.image || "/api/placeholder/100/100"}
                      alt={l.productName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{l.productName}</p>
                    <Small className="block">
                      {l.variant ? `${l.variant} · ` : ""}SKU {l.sku}
                    </Small>
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
            <dl className="mt-5 space-y-2 border-t border-wood-600/15 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Sous-total</dt>
                <dd className="font-mono tabular-nums">
                  {formatDZD(order.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Livraison ({order.shipping.wilayaName})
                </dt>
                <dd className="font-mono tabular-nums">
                  {formatDZD(order.shippingFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-wood-600/10 pt-2">
                <dt className="font-display text-base font-semibold">Total</dt>
                <dd className="font-display text-lg font-semibold tabular-nums">
                  {formatDZD(order.total)}
                </dd>
              </div>
            </dl>
          </section>

          {/* Internal notes */}
          <section className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Notes internes</Mono>
            <Textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              rows={3}
              placeholder="Note visible uniquement par l'équipe administration…"
              className="mt-3 bg-cream"
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success("Note ajoutée");
                setInternalNote("");
              }}
              disabled={!internalNote.trim()}
              className="mt-3"
            >
              Ajouter une note
            </Button>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* Status changer */}
          <section className="rounded-lg bg-cream p-5 shadow-sm">
            <Mono className="text-wood-600">Changer le statut</Mono>
            <p className="mt-2 font-display text-sm font-semibold">
              Actuellement : {STATUS_LABEL[order.status]}
            </p>
            {allowedNext.length === 0 ? (
              <Small className="mt-2 block">
                Aucune transition possible — état terminal.
              </Small>
            ) : (
              <StatusChanger
                order={order}
                options={allowedNext}
                onChange={refresh}
              />
            )}
            {failedAttempts > 2 && order.status === "pending" ? (
              <div className="mt-3 flex items-start gap-2 rounded-md border border-ember/30 bg-ember/5 p-3 text-xs text-ember">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <span>
                  {failedAttempts} tentatives échouées — envisager
                  d&apos;annuler.
                </span>
              </div>
            ) : null}
          </section>

          {/* Status history */}
          <section className="rounded-lg bg-cream p-5 shadow-sm">
            <Mono className="text-wood-600">Historique de statut</Mono>
            <ul className="mt-3 space-y-3">
              {order.statusHistory.map((h, i) => (
                <li key={`${h.status}-${i}`} className="flex gap-3">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-forest-700" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs">
                      <span className="font-display font-semibold text-ink">
                        {STATUS_LABEL[h.status]}
                      </span>{" "}
                      {h.by ? (
                        <span className="text-muted-foreground">par {h.by}</span>
                      ) : null}
                    </p>
                    <Small>{formatDateTime(h.at)}</Small>
                    {h.note ? <Small className="block">{h.note}</Small> : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Call attempts */}
          <section className="rounded-lg bg-cream p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <Mono className="text-wood-600">Tentatives d&apos;appel</Mono>
              <AddCallAttemptDialog
                orderNumber={order.orderNumber}
                onAdded={refresh}
              />
            </div>
            {order.callAttempts.length === 0 ? (
              <Small className="mt-3 block">Aucune tentative pour le moment.</Small>
            ) : (
              <ul className="mt-3 space-y-2">
                {order.callAttempts.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-md bg-parchment px-3 py-2 text-xs"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-2xs font-medium",
                          a.result === "answered"
                            ? "bg-forest-100 text-forest-800"
                            : "bg-wood-100 text-wood-800"
                        )}
                      >
                        {CALL_RESULT_LABEL[a.result]}
                      </span>
                      <Small>{formatDateTime(a.date)}</Small>
                    </div>
                    {a.notes ? (
                      <p className="mt-1 text-muted-foreground">{a.notes}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ZR Express */}
          <section className="rounded-lg bg-forest-900 p-5 text-cream">
            <div className="flex items-center gap-2">
              <Truck className="size-5 text-wood-300" />
              <Mono className="text-cream/70">ZR Express</Mono>
            </div>
            {order.zrTrackingNumber ? (
              <>
                <p className="mt-3 font-mono text-sm">
                  {order.zrTrackingNumber}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(order.zrTrackingNumber!);
                      toast.success("Numéro copié");
                    }}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "border-cream/30 bg-transparent text-cream hover:bg-forest-800 hover:text-cream hover:border-cream/50"
                    )}
                  >
                    <Copy className="size-3.5" /> Copier
                  </button>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "border-cream/30 bg-transparent text-cream hover:bg-forest-800 hover:text-cream hover:border-cream/50"
                    )}
                  >
                    <ExternalLink className="size-3.5" /> Suivre
                  </a>
                </div>
              </>
            ) : order.status === "preparing" ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={async () => {
                  await api.orders.updateStatus(order.id, "shipped");
                  toast.success("Envoyé à ZR Express");
                  refresh();
                }}
                className="mt-3"
              >
                Envoyer à ZR Express
              </Button>
            ) : (
              <Small className="mt-3 block text-cream/70">
                Disponible après préparation.
              </Small>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}

function StatusChanger({
  order,
  options,
  onChange,
}: {
  order: Order;
  options: OrderStatus[];
  onChange: () => void;
}) {
  const [next, setNext] = React.useState<OrderStatus>(options[0]!);
  const [saving, setSaving] = React.useState(false);

  return (
    <div className="mt-3 space-y-3">
      <Select
        value={next}
        onValueChange={(v) => v && setNext(v as OrderStatus)}
      >
        <SelectTrigger className="bg-parchment">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="primary"
        size="sm"
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          await api.orders.updateStatus(order.id, next);
          toast.success(`Statut mis à jour : ${STATUS_LABEL[next]}`);
          onChange();
          setSaving(false);
        }}
        className="w-full"
      >
        {saving ? "Mise à jour…" : "Mettre à jour"}
      </Button>
    </div>
  );
}

function AddCallAttemptDialog({
  orderNumber,
  onAdded,
}: {
  orderNumber: string;
  onAdded: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState<CallAttemptResult>("answered");
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "ml-auto"
        )}
      >
        Ajouter
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tentative d&apos;appel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ca-result">Résultat</Label>
            <Select
              value={result}
              onValueChange={(v) => v && setResult(v as CallAttemptResult)}
            >
              <SelectTrigger id="ca-result">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.keys(CALL_RESULT_LABEL) as CallAttemptResult[]
                ).map((r) => (
                  <SelectItem key={r} value={r}>
                    {CALL_RESULT_LABEL[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ca-notes">Notes</Label>
            <Textarea
              id="ca-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Détails de l'appel…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              await api.orders.addCallAttempt(orderNumber, { result, notes });
              toast.success("Tentative enregistrée");
              setSaving(false);
              setOpen(false);
              setNotes("");
              onAdded();
            }}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
