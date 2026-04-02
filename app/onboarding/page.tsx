"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BezelDatePicker } from "@/components/BezelDatePicker";
import { getPhoneRule, PHONE_COUNTRIES } from "@/lib/phoneCountries";

type RoleType = "Student" | "Mentor";
type StageType = "School" | "College";
type AgeBucket = "adult" | "teen" | "tween" | "kid";

type OnboardingState = {
  firstName: string;
  middleName: string;
  lastName: string;
  countryRegion: string;
  dobMonth: number;
  dobDay: number;
  dobYear: number;
  role: RoleType;
  phoneCountryCode: string;
  phoneLocal: string;
  favoriteSubject: string;
  stage: StageType;
  stream: string;
  degree: string;
  agePrimary1: string;
  agePrimary2: string;
  ageFollow1: string;
  ageFollow2: string;
};

const COUNTRY_OPTIONS = [
  { id: "IN", label: "India" },
  { id: "QA", label: "Qatar" },
  { id: "US", label: "United States" },
  { id: "GB", label: "United Kingdom" },
  { id: "AE", label: "United Arab Emirates" },
  { id: "AU", label: "Australia" },
  { id: "SG", label: "Singapore" },
  { id: "SA", label: "Saudi Arabia" },
  { id: "EG", label: "Egypt" },
  { id: "BD", label: "Bangladesh" },
  { id: "OTHER", label: "Other region" },
];

function computeAgeFromDob(y: number, m: number, d: number) {
  const today = new Date();
  let age = today.getFullYear() - y;
  const mo = today.getMonth() + 1;
  if (mo < m || (mo === m && today.getDate() < d)) age -= 1;
  return Math.max(0, age);
}

function getAgeBucketFromAge(age: number): AgeBucket {
  if (age > 18) return "adult";
  if (age > 14) return "teen";
  if (age > 10) return "tween";
  return "kid";
}

function getInitialState(currentYear: number): OnboardingState {
  return {
    firstName: "",
    middleName: "",
    lastName: "",
    countryRegion: "",
    dobMonth: 6,
    dobDay: 15,
    dobYear: currentYear - 15,
    role: "Student",
    phoneCountryCode: "+91",
    phoneLocal: "",
    favoriteSubject: "",
    stage: "School",
    stream: "",
    degree: "",
    agePrimary1: "",
    agePrimary2: "",
    ageFollow1: "",
    ageFollow2: "",
  };
}

type TileOption = {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
};

