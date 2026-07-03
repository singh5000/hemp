import Image from "next/image";
import Link from "next/link";
import { Flame, Candy, CupSoda, Package, Droplet, Sparkles, PawPrint, ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Smokable Hemp Flower",
    href: "/product-category/smokable-hemp-flower",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/smokables.jpg",
    icon: Flame,
    tag: "Most Popular",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    name: "Edibles & Gummies",
    href: "/product-category/edibles-gummies",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/edibles-image.jpg",
    icon: Candy,
  },
  {
    name: "Infused Beverages",
    href: "/product-category/infused-beverages",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/beverages.jpg",
    icon: CupSoda,
  },
  {
    name: "CBD Pouches",
    href: "/product-category/cbd-pouches",
    image: "https://hempandbarrel.com/wp-content/uploads/2024/04/cbd-pouches2.png",
    icon: Package,
  },
  {
    name: "Tinctures",
    href: "/product-category/tinctures",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/tincture.jpg",
    icon: Droplet,
  },
  {
    name: "Topicals",
    href: "/product-category/topicals",
    image: "https://hempandbarrel.com/wp-content/uploads/2024/04/Topicals-Category-Photo.png",
    icon: Sparkles,
  },
  {
    name: "Pet Products",
    href: "/product-category/pets",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/pets.jpg",
    icon: PawPrint,
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1320px] mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold text-[#1A9248] uppercase tracking-[0.3em] mb-3">
            <span className="w-8 h-px bg-[#1A9248]/40" />
            Explore The Range
            <span className="w-8 h-px bg-[#1A9248]/40" />
          </span>
          <h2 className="text-[36px] md:text-5xl font-black text-[#2a1008]">Shop By Category</h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-3 gap-3.5 md:gap-5 md:auto-rows-[225px]">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`relative rounded-2xl md:rounded-3xl overflow-hidden group ring-1 ring-black/5 shadow-md shadow-black/5 hover:shadow-2xl hover:shadow-[#1A9248]/15 hover:-translate-y-1 transition-all duration-500 aspect-[4/3] md:aspect-auto ${cat.span ?? ""}`}
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover saturate-[0.92] transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Brand color-grade wash for cohesion across mixed photo tones */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1A9248]/10 via-transparent to-[#2a1008]/20 mix-blend-multiply" />

                {/* Bottom legibility gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a05]/90 via-[#1a0a05]/15 to-transparent group-hover:from-[#1a0a05]/95 transition-colors duration-500" />

                {/* Inner hairline ring for a glass edge */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />

                {/* Tag pill (hero only) */}
                {cat.tag && (
                  <span className="absolute top-4 left-4 md:top-5 md:left-5 bg-[#1A9248] text-white text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-lg shadow-black/20">
                    {cat.tag}
                  </span>
                )}

                {/* Icon badge */}
                <div className={`absolute ${cat.tag ? "top-4 right-4 md:top-5 md:right-5" : "top-3.5 left-3.5"} w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[#1A9248] group-hover:border-[#1A9248] transition-all duration-300`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Category name */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex items-end justify-between gap-2">
                  <div>
                    <span className={`block text-white font-black uppercase leading-tight tracking-wide drop-shadow-md ${cat.span ? "text-[26px] md:text-[32px]" : "text-[15px] md:text-[17px]"}`}>
                      {cat.name}
                    </span>
                    <span className={`flex items-center gap-1 text-[#7ee6a3] text-[12px] font-bold uppercase tracking-wider mt-1.5 transition-all duration-300 ${cat.span ? "opacity-100" : "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"}`}>
                      Shop Now
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  {/* Persistent arrow chip */}
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-[#1A9248] group-hover:-rotate-45 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}

          {/* View All — premium CTA tile */}
          <Link
            href="/shop"
            className="relative rounded-2xl md:rounded-3xl overflow-hidden group ring-1 ring-black/5 shadow-md shadow-black/5 hover:shadow-2xl hover:shadow-[#1A9248]/25 hover:-translate-y-1 transition-all duration-500 flex flex-col items-center justify-center text-center p-4 aspect-[4/3] md:aspect-auto md:col-span-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a1008] via-[#1A9248] to-[#0f5c2b]" />
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />

            <div className="relative w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center mb-3.5 transition-all duration-500 group-hover:bg-white group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              <ArrowRight className="w-5 h-5 text-white group-hover:text-[#1A9248] group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
            <span className="relative text-white font-black uppercase tracking-wide text-[17px] md:text-[19px]">
              View All Products
            </span>
            <span className="relative text-white/60 text-[12.5px] mt-1 font-medium">
              Browse the full collection
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
