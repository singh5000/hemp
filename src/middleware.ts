import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const KNOWN_PREFIXES = new Set([
  "about-us", "api", "author", "blog", "cart", "checkout", "contact", "faqs",
  "lab-reports", "login", "my-account", "privacy-policy", "product",
  "product-category", "register", "returns-exchanges", "shipping-delivery",
  "shop", "terms-conditions", "_next", "favicon.ico",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  if (KNOWN_PREFIXES.has(firstSegment) || firstSegment.includes(".")) {
    return NextResponse.next();
  }

  // Unknown root-level slug → serve blog post from /blog/slug internally
  const url = request.nextUrl.clone();
  url.pathname = `/blog${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\..+).*)"],
};
