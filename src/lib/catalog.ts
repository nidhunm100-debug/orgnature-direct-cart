import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

import catOils from "@/assets/cat-oils.jpg";
import catMillets from "@/assets/cat-millets.jpg";
import catTea from "@/assets/cat-tea.jpg";
import catGhee from "@/assets/cat-ghee.jpg";
import catSpices from "@/assets/cat-spices.jpg";
import catFlours from "@/assets/cat-flours.jpg";
import wellness from "@/assets/wellness-lifestyle.jpg";

import { CONTACT_DEFAULTS, SHIPPING_DEFAULTS, type ShippingConfig } from "./store-config";

export type ProductVariant = {
  label: string;
  price: number;
  mrp: number | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  subcategory: string | null;
  short_description: string | null;
  description: string | null;
  price: number;
  mrp: number | null;
  pack_size: string | null;
  image_url: string | null;
  image_url_2: string | null;
  lifestyle_image_url: string | null;
  image_url_4: string | null;
  image_url_5: string | null;
  ingredients: string | null;
  nutrition: string | null;
  benefits: string | null;
  preparation: string | null;
  storage: string | null;
  allergens: string | null;
  additional_details: string | null;
  tags: string[];
  variants: ProductVariant[];
  featured: boolean;
  best_seller: boolean;
  available: boolean;
  product_type: string | null;
  sort_order: number;
  created_at: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type BrandSettings = {
  logoUrl: string | null;
  brandName: string;
  subBrand: string;
  heroImageUrl: string | null;
  aboutImageUrl: string | null;
  wellnessImageUrl: string | null;
};

export type ContactSettings = typeof CONTACT_DEFAULTS;

/** Fallback imagery per category, used when no image has been uploaded yet. */
const CATEGORY_FALLBACK: Record<string, string> = {
  "cold-pressed-oils": catOils,
  "millet-products": catMillets,
  "health-mixes": catMillets,
  "herbal-teas": catTea,
  "spices-masalas": catSpices,
  "flours-atta": catFlours,
  "noodles-pasta": catMillets,
  "baby-kids-nutrition": catMillets,
  "ghee-traditional": catGhee,
  "snacks-nuts": wellness,
  "combos-value-packs": wellness,
  "traditional-drinks": catTea,
};

export function categoryImage(category: Pick<Category, "slug" | "image_url">): string {
  return category.image_url || CATEGORY_FALLBACK[category.slug] || wellness;
}

export function productImage(product: Pick<Product, "image_url" | "category_slug">): string {
  return product.image_url || CATEGORY_FALLBACK[product.category_slug] || wellness;
}

export function productImages(product: Product): string[] {
  const list = [
    product.image_url,
    product.image_url_2,
    product.lifestyle_image_url,
    product.image_url_4,
    product.image_url_5,
  ].filter((value): value is string => Boolean(value));
  return list.length > 0 ? [...new Set(list)] : [productImage(product)];
}

export function discountPercent(product: Pick<Product, "price" | "mrp">): number | null {
  if (!product.mrp || product.mrp <= product.price) return null;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}

/** Normalises the editable pack-size options stored on a product. */
export function parseVariants(value: unknown): ProductVariant[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const row = entry as Record<string, unknown>;
      const label = String(row["label"] ?? "").trim();
      const price = Number(row["price"]);
      if (!label || !Number.isFinite(price) || price <= 0) return null;
      const mrpRaw = Number(row["mrp"]);
      return {
        label,
        price,
        mrp: Number.isFinite(mrpRaw) && mrpRaw > 0 ? mrpRaw : null,
      } satisfies ProductVariant;
    })
    .filter((entry): entry is ProductVariant => entry !== null);
}

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      ...row,
      price: Number(row.price),
      mrp: row.mrp === null ? null : Number(row.mrp),
      variants: parseVariants(row.variants),
    })) as unknown as Product[];
  },
  staleTime: 60_000,
});

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Category[];
  },
  staleTime: 60_000,
});

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) throw error;
    const map = new Map((data ?? []).map((row) => [row.key, row.value as Record<string, unknown>]));
    const brand = (map.get("brand") ?? {}) as Partial<BrandSettings>;
    const contact = (map.get("contact") ?? {}) as Partial<ContactSettings>;
    const shipping = (map.get("shipping") ?? {}) as Partial<ShippingConfig>;
    return {
      brand: {
        logoUrl: brand.logoUrl ?? null,
        brandName: brand.brandName ?? "ANKURA",
        subBrand: brand.subBrand ?? "by ORGNATURE",
        heroImageUrl: brand.heroImageUrl ?? null,
        aboutImageUrl: brand.aboutImageUrl ?? null,
        wellnessImageUrl: brand.wellnessImageUrl ?? null,
      } satisfies BrandSettings,
      contact: { ...CONTACT_DEFAULTS, ...contact } as ContactSettings,
      shipping: { ...SHIPPING_DEFAULTS, ...shipping } as ShippingConfig,
    };
  },
  staleTime: 60_000,
});

export function searchProducts(products: Product[], term: string): Product[] {
  const q = term.trim().toLowerCase();
  if (!q) return products;
  const words = q.split(/\s+/);
  return products.filter((product) => {
    const haystack = [
      product.name,
      product.category_slug.replace(/-/g, " "),
      product.short_description ?? "",
      product.description ?? "",
      product.ingredients ?? "",
      product.product_type ?? "",
      product.pack_size ?? "",
      product.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}
