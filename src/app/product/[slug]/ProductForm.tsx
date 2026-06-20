"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

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
  productId:   number;
  hasOptions:  boolean;
  isInStock:   boolean;
  attributes:  Attribute[];
  variations:  Variation[];
}

function fmt(minor: string, unit: number, sym: string) {
  return `${sym}${(parseInt(minor) / Math.pow(10, unit)).toFixed(2)}`;
}

export default function ProductForm({ productId, hasOptions, isInStock, attributes, variations }: Props) {
  const { addToCart } = useCart();
  const [qty,       setQty]    = useState(1);
  const [selected,  setSelected] = useState<Record<string, string>>({});
  const [cartState, setCartState] = useState<"idle" | "loading" | "added" | "error">("idle");

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
                        ? "border-[#5a8c3a] bg-[#5a8c3a] text-white"
                        : "border-gray-200 text-[#3d2b1f] hover:border-[#5a8c3a]"
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
              : cartState === "loading" ? "bg-[#5a8c3a]/60 text-white cursor-wait"
              : "bg-[#5a8c3a] hover:bg-[#4a7a2e] text-white"
          }`}>
          {!canAddToCart && hasOptions && !matchedVariation
            ? "Select Options"
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
        <p className="text-red-500 text-xs font-semibold flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Out of stock
        </p>
      )}
      {activeInStock && canAddToCart && (
        <p className="text-[#5a8c3a] text-xs font-semibold flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          In stock
        </p>
      )}
    </div>
  );
}
