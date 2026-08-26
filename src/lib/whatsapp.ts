import type { CartItem } from "./cart";
import {
  DEFAULT_WHATSAPP_NUMBER,
  deliveryLabel,
  formatINR,
  resolveDelivery,
  type ShippingConfig,
} from "./store-config";

export type CustomerDetails = {
  fullName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  deliveryTime: string;
  notes: string;
};

export const EMPTY_CUSTOMER: CustomerDetails = {
  fullName: "",
  mobile: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  deliveryTime: "",
  notes: "",
};

/** ANK-YYYYMMDD-NNNN client-side reference so the business can identify orders. */
export function generateOrderReference(date = new Date()): string {
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ANK-${stamp}-${random}`;
}

export function whatsappLink(message: string, number = DEFAULT_WHATSAPP_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string, number = DEFAULT_WHATSAPP_NUMBER): void {
  const url = whatsappLink(message, number);
  // A plain navigation works on WhatsApp Web (desktop), Android and iOS.
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) window.location.href = url;
}

export function generateWhatsAppOrderMessage(options: {
  items: CartItem[];
  customer: CustomerDetails;
  shipping: ShippingConfig;
  orderReference: string;
}): string {
  const { items, customer, shipping, orderReference } = options;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = resolveDelivery(shipping, subtotal);
  const total = subtotal + (delivery ?? 0);

  const lines: string[] = [];
  lines.push("Hello AnKura by Orgnature,");
  lines.push("");
  lines.push("I would like to place an order.");
  lines.push("");
  lines.push(`Order Reference: ${orderReference}`);
  lines.push("");
  lines.push("ORDER DETAILS");
  lines.push("--------------");

  items.forEach((item) => {
    lines.push(`Product: ${item.name}${item.packSize ? ` (${item.packSize})` : ""}`);
    lines.push(`Qty: ${item.quantity}`);
    lines.push(`Price: ${formatINR(item.price)}`);
    lines.push(`Subtotal: ${formatINR(item.price * item.quantity)}`);
    lines.push("");
  });

  lines.push("--------------");
  lines.push(`SUBTOTAL: ${formatINR(subtotal)}`);
  lines.push(`DELIVERY: ${deliveryLabel(shipping, subtotal)}`);
  lines.push(
    delivery === null ? `TOTAL (excl. delivery): ${formatINR(total)}` : `TOTAL: ${formatINR(total)}`,
  );
  lines.push("");
  lines.push("CUSTOMER DETAILS");
  lines.push(`Name: ${customer.fullName}`);
  lines.push(`Mobile: ${customer.mobile}`);
  lines.push(`Address: ${customer.address}`);
  lines.push(`City: ${customer.city}`);
  if (customer.state.trim()) lines.push(`State: ${customer.state}`);
  lines.push(`Pincode: ${customer.pincode}`);
  if (customer.deliveryTime.trim()) lines.push(`Preferred delivery time: ${customer.deliveryTime}`);

  if (customer.notes.trim()) {
    lines.push("");
    lines.push("Order Note:");
    lines.push(customer.notes.trim());
  }

  lines.push("");
  lines.push("Please confirm my order and delivery charges.");
  lines.push("");
  lines.push("Thank you.");

  return lines.join("\n");
}

export function generateSingleProductMessage(options: {
  name: string;
  packSize?: string | null;
  price: number;
  quantity: number;
}): string {
  const { name, packSize, price, quantity } = options;
  return [
    "Hello AnKura by Orgnature,",
    "",
    "I would like to order this product:",
    "",
    `Product: ${name}${packSize ? ` (${packSize})` : ""}`,
    `Qty: ${quantity}`,
    `Price: ${formatINR(price)}`,
    `Subtotal: ${formatINR(price * quantity)}`,
    "",
    "My details:",
    "Name:",
    "Mobile:",
    "Address:",
    "",
    "Please confirm availability and delivery charges.",
    "",
    "Thank you.",
  ].join("\n");
}

export const CHAT_MESSAGE =
  "Hello AnKura by Orgnature, I would like to know more about your products.";
