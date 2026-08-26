import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TITLE = "Frequently Asked Questions | AnKura by Orgnature";
const DESCRIPTION =
  "Answers about ordering on WhatsApp, payment, delivery timelines, shelf life, bulk orders and product sourcing at AnKura by Orgnature.";

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Add products to your cart, open the cart and continue to order details. Fill in your name, mobile number and delivery address, then tap “Send order on WhatsApp”. Your complete order opens as a ready-made WhatsApp message — just press send.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There are no logins or accounts. Your cart is saved on your own device and your details are only used for the order you send us.",
  },
  {
    q: "How do I pay?",
    a: "We do not take online payments on the website. After you send your order on WhatsApp, our team confirms availability and the final amount including delivery, then shares the payment options that suit you.",
  },
  {
    q: "How much is delivery?",
    a: "Delivery charges depend on your pincode, order weight and volume, so we confirm them on WhatsApp before dispatch. You will always know the final amount before you pay anything.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders are usually dispatched within 1–2 working days of confirmation. Metro deliveries typically arrive in 2–4 working days, and other locations in 4–7 working days.",
  },
  {
    q: "Are your products really preservative-free?",
    a: "Yes. We do not add artificial colours, flavours or preservatives. Because of this, our products have a shorter natural shelf life — store them as printed on each pack.",
  },
  {
    q: "How should I store cold-pressed oils?",
    a: "Keep them in a cool, dark place away from direct sunlight and always use a dry spoon. Natural sediment at the bottom is normal for unrefined, filtered-once oils.",
  },
  {
    q: "Can I order in bulk or for gifting?",
    a: "Absolutely. Message us on WhatsApp with the products and quantities you need and we will share a custom quote for bulk, corporate and festive hampers.",
  },
  {
    q: "What if something is damaged or missing?",
    a: "Send us photos on WhatsApp within 48 hours of delivery along with your order reference. We will replace the item or adjust it against your next order.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes, we ship across India through trusted courier partners. Share your pincode on WhatsApp and we will confirm serviceability.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="eyebrow">Help centre</p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">Frequently asked questions</h1>
        <p className="mt-3 text-muted-foreground">
          Everything about ordering, delivery and our products. Still unsure? Message us on WhatsApp.
        </p>

        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((item, index) => (
            <AccordionItem key={item.q} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-display text-base sm:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SiteLayout>
  );
}
