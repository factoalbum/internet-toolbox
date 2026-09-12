"use client";

import { ChartNoAxesCombined, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const investmentOptions = [1000, 5000, 10000, 25000];
const tenureOptions = [5, 10, 15, 20];
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

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
    if (!Number.isFinite(future)) return null;
    return { invested, returns: Math.max(0, future - invested), future };
  }, [monthly, rate, years]);

  const reset = () => { setMonthly("5000"); setRate("12"); setYears("10"); };
  const inputClass = `mt-2 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3.5 text-base font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef8d8] text-[#4e7417]" aria-hidden="true"><ChartNoAxesCombined size={20} /></span>
            <div className="min-w-0"><h2 className="font-bold">Estimate your SIP growth</h2><p className="mt-1 text-sm text-black/50">See how regular monthly investing could grow over your chosen period.</p></div>
          </div>
          <button onClick={reset} type="button" className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset SIP calculator"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">Monthly investment (₹)</span><input aria-label="Monthly investment in rupees" value={monthly} onChange={e => setMonthly(e.target.value)} type="number" min="1" step="100" inputMode="decimal" className={inputClass} /></label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">Expected return (%/year)</span><input aria-label="Expected annual return" value={rate} onChange={e => setRate(e.target.value)} type="number" min="0" max="100" step="0.1" inputMode="decimal" className={inputClass} /></label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">Investment period (years)</span><input aria-label="Investment period in years" value={years} onChange={e => setYears(e.target.value)} type="number" min="1" max="100" step="1" inputMode="numeric" className={inputClass} /></label>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2" aria-label="Quick SIP presets">
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Monthly investment</p><div className="mt-2 flex flex-wrap gap-2">{investmentOptions.map(option => <button key={option} type="button" onClick={() => setMonthly(String(option))} aria-pressed={monthly === String(option)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${focusRing} ${monthly === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{money.format(option)}</button>)}</div></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Investment period</p><div className="mt-2 flex flex-wrap gap-2">{tenureOptions.map(option => <button key={option} type="button" onClick={() => setYears(String(option))} aria-pressed={years === String(option)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${focusRing} ${years === option ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{option} years</button>)}</div></div>
        </div>

        {result ? <div className="mt-7 grid gap-3 sm:grid-cols-3" aria-live="polite"><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Invested</p><p className="mt-2 text-2xl font-black tracking-tight">{money.format(result.invested)}</p></div><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Est. returns</p><p className="mt-2 text-2xl font-black tracking-tight">{money.format(result.returns)}</p></div><div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Future value</p><p className="mt-2 text-3xl font-black tracking-tight">{money.format(result.future)}</p></div></div> : <p className="mt-6 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">Enter a positive monthly investment, a return from 0% to 100%, and a period from 1 to 100 years.</p>}
        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Estimate only. This illustration assumes monthly contributions and a constant monthly return based on the annual rate. Actual mutual fund returns are market-linked, vary over time and are not guaranteed. Taxes, fees and exit loads are not included.</p>
      </div>
    </div>
  );
}
