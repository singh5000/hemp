"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link                                          from "next/link";
import Image                                         from "next/image";
import { useCart }                                   from "@/context/CartContext";
import { useAuth }                                   from "@/context/AuthContext";

/* ── Types ── */
type BillingAddr = {
  first_name: string; last_name: string; company: string;
  email: string; phone: string;
  address_1: string; address_2: string;
  city: string; state: string; postcode: string; country: string;
};
type ShipAddr = Omit<BillingAddr, "email" | "phone">;
interface PM { payment_method_id: string; name: string; description: string; }
interface ShippingRate    { rateId: string; name: string; price: string; selected: boolean; }
interface ShippingPackage { packageId: number; packageName: string; rates: ShippingRate[]; }

/* ── Constants ── */
const BILLING0: BillingAddr = {
  first_name: "", last_name: "", company: "",
  email: "", phone: "",
  address_1: "", address_2: "",
  city: "", state: "", postcode: "", country: "US",
};
const SHIP0: ShipAddr = {
  first_name: "", last_name: "", company: "",
  address_1: "", address_2: "",
  city: "", state: "", postcode: "", country: "US",
};
const COUNTRIES: [string, string][] = [
  ["US","United States"],["CA","Canada"],["GB","United Kingdom"],
  ["AU","Australia"],["NZ","New Zealand"],["IE","Ireland"],
  ["DE","Germany"],["FR","France"],["NL","Netherlands"],
  ["ES","Spain"],["IT","Italy"],["MX","Mexico"],["IN","India"],["JP","Japan"],
];
const NMI_KEY  = process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY ?? "";
const NMI_PM: PM = { payment_method_id: "nmi", name: "Credit card (NMI)", description: "Pay with your credit card via NMI." };
const inp = "w-full h-11 border border-gray-200 rounded-xl px-4 text-sm text-[#2a1008] placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A9248]/30 focus:border-[#1A9248] transition-all";

