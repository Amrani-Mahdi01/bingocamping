"use client";

import * as React from "react";
import { Home, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Body, H1, Mono, Small } from "@/components/ui/typography";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/stores/auth";
import { cn } from "@/lib/utils";
import type { Address } from "@/lib/types";
import { getWilayaById } from "@/lib/mock/wilayas";

export default function AddressesPage() {
  const user = useAuth((s) => s.user);
  const [addresses, setAddresses] = React.useState<Address[]>(
    user?.addresses ?? []
  );

  // Track only client mutations — the addresses array is local state in the
  // mock environment, but the wiring matches what the backend will provide.
  const setDefault = (id: string) => {
    setAddresses((list) =>
      list.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast.success("Adresse par défaut mise à jour");
  };

  const remove = (id: string) => {
    setAddresses((list) => list.filter((a) => a.id !== id));
    toast.success("Adresse supprimée");
  };

  if (!user) return null;

  return (
    <section>
      <header className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <H1 className="text-2xl">Mes adresses</H1>
        <button
          type="button"
          onClick={() =>
            toast.info("L'ajout d'adresse arrivera avec le backend.")
          }
          className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
        >
          <Plus className="size-4" />
          Ajouter une adresse
        </button>
      </header>
      <Body className="mt-2 text-muted-foreground">
        Une adresse par défaut sera utilisée à chaque commande.
      </Body>

      {addresses.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-lg bg-parchment px-6 py-16 text-center">
          <MapPin className="size-16 text-wood-400" strokeWidth={1.2} />
          <H1 as="p" className="mt-4 text-xl">
            Aucune adresse enregistrée
          </H1>
          <Body className="mt-2 max-w-md text-muted-foreground">
            Ajoutez une adresse pour gagner du temps à chaque commande.
          </Body>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => {
            const wilaya = getWilayaById(a.wilayaId);
            return (
              <li
                key={a.id}
                className="relative rounded-lg bg-parchment p-5"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-wood-100 text-wood-700">
                    <Home className="size-4" />
                  </span>
                  <span className="font-display text-sm font-semibold text-ink">
                    {a.label}
                  </span>
                  {a.isDefault ? (
                    <Mono className="ml-auto rounded-full bg-forest-700 px-2 py-0.5 text-cream">
                      Par défaut
                    </Mono>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-ink">
                  {a.firstName} {a.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{a.street}</p>
                <p className="text-xs text-muted-foreground">
                  {a.commune}, {wilaya?.name ?? `Wilaya ${a.wilayaId}`}
                </p>
                <Small className="mt-2 block font-mono">{a.phone}</Small>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-wood-600/10 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.info("L'édition arrivera avec le backend.")
                    }
                  >
                    <Pencil className="size-3.5" /> Modifier
                  </Button>
                  {!a.isDefault ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDefault(a.id)}
                    >
                      <Star className="size-3.5" /> Par défaut
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(a.id)}
                    className="text-ember hover:bg-ember/10 hover:text-ember"
                  >
                    <Trash2 className="size-3.5" /> Supprimer
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
