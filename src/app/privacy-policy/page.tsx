import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";

export const metadata: Metadata = {
  title: "Privacy Policy | Hemp & Barrel",
  description:
    "Hemp & Barrel privacy policy — how we collect, use, and protect information gathered through our website, customer service, retail store, and marketing promotions.",
};

const PRIVACY_PAGE_ID = 3912;

interface PrivacyAcf {
  hero_eyebrow: string;
  hero_heading: string;
  sections: { heading: string; body: string }[];
}

function heroTitle(heading: string) {
  const parts = heading.split(/\*(.+?)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <span key={i} className="text-[#1A9248]">{part}</span> : part
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function getContent(): Promise<PrivacyAcf | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${PRIVACY_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.acf ?? null;
}

export default async function PrivacyPolicyPage() {
  const acf = await getContent();
  if (!acf) return null;

  return (
    <>
      {/* ── Hero ── */}
      <PageBanner
        crumbs={[{ label: "Privacy Policy" }]}
        eyebrow={acf.hero_eyebrow}
        title={heroTitle(acf.hero_heading)}
      />

      {/* ── Content ── */}
      <div className="max-w-[1320px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* ── TOC sidebar ── */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-[16.5px] font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-4">Contents</p>
              <nav className="space-y-0.5">
                {acf.sections.map((s, i) => (
                  <a key={i} href={`#${slugify(s.heading)}`}
                    className="block text-xs text-gray-500 hover:text-[#1A9248] py-1.5 pl-3 border-l-2 border-transparent hover:border-[#1A9248] transition-all leading-snug">
                    {s.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Policy text ── */}
          <div className="flex-1 min-w-0 space-y-10">
            {acf.sections.map((section, i) => (
              <div key={i} id={slugify(section.heading)} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-6 bg-[#1A9248] rounded-full flex-shrink-0" />
                  <h2 className="text-[#2a1008] text-[28px] font-bold">{section.heading}</h2>
                </div>
                <div
                  className="pl-5 text-[#3d2b1f] text-[16.5px] leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0 [&_ul]:mt-2 [&_ul]:space-y-2 [&_li]:list-disc [&_li]:ml-5"
                  dangerouslySetInnerHTML={{ __html: section.body }}
                />
              </div>
            ))}

            {/* Contact card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
              <a href="mailto:customerservice@hempandbarrel.com"
                className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#1A9248] transition-colors">
                <svg className="w-4 h-4 text-[#1A9248] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                customerservice@hempandbarrel.com
              </a>
              <a href="tel:9803264367"
                className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#1A9248] transition-colors">
                <svg className="w-4 h-4 text-[#1A9248] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                (980) 326-4367
              </a>
              <div className="pt-2">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 bg-[#1A9248] hover:bg-[#148038] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