/* ── Field wrapper ── */
function FL({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-[#3d2b1f] uppercase tracking-[0.12em] mb-1.5">
        {label}{req && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Collapsible notice bar ── */
function NoticeBar({ icon, label, linkText, children }: {
  icon: React.ReactNode; label: string; linkText: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#d4e8c8] bg-[#f5faf2] rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left">
        <span className="text-[#1A9248] flex-shrink-0">{icon}</span>
        <span className="text-sm text-[#3d2b1f]">
          {label}{" "}
          <span className="text-[#1A9248] font-semibold hover:underline">{linkText}</span>
        </span>
        <svg className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t border-[#d4e8c8]/60">{children}</div>}
    </div>
  );
}

/* ── Page ── */
export default function CheckoutPage() {
  const { cart, cartLoading, applyCoupon, refreshCart } = useCart();
  const { user, login }                                 = useAuth();

  const [billing,       setBilling]       = useState<BillingAddr>(BILLING0);
  const [ship,          setShip]          = useState<ShipAddr>(SHIP0);
  const [diffShip,      setDiffShip]      = useState(false);
  const [note,          setNote]          = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [pms,           setPms]           = useState<PM[]>([]);
  const [pm,            setPm]            = useState("");
  const [agreed,        setAgreed]        = useState(false);
  const [busy,          setBusy]          = useState(false);
  const [pmLoading,     setPmLoading]     = useState(true);
  const [err,           setErr]           = useState("");

  /* Shipping rates */
  const [shippingRates,  setShippingRates]  = useState<ShippingPackage[]>([]);
  const [selectedRateId, setSelectedRateId] = useState("");
  const [ratesLoading,   setRatesLoading]   = useState(false);
  const [ratesErr,       setRatesErr]       = useState("");
  const [ratesFetched,   setRatesFetched]   = useState(false);

  /* Login form state */
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPass,     setLoginPass]     = useState("");
  const [loginBusy,     setLoginBusy]     = useState(false);
  const [loginErr,      setLoginErr]      = useState("");

  /* Coupon form state */
  const [couponCode,    setCouponCode]    = useState("");
  const [couponBusy,    setCouponBusy]    = useState(false);
  const [couponErr,     setCouponErr]     = useState("");
  const [couponOk,      setCouponOk]      = useState(false);

  /* NMI token (Collect.js) */
  const nmiToken       = useRef("");
  const collectJsReady = useRef(false);

  const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://hempandbarrel.com";

  /* ── Prefill billing if logged in ── */
  useEffect(() => {
    if (user) {
      const parts = (user.name ?? "").split(" ");
      setBilling(p => ({
        ...p,
        first_name: parts[0]                  ?? p.first_name,
        last_name:  parts.slice(1).join(" ")  || p.last_name,
        email:      user.email                ?? p.email,
      }));
    }
  }, [user]);

  /* ── Load Collect.js when NMI card fields are visible ── */
  useEffect(() => {
    if (pm !== "nmi" || !NMI_KEY) return;

    const configure = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const CJS = (window as any).CollectJS;
      if (!CJS || collectJsReady.current) return;
      collectJsReady.current = true;
      CJS.configure({
        variant:      "inline",
        styleSniffer: false,
        googlePay:    false,
        applePay:     false,
        fields: {
          ccnumber: { selector: "#nmi-ccnumber", placeholder: "•••• •••• •••• ••••" },
          ccexp:    { selector: "#nmi-ccexp",    placeholder: "MM / YY" },
          cvv:      { selector: "#nmi-cvv",      placeholder: "CVC" },
        },
        callback: (resp: { token?: string }) => { nmiToken.current = resp.token ?? ""; },
      });
    };

    const timer = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).CollectJS) { configure(); return; }
      if (document.getElementById("collectjs")) return;
      const s  = document.createElement("script");
      s.id     = "collectjs";
      s.src    = "https://secure.nmi.com/token/Collect.js";
      s.setAttribute("data-tokenization-key", NMI_KEY);
      s.onload = configure;
      document.body.appendChild(s);
    }, 150);

    return () => clearTimeout(timer);
  }, [pm]);

  /* ── Load payment methods ── */
  const loadPaymentMethods = useCallback(() => {
    setPmLoading(true);
    fetch("/api/wc/checkout")
      .then(r => r.json())
      .then((d: { paymentMethods?: PM[] }) => {
        let methods = d.paymentMethods ?? [];
        if (NMI_KEY && !methods.find(m => m.payment_method_id === "nmi")) {
          methods = [NMI_PM, ...methods];
        }
        setPms(methods);
        if (methods[0]) setPm(methods[0].payment_method_id);
      })
      .catch(() => { if (NMI_KEY) { setPms([NMI_PM]); setPm("nmi"); } })
      .finally(() => setPmLoading(false));
  }, []);

  useEffect(() => { loadPaymentMethods(); }, [loadPaymentMethods]);

  /* ── Fetch shipping rates when address has enough data ── */
  const fetchShippingRates = useCallback(async (b: BillingAddr, s: ShipAddr, useDiff: boolean) => {
    const zip     = useDiff ? s.postcode : b.postcode;
    const country = useDiff ? s.country  : b.country;
    if (!zip || zip.length < 3 || !country) return;

    const shippingAddr: ShipAddr = useDiff ? s : {
      first_name: b.first_name, last_name: b.last_name, company: b.company,
      address_1: b.address_1,  address_2: b.address_2, city: b.city,
      state: b.state,          postcode: b.postcode,   country: b.country,
    };

    setRatesLoading(true); setRatesErr("");
    try {
      const res  = await fetch("/api/wc/cart", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: "update-customer", billing: b, shipping: shippingAddr }),
      });
      const data = await res.json() as { shippingRates?: ShippingPackage[]; error?: string };

      if (!res.ok || data.error) {
        setRatesErr(data.error ?? "Failed to calculate shipping rates.");
        return;
      }

      const pkgs = data.shippingRates ?? [];
      setShippingRates(pkgs);
      setRatesFetched(true);

      /* Auto-select: use WC's pre-selected rate, or first available */
      if (pkgs.length > 0) {
        const allRates    = pkgs.flatMap(p => p.rates);
        const preSelected = allRates.find(r => r.selected) ?? allRates[0];
        if (preSelected) setSelectedRateId(preSelected.rateId);
      }

      refreshCart(); /* update totals in order summary */
    } catch {
      setRatesErr("Could not calculate shipping. You can still place your order.");
    } finally {
      setRatesLoading(false);
    }
  }, [refreshCart]);

  /* Debounce: re-fetch whenever the relevant address fields change */
  useEffect(() => {
    const zip     = diffShip ? ship.postcode : billing.postcode;
    const country = diffShip ? ship.country  : billing.country;
    if (!zip || zip.length < 3 || !country) return;

    const timer = setTimeout(() => fetchShippingRates(billing, ship, diffShip), 800);
    return () => clearTimeout(timer);
  }, [
    billing.postcode, billing.country, billing.state,
    ship.postcode,    ship.country,    ship.state,
    diffShip,         fetchShippingRates,
  ]);

  /* ── Select a shipping rate ── */
  const handleSelectRate = useCallback(async (packageId: number, rateId: string) => {
    setSelectedRateId(rateId);
    try {
      const res = await fetch("/api/wc/cart", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: "select-shipping-rate", package_id: packageId, rate_id: rateId }),
      });
      if (res.ok) refreshCart();
    } catch { /* non-critical — WC checkout validates on submission */ }
  }, [refreshCart]);

  /* ── Address field helpers ── */
  const upB = (k: keyof BillingAddr) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setBilling(p => ({ ...p, [k]: e.target.value }));
  const upS = (k: keyof ShipAddr) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setShip(p => ({ ...p, [k]: e.target.value }));

  /* ── Login ── */
  const handleLogin = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!loginEmail || !loginPass) return;
    setLoginBusy(true); setLoginErr("");
    const res = await login(loginEmail, loginPass);
    if (res?.error) { setLoginErr(res.error); }
    setLoginBusy(false);
  };

  /* ── Coupon ── */
  const handleCoupon = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!couponCode.trim()) return;
    setCouponBusy(true); setCouponErr(""); setCouponOk(false);
    const res = await applyCoupon(couponCode);
    if (res?.error) { setCouponErr(res.error); }
    else { setCouponOk(true); setCouponCode(""); setTimeout(() => setCouponOk(false), 3000); }
    setCouponBusy(false);
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pm) { setErr("Please select a payment method."); return; }
    if (!agreed) { setErr("Please agree to the terms and conditions."); return; }

    /* Validate shipping */
    if (ratesFetched && shippingRates.length > 0 && !selectedRateId) {
      setErr("Please select a shipping method."); return;
    }
    if (ratesFetched && shippingRates.length === 0) {
      setErr("No shipping methods are available for your address. Please contact us."); return;
    }

    setBusy(true); setErr("");

    /* NMI: tokenize card */
    if (pm === "nmi" && NMI_KEY) {
      nmiToken.current = "";
      try {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error("Card tokenization timed out. Please check card details.")), 20000);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const CJS = (window as any).CollectJS;
          if (!CJS) { clearTimeout(timer); reject(new Error("Payment system not loaded. Please refresh and try again.")); return; }
          CJS.startPaymentRequest({
            callback: (resp: { token?: string; error?: boolean; errorMessage?: string }) => {
              clearTimeout(timer);
              if (resp.error || !resp.token) reject(new Error(resp.errorMessage ?? "Card tokenization failed. Check card details."));
              else { nmiToken.current = resp.token; resolve(); }
            },
          });
        });
      } catch (ex) {
        setErr(ex instanceof Error ? ex.message : "Payment error.");
        setBusy(false);
        return;
      }
    }

    const shippingAddr: ShipAddr = diffShip ? ship : {
      first_name: billing.first_name, last_name: billing.last_name,
      company:    billing.company,    address_1: billing.address_1,
      address_2:  billing.address_2,  city:      billing.city,
      state:      billing.state,      postcode:  billing.postcode,
      country:    billing.country,
    };

    const paymentData = nmiToken.current ? [{ key: "collect_js_token", value: nmiToken.current }] : [];

    try {
      const res = await fetch("/api/wc/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          billing_address:  billing,
          shipping_address: shippingAddr,
          customer_note:    note,
          payment_method:   pm,
          payment_data:     paymentData,
          create_account:   createAccount,
        }),
      });

      const data = await res.json() as {
        order_id?:       number;
        payment_result?: { redirect_url?: string; payment_status?: string };
        message?:        string;
      };

      if (!res.ok) {
        setErr(data.message ?? `Checkout error (${res.status}). Please try again.`);
        setBusy(false);
        return;
      }

      const url = data.payment_result?.redirect_url;
      window.location.href = url ?? `${WP_URL}/checkout/order-received/${data.order_id}/`;
    } catch {
      setErr("Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  /* ── Guards ── */
  if (cartLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#1A9248] border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  if (!cart || cart.isEmpty) return (
    <div className="max-w-[1320px] mx-auto px-4 py-24 text-center">
      <h1 className="text-[38px] font-bold text-[#2a1008] mb-4">Your cart is empty</h1>
      <Link href="/shop" className="inline-flex items-center gap-2 bg-[#1A9248] text-white font-bold text-sm px-6 py-3 rounded-full">
        Continue Shopping
      </Link>
    </div>
  );

  const isNmi = pm === "nmi";

  /* Selected rate for display */
  const selectedRate = shippingRates.flatMap(p => p.rates).find(r => r.rateId === selectedRateId);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#2a1008] py-10">
        <div className="max-w-[1320px] mx-auto px-4">
          <nav className="flex items-center gap-2 text-white/40 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-white/60">Checkout</span>
          </nav>
          <h1 className="text-white text-[38px] md:text-4xl font-bold">Checkout</h1>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Left: Forms ── */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Notice bars (only if not logged in) */}
              {!user && (
                <>
                  <NoticeBar
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}
                    label="Returning customer?"
                    linkText="Click here to login">
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#3d2b1f] uppercase tracking-wider mb-1">Email</label>
                          <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleLogin(e as never)}
                            className={inp} placeholder="you@example.com"/>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#3d2b1f] uppercase tracking-wider mb-1">Password</label>
                          <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleLogin(e as never)}
                            className={inp} placeholder="••••••••"/>
                        </div>
                      </div>
                      {loginErr && <p className="text-[16.5px] text-red-500">{loginErr}</p>}
                      <button type="button" onClick={handleLogin} disabled={loginBusy}
                        className="h-10 px-6 bg-[#3d2b1f] hover:bg-[#2a1008] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50">
                        {loginBusy ? "Logging in…" : "Login"}
                      </button>
                    </div>
                  </NoticeBar>

                  <NoticeBar
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>}
                    label="Have a coupon?"
                    linkText="Click here to enter your code">
                    <div className="flex gap-2 pt-2">
                      <input type="text" value={couponCode} onChange={e => { setCouponCode(e.target.value); setCouponErr(""); }}
                        onKeyDown={e => e.key === "Enter" && handleCoupon(e as never)}
                        placeholder="Coupon code"
                        className="flex-1 h-10 border border-gray-200 rounded-xl px-4 text-sm text-[#2a1008] placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A9248]/30 focus:border-[#1A9248] transition-all"/>
                      <button type="button" onClick={handleCoupon} disabled={couponBusy || !couponCode.trim()}
                        className="h-10 px-5 bg-[#3d2b1f] hover:bg-[#2a1008] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap">
                        {couponBusy ? "Applying…" : "Apply Coupon"}
                      </button>
                    </div>
                    {couponErr && <p className="text-[16.5px] text-red-500 mt-2">{couponErr}</p>}
                    {couponOk  && <p className="text-[16.5px] text-[#1A9248] font-semibold mt-2">Coupon applied!</p>}
                  </NoticeBar>
                </>
              )}

              {/* ── Step 1: Billing Details ── */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-[#2a1008] font-bold text-[24px] mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1A9248] text-white rounded-full text-xs font-bold flex items-center justify-center">1</span>
                  Billing Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FL label="First Name" req>
                    <input required className={inp} value={billing.first_name} onChange={upB("first_name")} placeholder="John"/>
                  </FL>
                  <FL label="Last Name" req>
                    <input required className={inp} value={billing.last_name} onChange={upB("last_name")} placeholder="Doe"/>
                  </FL>
                  <div className="sm:col-span-2">
                    <FL label="Email Address" req>
                      <input required type="email" className={inp} value={billing.email} onChange={upB("email")} placeholder="john@example.com"/>
                    </FL>
                  </div>
                  <FL label="Phone" req>
                    <input required type="tel" className={inp} value={billing.phone} onChange={upB("phone")} placeholder="+1 555 000 0000"/>
                  </FL>
                  <FL label="Company (optional)">
                    <input className={inp} value={billing.company} onChange={upB("company")} placeholder="ACME Inc."/>
                  </FL>
                  <div className="sm:col-span-2">
                    <FL label="Street Address" req>
                      <input required className={inp} value={billing.address_1} onChange={upB("address_1")} placeholder="House number and street name"/>
                    </FL>
                  </div>
                  <div className="sm:col-span-2">
                    <FL label="Apartment / Suite (optional)">
                      <input className={inp} value={billing.address_2} onChange={upB("address_2")} placeholder="Apartment, suite, unit, etc."/>
                    </FL>
                  </div>
                  <FL label="City" req>
                    <input required className={inp} value={billing.city} onChange={upB("city")} placeholder="Town / City"/>
                  </FL>
                  <FL label="State / Province" req>
                    <input required className={inp} value={billing.state} onChange={upB("state")} placeholder="State"/>
                  </FL>
                  <FL label="ZIP / Postal Code" req>
                    <input required className={inp} value={billing.postcode} onChange={upB("postcode")} placeholder="ZIP Code"/>
                  </FL>
                  <FL label="Country" req>
                    <select required className={inp} value={billing.country} onChange={upB("country")}>
                      {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                    </select>
                  </FL>
                </div>

                {!user && (
                  <label className="flex items-center gap-2.5 cursor-pointer select-none mt-5 pt-4 border-t border-gray-100">
                    <input type="checkbox" checked={createAccount} onChange={e => setCreateAccount(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#1A9248]"/>
                    <span className="text-sm text-[#3d2b1f]">Create an account?</span>
                  </label>
                )}
              </div>

              {/* ── Step 2: Ship to different address ── */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={diffShip} onChange={e => setDiffShip(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#1A9248]"/>
                  <span className="text-[#2a1008] font-bold text-base flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#3d2b1f] text-white rounded-full text-xs font-bold flex items-center justify-center">2</span>
                    Ship to a different address?
                  </span>
                </label>

                {diffShip && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <FL label="First Name" req><input required className={inp} value={ship.first_name} onChange={upS("first_name")}/></FL>
                    <FL label="Last Name"  req><input required className={inp} value={ship.last_name}  onChange={upS("last_name")}/></FL>
                    <FL label="Company"><input className={inp} value={ship.company} onChange={upS("company")}/></FL>
                    <div/>
                    <div className="sm:col-span-2"><FL label="Street Address" req><input required className={inp} value={ship.address_1} onChange={upS("address_1")}/></FL></div>
                    <div className="sm:col-span-2"><FL label="Apartment / Suite"><input className={inp} value={ship.address_2} onChange={upS("address_2")}/></FL></div>
                    <FL label="City"  req><input required className={inp} value={ship.city}     onChange={upS("city")}/></FL>
                    <FL label="State" req><input required className={inp} value={ship.state}    onChange={upS("state")}/></FL>
                    <FL label="ZIP"   req><input required className={inp} value={ship.postcode} onChange={upS("postcode")}/></FL>
                    <FL label="Country" req>
                      <select required className={inp} value={ship.country} onChange={upS("country")}>
                        {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                      </select>
                    </FL>
                  </div>
                )}
              </div>

              {/* ── Step 3: Shipping Method ── */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-[#2a1008] font-bold text-[24px] mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1A9248] text-white rounded-full text-xs font-bold flex items-center justify-center">3</span>
                  Shipping Method
                </h2>

                {ratesLoading ? (
                  <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                    <div className="w-4 h-4 border-2 border-[#1A9248]/40 border-t-[#1A9248] rounded-full animate-spin"/>
                    Calculating shipping rates for your address…
                  </div>
                ) : ratesErr ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-[16.5px] text-amber-700">{ratesErr}</p>
                  </div>
                ) : !ratesFetched ? (
                  <p className="text-[16.5px] text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Enter your ZIP code and country above to see available shipping options.
                  </p>
                ) : shippingRates.length === 0 ? (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-[16.5px] font-semibold text-red-700">No shipping methods available for your address.</p>
                    <p className="text-[16.5px] text-red-500 mt-1">
                      We may not ship to your area. Please{" "}
                      <Link href="/contact" className="underline hover:text-red-700">contact us</Link>{" "}
                      for assistance.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {shippingRates.flatMap(pkg => pkg.rates.map(rate => (
                      <label key={rate.rateId}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedRateId === rate.rateId
                            ? "border-[#1A9248] bg-[#f5faf2]"
                            : "border-gray-100 hover:border-gray-200 bg-white"
                        }`}>
                        <input
                          type="radio"
                          name="shipping_rate"
                          value={rate.rateId}
                          checked={selectedRateId === rate.rateId}
                          onChange={() => handleSelectRate(pkg.packageId, rate.rateId)}
                          className="accent-[#1A9248] flex-shrink-0"/>
                        <span className="flex-1 text-sm font-semibold text-[#2a1008]">{rate.name}</span>
                        <span className="text-sm font-bold text-[#3d2b1f]">{rate.price}</span>
                      </label>
                    )))}
                  </div>
                )}
              </div>

              {/* ── Step 4: Payment Method ── */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-[#2a1008] font-bold text-[24px] mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#1A9248] text-white rounded-full text-xs font-bold flex items-center justify-center">4</span>
                  Payment Method
                </h2>

                {pmLoading ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"/>
                    Loading payment methods…
                  </div>
                ) : pms.length === 0 ? (
                  <div className="space-y-3">
                    <p className="text-[16.5px] text-gray-500">
                      Could not load payment methods.{" "}
                      <button type="button" onClick={loadPaymentMethods}
                        className="text-[#1A9248] font-bold hover:underline">Retry</button>
                    </p>
                    <a href={`${WP_URL}/checkout`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#3d2b1f] hover:text-[#1A9248] font-medium transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                      Continue on WordPress checkout instead
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pms.map(method => (
                      <div key={method.payment_method_id}>
                        <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          pm === method.payment_method_id
                            ? "border-[#1A9248] bg-[#f5faf2]"
                            : "border-gray-100 hover:border-gray-200 bg-white"
                        }`}>
                          <input type="radio" name="payment_method"
                            value={method.payment_method_id}
                            checked={pm === method.payment_method_id}
                            onChange={() => setPm(method.payment_method_id)}
                            className="mt-0.5 accent-[#1A9248]"/>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[#2a1008] font-bold text-[16.5px]">{method.name}</p>
                              {method.payment_method_id === "nmi" && (
                                <div className="flex items-center gap-1">
                                  {["VISA","MC","AMEX","Discover"].map(c => (
                                    <span key={c} className="text-[9px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{c}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {method.description && (
                              <p className="text-gray-400 text-[16.5px] mt-0.5 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: method.description }}/>
                            )}
                          </div>
                        </label>

                        {pm === method.payment_method_id && method.payment_method_id === "nmi" && (
                          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                            {NMI_KEY ? (
                              <>
                                <div>
                                  <label className="block text-[11px] font-bold text-[#3d2b1f] uppercase tracking-wider mb-1.5">
                                    Card Number <span className="text-red-400">*</span>
                                  </label>
                                  <div id="nmi-ccnumber"
                                    className="h-11 border border-gray-200 rounded-xl px-4 bg-white flex items-center"/>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-bold text-[#3d2b1f] uppercase tracking-wider mb-1.5">
                                      Expiry Date <span className="text-red-400">*</span>
                                    </label>
                                    <div id="nmi-ccexp"
                                      className="h-11 border border-gray-200 rounded-xl px-4 bg-white flex items-center"/>
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-bold text-[#3d2b1f] uppercase tracking-wider mb-1.5">
                                      Card Code (CVC) <span className="text-red-400">*</span>
                                    </label>
                                    <div id="nmi-cvv"
                                      className="h-11 border border-gray-200 rounded-xl px-4 bg-white flex items-center"/>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
                                NMI configured but tokenization key not set. Add{" "}
                                <code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_NMI_TOKENIZATION_KEY</code>{" "}
                                to <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Step 5: Order Notes ── */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-[#2a1008] font-bold text-[24px] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#3d2b1f] text-white rounded-full text-xs font-bold flex items-center justify-center">5</span>
                  Order Notes
                  <span className="text-gray-400 text-xs font-normal ml-1">(optional)</span>
                </h2>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                  placeholder="Notes about your order, e.g. special delivery instructions."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2a1008] placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A9248]/30 focus:border-[#1A9248] transition-all resize-none"/>
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="w-full lg:w-[380px] flex-shrink-0 lg:sticky lg:top-24">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-[#2a1008] px-6 py-4">
                  <h2 className="text-white font-bold text-[24px]">Your Order</h2>
                </div>

                <div className="p-6">
                  {/* Items */}
                  <div className="space-y-4 mb-5">
                    {cart.items.map(item => {
                      const img      = item.variation?.image ?? item.product.image;
                      const varAttrs = item.variation?.attributes?.nodes ?? [];
                      return (
                        <div key={item.key} className="flex items-center gap-3">
                          <div className="relative w-14 h-14 flex-shrink-0">
                            <div className="w-full h-full bg-[#f8f6f3] rounded-lg overflow-hidden">
                              {img?.sourceUrl
                                ? <Image src={img.sourceUrl} alt={img.altText || item.product.name}
                                    fill className="object-contain p-1" sizes="56px"/>
                                : <div className="w-full h-full bg-gray-100"/>
                              }
                            </div>
                            <span className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 bg-[#1A9248] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#2a1008] font-bold text-[16.5px] line-clamp-2">{item.product.name}</p>
                            {varAttrs.length > 0 && (
                              <p className="text-gray-400 text-[16.5px] mt-0.5">
                                {varAttrs.map(a => `${a.name}: ${a.value}`).join(" / ")}
                              </p>
                            )}
                          </div>
                          <p className="text-[#2a1008] font-bold text-[16.5px] flex-shrink-0">{item.total}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-gray-100 pt-4 space-y-2.5">
                    <div className="flex justify-between text-sm text-[#3d2b1f]">
                      <span>Subtotal</span><span className="font-semibold">{cart.subtotal}</span>
                    </div>
                    {cart.discount && (
                      <div className="flex justify-between text-sm text-[#1A9248]">
                        <span>Discount</span><span className="font-semibold">−{cart.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-[#3d2b1f]">
                      <span>Shipping</span>
                      {selectedRate ? (
                        <span className="font-semibold">{selectedRate.price}</span>
                      ) : ratesLoading ? (
                        <span className="text-gray-400 text-xs">Calculating…</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Enter address above</span>
                      )}
                    </div>
                    {cart.totalTax && cart.totalTax !== "$0.00" && (
                      <div className="flex justify-between text-sm text-[#3d2b1f]">
                        <span>Tax</span><span className="font-semibold">{cart.totalTax}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-100 pt-3 flex justify-between text-[#2a1008]">
                      <span className="font-bold text-base">Total</span>
                      <span className="font-bold text-xl">{cart.total}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-4">
                  <p className="text-[16.5px] text-gray-400 leading-relaxed">
                    Your personal data will be used to process your order, support your experience throughout this
                    website, and for other purposes described in our{" "}
                    <Link href="/privacy-policy" className="text-[#1A9248] hover:underline">privacy policy</Link>.
                  </p>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#1A9248] flex-shrink-0"/>
                    <span className="text-xs text-gray-500 leading-relaxed">
                      I have read and agree to the website{" "}
                      <Link href="/terms-conditions" target="_blank"
                        className="text-[#1A9248] hover:underline font-medium">terms and conditions</Link>
                      {" "}<span className="text-red-400">*</span>
                    </span>
                  </label>

                  {err && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600 leading-relaxed">{err}</div>
                  )}

                  <button type="submit"
                    disabled={busy || pmLoading || (pms.length === 0) || (isNmi && !NMI_KEY)}
                    className="w-full bg-[#1A9248] hover:bg-[#148038] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                    {busy
                      ? <><div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"/>Processing…</>
                      : "Place Order"
                    }
                  </button>

                  <p className="text-center text-[16.5px] text-gray-400 flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Secure SSL Encrypted Checkout
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}
