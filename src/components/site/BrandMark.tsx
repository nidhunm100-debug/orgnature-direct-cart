import { Link } from "@tanstack/react-router";

import markAsset from "@/assets/ankura-mark.png.asset.json";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";

export function BrandMark({ className, compact }: { className?: string; compact?: boolean }) {
  const { brand } = useSettings();

  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label="AnKura by Orgnature — home">
      <img
        src={brand.logoUrl || mark}
        alt="AnKura by Orgnature logo"
        width={40}
        height={40}
        className="h-9 w-9 object-contain sm:h-10 sm:w-10"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl tracking-[0.14em] text-primary sm:text-2xl">
          {brand.brandName}
        </span>
        {!compact && (
          <span className="mt-0.5 text-[0.6rem] tracking-[0.28em] text-earth uppercase">
            {brand.subBrand}
          </span>
        )}
      </span>
    </Link>
  );
}
