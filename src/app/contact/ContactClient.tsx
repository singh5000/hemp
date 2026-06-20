"use client";

import { useState } from "react";
import Link from "next/link";

const INFO_CARDS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Visit Us",
    value: "800 N Polk Street\nPineville, NC 28134",
    action: { text: "Get Directions", href: "https://goo.gl/maps/ZGKaUsQ9k6sGLywh7" },
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Call Us",
    value: "(980) 326-4367",
    action: { text: "Call Now", href: "tel:9803264367" },
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Store Hours",
    value: "Mon – Sat: 10:00 AM – 8:00 PM\nSunday: 12:00 PM – 4:00 PM",
    action: null,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
    label: "Follow Us",
    value: "@HempAndBarrel",
    action: { text: "View Instagram", href: "https://www.instagram.com/hempandbarrel/" },
  },
];

const WP = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

export default function ContactClient() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      const res  = await fetch(`${WP}/wp-json/hemp/v1/contact`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json() as { message?: string };
      if (!res.ok) throw new Error(data.message ?? "Failed to send message.");
      setStatus("sent");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-[#2a1008] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #5a8c3a 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#5a8c3a]/6 -translate-y-1/3 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#5a8c3a]/5 translate-y-1/3 -translate-x-1/3 blur-3xl" />

        <div className="relative max-w-[1100px] mx-auto px-6 py-24 text-center">
          <span className="inline-block text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.4em] mb-5">
            We&apos;d Love to Hear From You
          </span>
          <h1 className="text-white text-5xl md:text-7xl font-bold uppercase leading-tight mb-6">
            Get In<br />
            <span className="text-[#5a8c3a]">Touch</span>
          </h1>
          <p className="text-white/55 text-lg max-w-lg mx-auto">
            Questions about our products? Need expert CBD advice? We&apos;re here and happy to help.
          </p>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="bg-[#3d2b1f] py-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INFO_CARDS.map((card) => (
              <div key={card.label}
                className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:border-[#5a8c3a]/40 group">
                <div className="w-11 h-11 bg-[#5a8c3a]/15 group-hover:bg-[#5a8c3a]/25 rounded-xl flex items-center justify-center text-[#5a8c3a] transition-colors">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">{card.label}</p>
                  <p className="text-white font-semibold text-sm leading-relaxed whitespace-pre-line">{card.value}</p>
                </div>
                {card.action && (
                  <Link
                    href={card.action.href}
                    target={card.action.href.startsWith("http") ? "_blank" : undefined}
                    rel={card.action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-[#5a8c3a] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 group/link"
                  >
                    {card.action.text}
                    <svg className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN: FORM + MAP ── */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-8 md:p-10">
              <div className="mb-8">
                <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-[0.3em] mb-2">Send a Message</p>
                <h2 className="text-[#3d2b1f] text-3xl font-bold leading-tight">
                  How Can We<br />Help You?
                </h2>
              </div>

              {status === "error" && (
                <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                  {errMsg || "Something went wrong. Please try again."}
                </div>
              )}

              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-[#5a8c3a]/10 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-[#5a8c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#3d2b1f] mb-3">Message Sent!</h3>
                  <p className="text-gray-500 mb-8">
                    Thanks for reaching out. We&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => { setStatus("idle"); setErrMsg(""); setForm({ firstName: "", lastName: "", email: "", message: "" }); }}
                    className="text-sm font-semibold text-[#5a8c3a] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-2">
                        First Name <span className="text-[#5a8c3a]">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Jane"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#5a8c3a] focus:ring-2 focus:ring-[#5a8c3a]/10 outline-none text-[#3d2b1f] placeholder:text-gray-300 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-2">
                        Last Name <span className="text-[#5a8c3a]">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Doe"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#5a8c3a] focus:ring-2 focus:ring-[#5a8c3a]/10 outline-none text-[#3d2b1f] placeholder:text-gray-300 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-2">
                      Email Address <span className="text-[#5a8c3a]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#5a8c3a] focus:ring-2 focus:ring-[#5a8c3a]/10 outline-none text-[#3d2b1f] placeholder:text-gray-300 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-2">
                      Your Message <span className="text-[#5a8c3a]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Ask us anything about our products, store, or CBD in general…"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#5a8c3a] focus:ring-2 focus:ring-[#5a8c3a]/10 outline-none text-[#3d2b1f] placeholder:text-gray-300 text-sm transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending" || status === "sent"}
                    className="w-full bg-[#5a8c3a] hover:bg-[#4a7a2e] disabled:opacity-70 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#5a8c3a]/30 flex items-center justify-center gap-3"
                  >
                    {status === "sending" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-gray-400 text-xs">
                    We typically respond within 1 business day.
                  </p>
                </form>
              )}
            </div>

            {/* Right side: Map + quick info */}
            <div className="flex flex-col gap-6">
              {/* Map */}
              <div className="rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60 h-[360px] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3263.648!2d-80.8878!3d35.0819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8856a2a4f5b2a4b5%3A0x1234567890abcdef!2s800%20N%20Polk%20St%2C%20Pineville%2C%20NC%2028134!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hemp & Barrel Store Location"
                />
                {/* Map overlay button */}
                <Link
                  href="https://goo.gl/maps/ZGKaUsQ9k6sGLywh7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-white hover:bg-[#5a8c3a] hover:text-white text-[#3d2b1f] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Maps
                </Link>
              </div>

              {/* Quick contact strip */}
              <div className="bg-[#2a1008] rounded-3xl p-7 flex flex-col sm:flex-row gap-6 items-center justify-between">
                <div>
                  <p className="text-[#5a8c3a] text-xs font-bold uppercase tracking-widest mb-1.5">Prefer to call?</p>
                  <a href="tel:9803264367"
                    className="text-white text-2xl font-bold tracking-wide hover:text-[#5a8c3a] transition-colors">
                    (980) 326-4367
                  </a>
                  <p className="text-white/40 text-xs mt-1">Mon–Sat 10AM–8PM · Sun 12–4PM</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="https://www.facebook.com/HempandBarrel"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#5a8c3a] flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://www.instagram.com/hempandbarrel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#5a8c3a] flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* FAQ nudge */}
              <div className="border-2 border-dashed border-[#5a8c3a]/30 rounded-2xl p-6 flex items-center gap-5 hover:border-[#5a8c3a]/60 transition-colors">
                <div className="w-12 h-12 bg-[#5a8c3a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#5a8c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#3d2b1f] font-bold text-sm mb-1">Have a quick question?</p>
                  <p className="text-gray-500 text-xs mb-2">Check our FAQ page — most answers are already there.</p>
                  <Link href="/faqs" className="text-[#5a8c3a] text-xs font-bold uppercase tracking-wider hover:underline">
                    Browse FAQs →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
