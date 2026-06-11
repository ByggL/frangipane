import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import RosterFilters from "./RosterFilters";
import RosterList, { RosterListSkeleton } from "./RosterList";
import { Suspense } from "react";

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

  // Build where clause for count
  const where: Prisma.WrestlerCardWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search } },
              { promotion: { contains: search } },
            ],
          }
        : {},
      rarity !== "ALL" ? { rarity: { equals: rarity } } : {},
    ],
  };

  const totalCount = await prisma.wrestlerCard.count({ where });
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

        <Suspense key={`${search}-${rarity}-${sortBy}-${page}`} fallback={<RosterListSkeleton />}>
          <RosterList 
            search={search}
            rarity={rarity}
            sortBy={sortBy}
            page={page}
            limit={limit}
          />
        </Suspense>
      </div>
    </main>
  );
}
