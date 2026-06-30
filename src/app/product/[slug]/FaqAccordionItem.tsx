"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-[#fafaf8] transition-colors"
      >
        <span className="flex-1 font-bold text-[#2a1008] text-[17px]">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 pt-1 text-[15px] text-[#3d2b1f] leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}
