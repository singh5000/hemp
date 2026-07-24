import HeroBannerClient, { Slide } from "./HeroBannerClient";

const HOME_PAGE_ID = 38;

interface SlideAcf {
  image: string | false;
  link: string;
}

async function getSlides(): Promise<Slide[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${HOME_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const slides: SlideAcf[] = data.acf?.hero_slides ?? [];
  return slides
    .filter((s) => s.image)
    .map((s) => ({ src: s.image as string, alt: "Hemp & Barrel", href: s.link || "/shop" }));
}

export default async function HeroBanner() {
  const slides = await getSlides();
  return <HeroBannerClient slides={slides} />;
}
