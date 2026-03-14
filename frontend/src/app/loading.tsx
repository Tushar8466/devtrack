export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black z-100 flex flex-col items-center justify-center gap-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-2 border-violet-500/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-t-violet-500 rounded-full animate-spin" />
        <div className="absolute inset-4 border border-fuchsia-500/20 rounded-full animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Initializing DevTrack AI</h2>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
