"use client";

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

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-bold">Find an exact age</p>
          <p className="mt-1 text-sm text-black/50">Compare a date of birth with any date.</p>
        </div>
        <button type="button" onClick={reset} className="min-h-11 rounded-lg border border-[#d8d4c9] px-4 text-sm font-semibold transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#c8f169]" aria-label="Reset age calculator">Reset</button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Date of birth</span>
          <input type="date" value={birth} max={end} onChange={e => setBirth(e.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Calculate age on</span>
          <input type="date" value={end} min={birth} onChange={e => setEnd(e.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" />
        </label>
      </div>

      {result ? (
        <div className="mt-7 space-y-4" aria-live="polite">
          <div className="border border-[#171717] bg-[#c8f169] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Exact age</p>
            <p className="mt-2 text-3xl font-black">{result.years} years, {result.months} months, {result.days} days</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Total days</p><p className="mt-1 text-xl font-bold">{result.totalDays.toLocaleString("en-IN")}</p></div>
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Date range</p><p className="mt-1 text-sm font-semibold">{birth} → {end}</p></div>
          </div>
        </div>
      ) : <p className="mt-6 text-sm text-black/50" role="alert">Choose a valid birth date before the calculation date.</p>}

      <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">Age uses calendar years, months and days. Total days is calculated from the calendar dates, avoiding daylight-saving-time hour differences.</p>
    </div>
  );
}
