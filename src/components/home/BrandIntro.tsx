import Image from "next/image";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Leaf, ShieldCheck, ArrowUpRight, Sparkles } from "lucide-react";

const STATS = [
  { value: "500+", label: "Products" },
  { value: "3rd-Party", label: "Lab Tested" },
  { value: "2019", label: "Est. in NC" },
];

export default function BrandIntro() {
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

              <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-black/5">
                <Image
                  src="https://images.pexels.com/photos/7668051/pexels-photo-7668051.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Hemp & Barrel hemp-derived gummies"
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-cover"
                />
              </div>

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
              Hemp &amp; Barrel — Charlotte &amp; Pineville&apos;s Trusted{" "}
              <span className="text-[#1A9248]">THCA, Delta 8/9 &amp; CBD</span> Shop
            </h2>

            <p className="text-[#5a4a3f] text-[16.5px] md:text-lg leading-[1.9] mb-8 max-w-[640px]">
              From THCA flower and Delta 8/9 gummies to tinctures, topicals, and hemp beverages —
              every product we carry is third-party lab tested and ≤0.3% Delta-9 compliant. We&apos;re
              a true seed-to-shelf, locally owned operation based right here in North Carolina, and
              we&apos;ve scoured the state to bring you the best hemp shopping experience anywhere.
            </p>

            <div className="flex items-center gap-3 mb-9">
              <ShieldCheck className="w-4 h-4 text-[#1A9248] flex-shrink-0" />
              <span className="text-[#3d2b1f] text-[16.5px] font-semibold">
                Every product backed by a Certificate of Analysis.
              </span>
            </div>

            <div className="flex flex-wrap gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
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
