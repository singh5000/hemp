import { NextResponse } from "next/server";
import { cookies }       from "next/headers";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

const VIEWER_QUERY = `query GetViewer { viewer { databaseId name email } }`;

export async function GET() {
  const jar       = await cookies();
  const authToken = jar.get("woo-auth")?.value;

  /* ── JWT path (WPGraphQL JWT plugin) ── */
  if (authToken) {
    try {
      const { gqlServer } = await import("@/lib/graphql/client");
      const data = await gqlServer<{ viewer: { databaseId: number; name: string; email: string } }>(
        VIEWER_QUERY, {}, authToken
      );
      if (data?.viewer) return NextResponse.json({ user: data.viewer });
    } catch {
      jar.delete("woo-auth");
    }
  }

  /* ── WordPress session cookie path ── */
  const wpCookies = jar.getAll().filter(c =>
    c.name.startsWith("wordpress_logged_in_") ||
    c.name.startsWith("wordpress_sec_")
  );

  if (wpCookies.length > 0) {
    const cookieHeader = wpCookies.map(c => `${c.name}=${c.value}`).join("; ");
    try {
      const res = await fetch(`${WP_URL}/wp-json/hemp/v1/me`, {
        headers: { Cookie: cookieHeader },
        cache:   "no-store",
      });
      if (res.ok) {
        const data = await res.json() as { user?: { databaseId: number; name: string; email: string } };
        if (data?.user) return NextResponse.json({ user: data.user });
      }
    } catch { /* WordPress unreachable — let localStorage handle it client-side */ }
  }

  return NextResponse.json({ user: null }, { status: 200 });
}
