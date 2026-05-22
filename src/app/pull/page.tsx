"use client";

import { Card } from "@/lib/types";
import { useState } from "react";

const getRarityStyles = (rarity: string) => {
  switch (rarity.toUpperCase()) {
    case "COMMON":
      return { border: "border-zinc-700", bg: "bg-zinc-900", text: "text-zinc-400" };
    case "RARE":
      return { border: "border-blue-500/50", bg: "bg-slate-900", text: "text-blue-400" };
    case "EPIC":
      return { border: "border-purple-500/50", bg: "bg-neutral-900", text: "text-purple-400" };
    case "LEGENDARY":
      return { border: "border-amber-500/60", bg: "bg-stone-900", text: "text-amber-400" };
    default:
      return { border: "border-zinc-800", bg: "bg-black", text: "text-zinc-500" };
  }
};

export default function PullPage() {
  const [pulledCards, setPulledCards] = useState<Card[]>([]);
  const [pulling, setPulling] = useState(false);

  const handlePull = async () => {
    setPulling(true);
    try {
      const res = await fetch("/api/cards/pull");
      const newCards: Card[] = await res.json();
      
      setPulledCards(newCards);

      // Store in LocalStorage
      const existingCollection = JSON.parse(localStorage.getItem("wrestler_collection") || "[]");
      const updatedCollection = [...existingCollection, ...newCards];
      localStorage.setItem("wrestler_collection", JSON.stringify(updatedCollection));
      
    } catch (err) {
      console.error("Failed to pull cards:", err);
    } finally {
      setPulling(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] p-8 overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <header className="mb-16">
          <h1 className="text-6xl font-black uppercase tracking-tight text-white font-serif mb-4 drop-shadow-2xl">
            Card <span className="text-zinc-500">Opening</span>
          </h1>
          <p className="text-zinc-500 font-serif italic text-lg tracking-wide">
            Test your luck in the Elite Vault
          </p>
        </header>

        <div className="flex flex-col items-center gap-12">
          {/* Pull Button */}
          <button
            onClick={handlePull}
            disabled={pulling}
            className={`group relative px-12 py-6 rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
              pulling 
                ? "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed" 
                : "bg-white border-white text-black hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            }`}
          >
            <span className="relative z-10 font-black uppercase tracking-[0.2em] text-lg">
              {pulling ? "Summoning..." : "Pull 10 Cards"}
            </span>
            {!pulling && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-white to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            )}
          </button>

          {/* Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full">
            {pulledCards.length > 0 ? (
              pulledCards.map((card, idx) => {
                const styles = getRarityStyles(card.rarity);
                return (
                  <div
                    key={`${card.id}-${idx}`}
                    className={`relative flex flex-col h-[280px] rounded-xl border-2 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8 ${styles.bg} ${styles.border}`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex-1 relative overflow-hidden m-2 rounded-lg bg-zinc-950 border border-white/5 shadow-inner">
                      {card.imageUrl ? (
                        <img
                          src={`/api/proxy?url=${encodeURIComponent(card.imageUrl)}`}
                          alt={card.name}
                          className="w-full h-full object-cover object-top opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl font-serif font-black text-white italic opacity-10">VOID</span>
                        </div>
                      )}
                      
                      <div className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded border border-white/10 text-[7px] font-black tracking-widest uppercase backdrop-blur-md ${styles.text}`}>
                        {card.rarity}
                      </div>
                    </div>
                    
                    <div className="p-3 text-left">
                      <h3 className="font-serif font-bold text-xs leading-none text-zinc-100 truncate">
                        {card.name}
                      </h3>
                      <p className="text-[8px] text-zinc-600 font-serif italic mt-1 uppercase tracking-tighter">
                        {card.alignment} • {card.promotion || "Independent"}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty Slots
              Array.from({ length: 10 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="h-[280px] rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/20 flex items-center justify-center"
                >
                  <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center opacity-20">
                    <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
