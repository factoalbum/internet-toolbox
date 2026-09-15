"use client";

import { CalendarDays, Check, Copy, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

type Mode = "difference" | "add" | "subtract";

const DAY = 24 * 60 * 60 * 1000;
const MAX_DAYS = 1_000_000;

function localDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function isValidDate(date: Date) {
  return Number.isFinite(date.getTime());
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
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const startDate = parseDate(start);
    if (!isValidDate(startDate)) return null;

    if (mode === "difference") {
      const endDate = parseDate(end);
      if (!isValidDate(endDate)) return null;
      const difference = wholeDaysBetween(startDate, endDate);
      return { kind: "difference" as const, difference, absolute: Math.abs(difference) };
    }

    const amount = Number(days);
    if (!Number.isSafeInteger(amount) || amount < 0 || amount > MAX_DAYS) return null;
    const resultDate = new Date(startDate);
    resultDate.setDate(resultDate.getDate() + (mode === "add" ? amount : -amount));
    if (!isValidDate(resultDate)) return null;
    return { kind: "date" as const, date: resultDate, amount };
  }, [mode, start, end, days]);

  const reset = () => {
    const current = localDateInputValue();
    setMode("difference");
    setStart(current);
    setEnd(current);
    setDays("30");
    setCopied(false);
  };

  const copyResult = async () => {
    if (!result) return;
    const text = result.kind === "difference"
      ? `${result.absolute.toLocaleString("en-IN")} days between ${formatDate(parseDate(start))} and ${formatDate(parseDate(end))}`
      : `${formatDate(result.date)} - ${result.amount.toLocaleString("en-IN")} days ${mode === "add" ? "after" : "before"} ${formatDate(parseDate(start))}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";
  const daysInputInvalid = days !== "" && (!Number.isSafeInteger(Number(days)) || Number(days) < 0 || Number(days) > MAX_DAYS);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff5cf] text-[#8a6410]" aria-hidden="true">
              <CalendarDays size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Calculate with dates</p>
              <p className="mt-1 text-sm leading-5 text-black/50">Find the difference between dates or move a date by days.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset date calculator">
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
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
              tabIndex={mode === value ? 0 : -1}
              onClick={() => { setMode(value); setCopied(false); }}
              className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition ${focusRing} ${mode === value ? "border-[#171717] bg-[#171717] text-white" : "border-transparent bg-transparent text-black/50 hover:border-[#d8d4c9] hover:bg-white hover:text-black"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
            <span className="text-sm font-bold">{mode === "difference" ? "Start date" : "Starting date"}</span>
            <span className="mt-1 block text-xs leading-5 text-black/40">{mode === "difference" ? "The first date in your range." : "The date you want to move."}</span>
            <input id="date-calculator-start" type="date" value={start} aria-label={mode === "difference" ? "Start date" : "Starting date"} onChange={(event) => { setStart(event.target.value); setCopied(false); }} className={`mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-3 text-base outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} />
          </label>

          {mode === "difference" ? (
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
              <span className="text-sm font-bold">End date</span>
              <span className="mt-1 block text-xs leading-5 text-black/40">The second date in your range.</span>
              <input id="date-calculator-end" type="date" value={end} min={start} aria-label="End date" onChange={(event) => { setEnd(event.target.value); setCopied(false); }} className={`mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-3 text-base outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} />
            </label>
          ) : (
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
              <span className="text-sm font-bold">Number of days</span>
              <span className="mt-1 block text-xs leading-5 text-black/40">Whole calendar days to move the date. Maximum {MAX_DAYS.toLocaleString("en-IN")}.</span>
              <input id="date-calculator-days" type="number" min="0" max={MAX_DAYS} step="1" inputMode="numeric" value={days} aria-label="Number of days" aria-invalid={daysInputInvalid} onChange={(event) => { setDays(event.target.value); setCopied(false); }} className={`mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-3 text-base outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} />
            </label>
          )}
        </div>

        {result && result.kind === "difference" ? (
          <div className="mt-7 rounded-2xl border border-[#171717] bg-[#c8f169] p-5 sm:p-6" aria-live="polite" aria-atomic="true">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Date difference</p>
            <p className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl">{result.absolute.toLocaleString("en-IN")} days</p>
            <p className="mt-2 text-sm text-black/60">{result.difference === 0 ? "The two dates are the same." : result.difference > 0 ? "The end date is after the start date." : "The end date is before the start date."}</p>
            <button type="button" onClick={copyResult} className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#171717] bg-white px-4 text-sm font-bold text-[#171717] transition hover:bg-[#fffdf8] ${focusRing}`} aria-label={copied ? "Date difference copied" : "Copy date difference"}>{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copied ? "Copied" : "Copy result"}</button>
          </div>
        ) : result ? (
          <div className="mt-7 rounded-2xl border border-[#171717] bg-[#c8f169] p-5 sm:p-6" aria-live="polite" aria-atomic="true">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Result date</p>
            <p className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl">{formatDate(result.date)}</p>
            <p className="mt-2 text-sm text-black/60">{result.amount.toLocaleString("en-IN")} days {mode === "add" ? "after" : "before"} {formatDate(parseDate(start))}.</p>
            <button type="button" onClick={copyResult} className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#171717] bg-white px-4 text-sm font-bold text-[#171717] transition hover:bg-[#fffdf8] ${focusRing}`} aria-label={copied ? "Result date copied" : "Copy result date"}>{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copied ? "Copied" : "Copy result"}</button>
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">{mode === "difference" ? "Enter valid start and end dates." : `Enter a whole number of days from 0 to ${MAX_DAYS.toLocaleString("en-IN")}.`}</p>
        )}

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Date differences count full calendar days. Results do not account for time zones or business days.</p>
      </div>
    </div>
  );
}
