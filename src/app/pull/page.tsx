"use client";

import { Card } from "@/lib/types";
import { useState, useEffect } from "react";

const getRarityStyles = (rarity: string) => {
  switch (rarity.toUpperCase()) {
    case "COMMON":
      return { border: "border-zinc-700", bg: "bg-zinc-900", text: "text-zinc-400", glow: "shadow-zinc-900" };
    case "RARE":
      return { border: "border-blue-500/50", bg: "bg-slate-900", text: "text-blue-400", glow: "shadow-blue-500/20" };
    case "EPIC":
      return { border: "border-purple-500/50", bg: "bg-neutral-900", text: "text-purple-400", glow: "shadow-purple-500/30" };
    case "LEGENDARY":
      return { border: "border-amber-500/60", bg: "bg-stone-900", text: "text-amber-400", glow: "shadow-amber-500/40" };
    default:
      return { border: "border-zinc-800", bg: "bg-black", text: "text-zinc-500", glow: "shadow-black" };
  }
};

type PackState = "idle" | "fetching" | "sealed" | "tearing" | "revealed";

export default function PullPage() {
  const [pulledCards, setPulledCards] = useState<Card[]>([]);
  const [packState, setPackState] = useState<PackState>("idle");
  const [revealedCount, setRevealedCount] = useState(0);

  const handleStartPull = async () => {
    setPackState("fetching");
    try {
      const res = await fetch("/api/cards/pull", { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to pull cards");
        setPackState("idle");
        return;
      }

      setPulledCards(data);
      setPackState("sealed");
      
      // Update global user state (money) by triggering a refresh
      window.dispatchEvent(new Event("user-updated"));
    } catch (err) {
      console.error("Failed to pull cards:", err);
      setPackState("idle");
    }
  };

  const handleOpenPack = () => {
    if (packState !== "sealed") return;
    setPackState("tearing");
    
    // After tear animation, show revealed cards
    setTimeout(() => {
      setPackState("revealed");
    }, 800);
  };

  useEffect(() => {
    if (packState === "revealed") {
      const interval = setInterval(() => {
        setRevealedCount(prev => {
          if (prev < pulledCards.length) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 150);
      return () => clearInterval(interval);
    } else {
      setRevealedCount(0);
    }
  }, [packState, pulledCards.length]);

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] p-8 overflow-hidden flex flex-col items-center justify-center">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center">
        {packState === "idle" && (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-7xl font-black uppercase tracking-tight text-white font-serif mb-12 drop-shadow-2xl">
              Elite <span className="text-zinc-500">Booster</span>
            </h1>
            <button
              onClick={handleStartPull}
              className="group relative px-16 py-8 rounded-3xl bg-white text-black font-black uppercase tracking-[0.3em] text-xl transition-all hover:scale-110 hover:shadow-[0_0_80px_rgba(255,255,255,0.2)] active:scale-95"
            >
              Get New Pack
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-transparent to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>
        )}

        {(packState === "fetching" || packState === "sealed" || packState === "tearing") && (
          <div className="relative w-80 h-[450px] cursor-pointer group" onClick={handleOpenPack}>
            {/* Sealed Pack Visual */}
            <div className={`absolute inset-0 z-20 transition-all duration-500 ${packState === "tearing" ? 'pointer-events-none' : ''}`}>
              {/* Top Half */}
              <div className={`absolute top-0 left-0 w-full h-1/2 bg-zinc-800 clip-crimped border-4 border-zinc-700 shadow-2xl flex items-end justify-center pb-4 transition-all ${packState === "tearing" ? 'animate-pack-tear-top' : 'group-hover:-translate-y-2'}`}>
                <span className="text-zinc-500 font-black uppercase tracking-widest text-2xl opacity-20 select-none">WRESTLER</span>
              </div>
              {/* Bottom Half */}
              <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-zinc-800 clip-crimped border-4 border-zinc-700 shadow-2xl flex items-start justify-center pt-4 transition-all ${packState === "tearing" ? 'animate-pack-tear-bottom' : 'group-hover:translate-y-2'}`}>
                <span className="text-zinc-500 font-black uppercase tracking-widest text-2xl opacity-20 select-none">TCG</span>
              </div>
              
              {/* Central Seal/Logo */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-zinc-900 border-4 border-zinc-600 rounded-full z-30 flex items-center justify-center shadow-2xl transition-all ${packState === "tearing" ? 'scale-0 opacity-0 rotate-180' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                <div className="text-white font-serif font-black text-4xl">W</div>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
            </div>

            {packState === "fetching" && (
              <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/40 backdrop-blur-sm rounded-3xl">
                <div className="text-white font-black uppercase tracking-widest animate-pulse italic">Fetching...</div>
              </div>
            )}
            
            {!packState.includes("revealed") && packState !== "fetching" && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-zinc-500 font-serif italic animate-bounce">
                Click to Open
              </div>
            )}
          </div>
        )}

        {packState === "revealed" && (
          <div className="w-full flex flex-col items-center">
             <header className="mb-12 text-center">
                <h2 className="text-zinc-500 font-serif italic text-2xl tracking-wide uppercase">New Acquisitions</h2>
                <button 
                  onClick={() => setPackState("idle")}
                  className="mt-4 text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors tracking-[0.2em] border-b border-zinc-800 pb-1"
                >
                  Return to Lobby
                </button>
             </header>

             <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full">
                {pulledCards.map((card, idx) => {
                  const isVisible = idx < revealedCount;
                  const styles = getRarityStyles(card.rarity);
                  return (
                    <div
                      key={`${card.id}-${idx}`}
                      className={`relative flex flex-col h-[380px] rounded-2xl border-2 transition-all duration-500 hover:-translate-y-2 ${styles.bg} ${styles.border} ${styles.glow} ${isVisible ? 'animate-card-reveal opacity-100' : 'opacity-0 scale-50'}`}
                    >
                      {/* Portrait */}
                      <div className="relative flex-1 m-3 rounded-xl overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl">
                        {card.imageUrl ? (
                          <img
                            src={`/api/proxy?url=${encodeURIComponent(card.imageUrl)}`}
                            alt={card.name}
                            className="w-full h-full object-cover object-top opacity-90 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-10">
                            <span className="text-4xl font-serif font-black text-white italic">VOID</span>
                          </div>
                        )}
                        <div className={`absolute bottom-2 right-2 px-2 py-1 rounded border border-white/10 text-[8px] font-black tracking-widest uppercase backdrop-blur-md ${styles.text}`}>
                          {card.rarity}
                        </div>
                      </div>

                      <div className="p-4 bg-black/40 backdrop-blur-sm z-10 border-t border-white/5">
                         <h3 className="font-serif font-bold text-sm leading-tight text-zinc-100 truncate mb-1">
                            {card.name}
                         </h3>
                         <p className="text-[9px] text-zinc-500 font-serif italic uppercase tracking-tighter">
                            {card.alignment} • {card.promotion || "Independent"}
                         </p>
                      </div>

                      {/* Sparkle for Legendaries */}
                      {card.rarity.toUpperCase() === "LEGENDARY" && isVisible && (
                        <div className="absolute inset-0 pointer-events-none">
                           <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t from-transparent via-amber-500/10 to-transparent animate-shimmer"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>
          </div>
        )}
      </div>

      {/* Dynamic Background Glow */}
      {packState === "revealed" && (
        <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[150px] animate-pulse"></div>
        </div>
      )}
    </main>
  );
}
