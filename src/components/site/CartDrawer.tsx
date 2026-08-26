import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { QuantitySelector } from "@/components/site/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSettings } from "@/hooks/use-settings";
import { useCart } from "@/lib/cart";
import { deliveryLabel, formatINR } from "@/lib/store-config";

export function CartDrawer() {
  const { items, count, subtotal, drawerOpen, setDrawerOpen, setQuantity, removeItem } = useCart();
  const { shipping } = useSettings();

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="font-display text-xl">
            Your cart{count > 0 ? ` · ${count} item${count === 1 ? "" : "s"}` : ""}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="font-display text-xl text-foreground">
              Your cart is waiting for something natural.
            </p>
            <p className="text-sm text-muted-foreground">
              Discover wholesome products for your everyday kitchen and wellness.
            </p>
            <Button asChild className="h-12 rounded-full px-7 tracking-wider uppercase">
              <Link to="/shop" onClick={() => setDrawerOpen(false)}>
                Explore products
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <Link
                    to="/product/$slug"
                    params={{ slug: item.slug }}
                    onClick={() => setDrawerOpen(false)}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-ivory"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      width={160}
                      height={160}
                      className="h-full w-full object-contain p-1.5"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                    {item.packSize && (
                      <p className="text-xs text-muted-foreground">{item.packSize}</p>
                    )}
                    <p className="mt-0.5 text-sm text-primary">{formatINR(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(value) => setQuantity(item.id, value)}
                        className="h-9 [&_button]:h-9 [&_button]:w-9 [&_input]:h-9"
                        label={`Quantity for ${item.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatINR(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-border bg-cream px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>{deliveryLabel(shipping, subtotal)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-display text-lg">
                <span>Total</span>
                <span className="text-primary">{formatINR(subtotal)}</span>
              </div>
              <Button
                asChild
                className="h-13 w-full rounded-full bg-whatsapp py-3.5 text-sm font-semibold tracking-wider text-whatsapp-foreground uppercase hover:bg-whatsapp hover:brightness-95"
              >
                <Link to="/order" onClick={() => setDrawerOpen(false)}>
                  Order on WhatsApp
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="h-11 flex-1 rounded-full text-xs tracking-wider uppercase"
                >
                  <Link to="/cart" onClick={() => setDrawerOpen(false)}>
                    View cart
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="h-11 flex-1 rounded-full text-xs tracking-wider uppercase"
                  onClick={() => setDrawerOpen(false)}
                >
                  Continue shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
