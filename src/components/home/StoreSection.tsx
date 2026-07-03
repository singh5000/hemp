"use client";
import Image from "next/image";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { MapPin, Clock, Phone, Star, ChevronRight } from "lucide-react";

export default function StoreSection() {
  return (
    <section className="bg-[#f8f6f3]">
      <div className="max-w-[1320px] mx-auto px-4 py-20">

        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold text-[#1A9248] uppercase tracking-[0.3em] mb-3">
            <span className="w-8 h-px bg-[#1A9248]/40" />
            Visit Our Store
            <span className="w-8 h-px bg-[#1A9248]/40" />
          </span>
          <h2 className="text-[44px] md:text-5xl font-black text-[#2a1008]">
            We Can&apos;t Wait <span className="text-[#1A9248]">To See You</span>
          </h2>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* Image — takes 3 cols */}
            <div className="relative lg:col-span-3 min-h-[350px] lg:min-h-[520px] group">
              <Image
                src="https://images.unsplash.com/photo-1604660664082-3cac347079b0?w=1200&q=80"
                alt="Hemp & Barrel Store"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/20" />

              {/* Badges on image */}
              <div className="absolute top-5 left-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3.5 py-2 shadow-lg">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                  </div>
                  <span className="text-[13px] font-bold text-[#2a1008] ml-0.5">5.0</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#1A9248] rounded-full px-3.5 py-2 shadow-lg w-fit">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-[12px] font-bold text-white uppercase tracking-wider">Open Now</span>
                </div>
              </div>

              {/* Store name overlay at bottom */}
              <div className="absolute bottom-5 left-5 right-5 lg:hidden">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
                  <Image src="/hemp-leaf.png" alt="" width={20} height={20} className="w-5 h-5" />
                  <div>
                    <p className="text-[16.5px] font-bold text-[#2a1008]">Hemp & Barrel</p>
                    <p className="text-[16.5px] text-gray-500">Charlotte&apos;s #1 CBD Store</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content — takes 2 cols */}
            <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center relative">
              {/* Decorative bg pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]">
                <Image src="/hemp-leaf.png" alt="" fill className="object-contain" />
              </div>

              {/* Quote style intro */}
              <div className="relative mb-6">
                <span className="absolute -left-2 -top-2 text-5xl font-serif text-[#1A9248]/15 leading-none">&ldquo;</span>
                <p className="text-[#2a1008] text-[16.5px] leading-[1.85] font-medium pl-6">
                  Charlotte NC&apos;s most trusted THCA &amp; hemp store — premium THCA flower, gummies, Delta 8, tinctures, vapes, CBD &amp; hemp beverages. All third-party lab-tested.
                </p>
              </div>

              {/* Divider */}
              <div className="w-12 h-0.5 bg-[#1A9248]/30 rounded-full mb-6" />

              {/* Modern info grid */}
              <div className="grid grid-cols-1 gap-1 mb-8">
                {[
                  { icon: MapPin, label: "FIND US", text: "800 N Polk St, Pineville, NC 28134", href: "https://goo.gl/maps/ZGKaUsQ9k6sGLywh7", color: "bg-[#1A9248]" },
                  { icon: Clock, label: "STORE HOURS", text: "Mon–Sat 10AM–8PM • Sun 12–4PM", color: "bg-[#2a1008]" },
                  { icon: Phone, label: "CALL US", text: "(980) 326-4367", href: "tel:9803264367", color: "bg-[#1A9248]" },
                ].map((row) => {
                  const inner = (
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#1A9248]/20 hover:shadow-md hover:shadow-[#1A9248]/5 transition-all duration-300 group/row">
                      <div className={`w-11 h-11 rounded-xl ${row.color} flex items-center justify-center flex-shrink-0 group-hover/row:scale-110 transition-transform`}>
                        <row.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[16.5px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-0.5">{row.label}</p>
                        <p className="text-[#2a1008] text-[16.5px] font-bold">{row.text}</p>
                      </div>
                      {row.href && <ChevronRight className="w-5 h-5 text-gray-200 group-hover/row:text-[#1A9248] group-hover/row:translate-x-1 transition-all" />}
                    </div>
                  );
                  return row.href ? (
                    <a key={row.text} href={row.href} target={row.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block">{inner}</a>
                  ) : (
                    <div key={row.text}>{inner}</div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-3 flex-wrap">
                <AnimatedButton href="https://goo.gl/maps/ZGKaUsQ9k6sGLywh7" external>
                  Get Directions
                </AnimatedButton>
                <AnimatedButton href="/shop" variant="outline" size="sm">
                  Shop Online
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
