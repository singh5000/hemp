"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

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

  return {
    params,
    activeCategory: params.get("category") ?? "",
    activeBrand:    params.get("brand")    ?? "",
    activeSearch:   params.get("search")   ?? "",
    activeOrderby:  params.get("orderby")  ?? "menu_order",
    activeOrder:    params.get("order")    ?? "asc",
    activeInstock:  params.get("instock") === "1",
    setCategory: (slug: string) => push({ category: slug, brand: "" }),
    setBrand:    (slug: string) => push({ brand: slug, category: "" }),
    setSearch:   (q: string)    => push({ search: q }),
    setSort:     (ob: string, or: string) => push({ orderby: ob, order: or }),
    setInstock:  (on: boolean)  => push({ instock: on ? "1" : "" }),
  };
}

/* ─── Desktop sidebar ─── */
export function ShopSidebar({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
  const { activeCategory, activeBrand, activeSearch, activeInstock, setCategory, setBrand, setSearch, setInstock } = useShopNav();
  const [draft, setDraft] = useState(activeSearch);
  const totalCount = categories.reduce((s, c) => s + c.count, 0);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(draft.trim());
  };

  return (
    <aside className="hidden lg:block w-[230px] flex-shrink-0 self-stretch">
      <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3">Search Products</p>
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
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A9248] text-[#3d2b1f] placeholder:text-gray-400"
              />
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
              Clear: "{activeSearch}"
            </button>
          )}
        </div>

        {/* Categories */}
        <div className={`p-4 ${brands.length > 0 ? "border-b border-gray-100" : ""}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3">Category</p>
          <div className="space-y-0.5">
            <button onClick={() => setCategory("")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all flex justify-between items-center ${
                !activeCategory && !activeBrand ? "bg-[#1A9248] text-white" : "text-[#3d2b1f] hover:bg-[#f5f0eb] hover:text-[#1A9248]"
              }`}>
              <span>All Products</span>
              <span className={`text-xs font-normal ${!activeCategory && !activeBrand ? "text-white/70" : "text-gray-400"}`}>{totalCount}</span>
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all flex justify-between items-center ${
                  activeCategory === cat.slug
                    ? "bg-[#1A9248] text-white"
                    : "text-[#3d2b1f] hover:bg-[#f5f0eb] hover:text-[#1A9248]"
                }`}>
                <span>{cat.name}</span>
                <span className={`text-xs font-normal ${activeCategory === cat.slug ? "text-white/70" : "text-gray-400"}`}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Brands */}
        {brands.length > 0 && (
          <div className="p-4 border-b border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A9248] mb-3">Brands</p>
            <div className="space-y-0.5">
              {brands.map((b) => (
                <button key={b.id} onClick={() => setBrand(activeBrand === b.slug ? "" : b.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all flex justify-between items-center ${
                    activeBrand === b.slug
                      ? "bg-[#1A9248] text-white"
                      : "text-[#3d2b1f] hover:bg-[#f5f0eb] hover:text-[#1A9248]"
                  }`}>
                  <span>{b.name}</span>
                  <span className={`text-xs font-normal ${activeBrand === b.slug ? "text-white/70" : "text-gray-400"}`}>{b.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
            {/* Toggle pill */}
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
  const { activeCategory, activeBrand, activeOrderby, activeOrder, activeSearch, activeInstock, setCategory, setBrand, setSort, setSearch, setInstock } = useShopNav();
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState<"categories" | "brands">("categories");
  const [draft, setDraft] = useState(activeSearch);
  const active = SORT_OPTIONS.find(o => o.orderby === activeOrderby && o.order === activeOrder) ?? SORT_OPTIONS[0];
  const hasFilter = !!(activeCategory || activeBrand || activeInstock);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(draft.trim());
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
            onChange={(e) => { const [ob, or] = e.target.value.split("|"); setSort(ob, or); }}
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
              <button onClick={() => { setCategory(""); setOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !activeCategory && !activeBrand ? "bg-[#1A9248] text-white" : "text-[#3d2b1f] hover:bg-[#f5f0eb]"
                }`}>All Products</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setCategory(cat.slug); setOpen(false); }}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeCategory === cat.slug ? "bg-[#1A9248] text-white" : "text-[#3d2b1f] hover:bg-[#f5f0eb]"
                  }`}>{cat.name}</button>
              ))}
            </div>
          )}

          {/* Brand grid */}
          {brands.length > 0 && tab === "brands" && (
            <div className="grid grid-cols-2 gap-1">
              {brands.map(b => (
                <button key={b.id} onClick={() => { setBrand(activeBrand === b.slug ? "" : b.slug); setOpen(false); }}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeBrand === b.slug ? "bg-[#1A9248] text-white" : "text-[#3d2b1f] hover:bg-[#f5f0eb]"
                  }`}>{b.name}</button>
              ))}
            </div>
          )}

          {/* In Stock toggle row */}
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
