"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Moon, Zap, Heart, Brain, Smile, Leaf, Sun, Shield } from "lucide-react";

export const SORT_OPTIONS = [
  { label: "Default Sorting",    orderby: "menu_order", order: "asc"  },
  { label: "Sort by Popularity", orderby: "popularity",  order: "asc"  },
  { label: "Sort by Rating",     orderby: "rating",      order: "asc"  },
  { label: "Sort by Latest",     orderby: "date",        order: "desc" },
  { label: "Price: Low → High",  orderby: "price",       order: "asc"  },
  { label: "Price: High → Low",  orderby: "price",       order: "desc" },
];

const EFFECTS = [
  { label: "Sleep",      value: "sleep",      icon: Moon },
  { label: "Relaxation", value: "relaxation",  icon: Smile },
  { label: "Pain Relief",value: "pain",        icon: Shield },
  { label: "Focus",      value: "focus",       icon: Brain },
  { label: "Energy",     value: "energy",      icon: Zap },
  { label: "Anxiety",    value: "anxiety",     icon: Heart },
  { label: "Wellness",   value: "wellness",    icon: Sun },
];

const STRAINS = [
  { label: "Indica",  value: "indica",  color: "bg-purple-500" },
  { label: "Sativa",  value: "sativa",  color: "bg-orange-500" },
  { label: "Hybrid",  value: "hybrid",  color: "bg-[#1A9248]" },
];

function useCatNav() {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  const push = useCallback((updates: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([k, v]) => v ? next.set(k, v) : next.delete(k));
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }, [params, pathname, router]);

  const toggleMulti = useCallback((key: string, val: string) => {
    const current = params.get(key)?.split(",").filter(Boolean) ?? [];
    const next = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
    push({ [key]: next.join(",") });
  }, [params, push]);

  return {
    params,
    activeSearch:   params.get("search")   ?? "",
    activeOrderby:  params.get("orderby")  ?? "menu_order",
    activeOrder:    params.get("order")    ?? "asc",
    activeInstock:  params.get("instock") === "1",
    activeEffects:  params.get("effects")?.split(",").filter(Boolean) ?? [],
    activeStrain:   params.get("strain") ?? "",
    setSearch:   (q: string)              => push({ search: q }),
    setSort:     (ob: string, or: string) => push({ orderby: ob, order: or }),
    setInstock:  (on: boolean)            => push({ instock: on ? "1" : "" }),
    toggleEffect:(val: string)            => toggleMulti("effects", val),
    setStrain:   (val: string)            => push({ strain: params.get("strain") === val ? "" : val }),
  };
}

