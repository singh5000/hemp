import Link from "next/link";
import Image from "next/image";

const WP = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

interface WPPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text: string }>;
    "wp:term"?: Array<Array<{ name: string; slug: string }>>;
  };
}

const strip = (h: string) => h.replace(/<[^>]+>/g, "").replace(/&[a-z#\d]+;/gi, " ").replace(/\s+/g, " ").trim();
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const getImg = (p: WPPost) => p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
const getCat = (p: WPPost) => p._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "CBD";

const CAT_STYLES: Record<string, string> = {
  "THC": "bg-purple-100 text-purple-700",
  "CBD Products": "bg-emerald-100 text-emerald-700",
  "CBD Beverages": "bg-sky-100 text-sky-700",
  "Hemp Flower": "bg-amber-100 text-amber-700",
};
const catCls = (n: string) => CAT_STYLES[n] ?? "bg-[#1A9248]/10 text-[#1A9248]";

async function getLatestPosts(): Promise<WPPost[]> {
  try {
    const res = await fetch(`${WP}/wp-json/wp/v2/posts?per_page=3&_embed=1`, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function LatestBlog() {
  const posts = await getLatestPosts();
  if (posts.length === 0) return null;

  return (
    <section className="bg-[#fafaf8] border-t border-gray-100 py-16 md:py-20">
      <div className="max-w-[1320px] mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#1A9248] text-[16.5px] font-bold uppercase tracking-[0.4em] mb-3">From the Blog</p>
          <h2 className="text-[#2a1008] text-[38px] md:text-4xl font-bold mb-3">Latest Articles &amp; Guides</h2>
          <p className="text-gray-500 text-[16.5px] max-w-lg mx-auto">Expert CBD education, product guides, and the latest in hemp science.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => {
            const img = getImg(post);
            const cat = getCat(post);
            return (
              <Link key={post.id} href={`/${post.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-md shadow-black/5 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="relative bg-[#f8f6f3] overflow-hidden">
                  {img ? (
                    <Image src={img} alt={strip(post.title.rendered)} width={600} height={375}
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#3d2b1f] to-[#1A9248]/40" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[12px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm ${catCls(cat)}`}>
                      {cat}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-gray-400 text-[13px] mb-2">{fmtDate(post.date)}</span>
                  <h3 className="text-[#2a1008] font-bold text-[27px] leading-snug mb-2 group-hover:text-[#1A9248] transition-colors line-clamp-2 flex-1">
                    {strip(post.title.rendered)}
                  </h3>
                  <p className="text-gray-500 text-[16.5px] leading-relaxed line-clamp-2 mb-4">
                    {strip(post.excerpt.rendered)}
                  </p>
                  <div className="flex items-center gap-1.5 text-[#1A9248] text-[15px] font-bold mt-auto pt-4 border-t border-gray-100 group-hover:gap-2.5 transition-all duration-300">
                    Read More
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link href="/blog"
            className="inline-flex items-center gap-2 bg-[#2a1008] hover:bg-[#1A9248] text-white text-sm font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#1A9248]/20">
            View All Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
