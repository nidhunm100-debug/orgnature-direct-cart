import type { ReactNode } from "react";

import { CartDrawer } from "@/components/site/CartDrawer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MobileOrderBar } from "@/components/site/MobileOrderBar";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
      <MobileOrderBar />
    </div>
  );
}
