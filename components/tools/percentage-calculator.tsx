"use client";

import { Calculator, Copy, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 8 }).format(value);
}

const quickPercentages = [5, 10, 15, 20, 25, 50];
const modes = [
  ["of", "X% of Y"],
  ["increase", "Increase"],
  ["decrease", "Decrease"],
] as const;
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function PercentageCalculator() {
  const [value, setValue] = useState("500");
  const [percentage, setPercentage] = useState("20");
  const [mode, setMode] = useState<"of" | "increase" | "decrease">("of");
  const [copied, setCopied] = useState(false);

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

  const invalidValue = value.trim() !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0);
  const invalidPercentage = percentage.trim() !== "" && (!Number.isFinite(Number(percentage)) || Number(percentage) < 0);

  function reset() {
    setValue("500");
    setPercentage("20");
    setMode("of");
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;
    const numberText = formatNumber(Number(value));
    const percentageText = formatNumber(Number(percentage));
    const resultText = formatNumber(result.primary);
    const changeText = formatNumber(result.secondary);
    const text = mode === "of"
      ? `${percentageText}% of ${numberText} = ${resultText}`
      : `${numberText} ${mode === "increase" ? "increased" : "decreased"} by ${percentageText}% = ${resultText} (change: ${changeText})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function handleModeKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? modes.length - 1 : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + modes.length) % modes.length;
    setMode(modes[nextIndex][0]);
    setCopied(false);
    document.getElementById(`percentage-mode-${modes[nextIndex][0]}`)?.focus();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="percentage-calculator-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-[#171717]" aria-hidden="true"><Calculator size={21} /></span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.14em] text-[#6d8e25]">Everyday calculator</p>
              <h2 id="percentage-calculator-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] sm:text-2xl">Calculate a percentage</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/50">Work out a percentage, increase or decrease without doing the maths by hand.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d0ccc2] bg-white px-3.5 text-sm font-bold text-[#171717] transition hover:border-[#171717] hover:bg-[#f7f5ef] ${focusRing}`} aria-label="Reset percentage calculator">
            <RotateCcw size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <div className="p-5 sm:p-7 md:p-8">
        <section aria-labelledby="percentage-inputs-heading">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Enter your numbers</p>
            <h3 id="percentage-inputs-heading" className="mt-1 text-base font-black text-[#171717]">What are you calculating?</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <label className={`block rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)] ${invalidValue ? "border-[#c46b5c]" : "border-[#dedbd3]"}`}>
              <span className="text-sm font-bold">Number</span>
              <span className="mt-1 block text-xs leading-5 text-black/40">The starting value.</span>
              <input type="number" min="0" step="any" inputMode="decimal" value={value} onChange={(event) => { setValue(event.target.value); setCopied(false); }} className={`mt-3 h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} aria-label="Number" aria-invalid={invalidValue} />
            </label>
            <div className="hidden pb-3 font-mono text-xl text-black/25 md:block" aria-hidden="true">×</div>
            <label className={`block rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)] ${invalidPercentage ? "border-[#c46b5c]" : "border-[#dedbd3]"}`}>
              <span className="text-sm font-bold">Percentage</span>
              <span className="mt-1 block text-xs leading-5 text-black/40">The percentage to apply.</span>
              <div className="relative mt-3">
                <input type="number" min="0" step="any" inputMode="decimal" value={percentage} onChange={(event) => { setPercentage(event.target.value); setCopied(false); }} className={`h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 pr-12 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} aria-label="Percentage" aria-invalid={invalidPercentage} />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-black/35" aria-hidden="true">%</span>
              </div>
            </label>
          </div>

          {(invalidValue || invalidPercentage) && <p className="mt-3 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3 text-xs font-semibold leading-5 text-[#7b3d31]" role="alert">Use numbers greater than or equal to 0 for both fields.</p>}
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2" aria-labelledby="percentage-options-heading">
          <div>
            <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Quick percentage</p>
            <p className="mt-1 text-xs leading-5 text-black/40">Choose a common rate or type your own.</p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick percentage choices">
              {quickPercentages.map((option) => (
                <button key={option} type="button" onClick={() => { setPercentage(String(option)); setCopied(false); }} aria-pressed={percentage === String(option)} className={`min-h-11 rounded-full border px-4 text-xs font-bold transition ${focusRing} ${percentage === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{option}%</button>
              ))}
            </div>
          </div>

          <div>
            <p id="percentage-options-heading" className="text-xs font-black uppercase tracking-[.12em] text-black/40">2. Choose the operation</p>
            <p className="mt-1 text-xs leading-5 text-black/40">Decide whether to find, add or subtract the percentage.</p>
            <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl border border-[#d8d4c9] bg-[#f4f1e9] p-1" role="radiogroup" aria-label="Percentage operation">
              {modes.map(([key, label], index) => (
                <button id={`percentage-mode-${key}`} key={key} type="button" role="radio" aria-checked={mode === key} tabIndex={mode === key ? 0 : -1} onClick={() => { setMode(key); setCopied(false); }} onKeyDown={(event) => handleModeKeyDown(event, index)} className={`min-h-11 rounded-lg px-2 text-xs font-bold transition ${focusRing} ${mode === key ? "bg-[#171717] text-white" : "text-black/45 hover:bg-white hover:text-black"}`}>{label}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="percentage-result-heading" aria-live="polite" aria-atomic="true">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">3. Your result</p>
              <h3 id="percentage-result-heading" className="mt-1 text-base font-black">Calculated value</h3>
            </div>
            {result && <p className="text-xs font-semibold text-black/40">{formatNumber(Number(percentage))}% applied</p>}
          </div>

          <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-7">
            <p className="text-[10px] font-black uppercase tracking-[.16em] text-black/55">Result</p>
            {result ? (
              <>
                <p className="mt-2 break-words text-4xl font-black tracking-[-.04em] md:text-5xl">{formatNumber(result.primary)}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-black/55">{mode === "of" ? `${formatNumber(Number(percentage))}% of ${formatNumber(Number(value))}` : `${formatNumber(Number(value))} ${mode === "increase" ? "increased" : "decreased"} by ${formatNumber(Number(percentage))}%`}</p>
                {mode !== "of" && <p className="mt-1 text-xs font-semibold text-black/45">Change: {formatNumber(result.secondary)}</p>}
              </>
            ) : (
              <p className="mt-2 text-lg font-bold text-black/55">Enter non-negative numbers to calculate.</p>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs leading-5 text-black/40">Copy the exact calculation for sharing or saving.</p>
            <button type="button" onClick={copyResult} disabled={!result} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d0ccc2] bg-white px-3.5 text-sm font-bold text-[#171717] transition hover:border-[#171717] hover:bg-[#f7f5ef] disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`} aria-label="Copy percentage result">
              <Copy size={15} aria-hidden="true" />
              <span>{copied ? "Copied" : "Copy result"}</span>
            </button>
          </div>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{copied ? "Percentage result copied to clipboard." : ""}</p>
        </section>

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Calculated instantly in your browser. For increase and decrease modes, the displayed change is the percentage amount added to or subtracted from the starting value.</p>
      </div>
    </div>
  );
}
