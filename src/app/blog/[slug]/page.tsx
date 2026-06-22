import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/layout/NewsletterForm";
import TableOfContents from "./TableOfContents";

/* ─── Types ─── */
interface WPPost {
  id: number;
  title:    { rendered: string };
  content:  { rendered: string };
  excerpt:  { rendered: string };
  slug:     string;
  date:     string;
  modified: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text: string }>;
    "wp:term"?:          Array<Array<{ name: string; slug: string; id: number }>>;
  };
}
interface Heading { id: string; text: string; level: number }

/* ─── Fetchers ─── */
async function getPost(slug: string): Promise<WPPost | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed=1`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data[0] ?? null;
}

async function getRelated(catId: number, excludeId: number): Promise<WPPost[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?categories=${catId}&exclude=${excludeId}&per_page=3&_embed=1`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  return res.json();
}

/* ─── Helpers ─── */
const strip   = (h: string) => h.replace(/<[^>]+>/g,"").replace(/\[[^\]]*\]/g,"").replace(/&[a-z#\d]+;/gi," ").replace(/\s+/g," ").trim();
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
const readTime = (h: string) => Math.max(1, Math.ceil(h.replace(/<[^>]+>/g,"").split(/\s+/).length / 220));
const getImg   = (p: WPPost) => p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
const getCat   = (p: WPPost) => p._embedded?.["wp:term"]?.[0]?.[0] ?? null;

const CAT_STYLES: Record<string,string> = {
  "THC":"bg-purple-100 text-purple-700",
  "CBD Products":"bg-emerald-100 text-emerald-700",
  "CBD Beverages":"bg-sky-100 text-sky-700",
  "Hemp Flower":"bg-amber-100 text-amber-700",
};
const catCls = (n: string) => CAT_STYLES[n] ?? "bg-[#5a8c3a]/10 text-[#5a8c3a]";

/* inject IDs into headings so TOC anchors work */
function injectIds(html: string): string {
  const seen = new Map<string, number>();
  return html.replace(/<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_m, lvl, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g,"").trim();
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    const count = seen.get(id) ?? 0;
    if (count) id = `${id}-${count}`;
    seen.set(id, count + 1);
    return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
  });
}

function extractTOC(html: string): Heading[] {
  const out: Heading[] = [];
  const seen = new Map<string, number>();
  const re = /<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g,"").trim();
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    const count = seen.get(id) ?? 0;
    if (count) id = `${id}-${count}`;
    seen.set(id, count + 1);
    out.push({ id, text, level: parseInt(m[1]) });
  }
  return out;
}

/* ─── Metadata ─── */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found | Hemp & Barrel" };
  const title   = strip(post.title.rendered);
  const excerpt = strip(post.excerpt.rendered).slice(0,160);
  const image   = getImg(post);
  return {
    title: `${title} | Hemp & Barrel`,
    description: excerpt,
    openGraph: {
      title, description: excerpt, type:"article",
      publishedTime: post.date, modifiedTime: post.modified,
      ...(image && { images:[{ url:image, width:1200, height:630 }] }),
    },
  };
}

