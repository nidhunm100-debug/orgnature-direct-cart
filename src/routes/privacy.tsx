import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { useSettings } from "@/hooks/use-settings";

const TITLE = "Privacy Policy | AnKura by Orgnature";
const DESCRIPTION =
  "How AnKura by Orgnature handles the details you share when you place a WhatsApp order — what we collect, why, and how long we keep it.";

export const Route = createFileRoute("/privacy")({
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
  component: PrivacyPage,
});

function PrivacyPage() {
  const { contact } = useSettings();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="eyebrow">Policies</p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">Privacy policy</h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl text-foreground">What we collect</h2>
            <p className="mt-2">
              We only collect what we need to deliver your order: your name, mobile number, delivery
              address, city, pincode and any notes you choose to add. We do not ask you to create an
              account and we do not collect card or bank details on this website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Where your details go</h2>
            <p className="mt-2">
              When you tap “Send order on WhatsApp”, your details are placed into a WhatsApp message
              that you send to us from your own device. The message reaches our business WhatsApp
              number and is subject to WhatsApp&apos;s own privacy terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Your cart</h2>
            <p className="mt-2">
              Your cart is stored locally in your browser so you don&apos;t lose it if you close the
              tab. It never leaves your device until you send your order. Clearing your browser data
              clears your cart.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">How we use your information</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>To confirm, pack and deliver your order.</li>
              <li>To contact you about that order or a delivery issue.</li>
              <li>To keep basic records of orders as required for our business.</li>
            </ul>
            <p className="mt-2">
              We do not sell, rent or trade your personal information. We only share your address with
              the courier partner delivering your order.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Marketing messages</h2>
            <p className="mt-2">
              We only send promotional messages if you have asked us to. You can tell us to stop at any
              time on WhatsApp and we will remove you immediately.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Your choices</h2>
            <p className="mt-2">
              You can ask us what details we hold about you, correct them, or ask us to delete them.
              Write to{" "}
              <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                {contact.email}
              </a>{" "}
              or message us on WhatsApp.
            </p>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
