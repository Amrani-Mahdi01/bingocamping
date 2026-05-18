"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyOrderNumber({ orderNumber }: { orderNumber: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(orderNumber);
        toast.success("Numéro de commande copié");
      }}
      aria-label="Copier le numéro de commande"
      className="inline-flex size-6 items-center justify-center rounded text-wood-600 hover:bg-wood-100"
    >
      <Copy className="size-3.5" />
    </button>
  );
}
