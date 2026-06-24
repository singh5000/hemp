import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const KNOWN_PREFIXES = new Set([
  "about-us", "api", "blog", "cart", "checkout", "contact", "faqs",
  "lab-reports", "login", "my-account", "privacy-policy", "product",
  "product-category", "register", "returns-exchanges", "shipping-delivery",
  "shop", "terms-conditions", "_next", "favicon.ico",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  // Redirect /blog/slug → /slug (301 for SEO migration)
  if (firstSegment === "blog" && pathname !== "/blog") {
    const slug = pathname.replace(/^\/blog/, "");
    const url = request.nextUrl.clone();
    url.pathname = slug;
    return NextResponse.redirect(url, 301);
  }

  if (KNOWN_PREFIXES.has(firstSegment) || firstSegment.includes(".")) {
    return NextResponse.next();
  }

  // Rewrite /slug → /blog/slug internally (URL stays as /slug)
  const url = request.nextUrl.clone();
  url.pathname = `/blog${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\..+).*)"],
};
