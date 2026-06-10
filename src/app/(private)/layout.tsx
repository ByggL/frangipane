import Link from "next/link";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Sidebar Privée - Niveau de layout 2 */}
      <aside className="w-72 border-r border-white/5 bg-black flex flex-col z-110">
        <div className="p-8">
          <Link href="/" className="group flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-zinc-800 text-white flex items-center justify-center font-black rounded-lg group-hover:bg-white group-hover:text-black transition-colors">
              W
            </div>
            <span className="text-white font-serif font-black uppercase tracking-tighter text-xl">Private HQ</span>
          </Link>

          <nav className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-4 ml-2">Personal Vault</p>
            <Link
              href="/collection"
              className="group flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
            >
              <span className="text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                My Cards
              </span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
            <Link
              href="/pull"
              className="group flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
            >
              <span className="text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                Open Pack
              </span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">✦</span>
            </Link>
          </nav>

          <div className="h-px bg-zinc-900 my-8"></div>

          <nav className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-4 ml-2">Navigation</p>
            <Link
              href="/roster"
              className="group flex items-center justify-between px-4 py-2 rounded-xl text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <span className="text-[10px] font-black uppercase tracking-widest italic">← Back to Vault</span>
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5 bg-zinc-950/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
              <span className="text-zinc-600 text-xs">P1</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Player One</span>
              <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest italic">
                Rookie Collector
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Zone de contenu principale */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
