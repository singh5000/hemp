"use client";

import { useState } from "react";
import Image from "next/image";

interface Img { src: string; alt: string }

export default function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  if (!main) {
    return (
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#3d2b1f] to-[#5a8c3a]/40" />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-[#f8f6f3] rounded-2xl overflow-hidden border border-gray-100">
        <Image src={main.src} alt={main.alt || name} fill
          className="object-contain p-4" sizes="(max-width:768px) 100vw, 50vw" priority />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === active ? "border-[#5a8c3a]" : "border-gray-200 hover:border-[#5a8c3a]/50"
              }`}>
              <Image src={img.src} alt={img.alt || `${name} ${i + 1}`} fill
                className="object-contain p-1" sizes="64px"/>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
