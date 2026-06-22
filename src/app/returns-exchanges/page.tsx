import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Exchanges | Hemp & Barrel",
  description:
    "Hemp & Barrel's return and refund policy. We accept returns within 30 days of purchase on unused items in original packaging. Contact us for help.",
};

const STEPS = [
  {
    n: "01",
    title: "Contact Us",
    desc: "Email customerservice@email.com within 30 days of your purchase date. Include your order number and reason for return.",
  },
  {
    n: "02",
    title: "Ship It Back",
    desc: "Pack the item securely in its original packaging and ship it back to our store. Return shipping costs are the customer's responsibility.",
  },
  {
    n: "03",
    title: "Get Your Refund",
    desc: "Once we receive and inspect the item, we'll notify you and process your refund to the original payment method within your card issuer's timeframe.",
  },
];

const HIGHLIGHTS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    ),
    label: "30-Day Window",
    desc: "Request a return or refund within 30 days of purchase.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
    ),
    label: "Original Condition",
    desc: "Items must be unused, in original packaging with proof of purchase.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
      </svg>
    ),
    label: "Full Refund",
    desc: "Approved returns receive a full refund to the original payment method.",
  },
];

export default function ReturnsExchangesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#2a1008] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #5a8c3a 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute -right-32 -top-20 w-[500px] h-[500px] bg-[#5a8c3a]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full mx-auto px-[40px] py-20 md:py-24">
          <nav className="flex items-center gap-2 text-white/40 text-sm mb-7">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">Returns & Exchanges</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div>
              <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.4em] mb-3">Customer Satisfaction</p>
              <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-4">
                Returns &<br />
                <span className="text-[#5a8c3a]">Exchanges</span>
              </h1>
              <p className="text-white/50 text-base md:text-lg max-w-[500px] leading-relaxed">
                Thanks for shopping at Hemp &amp; Barrel. If you are not entirely satisfied
                with your purchase, we are here to help.
              </p>
            </div>

            {/* 30-day badge */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-[#5a8c3a]/40 bg-[#5a8c3a]/10 text-center">
              <p className="text-[#5a8c3a] text-4xl font-bold leading-none">30</p>
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider mt-1">Day<br/>Returns</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Highlights strip ── */}
      <div className="bg-[#f5f0eb] border-b border-[#e8e0d8]">
        <div className="w-full mx-auto px-[40px] py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-[#5a8c3a]/10 text-[#5a8c3a] rounded-xl flex items-center justify-center">
                  {h.icon}
                </div>
                <div>
                  <p className="font-bold text-[#2a1008] text-sm mb-1">{h.label}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="w-full mx-auto px-[40px] py-16">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* ── Policy sections ── */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* Returns */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-7 bg-[#5a8c3a] rounded-full" />
                <h2 className="text-[#2a1008] text-2xl font-bold">Returns</h2>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm space-y-4 text-[#3d2b1f] text-[15px] leading-relaxed">
                <p>
                  We take customer satisfaction very seriously. Please check your shipment carefully
                  upon arrival to ensure it has not been damaged during shipping.
                </p>
                <p>
                  All claims for damaged products must be made <strong className="text-[#2a1008]">within 30 days of receipt</strong> by
                  writing to us at{" "}
                  <a href="mailto:customerservice@email.com"
                    className="text-[#5a8c3a] underline underline-offset-2 hover:text-[#3d7a28] font-semibold">
                    customerservice@email.com
                  </a>. You will need to provide detailed information
                  (including images) for any product damaged during shipping within that timeframe.
                </p>
                <div className="bg-[#f5f0eb] rounded-xl p-5">
                  <p className="text-[#2a1008] font-bold text-sm mb-3">To be eligible for a return, your item must:</p>
                  <ul className="space-y-2">
                    {[
                      "Be unused and in the same condition as received",
                      "Be in the original packaging",
                      "Include the receipt or proof of purchase",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-[#3d2b1f]">
                        <svg className="w-4 h-4 text-[#5a8c3a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Refunds */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-7 bg-[#5a8c3a] rounded-full" />
                <h2 className="text-[#2a1008] text-2xl font-bold">Refunds</h2>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm space-y-4 text-[#3d2b1f] text-[15px] leading-relaxed">
                <p>
                  If you are not satisfied with our products, you may request a refund of the
                  full purchase price within <strong className="text-[#2a1008]">30 days of the purchase date</strong>.
                  Please submit this request by writing to{" "}
                  <a href="mailto:customerservice@email.com"
                    className="text-[#5a8c3a] underline underline-offset-2 hover:text-[#3d7a28] font-semibold">
                    customerservice@email.com
                  </a>.
                </p>
                <p>
                  Once we receive your item, we will inspect it and notify you of the status of
                  your refund. If your return is approved, we will initiate a refund to your
                  credit card or original method of payment.
                </p>
                <div className="flex items-start gap-3 bg-[#5a8c3a]/5 border border-[#5a8c3a]/20 rounded-xl p-4">
                  <svg className="w-5 h-5 text-[#5a8c3a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-sm text-[#3d2b1f]">
                    You will receive the credit within a certain number of days, depending on
                    your card issuer's policies.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-7 bg-[#5a8c3a] rounded-full" />
                <h2 className="text-[#2a1008] text-2xl font-bold">Return Shipping</h2>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm space-y-4 text-[#3d2b1f] text-[15px] leading-relaxed">
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <p className="text-sm text-amber-800 font-medium">
                    You are responsible for paying your own return shipping costs. Shipping costs are <strong>non-refundable</strong>.
                  </p>
                </div>
                <p>
                  If you receive a refund, the cost of return shipping will be deducted from your refund amount.
                  We recommend using a trackable shipping service or purchasing shipping insurance for items over $50.
                </p>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-[340px] flex-shrink-0 space-y-6">

            {/* How to return — steps */}
            <div className="bg-[#2a1008] rounded-2xl p-7">
              <p className="text-[#5a8c3a] text-[11px] font-bold uppercase tracking-[0.3em] mb-5">How It Works</p>
              <div className="space-y-6">
                {STEPS.map((step, i) => (
                  <div key={step.n} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-[#5a8c3a] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {step.n}
                      </div>
                      {i < STEPS.length - 1 && <div className="w-px flex-1 bg-white/10 mt-2" />}
                    </div>
                    <div className="pb-6">
                      <p className="text-white font-bold text-sm mb-1">{step.title}</p>
                      <p className="text-white/50 text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              <p className="text-[#5a8c3a] text-[11px] font-bold uppercase tracking-[0.3em] mb-4">Questions?</p>
              <p className="text-[#2a1008] font-bold text-base mb-4">We're here to help</p>

              <div className="space-y-3 mb-5">
                <a href="mailto:customerservice@email.com"
                  className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#5a8c3a] transition-colors group">
                  <div className="w-8 h-8 bg-[#f5f0eb] group-hover:bg-[#5a8c3a]/10 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-[#5a8c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  customerservice@email.com
                </a>
                <a href="tel:9803264367"
                  className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#5a8c3a] transition-colors group">
                  <div className="w-8 h-8 bg-[#f5f0eb] group-hover:bg-[#5a8c3a]/10 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-[#5a8c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  (980) 326-4367
                </a>
                <div className="flex items-start gap-3 text-sm text-[#3d2b1f]">
                  <div className="w-8 h-8 bg-[#f5f0eb] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#5a8c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Mon–Sat: 10am – 8pm</p>
                    <p className="text-gray-400 text-xs">Sun: 12pm – 4pm</p>
                  </div>
                </div>
              </div>

              <Link href="/contact"
                className="block w-full text-center bg-[#5a8c3a] hover:bg-[#4a7a2e] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-colors">
                Contact Us
              </Link>
            </div>

            {/* Store address */}
            <div className="bg-[#f5f0eb] rounded-2xl p-6">
              <p className="text-[#5a8c3a] text-[11px] font-bold uppercase tracking-[0.3em] mb-3">Store Location</p>
              <p className="text-[#2a1008] font-bold text-sm">Hemp & Barrel</p>
              <p className="text-[#3d2b1f] text-sm mt-1 leading-relaxed">800 N Polk Street<br />Pineville, NC 28134</p>
              <Link href="/contact"
                className="mt-4 inline-flex items-center gap-1.5 text-[#5a8c3a] text-xs font-bold hover:underline">
                Get Directions →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
