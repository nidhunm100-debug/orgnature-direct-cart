import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "@/components/site/ProductCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { categoriesQuery, categoryImage, productsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const pretty = params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const title = `${pretty} | AnKura by Orgnature`;
    const description = `Shop ${pretty} from AnKura by Orgnature — natural, wholesome and traditionally made. Order on WhatsApp with no online payment.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products = [], isLoading } = useQuery(productsQuery);

  const category = categories.find((item) => item.slug === slug);
  const items = products.filter((product) => product.category_slug === slug);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-1.5">/</span>
              <Link to="/shop" className="hover:text-primary">
                Shop
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-foreground">{category?.name ?? slug}</span>
            </nav>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl">
              {category?.name ?? "Category"}
            </h1>
            {category?.tagline && <p className="mt-2 text-earth">{category.tagline}</p>}
            {category?.description && (
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                {category.description}
              </p>
            )}
          </div>
          {category && (
            <div className="overflow-hidden rounded-3xl">
              <img
                src={categoryImage(category)}
                alt={category.name}
                loading="lazy"
                width={800}
                height={520}
                className="h-52 w-full object-cover sm:h-64"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="surface-card h-80 animate-pulse bg-muted/60" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="surface-card p-10 text-center">
            <h2 className="font-display text-xl">Nothing here yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This category is being updated. Explore the rest of our range meanwhile.
            </p>
            <Button asChild className="mt-5 h-11 rounded-full px-7 text-xs tracking-wider uppercase">
              <Link to="/shop">Shop all products</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {items.length} product{items.length === 1 ? "" : "s"}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
