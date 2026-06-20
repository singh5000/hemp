import { NextRequest, NextResponse } from "next/server";

const WP_GRAPHQL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

export async function POST(req: NextRequest) {
  const body          = await req.text();
  const authToken     = req.headers.get("authorization");
  const sessionToken  = req.headers.get("woocommerce-session");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authToken    ? { Authorization: authToken }               : {}),
    ...(sessionToken ? { "woocommerce-session": sessionToken }    : {}),
  };

  const res = await fetch(WP_GRAPHQL, {
    method:  "POST",
    headers,
    body,
    cache:   "no-store",
  });

  const data      = await res.json();
  const nextRes   = NextResponse.json(data);

  /* Forward session token back to client so it can persist it */
  const newSession = res.headers.get("woocommerce-session");
  if (newSession) {
    nextRes.headers.set("woocommerce-session", newSession);
  }

  return nextRes;
}
