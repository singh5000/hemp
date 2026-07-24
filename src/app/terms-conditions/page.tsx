import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";

export const metadata: Metadata = {
  title: "Terms & Conditions | Hemp & Barrel",
  description:
    "Terms and conditions governing use of the Hemp & Barrel website. By visiting our site you agree to these terms.",
};

const TERMS_PAGE_ID = 3928;

interface TermsAcf {
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

async function getContent(): Promise<TermsAcf | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${TERMS_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.acf ?? null;
}

export default async function TermsPage() {
  const acf = await getContent();
  if (!acf) return null;

  return (
    <>
      {/* ── Hero ── */}
      <PageBanner
        crumbs={[{ label: "Terms & Conditions" }]}
        eyebrow={acf.hero_eyebrow}
        title={heroTitle(acf.hero_heading)}
      />

      {/* ── Agreement notice ── */}
      <div className="bg-[#2a1008] border-t border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 py-5">
          <p className="text-white/70 text-[16.5px] font-semibold uppercase tracking-widest text-center">
            By visiting Hemp and Barrel website you agree to the following Terms &amp; Conditions.
          </p>
        </div>
      </div>

      {/* ── Age notice ── */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-[1320px] mx-auto px-4 py-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p className="text-amber-800 text-[16.5px] font-bold uppercase tracking-wide">
            This website is not intended for persons under 18 years of age.
          </p>
        </div>
      </div>

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
                    className="block text-[15px] text-gray-500 hover:text-[#1A9248] py-1.5 pl-3 border-l-2 border-transparent hover:border-[#1A9248] transition-all leading-snug">
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

            {/* Contact section */}
            <div id="contact" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-[#1A9248] rounded-full flex-shrink-0" />
                <h2 className="text-[#2a1008] text-[28px] font-bold">Contact Us</h2>
              </div>
              <div className="pl-5">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#3d2b1f]">
                    <svg className="w-4 h-4 text-[#1A9248] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    800 N Polk Street, Pineville, NC 28134
                  </div>
                  <a href="tel:9803264367" className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#1A9248] transition-colors">
                    <svg className="w-4 h-4 text-[#1A9248] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    (980) 326-4367
                  </a>
                  <div className="flex items-center gap-3 text-sm text-[#3d2b1f]">
                    <svg className="w-4 h-4 text-[#1A9248] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Mon–Sat: 10am – 8pm &nbsp;|&nbsp; Sun: 12pm – 4pm
                  </div>
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
        </div>
      </div>
    </>
  );
}
