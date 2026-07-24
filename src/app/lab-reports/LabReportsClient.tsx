"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Category = "All" | "Gummies" | "Hempettes" | "CBD Flower" | "THCa Flower";

export interface LabReport {
  name: string;
  category: Exclude<Category, "All">;
  strain_type: "Indica" | "Sativa" | "Hybrid" | "";
  thca: string;
  terpenes: string;
  batch: string;
  file: string | false;
}

/* ── Helpers ── */
const TYPE_STYLE: Record<string, string> = {
  Indica:  "bg-purple-100 text-purple-700",
  Sativa:  "bg-amber-100  text-amber-700",
  Hybrid:  "bg-sky-100    text-sky-700",
};

const CAT_STYLE: Record<string, string> = {
  "Gummies":      "bg-pink-100  text-pink-700",
  "Hempettes":    "bg-orange-100 text-orange-700",
  "CBD Flower":   "bg-emerald-100 text-emerald-700",
  "THCa Flower":  "bg-[#1A9248]/10 text-[#1A9248]",
};

const CATS: Category[] = ["All", "Gummies", "Hempettes", "CBD Flower", "THCa Flower"];

const isPDF = (url: string) => url.toLowerCase().endsWith(".pdf");

function ShieldIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
    </svg>
  );
}

export default function LabReportsClient({ reports }: { reports: LabReport[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return reports.filter((r) => {
      const catMatch = activeCategory === "All" || r.category === activeCategory;
      const searchMatch = !q || r.name.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [reports, activeCategory, search]);

  const counts: Record<Category, number> = useMemo(() => ({
    "All":          reports.length,
    "Gummies":      reports.filter(r => r.category === "Gummies").length,
    "Hempettes":    reports.filter(r => r.category === "Hempettes").length,
    "CBD Flower":   reports.filter(r => r.category === "CBD Flower").length,
    "THCa Flower":  reports.filter(r => r.category === "THCa Flower").length,
  }), [reports]);

  return (
    <div>
      {/* ── Filter Bar ── */}
      <div className="max-w-[1320px] mx-auto px-4 py-10">

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-[#1A9248] text-white border-[#1A9248] shadow-md shadow-[#1A9248]/20"
                    : "bg-white text-[#3d2b1f] border-gray-200 hover:border-[#1A9248] hover:text-[#1A9248]"
                }`}
              >
                {cat}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {counts[cat]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search strains…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-400 text-[16.5px] mb-6">
          Showing <span className="font-bold text-[#3d2b1f]">{filtered.length}</span> certificates
        </p>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[16.5px] text-gray-300 font-bold">No results found</p>
            <button onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-4 text-[#1A9248] text-sm font-bold hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((report, i) => (
              <div key={i}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">

                {/* Card header */}
                <div className="bg-[#2a1008] px-5 pt-5 pb-4 flex items-start justify-between gap-2">
                  <h3 className="text-white font-bold text-[18px] leading-snug flex-1">{report.name}</h3>
                  {report.file && (
                    <span className="flex-shrink-0 bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                      {isPDF(report.file) ? "PDF" : "IMG"}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${CAT_STYLE[report.category]}`}>
                      {report.category}
                    </span>
                    {report.strain_type && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${TYPE_STYLE[report.strain_type]}`}>
                        {report.strain_type}
                      </span>
                    )}
                  </div>

                  {/* THCa + Terpenes stats */}
                  {(report.thca || report.terpenes) && (
                    <div className="flex gap-3 mb-4">
                      {report.thca && (
                        <div className="flex-1 bg-[#f5f0eb] rounded-xl px-3 py-2.5 text-center">
                          <p className="text-[#1A9248] text-[16.5px] font-bold leading-none">{Number(report.thca).toFixed(1)}%</p>
                          <p className="text-[#3d2b1f]/50 text-[16.5px] uppercase tracking-wider mt-1 font-semibold">THCa</p>
                        </div>
                      )}
                      {report.terpenes && (
                        <div className="flex-1 bg-[#f5f0eb] rounded-xl px-3 py-2.5 text-center">
                          <p className="text-[#3d2b1f] text-[16.5px] font-bold leading-none">{Number(report.terpenes).toFixed(2)}%</p>
                          <p className="text-[#3d2b1f]/50 text-[16.5px] uppercase tracking-wider mt-1 font-semibold">Terpenes</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Batch */}
                  {report.batch && (
                    <p className="text-gray-400 text-[16.5px] mb-4 font-mono">Batch: {report.batch}</p>
                  )}

                  {/* CTA */}
                  {report.file && (
                    <div className="mt-auto">
                      <Link
                        href={report.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#1A9248] hover:bg-[#148038] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        View COA
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Trust strip ── */}
      <div className="border-t border-gray-100 bg-[#fafaf8] py-12 mt-4">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: <ShieldIcon />, title: "Third-Party Tested",  desc: "Every batch is tested by an independent ISO-accredited lab." },
              { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>, title: "Federal Farm Bill Compliant", desc: "All hemp products contain ≤ 0.3% Delta-9 THC as required by law." },
              { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>, title: "Full Transparency",  desc: "Scan our QR codes in-store or check any COA here anytime." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-[#1A9248]/10 text-[#1A9248] rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <p className="font-bold text-[#2a1008] text-[16.5px]">{item.title}</p>
                <p className="text-gray-400 text-[16.5px] leading-relaxed max-w-[220px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
