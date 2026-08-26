import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/store-config";

/** Sticky bottom bar on mobile once the cart has items. */
export function MobileOrderBar() {
  const { count, subtotal } = useCart();
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur-md sm:hidden">
      <div className="flex items-center gap-3">
        <Link
          to="/cart"
          className="flex flex-1 items-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-medium"
        >
          <ShoppingBag className="h-4 w-4" />
          {count} item{count === 1 ? "" : "s"} · {formatINR(subtotal)}
        </Link>
        <Link
          to="/order"
          className="rounded-full bg-whatsapp px-5 py-3 text-xs font-semibold tracking-wider text-whatsapp-foreground uppercase"
        >
          Order
        </Link>
      </div>
    </div>
  );
}
