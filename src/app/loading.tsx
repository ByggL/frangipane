export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-white/5 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-white rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-zinc-500 font-serif italic tracking-wider animate-pulse">
        Chargement de l'arène...
      </p>
    </div>
  );
}
