import { Leaf, ShieldCheck, Sparkles, Sprout, Truck } from "lucide-react";

const BADGES = [
  { icon: Leaf, label: "100% Natural" },
  { icon: Sparkles, label: "No Added Preservatives" },
  { icon: Sprout, label: "Carefully Sourced" },
  { icon: ShieldCheck, label: "Hygienically Processed" },
  { icon: Truck, label: "Trusted Quality" },
];

export function TrustBadges() {
  return (
    <section aria-label="Why customers trust AnKura" className="border-y border-border bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
        {BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <Icon className="h-6 w-6 text-leaf" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-xs font-medium tracking-wide text-foreground/85 sm:text-sm">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
