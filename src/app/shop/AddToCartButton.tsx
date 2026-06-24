"use client";

import { useState } from "react";
import { useCart }  from "@/context/CartContext";

export default function AddToCartButton({
  productId,
  inStock,
  variationId,
  isInStoreOnly,
}: {
  productId:      number;
  inStock:        boolean;
  variationId?:   number;
  isInStoreOnly?: boolean;
}) {
  const { addToCart } = useCart();
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  if (!inStock) {
    if (isInStoreOnly) {
      return (
        <div className="w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 text-center flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          In-Store Only
        </div>
      );
    }
    return (
      <div className="w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-gray-100 text-gray-400 text-center">
        Sold Out
      </div>
    );
  }

  const handleAdd = async () => {
    setState("loading");
    setErrMsg("");
    const result = await addToCart(productId, 1, variationId);
    if (result.error) {
      setState("error");
      setErrMsg(result.error);
      setTimeout(() => { setState("idle"); setErrMsg(""); }, 3500);
    } else {
      setState("added");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleAdd}
        disabled={state === "loading"}
        className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
          state === "added"   ? "bg-emerald-500 text-white" :
          state === "error"   ? "bg-red-500 text-white" :
          state === "loading" ? "bg-[#1A9248]/60 text-white cursor-wait" :
                                "bg-[#1A9248] hover:bg-[#148038] text-white"
        }`}
      >
        {state === "loading" ? "Adding…" :
         state === "added"   ? "Added!" :
         state === "error"   ? "Error" :
                               "Add to Cart"}
      </button>
      {errMsg && (
        <p className="text-[10px] text-red-500 leading-tight text-center px-1">{errMsg}</p>
      )}
    </div>
  );
}
