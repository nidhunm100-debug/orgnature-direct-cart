import { Link, createFileRoute } from "@tanstack/react-router";

import story from "@/assets/brand-story.jpg";
import wellness from "@/assets/wellness-lifestyle.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TrustBadges } from "@/components/site/TrustBadges";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";

const TITLE = "About AnKura by Orgnature | Natural Foods Rooted in Tradition";
const DESCRIPTION =
  "AnKura by Orgnature makes cold-pressed oils, millet foods and traditional Indian staples using honest sourcing and time-tested methods — no preservatives, no shortcuts.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

const VALUES = [
  {
    title: "Honest sourcing",
    body: "We buy directly from farmers and trusted producers, favouring native seeds and small batches.",
  },
  {
    title: "Traditional methods",
    body: "Wooden cold-pressing, slow roasting and stone grinding keep nutrition and aroma intact.",
  },
  {
    title: "Clean labels",
    body: "No artificial colours, flavours or added preservatives. What's on the pack is what's inside.",
  },
  {
    title: "Everyday affordability",
    body: "Natural food should be a daily habit, not a luxury. We price for regular kitchens.",
  },
];

function AboutPage() {
  const { brand } = useSettings();

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="eyebrow">About us</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl leading-tight sm:text-5xl">
            AnKura means a sprout — a small, hopeful beginning.
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            {brand.brandName} {brand.subBrand} began with a simple frustration: everyday foods had
            quietly lost their character. Oils were refined until they had no smell, grains were
            polished until they had no nutrition, and spices tasted of packaging. We wanted to bring
            back the food our grandparents cooked with.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img
            src={brand.aboutImageUrl || story}
            alt="Traditional cold-pressing and slow roasting at Orgnature"
            loading="lazy"
            width={900}
            height={700}
            className="h-full w-full rounded-3xl object-cover"
          />
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">How we work</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Every product starts with the raw material. We work with growers who avoid harsh
              chemicals, clean and sort by hand, and process in small batches so nothing sits around
              losing freshness.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Our oils are cold-pressed in wooden churners at low temperatures. Our millets and
              health mixes are roasted slowly and ground fine. Our teas and spices are blended in
              small quantities and packed immediately.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Because we sell directly and confirm every order personally on WhatsApp, we can keep
              batches fresh and answer your questions honestly — about sourcing, about nutrition, and
              about what suits your family.
            </p>
          </div>
        </div>
      </section>

      <TrustBadges />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="eyebrow">What we stand for</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">Our promises</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div key={value.title} className="surface-card p-6">
              <h3 className="font-display text-xl">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest text-forest-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">
              Taste the difference in your own kitchen
            </h2>
            <p className="mt-4 leading-relaxed opacity-90">
              Start with one product — a cold-pressed oil, a millet mix, or a herbal tea — and see how
              different real food smells and tastes.
            </p>
            <Button
              asChild
              className="mt-7 h-13 rounded-full bg-gold px-8 text-xs font-semibold tracking-wider text-forest uppercase hover:bg-gold/90"
            >
              <Link to="/shop">Shop the range</Link>
            </Button>
          </div>
          <img
            src={brand.wellnessImageUrl || wellness}
            alt="Natural wholesome food on a wooden table"
            loading="lazy"
            width={900}
            height={640}
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>
      </section>
    </SiteLayout>
  );
}
