"use client";
import { useRef, useState, useCallback } from "react";

const reviews = [
  {
    name: "Erin Flack",
    source: "Google Review",
    text: "I love that these guys are knowledgeable about their product and hands on from farm to shelf. They were definitely genuine in their efforts to listen and help with my specific needs. I'm a fan of their oil....and my dogs are too! Great product, great people.",
  },
  {
    name: "Alyvia D",
    source: "Google Review",
    text: "This is a really cool place! It really had that west coast dispo vibe and all the staff were really friendly and helped me to get the best deals. Really really knowledgeable on their products! I will be returning soon!",
  },
  {
    name: "SM",
    source: "Google Review",
    text: "I've been working with Matt for the past few years. He's so knowledgeable and is wonderful about suggesting the best product to help me. 15/10 I would recommend to everyone I know. Thanks Matt!",
  },
  {
    name: "Cesar Lizano",
    source: "Google Review",
    text: "Best place in Charlotte for your CBD & Delta 8 needs! Most genuine store with the most variety and friendly service. Highly recommend!",
  },
  {
    name: "Alicia Malcomb",
    source: "Google Review",
    text: "These guys really know their stuff! The staff is super friendly and incredibly helpful. They have been able to give me the right tools to help me manage my stress.",
  },
  {
    name: "Eric Armstrong",
    source: "Google Review",
    text: "Since last December I have been a loyal customer, the staff is very helpful and have taught me a lot about the properties and benefits of HEMP CBD.",
  },
];

function StarRating() {
  return (
    <div className="flex gap-1 justify-center mb-5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 fill-[#f5a623]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const scroll = useCallback((dir: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir === "right" ? 420 : -420, behavior: "smooth" });
  }, []);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 10);
    setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 10);
  };

  return (
    <section className="py-20 bg-[#f8f5f0]">
      <div className="w-full mx-auto px-[15px]">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#5a8c3a] font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Customer Reviews
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-[#3d2b1f] uppercase tracking-widest">
            People Love Us
          </h2>
        </div>

        <div className="relative px-6">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canPrev}
            aria-label="Previous"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#3d2b1f] text-white flex items-center justify-center shadow-xl transition-all duration-200 hover:bg-[#5a8c3a] hover:scale-110 ${
              !canPrev ? "opacity-20 cursor-default" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable Track */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviews.map((review) => (
              <div
                key={review.name}
                className="flex-shrink-0 w-[400px] bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 p-10 flex flex-col relative overflow-hidden"
              >
                {/* Decorative quote mark */}
                <span className="absolute top-4 right-6 text-[110px] leading-none text-[#5a8c3a]/10 font-serif select-none pointer-events-none">
                  "
                </span>

                {/* Stars */}
                <StarRating />

                {/* Review text */}
                <p className="text-[#3d2b1f] text-lg leading-relaxed text-center flex-1 relative z-10">
                  "{review.text}"
                </p>

                {/* Divider */}
                <div className="w-12 h-0.5 bg-[#5a8c3a] mx-auto my-6" />

                {/* Reviewer */}
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[#5a8c3a] text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                    {review.name.charAt(0)}
                  </div>
                  <p className="text-[#5a8c3a] font-bold text-base">{review.name}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <p className="text-[#888] text-sm">{review.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canNext}
            aria-label="Next"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#3d2b1f] text-white flex items-center justify-center shadow-xl transition-all duration-200 hover:bg-[#5a8c3a] hover:scale-110 ${
              !canNext ? "opacity-20 cursor-default" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
