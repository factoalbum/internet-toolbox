"use client";

import { useMemo, useState } from "react";

type Mode = "difference" | "add" | "subtract";

const DAY = 24 * 60 * 60 * 1000;

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
  const today = new Date().toISOString().slice(0, 10);
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
    if (!Number.isFinite(amount) || amount < 0) return null;
    const resultDate = new Date(startDate);
    resultDate.setDate(resultDate.getDate() + (mode === "add" ? amount : -amount));
    return { kind: "date" as const, date: resultDate, amount };
  }, [mode, start, end, days]);

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Date calculation type">
        {([['difference', 'Date difference'], ['add', 'Add days'], ['subtract', 'Subtract days']] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => setMode(value)}
            className={`min-h-11 rounded-md border px-3 text-sm font-semibold transition ${mode === value ? "border-[#171717] bg-[#171717] text-white" : "border-[#bcb8ae] bg-white hover:border-[#171717]"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">{mode === "difference" ? "Start date" : "Starting date"}</span>
          <input
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]"
          />
        </label>

        {mode === "difference" ? (
          <label className="block">
            <span className="text-sm font-semibold">End date</span>
            <input
              type="date"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]"
            />
          </label>
        ) : (
          <label className="block">
            <span className="text-sm font-semibold">Number of days</span>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={days}
              onChange={(event) => setDays(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]"
            />
          </label>
        )}
      </div>

      {result && result.kind === "difference" ? (
        <div className="mt-7 border border-[#171717] bg-[#c8f169] p-6" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Date difference</p>
          <p className="mt-2 text-3xl font-black">{result.absolute.toLocaleString("en-IN")} days</p>
          <p className="mt-2 text-sm text-black/60">
            {result.difference === 0 ? "The two dates are the same." : result.difference > 0 ? "The end date is after the start date." : "The end date is before the start date."}
          </p>
        </div>
      ) : result ? (
        <div className="mt-7 border border-[#171717] bg-[#c8f169] p-6" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Result date</p>
          <p className="mt-2 text-3xl font-black">{formatDate(result.date)}</p>
          <p className="mt-2 text-sm text-black/60">{result.amount.toLocaleString("en-IN")} days {mode === "add" ? "after" : "before"} {formatDate(parseDate(start))}.</p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-black/50">Enter a valid number of days.</p>
      )}

      <p className="mt-5 text-xs leading-5 text-black/45">Date differences count full calendar days. Results do not account for time zones or business days.</p>
    </div>
  );
}
