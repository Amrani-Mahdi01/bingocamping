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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Body, H2, Mono } from "@/components/ui/typography";
import { useAuth } from "@/lib/stores/auth";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n/LanguageProvider";

// Algerian local format: 10 digits, starting with 05 / 06 / 07.
// e.g. 0554748287
const PHONE_RE = /^0[567]\d{8}$/;

// Password policy: at least 8 chars, with one uppercase, one lowercase,
// and one digit. Letters and digits cover the common keyboard layout in
// Algeria without forcing a special-character punctuation requirement
// that customers often skip on mobile.
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Zod messages resolve to translation keys; see tErr below.
const schema = z
  .object({
    firstName: z.string().trim().min(2, "register.errors.firstNameTooShort"),
    lastName: z.string().trim().min(2, "register.errors.lastNameTooShort"),
    email: z.string().trim().email("register.errors.emailInvalid"),
    phone: z
      .string()
      .trim()
      .regex(PHONE_RE, "register.errors.phoneInvalid"),
    password: z.string().regex(PASSWORD_RE, "register.errors.passwordWeak"),
    confirmPassword: z.string(),
    cgv: z.literal(true, { message: "register.errors.cgvRequired" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "register.errors.passwordsMismatch",
  });

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const t = useT();
  const register = useAuth((s) => s.register);

  // Eye-toggle visibility for both password fields.
  const [showPwd, setShowPwd] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const tErr = (msg?: string) =>
    msg && msg.startsWith("register.errors.")
      ? t(msg as Parameters<typeof t>[0])
      : msg;

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
        password: data.password,
      });
      toast.success(t("register.welcomeToast"));
      router.push(routes.account.orders);
    } catch (err) {
      toast.error(t("register.failureTitle"), {
        description:
          err instanceof Error ? err.message : t("register.retry"),
      });
    }
  });

  return (
    <AuthSplitLayout tagline={t("register.tagline")}>
      <Mono className="text-wood-600">{t("register.eyebrow")}</Mono>
      <H2 className="mt-2">{t("register.title")}</H2>
      <Body className="mt-3 text-muted-foreground">{t("register.lead")}</Body>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("register.field.firstName")}
            error={tErr(form.formState.errors.firstName?.message)}
          >
            <Input autoComplete="given-name" {...form.register("firstName")} />
          </Field>
          <Field
            label={t("register.field.lastName")}
            error={tErr(form.formState.errors.lastName?.message)}
          >
            <Input autoComplete="family-name" {...form.register("lastName")} />
          </Field>
        </div>
        <Field
          label={t("register.field.email")}
          error={tErr(form.formState.errors.email?.message)}
        >
          <Input
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.dz"
            {...form.register("email")}
          />
        </Field>
        <Field
          label={t("register.field.phone")}
          error={tErr(form.formState.errors.phone?.message)}
        >
          <Input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="0554748287"
            maxLength={10}
            {...form.register("phone")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("register.field.password")}
            error={tErr(form.formState.errors.password?.message)}
          >
            <PasswordInput
              show={showPwd}
              onToggle={() => setShowPwd((v) => !v)}
              autoComplete="new-password"
              showLabel={t("login.showPassword")}
              hideLabel={t("login.hidePassword")}
              registerProps={form.register("password")}
              ariaInvalid={!!form.formState.errors.password}
            />
          </Field>
          <Field
            label={t("register.field.confirmPassword")}
            error={tErr(form.formState.errors.confirmPassword?.message)}
          >
            <PasswordInput
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
              autoComplete="new-password"
              showLabel={t("login.showPassword")}
              hideLabel={t("login.hidePassword")}
              registerProps={form.register("confirmPassword")}
              ariaInvalid={!!form.formState.errors.confirmPassword}
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
            {t("register.cgv.before")}{" "}
            <Link
              href={routes.cgv}
              className="text-wood-700 underline-offset-4 hover:underline"
            >
              {t("register.cgv.linkLabel")}
            </Link>{" "}
            {t("register.cgv.after")}
          </span>
        </label>
        {form.formState.errors.cgv ? (
          <p className="text-xs text-ember">
            {tErr(form.formState.errors.cgv.message)}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? t("register.submitting")
            : t("register.submit")}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t("register.haveAccount")}{" "}
        <Link
          href={routes.login}
          className="font-medium text-wood-700 underline-offset-4 hover:text-forest-700 hover:underline"
        >
          {t("nav.login")}
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
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, {
            id,
          })
        : children}
      {error ? <p className="text-xs text-ember">{error}</p> : null}
    </div>
  );
}

/**
 * Password input with an eye toggle. `registerProps` is the result of
 * `form.register("fieldName")` — we spread it onto the underlying Input
 * so RHF keeps tracking the field.
 */
function PasswordInput({
  show,
  onToggle,
  showLabel,
  hideLabel,
  autoComplete,
  registerProps,
  ariaInvalid,
}: {
  show: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
  autoComplete?: string;
  registerProps: ReturnType<ReturnType<typeof useForm<RegisterForm>>["register"]>;
  ariaInvalid?: boolean;
}) {
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder="••••••••"
        aria-invalid={ariaInvalid}
        {...registerProps}
        className="pe-10"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? hideLabel : showLabel}
        className="absolute end-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded text-wood-700 hover:bg-wood-100"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
