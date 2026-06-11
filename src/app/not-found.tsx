import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] px-8 text-center">
      <h1 className="text-[12rem] font-black text-white/5 leading-none select-none">404</h1>
      <div className="relative -mt-20">
        <h2 className="text-4xl font-serif font-black text-white uppercase tracking-tighter mb-4">
          Hors du ring
        </h2>
        <p className="text-zinc-400 max-w-md mb-12">
          La page que vous cherchez n'existe pas ou a été disqualifiée.
        </p>
        <Link
          href="/"
          className="inline-block px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform shadow-2xl shadow-white/10"
        >
          Revenir au vestiaire
        </Link>
      </div>
    </div>
  );
}
