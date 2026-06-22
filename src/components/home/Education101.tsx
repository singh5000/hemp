"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Leaf, FlaskConical, Shield, Droplets, Heart, Zap, Moon, Sparkles } from "lucide-react";

const sections = [
  {
    tag: "Learn About Hemp",
    heading: "What is",
    headingHighlight: "CBD?",
    body: "Cannabidiol (CBD) is a naturally occurring compound found in the hemp plant. Unlike THC, CBD is non-psychoactive — it won't get you high. Millions use CBD daily for relaxation, stress relief, better sleep, and overall wellness.",
    body2: "Available in oils, edibles, vapes, and flower — all lab-tested and federally compliant at ≤ 0.3% THC.",
    stats: [
      { value: "99%", label: "Pure CBD", icon: FlaskConical },
      { value: "0.3%", label: "Max THC", icon: Shield },
      { value: "3rd", label: "Party Tested", icon: Droplets },
    ],
    benefits: [
      { icon: Heart, text: "Stress & Anxiety Relief" },
      { icon: Moon, text: "Better Sleep Quality" },
      { icon: Zap, text: "Pain & Inflammation" },
    ],
    buttonText: "Shop All CBD",
    buttonHref: "/shop",
    image: "https://images.pexels.com/photos/6955175/pexels-photo-6955175.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageLeft: true,
    bg: "from-white to-[#f0faf3]",
    floatingIcons: [FlaskConical, Leaf, Droplets, Shield],
  },
  {
    tag: "Cannabinoid Education",
    heading: "What is",
    headingHighlight: "Delta 8?",
    body: "Delta-8 THC is a minor cannabinoid derived from hemp that produces mild, clear-headed psychoactive effects — often described as a smoother, more relaxed experience than traditional THC.",
    body2: "Perfect for those seeking gentle euphoria without overwhelming intensity. All our Delta-8 products come with lab-verified COAs.",
    stats: [
      { value: "100%", label: "Hemp Derived", icon: Leaf },
      { value: "Mild", label: "Effects", icon: Shield },
      { value: "COA", label: "Verified", icon: FlaskConical },
    ],
    benefits: [
      { icon: Zap, text: "Relaxed & Clear-Headed" },
      { icon: Heart, text: "Mood Enhancement" },
      { icon: Moon, text: "Gentle Euphoria" },
    ],
    buttonText: "Shop Delta 8",
    buttonHref: "/product-tag/delta-8",
    image: "https://images.unsplash.com/photo-1498671546682-94a232c26d17?w=800&q=80",
    imageLeft: false,
    bg: "from-[#fafaf8] to-[#f5f0eb]",
    floatingIcons: [Leaf, Sparkles, Moon, Zap],
  },
];

