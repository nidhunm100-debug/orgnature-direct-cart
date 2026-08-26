import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product, ProductVariant } from "./catalog";
import { productImage } from "./catalog";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  mrp: number | null;
  packSize: string | null;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant | null) => void;
  setQuantity: (id: string, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "ankura.cart.v1";

const CartContext = createContext<CartContextValue | null>(null);

const MAX_QTY = 99;

function readStored(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.id === "string" && typeof item.price === "number")
      .map((item) => ({
        id: String(item.id),
        slug: String(item.slug ?? ""),
        name: String(item.name ?? ""),
        price: Number(item.price) || 0,
        mrp: item.mrp === null || item.mrp === undefined ? null : Number(item.mrp),
        packSize: item.packSize ?? null,
        image: String(item.image ?? ""),
        quantity: Math.min(MAX_QTY, Math.max(1, Number(item.quantity) || 1)),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setItems(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: Product, quantity = 1, variant: ProductVariant | null = null) => {
      const lineId = variant ? `${product.id}::${variant.label}` : product.id;
      setItems((current) => {
        const existing = current.find((item) => item.id === lineId);
        if (existing) {
          return current.map((item) =>
            item.id === lineId
              ? { ...item, quantity: Math.min(MAX_QTY, item.quantity + quantity) }
              : item,
          );
        }
        return [
          ...current,
          {
            id: lineId,
            slug: product.slug,
            name: product.name,
            price: variant ? variant.price : product.price,
            mrp: variant ? variant.mrp : product.mrp,
            packSize: variant ? variant.label : product.pack_size,
            image: productImage(product),
            quantity: Math.min(MAX_QTY, Math.max(1, quantity)),
          },
        ];
      });
    },
    [],
  );

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(MAX_QTY, quantity) } : item,
          ),
    );
  }, []);

  const increment = useCallback(
    (id: string) =>
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, quantity: Math.min(MAX_QTY, item.quantity + 1) } : item,
        ),
      ),
    [],
  );

  const decrement = useCallback(
    (id: string) =>
      setItems((current) =>
        current.flatMap((item) =>
          item.id === id
            ? item.quantity <= 1
              ? []
              : [{ ...item, quantity: item.quantity - 1 }]
            : [item],
        ),
      ),
    [],
  );

  const removeItem = useCallback(
    (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items,
      count,
      subtotal,
      hydrated,
      drawerOpen,
      setDrawerOpen,
      addItem,
      setQuantity,
      increment,
      decrement,
      removeItem,
      clear,
    };
  }, [items, hydrated, drawerOpen, addItem, setQuantity, increment, decrement, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
