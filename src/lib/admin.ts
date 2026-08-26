import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "@/lib/catalog";

export const BUCKET = "product-images";

export type ProductDraft = Omit<Product, "created_at">;

export function emptyProduct(): ProductDraft {
  return {
    id: "",
    slug: "",
    name: "",
    category_slug: "",
    subcategory: null,
    short_description: null,
    description: null,
    price: 0,
    mrp: null,
    pack_size: null,
    image_url: null,
    image_url_2: null,
    lifestyle_image_url: null,
    ingredients: null,
    nutrition: null,
    benefits: null,
    preparation: null,
    storage: null,
    allergens: null,
    additional_details: null,
    tags: [],
    variants: [],
    featured: false,
    best_seller: false,
    available: true,
    product_type: null,
    sort_order: 100,
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Uploads a file to the images bucket and returns a signed-free public path. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
  if (!data?.signedUrl) throw new Error("Could not create a URL for the uploaded image.");
  return data.signedUrl;
}

export async function saveProduct(draft: ProductDraft): Promise<void> {
  const payload = {
    slug: draft.slug || slugify(draft.name),
    name: draft.name,
    category_slug: draft.category_slug,
    subcategory: draft.subcategory,
    short_description: draft.short_description,
    description: draft.description,
    price: draft.price,
    mrp: draft.mrp,
    pack_size: draft.pack_size,
    image_url: draft.image_url,
    image_url_2: draft.image_url_2,
    lifestyle_image_url: draft.lifestyle_image_url,
    ingredients: draft.ingredients,
    nutrition: draft.nutrition,
    benefits: draft.benefits,
    preparation: draft.preparation,
    storage: draft.storage,
    allergens: draft.allergens,
    additional_details: draft.additional_details,
    tags: draft.tags,
    variants: draft.variants as unknown as never,
    featured: draft.featured,
    best_seller: draft.best_seller,
    available: draft.available,
    product_type: draft.product_type,
    sort_order: draft.sort_order,
  };

  if (draft.id) {
    const { error } = await supabase.from("products").update(payload).eq("id", draft.id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("products").insert(payload);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function saveCategory(draft: Category): Promise<void> {
  const payload = {
    slug: draft.slug || slugify(draft.name),
    name: draft.name,
    tagline: draft.tagline,
    description: draft.description,
    image_url: draft.image_url,
    sort_order: draft.sort_order,
  };
  if (draft.id) {
    const { error } = await supabase.from("categories").update(payload).eq("id", draft.id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("categories").insert(payload);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function saveSetting(key: string, value: Record<string, unknown>): Promise<void> {
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { key, value: value as unknown as never, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );
  if (error) throw error;
}
