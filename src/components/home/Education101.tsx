"use client";
import Image from "next/image";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Leaf, FlaskConical, Shield, Droplets } from "lucide-react";

const sections = [
  {
    tag: "Learn About Hemp",
    heading: "What is CBD?",
    body: [
      "Cannabidiol (CBD) is a naturally occurring compound found in the hemp plant (Cannabis sativa). Unlike THC, CBD is non-psychoactive, meaning it does not produce a high. Many people use CBD to support relaxation, stress relief, sleep, and overall wellness.",
      "CBD and other hemp-derived cannabinoids are now widely available in a variety of forms, including CBD oils, CBD edibles, CBD vape products, and smokable hemp flower. At Hemp & Barrel, we provide lab-tested CBD and hemp products designed for quality, safety, and everyday wellness.",
      "As a trusted CBD and hemp store, Hemp & Barrel offers premium cannabinoid products for customers looking for reliable hemp-derived solutions both online and in store.",
    ],
    badges: [
      { icon: FlaskConical, text: "Lab Tested" },
      { icon: Shield, text: "Non-Psychoactive" },
      { icon: Droplets, text: "Full Spectrum" },
    ],
    buttonText: "Shop All CBD",
    buttonHref: "/shop",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/what-is-cbd.webp",
    imageLeft: true,
    bg: "bg-white",
    accent: "#1A9248",
  },
  {
    tag: "Cannabinoid Education",
    heading: "What is Delta 8 THC?",
    body: [
      "Delta-8 THC is a naturally occurring cannabinoid derived from the hemp plant. It is chemically similar to Delta-9 THC, the primary compound found in cannabis, but it is known for producing milder and more relaxing effects.",
      "Many people choose Delta-8 products for a balanced experience that may support relaxation, mood, and overall wellness without the intense psychoactive effects often associated with traditional THC.",
      "At Hemp & Barrel, we offer lab-tested hemp-derived cannabinoid products, including Delta-8 options alongside CBD, THCA flower, and other premium hemp products designed for quality and safety.",
    ],
    badges: [
      { icon: Leaf, text: "Hemp Derived" },
      { icon: Shield, text: "Mild Effects" },
      { icon: FlaskConical, text: "COA Verified" },
    ],
    buttonText: "Shop All Delta 8",
    buttonHref: "/product-tag/delta-8",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/delta-8-1.webp",
    imageLeft: false,
    bg: "bg-[#fafaf8]",
    accent: "#2a1008",
  },
];

function FloatingLeaf({ className }: { className: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <Image src="/hemp-leaf.png" alt="" width={40} height={40} className="opacity-10 animate-[float_6s_ease-in-out_infinite]" />
    </div>
  );
}

export default function Education101() {
  return (
    <div>
      {sections.map((section, idx) => (
        <section key={section.heading} className={`${section.bg} py-20 md:py-28 relative overflow-hidden`}>

          {/* Floating hemp leaves */}
          <FloatingLeaf className={`top-10 ${idx === 0 ? "right-[10%]" : "left-[8%]"} animate-[float_6s_ease-in-out_infinite]`} />
          <FloatingLeaf className={`bottom-16 ${idx === 0 ? "left-[5%]" : "right-[12%]"} animate-[float_8s_ease-in-out_1s_infinite]`} />
          <FloatingLeaf className={`top-1/2 ${idx === 0 ? "right-[3%]" : "left-[3%]"} animate-[float_7s_ease-in-out_2s_infinite]`} />

          {/* Decorative circles */}
          <div className={`absolute ${idx === 0 ? "-right-20 top-20" : "-left-20 bottom-20"} w-[300px] h-[300px] rounded-full border border-[#1A9248]/5`} />
          <div className={`absolute ${idx === 0 ? "-right-10 top-32" : "-left-10 bottom-32"} w-[200px] h-[200px] rounded-full border border-[#1A9248]/8`} />

          <div className="max-w-[1320px] mx-auto px-4 relative">
            <div className={`flex flex-col ${section.imageLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-20`}>

              {/* Image with decorative frame */}
              <div className="w-full md:w-[48%] flex-shrink-0 group">
                <div className="relative">
                  {/* Green accent border */}
                  <div className={`absolute ${section.imageLeft ? "-right-4 -bottom-4" : "-left-4 -bottom-4"} w-full h-full rounded-3xl border-2 border-[#1A9248]/20 transition-all duration-500 group-hover:border-[#1A9248]/40 group-hover:translate-x-1 group-hover:translate-y-1`} />

                  <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
                    <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
                      <Image
                        src={section.image}
                        alt={section.heading}
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 48vw"
                      />
                    </div>

                    {/* Overlay gradient at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Hemp leaf badge on image */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                      <Image src="/hemp-leaf.png" alt="" width={16} height={16} className="w-4 h-4" />
                      <span className="text-[10px] font-bold text-[#1A9248] uppercase tracking-wider">Hemp & Barrel</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="w-full md:w-[52%]">
                {/* Tag */}
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="w-4 h-4 text-[#1A9248]" />
                  <span className="text-[11px] font-bold text-[#1A9248] uppercase tracking-[0.3em]">{section.tag}</span>
                  <span className="flex-1 h-px bg-[#1A9248]/20" />
                </div>

                {/* Heading */}
                <h2 className="text-4xl md:text-5xl font-bold text-[#3d2b1f] mb-6 leading-tight">
                  {section.heading}
                </h2>

                {/* Body text */}
                <div className="space-y-4 mb-8">
                  {section.body.map((para, i) => (
                    <p key={i} className="text-[#5a4a3f] text-[15px] leading-[1.85]">
                      {i === 0 && <span className="text-[#1A9248] font-bold text-lg float-left mr-1 leading-none mt-1">&ldquo;</span>}
                      {para}
                    </p>
                  ))}
                </div>

                {/* Info badges */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  {section.badges.map((badge) => (
                    <div key={badge.text} className="flex items-center gap-2 bg-[#1A9248]/5 border border-[#1A9248]/15 rounded-full px-4 py-2 transition-all duration-300 hover:bg-[#1A9248]/10 hover:border-[#1A9248]/30 hover:shadow-md">
                      <badge.icon className="w-4 h-4 text-[#1A9248]" strokeWidth={2} />
                      <span className="text-xs font-bold text-[#3d2b1f] uppercase tracking-wide">{badge.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <AnimatedButton href={section.buttonHref} variant={idx === 0 ? "primary" : "dark"}>
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
      `}</style>
    </div>
  );
}