function AnimatedStat({ value, label, icon: Icon, delay }: { value: string; label: string; icon: typeof FlaskConical; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${delay}ms` }}>
      <div className="w-11 h-11 mx-auto mb-2 rounded-full bg-[#1A9248]/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#1A9248]" />
      </div>
      <p className="text-xl font-black text-[#1A9248]">{value}</p>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

export default function Education101() {
  return (
    <div>
      {sections.map((section, idx) => (
        <section key={section.headingHighlight} className={`bg-gradient-to-br ${section.bg} py-16 md:py-20 relative overflow-hidden`}>

          {/* Floating icons around image */}
          {section.floatingIcons.map((Icon, i) => (
            <div key={i} className="absolute pointer-events-none"
              style={{
                top: `${15 + i * 20}%`,
                [idx === 0 ? "left" : "right"]: `${8 + i * 8}%`,
                animation: `iconFloat ${5 + i * 1.5}s ease-in-out ${i * 0.7}s infinite alternate`,
              }}>
              <div className="w-9 h-9 rounded-xl bg-[#1A9248]/8 backdrop-blur-sm flex items-center justify-center rotate-12">
                <Icon className="w-4 h-4 text-[#1A9248]/40" />
              </div>
            </div>
          ))}

          {/* Floating hemp leaves */}
          {[0, 1].map(i => (
            <div key={`leaf-${i}`} className="absolute pointer-events-none"
              style={{
                bottom: `${10 + i * 40}%`,
                [idx === 0 ? "right" : "left"]: `${4 + i * 6}%`,
                animation: `float ${7 + i * 2}s ease-in-out ${i}s infinite`,
              }}>
              <Image src="/hemp-leaf.png" alt="" width={28} height={28}
                className={`opacity-[0.07] ${i === 1 ? "scale-75" : ""}`} />
            </div>
          ))}

          {/* Decorative dotted circle */}
          <div className={`absolute ${idx === 0 ? "-right-24 top-1/4" : "-left-24 top-1/3"} w-[350px] h-[350px] rounded-full border border-dashed border-[#1A9248]/10 pointer-events-none`} />

          <div className="max-w-[1320px] mx-auto px-4 relative">
            <div className={`flex flex-col ${section.imageLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-14 md:gap-20`}>

              {/* ── IMAGE ── */}
              <div className="w-full md:w-[42%] flex-shrink-0">
                <div className="relative group">
                  {/* Glow behind image */}
                  <div className="absolute inset-4 bg-[#1A9248]/10 rounded-3xl blur-2xl transition-all duration-700 group-hover:inset-2 group-hover:bg-[#1A9248]/15" />

                  {/* Main image container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-black/5">
                    <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                      <Image src={section.image} alt={section.heading + " " + section.headingHighlight} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 42vw" />

                      {/* Top-left badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                        <Image src="/hemp-leaf.png" alt="" width={14} height={14} className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold text-[#1A9248] uppercase tracking-wider">Hemp & Barrel</span>
                      </div>

                      {/* Bottom gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Stats at bottom of image */}
                      <div className="absolute bottom-0 inset-x-0 p-5">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                          <div className="grid grid-cols-3 divide-x divide-gray-100">
                            {section.stats.map((stat, i) => (
                              <AnimatedStat key={stat.label} {...stat} delay={i * 200} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── CONTENT ── */}
              <div className="w-full md:w-[58%]">
                {/* Tag */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-9 h-9 rounded-xl bg-[#1A9248]/10 flex items-center justify-center">
                    <Leaf className="w-4.5 h-4.5 text-[#1A9248]" />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-[#1A9248] uppercase tracking-[0.3em] block">{section.tag}</span>
                    <span className="w-12 h-0.5 bg-[#1A9248]/30 rounded-full block mt-1" />
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-4xl md:text-[3.5rem] font-black text-[#3d2b1f] mb-7 leading-[1.05]">
                  {section.heading}{" "}
                  <span className="relative inline-block">
                    <span className="text-[#1A9248]">{section.headingHighlight}</span>
                    <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-[#1A9248]/15 rounded-full" />
                    <Sparkles className="absolute -top-3 -right-5 w-5 h-5 text-[#1A9248]/40 animate-pulse" />
                  </span>
                </h2>

                {/* Body */}
                <p className="text-[#5a4a3f] text-[16px] leading-[1.9] mb-5">{section.body}</p>
                <div className="flex items-start gap-3 mb-8 bg-[#1A9248]/5 border-l-[3px] border-[#1A9248]/40 rounded-r-xl px-5 py-4">
                  <Leaf className="w-4 h-4 text-[#1A9248] mt-0.5 flex-shrink-0" />
                  <p className="text-[#3d2b1f] text-[14px] leading-[1.8] font-medium italic">{section.body2}</p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-3 mb-9">
                  {section.benefits.map((b) => (
                    <div key={b.text} className="group/b relative flex flex-col items-center text-center gap-2.5 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#1A9248]/20 hover:shadow-lg hover:shadow-[#1A9248]/5 transition-all duration-300">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1A9248]/10 to-[#1A9248]/5 group-hover/b:from-[#1A9248]/20 group-hover/b:to-[#1A9248]/10 flex items-center justify-center transition-colors duration-300">
                        <b.icon className="w-5 h-5 text-[#1A9248]" />
                      </div>
                      <span className="text-[11px] font-bold text-[#3d2b1f] uppercase tracking-wide leading-tight">{b.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <AnimatedButton href={section.buttonHref} variant={idx === 0 ? "primary" : "dark"} size="lg">
                  {section.buttonText}
                </AnimatedButton>
              </div>
            </div>
          </div>
        </section>
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-3deg); }
        }
        @keyframes iconFloat {
          0% { transform: translateY(0) rotate(12deg) scale(1); opacity: 0.6; }
          50% { transform: translateY(-12px) rotate(-5deg) scale(1.1); opacity: 1; }
          100% { transform: translateY(5px) rotate(8deg) scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
