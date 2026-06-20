import { NextResponse } from "next/server";
import { cookies }       from "next/headers";
import { gqlServer }     from "@/lib/graphql/client";
import { LOGIN_MUTATION } from "@/lib/graphql/mutations";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

interface RegisterData {
  username?:  string;
  email:      string;
  password:   string;
  firstName?: string;
  lastName?:  string;
}
interface LoginResult {
  login: {
    authToken:    string;
    refreshToken: string;
    user: { databaseId: number; name: string; email: string };
  };
}

async function setAuthCookies(authToken: string, refreshToken: string) {
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

async function tryJwtLogin(username: string, password: string) {
  try {
    const data = await gqlServer<LoginResult>(LOGIN_MUTATION, { username, password });
    await setAuthCookies(data.login.authToken, data.login.refreshToken);
    return data.login.user;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const body: RegisterData = await req.json();
  const { username, email, password, firstName, lastName } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const safeUsername = username || email.split("@")[0];

  /* ── Call custom PHP registration endpoint (bypasses WP registration setting) ── */
  try {
    const res = await fetch(`${WP_URL}/wp-json/hemp/v1/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ username: safeUsername, email, password, firstName, lastName }),
    });

    const data = await res.json() as { id?: number; email?: string; displayName?: string; code?: string; message?: string };

    if (!res.ok) {
      const errMsg = data.message ?? "Registration failed. Please try again.";
      /* Duplicate account */
      if (res.status === 409 || data.code === "email_exists" || data.code === "username_exists") {
        return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });
      }
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }

    /* Registration succeeded — try auto-login via JWT */
    const loggedInUser = await tryJwtLogin(email, password);

    return NextResponse.json({
      user: loggedInUser ?? {
        databaseId: data.id ?? 0,
        name:       data.displayName || [firstName, lastName].filter(Boolean).join(" ") || safeUsername,
        email:      data.email || email,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return NextResponse.json({ error: msg || "Registration failed. Please try again." }, { status: 500 });
  }
}
