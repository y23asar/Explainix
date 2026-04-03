export type AccentKey = "sunset" | "ocean" | "mint" | "violet";

export const accentPresets: Record<
  AccentKey,
  { label: string; from: string; to: string }
> = {
  sunset: { label: "Sunset", from: "#ef4444", to: "#fb923c" },
  ocean: { label: "Ocean", from: "#2563eb", to: "#22c55e" },
  mint: { label: "Mint", from: "#14b8a6", to: "#10b981" },
  violet: { label: "Violet", from: "#7c3aed", to: "#f472b6" },
};

export type ExplainixPreferences = {
  learningStyle: {
    subject: string;
    quizDifficulty: "easy" | "medium" | "hard";
    learningTone: "friendly" | "motivational" | "curious";
  };
  notifications: {
    reminders: boolean;
    push: boolean;
    quietHours: boolean;
    quietStart: string;
    quietEnd: string;
  };
  privacy: {
    shareAnalytics: boolean;
    personalizeRecommendations: boolean;
  };
  appearance: {
    accentKey: AccentKey;
    textScale: number;
    reduceMotion: boolean;
  };
  usage: {
    showHints: boolean;
    autoContinueSuggestions: boolean;
    autoSaveChats: boolean;
  };
  chat: {
    model: string;
  };
};

export const defaultPreferences: ExplainixPreferences = {
  learningStyle: {
    subject: "Science",
    quizDifficulty: "medium",
    learningTone: "friendly",
  },
  notifications: {
    reminders: true,
    push: false,
    quietHours: false,
    quietStart: "21:00",
    quietEnd: "07:00",
  },
  privacy: {
    shareAnalytics: false,
    personalizeRecommendations: true,
  },
  appearance: {
    accentKey: "sunset",
    textScale: 16,
    reduceMotion: false,
  },
  usage: {
    showHints: true,
    autoContinueSuggestions: true,
    autoSaveChats: true,
  },
  chat: {
    model: "gpt-4o-mini",
  },
};

const PREF_KEY = "explainixPreferences";

export function getExplainixPreferences(): ExplainixPreferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const raw = window.localStorage.getItem(PREF_KEY);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw) as Partial<ExplainixPreferences>;
    return {
      ...defaultPreferences,
      ...parsed,
      learningStyle: { ...defaultPreferences.learningStyle, ...(parsed.learningStyle ?? {}) },
      notifications: { ...defaultPreferences.notifications, ...(parsed.notifications ?? {}) },
      privacy: { ...defaultPreferences.privacy, ...(parsed.privacy ?? {}) },
      appearance: { ...defaultPreferences.appearance, ...(parsed.appearance ?? {}) },
      usage: { ...defaultPreferences.usage, ...(parsed.usage ?? {}) },
      chat: { ...defaultPreferences.chat, ...(parsed.chat ?? {}) },
    };
  } catch {
    return defaultPreferences;
  }
}

export function saveExplainixPreferences(prefs: ExplainixPreferences) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

export function applyPreferencesToDom(prefs: ExplainixPreferences) {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  const preset = accentPresets[prefs.appearance.accentKey] ?? accentPresets.sunset;
  html.style.setProperty("--accent-from", preset.from);
  html.style.setProperty("--accent-to", preset.to);
  html.style.fontSize = `${prefs.appearance.textScale}px`;
  html.classList.toggle("explainix-reduce-motion", prefs.appearance.reduceMotion);
}