/* ─── Page ─── */
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const cat      = getCat(post);
  const image    = getImg(post);
  const mins     = readTime(post.content.rendered);
  const related  = cat ? await getRelated(cat.id, post.id) : [];
  const toc      = extractTOC(post.content.rendered);
  const content  = injectIds(post.content.rendered);
  const lead     = strip(post.excerpt.rendered).replace(/\s*Read more\.?\s*$/i,"");

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO — full-width, image bg + dark overlay
      ══════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "420px" }}>
        {/* background image */}
        {image ? (
          <Image src={image} alt={strip(post.title.rendered)} fill
            sizes="100vw" className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a1008] to-[#5a8c3a]/30" />
        )}

        {/* overlay — stronger at bottom so text is readable */}
        <div className="absolute inset-0"
          style={{ background:"linear-gradient(to bottom, rgba(20,10,5,0.55) 0%, rgba(20,10,5,0.82) 60%, rgba(20,10,5,0.97) 100%)" }} />

        {/* hero content */}
        <div className="relative z-10 w-full mx-auto px-[70px] flex flex-col justify-end pb-12 pt-10"
          style={{ minHeight:"420px" }}>

          {/* breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">CBD Blog</Link>
            {cat && <><span>/</span><span className="text-white/70">{cat.name}</span></>}
          </nav>

          {/* meta pills */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {cat && (
              <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${catCls(cat.name)}`}>
                {cat.name}
              </span>
            )}
            <span className="text-white/50 text-xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {fmtDate(post.date)}
            </span>
            <span className="text-white/50 text-xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {mins} min read
            </span>
          </div>

          {/* title */}
          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight max-w-[820px]">
            {strip(post.title.rendered)}
          </h1>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT AREA — max-w-[1400px]
      ══════════════════════════════════════════ */}
      <div className="w-full mx-auto px-[70px] py-12">
        <div className="flex gap-10 items-start">

          {/* ── LEFT: Article ── */}
          <div className="flex-1 min-w-0">

            {/* Lead / excerpt */}
            {lead && (
              <p className="text-[#3d2b1f]/80 text-lg leading-relaxed border-l-4 border-[#5a8c3a] pl-5 mb-10 bg-[#f5f0eb] py-4 pr-4 rounded-r-xl">
                {lead}
              </p>
            )}

            {/* Article content */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* ── Bottom: share + back ── */}
            <div className="mt-14 pt-8 border-t-2 border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <Link href="/blog"
                className="inline-flex items-center gap-2 text-[#5a8c3a] font-bold text-sm hover:underline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                Back to Blog
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 font-medium">Share this article:</span>
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://hempandbarrel.com/blog/${post.slug}`}
                  target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"
                  className="w-10 h-10 bg-[#1877f2] hover:bg-[#1464c8] rounded-full flex items-center justify-center transition-all hover:scale-105">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </Link>
                <Link
                  href={`https://twitter.com/intent/tweet?url=https://hempandbarrel.com/blog/${post.slug}&text=${encodeURIComponent(strip(post.title.rendered))}`}
                  target="_blank" rel="noopener noreferrer" aria-label="Share on X"
                  className="w-10 h-10 bg-[#000] hover:bg-[#333] rounded-full flex items-center justify-center transition-all hover:scale-105">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Link>
                <Link
                  href={`https://www.instagram.com/hempandbarrel/`}
                  target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
                  style={{background:"radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)"}}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sticky Sidebar ── */}
          <aside className="hidden xl:flex flex-col gap-6 w-[340px] flex-shrink-0 sticky top-24 self-start">

            {/* Table of Contents */}
            {toc.length > 2 && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <TableOfContents headings={toc} />
              </div>
            )}

            {/* Quick Info card */}
            <div className="bg-[#f5f0eb] rounded-2xl p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#5a8c3a] mb-4">Article Info</p>
              <div className="space-y-3">
                {cat && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catCls(cat.name)}`}>{cat.name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Published</span>
                  <span className="text-[#3d2b1f] font-semibold">{fmtDate(post.date)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Read time</span>
                  <span className="text-[#3d2b1f] font-semibold">{mins} min</span>
                </div>
              </div>
            </div>

            {/* Visit Store CTA */}
            <div className="bg-[#2a1008] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-[#5a8c3a]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#5a8c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <p className="text-white font-bold text-base mb-2">Shop Hemp & Barrel</p>
              <p className="text-white/50 text-xs leading-relaxed mb-5">
                Lab-tested CBD products · Pineville, NC · Ships nationwide
              </p>
              <Link href="/shop"
                className="block w-full bg-[#5a8c3a] hover:bg-[#4a7a2e] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-colors">
                Shop All Products
              </Link>
              <Link href="/contact"
                className="block w-full mt-2 border border-white/20 hover:border-[#5a8c3a] text-white/70 hover:text-[#5a8c3a] text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all">
                Ask an Expert
              </Link>
            </div>

            {/* Mini newsletter */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#5a8c3a] mb-2">Newsletter</p>
              <p className="text-[#3d2b1f] font-bold text-sm mb-1">Stay in the loop</p>
              <p className="text-gray-400 text-xs mb-4">New articles & deals in your inbox.</p>
              <NewsletterForm variant="light" />
            </div>
          </aside>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RELATED POSTS
      ══════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="bg-[#fafaf8] border-t border-gray-100 py-16">
          <div className="w-full mx-auto px-[70px]">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.3em] mb-1">Keep Reading</p>
                <h2 className="text-[#2a1008] text-2xl md:text-3xl font-bold">Related Articles</h2>
              </div>
              <Link href="/blog"
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#5a8c3a] border border-[#5a8c3a] hover:bg-[#5a8c3a] hover:text-white px-5 py-2.5 rounded-full transition-all duration-300">
                All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => {
                const ri  = getImg(rel);
                const rc  = getCat(rel);
                return (
                  <Link key={rel.id} href={`/blog/${rel.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                    <div className="relative aspect-[16/9] bg-[#f8f6f3] overflow-hidden">
                      {ri
                        ? <Image src={ri} alt={strip(rel.title.rendered)} fill
                            sizes="(max-width:1400px) 33vw, 440px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                        : <div className="w-full h-full bg-gradient-to-br from-[#3d2b1f] to-[#5a8c3a]/40"/>
                      }
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {rc && <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catCls(rc.name)}`}>{rc.name}</span>}
                        <span className="text-gray-400 text-xs">{fmtDate(rel.date)}</span>
                      </div>
                      <h3 className="text-[#3d2b1f] font-bold text-base leading-snug mb-3 group-hover:text-[#5a8c3a] transition-colors line-clamp-2 flex-1">
                        {strip(rel.title.rendered)}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[#5a8c3a] text-xs font-bold pt-4 border-t border-gray-100">
                        Read Article
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </>
  );
}
