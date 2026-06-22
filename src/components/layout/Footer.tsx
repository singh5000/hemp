import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const SHOP_LINKS = [
  { label: "Smokable Hemp Flower", href: "/product-category/smokable-hemp-flower" },
  { label: "Edibles & Gummies",    href: "/product-category/edibles-gummies" },
  { label: "Infused Beverages",    href: "/product-category/infused-beverages" },
  { label: "CBD Tinctures",        href: "/product-category/tinctures" },
  { label: "Topicals",             href: "/product-category/topicals" },
  { label: "CBD Pouches",          href: "/product-category/cbd-pouches" },
  { label: "Pet Products",         href: "/product-category/pets" },
  { label: "Vapes",                href: "/product-category/vapes" },
  { label: "Merchandise",          href: "/product-category/merchandise" },
  { label: "Subscriptions",        href: "/product-category/subitems" },
  { label: "View All Products",    href: "/shop" },
];

const INFO_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "Lab Reports", href: "/lab-reports" },
  { label: "CBD Blog", href: "/blog" },
  { label: "FAQs", href: "/faqs" },
  { label: "Returns & Exchanges", href: "/returns-exchanges" },
  { label: "Shipping & Delivery", href: "/shipping-delivery" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2a1008]">

      {/* Newsletter Strip */}
      <div className="border-b border-white/10 py-10">
        <div className="w-full mx-auto px-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-2xl font-bold uppercase tracking-widest mb-1">
              Stay in the Loop
            </h3>
            <p className="text-white/50 text-sm">
              Get exclusive deals, new arrivals & hemp education straight to your inbox.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Main Grid */}
      <div className="w-full mx-auto px-[40px] py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-3">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="https://hempandbarrel.com/wp-content/uploads/2023/02/footer-logo.svg"
                alt="Hemp & Barrel"
                width={160}
                height={70}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Charlotte NC's trusted CBD store. Premium, lab-tested hemp products for your everyday wellness.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mb-8">
              <Link href="https://www.facebook.com/HempandBarrel" target="_blank" rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#5a8c3a] hover:bg-[#4a7a2e] flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </Link>
              <Link href="https://www.instagram.com/hempandbarrel/" target="_blank" rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[#5a8c3a] hover:bg-[#4a7a2e] flex items-center justify-center transition-all hover:scale-110">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="space-y-2">
              {["Lab Tested Products", "Fast USA Shipping", "Secure Checkout"].map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#5a8c3a] flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/60 text-xs">{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div className="md:col-span-3">
            <h4 className="text-[#5a8c3a] font-bold uppercase tracking-[0.2em] text-xs mb-6 pb-3 border-b border-white/10">
              Shop
            </h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-white/65 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#5a8c3a] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Column */}
          <div className="md:col-span-3">
            <h4 className="text-[#5a8c3a] font-bold uppercase tracking-[0.2em] text-xs mb-6 pb-3 border-b border-white/10">
              Information
            </h4>
            <ul className="space-y-3">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-white/65 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#5a8c3a] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Info Column */}
          <div className="md:col-span-3">
            <h4 className="text-[#5a8c3a] font-bold uppercase tracking-[0.2em] text-xs mb-6 pb-3 border-b border-white/10">
              Visit Us
            </h4>

            {/* Hours */}
            <div className="mb-6">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Store Hours</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Mon – Sat</span>
                  <span className="text-white">10:00am – 8:00pm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Sunday</span>
                  <span className="text-white">12:00pm – 4:00pm</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Address</p>
              <Link
                href="https://goo.gl/maps/ZGKaUsQ9k6sGLywh7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white text-sm leading-relaxed transition-colors block"
              >
                800 N Polk Street<br />
                Pineville, NC 28134
              </Link>
            </div>

            {/* Phone */}
            <div className="mb-6">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Phone</p>
              <a href="tel:9803264367"
                className="text-[#5a8c3a] hover:text-[#7ab84f] font-semibold text-base transition-colors">
                (980) 326-4367
              </a>
            </div>

            {/* Get Directions CTA */}
            <Link
              href="https://goo.gl/maps/ZGKaUsQ9k6sGLywh7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#5a8c3a] text-[#5a8c3a] hover:bg-[#5a8c3a] hover:text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Directions
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="w-full mx-auto px-[40px] py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs">
            © {new Date().getFullYear()} Hemp & Barrel, Inc. All rights reserved.
          </p>
          <p className="text-white/25 text-xs">
            *These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}
