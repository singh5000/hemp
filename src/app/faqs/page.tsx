import type { Metadata } from "next";
import FaqsClient from "./FaqsClient";

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

export default function FaqsPage() {
  return <FaqsClient />;
}
