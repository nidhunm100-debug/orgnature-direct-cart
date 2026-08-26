import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/site/BrandMark";
import { SearchDialog } from "@/components/site/SearchDialog";
import { WhatsAppIcon } from "@/components/site/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { useCart } from "@/lib/cart";
import { categoriesQuery } from "@/lib/catalog";
import { CHAT_MESSAGE, whatsappLink } from "@/lib/whatsapp";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count, setDrawerOpen } = useCart();
  const { contact } = useSettings();
  const { data: categories = [] } = useQuery(categoriesQuery);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-18 sm:px-6">
          <BrandMark />

          <nav aria-label="Main" className="mx-auto hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div className="group relative">
              <button
                type="button"
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors group-hover:text-primary"
              >
                Categories
              </button>
              <div className="invisible absolute left-1/2 z-50 w-[34rem] -translate-x-1/2 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="surface-card grid grid-cols-2 gap-1 p-3">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      to="/category/$slug"
                      params={{ slug: category.slug }}
                      className="rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors hover:bg-accent"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors hover:bg-accent"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute top-1.5 right-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>

            <a
              href={whatsappLink(CHAT_MESSAGE, contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 hidden items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-xs font-semibold tracking-wider text-whatsapp-foreground uppercase transition-all hover:brightness-95 lg:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Order on WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors hover:bg-accent lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="hairline-gold h-px w-full" />
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-background lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <BrandMark compact />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-full hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-4 py-5" aria-label="Mobile">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 font-display text-lg hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-6 px-3">Categories</p>
            <ul className="mt-2 space-y-1">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: category.slug }}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm text-foreground/85 hover:bg-accent"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 px-1 pb-10">
              <Button
                asChild
                className="h-12 w-full rounded-full tracking-wider uppercase"
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/shop">Shop all products</Link>
              </Button>
              <a
                href={whatsappLink(CHAT_MESSAGE, contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-whatsapp text-sm font-semibold tracking-wider text-whatsapp-foreground uppercase"
              >
                <WhatsAppIcon className="h-4 w-4" /> Chat with us
              </a>
            </div>
          </nav>
        </div>
      )}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
