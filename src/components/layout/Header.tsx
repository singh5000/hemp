"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronDown, Search, ShoppingCart, Menu, X,
  User, ClipboardList, LogOut, ArrowRight, Leaf,
  Wind, ShoppingBag, RefreshCw, Truck,
} from "lucide-react";

const HEMP_LEAF = (
  <Image src="/hemp-leaf.png" alt="" width={18} height={18} className="w-[18px] h-[18px] object-contain" />
);

const CATEGORIES = [
  { label: "Smokable Hemp Flower", href: "/product-category/smokable-hemp-flower", image: "https://hempandbarrel.com/wp-content/uploads/2023/02/smokables.jpg" },
  { label: "Edibles & Gummies", href: "/product-category/edibles-gummies", image: "https://hempandbarrel.com/wp-content/uploads/2023/02/edibles-image.jpg" },
  { label: "Infused Beverages", href: "/product-category/infused-beverages", image: "https://hempandbarrel.com/wp-content/uploads/2023/02/beverages.jpg" },
  { label: "CBD Tinctures", href: "/product-category/tinctures", image: "https://hempandbarrel.com/wp-content/uploads/2023/02/tincture.jpg" },
  { label: "Topicals", href: "/product-category/topicals", image: "https://hempandbarrel.com/wp-content/uploads/2024/04/Topicals-Category-Photo.png" },
  { label: "CBD Pouches", href: "/product-category/cbd-pouches", image: "https://hempandbarrel.com/wp-content/uploads/2024/04/cbd-pouches2.png" },
  { label: "Pet Products", href: "/product-category/pets", image: "https://hempandbarrel.com/wp-content/uploads/2023/02/pets.jpg" },
  { label: "Vapes", href: "/product-category/vapes", image: null, gradient: "linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)", icon: <Wind className="w-10 h-10 text-white/80" strokeWidth={1.5} /> },
  { label: "Merchandise", href: "/product-category/merchandise", image: null, gradient: "linear-gradient(135deg, #5c3d2e 0%, #3d2b1f 50%, #2a1008 100%)", icon: <ShoppingBag className="w-10 h-10 text-white/80" strokeWidth={1.5} /> },
  { label: "Subscriptions", href: "/product-category/subitems", image: null, gradient: "linear-gradient(135deg, #2d5a2d 0%, #1a3a1a 50%, #0d2b0d 100%)", icon: <RefreshCw className="w-10 h-10 text-white/80" strokeWidth={1.5} /> },
];

const NAV_LINKS = [
  { label: "Shop Products", href: "/shop", hasDropdown: true },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
  { label: "CBD Blog", href: "/blog" },
];

