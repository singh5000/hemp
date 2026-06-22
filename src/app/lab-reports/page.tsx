import type { Metadata } from "next";
import Link from "next/link";
import LabReportsClient from "./LabReportsClient";

export const metadata: Metadata = {
  title: "Lab Reports & COA Results | Hemp & Barrel",
  description:
    "View third-party Certificates of Analysis (COA) for every Hemp & Barrel product — gummies, hempettes, CBD flower, and THCa flower strains. Full transparency guaranteed.",
};

export default function LabReportsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#2a1008] overflow-hidden">
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #5a8c3a 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        {/* glow */}
        <div className="absolute -left-40 top-0 w-[600px] h-[600px] bg-[#5a8c3a]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-[#5a8c3a]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-[1320px] mx-auto px-4 py-20 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div>
              {/* breadcrumb */}
              <nav className="flex items-center gap-2 text-white/40 text-sm mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-white/60">Lab Reports</span>
              </nav>

              <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.4em] mb-3">Full Transparency</p>
              <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-4">
                Lab Reports &<br />
                <span className="text-[#5a8c3a]">COA Results</span>
              </h1>
              <p className="text-white/50 text-base md:text-lg max-w-[520px] leading-relaxed">
                Every product we carry is tested by an independent, ISO-accredited laboratory.
                Browse and download any Certificate of Analysis below.
              </p>
            </div>

            {/* stat cards */}
            <div className="flex gap-4 flex-shrink-0">
              {[
                { label: "COAs Published", value: "50+" },
                { label: "Product Categories", value: "4" },
                { label: "Testing Standard", value: "ISO" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center min-w-[90px]">
                  <p className="text-[#5a8c3a] text-2xl font-bold">{s.value}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1 font-semibold leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content (client) ── */}
      <LabReportsClient />
    </>
  );
}
