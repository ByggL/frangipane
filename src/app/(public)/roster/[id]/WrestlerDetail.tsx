import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getRarityStyles, getAlignmentBadge } from "@/lib/utils";
import Image from "next/image";

export default async function WrestlerDetail({ id }: { id: string }) {
  const card = await prisma.wrestlerCard.findUnique({
    where: { id },
  });

  if (!card) {
    notFound();
  }

  const styles = getRarityStyles(card.rarity);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      {/* Left Column: The Card Visual */}
      <div className="lg:col-span-5">
        <div
          className={`relative aspect-3/4 rounded-3xl border-4 overflow-hidden shadow-2xl ${styles.border} ${styles.glow} ${styles.bg}`}
        >
          {card.imageUrl && (
            <Image
              src={`/api/proxy?url=${encodeURIComponent(card.imageUrl)}`}
              alt={card.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-cover object-top"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60"></div>

          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-serif font-black text-white uppercase tracking-tighter mb-2">
                {card.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getAlignmentBadge(card.alignment)}`}
              >
                {card.alignment}
              </span>
            </div>
            <div
              className={`px-3 py-1.5 rounded border border-white/10 text-xs font-black tracking-[0.2em] uppercase backdrop-blur-md ${styles.accent} ${styles.text}`}
            >
              {card.rarity}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Information & Stats */}
      <div className="lg:col-span-7 space-y-12">
        <section>
          <h2 className="text-zinc-600 font-serif italic text-xl mb-6 flex items-center gap-4">
            Biography
            <span className="h-px flex-1 bg-zinc-800"></span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed font-serif italic">
            {card.description || "The story of this legendary athlete remains untold in the annals of history."}
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-8">
            <h2 className="text-zinc-600 font-serif italic text-xl flex items-center gap-4">
              Physical Stats
              <span className="h-px flex-1 bg-zinc-800"></span>
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                <span className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">
                  Height
                </span>
                <span className="text-xl font-mono text-zinc-200">{card.height} cm</span>
              </div>
              <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                <span className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">
                  Weight
                </span>
                <span className="text-xl font-mono text-zinc-200">{card.weight} kg</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-zinc-600 font-serif italic text-xl flex items-center gap-4">
              Origins
              <span className="h-px flex-1 bg-zinc-800"></span>
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                <span className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">
                  Birthplace
                </span>
                <span className="text-sm font-serif italic text-zinc-200">{card.birthplace}</span>
              </div>
              <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                <span className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">
                  Birthdate
                </span>
                <span className="text-sm font-mono text-zinc-200">{card.birthdate}</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-zinc-600 font-serif italic text-xl mb-6 flex items-center gap-4">
            Career Information
            <span className="h-px flex-1 bg-zinc-800"></span>
          </h2>
          <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">
                Main Promotion
              </span>
              <span className="text-2xl font-serif font-black text-white uppercase tracking-tighter">
                {card.promotion || "Independent Circuit"}
              </span>
            </div>
            <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
              <span className="text-zinc-500 text-xs font-black">★</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function WrestlerDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start animate-pulse">
      <div className="lg:col-span-5">
        <div className="aspect-3/4 rounded-3xl bg-zinc-900 border-4 border-zinc-800 shadow-2xl"></div>
      </div>
      <div className="lg:col-span-7 space-y-12">
        <section>
          <div className="h-8 w-48 bg-zinc-800 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="h-8 w-40 bg-zinc-800 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-zinc-900 rounded-xl"></div>
              <div className="h-20 bg-zinc-900 rounded-xl"></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 w-40 bg-zinc-800 rounded"></div>
            <div className="space-y-4">
              <div className="h-16 bg-zinc-900 rounded-xl"></div>
              <div className="h-16 bg-zinc-900 rounded-xl"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
