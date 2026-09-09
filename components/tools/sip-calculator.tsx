"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function SipCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const p = Number(monthly), annual = Number(rate), y = Number(years);
    if (!Number.isFinite(p) || !Number.isFinite(annual) || !Number.isFinite(y) || p <= 0 || annual < 0 || y <= 0 || y > 100) return null;
    const months = Math.round(y * 12), r = annual / 12 / 100;
    const invested = p * months;
    const future = r === 0 ? invested : p * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    return { invested, returns: future - invested, future };
  }, [monthly, rate, years]);

  const reset = () => { setMonthly("5000"); setRate("12"); setYears("10"); };

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div><p className="font-bold">Estimate SIP growth</p><p className="mt-1 text-sm text-black/50">See how regular monthly investing could grow over time.</p></div>
      <button type="button" onClick={reset} className="flex min-h-11 items-center gap-2 rounded-lg border border-[#d8d4c9] px-3 text-sm font-bold text-black/55 transition hover:bg-black/5 hover:text-black" aria-label="Reset SIP calculator"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
    </div>
    <div className="grid gap-5 md:grid-cols-3">
      <label className="block"><span className="text-sm font-semibold">Monthly investment (₹)</span><input value={monthly} onChange={e=>setMonthly(e.target.value)} type="number" min="0" step="100" inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" /></label>
      <label className="block"><span className="text-sm font-semibold">Expected return (%/year)</span><input value={rate} onChange={e=>setRate(e.target.value)} type="number" min="0" max="100" step="0.1" inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" /></label>
      <label className="block"><span className="text-sm font-semibold">Investment period (years)</span><input value={years} onChange={e=>setYears(e.target.value)} type="number" min="1" max="100" step="1" inputMode="numeric" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" /></label>
    </div>
    {result ? <div className="mt-7 grid gap-3 sm:grid-cols-3" aria-live="polite"><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Invested</p><p className="mt-2 text-2xl font-black">₹{money(result.invested)}</p></div><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Est. returns</p><p className="mt-2 text-2xl font-black">₹{money(result.returns)}</p></div><div className="border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Future value</p><p className="mt-2 text-2xl font-black">₹{money(result.future)}</p></div></div> : <p className="mt-6 text-sm text-black/50" role="alert">Enter a positive monthly investment, a return from 0% to 100%, and a period of 1-100 years.</p>}
    <p className="mt-5 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Estimate only. This illustration assumes monthly contributions and a constant monthly return based on the annual rate. Actual mutual fund returns are market-linked, vary over time and are not guaranteed. Taxes, fees and exit loads are not included.</p>
  </div>;
}
