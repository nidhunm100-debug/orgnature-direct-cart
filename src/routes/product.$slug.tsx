import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProductCard } from "@/components/site/ProductCard";
import { QuantitySelector } from "@/components/site/QuantitySelector";
import { SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { useCart } from "@/lib/cart";
import { discountPercent, productImages, productsQuery } from "@/lib/catalog";
import { deliveryLabel, formatINR } from "@/lib/store-config";
import { generateSingleProductMessage } from "@/lib/whatsapp";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const pretty = params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const title = `${pretty} | AnKura by Orgnature`;
    const description = `Buy ${pretty} from AnKura by Orgnature — natural, preservative-free and traditionally made. Order on WhatsApp, no online payment needed.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function DetailBlock({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="border-t border-border py-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
        {value}
      </p>
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { addItem, setDrawerOpen } = useCart();
  const { shipping } = useSettings();
  const [quantity, setQuantity] = useState(1);
  const [variantIndex, setVariantIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find((item) => item.slug === slug);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="surface-card aspect-square animate-pulse bg-muted/60" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded bg-muted/60" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted/60" />
              <div className="h-24 animate-pulse rounded bg-muted/60" />
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
          <h1 className="font-display text-3xl">Product not found</h1>
          <p className="mt-3 text-muted-foreground">
            This product may have been renamed or removed from the catalogue.
          </p>
          <Button asChild className="mt-6 h-12 rounded-full px-7 text-xs tracking-wider uppercase">
            <Link to="/shop">Back to shop</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const images = productImages(product);
  const variants = product.variants ?? [];
  const variant = variants[variantIndex] ?? null;
  const price = variant ? variant.price : product.price;
  const mrp = variant ? variant.mrp : product.mrp;
  const packLabel = variant ? variant.label : product.pack_size;
  const discount = discountPercent({ price, mrp });
  const related = products
    .filter((item) => item.category_slug === product.category_slug && item.id !== product.id)
    .slice(0, 4);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <Link
            to="/category/$slug"
            params={{ slug: product.category_slug }}
            className="hover:text-primary"
          >
            {product.category_slug.replace(/-/g, " ")}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="surface-card overflow-hidden bg-ivory">
              <img
                src={images[activeImage]}
                alt={`${product.name} — AnKura by Orgnature`}
                width={900}
                height={900}
                className="aspect-square w-full object-contain p-6"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`h-20 w-20 overflow-hidden rounded-xl border bg-ivory p-1.5 ${
                      activeImage === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="eyebrow">{product.product_type ?? "AnKura"}</p>
            <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">{product.name}</h1>
            {product.short_description && (
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {product.short_description}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl text-primary">{formatINR(price)}</span>
              {mrp && mrp > price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatINR(mrp)}
                </span>
              )}
              {discount !== null && (
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  Save {discount}%
                </span>
              )}
            </div>

            {variants.length > 0 && (
              <div className="mt-6">
                <p className="eyebrow">Choose pack size</p>
                <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Choose pack size">
                  {variants.map((option, index) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setVariantIndex(index)}
                      aria-pressed={index === variantIndex}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        index === variantIndex
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      <span>{option.label}</span>
                      <span className="ml-2 text-xs opacity-80">{formatINR(option.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
              {packLabel && <span>Pack size: {packLabel}</span>}
              <span className={product.available ? "text-leaf" : "text-destructive"}>
                {product.available ? "In stock" : "Currently out of stock"}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button
                className="h-12 flex-1 rounded-full px-7 text-xs font-semibold tracking-wider uppercase sm:flex-none"
                disabled={!product.available}
                onClick={() => {
                  addItem(product, quantity, variant);
                  setDrawerOpen(true);
                  toast.success(
                    `${product.name}${variant ? ` (${variant.label})` : ""} added to cart`,
                  );
                }}
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Add to cart
              </Button>
            </div>

            <div className="mt-3">
              <WhatsAppButton
                size="lg"
                className="w-full"
                message={generateSingleProductMessage({
                  name: product.name,
                  packSize: packLabel,
                  price,
                  quantity,
                })}
              >
                Order this on WhatsApp
              </WhatsAppButton>
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-cream p-4 text-sm text-muted-foreground">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-earth" />
              <span>
                Delivery charges: <strong className="text-foreground">{deliveryLabel(shipping, price * quantity)}</strong>. We
                confirm everything on WhatsApp before dispatch.
              </span>
            </div>

            {product.benefits && (
              <ul className="mt-6 space-y-2">
                {product.benefits
                  .split(/\n|•|;/)
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                      {line}
                    </li>
                  ))}
              </ul>
            )}

            <div className="mt-8">
              <DetailBlock label="Description" value={product.description} />
              <DetailBlock label="Ingredients" value={product.ingredients} />
              <DetailBlock label="Nutrition" value={product.nutrition} />
              <DetailBlock label="How to use" value={product.preparation} />
              <DetailBlock label="Storage" value={product.storage} />
              <DetailBlock label="Allergen information" value={product.allergens} />
              <DetailBlock label="Additional details" value={product.additional_details} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <p className="eyebrow">You may also like</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl">Related products</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
