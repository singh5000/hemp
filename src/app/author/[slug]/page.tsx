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
const readTime = (ex: string) => `${Math.max(1, Math.ceil(strip(ex).split(/\s+/).length / 200))} min read`;
const getImg = (p: WPPost) => p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
const getCat = (p: WPPost) => p._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "";
const initials = (name: string) => name.split(" ").slice(0, 2).map(w => w.charAt(0).toUpperCase()).join("") || "??";

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
      : `Read articles by ${author.name} on Hemp & Barrel's Hemp & Cannabis Blog.`,
  };
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

  const authorTitle = author.meta?.hb_title || "Contributor &middot; Wellness Advocate";
  const credentials = author.meta?.hb_credentials
    ? author.meta.hb_credentials.split("\n").map(s => s.trim()).filter(Boolean)
    : [];
  const specialties = author.meta?.hb_specialties
    ? author.meta.hb_specialties.split(",").map(s => s.trim()).filter(Boolean)
    : [];
  const profileImage = author.meta?.hb_profile_image || null;
  const avatarUrl = profileImage || null;

  const [{ posts, total, pages: totalPages }, otherAuthors] = await Promise.all([
    getAuthorPosts(author.id, page),
    getOtherAuthors(author.id),
  ]);

  const featuredPosts = posts.slice(0, 2);
  const firstName = author.name.split(" ")[0];

  return (
    <>
      <style>{`
        .hb-author-page { background: #f0ede6; }
        .hero { max-width:1160px; margin:0 auto; padding:60px 24px 48px; display:grid; grid-template-columns:1fr 300px; gap:40px; align-items:center; }
        .hero-label { font-size:14px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:#000; margin-bottom:6px; }
        .hero-name { font-size:clamp(42px,5vw,60px); font-weight:700; line-height:1.08; color:#1a1a18; margin-bottom:10px; }
        .hero-title { font-size:19px; color:#7a7a72; font-weight:400; margin-bottom:14px; }
        .hero-bio { font-size:16px; color:#3e3e38; line-height:1.65; margin-bottom:24px; }
        .hero-actions { display:flex; align-items:center; gap:10px; margin-bottom:20px; }
        .btn-primary { background:#2d3b2a; color:#fff; border:none; border-radius:50px; padding:9px 20px; font-size:15px; font-weight:500; cursor:pointer; display:inline-block; }
        .btn-primary:hover { background:#3a5233; color:#fff; }
        .btn-outline { background:transparent; color:#1a1a18; border:1.5px solid #1a1a18; border-radius:50px; padding:8px 20px; font-size:15px; font-weight:500; cursor:pointer; display:inline-block; }
        .btn-outline:hover { background:rgba(0,0,0,0.05); }
        .hero-stats { display:inline-flex; align-items:center; gap:6px; background:#fff; border:1px solid #ddd9d0; border-radius:8px; padding:6px 12px; font-size:14px; color:#3e3e38; }
        .hero-stats svg { width:14px; height:14px; color:#7a7a72; }
        .hero-photo { width:100%; max-width:300px; aspect-ratio:3/3.6; border-radius:12px; overflow:hidden; background:#d6d0c4; }
        .hero-photo img { width:100%; height:100%; object-fit:cover; object-position:top center; }
        .hero-photo-placeholder { width:100%; height:100%; background:linear-gradient(160deg,#c8c2b4 0%,#b8b0a0 100%); display:flex; align-items:center; justify-content:center; }
        .hero-photo-placeholder svg { width:120px; height:120px; opacity:.25; }

        .info-row { max-width:1160px; margin:0 auto; padding:0 24px 56px; display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .info-card { background:#fff; border:1px solid #ddd9d0; border-radius:10px; padding:22px 24px; }
        .info-card-title { display:flex; align-items:center; gap:7px; font-size:18px; font-weight:600; color:#1a1a18; margin-bottom:14px; }
        .info-card-title svg { width:20px; height:20px; color:#7a7a72; }
        .cred-list { list-style:none; display:flex; flex-direction:column; gap:8px; padding:0; }
        .cred-list li { display:flex; align-items:flex-start; gap:8px; font-size:15px; color:#3e3e38; }
        .cred-list li::before { content:'✦'; font-size:18px; color:#3a5233; flex-shrink:0; }
        .tag-list { display:flex; flex-wrap:wrap; gap:8px; }
        .tag { background:#e8e4dc; border:1px solid #ddd9d0; border-radius:50px; padding:5px 13px; font-size:14px; color:#4a4a42; font-weight:400; }
        .no-data { font-size:14px; color:#7a7a72; }

        .hb-divider { background:#ddd9d0; height:1px; max-width:1160px; margin:0 auto; }

        .articles-section { max-width:1160px; margin:0 auto; padding:52px 24px 60px; }
        .section-heading { font-size:28px; font-weight:700; color:#1a1a18; margin-bottom:4px; }
        .section-sub { font-size:16px; color:#7a7a72; margin-bottom:32px; }
        .articles-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        .article-card { background:#fff; border:1px solid #ddd9d0; border-radius:10px; overflow:hidden; transition:box-shadow .2s ease; }
        .article-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.08); }
        .article-thumb { display:block; width:100%; background:#ccc; overflow:hidden; }
        .article-thumb img { width:100%; height:auto; display:block; transition:transform .3s ease; }
        .article-card:hover .article-thumb img { transform:scale(1.03); }
        .thumb-placeholder { width:100%; min-height:160px; background:linear-gradient(135deg,#d4cfc5,#c8c0b4); }
        .article-body { padding:16px 18px 18px; }
        .article-cat { font-size:13px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#7a7a72; margin-bottom:7px; }
        .article-title { font-size:17px; font-weight:600; color:#1a1a18; line-height:1.35; margin-bottom:8px; }
        .article-title a { color:inherit; }
        .article-title a:hover { color:#3a5233; }
        .article-excerpt { font-size:15px; color:#7a7a72; line-height:1.6; margin-bottom:14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .article-meta { display:flex; align-items:center; gap:12px; font-size:13px; color:#7a7a72; }
        .article-meta-item { display:flex; align-items:center; gap:4px; }
        .article-meta-item svg { width:12px; height:12px; }
        .no-posts { font-size:13.5px; color:#7a7a72; }

        .hb-pagination { margin-top:40px; display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:6px; }
        .hb-pagination a, .hb-pagination span { display:inline-flex; align-items:center; justify-content:center; min-width:36px; height:36px; padding:0 12px; border:1px solid #ddd9d0; border-radius:8px; font-size:13px; color:#3e3e38; background:#fff; transition:all .2s; }
        .hb-pagination a:hover, .hb-pagination .current { background:#2d3b2a; color:#fff; border-color:#2d3b2a; }
        .hb-pagination .dots { border:none; background:transparent; color:#7a7a72; pointer-events:none; }

        .authors-section { background:#fff; border-top:1px solid #ddd9d0; border-bottom:1px solid #ddd9d0; padding:56px 24px; text-align:center; }
        .authors-row { display:flex; justify-content:center; gap:40px; flex-wrap:wrap; }
        .author-item { display:flex; flex-direction:column; align-items:center; gap:8px; }
        .author-avatar { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:600; color:#fff; }
        .author-name-text { font-size:14px; font-weight:500; color:#1a1a18; }
        .author-item:hover .author-name-text { color:#3a5233; }
        .author-role { font-size:14px; color:#7a7a72; }

        .featured-section { max-width:1160px; margin:0 auto; padding:60px 24px; }
        .featured-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .featured-card { background:#fff; border:1px solid #ddd9d0; border-radius:14px; overflow:hidden; display:flex; flex-direction:column; }
        .featured-img { width:100%; background:#e8e4dc; display:flex; align-items:center; justify-content:center; }
        .featured-img img { width:100%; height:auto; display:block; object-fit:contain; }
        .featured-placeholder { width:100%; min-height:220px; background:linear-gradient(135deg,#c8cec0,#b8bab0); }
        .featured-content { padding:28px 28px 32px; display:flex; flex-direction:column; flex:1; }
        .featured-label { font-size:12px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#7a7a72; margin-bottom:10px; }
        .featured-title { font-size:20px; font-weight:700; line-height:1.3; color:#1a1a18; margin-bottom:10px; }
        .featured-title a { color:inherit; }
        .featured-title a:hover { color:#3a5233; }
        .featured-excerpt { font-size:14px; color:#7a7a72; line-height:1.7; margin-bottom:20px; flex:1; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .btn-read { display:inline-flex; align-items:center; gap:6px; background:#2d3b2a; color:#fff; border-radius:50px; padding:10px 22px; font-size:14px; font-weight:500; width:fit-content; margin-top:auto; }
        .btn-read:hover { background:#3a5233; color:#fff; }
        .btn-read svg { width:15px; height:15px; }

        @media (max-width:900px) {
          .hero { grid-template-columns:1fr; }
          .hero-photo { max-width:220px; margin:0 auto; }
          .hero-content { order:2; }
          .hero-photo-wrap { order:1; }
          .info-row { grid-template-columns:1fr; }
          .articles-grid { grid-template-columns:repeat(2,1fr); }
          .featured-grid { grid-template-columns:1fr; }
        }
        @media (max-width:600px) {
          .articles-grid { grid-template-columns:1fr; }
          .authors-row { gap:24px; }
          .featured-content { padding:28px 24px; }
        }
      `}</style>

      <div className="hb-author-page">
        {/* ── HERO ── */}
        <section>
          <div className="hero">
            <div className="hero-content">
              <p className="hero-label text-[16.5px]">Hi, I&apos;m</p>
              <h1 className="hero-name">{author.name}</h1>
              <p className="hero-title text-[16.5px]" dangerouslySetInnerHTML={{ __html: authorTitle }} />
              {author.description && <p className="hero-bio text-[16.5px]">{author.description}</p>}
              <div className="hero-actions">
                <a href="#hb-articles" className="btn-primary">View Articles</a>
                <button className="btn-outline">Follow</button>
              </div>
              <div className="hero-stats">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                <span><strong>{total}</strong> articles published</span>
              </div>
            </div>
            <div className="hero-photo-wrap">
              <div className="hero-photo">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={author.name} width={600} height={720} />
                ) : (
                  <div className="hero-photo-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── INFO CARDS ── */}
        <div className="info-row">
          <div className="info-card">
            <div className="info-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Education &amp; Credentials
            </div>
            {credentials.length > 0 ? (
              <ul className="cred-list">
                {credentials.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            ) : (
              <p className="no-data text-[16.5px]">No credentials added yet.</p>
            )}
          </div>
          <div className="info-card">
            <div className="info-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              Areas of Specialization
            </div>
            {specialties.length > 0 ? (
              <div className="tag-list">
                {specialties.map((t, i) => <span key={i} className="tag">{t}</span>)}
              </div>
            ) : (
              <p className="no-data text-[16.5px]">No specialties added yet.</p>
            )}
          </div>
        </div>

        <div className="hb-divider" />

        {/* ── ARTICLES ── */}
        <section className="articles-section" id="hb-articles">
          <h2 className="section-heading">All Articles by {firstName}</h2>
          <p className="section-sub text-[16.5px]">Science-backed insights from years in the field.</p>

          {posts.length > 0 ? (
            <div className="articles-grid">
              {posts.map(post => {
                const img = getImg(post);
                const cat = getCat(post);
                return (
                  <article key={post.id} className="article-card">
                    <Link href={`/${post.slug}`} className="article-thumb">
                      {img ? (
                        <Image src={img} alt={strip(post.title.rendered)} width={400} height={250}
                          sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 360px" />
                      ) : (
                        <div className="thumb-placeholder" />
                      )}
                    </Link>
                    <div className="article-body">
                      {cat && <p className="article-cat text-[16.5px]">{cat}</p>}
                      <h3 className="article-title">
                        <Link href={`/${post.slug}`}>{strip(post.title.rendered)}</Link>
                      </h3>
                      <p className="article-excerpt text-[16.5px]">{strip(post.excerpt.rendered)}</p>
                      <div className="article-meta">
                        <span className="article-meta-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {readTime(post.excerpt.rendered)}
                        </span>
                        <time dateTime={post.date}>{fmtDate(post.date)}</time>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="no-posts text-[16.5px]">No articles published yet.</p>
          )}

          {totalPages > 1 && (
            <div className="hb-pagination">
              {page > 1 && (
                <Link href={`/author/${slug}?page=${page - 1}#hb-articles`}>&larr; Previous</Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p =>
                p === page
                  ? <span key={p} className="current">{p}</span>
                  : <Link key={p} href={`/author/${slug}?page=${p}#hb-articles`}>{p}</Link>
              )}
              {page < totalPages && (
                <Link href={`/author/${slug}?page=${page + 1}#hb-articles`}>Next &rarr;</Link>
              )}
            </div>
          )}
        </section>

        <div className="hb-divider" />

        {/* ── OTHER AUTHORS ── */}
        {otherAuthors.length > 0 && (
          <section className="authors-section">
            <h2 className="section-heading">Explore Our Other Authors</h2>
            <p className="section-sub text-[16.5px]">Discover a wealth of knowledge and expertise from our team of experts.</p>
            <div className="authors-row">
              {otherAuthors.map((other, i) => {
                const oColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const oTitle = other.meta?.hb_title || "Contributor";
                return (
                  <Link key={other.id} href={`/author/${other.slug}`} className="author-item">
                    <div className="author-avatar" style={{ backgroundColor: oColor }}>
                      {initials(other.name)}
                    </div>
                    <span className="author-name-text">{other.name}</span>
                    <span className="author-role">{oTitle}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── FEATURED / MOST READ ── */}
        {featuredPosts.length > 0 && (
          <section className="featured-section">
            <h2 className="section-heading" style={{ marginBottom: 6 }}>Most Read Articles</h2>
            <p className="section-sub text-[16.5px]" style={{ marginBottom: 28 }}>Top articles based on reader views.</p>
            <div className="featured-grid">
              {featuredPosts.map(fp => {
                const fpImg = getImg(fp);
                const fpCat = getCat(fp);
                return (
                  <div key={fp.id} className="featured-card">
                    <div className="featured-img">
                      {fpImg ? (
                        <Image src={fpImg} alt={strip(fp.title.rendered)} width={600} height={375}
                          sizes="(max-width:900px) 100vw, 560px" />
                      ) : (
                        <div className="featured-placeholder" />
                      )}
                    </div>
                    <div className="featured-content">
                      <p className="featured-label text-[16.5px]">{fpCat || "Featured Article"}</p>
                      <h2 className="featured-title">
                        <Link href={`/${fp.slug}`}>{strip(fp.title.rendered)}</Link>
                      </h2>
                      <p className="featured-excerpt text-[16.5px]">{strip(fp.excerpt.rendered)}</p>
                      <Link href={`/${fp.slug}`} className="btn-read">
                        Read Article
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
