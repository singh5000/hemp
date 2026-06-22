"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Category = "All" | "Gummies" | "Hempettes" | "CBD Flower" | "THCa Flower";
type StrainType = "Indica" | "Sativa" | "Hybrid" | null;

interface LabReport {
  name:     string;
  category: Exclude<Category, "All">;
  type?:    StrainType;
  thca?:    number;
  terp?:    number;
  url:      string;
  batch?:   string;
}

const REPORTS: LabReport[] = [
  /* ── Gummies ── */
  { name: "Gummy 30mg (230277)", category: "Gummies", url: "https://hempandbarrel.com/wp-content/uploads/2024/02/230277-GUM-30-1530-CoA.pdf", batch: "230277" },
  { name: "Gummy 750mg (91533)",  category: "Gummies", url: "https://hempandbarrel.com/wp-content/uploads/2024/02/91533-GUM-IM-0750-60-CoA.pdf",  batch: "91533"  },

  /* ── Hempettes ── */
  { name: "Hempettes Original",  category: "Hempettes", url: "https://hempandbarrel.com/wp-content/uploads/2024/02/BBL_5369_Hempettes-Original.pdf", batch: "BBL_5369" },
  { name: "Hempettes Menthol",   category: "Hempettes", url: "https://hempandbarrel.com/wp-content/uploads/2024/02/BBL_5370_Hempettes-Menthol.pdf",  batch: "BBL_5370" },
  { name: "Hempettes Pineapple", category: "Hempettes", url: "https://hempandbarrel.com/wp-content/uploads/2024/02/BBL_5371_Hempettes-Pineapple.pdf",batch: "BBL_5371" },
  { name: "Hempettes Sweet",     category: "Hempettes", url: "https://hempandbarrel.com/wp-content/uploads/2024/02/BBL_5368_Hempettes-Sweet.pdf",     batch: "BBL_5368" },

  /* ── CBD Flower ── */
  { name: "Godfather OG (CBD)", category: "CBD Flower", type: "Hybrid", url: "https://hempandbarrel.com/wp-content/uploads/2026/03/GodfatherOGCBDCoa-scaled.jpg" },

  /* ── THCa Flower ── */
  { name: "Stardawg Guava",      category: "THCa Flower", type: "Hybrid",  thca: 27.809, terp: 2.113, url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Stardawg_Guava_-_THCa_27.809___Terpenes_2.113_1__25863.jpg"  },
  { name: "Super Boof",          category: "THCa Flower", type: "Hybrid",  terp: 1.62,               url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Super_Boof_Terp_1.62__17115.jpg" },
  { name: "Super Sonic",         category: "THCa Flower", type: "Sativa",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Super_Sonic.pdf" },
  { name: "Trainwreck",          category: "THCa Flower", type: "Sativa",  thca: 29.544,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Trainwreck_COA_29.544_3.25.26__51486.jpg" },
  { name: "Vampire Slayer",      category: "THCa Flower", type: "Indica",  thca: 35.492, terp: 2.045, url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Vampire_Slayer_-_THCa_35.492_-_Terpenes_2.045_-_Indica__02539.jpg" },
  { name: "Bananaconda",         category: "THCa Flower", type: "Hybrid",  thca: 25.902, terp: 0.894, url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Bananaconda_-_THCa_25.902___Terpenes_0.894__46347.jpg" },
  { name: "Black Ice",           category: "THCa Flower", type: "Indica",  thca: 37.035, terp: 1.470, url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Black_Ice_Living_Soil_-_THCa_37.035_-_Terpenes_1.470_-_Indica_1__37420.jpg" },
  { name: "Black Velvet",        category: "THCa Flower", type: "Hybrid",  thca: 27.656,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Black_Velvet_COA_27.656_2.11.26_1__64473.jpg" },
  { name: "Blue Dream",          category: "THCa Flower", type: "Sativa",  thca: 31.700, terp: 1.850, url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Blue_Dream_Living_Soil_-_THCa_31.700___Terpenes_1.850_-_Sativa_Potency__53850.jpg" },
  { name: "Blueberry Sugar",     category: "THCa Flower", type: "Hybrid",  thca: 35.412,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Blueberry_Sugar_COA_35.412_6.4.26__37552.jpg" },
  { name: "Blueberry Space Cake",category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/BlueberrySpaceCake-scaled.jpg" },
  { name: "Benny Blanco",        category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/BennyBlancoCOA-scaled.jpg" },
  { name: "Candyland",           category: "THCa Flower", type: "Sativa",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/CandylandCOA-scaled.jpg" },
  { name: "Carolina Kush",       category: "THCa Flower", type: "Indica",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/2603NBL0509.1389-Hemp-Barrel-Carolina-Kush.pdf" },
  { name: "Chimera",             category: "THCa Flower", type: "Hybrid",  thca: 28.693,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Chimera_COA_28.693_2.11.26_1__64971.jpg" },
  { name: "Dante's Inferno",     category: "THCa Flower", type: "Hybrid",  thca: 26.817,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Dantes_Inferno_COA_26.817_8.11.26_1__25711.jpg" },
  { name: "Durban Poison",       category: "THCa Flower", type: "Sativa",  thca: 27.717,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Durban_Poison_COA_27.717_11.11.26__68458.jpg" },
  { name: "Frozen Lemon",        category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/CandylandCOA-scaled.jpg" },
  { name: "Garlic Budder",       category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/GarlicBudderCOA.pdf" },
  { name: "Gelato 42",           category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Gelato42COA.jpg" },
  { name: "Godfather OG (THCa)", category: "THCa Flower", type: "Indica",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/GodfatherOGCOA-scaled.jpg" },
  { name: "Granddaddy Purple",   category: "THCa Flower", type: "Indica",  thca: 26.375,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Granddaddy_Purple_COA_26.375_8.4.26__91338.jpg" },
  { name: "Grape Gelato",        category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/GrapeGelatoCOA.jpg" },
  { name: "Grape Jolly Rancher", category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/GrapeJollyRancherCOA-scaled.jpg" },
  { name: "Green Crack",         category: "THCa Flower", type: "Sativa",  thca: 29.861,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Green_Crack_COA_29.861_2.11.26_1__30916.jpg" },
  { name: "Halle Berry",         category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Halle_Berry.pdf" },
  { name: "Jack Herer",          category: "THCa Flower", type: "Sativa",  thca: 29.448,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Jack_Herer_COA_29.448_5.21.26__78666.jpg" },
  { name: "Jungle Cake",         category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/JungleCakeCOA.jpg" },
  { name: "Laser Fuel",          category: "THCa Flower", type: "Sativa",  thca: 30.141,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Laser_Fuel_COA_30.141_1.28.26__24562.jpg" },
  { name: "Lava Cake",           category: "THCa Flower", type: "Indica",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Indoor_-_THCa_Lava_Cake_Living_Soil_Potency_2__44830.jpg" },
  { name: "Lemon Cherry Gelato", category: "THCa Flower", type: "Hybrid",  thca: 35.969,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Lemon_Cherry_Gelato_COA_35.969_2.11.26_1__88332.jpg" },
  { name: "Lemon Drop",          category: "THCa Flower", type: "Sativa",  thca: 26.94,               url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Lemon_Drop_COA_26.94_4.1.26_1__71244.jpg" },
  { name: "Mac 1",               category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Mac_1_COA.pdf" },
  { name: "Neon Slushi",         category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/NeonSlushiCOA.jpg" },
  { name: "OG Kush",             category: "THCa Flower", type: "Hybrid",  thca: 28.909,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/OG_Kush_COA_28.909_11.11.26__79956.jpg" },
  { name: "Orange Creamsicle",   category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/OrangeCreamsicleCOA-scaled.jpg" },
  { name: "Papaya",              category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/PapayaCOA-scaled.jpg" },
  { name: "Pineapple Express",   category: "THCa Flower", type: "Sativa",  thca: 28.052,              url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Pineapple_Express_COA_28.052_3.13.26__16512.jpg" },
  { name: "RS-11",               category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/RS_11_COA.pdf" },
  { name: "Sex Panther",         category: "THCa Flower", type: "Hybrid",  thca: 29.875, terp: 1.820, url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Sex_Panther_Hydro_-_THCa_29.875-_Terpenes_1.820_2_1__65458.jpg" },
  { name: "Sour Diesel",         category: "THCa Flower", type: "Sativa",  thca: 25.69,               url: "https://hempandbarrel.com/wp-content/uploads/2026/03/Sour_Diesel_COA_25.69_4.1.26__88148.jpg" },
  { name: "Sour Joker",          category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/SourJokerCOA-scaled.jpg" },
  { name: "Sweet Tea",           category: "THCa Flower", type: "Hybrid",                             url: "https://hempandbarrel.com/wp-content/uploads/2026/03/SweetTeaCOA.jpg" },
];

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

const isPDF = (url: string) => url.endsWith(".pdf");

function ShieldIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
    </svg>
  );
}

export default function LabReportsClient() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return REPORTS.filter((r) => {
      const catMatch = activeCategory === "All" || r.category === activeCategory;
      const searchMatch = !q || r.name.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const counts: Record<Category, number> = useMemo(() => ({
    "All":          REPORTS.length,
    "Gummies":      REPORTS.filter(r => r.category === "Gummies").length,
    "Hempettes":    REPORTS.filter(r => r.category === "Hempettes").length,
    "CBD Flower":   REPORTS.filter(r => r.category === "CBD Flower").length,
    "THCa Flower":  REPORTS.filter(r => r.category === "THCa Flower").length,
  }), []);

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
        <p className="text-gray-400 text-sm mb-6">
          Showing <span className="font-bold text-[#3d2b1f]">{filtered.length}</span> certificates
        </p>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-2xl text-gray-300 font-bold">No results found</p>
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
                  <h3 className="text-white font-bold text-base leading-snug flex-1">{report.name}</h3>
                  {isPDF(report.url) ? (
                    <span className="flex-shrink-0 bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">PDF</span>
                  ) : (
                    <span className="flex-shrink-0 bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">IMG</span>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${CAT_STYLE[report.category]}`}>
                      {report.category}
                    </span>
                    {report.type && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${TYPE_STYLE[report.type]}`}>
                        {report.type}
                      </span>
                    )}
                  </div>

                  {/* THCa + Terpenes stats */}
                  {(report.thca || report.terp) && (
                    <div className="flex gap-3 mb-4">
                      {report.thca && (
                        <div className="flex-1 bg-[#f5f0eb] rounded-xl px-3 py-2.5 text-center">
                          <p className="text-[#1A9248] text-lg font-bold leading-none">{report.thca.toFixed(1)}%</p>
                          <p className="text-[#3d2b1f]/50 text-[10px] uppercase tracking-wider mt-1 font-semibold">THCa</p>
                        </div>
                      )}
                      {report.terp && (
                        <div className="flex-1 bg-[#f5f0eb] rounded-xl px-3 py-2.5 text-center">
                          <p className="text-[#3d2b1f] text-lg font-bold leading-none">{report.terp.toFixed(2)}%</p>
                          <p className="text-[#3d2b1f]/50 text-[10px] uppercase tracking-wider mt-1 font-semibold">Terpenes</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Batch */}
                  {report.batch && (
                    <p className="text-gray-400 text-[11px] mb-4 font-mono">Batch: {report.batch}</p>
                  )}

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link
                      href={report.url}
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
                <p className="font-bold text-[#2a1008] text-sm">{item.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed max-w-[220px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
