"use client";
import Image from "next/image";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { MapPin, Clock, Phone, Star, Leaf } from "lucide-react";

export default function StoreSection() {
  return (
    <section className="relative mb-12">
      <div className="max-w-[1320px] mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden min-h-[600px]">

          {/* Full background image */}
          <Image
            src="https://images.pexels.com/photos/7667908/pexels-photo-7667908.jpeg?auto=compress&cs=tinysrgb&w=1400"
            alt="Hemp & Barrel CBD Store"
            fill
            className="object-cover"
            sizes="100vw"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a1008]/90 via-[#2a1008]/75 to-[#2a1008]/40" />

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col justify-center px-8 md:px-14 py-14 max-w-[650px] min-h-[600px]">

            {/* Badges row */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white">5.0 Google</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1A9248]/80 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Open Now</span>
              </div>
            </div>

            {/* Tag */}
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-[#1A9248]" />
              <span className="text-[10px] font-bold text-[#1A9248] uppercase tracking-[0.3em]">Charlotte&apos;s #1 CBD Store</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.05] mb-2">
              We Can&apos;t Wait<br />
              <span className="text-[#1A9248]">To See You</span>
            </h2>
            <p className="text-white/35 text-sm mb-6">Pineville, NC — Open 7 Days a Week</p>

            {/* Body */}
            <p className="text-white/65 text-[15px] leading-[1.8] mb-8">
              We carry premium THCA flower, CBD gummies, Delta 8 products, THC tinctures, CBD vapes, and hemp-infused beverages — all third-party lab-tested. Visit us in store or shop online with fast USA shipping.
            </p>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                { icon: MapPin, label: "Location", value: "800 N Polk St, Pineville" },
                { icon: Clock, label: "Hours", value: "Mon–Sat 10–8 • Sun 12–4" },
                { icon: Phone, label: "Call", value: "(980) 326-4367" },
              ].map((info) => (
                <div key={info.label} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#1A9248]/30 rounded-xl px-4 py-3 transition-all duration-300">
                  <div className="w-9 h-9 rounded-lg bg-[#1A9248]/20 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-4 h-4 text-[#1A9248]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider">{info.label}</p>
                    <p className="text-white font-semibold text-xs">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
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
    </section>
  );
}
