import { NextResponse } from "next/server";
import { cookies }       from "next/headers";

export async function POST() {
  const jar = await cookies();

  /* Clear JWT auth cookies */
  jar.delete("woo-auth");
  jar.delete("woo-refresh");

  /* Clear WP session cookies (set by fallback login) */
  for (const cookie of jar.getAll()) {
    if (
      cookie.name.startsWith("wordpress_") ||
      cookie.name.startsWith("woocommerce_") ||
      cookie.name.startsWith("wp-")
    ) {
      jar.delete(cookie.name);
    }
  }

  return NextResponse.json({ ok: true });
}
