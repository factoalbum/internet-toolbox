"use client";

import { useMemo, useState } from "react";

type Unit = "seconds" | "minutes" | "hours" | "days";

const factors: Record<Unit, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
};

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

export default function TimeConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<Unit>("seconds");
  const [to, setTo] = useState<Unit>("minutes");

  const result = useMemo(() => {
    const number = Number(value);
    if (!value.trim() || !Number.isFinite(number)) return null;
    return (number * factors[from]) / factors[to];
  }, [value, from, to]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function clear() {
    setValue("");
    setFrom("seconds");
    setTo("minutes");
  }

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <h2 className="font-bold">Convert time units</h2>
        <p className="mt-1 text-sm text-black/45">Convert seconds, minutes, hours and days instantly.</p>
      </div>
      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <div>
            <label htmlFor="time-value" className="block text-sm font-bold">Value</label>
            <input id="time-value" value={value} onChange={(event) => setValue(event.target.value)} inputMode="decimal" placeholder="60" className="mt-2 min-h-12 w-full rounded-md border border-[#cfcabf] bg-[#f8f5ed] px-4 text-base outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
          </div>
          <button type="button" onClick={swap} className="min-h-11 rounded-md border border-[#bcb8ae] px-4 text-sm font-bold transition hover:border-[#171717] hover:bg-black/5" aria-label="Swap units">Swap</button>
          <div>
            <label htmlFor="time-from" className="block text-sm font-bold">From</label>
            <select id="time-from" value={from} onChange={(event) => setFrom(event.target.value as Unit)} className="mt-2 min-h-12 w-full rounded-md border border-[#cfcabf] bg-[#f8f5ed] px-4 text-sm outline-none focus:border-[#171717]">
              <option value="seconds">Seconds</option><option value="minutes">Minutes</option><option value="hours">Hours</option><option value="days">Days</option>
            </select>
          </div>
        </div>

        <div className="mt-5 border border-[#171717] bg-[#c8f169] p-5 md:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Result</p>
          <p className="mt-2 break-all text-2xl font-black tracking-tight md:text-3xl" aria-live="polite">{result === null ? "—" : `${formatNumber(result)} ${to}`}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-4">
          <div className="min-w-48 flex-1">
            <label htmlFor="time-to" className="block text-sm font-bold">Convert to</label>
            <select id="time-to" value={to} onChange={(event) => setTo(event.target.value as Unit)} className="mt-2 min-h-12 w-full rounded-md border border-[#cfcabf] bg-[#f8f5ed] px-4 text-sm outline-none focus:border-[#171717]">
              <option value="seconds">Seconds</option><option value="minutes">Minutes</option><option value="hours">Hours</option><option value="days">Days</option>
            </select>
          </div>
          <button type="button" onClick={clear} className="min-h-11 rounded-md px-3 text-sm font-medium text-black/45 transition hover:bg-black/5 hover:text-black">Clear</button>
        </div>

        <div className="mt-7 border-t border-[#d8d4c9] pt-5">
          <p className="text-sm font-bold">Quick conversions</p>
          <p className="mt-2 text-sm leading-6 text-black/50">1 minute = 60 seconds · 1 hour = 60 minutes · 1 day = 24 hours</p>
        </div>
      </div>
    </div>
  );
}
