"use client";

import { ChartNoAxesCombined, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const investmentOptions = [1000, 5000, 10000, 25000];
const tenureOptions = [5, 10, 15, 20];
const MAX_MONTHLY = 10_000_000;
const MIN_YEARS = 1 / 12;
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function SipCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const monthlyInvalid = !monthly.trim() || !Number.isFinite(Number(monthly)) || Number(monthly) <= 0 || Number(monthly) > MAX_MONTHLY;
  const rateInvalid = !rate.trim() || !Number.isFinite(Number(rate)) || Number(rate) < 0 || Number(rate) > 100;
  const yearsInvalid = !years.trim() || !Number.isFinite(Number(years)) || Number(years) < MIN_YEARS || Number(years) > 100;

  const result = useMemo(() => {
    const p = Number(monthly), annual = Number(rate), y = Number(years);
    if (monthlyInvalid || rateInvalid || yearsInvalid) return null;
    const months = Math.max(1, Math.round(y * 12)), r = annual / 12 / 100;
    const invested = p * months;
    const future = r === 0 ? invested : p * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    if (!Number.isFinite(invested) || !Number.isFinite(future)) return null;
    return { invested, returns: Math.max(0, future - invested), future };
  }, [monthly, rate, years, monthlyInvalid, rateInvalid, yearsInvalid]);

  const reset = () => { setMonthly("5000"); setRate("12"); setYears("10"); };
  const inputClass = (invalid: boolean) => `mt-2 min-h-12 w-full rounded-xl border bg-white px-3.5 text-base font-semibold outline-none transition ${invalid ? "border-[#c77a6b] focus:border-[#9b4c3e] focus:ring-[#f1c7c0]" : "border-[#bcb8ae] focus:border-[#171717] focus:ring-[#c8f169]"} ${focusRing}`;

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
        <section aria-labelledby="sip-inputs-heading">
          <div className="mb-4"><p className="text-[11px] font-black uppercase tracking-[.15em] text-black/40">Investment details</p><h3 id="sip-inputs-heading" className="mt-1 text-sm font-bold">Set your monthly plan</h3><p className="mt-1 text-xs leading-5 text-black/45">Use a monthly amount, an expected annual return and an investment period.</p></div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4" htmlFor="sip-monthly"><span className="text-sm font-semibold">Monthly investment (₹)</span><span className="mt-1 block text-xs leading-5 text-black/40">Up to ₹1 crore per month for this estimate.</span><input id="sip-monthly" aria-label="Monthly investment in rupees" aria-invalid={monthlyInvalid} aria-describedby={monthlyInvalid ? "sip-monthly-error" : undefined} value={monthly} onChange={e => setMonthly(e.target.value)} type="number" min="1" max={MAX_MONTHLY} step="100" inputMode="decimal" className={inputClass(monthlyInvalid)} />{monthlyInvalid && <span id="sip-monthly-error" className="mt-2 block text-xs font-semibold text-[#9b4c3e]">Enter an amount from ₹1 to ₹1 crore.</span>}</label>
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4" htmlFor="sip-rate"><span className="text-sm font-semibold">Expected return (%/year)</span><span className="mt-1 block text-xs leading-5 text-black/40">Illustrative annual return, not guaranteed.</span><input id="sip-rate" aria-label="Expected annual return" aria-invalid={rateInvalid} aria-describedby={rateInvalid ? "sip-rate-error" : undefined} value={rate} onChange={e => setRate(e.target.value)} type="number" min="0" max="100" step="0.1" inputMode="decimal" className={inputClass(rateInvalid)} />{rateInvalid && <span id="sip-rate-error" className="mt-2 block text-xs font-semibold text-[#9b4c3e]">Enter an expected return from 0% to 100%.</span>}</label>
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4" htmlFor="sip-years"><span className="text-sm font-semibold">Investment period (years)</span><span className="mt-1 block text-xs leading-5 text-black/40">Minimum 1 month, up to 100 years. Periods are converted to whole months.</span><input id="sip-years" aria-label="Investment period in years" aria-invalid={yearsInvalid} aria-describedby={yearsInvalid ? "sip-years-error" : undefined} value={years} onChange={e => setYears(e.target.value)} type="number" min={MIN_YEARS} max="100" step="0.01" inputMode="decimal" className={inputClass(yearsInvalid)} />{yearsInvalid && <span id="sip-years-error" className="mt-2 block text-xs font-semibold text-[#9b4c3e]">Enter an investment period from 1 month to 100 years.</span>}</label>
          </div>
        </section>

        <div className="mt-6 grid gap-5 sm:grid-cols-2" aria-label="Quick SIP presets">
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Monthly investment</p><div className="mt-2 flex flex-wrap gap-2">{investmentOptions.map(option => <button key={option} type="button" onClick={() => setMonthly(String(option))} aria-pressed={monthly === String(option)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${focusRing} ${monthly === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{money.format(option)}</button>)}</div></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Investment period</p><div className="mt-2 flex flex-wrap gap-2">{tenureOptions.map(option => <button key={option} type="button" onClick={() => setYears(String(option))} aria-pressed={years === String(option)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${focusRing} ${years === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{option} years</button>)}</div></div>
        </div>

        {result ? <section className="mt-7" aria-labelledby="sip-result-heading" aria-live="polite" aria-atomic="true"><div className="mb-3"><p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">Your estimate</p><h3 id="sip-result-heading" className="mt-1 text-sm font-bold">Projected value after {years} years</h3></div><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Invested</p><p className="mt-2 break-words text-2xl font-black tracking-tight">{money.format(result.invested)}</p></div><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Est. returns</p><p className="mt-2 break-words text-2xl font-black tracking-tight">{money.format(result.returns)}</p></div><div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Future value</p><p className="mt-2 break-words text-3xl font-black tracking-tight">{money.format(result.future)}</p></div></div></section> : <p className="mt-6 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">Check the investment details above. Enter a valid monthly investment, expected return and investment period to see the estimate.</p>}
        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Estimate only. This illustration assumes monthly contributions at the start of each month and a constant monthly return based on the annual rate. Actual mutual fund returns are market-linked, vary over time and are not guaranteed. Taxes, fees and exit loads are not included.</p>
      </div>
    </div>
  );
}
