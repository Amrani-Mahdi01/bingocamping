"use client";

import * as React from "react";
import Link from "next/link";
import { Compass, TreePine } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { TopoLines } from "@/components/decorative/TopoLines";
import { Body, H1, Mono } from "@/components/ui/typography";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Root 404 — sits outside the (public) layout's LanguageProvider, so
 * `useT()` isn't available here. We read the active locale straight from
 * `<html lang>` (which LanguageProvider syncs on every locale change)
 * and pick the right copy. Defaults to French.
 */
const COPY = {
  fr: {
    eyebrow: "Erreur 404",
    title: "Perdu dans la forêt ?",
    lead:
      "La page que vous cherchez n'existe plus, ou n'a jamais existé. Reprenons le chemin depuis le début.",
    home: "Retour à l'accueil",
    catalog: "Voir le catalogue",
  },
  ar: {
    eyebrow: "خطأ 404",
    title: "ضائع في الغابة ؟",
    lead:
      "الصفحة التي تبحث عنها لم تعد موجودة، أو لم تكن موجودة أصلاً. لنبدأ المسار من جديد.",
    home: "العودة إلى الرئيسية",
    catalog: "تصفّح الكتالوج",
  },
} as const;

export default function NotFound() {
  const [locale, setLocale] = React.useState<"fr" | "ar">("fr");
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => {
    const lang = document.documentElement.lang;
    if (lang === "ar") setLocale("ar");
  }, []);

  const isRtl = locale === "ar";
  const c = COPY[locale];

  return (
    <main
      className="relative isolate flex min-h-[100vh] items-center justify-center overflow-hidden bg-cream px-4 py-16"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <TopoLines opacity={0.6} />
      <div className="relative max-w-xl text-center">
        <div className="mx-auto flex items-center justify-center gap-4 text-wood-700">
          <TreePine className="size-12" strokeWidth={1.2} />
          <Compass className="size-10" strokeWidth={1.4} />
          <TreePine className="size-14" strokeWidth={1.2} />
        </div>
        <Mono className="mt-6 text-wood-600">{c.eyebrow}</Mono>
        <H1 className="mt-2">{c.title}</H1>
        <Body className="mt-3 mx-auto max-w-md text-muted-foreground">
          {c.lead}
        </Body>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={routes.home}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
          >
            {c.home}
          </Link>
          <Link
            href={routes.catalog}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {c.catalog}
          </Link>
        </div>
      </div>
    </main>
  );
}
