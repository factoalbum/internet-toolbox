"use client";

import { Clock3, RotateCcw, ArrowRightLeft } from "lucide-react";
import { useMemo, useState } from "react";

type Unit = "seconds" | "minutes" | "hours" | "days";

const factors: Record<Unit, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
};

const units: Unit[] = ["seconds", "minutes", "hours", "days"];
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

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
    const converted = number * factors[from] / factors[to];
    return Number.isFinite(converted) ? converted : null;
  }, [value, from, to]);

  const reset = () => {
    setValue("1");
    setFrom("minutes");
    setTo("hours");
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true">
              <Clock3 size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Convert time units</p>
              <p className="mt-1 text-sm leading-5 text-black/50">Convert seconds, minutes, hours or days.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset time converter">
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-[1.1fr_1fr_auto_1fr] md:items-end">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4">
            <span className="text-sm font-bold">Value</span>
            <span className="mt-1 block text-xs leading-5 text-black/40">Enter the amount you want to convert.</span>
            <input id="time-value" type="number" value={value} onChange={(event) => setValue(event.target.value)} inputMode="decimal" aria-label="Time value" aria-invalid={value.trim() !== "" && !Number.isFinite(Number(value))} className={`mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-4 text-lg font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} />
          </label>

          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4">
            <span className="text-sm font-bold">From</span>
            <span className="mt-1 block text-xs leading-5 text-black/40">The current unit.</span>
            <select id="time-from" value={from} onChange={(event) => setFrom(event.target.value as Unit)} className={`mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`}>
              {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
            </select>
          </label>

          <button type="button" onClick={swap} disabled={from === to} aria-label="Swap time units" title="Swap units" className={`mx-auto flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#d8d4c9] bg-white text-black/55 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 md:mb-1 ${focusRing}`}>
            <ArrowRightLeft size={17} aria-hidden="true" />
          </button>

          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4">
            <span className="text-sm font-bold">Convert to</span>
            <span className="mt-1 block text-xs leading-5 text-black/40">The unit you want back.</span>
            <select id="time-to" value={to} onChange={(event) => setTo(event.target.value as Unit)} className={`mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`}>
              {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-6" aria-live="polite" aria-atomic="true">
          <p className="text-[11px] font-black uppercase tracking-[.15em] text-black/55">Converted result</p>
          <p className="mt-2 break-words text-4xl font-black tracking-[-.04em] sm:text-5xl">
            {result === null ? "Enter a valid value" : `${formatNumber(result)} ${to}`}
          </p>
          {result !== null && <p className="mt-2 text-sm font-medium text-black/50">{formatNumber(Number(value))} {from} = {formatNumber(result)} {to}</p>}
        </div>

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Uses standard relationships: 60 seconds per minute, 60 minutes per hour and 24 hours per day. Results are rounded to a maximum of 8 decimal places for readability.</p>
      </div>
    </div>
  );
}
