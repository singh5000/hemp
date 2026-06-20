import { NextRequest, NextResponse } from "next/server";
import { cookies }                    from "next/headers";

const WP_URL  = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";
const STORE   = `${WP_URL}/wp-json/wc/store/v1`;
const SES_KEY = "wc-session";
const NON_KEY = "wc-nonce";

async function getSession(): Promise<string> {
  const jar = await cookies();
  return jar.get(SES_KEY)?.value ?? "";
}

async function getNonce(session: string): Promise<string> {
  const jar = await cookies();
  const saved = jar.get(NON_KEY)?.value ?? "";
  if (saved) return saved;
  try {
    const res = await fetch(`${WP_URL}/wp-json/hemp/v1/cart-nonce`, {
      headers: { "Content-Type": "application/json", ...(session ? { Cookie: session } : {}) },
      cache:   "no-store",
    });
    if (!res.ok) return "";
    const data = await res.json() as { nonce?: string };
    return String(data?.nonce ?? "");
  } catch { return ""; }
}

async function saveSession(resHeaders: Headers): Promise<void> {
  const jar  = await cookies();
  const list = resHeaders.getSetCookie?.() ?? [];
  if (!list.length) return;
  const existing: Record<string, string> = {};
  const prev = jar.get(SES_KEY)?.value ?? "";
  for (const p of prev.split(";").map(s => s.trim()).filter(Boolean)) {
    const i = p.indexOf("="); if (i > 0) existing[p.slice(0, i)] = p.slice(i + 1);
  }
  for (const raw of list) {
    const p = raw.split(";")[0].trim();
    const i = p.indexOf("="); if (i > 0) existing[p.slice(0, i)] = p.slice(i + 1);
  }
  const merged = Object.entries(existing).map(([k, v]) => `${k}=${v}`).join("; ");
  jar.set(SES_KEY, merged, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 30 * 24 * 3600 });
}

/* ── GET /api/wc/checkout — fetch payment methods only (fast path) ── */
export async function GET() {
  const session    = await getSession();
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 7000);

  try {
    const pmRes = await fetch(`${STORE}/payment-methods`, {
      headers: { "Content-Type": "application/json", ...(session ? { Cookie: session } : {}) },
      cache:   "no-store",
      signal:  controller.signal,
    });
    clearTimeout(timer);
    const paymentMethods = pmRes.ok ? await pmRes.json() : [];
    return NextResponse.json({ paymentMethods });
  } catch {
    clearTimeout(timer);
    return NextResponse.json({ paymentMethods: [] });
  }
}

/* ── POST /api/wc/checkout — place the order ── */
export async function POST(req: NextRequest) {
  const body    = await req.json() as Record<string, unknown>;
  const session = await getSession();
  const nonce   = await getNonce(session);

  try {
    const res = await fetch(`${STORE}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(nonce   ? { Nonce: nonce }   : {}),
        ...(session ? { Cookie: session } : {}),
      },
      body:  JSON.stringify(body),
      cache: "no-store",
    });

    await saveSession(res.headers);

    const data = await res.json() as Record<string, unknown>;
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
