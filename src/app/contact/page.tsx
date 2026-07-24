import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Hemp & Barrel — Pineville, NC THCA & Hemp Store",
  description:
    "Get in touch with Hemp & Barrel. Visit us at 800 N Polk Street, Pineville NC, call (980) 326-4367, or send us a message. Expert CBD advice, fast responses.",
  openGraph: {
    title: "Contact Us | Hemp & Barrel",
    description: "Questions about CBD? We're here to help. Visit our Pineville, NC store or reach out online.",
    url: "https://hempandbarrel.com/contact",
  },
};

const CONTACT_PAGE_ID = 3035;

interface ContactAcf {
  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;
}

async function getContent(): Promise<ContactAcf | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages/${CONTACT_PAGE_ID}?acf_format=standard`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.acf ?? null;
}

export default async function ContactPage() {
  const acf = await getContent();
  if (!acf) return null;
  return (
    <ContactClient
      eyebrow={acf.hero_eyebrow}
      heading={acf.hero_heading}
      description={acf.hero_description}
    />
  );
}
