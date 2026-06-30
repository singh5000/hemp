"use client";

import { useEffect, useState } from "react";

interface Heading { id: string; text: string; level: number }

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-[16.5px] font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-4">
        Table of Contents
      </p>
      <ol className="space-y-1">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? "1rem" : h.level === 4 ? "1.75rem" : "0" }}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`block text-sm py-1 leading-snug transition-all duration-150 border-l-2 pl-3 ${
                active === h.id
                  ? "border-[#1A9248] text-[#1A9248] font-semibold"
                  : "border-transparent text-gray-500 hover:text-[#3d2b1f] hover:border-gray-300"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
