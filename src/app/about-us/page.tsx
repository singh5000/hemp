import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | Hemp & Barrel | CBD Products | Best CBD Oil",
  description:
    "Hemp & Barrel is the first retail store devoted to Lake Harvest CBD — a true locally owned, seed to shelf, fully vertical organization based in Pineville, NC.",
};

const PILLARS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    title: "Seed to Shelf",
    desc: "A true locally owned, fully vertical organization — we control every step from source to store.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
      </svg>
    ),
    title: "Lab Tested",
    desc: "Every product is third-party lab tested for potency, purity, and safety. COAs available for all.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    title: "Local First",
    desc: "Born in North Carolina. We believe local is better — and we're proud to serve our community.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
    title: "Wide Selection",
    desc: "We scoured the state to bring you the best CBD shopping experience — hundreds of products, all curated.",
  },
];

const QUICK_LINKS = [
  { label: "Lab Results", href: "/lab-reports", icon: "🔬" },
  { label: "FAQ",         href: "/faqs",        icon: "❓" },
  { label: "CBD Blog",    href: "/blog",         icon: "📖" },
  { label: "Contact Us",  href: "/contact",      icon: "📞" },
];

export default function AboutUsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#2a1008] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #5a8c3a 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute -left-40 top-0 w-[600px] h-[600px] bg-[#5a8c3a]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-[#5a8c3a]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative w-full mx-auto px-10 py-20 md:py-28 text-center">
          <nav className="flex items-center justify-center gap-2 text-white/40 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">About Us</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-[#5a8c3a]/15 border border-[#5a8c3a]/30 text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">
            Est. 2019 · Pineville, NC
          </div>

          <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight mb-6">
            About <span className="text-[#5a8c3a]">Hemp &amp; Barrel</span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed">
            Charlotte NC's trusted CBD store. Premium, lab-tested hemp products for your everyday wellness.
          </p>
        </div>
      </section>

      {/* ── Origin Story ── */}
      <section className="w-full mx-auto px-10 py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Image */}
          <div className="w-full lg:w-[480px] flex-shrink-0">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#f5f0eb]">
              <Image
                src="https://hempandbarrel.com/wp-content/uploads/2023/02/smokables.jpg"
                alt="Hemp & Barrel store"
                fill
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
              {/* Est badge */}
              <div className="absolute bottom-5 left-5 bg-[#2a1008]/90 backdrop-blur-sm rounded-2xl px-5 py-3">
                <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-wider">Est.</p>
                <p className="text-white text-3xl font-bold leading-none">2019</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.4em] mb-4">Our Story</p>
            <h2 className="text-[#2a1008] text-3xl md:text-4xl font-bold leading-tight mb-6">
              Born at a Farm in Lake Lure, NC
            </h2>

            <div className="space-y-5 text-[#3d2b1f] text-[16px] leading-relaxed">
              <p>
                The idea of Hemp &amp; Barrel started at a farm in Lake Lure, North Carolina in the
                Summer of 2018. The founders took a trip to Lake Lure Farms, and it was there that
                the idea for <strong>Lake Harvest CBD</strong> was hatched.
              </p>
              <p>
                Lake Harvest CBD is now home of the most effective and best CBD brand in four states.
              </p>
              <p>
                Hemp &amp; Barrel is the first retail store devoted to the brand Lake Harvest CBD, as
                well as offering a wide range of other great products. We are a true locally owned,
                seed to shelf, fully vertical organization.
              </p>
              <p>
                We believe that local is better, but understand people might want different products,
                and we are here to provide. Before we opened Hemp &amp; Barrel we scoured the state
                sampling products and store setups to bring you the best CBD shopping experience possible.
              </p>
              <p>
                We offer CBD tinctures, lotions, salves, pet treatments, bath salts/bombs, water,
                gummies, honey, flower and vapes. In addition to that we also select hemp themed
                beer and wine.
              </p>
              <p className="text-[#5a8c3a] font-bold text-lg italic">
                "Hemping ain't easy" — but we are happy to be on this journey with you!
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop"
                className="inline-flex items-center gap-2 bg-[#5a8c3a] hover:bg-[#4a7a2e] text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-full transition-colors">
                Shop Products
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 border-2 border-[#3d2b1f] hover:border-[#5a8c3a] hover:text-[#5a8c3a] text-[#3d2b1f] font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-full transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="bg-[#f5f0eb] py-16">
        <div className="w-full mx-auto px-10">
          <div className="text-center mb-12">
            <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.4em] mb-2">Why Hemp &amp; Barrel</p>
            <h2 className="text-[#2a1008] text-3xl md:text-4xl font-bold">What Makes Us Different</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((p) => (
              <div key={p.title}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#5a8c3a]/10 text-[#5a8c3a] rounded-xl flex items-center justify-center mb-5">
                  {p.icon}
                </div>
                <h3 className="text-[#2a1008] font-bold text-base mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Links ── */}
      <section className="w-full mx-auto px-10 py-16">
        <div className="text-center mb-10">
          <h2 className="text-[#2a1008] text-2xl md:text-3xl font-bold">Explore More</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_LINKS.map((ql) => (
            <Link key={ql.href} href={ql.href}
              className="group bg-[#2a1008] hover:bg-[#3d2b1f] rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl">
              <span className="text-3xl block mb-3">{ql.icon}</span>
              <p className="text-white font-bold text-sm uppercase tracking-wider group-hover:text-[#5a8c3a] transition-colors">
                {ql.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Store Info ── */}
      <section className="bg-[#2a1008] py-16">
        <div className="w-full mx-auto px-10">
          <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
            <div>
              <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.4em] mb-3">Store Info</p>
              <h2 className="text-white text-3xl font-bold mb-5">Visit Us in Pineville</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 text-white/70">
                  <svg className="w-4 h-4 text-[#5a8c3a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  800 N Polk Street, Pineville, NC 28134
                </div>
                <a href="tel:9803264367" className="flex items-center gap-3 text-white/70 hover:text-[#5a8c3a] transition-colors">
                  <svg className="w-4 h-4 text-[#5a8c3a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  (980) 326-4367
                </a>
                <div className="flex items-center gap-3 text-white/70">
                  <svg className="w-4 h-4 text-[#5a8c3a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Mon–Sat: 10am – 8pm &nbsp;·&nbsp; Sun: 12pm – 4pm
                </div>
              </div>
            </div>
            <Link href="/contact"
              className="flex-shrink-0 bg-[#5a8c3a] hover:bg-[#4a7a2e] text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full transition-colors">
              Get Directions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
