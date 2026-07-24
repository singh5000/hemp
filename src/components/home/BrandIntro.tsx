import Image from "next/image";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Leaf, ShieldCheck, ArrowUpRight, Sparkles } from "lucide-react";

const HOME_PAGE_ID = 38;

interface BrandAcf {
  brand_image: string | false;
  brand_heading: string;
  brand_body: string;
  brand_stats: { value: string; label: string }[];
}

async function getBrandContent(): Promise<BrandAcf | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${HOME_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.acf ?? null;
}

/* Renders *highlighted text* wrapped in green, rest in the normal heading color */
function renderHeading(heading: string) {
  const parts = heading.split(/\*(.+?)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <span key={i} className="text-[#1A9248]">{part}</span> : part
  );
}

export default async function BrandIntro() {
  const acf = await getBrandContent();
  if (!acf) return null;

  return (
    <section className="bg-[#f5f0eb] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #1A9248 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="max-w-[1320px] mx-auto px-4 py-16 md:py-24 relative">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* ── Image ── */}
          <div className="w-full max-w-[360px] flex-shrink-0 flex flex-col items-center">
            <div className="relative">
              {/* Dashed decorative ring */}
              <div className="absolute -inset-6 rounded-full border border-dashed border-[#1A9248]/25 pointer-events-none" />
              {/* Glow */}
              <div className="absolute inset-3 bg-[#1A9248]/15 rounded-full blur-3xl" />

              {acf.brand_image && (
                <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-black/5">
                  <Image
                    src={acf.brand_image}
                    alt="Hemp & Barrel hemp-derived gummies"
                    fill
                    sizes="(max-width: 768px) 280px, 320px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Floating badge */}
              <div className="absolute top-2 left-0 flex items-center gap-1.5 bg-white rounded-full pl-2 pr-3 py-1.5 shadow-lg">
                <span className="w-6 h-6 rounded-full bg-[#1A9248]/10 flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-[#1A9248]" />
                </span>
                <span className="text-[11px] font-bold text-[#2a1008] uppercase tracking-wider">Hemp &amp; Barrel</span>
              </div>

              {/* Arrow button overlapping bottom-right */}
              <Link href="/shop" aria-label="Browse the shop"
                className="group absolute bottom-3 right-3 w-14 h-14 rounded-full bg-[#1A9248] shadow-lg shadow-[#1A9248]/30 flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:bg-[#148038]">
                <ArrowUpRight className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </div>

            <div className="mt-9">
              <AnimatedButton href="/shop" size="lg">Visit Shop</AnimatedButton>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-[#1A9248]" />
              <span className="text-[12px] font-bold text-[#1A9248] uppercase tracking-[0.3em]">Who We Are</span>
            </div>

            <h2 className="text-[36px] md:text-[3rem] font-black text-[#2a1008] leading-[1.1] mb-6">
              {renderHeading(acf.brand_heading)}
            </h2>

            <p className="text-[#5a4a3f] text-[16.5px] md:text-lg leading-[1.9] mb-8 max-w-[640px]">
              {acf.brand_body}
            </p>

            <div className="flex items-center gap-3 mb-9">
              <ShieldCheck className="w-4 h-4 text-[#1A9248] flex-shrink-0" />
              <span className="text-[#3d2b1f] text-[16.5px] font-semibold">
                Every product backed by a Certificate of Analysis.
              </span>
            </div>

            <div className="flex flex-wrap gap-8">
              {acf.brand_stats.map((s, i) => (
                <div key={i}>
                  <p className="text-[28px] font-black text-[#1A9248] leading-none mb-1.5">{s.value}</p>
                  <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
