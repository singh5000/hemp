"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Leaf, FlaskConical, Shield, Droplets, Heart, Zap, Moon, Sparkles, Flame, Sun } from "lucide-react";

export interface EducationTab {
  tab_label: string;
  heading: string;
  image: string | false;
  body: string;
  highlight: string;
  button_text: string;
  button_link: string;
}

/* Design-only metadata per cannabinoid — icons, stat chips, and layout side.
   Not editorial content, so it stays here rather than as ACF fields; matched
   by tab label with a sensible fallback for any tab an editor adds later. */
const TAB_STYLE: Record<string, {
  tabIcon: typeof Sparkles;
  tag: string;
  stats: { value: string; label: string; icon: typeof FlaskConical }[];
  benefits: { icon: typeof Heart; text: string }[];
  imageLeft: boolean;
  bg: string;
  floatingIcons: typeof Sparkles[];
}> = {
  "THCA": {
    tabIcon: Sparkles, tag: "Learn About Hemp",
    stats: [
      { value: "High", label: "Potency", icon: FlaskConical },
      { value: "0.3%", label: "Max Δ9 THC", icon: Shield },
      { value: "3rd", label: "Party Tested", icon: Droplets },
    ],
    benefits: [
      { icon: Heart, text: "Stress & Anxiety Relief" },
      { icon: Moon, text: "Better Sleep Quality" },
      { icon: Zap, text: "Pain & Inflammation" },
    ],
    imageLeft: true, bg: "from-white to-[#f0faf3]", floatingIcons: [FlaskConical, Leaf, Droplets, Shield],
  },
  "Delta 8": {
    tabIcon: Zap, tag: "Cannabinoid Education",
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
    imageLeft: false, bg: "from-[#fafaf8] to-[#f5f0eb]", floatingIcons: [Leaf, Sparkles, Moon, Zap],
  },
  "Delta 9": {
    tabIcon: Flame, tag: "Federally Legal THC",
    stats: [
      { value: "0.3%", label: "Max by Weight", icon: Shield },
      { value: "True", label: "Euphoric High", icon: Sparkles },
      { value: "Lab", label: "Verified", icon: FlaskConical },
    ],
    benefits: [
      { icon: Heart, text: "Euphoric & Uplifting" },
      { icon: Zap, text: "Creativity & Focus" },
      { icon: Moon, text: "Deep Relaxation" },
    ],
    imageLeft: true, bg: "from-white to-[#f0faf3]", floatingIcons: [Flame, Leaf, Sparkles, Shield],
  },
  "CBD": {
    tabIcon: Leaf, tag: "Hemp Wellness Essential",
    stats: [
      { value: "0%", label: "Psychoactive", icon: Shield },
      { value: "100%", label: "Hemp Derived", icon: Leaf },
      { value: "3rd", label: "Party Tested", icon: FlaskConical },
    ],
    benefits: [
      { icon: Heart, text: "Calm & Balance" },
      { icon: Moon, text: "Restful Sleep" },
      { icon: Zap, text: "Everyday Relief" },
    ],
    imageLeft: false, bg: "from-[#fafaf8] to-[#f5f0eb]", floatingIcons: [Leaf, Droplets, Heart, Shield],
  },
  "Delta 10": {
    tabIcon: Sun, tag: "Sativa-Leaning Energy",
    stats: [
      { value: "Light", label: "Body Effect", icon: Sparkles },
      { value: "High", label: "Energy Lift", icon: Zap },
      { value: "COA", label: "Verified", icon: FlaskConical },
    ],
    benefits: [
      { icon: Zap, text: "Energizing Focus" },
      { icon: Heart, text: "Uplifted Mood" },
      { icon: Sparkles, text: "Light & Clear-Headed" },
    ],
    imageLeft: true, bg: "from-white to-[#f0faf3]", floatingIcons: [Sun, Sparkles, Zap, Leaf],
  },
};

const FALLBACK_STYLE = TAB_STYLE["CBD"];

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
      <p className="text-[16.5px] font-black text-[#1A9248]">{value}</p>
      <p className="text-[16.5px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

