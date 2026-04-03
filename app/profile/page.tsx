"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const PROFILE_KEY = "explainixProfile";
const ACCOUNTS_KEY = "explainixAccounts";

type StoredProfile = Record<string, unknown>;

type Account = {
  id: string;
  label: string;
  profile: StoredProfile;
};

function loadProfile(): StoredProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as StoredProfile) : {};
  } catch {
    return {};
  }
}

function saveProfile(p: StoredProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("explainix-preferences-changed"));
}

function loadAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Account[]) : [];
  } catch {
    return [];
  }
}

function saveAccounts(list: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
}

function newId() {
  return `acc-${Date.now()}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [favoriteSubject, setFavoriteSubject] = useState("");
  const [bio, setBio] = useState("");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const list = loadAccounts();
    const current = loadProfile();
    if (list.length === 0) {
      const id = newId();
      const initial: Account = {
        id,
        label: String(current.name ?? "Primary"),
        profile: current,
      };
      saveAccounts([initial]);
      setAccounts([initial]);
      setActiveId(id);
    } else {
      setAccounts(list);
      const first = list[0];
      if (first) {
        setActiveId(first.id);
        saveProfile(first.profile);
      }
    }
  }, []);

  const activeAccount = useMemo(
    () => accounts.find((a) => a.id === activeId) ?? accounts[0],
    [accounts, activeId],
  );

  useEffect(() => {
    if (!activeAccount) return;
    const p = activeAccount.profile;
    setFirstName(String(p.firstName ?? ""));
    setMiddleName(String(p.middleName ?? ""));
    setLastName(String(p.lastName ?? ""));
    setFavoriteSubject(String(p.favoriteSubject ?? ""));
    setBio(String(p.bio ?? ""));
    setAvatarDataUrl(typeof p.avatarDataUrl === "string" ? p.avatarDataUrl : null);
  }, [activeAccount]);

  const displayName = [firstName, middleName, lastName].filter(Boolean).join(" ").trim();

  const handleSave = () => {
    if (!activeId) return;
    const base = { ...loadProfile() };
    const next: StoredProfile = {
      ...base,
      firstName,
      middleName,
      lastName,
      name: displayName || String(base.name ?? "Explorer"),
      favoriteSubject,
      bio,
      ...(avatarDataUrl ? { avatarDataUrl } : {}),
    };
    saveProfile(next);
    setAccounts((prev) => {
      const mapped = prev.map((a) =>
        a.id === activeId ? { ...a, label: String(next.name ?? a.label), profile: next } : a,
      );
      saveAccounts(mapped);
      return mapped;
    });
  };

  const handleSwitch = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return;
    setActiveId(id);
    saveProfile(acc.profile);
  };

  const handleAddAccount = () => {
    const id = newId();
    const blank: StoredProfile = {
      firstName: "",
      middleName: "",
      lastName: "",
      name: "New learner",
      favoriteSubject: "Science",
    };
    const nextList: Account[] = [...accounts, { id, label: "New learner", profile: blank }];
    saveAccounts(nextList);
    setAccounts(nextList);
    setActiveId(id);
    saveProfile(blank);
  };

  const handleAvatar = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = typeof reader.result === "string" ? reader.result : null;
      setAvatarDataUrl(data);
    };
    reader.readAsDataURL(f);
    if (fileRef.current) fileRef.current.value = "";
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
        <p className="text-sm font-extrabold text-slate-800 dark:text-white">Account &amp; Profile</p>
        <span className="w-10" />
      </div>

      <section className="mt-5 space-y-3">
        <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-md dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-sm font-extrabold text-slate-800 dark:text-white">Switch account</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Profiles are stored locally on this device for now.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {accounts.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => handleSwitch(a.id)}
                className={`rounded-xl border px-3 py-2 text-xs font-extrabold ${
                  a.id === activeAccount?.id
                    ? "border-transparent bg-[linear-gradient(to_right,var(--accent-from),var(--accent-to))] text-white"
                    : "border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
                }`}
              >
                {a.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleAddAccount}
              className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-700 dark:border-white/20 dark:text-white"
            >
              + Add
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-md dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-sm font-extrabold text-slate-800 dark:text-white">Profile details</p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/10">
              {avatarDataUrl ? (
                <img src={avatarDataUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-extrabold text-slate-500">
                  {(displayName || "E").slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatar(e.target.files)} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
              >
                Change photo
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
            />
            <input
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Middle name (optional)"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
            />
            <input
              value={favoriteSubject}
              onChange={(e) => setFavoriteSubject(e.target.value)}
              placeholder="Favorite subject"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="About you (optional)"
              rows={3}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-4 w-full rounded-2xl bg-[linear-gradient(to_right,var(--accent-from),var(--accent-to))] px-4 py-3 text-sm font-extrabold text-white shadow-lg"
          >
            Save profile
          </button>
        </div>
      </section>
    </main>
  );
}
