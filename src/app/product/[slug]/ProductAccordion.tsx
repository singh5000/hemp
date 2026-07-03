"use client";
import { useState } from "react";
import { FileText, List, Star, Shield, ChevronDown } from "lucide-react";

interface Props {
  description: string;
  attributes: Array<{ name: string; terms: Array<{ name: string }> }>;
  reviewCount: number;
  avgRating: string;
}

function AccordionItem({ title, icon: Icon, badge, defaultOpen, children }: {
  title: string;
  icon: typeof FileText;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-[#fafaf8] transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-[#1A9248]/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#1A9248]" />
        </div>
        <span className="flex-1 font-bold text-[#2a1008] text-[17px]">{title}</span>
        {badge && (
          <span className="text-[12px] font-bold text-[#1A9248] bg-[#1A9248]/10 px-2 py-0.5 rounded-full">{badge}</span>
        )}
        <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductAccordion({ description, attributes, reviewCount, avgRating }: Props) {
  const hasAttributes = attributes.some(a => a.terms.length > 0);

  return (
    <div className="space-y-3">
      {/* Description */}
      {description && (
        <AccordionItem title="Product Description" icon={FileText} defaultOpen>
          <div className="text-[#3d2b1f] text-[16px] leading-[1.85] space-y-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#2a1008] [&_h2]:mt-4 [&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:text-[#2a1008] [&_h3]:mt-3 [&_p]:leading-[1.85] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_a]:text-[#1A9248] [&_a]:underline [&_strong]:font-bold [&_strong]:text-[#2a1008]"
            dangerouslySetInnerHTML={{ __html: description }} />
        </AccordionItem>
      )}

      {/* Specifications / Attributes */}
      {hasAttributes && (
        <AccordionItem title="Specifications" icon={List}>
          <div className="divide-y divide-gray-50">
            {attributes.filter(a => a.terms.length > 0).map(attr => (
              <div key={attr.name} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                <span className="text-[14px] font-bold text-gray-400 uppercase tracking-wider w-28 flex-shrink-0 pt-0.5">{attr.name}</span>
                <div className="flex flex-wrap gap-1.5">
                  {attr.terms.map(t => (
                    <span key={t.name} className="bg-gray-50 text-[#3d2b1f] text-[14px] font-semibold px-3 py-1 rounded-full border border-gray-100">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Reviews summary */}
      <AccordionItem
        title="Customer Reviews"
        icon={Star}
        badge={reviewCount > 0 ? `${avgRating} ★ (${reviewCount})` : undefined}
      >
        {reviewCount > 0 ? (
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[16.5px] font-black text-[#2a1008]">{avgRating}</p>
              <div className="flex mt-1">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className={`w-4 h-4 ${i <= Math.round(parseFloat(avgRating)) ? "text-amber-400" : "text-gray-200"}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-[16.5px] text-gray-400 mt-1">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</p>
            </div>
            <p className="text-[16.5px] text-gray-500">Scroll down to read all customer reviews.</p>
          </div>
        ) : (
          <p className="text-[16.5px] text-gray-400">No reviews yet. Be the first to share your experience!</p>
        )}
      </AccordionItem>

      {/* Quality Guarantee */}
      <AccordionItem title="Quality & Compliance" icon={Shield}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Third-Party Lab Tested", desc: "Every batch is independently tested for purity, potency, and safety." },
            { title: "≤ 0.3% Delta-9 THC", desc: "All products are federally compliant under the 2018 Farm Bill." },
            { title: "COA Available", desc: "Certificate of Analysis available for every product on request." },
          ].map(item => (
            <div key={item.title} className="bg-[#1A9248]/5 rounded-xl p-4 border border-[#1A9248]/10">
              <p className="text-[16.5px] font-bold text-[#1A9248] uppercase tracking-wide mb-1">{item.title}</p>
              <p className="text-[16.5px] text-[#3d2b1f] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </AccordionItem>
    </div>
  );
}
