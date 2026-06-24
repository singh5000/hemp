import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const WP = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";
const PER_PAGE = 6;

/* ── Types ── */
interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar_urls: Record<string, string>;
  meta?: {
    hb_title?: string;
    hb_credentials?: string;
    hb_specialties?: string;
    hb_profile_image?: string;
  };
}

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

/* ── Fetchers ── */
async function getAuthor(slug: string): Promise<WPAuthor | null> {
  const res = await fetch(`${WP}/wp-json/wp/v2/users?slug=${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data: WPAuthor[] = await res.json();
  return data[0] ?? null;
}

async function getAuthorPosts(authorId: number, page: number): Promise<{ posts: WPPost[]; total: number; pages: number }> {
  const res = await fetch(
    `${WP}/wp-json/wp/v2/posts?author=${authorId}&per_page=${PER_PAGE}&page=${page}&_embed=1&orderby=date&order=desc`,
    { cache: "no-store" }
  );
  if (!res.ok) return { posts: [], total: 0, pages: 1 };
  const posts: WPPost[] = await res.json();
  return {
    posts,
    total: parseInt(res.headers.get("X-WP-Total") ?? "0"),
    pages: parseInt(res.headers.get("X-WP-TotalPages") ?? "1"),
  };
}

async function getOtherAuthors(excludeId: number): Promise<WPAuthor[]> {
  const res = await fetch(`${WP}/wp-json/wp/v2/users?per_page=5&exclude=${excludeId}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

/* ── Helpers ── */
const strip = (h: string) => h.replace(/<[^>]+>/g, "").replace(/&[a-z#\d]+;/gi, " ").replace(/\s+/g, " ").trim();
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const readTime = (h: string) => Math.max(1, Math.ceil(strip(h).split(/\s+/).length / 220));
const getImg = (p: WPPost) => p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
const getCat = (p: WPPost) => p._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "";
const initials = (name: string) => name.split(" ").slice(0, 2).map(w => w.charAt(0).toUpperCase()).join("");

const AVATAR_COLORS = ["#7ec8a0", "#e8b86d", "#a8c4d8", "#9a94d0", "#e8948a", "#70b8c0", "#d4a0c0"];

/* ── Metadata ── */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return { title: "Author Not Found | Hemp & Barrel" };
  return {
    title: `${author.name} — Author | Hemp & Barrel`,
    description: author.description
      ? strip(author.description).slice(0, 160)
      : `Read articles by ${author.name} on Hemp & Barrel's CBD Blog.`,
  };
}

/* ── Pagination ── */
function Pagination({ current, total, slug }: { current: number; total: number; slug: string }) {
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
  return (
    <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
      {current > 1 && (
        <Link href={`/author/${slug}?page=${current - 1}#articles`}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[#3d2b1f] hover:bg-[#f5f0eb] hover:border-[#1A9248] transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </Link>
      )}
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e${i}`} className="px-2 text-gray-400 text-sm">…</span>
          : <Link key={p} href={`/author/${slug}?page=${p}#articles`}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                p === current
                  ? "bg-[#1A9248] text-white shadow-md shadow-[#1A9248]/30"
                  : "border border-gray-200 text-[#3d2b1f] hover:bg-[#f5f0eb] hover:border-[#1A9248]"
              }`}>{p}</Link>
      )}
      {current < total && (
        <Link href={`/author/${slug}?page=${current + 1}#articles`}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[#3d2b1f] hover:bg-[#f5f0eb] hover:border-[#1A9248] transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </Link>
      )}
    </div>
  );
}

/* ── Page ── */
export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1"));

  const author = await getAuthor(slug);
  if (!author) notFound();

  const authorTitle = author.meta?.hb_title || "Contributor · Wellness Advocate";
  const credentials = author.meta?.hb_credentials
    ? author.meta.hb_credentials.split("\n").map(s => s.trim()).filter(Boolean)
    : [];
  const specialties = author.meta?.hb_specialties
    ? author.meta.hb_specialties.split(",").map(s => s.trim()).filter(Boolean)
    : [];
  const profileImage = author.meta?.hb_profile_image || null;
  const gravatarUrl = author.avatar_urls?.["96"] || "";
  const hasRealAvatar = gravatarUrl && !gravatarUrl.includes("d=mm") && !gravatarUrl.includes("gravatar.com/avatar/0");
  const avatarUrl = profileImage || (hasRealAvatar ? gravatarUrl : null);

  const [{ posts, total, pages: totalPages }, otherAuthors] = await Promise.all([
    getAuthorPosts(author.id, page),
    getOtherAuthors(author.id),
  ]);

  const featuredPosts = posts.slice(0, 2);
  const firstName = author.name.split(" ")[0];

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#f0ede6]">
        <div className="max-w-[1160px] mx-auto px-6 py-14 md:py-16">
          <div className="flex flex-col-reverse md:flex-row md:items-center gap-10">
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium uppercase tracking-wider text-[#1a1a18] mb-1.5">Hi, I&apos;m</p>
              <h1 className="text-[#1a1a18] font-bold leading-[1.08] mb-2.5" style={{ fontSize: "clamp(42px, 5vw, 60px)" }}>{author.name}</h1>
              <p className="text-[#7a7a72] text-[19px] mb-3.5">{authorTitle}</p>
              {author.description && (
                <p className="text-[#3e3e38] text-base leading-[1.65] mb-6 max-w-[580px]">{author.description}</p>
              )}
              <div className="flex items-center gap-2.5 mb-5">
                <a href="#articles" className="bg-[#2d3b2a] hover:bg-[#3a5233] text-white text-[15px] font-medium px-5 py-2.5 rounded-full transition-colors">
                  View Articles
                </a>
                <button className="border-[1.5px] border-[#1a1a18] text-[#1a1a18] hover:bg-black/5 text-[15px] font-medium px-5 py-2 rounded-full transition-colors">
                  Follow
                </button>
              </div>
              <div className="inline-flex items-center gap-2 bg-white border border-[#ddd9d0] rounded-lg px-3 py-1.5 text-[14px] text-[#3e3e38]">
                <svg className="w-3.5 h-3.5 text-[#7a7a72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2}/>
                  <path d="M3 9h18M9 21V9" strokeWidth={2}/>
                </svg>
                <span><strong>{total}</strong> articles published</span>
              </div>
            </div>

            <div className="w-[220px] md:w-[300px] flex-shrink-0 mx-auto md:mx-0">
              <div className="aspect-[3/3.6] rounded-xl overflow-hidden bg-[#d6d0c4]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={author.name} width={300} height={360} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#c8c2b4] to-[#b8b0a0] flex items-center justify-center">
                    <svg className="w-24 h-24 opacity-25" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Education & Specialization Cards ── */}
      <div className="max-w-[1160px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-[#ddd9d0] rounded-xl p-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-[#1a1a18] mb-4">
            <svg className="w-5 h-5 text-[#7a7a72]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            Education &amp; Credentials
          </div>
          {credentials.length > 0 ? (
            <ul className="space-y-2">
              {credentials.map((cred, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-[#3e3e38]">
                  <span className="text-[#3a5233] text-lg mt-px flex-shrink-0">✦</span>
                  {cred}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#7a7a72]">No credentials added yet.</p>
          )}
        </div>

        <div className="bg-white border border-[#ddd9d0] rounded-xl p-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-[#1a1a18] mb-4">
            <svg className="w-5 h-5 text-[#7a7a72]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            Areas of Specialization
          </div>
          {specialties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {specialties.map((tag, i) => (
                <span key={i} className="bg-[#e8e4dc] border border-[#ddd9d0] rounded-full px-3.5 py-1.5 text-sm text-[#4a4a42]">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#7a7a72]">No specialties added yet.</p>
          )}
        </div>
      </div>

      <div className="max-w-[1160px] mx-auto px-6"><div className="border-t border-[#ddd9d0]" /></div>

      {/* ── Articles Grid ── */}
      <section className="max-w-[1160px] mx-auto px-6 py-14" id="articles">
        <h2 className="text-[#1a1a18] text-2xl md:text-3xl font-bold mb-1">All Articles by {firstName}</h2>
        <p className="text-[#7a7a72] text-base mb-8">Science-backed insights from years in the field.</p>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => {
              const img = getImg(post);
              const cat = getCat(post);
              const mins = readTime(post.excerpt.rendered || "");
              return (
                <Link key={post.id} href={`/${post.slug}`}
                  className="group bg-white border border-[#ddd9d0] rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="relative aspect-[16/10] bg-[#e8e4dc] overflow-hidden">
                    {img ? (
                      <Image src={img} alt={strip(post.title.rendered)} fill sizes="(max-width:640px) 100vw, (max-width:1200px) 50vw, 380px"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-300" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#d4cfc5] to-[#c8c0b4]" />
                    )}
                  </div>
                  <div className="p-4 md:p-5">
                    {cat && (
                      <p className="text-[13px] font-semibold uppercase tracking-wider text-[#7a7a72] mb-2">{cat}</p>
                    )}
                    <h3 className="text-[#1a1a18] font-semibold text-[17px] leading-snug mb-2 group-hover:text-[#3a5233] transition-colors line-clamp-2">
                      {strip(post.title.rendered)}
                    </h3>
                    <p className="text-[#7a7a72] text-[15px] leading-relaxed line-clamp-2 mb-3">
                      {strip(post.excerpt.rendered)}
                    </p>
                    <div className="flex items-center gap-3 text-[13px] text-[#7a7a72]">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                        {mins} min read
                      </span>
                      <time dateTime={post.date}>{fmtDate(post.date)}</time>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[#7a7a72]">No articles published yet.</p>
        )}

        <Pagination current={page} total={totalPages} slug={slug} />
      </section>

      <div className="max-w-[1160px] mx-auto px-6"><div className="border-t border-[#ddd9d0]" /></div>

      {/* ── Other Authors ── */}
      {otherAuthors.length > 0 && (
        <section className="bg-white border-y border-[#ddd9d0] py-14 text-center">
          <h2 className="text-[#1a1a18] text-2xl md:text-3xl font-bold mb-1">Explore Our Other Authors</h2>
          <p className="text-[#7a7a72] text-base mb-9">Discover a wealth of knowledge and expertise from our team of experts.</p>
          <div className="flex justify-center gap-10 flex-wrap">
            {otherAuthors.map((other, i) => {
              const oColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const oTitle = other.meta?.hb_title || "Contributor";
              return (
                <Link key={other.id} href={`/author/${other.slug}`}
                  className="flex flex-col items-center gap-2 group">
                  <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white text-[15px] font-semibold"
                    style={{ backgroundColor: oColor }}>
                    {initials(other.name)}
                  </div>
                  <span className="text-sm font-medium text-[#1a1a18] group-hover:text-[#3a5233] transition-colors">{other.name}</span>
                  <span className="text-sm text-[#7a7a72]">{oTitle}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Featured / Most Read Articles ── */}
      {featuredPosts.length > 0 && (
        <section className="max-w-[1160px] mx-auto px-6 py-14">
          <h2 className="text-[#1a1a18] text-2xl md:text-3xl font-bold mb-1.5">Most Read Articles</h2>
          <p className="text-[#7a7a72] text-base mb-7">Top articles based on reader views.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.map(fp => {
              const fpImg = getImg(fp);
              const fpCat = getCat(fp);
              return (
                <div key={fp.id} className="bg-white border border-[#ddd9d0] rounded-2xl overflow-hidden flex flex-col">
                  <div className="bg-[#e8e4dc]">
                    {fpImg ? (
                      <Image src={fpImg} alt={strip(fp.title.rendered)} width={600} height={375}
                        sizes="(max-width:768px) 100vw, 560px" className="w-full h-auto object-contain" loading="lazy" />
                    ) : (
                      <div className="w-full min-h-[220px] bg-gradient-to-br from-[#c8cec0] to-[#b8bab0]" />
                    )}
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7a7a72] mb-2.5">
                      {fpCat || "Featured Article"}
                    </p>
                    <h3 className="text-xl font-bold text-[#1a1a18] leading-snug mb-2.5">
                      <Link href={`/${fp.slug}`} className="hover:text-[#3a5233] transition-colors">
                        {strip(fp.title.rendered)}
                      </Link>
                    </h3>
                    <p className="text-sm text-[#7a7a72] leading-relaxed mb-5 flex-1 line-clamp-3">
                      {strip(fp.excerpt.rendered)}
                    </p>
                    <Link href={`/${fp.slug}`}
                      className="inline-flex items-center gap-1.5 bg-[#2d3b2a] hover:bg-[#3a5233] text-white rounded-full px-5 py-2.5 text-sm font-medium w-fit transition-colors">
                      Read Article
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
