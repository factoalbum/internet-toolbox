"use client";

import { Calculator, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 8 }).format(value);
}

const quickPercentages = [5, 10, 15, 20, 25, 50];
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function PercentageCalculator() {
  const [value, setValue] = useState("500");
  const [percentage, setPercentage] = useState("20");
  const [mode, setMode] = useState<"of" | "increase" | "decrease">("of");

  const result = useMemo(() => {
    if (value.trim() === "" || percentage.trim() === "") return null;
    const number = Number(value);
    const rate = Number(percentage);
    if (!Number.isFinite(number) || !Number.isFinite(rate) || number < 0 || rate < 0) return null;
    const amount = (number * rate) / 100;
    if (!Number.isFinite(amount)) return null;
    if (mode === "increase") return { primary: number + amount, secondary: amount };
    if (mode === "decrease") return { primary: number - amount, secondary: amount };
    return { primary: amount, secondary: amount };
  }, [value, percentage, mode]);

  function reset() {
    setValue("500");
    setPercentage("20");
    setMode("of");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c8f169]" aria-hidden="true"><Calculator size={20} /></span>
            <div className="min-w-0"><p className="font-bold">Calculate a percentage</p><p className="mt-1 text-sm text-black/50">Work out a percentage, increase or decrease.</p></div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset percentage calculator"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-bold">Number</span><input type="number" min="0" step="any" inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} className={`mt-2 h-14 w-full rounded-xl border border-[#bcb8ae] bg-white px-4 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} aria-label="Number" aria-invalid={value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0)} /></label>
          <div className="hidden pb-3 font-mono text-xl text-black/25 md:block" aria-hidden="true">×</div>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-bold">Percentage</span><div className="relative mt-2"><input type="number" min="0" step="any" inputMode="decimal" value={percentage} onChange={(event) => setPercentage(event.target.value)} className={`h-14 w-full rounded-xl border border-[#bcb8ae] bg-white px-4 pr-12 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} aria-label="Percentage" aria-invalid={percentage !== "" && (!Number.isFinite(Number(percentage)) || Number(percentage) < 0)} /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-black/35">%</span></div></label>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Quick percentage</p><div className="mt-2 flex flex-wrap gap-2">{quickPercentages.map(option => <button key={option} type="button" onClick={() => setPercentage(String(option))} aria-pressed={percentage === String(option)} className={`min-h-10 rounded-full border px-3 text-xs font-bold transition ${focusRing} ${percentage === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{option}%</button>)}</div></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">What do you want to calculate?</p><div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-[#d8d4c9] bg-[#f4f1e9] p-1" role="radiogroup" aria-label="Percentage operation">
            {([["of", "X% of Y"], ["increase", "Increase"], ["decrease", "Decrease"]] as const).map(([key, label]) => <button key={key} type="button" role="radio" aria-checked={mode === key} onClick={() => setMode(key)} className={`min-h-11 rounded-lg px-2 text-xs font-bold transition ${focusRing} ${mode === key ? "bg-[#171717] text-white" : "text-black/45 hover:bg-white hover:text-black"}`}>{label}</button>)}
          </div></div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#171717] bg-[#171717] p-5 text-white md:p-7" aria-live="polite"><p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/40">Result</p>{result ? <><p className="mt-2 break-words text-4xl font-black tracking-tight md:text-5xl">{formatNumber(result.primary)}</p><p className="mt-2 text-sm text-white/45">{mode === "of" ? `${formatNumber(Number(percentage))}% of ${formatNumber(Number(value))}` : `${formatNumber(Number(value))} ${mode === "increase" ? "increased" : "decreased"} by ${formatNumber(Number(percentage))}%`}</p>{mode !== "of" && <p className="mt-1 text-xs text-white/35">Change: {formatNumber(result.secondary)}</p>}</> : <p className="mt-2 text-lg text-white/55">Enter non-negative numbers to calculate.</p>}</div>
      </div>
    </div>
  );
}
