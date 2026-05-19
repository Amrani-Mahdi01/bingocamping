import * as React from "react";
import Link from "next/link";
import { Truck } from "lucide-react";

import { Mono } from "@/components/ui/typography";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/decorative/SocialIcons";
import { footerNav, routes } from "@/lib/routes";

export function Footer() {
  return (
    <footer className="bg-forest-900 text-cream">
      {/* ───── Link columns ───── */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4 lg:gap-14">
          <div className="md:col-span-1">
            <Link
              href={routes.home}
              className="inline-flex items-center gap-2"
              aria-label="BINGO — Accueil"
            >
              <span className="font-display text-xl font-semibold text-cream">
                BINGO
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-cream/70">
              Équipement outdoor sélectionné, testé en conditions réelles
              dans le Djurdjura, l&apos;Aurès et le Hoggar. Une petite équipe à
              Sétif, livrée partout en Algérie.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialLink href="https://facebook.com" label="BINGO sur Facebook">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href="https://instagram.com" label="BINGO sur Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="https://wa.me/213" label="BINGO sur WhatsApp">
                <WhatsAppIcon />
              </SocialLink>
            </div>
          </div>

          <FooterColumn title="Boutique" links={footerNav.boutique} />
          <FooterColumn title="Aide" links={footerNav.aide} />
          <FooterColumn title="À propos" links={footerNav.apropos} />
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
            <span className="text-cream/80">Livraison partout en Algérie</span>
          </span>
          <p className="ml-auto text-cream/50">
            © 2026 BINGO — Sétif, Algérie
          </p>
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
  return (
    <div>
      <Mono className="text-tangerine-300">{title}</Mono>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          // Several legal-page entries share /cgv as their href today, so
          // key on the (label, href) pair to keep React happy.
          <li key={`${link.label}-${link.href}`}>
            <Link
              href={link.href}
              className="text-xs text-cream/70 transition-colors hover:text-tangerine-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
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
