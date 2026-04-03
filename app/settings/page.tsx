"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  accentPresets,
  defaultPreferences,
  getExplainixPreferences,
  saveExplainixPreferences,
  type AccentKey,
  type ExplainixPreferences,
} from "@/lib/preferences";

function dispatchPrefsChanged() {
  window.dispatchEvent(new Event("explainix-preferences-changed"));
}

type ToggleRowProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/85 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 accent-red-500"
        aria-label={label}
      />
      <span className="flex-1">
        <span className="block text-sm font-extrabold text-slate-800 dark:text-white">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<ExplainixPreferences>(defaultPreferences);
  const [openAiKey, setOpenAiKey] = useState("");

  useEffect(() => {
    setPrefs(getExplainixPreferences());
    setOpenAiKey(window.localStorage.getItem("explainixOpenAIKey") ?? "");
  }, []);

  const persist = (next: ExplainixPreferences) => {
    setPrefs(next);
    saveExplainixPreferences(next);
    dispatchPrefsChanged();
  };

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
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Learning style, notifications, privacy, appearance, and chat/API setup.
          </p>

          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-white/60 bg-white/85 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Learning style
              </p>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white">Subject focus</p>
                  <select
                    value={prefs.learningStyle.subject}
                    onChange={(e) =>
                      persist({
                        ...prefs,
                        learningStyle: { ...prefs.learningStyle, subject: e.target.value },
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-red-400 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                  >
                    {["Science", "Math", "English", "Arts", "History"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white">Quiz difficulty</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["easy", "medium", "hard"] as const).map((d) => {
                      const active = prefs.learningStyle.quizDifficulty === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() =>
                            persist({
                              ...prefs,
                              learningStyle: { ...prefs.learningStyle, quizDifficulty: d },
                            })
                          }
                          className={`rounded-xl border px-2 py-2 text-xs font-extrabold ${
                            active
                              ? "border-transparent bg-[linear-gradient(to_right,var(--accent-from),var(--accent-to))] text-white"
                              : "border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                          }`}
                        >
                          {d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Hard"}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white">Teaching tone</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["friendly", "motivational", "curious"] as const).map((t) => {
                      const active = prefs.learningStyle.learningTone === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() =>
                            persist({
                              ...prefs,
                              learningStyle: { ...prefs.learningStyle, learningTone: t },
                            })
                          }
                          className={`rounded-xl border px-2 py-2 text-xs font-extrabold ${
                            active
                              ? "border-transparent bg-[linear-gradient(to_right,var(--accent-from),var(--accent-to))] text-white"
                              : "border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                          }`}
                        >
                          {t === "friendly" ? "Friendly" : t === "motivational" ? "Motivate" : "Curious"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/85 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Notifications & privacy
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <ToggleRow
                  label="Reminders"
                  description="Gentle nudges to keep learning."
                  checked={prefs.notifications.reminders}
                  onChange={(next) =>
                    persist({ ...prefs, notifications: { ...prefs.notifications, reminders: next } })
                  }
                />
                <ToggleRow
                  label="Push notifications"
                  checked={prefs.notifications.push}
                  onChange={(next) => persist({ ...prefs, notifications: { ...prefs.notifications, push: next } })}
                />
                <ToggleRow
                  label="Quiet hours"
                  checked={prefs.notifications.quietHours}
                  onChange={(next) =>
                    persist({ ...prefs, notifications: { ...prefs.notifications, quietHours: next } })
                  }
                />
                {prefs.notifications.quietHours ? (
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/60 bg-white/85 p-3 dark:border-white/10 dark:bg-slate-900/60">
                    <div>
                      <p className="mb-1 text-[11px] font-extrabold text-slate-600 dark:text-slate-300">Start</p>
                      <input
                        type="time"
                        value={prefs.notifications.quietStart}
                        onChange={(e) =>
                          persist({
                            ...prefs,
                            notifications: { ...prefs.notifications, quietStart: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm font-semibold dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-extrabold text-slate-600 dark:text-slate-300">End</p>
                      <input
                        type="time"
                        value={prefs.notifications.quietEnd}
                        onChange={(e) =>
                          persist({
                            ...prefs,
                            notifications: { ...prefs.notifications, quietEnd: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm font-semibold dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                      />
                    </div>
                  </div>
                ) : null}
                <ToggleRow
                  label="Share usage analytics"
                  checked={prefs.privacy.shareAnalytics}
                  onChange={(next) => persist({ ...prefs, privacy: { ...prefs.privacy, shareAnalytics: next } })}
                />
                <ToggleRow
                  label="Personalize recommendations"
                  checked={prefs.privacy.personalizeRecommendations}
                  onChange={(next) =>
                    persist({ ...prefs, privacy: { ...prefs.privacy, personalizeRecommendations: next } })
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/85 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Appearance & accessibility
              </p>
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(accentPresets) as AccentKey[]).map((key) => {
                    const a = accentPresets[key];
                    const active = prefs.appearance.accentKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => persist({ ...prefs, appearance: { ...prefs.appearance, accentKey: key } })}
                        className={`h-12 rounded-xl border px-2 text-xs font-extrabold ${
                          active
                            ? "border-transparent bg-[linear-gradient(to_right,var(--accent-from),var(--accent-to))] text-white"
                            : "border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                        }`}
                        style={
                          {
                            "--accent-from": a.from,
                            "--accent-to": a.to,
                          } as Record<string, string>
                        }
                      >
                        {a.label}
                      </button>
                    );
                  })}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white">Text size</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { label: "Small", px: 14 },
                      { label: "Default", px: 16 },
                      { label: "Large", px: 18 },
                    ].map((s) => {
                      const active = prefs.appearance.textScale === s.px;
                      return (
                        <button
                          key={s.px}
                          type="button"
                          onClick={() =>
                            persist({ ...prefs, appearance: { ...prefs.appearance, textScale: s.px } })
                          }
                          className={`rounded-xl border px-2 py-2 text-xs font-extrabold ${
                            active
                              ? "border-transparent bg-[linear-gradient(to_right,var(--accent-from),var(--accent-to))] text-white"
                              : "border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <ToggleRow
                  label="Reduce motion"
                  checked={prefs.appearance.reduceMotion}
                  onChange={(next) =>
                    persist({ ...prefs, appearance: { ...prefs.appearance, reduceMotion: next } })
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/85 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Usage
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <ToggleRow
                  label="Show hints"
                  checked={prefs.usage.showHints}
                  onChange={(next) => persist({ ...prefs, usage: { ...prefs.usage, showHints: next } })}
                />
                <ToggleRow
                  label="Auto-continue suggestions"
                  checked={prefs.usage.autoContinueSuggestions}
                  onChange={(next) =>
                    persist({ ...prefs, usage: { ...prefs.usage, autoContinueSuggestions: next } })
                  }
                />
                <ToggleRow
                  label="Auto-save chat"
                  checked={prefs.usage.autoSaveChats}
                  onChange={(next) => persist({ ...prefs, usage: { ...prefs.usage, autoSaveChats: next } })}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/85 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Chat & API (dev)
              </p>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white">OpenAI model</p>
                  <select
                    value={prefs.chat.model}
                    onChange={(e) => persist({ ...prefs, chat: { ...prefs.chat, model: e.target.value } })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                  >
                    {["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white">OpenAI API key</p>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                    Stored in this browser for local dev. Prefer <code className="font-mono">OPENAI_API_KEY</code> on
                    the server for production.
                  </p>
                  <input
                    type="password"
                    value={openAiKey}
                    onChange={(e) => setOpenAiKey(e.target.value)}
                    placeholder="sk-..."
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      window.localStorage.setItem("explainixOpenAIKey", openAiKey);
                      dispatchPrefsChanged();
                    }}
                    className="mt-3 w-full rounded-xl bg-[linear-gradient(to_right,var(--accent-from),var(--accent-to))] px-3 py-3 text-sm font-extrabold text-white shadow-lg"
                  >
                    Save API key
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full rounded-3xl bg-[linear-gradient(to_right,var(--accent-from),var(--accent-to))] px-5 py-4 text-base font-extrabold text-white shadow-lg"
        >
          Log out
        </button>
      </section>
    </main>
  );
}
