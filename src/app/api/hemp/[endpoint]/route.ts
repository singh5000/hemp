import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

const ALLOWED_ENDPOINTS = ["newsletter", "contact", "review", "notify-restock"];

/* Server-side proxy for the custom hemp/v1/* actions — avoids a direct
   browser-to-WP cross-origin POST, which fails once frontend and backend
   are on different origins (localhost dev, and the planned
   wp.hempandbarrel.com split). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params;
  if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const body = await req.text();
  const res = await fetch(`${WP_URL}/wp-json/hemp/v1/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
    body,
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
