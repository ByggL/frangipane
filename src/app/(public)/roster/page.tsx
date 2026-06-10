import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import Link from "next/link";
import { getRarityStyles, getAlignmentBadge } from "@/lib/utils";
import RosterFilters from "./RosterFilters";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || "1", 10);
  const limit = 50;
  const search = (params.search as string) || "";
  const rarity = (params.rarity as string) || "ALL";
  const sortBy = (params.sortBy as string) || "NAME_ASC";

  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.WrestlerCardWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { promotion: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      rarity !== "ALL" ? { rarity: { equals: rarity } } : {},
    ],
  };

  // Determine sort
  let orderBy: Prisma.WrestlerCardOrderByWithRelationInput[] = [{ imageUrl: "desc" }];

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
        <RosterFilters 
          search={search}
          rarity={rarity}
          sortBy={sortBy}
          totalCount={totalCount}
          page={page}
          totalPages={totalPages}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
          {cards.map((card) => {
            const styles = getRarityStyles(card.rarity);
            return (
              <Link
                key={card.id}
                href={`/roster/${card.id}`}
                className={`group relative flex flex-col h-[460px] rounded-2xl border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden ${styles.bg} ${styles.border} ${styles.glow}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>

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
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
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
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
