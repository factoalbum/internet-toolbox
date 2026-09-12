"use client";

import { Coins, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("5");
  const [frequency, setFrequency] = useState("4");

  const result = useMemo(() => {
    const p = Number(principal), annual = Number(rate), y = Number(years), n = Number(frequency);
    if (!Number.isFinite(p) || !Number.isFinite(annual) || !Number.isFinite(y) || !Number.isFinite(n) || p <= 0 || annual < 0 || y <= 0 || n <= 0) return null;
    const amount = p * Math.pow(1 + annual / 100 / n, n * y);
    if (!Number.isFinite(amount)) return null;
    return { interest: amount - p, amount };
  }, [principal, rate, years, frequency]);

  const reset = () => {
    setPrincipal("100000");
    setRate("8");
    setYears("5");
    setFrequency("4");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true"><Coins size={20} /></span>
            <div className="min-w-0"><p className="font-bold">Calculate compound interest</p><p className="mt-1 text-sm text-black/50">Estimate how your money grows as interest compounds.</p></div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset compound interest calculator"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
            <span className="text-sm font-bold">Principal amount</span><span className="mt-1 block text-xs text-black/40">Starting balance in rupees</span>
            <input aria-label="Principal amount in rupees" value={principal} onChange={e=>setPrincipal(e.target.value)} type="number" min="0" step="any" inputMode="decimal" className={`mt-3 h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} />
          </label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
            <span className="text-sm font-bold">Interest rate</span><span className="mt-1 block text-xs text-black/40">Annual rate</span>
            <div className="relative mt-3"><input aria-label="Annual interest rate percentage" value={rate} onChange={e=>setRate(e.target.value)} type="number" min="0" step="0.01" inputMode="decimal" className={`h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 pr-12 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-black/35">%</span></div>
          </label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
            <span className="text-sm font-bold">Time period</span><span className="mt-1 block text-xs text-black/40">How long the money stays invested</span>
            <input aria-label="Time period in years" value={years} onChange={e=>setYears(e.target.value)} type="number" min="0.01" step="0.25" inputMode="decimal" className={`mt-3 h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} />
          </label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
            <span className="text-sm font-bold">Compounding frequency</span><span className="mt-1 block text-xs text-black/40">How often interest is added</span>
            <select aria-label="Compounding frequency" value={frequency} onChange={e=>setFrequency(e.target.value)} className={`mt-3 h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-base font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`}><option value="1">Yearly</option><option value="2">Half-yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option></select>
          </label>
        </div>

        <div className="mt-6" aria-live="polite">
          {result ? <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Interest earned</p><p className="mt-2 break-words text-2xl font-black">₹{money(result.interest)}</p></div><div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Final amount</p><p className="mt-2 break-words text-3xl font-black">₹{money(result.amount)}</p></div></div> : <div className="rounded-2xl border border-dashed border-[#d8d4c9] bg-white p-5"><p className="text-sm font-bold">Enter valid values to calculate</p><p className="mt-1 text-sm text-black/50">Use a positive principal and time period with a non-negative interest rate. Extremely large inputs may be outside the calculator's safe numeric range.</p></div>}
        </div>
        <p className="mt-5 text-xs leading-5 text-black/45">Estimate based on compound interest. Actual returns can differ for investments, deposits or loans with different terms.</p>
      </div>
    </div>
  );
}
