"use client";

import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const p = Number(principal), annual = Number(rate), n = Number(years) * 12;
    if (!Number.isFinite(p) || !Number.isFinite(annual) || !Number.isFinite(n) || p <= 0 || annual < 0 || n <= 0) return null;
    const r = annual / 12 / 100;
    const emi = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return { emi, interest: Math.max(0, emi * n - p), total: emi * n };
  }, [principal, rate, years]);

  const reset = () => { setPrincipal("1000000"); setRate("8.5"); setYears("5"); };
  const inputClass = "mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717]";

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="grid gap-5 md:grid-cols-3">
      <label className="block"><span className="text-sm font-semibold">Loan amount (₹)</span><input aria-label="Loan amount in rupees" value={principal} onChange={e=>setPrincipal(e.target.value)} type="number" min="1" inputMode="decimal" className={inputClass} /></label>
      <label className="block"><span className="text-sm font-semibold">Interest rate (%/year)</span><input aria-label="Annual interest rate" value={rate} onChange={e=>setRate(e.target.value)} type="number" min="0" max="100" step="0.01" inputMode="decimal" className={inputClass} /></label>
      <label className="block"><span className="text-sm font-semibold">Loan tenure (years)</span><input aria-label="Loan tenure in years" value={years} onChange={e=>setYears(e.target.value)} type="number" min="1" max="100" step="1" inputMode="numeric" className={inputClass} /></label>
    </div>
    {result ? <div className="mt-7 grid gap-3 sm:grid-cols-3" aria-live="polite"><div className="border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Monthly EMI</p><p className="mt-2 text-3xl font-black">{money.format(result.emi)}</p></div><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Total interest</p><p className="mt-2 text-2xl font-black">{money.format(result.interest)}</p></div><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Total payment</p><p className="mt-2 text-2xl font-black">{money.format(result.total)}</p></div></div> : <p className="mt-6 text-sm text-black/50" role="alert">Enter a loan amount above 0, a valid interest rate, and a tenure of at least 1 year.</p>}
    <div className="mt-5 flex flex-wrap items-center gap-3"><button onClick={reset} type="button" className="min-h-11 rounded-lg border border-[#d8d4c9] px-4 text-sm font-semibold hover:bg-black/5">Reset</button><p className="text-xs leading-5 text-black/45">Calculated using monthly reducing-balance interest. Estimate only; lender fees, taxes, insurance and repayment rules can change your actual payment.</p></div>
  </div>;
}
