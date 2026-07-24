import type { Metadata } from "next";
import FaqsClient, { Faq } from "./FaqsClient";

export const metadata: Metadata = {
  title: "FAQs About Hemp, CBD & THC Products | Hemp & Barrel",
  description:
    "Find answers to common questions about CBD, hemp products, vaping, shipping, and visiting our Pineville, NC store. Hemp & Barrel — lab-tested CBD you can trust.",
  openGraph: {
    title: "FAQs | Hemp & Barrel",
    description: "Got CBD questions? We've got answers. Learn about our products, policies, and more.",
    url: "https://hempandbarrel.com/faqs",
  },
};

const FAQS_PAGE_ID = 3907;

interface FaqsAcf {
  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;
  questions: Faq[];
}

async function getContent(): Promise<FaqsAcf | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${FAQS_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.acf ?? null;
}

export default async function FaqsPage() {
  const acf = await getContent();
  if (!acf) return null;
  return (
    <FaqsClient
      eyebrow={acf.hero_eyebrow}
      heading={acf.hero_heading}
      description={acf.hero_description}
      faqs={acf.questions}
    />
  );
}
