"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

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

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-base font-black tracking-[-0.02em]">Calculate your BMI</p>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-black/55">Enter your height and weight. Your BMI updates instantly as you type.</p>
      </div>
      <button type="button" onClick={reset} className="flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-[#d8d4c9] px-3 text-sm font-bold text-black/60 transition hover:border-[#171717] hover:bg-black/5 hover:text-black sm:w-auto" aria-label="Reset BMI calculator"><RotateCcw size={16} /><span>Reset</span></button>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <label className="block rounded-xl border border-[#e1ded6] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
        <span className="flex items-center justify-between gap-3 text-sm font-bold"><span>Height</span><span className="text-xs font-semibold text-black/40">centimetres</span></span>
        <span className="mt-3 flex items-center gap-3">
          <input aria-label="Height in centimetres" value={height} onChange={e=>setHeight(e.target.value)} type="number" min="1" step="0.1" inputMode="decimal" className="min-h-12 w-full rounded-lg border border-[#bcb8ae] bg-[#fffdf8] px-3 text-lg font-semibold outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" />
          <span aria-hidden="true" className="text-sm font-bold text-black/40">cm</span>
        </span>
      </label>
      <label className="block rounded-xl border border-[#e1ded6] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
        <span className="flex items-center justify-between gap-3 text-sm font-bold"><span>Weight</span><span className="text-xs font-semibold text-black/40">kilograms</span></span>
        <span className="mt-3 flex items-center gap-3">
          <input aria-label="Weight in kilograms" value={weight} onChange={e=>setWeight(e.target.value)} type="number" min="1" step="0.1" inputMode="decimal" className="min-h-12 w-full rounded-lg border border-[#bcb8ae] bg-[#fffdf8] px-3 text-lg font-semibold outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" />
          <span aria-hidden="true" className="text-sm font-bold text-black/40">kg</span>
        </span>
      </label>
    </div>

    {result ? <div className="mt-6 grid gap-4 md:grid-cols-[1.15fr_0.85fr]" aria-live="polite">
      <div className="border border-[#171717] bg-[#c8f169] p-6 md:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Your BMI</p>
        <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
          <p className="text-5xl font-black tracking-[-0.04em]">{result.bmi.toFixed(1)}</p>
          <p className="pb-1 font-bold">{result.category}</p>
        </div>
      </div>
      <div className="border border-[#e1ded6] bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/40">How it was calculated</p>
        <p className="mt-3 text-sm leading-6 text-black/60">Weight ÷ height², using your entered measurements in kilograms and metres.</p>
      </div>
    </div> : <div className="mt-6 rounded-xl border border-dashed border-[#d8d4c9] bg-white p-5" role="alert"><p className="text-sm font-bold">Enter a positive height and weight</p><p className="mt-1 text-sm leading-5 text-black/50">Your BMI result will appear here automatically.</p></div>}

    <p className="mt-5 text-xs leading-5 text-black/45">BMI is a general screening measure based on weight and height. It does not diagnose health conditions or account for age, pregnancy, muscle mass or other individual factors. This calculator is not medical advice.</p>
  </div>;
}
