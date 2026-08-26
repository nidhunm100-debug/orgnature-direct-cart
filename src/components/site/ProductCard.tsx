import { Link } from "@tanstack/react-router";
import { Eye, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { discountPercent, productImage, type Product } from "@/lib/catalog";
import { formatINR } from "@/lib/store-config";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
  onQuickView,
}: {
  product: Product;
  className?: string;
  onQuickView?: (product: Product) => void;
}) {
  const { addItem, setDrawerOpen } = useCart();
  const discount = discountPercent(product);

  return (
    <article
      className={cn(
        "surface-card lift-hover group flex h-full flex-col overflow-hidden",
        !product.available && "opacity-70",
        className,
      )}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-ivory"
      >
        <img
          src={productImage(product)}
          alt={`${product.name} — AnKura by Orgnature`}
          loading="lazy"
          width={600}
          height={600}
          className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.05]"
        />
        {discount !== null && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-primary-foreground">
            {discount}% OFF
          </span>
        )}
        {!product.available && (
          <span className="absolute top-3 right-3 rounded-full bg-earth px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-primary-foreground">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="eyebrow">{product.product_type ?? "AnKura"}</p>
        <h3 className="mt-1.5 font-display text-lg leading-snug text-foreground">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        {product.short_description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {product.short_description}
          </p>
        )}
        {product.pack_size && (
          <p className="mt-2 text-xs font-medium tracking-wide text-earth">{product.pack_size}</p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-xl text-primary">{formatINR(product.price)}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(product.mrp)}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 pt-1 sm:flex-row">
          <Button
            className="h-11 flex-1 rounded-full text-xs font-semibold tracking-wider uppercase"
            disabled={!product.available}
            onClick={() => {
              addItem(product, 1);
              setDrawerOpen(true);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingBag className="mr-1.5 h-4 w-4" />
            Add to cart
          </Button>
          {onQuickView ? (
            <Button
              variant="outline"
              className="h-11 rounded-full text-xs font-semibold tracking-wider uppercase sm:w-11 sm:px-0"
              onClick={() => onQuickView(product)}
              aria-label={`Quick view ${product.name}`}
            >
              <Eye className="h-4 w-4" />
              <span className="sm:hidden">Quick view</span>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full text-xs font-semibold tracking-wider uppercase sm:w-11 sm:px-0"
            >
              <Link
                to="/product/$slug"
                params={{ slug: product.slug }}
                aria-label={`View ${product.name}`}
              >
                <Eye className="h-4 w-4" />
                <span className="sm:hidden">View product</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
