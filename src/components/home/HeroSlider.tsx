import HeroSliderClient, { SlideData } from "./HeroSliderClient";

const WC = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/store/v1`;

async function fetchTopProductImg(category: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${WC}/products?category=${category}&per_page=1&orderby=popularity&order=desc`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json() as Array<{ images: Array<{ src: string }> }>;
    return data[0]?.images?.[0]?.src ?? null;
  } catch { return null; }
}

const BASE_SLIDES: (Omit<SlideData, "productImg"> & { category: string })[] = [
  {
    id:      1,
    tag:     "Premium Full-Spectrum",
    heading: "CBD\nTinctures",
    sub:     "Lab-tested, full-spectrum CBD oil in 10 strengths — pure, effective, and federally compliant.",
    cta:     "Shop Tinctures",
    href:    "/product-category/tinctures",
    bg:      "https://hempandbarrel.com/wp-content/uploads/2023/02/tincture-bg-image.webp",
    category: "SKIP",
  },
  {
    id:      2,
    tag:     "Fan Favorites",
    heading: "CBD\nGummies",
    sub:     "Precisely dosed, delicious gummies in every flavor. Easy, consistent, and made to enjoy.",
    cta:     "Shop Gummies",
    href:    "/product-category/edibles-gummies",
    bg:      "https://hempandbarrel.com/wp-content/uploads/2023/02/gummy-bg-image-scaled.webp",
    category: "SKIP", // productImg hardcoded below
  },
  {
    id:      3,
    tag:     "Locally Sourced",
    heading: "Hemp\nFlower",
    sub:     "Hand-selected, farm-fresh hemp flower — straight from the Carolinas with lab-verified COAs.",
    cta:     "Shop Hemp Flower",
    href:    "/product-category/smokable-hemp-flower",
    bg:      "https://hempandbarrel.com/wp-content/uploads/2024/04/Chris-Grow-for-Banner-e1712944504867.jpeg",
    category: "SKIP",
  },
];

export default async function HeroSlider() {
  const HARDCODED: Record<number, string> = {
    1: "https://hempandbarrel.com/wp-content/uploads/2022/05/Tinctures-product.png.webp",
    2: "https://hempandbarrel.com/wp-content/uploads/2023/02/gummies-1024x723.webp",
    3: "https://hempandbarrel.com/wp-content/uploads/2026/06/ss.webp",
  };

  const productImgs = await Promise.all(
    BASE_SLIDES.map(s => s.category === "SKIP" ? Promise.resolve(null) : fetchTopProductImg(s.category))
  );

  const slides: SlideData[] = BASE_SLIDES.map((s, i) => ({
    id:         s.id,
    tag:        s.tag,
    heading:    s.heading,
    sub:        s.sub,
    cta:        s.cta,
    href:       s.href,
    bg:         s.bg,
    productImg: HARDCODED[s.id] ?? productImgs[i],
  }));

  return <HeroSliderClient slides={slides} />;
}