/* ── Desktop sticky sidebar ── */
export function CategorySidebar() {
  const { activeSearch, activeInstock, activeEffects, activeStrain, setSearch, setInstock, toggleEffect, setStrain } = useCatNav();
  const [draft, setDraft] = useState(activeSearch);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(draft.trim());
  };

  return (
    <aside className="hidden lg:block w-[230px] flex-shrink-0 self-stretch">
      <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3">Search Products</p>
          <form onSubmit={submit} className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
                placeholder="Product name…"
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-400"/>
            </div>
            <button type="submit"
              className="bg-[#1A9248] hover:bg-[#148038] text-white px-2.5 rounded-lg transition-colors flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
          {activeSearch && (
            <button onClick={() => { setDraft(""); setSearch(""); }}
              className="mt-2 text-[10px] text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Clear: &ldquo;{activeSearch}&rdquo;
            </button>
          )}
        </div>

        {/* Strain Type */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5" /> Strain Type
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STRAINS.map(s => (
              <button key={s.value} onClick={() => setStrain(s.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeStrain === s.value
                    ? `${s.color} text-white shadow-md`
                    : "bg-gray-50 text-[#3d2b1f] hover:bg-gray-100"
                }`}>
                <span className={`w-2 h-2 rounded-full ${activeStrain === s.value ? "bg-white/50" : s.color}`} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Effects */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3">Effects</p>
          <div className="flex flex-wrap gap-1.5">
            {EFFECTS.map(eff => {
              const active = activeEffects.includes(eff.value);
              return (
                <button key={eff.value} onClick={() => toggleEffect(eff.value)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                    active
                      ? "bg-[#1A9248] text-white shadow-md"
                      : "bg-gray-50 text-[#3d2b1f] hover:bg-[#1A9248]/10 hover:text-[#1A9248]"
                  }`}>
                  <eff.icon className="w-3 h-3" />
                  {eff.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* In Stock toggle */}
        <div className="p-4">
          <button
            onClick={() => setInstock(!activeInstock)}
            className="w-full flex items-center justify-between gap-3 group"
            aria-pressed={activeInstock}
          >
            <div className="text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A9248]">In Stock Only</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">
                {activeInstock ? "Hiding out of stock items" : "Showing all products"}
              </p>
            </div>
            <div className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-300 ${
              activeInstock ? "bg-[#1A9248]" : "bg-gray-200 group-hover:bg-gray-300"
            }`}>
              <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-300 ${
                activeInstock ? "translate-x-5" : "translate-x-0"
              }`} />
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ── Desktop sort + count bar ── */
export function CategorySortBar({ total, shown }: { total: number; shown: number }) {
  const { activeOrderby, activeOrder, setSort } = useCatNav();
  const active = SORT_OPTIONS.find(o => o.orderby === activeOrderby && o.order === activeOrder) ?? SORT_OPTIONS[0];

  return (
    <div className="hidden lg:flex items-center justify-between mb-6">
      <p className="text-gray-400 text-sm">
        Showing <span className="font-bold text-[#3d2b1f]">{shown}</span> of{" "}
        <span className="font-bold text-[#3d2b1f]">{total}</span> products
      </p>
      <div className="relative">
        <select
          value={`${active.orderby}|${active.order}`}
          onChange={e => { const [ob, or] = e.target.value.split("|"); setSort(ob, or); }}
          className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-2 text-sm font-semibold text-[#3d2b1f] focus:outline-none focus:border-[#1A9248] cursor-pointer">
          {SORT_OPTIONS.map(o => (
            <option key={`${o.orderby}|${o.order}`} value={`${o.orderby}|${o.order}`}>{o.label}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  );
}

/* ── Mobile: search + filters + sort bar ── */
export function CategoryMobileBar() {
  const { activeSearch, activeOrderby, activeOrder, activeInstock, activeEffects, activeStrain, setSearch, setSort, setInstock, toggleEffect, setStrain } = useCatNav();
  const [draft, setDraft] = useState(activeSearch);
  const [open, setOpen] = useState(false);
  const active = SORT_OPTIONS.find(o => o.orderby === activeOrderby && o.order === activeOrder) ?? SORT_OPTIONS[0];
  const hasFilter = !!(activeInstock || activeStrain || activeEffects.length);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(draft.trim());
  };

  return (
    <div className="lg:hidden mb-6 space-y-3">
      <form onSubmit={submit} className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-400 bg-white"/>
        </div>
        <button type="submit"
          className="bg-[#1A9248] hover:bg-[#148038] text-white px-4 rounded-full transition-colors text-sm font-bold">
          Go
        </button>
        {activeSearch && (
          <button type="button" onClick={() => { setDraft(""); setSearch(""); }}
            className="bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-500 px-3 rounded-full transition-colors text-sm font-bold">
            ✕
          </button>
        )}
      </form>

      <div className="flex items-center gap-3">
        {/* Filter toggle */}
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-bold text-[#3d2b1f] hover:border-[#1A9248] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
          </svg>
          Filters
          {hasFilter && <span className="w-2 h-2 rounded-full bg-[#1A9248]" />}
        </button>

        {/* Sort */}
        <div className="relative flex-1">
          <select
            value={`${active.orderby}|${active.order}`}
            onChange={e => { const [ob, or] = e.target.value.split("|"); setSort(ob, or); }}
            className="w-full appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-2 text-sm font-semibold text-[#3d2b1f] focus:outline-none focus:border-[#1A9248] cursor-pointer">
            {SORT_OPTIONS.map(o => (
              <option key={`${o.orderby}|${o.order}`} value={`${o.orderby}|${o.order}`}>{o.label}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {open && (
        <div className="mt-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          {/* Strain */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Strain Type</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {STRAINS.map(s => (
              <button key={s.value} onClick={() => setStrain(s.value)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                  activeStrain === s.value ? `${s.color} text-white` : "bg-gray-100 text-[#3d2b1f]"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeStrain === s.value ? "bg-white/50" : s.color}`} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Effects */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Effects</p>
          <div className="flex flex-wrap gap-1.5">
            {EFFECTS.map(eff => (
              <button key={eff.value} onClick={() => toggleEffect(eff.value)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
                  activeEffects.includes(eff.value) ? "bg-[#1A9248] text-white" : "bg-gray-100 text-[#3d2b1f]"
                }`}>
                <eff.icon className="w-2.5 h-2.5" />
                {eff.label}
              </button>
            ))}
          </div>

          {/* In Stock toggle */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setInstock(!activeInstock)}
              className="w-full flex items-center justify-between gap-3 group py-1"
              aria-pressed={activeInstock}
            >
              <span className="text-xs font-bold text-[#3d2b1f]">In Stock Only</span>
              <div className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-300 ${
                activeInstock ? "bg-[#1A9248]" : "bg-gray-200 group-hover:bg-gray-300"
              }`}>
                <span className={`absolute top-[3px] left-[3px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  activeInstock ? "translate-x-5" : "translate-x-0"
                }`} />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
