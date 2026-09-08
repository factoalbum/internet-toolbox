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
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8] shadow-[6px_6px_0_#171717]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#c8f169] text-[#171717]" aria-hidden="true"><Calculator size={20} /></span>
            <div><p className="font-bold">Calculate a percentage</p><p className="text-sm text-black/50">Enter two numbers to get an instant answer.</p></div>
          </div>
          <button type="button" onClick={reset} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-bold text-black/45 transition hover:bg-white hover:text-black" aria-label="Reset calculator"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[1fr_auto_1fr] md:items-end md:p-7">
        <label className="block"><span className="text-sm font-bold">Number</span><input type="number" inputMode="decimal" value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-2 h-14 w-full rounded-lg border border-[#bcb8ae] bg-white px-4 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" aria-label="Number" /></label>
        <div className="hidden pb-3 font-mono text-xl text-black/25 md:block">×</div>
        <label className="block"><span className="text-sm font-bold">Percentage</span><div className="relative mt-2"><input type="number" inputMode="decimal" value={percentage} onChange={(event) => setPercentage(Number(event.target.value))} className="h-14 w-full rounded-lg border border-[#bcb8ae] bg-white px-4 pr-12 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" aria-label="Percentage" /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-black/35">%</span></div></label>
      </div>

      <div className="px-5 pb-5 md:px-7 md:pb-7"><div className="grid grid-cols-3 gap-1 border border-[#d8d4c9] bg-[#e8e4d9] p-1" role="tablist" aria-label="Percentage operation">
        {([["of", "What is X% of Y?"], ["increase", "Increase by X%"], ["decrease", "Decrease by X%"]] as const).map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={mode === key} onClick={() => setMode(key)} className={`min-h-11 rounded-lg px-2 text-xs font-bold transition sm:text-sm ${mode === key ? "bg-[#171717] text-white" : "text-black/45 hover:text-black"}`}>{label}</button>)}
      </div></div>

      <div className="mx-5 mb-5 bg-[#171717] p-6 text-white md:mx-7 md:mb-7 md:p-7" aria-live="polite">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/40">Result</p>
        {result ? <><p className="mt-2 break-words text-4xl font-black tracking-tight md:text-5xl">{formatNumber(result.primary)}</p><p className="mt-2 text-sm text-white/45">{mode === "of" ? `${formatNumber(percentage)}% of ${formatNumber(value)}` : `${formatNumber(value)} ${mode === "increase" ? "increased" : "decreased"} by ${formatNumber(percentage)}%`}</p></> : <p className="mt-2 text-lg text-white/55">Enter valid numbers to calculate.</p>}
      </div>
    </div>
  );
}
