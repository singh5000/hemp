"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const POSTS = [
  {
    image: "https://hempandbarrel.com/wp-content/uploads/sb-instagram-feed-images/722296291_1643827931080104_4649932939215026327_nfull.webp",
    link: "https://www.instagram.com/p/DZfeQoOkv4U/",
    caption: "Stop by the store and explore our full selection of premium CBD products. From smokable flower to tinctures and edibles — we've got something for everyone. 🌿 #HempAndBarrel #CBD #Charlotte",
  },
  {
    image: "https://hempandbarrel.com/wp-content/uploads/sb-instagram-feed-images/709447852_18163518793440918_3588008594783042132_nfull.webp",
    link: "https://www.instagram.com/p/DY7F8Pvxp9a/",
    caption: "Our cooler is fully stocked with the best CBD-infused beverages around! Come in and grab your favorites. 🥤❄️ #CBDBeverages #HempAndBarrel #Pineville",
  },
  {
    image: "https://hempandbarrel.com/wp-content/uploads/sb-instagram-feed-images/704702962_18162776179440918_453630530503265368_nfull.webp",
    link: "https://www.instagram.com/p/DYpC9xoARQR/",
    caption: "THE PATIO IS OPEN FOR THE SEASON! 🌞 Join us Saturday, June 13 from 4PM–9PM. Buy on the patio & get 25% OFF your in-store purchase! #HempAndBarrel #PatiaSeason",
  },
  {
    image: "https://hempandbarrel.com/wp-content/uploads/sb-instagram-feed-images/701636063_18162297784440918_7213258876688034002_nfull.webp",
    link: "https://www.instagram.com/p/DYc1EaTx312/",
    caption: "Our knowledgeable staff is here to help you find the perfect CBD product for your needs. Come visit us in store today! 💚 #HempAndBarrel #CBDExperts #Charlotte",
  },
  {
    image: "https://hempandbarrel.com/wp-content/uploads/sb-instagram-feed-images/699953477_18162144238440918_2623414395813736134_nfull.webp",
    link: "https://www.instagram.com/p/DYZiL84g5mM/",
    caption: "Today is a day to honor and remember those that have made the ultimate sacrifice for our freedom. 🇺🇸\n\nShop in store today to save 40% on your purchase, plus buy 3, get 1 free infused beverages.",
  },
];

const ALL_POSTS = [...POSTS, ...POSTS, ...POSTS];

export default function InstagramFeed() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (realIndex: number) => setLightboxIndex(realIndex % POSTS.length);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + POSTS.length) % POSTS.length));
  }, []);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % POSTS.length));
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, prev, next]);

  const activePost = lightboxIndex !== null ? POSTS[lightboxIndex] : null;

  return (
    <>
      <section className="bg-[#2a1008] py-12 overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-[#1A9248] text-xs font-bold uppercase tracking-[0.3em] mb-2">
            Let&apos;s Get Social
          </p>
          <Link
            href="https://www.instagram.com/hempandbarrel/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-4xl md:text-5xl font-bold uppercase tracking-widest hover:text-[#1A9248] transition-colors"
          >
            @HempAndBarrel
          </Link>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="flex gap-2 animate-marquee">
            {ALL_POSTS.map((post, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="flex-shrink-0 relative overflow-hidden group cursor-pointer border-0 p-0 bg-transparent"
                style={{ width: "260px", height: "260px" }}
                aria-label={`View Instagram post ${(i % POSTS.length) + 1}`}
              >
                <Image
                  src={post.image}
                  alt={`Hemp & Barrel Instagram post ${(i % POSTS.length) + 1}`}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="currentColor" viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .animate-marquee {
            animation: marquee 35s linear infinite;
            width: max-content;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Lightbox */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Prev arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal */}
          <div
            className="relative bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row w-full max-w-3xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image side */}
            <div className="relative w-full md:w-[420px] flex-shrink-0" style={{ aspectRatio: "1/1" }}>
              <Image
                src={activePost.image}
                alt="Hemp & Barrel Instagram post"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
            </div>

            {/* Content side */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-none">@hempandbarrel</p>
                  <p className="text-xs text-gray-400 mt-0.5">Hemp & Barrel</p>
                </div>
              </div>

              {/* Caption */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                  {activePost.caption}
                </p>
              </div>

              {/* Counter + Instagram link */}
              <div className="border-t border-gray-100 px-5 py-4 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">
                  {(lightboxIndex ?? 0) + 1} / {POSTS.length}
                </span>
                <Link
                  href={activePost.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#d6249f] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  View on Instagram
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
