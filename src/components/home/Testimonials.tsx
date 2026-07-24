import TestimonialsClient, { Review } from "./TestimonialsClient";

const HOME_PAGE_ID = 38;

async function getReviews(): Promise<Review[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${HOME_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.acf?.reviews ?? [];
}

export default async function Testimonials() {
  const reviews = await getReviews();
  return <TestimonialsClient reviews={reviews} />;
}