function TileGrid({
  title,
  options,
  value,
  onSelect,
}: {
  title: string;
  options: TileOption[];
  value: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-extrabold text-slate-900">{title}</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={[
                "glass-hover rounded-3xl border-2 p-4 text-left transition",
                active
                  ? `border-white bg-gradient-to-br ${opt.gradient} text-white shadow-xl`
                  : "border-white/15 bg-white/60 text-slate-800 hover:bg-white/80 hover:shadow-lg",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{opt.emoji}</div>
                <div className="text-sm font-extrabold leading-tight">{opt.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const minYear = currentYear - 60;
  const maxYear = currentYear - 1;

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<OnboardingState>(() => getInitialState(currentYear));

  const computedAge = useMemo(
    () => computeAgeFromDob(form.dobYear, form.dobMonth, form.dobDay),
    [form.dobYear, form.dobMonth, form.dobDay],
  );

  const ageBucket: AgeBucket = useMemo(() => getAgeBucketFromAge(computedAge), [computedAge]);

  const phoneRule = useMemo(() => getPhoneRule(form.phoneCountryCode), [form.phoneCountryCode]);
  const phoneDigitsOnly = form.phoneLocal.replace(/\D/g, "");

  const STREAM_STEP = 8;
  const DEGREE_STEP = 9;

  const totalSteps = useMemo(() => {
    if (stepIndex < STREAM_STEP) return 9;
    return form.stage === "College" ? 10 : 9;
  }, [stepIndex, form.stage]);

  const displayStepNumber = stepIndex + 1;

  const canProceed = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return form.firstName.trim().length >= 1 && form.lastName.trim().length >= 1;
      case 1:
        return form.countryRegion.length > 0;
      case 2:
        return form.dobYear >= minYear && form.dobYear <= maxYear;
      case 3:
        return form.agePrimary1.length > 0 && form.agePrimary2.length > 0;
      case 4:
        return form.ageFollow1.length > 0 && form.ageFollow2.length > 0;
      case 5:
        return !!form.role;
      case 6:
        return phoneDigitsOnly.length === phoneRule.digits;
      case 7:
        return form.favoriteSubject.trim().length > 0;
      case 8:
        return !!form.stage && form.stream.length > 0;
      case 9:
        return form.degree.trim().length > 0;
      default:
        return false;
    }
  }, [form, stepIndex, phoneDigitsOnly.length, phoneRule.digits, minYear, maxYear]);

  const displayName = [form.firstName, form.middleName, form.lastName].filter(Boolean).join(" ");

  const submit = () => {
    const payload = {
      ...form,
      name: displayName,
      stream: form.stream.replace(/-S$|-C$/, ""),
      phone: `${form.phoneCountryCode} ${phoneDigitsOnly}`,
      ageBucket,
    };
    localStorage.setItem("explainixProfile", JSON.stringify(payload));
    router.push("/home");
  };

  const goBack = () => setStepIndex((prev) => Math.max(0, prev - 1));

  const goNext = () => {
    if (!canProceed) return;

    if (stepIndex === STREAM_STEP) {
      if (form.stage === "College") {
        setStepIndex(DEGREE_STEP);
        return;
      }
      submit();
      return;
    }

    if (stepIndex === DEGREE_STEP) {
      submit();
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  const primaryLabel =
    stepIndex === STREAM_STEP && form.stage !== "College"
      ? "Finish"
      : stepIndex === DEGREE_STEP
        ? "Finish"
        : "Next";

  const renderAgeTiles = (bucket: AgeBucket, mode: "primary" | "followup") => {
    const isPrimary = mode === "primary";

    const adultPrimary1: TileOption[] = [
      { id: "engineering", label: "Engineering", emoji: "🛠️", gradient: "from-yellow-400 to-red-500" },
      { id: "medicine", label: "Medicine", emoji: "🩺", gradient: "from-red-500 to-pink-500" },
      { id: "business", label: "Business", emoji: "📈", gradient: "from-amber-400 to-orange-500" },
      { id: "arts", label: "Arts", emoji: "🎨", gradient: "from-fuchsia-500 to-red-500" },
    ];
    const adultPrimary2: TileOption[] = [
      { id: "action", label: "Action", emoji: "💥", gradient: "from-red-500 to-orange-400" },
      { id: "comedy", label: "Comedy", emoji: "😄", gradient: "from-rose-500 to-amber-400" },
      { id: "scifi", label: "Sci-Fi", emoji: "🚀", gradient: "from-indigo-500 to-red-500" },
      { id: "adventure", label: "Adventure", emoji: "🗺️", gradient: "from-orange-500 to-red-500" },
    ];
    const adultFollow1: TileOption[] = [
      { id: "animated", label: "Animated", emoji: "🖍️", gradient: "from-orange-400 to-pink-500" },
      { id: "live", label: "Live Action", emoji: "🎬", gradient: "from-red-500 to-amber-400" },
      { id: "series", label: "Series", emoji: "📺", gradient: "from-yellow-400 to-rose-500" },
      { id: "documentary", label: "Documentary", emoji: "🧠", gradient: "from-amber-400 to-rose-500" },
    ];
    const adultFollow2: TileOption[] = [
      { id: "quizzes", label: "Mini Quizzes", emoji: "✅", gradient: "from-emerald-400 to-green-500" },
      { id: "deep", label: "Deep Explanations", emoji: "🔍", gradient: "from-indigo-500 to-sky-500" },
      { id: "creative", label: "Creative Projects", emoji: "🧩", gradient: "from-fuchsia-500 to-indigo-500" },
      { id: "practice", label: "Practice First", emoji: "🏃", gradient: "from-orange-500 to-amber-500" },
    ];

    const teenPrimary1: TileOption[] = [
      { id: "naruto", label: "Naruto", emoji: "忍", gradient: "from-amber-400 to-red-500" },
      { id: "onepiece", label: "One Piece", emoji: "🏴‍☠️", gradient: "from-orange-500 to-red-500" },
      { id: "demon", label: "Demon Slayer", emoji: "🔥", gradient: "from-red-500 to-fuchsia-500" },
      { id: "aot", label: "Attack on Titan", emoji: "🗿", gradient: "from-yellow-400 to-rose-500" },
    ];
    const teenPrimary2: TileOption[] = [
      { id: "adventure", label: "Adventure", emoji: "🧭", gradient: "from-rose-500 to-orange-400" },
      { id: "supernatural", label: "Supernatural", emoji: "👻", gradient: "from-indigo-500 to-fuchsia-500" },
      { id: "sports", label: "Sports", emoji: "⚽", gradient: "from-emerald-400 to-teal-500" },
      { id: "romance", label: "Romance", emoji: "💞", gradient: "from-pink-500 to-rose-500" },
    ];
    const teenFollow1: TileOption[] = [
      { id: "fmab", label: "Fullmetal Alchemist", emoji: "⚗️", gradient: "from-amber-400 to-red-500" },
      { id: "haikyuu", label: "Haikyuu!!", emoji: "🏐", gradient: "from-sky-500 to-indigo-500" },
      { id: "jujutsu", label: "Jujutsu Kaisen", emoji: "🌀", gradient: "from-indigo-500 to-fuchsia-500" },
      { id: "drstone", label: "Dr. Stone", emoji: "🪨", gradient: "from-orange-500 to-amber-400" },
    ];
    const teenFollow2: TileOption[] = [
      { id: "epic", label: "Epic Battles", emoji: "⚔️", gradient: "from-red-500 to-pink-500" },
      { id: "emotional", label: "Emotional", emoji: "💧", gradient: "from-fuchsia-500 to-rose-500" },
      { id: "funny", label: "Funny Moments", emoji: "😂", gradient: "from-amber-400 to-orange-500" },
      { id: "mystery", label: "Mystery", emoji: "🕵️", gradient: "from-indigo-500 to-sky-500" },
    ];

    const tweenPrimary1: TileOption[] = [
      { id: "spiderman", label: "Spider-Man", emoji: "🕷️", gradient: "from-sky-500 to-indigo-500" },
      { id: "ironman", label: "Iron Man", emoji: "🤖", gradient: "from-amber-400 to-red-500" },
      { id: "thor", label: "Thor", emoji: "⚡", gradient: "from-yellow-400 to-orange-500" },
      { id: "panther", label: "Black Panther", emoji: "🐆", gradient: "from-emerald-400 to-teal-500" },
    ];
    const tweenPrimary2: TileOption[] = [
      { id: "strength", label: "Super Strength", emoji: "💪", gradient: "from-emerald-400 to-teal-500" },
      { id: "web", label: "Web-Slinging", emoji: "🕸️", gradient: "from-sky-500 to-indigo-500" },
      { id: "flight", label: "Flight", emoji: "🪽", gradient: "from-indigo-500 to-sky-500" },
      { id: "tech", label: "Tech Genius", emoji: "🧠", gradient: "from-amber-400 to-fuchsia-500" },
    ];
    const tweenFollow1: TileOption[] = [
      { id: "avengers", label: "Avengers", emoji: "🛡️", gradient: "from-blue-500 to-indigo-500" },
      { id: "xmen", label: "X-Men", emoji: "🧬", gradient: "from-indigo-500 to-purple-500" },
      { id: "guardians", label: "Guardians", emoji: "🌌", gradient: "from-fuchsia-500 to-indigo-500" },
      { id: "fantastic", label: "Fantastic Four", emoji: "🏗️", gradient: "from-amber-400 to-orange-500" },
    ];
    const tweenFollow2: TileOption[] = [
      { id: "leader", label: "Leader", emoji: "🧭", gradient: "from-amber-400 to-red-500" },
      { id: "defender", label: "Defender", emoji: "🛡️", gradient: "from-emerald-400 to-teal-500" },
      { id: "speed", label: "Speedster", emoji: "🏃", gradient: "from-orange-500 to-amber-500" },
      { id: "strategist", label: "Smart Strategist", emoji: "♟️", gradient: "from-indigo-500 to-sky-500" },
    ];

    const kidPrimary1: TileOption[] = [
      { id: "ben10", label: "Ben 10", emoji: "👾", gradient: "from-sky-500 to-indigo-500" },
      { id: "sponge", label: "SpongeBob", emoji: "🧽", gradient: "from-amber-400 to-orange-500" },
      { id: "pokemon", label: "Pokemon", emoji: "⚡", gradient: "from-yellow-400 to-red-500" },
      { id: "doraemon", label: "Doraemon", emoji: "🔵", gradient: "from-sky-500 to-teal-500" },
    ];
    const kidPrimary2: TileOption[] = [
      { id: "silly", label: "Fun & Silly", emoji: "😜", gradient: "from-pink-500 to-rose-500" },
      { id: "mystery", label: "Mystery", emoji: "🕵️", gradient: "from-indigo-500 to-sky-500" },
      { id: "space", label: "Space", emoji: "🪐", gradient: "from-indigo-500 to-purple-500" },
      { id: "action", label: "Action", emoji: "💥", gradient: "from-red-500 to-orange-400" },
    ];
    const kidFollow1: TileOption[] = [
      { id: "pj", label: "PJ Masks", emoji: "🦸", gradient: "from-fuchsia-500 to-indigo-500" },
      { id: "tmnt", label: "TMNT", emoji: "🐢", gradient: "from-emerald-400 to-teal-500" },
      { id: "caillou", label: "Caillou", emoji: "🧸", gradient: "from-amber-400 to-orange-500" },
      { id: "peppa", label: "Peppa Pig", emoji: "🐷", gradient: "from-rose-500 to-pink-500" },
    ];
    const kidFollow2: TileOption[] = [
      { id: "gadgets", label: "Super Gadgets", emoji: "🧰", gradient: "from-amber-400 to-red-500" },
      { id: "robot", label: "Robot Friend", emoji: "🤖", gradient: "from-indigo-500 to-sky-500" },
      { id: "magic", label: "Magic Notebook", emoji: "📓", gradient: "from-fuchsia-500 to-rose-500" },
      { id: "flying", label: "Flying Backpack", emoji: "🎒", gradient: "from-orange-500 to-amber-400" },
    ];

    if (bucket === "adult") {
      if (isPrimary) {
        return (
          <>
            <TileGrid
              title="Which college/path?"
              options={adultPrimary1}
              value={form.agePrimary1}
              onSelect={(id) => setForm((prev) => ({ ...prev, agePrimary1: id }))}
            />
            <TileGrid
              title="What movie do you prefer?"
              options={adultPrimary2}
              value={form.agePrimary2}
              onSelect={(id) => setForm((prev) => ({ ...prev, agePrimary2: id }))}
            />
          </>
        );
      }
      return (
        <>
          <TileGrid
            title="Pick a movie format"
            options={adultFollow1}
            value={form.ageFollow1}
            onSelect={(id) => setForm((prev) => ({ ...prev, ageFollow1: id }))}
          />
          <TileGrid
            title="How should Explainix teach?"
            options={adultFollow2}
            value={form.ageFollow2}
            onSelect={(id) => setForm((prev) => ({ ...prev, ageFollow2: id }))}
          />
        </>
      );
    }

    if (bucket === "teen") {
      if (isPrimary) {
        return (
          <>
            <TileGrid
              title="Which anime do you like?"
              options={teenPrimary1}
              value={form.agePrimary1}
              onSelect={(id) => setForm((prev) => ({ ...prev, agePrimary1: id }))}
            />
            <TileGrid
              title="Pick an anime style"
              options={teenPrimary2}
              value={form.agePrimary2}
              onSelect={(id) => setForm((prev) => ({ ...prev, agePrimary2: id }))}
            />
          </>
        );
      }
      return (
        <>
          <TileGrid
            title="Pick another anime"
            options={teenFollow1}
            value={form.ageFollow1}
            onSelect={(id) => setForm((prev) => ({ ...prev, ageFollow1: id }))}
          />
          <TileGrid
            title="Choose the story vibe"
            options={teenFollow2}
            value={form.ageFollow2}
            onSelect={(id) => setForm((prev) => ({ ...prev, ageFollow2: id }))}
          />
        </>
      );
    }

    if (bucket === "tween") {
      if (isPrimary) {
        return (
          <>
            <TileGrid
              title="Which Marvel character?"
              options={tweenPrimary1}
              value={form.agePrimary1}
              onSelect={(id) => setForm((prev) => ({ ...prev, agePrimary1: id }))}
            />
            <TileGrid
              title="Pick a power"
              options={tweenPrimary2}
              value={form.agePrimary2}
              onSelect={(id) => setForm((prev) => ({ ...prev, agePrimary2: id }))}
            />
          </>
        );
      }
      return (
        <>
          <TileGrid
            title="Pick a superhero team"
            options={tweenFollow1}
            value={form.ageFollow1}
            onSelect={(id) => setForm((prev) => ({ ...prev, ageFollow1: id }))}
          />
          <TileGrid
            title="What role do you like?"
            options={tweenFollow2}
            value={form.ageFollow2}
            onSelect={(id) => setForm((prev) => ({ ...prev, ageFollow2: id }))}
          />
        </>
      );
    }

    if (isPrimary) {
      return (
        <>
          <TileGrid
            title="Which cartoon do you prefer?"
            options={kidPrimary1}
            value={form.agePrimary1}
            onSelect={(id) => setForm((prev) => ({ ...prev, agePrimary1: id }))}
          />
          <TileGrid
            title="Pick a cartoon vibe"
            options={kidPrimary2}
            value={form.agePrimary2}
            onSelect={(id) => setForm((prev) => ({ ...prev, agePrimary2: id }))}
          />
        </>
      );
    }

    return (
      <>
        <TileGrid
          title="Pick another cartoon"
          options={kidFollow1}
          value={form.ageFollow1}
          onSelect={(id) => setForm((prev) => ({ ...prev, ageFollow1: id }))}
        />
        <TileGrid
          title="Pick your favourite gadget/tool"
          options={kidFollow2}
          value={form.ageFollow2}
          onSelect={(id) => setForm((prev) => ({ ...prev, ageFollow2: id }))}
        />
      </>
    );
  };

  const inputCompact =
    "w-full rounded-2xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200";

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return (
          <div key={stepIndex} className="step-in space-y-3">
            <p className="text-lg font-extrabold text-slate-900">Enter your name</p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">First name</label>
              <input
                className={inputCompact}
                value={form.firstName}
                onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                placeholder="First name"
                autoComplete="given-name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">Middle name (optional)</label>
              <input
                className={inputCompact}
                value={form.middleName}
                onChange={(e) => setForm((p) => ({ ...p, middleName: e.target.value }))}
                placeholder="Middle name"
                autoComplete="additional-name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">Last name</label>
              <input
                className={inputCompact}
                value={form.lastName}
                onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                placeholder="Last name"
                autoComplete="family-name"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div key={stepIndex} className="step-in space-y-4">
            <p className="text-lg font-extrabold text-slate-900">Country / region</p>
            <p className="text-xs font-semibold text-slate-600">Where are you learning from?</p>
            <div className="grid grid-cols-2 gap-2">
              {COUNTRY_OPTIONS.map((c) => {
                const active = form.countryRegion === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, countryRegion: c.id }))}
                    className={[
                      "rounded-2xl border-2 px-3 py-3 text-left text-sm font-extrabold transition",
                      active
                        ? "border-red-500 bg-gradient-to-br from-red-500 to-orange-400 text-white shadow-md"
                        : "border-white/20 bg-white/70 text-slate-800 hover:bg-white",
                    ].join(" ")}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div key={stepIndex} className="step-in space-y-3">
            <p className="text-lg font-extrabold text-slate-900">Date of birth</p>
            <BezelDatePicker
              minYear={minYear}
              maxYear={maxYear}
              month={form.dobMonth}
              day={form.dobDay}
              year={form.dobYear}
              onChange={({ month, day, year }) =>
                setForm((p) => ({ ...p, dobMonth: month, dobDay: day, dobYear: year }))
              }
              computedAge={computedAge}
            />
            <div className="rounded-2xl bg-white/70 px-3 py-2 shadow-sm">
              <p className="text-xs font-extrabold text-slate-700">Age group</p>
              <p className="text-sm font-bold text-slate-600">
                {ageBucket === "adult" ? "Over 18" : ageBucket === "teen" ? "Over 14" : ageBucket === "tween" ? "Over 10" : "6 and up"}
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div key={stepIndex} className="step-in space-y-6">
            <p className="text-lg font-extrabold text-slate-900">Pick your favorites</p>
            {renderAgeTiles(ageBucket, "primary")}
          </div>
        );

      case 4:
        return (
          <div key={stepIndex} className="step-in space-y-6">
            <p className="text-lg font-extrabold text-slate-900">A few more picks</p>
            {renderAgeTiles(ageBucket, "followup")}
          </div>
        );

      case 5: {
        const roleOptions: TileOption[] = [
          { id: "Student", label: "Student", emoji: "🧑‍🎓", gradient: "from-indigo-500 to-sky-500" },
          { id: "Mentor", label: "Mentor", emoji: "🧠", gradient: "from-fuchsia-500 to-purple-500" },
        ];
        return (
          <div key={stepIndex} className="step-in space-y-4">
            <p className="text-lg font-extrabold text-slate-900">Student or Mentor?</p>
            <TileGrid
              title="Choose one"
              options={roleOptions}
              value={form.role}
              onSelect={(id) => setForm((p) => ({ ...p, role: id as RoleType }))}
            />
          </div>
        );
      }

      case 6:
        return (
          <div key={stepIndex} className="step-in space-y-3">
            <p className="text-lg font-extrabold text-slate-900">Phone number</p>
            <p className="text-xs font-semibold text-slate-600">
              Enter {phoneRule.digits} digits for {phoneRule.label}
            </p>
            <div className="flex gap-2">
              <select
                className={`${inputCompact} max-w-[140px] shrink-0`}
                value={form.phoneCountryCode}
                onChange={(e) => setForm((p) => ({ ...p, phoneCountryCode: e.target.value }))}
                aria-label="Country code"
              >
                {PHONE_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                inputMode="numeric"
                className={inputCompact}
                value={form.phoneLocal}
                onChange={(e) => setForm((p) => ({ ...p, phoneLocal: e.target.value.replace(/\D/g, "") }))}
                placeholder="Phone number"
                autoComplete="tel-national"
              />
            </div>
          </div>
        );

      case 7: {
        const subjectOptions: TileOption[] = [
          { id: "Science", label: "Science", emoji: "🧪", gradient: "from-emerald-400 to-teal-500" },
          { id: "Math", label: "Math", emoji: "➗", gradient: "from-yellow-400 to-orange-500" },
          { id: "English", label: "English", emoji: "📚", gradient: "from-sky-500 to-indigo-500" },
          { id: "History", label: "History", emoji: "🏺", gradient: "from-orange-500 to-amber-400" },
          { id: "Coding", label: "Coding", emoji: "💻", gradient: "from-indigo-500 to-sky-500" },
          { id: "Arts", label: "Arts", emoji: "🎨", gradient: "from-fuchsia-500 to-rose-500" },
        ];
        return (
          <div key={stepIndex} className="step-in space-y-6">
            <p className="text-lg font-extrabold text-slate-900">Favourite subject</p>
            <TileGrid
              title="Tap a tile"
              options={subjectOptions}
              value={form.favoriteSubject}
              onSelect={(id) => setForm((p) => ({ ...p, favoriteSubject: id }))}
            />
          </div>
        );
      }

      case 8: {
        const stageOptions: TileOption[] = [
          { id: "School", label: "School", emoji: "🏫", gradient: "from-emerald-400 to-teal-500" },
          { id: "College", label: "College", emoji: "🏛️", gradient: "from-amber-400 to-orange-500" },
        ];
        const streamSchool: TileOption[] = [
          { id: "STEM-S", label: "STEM", emoji: "🧠", gradient: "from-sky-500 to-indigo-500" },
          { id: "Medical-S", label: "Medical", emoji: "🩺", gradient: "from-red-500 to-rose-500" },
          { id: "Commerce-S", label: "Commerce", emoji: "📈", gradient: "from-orange-500 to-amber-400" },
          { id: "Arts-S", label: "Arts", emoji: "🎭", gradient: "from-fuchsia-500 to-purple-500" },
          { id: "Humanities-S", label: "Humanities", emoji: "🏛️", gradient: "from-amber-400 to-rose-500" },
          { id: "Other-S", label: "Other", emoji: "✨", gradient: "from-indigo-500 to-sky-500" },
        ];
        const streamCollege: TileOption[] = [
          { id: "STEM-C", label: "STEM", emoji: "🧠", gradient: "from-sky-500 to-indigo-500" },
          { id: "Medical-C", label: "Medical", emoji: "🩺", gradient: "from-red-500 to-rose-500" },
          { id: "Commerce-C", label: "Commerce", emoji: "📈", gradient: "from-orange-500 to-amber-400" },
          { id: "Arts-C", label: "Arts", emoji: "🎭", gradient: "from-fuchsia-500 to-purple-500" },
          { id: "Law-C", label: "Law", emoji: "⚖️", gradient: "from-stone-500 to-amber-600" },
          { id: "Other-C", label: "Other", emoji: "✨", gradient: "from-indigo-500 to-sky-500" },
        ];
        const streamOptions = form.stage === "College" ? streamCollege : streamSchool;
        return (
          <div key={stepIndex} className="step-in space-y-6">
            <p className="text-lg font-extrabold text-slate-900">School or college stream</p>
            <TileGrid
              title="Stage"
              options={stageOptions}
              value={form.stage}
              onSelect={(id) =>
                setForm((p) => ({
                  ...p,
                  stage: id as StageType,
                  stream: "",
                }))
              }
            />
            <TileGrid
              key={`stream-${form.stage}`}
              title={form.stage === "College" ? "College stream" : "School stream"}
              options={streamOptions}
              value={form.stream}
              onSelect={(id) => setForm((p) => ({ ...p, stream: id }))}
            />
          </div>
        );
      }

      case 9:
        return (
          <div key={stepIndex} className="step-in space-y-6">
            <p className="text-lg font-extrabold text-slate-900">Which degree?</p>
            <TileGrid
              title="Pick one"
              options={[
                { id: "B.Tech", label: "B.Tech", emoji: "🛠️", gradient: "from-amber-400 to-red-500" },
                { id: "B.Sc", label: "B.Sc", emoji: "🔬", gradient: "from-emerald-400 to-teal-500" },
                { id: "MBA", label: "MBA", emoji: "💼", gradient: "from-orange-500 to-amber-400" },
                { id: "MBBS", label: "MBBS", emoji: "🩺", gradient: "from-red-500 to-rose-500" },
                { id: "B.Arts", label: "B.Arts", emoji: "🎨", gradient: "from-fuchsia-500 to-rose-500" },
                { id: "Other", label: "Other", emoji: "✨", gradient: "from-indigo-500 to-sky-500" },
              ]}
              value={form.degree}
              onSelect={(id) => setForm((p) => ({ ...p, degree: id }))}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col bg-gradient-to-b from-amber-100 via-rose-100 to-stone-200 px-5 pb-8 pt-6">
      <div className="mb-4 flex items-start justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-sm transition disabled:opacity-40"
          aria-label="Back"
        >
          <span className="text-xl">←</span>
        </button>

        <div className="flex-1 px-3 text-right">
          <p className="text-xs font-extrabold text-slate-700">
            Step {displayStepNumber} / {totalSteps}
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-400 transition-all"
              style={{ width: `${(displayStepNumber / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <section className="min-h-0 flex-1 rounded-3xl bg-white/85 p-5 shadow-xl">
        <div className="space-y-4">{renderStep()}</div>
      </section>

      <div className="mt-5 shrink-0">
        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed}
          className={[
            "w-full rounded-3xl px-5 py-4 text-base font-extrabold shadow-lg transition",
            canProceed
              ? "bg-gradient-to-r from-red-500 to-orange-400 text-white hover:scale-[1.01]"
              : "cursor-not-allowed bg-white/70 text-slate-400 shadow-none",
          ].join(" ")}
        >
          {primaryLabel}
        </button>
      </div>
    </main>
  );
}
