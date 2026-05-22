"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreditCard, Truck } from "lucide-react";
import { z } from "zod";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Body, H1, Mono, Small } from "@/components/ui/typography";
import { wilayas, getWilayaById } from "@/lib/mock/wilayas";
import { ordersApi } from "@/lib/api/orders";
import { useCart, selectSubtotal } from "@/lib/stores/cart";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useFormatDZD, useT } from "@/lib/i18n/LanguageProvider";

const PHONE_RE = /^\+213\s?[567]\d{2}\s?\d{3}\s?\d{3}$/;

// Zod messages are translation keys; resolved at render time via tErr below.
const schema = z.object({
  firstName: z.string().trim().min(2, "checkout.errors.firstNameTooShort"),
  lastName: z.string().trim().min(2, "checkout.errors.lastNameTooShort"),
  phone: z.string().trim().regex(PHONE_RE, "checkout.errors.phoneInvalid"),
  email: z
    .string()
    .trim()
    .email("checkout.errors.emailInvalid")
    .optional()
    .or(z.literal("")),
  wilayaId: z.string().min(2, "checkout.errors.wilayaRequired"),
  commune: z.string().trim().min(2, "checkout.errors.communeRequired"),
  address: z.string().trim().min(5, "checkout.errors.addressTooShort"),
  notes: z.string().optional(),
  payment: z.literal("cod"),
  cgv: z.literal(true, {
    message: "checkout.errors.cgvRequired",
  }),
});

