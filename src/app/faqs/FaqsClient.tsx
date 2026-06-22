"use client";

import { useState } from "react";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "about-cbd", label: "About CBD" },
  { id: "using-cbd", label: "Using CBD" },
  { id: "orders", label: "Shipping & Returns" },
  { id: "in-store", label: "Visit Us" },
];

const FAQS = [
  // ── About CBD ──
  {
    id: "what-is-cbd",
    category: "about-cbd",
    q: "What is CBD?",
    a: "CBD (cannabidiol) is a naturally occurring compound found in the hemp plant (Cannabis Sativa). Unlike THC, CBD is non-psychoactive, meaning it will not produce a \"high.\" Many people use CBD to support relaxation, stress relief, sleep, and overall wellness.",
  },
  {
    id: "is-cbd-legal",
    category: "about-cbd",
    q: "Is CBD legal?",
    a: "Yes. Following the 2018 Farm Bill, hemp-derived CBD products containing less than 0.3% Delta-9 THC are federally legal in the United States. All of our products comply with federal law and are sourced from licensed hemp farms.",
  },
  {
    id: "will-cbd-get-me-high",
    category: "about-cbd",
    q: "Will CBD get me high?",
    a: "No. CBD is non-psychoactive and will not produce a high. Our hemp-derived products contain 0.3% THC or less, which is far below the threshold needed to cause any intoxicating effects.",
  },
  {
    id: "full-broad-isolate",
    category: "about-cbd",
    q: "What's the difference between Full Spectrum, Broad Spectrum, and CBD Isolate?",
    a: "Full Spectrum contains all cannabinoids, terpenes, and trace amounts of THC (≤0.3%), providing the \"entourage effect.\" Broad Spectrum has all cannabinoids and terpenes but zero THC. CBD Isolate is pure CBD — 99%+ pure with no other cannabinoids. Full Spectrum is generally considered the most effective due to the synergy between compounds.",
  },
  {
    id: "hemp-vs-marijuana",
    category: "about-cbd",
    q: "What's the difference between hemp and marijuana?",
    a: "Both come from Cannabis Sativa, but hemp is legally defined as cannabis with 0.3% THC or less. Marijuana refers to cannabis plants with higher THC content. All products at Hemp & Barrel are derived from compliant hemp plants and will not get you high.",
  },
  {
    id: "lab-tested",
    category: "about-cbd",
    q: "Are your products lab tested?",
    a: "Absolutely. Every product we carry is third-party lab tested for potency, purity, and safety. You can view Certificates of Analysis (COAs) on our Lab Reports page. We only stock brands that meet our strict quality standards.",
  },
  {
    id: "thc-content",
    category: "about-cbd",
    q: "Do your products contain THC?",
    a: "Our hemp-derived CBD products contain 0.3% Delta-9 THC or less as required by federal law. We also carry Delta-8 and other minor cannabinoid products which are clearly labeled. If you need zero-THC options, look for our Broad Spectrum or Isolate products.",
  },

  // ── Using CBD ──
  {
    id: "how-much-sublingual",
    category: "using-cbd",
    q: "How much CBD should I take sublingually?",
    a: "It varies by person. Most of our customers start with half a dropper and increase to a full dropper if needed. We recommend starting low and going slow — give your body 2–4 weeks to find your optimal dose before adjusting.",
  },
  {
    id: "how-long-to-work",
    category: "using-cbd",
    q: "How long does CBD take to work?",
    a: "It depends on the method. Sublingual tinctures: 15–45 minutes. Vaping/inhaling: 5–15 minutes. Edibles/gummies: 45–90 minutes. Topicals: 15–30 minutes locally. Results can also vary based on your body weight, metabolism, and the condition you're addressing.",
  },
  {
    id: "best-way-to-take",
    category: "using-cbd",
    q: "What's the best way to take CBD?",
    a: "It depends on your goals. For fast relief, vaping or sublingual tinctures work best. For long-lasting effects, edibles and gummies are ideal. For localized relief (muscle soreness, joint pain), topicals are excellent. Our knowledgeable staff can help you choose the right product for your needs — stop in or give us a call!",
  },
  {
    id: "cbd-for-pets",
    category: "using-cbd",
    q: "Can I give CBD to my pets?",
    a: "Yes! We carry a dedicated line of CBD products formulated specifically for pets. CBD may help pets with anxiety, joint discomfort, and general wellness. Always use pet-specific products and consult your veterinarian before starting a CBD regimen for your animal.",
  },
  {
    id: "will-fail-drug-test",
    category: "using-cbd",
    q: "Will CBD cause me to fail a drug test?",
    a: "Standard drug tests screen for THC metabolites, not CBD itself. While Full Spectrum products contain trace THC (≤0.3%), they could potentially trigger a positive result with heavy use. If you have upcoming drug testing, we recommend choosing Broad Spectrum or Isolate products, which contain zero THC.",
  },

  // ── Orders & Shipping ──
  {
    id: "ship-nationwide",
    category: "orders",
    q: "Do you ship nationwide?",
    a: "Yes! We ship hemp-derived CBD products to all 50 states. Orders are processed within 1–2 business days and typically arrive within 3–7 business days via USPS or UPS. Expedited shipping options are available at checkout.",
  },
  {
    id: "return-policy",
    category: "orders",
    q: "What is your return policy?",
    a: "We want you to be 100% satisfied with your purchase. If you're not happy with a product, please contact us within 30 days of purchase. Unopened products in original condition may be returned or exchanged. For quality issues, please reach out and we'll make it right.",
  },
  {
    id: "payment-methods",
    category: "orders",
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, Discover, American Express), cash (in-store), and other payment methods available at checkout. Our checkout is fully encrypted and secure.",
  },
  {
    id: "discounts",
    category: "orders",
    q: "Do you offer discounts or loyalty programs?",
    a: "Yes! Subscribe to our newsletter for exclusive deals and new product announcements. We also offer in-store promotions, seasonal sales, and bundle deals. Follow us on Instagram @HempAndBarrel to stay up to date on the latest offers.",
  },
  {
    id: "minimum-age",
    category: "orders",
    q: "Is there a minimum age to purchase?",
    a: "Yes. You must be 21 years of age or older to purchase CBD and hemp products from Hemp & Barrel, both online and in-store. Age verification is required at checkout and at our physical location.",
  },

  // ── Visit Us ──
  {
    id: "store-location",
    category: "in-store",
    q: "Where is Hemp & Barrel located?",
    a: "We are located at 800 N Polk Street, Pineville, NC 28134 — just south of Charlotte. We're easy to find with plenty of parking. Click \"Get Directions\" to open Google Maps.",
  },
  {
    id: "store-hours",
    category: "in-store",
    q: "What are your store hours?",
    a: "Monday – Saturday: 10:00 AM – 8:00 PM\nSunday: 12:00 PM – 4:00 PM\n\nHoliday hours may vary. Follow us on social media for any schedule updates.",
  },
  {
    id: "staff-help",
    category: "in-store",
    q: "Can your staff help me find the right product?",
    a: "Absolutely! Our knowledgeable team is trained in cannabinoid science and wellness. Whether you're new to CBD or an experienced user looking to try something new, we'll guide you to the right product for your needs, budget, and lifestyle. No pressure — just expert advice.",
  },
];

