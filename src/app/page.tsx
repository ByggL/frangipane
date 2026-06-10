import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h2 className="text-zinc-500 font-serif italic text-2xl tracking-widest uppercase">Welcome to</h2>
          <h1 className="text-8xl md:text-9xl font-serif font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
            Wrestler <span className="text-zinc-800">TCG</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Link 
            href="/roster" 
            className="group relative p-8 bg-zinc-900/50 border border-white/5 rounded-3xl hover:border-white/20 transition-all hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent"></div>
            <h3 className="text-xl font-serif font-black text-white uppercase tracking-tighter mb-2 relative z-10">The Vault</h3>
            <p className="text-zinc-500 text-sm italic font-serif relative z-10">Explore the complete history of legends</p>
            <div className="mt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors relative z-10">Enter Public Gallery →</div>
          </Link>

          <Link 
            href="/collection" 
            className="group relative p-8 bg-white text-black border border-white rounded-3xl hover:bg-zinc-200 transition-all hover:-translate-y-2 overflow-hidden shadow-[0_20px_50px_rgba(255,255,255,0.05)]"
          >
            <h3 className="text-xl font-serif font-black uppercase tracking-tighter mb-2 relative z-10">My HQ</h3>
            <p className="text-zinc-700 text-sm italic font-serif relative z-10">Manage your personal elite roster</p>
            <div className="mt-6 text-[10px] font-black uppercase tracking-widest text-black/60 group-hover:text-black transition-colors relative z-10">Access Collection →</div>
          </Link>
        </div>

        <div className="pt-12">
          <p className="text-zinc-600 font-serif italic text-sm tracking-widest uppercase">
            Master 2 DEV & DEVIOT · 2026
          </p>
        </div>
      </div>
    </div>
  );
}
