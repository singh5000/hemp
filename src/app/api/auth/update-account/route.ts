import { NextResponse } from "next/server";
import { cookies }       from "next/headers";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

export async function POST(req: Request) {
  const body = await req.json();
  const jar  = await cookies();

  /* Forward WordPress session cookies so PHP can call get_current_user_id() */
  const wpCookieHeader = jar
    .getAll()
    .filter(c => c.name.startsWith("wordpress") || c.name.startsWith("wp_"))
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  /* Also try JWT Bearer if we stored one */
  const authToken = jar.get("woo-auth")?.value;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken)      headers["Authorization"] = `Bearer ${authToken}`;
  if (wpCookieHeader) headers["Cookie"]        = wpCookieHeader;

  /* Include authEmail + authPassword from body for fallback auth in PHP */
  const res  = await fetch(`${WP_URL}/wp-json/hemp/v1/update-account`, {
    method:  "POST",
    headers,
    body:    JSON.stringify(body),
  });

  const data = await res.json() as { message?: string; code?: string };

  if (!res.ok) {
    return NextResponse.json(
      { error: data.message ?? "Account update failed." },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
