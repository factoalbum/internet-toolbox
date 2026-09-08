"use client";

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

  function useNow() {
    setTimestamp(String(Math.floor(Date.now() / 1000)));
    setUnit("seconds");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7">
        <h2 className="text-lg font-bold">Timestamp → date</h2>
        <p className="mt-1 text-sm leading-6 text-black/50">Turn a Unix timestamp into a readable date.</p>
        <label htmlFor="timestamp-input" className="mt-6 block text-sm font-semibold">Timestamp</label>
        <input id="timestamp-input" value={timestamp} onChange={(event) => setTimestamp(event.target.value)} inputMode="numeric" placeholder="1757300000" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 font-mono text-base outline-none focus:border-[#171717]" />
        <label htmlFor="timestamp-unit" className="mt-4 block text-sm font-semibold">Unit</label>
        <select id="timestamp-unit" value={unit} onChange={(event) => setUnit(event.target.value as "seconds" | "milliseconds")} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717]"><option value="seconds">Seconds</option><option value="milliseconds">Milliseconds</option></select>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={useNow} className="min-h-11 rounded-md bg-[#171717] px-4 text-sm font-semibold text-white">Use current time</button><button type="button" onClick={() => setTimestamp("")} className="min-h-11 rounded-md border border-[#bcb8ae] px-4 text-sm font-semibold">Clear</button></div>
        {timestamp && !timestampResult && <p className="mt-4 text-sm font-medium text-red-700" role="alert">Enter a valid Unix timestamp.</p>}
        {timestampResult && <div className="mt-5 space-y-3"><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">UTC</p><p className="mt-1 break-all font-mono text-sm">{timestampResult.utc}</p></div><div className="border border-[#171717] bg-[#c8f169] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Your local time</p><p className="mt-1 text-sm font-bold">{timestampResult.local}</p></div></div>}
      </section>

      <section className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7">
        <h2 className="text-lg font-bold">Date → timestamp</h2>
        <p className="mt-1 text-sm leading-6 text-black/50">Convert a date and time into Unix seconds or milliseconds.</p>
        <label htmlFor="date-input" className="mt-6 block text-sm font-semibold">Date and time</label>
        <input id="date-input" type="datetime-local" value={dateValue} onChange={(event) => setDateValue(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717]" />
        {dateResult && <div className="mt-5 grid gap-3"><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Unix seconds</p><p className="mt-1 font-mono text-xl font-bold">{dateResult.seconds}</p></div><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Unix milliseconds</p><p className="mt-1 break-all font-mono text-xl font-bold">{dateResult.milliseconds}</p></div></div>}
        <p className="mt-5 text-xs leading-5 text-black/45">Conversions happen in your browser. Unix timestamps represent elapsed time since January 1, 1970 UTC.</p>
      </section>
    </div>
  );
}
