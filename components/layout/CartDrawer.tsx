"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { Mono } from "@/components/ui/typography";
import { selectItemCount, selectSubtotal, useCart } from "@/lib/stores/cart";
import { formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  /** The element that opens the drawer (the cart icon in the header). */
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const [open, setOpen] = React.useState(false);

  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const totalCount = useCart(selectItemCount);
  const updateQty = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  // Hydration guard so SSR markup matches client.
  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  const visibleItems = hydrated ? items : [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={children as React.ReactElement<unknown>} />
      <SheetContent
        side="right"
        className="flex w-full max-w-md flex-col gap-0 bg-cream p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-wood-600/15 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Mono className="text-wood-600">Votre sélection</Mono>
              <SheetTitle className="mt-1 font-display text-lg text-ink">
                Panier
                {hydrated && totalCount > 0 ? (
                  <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
                    {totalCount} article{totalCount > 1 ? "s" : ""}
                  </span>
                ) : null}
              </SheetTitle>
            </div>
          </div>
          <SheetDescription className="sr-only">
            Aperçu rapide de votre panier.
          </SheetDescription>
        </SheetHeader>

        {/* Items */}
        {visibleItems.length === 0 ? (
          <EmptyCart onContinue={() => setOpen(false)} />
        ) : (
          <ul className="flex-1 divide-y divide-wood-600/10 overflow-y-auto">
            {visibleItems.map((it) => (
              <li
                key={`${it.productId}-${it.variant ?? ""}`}
                className="flex gap-3 px-5 py-4"
              >
                <Link
                  href={routes.product(it.slug)}
                  onClick={() => setOpen(false)}
                  className="relative size-20 shrink-0 overflow-hidden rounded-md bg-parchment"
                >
                  <Image
                    src={it.image || "/api/placeholder/200/200"}
                    alt={it.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={routes.product(it.slug)}
                    onClick={() => setOpen(false)}
                    className="line-clamp-2 font-display text-sm font-semibold text-ink hover:text-forest-700"
                  >
                    {it.name}
                  </Link>
                  {it.variant ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {it.variant}
                    </p>
                  ) : null}
                  <p className="mt-1 font-mono text-xs text-wood-700">
                    {formatDZD(it.price)} l&apos;unité
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <QuantityStepper
                      value={it.quantity}
                      onChange={(q) =>
                        updateQty(it.productId, it.variant, q)
                      }
                      size="sm"
                    />
                    <p className="font-display text-sm font-semibold tabular-nums text-ink">
                      {formatDZD(it.price * it.quantity)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Retirer ${it.name}`}
                  onClick={() => {
                    removeItem(it.productId, it.variant);
                    toast.success("Article retiré du panier");
                  }}
                  className="self-start text-wood-600 hover:text-ember"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        {visibleItems.length > 0 ? (
          <div className="border-t border-wood-600/15 bg-parchment px-5 py-4">
            <dl className="space-y-1.5 text-sm">
              <div className="flex items-baseline justify-between">
                <dt className="text-muted-foreground">Sous-total</dt>
                <dd className="font-mono tabular-nums text-ink">
                  {formatDZD(subtotal)}
                </dd>
              </div>
              <p className="text-2xs text-muted-foreground">
                Frais de livraison calculés à l&apos;étape suivante.
              </p>
            </dl>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={routes.checkout}
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "w-full"
                )}
              >
                Passer commande
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={routes.cart}
                onClick={() => setOpen(false)}
                className="text-center text-xs font-medium text-wood-700 underline-offset-4 hover:text-forest-700 hover:underline"
              >
                Voir le panier complet
              </Link>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function EmptyCart({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-12 text-center">
      <ShoppingBag
        className="size-12 text-wood-400"
        strokeWidth={1.2}
        aria-hidden="true"
      />
      <p className="mt-4 font-display text-base font-semibold text-ink">
        Votre panier est vide
      </p>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Ajoutez quelques produits pour les retrouver ici.
      </p>
      <Link
        href={routes.catalog}
        onClick={onContinue}
        className={cn(
          buttonVariants({ variant: "primary", size: "default" }),
          "mt-6"
        )}
      >
        Découvrir le catalogue
      </Link>
    </div>
  );
}
