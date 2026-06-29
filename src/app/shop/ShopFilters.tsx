"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Moon, Zap, Heart, Brain, Smile, Leaf, Sun, Shield } from "lucide-react";

interface Category { id: number; name: string; slug: string; count: number }
export interface Brand { id: number; name: string; slug: string; count: number }

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

function useShopNav() {
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
    push,
    activeCategory: params.get("category") ?? "",
    activeBrand:    params.get("brand")    ?? "",
    activeSearch:   params.get("search")   ?? "",
    activeOrderby:  params.get("orderby")  ?? "menu_order",
    activeOrder:    params.get("order")    ?? "asc",
    activeInstock:  params.get("instock") === "1",
    activeEffects:  params.get("effects")?.split(",").filter(Boolean) ?? [],
    activeStrain:   params.get("strain") ?? "",
    setCategory: (slug: string) => push({ category: slug, brand: "" }),
    setBrand:    (slug: string) => push({ brand: slug, category: "" }),
    setSearch:   (q: string)    => push({ search: q }),
    setSort:     (ob: string, or: string) => push({ orderby: ob, order: or }),
    setInstock:  (on: boolean)  => push({ instock: on ? "1" : "" }),
    toggleEffect:(val: string)  => toggleMulti("effects", val),
    setStrain:   (val: string)  => push({ strain: params.get("strain") === val ? "" : val }),
  };
}

