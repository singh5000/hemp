import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ShopSidebar, ShopSortBar, ShopMobileBar, Brand } from "./ShopFilters";
import AddToCartButton from "./AddToCartButton";

export const metadata: Metadata = {
  title: "Shop CBD & Hemp Products | Hemp & Barrel",
  description:
    "Browse Hemp & Barrel's full range of lab-tested CBD and hemp products — flower, edibles, tinctures, vapes, beverages, pouches, topicals, and pet products.",
};

const WC      = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/store/v1`;
const WP_URL  = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";
const PER_PAGE = 12;

/* ─── Types ─── */
interface WCProduct {
  id:                number;
  name:              string;
  slug:              string;
  prices: {
    price:                string;
    regular_price:        string;
    sale_price:           string;
    currency_symbol:      string;
    currency_minor_unit:  number;
  };
  images:         Array<{ src: string; alt: string }>;
  categories:     Array<{ id: number; name: string; slug: string }>;
  on_sale:        boolean;
  is_in_stock:    boolean;
  average_rating: string;
  review_count:   number;
  has_options:    boolean;
}
interface WCCategory { id: number; name: string; slug: string; count: number }

/* ─── Fetchers ─── */
async function fetchProducts(params: URLSearchParams): Promise<{ products: WCProduct[]; total: number; pages: number }> {
  const url = `${WC}/products?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { products: [], total: 0, pages: 1 };
  const products: WCProduct[] = await res.json();
  const total = parseInt(res.headers.get("X-WP-Total") ?? "0");
  const pages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1");
  return { products, total, pages };
}

async function fetchCategories(): Promise<WCCategory[]> {
  const res = await fetch(`${WC}/products/categories?per_page=50&hide_empty=true`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const all: WCCategory[] = await res.json();
  return all.filter(c => c.slug !== "uncategorized").sort((a, b) => b.count - a.count);
}

async function fetchBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/hemp/v1/brands`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function fetchBrandProducts(params: URLSearchParams): Promise<{ products: WCProduct[]; total: number; pages: number }> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/hemp/v1/products?${params.toString()}`, { next: { revalidate: 300 } });
    if (!res.ok) return { products: [], total: 0, pages: 1 };
    const products: WCProduct[] = await res.json();
    const total = parseInt(res.headers.get("X-WP-Total") ?? "0");
    const pages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1");
    return { products, total, pages };
  } catch { return { products: [], total: 0, pages: 1 }; }
}

/* ─── Helpers ─── */
function fmt(minor: string, unit: number, sym: string) {
  return `${sym}${(parseInt(minor) / Math.pow(10, unit)).toFixed(2)}`;
}

function StarRating({ rating, count }: { rating: string; count: number }) {
  const r = parseFloat(rating);
  if (!count) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-3 h-3 ${i <= Math.round(r) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <span className="text-gray-400 text-[10px]">({count})</span>
    </div>
  );
}

