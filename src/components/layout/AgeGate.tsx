"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const KEY = "hb_age_ok";
const TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

export default function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (!stored || Date.now() > parseInt(stored, 10)) {
        setShow(true);
        document.body.style.overflow = "hidden";
      }
    } catch { /* localStorage unavailable */ }
  }, []);

  const confirm = () => {
    try { localStorage.setItem(KEY, String(Date.now() + TTL)); } catch {}
    document.body.style.overflow = "";
    setShow(false);
  };

  const deny = () => {
    window.location.href = "https://www.google.com";
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(18,6,2,0.97)", backdropFilter: "blur(12px)" }}>

      {/* Card */}
      <div className="w-full max-w-[440px] bg-[#1e0d06] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#1A9248] to-[#2bc465]" />

        <div className="px-10 py-10 text-center">

          {/* Logo wordmark */}
          <div className="mb-8">
            <p className="text-white text-[16.5px] font-black tracking-[0.25em] uppercase mb-2">Hemp & Barrel</p>
            <div className="flex items-center justify-center gap-3">
              <span className="flex-1 h-px bg-white/10" />
              <span className="text-white/25 text-[10px] uppercase tracking-[0.3em]">Pineville, NC</span>
              <span className="flex-1 h-px bg-white/10" />
            </div>
          </div>

          {/* Lock icon */}
          <div className="w-16 h-16 bg-[#1A9248]/10 border border-[#1A9248]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#1A9248]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>

          <h2 className="text-white text-[32px] font-bold mb-2 tracking-tight">Age Verification</h2>
          <p className="text-white/45 text-[16.5px] leading-relaxed mb-8">
            This site contains hemp-derived CBD and THCa products.<br />
            You must be <strong className="text-white/70">21 years or older</strong> to enter.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button onClick={confirm}
              className="w-full bg-[#1A9248] hover:bg-[#148038] text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#1A9248]/30 text-sm uppercase tracking-widest hover:scale-[1.02]">
              Yes, I&apos;m 21 or older — Enter
            </button>
            <button onClick={deny}
              className="w-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/70 font-semibold py-3.5 rounded-2xl transition-all text-sm border border-white/8">
              No, take me back
            </button>
          </div>

          {/* Footer note */}
          <p className="text-white/20 text-[16.5px] mt-7 leading-relaxed">
            By entering you agree to our{" "}
            <Link href="/terms-conditions" onClick={confirm} className="underline hover:text-white/40 transition-colors">Terms</Link>
            {" & "}
            <Link href="/privacy-policy" onClick={confirm} className="underline hover:text-white/40 transition-colors">Privacy Policy</Link>.
            Age consent is remembered for 30 days.
          </p>
        </div>
      </div>
    </div>
  );
}
