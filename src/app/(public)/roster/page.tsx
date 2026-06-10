import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import Link from "next/link";
import { getRarityStyles, getAlignmentBadge } from "@/lib/utils";
import Image from "next/image";

export default function Page() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const skip = (page - 1) * limit;

  const fetchCards = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        search,
        rarity: rarityFilter,
        sortBy,
      });
      const res = await fetch(`/api/cards?${params.toString()}`);
      const data = await res.json();
      setCards(data.cards);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.total);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  if (loading && cards.length === 0) {
    return (
      <main className="p-8 flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-3xl font-serif italic animate-pulse text-zinc-700 tracking-widest uppercase">
          Initializing Roster...
        </div>
      </main>
    );
  }
  
  switch (sortBy) {
    case "NAME_ASC": orderBy.push({ name: "asc" }); break;
    case "NAME_DESC": orderBy.push({ name: "desc" }); break;
    case "HEIGHT_DESC": orderBy.push({ height: "desc" }); break;
    case "WEIGHT_DESC": orderBy.push({ weight: "desc" }); break;
    default: orderBy.push({ name: "asc" });
  }

  const [cards, totalCount] = await Promise.all([
    prisma.wrestlerCard.findMany({
      where,
      take: limit,
      skip: skip,
      orderBy,
    }),
    prisma.wrestlerCard.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <main className="relative p-8 bg-[#0a0a0a] min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="flex flex-col items-center justify-center gap-4 mb-12">
            <h2 className="text-zinc-500 font-serif italic text-2xl tracking-wide uppercase">The Vault Collection</h2>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-zinc-800"></span>
              <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">Elite Edition</span>
              <span className="h-px w-12 bg-zinc-800"></span>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-wrap items-center justify-center gap-6 p-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 text-left">
                Search Roster
              </label>
              <input
                type="text"
                placeholder="Wrestler or Promotion..."
                className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 text-left">
                Rarity Class
              </label>
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
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 text-left">
                Sort Priority
              </label>
              <select
                className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer pr-10"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="NAME_ASC">NAME (A-Z)</option>
                <option value="NAME_DESC">NAME (Z-A)</option>
                <option value="HEIGHT_DESC">TALLEST FIRST</option>
                <option value="WEIGHT_DESC">HEAVIEST FIRST</option>
              </select>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 mb-8 text-zinc-500 font-serif italic text-sm">
            <span>Found {totalCount} Wrestlers</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-1.5 rounded-lg border border-white/5 bg-zinc-900/50 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors uppercase font-black tracking-tighter text-[10px] text-zinc-400"
              >
                Previous
              </button>
              <span className="text-zinc-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-4 py-1.5 rounded-lg border border-white/5 bg-zinc-900/50 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors uppercase font-black tracking-tighter text-[10px] text-zinc-400"
              >
                Next
              </button>
            </div>
          </div>
        </header>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
        >
          {cards.map((card) => {
            const styles = getRarityStyles(card.rarity);
            return (
              <Link
                key={card.id}
                href={`/roster/${card.id}`}
                className={`group relative flex flex-col h-115 rounded-2xl border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden ${styles.bg} ${styles.border} ${styles.glow}`}
              >
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-white/3 to-transparent pointer-events-none"></div>

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
                    <Image
                      src={`/api/proxy?url=${encodeURIComponent(card.imageUrl)}`}
                      alt={card.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
                      onError={(e) => {
                        // fallback if individual image fails
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.classList.add("flex", "items-center", "justify-center");
                        }
                      }}
                    />
                  ) : null}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                    <span className="text-4xl font-serif font-black text-white italic opacity-20">VOID</span>
                  </div>

                  <div className={`absolute bottom-2 right-2 px-2 py-1 rounded border border-white/10 text-[9px] font-black tracking-widest uppercase backdrop-blur-md ${styles.accent} ${styles.text}`}>
                    {card.rarity}
                  </div>
                </div>

                <div className="p-5 bg-black/40 backdrop-blur-sm z-10 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="flex flex-col">
                      <span className="text-zinc-600 font-bold uppercase text-[8px] tracking-widest">Height</span>
                      <span className="font-mono text-xs text-zinc-300">{card.height} cm</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-600 font-bold uppercase text-[8px] tracking-widest">Weight</span>
                      <span className="font-mono text-xs text-zinc-300">{card.weight} kg</span>
                    </div>
                    <div className="flex flex-col col-span-2">
                      <span className="text-zinc-600 font-bold uppercase text-[8px] tracking-widest">Promotion</span>
                      <span className="font-serif text-xs text-zinc-300 truncate italic">
                        {card.promotion || "Independent"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Scanlines Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-size-[100%_2px,3px_100%] opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
