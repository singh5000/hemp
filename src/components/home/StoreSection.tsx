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
          <span className="inline-flex items-center gap-2 text-[10px] font-bold text-[#1A9248] uppercase tracking-[0.3em] mb-3">
            <span className="w-8 h-px bg-[#1A9248]/40" />
            Visit Our Store
            <span className="w-8 h-px bg-[#1A9248]/40" />
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#2a1008]">
            We Can&apos;t Wait <span className="text-[#1A9248]">To See You</span>
          </h2>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* Image — takes 3 cols */}
            <div className="relative lg:col-span-3 min-h-[350px] lg:min-h-[520px] group">
              <Image
                src="https://hempandbarrel.com/wp-content/uploads/2023/02/hemp-barrel-we-cant-wait-1-scaled.webp"
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
                  <span className="text-[11px] font-bold text-[#2a1008] ml-0.5">5.0</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#1A9248] rounded-full px-3.5 py-2 shadow-lg w-fit">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Open Now</span>
                </div>
              </div>

              {/* Store name overlay at bottom */}
              <div className="absolute bottom-5 left-5 right-5 lg:hidden">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
                  <Image src="/hemp-leaf.png" alt="" width={20} height={20} className="w-5 h-5" />
                  <div>
                    <p className="text-xs font-bold text-[#2a1008]">Hemp & Barrel</p>
                    <p className="text-[10px] text-gray-500">Charlotte&apos;s #1 CBD Store</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content — takes 2 cols */}
            <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
              <p className="text-[#3d2b1f] text-[15px] leading-[1.85] mb-8">
                Hemp & Barrel is Charlotte NC&apos;s trusted CBD store, proudly serving Pineville and surrounding areas. We carry premium THCA flower, CBD gummies, Delta 8 products, THC tinctures, CBD vapes, and hemp-infused beverages — all third-party lab-tested for quality and safety.
              </p>

              {/* Info rows */}
              <div className="space-y-2 mb-8">
                {[
                  { icon: MapPin, text: "800 N Polk Street, Pineville, NC 28134", href: "https://goo.gl/maps/ZGKaUsQ9k6sGLywh7" },
                  { icon: Clock, text: "Mon–Sat 10AM–8PM • Sun 12PM–4PM" },
                  { icon: Phone, text: "(980) 326-4367", href: "tel:9803264367" },
                ].map((row) => {
                  const content = (
                    <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#f8f6f3] transition-colors group/row cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-[#1A9248]/10 group-hover/row:bg-[#1A9248]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                        <row.icon className="w-4 h-4 text-[#1A9248]" />
                      </div>
                      <span className="text-[#3d2b1f] text-sm font-semibold flex-1">{row.text}</span>
                      {row.href && <ChevronRight className="w-4 h-4 text-gray-300 group-hover/row:text-[#1A9248] transition-colors" />}
                    </div>
                  );
                  return row.href ? (
                    <a key={row.text} href={row.href} target={row.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block">{content}</a>
                  ) : (
                    <div key={row.text}>{content}</div>
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
