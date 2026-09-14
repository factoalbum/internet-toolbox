"use client";

import { Banknote, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const loanOptions = [500000, 1000000, 2000000, 5000000];
const tenureOptions = [5, 10, 15, 20];
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const p = Number(principal), annual = Number(rate), n = Number(years) * 12;
    if (!Number.isFinite(p) || !Number.isFinite(annual) || !Number.isFinite(n) || p <= 0 || annual < 0 || n <= 0 || n > 1200) return null;
    const r = annual / 12 / 100;
    const emi = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return { emi, interest: Math.max(0, emi * n - p), total: emi * n };
  }, [principal, rate, years]);

  const reset = () => { setPrincipal("1000000"); setRate("8.5"); setYears("5"); };
  const inputClass = `mt-2 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3.5 text-base font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`;
  const invalidPrincipal = Number(principal) <= 0 || !Number.isFinite(Number(principal));
  const invalidRate = Number(rate) < 0 || !Number.isFinite(Number(rate));
  const invalidYears = Number(years) < 1 || Number(years) > 100 || !Number.isFinite(Number(years));

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="emi-calculator-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#eef8d8] text-[#4e7417]" aria-hidden="true"><Banknote size={20} /></span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.14em] text-[#5f7f20]">Finance utility</p>
              <h2 id="emi-calculator-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] md:text-2xl">Estimate your monthly EMI</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/50">Enter the loan details to see the monthly payment and total interest.</p>
            </div>
          </div>
          <button onClick={reset} type="button" className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset EMI calculator"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </header>

      <div className="p-5 md:p-7">
        <section aria-labelledby="emi-details-heading">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Loan details</p>
            <h3 id="emi-details-heading" className="mt-1 text-base font-black text-[#171717]">What are you borrowing?</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className={`block rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.3)] ${invalidPrincipal ? "border-[#c46b5c]" : "border-[#e2dfd7]"}`}>
              <span className="text-sm font-semibold">Loan amount (₹)</span>
              <input id="emi-principal" aria-label="Loan amount in rupees" aria-invalid={invalidPrincipal} value={principal} onChange={e=>setPrincipal(e.target.value)} type="number" min="1" max="1000000000" step="1000" inputMode="decimal" className={inputClass} />
            </label>
            <label className={`block rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.3)] ${invalidRate ? "border-[#c46b5c]" : "border-[#e2dfd7]"}`}>
              <span className="text-sm font-semibold">Interest rate (%/year)</span>
              <input id="emi-rate" aria-label="Annual interest rate" aria-invalid={invalidRate} value={rate} onChange={e=>setRate(e.target.value)} type="number" min="0" max="100" step="0.01" inputMode="decimal" className={inputClass} />
            </label>
            <label className={`block rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.3)] ${invalidYears ? "border-[#c46b5c]" : "border-[#e2dfd7]"}`}>
              <span className="text-sm font-semibold">Loan tenure (years)</span>
              <input id="emi-years" aria-label="Loan tenure in years" aria-invalid={invalidYears} value={years} onChange={e=>setYears(e.target.value)} type="number" min="1" max="100" step="1" inputMode="numeric" className={inputClass} />
            </label>
          </div>
        </section>

        <section className="mt-7" aria-labelledby="emi-presets-heading">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p id="emi-presets-heading" className="text-xs font-black uppercase tracking-[.12em] text-black/40">Quick loan amount</p>
              <p className="mt-1 text-xs leading-5 text-black/40">Start with a common amount, then adjust it above.</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Quick loan amount presets">{loanOptions.map(option => <button key={option} type="button" onClick={() => setPrincipal(String(option))} aria-pressed={principal === String(option)} className={`min-h-11 rounded-full border px-3.5 text-sm font-semibold transition ${focusRing} ${principal === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{money.format(option)}</button>)}</div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Quick tenure</p>
              <p className="mt-1 text-xs leading-5 text-black/40">Pick a common repayment period.</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Quick loan tenure presets">{tenureOptions.map(option => <button key={option} type="button" onClick={() => setYears(String(option))} aria-pressed={years === option.toString()} className={`min-h-11 rounded-full border px-3.5 text-sm font-semibold transition ${focusRing} ${years === option.toString() ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{option} years</button>)}</div>
            </div>
          </div>
        </section>

        <section className="mt-7" aria-labelledby="emi-results-heading" aria-live="polite" aria-atomic="true">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">2. Your estimate</p>
              <h3 id="emi-results-heading" className="mt-1 text-base font-black text-[#171717]">What you may pay</h3>
            </div>
            <span className="text-xs font-semibold text-black/40">Monthly reducing balance</span>
          </div>

          {result ? <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Monthly EMI</p><p className="mt-2 break-words text-3xl font-black tracking-tight">{money.format(result.emi)}</p><p className="mt-1 text-xs text-black/55">Estimated monthly payment</p></div><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Total interest</p><p className="mt-2 break-words text-2xl font-black tracking-tight">{money.format(result.interest)}</p><p className="mt-1 text-xs text-black/40">Interest over the full tenure</p></div><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Total payment</p><p className="mt-2 break-words text-2xl font-black tracking-tight">{money.format(result.total)}</p><p className="mt-1 text-xs text-black/40">Principal + interest</p></div></div> : <p className="rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">Enter a loan amount above 0, a valid interest rate, and a tenure from 1 to 100 years.</p>}
        </section>

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Calculated using monthly reducing-balance interest. Estimate only. Lender fees, taxes, insurance, prepayments and repayment rules can change your actual payment.</p>
      </div>
    </div>
  );
}
