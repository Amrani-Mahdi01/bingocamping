"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreditCard, Zap } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mono } from "@/components/ui/typography";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { VariantSelector } from "@/components/product/VariantSelector";
import { ordersApi } from "@/lib/api/orders";
import { cn } from "@/lib/utils";
import { formatDZD } from "@/lib/format";
import { wilayas, getWilayaById } from "@/lib/mock/wilayas";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { Product } from "@/lib/types";

// Algerian local format: 10 digits starting with 05 / 06 / 07.
const PHONE_RE = /^0[567]\d{8}$/;

// Zod messages are translation keys; we resolve them at render time via t().
const schema = z.object({
  firstName: z.string().trim().min(2, "quickOrder.errors.firstNameTooShort"),
  lastName: z.string().trim().min(2, "quickOrder.errors.lastNameTooShort"),
  phone: z.string().trim().regex(PHONE_RE, "quickOrder.errors.phoneInvalid"),
  wilayaId: z.string().min(1, "quickOrder.errors.wilayaRequired"),
  commune: z.string().trim().min(2, "quickOrder.errors.communeRequired"),
});

type QuickOrderInput = z.infer<typeof schema>;

interface QuickOrderFormProps {
  product: Product;
  /** Optional controlled variant — flowed in from AddToCartPanel above. */
  variant?: string;
  onVariantChange?: (value: string) => void;
  quantity?: number;
  onQuantityChange?: (n: number) => void;
}

