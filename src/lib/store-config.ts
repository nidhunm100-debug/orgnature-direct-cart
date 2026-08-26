/**
 * Central store configuration.
 * Values here are defaults; anything the owner can edit lives in the
 * `site_settings` table and is surfaced through the admin panel.
 */

export const DEFAULT_WHATSAPP_NUMBER = "919449150477";

export const BRAND = {
  name: "ANKURA",
  subBrand: "by ORGNATURE",
  tagline: "Nature's Goodness. Delivered with Trust.",
};

export const CONTACT_DEFAULTS = {
  whatsapp: DEFAULT_WHATSAPP_NUMBER,
  phone: "+91 94491 50477",
  phoneAlt: "+91 93903 33077",
  email: "orgnature3@gmail.com",
  website: "www.orgnature.in",
  address: "Orgnature, India",
  mapEmbedUrl: null as string | null,
};

/**
 * Delivery configuration. Version 1 keeps charges "to be confirmed".
 * The structure supports flat rates and free-shipping thresholds so the
 * business owner can switch modes from the admin panel later.
 */
export type ShippingMode = "to_be_confirmed" | "flat" | "free_above";

export type ShippingConfig = {
  mode: ShippingMode;
  flatRate: number;
  freeAbove: number | null;
  note: string;
};

export const SHIPPING_DEFAULTS: ShippingConfig = {
  mode: "to_be_confirmed",
  flatRate: 0,
  freeAbove: null,
  note: "Delivery charges will be confirmed on WhatsApp.",
};

export function formatINR(value: number): string {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value))}`;
}

/** Returns delivery amount, or null when it is still to be confirmed. */
export function resolveDelivery(config: ShippingConfig, subtotal: number): number | null {
  if (config.mode === "flat") return config.flatRate;
  if (config.mode === "free_above") {
    if (config.freeAbove !== null && subtotal >= config.freeAbove) return 0;
    return config.flatRate;
  }
  return null;
}

export function deliveryLabel(config: ShippingConfig, subtotal: number): string {
  const amount = resolveDelivery(config, subtotal);
  if (amount === null) return "To be confirmed";
  if (amount === 0) return "Free";
  return formatINR(amount);
}
