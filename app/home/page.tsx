"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  name?: string;
  firstName?: string;
  favoriteSubject?: string;
  stream?: string;
  role?: string;
  degree?: string;
};

type ChatSession = {
  id: string;
  title: string;
  preview: string;
  updatedAt: number;
};

const CHATS_KEY = "explainixChatHistory";

function loadChats(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

function saveChats(list: ChatSession[]) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(list));
}

function displayStream(stream?: string) {
  if (!stream) return "General";
  return stream.replace(/-S$|-C$/, "");
}

function buildRecommendations(profile: Profile) {
  const subject = profile.favoriteSubject?.trim() || "Science";
  const stream = displayStream(profile.stream);
  const role = profile.role?.trim() || "Student";

  return [
    { id: "reels", title: `${subject} Reels`, icon: "🎬", color: "from-pink-500 to-orange-400" },
    { id: "notes", title: `${stream} Quick Notes`, icon: "📝", color: "from-sky-500 to-indigo-500" },
    { id: "quiz", title: `${role} Challenge Quiz`, icon: "🧩", color: "from-emerald-500 to-teal-500" },
    { id: "meme", title: `${subject} Meme Lab`, icon: "😂", color: "from-violet-500 to-fuchsia-500" },
  ];
}

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  type Theme = "light" | "dark";
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const raw = localStorage.getItem("explainixTheme");
    return raw === "dark" ? "dark" : "light";
  });

  const [profile] = useState<Profile>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("explainixProfile");
      return raw ? (JSON.parse(raw) as Profile) : {};
    } catch {
      return {};
    }
  });

  const [chatText, setChatText] = useState("");
  const [chats, setChats] = useState<ChatSession[]>(() => {
    if (typeof window === "undefined") return [];
    return loadChats();
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [reelsPickerOpen, setReelsPickerOpen] = useState(false);
  const [reelsPack, setReelsPack] = useState<"4" | "8" | null>(null);
  const [missionIndex, setMissionIndex] = useState(0);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);

  const missions = useMemo(
    () => [
      {
        title: "Today's mission",
        body: "Learn one hard topic in a fun way using reels, visuals, and mini quizzes.",
      },
      {
        title: "Tiny challenge time",
        body: "Pick a card, then answer one quick question to remember it faster.",
      },
      {
        title: "Skill up!",
        body: "Try a reel pack (4 or 8) and watch your understanding grow.",
      },
      {
        title: "Make it stick",
        body: "Upload your notes, then ask Explainix to summarize and practice with you.",
      },
    ],
    [],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("explainixTheme", theme);
  }, [theme]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMissionIndex((i) => (i + 1) % missions.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [missions.length]);

  const greeting =
    profile.name?.trim() ||
    [profile.firstName].filter(Boolean).join(" ") ||
    "Explorer";

  const cards = useMemo(() => buildRecommendations(profile), [profile]);

  const filteredChats = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q),
    );
  }, [chats, historySearch]);

  const appendChatSession = useCallback((title: string, preview: string) => {
    const id = `c-${Date.now()}`;
    const next: ChatSession = {
      id,
      title,
      preview,
      updatedAt: Date.now(),
    };
    setChats((prev) => {
      const merged = [next, ...prev.filter((c) => c.id !== id)];
      saveChats(merged);
      return merged;
    });
  }, []);

  const handleSend = () => {
    const t = chatText.trim();
    if (!t) return;
    appendChatSession(t.slice(0, 40) || "Chat", t);
    setChatText("");
  };

  const handleCardClick = (id: string, title: string) => {
    if (id === "reels") {
      setReelsPickerOpen(true);
      return;
    }
    appendChatSession(title, `Opened: ${title}`);
  };

  const confirmReelsPack = (pack: "4" | "8") => {
    setReelsPack(pack);
    appendChatSession(`Reels pack (${pack})`, `Generate ${pack} reels`);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const names = Array.from(files)
      .map((f) => f.name)
      .join(", ");
    appendChatSession("Notes upload", `Attached: ${names}`);
    setUploadedFileNames(Array.from(files).map((f) => f.name).slice(0, 3));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const logout = () => {
    router.push("/login");
  };

  const handleNewChat = () => {
    localStorage.removeItem(CHATS_KEY);
    setChats([]);
    setHistorySearch("");
    setChatText("");
    setUploadedFileNames([]);
    setReelsPack(null);
    setReelsPickerOpen(false);
    router.push("/home");
  };

  return (
    <main className="relative mx-auto min-h-[100dvh] w-full max-w-[430px] bg-gradient-to-b from-amber-100 via-red-100 to-orange-100 pb-40 dark:from-slate-950 dark:via-slate-900 dark:to-red-950">
      <header className="flex items-center justify-between px-4 pb-2 pt-6">
        <button
          type="button"
          onClick={() => {
            setHistoryOpen((v) => !v);
            setProfileMenuOpen(false);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-slate-800 shadow-sm dark:bg-slate-900/60 dark:text-white"
          aria-label="Chat history"
          aria-expanded={historyOpen}
        >
          <span className="text-lg leading-none">☰</span>
        </button>
        <div className="flex-1 px-3 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Explainix</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setProfileMenuOpen((v) => !v);
            setHistoryOpen(false);
          }}
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-red-400 to-orange-400 text-sm font-extrabold text-white shadow-md"
          aria-label="Profile"
          aria-haspopup="true"
        >
          {greeting.slice(0, 1).toUpperCase()}
        </button>
      </header>

      {profileMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/20"
            aria-label="Close menu"
            onClick={() => setProfileMenuOpen(false)}
          />
          <div className="absolute right-4 top-16 z-40 w-52 rounded-2xl border border-white/60 bg-white py-2 shadow-xl dark:border-white/10 dark:bg-slate-950/95">
            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen(false);
                router.push("/settings");
              }}
              className="block w-full px-4 py-3 text-left text-sm font-bold text-slate-800 hover:bg-slate-50 dark:text-white dark:hover:bg-slate-900/60"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => setProfileMenuOpen(false)}
              className="block w-full px-4 py-3 text-left text-sm font-bold text-slate-800 hover:bg-slate-50 dark:text-white dark:hover:bg-slate-900/60"
            >
              Preferences
            </button>
            <button
              type="button"
              onClick={() => setProfileMenuOpen(false)}
              className="block w-full px-4 py-3 text-left text-sm font-bold text-slate-800 hover:bg-slate-50 dark:text-white dark:hover:bg-slate-900/60"
            >
              Manage account
            </button>
            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen(false);
                logout();
              }}
              className="block w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-slate-50 dark:hover:bg-slate-900/60"
            >
              Log out
            </button>
          </div>
        </>
      )}

      {historyOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/30"
            onClick={() => setHistoryOpen(false)}
          />

          <aside className="absolute left-0 top-0 h-full w-full max-w-[430px] overflow-hidden bg-white/95 backdrop-blur-xl shadow-2xl dark:bg-slate-950/95">
            <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/10">
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm dark:bg-slate-900/60 dark:text-white"
              >
                Close
              </button>
              <p className="text-sm font-extrabold text-slate-800 dark:text-white">Menu</p>
              <span className="w-14" />
            </div>

            <div className="space-y-3 px-4 py-4">
              <button
                type="button"
                onClick={() => {
                  setHistoryOpen(false);
                  handleNewChat();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-400 px-4 py-3 text-sm font-extrabold text-white shadow-lg"
              >
                + New Chat
              </button>

              <input
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search chats by words..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-400 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
              />

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Images", icon: "🖼️" },
                  { label: "Apps", icon: "🧩" },
                  { label: "Deep research", icon: "🔎" },
                  { label: "Projects", icon: "📁" },
                ].map((x) => (
                  <button
                    key={x.label}
                    type="button"
                    onClick={() => appendChatSession(x.label, `Opened: ${x.label}`)}
                    className="glass-hover rounded-2xl border border-slate-200/70 bg-white/60 px-3 py-3 text-left text-xs font-extrabold text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <div className="text-lg">{x.icon}</div>
                    <div className="mt-1">{x.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pb-4">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Recent chats
              </p>
              <div className="max-h-[40vh] overflow-y-auto pr-1">
                {filteredChats.length === 0 ? (
                  <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No chats yet. Start below.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {filteredChats.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          className="w-full rounded-2xl bg-white p-3 text-left shadow-sm dark:bg-slate-900/40"
                          onClick={() => setHistoryOpen(false)}
                        >
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white">{c.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                            {c.preview}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/90">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Theme
              </p>
              <div className="relative flex items-center rounded-2xl border border-slate-200/80 bg-white/60 p-1 dark:border-white/10 dark:bg-white/5">
                <div
                  className="absolute top-1 bottom-1 left-1 w-[calc(50%-2px)] rounded-xl bg-gradient-to-r from-red-500 to-orange-400 transition-transform duration-300"
                  style={{
                    transform: theme === "dark" ? "translateX(100%)" : "translateX(0%)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className="relative z-10 flex-1 rounded-xl py-2 text-sm font-extrabold text-slate-800 dark:text-white"
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className="relative z-10 flex-1 rounded-xl py-2 text-sm font-extrabold text-slate-800 dark:text-white"
                >
                  Dark
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="px-5 pb-2 pt-2">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Hi {greeting}</h1>
        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Here are your personalized learning picks.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-4 px-5 pt-4">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => handleCardClick(card.id, card.title)}
            className={`glass-hover rounded-3xl bg-gradient-to-br ${card.color} p-4 text-left text-white shadow-xl`}
          >
            <div className="text-4xl">{card.icon}</div>
            <p className="mt-3 text-sm font-extrabold leading-tight">{card.title}</p>
          </button>
        ))}
      </section>

      <section className="px-5 pt-5">
        <div className="rounded-3xl bg-white/85 p-4 shadow-md dark:bg-slate-900/60 dark:border dark:border-white/10 dark:shadow-none">
          <div key={missionIndex} className="mission-flip">
            <p className="text-sm font-bold text-slate-800 dark:text-white">{missions[missionIndex].title}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{missions[missionIndex].body}</p>
          </div>
        </div>
      </section>

      <div className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-24px)] max-w-[406px] -translate-x-1/2 space-y-2">
        {reelsPickerOpen && (
          <div className="rounded-2xl border border-white/70 bg-amber-50/95 px-3 py-2 shadow-md backdrop-blur dark:border-white/10 dark:bg-slate-900/40">
            <p className="text-center text-xs font-bold text-slate-700">Choose your reels pack</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => confirmReelsPack("4")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-extrabold ${
                  reelsPack === "4"
                    ? "bg-gradient-to-r from-red-500 to-orange-400 text-white"
                    : "bg-white text-slate-800 ring-1 ring-slate-200"
                }`}
              >
                4 reels
              </button>
              <button
                type="button"
                onClick={() => confirmReelsPack("8")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-extrabold ${
                  reelsPack === "8"
                    ? "bg-gradient-to-r from-red-500 to-orange-400 text-white"
                    : "bg-white text-slate-800 ring-1 ring-slate-200"
                }`}
              >
                8 reels
              </button>
            </div>
          </div>
        )}

        {uploadedFileNames.length > 0 && (
          <div className="flex items-start gap-2 overflow-x-auto rounded-2xl border border-white/70 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/40">
            {uploadedFileNames.map((name) => (
              <div
                key={name}
                className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-slate-800 shadow-sm dark:bg-slate-800/60 dark:text-white"
              >
                {name}
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-white/70 bg-white/95 p-2.5 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/40">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-extrabold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white"
              aria-label="Upload files"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 15V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M8 8L12 4L16 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 15V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <input
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Ask Explainix anything..."
              className="min-h-0 flex-1 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              type="button"
              onClick={handleSend}
              className="shrink-0 rounded-2xl bg-indigo-600 px-3 py-2.5 text-sm font-extrabold text-white hover:scale-[1.01] transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
