import InstagramFeedClient, { Post } from "./InstagramFeedClient";

const HOME_PAGE_ID = 38;

async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${HOME_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const posts: { image: string | false; caption: string; link: string }[] = data.acf?.instagram_posts ?? [];
  return posts
    .filter((p) => p.image)
    .map((p) => ({ image: p.image as string, caption: p.caption, link: p.link }));
}

export default async function InstagramFeed() {
  const posts = await getPosts();
  return <InstagramFeedClient posts={posts} />;
}
