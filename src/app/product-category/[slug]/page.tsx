import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategorySidebar, CategorySortBar, CategoryMobileBar } from "./CategoryFilters";
import AddToCartButton from "@/app/shop/AddToCartButton";
import FaqSection from "@/components/ui/FaqSection";
import { CATEGORY_FAQS } from "@/lib/category-faqs";

export const dynamic = "force-dynamic";

const WC      = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/store/v1`;
const PER_PAGE = 12;

/* ── Types ── */
interface WCProduct {
  id:             number;
  name:           string;
  slug:           string;
  prices: {
    price:               string;
    regular_price:       string;
    currency_symbol:     string;
    currency_minor_unit: number;
  };
  images:         Array<{ src: string; alt: string }>;
  categories:     Array<{ id: number; name: string; slug: string }>;
  on_sale:        boolean;
  is_in_stock:    boolean;
  average_rating: string;
  review_count:   number;
  has_options:    boolean;
}
interface WCCategory { id: number; name: string; slug: string; count: number; description: string; image: { src: string; alt: string } | null }

/* ── Fetchers ── */
async function fetchCategory(slug: string): Promise<WCCategory | null> {
  const res = await fetch(`${WC}/products/categories?per_page=100`, { cache: "no-store" });
  if (!res.ok) return null;
  const data: WCCategory[] = await res.json();
  return data.find(c => c.slug === slug) ?? null;
}

async function fetchProducts(params: URLSearchParams): Promise<{ products: WCProduct[]; total: number; pages: number }> {
  const res = await fetch(`${WC}/products?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) return { products: [], total: 0, pages: 1 };
  const products: WCProduct[] = await res.json();
  const total = parseInt(res.headers.get("X-WP-Total") ?? "0");
  const pages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1");
  return { products, total, pages };
}

/* ── Metadata ── */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await fetchCategory(slug);
  if (!cat) return { title: "Category Not Found | Hemp & Barrel" };
  return {
    title: `${cat.name} | Hemp & Barrel`,
    description: cat.description
      ? cat.description.replace(/<[^>]+>/g, "").slice(0, 160)
      : `Shop ${cat.name} — lab-tested hemp & CBD products at Hemp & Barrel.`,
    openGraph: {
      title: `${cat.name} | Hemp & Barrel`,
      url:   `https://hempandbarrel.com/product-category/${slug}`,
      ...(cat.image ? { images: [{ url: cat.image.src, alt: cat.image.alt }] } : {}),
    },
    alternates: { canonical: `https://hempandbarrel.com/product-category/${slug}` },
  };
}