/* ─── Desktop sidebar ─── */
export function ShopSidebar({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
  const nav = useShopNav();
  const [draft, setDraft] = useState(nav.activeSearch);
  const [brandSearch, setBrandSearch] = useState("");

  const [pCat, setPCat] = useState(nav.activeCategory);
  const [pBrand, setPBrand] = useState(nav.activeBrand);
  const [pStrain, setPStrain] = useState(nav.activeStrain);
  const [pEffects, setPEffects] = useState<string[]>(nav.activeEffects);
  const [pInstock, setPInstock] = useState(nav.activeInstock);

  const urlKey = `${nav.activeCategory}|${nav.activeBrand}|${nav.activeStrain}|${nav.activeEffects.join(",")}|${nav.activeInstock}`;
  useEffect(() => {
    setPCat(nav.activeCategory);
    setPBrand(nav.activeBrand);
    setPStrain(nav.activeStrain);
    setPEffects(nav.activeEffects);
    setPInstock(nav.activeInstock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  const isDirty = pCat !== nav.activeCategory
    || pBrand !== nav.activeBrand
    || pStrain !== nav.activeStrain
    || pEffects.join(",") !== nav.activeEffects.join(",")
    || pInstock !== nav.activeInstock;

  const hasActive = !!(pCat || pBrand || pStrain || pEffects.length || pInstock);

  const applyFilters = () => {
    nav.push({
      category: pCat,
      brand: pBrand,
      strain: pStrain,
      effects: pEffects.join(","),
      instock: pInstock ? "1" : "",
    });
  };

  const resetFilters = () => {
    setPCat("");
    setPBrand("");
    setPStrain("");
    setPEffects([]);
    setPInstock(false);
  };

  const filteredBrands = brandSearch
    ? brands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands;

  const totalCount = categories.reduce((s, c) => s + c.count, 0);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    nav.setSearch(draft.trim());
  };

  return (
    <aside className="hidden lg:block w-[230px] flex-shrink-0 self-stretch">
      <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3">Search Products</p>
          <form onSubmit={submitSearch} className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Product name…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-400"
              />
            </div>
            <button type="submit"
              className="bg-[#1A9248] hover:bg-[#148038] text-white px-2.5 rounded-lg transition-colors flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
          {nav.activeSearch && (
            <button onClick={() => { setDraft(""); nav.setSearch(""); }}
              className="mt-2 text-[11px] text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Clear: &ldquo;{nav.activeSearch}&rdquo;
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3">Category</p>
          <div className="space-y-0.5">
            <button onClick={() => { setPCat(""); setPBrand(""); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all flex justify-between items-center ${
                !pCat && !pBrand ? "bg-[#1A9248] text-white" : "text-[#3d2b1f] hover:bg-[#f5f0eb] hover:text-[#1A9248]"
              }`}>
              <span>All Products</span>
              <span className={`text-xs font-normal ${!pCat && !pBrand ? "text-white/70" : "text-gray-400"}`}>{totalCount}</span>
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => { setPCat(cat.slug); setPBrand(""); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all flex justify-between items-center ${
                  pCat === cat.slug
                    ? "bg-[#1A9248] text-white"
                    : "text-[#3d2b1f] hover:bg-[#f5f0eb] hover:text-[#1A9248]"
                }`}>
                <span>{cat.name}</span>
                <span className={`text-xs font-normal ${pCat === cat.slug ? "text-white/70" : "text-gray-400"}`}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Brands */}
        {brands.length > 0 && (
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3">Brands</p>
            <div className="relative mb-2">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands…"
                className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-0.5 max-h-[200px] overflow-y-auto">
              {filteredBrands.map((b) => (
                <button key={b.id} onClick={() => { setPBrand(pBrand === b.slug ? "" : b.slug); setPCat(""); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all flex justify-between items-center ${
                    pBrand === b.slug
                      ? "bg-[#1A9248] text-white"
                      : "text-[#3d2b1f] hover:bg-[#f5f0eb] hover:text-[#1A9248]"
                  }`}>
                  <span>{b.name}</span>
                  <span className={`text-xs font-normal ${pBrand === b.slug ? "text-white/70" : "text-gray-400"}`}>{b.count}</span>
                </button>
              ))}
              {brandSearch && filteredBrands.length === 0 && (
                <p className="text-xs text-gray-400 px-3 py-2">No brands found</p>
              )}
            </div>
          </div>
        )}

        {/* Strain Type */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5" /> Strain Type
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STRAINS.map(s => (
              <button key={s.value} onClick={() => setPStrain(pStrain === s.value ? "" : s.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                  pStrain === s.value
                    ? `${s.color} text-white shadow-md`
                    : "bg-gray-50 text-[#3d2b1f] hover:bg-gray-100"
                }`}>
                <span className={`w-2 h-2 rounded-full ${pStrain === s.value ? "bg-white/50" : s.color}`} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Effects */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3">Effects</p>
          <div className="flex flex-wrap gap-1.5">
            {EFFECTS.map(eff => {
              const active = pEffects.includes(eff.value);
              return (
                <button key={eff.value} onClick={() => setPEffects(prev =>
                  prev.includes(eff.value) ? prev.filter(v => v !== eff.value) : [...prev, eff.value]
                )}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={() => setPInstock(!pInstock)}
            className="w-full flex items-center justify-between gap-3 group"
            aria-pressed={pInstock}
          >
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1A9248]">In Stock Only</p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                {pInstock ? "Hiding out of stock items" : "Showing all products"}
              </p>
            </div>
            <div className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-300 ${
              pInstock ? "bg-[#1A9248]" : "bg-gray-200 group-hover:bg-gray-300"
            }`}>
              <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-300 ${
                pInstock ? "translate-x-5" : "translate-x-0"
              }`} />
            </div>
          </button>
        </div>

        {/* Apply / Reset */}
        <div className="p-4 space-y-2">
          <button onClick={applyFilters}
            disabled={!isDirty}
            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
              isDirty
                ? "bg-[#1A9248] text-white hover:bg-[#148038] shadow-md shadow-[#1A9248]/20 animate-pulse"
                : "bg-gray-100 text-gray-400 cursor-default"
            }`}>
            Apply Filters{isDirty && " *"}
          </button>
          {hasActive && (
            <button onClick={resetFilters}
              className="w-full py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
              Reset All Filters
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ─── Desktop sort bar ─── */
export function ShopSortBar({ total, shown }: { total: number; shown: number }) {
  const { activeOrderby, activeOrder, setSort } = useShopNav();
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
          onChange={(e) => { const [ob, or] = e.target.value.split("|"); setSort(ob, or); }}
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

/* ─── Mobile filter + sort bar ─── */
export function ShopMobileBar({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
  const nav = useShopNav();
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState<"categories" | "brands">("categories");
  const [draft, setDraft] = useState(nav.activeSearch);
  const [brandSearch, setBrandSearch] = useState("");
  const active = SORT_OPTIONS.find(o => o.orderby === nav.activeOrderby && o.order === nav.activeOrder) ?? SORT_OPTIONS[0];

  const [pCat, setPCat] = useState(nav.activeCategory);
  const [pBrand, setPBrand] = useState(nav.activeBrand);
  const [pStrain, setPStrain] = useState(nav.activeStrain);
  const [pEffects, setPEffects] = useState<string[]>(nav.activeEffects);
  const [pInstock, setPInstock] = useState(nav.activeInstock);

  const urlKey = `${nav.activeCategory}|${nav.activeBrand}|${nav.activeStrain}|${nav.activeEffects.join(",")}|${nav.activeInstock}`;
  useEffect(() => {
    setPCat(nav.activeCategory);
    setPBrand(nav.activeBrand);
    setPStrain(nav.activeStrain);
    setPEffects(nav.activeEffects);
    setPInstock(nav.activeInstock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  const isDirty = pCat !== nav.activeCategory
    || pBrand !== nav.activeBrand
    || pStrain !== nav.activeStrain
    || pEffects.join(",") !== nav.activeEffects.join(",")
    || pInstock !== nav.activeInstock;

  const hasFilter = !!(pCat || pBrand || pInstock || pStrain || pEffects.length);

  const applyFilters = () => {
    nav.push({
      category: pCat,
      brand: pBrand,
      strain: pStrain,
      effects: pEffects.join(","),
      instock: pInstock ? "1" : "",
    });
    setOpen(false);
  };

  const resetFilters = () => {
    setPCat("");
    setPBrand("");
    setPStrain("");
    setPEffects([]);
    setPInstock(false);
  };

  const filteredBrands = brandSearch
    ? brands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    nav.setSearch(draft.trim());
  };

  return (
    <div className="lg:hidden mb-6 space-y-3">

      {/* Mobile search */}
      <form onSubmit={submitSearch} className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-400 bg-white"
          />
        </div>
        <button type="submit"
          className="bg-[#1A9248] hover:bg-[#148038] text-white px-4 rounded-full transition-colors text-sm font-bold">
          Go
        </button>
        {nav.activeSearch && (
          <button type="button" onClick={() => { setDraft(""); nav.setSearch(""); }}
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
            onChange={(e) => { const [ob, or] = e.target.value.split("|"); nav.setSort(ob, or); }}
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
          {/* Tabs (only show if brands exist) */}
          {brands.length > 0 && (
            <div className="flex gap-1 mb-4 bg-gray-50 rounded-xl p-1">
              {(["categories", "brands"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    tab === t ? "bg-white text-[#2a1008] shadow-sm" : "text-gray-400 hover:text-[#3d2b1f]"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Category grid */}
          {(!brands.length || tab === "categories") && (
            <div className="grid grid-cols-2 gap-1">
              <button onClick={() => { setPCat(""); setPBrand(""); }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !pCat && !pBrand ? "bg-[#1A9248] text-white" : "text-[#3d2b1f] hover:bg-[#f5f0eb]"
                }`}>All Products</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setPCat(cat.slug); setPBrand(""); }}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    pCat === cat.slug ? "bg-[#1A9248] text-white" : "text-[#3d2b1f] hover:bg-[#f5f0eb]"
                  }`}>{cat.name}</button>
              ))}
            </div>
          )}

          {/* Brand grid + search */}
          {brands.length > 0 && tab === "brands" && (
            <div>
              <div className="relative mb-2">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  placeholder="Search brands…"
                  className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-1 max-h-[200px] overflow-y-auto">
                {filteredBrands.map(b => (
                  <button key={b.id} onClick={() => { setPBrand(pBrand === b.slug ? "" : b.slug); setPCat(""); }}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      pBrand === b.slug ? "bg-[#1A9248] text-white" : "text-[#3d2b1f] hover:bg-[#f5f0eb]"
                    }`}>{b.name}</button>
                ))}
                {brandSearch && filteredBrands.length === 0 && (
                  <p className="text-xs text-gray-400 px-3 py-2 col-span-2">No brands found</p>
                )}
              </div>
            </div>
          )}

          {/* Strain + Effects */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Strain</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {STRAINS.map(s => (
                <button key={s.value} onClick={() => setPStrain(pStrain === s.value ? "" : s.value)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                    pStrain === s.value ? `${s.color} text-white` : "bg-gray-100 text-[#3d2b1f]"
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pStrain === s.value ? "bg-white/50" : s.color}`} />
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Effects</p>
            <div className="flex flex-wrap gap-1.5">
              {EFFECTS.map(eff => (
                <button key={eff.value} onClick={() => setPEffects(prev =>
                  prev.includes(eff.value) ? prev.filter(v => v !== eff.value) : [...prev, eff.value]
                )}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
                    pEffects.includes(eff.value) ? "bg-[#1A9248] text-white" : "bg-gray-100 text-[#3d2b1f]"
                  }`}>
                  <eff.icon className="w-2.5 h-2.5" />
                  {eff.label}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock toggle row */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setPInstock(!pInstock)}
              className="w-full flex items-center justify-between gap-3 group py-1"
              aria-pressed={pInstock}
            >
              <span className="text-xs font-bold text-[#3d2b1f]">In Stock Only</span>
              <div className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-300 ${
                pInstock ? "bg-[#1A9248]" : "bg-gray-200 group-hover:bg-gray-300"
              }`}>
                <span className={`absolute top-[3px] left-[3px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  pInstock ? "translate-x-5" : "translate-x-0"
                }`} />
              </div>
            </button>
          </div>

          {/* Apply / Reset */}
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            <button onClick={applyFilters}
              disabled={!isDirty}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                isDirty
                  ? "bg-[#1A9248] text-white hover:bg-[#148038] shadow-md shadow-[#1A9248]/20"
                  : "bg-gray-100 text-gray-400 cursor-default"
              }`}>
              Apply Filters{isDirty && " *"}
            </button>
            {hasFilter && (
              <button onClick={resetFilters}
                className="w-full py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
