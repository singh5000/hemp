"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { getCategoryFilterConfig } from "./category-filter-config";
import type { Brand } from "./page";
import PriceRangeSlider from "./PriceRangeSlider";

const SORT_OPTIONS = [
  { label: "Default Sorting",    orderby: "menu_order", order: "asc"  },
  { label: "Sort by Popularity", orderby: "popularity",  order: "asc"  },
  { label: "Sort by Rating",     orderby: "rating",      order: "asc"  },
  { label: "Sort by Latest",     orderby: "date",        order: "desc" },
  { label: "Price: Low → High",  orderby: "price",       order: "asc"  },
  { label: "Price: High → Low",  orderby: "price",       order: "desc" },
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
    activeBrand:    params.get("brand")    ?? "",
    activeMaxPrice: params.get("max_price") ?? "",
    getVal:         (key: string) => params.get(key) ?? "",
    getVals:        (key: string) => params.get(key)?.split(",").filter(Boolean) ?? [],
    setSearch:      (q: string) => push({ search: q }),
    setSort:        (ob: string, or: string) => push({ orderby: ob, order: or }),
    setInstock:     (on: boolean) => push({ instock: on ? "1" : "" }),
    setBrand:       (s: string) => push({ brand: params.get("brand") === s ? "" : s }),
    setMaxPrice:    (v: string) => push({ max_price: v }),
    setFilter:      (key: string, val: string) => push({ [key]: params.get(key) === val ? "" : val }),
    toggleFilter:   (key: string, val: string) => toggleMulti(key, val),
    clearAll: () => {
      const next = new URLSearchParams();
      if (params.get("orderby")) next.set("orderby", params.get("orderby")!);
      if (params.get("order"))   next.set("order", params.get("order")!);
      router.push(`${pathname}?${next.toString()}`);
    },
    hasAnyFilter: () => {
      const skip = new Set(["page", "orderby", "order"]);
      for (const [k, v] of params.entries()) { if (!skip.has(k) && v) return true; }
      return false;
    },
  };
}

