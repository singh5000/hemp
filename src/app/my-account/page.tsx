"use client";

import { useState, useEffect }  from "react";
import Link                      from "next/link";
import Image                     from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth }               from "@/context/AuthContext";
import { gql }                   from "@/lib/graphql/client";
import { GET_CUSTOMER_QUERY }    from "@/lib/graphql/mutations";

/* ── Types ── */
interface Order {
  databaseId:         number;
  orderNumber:        string;
  date:               string;
  status:             string;
  total:              string;
  paymentMethodTitle: string;
  lineItems: { nodes: Array<{ quantity: number; total: string; product: { node: { name: string; slug: string; image: { sourceUrl: string; altText: string } | null } } }> };
}
interface WCAddress {
  firstName: string; lastName: string; company: string;
  address1:  string; address2: string;
  city:      string; state:    string; postcode: string; country: string;
  phone:     string; email:    string;
}
interface Customer {
  databaseId:  number;
  firstName:   string;
  lastName:    string;
  email:       string;
  displayName: string;
  billing:     WCAddress | null;
  shipping:    WCAddress | null;
  orders:      { nodes: Order[] };
}

const STATUS_COLORS: Record<string, string> = {
  completed:  "bg-emerald-100 text-emerald-700",
  processing: "bg-blue-100 text-blue-700",
  pending:    "bg-yellow-100 text-yellow-700",
  on_hold:    "bg-orange-100 text-orange-700",
  cancelled:  "bg-red-100 text-red-700",
  refunded:   "bg-gray-100 text-gray-500",
  failed:     "bg-red-100 text-red-700",
};

