const GRAPHQL_URL   = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
/* Browser calls go through Next.js proxy to avoid CORS */
const GRAPHQL_PROXY = "/api/graphql";

const SESSION_COOKIE = "woo-session";
const AUTH_COOKIE    = "woo-auth";

/* ── Cookie helpers (client-side only) ── */
export function getSessionToken(): string | null {
  if (typeof document === "undefined") return null;
  return (
    document.cookie
      .split(";")
      .map(c => c.trim())
      .find(c => c.startsWith(`${SESSION_COOKIE}=`))
      ?.split("=")[1] ?? null
  );
}
export function setSessionToken(token: string): void {
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  return (
    document.cookie
      .split(";")
      .map(c => c.trim())
      .find(c => c.startsWith(`${AUTH_COOKIE}=`))
      ?.split("=")[1] ?? null
  );
}
export function setAuthToken(token: string): void {
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;
}
export function clearAuthCookies(): void {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

/* ── Core fetch helper ── */
export async function gql<T = Record<string, unknown>>(
  query: string,
  variables?: Record<string, unknown>,
  overrideAuthToken?: string
): Promise<T> {
  const authToken    = overrideAuthToken ?? getAuthToken();
  const sessionToken = getSessionToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authToken    ? { Authorization: `Bearer ${authToken}` }               : {}),
    ...(sessionToken ? { "woocommerce-session": `Session ${sessionToken}` }   : {}),
  };

  const res = await fetch(GRAPHQL_PROXY, {
    method:  "POST",
    headers,
    body:    JSON.stringify({ query, variables }),
  });

  /* Persist new session token if WooGraphQL returns one */
  const newSession = res.headers.get("woocommerce-session");
  if (newSession && newSession !== sessionToken) {
    setSessionToken(newSession.replace(/^Session\s+/i, ""));
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "GraphQL error");
  }
  return json.data as T;
}

/* ── Server-side fetch (no browser cookies – for API routes / Server Components) ── */
export async function gqlServer<T = Record<string, unknown>>(
  query: string,
  variables?: Record<string, unknown>,
  authToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };

  const res = await fetch(GRAPHQL_URL, {
    method:  "POST",
    headers,
    body:    JSON.stringify({ query, variables }),
    cache:   "no-store",
  });

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "GraphQL error");
  }
  return json.data as T;
}
