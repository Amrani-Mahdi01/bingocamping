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
  WhatsAppIcon,
} from "@/components/decorative/SocialIcons";

export default function ContactPage() {
  const [sending, setSending] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    (e.target as HTMLFormElement).reset();
    toast.success("Votre message a bien été envoyé", {
      description: "Nous répondons sous 24h ouvrées.",
    });
  };

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <header className="text-center">
        <Mono className="text-wood-600">Nous écrire</Mono>
        <H1 className="mt-3">Contact</H1>
        <Lead className="mx-auto mt-3 max-w-2xl">
          Question sur un produit, suivi de commande, partenariat — toute
          l&apos;équipe est joignable, 7 jours sur 7.
        </Lead>
      </header>
      <PineDivider className="my-10" />

      <div className="grid gap-8 md:grid-cols-2">
        <aside className="space-y-4">
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Adresse</Mono>
            <p className="mt-2 inline-flex items-start gap-2 font-display text-sm font-semibold text-ink">
              <MapPin className="mt-0.5 size-4 shrink-0 text-wood-700" />
              <span>
                Cité Hassan Bey, Sétif 19000
                <br />
                Algérie
              </span>
            </p>
          </div>
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Téléphone & WhatsApp</Mono>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-wood-700" />
                <a href="tel:+213360000000" className="hover:text-forest-700">
                  +213 36 XX XX XX
                </a>
              </li>
              <li className="flex items-center gap-2">
                <WhatsAppIcon className="size-4 text-wood-700" />
                <a
                  href="https://wa.me/213600000000"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-forest-700"
                >
                  +213 6 XX XX XX XX
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-wood-700" />
                <a
                  href="mailto:contact@bingo.dz"
                  className="hover:text-forest-700"
                >
                  contact@bingo.dz
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Horaires</Mono>
            <ul className="mt-3 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-wood-700" />
                Samedi - Jeudi · 9h-18h
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-wood-700" />
                Vendredi · 14h-18h
              </li>
            </ul>
            <Body className="mt-3 text-xs text-muted-foreground">
              WhatsApp et email traités également hors horaires.
            </Body>
          </div>
          <div className="rounded-lg bg-parchment p-5">
            <Mono className="text-wood-600">Réseaux</Mono>
            <div className="mt-3 flex gap-2">
              {[FacebookIcon, InstagramIcon, WhatsAppIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Réseau social"
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
                <MapPin className="size-4" /> Sétif, Algérie
              </span>
            </div>
          </div>
        </aside>

        <form
          onSubmit={onSubmit}
          className="rounded-lg bg-cream p-5 shadow-md sm:p-6"
        >
          <Mono className="text-wood-600">Formulaire</Mono>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink">
            Envoyez-nous un message
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Nom complet</Label>
              <Input id="c-name" required placeholder="Yacine Benali" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input
                id="c-email"
                type="email"
                required
                placeholder="vous@exemple.dz"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="c-subject">Sujet</Label>
              <Input id="c-subject" required placeholder="Ma commande BIN-2026-…" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="c-message">Message</Label>
              <Textarea id="c-message" rows={6} required placeholder="Bonjour…" />
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-5 w-full sm:w-auto"
            disabled={sending}
          >
            {sending ? "Envoi…" : "Envoyer le message"}
          </Button>
        </form>
      </div>
    </article>
  );
}
