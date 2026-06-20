import { NextRequest, NextResponse } from "next/server";
import { cookies }                    from "next/headers";

const WP_URL  = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";
const STORE   = `${WP_URL}/wp-json/wc/store/v1`;
const SES_KEY = "wc-session";
const NON_KEY = "wc-nonce";

/* ── Session helpers ── */
async function getSession(): Promise<string> {
  const jar = await cookies();
  return jar.get(SES_KEY)?.value ?? "";
}
async function getSavedNonce(): Promise<string> {
  const jar = await cookies();
  return jar.get(NON_KEY)?.value ?? "";
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

async function saveNonce(resHeaders: Headers): Promise<string> {
  /* WC Store API returns nonce in X-WC-Store-API-Nonce on every response */
  const nonce = resHeaders.get("x-wc-store-api-nonce") ?? resHeaders.get("X-WC-Store-API-Nonce") ?? "";
  if (nonce) {
    const jar = await cookies();
    jar.set(NON_KEY, nonce, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 24 * 3600 });
  }
  return nonce;
}

/* ── Nonce sources (tried in order) ── */

/* 1. Custom PHP endpoint (add snippet to functions.php — see wordpress-webp-snippet.php) */
async function nonceFromPhp(session: string): Promise<string> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/hemp/v1/cart-nonce`, {
      headers: { "Content-Type": "application/json", ...(session ? { Cookie: session } : {}) },
      cache:   "no-store",
    });
    if (!res.ok) return "";
    const data = await res.json() as Record<string, unknown>;
    return String(data?.nonce ?? "");
  } catch { return ""; }
}

/* 2. GET /cart — WC Store API returns nonce in response headers (WooCommerce Blocks 9+) */
async function nonceFromGet(session: string): Promise<string> {
  try {
    const res = await fetch(`${STORE}/cart`, {
      headers: { "Content-Type": "application/json", ...(session ? { Cookie: session } : {}) },
      cache:   "no-store",
    });
    await saveSession(res.headers);
    return await saveNonce(res.headers);
  } catch { return ""; }
}

async function getBestNonce(session: string): Promise<string> {
  const saved = await getSavedNonce();
  if (saved) return saved;
  const fromPhp = await nonceFromPhp(session);
  if (fromPhp) return fromPhp;
  return nonceFromGet(session);
}

/* ── Price formatter ── */
function fmt(minor: string | number, unit: number, prefix: string): string {
  return `${prefix}${(parseInt(String(minor || 0)) / Math.pow(10, unit)).toFixed(2)}`;
}

/* ── Parse WC shipping_rates array ── */
function parseShippingRates(raw: Record<string, unknown>) {
  const pkgs = (raw.shipping_rates ?? []) as Array<Record<string, unknown>>;
  const tot  = (raw.totals ?? {}) as Record<string, unknown>;
  const unit = Number(tot.currency_minor_unit ?? 2);
  const pfx  = String(tot.currency_prefix ?? tot.currency_symbol ?? "$");

  return pkgs.map(pkg => ({
    packageId:   Number(pkg.package_id ?? 0),
    packageName: String(pkg.name ?? "Shipping"),
    rates: ((pkg.shipping_rates ?? []) as Array<Record<string, unknown>>).map(r => ({
      rateId:   String(r.rate_id ?? ""),
      name:     String(r.name ?? ""),
      price:    Number(r.price ?? 0) === 0 ? "Free" : fmt(String(r.price ?? 0), unit, pfx),
      selected: Boolean(r.selected),
    })),
  }));
}

/* ── Parse WC Store API cart → CartData ── */
function parseWcCart(raw: Record<string, unknown> | null) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  const tot  = (raw.totals ?? {}) as Record<string, unknown>;
  const unit = Number(tot.currency_minor_unit ?? 2);
  const pfx  = String(tot.currency_prefix ?? tot.currency_symbol ?? "$");

  const items = ((raw.items ?? []) as Record<string, unknown>[]).map(item => {
    const prices = (item.prices  ?? {}) as Record<string, unknown>;
    const totals = (item.totals  ?? {}) as Record<string, unknown>;
    const imgs   = (item.images  as { src: string; alt?: string }[] | null) ?? [];
    const vars   = (item.variation as { attribute: string; value: string }[] | null) ?? [];
    const pUnit  = Number(prices.currency_minor_unit ?? unit);
    const tUnit  = Number(totals.currency_minor_unit ?? unit);

    const slug = (() => {
      try { return new URL(String(item.permalink ?? "")).pathname.replace(/^\/|\/$/g, "").split("/").pop() ?? String(item.id); }
      catch { return String(item.id); }
    })();

    return {
      key:      String(item.key),
      quantity: Number(item.quantity),
      total:    fmt(String(totals.line_total ?? 0), tUnit, pfx),
      product:  {
        databaseId: Number(item.id),
        name:       String(item.name),
        slug,
        price:  fmt(String(prices.price ?? 0), pUnit, pfx),
        image:  imgs[0] ? { sourceUrl: imgs[0].src, altText: imgs[0].alt ?? String(item.name) } : undefined,
      },
      variation: vars.length ? {
        databaseId: Number(item.id),
        price:      fmt(String(prices.price ?? 0), pUnit, pfx),
        image:      undefined as undefined,
        attributes: { nodes: vars.map(v => ({ name: v.attribute, value: v.value })) },
      } : null,
    };
  });

  /* Applied coupons */
  const coupons = ((raw.coupons ?? []) as Record<string, unknown>[]).map(c => {
    const cTot = (c.totals ?? {}) as Record<string, unknown>;
    const cUnit = Number(cTot.currency_minor_unit ?? unit);
    return {
      code:     String(c.code ?? ""),
      discount: fmt(String(cTot.total_discount ?? 0), cUnit, pfx),
    };
  });

  const discountRaw = Number(tot.total_discount ?? 0);

  return {
    total:         fmt(String(tot.total_price    ?? 0), unit, pfx),
    subtotal:      fmt(String(tot.total_items    ?? 0), unit, pfx),
    discount:      discountRaw > 0 ? fmt(String(discountRaw), unit, pfx) : undefined,
    totalTax:      fmt(String(tot.total_tax      ?? 0), unit, pfx),
    shippingTotal: fmt(String(tot.total_shipping ?? 0), unit, pfx),
    isEmpty:       Number(raw.items_count ?? 0) === 0,
    itemCount:     Number(raw.items_count ?? 0),
    items,
    coupons,
  };
}

/* ── GET /api/wc/cart ── */
export async function GET() {
  const session = await getSession();
  try {
    const res = await fetch(`${STORE}/cart`, {
      headers: { "Content-Type": "application/json", ...(session ? { Cookie: session } : {}) },
      cache:   "no-store",
    });
    await saveSession(res.headers);
    await saveNonce(res.headers);
    const raw = await res.json() as Record<string, unknown>;
    if (!res.ok) return NextResponse.json({ error: raw?.message ?? "Failed" }, { status: res.status });
    return NextResponse.json({ cart: parseWcCart(raw) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/* ── POST /api/wc/cart ── */
export async function POST(req: NextRequest) {
  const body    = await req.json() as Record<string, unknown>;
  const action  = String(body.action ?? "");
  const session = await getSession();
  let   nonce   = await getBestNonce(session);

  const doRequest = async (n: string): Promise<Response> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(n       ? { Nonce: n }        : {}),
      ...(session ? { Cookie: session } : {}),
    };
    if (action === "add") {
      return fetch(`${STORE}/cart/add-item`, {
        method: "POST", headers, cache: "no-store",
        body:   JSON.stringify({ id: Number(body.productId), quantity: Number(body.quantity ?? 1) }),
      });
    }
    if (action === "remove") {
      return fetch(`${STORE}/cart/remove-item`, {
        method: "POST", headers, cache: "no-store",
        body:   JSON.stringify({ key: String(body.key) }),
      });
    }
    if (action === "update") {
      return fetch(`${STORE}/cart/update-item`, {
        method: "POST", headers, cache: "no-store",
        body:   JSON.stringify({ key: String(body.key), quantity: Number(body.quantity) }),
      });
    }
    if (action === "clear") {
      return fetch(`${STORE}/cart/items`, { method: "DELETE", headers, cache: "no-store" });
    }
    if (action === "apply-coupon") {
      return fetch(`${STORE}/cart/coupons`, {
        method: "POST", headers, cache: "no-store",
        body:   JSON.stringify({ code: String(body.code ?? "") }),
      });
    }
    if (action === "remove-coupon") {
      return fetch(`${STORE}/cart/coupons/${encodeURIComponent(String(body.code ?? ""))}`, {
        method: "DELETE", headers, cache: "no-store",
      });
    }
    if (action === "update-customer") {
      return fetch(`${STORE}/cart/update-customer`, {
        method: "POST", headers, cache: "no-store",
        body:   JSON.stringify({
          billing_address:  body.billing  ?? {},
          shipping_address: body.shipping ?? {},
        }),
      });
    }
    if (action === "select-shipping-rate") {
      return fetch(`${STORE}/cart/select-shipping-rate`, {
        method: "POST", headers, cache: "no-store",
        body:   JSON.stringify({
          package_id: Number(body.package_id ?? 0),
          rate_id:    String(body.rate_id    ?? ""),
        }),
      });
    }
    throw new Error("Unknown action");
  };

  try {
    let res = await doRequest(nonce);

    /* 401 = nonce missing/invalid → try fresh nonce sources and retry once */
    if (res.status === 401) {
      const freshFromPhp = await nonceFromPhp(session);
      const freshNonce   = freshFromPhp || await nonceFromGet(session);
      if (freshNonce) {
        res   = await doRequest(freshNonce);
        nonce = freshNonce;
      }
    }

    await saveSession(res.headers);
    /* Save fresh nonce from mutation response for next operation */
    const newNonce = await saveNonce(res.headers);
    if (newNonce) nonce = newNonce;

    const raw = await res.json() as Record<string, unknown>;

    if (!res.ok) {
      const msg = String(
        (raw as Record<string, unknown>)?.message ??
        ((raw as Record<string, unknown>)?.data as Record<string, unknown>)?.message ??
        `Cart error (${res.status})`
      );
      /* Special guidance for missing nonce */
      if (res.status === 401) {
        return NextResponse.json({
          error: "Add to Cart requires the nonce endpoint. Please add the hemp/v1/cart-nonce snippet to WordPress functions.php (see wordpress-webp-snippet.php in your project).",
        }, { status: 401 });
      }
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    /* clear / remove-coupon may return [] — re-fetch fresh cart */
    if (action === "clear" || action === "remove-coupon" || Array.isArray(raw)) {
      const fresh = await fetch(`${STORE}/cart`, {
        headers: { "Content-Type": "application/json", ...(session ? { Cookie: session } : {}) },
        cache:   "no-store",
      });
      await saveSession(fresh.headers);
      await saveNonce(fresh.headers);
      return NextResponse.json({ cart: parseWcCart(await fresh.json() as Record<string, unknown>) });
    }

    /* update-customer + select-shipping-rate return shipping rates alongside cart */
    if (action === "update-customer" || action === "select-shipping-rate") {
      return NextResponse.json({
        cart:          parseWcCart(raw),
        shippingRates: parseShippingRates(raw),
      });
    }

    return NextResponse.json({ cart: parseWcCart(raw) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
