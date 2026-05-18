"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  FacebookIcon,
  WhatsAppIcon,
} from "@/components/decorative/SocialIcons";
import { Body, H2, Mono } from "@/components/ui/typography";
import { useAuth } from "@/lib/stores/auth";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(6, "Au moins 6 caractères"),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Bienvenue !");
      router.push(routes.account.orders);
    } catch (err) {
      toast.error("Échec de la connexion", {
        description:
          err instanceof Error ? err.message : "Veuillez réessayer.",
      });
    }
  });

  return (
    <AuthSplitLayout>
      <Mono className="text-wood-600">Connexion</Mono>
      <H2 className="mt-2">Connectez-vous</H2>
      <Body className="mt-3 text-muted-foreground">
        Retrouvez vos commandes, vos favoris et vos adresses.
      </Body>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.dz"
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-ember">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!form.formState.errors.password}
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded text-wood-700 hover:bg-wood-100"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {form.formState.errors.password ? (
            <p className="text-xs text-ember">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="text-right">
          <a
            href="#"
            className="text-xs font-medium text-wood-700 hover:text-forest-700"
          >
            Mot de passe oublié ?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-2xs uppercase tracking-wide text-muted-foreground">
          ou
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() =>
            toast.info("Connexion sociale arrivera prochainement.")
          }
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full gap-3"
          )}
        >
          <FacebookIcon className="size-4 text-wood-700" />
          Continuer avec Facebook
        </button>
        <button
          type="button"
          onClick={() =>
            toast.info("Connexion sociale arrivera prochainement.")
          }
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full gap-3"
          )}
        >
          <WhatsAppIcon className="size-4 text-wood-700" />
          Continuer avec WhatsApp
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link
          href={routes.register}
          className="font-medium text-wood-700 underline-offset-4 hover:text-forest-700 hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