function FaqItem({ faq, isOpen, onToggle }: {
  faq: typeof FAQS[0];
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
          {faq.q}
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
          <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-line">
            {faq.a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqsClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filtered = activeCategory === "all"
    ? FAQS
    : FAQS.filter((f) => f.category === activeCategory);

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenItems(new Set(filtered.map((f) => f.id)));
  const collapseAll = () => setOpenItems(new Set());

  return (
    <>
      {/* Hero */}
      <section className="bg-[#2a1008] py-20 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#1A9248]/5 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#1A9248]/8 translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-[900px] mx-auto px-6 text-center relative">
          <p className="text-[#1A9248] text-xs font-bold uppercase tracking-[0.4em] mb-4">
            Got Questions?
          </p>
          <h1 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-wide mb-6">
            Frequently Asked<br />
            <span className="text-[#1A9248]">Questions</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
            Everything you need to know about CBD, our products, shipping, and visiting our store.
          </p>
          <AnimatedButton href="/contact" variant="outline" size="sm">
            Can&apos;t find your answer? Contact us
          </AnimatedButton>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-[#fafaf8]">
        <div className="max-w-[860px] mx-auto px-6">

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
                    {FAQS.filter((f) => f.category === cat.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Expand/Collapse controls */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
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
          <div className="space-y-3">
            {filtered.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openItems.has(faq.id)}
                onToggle={() => toggle(faq.id)}
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
              <h3 className="text-white text-xl font-bold mb-2">Still Have Questions?</h3>
              <p className="text-white/55 text-sm mb-6 leading-relaxed">
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
              <h3 className="text-[#3d2b1f] text-xl font-bold mb-2">Visit Our Store</h3>
              <p className="text-[#3d2b1f]/60 text-sm mb-1 leading-relaxed">
                800 N Polk Street, Pineville, NC 28134
              </p>
              <p className="text-[#3d2b1f]/60 text-xs mb-6">
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
