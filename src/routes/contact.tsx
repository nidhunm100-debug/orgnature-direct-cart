import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/use-settings";

const TITLE = "Contact AnKura by Orgnature | WhatsApp, Phone & Email";
const DESCRIPTION =
  "Talk to the AnKura by Orgnature team on WhatsApp, phone or email for product questions, bulk orders and delivery enquiries anywhere in India.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

function ContactPage() {
  const { contact } = useSettings();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [enquiry, setEnquiry] = useState("");

  const message = [
    "Hello AnKura by Orgnature,",
    "",
    "I have an enquiry.",
    "",
    name.trim() ? `Name: ${name.trim()}` : null,
    mobile.trim() ? `Mobile: ${mobile.trim()}` : null,
    "",
    enquiry.trim() || "I would like to know more about your products.",
    "",
    "Thank you.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl">We&apos;re a message away</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            WhatsApp is the fastest way to reach us — for product advice, bulk and gifting orders, or
            help with an order you&apos;ve already placed.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <div className="surface-card p-6">
            <h2 className="font-display text-xl">Reach us directly</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-earth" />
                <span>
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:underline">
                    {contact.phone}
                  </a>
                  {contact.phoneAlt && (
                    <>
                      <br />
                      <a
                        href={`tel:${contact.phoneAlt.replace(/\s/g, "")}`}
                        className="hover:underline"
                      >
                        {contact.phoneAlt}
                      </a>
                    </>
                  )}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-earth" />
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-earth" />
                <span>{contact.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-earth" />
                <span>Monday to Saturday, 9:00 AM – 7:00 PM IST</span>
              </li>
            </ul>
          </div>

          <div className="surface-card p-6">
            <h2 className="font-display text-xl">Bulk, corporate &amp; gifting</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Planning festive hampers, wedding return gifts or a large kitchen order? Message us with
              quantities and we&apos;ll share a custom quote.
            </p>
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-display text-xl">Send an enquiry on WhatsApp</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill this in and we&apos;ll open WhatsApp with your message ready to send.
          </p>
          <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
            <div>
              <Label htmlFor="contact-name">Your name</Label>
              <Input
                id="contact-name"
                value={name}
                maxLength={80}
                onChange={(event) => setName(event.target.value)}
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label htmlFor="contact-mobile">Mobile number</Label>
              <Input
                id="contact-mobile"
                type="tel"
                inputMode="tel"
                maxLength={15}
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label htmlFor="contact-enquiry">Your message</Label>
              <Textarea
                id="contact-enquiry"
                value={enquiry}
                maxLength={600}
                onChange={(event) => setEnquiry(event.target.value)}
                placeholder="Tell us what you need — products, quantities, delivery city"
                className="mt-1.5 min-h-28"
              />
            </div>
            <WhatsAppButton size="lg" className="w-full" message={message}>
              Send on WhatsApp
            </WhatsAppButton>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}
