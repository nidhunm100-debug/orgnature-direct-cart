import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { BrandMark } from "@/components/site/BrandMark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  deleteCategory,
  deleteProduct,
  emptyProduct,
  saveCategory,
  saveProduct,
  saveSetting,
  slugify,
  type ProductDraft,
} from "@/lib/admin";
import { categoriesQuery, productsQuery, settingsQuery, type Category } from "@/lib/catalog";
import { CONTACT_DEFAULTS, SHIPPING_DEFAULTS, formatINR } from "@/lib/store-config";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Store Admin | AnKura by Orgnature" },
      {
        name: "description",
        content: "Manage AnKura by Orgnature products, categories, branding and store settings.",
      },
      { property: "og:title", content: "Store Admin | AnKura by Orgnature" },
      { property: "og:description", content: "Manage products, categories and store settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function AdminPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: settings } = useQuery(settingsQuery);

  const [productDraft, setProductDraft] = useState<ProductDraft | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);

  const brand = settings?.brand ?? {
    logoUrl: null,
    brandName: "ANKURA",
    subBrand: "by ORGNATURE",
    heroImageUrl: null,
    aboutImageUrl: null,
    wellnessImageUrl: null,
  };
  const contact = settings?.contact ?? CONTACT_DEFAULTS;
  const shipping = settings?.shipping ?? SHIPPING_DEFAULTS;

  const [brandForm, setBrandForm] = useState(brand);
  const [contactForm, setContactForm] = useState(contact);
  const [shippingForm, setShippingForm] = useState(shipping);
  const [loadedSettings, setLoadedSettings] = useState(false);

  if (settings && !loadedSettings) {
    setBrandForm(settings.brand);
    setContactForm(settings.contact);
    setShippingForm(settings.shipping);
    setLoadedSettings(true);
  }

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["products"] }),
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
      queryClient.invalidateQueries({ queryKey: ["site_settings"] }),
    ]);
  };

  const runSave = async (action: () => Promise<void>, successMessage: string) => {
    setBusy(true);
    try {
      await action();
      await refresh();
      toast.success(successMessage);
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <BrandMark compact />
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold tracking-widest text-primary uppercase">
            Admin
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" className="h-10 rounded-full text-xs uppercase">
              <Link to="/">View store</Link>
            </Button>
            <Button
              variant="outline"
              onClick={signOut}
              className="h-10 rounded-full text-xs uppercase"
            >
              <LogOut className="mr-1.5 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl">Store management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything customers see — products, prices, images, categories, branding, contact details
          and delivery rules — is editable here.
        </p>

        <Tabs defaultValue="products" className="mt-8">
          <TabsList className="flex-wrap">
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="settings">Contact &amp; delivery</TabsTrigger>
          </TabsList>

          {/* PRODUCTS */}
          <TabsContent value="products" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">Catalogue</h2>
              <Button
                className="h-11 rounded-full text-xs uppercase"
                onClick={() => setProductDraft(emptyProduct())}
              >
                <Plus className="mr-1.5 h-4 w-4" /> Add product
              </Button>
            </div>

            <div className="surface-card divide-y divide-border">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ivory">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.category_slug} · {product.pack_size ?? "—"} ·{" "}
                      {formatINR(product.price)}
                      {product.available ? "" : " · out of stock"}
                      {product.featured ? " · featured" : ""}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => setProductDraft({ ...product })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => {
                        if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`))
                          return;
                        void runSave(() => deleteProduct(product.id), "Product deleted");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* CATEGORIES */}
          <TabsContent value="categories" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">Categories</h2>
              <Button
                className="h-11 rounded-full text-xs uppercase"
                onClick={() =>
                  setCategoryDraft({
                    id: "",
                    slug: "",
                    name: "",
                    tagline: null,
                    description: null,
                    image_url: null,
                    sort_order: 100,
                  })
                }
              >
                <Plus className="mr-1.5 h-4 w-4" /> Add category
              </Button>
            </div>

            <div className="surface-card divide-y divide-border">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-4 p-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ivory">
                    {category.image_url && (
                      <img src={category.image_url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{category.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      /{category.slug} · {category.tagline ?? "—"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Edit ${category.name}`}
                      onClick={() => setCategoryDraft({ ...category })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => {
                        if (!window.confirm(`Delete category “${category.name}”?`)) return;
                        void runSave(() => deleteCategory(category.id), "Category deleted");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* BRANDING */}
          <TabsContent value="branding" className="mt-6">
            <div className="surface-card space-y-5 p-6">
              <h2 className="font-display text-xl">Logo &amp; brand</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Brand name">
                  <Input
                    value={brandForm.brandName}
                    onChange={(event) =>
                      setBrandForm({ ...brandForm, brandName: event.target.value })
                    }
                    className="h-11"
                  />
                </Field>
                <Field label="Sub-brand line">
                  <Input
                    value={brandForm.subBrand}
                    onChange={(event) => setBrandForm({ ...brandForm, subBrand: event.target.value })}
                    className="h-11"
                  />
                </Field>
              </div>
              <ImageUploadField
                label="Logo"
                folder="branding"
                value={brandForm.logoUrl}
                onChange={(value) => setBrandForm({ ...brandForm, logoUrl: value })}
              />
              <ImageUploadField
                label="Homepage hero image"
                folder="branding"
                value={brandForm.heroImageUrl}
                onChange={(value) => setBrandForm({ ...brandForm, heroImageUrl: value })}
              />
              <ImageUploadField
                label="About / story image"
                folder="branding"
                value={brandForm.aboutImageUrl}
                onChange={(value) => setBrandForm({ ...brandForm, aboutImageUrl: value })}
              />
              <ImageUploadField
                label="Lifestyle image"
                folder="branding"
                value={brandForm.wellnessImageUrl}
                onChange={(value) => setBrandForm({ ...brandForm, wellnessImageUrl: value })}
              />
              <Button
                disabled={busy}
                className="h-12 rounded-full px-8 text-xs uppercase"
                onClick={() =>
                  void runSave(
                    () => saveSetting("brand", { ...brandForm }),
                    "Branding saved",
                  )
                }
              >
                Save branding
              </Button>
            </div>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings" className="mt-6 space-y-6">
            <div className="surface-card space-y-5 p-6">
              <h2 className="font-display text-xl">Contact details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="WhatsApp number (with country code, digits only)">
                  <Input
                    value={contactForm.whatsapp}
                    onChange={(event) =>
                      setContactForm({
                        ...contactForm,
                        whatsapp: event.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="h-11"
                  />
                </Field>
                <Field label="Primary phone">
                  <Input
                    value={contactForm.phone}
                    onChange={(event) => setContactForm({ ...contactForm, phone: event.target.value })}
                    className="h-11"
                  />
                </Field>
                <Field label="Alternate phone">
                  <Input
                    value={contactForm.phoneAlt}
                    onChange={(event) =>
                      setContactForm({ ...contactForm, phoneAlt: event.target.value })
                    }
                    className="h-11"
                  />
                </Field>
                <Field label="Email">
                  <Input
                    value={contactForm.email}
                    onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })}
                    className="h-11"
                  />
                </Field>
                <Field label="Website">
                  <Input
                    value={contactForm.website}
                    onChange={(event) =>
                      setContactForm({ ...contactForm, website: event.target.value })
                    }
                    className="h-11"
                  />
                </Field>
                <Field label="Address">
                  <Input
                    value={contactForm.address}
                    onChange={(event) =>
                      setContactForm({ ...contactForm, address: event.target.value })
                    }
                    className="h-11"
                  />
                </Field>
              </div>
              <Button
                disabled={busy}
                className="h-12 rounded-full px-8 text-xs uppercase"
                onClick={() =>
                  void runSave(
                    () => saveSetting("contact", { ...contactForm }),
                    "Contact details saved",
                  )
                }
              >
                Save contact details
              </Button>
            </div>

            <div className="surface-card space-y-5 p-6">
              <h2 className="font-display text-xl">Delivery &amp; shipping</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Delivery mode">
                  <Select
                    value={shippingForm.mode}
                    onValueChange={(value) =>
                      setShippingForm({
                        ...shippingForm,
                        mode: value as typeof shippingForm.mode,
                      })
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to_be_confirmed">
                        Confirm on WhatsApp (recommended)
                      </SelectItem>
                      <SelectItem value="flat">Flat rate</SelectItem>
                      <SelectItem value="free_above">Free above a cart value</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Flat delivery charge (₹)">
                  <Input
                    type="number"
                    min={0}
                    value={shippingForm.flatRate}
                    onChange={(event) =>
                      setShippingForm({ ...shippingForm, flatRate: Number(event.target.value) || 0 })
                    }
                    className="h-11"
                  />
                </Field>
                <Field label="Free delivery above (₹, leave blank to disable)">
                  <Input
                    type="number"
                    min={0}
                    value={shippingForm.freeAbove ?? ""}
                    onChange={(event) =>
                      setShippingForm({
                        ...shippingForm,
                        freeAbove: event.target.value === "" ? null : Number(event.target.value),
                      })
                    }
                    className="h-11"
                  />
                </Field>
                <Field label="Note shown to customers" className="sm:col-span-2">
                  <Textarea
                    value={shippingForm.note}
                    onChange={(event) => setShippingForm({ ...shippingForm, note: event.target.value })}
                    className="min-h-20"
                  />
                </Field>
              </div>
              <Button
                disabled={busy}
                className="h-12 rounded-full px-8 text-xs uppercase"
                onClick={() =>
                  void runSave(
                    () => saveSetting("shipping", { ...shippingForm }),
                    "Delivery settings saved",
                  )
                }
              >
                Save delivery settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* PRODUCT DIALOG */}
      <Dialog open={productDraft !== null} onOpenChange={(open) => !open && setProductDraft(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {productDraft?.id ? "Edit product" : "New product"}
            </DialogTitle>
            <DialogDescription>
              All fields here appear on the storefront and in WhatsApp order messages.
            </DialogDescription>
          </DialogHeader>

          {productDraft && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Product name">
                <Input
                  value={productDraft.name}
                  onChange={(event) =>
                    setProductDraft({
                      ...productDraft,
                      name: event.target.value,
                      slug: productDraft.id ? productDraft.slug : slugify(event.target.value),
                    })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="URL slug">
                <Input
                  value={productDraft.slug}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, slug: slugify(event.target.value) })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="Category">
                <Select
                  value={productDraft.category_slug}
                  onValueChange={(value) =>
                    setProductDraft({ ...productDraft, category_slug: value })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Product type / label">
                <Input
                  value={productDraft.product_type ?? ""}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, product_type: event.target.value || null })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="Selling price (₹)">
                <Input
                  type="number"
                  min={0}
                  value={productDraft.price}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, price: Number(event.target.value) || 0 })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="MRP (₹, optional)">
                <Input
                  type="number"
                  min={0}
                  value={productDraft.mrp ?? ""}
                  onChange={(event) =>
                    setProductDraft({
                      ...productDraft,
                      mrp: event.target.value === "" ? null : Number(event.target.value),
                    })
                  }
                  className="h-11"
                />
              </Field>
              <Field
                label="Pack size options (e.g. 100g, 250g, 500g, 1kg)"
                className="sm:col-span-2"
              >
                <div className="space-y-2">
                  {(productDraft.variants ?? []).map((option, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-2">
                      <Input
                        aria-label={`Option ${index + 1} label`}
                        placeholder="250 g"
                        value={option.label}
                        onChange={(event) => {
                          const next = [...(productDraft.variants ?? [])];
                          next[index] = { ...option, label: event.target.value };
                          setProductDraft({ ...productDraft, variants: next });
                        }}
                        className="h-11 w-32"
                      />
                      <Input
                        aria-label={`Option ${index + 1} price`}
                        type="number"
                        min={0}
                        placeholder="Price ₹"
                        value={option.price}
                        onChange={(event) => {
                          const next = [...(productDraft.variants ?? [])];
                          next[index] = { ...option, price: Number(event.target.value) || 0 };
                          setProductDraft({ ...productDraft, variants: next });
                        }}
                        className="h-11 w-28"
                      />
                      <Input
                        aria-label={`Option ${index + 1} MRP`}
                        type="number"
                        min={0}
                        placeholder="MRP ₹"
                        value={option.mrp ?? ""}
                        onChange={(event) => {
                          const next = [...(productDraft.variants ?? [])];
                          next[index] = {
                            ...option,
                            mrp: event.target.value === "" ? null : Number(event.target.value),
                          };
                          setProductDraft({ ...productDraft, variants: next });
                        }}
                        className="h-11 w-28"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full text-xs uppercase"
                        onClick={() =>
                          setProductDraft({
                            ...productDraft,
                            variants: (productDraft.variants ?? []).filter((_, i) => i !== index),
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-full text-xs uppercase"
                    onClick={() =>
                      setProductDraft({
                        ...productDraft,
                        variants: [
                          ...(productDraft.variants ?? []),
                          { label: "", price: productDraft.price || 0, mrp: null },
                        ],
                      })
                    }
                  >
                    Add pack size option
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to sell a single pack size using the price and pack size fields above.
                  </p>
                </div>
              </Field>
              <Field label="Pack size (used when no options are added)">
                <Input
                  value={productDraft.pack_size ?? ""}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, pack_size: event.target.value || null })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="Sort order (lower shows first)">
                <Input
                  type="number"
                  value={productDraft.sort_order}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, sort_order: Number(event.target.value) || 0 })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="Short description" className="sm:col-span-2">
                <Textarea
                  value={productDraft.short_description ?? ""}
                  onChange={(event) =>
                    setProductDraft({
                      ...productDraft,
                      short_description: event.target.value || null,
                    })
                  }
                  className="min-h-16"
                />
              </Field>
              <Field label="Full description" className="sm:col-span-2">
                <Textarea
                  value={productDraft.description ?? ""}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, description: event.target.value || null })
                  }
                  className="min-h-28"
                />
              </Field>
              <Field label="Benefits (one per line)" className="sm:col-span-2">
                <Textarea
                  value={productDraft.benefits ?? ""}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, benefits: event.target.value || null })
                  }
                  className="min-h-24"
                />
              </Field>
              <Field label="Ingredients">
                <Textarea
                  value={productDraft.ingredients ?? ""}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, ingredients: event.target.value || null })
                  }
                  className="min-h-20"
                />
              </Field>
              <Field label="Nutrition">
                <Textarea
                  value={productDraft.nutrition ?? ""}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, nutrition: event.target.value || null })
                  }
                  className="min-h-20"
                />
              </Field>
              <Field label="How to use">
                <Textarea
                  value={productDraft.preparation ?? ""}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, preparation: event.target.value || null })
                  }
                  className="min-h-20"
                />
              </Field>
              <Field label="Storage">
                <Textarea
                  value={productDraft.storage ?? ""}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, storage: event.target.value || null })
                  }
                  className="min-h-20"
                />
              </Field>
              <Field label="Allergen information">
                <Input
                  value={productDraft.allergens ?? ""}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, allergens: event.target.value || null })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="Tags (comma separated)">
                <Input
                  value={productDraft.tags.join(", ")}
                  onChange={(event) =>
                    setProductDraft({
                      ...productDraft,
                      tags: event.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="Additional details" className="sm:col-span-2">
                <Textarea
                  value={productDraft.additional_details ?? ""}
                  onChange={(event) =>
                    setProductDraft({
                      ...productDraft,
                      additional_details: event.target.value || null,
                    })
                  }
                  className="min-h-20"
                />
              </Field>

              <div className="space-y-4 sm:col-span-2">
                <ImageUploadField
                  label="Main product image"
                  folder="products"
                  value={productDraft.image_url}
                  onChange={(value) => setProductDraft({ ...productDraft, image_url: value })}
                />
                <ImageUploadField
                  label="Second image"
                  folder="products"
                  value={productDraft.image_url_2}
                  onChange={(value) => setProductDraft({ ...productDraft, image_url_2: value })}
                />
                <ImageUploadField
                  label="Lifestyle image"
                  folder="products"
                  value={productDraft.lifestyle_image_url}
                  onChange={(value) =>
                    setProductDraft({ ...productDraft, lifestyle_image_url: value })
                  }
                />
              </div>

              <div className="flex flex-wrap gap-6 sm:col-span-2">
                <label className="flex items-center gap-2.5 text-sm">
                  <Switch
                    checked={productDraft.available}
                    onCheckedChange={(checked) =>
                      setProductDraft({ ...productDraft, available: checked })
                    }
                  />
                  In stock
                </label>
                <label className="flex items-center gap-2.5 text-sm">
                  <Switch
                    checked={productDraft.featured}
                    onCheckedChange={(checked) =>
                      setProductDraft({ ...productDraft, featured: checked })
                    }
                  />
                  Featured on homepage
                </label>
                <label className="flex items-center gap-2.5 text-sm">
                  <Switch
                    checked={productDraft.best_seller}
                    onCheckedChange={(checked) =>
                      setProductDraft({ ...productDraft, best_seller: checked })
                    }
                  />
                  Best seller
                </label>
              </div>

              <div className="flex gap-3 sm:col-span-2">
                <Button
                  disabled={busy}
                  className="h-12 flex-1 rounded-full text-xs uppercase"
                  onClick={async () => {
                    if (!productDraft.name.trim() || !productDraft.category_slug) {
                      toast.error("Product name and category are required.");
                      return;
                    }
                    const ok = await runSave(() => saveProduct(productDraft), "Product saved");
                    if (ok) setProductDraft(null);
                  }}
                >
                  Save product
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full px-7 text-xs uppercase"
                  onClick={() => setProductDraft(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CATEGORY DIALOG */}
      <Dialog open={categoryDraft !== null} onOpenChange={(open) => !open && setCategoryDraft(null)}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {categoryDraft?.id ? "Edit category" : "New category"}
            </DialogTitle>
            <DialogDescription>
              Categories power the navigation menu and the shop filters.
            </DialogDescription>
          </DialogHeader>

          {categoryDraft && (
            <div className="space-y-5">
              <Field label="Category name">
                <Input
                  value={categoryDraft.name}
                  onChange={(event) =>
                    setCategoryDraft({
                      ...categoryDraft,
                      name: event.target.value,
                      slug: categoryDraft.id ? categoryDraft.slug : slugify(event.target.value),
                    })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="URL slug">
                <Input
                  value={categoryDraft.slug}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, slug: slugify(event.target.value) })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="Tagline">
                <Input
                  value={categoryDraft.tagline ?? ""}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, tagline: event.target.value || null })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="Description">
                <Textarea
                  value={categoryDraft.description ?? ""}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, description: event.target.value || null })
                  }
                  className="min-h-24"
                />
              </Field>
              <Field label="Sort order">
                <Input
                  type="number"
                  value={categoryDraft.sort_order}
                  onChange={(event) =>
                    setCategoryDraft({
                      ...categoryDraft,
                      sort_order: Number(event.target.value) || 0,
                    })
                  }
                  className="h-11"
                />
              </Field>
              <ImageUploadField
                label="Category image"
                folder="categories"
                value={categoryDraft.image_url}
                onChange={(value) => setCategoryDraft({ ...categoryDraft, image_url: value })}
              />
              <div className="flex gap-3">
                <Button
                  disabled={busy}
                  className="h-12 flex-1 rounded-full text-xs uppercase"
                  onClick={async () => {
                    if (!categoryDraft.name.trim()) {
                      toast.error("Category name is required.");
                      return;
                    }
                    const ok = await runSave(() => saveCategory(categoryDraft), "Category saved");
                    if (ok) setCategoryDraft(null);
                  }}
                >
                  Save category
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full px-7 text-xs uppercase"
                  onClick={() => setCategoryDraft(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
