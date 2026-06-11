"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function CollectionFilters({ 
  search, 
  rarity, 
  sortBy 
}: { 
  search: string; 
  rarity: string; 
  sortBy: string; 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilters = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "ALL" || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl mb-8">
      <input 
        type="text" 
        placeholder="Search your collection..." 
        className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors w-64"
        defaultValue={search}
        onChange={(e) => updateFilters({ search: e.target.value })}
      />
      
      <select 
        className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer pr-10"
        value={rarity}
        onChange={(e) => updateFilters({ rarity: e.target.value })}
      >
        <option value="ALL">ALL CLASSES</option>
        <option value="COMMON">COMMON</option>
        <option value="RARE">RARE</option>
        <option value="EPIC">EPIC</option>
        <option value="LEGENDARY">LEGENDARY</option>
      </select>

      <select 
        className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer pr-10"
        value={sortBy}
        onChange={(e) => updateFilters({ sortBy: e.target.value })}
      >
        <option value="DATE_DESC">NEWEST FIRST</option>
        <option value="NAME_ASC">NAME (A-Z)</option>
        <option value="NAME_DESC">NAME (Z-A)</option>
      </select>
      
      {isPending && <span className="text-[10px] text-zinc-500 animate-pulse uppercase font-black">Updating...</span>}
    </div>
  );
}
