"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export const SORT_OPTIONS = [
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

  return {
    params,
    activeSearch:  params.get("search")  ?? "",
    activeOrderby: params.get("orderby") ?? "menu_order",
    activeOrder:   params.get("order")   ?? "asc",
    setSearch:  (q: string)              => push({ search: q }),
    setSort:    (ob: string, or: string) => push({ orderby: ob, order: or }),
  };
}

/* ── Desktop sticky sidebar (search only) ── */
export function CategorySidebar() {
  const { activeSearch, setSearch } = useCatNav();
  const [draft, setDraft] = useState(activeSearch);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(draft.trim());
  };

  return (
    <aside className="hidden lg:block w-[230px] flex-shrink-0 self-stretch">
      <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4">
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

/* ── Mobile: search + sort bar ── */
export function CategoryMobileBar() {
  const { activeSearch, activeOrderby, activeOrder, setSearch, setSort } = useCatNav();
  const [draft, setDraft] = useState(activeSearch);
  const active = SORT_OPTIONS.find(o => o.orderby === activeOrderby && o.order === activeOrder) ?? SORT_OPTIONS[0];

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
      <div className="relative">
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
  );
}
