"use client";

import { Activity, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const inputClass = "mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-base font-semibold text-[#171717] outline-none transition hover:border-black/30 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] focus:ring-offset-1";

export default function BmiCalculator() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");

  const result = useMemo(() => {
    const h = Number(height) / 100, w = Number(weight);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return null;
    const bmi = w / (h * h);
    const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy range" : bmi < 30 ? "Overweight" : "Obesity";
    return { bmi, category };
  }, [height, weight]);

  const reset = () => { setHeight("170"); setWeight("70"); };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e7f6d4] text-[#496d16]" aria-hidden="true">
              <Activity size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Calculate your BMI</p>
              <p className="text-sm leading-5 text-black/50">Enter your height and weight. Your BMI updates instantly.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Reset BMI calculator">
            <RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block min-w-0 rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)]">
            <span className="flex items-center justify-between gap-3 text-sm font-bold"><span>Height</span><span className="text-xs font-semibold text-black/40">centimetres</span></span>
            <span className="mt-1 block text-xs leading-5 text-black/45">Your height in centimetres.</span>
            <span className="flex items-center gap-3">
              <input aria-label="Height in centimetres" value={height} onChange={e => setHeight(e.target.value)} type="number" min="1" step="0.1" inputMode="decimal" className={inputClass} />
              <span aria-hidden="true" className="pt-3 text-sm font-bold text-black/40">cm</span>
            </span>
          </label>
          <label className="block min-w-0 rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)]">
            <span className="flex items-center justify-between gap-3 text-sm font-bold"><span>Weight</span><span className="text-xs font-semibold text-black/40">kilograms</span></span>
            <span className="mt-1 block text-xs leading-5 text-black/45">Your current weight in kilograms.</span>
            <span className="flex items-center gap-3">
              <input aria-label="Weight in kilograms" value={weight} onChange={e => setWeight(e.target.value)} type="number" min="1" step="0.1" inputMode="decimal" className={inputClass} />
              <span aria-hidden="true" className="pt-3 text-sm font-bold text-black/40">kg</span>
            </span>
          </label>
        </div>

        {result ? (
          <div className="mt-7 space-y-4" aria-live="polite" aria-atomic="true">
            <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-6">
              <p className="text-[11px] font-black uppercase tracking-[.15em] text-black/55">Your BMI</p>
              <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                <p className="text-5xl font-black tracking-[-0.04em]">{result.bmi.toFixed(1)}</p>
                <p className="pb-1 font-bold">{result.category}</p>
              </div>
              <p className="mt-2 text-xs font-medium text-black/55">Based on {height} cm and {weight} kg.</p>
            </div>
            <div className="rounded-2xl border border-[#d8d4c9] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/40">How it was calculated</p>
              <p className="mt-3 text-sm leading-6 text-black/60">Weight ÷ height², using your entered measurements in kilograms and metres.</p>
            </div>
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-[#d8d4c9] bg-white p-5" role="alert">
            <p className="text-sm font-bold">Enter a positive height and weight</p>
            <p className="mt-1 text-sm leading-5 text-black/50">Your BMI result will appear here automatically.</p>
          </div>
        )}

        <p className="mt-7 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">BMI is a general screening measure based on weight and height. It does not diagnose health conditions or account for age, pregnancy, muscle mass or other individual factors. This calculator is not medical advice.</p>
      </div>
    </div>
  );
}
