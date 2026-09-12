"use client";

import { CalendarClock, Check, Clock3, Copy, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

function parseTimestamp(value: string, unit: "seconds" | "milliseconds") {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const milliseconds = unit === "seconds" ? number * 1000 : number;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [dateValue, setDateValue] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const timestampResult = useMemo(() => {
    const date = parseTimestamp(timestamp, unit);
    if (!date) return null;
    return {
      utc: date.toISOString(),
      local: date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "long" }),
    };
  }, [timestamp, unit]);

  const dateResult = useMemo(() => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return null;
    return {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    };
  }, [dateValue]);

  async function copyValue(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      setCopied(null);
    }
  }

  function useNow() {
    setTimestamp(String(Math.floor(Date.now() / 1000)));
    setUnit("seconds");
  }

  function reset() {
    setTimestamp("");
    setUnit("seconds");
    setDateValue("");
    setCopied(null);
  }

  const focusRing = "focus:outline-none focus:ring-4 focus:ring-[#c8f169]";
  const field = `mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-base outline-none transition focus:border-[#171717] ${focusRing}`;
  const action = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${focusRing}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true"><Clock3 size={20} /></span>
            <div className="min-w-0">
              <p className="font-bold">Convert Unix timestamps</p>
              <p className="text-sm leading-5 text-black/50">Switch between timestamps and readable dates without leaving your browser.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className={`${action} shrink-0 border border-[#d8d4c9] bg-white text-black/55 hover:border-[#171717] hover:text-black`} aria-label="Reset timestamp converter"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="grid gap-px bg-[#e2dfd7] md:grid-cols-2">
        <section className="bg-[#fffdf8] p-5 md:p-7" aria-labelledby="timestamp-to-date-heading">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f0e8ff] text-[#6b4bb3]" aria-hidden="true"><Clock3 size={18} /></span>
            <div><h2 id="timestamp-to-date-heading" className="text-lg font-black tracking-[-.02em]">Timestamp → date</h2><p className="mt-1 text-sm leading-6 text-black/50">Turn a Unix timestamp into a readable date.</p></div>
          </div>

          <label htmlFor="timestamp-input" className="mt-6 block text-sm font-bold">Timestamp</label>
          <p id="timestamp-help" className="mt-1 text-xs leading-5 text-black/40">Use seconds for common Unix timestamps, or milliseconds for JavaScript values.</p>
          <input id="timestamp-input" aria-describedby="timestamp-help" value={timestamp} onChange={(event) => setTimestamp(event.target.value)} inputMode="decimal" placeholder="1757300000" className={`${field} font-mono`} />

          <label htmlFor="timestamp-unit" className="mt-4 block text-sm font-bold">Unit</label>
          <select id="timestamp-unit" value={unit} onChange={(event) => setUnit(event.target.value as "seconds" | "milliseconds")} className={field}><option value="seconds">Seconds</option><option value="milliseconds">Milliseconds</option></select>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={useNow} className={`${action} bg-[#171717] text-white hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(23,23,23,.14)]`}><Clock3 size={15} aria-hidden="true" />Use current time</button>
            <button type="button" onClick={() => setTimestamp("")} className={`${action} border border-[#bcb8ae] bg-white text-black/65 hover:border-[#171717] hover:text-black`}>Clear</button>
          </div>

          {timestamp && !timestampResult && <p className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3.5 text-sm font-medium leading-6 text-[#7b3d31]" role="alert">Enter a valid Unix timestamp within the supported JavaScript date range.</p>}
          {timestampResult && <div className="mt-6 space-y-3" aria-live="polite" aria-atomic="true">
            <div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-4">
              <div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">UTC</p><button type="button" onClick={() => copyValue("UTC", timestampResult.utc)} className={`${action} min-h-9 px-2.5 text-xs text-black/50 hover:bg-white hover:text-black`} aria-label="Copy UTC result">{copied === "UTC" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied === "UTC" ? "Copied" : "Copy"}</button></div>
              <p className="mt-2 break-all font-mono text-sm leading-6">{timestampResult.utc}</p>
            </div>
            <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-4"><p className="text-xs font-black uppercase tracking-[.12em] text-black/50">Your local time</p><p className="mt-2 text-lg font-black leading-7">{timestampResult.local}</p></div>
          </div>}
        </section>

        <section className="bg-[#fffdf8] p-5 md:p-7" aria-labelledby="date-to-timestamp-heading">
          <div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f4d0] text-[#5d7c21]" aria-hidden="true"><CalendarClock size={18} /></span><div><h2 id="date-to-timestamp-heading" className="text-lg font-black tracking-[-.02em]">Date → timestamp</h2><p className="mt-1 text-sm leading-6 text-black/50">Convert a date and time into Unix seconds or milliseconds.</p></div></div>

          <label htmlFor="date-input" className="mt-6 block text-sm font-bold">Date and time</label>
          <p id="date-help" className="mt-1 text-xs leading-5 text-black/40">Your browser interprets this date in your local time zone.</p>
          <input id="date-input" aria-describedby="date-help" type="datetime-local" value={dateValue} onChange={(event) => setDateValue(event.target.value)} className={field} />

          {dateResult ? <div className="mt-6 grid gap-3" aria-live="polite" aria-atomic="true">
            <div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Unix seconds</p><button type="button" onClick={() => copyValue("seconds", String(dateResult.seconds))} className={`${action} min-h-9 px-2.5 text-xs text-black/50 hover:bg-white hover:text-black`} aria-label="Copy Unix seconds">{copied === "seconds" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied === "seconds" ? "Copied" : "Copy"}</button></div><p className="mt-2 break-all font-mono text-xl font-black">{dateResult.seconds}</p></div>
            <div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Unix milliseconds</p><button type="button" onClick={() => copyValue("milliseconds", String(dateResult.milliseconds))} className={`${action} min-h-9 px-2.5 text-xs text-black/50 hover:bg-white hover:text-black`} aria-label="Copy Unix milliseconds">{copied === "milliseconds" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied === "milliseconds" ? "Copied" : "Copy"}</button></div><p className="mt-2 break-all font-mono text-xl font-black">{dateResult.milliseconds}</p></div>
          </div> : <div className="mt-6 rounded-2xl border border-dashed border-[#cfcac0] bg-[#f8f6f0] p-5 text-sm leading-6 text-black/45"><p className="font-bold text-black/65">Your timestamp results will appear here.</p><p className="mt-1">Choose a date and time to generate Unix seconds and milliseconds.</p></div>}
        </section>
      </div>

      <div className="border-t border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7"><div className="flex items-start gap-2.5 text-xs leading-5 text-black/50"><Clock3 size={14} className="mt-0.5 shrink-0" aria-hidden="true" /><p>Conversions happen locally. Unix timestamps measure elapsed time from January 1, 1970 UTC; the date picker is interpreted using your browser's local time zone.</p></div></div>
    </div>
  );
}
