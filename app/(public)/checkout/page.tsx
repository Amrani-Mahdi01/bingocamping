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
import { api } from "@/lib/api/client";
import { useCart, selectSubtotal } from "@/lib/stores/cart";
import { formatDZD } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const PHONE_RE = /^\+213\s?[567]\d{2}\s?\d{3}\s?\d{3}$/;

const schema = z.object({
  firstName: z.string().trim().min(2, "Prénom trop court"),
  lastName: z.string().trim().min(2, "Nom trop court"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_RE, "Format attendu : +213 5/6/7XX XXX XXX"),
  email: z
    .string()
    .trim()
    .email("Email invalide")
    .optional()
    .or(z.literal("")),
  wilayaId: z.string().min(2, "Sélectionnez votre wilaya"),
  commune: z.string().trim().min(2, "Commune requise"),
  address: z.string().trim().min(5, "Adresse trop courte"),
  notes: z.string().optional(),
  payment: z.literal("cod"),
  cgv: z.literal(true, {
    message: "Vous devez accepter les CGV",
  }),
});

type CheckoutForm = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const clear = useCart((s) => s.clear);

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
      const order = await api.orders.create({
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email || undefined,
        },
        shipping: {
          wilayaId: data.wilayaId,
          commune: data.commune,
          address: data.address,
          notes: data.notes,
        },
        lines: items.map((it) => ({
          productId: it.productId,
          variant: it.variant,
          quantity: it.quantity,
        })),
      });
      clear();
      router.push(
        `${routes.checkoutConfirmation}?orderNumber=${order.orderNumber}`
      );
    } catch (err) {
      toast.error("Erreur lors de la création de la commande", {
        description:
          err instanceof Error ? err.message : "Veuillez réessayer.",
      });
    }
  });

  if (!hydrated || items.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.home}>Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={routes.cart}>Panier</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Commande</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 mb-8">
        <Mono className="text-wood-600">Finaliser</Mono>
        <H1 className="mt-2">Votre commande</H1>
      </header>

      <form
        onSubmit={onSubmit}
        noValidate
        className="grid gap-8 lg:grid-cols-[1fr_360px]"
      >
        {/* LEFT — sections */}
        <div className="space-y-6">
          {/* Coordonnées */}
          <Section title="1. Coordonnées" subtitle="Nous vous appelons pour confirmer la commande.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Prénom"
                error={form.formState.errors.firstName?.message}
              >
                <Input
                  {...form.register("firstName")}
                  placeholder="Yacine"
                  aria-invalid={!!form.formState.errors.firstName}
                />
              </Field>
              <Field
                label="Nom"
                error={form.formState.errors.lastName?.message}
              >
                <Input
                  {...form.register("lastName")}
                  placeholder="Benali"
                  aria-invalid={!!form.formState.errors.lastName}
                />
              </Field>
              <Field
                label="Téléphone"
                error={form.formState.errors.phone?.message}
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
                label="Email (facultatif)"
                error={form.formState.errors.email?.message}
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
            title="2. Adresse de livraison"
            subtitle="Tous les wilayas sont desservis par ZR Express."
          >
            <div className="space-y-4">
              <Field
                label="Wilaya"
                error={form.formState.errors.wilayaId?.message}
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
                  <option value="">Sélectionner une wilaya</option>
                  {wilayas.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code} — {w.name} · {formatDZD(w.shippingPrice)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Commune"
                error={form.formState.errors.commune?.message}
              >
                <Input
                  {...form.register("commune")}
                  placeholder="Bir Mourad Raïs"
                  aria-invalid={!!form.formState.errors.commune}
                />
              </Field>
              <Field
                label="Adresse précise"
                error={form.formState.errors.address?.message}
              >
                <Textarea
                  {...form.register("address")}
                  placeholder="Rue, numéro, bâtiment, étage…"
                  rows={3}
                  aria-invalid={!!form.formState.errors.address}
                />
              </Field>
              <Field label="Notes pour le livreur (facultatif)" optional>
                <Textarea
                  {...form.register("notes")}
                  placeholder="Sonner deux fois, contacter au 06…, etc."
                  rows={2}
                />
              </Field>
            </div>
          </Section>

          {/* Paiement */}
          <Section
            title="3. Mode de paiement"
            subtitle="D'autres modes arriveront prochainement."
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
                    Paiement à la livraison (cash)
                  </span>
                  <Small className="mt-1 block">
                    Vous paierez le montant total au livreur lors de la
                    réception de votre commande.
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
                J&apos;accepte les{" "}
                <Link
                  href={routes.cgv}
                  className="text-wood-700 underline-offset-4 hover:underline"
                >
                  conditions générales de vente
                </Link>{" "}
                de BINGO.
              </span>
            </label>
            {form.formState.errors.cgv ? (
              <p className="mt-2 text-xs text-ember">
                {form.formState.errors.cgv.message}
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
                ? "Envoi en cours…"
                : "Confirmer la commande"}
            </Button>
          </div>
        </div>

        {/* RIGHT — summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg bg-cream p-5 shadow-md">
            <h2 className="font-display text-lg font-semibold text-ink">
              Votre commande
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
                    <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-forest-700 font-mono text-2xs text-cream">
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
                    {formatDZD(it.price * it.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-wood-600/15 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Sous-total</dt>
                <dd className="font-mono tabular-nums">{formatDZD(subtotal)}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-muted-foreground">Livraison</dt>
                <dd className="font-mono tabular-nums">
                  {wilaya ? formatDZD(shippingFee) : "—"}
                </dd>
              </div>
              <div className="flex justify-between border-t border-wood-600/10 pt-2">
                <dt className="font-display text-base font-semibold text-ink">
                  Total
                </dt>
                <dd className="font-display text-lg font-semibold tabular-nums text-ink">
                  {formatDZD(total)}
                </dd>
              </div>
            </dl>

            {wilaya ? (
              <div className="mt-4 flex items-start gap-2 rounded-md bg-parchment p-3 text-xs">
                <Truck className="mt-0.5 size-4 shrink-0 text-wood-700" />
                <span>
                  Livraison via ZR Express vers <strong>{wilaya.name}</strong>.
                </span>
              </div>
            ) : (
              <Body className="mt-4 text-xs text-muted-foreground">
                Sélectionnez votre wilaya pour voir les frais de livraison.
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
  const id = React.useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {optional ? (
          <span className="ml-1 text-2xs text-muted-foreground">(facultatif)</span>
        ) : null}
      </Label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id })
        : children}
      {error ? <p className="text-xs text-ember">{error}</p> : null}
    </div>
  );
}
