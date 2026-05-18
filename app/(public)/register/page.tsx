"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Body, H2, Mono } from "@/components/ui/typography";
import { useAuth } from "@/lib/stores/auth";
import { routes } from "@/lib/routes";

const PHONE_RE = /^\+213\s?[567]\d{2}\s?\d{3}\s?\d{3}$/;

const schema = z
  .object({
    firstName: z.string().trim().min(2, "Prénom trop court"),
    lastName: z.string().trim().min(2, "Nom trop court"),
    email: z.string().trim().email("Email invalide"),
    phone: z.string().trim().regex(PHONE_RE, "Format attendu : +213 5/6/7XX XXX XXX"),
    password: z.string().min(6, "Au moins 6 caractères"),
    confirmPassword: z.string(),
    cgv: z.literal(true, { message: "Vous devez accepter les CGV" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuth((s) => s.register);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      cgv: false as unknown as true,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      });
      toast.success("Bienvenue chez BINGO !");
      router.push(routes.account.profile);
    } catch (err) {
      toast.error("Erreur lors de la création du compte", {
        description: err instanceof Error ? err.message : "Veuillez réessayer.",
      });
    }
  });

  return (
    <AuthSplitLayout tagline="Créez votre compte pour suivre vos commandes et sauvegarder vos favoris.">
      <Mono className="text-wood-600">Inscription</Mono>
      <H2 className="mt-2">Créer un compte</H2>
      <Body className="mt-3 text-muted-foreground">
        Vos informations sont confidentielles et ne servent qu&apos;à vous
        livrer.
      </Body>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" error={form.formState.errors.firstName?.message}>
            <Input
              autoComplete="given-name"
              placeholder="Yacine"
              {...form.register("firstName")}
            />
          </Field>
          <Field label="Nom" error={form.formState.errors.lastName?.message}>
            <Input
              autoComplete="family-name"
              placeholder="Benali"
              {...form.register("lastName")}
            />
          </Field>
        </div>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.dz"
            {...form.register("email")}
          />
        </Field>
        <Field label="Téléphone" error={form.formState.errors.phone?.message}>
          <Input
            type="tel"
            autoComplete="tel"
            placeholder="+213 6XX XXX XXX"
            {...form.register("phone")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Mot de passe"
            error={form.formState.errors.password?.message}
          >
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...form.register("password")}
            />
          </Field>
          <Field
            label="Confirmer le mot de passe"
            error={form.formState.errors.confirmPassword?.message}
          >
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...form.register("confirmPassword")}
            />
          </Field>
        </div>

        <label className="flex items-start gap-3 pt-2">
          <Checkbox
            checked={form.watch("cgv")}
            onCheckedChange={(v) =>
              form.setValue(
                "cgv",
                v === true ? true : (false as unknown as true),
                { shouldValidate: true }
              )
            }
          />
          <span className="text-xs">
            J&apos;accepte les{" "}
            <Link
              href={routes.cgv}
              className="text-wood-700 underline-offset-4 hover:underline"
            >
              conditions générales de vente
            </Link>{" "}
            et la politique de confidentialité.
          </span>
        </label>
        {form.formState.errors.cgv ? (
          <p className="text-xs text-ember">
            {form.formState.errors.cgv.message}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Création…" : "Créer mon compte"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link
          href={routes.login}
          className="font-medium text-wood-700 underline-offset-4 hover:text-forest-700 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </AuthSplitLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const id = React.useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id })
        : children}
      {error ? <p className="text-xs text-ember">{error}</p> : null}
    </div>
  );
}
