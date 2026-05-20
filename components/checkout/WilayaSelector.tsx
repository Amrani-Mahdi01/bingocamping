"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatDZD } from "@/lib/format";
import type { Wilaya } from "@/lib/types";

interface WilayaSelectorProps {
  wilayas: Wilaya[];
  value?: string;
  onChange: (id: string) => void;
  invalid?: boolean;
}

export function WilayaSelector({
  wilayas,
  value,
  onChange,
  invalid,
}: WilayaSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const current = wilayas.find((w) => w.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-md border bg-cream px-3 text-left text-sm",
          invalid ? "border-ember/60" : "border-wood-600/30 hover:border-forest-500"
        )}
      >
        {current ? (
          <span className="flex flex-1 items-center gap-2">
            <span className="font-mono text-2xs text-wood-700">
              {current.code}
            </span>
            <span className="flex-1 truncate">{current.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDZD(current.shippingPrice)} · {current.deliveryDays}j
            </span>
          </span>
        ) : (
          <span className="flex-1 text-muted-foreground">
            Sélectionner une wilaya
          </span>
        )}
        <ChevronsUpDown className="size-4 shrink-0 text-wood-600" />
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[320px] p-0"
        align="start"
        initialFocus={false}
        finalFocus={false}
      >
        <Command>
          <CommandInput placeholder="Rechercher une wilaya…" />
          <CommandList>
            <CommandEmpty>Aucune wilaya trouvée.</CommandEmpty>
            <CommandGroup>
              {wilayas.map((w) => (
                <CommandItem
                  key={w.id}
                  value={`${w.code} ${w.name}`}
                  onSelect={() => {
                    onChange(w.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="font-mono text-2xs text-wood-700">
                    {w.code}
                  </span>
                  <span className="flex-1 truncate">{w.name}</span>
                  <span className="text-2xs text-muted-foreground">
                    {formatDZD(w.shippingPrice)} · {w.deliveryDays}j
                  </span>
                  {value === w.id ? (
                    <Check className="size-4 text-forest-700" />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
