"use client";

import RosterFilters from "./RosterFilters";
import RosterList, { RosterListSkeleton } from "./RosterList";
import { Suspense, useState, useCallback, use } from "react";

export default function RosterPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; rarity?: string; sortBy?: string; page?: string }>;
}) {
  const params = use(searchParams);
  const page = parseInt(params.page || "1", 10);
  const limit = 50;
  const search = params.search || "";
  const rarity = params.rarity || "ALL";
  const sortBy = params.sortBy || "NAME_ASC";

  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1 });

  const handleDataLoaded = useCallback((totalCount: number, totalPages: number) => {
    setPagination({ totalCount, totalPages });
  }, []);

  return (
    <main className="relative p-8 bg-[#0a0a0a] min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <RosterFilters
          search={search}
          rarity={rarity}
          sortBy={sortBy}
          totalCount={pagination.totalCount}
          page={page}
          totalPages={pagination.totalPages}
        />

        <Suspense key={`${search}-${rarity}-${sortBy}-${page}`} fallback={<RosterListSkeleton />}>
          <RosterList
            search={search}
            rarity={rarity}
            sortBy={sortBy}
            page={page}
            limit={limit}
            onDataLoaded={handleDataLoaded}
          />
        </Suspense>
      </div>
    </main>
  );
}
