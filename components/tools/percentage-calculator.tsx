"use client";

import { Calculator, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(value);
}

export default function PercentageCalculator() {
  const [value, setValue] = useState(500);
  const [percentage, setPercentage] = useState(20);
  const [mode, setMode] = useState<"of" | "increase" | "decrease">("of");

  const result = useMemo(() => {
    if (!Number.isFinite(value) || !Number.isFinite(percentage)) return null;
    const amount = (value * percentage) / 100;
    if (mode === "increase") return { primary: value + amount, secondary: amount };
    if (mode === "decrease") return { primary: value - amount, secondary: amount };
    return { primary: amount, secondary: value };
  }, [value, percentage, mode]);

  function reset() {
    setValue(500);
    setPercentage(20);
    setMode("of");
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700" aria-hidden="true">
              <Calculator size={20} />
            </span>
            <div>
              <p className="font-semibold text-slate-950">Calculate a percentage</p>
              <p className="text-sm text-slate-500">Enter two numbers to get an instant answer.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-900" aria-label="Reset calculator">
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto_1fr] md:items-end md:p-7">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Number</span>
          <input type="number" inputMode="decimal" value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-2 h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-xl font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" aria-label="Number" />
        </label>

        <div className="hidden pb-3 text-2xl font-medium text-slate-300 md:block">×</div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Percentage</span>
          <div className="relative mt-2">
            <input type="number" inputMode="decimal" value={percentage} onChange={(event) => setPercentage(Number(event.target.value))} className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 pr-12 text-xl font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" aria-label="Percentage" />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">%</span>
          </div>
        </label>
      </div>

      <div className="px-5 pb-5 md:px-7 md:pb-7">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label="Percentage operation">
          {([
            ["of", "What is X% of Y?"],
            ["increase", "Increase by X%"],
            ["decrease", "Decrease by X%"],
          ] as const).map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={mode === key} onClick={() => setMode(key)} className={`min-h-11 rounded-xl px-2 text-xs font-semibold transition sm:text-sm ${mode === key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-5 mb-5 rounded-2xl bg-slate-950 p-6 text-white md:mx-7 md:mb-7 md:p-7" aria-live="polite">
        <p className="text-sm font-medium text-slate-400">Result</p>
        {result ? (
          <>
            <p className="mt-2 break-words text-4xl font-bold tracking-tight md:text-5xl">{formatNumber(result.primary)}</p>
            <p className="mt-2 text-sm text-slate-400">
              {mode === "of" ? `${formatNumber(percentage)}% of ${formatNumber(value)}` : `${formatNumber(value)} ${mode === "increase" ? "increased" : "decreased"} by ${formatNumber(percentage)}%`}
            </p>
          </>
        ) : (
          <p className="mt-2 text-lg text-slate-300">Enter valid numbers to calculate.</p>
        )}
      </div>
    </div>
  );
}
