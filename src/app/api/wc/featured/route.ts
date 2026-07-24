import { NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";
const STORE  = `${WP_URL}/wp-json/wc/store/v1`;

/* Server-side proxy for featured products — avoids a direct browser-to-WP
   cross-origin fetch, which the WC Store API's CORS headers don't support
   once frontend and backend are on different origins (localhost dev, and
   the planned wp.hempandbarrel.com split). */
export async function GET() {
  const res = await fetch(`${STORE}/products?featured=true&per_page=20&stock_status=instock`, {
    headers: { "User-Agent": "Mozilla/5.0" },
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
