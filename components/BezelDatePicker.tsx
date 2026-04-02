"use client";

import { useMemo } from "react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

type Props = {
  minYear: number;
  maxYear: number;
  month: number;
  day: number;
  year: number | null;
  onChange: (next: { month: number; day: number; year: number }) => void;
  computedAge: number | null;
};

export function BezelDatePicker({ minYear, maxYear, month, day, year, onChange, computedAge }: Props) {
  const safeYear = year ?? maxYear;
  const maxDay = useMemo(() => daysInMonth(safeYear, month), [safeYear, month]);
  const safeDay = Math.min(day, maxDay);

  const yearNormalized = (safeYear - minYear) / (maxYear - minYear);
  const angle = Math.max(0, Math.min(1, yearNormalized)) * 180;

  const setMonth = (m: number) => {
    const d = daysInMonth(safeYear, m);
    onChange({ month: m, day: Math.min(safeDay, d), year: safeYear });
  };

  const setDay = (d: number) => {
    onChange({ month, day: d, year: safeYear });
  };

  const setYear = (y: number) => {
    const d = daysInMonth(y, month);
    onChange({ month, day: Math.min(safeDay, d), year: y });
  };

  return (
    <div className="space-y-4">
      <p className="text-base font-extrabold text-slate-900">
        Choose your date of birth
        <span className="ml-2 text-sm font-bold text-slate-600">{computedAge != null ? `~${computedAge} yrs` : ""}</span>
      </p>

      <div className="relative mx-auto w-full max-w-[330px]">
        <svg viewBox="0 0 200 120" className="w-full">
          <defs>
            <linearGradient id="bezelGradMain" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="50%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>

          <path
            d="M 20 120 A 80 80 0 0 1 180 120"
            fill="none"
            stroke="url(#bezelGradMain)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.85"
          />

          <g transform={`rotate(${angle} 100 120)`}>
            <line
              x1="100"
              y1="120"
              x2="20"
              y2="120"
              stroke="url(#bezelGradMain)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="20" cy="120" r="10" fill="#ffffff" fillOpacity="0.92" />
          </g>
        </svg>

        <input
          aria-label="Birth year"
          type="range"
          min={minYear}
          max={maxYear}
          step={1}
          value={safeYear}
          onChange={(e) => setYear(parseInt(e.target.value, 10))}
          className="absolute inset-0 h-[70%] w-full cursor-pointer opacity-0"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-1">
          <div className="rounded-2xl bg-white px-3 py-2.5 shadow-lg ring-1 ring-black/5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs font-bold text-slate-500">Month</div>
                <div className="text-sm font-extrabold text-slate-900">{MONTHS[month - 1]}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500">Date</div>
                <div className="text-sm font-extrabold text-slate-900">{safeDay}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500">Year</div>
                <div className="text-sm font-extrabold text-slate-900">{safeYear}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[330px] grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">Month</label>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            className="w-full accent-orange-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">Date</label>
          <input
            type="range"
            min={1}
            max={maxDay}
            step={1}
            value={safeDay}
            onChange={(e) => setDay(parseInt(e.target.value, 10))}
            className="w-full accent-rose-500"
          />
        </div>
      </div>
    </div>
  );
}
