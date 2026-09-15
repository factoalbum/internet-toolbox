"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Check, Clock3, Copy, RotateCcw } from "lucide-react";
import { convertLocalDateTime } from "../../lib/time-zone";

type Zone = { value: string; label: string };

const zones: Zone[] = [
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Riyadh", label: "Riyadh (AST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Kathmandu", label: "Kathmandu (NPT)" },
  { value: "Europe/London", label: "London (UK)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "America/Chicago", label: "Chicago (CT)" },
  { value: "America/Denver", label: "Denver (MT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { value: "Australia/Sydney", label: "Sydney (AET)" },
];

const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

function defaultDateTime() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

export default function TimeZoneConverter() {
  const [value, setValue] = useState(defaultDateTime);
  const [from, setFrom] = useState("Asia/Kolkata");
  const [to, setTo] = useState("America/New_York");
  const [initialValue] = useState(() => value);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => convertLocalDateTime(value, from, to), [value, from, to]);
  const hasInvalidDate = value.trim() !== "" && !result;
  const isPristine = value === initialValue && from === "Asia/Kolkata" && to === "America/New_York";
  const destinationLabel = zones.find((zone) => zone.value === to)?.label ?? to;

  const swapZones = () => {
    setFrom(to);
    setTo(from);
    setCopied(false);
  };

  const reset = () => {
    setValue(initialValue);
    setFrom("Asia/Kolkata");
    setTo("America/New_York");
    setCopied(false);
  };

  const copyResult = async () => {
    if (!result) return;
    const text = `Time zone conversion\n${value.replace("T", " ")} (${zones.find((zone) => zone.value === from)?.label ?? from})\n= ${result} (${destinationLabel})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-w-0 bg-[#fffdf8] p-4 sm:p-5 md:p-7">
      <div className="flex flex-col gap-4 border-b border-[#e3dfd5] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#dfe7c8] bg-[#f1f6df] text-[#5d7920]" aria-hidden="true">
            <Clock3 size={21} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#6d8e25]">Time zones</p>
            <h3 className="mt-1 text-lg font-black tracking-[-.025em]">Convert a local time</h3>
            <p className="mt-1 max-w-xl text-xs leading-5 text-black/45">Pick a date and time, choose the two locations, and get the equivalent local time.</p>
          </div>
        </div>
        <button type="button" onClick={reset} disabled={isPristine} className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-4 text-xs font-black text-black/65 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#d8d4c9] disabled:hover:text-black/65 ${focusRing}`} aria-label="Reset time zone converter">
          <RotateCcw size={14} aria-hidden="true" /> Reset
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_auto_1fr] lg:items-end">
        <div className={`rounded-2xl border bg-[#faf9f6] p-4 ${hasInvalidDate ? "border-[#d7a9a2]" : "border-[#e0ddd5]"}`}>
          <label htmlFor="timezone-date" className="block text-xs font-black uppercase tracking-[.08em] text-black/55">Date & time</label>
          <input id="timezone-date" type="datetime-local" value={value} onChange={(event) => { setValue(event.target.value); setCopied(false); }} className={`mt-2 min-h-12 w-full min-w-0 rounded-xl border bg-white px-3 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/50 ${hasInvalidDate ? "border-[#b8756d]" : "border-[#c9c5ba]"} ${focusRing}`} aria-describedby="timezone-date-help" aria-invalid={hasInvalidDate} />
          <p id="timezone-date-help" className={`mt-2 text-[11px] leading-4 ${hasInvalidDate ? "text-[#8f4f48]" : "text-black/40"}`}>{hasInvalidDate ? "Enter a valid date and time for the selected time zone." : "The starting date and local clock time."}</p>
        </div>

        <div className="rounded-2xl border border-[#e0ddd5] bg-[#faf9f6] p-4">
          <label htmlFor="timezone-from" className="block text-xs font-black uppercase tracking-[.08em] text-black/55">From</label>
          <select id="timezone-from" value={from} onChange={(event) => { setFrom(event.target.value); setCopied(false); }} className={`mt-2 min-h-12 w-full rounded-xl border border-[#c9c5ba] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/50 ${focusRing}`}>
            {zones.map((zone) => <option key={zone.value} value={zone.value}>{zone.label}</option>)}
          </select>
          <p className="mt-2 text-[11px] leading-4 text-black/40">The time zone the input belongs to.</p>
        </div>

        <button type="button" onClick={swapZones} className={`mx-auto inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#d8d4c9] bg-white text-black/60 transition hover:border-[#171717] hover:text-black ${focusRing} lg:mb-4`} aria-label={`Swap ${from} and ${to} time zones`} title="Swap time zones">
          <ArrowRightLeft size={16} aria-hidden="true" />
        </button>

        <div className="rounded-2xl border border-[#e0ddd5] bg-[#faf9f6] p-4">
          <label htmlFor="timezone-to" className="block text-xs font-black uppercase tracking-[.08em] text-black/55">Convert to</label>
          <select id="timezone-to" value={to} onChange={(event) => { setTo(event.target.value); setCopied(false); }} className={`mt-2 min-h-12 w-full rounded-xl border border-[#c9c5ba] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/50 ${focusRing}`}>
            {zones.map((zone) => <option key={zone.value} value={zone.value}>{zone.label}</option>)}
          </select>
          <p className="mt-2 text-[11px] leading-4 text-black/40">The destination time zone.</p>
        </div>
      </div>

      <section className="mt-5 rounded-2xl border border-[#d9e5b7] bg-[#f1f6df] p-5 sm:p-6" aria-labelledby="timezone-result-title" aria-live="polite">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p id="timezone-result-title" className="text-[10px] font-black uppercase tracking-[.15em] text-[#668025]">Converted time</p>
            <p className="mt-2 break-words text-2xl font-black tracking-[-.035em] sm:text-3xl md:text-4xl">{result || "Enter a date and time"}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-white/75 px-3 py-1.5 text-[10px] font-bold text-[#5a6e29]">{destinationLabel}</span>
            <button type="button" onClick={copyResult} disabled={!result} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#cdd9ab] bg-white px-3 text-xs font-black text-[#526a22] transition hover:border-[#7f952f] hover:text-black disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`} aria-label="Copy converted time" aria-live="polite">
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? "Copied" : "Copy result"}
            </button>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{copied ? "Converted time copied to clipboard." : ""}</p>
      </section>

      <div className="mt-5 flex flex-col gap-2 rounded-xl border border-[#e3dfd5] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-black/45">Uses IANA time zones and accounts for daylight-saving changes where applicable.</p>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[.08em] text-[#6d8e25]">Runs in your browser</span>
      </div>
    </div>
  );
}