function NavLink({ label, href, isActive }: { label: string; href: string; isActive: boolean }) {
  return (
    <Link href={href} className="group relative flex items-center">
      {/* Hemp leaf above */}
      <span className={`absolute -top-5 left-1/2 -translate-x-1/2 transition-all duration-300 origin-bottom ${isActive ? "opacity-100 scale-100 animate-[slover_1s_infinite_alternate]" : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 group-hover:animate-[slover_1s_infinite_alternate]"}`}>
        {HEMP_LEAF}
      </span>
      <span className={`font-semibold text-[15px] transition-colors duration-200 ${isActive ? "text-[#1A9248]" : "text-[#3d2b1f] group-hover:text-[#1A9248]"}`}>
        {label}
      </span>
      {isActive && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#1A9248] rounded-full" />}
    </Link>
  );
}

export default function Header() {
  const { cart, cartCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [announceClosed, setAnnounceClosed] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) setCartHover(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      {!announceClosed && (
        <div className="bg-[#1A9248] text-white text-center text-xs font-semibold tracking-wide relative">
          <div className="flex items-center justify-center gap-2 py-2 px-8">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Free Shipping on Orders Over $75 &bull; Lab-Tested &bull; Farm to Shelf</span>
          </div>
          <button onClick={() => setAnnounceClosed(true)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors" aria-label="Close">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-500 ${scrolled ? "shadow-lg shadow-black/5" : "shadow-sm"}`}>
        <div className={`max-w-[1320px] mx-auto px-4 flex items-center justify-between transition-all duration-500 ${scrolled ? "h-[58px]" : "h-[72px]"}`}>

          {/* Left Nav */}
          <nav className="hidden lg:flex items-center gap-8 flex-1">
            <div className="relative">
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className={`group relative flex items-center gap-1.5 font-semibold text-[15px] transition-colors ${shopOpen || isActive("/shop") || isActive("/product-category") ? "text-[#1A9248]" : "text-[#3d2b1f] hover:text-[#1A9248]"}`}
              >
                <span className={`absolute -top-5 left-1/2 -translate-x-1/2 origin-bottom transition-all duration-300 ${shopOpen || isActive("/shop") ? "opacity-100 scale-100 animate-[slover_1s_infinite_alternate]" : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 group-hover:animate-[slover_1s_infinite_alternate]"}`}>
                  {HEMP_LEAF}
                </span>
                Shop Products
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            <NavLink label="FAQs" href="/faqs" isActive={isActive("/faqs")} />
          </nav>

          {/* Center Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex-shrink-0">
            <Image
              src="https://hempandbarrel.com/wp-content/uploads/2023/02/nav-logo.svg"
              alt="Hemp & Barrel"
              width={180} height={50} priority
              className={`w-auto transition-all duration-500 ${scrolled ? "h-[30px]" : "h-[38px]"}`}
            />
          </Link>

          {/* Right Nav */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-end">
            <NavLink label="Contact" href="/contact" isActive={isActive("/contact")} />
            <NavLink label="CBD Blog" href="/blog" isActive={isActive("/blog")} />

            {/* Account */}
            <div className="relative" ref={accountRef}>
              {user ? (
                <>
                  <button onClick={() => setAccountOpen(v => !v)}
                    className="flex items-center gap-2 text-[#3d2b1f] hover:text-[#1A9248] transition-colors">
                    <span className="w-7 h-7 rounded-full bg-[#1A9248] text-white text-[11px] font-bold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-[15px] font-semibold max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-semibold text-[#3d2b1f] truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link href="/my-account" onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#3d2b1f] hover:bg-[#e8f5ee] transition-colors font-medium">
                        <User className="w-4 h-4 text-gray-400" /> My Account
                      </Link>
                      <Link href="/my-account?tab=orders" onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#3d2b1f] hover:bg-[#e8f5ee] transition-colors font-medium border-t border-gray-50">
                        <ClipboardList className="w-4 h-4 text-gray-400" /> My Orders
                      </Link>
                      <button onClick={() => { setAccountOpen(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium border-t border-gray-100">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <NavLink label="My Account" href="/my-account" isActive={isActive("/my-account")} />
              )}
            </div>

            {/* Search */}
            <button aria-label="Search" onClick={() => setSearchOpen(o => !o)}
              className="text-[#3d2b1f] hover:text-[#1A9248] transition-colors p-1 hover:scale-110 duration-200">
              <Search className="w-[22px] h-[22px]" strokeWidth={2} />
            </button>

            {/* Cart with mini preview */}
            <div className="relative" ref={cartRef}
              onMouseEnter={() => setCartHover(true)} onMouseLeave={() => setCartHover(false)}>
              <Link href="/cart" aria-label="Cart" className="relative text-[#3d2b1f] hover:text-[#1A9248] transition-colors p-1 hover:scale-110 duration-200 block">
                <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1A9248] text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center leading-none px-1 animate-bounce-once">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mini cart popup */}
              {cartHover && cartCount > 0 && cart?.items && (
                <div className="absolute right-0 top-full mt-3 w-[300px] bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-[#3d2b1f] uppercase tracking-wider">Cart ({cartCount})</p>
                    <Leaf className="w-3.5 h-3.5 text-[#1A9248]" />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {cart.items.slice(0, 3).map((item: { key: string; quantity: number; product: { name: string; image?: { sourceUrl?: string } } }) => (
                      <div key={item.key} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                          {item.product?.image?.sourceUrl && (
                            <Image src={item.product.image.sourceUrl} alt={item.product.name} fill className="object-contain p-1" sizes="40px" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#3d2b1f] line-clamp-1">{item.product.name}</p>
                          <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/cart" className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1A9248] text-white text-sm font-bold hover:bg-[#148038] transition-colors">
                    View Cart <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-3 ml-auto">
            <button aria-label="Search" onClick={() => setSearchOpen(o => !o)} className="text-[#3d2b1f] p-1">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/cart" className="relative text-[#3d2b1f] p-1">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1A9248] text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" className="text-[#3d2b1f] p-1">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── MEGA MENU ── */}
        {shopOpen && (
          <>
            <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px]" onClick={() => setShopOpen(false)} />
            <div className="absolute top-full left-0 right-0 w-full bg-white border-t-2 border-[#1A9248] shadow-2xl z-40">
              <div className="max-w-[1320px] mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] text-[#1A9248] font-bold uppercase tracking-[0.3em] mb-0.5 flex items-center gap-1.5">
                      <Leaf className="w-3 h-3" /> Browse Categories
                    </p>
                    <h3 className="text-lg font-bold text-[#3d2b1f]">Shop Our Product Range</h3>
                  </div>
                  <Link href="/shop" onClick={() => setShopOpen(false)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#1A9248] hover:bg-[#1A9248] hover:text-white border border-[#1A9248] px-4 py-2 rounded-full transition-all">
                    View All Products <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {CATEGORIES.map((cat) => (
                    <Link key={cat.href} href={cat.href} onClick={() => setShopOpen(false)}
                      className="group relative rounded-xl overflow-hidden block" style={{ aspectRatio: "1/1" }}>
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.label} fill sizes="(max-width:1400px) 20vw, 250px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: cat.gradient }}>{cat.icon}</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent group-hover:from-black/85 transition-all duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="text-white font-bold text-[17px] leading-tight drop-shadow-md block">{cat.label}</span>
                        <span className="text-white/0 group-hover:text-white/80 text-[12px] font-medium transition-all duration-300 flex items-center gap-1 mt-0.5">
                          Shop now <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-[#1A9248] transition-all duration-200" />
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
            <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]" onClick={() => { setSearchOpen(false); setSearchQ(""); }} />
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-40">
              <div className="max-w-[1320px] mx-auto px-4 py-5">
                <form onSubmit={handleSearch} className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input ref={searchInputRef} type="text" value={searchQ}
                    onChange={e => setSearchQ(e.target.value)} placeholder="Search products…"
                    className="flex-1 text-[#2a1008] text-lg outline-none placeholder-gray-300 bg-transparent" />
                  <button type="submit" className="bg-[#1A9248] hover:bg-[#148038] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
                    Search
                  </button>
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQ(""); }}
                    className="text-gray-400 hover:text-[#3d2b1f] transition-colors p-1" aria-label="Close">
                    <X className="w-5 h-5" />
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
              <div>
                <button onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="w-full flex items-center justify-between py-3 text-[#3d2b1f] font-bold text-base border-b border-gray-100">
                  <span className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#1A9248]" /> Shop Products
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileShopOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileShopOpen && (
                  <div className="bg-gray-50 rounded-xl my-2 overflow-hidden border border-gray-100">
                    {CATEGORIES.map((cat) => (
                      <Link key={cat.href} href={cat.href}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#e8f5ee] border-b border-gray-100 last:border-0 transition-colors"
                        onClick={() => { setMobileOpen(false); setMobileShopOpen(false); }}>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                          style={!cat.image ? { background: cat.gradient } : undefined}>
                          {cat.image ? (
                            <Image src={cat.image} alt={cat.label} fill sizes="40px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center scale-50">{cat.icon}</div>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-[#3d2b1f]">{cat.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                      </Link>
                    ))}
                    <Link href="/shop" onClick={() => { setMobileOpen(false); setMobileShopOpen(false); }}
                      className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1A9248] text-white font-bold text-sm">
                      View All Products <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {[
                { label: "FAQs", href: "/faqs" },
                { label: "Contact", href: "/contact" },
                { label: "CBD Blog", href: "/blog" },
              ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between py-3 font-bold text-base border-b border-gray-100 transition-colors ${isActive(item.href) ? "text-[#1A9248]" : "text-[#3d2b1f] hover:text-[#1A9248]"}`}>
                  {item.label}
                  {isActive(item.href) ? <Leaf className="w-4 h-4 text-[#1A9248]" /> : <ArrowRight className="w-4 h-4 text-gray-300" />}
                </Link>
              ))}

              {user ? (
                <div className="border-b border-gray-100 py-2">
                  <div className="flex items-center gap-3 py-3">
                    <span className="w-9 h-9 rounded-full bg-[#1A9248] text-white text-sm font-bold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[#3d2b1f] font-bold text-sm">{user.name}</p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/my-account" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 pl-12 text-sm text-[#3d2b1f] font-medium hover:text-[#1A9248] transition-colors">
                    <User className="w-4 h-4 text-gray-400" /> My Account
                  </Link>
                  <Link href="/my-account?tab=orders" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 pl-12 text-sm text-[#3d2b1f] font-medium hover:text-[#1A9248] transition-colors">
                    <ClipboardList className="w-4 h-4 text-gray-400" /> My Orders
                  </Link>
                  <button onClick={() => { setMobileOpen(false); logout(); }}
                    className="flex items-center gap-2.5 py-2.5 pl-12 text-sm text-red-500 font-medium w-full">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/my-account" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-3 text-[#3d2b1f] font-bold text-base border-b border-gray-100 hover:text-[#1A9248] transition-colors">
                  My Account <User className="w-4 h-4 text-gray-300" />
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
