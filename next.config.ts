import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost"],
  compress: true,
  images: {
    dangerouslyAllowSVG: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes:  [16, 32, 64, 96, 128, 256, 384],
    qualities: [75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hempandbarrel.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/hemp/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/hemp/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
  async redirects() {
    return [
      // Policy page aliases
      { source: "/returns",              destination: "/returns-exchanges",    permanent: true },
      { source: "/return-policy",        destination: "/returns-exchanges",    permanent: true },
      { source: "/refund-policy",        destination: "/returns-exchanges",    permanent: true },
      { source: "/shipping",             destination: "/shipping-delivery",    permanent: true },
      { source: "/terms",                destination: "/terms-conditions",     permanent: true },
      { source: "/terms-and-conditions", destination: "/terms-conditions",     permanent: true },
      { source: "/privacy",              destination: "/privacy-policy",       permanent: true },
      { source: "/about",                destination: "/about-us",             permanent: true },
      // Blog URL migration: /blog/slug → /slug
      { source: "/blog/:slug", destination: "/:slug", permanent: true },
      // Old WooCommerce category slug aliases
      { source: "/product-category/cbd-gummies",    destination: "/product-category/edibles-gummies",    permanent: true },
      { source: "/product-category/cbd-beverages",  destination: "/product-category/infused-beverages",  permanent: true },
      { source: "/product-category/cbd-tincture",   destination: "/product-category/tinctures",          permanent: true },
      { source: "/product-category/subscriptions",  destination: "/product-category/subitems",           permanent: true },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: isDev ? "no-store" : "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|webp|avif|svg|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
