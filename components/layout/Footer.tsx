"use client";

import * as React from "react";
import Link from "next/link";
import { Truck } from "lucide-react";

import { Mono } from "@/components/ui/typography";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/decorative/SocialIcons";
import { http } from "@/lib/api/http";
import { footerNav, routes } from "@/lib/routes";
import { useLanguage, useT } from "@/lib/i18n/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { waHref } from "@/lib/site-contact";
import { useSiteContact } from "@/lib/site-contact-context";

// Translation keys for each footer nav entry, keyed by the link's href.
const LINK_LABEL_KEY: Record<string, TranslationKey> = {
  [routes.catalog]: "footer.link.allCategories",
  [`${routes.catalog}?sort=new`]: "footer.link.newArrivals",
  [`${routes.catalog}?promoOnly=true`]: "footer.link.promotions",
  [`${routes.catalog}?sort=bestseller`]: "footer.link.bestSellers",
  [routes.delivery]: "footer.link.delivery",
  [routes.returns]: "footer.link.returns",
  [routes.faq]: "footer.link.faq",
  [routes.contact]: "footer.link.contact",
  [routes.about]: "footer.link.ourStory",
  [routes.cgv]: "footer.link.cgv",
  [routes.favorites]: "footer.link.favorites",
};

export function Footer() {
  const t = useT();
  const { locale } = useLanguage();
  const contact = useSiteContact();

  // Fetch the admin-uploaded logo + display tuning on mount so the footer
  // matches the header pixel-for-pixel. (Contact + social info come from
  // the SiteContactProvider seeded by the public layout — no extra fetch.)
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [logoAlt, setLogoAlt] = React.useState<string>("BINGO");
  const [logoHeight, setLogoHeight] = React.useState(36);
  const [logoMaxWidth, setLogoMaxWidth] = React.useState(180);
  const [logoRadius, setLogoRadius] = React.useState(0);
  React.useEffect(() => {
    let cancelled = false;
    http
      .get<{ data: Record<string, string | null> }>("/api/settings", { auth: "none" })
      .then((res) => {
        if (cancelled) return;
        setLogoUrl(res.data["site.logo"] ?? null);
        const key = locale === "ar" ? "site.logo_alt_ar" : "site.logo_alt_fr";
        setLogoAlt(res.data[key] ?? "BINGO");
        const num = (raw: string | null | undefined, fallback: number) => {
          const n = typeof raw === "string" ? parseInt(raw, 10) : NaN;
          return Number.isFinite(n) ? n : fallback;
        };
        setLogoHeight(num(res.data["site.logo_height"], 36));
        setLogoMaxWidth(num(res.data["site.logo_max_width"], 180));
        setLogoRadius(num(res.data["site.logo_radius"], 0));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <footer className="bg-forest-900 text-cream">
      {/* ───── Link columns ───── */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4 lg:gap-14">
          <div className="md:col-span-1">
            <Link
              href={routes.home}
              className="inline-flex items-center gap-2"
              aria-label={logoAlt}
            >
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  style={{
                    height: `${logoHeight}px`,
                    maxWidth: `${logoMaxWidth}px`,
                    borderRadius:
                      logoRadius >= 50 ? "9999px" : `${logoRadius}px`,
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <span className="font-display text-xl font-semibold text-cream">
                  BINGO
                </span>
              )}
            </Link>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-cream/70">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {contact.social.facebook ? (
                <SocialLink
                  href={contact.social.facebook}
                  label={t("footer.social.fb")}
                >
                  <FacebookIcon />
                </SocialLink>
              ) : null}
              {contact.social.instagram ? (
                <SocialLink
                  href={contact.social.instagram}
                  label={t("footer.social.ig")}
                >
                  <InstagramIcon />
                </SocialLink>
              ) : null}
              {contact.whatsapp ? (
                <SocialLink
                  href={waHref(contact.whatsapp)}
                  label={t("footer.social.wa")}
                >
                  <WhatsAppIcon />
                </SocialLink>
              ) : null}
            </div>
          </div>

          <FooterColumn
            title={t("footer.col.boutique")}
            links={footerNav.boutique}
          />
          <FooterColumn
            title={t("footer.col.help")}
            links={footerNav.aide}
          />
          <FooterColumn
            title={t("footer.col.about")}
            links={footerNav.apropos}
          />
        </div>
      </div>

      {/* ───── Trust bar above copyright ───── */}
      <div className="border-t border-forest-700">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-5 text-xs sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-md border border-tangerine-400/40 bg-forest-950 px-3 py-1.5">
            <Truck className="size-3.5 text-tangerine-300" />
            <span className="font-display text-xs font-semibold text-tangerine-200">
              ZR Express
            </span>
            <span className="text-cream/70">·</span>
            <span className="text-cream/80">{t("footer.shippingBadge")}</span>
          </span>
          <p className="ms-auto text-cream/50">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  const t = useT();
  return (
    <div>
      <Mono className="text-tangerine-300">{title}</Mono>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => {
          const key = LINK_LABEL_KEY[link.href];
          const label = key ? t(key) : link.label;
          // Several legal-page entries share /cgv as their href today, so
          // key on the (label, href) pair to keep React happy.
          return (
            <li key={`${link.label}-${link.href}`}>
              <Link
                href={link.href}
                className="text-xs text-cream/70 transition-colors hover:text-tangerine-300"
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-md border border-forest-700 text-cream/80 transition-colors hover:border-tangerine-400 hover:text-tangerine-300"
    >
      {children}
    </a>
  );
}
