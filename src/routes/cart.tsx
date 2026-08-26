import { Link, createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { QuantitySelector } from "@/components/site/QuantitySelector";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { useCart } from "@/lib/cart";
import { deliveryLabel, formatINR } from "@/lib/store-config";

const TITLE = "Your Cart | AnKura by Orgnature";
const DESCRIPTION =
  "Review your AnKura by Orgnature cart, adjust quantities and send your order on WhatsApp — no account or online payment required.";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQuantity, removeItem, clear, hydrated } = useCart();
  const { shipping } = useSettings();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-3xl sm:text-4xl">Your cart</h1>

        {!hydrated ? (
          <div className="mt-8 h-40 animate-pulse rounded-2xl bg-muted/60" />
        ) : items.length === 0 ? (
          <div className="surface-card mt-8 p-10 text-center">
            <h2 className="font-display text-xl">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a few natural essentials and send your order on WhatsApp.
            </p>
            <Button asChild className="mt-6 h-12 rounded-full px-7 text-xs tracking-wider uppercase">
              <Link to="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="surface-card flex gap-4 p-4">
                  <Link
                    to="/product/$slug"
                    params={{ slug: item.slug }}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ivory"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-2"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/product/$slug"
                      params={{ slug: item.slug }}
                      className="font-display text-lg leading-snug hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    {item.packSize && (
                      <p className="mt-0.5 text-xs text-earth">{item.packSize}</p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatINR(item.price)} each
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(value) => setQuantity(item.id, value)}
                        label={`Quantity for ${item.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-display text-lg text-primary">
                    {formatINR(item.price * item.quantity)}
                  </p>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs text-muted-foreground underline hover:text-destructive"
                >
                  Clear cart
                </button>
              </li>
            </ul>

            <aside className="surface-card h-fit p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-xl">Order summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="font-medium">{deliveryLabel(shipping, subtotal)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-display">Total</dt>
                  <dd className="font-display text-primary">{formatINR(subtotal)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">{shipping.note}</p>
              <Button
                asChild
                className="mt-6 h-13 w-full rounded-full text-xs font-semibold tracking-wider uppercase"
              >
                <Link to="/order">Continue to order details</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="mt-2 h-12 w-full rounded-full text-xs tracking-wider uppercase"
              >
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
