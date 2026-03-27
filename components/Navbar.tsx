export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Explainix</h1>
        <p className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
          AI Learning Studio
        </p>
      </div>
    </header>
  );
}
