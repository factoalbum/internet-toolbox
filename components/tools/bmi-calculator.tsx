"use client";

import { Activity, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const inputClass = "mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-base font-semibold text-[#171717] outline-none transition hover:border-black/30 focus:border-[#171717] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function BmiCalculator() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");

  const parsedHeight = Number(height);
  const parsedWeight = Number(weight);
  const hasInvalidHeight = height.trim() === "" || !Number.isFinite(parsedHeight) || parsedHeight <= 0;
  const hasInvalidWeight = weight.trim() === "" || !Number.isFinite(parsedWeight) || parsedWeight <= 0;
  const isDefault = height === "170" && weight === "70";

  const result = useMemo(() => {
    const h = Number(height) / 100;
    const w = Number(weight);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return null;
    const bmi = w / (h * h);
    if (!Number.isFinite(bmi)) return null;
    const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy range" : bmi < 30 ? "Overweight" : "Obesity";
    return { bmi, category };
  }, [height, weight]);

  const reset = () => {
    setHeight("170");
    setWeight("70");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="bmi-workspace-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e7f6d4] text-[#496d16]" aria-hidden="true">
              <Activity size={21} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.14em] text-[#6d8e25]">Health utility</p>
              <h2 id="bmi-workspace-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] sm:text-2xl">Calculate your BMI</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/50">Enter your height and weight to get an instant BMI estimate and category.</p>
            </div>
          </div>
          <button type="button" onClick={reset} disabled={isDefault} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d0ccc2] bg-white px-3.5 text-sm font-bold text-[#171717] transition hover:border-[#171717] hover:bg-[#f7f5ef] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Reset BMI calculator">
            <RotateCcw size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <div className="p-5 sm:p-7 md:p-8">
        <section aria-labelledby="bmi-inputs-heading">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Your measurements</p>
            <h3 id="bmi-inputs-heading" className="mt-1 text-base font-black text-[#171717]">What should we calculate?</h3>
            <p className="mt-1 text-sm leading-5 text-black/45">Use centimetres for height and kilograms for weight.</p>
          </div>

          <fieldset className="grid gap-4 md:grid-cols-2">
            <legend className="sr-only">BMI measurements</legend>
            <label className={`block min-w-0 rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)] ${hasInvalidHeight ? "border-[#c46b5c]" : "border-[#e2dfd7]"}`}>
              <span className="flex items-center justify-between gap-3 text-sm font-bold"><span>Height</span><span className="text-xs font-semibold text-black/40">centimetres</span></span>
              <span className="mt-1 block text-xs leading-5 text-black/45">Your height in centimetres.</span>
              <span className="flex items-center gap-3">
                <input aria-label="Height in centimetres" aria-invalid={hasInvalidHeight} value={height} onChange={e => setHeight(e.target.value)} type="number" min="1" step="0.1" inputMode="decimal" className={inputClass} />
                <span aria-hidden="true" className="pt-3 text-sm font-bold text-black/40">cm</span>
              </span>
            </label>

            <label className={`block min-w-0 rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)] ${hasInvalidWeight ? "border-[#c46b5c]" : "border-[#e2dfd7]"}`}>
              <span className="flex items-center justify-between gap-3 text-sm font-bold"><span>Weight</span><span className="text-xs font-semibold text-black/40">kilograms</span></span>
              <span className="mt-1 block text-xs leading-5 text-black/45">Your current weight in kilograms.</span>
              <span className="flex items-center gap-3">
                <input aria-label="Weight in kilograms" aria-invalid={hasInvalidWeight} value={weight} onChange={e => setWeight(e.target.value)} type="number" min="1" step="0.1" inputMode="decimal" className={inputClass} />
                <span aria-hidden="true" className="pt-3 text-sm font-bold text-black/40">kg</span>
              </span>
            </label>
          </fieldset>

          {(hasInvalidHeight || hasInvalidWeight) && (
            <p className="mt-3 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3 text-xs font-semibold leading-5 text-[#7b3d31]" role="alert">
              Enter a height and weight greater than zero to calculate your BMI.
            </p>
          )}
        </section>

        <section className="mt-8" aria-labelledby="bmi-result-heading" aria-live="polite" aria-atomic="true">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">2. Your result</p>
              <h3 id="bmi-result-heading" className="mt-1 text-base font-black text-[#171717]">Your BMI estimate</h3>
            </div>
            {result && <span className="text-xs font-semibold text-black/40">Based on your entries</span>}
          </div>

          {result ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5 shadow-[0_5px_14px_rgba(23,23,23,.06)] sm:p-6">
                <p className="text-[11px] font-black uppercase tracking-[.15em] text-black/55">BMI</p>
                <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <p className="text-5xl font-black tabular-nums tracking-[-.04em] sm:text-6xl">{result.bmi.toFixed(1)}</p>
                  <p className="pb-1 font-bold">{result.category}</p>
                </div>
                <p className="mt-2 text-xs font-medium text-black/55">Based on {height} cm and {weight} kg.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#dedbd3] bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/45">Formula</p>
                  <p className="mt-2 text-sm font-bold text-black/70">Weight ÷ height²</p>
                  <p className="mt-1 text-xs leading-5 text-black/40">Weight in kilograms and height in metres.</p>
                </div>
                <div className="rounded-2xl border border-[#dedbd3] bg-[#f4f1e9] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/45">Category</p>
                  <p className="mt-2 text-sm font-bold text-black/70">{result.category}</p>
                  <p className="mt-1 text-xs leading-5 text-black/40">A general screening category, not a diagnosis.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d8d4c9] bg-white p-5" role="status">
              <p className="text-sm font-bold">Your result will appear here</p>
              <p className="mt-1 text-sm leading-5 text-black/50">Enter positive height and weight values to calculate an estimate instantly.</p>
            </div>
          )}
        </section>

        <p className="mt-7 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">BMI is a general screening measure based on weight and height. It does not diagnose health conditions or account for age, pregnancy, muscle mass or other individual factors. This calculator is not medical advice.</p>
      </div>
    </div>
  );
}
