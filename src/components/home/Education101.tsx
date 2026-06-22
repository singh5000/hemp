"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Leaf, FlaskConical, Shield, Droplets, Heart, Zap, Moon } from "lucide-react";

const sections = [
  {
    tag: "Learn About Hemp",
    heading: "What is CBD?",
    highlight: "CBD",
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
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/what-is-cbd.webp",
    imageLeft: true,
    bg: "bg-white",
  },
  {
    tag: "Cannabinoid Education",
    heading: "What is Delta 8?",
    highlight: "Delta 8",
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
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/delta-8-1.webp",
    imageLeft: false,
    bg: "bg-[#fafaf8]",
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
      <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#1A9248]/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#1A9248]" />
      </div>
      <p className="text-2xl font-black text-[#1A9248]">{value}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div key={i}
          className="absolute w-1.5 h-1.5 bg-[#1A9248]/20 rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `particle ${4 + i}s ease-in-out ${i * 0.5}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

export default function Education101() {
  return (
    <div>
      {sections.map((section, idx) => (
        <section key={section.heading} className={`${section.bg} py-20 md:py-28 relative overflow-hidden`}>
          <ParticleField />

          {/* Floating leaves */}
          {[0, 1, 2].map(i => (
            <div key={i} className="absolute pointer-events-none"
              style={{
                top: `${10 + i * 30}%`,
                [idx === 0 ? "right" : "left"]: `${3 + i * 4}%`,
                animation: `float ${6 + i * 2}s ease-in-out ${i}s infinite`,
              }}>
              <Image src="/hemp-leaf.png" alt="" width={30} height={30}
                className={`opacity-[0.08] ${i === 1 ? "scale-75" : ""}`} />
            </div>
          ))}

          {/* Decorative ring */}
          <div className={`absolute ${idx === 0 ? "-right-32 top-1/4" : "-left-32 top-1/3"} w-[400px] h-[400px] rounded-full border border-[#1A9248]/5 pointer-events-none`} />

          <div className="max-w-[1320px] mx-auto px-4 relative">
            <div className={`flex flex-col ${section.imageLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-16`}>

              {/* Image side */}
              <div className="w-full md:w-[45%] flex-shrink-0">
                <div className="relative group">
                  {/* Accent corner lines */}
                  <div className={`absolute -top-3 ${section.imageLeft ? "-left-3" : "-right-3"} w-16 h-16 border-t-2 ${section.imageLeft ? "border-l-2" : "border-r-2"} border-[#1A9248]/30 rounded-tl-xl transition-all duration-500 group-hover:w-20 group-hover:h-20 group-hover:border-[#1A9248]/60`} />
                  <div className={`absolute -bottom-3 ${section.imageLeft ? "-right-3" : "-left-3"} w-16 h-16 border-b-2 ${section.imageLeft ? "border-r-2" : "border-l-2"} border-[#1A9248]/30 rounded-br-xl transition-all duration-500 group-hover:w-20 group-hover:h-20 group-hover:border-[#1A9248]/60`} />

                  {/* Main image */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
                      <Image src={section.image} alt={section.heading} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 45vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2a1008]/40 via-transparent to-transparent" />
                    </div>

                    {/* Stats overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4">
                      <div className="grid grid-cols-3 gap-4">
                        {section.stats.map((stat, i) => (
                          <AnimatedStat key={stat.label} {...stat} delay={i * 200} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="w-full md:w-[55%]">
                {/* Tag */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-8 h-8 rounded-lg bg-[#1A9248]/10 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-[#1A9248]" />
                  </span>
                  <span className="text-[11px] font-bold text-[#1A9248] uppercase tracking-[0.25em]">{section.tag}</span>
                </div>

                {/* Heading */}
                <h2 className="text-4xl md:text-[3.2rem] font-black text-[#3d2b1f] mb-6 leading-[1.1]">
                  {section.heading.split(section.highlight).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="text-[#1A9248] relative">
                          {section.highlight}
                          <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#1A9248]/20 rounded-full" />
                        </span>
                      )}
                    </span>
                  ))}
                </h2>

                {/* Body */}
                <p className="text-[#5a4a3f] text-[16px] leading-[1.9] mb-4">{section.body}</p>
                <p className="text-[#5a4a3f] text-[15px] leading-[1.9] mb-8 italic border-l-3 border-[#1A9248]/30 pl-4">{section.body2}</p>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {section.benefits.map((b) => (
                    <div key={b.text} className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-[#1A9248]/5 border border-transparent hover:border-[#1A9248]/15 transition-all duration-300 group/ben">
                      <div className="w-10 h-10 rounded-full bg-[#1A9248]/10 group-hover/ben:bg-[#1A9248]/20 flex items-center justify-center transition-colors">
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
        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
          100% { transform: translateY(5px) scale(0.8); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
