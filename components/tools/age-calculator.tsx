"use client";

import { CalendarDays, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

function localDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function calendarDayNumber(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;
}

function age(birth: Date, end: Date) {
  if (birth > end) return null;
  let years = end.getFullYear() - birth.getFullYear();
  let months = end.getMonth() - birth.getMonth();
  let days = end.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = calendarDayNumber(end) - calendarDayNumber(birth);
  return { years, months, days, totalDays };
}

export default function AgeCalculator() {
  const [birth, setBirth] = useState("2000-01-01");
  const [end, setEnd] = useState(() => localDateValue());

  const result = useMemo(() => age(parseDate(birth), parseDate(end)), [birth, end]);

  const reset = () => {
    setBirth("2000-01-01");
    setEnd(localDateValue());
  };

  const focusRing = "focus:outline-none focus:ring-4 focus:ring-[#c8f169]";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true">
              <CalendarDays size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Find an exact age</p>
              <p className="text-sm leading-5 text-black/50">Compare a date of birth with any date.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset age calculator">
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
            <span className="text-sm font-bold">Date of birth</span>
            <span className="mt-1 block text-xs leading-5 text-black/40">The date you were born.</span>
            <input id="age-birth-date" type="date" value={birth} max={end} onChange={e => setBirth(e.target.value)} className={`mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-base outline-none transition focus:border-[#171717] ${focusRing}`} />
          </label>
          <label className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
            <span className="text-sm font-bold">Calculate age on</span>
            <span className="mt-1 block text-xs leading-5 text-black/40">Use today or choose another date.</span>
            <input id="age-end-date" type="date" value={end} min={birth} onChange={e => setEnd(e.target.value)} className={`mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-base outline-none transition focus:border-[#171717] ${focusRing}`} />
          </label>
        </div>

        {result ? (
          <div className="mt-7 space-y-4" aria-live="polite" aria-atomic="true">
            <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-6">
              <p className="text-[11px] font-black uppercase tracking-[.15em] text-black/55">Exact age</p>
              <p className="mt-2 text-2xl font-black leading-tight tracking-[-.035em] sm:text-3xl">{result.years} years, {result.months} months, {result.days} days</p>
              <p className="mt-2 text-xs font-medium text-black/55">Calculated from {birth} to {end}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4">
                <p className="text-xs font-semibold text-black/45">Total days</p>
                <p className="mt-1 text-xl font-black">{result.totalDays.toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4">
                <p className="text-xs font-semibold text-black/45">Date range</p>
                <p className="mt-1 break-words text-sm font-bold">{birth} → {end}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">Choose a valid birth date before the calculation date.</p>
        )}

        <p className="mt-7 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">Age uses calendar years, months and days. Total days is calculated from the calendar dates, avoiding daylight-saving-time hour differences.</p>
      </div>
    </div>
  );
}
