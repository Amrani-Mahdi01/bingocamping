"use client";

import * as React from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TopoLines } from "@/components/decorative/TopoLines";
import {
  Body,
  H1,
  Lead,
  Mono,
} from "@/components/ui/typography";
import { PineDivider } from "@/components/decorative/PineDivider";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/decorative/SocialIcons";
import { useLanguage, useT } from "@/lib/i18n/LanguageProvider";
import { mailHref, telHref, waHref } from "@/lib/site-contact";
import { useSiteContact } from "@/lib/site-contact-context";

export default function ContactPage() {
  const t = useT();
  const { locale } = useLanguage();
  const contact = useSiteContact();
  const [sending, setSending] = React.useState(false);
  const address = locale === "ar" ? contact.addressAr : contact.addressFr;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    (e.target as HTMLFormElement).reset();
    toast.success(t("info.contact.toast.sent"), {
      description: t("info.contact.toast.sentDesc"),
    });
  };

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <header className="text-center">
        <Mono className="text-wood-600">{t("info.contact.eyebrow")}</Mono>
        <H1 className="mt-3">{t("info.contact.title")}</H1>
        <Lead className="mx-auto mt-3 max-w-2xl">
          {t("info.contact.lead")}
        </Lead>
      </header>
      <PineDivider className="my-10" />

      <div className="grid gap-8 md:grid-cols-2">
        <aside className="space-y-4">
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">
              {t("info.contact.section.address")}
            </Mono>
            <p className="mt-2 inline-flex items-start gap-2 font-display text-sm font-semibold text-ink">
              <MapPin className="mt-0.5 size-4 shrink-0 text-wood-700" />
              <span className="whitespace-pre-line">
                {address ||
                  `${t("info.contact.address.line1")}\n${t("info.contact.address.line2")}`}
              </span>
            </p>
          </div>
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">
              {t("info.contact.section.phone")}
            </Mono>
            <ul className="mt-3 space-y-2 text-sm">
              {contact.phone ? (
                <li className="flex items-center gap-2">
                  <Phone className="size-4 text-wood-700" />
                  <a
                    href={telHref(contact.phone)}
                    dir="ltr"
                    className="hover:text-forest-700"
                  >
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact.whatsapp ? (
                <li className="flex items-center gap-2">
                  <WhatsAppIcon className="size-4 text-wood-700" />
                  <a
                    href={waHref(contact.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                    className="hover:text-forest-700"
                  >
                    {contact.whatsapp}
                  </a>
                </li>
              ) : null}
              {contact.email ? (
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-wood-700" />
                  <a
                    href={mailHref(contact.email)}
                    dir="ltr"
                    className="hover:text-forest-700"
                  >
                    {contact.email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">
              {t("info.contact.section.hours")}
            </Mono>
            <ul className="mt-3 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-wood-700" />
                {t("info.contact.hours.weekdays")}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-wood-700" />
                {t("info.contact.hours.friday")}
              </li>
            </ul>
            <Body className="mt-3 text-xs text-muted-foreground">
              {t("info.contact.hours.note")}
            </Body>
          </div>
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">
              {t("info.contact.section.social")}
            </Mono>
            <div className="mt-3 flex gap-2">
              {[
                { href: contact.social.facebook, Icon: FacebookIcon },
                { href: contact.social.instagram, Icon: InstagramIcon },
                { href: contact.social.tiktok, Icon: TikTokIcon },
                { href: contact.social.youtube, Icon: YouTubeIcon },
                {
                  href: contact.whatsapp ? waHref(contact.whatsapp) : "",
                  Icon: WhatsAppIcon,
                },
              ]
                .filter((s) => s.href.length > 0)
                .map(({ href, Icon }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t("info.contact.socialAria")}
                    className="inline-flex size-9 items-center justify-center rounded-md border border-wood-600/20 text-wood-700 hover:text-forest-700"
                  >
                    <Icon />
                  </a>
                ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="relative h-48 overflow-hidden rounded-lg bg-forest-700 text-cream">
            <TopoLines
              opacity={0.4}
              stroke="rgba(250,246,239,0.4)"
              className="opacity-100"
            />
            <div className="relative flex h-full items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-md bg-cream/15 px-3 py-1.5 text-xs">
                <MapPin className="size-4" /> {t("info.contact.mapPin")}
              </span>
            </div>
          </div>
        </aside>

        <form
          onSubmit={onSubmit}
          className="rounded-lg bg-cream p-5 shadow-md sm:p-6"
        >
          <Mono className="text-wood-600">{t("info.contact.form.eyebrow")}</Mono>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink">
            {t("info.contact.form.title")}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">{t("info.contact.field.name")}</Label>
              <Input
                id="c-name"
                name="name"
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                placeholder={t("info.contact.placeholder.name")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">{t("info.contact.field.email")}</Label>
              <Input
                id="c-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                // Stricter than the browser default: requires a non-empty
                // local part, an @, a domain, a dot, and a 2+ char TLD.
                pattern="^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$"
                title={t("info.contact.error.email")}
                placeholder="vous@exemple.dz"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-phone">{t("info.contact.field.phone")}</Label>
              <Input
                id="c-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                // 10 digits starting with 05 / 06 / 07 — same rule as
                // register + checkout for consistency.
                pattern="^0[567][0-9]{8}$"
                title={t("info.contact.error.phone")}
                placeholder="0554748287"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-subject">
                {t("info.contact.field.subject")}
              </Label>
              <Input
                id="c-subject"
                name="subject"
                required
                minLength={3}
                maxLength={140}
                placeholder={t("info.contact.placeholder.subject")}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="c-message">
                {t("info.contact.field.message")}
              </Label>
              <Textarea
                id="c-message"
                name="message"
                rows={6}
                required
                minLength={10}
                maxLength={2000}
                placeholder={t("info.contact.placeholder.message")}
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-5 w-full sm:w-auto"
            disabled={sending}
          >
            {sending ? t("info.contact.cta.sending") : t("info.contact.cta.send")}
          </Button>
        </form>
      </div>
    </article>
  );
}
