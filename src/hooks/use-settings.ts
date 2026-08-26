import { useQuery } from "@tanstack/react-query";

import { settingsQuery } from "@/lib/catalog";
import { CONTACT_DEFAULTS, SHIPPING_DEFAULTS } from "@/lib/store-config";

export function useSettings() {
  const { data } = useQuery(settingsQuery);
  return (
    data ?? {
      brand: {
        logoUrl: null,
        brandName: "ANKURA",
        subBrand: "by ORGNATURE",
        heroImageUrl: null,
        aboutImageUrl: null,
        wellnessImageUrl: null,
      },
      contact: CONTACT_DEFAULTS,
      shipping: SHIPPING_DEFAULTS,
    }
  );
}