export function QuickOrderForm({
  product,
  variant: variantProp,
  onVariantChange,
  quantity: quantityProp,
  onQuantityChange,
}: QuickOrderFormProps) {
  const router = useRouter();
  const t = useT();
  const hasVariants = product.variants.length > 0;
  const isOOS = product.stockStatus === "out_of_stock";

  // Resolves a zod-attached error message (key) to a localized string.
  const tErr = (msg?: string) =>
    msg && msg.startsWith("quickOrder.errors.")
      ? t(msg as Parameters<typeof t>[0])
      : msg;

  const [variantInner, setVariantInner] = React.useState<string | undefined>(
    hasVariants ? product.variants[0]?.value : undefined
  );
  const [qtyInner, setQtyInner] = React.useState(1);

  const variant = variantProp !== undefined ? variantProp : variantInner;
  const setVariant = (v: string) => {
    if (onVariantChange) onVariantChange(v);
    else setVariantInner(v);
  };
  const qty = quantityProp !== undefined ? quantityProp : qtyInner;
  const setQty = (n: number) => {
    if (onQuantityChange) onQuantityChange(n);
    else setQtyInner(n);
  };

  // When the page is loaded with #quick-order in the URL (e.g. from a
  // ProductCard "Commander" click), scroll the form into view once it mounts.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#quick-order") return;
    const id = window.requestAnimationFrame(() => {
      document.getElementById("quick-order")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const form = useForm<QuickOrderInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      wilayaId: "",
      commune: "",
    },
  });

  const wilayaId = form.watch("wilayaId");
  const wilaya = wilayaId ? getWilayaById(wilayaId) : undefined;
  const shippingFee = wilaya?.shippingPrice ?? 0;
  const subtotal = product.price * qty;
  const total = subtotal + shippingFee;

  const onSubmit = form.handleSubmit(async (data) => {
    if (isOOS) return;
    try {
      const order = await ordersApi.create({
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        shipping: {
          wilayaId: data.wilayaId,
          commune: data.commune,
          address: null,
        },
        lines: [
          {
            productId: Number(product.id),
            variant: variant ?? null,
            quantity: qty,
          },
        ],
      });
      toast.success(t("quickOrder.toast.sent"), {
        description: `${order.orderNumber} — ${t("quickOrder.toast.sentDesc")}`,
      });
      router.push(
        `${routes.checkoutConfirmation}?orderNumber=${order.orderNumber}`
      );
    } catch (err) {
      toast.error(t("quickOrder.toast.error"), {
        description:
          err instanceof Error ? err.message : t("quickOrder.toast.errorDesc"),
      });
    }
  });

  return (
    <section
      id="quick-order"
      aria-labelledby="quick-order-title"
      className="scroll-mt-24 overflow-hidden rounded-lg border border-tangerine-500/30 bg-cream"
    >
      <header className="flex items-start gap-3 border-b border-tangerine-500/20 bg-tangerine-50 px-4 py-3 sm:px-5">
        <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-tangerine-500 text-cream">
          <Zap className="size-4" fill="currentColor" />
        </span>
        <div className="min-w-0">
          <Mono className="text-tangerine-700">{t("quickOrder.eyebrow")}</Mono>
          <h3
            id="quick-order-title"
            className="mt-0.5 font-display text-base font-semibold leading-tight text-ink sm:text-lg"
          >
            {t("quickOrder.title")}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {t("quickOrder.lead")}
          </p>
        </div>
      </header>

      <form onSubmit={onSubmit} noValidate className="space-y-5 p-4 sm:p-5">
        {hasVariants ? (
          <VariantSelector
            variants={product.variants}
            selected={variant}
            onChange={setVariant}
          />
        ) : null}

        {/* Quantity */}
        <div className="flex items-center justify-between gap-3">
          <Label className="text-sm text-ink">{t("atc.quantity")}</Label>
          <QuantityStepper
            value={qty}
            onChange={setQty}
            max={Math.max(1, product.stock)}
            disabled={isOOS}
          />
        </div>

        {/* Customer */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label={t("quickOrder.fields.firstName")}
            error={tErr(form.formState.errors.firstName?.message)}
          >
            <Input
              {...form.register("firstName")}
              autoComplete="given-name"
              placeholder={t("quickOrder.fields.firstNamePh")}
              aria-invalid={!!form.formState.errors.firstName}
            />
          </Field>
          <Field
            label={t("quickOrder.fields.lastName")}
            error={tErr(form.formState.errors.lastName?.message)}
          >
            <Input
              {...form.register("lastName")}
              autoComplete="family-name"
              placeholder={t("quickOrder.fields.lastNamePh")}
              aria-invalid={!!form.formState.errors.lastName}
            />
          </Field>
          <Field
            label={t("quickOrder.fields.phone")}
            error={tErr(form.formState.errors.phone?.message)}
            className="sm:col-span-2"
          >
            <Input
              {...form.register("phone")}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              placeholder={t("quickOrder.fields.phonePh")}
              aria-invalid={!!form.formState.errors.phone}
            />
          </Field>
        </div>

        {/* Shipping */}
        <div className="space-y-3">
          <Field
            label={t("quickOrder.fields.wilaya")}
            error={tErr(form.formState.errors.wilayaId?.message)}
          >
            <select
              {...form.register("wilayaId")}
              aria-invalid={!!form.formState.errors.wilayaId}
              className={cn(
                "h-11 w-full rounded-lg border bg-cream px-3 text-sm text-ink transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                form.formState.errors.wilayaId
                  ? "border-ember/60"
                  : "border-wood-600/30 hover:border-forest-500"
              )}
            >
              <option value="">{t("quickOrder.fields.wilayaPlaceholder")}</option>
              {wilayas.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.code} — {w.name} · {formatDZD(w.shippingPrice)}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t("quickOrder.fields.commune")}
            error={tErr(form.formState.errors.commune?.message)}
          >
            <Input
              {...form.register("commune")}
              autoComplete="address-level2"
              placeholder={t("quickOrder.fields.communePh")}
              aria-invalid={!!form.formState.errors.commune}
            />
          </Field>
        </div>

        {/* Totals */}
        <dl className="space-y-1.5 rounded-md bg-parchment px-3 py-3 text-xs sm:text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              <span dir="ltr">
                {t("quickOrder.summary.subtotal")} ({qty} ×{" "}
                {formatDZD(product.price)})
              </span>
            </dt>
            <dd className="font-mono tabular-nums">{formatDZD(subtotal)}</dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="text-muted-foreground">
              {t("quickOrder.summary.shipping")}
            </dt>
            <dd className="font-mono tabular-nums">
              {wilaya ? formatDZD(shippingFee) : "—"}
            </dd>
          </div>
          <div className="mt-1 flex items-baseline justify-between border-t border-wood-600/10 pt-2">
            <dt className="font-display text-sm font-semibold text-ink sm:text-base">
              {t("quickOrder.summary.total")}
            </dt>
            <dd className="font-display text-base font-semibold tabular-nums text-ink sm:text-lg">
              {formatDZD(total)}
            </dd>
          </div>
        </dl>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isOOS || form.formState.isSubmitting}
        >
          <CreditCard className="size-4" />
          {isOOS
            ? t("quickOrder.cta.unavailable")
            : form.formState.isSubmitting
              ? t("quickOrder.cta.sending")
              : t("quickOrder.cta")}
        </Button>
      </form>
    </section>
  );
}

function Field({
  label,
  error,
  optional,
  className,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const t = useT();
  const id = React.useId();
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-xs sm:text-sm">
        {label}
        {optional ? (
          <span className="ms-1 text-2xs text-muted-foreground">
            ({t("form.optional")})
          </span>
        ) : null}
      </Label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, {
            id,
          })
        : children}
      {error ? <p className="text-xs text-ember">{error}</p> : null}
    </div>
  );
}
