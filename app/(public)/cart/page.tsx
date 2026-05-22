"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Body, H1, Mono, Small } from "@/components/ui/typography";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { useCart, selectSubtotal } from "@/lib/stores/cart";
import { formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/LanguageProvider";

export default function CartPage() {
  const t = useT();
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart(selectSubtotal);

  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return null;
  }
  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.home}>{t("nav.home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("cart.title")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 mb-8">
        <Mono className="text-wood-600">{t("cart.eyebrow")}</Mono>
        <H1 className="mt-2">
          {t("cart.title")} ({items.length}{" "}
          {items.length > 1 ? t("cart.articles_other") : t("cart.articles_one")})
        </H1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Lines */}
        <div className="space-y-1">
          <ul className="overflow-hidden rounded-lg bg-parchment">
            {items.map((it, i) => (
              <li
                key={`${it.productId}-${it.variant ?? ""}`}
                className={cn(
                  "flex flex-wrap items-center gap-4 px-4 py-4 sm:px-6",
                  i > 0 && "border-t border-wood-600/10"
                )}
              >
                <Link
                  href={routes.product(it.slug)}
                  className="relative size-20 shrink-0 overflow-hidden rounded-md bg-cream"
                >
                  <Image
                    src={it.image || "/api/placeholder/200/200"}
                    alt={it.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={routes.product(it.slug)}
                    className="line-clamp-2 font-display text-sm font-semibold text-ink hover:text-forest-700"
                  >
                    {it.name}
                  </Link>
                  {it.variant ? (
                    <Small className="mt-0.5 block">{it.variant}</Small>
                  ) : null}
                  <p className="mt-2 font-mono text-xs text-wood-700">
                    {formatDZD(it.price)} {t("cart.eachUnit")}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <QuantityStepper
                    value={it.quantity}
                    onChange={(q) => updateQty(it.productId, it.variant, q)}
                    size="sm"
                  />
                  <p className="w-24 text-right font-display text-md font-semibold tabular-nums text-ink">
                    {formatDZD(it.price * it.quantity)}
                  </p>
                  <button
                    type="button"
                    aria-label={`${t("cart.removeAriaPrefix")} ${it.name}`}
                    onClick={() => {
                      removeItem(it.productId, it.variant);
                      toast.success(t("cart.removed"));
                    }}
                    className="inline-flex size-8 items-center justify-center rounded-md text-wood-700 hover:bg-wood-100"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href={routes.catalog}
            className="mt-4 inline-block text-sm font-medium text-wood-700 hover:text-forest-700"
          >
            {t("cart.continueShopping")}
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg bg-cream p-5 shadow-md">
            <h2 className="font-display text-lg font-semibold text-ink">
              {t("cart.summary")}
            </h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-baseline justify-between">
                <dt className="text-muted-foreground">{t("cart.subtotal")}</dt>
                <dd className="font-mono tabular-nums text-ink">
                  {formatDZD(subtotal)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-muted-foreground">
                  {t("cart.shippingLabel")}
                </dt>
                <dd className="text-xs text-muted-foreground">
                  {t("cart.shippingCalculatedLater")}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-wood-600/15 pt-3">
                <dt className="font-display text-base font-semibold text-ink">
                  {t("cart.total")}
                </dt>
                <dd className="font-display text-lg font-semibold tabular-nums text-ink">
                  {formatDZD(subtotal)}
                </dd>
              </div>
            </dl>

            <Link
              href={routes.checkout}
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "mt-5 w-full"
              )}
            >
              {t("cart.checkout")}
            </Link>

            <ul className="mt-5 grid grid-cols-3 gap-2 text-center text-2xs text-muted-foreground">
              <li className="flex flex-col items-center gap-1">
                <CreditCard className="size-4 text-wood-600" />
                <span>{t("cart.trust.cod")}</span>
              </li>
              <li className="flex flex-col items-center gap-1">
                <Truck className="size-4 text-wood-600" />
                <span>{t("cart.trust.shipping")}</span>
              </li>
              <li className="flex flex-col items-center gap-1">
                <ShieldCheck className="size-4 text-wood-600" />
                <span>{t("cart.trust.guarantee")}</span>
              </li>
            </ul>

            <div className="mt-5 border-t border-wood-600/10 pt-4">
              <label
                htmlFor="cart-promo"
                className="font-mono text-2xs uppercase tracking-wide text-wood-700"
              >
                {t("cart.promoCode")}
              </label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="cart-promo"
                  placeholder={t("cart.promoCodePlaceholder")}
                  className="h-9 bg-cream"
                />
                <button
                  type="button"
                  onClick={() => toast.info(t("cart.promoComingSoon"))}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  {t("cart.applyPromo")}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function EmptyState() {
  const t = useT();
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <ShoppingBag className="size-16 text-wood-400" strokeWidth={1.2} />
      <H1 className="mt-4 text-xl">{t("cart.emptyTitle")}</H1>
      <Body className="mt-2 max-w-md text-muted-foreground">
        {t("cart.emptyLead")}
      </Body>
      <Link
        href={routes.catalog}
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-6")}
      >
        {t("cart.discoverProducts")}
      </Link>
    </div>
  );
}