/* ── Desktop sidebar ── */
export function CategorySidebar({ categorySlug, brands }: { categorySlug: string; brands: Brand[] }) {
  const nav = useCatNav();
  const [draft, setDraft] = useState(nav.activeSearch);
  const config = getCategoryFilterConfig(categorySlug);

  const submit = (e: React.FormEvent) => { e.preventDefault(); nav.setSearch(draft.trim()); };

  return (
    <aside className="hidden lg:block w-[220px] flex-shrink-0 self-stretch">
      <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">

        {/* Header + Clear */}
        <div className="px-3.5 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-[12px] font-bold text-[#1a1a18]">Filter products</p>
          {nav.hasAnyFilter() && (
            <button onClick={nav.clearAll}
              className="text-[12px] font-medium text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg px-2.5 py-1 transition-colors">
              Clear all
            </button>
          )}
        </div>

        {/* Search */}
        <div className="px-3.5 py-2.5 border-b border-gray-100">
          <form onSubmit={submit} className="flex gap-1.5">
            <div className="relative flex-1">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
                placeholder="Search…"
                className="w-full pl-7 pr-2 py-1.5 text-[12px] border border-gray-200 rounded-md focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-400"/>
            </div>
            <button type="submit"
              className="bg-[#1A9248] hover:bg-[#148038] text-white px-2 rounded-md transition-colors flex-shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
          {nav.activeSearch && (
            <button onClick={() => { setDraft(""); nav.setSearch(""); }}
              className="mt-1.5 text-[12px] text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Clear: &ldquo;{nav.activeSearch}&rdquo;
            </button>
          )}
        </div>

        {/* Dynamic filter groups */}
        {config.filters.map(group => {
          const activeVal  = nav.getVal(group.key);
          const activeVals = nav.getVals(group.key);
          return (
            <div key={group.key} className="px-3.5 py-2.5 border-b border-gray-100">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#3d2b1f] mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-1">
                {group.options.map(opt => {
                  const active = group.type === "single"
                    ? activeVal === opt.value
                    : activeVals.includes(opt.value);
                  return (
                    <button key={opt.value}
                      onClick={() => group.type === "single" ? nav.setFilter(group.key, opt.value) : nav.toggleFilter(group.key, opt.value)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[12px] font-medium border transition-all ${
                        active
                          ? "bg-[#1a1a18] text-white border-[#1a1a18]"
                          : "bg-white text-[#3d2b1f] border-gray-200 hover:border-gray-400"
                      }`}>
                      {opt.color && (
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: active ? "#fff" : opt.color, opacity: active ? 0.6 : 1 }} />
                      )}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Brands */}
        {brands.length > 0 && (
          <div className="px-3.5 py-2.5 border-b border-gray-100">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#3d2b1f] mb-2">Brand</p>
            <div className="space-y-0.5 max-h-[120px] overflow-y-auto">
              {brands.map(b => (
                <button key={b.id} onClick={() => nav.setBrand(b.slug)}
                  className={`w-full text-left px-2 py-1 rounded-md text-[12px] font-medium transition-all flex justify-between items-center ${
                    nav.activeBrand === b.slug
                      ? "bg-[#1A9248] text-white"
                      : "text-[#3d2b1f] hover:bg-gray-50"
                  }`}>
                  <span>{b.name}</span>
                  <span className={`text-[12px] ${nav.activeBrand === b.slug ? "text-white/70" : "text-gray-400"}`}>{b.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price range */}
        {config.priceRange && (
          <div className="px-3.5 py-2.5 border-b border-gray-100">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#3d2b1f] mb-2">Price Range</p>
            <PriceRangeSlider
              min={config.priceRange.min}
              max={config.priceRange.max}
              step={config.priceRange.step}
              currentMax={nav.activeMaxPrice ? Number(nav.activeMaxPrice) : config.priceRange.max}
              onApply={nav.setMaxPrice}
            />
          </div>
        )}

        {/* In Stock toggle */}
        <div className="px-3.5 py-2.5">
          <button onClick={() => nav.setInstock(!nav.activeInstock)}
            className="w-full flex items-center justify-between gap-3 group" aria-pressed={nav.activeInstock}>
            <div className="text-left">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#3d2b1f]">In Stock Only</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{nav.activeInstock ? "Hiding out of stock" : "Showing all"}</p>
            </div>
            <div className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-300 ${
              nav.activeInstock ? "bg-[#1A9248]" : "bg-gray-200 group-hover:bg-gray-300"
            }`}>
              <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-300 ${
                nav.activeInstock ? "translate-x-5" : "translate-x-0"
              }`} />
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ── Desktop sort bar ── */
export function CategorySortBar({ total, shown }: { total: number; shown: number }) {
  const { activeOrderby, activeOrder, setSort } = useCatNav();
  const active = SORT_OPTIONS.find(o => o.orderby === activeOrderby && o.order === activeOrder) ?? SORT_OPTIONS[0];
  return (
    <div className="hidden lg:flex items-center justify-between mb-6">
      <p className="text-gray-400 text-[18px]">
        Showing <span className="font-bold text-[#3d2b1f]">{shown}</span> of{" "}
        <span className="font-bold text-[#3d2b1f]">{total}</span> products
      </p>
      <div className="relative">
        <select value={`${active.orderby}|${active.order}`}
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

/* ── Mobile bar ── */
export function CategoryMobileBar({ categorySlug, brands }: { categorySlug: string; brands: Brand[] }) {
  const nav = useCatNav();
  const [draft, setDraft] = useState(nav.activeSearch);
  const [open, setOpen] = useState(false);
  const config = getCategoryFilterConfig(categorySlug);
  const active = SORT_OPTIONS.find(o => o.orderby === nav.activeOrderby && o.order === nav.activeOrder) ?? SORT_OPTIONS[0];
  const hasFilters = config.filters.length > 0 || config.priceRange || brands.length > 0;

  const submit = (e: React.FormEvent) => { e.preventDefault(); nav.setSearch(draft.trim()); };

  return (
    <div className="lg:hidden mb-6 space-y-3">
      {/* Search */}
      <form onSubmit={submit} className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-400 bg-white"/>
        </div>
        <button type="submit" className="bg-[#1A9248] hover:bg-[#148038] text-white px-4 rounded-full transition-colors text-sm font-bold">Go</button>
        {nav.activeSearch && (
          <button type="button" onClick={() => { setDraft(""); nav.setSearch(""); }}
            className="bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-500 px-3 rounded-full transition-colors text-sm font-bold">✕</button>
        )}
      </form>

      <div className="flex items-center gap-3">
        {hasFilters && (
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-bold text-[#3d2b1f] hover:border-[#1A9248] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
            </svg>
            Filters
            {nav.hasAnyFilter() && <span className="w-2 h-2 rounded-full bg-[#1A9248]" />}
          </button>
        )}
        <div className="relative flex-1">
          <select value={`${active.orderby}|${active.order}`}
            onChange={e => { const [ob, or] = e.target.value.split("|"); nav.setSort(ob, or); }}
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
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
          {/* Clear all */}
          {nav.hasAnyFilter() && (
            <div className="flex justify-end">
              <button onClick={nav.clearAll} className="text-[12px] text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg px-2.5 py-1">Clear all</button>
            </div>
          )}

          {/* Dynamic filters */}
          {config.filters.map(group => {
            const activeVal  = nav.getVal(group.key);
            const activeVals = nav.getVals(group.key);
            return (
              <div key={group.key}>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">{group.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.options.map(opt => {
                    const isActive = group.type === "single" ? activeVal === opt.value : activeVals.includes(opt.value);
                    return (
                      <button key={opt.value}
                        onClick={() => group.type === "single" ? nav.setFilter(group.key, opt.value) : nav.toggleFilter(group.key, opt.value)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium border transition-all ${
                          isActive ? "bg-[#1a1a18] text-white border-[#1a1a18]" : "bg-white text-[#3d2b1f] border-gray-200"
                        }`}>
                        {opt.color && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? "#fff" : opt.color, opacity: isActive ? 0.6 : 1 }} />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Brands */}
          {brands.length > 0 && (
            <div>
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Brand</p>
              <div className="flex flex-wrap gap-1.5">
                {brands.slice(0, 10).map(b => (
                  <button key={b.id} onClick={() => nav.setBrand(b.slug)}
                    className={`px-2.5 py-1 rounded-full text-[12px] font-medium border transition-all ${
                      nav.activeBrand === b.slug ? "bg-[#1A9248] text-white border-[#1A9248]" : "bg-white text-[#3d2b1f] border-gray-200"
                    }`}>{b.name}</button>
                ))}
              </div>
            </div>
          )}

          {/* Price range */}
          {config.priceRange && (
            <div>
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Price Range</p>
              <PriceRangeSlider
                min={config.priceRange.min}
                max={config.priceRange.max}
                step={config.priceRange.step}
                currentMax={nav.activeMaxPrice ? Number(nav.activeMaxPrice) : config.priceRange.max}
                onApply={nav.setMaxPrice}
              />
            </div>
          )}

          {/* In Stock */}
          <div className="pt-3 border-t border-gray-100">
            <button onClick={() => nav.setInstock(!nav.activeInstock)}
              className="w-full flex items-center justify-between gap-3 group py-1" aria-pressed={nav.activeInstock}>
              <span className="text-[12px] font-bold text-[#3d2b1f]">In Stock Only</span>
              <div className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-300 ${
                nav.activeInstock ? "bg-[#1A9248]" : "bg-gray-200 group-hover:bg-gray-300"
              }`}>
                <span className={`absolute top-[3px] left-[3px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  nav.activeInstock ? "translate-x-5" : "translate-x-0"
                }`} />
              </div>
            </button>
          </div>

          {/* Apply button */}
          <button onClick={() => setOpen(false)}
            className="w-full py-2.5 text-[12px] font-bold text-center bg-[#1a1a18] hover:bg-[#333] text-white rounded-xl transition-colors">
            Apply filters
          </button>
        </div>
      )}
    </div>
  );
}
