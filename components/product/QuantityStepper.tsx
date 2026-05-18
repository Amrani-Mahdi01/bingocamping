"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
  /** Optional aria-label for the whole stepper. */
  label?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  disabled,
  className,
  label = "Quantité",
}: QuantityStepperProps) {
  const heightCls = size === "sm" ? "h-8" : "h-11";
  const iconBtn =
    size === "sm" ? "size-8 text-xs" : "size-11 text-sm";
  const textCls =
    size === "sm" ? "min-w-[2rem] text-xs" : "min-w-[3rem] text-sm";

  const setSafe = (next: number) => {
    if (disabled) return;
    onChange(Math.max(min, Math.min(max, next)));
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center overflow-hidden rounded-md border border-wood-600/30 bg-cream",
        heightCls,
        className
      )}
    >
      <button
        type="button"
        onClick={() => setSafe(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Diminuer la quantité"
        className={cn(
          "inline-flex items-center justify-center text-wood-800 hover:bg-wood-100 disabled:opacity-40",
          iconBtn
        )}
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const next = parseInt(e.target.value, 10);
          if (!Number.isNaN(next)) setSafe(next);
        }}
        aria-label="Quantité"
        className={cn(
          "border-x border-wood-600/20 bg-transparent text-center font-mono tabular-nums text-ink outline-none [appearance:textfield] focus:bg-wood-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          textCls,
          heightCls
        )}
      />
      <button
        type="button"
        onClick={() => setSafe(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Augmenter la quantité"
        className={cn(
          "inline-flex items-center justify-center text-wood-800 hover:bg-wood-100 disabled:opacity-40",
          iconBtn
        )}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
