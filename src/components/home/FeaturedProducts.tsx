"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  prices: { price: string; regular_price: string; sale_price: string; currency_symbol: string };
  images: { src: string; alt: string }[];
  add_to_cart: { text: string; description: string };
  is_in_stock: boolean;
  featured: boolean;
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (id: number) => Promise<void> }) {
  const [adding, setAdding] = useState(false);
  const price = (parseInt(product.prices.price) / 100).toFixed(2);
  const regularPrice = (parseInt(product.prices.regular_price) / 100).toFixed(2);
  const onSale = product.prices.sale_price && product.prices.sale_price !== product.prices.regular_price;

  const handleAdd = async () => {
    if (!product.is_in_stock || adding) return;
    setAdding(true);
    await onAddToCart(product.id);
    setAdding(false);
  };

  return (
    <div className="flex-shrink-0 w-[260px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative h-[220px] bg-white p-4">
        {product.images[0] ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            fill
            className="object-contain p-3 hover:scale-105 transition-transform duration-300"
            sizes="260px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
          </div>
        )}
        {onSale && (
          <span className="absolute top-3 left-3 bg-[#5a8c3a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Sale
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-center text-lg font-bold text-[#3d2b1f] leading-snug mb-2 line-clamp-3 hover:text-[#5a8c3a] transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[#5a8c3a] font-bold text-base">
            {product.prices.currency_symbol}{price}
          </span>
          {onSale && (
            <span className="text-gray-400 text-sm line-through">
              {product.prices.currency_symbol}{regularPrice}
            </span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={!product.is_in_stock || adding}
          className={`mt-auto w-full py-3 rounded-lg text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
            !product.is_in_stock
              ? "bg-[#5a8c3a] cursor-not-allowed opacity-80"
              : adding
              ? "bg-[#4a7a2e] scale-95"
              : "bg-[#5a8c3a] hover:bg-[#4a7a2e] hover:scale-[1.02] active:scale-95"
          }`}
        >
          {!product.is_in_stock ? "Sold Out" : adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_WC_URL}/products?featured=true&per_page=12`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = 280;
    track.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }, []);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 10);
    setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 10);
  };

  const addToCart = async (productId: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_WC_URL}/cart/add-item`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId, quantity: 1 }),
    });
    await refreshCart();
  };

  return (
    <section className="py-16 bg-[#f2f2f2]">
      <div className="max-w-[1320px] mx-auto px-4">
        {/* Title */}
        <h2 className="text-center text-4xl font-bold text-[#3d2b1f] uppercase tracking-wider mb-10">
          Featured Products
        </h2>

        {loading ? (
          /* Skeleton */
          <div className="flex gap-5 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[260px] h-[380px] bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">No featured products found.</p>
        ) : (
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => scroll("left")}
              disabled={!canPrev}
              aria-label="Previous"
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-11 h-11 rounded-full bg-[#3d2b1f] text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:bg-[#5a8c3a] hover:scale-110 ${
                !canPrev ? "opacity-30 cursor-default" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Scrollable track */}
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scroll("right")}
              disabled={!canNext}
              aria-label="Next"
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-11 h-11 rounded-full bg-[#3d2b1f] text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:bg-[#5a8c3a] hover:scale-110 ${
                !canNext ? "opacity-30 cursor-default" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
