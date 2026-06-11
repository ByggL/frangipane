import Link from "next/link";
import WrestlerDetail, { WrestlerDetailSkeleton } from "../../../components/WrestlerDetail";
import { Suspense } from "react";

export default async function WrestlerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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

        <Suspense fallback={<WrestlerDetailSkeleton />}>
          <WrestlerDetail id={id} />
        </Suspense>
      </div>
    </main>
  );
}
