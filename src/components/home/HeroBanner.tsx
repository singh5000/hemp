"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Leaf, FlaskConical, Truck, Shield } from "lucide-react";

const STATS = [
  { value: "500+", label: "Products", icon: Leaf },
  { value: "100%", label: "Lab Tested", icon: FlaskConical },
  { value: "Free", label: "Shipping $75+", icon: Truck },
  { value: "Legal", label: "≤ 0.3% THC", icon: Shield },
];

export default function HeroBanner() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section className="relative min-h-[600px] lg:min-h-[680px] bg-[#0a0a0a] overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://hempandbarrel.com/wp-content/uploads/2024/04/Chris-Grow-for-Banner-e1712944504867.jpeg"
          alt="Hemp & Barrel Premium CBD"
          fill
          priority
          className="object-cover brightness-[0.35]"
          sizes="100vw"
        />
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/30" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-[#1A9248]/30 rounded-full"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `floatParticle ${6 + i * 2}s ease-in-out ${i * 0.8}s infinite alternate`,
            }} />
        ))}
      </div>

      {/* Green accent line top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1A9248] to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-4 h-full flex items-center min-h-[600px] lg:min-h-[680px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full py-16">

          {/* Left — Text */}
          <div className={`transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#1A9248]/15 border border-[#1A9248]/30 rounded-full px-4 py-2 mb-6">
              <Image src="/hemp-leaf.png" alt="" width={16} height={16} className="w-4 h-4" />
              <span className="text-[#1A9248] text-[11px] font-bold uppercase tracking-[0.25em]">Charlotte&apos;s #1 CBD Store</span>
            </div>

            {/* Heading */}
            <h1 className="text-white font-black leading-[1.05] mb-6" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
              Premium{" "}
              <span className="relative inline-block">
                <span className="text-[#1A9248]">Hemp & CBD</span>
                <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-[#1A9248]/30 rounded-full" />
              </span>
              <br />
              Products
            </h1>

            {/* Subtitle */}
            <p className="text-white/60 text-lg md:text-xl max-w-[480px] leading-relaxed mb-8">
              Lab-tested tinctures, gummies, flower, Delta 8, vapes & more.
              Serving Pineville, NC and shipping nationwide.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-4 flex-wrap mb-10">
              <AnimatedButton href="/shop" size="lg">Shop Products</AnimatedButton>
              <AnimatedButton href="/contact" variant="outline" size="md">Visit Store</AnimatedButton>
            </div>

            {/* Trust stats */}
            <div className="grid grid-cols-4 gap-3">
              {STATS.map((stat, i) => (
                <div key={stat.label}
                  className={`text-center transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${600 + i * 150}ms` }}>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-[#1A9248]" />
                  </div>
                  <p className="text-white font-bold text-sm">{stat.value}</p>
                  <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Featured product showcase */}
          <div className={`hidden lg:block transition-all duration-1000 delay-300 ${loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-[#1A9248]/10 rounded-full blur-[80px]" />

              {/* Product image */}
              <div className="relative w-[480px] h-[480px] mx-auto">
                <Image
                  src="https://hempandbarrel.com/wp-content/uploads/2022/05/Tinctures-product.png.webp"
                  alt="Hemp & Barrel CBD Tinctures"
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="480px"
                  priority
                />
              </div>

              {/* Floating badges around product */}
              <div className="absolute top-8 right-0 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 animate-[floatBadge_4s_ease-in-out_infinite]">
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Best Seller</p>
                <p className="text-white font-bold text-sm">CBD Tinctures</p>
              </div>

              <div className="absolute bottom-16 left-0 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 animate-[floatBadge_5s_ease-in-out_0.5s_infinite]">
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">From</p>
                <p className="text-[#1A9248] font-black text-xl">$24.99</p>
              </div>

              <div className="absolute top-1/2 -right-2 bg-[#1A9248] rounded-full px-3 py-1.5 animate-[floatBadge_3.5s_ease-in-out_1s_infinite]">
                <p className="text-white text-[10px] font-bold uppercase tracking-wider">Lab Tested ✓</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
          <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white"/>
        </svg>
      </div>

      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          100% { transform: translateY(-30px) scale(1.5); opacity: 0.1; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
