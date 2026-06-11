import { auth } from "@/lib/auth";
import CollectionFilters from "../../components/CollectionFilters";
import { redirect } from "next/navigation";
import CollectionList, { CollectionListSkeleton } from "../../components/CollectionList";
import { Suspense } from "react";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const search = (params.search as string) || "";
  const rarity = (params.rarity as string) || "ALL";
  const sortBy = (params.sortBy as string) || "DATE_DESC";

  return (
    <main className="relative p-8 bg-[#0a0a0a] min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 text-center">
          <h1 className="text-7xl font-black uppercase tracking-tight text-white font-serif mb-4 drop-shadow-2xl">
            My <span className="text-zinc-500">Collection</span>
          </h1>
          <p className="text-zinc-500 font-serif italic text-lg tracking-wide mb-8">Your Personal Elite Roster</p>

          <CollectionFilters search={search} rarity={rarity} sortBy={sortBy} />
        </header>

        <Suspense key={`${search}-${rarity}-${sortBy}`} fallback={<CollectionListSkeleton />}>
          <CollectionList userId={(session.user as any).id} search={search} rarity={rarity} sortBy={sortBy} />
        </Suspense>
      </div>
    </main>
  );
}