export default function Education101Client({ tabs }: { tabs: EducationTab[] }) {
  const [active, setActive] = useState(0);

  if (tabs.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-white to-[#f0faf3] relative overflow-hidden">
      {/* ── Tab bar ── */}
      <div className="max-w-[1320px] mx-auto px-4 pt-16 md:pt-20 relative">
        <div className="text-center mb-9">
          <span className="text-[12px] font-bold text-[#1A9248] uppercase tracking-[0.3em] block mb-2">Cannabinoid Education</span>
          <h2 className="text-[38px] md:text-4xl font-black text-[#3d2b1f]">Know Your Cannabinoids</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-2">
          {tabs.map((tab, idx) => {
            const TabIcon = (TAB_STYLE[tab.tab_label] ?? FALLBACK_STYLE).tabIcon;
            const isActive = active === idx;
            return (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-bold uppercase tracking-wide transition-all duration-300 border-2 ${
                  isActive
                    ? "bg-[#1A9248] border-[#1A9248] text-white shadow-lg shadow-[#1A9248]/25 scale-105"
                    : "bg-white border-gray-200 text-[#3d2b1f] hover:border-[#1A9248]/50 hover:text-[#1A9248]"
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#1A9248]"}`} />
                {tab.tab_label}
              </button>
            );
          })}
        </div>
      </div>

      {tabs.map((tab, idx) => {
        const style = TAB_STYLE[tab.tab_label] ?? FALLBACK_STYLE;
        return (
        <section key={idx}
          className={`${active === idx ? "block" : "hidden"} bg-gradient-to-br ${style.bg} py-12 md:py-16 relative overflow-hidden`}>

          {/* Floating icons around image */}
          {style.floatingIcons.map((Icon, i) => (
            <div key={i} className="absolute pointer-events-none"
              style={{
                top: `${15 + i * 20}%`,
                [style.imageLeft ? "left" : "right"]: `${8 + i * 8}%`,
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
                [style.imageLeft ? "right" : "left"]: `${4 + i * 6}%`,
                animation: `float ${7 + i * 2}s ease-in-out ${i}s infinite`,
              }}>
              <Image src="/hemp-leaf.png" alt="" width={28} height={28}
                className={`opacity-[0.07] ${i === 1 ? "scale-75" : ""}`} />
            </div>
          ))}

          {/* Decorative dotted circle */}
          <div className={`absolute ${style.imageLeft ? "-right-24 top-1/4" : "-left-24 top-1/3"} w-[350px] h-[350px] rounded-full border border-dashed border-[#1A9248]/10 pointer-events-none`} />

          <div className="max-w-[1320px] mx-auto px-4 relative">
            <div className={`flex flex-col ${style.imageLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-14 md:gap-20`}>

              {/* ── IMAGE ── */}
              <div className="w-full md:w-[42%] flex-shrink-0">
                <div className="relative group">
                  {/* Glow behind image */}
                  <div className="absolute inset-4 bg-[#1A9248]/10 rounded-3xl blur-2xl transition-all duration-700 group-hover:inset-2 group-hover:bg-[#1A9248]/15" />

                  {/* Main image container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-black/5">
                    <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                      {tab.image && (
                        <Image src={tab.image} alt={tab.heading} fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 42vw" />
                      )}

                      {/* Top-left badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                        <Image src="/hemp-leaf.png" alt="" width={14} height={14} className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold text-[#1A9248] uppercase tracking-wider">Hemp & Barrel</span>
                      </div>

                      {/* Bottom gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Stats at bottom of image */}
                      <div className="absolute bottom-0 inset-x-0 p-5">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                          <div className="grid grid-cols-3 divide-x divide-gray-100">
                            {style.stats.map((stat, i) => (
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
                    <span className="text-[12px] font-bold text-[#1A9248] uppercase tracking-[0.3em] block">{style.tag}</span>
                    <span className="w-12 h-0.5 bg-[#1A9248]/30 rounded-full block mt-1" />
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-[44px] md:text-[3.5rem] font-black text-[#3d2b1f] mb-7 leading-[1.05]">
                  {tab.heading}
                </h2>

                {/* Body */}
                <p className="text-[#5a4a3f] text-[16.5px] leading-[1.9] mb-5">{tab.body}</p>
                <div className="flex items-start gap-3 mb-8 bg-[#1A9248]/5 border-l-[3px] border-[#1A9248]/40 rounded-r-xl px-5 py-4">
                  <Leaf className="w-4 h-4 text-[#1A9248] mt-0.5 flex-shrink-0" />
                  <p className="text-[#3d2b1f] text-[16.5px] leading-[1.8] font-medium italic">{tab.highlight}</p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-3 mb-9">
                  {style.benefits.map((b) => (
                    <div key={b.text} className="group/b relative flex flex-col items-center text-center gap-2.5 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#1A9248]/20 hover:shadow-lg hover:shadow-[#1A9248]/5 transition-all duration-300">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1A9248]/10 to-[#1A9248]/5 group-hover/b:from-[#1A9248]/20 group-hover/b:to-[#1A9248]/10 flex items-center justify-center transition-colors duration-300">
                        <b.icon className="w-5 h-5 text-[#1A9248]" />
                      </div>
                      <span className="text-[13px] font-bold text-[#3d2b1f] uppercase tracking-wide leading-tight">{b.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <AnimatedButton href={tab.button_link} variant={idx === 0 ? "primary" : "dark"} size="lg">
                  {tab.button_text}
                </AnimatedButton>
              </div>
            </div>
          </div>
        </section>
        );
      })}

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
