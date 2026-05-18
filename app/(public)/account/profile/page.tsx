"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Body, H1, Mono } from "@/components/ui/typography";
import { useAuth } from "@/lib/stores/auth";

export default function ProfilePage() {
  const user = useAuth((s) => s.user);
  if (!user) return null;

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Informations enregistrées");
  };

  return (
    <section>
      <H1 className="mt-2 text-2xl">Mon profil</H1>
      <Body className="mt-2 text-muted-foreground">
        Vos informations restent confidentielles et ne servent qu&apos;à vous
        livrer vos commandes.
      </Body>

      {/* Section 1: Informations personnelles */}
      <form
        onSubmit={onSave}
        className="mt-6 space-y-5 rounded-lg bg-parchment p-5 sm:p-6"
      >
        <div>
          <Mono className="text-wood-600">Section 1</Mono>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink">
            Informations personnelles
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="profile-first" label="Prénom" defaultValue={user.firstName} />
          <Field id="profile-last" label="Nom" defaultValue={user.lastName} />
          <Field
            id="profile-email"
            label="Email"
            type="email"
            defaultValue={user.email}
          />
          <Field id="profile-phone" label="Téléphone" defaultValue={user.phone} />
        </div>
        <Button type="submit" variant="primary">
          Enregistrer
        </Button>
      </form>

      {/* Section 2: Mot de passe */}
      <form
        onSubmit={onSave}
        className="mt-6 space-y-5 rounded-lg bg-parchment p-5 sm:p-6"
      >
        <div>
          <Mono className="text-wood-600">Section 2</Mono>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink">
            Mot de passe
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="pw-current" label="Actuel" type="password" />
          <Field id="pw-new" label="Nouveau" type="password" />
          <Field id="pw-confirm" label="Confirmer" type="password" />
        </div>
        <Button type="submit" variant="primary">
          Mettre à jour
        </Button>
      </form>

      {/* Section 3: Préférences */}
      <form
        onSubmit={onSave}
        className="mt-6 space-y-5 rounded-lg bg-parchment p-5 sm:p-6"
      >
        <div>
          <Mono className="text-wood-600">Section 3</Mono>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink">
            Préférences
          </h2>
        </div>
        <div className="space-y-3">
          <fieldset className="space-y-2 rounded-md bg-cream p-4">
            <legend className="px-1 text-xs font-medium text-ink">
              Langue
            </legend>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="lang"
                  defaultChecked
                  className="accent-forest-700"
                />
                <span className="text-sm">Français</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="lang"
                  disabled
                  className="accent-forest-700"
                />
                <span className="text-sm text-muted-foreground">
                  العربية (à venir)
                </span>
              </label>
            </div>
          </fieldset>
          <label className="flex items-center gap-3 rounded-md bg-cream p-4">
            <Checkbox defaultChecked />
            <span className="text-sm">
              Recevoir les notifications email (nouveautés, statut commande)
            </span>
          </label>
          <label className="flex items-center gap-3 rounded-md bg-cream p-4">
            <Checkbox defaultChecked />
            <span className="text-sm">
              Recevoir les notifications SMS (confirmation et expédition)
            </span>
          </label>
        </div>
        <Button type="submit" variant="primary">
          Enregistrer mes préférences
        </Button>
      </form>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  defaultValue,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        defaultValue={defaultValue}
        className="bg-cream"
      />
    </div>
  );
}
