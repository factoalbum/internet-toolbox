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
  return Number.isInteger(value)
    ? value.toLocaleString()
    : value.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

export default function TimeConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState<Unit>("minutes");
  const [to, setTo] = useState<Unit>("hours");

  const result = useMemo(() => {
    const number = Number(value);
    if (!value.trim() || !Number.isFinite(number)) return null;
    return number * factors[from] / factors[to];
  }, [value, from, to]);

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <label className="block text-sm font-bold">Enter a time value</label>
      <p className="mt-1 text-sm text-black/45">Convert seconds, minutes, hours or days.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="time-value" className="block text-sm font-bold">Value</label>
          <input
            id="time-value"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            inputMode="decimal"
            className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-base outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40"
          />
        </div>
        <div>
          <label htmlFor="time-from" className="block text-sm font-bold">From</label>
          <select
            id="time-from"
            value={from}
            onChange={(event) => setFrom(event.target.value as Unit)}
            className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]"
          >
            {Object.keys(factors).map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="time-to" className="block text-sm font-bold">Convert to</label>
          <select
            id="time-to"
            value={to}
            onChange={(event) => setTo(event.target.value as Unit)}
            className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]"
          >
            {Object.keys(factors).map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 border border-[#171717] bg-[#c8f169] p-5" aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Result</p>
        <p className="mt-2 break-all text-3xl font-black">
          {result === null ? "Enter a value" : `${formatNumber(result)} ${to}`}
        </p>
      </div>

      <p className="mt-6 text-xs leading-5 text-black/45">Uses standard time relationships. Results are rounded for readability.</p>
    </div>
  );
}
