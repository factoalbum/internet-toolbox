"use client";

import { Landmark, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const contributionPresets = [5000, 7500, 10000, 12500];

const inputClass = "mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-base font-semibold text-[#171717] outline-none transition hover:border-black/30 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] focus:ring-offset-1";
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function PpfCalculator() {
  const [monthly, setMonthly] = useState("12500");
  const [years, setYears] = useState("15");
  const [rate, setRate] = useState("7.1");

  const result = useMemo(() => {
    const contribution = Math.min(150000, Math.max(0, Number(monthly) || 0) * 12);
    const annualRate = Math.max(0, Number(rate) || 0) / 100;
    const term = Math.min(50, Math.max(1, Math.floor(Number(years) || 1)));
    let balance = 0;
    let invested = 0;

    for (let year = 0; year < term; year += 1) {
      const monthlyContribution = contribution / 12;
      for (let month = 0; month < 12; month += 1) {
        balance += monthlyContribution;
        invested += monthlyContribution;
        balance *= 1 + annualRate / 12;
      }
    }

    return { invested, interest: Math.max(0, balance - invested), maturity: balance, term };
  }, [monthly, years, rate]);

  const monthlyValue = Number(monthly);
  const yearsValue = Number(years);
  const rateValue = Number(rate);
  const invalidMonthly = !Number.isFinite(monthlyValue) || monthlyValue < 0 || monthlyValue > 12500;
  const invalidYears = !Number.isFinite(yearsValue) || yearsValue < 1 || yearsValue > 50 || !Number.isInteger(yearsValue);
  const invalidRate = !Number.isFinite(rateValue) || rateValue < 0 || rateValue > 20;
  const hasInvalidInput = invalidMonthly || invalidYears || invalidRate;

  const reset = () => {
    setMonthly("12500");
    setYears("15");
    setRate("7.1");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true">
              <Landmark size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-[#65748d]">Money utility</p>
              <h2 className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717]">Plan your PPF estimate</h2>
              <p className="mt-1 text-sm leading-5 text-black/50">Estimate how regular contributions could grow over time.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset PPF calculator">
            <RotateCcw size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <section aria-labelledby="ppf-inputs-heading">
          <div className="mb-4">
            <p className="text-[11px] font-black uppercase tracking-[.14em] text-[#6d8e25]">1. Investment details</p>
            <h3 id="ppf-inputs-heading" className="mt-1 text-base font-black text-[#171717]">Set your contribution and assumptions</h3>
            <p className="mt-1 text-xs leading-5 text-black/45">Monthly contribution can be up to ₹12,500, equivalent to the ₹1.5 lakh annual PPF deposit limit.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className={`block min-w-0 rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)] ${invalidMonthly ? "border-[#c77a6b]" : "border-[#e2dfd7]"}`}>
              <span className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>Monthly contribution</span>
                <span className="text-xs font-semibold text-black/40">INR</span>
              </span>
              <span className="mt-1 block text-xs leading-5 text-black/45">Amount you plan to add each month.</span>
              <input id="ppf-monthly" aria-label="Monthly contribution in rupees" aria-invalid={invalidMonthly} aria-describedby="ppf-monthly-help" className={inputClass} type="number" min="0" max="12500" step="500" inputMode="numeric" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="12,500" />
              <p id="ppf-monthly-help" className={`mt-2 text-xs ${invalidMonthly ? "font-semibold text-[#8a4639]" : "text-black/40"}`}>{invalidMonthly ? "Enter an amount from ₹0 to ₹12,500 per month." : "Maximum supported for this estimate: ₹12,500/month."}</p>
            </label>

            <label className={`block min-w-0 rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)] ${invalidYears ? "border-[#c77a6b]" : "border-[#e2dfd7]"}`}>
              <span className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>Investment period</span>
                <span className="text-xs font-semibold text-black/40">years</span>
              </span>
              <span className="mt-1 block text-xs leading-5 text-black/45">Choose how long to model the investment.</span>
              <input id="ppf-years" aria-label="Investment period in years" aria-invalid={invalidYears} aria-describedby="ppf-years-help" className={inputClass} type="number" min="1" max="50" step="1" inputMode="numeric" value={years} onChange={e => setYears(e.target.value)} />
              <p id="ppf-years-help" className={`mt-2 text-xs ${invalidYears ? "font-semibold text-[#8a4639]" : "text-black/40"}`}>{invalidYears ? "Enter a whole number from 1 to 50 years." : "The standard PPF maturity period is 15 years."}</p>
            </label>

            <label className={`block min-w-0 rounded-2xl border bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)] ${invalidRate ? "border-[#c77a6b]" : "border-[#e2dfd7]"}`}>
              <span className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>Annual interest rate</span>
                <span className="text-xs font-semibold text-black/40">%</span>
              </span>
              <span className="mt-1 block text-xs leading-5 text-black/45">Change this if the applicable rate changes.</span>
              <input id="ppf-rate" aria-label="Annual interest rate percentage" aria-invalid={invalidRate} aria-describedby="ppf-rate-help" className={inputClass} type="number" min="0" max="20" step="0.1" inputMode="decimal" value={rate} onChange={e => setRate(e.target.value)} />
              <p id="ppf-rate-help" className={`mt-2 text-xs ${invalidRate ? "font-semibold text-[#8a4639]" : "text-black/40"}`}>{invalidRate ? "Enter a rate from 0% to 20%." : "Default rate: 7.1%. Verify the applicable rate before investing."}</p>
            </label>
          </div>

          <div className="mt-4 rounded-2xl border border-[#e2dfd7] bg-[#f4f1e9] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/45">Quick contribution</p>
              <p className="text-xs text-black/40">Tap to use</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick monthly contribution presets">
              {contributionPresets.map((value) => (
                <button key={value} type="button" aria-pressed={monthly === String(value)} onClick={() => setMonthly(String(value))} className={`min-h-11 rounded-full border px-4 text-sm font-bold transition ${focusRing} ${monthly === String(value) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d0ccc2] bg-white text-black/60 hover:border-[#171717] hover:text-black"}`}>
                  {inr.format(value)}
                </button>
              ))}
            </div>
          </div>

          {hasInvalidInput && <p className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm font-semibold leading-6 text-[#7b3d31]" role="alert">Fix the highlighted values to keep the estimate within the supported range.</p>}
        </section>

        <section className="mt-7" aria-labelledby="ppf-result-heading" aria-live="polite" aria-atomic="true">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-[#6d8e25]">2. Your result</p>
              <h3 id="ppf-result-heading" className="mt-1 text-base font-black text-[#171717]">Estimated maturity value</h3>
            </div>
            <span className="text-xs font-semibold text-black/40">{result.term} years</span>
          </div>

          <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-6">
            <p className="text-[11px] font-black uppercase tracking-[.15em] text-black/55">Projected balance</p>
            <p className="mt-2 break-words text-3xl font-black tracking-[-.035em] sm:text-4xl">{inr.format(result.maturity)}</p>
            <p className="mt-2 text-xs font-medium text-black/55">After {result.term} years, based on the inputs above.</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4">
              <p className="text-xs font-semibold text-black/45">Total contribution</p>
              <p className="mt-1 break-words text-xl font-black">{inr.format(result.invested)}</p>
            </div>
            <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4">
              <p className="text-xs font-semibold text-black/45">Estimated interest</p>
              <p className="mt-1 break-words text-xl font-black">{inr.format(result.interest)}</p>
            </div>
          </div>
        </section>

        <div className="mt-7 rounded-2xl border border-[#e2dfd7] bg-white p-5">
          <p className="text-[11px] font-black uppercase tracking-[.15em] text-black/40">Quick context</p>
          <div className="mt-3 grid gap-3 text-sm leading-6 text-black/60 sm:grid-cols-2">
            <p><span className="font-bold text-black">Annual contribution:</span> capped at ₹1.5 lakh in this estimate.</p>
            <p><span className="font-bold text-black">Default rate:</span> 7.1%, which you can adjust when the applicable rate changes.</p>
          </div>
        </div>

        <p className="mt-7 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">Planning estimate only. PPF allows up to ₹1.5 lakh of deposits in a financial year and has a 15-year base maturity, with extension options. This calculator models regular monthly contributions with monthly compounding for simplicity; actual PPF interest is calculated under the scheme rules and credited annually. Interest rates can change, so verify the applicable rate before investing.</p>
      </div>
    </div>
  );
}
