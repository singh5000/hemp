"use client";
import Image from "next/image";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { MapPin, Clock, Phone, Star, Navigation, Leaf } from "lucide-react";

const STORE_INFO = [
  { icon: MapPin, label: "Location", value: "800 N Polk St, Pineville, NC 28134" },
  { icon: Clock, label: "Hours", value: "Mon–Sat 10AM–8PM • Sun 12–4PM" },
  { icon: Phone, label: "Call Us", value: "(980) 326-4367" },
];

export default function StoreSection() {
  return (
    <section className="relative bg-[#1a1a2e] overflow-hidden mb-16 mx-4 rounded-3xl">

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #1A9248 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="max-w-[1320px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[600px]">

          {/* Left — Image */}
          <div className="relative group lg:order-1 min-h-[400px] lg:min-h-0">
            <div className="absolute inset-0 lg:inset-y-8 lg:-left-4 lg:right-0 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.pexels.com/photos/7667908/pexels-photo-7667908.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Hemp & Barrel CBD Store Charlotte NC"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a1008]/60 via-transparent to-transparent" />

              {/* Rating badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-[#3d2b1f]">5.0 on Google</span>
              </div>

              {/* Open now badge */}
              <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-[#1A9248] rounded-full px-3 py-1.5 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Open Now</span>
              </div>

              {/* Bottom info bar */}
              <div className="absolute bottom-0 inset-x-0 p-5">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1A9248]/10 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-5 h-5 text-[#1A9248]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#1A9248] uppercase tracking-wider">Charlotte&apos;s #1 CBD Store</p>
                    <p className="text-xs text-gray-500 mt-0.5">Pineville, NC — Serving the Carolinas since 2019</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="lg:order-2 flex flex-col justify-center py-16 lg:py-20 lg:pl-16">

            {/* Tag */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-8 h-8 rounded-lg bg-[#1A9248]/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#1A9248]" />
              </span>
              <span className="text-[10px] font-bold text-[#1A9248] uppercase tracking-[0.3em]">Visit Our Store</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-[3.2rem] font-black text-white leading-[1.05] mb-3">
              We Can&apos;t Wait{" "}
              <span className="relative inline-block">
                <span className="text-[#1A9248]">To See You</span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#1A9248]/30 rounded-full" />
              </span>
            </h2>
            <p className="text-white/30 text-sm font-medium mb-8">Pineville, NC — Open 7 Days a Week</p>

            {/* Body */}
            <p className="text-white/70 text-[15px] leading-[1.9] mb-4">
              Hemp & Barrel is Charlotte NC&apos;s trusted CBD store, proudly serving Pineville and surrounding areas. We carry premium THCA flower, CBD gummies, Delta 8 products, THC tinctures, CBD vapes, and hemp-infused beverages — all third-party lab-tested for quality and safety.
            </p>
            <p className="text-white/50 text-[14px] leading-[1.9] mb-10">
              Whether you&apos;re new to CBD or an experienced cannabinoid user, our knowledgeable staff will help you find the right product for your needs.
            </p>

            {/* Store info cards */}
            <div className="space-y-3 mb-10">
              {STORE_INFO.map((info) => (
                <div key={info.label} className="flex items-center gap-4 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#1A9248]/30 rounded-xl px-5 py-3.5 transition-all duration-300 group/info">
                  <div className="w-10 h-10 rounded-lg bg-[#1A9248]/15 group-hover/info:bg-[#1A9248]/25 flex items-center justify-center transition-colors flex-shrink-0">
                    <info.icon className="w-4.5 h-4.5 text-[#1A9248]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{info.label}</p>
                    <p className="text-white font-semibold text-sm">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4 flex-wrap">
              <AnimatedButton href="https://goo.gl/maps/ZGKaUsQ9k6sGLywh7" external>
                Get Directions
              </AnimatedButton>
              <AnimatedButton href="/contact" variant="outline">
                Contact Us
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Floating leaves */}
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute pointer-events-none"
          style={{
            top: `${15 + i * 30}%`,
            right: `${2 + i * 3}%`,
            animation: `float ${6 + i * 2}s ease-in-out ${i}s infinite`,
          }}>
          <Leaf className={`text-[#1A9248]/10 ${i === 0 ? "w-8 h-8" : i === 1 ? "w-5 h-5" : "w-6 h-6"}`} />
        </div>
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-3deg); }
        }
      `}</style>
    </section>
  );
}
