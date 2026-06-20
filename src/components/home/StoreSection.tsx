import Image from "next/image";
import Link from "next/link";

export default function StoreSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "520px" }}>
      {/* Background Image */}
      <Image
        src="https://hempandbarrel.com/wp-content/uploads/2023/02/hemp-barrel-we-cant-wait-1-scaled.webp"
        alt="Hemp & Barrel Store"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Right side content overlay */}
      <div className="relative z-10 h-full flex items-center justify-end min-h-[520px]">
        <div className="w-full md:w-1/2 bg-white/90 backdrop-blur-sm px-12 py-16 md:py-20 h-full flex flex-col justify-center min-h-[520px]">
          <h2 className="text-4xl md:text-5xl font-bold text-[#3d2b1f] uppercase leading-tight mb-6">
            We Can't Wait<br />To See You
          </h2>

          <p className="text-[#3d2b1f] text-base md:text-lg leading-relaxed mb-5">
            Hemp & Barrel is Charlotte NC's trusted CBD store, proudly serving Pineville and surrounding areas. We carry premium THCA flower, CBD gummies, Delta 8 products, THC tinctures, CBD vapes, and hemp-infused beverages — all third-party lab-tested for quality and safety.
          </p>

          <p className="text-[#3d2b1f] text-base md:text-lg leading-relaxed mb-10">
            Whether you're new to CBD or an experienced cannabinoid user, our knowledgeable staff will help you find the right product for your needs. Visit us in store or shop online and get fast shipping across the USA.
          </p>

          <div>
            <Link
              href="https://goo.gl/maps/ZGKaUsQ9k6sGLywh7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#5a8c3a] hover:bg-[#4a7a2e] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 uppercase tracking-widest text-sm"
            >
              Get Directions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
