'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] px-8 text-center">
      <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-8">
        <span className="text-3xl">⚠️</span>
      </div>
      <h2 className="text-4xl font-serif font-black text-white uppercase tracking-tighter mb-4">
        Un incident est survenu
      </h2>
      <p className="text-zinc-400 max-w-md mb-12">
        Une erreur inattendue a perturbé le match. Nos arbitres sont sur le coup.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="px-8 py-3 bg-zinc-900 text-white border border-white/5 font-black uppercase tracking-widest text-xs rounded-full hover:bg-zinc-800 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
