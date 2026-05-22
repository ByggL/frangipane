"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="relative z-10 max-w-4xl px-8 text-center">
        <header className="mb-12">
          <h1 className="text-8xl font-black uppercase tracking-tighter text-white font-serif mb-6 drop-shadow-2xl">
            Wrestler <span className="text-zinc-500">TCG</span>
          </h1>
          <div className="flex items-center justify-center gap-6 mb-8">
            <span className="h-[1px] w-16 bg-zinc-800"></span>
            <p className="text-zinc-400 font-serif italic text-2xl tracking-wide uppercase">
              The Elite Vault
            </p>
            <span className="h-[1px] w-16 bg-zinc-800"></span>
          </div>
        </header>

        <section className="space-y-8">
          <p className="text-zinc-500 text-lg font-serif leading-relaxed max-w-2xl mx-auto italic">
            Step into the arena of legends. Collect, trade, and master the most comprehensive digital roster of wrestling icons. From common contenders to legendary titans, every card tells a story.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link 
              href="/roster" 
              className="group relative px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10">Enter the Vault</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
            
            <button className="px-10 py-4 border border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-sm rounded-full hover:bg-zinc-900 hover:text-white transition-all">
              Learn More
            </button>
          </div>
        </section>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 border-t border-white/5 pt-16">
          <div className="text-left space-y-2">
            <h3 className="text-zinc-200 font-black uppercase tracking-tighter text-xs">Exquisite Portraits</h3>
            <p className="text-zinc-600 text-xs font-serif italic">High-fidelity digital cards with dynamic rarity effects.</p>
          </div>
          <div className="text-left space-y-2">
            <h3 className="text-zinc-200 font-black uppercase tracking-tighter text-xs">Deep Analytics</h3>
            <p className="text-zinc-600 text-xs font-serif italic">Track every stat, from height and weight to legendary promotions.</p>
          </div>
          <div className="text-left space-y-2">
            <h3 className="text-zinc-200 font-black uppercase tracking-tighter text-xs">Real-Time Sorting</h3>
            <p className="text-zinc-600 text-xs font-serif italic">Filter by rarity class and search through thousands of contenders.</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -ml-40 mt-40"></div>
    </main>
  );
}
