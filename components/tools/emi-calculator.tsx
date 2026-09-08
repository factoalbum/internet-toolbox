"use client";

import { useMemo, useState } from "react";

function money(value: number) {
  return value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const p = Number(principal), annual = Number(rate), n = Number(years) * 12;
    if (!Number.isFinite(p) || !Number.isFinite(annual) || !Number.isFinite(n) || p <= 0 || annual < 0 || n <= 0) return null;
    const r = annual / 12 / 100;
    const emi = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return { emi, interest: emi * n - p, total: emi * n };
  }, [principal, rate, years]);

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="grid gap-5 md:grid-cols-3">
      <label className="block"><span className="text-sm font-semibold">Loan amount (₹)</span><input value={principal} onChange={e=>setPrincipal(e.target.value)} type="number" min="0" inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717]" /></label>
      <label className="block"><span className="text-sm font-semibold">Interest rate (%/year)</span><input value={rate} onChange={e=>setRate(e.target.value)} type="number" min="0" step="0.01" inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717]" /></label>
      <label className="block"><span className="text-sm font-semibold">Loan tenure (years)</span><input value={years} onChange={e=>setYears(e.target.value)} type="number" min="1" step="1" inputMode="numeric" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717]" /></label>
    </div>
    {result ? <div className="mt-7 grid gap-3 sm:grid-cols-3"><div className="border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Monthly EMI</p><p className="mt-2 text-3xl font-black">₹{money(result.emi)}</p></div><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Total interest</p><p className="mt-2 text-2xl font-black">₹{money(result.interest)}</p></div><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Total payment</p><p className="mt-2 text-2xl font-black">₹{money(result.total)}</p></div></div> : <p className="mt-6 text-sm text-black/50">Enter valid loan details to calculate your EMI.</p>}
    <p className="mt-5 text-xs leading-5 text-black/45">Estimate only. Actual loan payments can vary by lender, fees, taxes and repayment terms.</p>
  </div>;
}
