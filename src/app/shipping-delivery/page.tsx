import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Hemp & Barrel",
  description:
    "Hemp & Barrel shipping policy — Priority USPS, 1-2 business day processing, nationwide delivery to US addresses including territories and APO/FPO.",
};

const SHIPPING_PAGE_ID = 4376;

const HIGHLIGHT_ICONS = [
  <svg key="0" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  <svg key="1" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>,
  <svg key="2" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>,
  <svg key="3" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
];

interface ShippingAcf {
  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;
  quick_facts: { value: string; unit: string; label: string }[];
  highlights: { label: string; description: string }[];
  sections: { heading: string; body: string }[];
  steps: { title: string; description: string }[];
}

function heroTitle(heading: string) {
  const parts = heading.split(/\*(.+?)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <span key={i} className="text-[#1A9248]">{part}</span> : part
  );
}

async function getContent(): Promise<ShippingAcf | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${SHIPPING_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.acf ?? null;
}

export default async function ShippingDeliveryPage() {
  const acf = await getContent();
  if (!acf) return null;

  return (
    <>
      {/* ── Hero ── */}
      <PageBanner
        crumbs={[{ label: "Shipping & Delivery" }]}
        eyebrow={acf.hero_eyebrow}
        title={heroTitle(acf.hero_heading)}
        description={acf.hero_description}
        aside={
          <div className="flex gap-4 flex-shrink-0 flex-wrap">
            {acf.quick_facts.map((s, i) => (
              <div key={i}
                className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-4 text-center min-w-[90px]">
                <p className="text-[#1A9248] text-[16.5px] font-bold leading-none">{s.value}</p>
                <p className="text-gray-400 text-[16.5px] uppercase tracking-wider mt-0.5 font-semibold">{s.unit}</p>
                <p className="text-[#3d2b1f] text-[16.5px] font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        }
      />

      {/* ── At-a-glance strip ── */}
      <div className="bg-[#f5f0eb] border-b border-[#e8e0d8]">
        <div className="max-w-[1320px] mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {acf.highlights.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-[#1A9248]/10 text-[#1A9248] rounded-xl flex items-center justify-center">
                  {HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]}
                </div>
                <div>
                  <p className="font-bold text-[#2a1008] text-[16.5px] mb-1">{item.label}</p>
                  <p className="text-gray-500 text-[16.5px] leading-relaxed">{item.description}</p>
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
            {acf.sections.map((s, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-7 bg-[#1A9248] rounded-full" />
                  <h2 className="text-[#2a1008] text-[32px] font-bold">{s.heading}</h2>
                </div>
                <div
                  className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm text-[#3d2b1f] text-[16.5px] leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0 [&_ul]:mt-2 [&_ul]:space-y-2 [&_li]:list-disc [&_li]:ml-5"
                  dangerouslySetInnerHTML={{ __html: s.body }}
                />
              </div>
            ))}
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6">

            {/* What to expect */}
            <div className="bg-[#2a1008] rounded-2xl p-7">
              <p className="text-[#1A9248] text-[16.5px] font-bold uppercase tracking-[0.3em] mb-5">What to Expect</p>
              <div className="space-y-5">
                {acf.steps.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#1A9248] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      {i < acf.steps.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1.5" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-white font-bold text-[16.5px] mb-1">{item.title}</p>
                      <p className="text-white/50 text-[16.5px] leading-relaxed">{item.description}</p>
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
                  { href: "/terms-conditions", label: "Terms & Conditions" },
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
