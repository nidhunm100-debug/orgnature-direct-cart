import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo } from "react";

import { ProductCard } from "@/components/site/ProductCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categoriesQuery, productsQuery, searchProducts, type Product } from "@/lib/catalog";
import { formatINR } from "@/lib/store-config";

const TITLE = "Shop All Natural Products | AnKura by Orgnature";
const DESCRIPTION =
  "Browse the full AnKura by Orgnature range — cold-pressed oils, millets, health mixes, herbal teas, ghee, flours, spices and snacks. Filter, sort and order on WhatsApp.";

type Search = {
  q?: string | undefined;
  category?: string | undefined;
  sort?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  availability?: string | undefined;
};

function str(value: unknown): string | undefined {
  return typeof value === "string" && value ? value.slice(0, 80) : undefined;
}

function num(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: str(search["q"]),
    category: str(search["category"]),
    sort: str(search["sort"]),
    min: num(search["min"]),
    max: num(search["max"]),
    availability: str(search["availability"]),
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

export function sortProducts(products: Product[], sort: string | undefined): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return list.sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    default:
      return list;
  }
}

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);

  const update = (patch: Partial<Search>) => {
    navigate({ search: (prev) => ({ ...prev, ...patch }), resetScroll: false });
  };

  const results = useMemo(() => {
    let list = searchProducts(products, search.q ?? "");
    if (search.category) list = list.filter((p) => p.category_slug === search.category);
    if (search.min !== undefined) list = list.filter((p) => p.price >= search.min!);
    if (search.max !== undefined) list = list.filter((p) => p.price <= search.max!);
    if (search.availability === "in-stock") list = list.filter((p) => p.available);
    return sortProducts(list, search.sort);
  }, [products, search]);

  const activeFilters =
    (search.category ? 1 : 0) +
    (search.min !== undefined ? 1 : 0) +
    (search.max !== undefined ? 1 : 0) +
    (search.availability ? 1 : 0);

  const filters = (
    <div className="space-y-7">
      <div>
        <p className="eyebrow mb-3">Category</p>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => update({ category: undefined })}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              !search.category ? "bg-primary/10 font-medium text-primary" : "hover:bg-accent"
            }`}
          >
            All categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => update({ category: category.slug })}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                search.category === category.slug
                  ? "bg-primary/10 font-medium text-primary"
                  : "hover:bg-accent"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Price range (₹)</p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="min-price" className="sr-only">
              Minimum price
            </Label>
            <Input
              id="min-price"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Min"
              value={search.min ?? ""}
              onChange={(event) =>
                update({ min: event.target.value === "" ? undefined : Number(event.target.value) })
              }
            />
          </div>
          <span className="text-muted-foreground">—</span>
          <div className="flex-1">
            <Label htmlFor="max-price" className="sr-only">
              Maximum price
            </Label>
            <Input
              id="max-price"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Max"
              value={search.max ?? ""}
              onChange={(event) =>
                update({ max: event.target.value === "" ? undefined : Number(event.target.value) })
              }
            />
          </div>
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Availability</p>
        <button
          type="button"
          onClick={() =>
            update({ availability: search.availability === "in-stock" ? undefined : "in-stock" })
          }
          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            search.availability === "in-stock"
              ? "bg-primary/10 font-medium text-primary"
              : "hover:bg-accent"
          }`}
        >
          In stock only
        </button>
      </div>

      {activeFilters > 0 && (
        <Button
          variant="outline"
          className="h-11 w-full rounded-full text-xs tracking-wider uppercase"
          onClick={() =>
            update({
              category: undefined,
              min: undefined,
              max: undefined,
              availability: undefined,
            })
          }
        >
          <X className="mr-1.5 h-4 w-4" /> Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <SiteLayout>
      <div className="border-b border-border bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Shop</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl">All products</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Natural, wholesome staples for your kitchen — order any combination and confirm on
            WhatsApp.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:flex">
        <aside className="hidden w-64 shrink-0 lg:block">{filters}</aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <Label htmlFor="shop-search" className="sr-only">
                Search products
              </Label>
              <Input
                id="shop-search"
                type="search"
                placeholder="Search products, ingredients, categories…"
                value={search.q ?? ""}
                onChange={(event) => update({ q: event.target.value || undefined })}
                className="h-11 rounded-full"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 rounded-full text-xs tracking-wider uppercase lg:hidden"
                >
                  <SlidersHorizontal className="mr-1.5 h-4 w-4" />
                  Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] overflow-y-auto sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle className="font-display text-xl">Filters</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-10">{filters}</div>
              </SheetContent>
            </Sheet>

            <Select
              value={search.sort ?? "featured"}
              onValueChange={(value) => update({ sort: value === "featured" ? undefined : value })}
            >
              <SelectTrigger className="h-11 w-full rounded-full sm:w-52" aria-label="Sort products">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Recommended</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
            {isLoading
              ? "Loading products…"
              : `${results.length} product${results.length === 1 ? "" : "s"}${
                  search.q ? ` for “${search.q}”` : ""
                }`}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="surface-card h-80 animate-pulse bg-muted/60" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="surface-card p-10 text-center">
              <h2 className="font-display text-xl">No products matched</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different search term or clear your filters.
              </p>
              <Button
                variant="outline"
                className="mt-5 h-11 rounded-full px-6 text-xs tracking-wider uppercase"
                onClick={() =>
                  navigate({ search: {}, resetScroll: false })
                }
              >
                Reset all
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {results.length > 0 && (
            <p className="mt-8 text-xs text-muted-foreground">
              Prices from {formatINR(Math.min(...results.map((p) => p.price)))} to{" "}
              {formatINR(Math.max(...results.map((p) => p.price)))}.
            </p>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