const inp = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5a8c3a] focus:ring-2 focus:ring-[#5a8c3a]/10 outline-none text-[#3d2b1f] text-sm transition-all bg-white";

/* ════════════════════════════════════════════════════════════
   LOGIN / REGISTER FORM
   ════════════════════════════════════════════════════════════ */
function AuthForms() {
  const { login, register } = useAuth();
  const [tab, setTab]       = useState<"login" | "register">("login");

  const [loginData, setLoginData]   = useState({ username: "", password: "" });
  const [loginErr,  setLoginErr]    = useState("");
  const [loginBusy, setLoginBusy]   = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  const [regData, setRegData] = useState({
    firstName: "", lastName: "", username: "", email: "", password: "", confirm: "",
  });
  const [regErr,  setRegErr]  = useState("");
  const [regBusy, setRegBusy] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr(""); setLoginBusy(true);
    const { error } = await login(loginData.username, loginData.password);
    if (error) setLoginErr(error);
    setLoginBusy(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegErr("");
    if (regData.password !== regData.confirm) { setRegErr("Passwords do not match."); return; }
    if (regData.password.length < 6) { setRegErr("Password must be at least 6 characters."); return; }
    setRegBusy(true);
    const { error } = await register({
      username:  regData.username || regData.email.split("@")[0],
      email:     regData.email,
      password:  regData.password,
      firstName: regData.firstName,
      lastName:  regData.lastName,
    });
    if (error) setRegErr(error);
    setRegBusy(false);
  };

  return (
    <>
      <section className="bg-[#2a1008] py-14">
        <div className="max-w-[1320px] mx-auto px-4 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-2">My Account</h1>
          <p className="text-white/40 text-sm">Sign in or create an account to track orders and manage your profile.</p>
        </div>
      </section>

      <div className="max-w-[500px] mx-auto px-6 py-14">
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
          {(["login", "register"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setLoginErr(""); setRegErr(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                tab === t ? "bg-white text-[#2a1008] shadow-sm" : "text-gray-400 hover:text-[#3d2b1f]"
              }`}>
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">Email or Username</label>
              <input type="text" required value={loginData.username}
                onChange={e => setLoginData(p => ({ ...p, username: e.target.value }))}
                placeholder="you@example.com" className={inp}/>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input type={showLoginPwd ? "text" : "password"} required value={loginData.password}
                  onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••" className={`${inp} pr-10`}/>
                <button type="button" onClick={() => setShowLoginPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5a8c3a]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showLoginPwd
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>
            {loginErr && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{loginErr}</div>
            )}
            <button type="submit" disabled={loginBusy}
              className="w-full py-3.5 bg-[#5a8c3a] hover:bg-[#4a7a2e] disabled:bg-[#5a8c3a]/50 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors">
              {loginBusy ? "Signing in…" : "Sign In"}
            </button>
            <p className="text-center text-xs text-gray-400">
              <a href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL ?? ""}/my-account/lost-password/`}
                className="text-[#5a8c3a] hover:underline" target="_blank" rel="noopener noreferrer">
                Forgot your password?
              </a>
            </p>
          </form>
        )}

        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First Name", key: "firstName", placeholder: "Jane" },
                { label: "Last Name",  key: "lastName",  placeholder: "Doe" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input type="text" placeholder={f.placeholder}
                    value={regData[f.key as keyof typeof regData]}
                    onChange={e => setRegData(p => ({ ...p, [f.key]: e.target.value }))}
                    className={inp}/>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">Email Address *</label>
              <input type="email" required placeholder="you@example.com"
                value={regData.email} onChange={e => setRegData(p => ({ ...p, email: e.target.value }))}
                className={inp}/>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">Password *</label>
              <div className="relative">
                <input type={showRegPwd ? "text" : "password"} required value={regData.password}
                  onChange={e => setRegData(p => ({ ...p, password: e.target.value }))}
                  placeholder="At least 6 characters" className={`${inp} pr-10`}/>
                <button type="button" onClick={() => setShowRegPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5a8c3a]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">Confirm Password *</label>
              <input type={showRegPwd ? "text" : "password"} required value={regData.confirm}
                onChange={e => setRegData(p => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat password" className={inp}/>
            </div>
            {regErr && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{regErr}</div>
            )}
            <button type="submit" disabled={regBusy}
              className="w-full py-3.5 bg-[#5a8c3a] hover:bg-[#4a7a2e] disabled:bg-[#5a8c3a]/50 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors">
              {regBusy ? "Creating account…" : "Create Account"}
            </button>
            <p className="text-center text-xs text-gray-400 leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="/terms-conditions" className="text-[#5a8c3a] hover:underline">Terms</Link>{" "}and{" "}
              <Link href="/privacy-policy" className="text-[#5a8c3a] hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        )}
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   ACCOUNT DASHBOARD
   ════════════════════════════════════════════════════════════ */
type Tab = "dashboard" | "orders" | "addresses" | "details";

/* ── Address field blank ── */
const BLANK_ADDR = { firstName: "", lastName: "", company: "", address1: "", address2: "", city: "", state: "", postcode: "", country: "US", phone: "", email: "" };
const COUNTRIES_ADDR: [string, string][] = [
  ["US","United States"],["CA","Canada"],["GB","United Kingdom"],["AU","Australia"],
  ["NZ","New Zealand"],["IE","Ireland"],["DE","Germany"],["FR","France"],
  ["NL","Netherlands"],["ES","Spain"],["IT","Italy"],["MX","Mexico"],["IN","India"],
];

function AddressesPanel({ customer, custLoading, userEmail }: { customer: Customer | null; custLoading: boolean; userEmail: string }) {
  const [editing,   setEditing]   = useState<"billing" | "shipping" | null>(null);
  const [billing,   setBilling]   = useState({ ...BLANK_ADDR });
  const [shipping,  setShipping]  = useState({ ...BLANK_ADDR });
  const [busy,      setBusy]      = useState(false);
  const [err,       setErr]       = useState("");
  const [ok,        setOk]        = useState(false);

  useEffect(() => {
    if (customer?.billing)  setBilling({ ...BLANK_ADDR, ...customer.billing });
    if (customer?.shipping) setShipping({ ...BLANK_ADDR, ...customer.shipping });
  }, [customer]);

  const addrInp = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5a8c3a] focus:ring-2 focus:ring-[#5a8c3a]/10 outline-none text-[#3d2b1f] text-sm transition-all bg-white";

  const handleSave = async (type: "billing" | "shipping") => {
    setBusy(true); setErr(""); setOk(false);
    try {
      const res = await fetch("/api/auth/update-address", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type,
          address: type === "billing" ? billing : shipping,
          authEmail: userEmail,
        }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setErr(data.error ?? "Save failed."); }
      else { setOk(true); setEditing(null); setTimeout(() => setOk(false), 3000); }
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const AddrField = ({ label, value, onChange, type = "text", req }: { label: string; value: string; onChange: (v: string) => void; type?: string; req?: boolean }) => (
    <div>
      <label className="block text-[11px] font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">
        {label}{req && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className={addrInp}/>
    </div>
  );

  const AddressForm = ({ type, addr, setAddr }: {
    type: "billing" | "shipping";
    addr: typeof billing;
    setAddr: (a: typeof billing) => void;
  }) => (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <AddrField label="First name" req value={addr.firstName} onChange={v => setAddr({ ...addr, firstName: v })}/>
        <AddrField label="Last name"  req value={addr.lastName}  onChange={v => setAddr({ ...addr, lastName: v })}/>
      </div>
      <AddrField label="Company name (optional)" value={addr.company} onChange={v => setAddr({ ...addr, company: v })}/>
      <AddrField label="Street address" req value={addr.address1} onChange={v => setAddr({ ...addr, address1: v })}/>
      <AddrField label="Apartment, suite, unit, etc. (optional)" value={addr.address2} onChange={v => setAddr({ ...addr, address2: v })}/>
      <div className="grid grid-cols-2 gap-3">
        <AddrField label="Town / City" req value={addr.city} onChange={v => setAddr({ ...addr, city: v })}/>
        <AddrField label="State / County" value={addr.state} onChange={v => setAddr({ ...addr, state: v })}/>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <AddrField label="Postcode / ZIP" req value={addr.postcode} onChange={v => setAddr({ ...addr, postcode: v })}/>
        <div>
          <label className="block text-[11px] font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">Country <span className="text-red-400">*</span></label>
          <select value={addr.country} onChange={e => setAddr({ ...addr, country: e.target.value })}
            className={addrInp}>
            {COUNTRIES_ADDR.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </div>
      </div>
      {type === "billing" && (
        <>
          <AddrField label="Phone" value={addr.phone ?? ""} onChange={v => setAddr({ ...addr, phone: v })} type="tel"/>
          <AddrField label="Email address" value={addr.email ?? ""} onChange={v => setAddr({ ...addr, email: v })} type="email"/>
        </>
      )}
      {err && <p className="text-xs text-red-500">{err}</p>}
      <div className="flex gap-3">
        <button onClick={() => handleSave(type)} disabled={busy}
          className="bg-[#5a8c3a] hover:bg-[#4a7a2e] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-colors">
          {busy ? "Saving…" : "Save address"}
        </button>
        <button onClick={() => { setEditing(null); setErr(""); }} type="button"
          className="bg-gray-100 hover:bg-gray-200 text-[#3d2b1f] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );

  const AddrDisplay = ({ addr }: { addr: typeof billing | null }) => {
    if (!addr || (!addr.address1 && !addr.city)) {
      return <p className="text-sm text-gray-400 italic">No address set yet.</p>;
    }
    return (
      <address className="not-italic text-sm text-[#3d2b1f] space-y-0.5">
        {(addr.firstName || addr.lastName) && <p className="font-semibold">{[addr.firstName, addr.lastName].filter(Boolean).join(" ")}</p>}
        {addr.company   && <p className="text-gray-500">{addr.company}</p>}
        {addr.address1  && <p>{addr.address1}</p>}
        {addr.address2  && <p>{addr.address2}</p>}
        {(addr.city || addr.state || addr.postcode) && (
          <p>{[addr.city, addr.state, addr.postcode].filter(Boolean).join(", ")}</p>
        )}
        {addr.country   && <p>{COUNTRIES_ADDR.find(([c]) => c === addr.country)?.[1] ?? addr.country}</p>}
        {addr.phone     && <p className="mt-1 text-gray-500">{addr.phone}</p>}
      </address>
    );
  };

  if (custLoading) return (
    <div className="py-16 text-center">
      <div className="inline-block w-7 h-7 border-4 border-[#5a8c3a] border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div>
      <h2 className="text-[#2a1008] text-xl font-bold mb-6">Addresses</h2>
      {ok && <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-700 text-sm font-semibold">Address saved successfully.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Billing */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2a1008] text-sm uppercase tracking-wider">Billing address</h3>
            {editing !== "billing" && (
              <button onClick={() => { setEditing("billing"); setErr(""); }}
                className="text-[#5a8c3a] text-xs font-bold hover:underline">Edit</button>
            )}
          </div>
          {editing === "billing"
            ? <AddressForm type="billing" addr={billing} setAddr={a => setBilling(a)}/>
            : <AddrDisplay addr={customer?.billing ? { ...customer.billing, phone: customer.billing.phone ?? "", email: customer.billing.email ?? "" } : null}/>
          }
        </div>

        {/* Shipping */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2a1008] text-sm uppercase tracking-wider">Shipping address</h3>
            {editing !== "shipping" && (
              <button onClick={() => { setEditing("shipping"); setErr(""); }}
                className="text-[#5a8c3a] text-xs font-bold hover:underline">Edit</button>
            )}
          </div>
          {editing === "shipping"
            ? <AddressForm type="shipping" addr={shipping} setAddr={a => setShipping(a)}/>
            : <AddrDisplay addr={customer?.shipping ? { ...customer.shipping, phone: customer.shipping.phone ?? "", email: customer.shipping.email ?? "" } : null}/>
          }
        </div>
      </div>
    </div>
  );
}

function AccountDashboard({ user }: { user: { databaseId: number; name: string; email: string } }) {
  const { logout }   = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [customer,    setCustomer]    = useState<Customer | null>(null);
  const [custLoading, setCustLoading] = useState(true);
  const [activeTab,   setActiveTab]   = useState<Tab>(() => {
    const t = searchParams.get("tab");
    if (t === "orders" || t === "addresses" || t === "details" || t === "dashboard") return t;
    return "details";
  });
  const [loggingOut,  setLoggingOut]  = useState(false);

  /* ── Account edit form state ── */
  const [form, setForm] = useState({
    firstName: "", lastName: "", displayName: "", email: "",
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [saveBusy,  setSaveBusy]  = useState(false);
  const [saveErr,   setSaveErr]   = useState("");
  const [saveOk,    setSaveOk]    = useState(false);
  const [showCurPwd, setShowCurPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  useEffect(() => {
    gql<{ customer: Customer }>(GET_CUSTOMER_QUERY)
      .then(d => {
        const c = d?.customer ?? null;
        setCustomer(c);
        if (c) {
          setForm(p => ({
            ...p,
            firstName:   c.firstName   ?? "",
            lastName:    c.lastName    ?? "",
            displayName: c.displayName ?? "",
            email:       c.email       ?? user.email,
          }));
        } else {
          const parts = (user.name ?? "").split(" ");
          setForm(p => ({
            ...p,
            firstName: parts[0] ?? "",
            lastName:  parts.slice(1).join(" ") ?? "",
            email:     user.email,
          }));
        }
      })
      .catch(() => {
        const parts = (user.name ?? "").split(" ");
        setForm(p => ({
          ...p,
          firstName: parts[0] ?? "",
          lastName:  parts.slice(1).join(" ") ?? "",
          email:     user.email,
        }));
      })
      .finally(() => setCustLoading(false));
  }, [user]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push("/");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveErr(""); setSaveOk(false);
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setSaveErr("New passwords do not match."); return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      setSaveErr("Password must be at least 6 characters."); return;
    }
    setSaveBusy(true);
    try {
      const res = await fetch("/api/auth/update-account", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName:       form.firstName,
          lastName:        form.lastName,
          displayName:     form.displayName,
          email:           form.email,
          currentPassword: form.currentPassword || undefined,
          newPassword:     form.newPassword     || undefined,
          confirmPassword: form.confirmPassword || undefined,
          /* Fallback auth for PHP if cookies don't work */
          authEmail:    user.email,
          authPassword: form.currentPassword || undefined,
        }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setSaveErr(data.error ?? "Save failed."); }
      else {
        setSaveOk(true);
        setForm(p => ({ ...p, currentPassword: "", newPassword: "", confirmPassword: "" }));
        setTimeout(() => setSaveOk(false), 4000);
      }
    } catch {
      setSaveErr("Network error. Please try again.");
    } finally {
      setSaveBusy(false);
    }
  };

  const orders = customer?.orders?.nodes ?? [];

  /* ── Sidebar items ── */
  const sidebarNav: { key: Tab | "downloads"; label: string }[] = [
    { key: "dashboard",  label: "Dashboard" },
    { key: "orders",     label: "Orders" },
    { key: "downloads",  label: "Downloads" },
    { key: "addresses",  label: "Addresses" },
    { key: "details",    label: "Account details" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-[#2a1008] py-12">
        <div className="max-w-[1320px] mx-auto px-4">
          <nav className="flex items-center gap-2 text-white/40 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">My Account</span>
          </nav>
          <h1 className="text-white text-3xl md:text-4xl font-bold">
            Hello {user.name.split(" ")[0]}
            <span className="text-white/40 text-lg font-normal ml-2">(not {user.name.split(" ")[0]}?{" "}
              <button onClick={handleLogout} className="underline hover:text-white transition-colors">Log out</button>)
            </span>
          </h1>
          <p className="text-white/40 text-sm mt-1">
            From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
          </p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-[200px] flex-shrink-0">
            <nav className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {sidebarNav.map(item => {
                const isActive = activeTab === item.key;
                return (
                  <button key={item.key}
                    onClick={() => item.key !== "downloads" && setActiveTab(item.key as Tab)}
                    disabled={item.key === "downloads"}
                    className={`w-full text-left px-5 py-3.5 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors ${
                      isActive
                        ? "bg-[#5a8c3a] text-white font-semibold"
                        : item.key === "downloads"
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-[#3d2b1f] hover:bg-[#f5f0eb] hover:text-[#5a8c3a]"
                    }`}>
                    {item.label}
                  </button>
                );
              })}
              <button onClick={handleLogout} disabled={loggingOut}
                className="w-full text-left px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                {loggingOut ? "Logging out…" : "Log out"}
              </button>
            </nav>
          </aside>

          {/* ── Main panel ── */}
          <div className="flex-1 min-w-0">

            {/* ── Dashboard overview ── */}
            {activeTab === "dashboard" && (
              <div className="space-y-4">
                <p className="text-[#3d2b1f] text-sm leading-relaxed">
                  Hello <strong>{user.name.split(" ")[0]}</strong>! From your account dashboard you can view your{" "}
                  <button onClick={() => setActiveTab("orders")} className="text-[#5a8c3a] font-semibold hover:underline">recent orders</button>,
                  manage your{" "}
                  <button onClick={() => setActiveTab("addresses")} className="text-[#5a8c3a] font-semibold hover:underline">shipping and billing addresses</button>, and{" "}
                  <button onClick={() => setActiveTab("details")} className="text-[#5a8c3a] font-semibold hover:underline">edit your password and account details</button>.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {[
                    { label: "Orders",    count: orders.length, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", tab: "orders" as Tab },
                    { label: "Account",   count: null,          icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",                                                                 tab: "details" as Tab },
                  ].map(card => (
                    <button key={card.label} onClick={() => setActiveTab(card.tab)}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-left hover:border-[#5a8c3a]/30 hover:shadow-md transition-all group">
                      <svg className="w-6 h-6 text-[#5a8c3a] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon}/>
                      </svg>
                      <p className="text-[#2a1008] font-bold text-sm">{card.label}</p>
                      {card.count !== null && <p className="text-gray-400 text-xs mt-0.5">{card.count} total</p>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Orders ── */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-[#2a1008] text-xl font-bold mb-5">Orders</h2>
                {custLoading ? (
                  <div className="py-16 text-center">
                    <div className="inline-block w-7 h-7 border-4 border-[#5a8c3a] border-t-transparent rounded-full animate-spin"/>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                    <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <p className="text-gray-400 text-sm mb-4">No orders yet.</p>
                    <Link href="/shop"
                      className="inline-block bg-[#5a8c3a] hover:bg-[#4a7a2e] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const statusKey  = order.status?.toLowerCase().replace("-", "_") ?? "";
                      const badgeClass = STATUS_COLORS[statusKey] ?? "bg-gray-100 text-gray-500";
                      const dateStr    = order.date
                        ? new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                        : "—";
                      return (
                        <div key={order.databaseId} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                          <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-4 border-b border-gray-50">
                            <div className="flex items-center gap-4 flex-wrap">
                              <div><p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Order</p><p className="text-[#2a1008] font-bold">#{order.orderNumber}</p></div>
                              <div><p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Date</p><p className="text-[#3d2b1f] text-sm">{dateStr}</p></div>
                              <div><p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total</p><p className="text-[#3d2b1f] font-bold text-sm">{order.total}</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${badgeClass}`}>
                                {order.status?.replace(/_/g, " ")}
                              </span>
                              <a href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/my-account/view-order/${order.databaseId}/`}
                                target="_blank" rel="noopener noreferrer"
                                className="text-[#5a8c3a] text-xs font-bold hover:underline">
                                View →
                              </a>
                            </div>
                          </div>
                          <div className="px-6 py-4 flex gap-3 flex-wrap">
                            {order.lineItems.nodes.slice(0, 4).map((item, i) => {
                              const img = item.product?.node?.image;
                              return (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="w-10 h-10 bg-[#f8f6f3] rounded-lg overflow-hidden flex-shrink-0 relative">
                                    {img?.sourceUrl
                                      ? <Image src={img.sourceUrl} alt={img.altText || item.product.node.name} fill className="object-contain p-0.5" sizes="40px"/>
                                      : <div className="w-full h-full bg-gray-100"/>
                                    }
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-[#3d2b1f] line-clamp-1 max-w-[120px]">{item.product?.node?.name}</p>
                                    <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              );
                            })}
                            {order.lineItems.nodes.length > 4 && (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 font-bold flex-shrink-0">
                                +{order.lineItems.nodes.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Addresses ── */}
            {activeTab === "addresses" && (
              <AddressesPanel customer={customer} custLoading={custLoading} userEmail={user.email} />
            )}

            {/* ── Account Details (editable form) ── */}
            {activeTab === "details" && (
              <div>
                <h2 className="text-[#2a1008] text-xl font-bold mb-6">Account Details</h2>
                {custLoading ? (
                  <div className="py-16 text-center">
                    <div className="inline-block w-7 h-7 border-4 border-[#5a8c3a] border-t-transparent rounded-full animate-spin"/>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-5 max-w-xl">
                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">
                          First name <span className="text-red-400">*</span>
                        </label>
                        <input type="text" required value={form.firstName}
                          onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                          className={inp}/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">
                          Last name <span className="text-red-400">*</span>
                        </label>
                        <input type="text" required value={form.lastName}
                          onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                          className={inp}/>
                      </div>
                    </div>

                    {/* Display name */}
                    <div>
                      <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">
                        Display name <span className="text-red-400">*</span>
                      </label>
                      <input type="text" required value={form.displayName}
                        onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
                        className={inp}/>
                      <p className="text-[11px] text-gray-400 mt-1 italic">This will be how your name will be displayed in the account section and in reviews.</p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">
                        Email address <span className="text-red-400">*</span>
                      </label>
                      <input type="email" required value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        className={inp}/>
                    </div>

                    {/* Password change */}
                    <div className="border border-gray-200 rounded-2xl p-5 space-y-4">
                      <h3 className="text-sm font-bold text-[#3d2b1f] uppercase tracking-wider">Password change</h3>
                      <div>
                        <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">
                          Current password <span className="text-gray-400 font-normal normal-case">(leave blank to leave unchanged)</span>
                        </label>
                        <div className="relative">
                          <input type={showCurPwd ? "text" : "password"} value={form.currentPassword}
                            onChange={e => setForm(p => ({ ...p, currentPassword: e.target.value }))}
                            className={`${inp} pr-10`}/>
                          <button type="button" onClick={() => setShowCurPwd(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5a8c3a]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">
                          New password <span className="text-gray-400 font-normal normal-case">(leave blank to leave unchanged)</span>
                        </label>
                        <div className="relative">
                          <input type={showNewPwd ? "text" : "password"} value={form.newPassword}
                            onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
                            className={`${inp} pr-10`}/>
                          <button type="button" onClick={() => setShowNewPwd(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5a8c3a]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#3d2b1f]/60 uppercase tracking-wider mb-1.5">
                          Confirm new password
                        </label>
                        <input type={showNewPwd ? "text" : "password"} value={form.confirmPassword}
                          onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                          className={inp}/>
                      </div>
                    </div>

                    {saveErr && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{saveErr}</div>
                    )}
                    {saveOk && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-700 text-sm font-semibold">
                        Account details saved successfully.
                      </div>
                    )}

                    <button type="submit" disabled={saveBusy}
                      className="bg-[#5a8c3a] hover:bg-[#4a7a2e] disabled:bg-[#5a8c3a]/50 text-white font-bold text-sm uppercase tracking-wider px-8 py-3 rounded-xl transition-colors">
                      {saveBusy ? "Saving…" : "Save changes"}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════ */
export default function MyAccountPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="inline-block w-8 h-8 border-4 border-[#5a8c3a] border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  if (user) return <AccountDashboard user={user} />;
  return <AuthForms />;
}
