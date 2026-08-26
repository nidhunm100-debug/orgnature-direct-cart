import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

import { WhatsAppIcon } from "@/components/site/WhatsAppButton";
import { useSettings } from "@/hooks/use-settings";
import { categoriesQuery } from "@/lib/catalog";
import { CHAT_MESSAGE, whatsappLink } from "@/lib/whatsapp";

export function Footer() {
  const { contact, brand } = useSettings();
  const { data: categories = [] } = useQuery(categoriesQuery);

  return (
    <footer className="mt-20 bg-forest text-forest-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl tracking-[0.16em]">{brand.brandName}</p>
            <p className="mt-1 text-[0.65rem] tracking-[0.3em] uppercase opacity-80">
              {brand.subBrand}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-85">
              Wholesome, natural and thoughtfully crafted products for everyday wellness.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={whatsappLink(CHAT_MESSAGE, contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full bg-forest-foreground/10 transition-colors hover:bg-forest-foreground/20"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full bg-forest-foreground/10 transition-colors hover:bg-forest-foreground/20"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full bg-forest-foreground/10 transition-colors hover:bg-forest-foreground/20"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">Shop</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/shop" className="opacity-85 hover:opacity-100 hover:underline">
                    All products
                  </Link>
                </li>
                {categories.slice(0, 7).map((category) => (
                  <li key={category.slug}>
                    <Link
                      to="/category/$slug"
                      params={{ slug: category.slug }}
                      className="opacity-85 hover:opacity-100 hover:underline"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">
                Information
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/about" className="opacity-85 hover:opacity-100 hover:underline">
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="opacity-85 hover:opacity-100 hover:underline">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="opacity-85 hover:opacity-100 hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="opacity-85 hover:opacity-100 hover:underline">
                    Shipping &amp; delivery
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="opacity-85 hover:opacity-100 hover:underline">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="opacity-85 hover:opacity-100 hover:underline">
                    Terms &amp; conditions
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="opacity-85 hover:opacity-100 hover:underline">
                    Your cart
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">
              Customer support
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
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
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
                <a
                  href={whatsappLink(CHAT_MESSAGE, contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Chat with AnKura
                </a>
              </li>
              <li className="opacity-85">
                <a
                  href={`https://${contact.website.replace(/^https?:\/\//, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {contact.website}
                </a>
              </li>
              <li className="opacity-85">{contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-forest-foreground/15 pt-6 text-xs opacity-75 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AnKura by Orgnature. All Rights Reserved.</p>
          <p>Orders are confirmed over WhatsApp — no online payment required.</p>
        </div>
      </div>
    </footer>
  );
}
