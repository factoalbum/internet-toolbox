"use client";

import { Check, Clipboard, Coins, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";
const MAX_INPUT = 1e15;
const FREQUENCIES = new Set([1, 2, 4, 12]);

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("5");
  const [frequency, setFrequency] = useState("4");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const principalValue = Number(principal);
  const rateValue = Number(rate);
  const yearsValue = Number(years);
  const frequencyValue = Number(frequency);
  const principalInvalid = principal.trim() === "" || !Number.isFinite(principalValue) || principalValue <= 0 || principalValue > MAX_INPUT;
  const rateInvalid = rate.trim() === "" || !Number.isFinite(rateValue) || rateValue < 0 || rateValue > 100;
  const yearsInvalid = years.trim() === "" || !Number.isFinite(yearsValue) || yearsValue <= 0 || yearsValue > 100;
  const frequencyInvalid = !FREQUENCIES.has(frequencyValue);

  const result = useMemo(() => {
    if (principalInvalid || rateInvalid || yearsInvalid || frequencyInvalid) return null;
    const amount = principalValue * Math.pow(1 + rateValue / 100 / frequencyValue, frequencyValue * yearsValue);
    if (!Number.isFinite(amount) || amount > Number.MAX_SAFE_INTEGER) return null;
    return { interest: amount - principalValue, amount };
  }, [principalValue, rateValue, yearsValue, frequencyValue, principalInvalid, rateInvalid, yearsInvalid, frequencyInvalid]);

  const invalid = principalInvalid || rateInvalid || yearsInvalid || frequencyInvalid;
  const isDefault = principal === "100000" && rate === "8" && years === "5" && frequency === "4";

  const resetCopyState = () => {
    setCopied(false);
    setCopyError(false);
  };

  const reset = () => {
    setPrincipal("100000");
    setRate("8");
    setYears("5");
    setFrequency("4");
    resetCopyState();
  };

  const copyResult = async () => {
    if (!result) return;
    const summary = [
      "Compound Interest Estimate",
      `Principal: ₹${money(principalValue)}`,
      `Interest rate: ${rateValue}% per year`,
      `Time period: ${yearsValue} years`,
      `Compounding: ${frequencyValue === 1 ? "Yearly" : frequencyValue === 2 ? "Half-yearly" : frequencyValue === 4 ? "Quarterly" : "Monthly"}`,
      `Interest earned: ₹${money(result.interest)}`,
      `Final amount: ₹${money(result.amount)}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  const handleInputChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    resetCopyState();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="compound-interest-title">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true"><Coins size={20} /></span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-black/45">Money utility</p>
              <h2 id="compound-interest-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] md:text-2xl">Calculate compound interest</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/55">Estimate how your money grows as interest compounds over time.</p>
            </div>
          </div>
          <button type="button" onClick={reset} disabled={isDefault} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 ${focusRing}`} aria-label="Reset compound interest calculator"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <section aria-labelledby="compound-inputs-heading">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Investment details</p>
            <h3 id="compound-inputs-heading" className="mt-1 text-base font-black text-[#171717]">Set your starting numbers</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className={`block rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)] ${principalInvalid ? "border-[#c46b5c]" : "border-[#e2dfd7]"}`}>
              <span className="text-sm font-bold">Principal amount</span><span className="mt-1 block text-xs text-black/40">Starting balance in rupees</span>
              <input aria-label="Principal amount in rupees" aria-invalid={principalInvalid} value={principal} onChange={e=>handleInputChange(setPrincipal)(e.target.value)} type="number" min="0.01" max={MAX_INPUT} step="any" inputMode="decimal" className={`mt-3 h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} />
            </label>
            <label className={`block rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)] ${rateInvalid ? "border-[#c46b5c]" : "border-[#e2dfd7]"}`}>
              <span className="text-sm font-bold">Interest rate</span><span className="mt-1 block text-xs text-black/40">Annual rate, from 0% to 100%</span>
              <div className="relative mt-3"><input aria-label="Annual interest rate percentage" aria-invalid={rateInvalid} value={rate} onChange={e=>handleInputChange(setRate)(e.target.value)} type="number" min="0" max="100" step="0.01" inputMode="decimal" className={`h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 pr-12 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-black/35" aria-hidden="true">%</span></div>
            </label>
            <label className={`block rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)] ${yearsInvalid ? "border-[#c46b5c]" : "border-[#e2dfd7]"}`}>
              <span className="text-sm font-bold">Time period</span><span className="mt-1 block text-xs text-black/40">How long the money stays invested, up to 100 years</span>
              <input aria-label="Time period in years" aria-invalid={yearsInvalid} value={years} onChange={e=>handleInputChange(setYears)(e.target.value)} type="number" min="0.01" max="100" step="0.25" inputMode="decimal" className={`mt-3 h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} />
            </label>
            <label className={`block rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)] ${frequencyInvalid ? "border-[#c46b5c]" : "border-[#e2dfd7]"}`}>
              <span className="text-sm font-bold">Compounding frequency</span><span className="mt-1 block text-xs text-black/40">How often interest is added</span>
              <select aria-label="Compounding frequency" aria-invalid={frequencyInvalid} value={frequency} onChange={e=>handleInputChange(setFrequency)(e.target.value)} className={`mt-3 h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-base font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`}><option value="1">Yearly</option><option value="2">Half-yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option></select>
            </label>
          </div>
          {invalid && <p className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3 text-xs font-semibold leading-5 text-[#7b3d31]" role="alert">Check your inputs: principal must be above ₹0, the rate must be 0–100%, and the time period must be 0–100 years.</p>}
        </section>

        <section className="mt-7" aria-labelledby="compound-results-heading" aria-live="polite" aria-atomic="true">
          <div className="mb-3">
            <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">2. Your estimate</p>
            <h3 id="compound-results-heading" className="mt-1 text-base font-black text-[#171717]">Projected result</h3>
          </div>
          {result ? <div className="space-y-3"><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Interest earned</p><p className="mt-2 break-words text-2xl font-black">₹{money(result.interest)}</p><p className="mt-1 text-xs text-black/40">Growth above your starting amount</p></div><div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Final amount</p><p className="mt-2 break-words text-3xl font-black">₹{money(result.amount)}</p><p className="mt-1 text-xs text-black/55">Principal + compound interest</p></div></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={copyResult} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-4 text-sm font-bold text-black/65 transition hover:border-[#171717] hover:text-black ${focusRing}`}><Clipboard size={16} aria-hidden="true" />{copied ? "Copied" : "Copy result"}</button>{copied && <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#52701c]" role="status"><Check size={14} aria-hidden="true" />Estimate copied</span>}{copyError && <span className="text-xs font-semibold text-[#8a3f35]" role="alert">Couldn’t copy. Try selecting the result manually.</span>}</div><span className="sr-only" aria-live="polite">{copied ? "Compound interest estimate copied to clipboard." : ""}</span></div> : <div className="rounded-2xl border border-dashed border-[#d8d4c9] bg-white p-5"><p className="text-sm font-bold">Enter valid values to calculate</p><p className="mt-1 text-sm leading-5 text-black/50">Use a positive principal and time period with a 0–100% interest rate. The calculator also guards against results too large for safe numeric calculations.</p></div>}
        </section>
        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Estimate based on compound interest. Actual returns can differ for investments, deposits or loans with different terms.</p>
      </div>
    </div>
  );
}
