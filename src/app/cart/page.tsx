"use client";

import { useState }   from "react";
import Link            from "next/link";
import Image           from "next/image";
import { useCart }     from "@/context/CartContext";
import { useAuth }     from "@/context/AuthContext";
import AnimatedButton  from "@/components/ui/AnimatedButton";

/* Cart page is a client component — metadata set via head or route segment */
export default function CartPage() {
  const { cart, cartLoading, removeItem, updateQty, clearCart, applyCoupon, removeCoupon } = useCart();
  const { user } = useAuth();
  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://hempandbarrel.com";

  const [clearing,    setClearing]    = useState(false);
  const [couponCode,  setCouponCode]  = useState("");
  const [couponBusy,  setCouponBusy]  = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponOk,    setCouponOk]    = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponBusy(true); setCouponError(""); setCouponOk(false);
    const result = await applyCoupon(couponCode);
    if (result.error) {
      setCouponError(result.error);
    } else {
      setCouponOk(true);
      setCouponCode("");
      setTimeout(() => setCouponOk(false), 3000);
    }
    setCouponBusy(false);
  };

  const handleClear = async () => {
    setClearing(true);
    await clearCart();
    setClearing(false);
  };

  /* ── Loading ── */
  if (cartLoading) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#1A9248] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500 text-[16.5px]">Loading your cart…</p>
      </div>
    );
  }

  /* ── Empty cart ── */
  if (!cart || cart.isEmpty) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-[#f8f6f3] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-9 h-9 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <h1 className="text-[38px] font-bold text-[#2a1008] mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8 text-[16.5px]">Looks like you haven&apos;t added anything yet.</p>
          <AnimatedButton href="/shop">Continue Shopping</AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#2a1008] py-10">
        <div className="max-w-[1320px] mx-auto px-4">
          <nav className="flex items-center gap-2 text-white/40 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">Cart</span>
          </nav>
          <h1 className="text-white text-[38px] md:text-4xl font-bold">
            Shopping Cart
            <span className="text-white/40 text-lg font-normal ml-3">({cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""})</span>
          </h1>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-[1320px] mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Cart items ── */}
          <div className="flex-1 min-w-0">
            {/* Header row (desktop) */}
            <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-3 border-b border-gray-200 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
              <span>Product</span>
              <span className="text-center w-28">Price</span>
              <span className="text-center w-28">Quantity</span>
              <span className="text-right w-24">Total</span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {cart.items.map(item => {
                const img = item.variation?.image ?? item.product.image;
                const price = item.variation?.price ?? item.product.price ?? "";
                const varAttrs = item.variation?.attributes?.nodes ?? [];

                return (
                  <div key={item.key}
                    className="py-5 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-4 md:gap-6 items-center">

                    {/* Product info */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 bg-[#f8f6f3] rounded-xl overflow-hidden flex-shrink-0">
                        {img?.sourceUrl
                          ? <Image src={img.sourceUrl} alt={img.altText || item.product.name} fill
                              className="object-contain p-1" sizes="80px"/>
                          : <div className="w-full h-full bg-gray-100"/>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.slug}`}
                          className="text-[#2a1008] font-bold text-[15px] hover:text-[#1A9248] transition-colors line-clamp-2">
                          {item.product.name}
                        </Link>
                        {varAttrs.length > 0 && (
                          <p className="text-gray-500 text-[13px] mt-0.5">
                            {varAttrs.map(a => `${a.name}: ${a.value}`).join(" / ")}
                          </p>
                        )}
                        <button onClick={() => removeItem(item.key)}
                          className="text-[10px] text-red-400 hover:text-red-600 mt-1 transition-colors flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price (desktop) */}
                    <div className="hidden md:block text-center w-28">
                      <span className="text-[#2a1008] font-semibold text-[15px]">{price || "—"}</span>
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center w-28 mx-auto md:mx-0">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-full">
                        <button onClick={() => updateQty(item.key, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#3d2b1f] hover:bg-[#f5f0eb] transition-colors font-bold text-base">
                          −
                        </button>
                        <span className="flex-1 text-center text-sm font-bold text-[#3d2b1f]">{item.quantity}</span>
                        <button onClick={() => updateQty(item.key, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#3d2b1f] hover:bg-[#f5f0eb] transition-colors font-bold text-base">
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="text-right w-24 mx-auto md:mx-0">
                      <span className="text-[#2a1008] font-bold text-[15px]">{item.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon code */}
            <div className="pt-5 border-t border-gray-100 space-y-3">
              {/* Applied coupons */}
              {cart.coupons.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cart.coupons.map(c => (
                    <span key={c.code}
                      className="inline-flex items-center gap-1.5 bg-[#f5faf2] border border-[#1A9248]/30 text-[#1A9248] text-xs font-bold px-3 py-1 rounded-full">
                      {c.code}
                      <span className="text-[#1A9248]/70">−{c.discount}</span>
                      <button onClick={() => removeCoupon(c.code)} title="Remove coupon"
                        className="ml-0.5 text-[#1A9248]/60 hover:text-red-500 transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Coupon input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => { setCouponCode(e.target.value); setCouponError(""); setCouponOk(false); }}
                  onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                  placeholder="Coupon code"
                  className="flex-1 h-10 border border-gray-200 rounded-xl px-4 text-sm text-[#2a1008] placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A9248]/30 focus:border-[#1A9248] transition-all"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponBusy || !couponCode.trim()}
                  className="h-10 px-5 bg-[#3d2b1f] hover:bg-[#2a1008] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap">
                  {couponBusy ? "Applying…" : "Apply Coupon"}
                </button>
              </div>
              {couponError && <p className="text-[13px] text-red-500">{couponError}</p>}
              {couponOk    && <p className="text-[13px] text-[#1A9248] font-medium">Coupon applied successfully!</p>}
            </div>

            {/* Cart actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-1">
              <Link href="/shop"
                className="flex items-center gap-2 text-sm text-[#1A9248] font-bold hover:underline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                Continue Shopping
              </Link>
              <button onClick={handleClear} disabled={clearing}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium disabled:opacity-50">
                {clearing ? "Clearing…" : "Clear Cart"}
              </button>
            </div>
          </div>

          {/* ── Order summary ── */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-[#2a1008] px-6 py-4">
                <h2 className="text-white font-bold text-[19px]">Order Summary</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm text-[#3d2b1f]">
                  <span>Subtotal</span>
                  <span className="font-semibold">{cart.subtotal}</span>
                </div>
                {cart.discount && (
                  <div className="flex justify-between text-sm text-[#1A9248]">
                    <span>Discount</span>
                    <span className="font-semibold">−{cart.discount}</span>
                  </div>
                )}
                {cart.shippingTotal && cart.shippingTotal !== "$0.00" ? (
                  <div className="flex justify-between text-sm text-[#3d2b1f]">
                    <span>Shipping</span>
                    <span className="font-semibold">{cart.shippingTotal}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm text-[#3d2b1f]">
                    <span>Shipping</span>
                    <span className="text-[#1A9248] font-semibold text-xs">Calculated at checkout</span>
                  </div>
                )}
                {cart.totalTax && cart.totalTax !== "$0.00" && (
                  <div className="flex justify-between text-sm text-[#3d2b1f]">
                    <span>Tax</span>
                    <span className="font-semibold">{cart.totalTax}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between text-[#2a1008]">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-bold text-xl">{cart.total}</span>
                </div>
              </div>

              {/* Checkout button → WooCommerce native checkout */}
              <div className="px-6 pb-6 space-y-3">
                <a
                  href="/checkout"
                  className="w-full block text-center bg-[#1A9248] hover:bg-[#148038] text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-colors">
                  Proceed to Checkout
                </a>

                {!user && (
                  <p className="text-center text-[13px] text-gray-500">
                    <Link href="/my-account" className="text-[#1A9248] hover:underline font-medium">
                      Sign in
                    </Link>{" "}
                    to access your saved addresses and order history.
                  </p>
                )}

                {/* Accepted payments */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {["VISA", "MC", "AMEX", "PayPal"].map(p => (
                    <span key={p}
                      className="bg-gray-50 border border-gray-200 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust strip */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Free Returns", desc: "30-day returns" },
                { label: "Lab Tested",   desc: "COA on every batch" },
                { label: "Secure",       desc: "SSL encrypted" },
              ].map(b => (
                <div key={b.label}
                  className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                  <p className="text-[12px] font-bold text-[#3d2b1f] uppercase tracking-wider">{b.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
