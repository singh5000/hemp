import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/layout/NewsletterForm";

export const metadata: Metadata = {
  title: "CBD Blog | Hemp & Barrel — Expert Hemp Education",
  description:
    "Expert CBD guides, hemp product education, and the latest cannabinoid science from Hemp & Barrel — Charlotte's trusted CBD store.",
};

const PER_PAGE = 8;

interface WPMedia { source_url: string; alt_text: string }
interface WPTerm  { name: string; slug: string }
interface WPPost  {
  id: number;
  title:   { rendered: string };
  excerpt: { rendered: string };
  slug:    string;
  date:    string;
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?:          WPTerm[][];
  };
}

async function getPosts(page: number) {
  const base = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts`;
  const res  = await fetch(
    `${base}?per_page=${PER_PAGE}&page=${page}&_embed=1`,
    { next: { revalidate: 1800 } }          // revalidate every 30 min → new posts appear fast
  );
  if (!res.ok) return { posts: [], total: 0, totalPages: 1 };

  const posts: WPPost[] = await res.json();
  const total      = parseInt(res.headers.get("X-WP-Total")      ?? "0",  10);
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1",  10);
  return { posts, total, totalPages };
}

/* ── helpers ── */
const strip = (html: string) =>
  html.replace(/<[^>]+>/g, "").replace(/&[a-z#\d]+;/gi, " ").replace(/\s+/g, " ").trim();

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const getCat = (p: WPPost) => p._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "CBD";
const getImg = (p: WPPost) => p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;

const CAT_STYLES: Record<string, string> = {
  "THC":           "bg-purple-100 text-purple-700",
  "CBD Products":  "bg-emerald-100 text-emerald-700",
  "CBD Beverages": "bg-sky-100 text-sky-700",
  "Hemp Flower":   "bg-amber-100 text-amber-700",
};
const catCls = (n: string) => CAT_STYLES[n] ?? "bg-[#5a8c3a]/10 text-[#5a8c3a]";

/* ── Pagination UI ── */
function Pagination({ current, total }: { current: number; total: number }) {
  if (total <= 1) return null;

  const pages: (number | "…")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3)        pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("…");
    pages.push(total);
  }

  const btn = (p: number | "…", label: React.ReactNode, disabled = false) =>
    p === "…" ? (
      <span key={`ellipsis-${label}`} className="px-3 py-2 text-gray-400 text-sm select-none">…</span>
    ) : (
      <Link
        key={p}
        href={`/blog?page=${p}`}
        aria-disabled={disabled}
        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
          p === current
            ? "bg-[#5a8c3a] text-white shadow-md shadow-[#5a8c3a]/30"
            : "text-[#3d2b1f] hover:bg-[#f5f0eb] hover:text-[#5a8c3a] border border-gray-200"
        } ${disabled ? "pointer-events-none opacity-40" : ""}`}
      >
        {label}
      </Link>
    );

  return (
    <div className="flex items-center justify-center gap-2 mt-14 flex-wrap">
      {btn(Math.max(1, current - 1), (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      ), current === 1)}

      {pages.map((p, i) =>
        p === "…"
          ? <span key={`el-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
          : btn(p, p, false)
      )}

      {btn(Math.min(total, current + 1), (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      ), current === total)}
    </div>
  );
}

/* ── Page ── */
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  const { posts, total, totalPages } = await getPosts(currentPage);
  const [hero, ...rest] = posts;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#2a1008] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #5a8c3a 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute -right-32 -top-32 w-[500px] h-[500px] bg-[#5a8c3a]/8 rounded-full blur-3xl" />
        <div className="relative w-full mx-auto px-[70px] pt-20 pb-24 text-center">
          <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.4em] mb-4">Knowledge is Power</p>
          <h1 className="text-white text-5xl md:text-7xl font-bold uppercase leading-tight mb-5">
            CBD <span className="text-[#5a8c3a]">Blog</span>
          </h1>
          <p className="text-white/55 text-lg max-w-lg mx-auto">
            Expert guides, product education, and the latest in hemp &amp; cannabinoid science.
          </p>
          {total > 0 && (
            <p className="text-white/30 text-sm mt-4">{total} articles · Page {currentPage} of {totalPages}</p>
          )}
        </div>
      </section>

      {posts.length === 0 && (
        <div className="py-32 text-center">
          <p className="text-2xl font-bold text-gray-300">No posts found.</p>
        </div>
      )}

      {/* Featured post (first on each page) */}
      {hero && (
        <section className="w-full mx-auto px-[70px] -mt-10 relative z-10 mb-10">
          <Link
            href={`/blog/${hero.slug}`}
            className="group flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 hover:shadow-[#5a8c3a]/15 transition-shadow duration-500"
          >
            {/* Featured image — object-contain so nothing gets cropped */}
            <div className="relative md:w-[55%] aspect-[16/9] md:aspect-auto bg-[#f8f6f3] overflow-hidden">
              {getImg(hero) ? (
                <Image src={getImg(hero)!} alt={strip(hero.title.rendered)} fill
                  sizes="(max-width: 768px) 100vw, 660px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#3d2b1f] to-[#5a8c3a]/40" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center p-8 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#5a8c3a] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {currentPage === 1 ? "Latest" : `Page ${currentPage}`}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${catCls(getCat(hero))}`}>
                  {getCat(hero)}
                </span>
                <span className="text-gray-400 text-xs">{fmtDate(hero.date)}</span>
              </div>
              <h2 className="text-[#3d2b1f] text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-[#5a8c3a] transition-colors line-clamp-2">
                {strip(hero.title.rendered)}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                {strip(hero.excerpt.rendered)}
              </p>
              <div className="flex items-center gap-2 text-[#5a8c3a] font-bold text-sm">
                Read Full Article
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* 7-post grid */}
      {rest.length > 0 && (
        <section className="bg-[#fafaf8] py-12">
          <div className="w-full mx-auto px-[70px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => {
                const img = getImg(post);
                const cat = getCat(post);
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                    {/* Thumbnail — object-contain, no cropping */}
                    <div className="relative aspect-[16/9] bg-[#f8f6f3] overflow-hidden">
                      {img ? (
                        <Image src={img} alt={strip(post.title.rendered)} fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 380px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#3d2b1f] to-[#5a8c3a]/50" />
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      {/* Category + date row — below image, no overlap */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catCls(cat)}`}>
                          {cat}
                        </span>
                        <span className="text-gray-300 text-xs">·</span>
                        <span className="text-gray-400 text-xs">{fmtDate(post.date)}</span>
                      </div>
                      <h3 className="text-[#3d2b1f] font-bold text-base leading-snug mb-3 group-hover:text-[#5a8c3a] transition-colors line-clamp-2 flex-1">
                        {strip(post.title.rendered)}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                        {strip(post.excerpt.rendered)}
                      </p>
                      <div className="flex items-center gap-1.5 text-[#5a8c3a] text-xs font-bold mt-auto pt-4 border-t border-gray-100">
                        Read More
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Pagination current={currentPage} total={totalPages} />
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-[#2a1008] py-16">
        <div className="max-w-[680px] mx-auto px-6 text-center">
          <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.4em] mb-3">Stay in the Know</p>
          <h3 className="text-white text-3xl md:text-4xl font-bold mb-3">Get CBD Tips in Your Inbox</h3>
          <p className="text-white/50 text-base mb-8">New articles, product guides, and exclusive deals — delivered straight to you.</p>
          <div className="flex justify-center"><NewsletterForm /></div>
        </div>
      </section>
    </>
  );
}
