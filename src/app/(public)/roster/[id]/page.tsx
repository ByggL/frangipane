import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getRarityStyles, getAlignmentBadge } from "@/lib/utils";
import Image from "next/image";

export default async function WrestlerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const card = await prisma.wrestlerCard.findUnique({
    where: { id },
  });

  if (!card) {
    notFound();
  }

  const styles = getRarityStyles(card.rarity);

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-8">
      {/* Background Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Link
          href="/roster"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="uppercase font-black tracking-widest text-[10px]">Back to the Vault</span>
        </Link>

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
      </div>
    </main>
  );
}
