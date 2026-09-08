"use client";

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

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="grid gap-5 md:grid-cols-2">
      <label className="block"><span className="text-sm font-semibold">Height (cm)</span><input value={height} onChange={e=>setHeight(e.target.value)} type="number" min="1" inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717]" /></label>
      <label className="block"><span className="text-sm font-semibold">Weight (kg)</span><input value={weight} onChange={e=>setWeight(e.target.value)} type="number" min="1" inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717]" /></label>
    </div>
    {result ? <div className="mt-7 border border-[#171717] bg-[#c8f169] p-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Your BMI</p><p className="mt-2 text-5xl font-black">{result.bmi.toFixed(1)}</p><p className="mt-2 font-bold">{result.category}</p></div> : <p className="mt-6 text-sm text-black/50">Enter your height and weight to calculate BMI.</p>}
    <p className="mt-5 text-xs leading-5 text-black/45">BMI is a general screening measure and does not diagnose health conditions or account for every individual factor.</p>
  </div>;
}
