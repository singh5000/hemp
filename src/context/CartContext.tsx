"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

/* ── Types ── */
export interface CartItem {
  key:       string;
  quantity:  number;
  total:     string;
  product: {
    databaseId: number;
    name:       string;
    slug:       string;
    price?:     string;
    image?:     { sourceUrl: string; altText: string };
  };
  variation?: {
    databaseId: number;
    price:      string;
    image?:     { sourceUrl: string; altText: string };
    attributes: { nodes: Array<{ name: string; value: string }> };
  } | null;
}

export interface CartData {
  total:          string;
  subtotal:       string;
  discount?:      string;
  totalTax?:      string;
  shippingTotal?: string;
  isEmpty:        boolean;
  itemCount:      number;
  items:          CartItem[];
  coupons:        Array<{ code: string; discount: string }>;
}

interface CartCtx {
  cart:          CartData | null;
  cartCount:     number;
  cartLoading:   boolean;
  refreshCart:   () => Promise<void>;
  addToCart:     (productId: number, quantity?: number, variationId?: number) => Promise<{ error?: string }>;
  removeItem:    (key: string) => Promise<void>;
  updateQty:     (key: string, quantity: number) => Promise<void>;
  clearCart:     () => Promise<void>;
  applyCoupon:   (code: string) => Promise<{ error?: string }>;
  removeCoupon:  (code: string) => Promise<void>;
  setCartCount:  (n: number) => void;
}

const CartContext = createContext<CartCtx>({
  cart: null, cartCount: 0, cartLoading: true,
  refreshCart:  async () => {},
  addToCart:    async () => ({}),
  removeItem:   async () => {},
  updateQty:    async () => {},
  clearCart:    async () => {},
  applyCoupon:  async () => ({}),
  removeCoupon: async () => {},
  setCartCount: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart,        setCart]        = useState<CartData | null>(null);
  const [cartLoading, setCartLoading] = useState(true);

  /* ── Fetch cart from WC Store API proxy ── */
  const refreshCart = useCallback(async () => {
    try {
      const res  = await fetch("/api/wc/cart", { cache: "no-store" });
      const data = await res.json() as { cart?: CartData; error?: string };
      setCart(data.cart ?? null);
    } catch {
      setCart(null);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  /* ── Mutation helper ── */
  const mutate = useCallback(async (body: Record<string, unknown>): Promise<{ error?: string }> => {
    try {
      const res  = await fetch("/api/wc/cart", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json() as { cart?: CartData; error?: string };
      if (data.error) return { error: data.error };
      if (data.cart)  setCart(data.cart);
      else            await refreshCart();
      return {};
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Cart operation failed";
      console.error("[Cart] error:", msg);
      return { error: msg };
    }
  }, [refreshCart]);

  /* ── For variable products: use variationId as the item ID (WC Store API convention) ── */
  const addToCart = useCallback(async (productId: number, quantity = 1, variationId?: number) => {
    return mutate({ action: "add", productId: variationId ?? productId, quantity });
  }, [mutate]);

  const removeItem = useCallback(async (key: string) => {
    await mutate({ action: "remove", key });
  }, [mutate]);

  const updateQty = useCallback(async (key: string, quantity: number) => {
    if (quantity < 1) return removeItem(key);
    await mutate({ action: "update", key, quantity });
  }, [mutate, removeItem]);

  const clearCart = useCallback(async () => {
    await mutate({ action: "clear" });
  }, [mutate]);

  const applyCoupon = useCallback(async (code: string) => {
    return mutate({ action: "apply-coupon", code: code.trim().toUpperCase() });
  }, [mutate]);

  const removeCoupon = useCallback(async (code: string) => {
    await mutate({ action: "remove-coupon", code });
  }, [mutate]);

  const cartCount = cart?.itemCount ?? 0;

  return (
    <CartContext.Provider value={{
      cart, cartCount, cartLoading, refreshCart,
      addToCart, removeItem, updateQty, clearCart,
      applyCoupon, removeCoupon,
      setCartCount: () => {},
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
