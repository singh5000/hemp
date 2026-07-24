"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface Slide {
  src: string;
  alt: string;
  href: string;
}

const AUTOPLAY_MS = 6000;
const SHARD_COLS = 6;
const SHARD_ROWS = 4;
const SHARD_COUNT = SHARD_COLS * SHARD_ROWS;

interface ShardSeed {
  rot: number;
  tx: number;
  ty: number;
  delay: number;
}

export default function HeroBannerClient({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [shattering, setShattering] = useState<number | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swapRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shardSeeds = useRef<ShardSeed[]>([]);

  const goTo = useCallback(
    (index: number) => {
      if (slides.length < 2 || index === current) return;

      shardSeeds.current = Array.from({ length: SHARD_COUNT }, () => ({
        rot: (Math.random() - 0.5) * 60,
        tx: (Math.random() - 0.5) * 220,
        ty: (Math.random() - 0.5) * 220,
        delay: Math.random() * 220,
      }));
      setShattering(index);

      if (swapRef.current) clearTimeout(swapRef.current);
      swapRef.current = setTimeout(() => {
        setCurrent(index);
        setShattering(null);
      }, 950);
    },
    [current, slides.length]
  );

  useEffect(() => {
    if (slides.length < 2) return;
    autoplayRef.current = setTimeout(() => {
      goTo((current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [current, goTo, slides.length]);

  useEffect(() => {
    return () => {
      if (swapRef.current) clearTimeout(swapRef.current);
    };
  }, []);

  if (slides.length === 0) return null;

  const incoming = shattering !== null ? slides[shattering] : null;

  return (
    <section className="relative -mt-[72px] overflow-hidden">
      <Link href={slides[current].href} aria-label={slides[current].alt} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slides[current].src}
          alt={slides[current].alt}
          className="block w-full h-auto"
        />
      </Link>

      {incoming && (
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${SHARD_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${SHARD_ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: SHARD_COUNT }).map((_, i) => {
            const col = i % SHARD_COLS;
            const row = Math.floor(i / SHARD_COLS);
            const seed = shardSeeds.current[i] ?? { rot: 0, tx: 0, ty: 0, delay: 0 };
            return (
              <span
                key={i}
                className="hero-shard"
                style={
                  {
                    backgroundImage: `url(${incoming.src})`,
                    backgroundSize: `${SHARD_COLS * 100}% ${SHARD_ROWS * 100}%`,
                    backgroundPosition: `${(col / (SHARD_COLS - 1)) * 100}% ${(row / (SHARD_ROWS - 1)) * 100}%`,
                    animationDelay: `${seed.delay}ms`,
                    "--shard-rot": `${seed.rot}deg`,
                    "--shard-tx": `${seed.tx}px`,
                    "--shard-ty": `${seed.ty}px`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-2xl text-[#2a1008] shadow-md transition hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo((current + 1) % slides.length)}
            className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-2xl text-[#2a1008] shadow-md transition hover:bg-white"
          >
            ›
          </button>
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === current ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
