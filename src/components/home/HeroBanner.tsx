"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FlaskConical, Leaf, Truck, Shield } from "lucide-react";

type Product = { name: string; src: string };

const fallbackProducts: Product[] = [
  { name: "CBD Tinctures", src: "/sli.png" },
  { name: "Hemp Topicals", src: "/top-right.png" },
  { name: "Hemp Flower", src: "/lb1.png" },
  { name: "CBD Pouches", src: "/rt-lower.png" },
];

const WC_BASE = process.env.NEXT_PUBLIC_WC_URL || "https://hempandbarrel.com/wp-json/wc/store/v1";

function decodeHTML(s: string) {
  if (typeof document === "undefined") return s;
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HeroBanner() {
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [slots, setSlots] = useState([0, 1, 2, 3]);
  const [transition, setTransition] = useState<{ slot: number; from: number } | null>(null);
  const nextImg = useRef(4);
  const turn = useRef(0);

  useEffect(() => { requestAnimationFrame(() => setLoaded(true)); }, []);

  useEffect(() => {
    async function fetchAll() {
      try {
        const all: Product[] = [];
        const seen = new Set<string>();
        for (let page = 1; page <= 5; page++) {
          const res = await fetch(`${WC_BASE}/products?per_page=100&stock_status=instock&page=${page}`);
          if (!res.ok) break;
          const data = await res.json();
          if (!data.length) break;
          for (const p of data) {
            const src = p.images?.[0]?.src;
            if (src && p.is_in_stock && !seen.has(src)) {
              seen.add(src);
              all.push({ name: decodeHTML(p.name), src });
            }
          }
          if (data.length < 100) break;
        }
        if (all.length > 4) setProducts(shuffle(all));
      } catch { /* keep fallback */ }
    }
    fetchAll();
  }, []);

  const total = products.length;

  useEffect(() => {
    const interval = setInterval(() => {
      const s = turn.current % 4;
      turn.current++;
      const ni = nextImg.current % total;
      nextImg.current++;
      setSlots(prev => {
        setTransition({ slot: s, from: prev[s] });
        const next = [...prev];
        next[s] = ni;
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [total]);

  useEffect(() => {
    if (!transition) return;
    const t = setTimeout(() => setTransition(null), 1600);
    return () => clearTimeout(t);
  }, [transition]);

  return (
    <section className="relative overflow-hidden min-h-screen -mt-[72px]">

      <Image
        src="/hero-leaf.jpg"
        alt="Hemp & Barrel"
        fill
        priority
        className={`object-cover ${loaded ? "animate-[heroBgDrift_25s_ease-in-out_infinite]" : "scale-110"}`}
        sizes="100vw"
        quality={85}
      />

      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.2) 100%)" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-[1320px] mx-auto pl-4 pr-0 w-full py-32">
          <div className="flex items-center gap-11">

            <div className="flex-1 min-w-0 max-w-[600px]">

              <div className={`flex items-center gap-2.5 mb-8 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                <span className="w-10 h-[2px] bg-[#1A9248]" />
                <span className="text-[#1A9248] text-[11px] font-bold uppercase tracking-[0.3em]">Charlotte&apos;s #1 CBD Store</span>
              </div>

              <h1 className={`text-white font-black leading-[0.95] mb-6 transition-all duration-700 delay-150 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ fontSize: "clamp(3.2rem, 6vw, 5rem)" }}>
                Premium{" "}
                <span className="relative inline-block">
                  <span className="text-[#1A9248]">Hemp &amp; CBD</span>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[#1A9248]/40 rounded-full" />
                </span>{" "}
                Products
              </h1>

              <p className={`text-white/65 text-xl leading-relaxed mb-10 transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                Lab-tested tinctures, gummies, flower, Delta 8, vapes &amp; more — sourced from Carolina farms. Trusted locally, shipped nationwide.
              </p>

              <div className={`flex items-center gap-5 mb-14 transition-all duration-700 delay-[450ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                <Link href="/shop"
                  className="group inline-flex items-center gap-3 bg-[#1A9248] text-white font-bold pl-8 pr-2 py-2.5 rounded-full text-sm uppercase tracking-wider overflow-hidden relative transition-all duration-500 hover:shadow-[0_0_35px_rgba(26,146,72,0.4)]">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#1A9248] via-[#22b558] to-[#1A9248] bg-[length:200%_100%] group-hover:animate-[shimmer_1.5s_ease-in-out] rounded-full" />
                  <span className="relative z-10">Shop Now</span>
                  <span className="relative z-10 w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all duration-300 group-hover:rotate-[-30deg] group-hover:scale-110">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link href="/about-us" className="text-white/70 hover:text-white font-semibold text-sm transition-colors flex items-center gap-1.5 group">
                  Our Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className={`flex items-center gap-6 flex-wrap transition-all duration-700 delay-[600ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {[
                  { icon: FlaskConical, text: "Lab Tested" },
                  { icon: Leaf, text: "Farm to Shelf" },
                  { icon: Truck, text: "Free Ship $75+" },
                  { icon: Shield, text: "≤ 0.3% THC" },
                ].map((item, i) => (
                  <div key={item.text} className="flex items-center gap-2"
                    style={{ transitionDelay: `${700 + i * 100}ms` }}>
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                      <item.icon className="w-3.5 h-3.5 text-[#1A9248]" />
                    </div>
                    <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - 2×2 product showcase */}
            <div className={`hidden lg:flex flex-1 justify-end transition-all duration-[1.2s] delay-300 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
              <div className="grid grid-cols-2 gap-2 w-full max-w-[620px] aspect-square">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const imgIdx = slots[slotIdx] % total;
                  const img = products[imgIdx];
                  const isChanging = transition?.slot === slotIdx;
                  const prevImg = isChanging ? products[transition.from % total] : null;
                  return (
                    <div key={slotIdx} className="relative overflow-hidden rounded-xl bg-white">
                      {isChanging && prevImg && (
                        <div key={`p-${transition.from}`} className="absolute inset-0 z-10 animate-[fadeOut_1.5s_ease-in-out_forwards]">
                          <Image src={prevImg.src} alt={prevImg.name} fill className="object-cover" sizes="310px" />
                          <div className="absolute bottom-0 left-0 right-0 bg-[#1A9248] px-4 py-2.5">
                            <span className="text-white text-sm font-bold tracking-wide">{prevImg.name}</span>
                          </div>
                        </div>
                      )}
                      <div key={`a-${imgIdx}`} className={`absolute inset-0 ${isChanging ? "animate-[fadeSlideIn_1.5s_ease-in-out]" : ""}`}>
                        <Image src={img.src} alt={img.name} fill className="object-cover" sizes="310px" />
                        <div className="absolute bottom-0 left-0 right-0 bg-[#1A9248] px-4 py-2.5">
                          <span className="text-white text-sm font-bold tracking-wide">{img.name}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
