import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FlaskConical, ShieldCheck, BadgeCheck } from "lucide-react";
import ProductGallery from "./ProductGallery";
import ProductForm from "./ProductForm";
import ProductAccordion from "./ProductAccordion";
import WriteReview from "./WriteReview";
import { CATEGORY_FAQS } from "@/lib/category-faqs";
import FaqAccordionItem from "./FaqAccordionItem";
import ShortDescription from "./ShortDescription";

const WC = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/store/v1`;

/* ── Types ── */
interface WCProduct {
  id:                number;
  name:              string;
  slug:              string;
  sku:               string;
  description:       string;
  short_description: string;
  permalink:         string;
  prices: {
    price:               string;
    regular_price:       string;
    sale_price:          string;
    currency_symbol:     string;
    currency_minor_unit: number;
    price_range:         null | { min_amount: string; max_amount: string };
  };
  images:      Array<{ src: string; alt: string }>;
  categories:  Array<{ id: number; name: string; slug: string }>;
  on_sale:     boolean;
  is_in_stock: boolean;
  has_options: boolean;
  variations:  number[];
  attributes:  Array<{
    id:             number;
    name:           string;
    taxonomy:       string;
    has_variations: boolean;
    terms:          Array<{ id: number; name: string; slug: string }>;
  }>;
  average_rating: string;
  review_count:   number;
  tags: Array<{ id: number; name: string; slug: string }>;
}

interface Variation {
  id:          number;
  attributes:  Array<{ name: string; value: string }>;
  prices: {
    price:               string;
    regular_price:       string;
    currency_symbol:     string;
    currency_minor_unit: number;
  };
  is_in_stock: boolean;
  image:       { src: string; alt: string } | null;
}

interface Review {
  id:          number;
  author_name: string;
  date_gmt:    string;
  content:     { rendered: string };
  meta:        { rating?: number; verified?: number };
}

/* ── Fetchers ── */
async function fetchProduct(slug: string): Promise<WCProduct | null> {
  const res = await fetch(`${WC}/products?slug=${slug}&per_page=1`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const data: WCProduct[] = await res.json();
  return data[0] ?? null;
}

async function fetchVariations(productId: number): Promise<Variation[]> {
  const res = await fetch(`${WC}/products/${productId}/variations?per_page=100`, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  return res.json();
}

async function fetchRelated(categorySlug: string, excludeId: number): Promise<WCProduct[]> {
  const res = await fetch(
    `${WC}/products?category=${categorySlug}&per_page=8&orderby=menu_order&order=asc`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data: WCProduct[] = await res.json();
  return data.filter(p => p.id !== excludeId).slice(0, 4);
}

async function fetchReviews(productId: number): Promise<Review[]> {
  const WP = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";
  try {
    const res = await fetch(
      `${WP}/wp-json/hemp/v1/reviews?product_id=${productId}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

/* ── Metadata ── */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product  = await fetchProduct(slug);
  if (!product) return { title: "Product Not Found | Hemp & Barrel" };

  const desc = product.short_description
    ? product.short_description.replace(/<[^>]+>/g, "").slice(0, 160)
    : `Buy ${product.name} at Hemp & Barrel — lab-tested hemp & CBD products.`;

  const unit = product.prices.currency_minor_unit;
  const sym  = decodeSym(product.prices.currency_symbol);
  const price = `${sym}${(parseInt(product.prices.price) / Math.pow(10, unit)).toFixed(2)}`;

  return {
    title:       `${product.name} | Hemp & Barrel`,
    description: desc,
    openGraph: {
      title:       product.name,
      description: desc,
      url:         `https://hempandbarrel.com/product/${slug}`,
      images:      product.images[0] ? [{ url: product.images[0].src, alt: product.images[0].alt || product.name }] : [],
    },
    alternates: { canonical: `https://hempandbarrel.com/product/${slug}` },
    other: {
      "product:price:amount":   price,
      "product:price:currency": "USD",
    },
  };
}

/* ── Helpers ── */
function decodeSym(sym: string) {
  return sym.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}
function fmt(minor: string, unit: number, sym: string) {
  return `${decodeSym(sym)}${(parseInt(minor) / Math.pow(10, unit)).toFixed(2)}`;
}

