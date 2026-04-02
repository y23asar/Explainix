"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    router.push("/home");
  };

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col bg-gradient-to-b from-amber-200 via-red-100 to-orange-100 px-5 pb-8 pt-8 dark:from-slate-950 dark:via-slate-900 dark:to-red-950">
      <div className="mb-8 mt-2 text-center">
        <div className="kid-bounce inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-xl dark:bg-slate-900/60 dark:text-white">🎨</div>
        <h1 className="mt-4 text-3xl font-extrabold text-purple-900 dark:text-white">Welcome to Explainix</h1>
        <p className="mt-2 text-sm text-purple-700 dark:text-slate-200">
          Learn smarter with reels, games, visuals and AI help.
        </p>
      </div>

      <div className="space-y-3">
        <Link
          href="/onboarding"
          className="glass-hover flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-4 text-base font-bold text-white shadow-xl"
        >
          Sign up
        </Link>

        <button
          type="button"
          onClick={() => setShowSignIn((v) => !v)}
          className="glass-hover w-full rounded-2xl border-2 border-slate-800/20 bg-white px-5 py-4 text-base font-bold text-slate-800 shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
        >
          Sign in
        </button>

        {showSignIn && (
          <form
            onSubmit={handleSignIn}
            className="space-y-2 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-inner dark:border-white/10 dark:bg-slate-900/60"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-red-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              autoComplete="email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-red-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white"
            >
              Continue
            </button>
          </form>
        )}

        <button
          type="button"
          className="glass-hover flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-base font-bold text-slate-800 shadow-lg dark:bg-slate-900/60 dark:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          className="glass-hover flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-5 py-4 text-base font-bold text-white shadow-lg"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Sign in with Apple
        </button>
      </div>

      <div className="mt-8 rounded-3xl bg-white/70 p-4 shadow-md dark:bg-slate-900/60 dark:border dark:border-white/10">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Why Explainix</p>
        <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>Short reel explanations</li>
          <li>Easy-to-understand visuals</li>
          <li>Chat-style learning helper</li>
        </ul>
      </div>
    </main>
  );
}
