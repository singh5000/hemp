"use client";

import { useState } from "react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import PageBanner from "@/components/layout/PageBanner";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "about-cbd", label: "About CBD" },
  { id: "using-cbd", label: "Using CBD" },
  { id: "orders", label: "Shipping & Returns" },
  { id: "in-store", label: "Visit Us" },
];

export interface Faq {
  category: string;
  question: string;
  answer: string;
}

function heroTitle(heading: string) {
  const parts = heading.split(/\*(.+?)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <span key={i} className="text-[#1A9248]">{part}</span> : part
  );
}

function FaqItem({ faq, isOpen, onToggle }: {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${
      isOpen ? "border-[#1A9248] shadow-md shadow-[#1A9248]/10" : "border-gray-200 hover:border-[#1A9248]/50"
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
      >
        <span className={`font-bold text-xl leading-snug transition-colors ${
          isOpen ? "text-[#1A9248]" : "text-[#3d2b1f] group-hover:text-[#1A9248]"
        }`}>
          {faq.question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-[#1A9248] rotate-45" : "bg-gray-100 group-hover:bg-[#1A9248]/10"
        }`}>
          <svg className={`w-4 h-4 transition-colors ${isOpen ? "text-white" : "text-[#3d2b1f]"}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-5">
          <div className="w-10 h-0.5 bg-[#1A9248] mb-4 rounded-full" />
          <p className="text-gray-600 leading-relaxed text-[16.5px] whitespace-pre-line">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqsClient({ eyebrow, heading, description, faqs }: {
  eyebrow: string;
  heading: string;
  description: string;
  faqs: Faq[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const filtered = activeCategory === "all"
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  const toggle = (i: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const expandAll = () => setOpenItems(new Set(filtered.map((_, i) => i)));
  const collapseAll = () => setOpenItems(new Set());

  return (
    <>
      {/* Hero */}
      <PageBanner
        align="center"
        eyebrow={eyebrow}
        title={heroTitle(heading)}
        description={description}
        cta={
          <AnimatedButton href="/contact" variant="outline" size="sm">
            Can&apos;t find your answer? Contact us
          </AnimatedButton>
        }
      />

      {/* FAQ Content */}
      <section className="py-16 bg-[#fafaf8]">
        <div className="max-w-[1120px] mx-auto px-6">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenItems(new Set()); }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-[#1A9248] text-white shadow-md shadow-[#1A9248]/30"
                    : "bg-white text-[#3d2b1f] border border-gray-200 hover:border-[#1A9248] hover:text-[#1A9248]"
                }`}
              >
                {cat.label}
                {cat.id !== "all" && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeCategory === cat.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {faqs.filter((f) => f.category === cat.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Expand/Collapse controls */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[16.5px] text-gray-500">
              Showing <span className="font-semibold text-[#3d2b1f]">{filtered.length}</span> question{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-3">
              <button onClick={expandAll} className="text-xs text-[#1A9248] font-semibold hover:underline">
                Expand all
              </button>
              <span className="text-gray-300">|</span>
              <button onClick={collapseAll} className="text-xs text-gray-400 font-semibold hover:underline">
                Collapse all
              </button>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-5 items-start">
            {filtered.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                isOpen={openItems.has(i)}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">

            {/* Contact card */}
            <div className="bg-[#2a1008] rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-[#1A9248]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#1A9248]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white text-[28px] font-bold mb-2">Still Have Questions?</h3>
              <p className="text-white/55 text-[16.5px] mb-6 leading-relaxed">
                Our CBD experts are here to help. Reach out and we'll get back to you quickly.
              </p>
              <AnimatedButton href="/contact" size="sm">Contact Us</AnimatedButton>
            </div>

            {/* Visit store card */}
            <div className="bg-[#f5f0eb] rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-[#3d2b1f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#3d2b1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-[#3d2b1f] text-[28px] font-bold mb-2">Visit Our Store</h3>
              <p className="text-[#3d2b1f]/60 text-[16.5px] mb-1 leading-relaxed">
                800 N Polk Street, Pineville, NC 28134
              </p>
              <p className="text-[#3d2b1f]/60 text-[16.5px] mb-6">
                Mon–Sat: 10AM–8PM &nbsp;|&nbsp; Sun: 12PM–4PM
              </p>
              <AnimatedButton href="https://goo.gl/maps/ZGKaUsQ9k6sGLywh7" variant="dark" size="sm" external>
                Get Directions
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
