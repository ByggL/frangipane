"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function RosterFilters({ 
  search, 
  rarity, 
  sortBy, 
  totalCount, 
  page, 
  totalPages 
}: { 
  search: string; 
  rarity: string; 
  sortBy: string; 
  totalCount: number; 
  page: number; 
  totalPages: number; 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilters = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "ALL" || value === "" || (key === "page" && value === 1)) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // We might want to debounce this, but for now let's keep it simple or use a form
    const value = e.target.value;
    updateFilters({ search: value, page: 1 });
  };

  return (
    <header className="mb-12">
      <div className="flex flex-col items-center justify-center gap-4 mb-12">
        <h2 className="text-zinc-500 font-serif italic text-2xl tracking-wide uppercase">
          The Vault Collection
        </h2>
        <div className="flex items-center gap-4">
          <span className="h-[1px] w-12 bg-zinc-800"></span>
          <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">Elite Edition</span>
          <span className="h-[1px] w-12 bg-zinc-800"></span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 p-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl mb-8">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 text-left">Search Roster</label>
          <input 
            type="text" 
            placeholder="Wrestler or Promotion..." 
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors w-64"
            defaultValue={search}
            onChange={(e) => {
                // Debounce manual implementation if needed, or just let useTransition handle it
                handleSearchChange(e);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 text-left">Rarity Class</label>
          <select 
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer pr-10"
            value={rarity}
            onChange={(e) => updateFilters({ rarity: e.target.value, page: 1 })}
          >
            <option value="ALL">ALL CLASSES</option>
            <option value="COMMON">COMMON</option>
            <option value="RARE">RARE</option>
            <option value="EPIC">EPIC</option>
            <option value="LEGENDARY">LEGENDARY</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 text-left">Sort Priority</label>
          <select 
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer pr-10"
            value={sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value })}
          >
            <option value="NAME_ASC">NAME (A-Z)</option>
            <option value="NAME_DESC">NAME (Z-A)</option>
            <option value="HEIGHT_DESC">TALLEST FIRST</option>
            <option value="WEIGHT_DESC">HEAVIEST FIRST</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 mb-8 text-zinc-500 font-serif italic text-sm">
        <span className={isPending ? "opacity-50" : ""}>Found {totalCount} Wrestlers</span>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
            disabled={page === 1 || isPending}
            className="px-4 py-1.5 rounded-lg border border-white/5 bg-zinc-900/50 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors uppercase font-black tracking-tighter text-[10px] text-zinc-400"
          >
            Previous
          </button>
          <span className="text-zinc-300">Page {page} of {totalPages}</span>
          <button 
            onClick={() => updateFilters({ page: Math.min(totalPages, page + 1) })}
            disabled={page === totalPages || isPending}
            className="px-4 py-1.5 rounded-lg border border-white/5 bg-zinc-900/50 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors uppercase font-black tracking-tighter text-[10px] text-zinc-400"
          >
            Next
          </button>
        </div>
      </div>
    </header>
  );
}
