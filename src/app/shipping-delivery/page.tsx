import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Hemp & Barrel",
  description:
    "Hemp & Barrel shipping policy — Priority USPS, 1-2 business day processing, nationwide delivery to US addresses including territories and APO/FPO.",
};

export default function ShippingDeliveryPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#2a1008] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #1A9248 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute -right-32 -top-20 w-[500px] h-[500px] bg-[#1A9248]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1320px] mx-auto px-4 py-20 md:py-24">
          <nav className="flex items-center gap-2 text-white/40 text-sm mb-7">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">Shipping &amp; Delivery</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div>
              <p className="text-[#1A9248] text-[16.5px] font-bold uppercase tracking-[0.4em] mb-3">We Ship Nationwide</p>
              <h1 className="text-white text-[44px] md:text-6xl font-bold leading-tight mb-4">
                Shipping &amp;<br />
                <span className="text-[#1A9248]">Delivery</span>
              </h1>
              <p className="text-white/50 text-[16.5px] md:text-lg max-w-[500px] leading-relaxed">
                Fast, trackable Priority USPS shipping to all US addresses — including
                territories and APO/FPO/DPO.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 flex-shrink-0 flex-wrap">
              {[
                { value: "1–2",  unit: "days",      label: "Processing" },
                { value: "1–2",  unit: "days",      label: "Delivery" },
                { value: "$10",  unit: "flat rate",  label: "Shipping Cost" },
              ].map((s) => (
                <div key={s.label}
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center min-w-[90px]">
                  <p className="text-[#1A9248] text-[16.5px] font-bold leading-none">{s.value}</p>
                  <p className="text-white/40 text-[16.5px] uppercase tracking-wider mt-0.5 font-semibold">{s.unit}</p>
                  <p className="text-white/60 text-[16.5px] font-semibold mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── At-a-glance strip ── */}
      <div className="bg-[#f5f0eb] border-b border-[#e8e0d8]">
        <div className="max-w-[1320px] mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
                label: "1–2 Day Processing",
                desc: "Orders processed within 1–2 business days (no weekends or holidays).",
              },
              {
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>,
                label: "Priority USPS",
                desc: "Shipped via Priority Mail for fast, reliable delivery across the US.",
              },
              {
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>,
                label: "Nationwide Coverage",
                desc: "US, US Territories, and APO/FPO/DPO military addresses accepted.",
              },
              {
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
                label: "Tracking Included",
                desc: "Shipment confirmation email with tracking number within 24–48 hours.",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-[#1A9248]/10 text-[#1A9248] rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-[#2a1008] text-[16.5px] mb-1">{item.label}</p>
                  <p className="text-gray-500 text-[16.5px] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="max-w-[1320px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* ── Policy sections ── */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* Shipping method table */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-7 bg-[#1A9248] rounded-full" />
                <h2 className="text-[#2a1008] text-[32px] font-bold">Shipping Method &amp; Cost</h2>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#2a1008]">
                      <th className="text-left text-white font-bold px-6 py-4 text-xs uppercase tracking-widest">Method</th>
                      <th className="text-left text-white font-bold px-6 py-4 text-xs uppercase tracking-widest">Estimated Delivery</th>
                      <th className="text-left text-white font-bold px-6 py-4 text-xs uppercase tracking-widest">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-100">
                      <td className="px-6 py-4 font-semibold text-[#2a1008]">Priority USPS</td>
                      <td className="px-6 py-4 text-[#3d2b1f]">1–2 business days</td>
                      <td className="px-6 py-4">
                        <span className="bg-[#1A9248]/10 text-[#1A9248] font-bold text-xs px-3 py-1.5 rounded-full">$10.00</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="px-6 py-4 bg-[#fafaf8] border-t border-gray-100">
                  <p className="text-gray-500 text-[16.5px] leading-relaxed">
                    Overnight delivery is available for orders with delivery addresses within the continental United States only.
                  </p>
                </div>
              </div>
            </div>

            {/* Processing time */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-7 bg-[#1A9248] rounded-full" />
                <h2 className="text-[#2a1008] text-[32px] font-bold">Processing Time</h2>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm space-y-4">
                <p className="text-[#3d2b1f] text-[16.5px] leading-relaxed">
                  All orders are processed within <strong className="text-[#2a1008]">1–2 business days</strong> after payment confirmation.
                  Orders placed on weekends or public holidays will be processed on the next business day.
                </p>
                <div className="flex items-start gap-3 bg-[#f5f0eb] rounded-xl p-4">
                  <svg className="w-5 h-5 text-[#1A9248] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-[16.5px] text-[#3d2b1f]">
                    Orders are not shipped or delivered on weekends or holidays. Please account for this
                    when calculating your expected delivery date.
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-7 bg-[#1A9248] rounded-full" />
                <h2 className="text-[#2a1008] text-[32px] font-bold">Order Tracking</h2>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm space-y-4">
                <p className="text-[#3d2b1f] text-[16.5px] leading-relaxed">
                  You will receive a <strong className="text-[#2a1008]">Shipment Confirmation email</strong> once your order has
                  shipped, containing your tracking number(s). The tracking number will become
                  active within <strong className="text-[#2a1008]">24–48 hours</strong> of shipment.
                </p>
              </div>
            </div>

            {/* Service area */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-7 bg-[#1A9248] rounded-full" />
                <h2 className="text-[#2a1008] text-[32px] font-bold">Service Area</h2>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
                <p className="text-[#3d2b1f] text-[16.5px] leading-relaxed mb-5">
                  Hemp &amp; Barrel ships to addresses within the United States, including:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["US Domestic (all 50 states)", "US Territories", "APO/FPO/DPO Military Addresses"].map((area) => (
                    <div key={area} className="flex items-center gap-3 bg-[#f5f0eb] rounded-xl px-4 py-3">
                      <svg className="w-4 h-4 text-[#1A9248] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span className="text-sm font-semibold text-[#2a1008]">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Damages */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-7 bg-[#1A9248] rounded-full" />
                <h2 className="text-[#2a1008] text-[32px] font-bold">Damaged or Lost Shipments</h2>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm space-y-4">
                <p className="text-[#3d2b1f] text-[16.5px] leading-relaxed">
                  Hemp &amp; Barrel is not liable for products damaged or lost during shipping.
                  If you received a damaged product, please <strong className="text-[#2a1008]">save all packaging materials and
                  damaged goods</strong> before filing a claim with the carrier.
                </p>
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <p className="text-[16.5px] text-amber-800 font-medium">
                    Hemp &amp; Barrel is not responsible for any customs duties or taxes applied to your
                    order by your local jurisdiction. All such fees are the buyer's responsibility.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6">

            {/* What to expect */}
            <div className="bg-[#2a1008] rounded-2xl p-7">
              <p className="text-[#1A9248] text-[16.5px] font-bold uppercase tracking-[0.3em] mb-5">What to Expect</p>
              <div className="space-y-5">
                {[
                  { step: "01", title: "Place Your Order", desc: "Complete checkout and receive your order confirmation email." },
                  { step: "02", title: "We Process It",   desc: "Your order is packed and prepared within 1–2 business days." },
                  { step: "03", title: "It Ships",        desc: "Priority USPS picks it up and you get a tracking number." },
                  { step: "04", title: "It Arrives",      desc: "Delivered to your door in 1–2 business days after shipping." },
                ].map((item, i, arr) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#1A9248] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {item.step}
                      </div>
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1.5" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-white font-bold text-[16.5px] mb-1">{item.title}</p>
                      <p className="text-white/50 text-[16.5px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-[#1A9248] text-[16.5px] font-bold uppercase tracking-[0.3em] mb-4">Shipping Questions?</p>
              <div className="space-y-3 mb-5">
                <a href="tel:9803264367"
                  className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#1A9248] transition-colors group">
                  <div className="w-8 h-8 bg-[#f5f0eb] group-hover:bg-[#1A9248]/10 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-[#1A9248]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  (980) 326-4367
                </a>
                <a href="mailto:customerservice@hempandbarrel.com"
                  className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#1A9248] transition-colors group">
                  <div className="w-8 h-8 bg-[#f5f0eb] group-hover:bg-[#1A9248]/10 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-[#1A9248]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  customerservice@hempandbarrel.com
                </a>
                <div className="flex items-start gap-3 text-sm text-[#3d2b1f]">
                  <div className="w-8 h-8 bg-[#f5f0eb] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#1A9248]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[16.5px]">Mon–Sat: 10am – 8pm</p>
                    <p className="text-gray-400 text-[16.5px]">Sun: 12pm – 4pm</p>
                  </div>
                </div>
              </div>
              <Link href="/contact"
                className="block w-full text-center bg-[#1A9248] hover:bg-[#148038] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-colors">
                Contact Us
              </Link>
            </div>

            {/* Related links */}
            <div className="bg-[#f5f0eb] rounded-2xl p-6">
              <p className="text-[#1A9248] text-[16.5px] font-bold uppercase tracking-[0.3em] mb-4">Related Policies</p>
              <div className="space-y-2">
                {[
                  { href: "/returns-exchanges", label: "Returns & Exchanges" },
                  { href: "/terms-and-conditions", label: "Terms & Conditions" },
                  { href: "/faqs", label: "FAQs" },
                ].map((link) => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center justify-between text-sm text-[#3d2b1f] hover:text-[#1A9248] transition-colors py-2 border-b border-[#e8e0d8] last:border-0">
                    {link.label}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
