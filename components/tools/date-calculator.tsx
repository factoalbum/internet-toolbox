"use client";

import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";

type Mode = "difference" | "add" | "subtract";

const DAY = 24 * 60 * 60 * 1000;

function localDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function wholeDaysBetween(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / DAY);
}

export default function DateCalculator() {
  const today = localDateInputValue();
  const [mode, setMode] = useState<Mode>("difference");
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [days, setDays] = useState("30");

  const result = useMemo(() => {
    const startDate = parseDate(start);

    if (mode === "difference") {
      const endDate = parseDate(end);
      const difference = wholeDaysBetween(startDate, endDate);
      return { kind: "difference" as const, difference, absolute: Math.abs(difference) };
    }

    const amount = Number(days);
    if (!Number.isInteger(amount) || amount < 0) return null;
    const resultDate = new Date(startDate);
    resultDate.setDate(resultDate.getDate() + (mode === "add" ? amount : -amount));
    return { kind: "date" as const, date: resultDate, amount };
  }, [mode, start, end, days]);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff5cf] text-[#8a6410]" aria-hidden="true">
            <CalendarDays size={20} />
          </span>
          <div className="min-w-0">
            <p className="font-bold">Calculate with dates</p>
            <p className="text-sm text-black/50">Find the difference between dates or move a date by days.</p>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-2 rounded-xl border border-[#d8d4c9] bg-[#f4f1e9] p-1 sm:grid-cols-3" role="tablist" aria-label="Date calculation type">
          {([["difference", "Date difference"], ["add", "Add days"], ["subtract", "Subtract days"]] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#c8f169] ${mode === value ? "border-[#171717] bg-[#171717] text-white" : "border-transparent bg-transparent text-black/50 hover:border-[#d8d4c9] hover:bg-white hover:text-black"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4">
            <span className="text-sm font-semibold">{mode === "difference" ? "Start date" : "Starting date"}</span>
            <input
              type="date"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              className="mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-base outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"
            />
          </label>

          {mode === "difference" ? (
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4">
              <span className="text-sm font-semibold">End date</span>
              <input
                type="date"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                className="mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-base outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"
              />
            </label>
          ) : (
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4">
              <span className="text-sm font-semibold">Number of days</span>
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={days}
                onChange={(event) => setDays(event.target.value)}
                className="mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-base outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"
              />
            </label>
          )}
        </div>

        {result && result.kind === "difference" ? (
          <div className="mt-7 rounded-2xl border border-[#171717] bg-[#c8f169] p-5 sm:p-6" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Date difference</p>
            <p className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl">{result.absolute.toLocaleString("en-IN")} days</p>
            <p className="mt-2 text-sm text-black/60">
              {result.difference === 0 ? "The two dates are the same." : result.difference > 0 ? "The end date is after the start date." : "The end date is before the start date."}
            </p>
          </div>
        ) : result ? (
          <div className="mt-7 rounded-2xl border border-[#171717] bg-[#c8f169] p-5 sm:p-6" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Result date</p>
            <p className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl">{formatDate(result.date)}</p>
            <p className="mt-2 text-sm text-black/60">{result.amount.toLocaleString("en-IN")} days {mode === "add" ? "after" : "before"} {formatDate(parseDate(start))}.</p>
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">Enter a whole number of days.</p>
        )}

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Date differences count full calendar days. Results do not account for time zones or business days.</p>
      </div>
    </div>
  );
}
