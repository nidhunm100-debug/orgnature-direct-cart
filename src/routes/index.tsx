import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Leaf, MessageCircle, PackageCheck, Sprout } from "lucide-react";

import hero from "@/assets/hero-ankura.jpg";
import story from "@/assets/brand-story.jpg";
import { ProductCard } from "@/components/site/ProductCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TrustBadges } from "@/components/site/TrustBadges";
import { WhatsAppIcon } from "@/components/site/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { categoriesQuery, categoryImage, productsQuery } from "@/lib/catalog";
import { CHAT_MESSAGE, whatsappLink } from "@/lib/whatsapp";

const TITLE = "AnKura by Orgnature | Natural Indian Foods, Cold-Pressed Oils & Millets";
const DESCRIPTION =
  "Shop AnKura by Orgnature — cold-pressed oils, millet foods, health mixes, herbal teas, ghee, flours and traditional spices. Order easily on WhatsApp, no online payment needed.";

export const Route = createFileRoute("/")({
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
  component: Home,
});

const STEPS = [
  {
    icon: PackageCheck,
    title: "Choose your products",
    body: "Browse the catalogue and add everything you need to your cart.",
  },
  {
    icon: MessageCircle,
    title: "Send on WhatsApp",
    body: "Share your details and your order is sent to us as a ready message.",
  },
  {
    icon: Sprout,
    title: "We confirm & deliver",
    body: "We confirm availability, delivery charges and dispatch your order.",
  },
];

function Home() {
  const { brand, contact } = useSettings();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);

  const featured = products.filter((product) => product.featured).slice(0, 8);
  const bestSellers = products.filter((product) => product.best_seller).slice(0, 4);
  const spotlight = featured.length > 0 ? featured : products.slice(0, 8);

  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden bg-forest text-forest-foreground">
        <img
          src={brand.heroImageUrl || hero}
          alt="Natural Indian food products from AnKura by Orgnature"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/80 to-forest/40"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="max-w-2xl fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-forest-foreground/25 px-3 py-1.5 text-[0.65rem] tracking-[0.25em] uppercase">
              <Leaf className="h-3.5 w-3.5" /> Natural · Wholesome · Traditional
            </p>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              Nature&apos;s goodness, delivered with trust.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed opacity-90 sm:text-lg">
              {brand.brandName} {brand.subBrand} brings you cold-pressed oils, millet foods, health
              mixes, herbal teas and traditional staples — made the way they always should be.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="h-14 rounded-full bg-gold px-8 text-sm font-semibold tracking-wider text-forest uppercase hover:bg-gold/90"
              >
                <Link to="/shop">
                  Shop the collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href={whatsappLink(CHAT_MESSAGE, contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-2 rounded-full bg-whatsapp px-8 text-sm font-semibold tracking-wider text-whatsapp-foreground uppercase transition-all hover:brightness-95"
              >
                <WhatsAppIcon className="h-4 w-4" /> Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Everyday essentials, naturally</h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="surface-card lift-hover group overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-ivory">
                <img
                  src={categoryImage(category)}
                  alt={category.name}
                  loading="lazy"
                  width={480}
                  height={360}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-base leading-snug sm:text-lg">{category.name}</h3>
                {category.tagline && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                    {category.tagline}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Handpicked</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Featured products</h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Browse everything <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="surface-card h-80 animate-pulse bg-muted/60" />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {spotlight.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={brand.aboutImageUrl || story}
              alt="Traditional natural food preparation at Orgnature"
              loading="lazy"
              width={900}
              height={700}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Rooted in tradition, made for today
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              AnKura means a sprout — a new beginning. We work with trusted farmers and traditional
              methods like wooden cold-pressing and slow roasting, so every product keeps its
              natural aroma, nutrition and honest taste.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              No artificial colours, no added preservatives, no shortcuts. Just clean, wholesome
              food your family can trust every day.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-6 h-12 rounded-full px-7 text-xs font-semibold tracking-wider uppercase"
            >
              <Link to="/about">Read our story</Link>
            </Button>
          </div>
        </div>
      </section>

      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
          <p className="eyebrow">Customer favourites</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Best sellers</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <p className="eyebrow">Simple ordering</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">How WhatsApp ordering works</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              No accounts, no online payment. Choose what you need and we take care of the rest.
            </p>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="surface-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm tracking-[0.2em] text-earth uppercase">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SiteLayout>
  );
}
