import { NextResponse } from "next/server";
import { cookies }       from "next/headers";
import { gqlServer }     from "@/lib/graphql/client";
import { LOGIN_MUTATION } from "@/lib/graphql/mutations";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

interface LoginData {
  login: {
    authToken:    string;
    refreshToken: string;
    user: { databaseId: number; name: string; email: string };
  };
}

async function setJwtCookies(authToken: string, refreshToken: string) {
  const jar = await cookies();
  jar.set("woo-auth", authToken, {
    httpOnly: false,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   7 * 24 * 3600,
    path:     "/",
  });
  jar.set("woo-refresh", refreshToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   30 * 24 * 3600,
    path:     "/",
  });
}

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  /* ── 1. WPGraphQL JWT Authentication (if plugin installed) ── */
  try {
    const data = await gqlServer<LoginData>(LOGIN_MUTATION, { username, password });
    const { authToken, refreshToken, user } = data.login;
    await setJwtCookies(authToken, refreshToken);
    return NextResponse.json({ user });
  } catch {
    /* JWT plugin not installed or wrong credentials — fall through */
  }

  /* ── 2. Custom PHP login endpoint (bypasses CleanTalk / wp-login.php issues) ── */
  try {
    const res = await fetch(`${WP_URL}/wp-json/hemp/v1/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ username, password }),
    });

    const data = await res.json() as { id?: number; name?: string; email?: string; message?: string };

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message ?? "Incorrect username or password." },
        { status: 401 }
      );
    }

    /* Forward WordPress session cookies set by wp_set_auth_cookie() */
    const jar            = await cookies();
    const setCookieLines = res.headers.getSetCookie?.() ?? [];

    for (const raw of setCookieLines) {
      const [nameVal, ...parts] = raw.split(";");
      const eqIdx = nameVal.indexOf("=");
      if (eqIdx < 0) continue;
      const name  = nameVal.slice(0, eqIdx).trim();
      const value = nameVal.slice(eqIdx + 1);

      const maxAgeStr  = parts.find(p => p.trim().toLowerCase().startsWith("max-age="));
      const expiresStr = parts.find(p => p.trim().toLowerCase().startsWith("expires="));
      let maxAge = 7 * 24 * 3600; // default 7 days
      if (maxAgeStr) {
        maxAge = parseInt(maxAgeStr.split("=")[1]) || maxAge;
      } else if (expiresStr) {
        const expDate = new Date(expiresStr.split("=").slice(1).join("="));
        if (!isNaN(expDate.getTime())) maxAge = Math.max(3600, Math.floor((expDate.getTime() - Date.now()) / 1000));
      }
      const isSecure = parts.some(p => p.trim().toLowerCase() === "secure");

      if (!name) continue;
      jar.set(name, decodeURIComponent(value), {
        httpOnly: true,
        secure:   isSecure || process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path:     "/",
      });
    }

    return NextResponse.json({
      user: {
        databaseId: data.id    ?? 0,
        name:       data.name  || username,
        email:      data.email || username,
      },
    });
  } catch {
    return NextResponse.json({ error: "Login failed. Please check your credentials." }, { status: 401 });
  }
}
