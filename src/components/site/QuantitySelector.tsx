import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  label?: string;
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  label = "Quantity",
}: Props) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center rounded-full border border-border bg-card",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid h-11 w-11 place-items-center rounded-l-full text-foreground transition-colors hover:bg-accent"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isNaN(next)) return;
          onChange(Math.min(max, Math.max(min, Math.floor(next))));
        }}
        className="h-11 w-12 border-x border-border bg-transparent text-center text-sm font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid h-11 w-11 place-items-center rounded-r-full text-foreground transition-colors hover:bg-accent"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
