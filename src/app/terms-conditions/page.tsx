import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Hemp & Barrel",
  description:
    "Terms and conditions governing use of the Hemp & Barrel website. By visiting our site you agree to these terms.",
};

const SECTIONS = [
  {
    id: "account-terms",
    title: "Account Terms",
    content: `Registration grants access to pricing and order placement. Users are responsible for maintaining the security of their account and must take all steps to prevent unauthorized access. Hemp & Barrel reserves the right to refuse or cancel accounts at its discretion.`,
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    content: null,
    list: [
      "Post or transmit unlawful, threatening, or obscene content",
      "Transmit harmful software, viruses, or malicious code",
      "Distribute copyrighted material without express permission",
      "Share account credentials or access with third parties",
    ],
    listIntro: "Users of this website may not:",
  },
  {
    id: "modification",
    title: "Modification of These Terms & Conditions",
    content: `Hemp & Barrel may modify these Terms & Conditions at any time without prior notice. Changes become effective immediately upon posting to the website. Your continued use of the site following any modification constitutes your acceptance of the revised terms.`,
  },
  {
    id: "payment",
    title: "Payment",
    content: `Customers agree to pay the full purchase price and to provide a valid payment method for all purchases made through this website. All prices are listed in US dollars. Hemp & Barrel reserves the right to refuse or cancel orders where incorrect pricing has been displayed.`,
  },
  {
    id: "electronic-communications",
    title: "Electronic Communications",
    content: `By using this website, you consent to receiving electronic communications from Hemp & Barrel. You acknowledge that all agreements, notices, disclosures, and other communications provided to you electronically satisfy any legal requirement that such communications be in writing. Submitting an order or form online constitutes a binding agreement.`,
  },
  {
    id: "copyright",
    title: "Copyright and Licences",
    content: `All content on this website — including text, graphics, logos, images, audio clips, and software — belongs exclusively to Hemp & Barrel and is protected by applicable copyright and intellectual property laws. Users may not reproduce, distribute, publish, or create derivative works from any content on this site without prior written permission from Hemp & Barrel.`,
  },
  {
    id: "licences",
    title: "Licences",
    content: `Hemp & Barrel grants you a limited, non-exclusive, non-transferable licence to access and use this website for personal, non-commercial purposes only. This licence does not permit modification of any content, commercial exploitation, reproduction, or redistribution of any materials found on this site.`,
  },
  {
    id: "disclaimer",
    title: "Disclaimer of Warranty / Limitation of Liability",
    content: `This website and all content are provided "as is" without warranties of any kind, either express or implied. Hemp & Barrel disclaims all liability for any damages arising from your use of — or inability to use — this website or its content. Hemp & Barrel reserves the right to refuse or cancel any order where pricing errors have occurred.`,
  },
  {
    id: "third-party",
    title: "Third Party Links",
    content: `This website may contain links to third-party websites. These links are provided for your convenience only. Hemp & Barrel does not endorse or take responsibility for the content, privacy practices, or accuracy of any third-party websites. Accessing linked sites is entirely at your own risk.`,
  },
  {
    id: "applicable-law",
    title: "Applicable Law",
    content: `These Terms & Conditions shall be governed by and construed in accordance with the laws of England and Wales.`,
  },
  {
    id: "disputes",
    title: "Disputes",
    content: `Any dispute, claim, or controversy arising out of or relating to these Terms & Conditions or the use of this website shall be resolved by binding arbitration in Charlotte, NC. By using this website, you waive the right to a jury trial or to participate in a class action lawsuit.`,
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: `You agree to defend, indemnify, and hold harmless Hemp & Barrel and its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms & Conditions or your use of this website.`,
  },
  {
    id: "other-provisions",
    title: "Other Provisions",
    content: `If any provision of these Terms & Conditions is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining terms remain in full force and effect. Hemp & Barrel may assign its rights and obligations under these Terms at any time without notice.`,
  },
];

export default function TermsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#2a1008] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #5a8c3a 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[#5a8c3a]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full mx-auto px-[70px] py-20 md:py-24">
          <nav className="flex items-center gap-2 text-white/40 text-sm mb-7">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">Terms &amp; Conditions</span>
          </nav>
          <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.4em] mb-3">Legal</p>
          <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-5">
            Terms &amp; <span className="text-[#5a8c3a]">Conditions</span>
          </h1>
        </div>
      </section>

      {/* ── Agreement notice ── */}
      <div className="bg-[#2a1008] border-t border-white/10">
        <div className="w-full mx-auto px-[70px] py-5">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest text-center">
            By visiting Hemp and Barrel website you agree to the following Terms &amp; Conditions.
          </p>
        </div>
      </div>

      {/* ── Age notice ── */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="w-full mx-auto px-[70px] py-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p className="text-amber-800 text-sm font-bold uppercase tracking-wide">
            This website is not intended for persons under 18 years of age.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="w-full mx-auto px-[70px] py-16">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* ── TOC sidebar ── */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#5a8c3a] mb-4">Contents</p>
              <nav className="space-y-0.5">
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`}
                    className="block text-xs text-gray-500 hover:text-[#5a8c3a] py-1.5 pl-3 border-l-2 border-transparent hover:border-[#5a8c3a] transition-all leading-snug">
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
                  <div className="w-1.5 h-6 bg-[#5a8c3a] rounded-full flex-shrink-0" />
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
                          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {/* Contact section */}
            <div id="contact" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-[#5a8c3a] rounded-full flex-shrink-0" />
                <h2 className="text-[#2a1008] text-xl font-bold">Contact Us</h2>
              </div>
              <div className="pl-5">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#3d2b1f]">
                    <svg className="w-4 h-4 text-[#5a8c3a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    800 N Polk Street, Pineville, NC 28134
                  </div>
                  <a href="tel:9803264367" className="flex items-center gap-3 text-sm text-[#3d2b1f] hover:text-[#5a8c3a] transition-colors">
                    <svg className="w-4 h-4 text-[#5a8c3a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    (980) 326-4367
                  </a>
                  <div className="flex items-center gap-3 text-sm text-[#3d2b1f]">
                    <svg className="w-4 h-4 text-[#5a8c3a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Mon–Sat: 10am – 8pm &nbsp;|&nbsp; Sun: 12pm – 4pm
                  </div>
                  <div className="pt-2">
                    <Link href="/contact"
                      className="inline-flex items-center gap-2 bg-[#5a8c3a] hover:bg-[#4a7a2e] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
