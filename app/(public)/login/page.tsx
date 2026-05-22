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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Body, H2, Mono } from "@/components/ui/typography";
import { useAuth } from "@/lib/stores/auth";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n/LanguageProvider";

// Zod messages resolve to translation keys; see tErr below.
const schema = z.object({
  email: z.string().trim().email("login.errors.emailInvalid"),
  password: z.string().min(6, "login.errors.passwordMin"),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const t = useT();
  const login = useAuth((s) => s.login);
  const [showPassword, setShowPassword] = React.useState(false);

  const tErr = (msg?: string) =>
    msg && msg.startsWith("login.errors.")
      ? t(msg as Parameters<typeof t>[0])
      : msg;

  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await login(data.email, data.password);
      toast.success(t("login.welcomeToast"));
      router.push(routes.account.orders);
    } catch (err) {
      toast.error(t("login.failureTitle"), {
        description: err instanceof Error ? err.message : t("login.retry"),
      });
    }
  });

  return (
    <AuthSplitLayout>
      <Mono className="text-wood-600">{t("login.eyebrow")}</Mono>
      <H2 className="mt-2">{t("login.title")}</H2>
      <Body className="mt-3 text-muted-foreground">{t("login.lead")}</Body>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email">{t("login.field.email")}</Label>
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
              {tErr(form.formState.errors.email.message)}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password">{t("login.field.password")}</Label>
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
                showPassword ? t("login.hidePassword") : t("login.showPassword")
              }
              className="absolute end-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded text-wood-700 hover:bg-wood-100"
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
              {tErr(form.formState.errors.password.message)}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? t("login.submitting")
            : t("login.submit")}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t("login.noAccount")}{" "}
        <Link
          href={routes.register}
          className="font-medium text-wood-700 underline-offset-4 hover:text-forest-700 hover:underline"
        >
          {t("nav.register")}
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
