"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";

export interface SlideData {
  id:         number;
  tag:        string;
  heading:    string;
  sub:        string;
  cta:        string;
  href:       string;
  bg:         string;
  productImg: string | null;
}

const BADGES = [
  { label: "Lab Tested",    icon: "⚗️" },
  { label: "Farm to Shelf", icon: "🌿" },
  { label: "Fast Shipping", icon: "🚚" },
  { label: "≤ 0.3% THC",   icon: "✅" },
];

export default function HeroSliderClient({ slides }: { slides: SlideData[] }) {
  const [cur,    setCur]    = useState(0);
  const [busy,   setBusy]   = useState(false);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((i: number) => {
    if (busy) return;
    setBusy(true);
    setCur((i + slides.length) % slides.length);
    setTimeout(() => setBusy(false), 650);
  }, [busy, slides.length]);

  const goNext = useCallback(() => go(cur + 1), [cur, go]);
  const goPrev = useCallback(() => go(cur - 1), [cur, go]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(goNext, 6000);
    return () => clearInterval(t);
  }, [goNext, paused]);

  const slide = slides[cur];

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ height: "clamp(520px, 72vh, 760px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const d = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(d) > 50) d > 0 ? goNext() : goPrev();
        touchX.current = null;
      }}
    >
      {/* ── Background images ── */}
      {slides.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === cur ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <Image src={s.bg} alt={s.heading.replace("\n", " ")} fill priority={i === 0}
            className="object-cover object-center brightness-125 saturate-110" sizes="100vw" />
          {/* Minimal gradient — only darkens left edge for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      ))}

      {/* ── Content ── */}
      <div className="relative z-20 h-full">
        <div className="max-w-[1320px] mx-auto px-4 md:px-16 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_650px] xl:grid-cols-[1fr_780px] gap-6 xl:gap-10 items-center w-full">

            {/* Left — text */}
            <div className={`transition-all duration-500 ${busy ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"}`}>

              {/* Tag badge */}
              <div className="inline-flex items-center gap-2.5 bg-black/30 backdrop-blur-md border border-white/20 rounded-full pl-3 pr-5 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#1A9248] animate-pulse flex-shrink-0" />
                <span className="text-white text-[11px] font-bold uppercase tracking-[0.3em]">{slide.tag}</span>
              </div>

              {/* Heading — only first slide gets h1 for SEO */}
              {cur === 0 ? (
                <h1 className="text-white font-black leading-[0.88] mb-5 tracking-tight whitespace-pre-line"
                  style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)" }}>
                  {slide.heading}
                </h1>
              ) : (
                <p className="text-white font-black leading-[0.88] mb-5 tracking-tight whitespace-pre-line"
                  style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)" }}
                  aria-hidden="true">
                  {slide.heading}
                </p>
              )}

              {/* Sub */}
              <p className="text-white text-base md:text-[17px] max-w-[440px] leading-relaxed mb-9 font-medium"
                style={{ textShadow: "0 1px 10px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.5)" }}>
                {slide.sub}
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-5 flex-wrap">
                <AnimatedButton href={slide.href} size="lg">
                  {slide.cta}
                </AnimatedButton>
                <Link href="/shop"
                  className="text-white hover:text-white/80 text-sm font-bold transition-colors underline underline-offset-4 decoration-white/40"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                  View all products
                </Link>
              </div>

              {/* Trust strip */}
              <div className="flex items-center gap-5 mt-10 pt-8 border-t border-white/20 flex-nowrap">
                {BADGES.map((b, i) => (
                  <div key={b.label} className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm">{b.icon}</span>
                    <span className="text-white text-xs font-bold tracking-wide whitespace-nowrap" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>{b.label}</span>
                    {i < BADGES.length - 1 && <span className="text-white/20 ml-3">|</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product image */}
            <div className={`hidden lg:flex justify-center items-center transition-all duration-600 ${busy ? "opacity-0 translate-x-10 scale-90" : "opacity-100 translate-x-0 scale-100"}`}>
              {slide.productImg ? (
                <div className="relative w-[650px] h-[650px] xl:w-[780px] xl:h-[780px] flex-shrink-0">
                  {/* Subtle ambient glow */}
                  <div className="absolute inset-8 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                  <Image
                    src={slide.productImg}
                    alt={slide.heading.replace("\n", " ")}
                    fill
                    className="object-contain brightness-125 saturate-110"
                    style={{ filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.15))" }}
                    sizes="680px"
                  />
                </div>
              ) : (
                /* Decorative rings when no product image */
                <div className="relative w-[320px] h-[320px] flex items-center justify-center opacity-40">
                  {[320, 240, 160].map((size, i) => (
                    <div key={size} className="absolute rounded-full border border-[#1A9248]/40 flex items-center justify-center"
                      style={{ width: size, height: size, borderWidth: i === 2 ? 2 : 1 }}>
                      {i === 2 && (
                        <svg className="w-12 h-12 text-[#1A9248]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide counter (top-right) ── */}
      <div className="absolute top-6 right-8 md:right-16 z-30 hidden md:flex items-center gap-3">
        <span className="text-white font-bold text-2xl tabular-nums">{String(cur + 1).padStart(2, "0")}</span>
        <span className="w-10 h-px bg-white/25" />
        <span className="text-white/35 text-sm tabular-nums">{String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* ── Navigation arrows ── */}
      {(["prev", "next"] as const).map(dir => (
        <button key={dir} onClick={dir === "prev" ? goPrev : goNext} aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
          className={`absolute top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/25 hover:bg-[#1A9248] backdrop-blur-sm border border-white/20 hover:border-[#1A9248] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#1A9248]/30 ${dir === "prev" ? "left-4 md:left-8" : "right-4 md:right-8"}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={dir === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>
      ))}


      {/* ── Progress bar ── */}
      {!paused && (
        <div key={cur} className="absolute bottom-0 left-0 z-30 h-[3px] bg-gradient-to-r from-[#1A9248] to-[#2bc465]"
          style={{ animation: "hb-slide-progress 6s linear forwards", width: "100%", transformOrigin: "left" }} />
      )}

      <style>{`
        @keyframes hb-slide-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
