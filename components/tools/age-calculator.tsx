"use client";

import { CalendarDays, Check, Copy, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

function localDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
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
  return Number.isSafeInteger(totalDays) ? { years, months, days, totalDays } : null;
}

export default function AgeCalculator() {
  const [birth, setBirth] = useState("2000-01-01");
  const [end, setEnd] = useState(() => localDateValue());
  const [copied, setCopied] = useState(false);
  const birthDate = useMemo(() => parseDate(birth), [birth]);
  const endDate = useMemo(() => parseDate(end), [end]);
  const result = useMemo(() => {
    if (!birthDate || !endDate) return null;
    return age(birthDate, endDate);
  }, [birthDate, endDate]);
  const formattedBirthDate = birthDate ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(birthDate) : "";
  const formattedEndDate = endDate ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(endDate) : "";
  const birthInvalid = !birthDate || (Boolean(endDate) && birthDate > endDate!);
  const endInvalid = !endDate || (Boolean(birthDate) && endDate! < birthDate);
  const hasInvalidInput = birthInvalid || endInvalid;
  const reset = () => { setBirth("2000-01-01"); setEnd(localDateValue()); setCopied(false); };
  const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";
  const copyResult = async () => {
    if (!result) return;
    const text = `Exact age: ${result.years} years, ${result.months} months, ${result.days} days. From ${formattedBirthDate} to ${formattedEndDate}. Total days: ${result.totalDays.toLocaleString("en-IN")}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="age-calculator-title">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true"><CalendarDays size={20} /></span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-black/45">Date utility</p>
              <h2 id="age-calculator-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] md:text-2xl">Find an exact age</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/55">Compare a date of birth with any date to get an exact age in years, months, and days.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset age calculator"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>
      <div className="p-5 md:p-7">
        <section aria-labelledby="age-inputs-heading">
          <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Your dates</p><h3 id="age-inputs-heading" className="mt-1 text-base font-black text-[#171717]">Choose the dates to compare</h3><p className="mt-1 text-xs leading-5 text-black/45">Pick a birth date and the date you want to measure against.</p></div><button type="button" onClick={() => { setEnd(localDateValue()); setCopied(false); }} className={`min-h-11 shrink-0 rounded-xl border border-[#d8d4c9] bg-white px-3 text-xs font-bold text-black/60 transition hover:border-[#171717] hover:text-black ${focusRing}`}>Use today</button></div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className={`rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)] ${birthInvalid ? "border-[#c77a6b]" : "border-[#e2dfd7]"}`}><span className="text-sm font-bold">Date of birth</span><span className="mt-1 block text-xs leading-5 text-black/40">The date you were born.</span><input id="age-birth-date" type="date" value={birth} max={end || undefined} aria-invalid={birthInvalid} aria-describedby="age-input-error" onChange={e => { setBirth(e.target.value); setCopied(false); }} className={`mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-base outline-none ${focusRing}`} /></label>
            <label className={`rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)] ${endInvalid ? "border-[#c77a6b]" : "border-[#e2dfd7]"}`}><span className="text-sm font-bold">Calculate age on</span><span className="mt-1 block text-xs leading-5 text-black/40">Use today or choose another date.</span><input id="age-end-date" type="date" value={end} min={birth || undefined} aria-invalid={endInvalid} aria-describedby="age-input-error" onChange={e => { setEnd(e.target.value); setCopied(false); }} className={`mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-base outline-none ${focusRing}`} /></label>
          </div>
          {hasInvalidInput && <p id="age-input-error" className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">Choose two valid calendar dates, with the birth date on or before the calculation date.</p>}
        </section>

        <section className="mt-7" aria-labelledby="age-results-heading" aria-live="polite" aria-atomic="true">
          <div className="mb-3 flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">2. Your result</p><h3 id="age-results-heading" className="mt-1 text-base font-black text-[#171717]">Exact age</h3></div>{result && <button type="button" onClick={copyResult} className={`flex min-h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition ${copied ? "border-[#7aa33b] bg-[#f2f9df] text-[#416318]" : "border-[#d8d4c9] bg-white text-black/60 hover:border-[#171717] hover:text-black"} ${focusRing}`} aria-label={copied ? "Age result copied" : "Copy age result"}><span aria-hidden="true">{copied ? <Check size={15} /> : <Copy size={15} />}</span>{copied ? "Copied" : "Copy result"}</button>}</div>
          {result ? <div className="space-y-4"><div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-6"><p className="text-[11px] font-black uppercase tracking-[.15em] text-black/55">Age on selected date</p><p className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{result.years} years, {result.months} months, {result.days} days</p><p className="mt-3 text-xs font-medium text-black/55">From {formattedBirthDate} to {formattedEndDate}.</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-[#d8d4c9] bg-white p-4"><p className="text-xs font-semibold text-black/45">Total days</p><p className="mt-1 text-xl font-black">{result.totalDays.toLocaleString("en-IN")}</p><p className="mt-1 text-xs text-black/40">Calendar days between the two dates.</p></div><div className="rounded-2xl border border-[#d8d4c9] bg-white p-4"><p className="text-xs font-semibold text-black/45">Date range</p><p className="mt-1 break-words text-sm font-bold">{birth} to {end}</p></div></div></div> : <div className="rounded-2xl border border-dashed border-[#d8d4c9] bg-white p-5"><p className="text-sm font-bold">Enter valid dates to calculate</p><p className="mt-1 text-sm leading-5 text-black/50">Your exact age and total calendar days will appear here.</p></div>}
        </section>
        <p className="mt-7 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">Age uses calendar years, months and days. Total days is calculated from calendar dates.</p>
      </div>
    </div>
  );
}
