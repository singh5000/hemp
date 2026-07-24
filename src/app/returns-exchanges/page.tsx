import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";

export const metadata: Metadata = {
  title: "Returns & Exchanges | Hemp & Barrel",
  description:
    "Hemp & Barrel's return and refund policy. We accept returns within 30 days of purchase on unused items in original packaging. Contact us for help.",
};

const RETURNS_PAGE_ID = 3914;

const HIGHLIGHT_ICONS = [
  <svg key="0" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>,
  <svg key="1" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
  </svg>,
  <svg key="2" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
  </svg>,
];

interface ReturnsAcf {
  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;
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

async function getContent(): Promise<ReturnsAcf | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${RETURNS_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.acf ?? null;
}

export default async function ReturnsExchangesPage() {
  const acf = await getContent();
  if (!acf) return null;

  return (
    <>
      {/* ── Hero ── */}
      <PageBanner
        crumbs={[{ label: "Returns & Exchanges" }]}
        eyebrow={acf.hero_eyebrow}
        title={heroTitle(acf.hero_heading)}
        description={acf.hero_description}
        aside={
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-[#1A9248]/30 bg-[#1A9248]/10 text-center">
            <p className="text-[#1A9248] text-[16.5px] font-bold leading-none">30</p>
            <p className="text-[#3d2b1f] text-[16.5px] font-bold uppercase tracking-wider mt-1">Day<br/>Returns</p>
          </div>
        }
      />

      {/* ── Highlights strip ── */}
      <div className="bg-[#f5f0eb] border-b border-[#e8e0d8]">
        <div className="max-w-[1320px] mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {acf.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-[#1A9248]/10 text-[#1A9248] rounded-xl flex items-center justify-center">
                  {HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]}
                </div>
                <div>
                  <p className="font-bold text-[#2a1008] text-[16.5px] mb-1">{h.label}</p>
                  <p className="text-gray-500 text-[16.5px] leading-relaxed">{h.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
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
          <aside className="w-full lg:w-[340px] flex-shrink-0 space-y-6">

            {/* How to return — steps */}
            <div className="bg-[#2a1008] rounded-2xl p-7">
              <p className="text-[#1A9248] text-[16.5px] font-bold uppercase tracking-[0.3em] mb-5">How It Works</p>
              <div className="space-y-6">
                {acf.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-[#1A9248] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      {i < acf.steps.length - 1 && <div className="w-px flex-1 bg-white/10 mt-2" />}
                    </div>
                    <div className="pb-6">
                      <p className="text-white font-bold text-[16.5px] mb-1">{step.title}</p>
                      <p className="text-white/50 text-[16.5px] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              <p className="text-[#1A9248] text-[16.5px] font-bold uppercase tracking-[0.3em] mb-4">Questions?</p>
              <p className="text-[#2a1008] font-bold text-[16.5px] mb-4">We're here to help</p>

              <div className="space-y-3 mb-5">
                <a href="mailto:customerservice@hempandbarrel.com"
                  className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#1A9248] transition-colors group">
                  <div className="w-8 h-8 bg-[#f5f0eb] group-hover:bg-[#1A9248]/10 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-[#1A9248]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  customerservice@hempandbarrel.com
                </a>
                <a href="tel:9803264367"
                  className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#1A9248] transition-colors group">
                  <div className="w-8 h-8 bg-[#f5f0eb] group-hover:bg-[#1A9248]/10 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-[#1A9248]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  (980) 326-4367
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

            {/* Store address */}
            <div className="bg-[#f5f0eb] rounded-2xl p-6">
              <p className="text-[#1A9248] text-[16.5px] font-bold uppercase tracking-[0.3em] mb-3">Store Location</p>
              <p className="text-[#2a1008] font-bold text-[16.5px]">Hemp & Barrel</p>
              <p className="text-[#3d2b1f] text-[16.5px] mt-1 leading-relaxed">800 N Polk Street<br />Pineville, NC 28134</p>
              <Link href="/contact"
                className="mt-4 inline-flex items-center gap-1.5 text-[#1A9248] text-xs font-bold hover:underline">
                Get Directions →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
