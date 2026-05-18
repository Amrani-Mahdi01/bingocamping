import * as React from "react";
import Link from "next/link";
import { Truck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PineDivider } from "@/components/decorative/PineDivider";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/decorative/SocialIcons";
import { footerNav, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-forest-900 text-cream">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6">
        {/* Top section — 4 columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Boutique" links={footerNav.boutique} />
          <FooterColumn title="Aide" links={footerNav.aide} />
          <FooterColumn title="À propos" links={footerNav.apropos} />

          <div>
            <h4 className="mb-4 font-display text-md font-semibold text-cream">
              Newsletter
            </h4>
            <p className="mb-4 text-xs leading-relaxed text-cream/70">
              Recevez nos nouveautés et offres exclusives dans votre boîte
              mail.
            </p>
            <form
              action="#"
              method="post"
              className="flex flex-col gap-2 sm:flex-row"
              aria-label="Inscription à la newsletter"
            >
              <label htmlFor="footer-newsletter" className="sr-only">
                Adresse email
              </label>
              <Input
                id="footer-newsletter"
                type="email"
                required
                placeholder="vous@exemple.dz"
                className="border-forest-700 bg-forest-950 text-cream placeholder:text-cream/40 focus-visible:ring-wood-400"
              />
              <button
                type="submit"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "default" }),
                  "shrink-0"
                )}
              >
                S&apos;abonner
              </button>
            </form>
          </div>
        </div>

        {/* Mid ornament — PineDivider over wood-400 hairline */}
        <PineDivider className="my-12 text-wood-400" color="#c88a58" />

        {/* ZR Express badge */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-4 sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-md border border-wood-400/30 bg-forest-950 px-3 py-1.5">
            <span className="font-display text-sm font-semibold text-wood-300">
              ZR Express
            </span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-cream/80">
            <Truck className="size-4 text-wood-300" />
            <span>Livraison partout en Algérie · Paiement à la livraison</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col gap-6 border-t border-forest-700 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={routes.home}
            className="flex items-center gap-2"
            aria-label="BINGO — Accueil"
          >
            <span className="font-display text-md font-semibold text-cream">
              BINGO
            </span>
            <span
              aria-hidden="true"
              className="h-3 w-4 rounded-sm bg-wood-600"
            />
          </Link>

          <p className="text-center text-xs text-cream/60">
            © 2026 BINGO — Sétif, Algérie
          </p>

          <div className="flex items-center justify-center gap-2">
            <SocialLink
              href="https://facebook.com"
              label="BINGO sur Facebook"
            >
              <FacebookIcon />
            </SocialLink>
            <SocialLink
              href="https://instagram.com"
              label="BINGO sur Instagram"
            >
              <InstagramIcon />
            </SocialLink>
            <SocialLink
              href="https://wa.me/213"
              label="BINGO sur WhatsApp"
            >
              <WhatsAppIcon />
            </SocialLink>
          </div>
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
      <h4 className="mb-4 font-display text-md font-semibold text-cream">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs text-cream/70 transition-colors hover:text-cream"
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
      className="inline-flex size-9 items-center justify-center rounded-md text-cream/70 transition-colors hover:bg-forest-800 hover:text-cream"
    >
      {children}
    </a>
  );
}
