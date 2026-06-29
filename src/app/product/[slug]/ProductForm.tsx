"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Bell, Check, Mail } from "lucide-react";

const WP = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

interface Attribute {
  id:             number;
  name:           string;
  taxonomy:       string;
  has_variations: boolean;
  terms:          Array<{ id: number; name: string; slug: string }>;
}

interface Variation {
  id:          number;
  attributes:  Array<{ name: string; value: string }>;
  prices: {
    price:               string;
    regular_price:       string;
    currency_symbol:     string;
    currency_minor_unit: number;
  };
  is_in_stock: boolean;
  image:       { src: string; alt: string } | null;
}

interface Props {
  productId:     number;
  productName:   string;
  hasOptions:    boolean;
  isInStock:     boolean;
  isInStoreOnly: boolean;
  attributes:    Attribute[];
  variations:    Variation[];
}

function decodeSym(sym: string) {
  return sym.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}
function fmt(minor: string, unit: number, sym: string) {
  return `${decodeSym(sym)}${(parseInt(minor) / Math.pow(10, unit)).toFixed(2)}`;
}

export default function ProductForm({ productId, productName, hasOptions, isInStock, isInStoreOnly, attributes, variations }: Props) {
  const { addToCart } = useCart();
  const [qty,       setQty]    = useState(1);
  const [selected,  setSelected] = useState<Record<string, string>>({});
  const [cartState, setCartState] = useState<"idle" | "loading" | "added" | "error">("idle");

  const [notifyOpen,  setNotifyOpen]  = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyState, setNotifyState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifyState("sending");
    try {
      const res = await fetch(`${WP}/wp-json/hemp/v1/notify-restock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: notifyEmail, productId, productName }),
      });
      if (!res.ok) throw new Error();
      setNotifyState("sent");
    } catch {
      setNotifyState("error");
      setTimeout(() => setNotifyState("idle"), 3000);
    }
  };

  /* ── For variable products: find matching variation ── */
  const matchedVariation: Variation | undefined = hasOptions
    ? variations.find(v =>
        v.attributes.every(a => {
          const attr = a.name.toLowerCase().replace(/\s+/g, "_");
          return !a.value || selected[attr] === a.value;
        })
      )
    : undefined;

  const activeInStock = hasOptions ? (matchedVariation?.is_in_stock ?? true) : isInStock;
  const canAddToCart  = hasOptions
    ? !!matchedVariation && activeInStock
    : activeInStock;

  const handleAdd = async () => {
    if (!canAddToCart) return;
    setCartState("loading");
    const result = await addToCart(
      productId,
      qty,
      matchedVariation?.id
    );
    if (result.error) {
      setCartState("error");
    } else {
      setCartState("added");
    }
    setTimeout(() => setCartState("idle"), 2500);
  };

  /* ── Variable attributes UI ── */
  const variationAttrs = attributes.filter(a => a.has_variations);

  return (
    <div className="space-y-5">
      {/* Attribute pickers (variable products) */}
      {hasOptions && variationAttrs.map(attr => {
        const key = attr.name.toLowerCase().replace(/\s+/g, "_");
        return (
          <div key={attr.id}>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#3d2b1f] mb-2">{attr.name}</p>
            <div className="flex flex-wrap gap-2">
              {attr.terms.map(term => {
                const isActive  = selected[key] === term.slug;
                return (
                  <button key={term.id}
                    onClick={() => setSelected(prev =>
                      prev[key] === term.slug
                        ? { ...prev, [key]: "" }
                        : { ...prev, [key]: term.slug }
                    )}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                      isActive
                        ? "border-[#1A9248] bg-[#1A9248] text-white"
                        : "border-gray-200 text-[#3d2b1f] hover:border-[#1A9248]"
                    }`}>
                    {term.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity + Add to cart */}
      <div className="flex items-center gap-3">
        {/* Qty stepper */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-10 h-11 flex items-center justify-center text-[#3d2b1f] hover:bg-[#f5f0eb] transition-colors text-lg font-bold">
            −
          </button>
          <span className="w-10 text-center text-sm font-bold text-[#3d2b1f]">{qty}</span>
          <button onClick={() => setQty(q => q + 1)}
            className="w-10 h-11 flex items-center justify-center text-[#3d2b1f] hover:bg-[#f5f0eb] transition-colors text-lg font-bold">
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button onClick={handleAdd} disabled={!canAddToCart || cartState === "loading"}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
            !canAddToCart
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : cartState === "added"   ? "bg-emerald-500 text-white"
              : cartState === "error"   ? "bg-red-500 text-white"
              : cartState === "loading" ? "bg-[#1A9248]/60 text-white cursor-wait"
              : "bg-[#1A9248] hover:bg-[#148038] text-white"
          }`}>
          {!canAddToCart && hasOptions && !matchedVariation
            ? "Select Options"
            : !canAddToCart && isInStoreOnly
            ? "In-Store Only"
            : !canAddToCart
            ? "Out of Stock"
            : cartState === "loading" ? "Adding…"
            : cartState === "added"   ? "✓ Added to Cart!"
            : cartState === "error"   ? "Try Again"
            : "Add to Cart"}
        </button>
      </div>

      {/* Stock status */}
      {!canAddToCart && (!hasOptions || matchedVariation) && (
        <div className="space-y-3">
          {isInStoreOnly ? (
            <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-4 space-y-2.5">
              <p className="text-amber-700 text-sm font-bold flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Available In-Store Only
              </p>
              <p className="text-amber-700/70 text-xs leading-relaxed">
                This product is available for purchase at our retail location. Visit us to see it in person!
              </p>
              <div className="flex items-start gap-2 text-xs text-amber-800/80 bg-amber-100/50 rounded-lg px-3 py-2.5">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <div>
                  <p className="font-bold">Hemp &amp; Barrel</p>
                  <p>800 N Polk Street, Pineville, NC 28134</p>
                  <p>Mon–Sat 10AM–8PM · Sun 12PM–4PM</p>
                  <a href="tel:9803264367" className="font-bold text-amber-800 hover:underline">(980) 326-4367</a>
                </div>
              </div>
            </div>
          ) : (
            <>
              {notifyState === "sent" ? (
                <div className="py-3 px-4 rounded-xl bg-[#1A9248]/10 border border-[#1A9248]/20 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1A9248] flex-shrink-0" />
                  <span className="text-sm font-bold text-[#1A9248]">We&apos;ll notify you when this product is back in stock!</span>
                </div>
              ) : notifyOpen ? (
                <form onSubmit={handleNotify} className="space-y-2">
                  <p className="text-xs text-gray-500">Enter your email and we&apos;ll let you know when it&apos;s available again.</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={e => setNotifyEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-300"
                      />
                    </div>
                    <button type="submit" disabled={notifyState === "sending"}
                      className="px-5 py-3 bg-[#1A9248] hover:bg-[#148038] disabled:opacity-60 text-white rounded-xl transition-colors flex-shrink-0 flex items-center gap-2">
                      {notifyState === "sending" ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Bell className="w-4 h-4" />
                          <span className="text-sm font-bold">Notify Me</span>
                        </>
                      )}
                    </button>
                  </div>
                  {notifyState === "error" && (
                    <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
                  )}
                </form>
              ) : (
                <button onClick={() => setNotifyOpen(true)}
                  className="w-full py-3 text-sm font-bold uppercase tracking-wider rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1A9248] hover:bg-[#1A9248]/5 text-gray-500 hover:text-[#1A9248] transition-all duration-300 flex items-center justify-center gap-2 group">
                  <Bell className="w-4 h-4 group-hover:animate-[ring_0.5s_ease]" />
                  Notify Me When Back in Stock
                </button>
              )}
            </>
          )}
        </div>
      )}
      {activeInStock && canAddToCart && (
        <p className="text-[#1A9248] text-xs font-semibold flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          In stock
        </p>
      )}
    </div>
  );
}
