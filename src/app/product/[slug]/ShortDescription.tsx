"use client";

import { useState } from "react";

export default function ShortDescription({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t border-gray-100 pt-4">
      <div
        className={`text-[#3d2b1f] text-[16px] leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 ${
          expanded ? "" : "line-clamp-2"
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="mt-1.5 text-[#1A9248] text-[14px] font-bold hover:underline"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