function Pagination({ current, total, params }: { current: number; total: number; params: URLSearchParams }) {
  if (total <= 1) return null;
  const pages: (number | "…")[] = [];
  if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); }
  else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("…");
    pages.push(total);
  }

  const href = (p: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(p));
    return `/shop?${next.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
      {current > 1 && (
        <Link href={href(current - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[#3d2b1f] hover:bg-[#f5f0eb] hover:border-[#5a8c3a] transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </Link>
      )}
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e${i}`} className="px-2 text-gray-400 text-sm">…</span>
          : <Link key={p} href={href(p)}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                p === current
                  ? "bg-[#5a8c3a] text-white shadow-md shadow-[#5a8c3a]/30"
                  : "border border-gray-200 text-[#3d2b1f] hover:bg-[#f5f0eb] hover:border-[#5a8c3a]"
              }`}>{p}</Link>
      )}
      {current < total && (
        <Link href={href(current + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[#3d2b1f] hover:bg-[#f5f0eb] hover:border-[#5a8c3a] transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      )}
    </div>
  );
}

/* ─── Page ─── */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp       = await searchParams;
  const page     = Math.max(1, parseInt(sp.page ?? "1"));
  const category = sp.category ?? "";
  const orderby  = sp.orderby  ?? "menu_order";
  const order    = sp.order    ?? "asc";
  const search   = sp.search   ?? "";
  const brand    = sp.brand    ?? "";
  const instock  = sp.instock  === "1";

  const apiParams = new URLSearchParams({
    per_page: String(PER_PAGE),
    page:     String(page),
    orderby,
    order,
  });
  if (category) apiParams.set("category", category);
  if (search)   apiParams.set("search", search);
  if (brand)    apiParams.set("brand", brand);
  if (instock)  apiParams.set("stock_status", "instock");

  // Separate params for pagination URLs — preserves instock/category/brand as URL params
  // so the toggle and filters survive page navigation
  const paginationParams = new URLSearchParams(sp as Record<string, string>);
  paginationParams.delete("page");

  const [{ products, total, pages }, categories, brands] = await Promise.all([
    brand ? fetchBrandProducts(apiParams) : fetchProducts(apiParams),
    fetchCategories(),
    fetchBrands(),
  ]);

  const activeCategory  = categories.find(c => c.slug === category);
  const activeBrandData = brands.find(b => b.slug === brand);

  return (
    <>
      {/* ── Hero banner ── */}
      <section className="relative bg-[#2a1008] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #5a8c3a 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute -right-32 top-0 w-[500px] h-[500px] bg-[#5a8c3a]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative w-full mx-auto px-10 py-14 md:py-18">
          <nav className="flex items-center gap-2 text-white/40 text-sm mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            {activeBrandData
              ? <><Link href="/shop" className="hover:text-white transition-colors">Shop</Link><span>/</span><span className="text-white/60">{activeBrandData.name}</span></>
              : activeCategory
              ? <><Link href="/shop" className="hover:text-white transition-colors">Shop</Link><span>/</span><span className="text-white/60">{activeCategory.name}</span></>
              : <span className="text-white/60">Shop</span>
            }
          </nav>
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-2">
            {search
              ? `Search: "${search}"`
              : activeBrandData
              ? activeBrandData.name
              : activeCategory
              ? activeCategory.name
              : "All Products"}
          </h1>
          <p className="text-white/40 text-sm">
            {total > 0 ? `${total} product${total !== 1 ? "s" : ""}` : "No products found"}
            {activeBrandData && !search ? ` from ${activeBrandData.name}` : activeCategory && !search ? ` in ${activeCategory.name}` : ""}
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="w-full mx-auto px-10 py-10">

        {/* Mobile: filter + sort bar (above the flex) */}
        <Suspense fallback={null}>
          <ShopMobileBar categories={categories} brands={brands} />
        </Suspense>

        <div className="flex gap-8 items-stretch">

          {/* Desktop sidebar */}
          <Suspense fallback={null}>
            <ShopSidebar categories={categories} brands={brands} />
          </Suspense>

          {/* Product grid */}
          <div className="flex-1 min-w-0">

            {/* Desktop sort + count bar */}
            <Suspense fallback={null}>
              <ShopSortBar total={total} shown={products.length} />
            </Suspense>

            {products.length === 0 ? (
              <div className="py-32 text-center">
                <p className="text-xl text-gray-300 font-bold">No products found.</p>
                <Link href="/shop" className="mt-4 inline-block text-[#5a8c3a] font-bold hover:underline text-sm">
                  View all products →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((p) => {
                  const sym  = p.prices.currency_symbol;
                  const unit = p.prices.currency_minor_unit;
                  const price    = fmt(p.prices.price, unit, sym);
                  const regular  = fmt(p.prices.regular_price, unit, sym);
                  const inStock  = p.is_in_stock;
                  const img      = p.images[0];
                  const cat      = p.categories[0];

                  return (
                    <div key={p.id}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">

                      {/* Image */}
                      <div className="relative aspect-square bg-[#f8f6f3] overflow-hidden">
                        {img
                          ? <Image src={img.src} alt={img.alt || p.name} fill
                              sizes="(max-width:640px) 50vw, (max-width:1280px) 33vw, 280px"
                              className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"/>
                          : <div className="w-full h-full bg-gradient-to-br from-[#3d2b1f] to-[#5a8c3a]/40"/>
                        }
                        <Link href={`/product/${p.slug}`} className="absolute inset-0" aria-label={p.name}/>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {p.on_sale && (
                            <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Sale</span>
                          )}
                          {!inStock && (
                            <span className="bg-gray-800/80 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Sold Out</span>
                          )}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex flex-col flex-1">
                        {cat && (
                          <Link href={`/product-category/${cat.slug}`}
                            className="text-[10px] font-bold uppercase tracking-wider text-[#5a8c3a] hover:underline mb-1">
                            {cat.name}
                          </Link>
                        )}

                        <Link href={`/product/${p.slug}`}
                          className="text-[#2a1008] font-bold text-sm leading-snug mb-1 group-hover:text-[#5a8c3a] transition-colors line-clamp-2 flex-1">
                          {p.name}
                        </Link>

                        <StarRating rating={p.average_rating} count={p.review_count} />

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mt-2 mb-3">
                          <span className="text-[#2a1008] font-bold text-base">{price}</span>
                          {p.on_sale && price !== regular && (
                            <span className="text-gray-400 text-xs line-through">{regular}</span>
                          )}
                        </div>

                        <AddToCartButton productId={p.id} inStock={inStock} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Pagination current={page} total={pages} params={paginationParams} />
          </div>
        </div>
      </div>

      {/* ── Info sections ── */}
      <section className="bg-[#fafaf8] border-t border-gray-100 py-16">
        <div className="w-full mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                tag:   "Education",
                title: "CBD 101",
                body:  "CBD (cannabidiol) is a naturally occurring compound found in the hemp plant. Non-psychoactive and federally legal, CBD supports relaxation, sleep, and overall wellness. All our products contain ≤ 0.3% Delta-9 THC and are third-party lab tested.",
                href:  "/product-category/edibles-gummies",
                cta:   "Shop All CBD",
              },
              {
                tag:   "Education",
                title: "Delta 8 THC",
                body:  "Delta 8 THC is a minor cannabinoid derived from hemp that produces mild psychoactive effects — often described as a smoother, clearer experience than Delta 9. All Delta 8 products are derived from compliant hemp and accompanied by a COA.",
                href:  "/product-category/smokable-hemp-flower",
                cta:   "Shop Hemp Flower",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <p className="text-[#5a8c3a] text-[11px] font-bold uppercase tracking-[0.3em] mb-2">{item.tag}</p>
                <h3 className="text-[#2a1008] text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.body}</p>
                <Link href={item.href}
                  className="inline-flex items-center gap-2 bg-[#2a1008] hover:bg-[#3d2b1f] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-colors">
                  {item.cta}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
