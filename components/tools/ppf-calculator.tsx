"use client";

import { useMemo, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

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

  const reset = () => { setMonthly("12500"); setYears("15"); setRate("7.1"); };
  const inputClass = "mt-2 w-full rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] px-4 py-3 text-base outline-none focus:border-[#171717]";

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold" htmlFor="ppf-monthly">Monthly contribution</label>
            <input id="ppf-monthly" className={inputClass} type="number" min="0" max="12500" step="500" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="e.g. 12500" />
            <p className="mt-1 text-xs text-black/45">₹12,500/month reaches the ₹1.5 lakh annual contribution limit.</p>
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="ppf-years">Investment period (years)</label>
            <input id="ppf-years" className={inputClass} type="number" min="1" max="50" value={years} onChange={e => setYears(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="ppf-rate">Annual interest rate (%)</label>
            <input id="ppf-rate" className={inputClass} type="number" min="0" max="20" step="0.1" value={rate} onChange={e => setRate(e.target.value)} />
            <p className="mt-1 text-xs text-black/45">The current default is 7.1%; PPF rates are set by the government and can change.</p>
          </div>
          <button onClick={reset} className="min-h-11 rounded-lg border border-[#d8d4c9] px-4 text-sm font-semibold hover:bg-black/5">Reset</button>
        </div>

        <div className="space-y-4">
          <div className="border border-[#171717] bg-[#c8f169] p-5" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Estimated maturity</p>
            <p className="mt-2 text-3xl font-black tracking-tight">{inr.format(result.maturity)}</p>
            <p className="mt-1 text-sm text-black/60">After {result.term} years</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Total contribution</p><p className="mt-1 font-bold">{inr.format(result.invested)}</p></div>
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Estimated interest</p><p className="mt-1 font-bold">{inr.format(result.interest)}</p></div>
          </div>
        </div>
      </div>
      <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">Planning estimate only. PPF allows up to ₹1.5 lakh of deposits in a financial year and has a 15-year base maturity, with extension options. This calculator models regular monthly contributions with monthly compounding for simplicity; actual PPF interest is calculated under the scheme rules and credited annually. Interest rates can change, so verify the applicable rate before investing.</p>
    </div>
  );
}
