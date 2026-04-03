"use client";

import { useRouter } from "next/navigation";

export default function PoliciesPage() {
  const router = useRouter();

  return (
    <main className="mx-auto min-h-[100dvh] w-full max-w-[430px] bg-gradient-to-b from-amber-100 via-red-100 to-orange-100 px-5 py-6 dark:from-slate-950 dark:via-slate-900 dark:to-red-950">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/help")}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-sm dark:bg-slate-900/60 dark:text-white"
          aria-label="Back"
        >
          ←
        </button>
        <p className="text-sm font-extrabold text-slate-800 dark:text-white">Policies</p>
        <span className="w-10" />
      </div>

      <section className="mt-5 space-y-3 rounded-3xl border border-white/70 bg-white/85 p-4 shadow-md dark:border-white/10 dark:bg-slate-900/60">
        <p className="text-sm font-extrabold text-slate-800 dark:text-white">Terms &amp; conditions (placeholder)</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Replace this page with your real terms, privacy policy, and child-safety disclosures before publishing.
          For now it is a static placeholder so navigation and layout can be wired up.
        </p>
      </section>
    </main>
  );
}
