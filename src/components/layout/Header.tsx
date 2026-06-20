"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
  {
    label: "Smokable Hemp Flower",
    href: "/product-category/smokable-hemp-flower",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/smokables.jpg",
  },
  {
    label: "Edibles & Gummies",
    href: "/product-category/edibles-gummies",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/edibles-image.jpg",
  },
  {
    label: "Infused Beverages",
    href: "/product-category/infused-beverages",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/beverages.jpg",
  },
  {
    label: "CBD Tinctures",
    href: "/product-category/tinctures",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/tincture.jpg",
  },
  {
    label: "Topicals",
    href: "/product-category/topicals",
    image: "https://hempandbarrel.com/wp-content/uploads/2024/04/Topicals-Category-Photo.png",
  },
  {
    label: "CBD Pouches",
    href: "/product-category/cbd-pouches",
    image: "https://hempandbarrel.com/wp-content/uploads/2024/04/cbd-pouches2.png",
  },
  {
    label: "Pet Products",
    href: "/product-category/pets",
    image: "https://hempandbarrel.com/wp-content/uploads/2023/02/pets.jpg",
  },
  {
    label: "Vapes",
    href: "/product-category/vapes",
    image: null,
    gradient: "linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)",
    icon: (
      <svg className="w-14 h-14 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h.01M7 12h.01M11 12c0-2.21 1.79-4 4-4s4 1.79 4 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12V7a5 5 0 0110 0v5" />
      </svg>
    ),
  },
  {
    label: "Merchandise",
    href: "/product-category/merchandise",
    image: null,
    gradient: "linear-gradient(135deg, #5c3d2e 0%, #3d2b1f 50%, #2a1008 100%)",
    icon: (
      <svg className="w-14 h-14 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: "Subscriptions",
    href: "/product-category/subitems",
    image: null,
    gradient: "linear-gradient(135deg, #2d5a2d 0%, #1a3a1a 50%, #0d2b0d 100%)",
    icon: (
      <svg className="w-14 h-14 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

const RIGHT_NAV = [
  { label: "Contact", href: "/contact" },
  { label: "CBD Blog", href: "/blog" },
];

export default function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const accountRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close account dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Focus search input when overlay opens */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQ.trim();
    if (!q) return;
    setSearchOpen(false);
    setSearchQ("");
    router.push(`/shop?search=${encodeURIComponent(q)}`);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-[23px] flex items-stretch justify-between">

        {/* Left Nav */}
        <nav className="hidden lg:flex items-center gap-8 flex-1">
          <div className="relative">
            <button
              onClick={() => setShopOpen(!shopOpen)}
              className="nav-link flex items-center gap-1"
            >
              Shop Products
              <svg
                className={`w-3 h-3 mt-0.5 transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <Link href="/faqs" className="nav-link">FAQs</Link>
        </nav>

        {/* Center Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex-shrink-0 flex items-center">
          <Image
            src="https://hempandbarrel.com/wp-content/uploads/2023/02/nav-logo.svg"
            alt="Hemp & Barrel"
            width={180}
            height={50}
            priority
            className="h-[36px] w-auto"
          />
        </Link>

        {/* Right Nav */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-end">
          {RIGHT_NAV.map((item) => (
            <Link key={item.label} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}

          {/* Account — dropdown when logged in, plain link when not */}
          <div className="relative" ref={accountRef}>
            {user ? (
              <>
                <button
                  onClick={() => setAccountOpen(v => !v)}
                  className="nav-link flex items-center gap-1.5"
                >
                  <span className="w-6 h-6 rounded-full bg-[#5a8c3a] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                  <svg className={`w-3 h-3 mt-0.5 transition-transform ${accountOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-semibold text-[#3d2b1f] truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link href="/my-account" onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-[#3d2b1f] hover:bg-[#f5f0eb] transition-colors font-medium">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      My Account
                    </Link>
                    <Link href="/my-account?tab=orders" onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-[#3d2b1f] hover:bg-[#f5f0eb] transition-colors font-medium border-t border-gray-50">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                      My Orders
                    </Link>
                    <button
                      onClick={() => { setAccountOpen(false); logout(); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium border-t border-gray-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/my-account" className="nav-link">My Account</Link>
            )}
          </div>

          <button aria-label="Search" onClick={() => setSearchOpen(o => !o)}
            className="text-[#3d2b1f] hover:text-[#5a8c3a] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
          <Link href="/cart" aria-label="Cart" className="relative text-[#3d2b1f] hover:text-[#5a8c3a] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#5a8c3a] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex lg:hidden items-center gap-4 ml-auto">
          <Link href="/cart" className="relative text-[#3d2b1f]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#5a8c3a] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <svg className="w-6 h-6 text-[#3d2b1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* ── MEGA MENU ── */}
      {shopOpen && (
        <>
          {/* Backdrop — click anywhere outside to close */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShopOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 w-full bg-white border-t-2 border-[#5a8c3a] shadow-2xl z-40">
          <div className="max-w-[1400px] mx-auto px-6 py-6">

            {/* Menu header row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] text-[#5a8c3a] font-bold uppercase tracking-[0.3em] mb-0.5">
                  Browse Categories
                </p>
                <h3 className="text-lg font-bold text-[#3d2b1f] leading-tight">
                  Shop Our Product Range
                </h3>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#5a8c3a] hover:text-[#4a7a2e] transition-colors border border-[#5a8c3a] hover:bg-[#5a8c3a] hover:text-white px-4 py-2 rounded-full"
                onClick={() => setShopOpen(false)}
              >
                View All Products
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* 5×2 category card grid */}
            <div className="grid grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="group relative rounded-xl overflow-hidden block"
                  style={{ aspectRatio: "1/1" }}
                  onClick={() => setShopOpen(false)}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 1400px) 20vw, 250px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: cat.gradient }}
                    >
                      {cat.icon}
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent group-hover:from-black/85 transition-all duration-300" />

                  {/* Hover shine */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, rgba(90,140,58,0.15) 0%, transparent 60%)" }} />

                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-white font-bold text-[19px] leading-tight drop-shadow-md block">
                      {cat.label}
                    </span>
                    <span className="text-white/0 group-hover:text-white/80 text-[13px] font-medium transition-all duration-300 block">
                      Shop now →
                    </span>
                  </div>

                  {/* Green border on hover */}
                  <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-[#5a8c3a] transition-all duration-200" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        </>
      )}

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30" onClick={() => { setSearchOpen(false); setSearchQ(""); }} />
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-40">
            <div className="max-w-[1400px] mx-auto px-6 py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 text-[#2a1008] text-base outline-none placeholder-gray-300 bg-transparent"
                />
                <button type="submit"
                  className="bg-[#5a8c3a] hover:bg-[#4a7a2e] text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors flex-shrink-0">
                  Search
                </button>
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQ(""); }}
                  className="text-gray-400 hover:text-[#3d2b1f] transition-colors flex-shrink-0" aria-label="Close search">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-5 py-4 space-y-1">
            {/* Shop Product accordion */}
            <div>
              <button
                className="w-full flex items-center justify-between py-3 text-[#3d2b1f] font-bold text-base border-b border-gray-100"
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
              >
                Shop Products
                <svg
                  className={`w-4 h-4 transition-transform ${mobileShopOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileShopOpen && (
                <div className="bg-gray-50 rounded-xl my-2 overflow-hidden border border-gray-100">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#f5f0eb] border-b border-gray-100 last:border-0 transition-colors"
                      onClick={() => { setMobileOpen(false); setMobileShopOpen(false); }}
                    >
                      <div
                        className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                        style={!cat.image ? { background: cat.gradient } : undefined}
                      >
                        {cat.image ? (
                          <Image src={cat.image} alt={cat.label} fill sizes="40px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="scale-50">{cat.icon}</div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-[#3d2b1f]">{cat.label}</span>
                    </Link>
                  ))}
                  <Link
                    href="/shop"
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#5a8c3a] text-white font-bold text-sm"
                    onClick={() => { setMobileOpen(false); setMobileShopOpen(false); }}
                  >
                    View All Products →
                  </Link>
                </div>
              )}
            </div>

            {[
              { label: "FAQs", href: "/faqs" },
              { label: "Contact", href: "/contact" },
              { label: "CBD Blog", href: "/blog" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-[#3d2b1f] font-bold text-base border-b border-gray-100 hover:text-[#5a8c3a] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth-aware account section on mobile */}
            {user ? (
              <div className="border-b border-gray-100">
                <div className="flex items-center gap-3 py-3">
                  <span className="w-8 h-8 rounded-full bg-[#5a8c3a] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-[#3d2b1f] font-bold text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>
                <Link href="/my-account" onClick={() => setMobileOpen(false)}
                  className="block py-2.5 pl-11 text-sm text-[#3d2b1f] font-medium hover:text-[#5a8c3a] transition-colors">
                  My Account / Orders
                </Link>
                <button onClick={() => { setMobileOpen(false); logout(); }}
                  className="block w-full text-left py-2.5 pl-11 text-sm text-red-500 font-medium">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/my-account"
                className="block py-3 text-[#3d2b1f] font-bold text-base border-b border-gray-100 hover:text-[#5a8c3a] transition-colors"
                onClick={() => setMobileOpen(false)}>
                My Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
