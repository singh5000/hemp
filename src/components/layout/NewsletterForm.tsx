"use client";
import { useState } from "react";

const WP = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";
const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export default function NewsletterForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loadedAt] = useState(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || busy) return;
    if (honey) return;
    if (Date.now() - loadedAt < 2000) { setErrMsg("Please wait a moment."); return; }

    setBusy(true);
    setErrMsg("");
    try {
      let recaptchaToken = "";
      if (RECAPTCHA_KEY) {
        const w = window as unknown as { grecaptcha?: { ready: (cb: () => void) => void; execute: (k: string, o: { action: string }) => Promise<string> } };
        if (w.grecaptcha) {
          recaptchaToken = await new Promise<string>((res) => {
            w.grecaptcha!.ready(() => { w.grecaptcha!.execute(RECAPTCHA_KEY, { action: "newsletter" }).then(res).catch(() => res("")); });
          });
        }
      }

      const res = await fetch(`${WP}/wp-json/hemp/v1/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, recaptchaToken }),
      });
      if (!res.ok) throw new Error("Subscription failed.");
      setSubmitted(true);
      setEmail("");
    } catch {
      setErrMsg("Could not subscribe. Please try again.");
    }
    setBusy(false);
  };

  if (submitted)
    return (
      <p className="font-semibold text-sm text-[#1A9248] flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
        Thanks for subscribing!
      </p>
    );

  const inputCls = variant === "light"
    ? "flex-1 w-full px-4 py-3 rounded-l-full bg-[#f5f0eb] border border-gray-200 text-[#3d2b1f] placeholder:text-gray-400 focus:outline-none focus:border-[#1A9248] text-sm"
    : "flex-1 md:w-72 px-5 py-3.5 rounded-l-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#1A9248] text-sm";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex w-full gap-0 relative">
        <input type="text" name="company" value={honey} onChange={e => setHoney(e.target.value)}
          className="absolute -left-[9999px] opacity-0 h-0 w-0" tabIndex={-1} autoComplete="off" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" required disabled={busy} className={inputCls} />
        <button type="submit" disabled={busy}
          className="px-5 py-3 bg-[#1A9248] hover:bg-[#148038] disabled:opacity-70 text-white font-bold text-sm uppercase tracking-wider rounded-r-full transition-colors whitespace-nowrap flex items-center gap-2">
          {busy ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : "Subscribe"}
        </button>
      </form>
      {errMsg && <p className="text-red-400 text-xs mt-2">{errMsg}</p>}
    </div>
  );
}
