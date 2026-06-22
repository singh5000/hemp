"use client";

import { useState } from "react";
import { useCart }  from "@/context/CartContext";
import { Bell, Check, Mail } from "lucide-react";

const WP = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

export default function AddToCartButton({
  productId,
  inStock,
  variationId,
  productName,
}: {
  productId:    number;
  inStock:      boolean;
  variationId?: number;
  productName?: string;
}) {
  const { addToCart } = useCart();
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  // Notify me states
  const [notifyOpen, setNotifyOpen] = useState(false);
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
        body: JSON.stringify({ email: notifyEmail, productId, productName: productName ?? "" }),
      });
      if (!res.ok) throw new Error();
      setNotifyState("sent");
    } catch {
      setNotifyState("error");
      setTimeout(() => setNotifyState("idle"), 3000);
    }
  };

  if (!inStock) {
    return (
      <div className="space-y-2">
        {notifyState === "sent" ? (
          <div className="w-full py-3 px-3 rounded-xl bg-[#1A9248]/10 border border-[#1A9248]/20 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-[#1A9248]" />
            <span className="text-xs font-bold text-[#1A9248]">We&apos;ll notify you!</span>
          </div>
        ) : notifyOpen ? (
          <form onSubmit={handleNotify} className="space-y-1.5">
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={e => setNotifyEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full pl-8 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-300"
                />
              </div>
              <button type="submit" disabled={notifyState === "sending"}
                className="px-3 py-2.5 bg-[#1A9248] hover:bg-[#148038] disabled:opacity-60 text-white rounded-xl transition-colors flex-shrink-0">
                {notifyState === "sending" ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Bell className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {notifyState === "error" && (
              <p className="text-[10px] text-red-500 text-center">Something went wrong. Try again.</p>
            )}
          </form>
        ) : (
          <button onClick={() => setNotifyOpen(true)}
            className="w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-gray-100 hover:bg-[#1A9248]/10 hover:text-[#1A9248] text-gray-400 transition-all duration-300 flex items-center justify-center gap-1.5 group">
            <Bell className="w-3.5 h-3.5 group-hover:animate-[ring_0.5s_ease]" />
            Notify When Available
          </button>
        )}
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
