import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/use-settings";
import { useCart } from "@/lib/cart";
import { deliveryLabel, formatINR } from "@/lib/store-config";
import { customerSchema } from "@/lib/validation";
import {
  EMPTY_CUSTOMER,
  generateOrderReference,
  generateWhatsAppOrderMessage,
  type CustomerDetails,
} from "@/lib/whatsapp";

const TITLE = "Order Details | AnKura by Orgnature";
const DESCRIPTION =
  "Enter your delivery details and send your AnKura by Orgnature order straight to our team on WhatsApp.";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

type Errors = Partial<Record<keyof CustomerDetails, string>>;

function OrderPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const { shipping } = useSettings();
  const [customer, setCustomer] = useState<CustomerDetails>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const orderReference = useMemo(() => generateOrderReference(), []);

  const set = (key: keyof CustomerDetails) => (value: string) => {
    setCustomer((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const parsed = customerSchema.safeParse(customer);
  const valid = parsed.success && items.length > 0;

  const message = generateWhatsAppOrderMessage({
    items,
    customer: parsed.success ? { ...customer, mobile: parsed.data.mobile } : customer,
    shipping,
    orderReference,
  });

  const validate = () => {
    const result = customerSchema.safeParse(customer);
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof CustomerDetails;
      if (!next[key]) next[key] = issue.message;
    }
    setErrors(next);
    toast.error("Please correct the highlighted fields.");
    return false;
  };

  if (sent) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          <h1 className="font-display text-3xl">Your order is on its way to us</h1>
          <p className="mt-3 text-muted-foreground">
            We&apos;ve opened WhatsApp with your order message. Send it and our team will confirm
            availability and delivery charges shortly.
          </p>
          <p className="mt-5 rounded-2xl bg-cream px-5 py-4 font-mono text-sm">
            Order reference: <strong>{sent}</strong>
          </p>
          <Button asChild className="mt-7 h-12 rounded-full px-7 text-xs tracking-wider uppercase">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          <h1 className="font-display text-3xl">Nothing to order yet</h1>
          <p className="mt-3 text-muted-foreground">
            Add products to your cart and come back to send your order on WhatsApp.
          </p>
          <Button asChild className="mt-7 h-12 rounded-full px-7 text-xs tracking-wider uppercase">
            <Link to="/shop">Browse products</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const field = (
    key: keyof CustomerDetails,
    label: string,
    options: {
      required?: boolean;
      type?: string;
      placeholder?: string;
      inputMode?: "text" | "numeric" | "tel";
      maxLength?: number;
      textarea?: boolean;
    } = {},
  ) => (
    <div className={options.textarea ? "sm:col-span-2" : ""}>
      <Label htmlFor={key}>
        {label} {options.required && <span className="text-destructive">*</span>}
      </Label>
      {options.textarea ? (
        <Textarea
          id={key}
          value={customer[key]}
          maxLength={options.maxLength ?? 600}
          placeholder={options.placeholder}
          onChange={(event) => set(key)(event.target.value)}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
          className="mt-1.5 min-h-24"
        />
      ) : (
        <Input
          id={key}
          type={options.type ?? "text"}
          inputMode={options.inputMode}
          maxLength={options.maxLength ?? 120}
          placeholder={options.placeholder}
          value={customer[key]}
          onChange={(event) => set(key)(event.target.value)}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
          className="mt-1.5 h-11"
        />
      )}
      {errors[key] && (
        <p id={`${key}-error`} role="alert" className="mt-1.5 text-xs text-destructive">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/cart" className="hover:text-primary">
            Cart
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Order details</span>
        </nav>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">Your delivery details</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          No account needed. Fill this in once and we&apos;ll send everything to our team on
          WhatsApp as a single, clear order message.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <form
            className="surface-card grid gap-5 p-6 sm:grid-cols-2"
            onSubmit={(event) => event.preventDefault()}
            noValidate
          >
            {field("fullName", "Full name", { required: true, placeholder: "Your name", maxLength: 80 })}
            {field("mobile", "Mobile number", {
              required: true,
              type: "tel",
              inputMode: "tel",
              placeholder: "10-digit mobile number",
              maxLength: 15,
            })}
            {field("address", "Delivery address", {
              required: true,
              textarea: true,
              placeholder: "House / flat, street, landmark",
              maxLength: 400,
            })}
            {field("city", "City / town", { required: true, maxLength: 60 })}
            {field("state", "State", { maxLength: 60 })}
            {field("pincode", "Pincode", {
              required: true,
              inputMode: "numeric",
              placeholder: "6-digit pincode",
              maxLength: 6,
            })}
            {field("deliveryTime", "Preferred delivery time", {
              placeholder: "e.g. Evenings after 6 PM",
              maxLength: 80,
            })}
            {field("notes", "Order notes (optional)", {
              textarea: true,
              placeholder: "Anything we should know about your order",
              maxLength: 600,
            })}
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Fields marked * are required. Your details are only used to process this order and are
              sent directly to us on WhatsApp.
            </p>
          </form>

          <aside className="surface-card h-fit p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-xl">Order summary</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {item.name}
                    {item.packSize ? ` (${item.packSize})` : ""} × {item.quantity}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="font-medium">{deliveryLabel(shipping, subtotal)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt className="font-display">Total</dt>
                <dd className="font-display text-primary">{formatINR(subtotal)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              {shipping.note} Order reference <strong>{orderReference}</strong>.
            </p>

            <div className="mt-6">
              <WhatsAppButton
                size="lg"
                className="w-full"
                message={message}
                onOpened={() => {
                  setSent(orderReference);
                  clear();
                }}
              >
                Send order on WhatsApp
              </WhatsAppButton>
              {!valid && (
                <button
                  type="button"
                  onClick={validate}
                  className="mt-3 w-full text-xs text-muted-foreground underline"
                >
                  Check my details
                </button>
              )}
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-3 h-11 w-full rounded-full text-xs tracking-wider uppercase"
            >
              <Link to="/cart">Back to cart</Link>
            </Button>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
