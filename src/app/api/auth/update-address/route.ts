import { NextResponse } from "next/server";
import { cookies }       from "next/headers";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

export async function POST(req: Request) {
  const body = await req.json();
  const jar  = await cookies();

  const wpCookieHeader = jar
    .getAll()
    .filter(c => c.name.startsWith("wordpress") || c.name.startsWith("wp_"))
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  const authToken = jar.get("woo-auth")?.value;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken)      headers["Authorization"] = `Bearer ${authToken}`;
  if (wpCookieHeader) headers["Cookie"]        = wpCookieHeader;

  const res  = await fetch(`${WP_URL}/wp-json/hemp/v1/update-address`, {
    method:  "POST",
    headers,
    body:    JSON.stringify(body),
  });

  const data = await res.json() as { message?: string };

  if (!res.ok) {
    return NextResponse.json({ error: data.message ?? "Failed to save address." }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}
