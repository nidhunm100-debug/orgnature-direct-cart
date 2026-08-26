import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { productImage, productsQuery, searchProducts } from "@/lib/catalog";
import { formatINR } from "@/lib/store-config";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [term, setTerm] = useState("");
  const { data: products = [] } = useQuery(productsQuery);
  const results = term.trim() ? searchProducts(products, term).slice(0, 8) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[12%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search millet, oils, ghee, tea…"
            aria-label="Search products"
            className="h-14 flex-1 bg-transparent text-base focus:outline-none"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm("")}
              aria-label="Clear search"
              className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {term.trim() === "" ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">
              Search by product name, category, pack size or ingredient.
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">
              No products found for “{term}”.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent"
                  >
                    <img
                      src={productImage(product)}
                      alt={product.name}
                      loading="lazy"
                      width={96}
                      height={96}
                      className="h-12 w-12 rounded-lg border border-border bg-ivory object-contain p-1"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{product.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {product.pack_size}
                      </span>
                    </span>
                    <span className="text-sm text-primary">{formatINR(product.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {term.trim() !== "" && (
          <div className="border-t border-border px-4 py-3">
            <Link
              to="/shop"
              search={{ q: term }}
              onClick={() => onOpenChange(false)}
              className="text-sm font-medium text-primary hover:underline"
            >
              See all results for “{term}”
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
