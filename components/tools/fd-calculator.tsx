"use client";

import { useMemo, useState } from "react";

const money = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function FdCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");
  const [frequency, setFrequency] = useState("4");

  const result = useMemo(() => {
    const p = Number(principal), annual = Number(rate), y = Number(years), n = Number(frequency);
    if (!Number.isFinite(p) || !Number.isFinite(annual) || !Number.isFinite(y) || !Number.isFinite(n) || p <= 0 || annual < 0 || y <= 0 || n <= 0) return null;
    const maturity = p * Math.pow(1 + annual / 100 / n, n * y);
    return { interest: maturity - p, maturity };
  }, [principal, rate, years, frequency]);

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block"><span className="text-sm font-semibold">Deposit amount (₹)</span><input value={principal} onChange={e => setPrincipal(e.target.value)} type="number" min="0" inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" /></label>
        <label className="block"><span className="text-sm font-semibold">Interest rate (%/year)</span><input value={rate} onChange={e => setRate(e.target.value)} type="number" min="0" step="0.01" inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" /></label>
        <label className="block"><span className="text-sm font-semibold">Tenure (years)</span><input value={years} onChange={e => setYears(e.target.value)} type="number" min="0.01" step="0.25" inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" /></label>
        <label className="block"><span className="text-sm font-semibold">Compounding</span><select value={frequency} onChange={e => setFrequency(e.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]"><option value="1">Yearly</option><option value="2">Half-yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option></select></label>
      </div>
      {result ? <div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Interest earned</p><p className="mt-2 text-2xl font-black">₹{money(result.interest)}</p></div><div className="border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Maturity amount</p><p className="mt-2 text-3xl font-black">₹{money(result.maturity)}</p></div></div> : <p className="mt-6 text-sm text-black/50">Enter valid deposit details to see an estimate.</p>}
      <p className="mt-5 text-xs leading-5 text-black/45">Estimate only. Actual fixed-deposit maturity can vary by bank rules, compounding method, taxes and applicable rates.</p>
    </div>
  );
}
