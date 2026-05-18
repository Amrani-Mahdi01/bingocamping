"use client";

import * as React from "react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Body, Mono, Small } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const DAYS = ["Sam", "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven"] as const;

export default function SettingsPage() {
  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Configuration enregistrée");
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Configuration"
        title="Paramètres du site"
        subtitle="Informations, coordonnées, notifications, politiques."
      />

      <form onSubmit={onSave} className="space-y-6 pb-32">
        {/* 1. Site */}
        <Section title="Informations du site" id="site">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="site-name" label="Nom du site">
              <Input id="site-name" defaultValue="BINGO" />
            </Field>
            <Field id="site-slogan" label="Slogan">
              <Input
                id="site-slogan"
                defaultValue="L'aventure commence ici"
              />
            </Field>
            <Field id="site-desc" label="Description SEO" className="sm:col-span-2">
              <Textarea
                id="site-desc"
                rows={3}
                defaultValue="BINGO — sélection rigoureuse d'équipement outdoor en Algérie. Livraison ZR Express dans toutes les wilayas."
              />
            </Field>
            <Field id="site-lang" label="Langue par défaut">
              <Select defaultValue="fr">
                <SelectTrigger id="site-lang">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field id="site-currency" label="Devise">
              <Input id="site-currency" defaultValue="DZD" readOnly className="font-mono" />
            </Field>
          </div>
        </Section>

        {/* 2. Coordonnées */}
        <Section title="Coordonnées" id="contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="addr" label="Adresse complète" className="sm:col-span-2">
              <Textarea
                id="addr"
                rows={2}
                defaultValue="Cité Hassan Bey, Sétif 19000, Algérie"
              />
            </Field>
            <Field id="phone" label="Téléphone">
              <Input id="phone" defaultValue="+213 36 XX XX XX" />
            </Field>
            <Field id="email" label="Email">
              <Input id="email" type="email" defaultValue="contact@bingo.dz" />
            </Field>
            <Field id="wa" label="WhatsApp">
              <Input id="wa" defaultValue="+213 6 XX XX XX XX" />
            </Field>
          </div>
          <div className="mt-5">
            <Mono className="text-wood-600">Horaires d&apos;ouverture</Mono>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {DAYS.map((d) => (
                <li
                  key={d}
                  className="flex items-center gap-3 rounded-md bg-cream px-3 py-2"
                >
                  <span className="w-16 font-mono text-xs">{d}</span>
                  <Input defaultValue={d === "Ven" ? "14h-18h" : "9h-18h"} className="h-8" />
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 3. Réseaux sociaux */}
        <Section title="Réseaux sociaux" id="social">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Facebook URL", "https://facebook.com/bingo.dz"],
              ["Instagram URL", "https://instagram.com/bingo.dz"],
              ["TikTok URL", ""],
              ["YouTube URL", ""],
              ["WhatsApp Business", "+213 6 XX XX XX XX"],
            ].map(([label, value], i) => (
              <Field key={i} id={`sn-${i}`} label={String(label)}>
                <Input id={`sn-${i}`} defaultValue={String(value)} />
              </Field>
            ))}
          </div>
        </Section>

        {/* 4. Notifications */}
        <Section title="Notifications" id="notifs">
          <ul className="space-y-3">
            {[
              "Email confirmation commande",
              "Email expédition",
              "Email livraison",
              "SMS confirmation",
            ].map((label) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-md bg-cream p-3"
              >
                <Checkbox defaultChecked />
                <span className="flex-1 text-sm">{label}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Édition de template — backend à venir")}
                >
                  Modèle
                </Button>
              </li>
            ))}
          </ul>
        </Section>

        {/* 5. Paiement */}
        <Section title="Paiement" id="payment">
          <label className="flex items-center gap-3 rounded-md bg-cream p-3">
            <Checkbox defaultChecked disabled />
            <span className="flex-1 text-sm">
              Paiement à la livraison (cash)
            </span>
            <Small>Toujours actif</Small>
          </label>
          <Body className="mt-3 text-xs text-muted-foreground">
            D&apos;autres modes de paiement (EDahabia, CIB, BaridiMob) seront
            ajoutés ultérieurement.
          </Body>
        </Section>

        {/* 6. Politiques */}
        <Section title="Politiques" id="policies">
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              ["Livraison", "Modifier le contenu de /delivery"],
              ["Retours", "Modifier le contenu de /returns"],
              ["CGV", "Modifier le contenu de /cgv"],
            ].map(([title, hint]) => (
              <li
                key={title}
                className="flex flex-col gap-3 rounded-md bg-cream p-4"
              >
                <h3 className="font-display text-sm font-semibold">{title}</h3>
                <Small>{hint}</Small>
                <Textarea rows={5} placeholder={`Texte de ${title}…`} />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn("self-start")}
                  onClick={() => toast.success("Texte enregistré")}
                >
                  Enregistrer
                </Button>
              </li>
            ))}
          </ul>
        </Section>

        {/* Sticky save */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-wood-600/15 bg-cream/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm">
              Annuler
            </Button>
            <Button type="submit" variant="primary" size="default">
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="rounded-lg bg-parchment p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
