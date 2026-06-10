import Link from "next/link";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-[100] px-8 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black rounded-lg group-hover:rotate-12 transition-transform">W</div>
            <span className="text-white font-serif font-black uppercase tracking-tighter text-xl">Wrestler TCG</span>
          </Link>
          
          <div className="flex items-center gap-8 bg-white/[0.03] backdrop-blur-xl border border-white/5 px-6 py-2.5 rounded-full shadow-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400">
             Public Zone
          </div>

          <div className="flex items-center gap-6 bg-white/[0.03] backdrop-blur-xl border border-white/5 px-6 py-2.5 rounded-full shadow-2xl">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors uppercase font-black tracking-widest text-[10px]">Home</Link>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <Link href="/roster" className="text-zinc-400 hover:text-white transition-colors uppercase font-black tracking-widest text-[10px]">The Vault</Link>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <Link href="/collection" className="text-zinc-500 hover:text-white transition-colors uppercase font-black tracking-widest text-[10px] bg-white/5 px-3 py-1 rounded-full border border-white/10 italic">Enter Private HQ →</Link>
          </div>
        </nav>
      </header>
      <div className="pt-20 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