function StarsFull({ rating, count }: { rating: string; count: number }) {
  const r = parseFloat(rating);
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-4 h-4 ${i <= Math.round(r) ? "text-amber-400" : "text-gray-200"}`}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      {count > 0 && <span className="text-gray-400 text-[16px]">({count} review{count !== 1 ? "s" : ""})</span>}
    </div>
  );
}

/* ── Page ── */
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product  = await fetchProduct(slug);
  if (!product) notFound();

  const unit    = product.prices.currency_minor_unit;
  const sym     = product.prices.currency_symbol;
  const price   = fmt(product.prices.price, unit, sym);
  const regular = fmt(product.prices.regular_price, unit, sym);

  const primaryCat = product.categories[0];
  const categoryFaqs = primaryCat ? (CATEGORY_FAQS[primaryCat.slug] ?? []) : [];

  const [variations, related, reviews] = await Promise.all([
    product.has_options ? fetchVariations(product.id) : Promise.resolve([]),
    primaryCat ? fetchRelated(primaryCat.slug, product.id) : Promise.resolve([]),
    fetchReviews(product.id),
  ]);

  /* Price display: range for variable products */
  const priceDisplay = product.prices.price_range
    ? `${sym}${(parseInt(product.prices.price_range.min_amount) / Math.pow(10, unit)).toFixed(2)} – ${sym}${(parseInt(product.prices.price_range.max_amount) / Math.pow(10, unit)).toFixed(2)}`
    : price;

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="bg-[#fafaf8] border-b border-gray-100">
        <div className="max-w-[1320px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-[16px] text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-[#1A9248] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#1A9248] transition-colors">Shop</Link>
            {primaryCat && (
              <>
                <span>/</span>
                <Link href={`/product-category/${primaryCat.slug}`}
                  className="hover:text-[#1A9248] transition-colors">{primaryCat.name}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#3d2b1f] font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Product section ── */}
      <section className="max-w-[1320px] mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info — buy box card */}
          <div className="lg:sticky lg:top-24 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-7 space-y-6">
            {/* Category badge */}
            {primaryCat && (
              <Link href={`/product-category/${primaryCat.slug}`}
                className="text-[13px] font-bold uppercase tracking-[0.3em] text-[#1A9248] hover:underline">
                {primaryCat.name}
              </Link>
            )}

            <h1 className="text-[#2a1008] text-[32px] font-bold leading-tight">{product.name}</h1>

            {/* Rating + Write a Review */}
            <div className="flex items-center gap-4 flex-wrap">
              {product.review_count > 0 && (
                <StarsFull rating={product.average_rating} count={product.review_count} />
              )}
              <a href="#reviews" className="text-[#1A9248] text-[14px] font-bold hover:underline flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Write a Review
              </a>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-[#2a1008] text-3xl font-bold">{priceDisplay}</span>
              {product.on_sale && price !== regular && !product.prices.price_range && (
                <span className="text-gray-400 text-[18px] line-through">{regular}</span>
              )}
              {product.on_sale && (
                <span className="bg-red-100 text-red-600 text-[14px] font-bold px-2 py-0.5 rounded-full">Sale</span>
              )}
            </div>

            {/* Short description */}
            {product.short_description && (
              <ShortDescription html={product.short_description} />
            )}

            {/* Form: qty + options + add to cart */}
            <div className="border-t border-gray-100 pt-4">
              <ProductForm
                productId={product.id}
                productName={product.name}
                hasOptions={product.has_options}
                isInStock={product.is_in_stock}
                isInStoreOnly={!product.is_in_stock && product.categories.some(c => c.slug === "vapes")}
                attributes={product.attributes}
                variations={variations}
              />
            </div>

            {/* Meta */}
            {product.sku && (
              <div className="border-t border-gray-100 pt-4 text-[14px] text-gray-400">
                <p className="text-[16.5px]">SKU: <span className="text-[#3d2b1f] font-medium">{product.sku}</span></p>
              </div>
            )}

            {/* Trust badges */}
            <div className="bg-[#f8f6f3] rounded-2xl p-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Third-party lab tested", icon: FlaskConical },
                  { label: "≤0.3% Delta-9 compliant", icon: ShieldCheck },
                  { label: "Certificate of analysis available", icon: BadgeCheck },
                ].map(b => (
                  <div key={b.label} className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1A9248]/10 flex items-center justify-center">
                      <b.icon className="w-4 h-4 text-[#1A9248]" strokeWidth={1.8} />
                    </div>
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#3d2b1f]">{b.label}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-3 text-center">
                <Link href="/lab-reports" className="text-[#1A9248] text-[13px] font-bold hover:underline">
                  See lab reports →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Accordion Details ── */}
      <section className="border-t border-gray-100">
        <div className="max-w-[1320px] mx-auto px-4 py-10">
          <ProductAccordion
            description={product.description}
            attributes={product.attributes}
            reviewCount={reviews.length}
            avgRating={product.average_rating}
          />
        </div>
      </section>

      {/* ── Customer Reviews ── */}
      <section id="reviews" className="border-t border-gray-100 scroll-mt-24">
        <div className="max-w-[1320px] mx-auto px-4 py-12">
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-baseline gap-3">
              <h2 className="text-[#2a1008] text-[38px] font-bold">Customer Reviews</h2>
              {reviews.length > 0 && (
                <span className="text-gray-400 text-[16px]">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
              )}
            </div>
            <WriteReview productId={product.id} productName={product.name} />
          </div>

          {reviews.length > 0 && (
            <div className="bg-[#fafaf8] border border-gray-100 rounded-2xl p-6 mb-8 max-w-xl space-y-2">
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => Math.round(Number(r.meta?.rating ?? 0)) === star).length;
                const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-[14px] font-semibold text-[#3d2b1f] w-10 flex-shrink-0">{star} ★</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[14px] text-gray-400 w-8 flex-shrink-0 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="bg-[#fafaf8] rounded-2xl p-8 text-center max-w-sm">
              <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <p className="text-[#3d2b1f] font-bold text-[16.5px] mb-1">No reviews yet</p>
              <p className="text-gray-400 text-[16.5px]">Be the first to share your experience with this product.</p>
            </div>
          ) : (
            <div className="space-y-5 max-w-3xl">
              {reviews.map(r => {
                const rating   = Number(r.meta?.rating ?? 0);
                const verified = Boolean(r.meta?.verified);
                const date     = new Date(r.date_gmt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                });
                return (
                  <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1A9248]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#1A9248] font-bold text-[16px]">{r.author_name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-[#2a1008] text-[16.5px]">{r.author_name}</p>
                          <p className="text-gray-400 text-[16.5px]">{date}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex">
                          {[1,2,3,4,5].map(i => (
                            <svg key={i} className={`w-4 h-4 ${i <= rating ? "text-amber-400" : "text-gray-200"}`}
                              fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                        {verified && (
                          <span className="text-[12px] text-[#1A9248] font-bold uppercase tracking-wider flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-[#3d2b1f] text-[16px] leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
                      dangerouslySetInnerHTML={{ __html: r.content.rendered }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQs ── */}
      {categoryFaqs.length > 0 && (
        <section className="border-t border-gray-100 bg-[#fafaf8]">
          <div className="max-w-[900px] mx-auto px-4 py-12">
            <h2 className="text-[#2a1008] text-[38px] font-bold text-center mb-8">FAQs</h2>
            <div className="space-y-3">
              {categoryFaqs.map(faq => (
                <FaqAccordionItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related products ── */}
      {related.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-4 py-12">
          <h2 className="text-[#2a1008] text-[38px] font-bold mb-6">Related Products</h2>
          <div className="flex flex-wrap justify-center gap-5">
            {related.map(p => {
              const rPrice   = fmt(p.prices.price, p.prices.currency_minor_unit, p.prices.currency_symbol);
              const rRegular = fmt(p.prices.regular_price, p.prices.currency_minor_unit, p.prices.currency_symbol);
              const img      = p.images[0];
              return (
                <Link key={p.id} href={`/product/${p.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 basis-[calc(50%-10px)] md:basis-[calc(25%-15px)] flex-shrink-0">
                  <div className="relative aspect-square bg-[#f8f6f3] overflow-hidden">
                    {img
                      ? <Image src={img.src} alt={img.alt || p.name} fill
                          sizes="(max-width:640px) 50vw, 25vw"
                          className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"/>
                      : <div className="w-full h-full bg-gradient-to-br from-[#3d2b1f] to-[#1A9248]/40"/>
                    }
                    {p.on_sale && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[12px] font-bold uppercase px-2 py-0.5 rounded-full">Sale</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[#2a1008] font-bold text-[16.5px] leading-snug mb-1 line-clamp-2 group-hover:text-[#1A9248] transition-colors">{p.name}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[#2a1008] font-bold text-[16px]">{rPrice}</span>
                      {p.on_sale && rPrice !== rRegular && (
                        <span className="text-gray-400 text-[14px] line-through">{rRegular}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
