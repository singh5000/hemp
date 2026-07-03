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

export default function ContactPage() {
  return <ContactClient />;
}
