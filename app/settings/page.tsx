"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const goBack = () => router.push("/home");

  return (
    <main className="mx-auto min-h-[100dvh] w-full max-w-[430px] bg-gradient-to-b from-amber-100 via-red-100 to-orange-100 px-5 py-6 dark:from-slate-950 dark:via-slate-900 dark:to-red-950">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-sm dark:bg-slate-900/60 dark:text-white"
          aria-label="Back"
        >
          ←
        </button>
        <p className="text-sm font-extrabold text-slate-800 dark:text-white">Settings</p>
        <span className="w-10" />
      </div>

      <section className="mt-5 space-y-3">
        <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-md dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-sm font-extrabold text-slate-800 dark:text-white">Preferences</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Update learning style, notification settings, and privacy controls here (placeholder UI).
          </p>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-md dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-sm font-extrabold text-slate-800 dark:text-white">Manage account</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Change profile details and security options (placeholder UI).
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full rounded-3xl bg-gradient-to-r from-red-500 to-orange-400 px-5 py-4 text-base font-extrabold text-white shadow-lg"
        >
          Log out
        </button>
      </section>
    </main>
  );
}

