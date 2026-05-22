"use client";

import { Card } from "@/lib/types";
import { useEffect, useState } from "react";

const getRarityStyles = (rarity: string) => {
  switch (rarity.toUpperCase()) {
    case "COMMON":
      return {
        border: "border-zinc-700",
        glow: "shadow-zinc-900/50",
        text: "text-zinc-400",
        accent: "bg-zinc-800",
        bg: "bg-zinc-900"
      };
    case "RARE":
      return {
        border: "border-blue-500/50",
        glow: "shadow-blue-900/40",
        text: "text-blue-400",
        accent: "bg-blue-900/30",
        bg: "bg-slate-900"
      };
    case "EPIC":
      return {
        border: "border-purple-500/50",
        glow: "shadow-purple-900/40",
        text: "text-purple-400",
        accent: "bg-purple-900/30",
        bg: "bg-neutral-900"
      };
    case "LEGENDARY":
      return {
        border: "border-amber-500/60",
        glow: "shadow-amber-900/40",
        text: "text-amber-400",
        accent: "bg-amber-900/30",
        bg: "bg-stone-900"
      };
    default:
      return {
        border: "border-zinc-800",
        glow: "shadow-black",
        text: "text-zinc-500",
        accent: "bg-zinc-900",
        bg: "bg-black"
      };
  }
};

const getAlignmentBadge = (alignment: string) => {
  return alignment.toUpperCase() === "FACE" 
    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
    : "bg-rose-500/20 text-rose-400 border border-rose-500/30";
};

export default function CollectionPage() {
  const [collection, setCollection] = useState<Card[]>([]);
  const [filteredCollection, setFilteredCollection] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort State
  const [search, setSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE_DESC");

  useEffect(() => {
    const savedCollection = JSON.parse(localStorage.getItem("wrestler_collection") || "[]");
    setCollection(savedCollection);
    setFilteredCollection(savedCollection);
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = [...collection];

    // Search filter
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(term) || 
        (c.promotion && c.promotion.toLowerCase().includes(term))
      );
    }

    // Rarity filter
    if (rarityFilter !== "ALL") {
      result = result.filter(c => c.rarity.toUpperCase() === rarityFilter);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "NAME_ASC": return a.name.localeCompare(b.name);
        case "NAME_DESC": return b.name.localeCompare(a.name);
        case "DATE_DESC": return 0; // LocalStorage doesn't keep dates by default, but we could add them
        default: return 0;
      }
    });

    setFilteredCollection(result);
  }, [search, rarityFilter, sortBy, collection]);

  if (loading) {
    return (
      <main className="p-8 flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-3xl font-serif italic animate-pulse text-zinc-700 tracking-widest uppercase">
          Loading Collection...
        </div>
      </main>
    );
  }

  return (
    <main className="relative p-8 bg-[#0a0a0a] min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 text-center">
          <h1 className="text-7xl font-black uppercase tracking-tight text-white font-serif mb-4 drop-shadow-2xl">
            My <span className="text-zinc-500">Collection</span>
          </h1>
          <p className="text-zinc-500 font-serif italic text-lg tracking-wide mb-8">
            Your Personal Elite Roster
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 p-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl mb-8">
            <input 
              type="text" 
              placeholder="Search your collection..." 
              className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            
            <select 
              className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer pr-10"
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
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
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="DATE_DESC">NEWEST FIRST</option>
              <option value="NAME_ASC">NAME (A-Z)</option>
              <option value="NAME_DESC">NAME (Z-A)</option>
            </select>
          </div>
        </header>

        {filteredCollection.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            {filteredCollection.map((card, idx) => {
              const styles = getRarityStyles(card.rarity);
              return (
                <div
                  key={`${card.id}-${idx}`}
                  className={`group relative flex flex-col h-[460px] rounded-2xl border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden ${styles.bg} ${styles.border} ${styles.glow}`}
                >
                  <div className="p-4 flex justify-between items-start z-10">
                    <div className="flex flex-col gap-1">
                      <h2 className="font-serif font-bold text-lg leading-none text-zinc-100 group-hover:text-white transition-colors">
                        {card.name}
                      </h2>
                      <span className={`text-[9px] w-fit px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${getAlignmentBadge(card.alignment)}`}>
                        {card.alignment}
                      </span>
                    </div>
                  </div>

                  <div className="relative flex-1 mx-4 mb-2 rounded-xl overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl">
                    {card.imageUrl ? (
                      <img
                        src={`/api/proxy?url=${encodeURIComponent(card.imageUrl)}`}
                        alt={card.name}
                        className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10">
                        <span className="text-4xl font-serif font-black text-white italic">VOID</span>
                      </div>
                    )}
                    <div className={`absolute bottom-2 right-2 px-2 py-1 rounded border border-white/10 text-[9px] font-black tracking-widest uppercase backdrop-blur-md ${styles.accent} ${styles.text}`}>
                      {card.rarity}
                    </div>
                  </div>

                  <div className="p-5 bg-black/40 backdrop-blur-sm z-10 border-t border-white/5">
                    <p className="font-serif text-xs text-zinc-400 italic truncate mb-2">{card.promotion || "Independent"}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-black tracking-tighter text-zinc-600">
                      <span>{card.height} cm</span>
                      <span>{card.weight} kg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-zinc-900 rounded-3xl">
            <p className="text-zinc-600 font-serif italic text-xl mb-6">Your vault is currently empty.</p>
            <Link 
              href="/pull" 
              className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform inline-block"
            >
              Go Pull Some Cards
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

import Link from "next/link";
