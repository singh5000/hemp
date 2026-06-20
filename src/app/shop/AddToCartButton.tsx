"use client";

import { useState } from "react";
import { useCart }  from "@/context/CartContext";

export default function AddToCartButton({
  productId,
  inStock,
  variationId,
}: {
  productId:    number;
  inStock:      boolean;
  variationId?: number;
}) {
  const { addToCart } = useCart();
  const [state,   setState]   = useState<"idle" | "loading" | "added" | "error">("idle");
  const [errMsg,  setErrMsg]  = useState("");

  if (!inStock) {
    return (
      <button disabled
        className="w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed">
        Out of Stock
      </button>
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
          state === "loading" ? "bg-[#5a8c3a]/60 text-white cursor-wait" :
                                "bg-[#5a8c3a] hover:bg-[#4a7a2e] text-white"
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