/* ── Helpers ── */
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
    return `?${next.toString()}`;
  };
  return (
    <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
      {current > 1 && (
        <Link href={href(current - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[#3d2b1f] hover:bg-[#f5f0eb] hover:border-[#1A9248] transition-all">
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
                  ? "bg-[#1A9248] text-white shadow-md shadow-[#1A9248]/30"
                  : "border border-gray-200 text-[#3d2b1f] hover:bg-[#f5f0eb] hover:border-[#1A9248]"
              }`}>{p}</Link>
      )}
      {current < total && (
        <Link href={href(current + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[#3d2b1f] hover:bg-[#f5f0eb] hover:border-[#1A9248] transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      )}
    </div>
  );
}

/* ── Page ── */
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { slug } = await params;
  const sp       = await searchParams;
  const page     = Math.max(1, parseInt(sp.page    ?? "1"));
  const orderby  = sp.orderby ?? "menu_order";
  const order    = sp.order   ?? "asc";
  const search   = sp.search  ?? "";

  const [category] = await Promise.all([fetchCategory(slug)]);
  if (!category) notFound();

  const apiParams = new URLSearchParams({
    category: slug,
    per_page: String(PER_PAGE),
    page:     String(page),
    orderby,
    order,
  });
  if (search) apiParams.set("search", search);

  const { products, total, pages } = await fetchProducts(apiParams);
  const categoryFaqs = CATEGORY_FAQS[slug] ?? [];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#2a1008] overflow-hidden">
        {category.image && (
          <Image src={category.image.src} alt={category.image.alt || category.name}
            fill className="object-cover opacity-20" sizes="100vw" priority/>
        )}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #1A9248 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute -right-32 top-0 w-[500px] h-[500px] bg-[#1A9248]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1320px] mx-auto px-4 py-14 md:py-18">
          <nav className="flex items-center gap-2 text-white/40 text-sm mb-5 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white/60">{category.name}</span>
          </nav>
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-2">
            {search ? `Search: "${search}"` : category.name}
          </h1>
          <p className="text-white/40 text-sm">
            {total > 0 ? `${total} product${total !== 1 ? "s" : ""}` : "No products found"}
            {!search && ` in ${category.name}`}
          </p>
        </div>
      </section>

      {/* ── Main ── */}
      <div className="max-w-[1320px] mx-auto px-4 py-10">
        <Suspense fallback={null}>
          <CategoryMobileBar />
        </Suspense>

        <div className="flex gap-8 items-stretch">
          <Suspense fallback={null}>
            <CategorySidebar />
          </Suspense>

          <div className="flex-1 min-w-0">
            <Suspense fallback={null}>
              <CategorySortBar total={total} shown={products.length} />
            </Suspense>

            {products.length === 0 ? (
              <div className="py-32 text-center">
                <p className="text-xl text-gray-300 font-bold">No products found.</p>
                <Link href="/shop" className="mt-4 inline-block text-[#1A9248] font-bold hover:underline text-sm">
                  View all products →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((p) => {
                  const sym     = p.prices.currency_symbol;
                  const unit    = p.prices.currency_minor_unit;
                  const price   = fmt(p.prices.price, unit, sym);
                  const regular = fmt(p.prices.regular_price, unit, sym);
                  const inStock       = p.is_in_stock;
                  const isInStoreOnly = !inStock && p.categories.some(c => c.slug === "vapes");
                  const img     = p.images[0];

                  return (
                    <div key={p.id}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                      <div className="relative aspect-square bg-[#f8f6f3] overflow-hidden">
                        {img
                          ? <Image src={img.src} alt={img.alt || p.name} fill
                              sizes="(max-width:640px) 50vw, (max-width:1280px) 33vw, 280px"
                              className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"/>
                          : <div className="w-full h-full bg-gradient-to-br from-[#3d2b1f] to-[#1A9248]/40"/>
                        }
                        <Link href={`/product/${p.slug}`} className="absolute inset-0" aria-label={p.name}/>
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {p.on_sale && (
                            <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Sale</span>
                          )}
                          {!inStock && (
                            <span className={`text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isInStoreOnly ? "bg-amber-600/90" : "bg-gray-800/80"
                            }`}>
                              {isInStoreOnly ? "In-Store Only" : "Sold Out"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <Link href={`/product/${p.slug}`}
                          className="text-[#2a1008] font-bold text-sm leading-snug mb-1 group-hover:text-[#1A9248] transition-colors line-clamp-2 flex-1">
                          {p.name}
                        </Link>
                        <StarRating rating={p.average_rating} count={p.review_count} />
                        <div className="flex items-baseline gap-2 mt-2 mb-3">
                          <span className="text-[#2a1008] font-bold text-base">{price}</span>
                          {p.on_sale && price !== regular && (
                            <span className="text-gray-400 text-xs line-through">{regular}</span>
                          )}
                        </div>
                        {p.has_options
                          ? <Link href={`/product/${p.slug}`}
                              className="w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#3d2b1f] hover:bg-[#2a1008] text-white text-center transition-colors">
                              Select Options
                            </Link>
                          : <AddToCartButton productId={p.id} inStock={inStock} isInStoreOnly={isInStoreOnly} />
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Pagination current={page} total={pages} params={apiParams} />
          </div>
        </div>
      </div>

      {/* ── Category FAQs ── */}
      {categoryFaqs.length > 0 && (
        <section className="bg-[#fafaf8] border-t border-gray-100">
          <div className="max-w-[1320px] mx-auto px-4 py-14">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-[10px] font-bold text-[#1A9248] uppercase tracking-[0.3em]">Common Questions</span>
                <h2 className="text-2xl font-bold text-[#2a1008] mt-2">FAQs About {category.name}</h2>
              </div>
              <FaqSection faqs={categoryFaqs} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
