"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 1400);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col items-center justify-center bg-gradient-to-br from-yellow-200 via-red-200 to-amber-300 px-6 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-red-950">
      <div className="float-soft flex flex-col items-center justify-center">
        <div className="pulse-rainbow flex h-32 w-32 items-center justify-center rounded-[36px] bg-white shadow-2xl">
          <span className="text-4xl">🚀</span>
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white drop-shadow-md">Explainix</h1>
        <p className="mt-2 text-sm font-medium text-white/95">Smart learning fun for kids & teens</p>
      </div>
      <div className="mt-10 flex items-center gap-2">
        <span className="h-3 w-3 animate-pulse rounded-full bg-white/95" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-white/80 [animation-delay:120ms]" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-white/60 [animation-delay:240ms]" />
      </div>
      <p className="mt-3 text-xs text-white/80">Loading your colorful classroom...</p>
    </main>
  );
}
