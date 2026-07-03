import Link from "next/link";
import Image from "next/image";
import { Leaf } from "lucide-react";

interface Crumb { label: string; href?: string }

interface Props {
  crumbs?: Crumb[];
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  cta?: React.ReactNode;
  aside?: React.ReactNode;
  compact?: boolean;
}

export default function PageBanner({
  crumbs, eyebrow, title, description, align = "left", cta, aside, compact = false,
}: Props) {
  const centered = align === "center";

  return (
    <section className="relative bg-gradient-to-br from-white via-[#faf7f1] to-[#f0e9d8] overflow-hidden border-b border-[#1A9248]/10">
      {/* Dot-grid texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #1A9248 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />

      {/* Glow blobs for depth + color */}
      <div className="absolute -right-20 -top-32 w-[420px] h-[420px] rounded-full bg-[#1A9248]/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-32 bottom-0 w-[360px] h-[360px] rounded-full bg-[#c9986a]/15 blur-3xl pointer-events-none" />

      {/* Decorative rings */}
      <div className="absolute right-10 top-10 w-[220px] h-[220px] rounded-full border border-dashed border-[#1A9248]/40 pointer-events-none" />
      <div className="absolute right-24 top-24 w-[120px] h-[120px] rounded-full border border-[#1A9248]/20 pointer-events-none" />

      {/* Leaf motif */}
      <Image src="/hemp-leaf.png" alt="" width={230} height={230}
        className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.14] rotate-[18deg] pointer-events-none select-none" />

      <div className={`relative max-w-[1320px] mx-auto px-4 ${compact ? "py-8 md:py-10" : "py-12 md:py-14"}`}>
        <div className={`flex flex-col ${aside ? "md:flex-row md:items-end md:justify-between" : ""} gap-8 ${centered ? "text-center items-center" : ""}`}>
          <div className={centered ? "mx-auto" : "min-w-0"}>
            {crumbs && crumbs.length > 0 && (
              <nav className={`flex items-center gap-2 text-gray-400 text-[13px] mb-4 flex-wrap ${centered ? "justify-center" : ""}`}>
                <Link href="/" className="hover:text-[#1A9248] transition-colors">Home</Link>
                {crumbs.map((c, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span>/</span>
                    {c.href ? (
                      <Link href={c.href} className="hover:text-[#1A9248] transition-colors">{c.label}</Link>
                    ) : (
                      <span className="text-[#2a1008] font-medium">{c.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}

            {eyebrow && (
              <div className={`flex items-center gap-2.5 mb-3 ${centered ? "justify-center" : ""}`}>
                <span className="w-7 h-7 rounded-full bg-[#1A9248]/10 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-3.5 h-3.5 text-[#1A9248]" />
                </span>
                <span className="text-[#1A9248] text-[12px] font-bold uppercase tracking-[0.3em]">{eyebrow}</span>
              </div>
            )}

            <h1 className={`text-[#2a1008] font-black leading-[1.15] ${compact ? "text-[30px] md:text-[34px]" : "text-[34px] md:text-[44px]"} ${description || cta ? "mb-3" : ""}`}>
              {title}
            </h1>

            {description && (
              <p className={`text-[#5a4a3f] text-[15.5px] leading-relaxed ${centered ? "max-w-lg mx-auto" : "max-w-[560px]"} ${cta ? "mb-6" : ""}`}>
                {description}
              </p>
            )}

            {cta && <div className={centered ? "flex justify-center" : ""}>{cta}</div>}
          </div>

          {aside && <div className="relative flex-shrink-0">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
