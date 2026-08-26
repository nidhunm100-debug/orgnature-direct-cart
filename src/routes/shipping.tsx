import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { useSettings } from "@/hooks/use-settings";
import { SHIPPING_DEFAULTS, formatINR } from "@/lib/store-config";

const TITLE = "Shipping & Delivery | AnKura by Orgnature";
const DESCRIPTION =
  "How AnKura by Orgnature dispatches orders across India, delivery timelines, packaging, charges and what to do if a parcel is damaged or delayed.";

export const Route = createFileRoute("/shipping")({
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
  component: ShippingPage,
});

function ShippingPage() {
  const { shipping } = useSettings();

  const chargeLine =
    shipping.mode === "flat"
      ? `A flat delivery charge of ${formatINR(shipping.flatRate)} applies to all orders.`
      : shipping.mode === "free_above" && shipping.freeAbove !== null
        ? `Delivery is free on orders above ${formatINR(shipping.freeAbove)}. Below that, a charge of ${formatINR(shipping.flatRate)} applies.`
        : "Delivery charges are confirmed on WhatsApp before dispatch, based on your pincode, order weight and volume.";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="eyebrow">Policies</p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">Shipping &amp; delivery</h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl text-foreground">Delivery charges</h2>
            <p className="mt-2">{chargeLine}</p>
            <p className="mt-2">{shipping.note || SHIPPING_DEFAULTS.note}</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Order confirmation</h2>
            <p className="mt-2">
              Every order reaches us as a WhatsApp message with your order reference. We reply to
              confirm availability, the final amount including delivery, and your preferred delivery
              window. Nothing is dispatched until you confirm.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Dispatch timelines</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Orders are packed and dispatched within 1–2 working days of confirmation.</li>
              <li>Metro cities: usually 2–4 working days after dispatch.</li>
              <li>Other cities and towns: usually 4–7 working days after dispatch.</li>
              <li>Remote pincodes may take a little longer; we will tell you upfront.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Packaging</h2>
            <p className="mt-2">
              Oils travel in sealed, leak-guarded bottles with cushioned outer packing. Powders,
              flours and mixes are packed in food-grade pouches. We use minimal plastic and recyclable
              outer cartons wherever possible.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Damaged or missing items</h2>
            <p className="mt-2">
              Please check your parcel on delivery. If anything is damaged, leaking or missing, send us
              photos on WhatsApp within 48 hours along with your order reference. We will replace the
              item or adjust the value against your next order.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Returns</h2>
            <p className="mt-2">
              Because these are natural food products, we cannot accept returns of opened packs for
              hygiene reasons. Unopened, undamaged items can be raised with us within 48 hours of
              delivery and we will resolve it fairly.
            </p>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
