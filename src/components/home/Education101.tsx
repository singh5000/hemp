import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const sections = [
  {
    heading: "What is CBD?",
    body: [
      "Cannabidiol (CBD) is a naturally occurring compound found in the hemp plant (Cannabis sativa). Unlike THC, CBD is non-psychoactive, meaning it does not produce a high. Many people use CBD to support relaxation, stress relief, sleep, and overall wellness.",
      "CBD and other hemp-derived cannabinoids are now widely available in a variety of forms, including CBD oils, CBD edibles, CBD vape products, and smokable hemp flower. At Hemp & Barrel, we provide lab-tested CBD and hemp products designed for quality, safety, and everyday wellness.",
      "As a trusted CBD and hemp store, Hemp & Barrel offers premium cannabinoid products for customers looking for reliable hemp-derived solutions both online and in store.",
    ],
    buttonText: "Shop All CBD",
    buttonHref: "/shop",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/what-is-cbd.webp",
    imageLeft: true,
    bg: "bg-white",
  },
  {
    heading: "What is Delta 8 THC?",
    body: [
      "Delta-8 THC is a naturally occurring cannabinoid derived from the hemp plant. It is chemically similar to Delta-9 THC, the primary compound found in cannabis, but it is known for producing milder and more relaxing effects.",
      "Many people choose Delta-8 products for a balanced experience that may support relaxation, mood, and overall wellness without the intense psychoactive effects often associated with traditional THC.",
      "At Hemp & Barrel, we offer lab-tested hemp-derived cannabinoid products, including Delta-8 options alongside CBD, THCA flower, and other premium hemp products designed for quality and safety.",
    ],
    buttonText: "Shop All Delta 8",
    buttonHref: "/product-tag/delta-8",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/delta-8-1.webp",
    imageLeft: false,
    bg: "bg-[#f5f0eb]",
  },
];

export default function Education101() {
  return (
    <div>
      {sections.map((section) => (
        <section key={section.heading} className={`${section.bg} py-16 md:py-24`}>
          <div className="max-w-[1320px] mx-auto px-4">
            <div
              className={`flex flex-col ${
                section.imageLeft ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12 md:gap-20`}
            >
              {/* Image */}
              <div className="w-full md:w-[48%] flex-shrink-0">
                <div className="relative w-full"
                  style={{ aspectRatio: "1 / 1" }}>
                  <Image
                    src={section.image}
                    alt={section.heading}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 48vw"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="w-full md:w-[52%]">
                <h2 className="text-3xl md:text-4xl font-bold text-[#3d2b1f] mb-6 leading-snug italic">
                  {section.heading}
                </h2>
                <div className="space-y-4 mb-8">
                  {section.body.map((para, i) => (
                    <p key={i} className="text-[#5a4a3f] text-base md:text-[17px] leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
                <Link
                  href={section.buttonHref}
                  className="group relative inline-flex items-center gap-3 bg-[#1A9248] text-white font-bold pl-8 pr-2 py-2 rounded-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(26,146,72,0.4)] uppercase tracking-wider text-sm overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#1A9248] via-[#22b558] to-[#1A9248] bg-[length:200%_100%] group-hover:animate-[shimmer_1.5s_ease-in-out] rounded-full" />
                  <span className="relative z-10">{section.buttonText}</span>
                  <span className="relative z-10 w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all duration-300 group-hover:rotate-[-30deg] group-hover:scale-110">
                    <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
