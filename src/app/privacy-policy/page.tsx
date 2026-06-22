import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Hemp & Barrel",
  description:
    "Hemp & Barrel privacy policy — how we collect, use, and protect information gathered through our website, customer service, retail store, and marketing promotions.",
};

const SECTIONS = [
  {
    id: "introduction",
    title: "Hemp & Barrel Privacy Policy",
    content: `Hemp & Barrel and each of their respective subsidiary, parent and affiliated companies is deemed to operate this Website ("we" or "us") recognizes that you care how information about you is used and shared. We have created this Privacy Policy to inform you what information we collect on the Website, how we use your information and the choices you have about the way your information is collected and used.`,
  },
  {
    id: "scope",
    title: "Scope of This Policy",
    content: `Please be advised that the practices described in this Privacy Policy apply to information gathered by us or our subsidiaries, affiliates or agents: (i) through this Website, (ii) where applicable, through our Customer Service Department in connection with this Website, (iii) through information provided to us in our free standing retail stores, and (iv) through information provided to us in conjunction with marketing promotions and sweepstakes.`,
  },
  {
    id: "modifications",
    title: "Modifications to This Policy",
    content: `Hemp & Barrel reserves the right to modify, update, add to, discontinue, remove or otherwise change any portion of this Privacy Policy, in whole or in part, at any time. When we amend this Privacy Policy, we will revise the date listed on this page. If we make material changes to this policy, we may notify you by email or by means of a notice on our website. Your continued use of the website after any such changes constitutes your acceptance of the new Privacy Policy.`,
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    content: null,
    list: [
      "Name, email address, phone number, and mailing address when you place an order or create an account",
      "Payment information (processed securely — we do not store full card numbers)",
      "Order history and purchase details",
      "Information you provide when contacting our customer service department",
      "Usage data including pages visited, time spent on site, and referring URLs",
      "Device and browser information for analytics and site improvement",
    ],
    listIntro: "We may collect the following types of information:",
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: null,
    list: [
      "Process and fulfill your orders",
      "Send order confirmations and shipping updates",
      "Respond to customer service inquiries",
      "Send promotional emails and special offers (you may opt out at any time)",
      "Improve our website and product offerings",
      "Comply with legal obligations",
    ],
    listIntro: "We use the information we collect to:",
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    content: `Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our website may not function properly.`,
  },
  {
    id: "third-party",
    title: "Third Party Websites",
    content: `This website may contain links to third-party websites. Hemp & Barrel is not responsible for the privacy practices or the content of any third-party websites. We encourage you to read the privacy policies of any linked site you visit. Accessing third-party websites through links on our site is done entirely at your own risk.`,
  },
  {
    id: "data-security",
    title: "Data Security",
    content: `We take reasonable measures to protect the information we collect from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee the absolute security of your information.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy or how your information is handled, please contact our Customer Service Department.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#2a1008] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #1A9248 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[#1A9248]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1320px] mx-auto px-4 py-20 md:py-24">
          <nav className="flex items-center gap-2 text-white/40 text-sm mb-7">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">Privacy Policy</span>
          </nav>
          <p className="text-[#1A9248] text-xs font-bold uppercase tracking-[0.4em] mb-3">Legal</p>
          <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
            Privacy <span className="text-[#1A9248]">Policy</span>
          </h1>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-[1320px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* ── TOC sidebar ── */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-4">Contents</p>
              <nav className="space-y-0.5">
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`}
                    className="block text-xs text-gray-500 hover:text-[#1A9248] py-1.5 pl-3 border-l-2 border-transparent hover:border-[#1A9248] transition-all leading-snug">
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Policy text ── */}
          <div className="flex-1 min-w-0 space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-6 bg-[#1A9248] rounded-full flex-shrink-0" />
                  <h2 className="text-[#2a1008] text-xl font-bold">{section.title}</h2>
                </div>
                <div className="pl-5 space-y-3">
                  {section.content && (
                    <p className="text-[#3d2b1f] text-[15px] leading-relaxed">{section.content}</p>
                  )}
                  {section.listIntro && (
                    <p className="text-[#3d2b1f] text-[15px] leading-relaxed">{section.listIntro}</p>
                  )}
                  {section.list && (
                    <ul className="space-y-2 mt-2">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-[#3d2b1f]">
                          <svg className="w-4 h-4 text-[#1A9248] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.id === "contact" && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3 mt-2">
                      <a href="mailto:customerservice@email.com"
                        className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#1A9248] transition-colors">
                        <svg className="w-4 h-4 text-[#1A9248] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        customerservice@email.com
                      </a>
                      <a href="tel:9803264367"
                        className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#1A9248] transition-colors">
                        <svg className="w-4 h-4 text-[#1A9248] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        (980) 326-4367
                      </a>
                      <div className="pt-2">
                        <Link href="/contact"
                          className="inline-flex items-center gap-2 bg-[#1A9248] hover:bg-[#148038] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors">
                          Contact Us
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