type CheckoutForm = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const t = useT();
  const formatPrice = useFormatDZD();
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const clear = useCart((s) => s.clear);

  // Resolves a zod error message (translation key) into a localized string.
  const tErr = (msg?: string) =>
    msg && msg.startsWith("checkout.errors.")
      ? t(msg as Parameters<typeof t>[0])
      : msg;

  const [hydrated, setHydrated] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setHydrated(true), []);

  // Redirect to /cart when hydrated and cart is empty.
  React.useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace(routes.cart);
    }
  }, [hydrated, items.length, router]);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      wilayaId: "",
      commune: "",
      address: "",
      notes: "",
      payment: "cod",
      cgv: false as unknown as true,
    },
  });

  const wilayaId = form.watch("wilayaId");
  const wilaya = wilayaId ? getWilayaById(wilayaId) : undefined;
  const shippingFee = wilaya?.shippingPrice ?? 0;
  const total = subtotal + shippingFee;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const order = await ordersApi.create({
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email || undefined,
        },
        shipping: {
          wilayaId: data.wilayaId,
          commune: data.commune,
          address: data.address || null,
          notes: data.notes || null,
        },
        lines: items.map((it) => ({
          productId: Number(it.productId),
          variant: it.variant ?? null,
          quantity: it.quantity,
        })),
      });
      clear();
      router.push(
        `${routes.checkoutConfirmation}?orderNumber=${order.orderNumber}`
      );
    } catch (err) {
      toast.error(t("checkout.toast.createError"), {
        description:
          err instanceof Error ? err.message : t("checkout.toast.retry"),
      });
    }
  });

  if (!hydrated || items.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.home}>{t("nav.home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.cart}>{t("cart.title")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("checkout.breadcrumb")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 mb-8">
        <Mono className="text-wood-600">{t("checkout.eyebrow")}</Mono>
        <H1 className="mt-2">{t("checkout.title")}</H1>
      </header>

      <form
        onSubmit={onSubmit}
        noValidate
        className="grid gap-8 lg:grid-cols-[1fr_360px]"
      >
        {/* LEFT — sections */}
        <div className="space-y-6">
          {/* Coordonnées */}
          <Section
            title={t("checkout.sec.contact.title")}
            subtitle={t("checkout.sec.contact.subtitle")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("checkout.field.firstName")}
                error={tErr(form.formState.errors.firstName?.message)}
              >
                <Input
                  {...form.register("firstName")}
                  aria-invalid={!!form.formState.errors.firstName}
                />
              </Field>
              <Field
                label={t("checkout.field.lastName")}
                error={tErr(form.formState.errors.lastName?.message)}
              >
                <Input
                  {...form.register("lastName")}
                  aria-invalid={!!form.formState.errors.lastName}
                />
              </Field>
              <Field
                label={t("checkout.field.phone")}
                error={tErr(form.formState.errors.phone?.message)}
              >
                <Input
                  {...form.register("phone")}
                  type="tel"
                  inputMode="tel"
                  placeholder="+213 6XX XXX XXX"
                  aria-invalid={!!form.formState.errors.phone}
                />
              </Field>
              <Field
                label={t("checkout.field.email")}
                optional
                error={tErr(form.formState.errors.email?.message)}
              >
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="vous@exemple.dz"
                  aria-invalid={!!form.formState.errors.email}
                />
              </Field>
            </div>
          </Section>

          {/* Adresse */}
          <Section
            title={t("checkout.sec.address.title")}
            subtitle={t("checkout.sec.address.subtitle")}
          >
            <div className="space-y-4">
              <Field
                label={t("checkout.field.wilaya")}
                error={tErr(form.formState.errors.wilayaId?.message)}
              >
                <select
                  {...form.register("wilayaId")}
                  aria-invalid={!!form.formState.errors.wilayaId}
                  className={cn(
                    "h-11 w-full rounded-md border bg-cream px-3 text-sm text-ink transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                    form.formState.errors.wilayaId
                      ? "border-ember/60"
                      : "border-wood-600/30 hover:border-forest-500"
                  )}
                >
                  <option value="">{t("checkout.field.wilayaPlaceholder")}</option>
                  {wilayas.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code} — {w.name} · {formatPrice(w.shippingPrice)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label={t("checkout.field.commune")}
                error={tErr(form.formState.errors.commune?.message)}
              >
                <Input
                  {...form.register("commune")}
                  aria-invalid={!!form.formState.errors.commune}
                />
              </Field>
              <Field
                label={t("checkout.field.address")}
                error={tErr(form.formState.errors.address?.message)}
              >
                <Textarea
                  {...form.register("address")}
                  placeholder={t("checkout.field.addressPlaceholder")}
                  rows={3}
                  aria-invalid={!!form.formState.errors.address}
                />
              </Field>
              <Field label={t("checkout.field.notes")} optional>
                <Textarea
                  {...form.register("notes")}
                  placeholder={t("checkout.field.notesPlaceholder")}
                  rows={2}
                />
              </Field>
            </div>
          </Section>

          {/* Paiement */}
          <Section
            title={t("checkout.sec.payment.title")}
            subtitle={t("checkout.sec.payment.subtitle")}
          >
            <RadioGroup defaultValue="cod">
              <label
                htmlFor="payment-cod"
                className="flex cursor-pointer items-start gap-3 rounded-md border-2 border-forest-700 bg-forest-50 p-4"
              >
                <RadioGroupItem
                  id="payment-cod"
                  value="cod"
                  className="mt-0.5"
                />
                <span>
                  <span className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
                    <CreditCard className="size-4 text-forest-700" />
                    {t("checkout.payment.codTitle")}
                  </span>
                  <Small className="mt-1 block">
                    {t("checkout.payment.codLead")}
                  </Small>
                </span>
              </label>
            </RadioGroup>
          </Section>

          {/* CGV + submit */}
          <div className="rounded-lg bg-parchment p-5">
            <label className="flex items-start gap-3">
              <Checkbox
                checked={form.watch("cgv")}
                onCheckedChange={(v) =>
                  form.setValue("cgv", v === true ? true : (false as unknown as true), {
                    shouldValidate: true,
                  })
                }
              />
              <span className="text-sm">
                {t("checkout.cgv.before")}{" "}
                <Link
                  href={routes.cgv}
                  className="text-wood-700 underline-offset-4 hover:underline"
                >
                  {t("checkout.cgv.linkLabel")}
                </Link>{" "}
                {t("checkout.cgv.after")}
              </span>
            </label>
            {form.formState.errors.cgv ? (
              <p className="mt-2 text-xs text-ember">
                {tErr(form.formState.errors.cgv.message)}
              </p>
            ) : null}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="mt-5 w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? t("checkout.submitting")
                : t("checkout.submit")}
            </Button>
          </div>
        </div>

        {/* RIGHT — summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg bg-cream p-5 shadow-md">
            <h2 className="font-display text-lg font-semibold text-ink">
              {t("checkout.summary.title")}
            </h2>

            <ul className="mt-4 space-y-3">
              {items.map((it) => (
                <li
                  key={`${it.productId}-${it.variant ?? ""}`}
                  className="flex items-center gap-3"
                >
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-parchment">
                    <Image
                      src={it.image || "/api/placeholder/100/100"}
                      alt={it.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                    <span className="absolute -end-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-forest-700 font-mono text-2xs text-cream">
                      {it.quantity}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs text-ink">
                      {it.name}
                    </p>
                    {it.variant ? (
                      <Small className="block">{it.variant}</Small>
                    ) : null}
                  </div>
                  <p className="font-mono text-xs tabular-nums">
                    {formatPrice(it.price * it.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-wood-600/15 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {t("checkout.summary.subtotal")}
                </dt>
                <dd className="font-mono tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-muted-foreground">
                  {t("checkout.summary.shipping")}
                </dt>
                <dd className="font-mono tabular-nums">
                  {wilaya ? formatPrice(shippingFee) : "—"}
                </dd>
              </div>
              <div className="flex justify-between border-t border-wood-600/10 pt-2">
                <dt className="font-display text-base font-semibold text-ink">
                  {t("checkout.summary.total")}
                </dt>
                <dd className="font-display text-lg font-semibold tabular-nums text-ink">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            {wilaya ? (
              <div className="mt-4 flex items-start gap-2 rounded-md bg-parchment p-3 text-xs">
                <Truck className="mt-0.5 size-4 shrink-0 text-wood-700" />
                <span>
                  {t("checkout.summary.viaZR")}{" "}
                  <strong>{wilaya.name}</strong>.
                </span>
              </div>
            ) : (
              <Body className="mt-4 text-xs text-muted-foreground">
                {t("checkout.summary.pickWilaya")}
              </Body>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg bg-parchment p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const t = useT();
  const id = React.useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {optional ? (
          <span className="ms-1 text-2xs text-muted-foreground">
            ({t("form.optional")})
          </span>
        ) : null}
      </Label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id })
        : children}
      {error ? <p className="text-xs text-ember">{error}</p> : null}
    </div>
  );
}
