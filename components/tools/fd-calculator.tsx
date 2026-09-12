"use client";

import { Banknote, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const depositOptions = [50000, 100000, 500000, 1000000];
const tenureOptions = [1, 3, 5, 10];
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function FdCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");
  const [frequency, setFrequency] = useState("4");

  const result = useMemo(() => {
    const p = Number(principal), annual = Number(rate), y = Number(years), n = Number(frequency);
    if (!Number.isFinite(p) || !Number.isFinite(annual) || !Number.isFinite(y) || !Number.isFinite(n) || p <= 0 || annual < 0 || y <= 0 || y > 100 || n <= 0) return null;
    const maturity = p * Math.pow(1 + annual / 100 / n, n * y);
    if (!Number.isFinite(maturity)) return null;
    return { interest: Math.max(0, maturity - p), maturity };
  }, [principal, rate, years, frequency]);

  const reset = () => { setPrincipal("100000"); setRate("7"); setYears("5"); setFrequency("4"); };
  const inputClass = `mt-2 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3.5 text-base font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef8d8] text-[#4e7417]" aria-hidden="true"><Banknote size={20} /></span>
            <div className="min-w-0"><p className="font-bold">Estimate your fixed-deposit maturity</p><p className="mt-1 text-sm text-black/50">Enter your deposit details to see interest earned and the maturity amount.</p></div>
          </div>
          <button onClick={reset} type="button" className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset fixed deposit calculator"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">Deposit amount (₹)</span><input aria-label="Deposit amount in rupees" value={principal} onChange={e => setPrincipal(e.target.value)} type="number" min="1" step="1000" inputMode="decimal" className={inputClass} /></label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">Interest rate (%/year)</span><input aria-label="Annual interest rate" value={rate} onChange={e => setRate(e.target.value)} type="number" min="0" max="100" step="0.01" inputMode="decimal" className={inputClass} /></label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">Tenure (years)</span><input aria-label="Deposit tenure in years" value={years} onChange={e => setYears(e.target.value)} type="number" min="0.01" max="100" step="0.25" inputMode="decimal" className={inputClass} /></label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">Compounding frequency</span><select aria-label="Compounding frequency" value={frequency} onChange={e => setFrequency(e.target.value)} className={inputClass}><option value="1">Yearly</option><option value="2">Half-yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option></select></label>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2" aria-label="Quick fixed deposit presets">
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Deposit amount</p><div className="mt-2 flex flex-wrap gap-2">{depositOptions.map(option => <button key={option} type="button" onClick={() => setPrincipal(String(option))} aria-pressed={principal === String(option)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${focusRing} ${principal === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{money.format(option)}</button>)}</div></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Tenure</p><div className="mt-2 flex flex-wrap gap-2">{tenureOptions.map(option => <button key={option} type="button" onClick={() => setYears(String(option))} aria-pressed={years === String(option)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${focusRing} ${years === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{option} {option === 1 ? "year" : "years"}</button>)}</div></div>
        </div>

        {result ? <div className="mt-7 grid gap-3 sm:grid-cols-2" aria-live="polite"><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Interest earned</p><p className="mt-2 text-2xl font-black tracking-tight">{money.format(result.interest)}</p></div><div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Maturity amount</p><p className="mt-2 text-3xl font-black tracking-tight">{money.format(result.maturity)}</p></div></div> : <p className="mt-6 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">Enter a positive deposit, a rate from 0% to 100%, and a tenure from 0.01 to 100 years.</p>}
        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Estimate only. Actual fixed-deposit maturity can vary by bank rules, compounding method, taxes and applicable rates.</p>
      </div>
    </div>
  );
}
