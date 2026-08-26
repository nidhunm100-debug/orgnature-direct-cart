import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";

const TITLE = "Terms & Conditions | AnKura by Orgnature";
const DESCRIPTION =
  "The terms that apply when you browse AnKura by Orgnature and place an order through WhatsApp — pricing, availability, orders and liability.";

export const Route = createFileRoute("/terms")({
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
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="eyebrow">Policies</p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">Terms &amp; conditions</h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl text-foreground">Using this website</h2>
            <p className="mt-2">
              This website is operated by AnKura by Orgnature. By browsing it or sending us an order,
              you agree to these terms. Content, images and text on this site belong to us and may not
              be reused without permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Orders</h2>
            <p className="mt-2">
              Adding items to your cart and sending a WhatsApp message is a request to order, not a
              completed sale. An order is only confirmed once our team replies to confirm availability
              and the final amount including delivery.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Pricing &amp; availability</h2>
            <p className="mt-2">
              Prices are in Indian Rupees and may change without notice. Because we work in small
              batches, some items may be temporarily unavailable even if the website shows them. If
              anything has changed, we tell you before you pay.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Payments</h2>
            <p className="mt-2">
              We do not process payments on this website. Payment is arranged directly with our team
              after your order is confirmed on WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Product information</h2>
            <p className="mt-2">
              Our products are natural foods, so colour, aroma, texture and sediment can vary between
              batches. Nutritional and benefit information is provided for general guidance and is not
              medical advice. Please consult a qualified professional for health conditions,
              pregnancy, or before making significant dietary changes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Limitation of liability</h2>
            <p className="mt-2">
              We are responsible for supplying the products you order in good condition. We are not
              liable for indirect losses, courier delays beyond our control, or misuse or improper
              storage of a product after delivery.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Governing law</h2>
            <p className="mt-2">
              These terms are governed by Indian law, and any disputes fall under the jurisdiction of
              the courts where our business is registered.
            </p>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
