"use client";

import { useRouter } from "next/navigation";

export default function HelpPage() {
  const router = useRouter();

  return (
    <main className="mx-auto min-h-[100dvh] w-full max-w-[430px] bg-gradient-to-b from-amber-100 via-red-100 to-orange-100 px-5 py-6 dark:from-slate-950 dark:via-slate-900 dark:to-red-950">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-sm dark:bg-slate-900/60 dark:text-white"
          aria-label="Back"
        >
          ←
        </button>
        <p className="text-sm font-extrabold text-slate-800 dark:text-white">Help</p>
        <span className="w-10" />
      </div>

      <section className="mt-5 space-y-3">
        <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-md dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-sm font-extrabold text-slate-800 dark:text-white">Get support</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Choose an option below. Reporting opens your email app with a pre-filled subject.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => {
                const subject = encodeURIComponent("Explainix bug report");
                const body = encodeURIComponent(
                  "Describe what happened and steps to reproduce:\n\n",
                );
                window.location.href = `mailto:support@example.com?subject=${subject}&body=${body}`;
              }}
              className="w-full rounded-2xl bg-[linear-gradient(to_right,var(--accent-from),var(--accent-to))] px-4 py-3 text-sm font-extrabold text-white shadow-lg"
            >
              Report a bug
            </button>

            <button
              type="button"
              onClick={() => router.push("/help/policies")}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-800 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
            >
              Terms &amp; policies
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-md dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-xs font-extrabold text-slate-500 dark:text-slate-300">Tips</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            <li>Add your OpenAI key under Settings if chat replies do not appear.</li>
            <li>Use the menu tiles to pick a generation mode before you ask a question.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
