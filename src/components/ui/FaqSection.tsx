"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/category-faqs";

function Accordion({ faq, isOpen, onToggle }: { faq: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${
      isOpen ? "border-[#1A9248] shadow-md shadow-[#1A9248]/10" : "border-gray-200 hover:border-[#1A9248]/50"
    }`}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-5 py-4 text-left">
        <span className={`flex-1 font-bold text-[15px] ${isOpen ? "text-[#1A9248]" : "text-[#2a1008]"}`}>{faq.q}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#1A9248]" : "text-gray-300"}`} />
      </button>
      <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 text-[#3d2b1f] text-sm leading-[1.85] whitespace-pre-line">{faq.a}</div>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection({ title, faqs }: { title?: string; faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<number | null>(0);

  if (!faqs.length) return null;

  return (
    <div>
      {title && (
        <h3 className="text-[26px] font-bold text-[#2a1008] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#1A9248] rounded-full" />
          {title}
        </h3>
      )}
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <Accordion key={i} faq={faq} isOpen={openId === i} onToggle={() => setOpenId(openId === i ? null : i)} />
        ))}
      </div>
    </div>
  );
}
