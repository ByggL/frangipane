"use client";

import Link from "next/link";
import { getRarityStyles, getAlignmentBadge } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CollectionListProps {
  userId: string;
  search: string;
  rarity: string;
  sortBy: string;
}

export default function CollectionList({
  userId,
  search,
  rarity,
  sortBy,
}: CollectionListProps) {
  const [collection, setCollection] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search,
          rarity,
          sortBy,
        });
        const res = await fetch(`/api/user/collection?${params.toString()}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setCollection(data);
        }
      } catch (error) {
        console.error("Failed to fetch collection:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [search, rarity, sortBy]);

  if (loading) {
    return <CollectionListSkeleton />;
  }

  if (collection.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-zinc-900 rounded-3xl">
        <p className="text-zinc-600 font-serif italic text-xl mb-6">Your vault is currently empty.</p>
        <Link
          href="/pull"
          className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform inline-block"
        >
          Go Pull Some Cards
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
      {collection.map((card, idx) => {
        const styles = getRarityStyles(card.rarity);
        return (
          <Link
            key={`${card.id}-${idx}`}
            href={`/roster/${card.id}`}
            className={`group relative flex flex-col h-115 rounded-2xl border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden ${styles.bg} ${styles.border} ${styles.glow}`}
          >
            {card.quantity > 1 && (
              <div className="absolute top-4 right-4 z-20 bg-white text-black px-2 py-1 rounded-md text-[10px] font-black">
                x{card.quantity}
              </div>
            )}
            <div className="p-4 flex justify-between items-start z-10">
              <div className="flex flex-col gap-1">
                <h2 className="font-serif font-bold text-lg leading-none text-zinc-100 group-hover:text-white transition-colors">
                  {card.name}
                </h2>
                <span
                  className={`text-[9px] w-fit px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${getAlignmentBadge(card.alignment)}`}
                >
                  {card.alignment}
                </span>
              </div>
            </div>

            <div className="relative flex-1 mx-4 mb-2 rounded-xl overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl">
              {card.imageUrl ? (
                <Image
                  src={`/api/proxy?url=${encodeURIComponent(card.imageUrl)}`}
                  alt={card.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10">
                  <span className="text-4xl font-serif font-black text-white italic">VOID</span>
                </div>
              )}
              <div
                className={`absolute bottom-2 right-2 px-2 py-1 rounded border border-white/10 text-[9px] font-black tracking-widest uppercase backdrop-blur-md ${styles.accent} ${styles.text}`}
              >
                {card.rarity}
              </div>
            </div>

            <div className="p-5 bg-black/40 backdrop-blur-sm z-10 border-t border-white/5">
              <p className="font-serif text-xs text-zinc-400 italic truncate mb-2">
                {card.promotion || "Independent"}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-black tracking-tighter text-zinc-600">
                <span>{card.height} cm</span>
                <span>{card.weight} kg</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function CollectionListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-115 rounded-2xl border-2 border-zinc-900 bg-zinc-900/20 animate-pulse overflow-hidden"
        >
          <div className="p-4 space-y-2">
            <div className="h-5 w-3/4 bg-zinc-800 rounded"></div>
            <div className="h-3 w-1/4 bg-zinc-800 rounded"></div>
          </div>
          <div className="flex-1 mx-4 mb-2 rounded-xl bg-zinc-900/40 border border-white/5"></div>
          <div className="p-5 space-y-3 border-t border-white/5">
            <div className="h-4 bg-zinc-900/40 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-zinc-900/40 rounded"></div>
              <div className="h-4 bg-zinc-900/40 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
