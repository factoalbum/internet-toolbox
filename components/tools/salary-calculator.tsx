"use client";

import { useMemo, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function slabTax(income: number) {
  const slabs = [
    [400000, 0], [800000, 0.05], [1200000, 0.1], [1600000, 0.15], [2000000, 0.2], [2400000, 0.25], [Infinity, 0.3],
  ] as const;
  let tax = 0;
  let previous = 0;
  for (const [limit, rate] of slabs) {
    if (income <= previous) break;
    tax += (Math.min(income, limit) - previous) * rate;
    previous = limit;
  }
  return income <= 1200000 ? 0 : tax;
}

function incomeTax(gross: number) {
  const taxable = Math.max(0, gross - 75000);
  const tax = slabTax(taxable);
  return { taxable, total: tax * 1.04 };
}

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState("1200000");
  const [basicPercent, setBasicPercent] = useState("50");
  const [professionalTax, setProfessionalTax] = useState("200");
  const [pfMode, setPfMode] = useState<"capped" | "full">("capped");

  const result = useMemo(() => {
    const annualCtc = Math.max(0, Number(ctc) || 0);
    const basic = annualCtc * (Math.min(100, Math.max(0, Number(basicPercent) || 0)) / 100);
    const pfWage = pfMode === "capped" ? Math.min(basic, 15000 * 12) : basic;
    const employerPf = pfWage * 0.12;
    const gratuity = basic * (15 / 26 / 12);
    const gross = Math.max(0, annualCtc - employerPf - gratuity);
    const employeePf = pfWage * 0.12;
    const tax = incomeTax(gross);
    const pt = Math.max(0, Number(professionalTax) || 0) * 12;
    const annualTakeHome = Math.max(0, gross - employeePf - pt - tax.total);
    return { annualCtc, basic, employerPf, gratuity, gross, employeePf, pt, tax, annualTakeHome, monthlyTakeHome: annualTakeHome / 12 };
  }, [ctc, basicPercent, professionalTax, pfMode]);

  const inputClass = "mt-2 w-full rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] px-4 py-3 text-base outline-none focus:border-[#171717]";
  const reset = () => { setCtc("1200000"); setBasicPercent("50"); setProfessionalTax("200"); setPfMode("capped"); };

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold" htmlFor="salary-ctc">Annual CTC</label>
            <input id="salary-ctc" className={inputClass} type="number" min="0" value={ctc} onChange={e => setCtc(e.target.value)} placeholder="e.g. 1200000" />
            <p className="mt-1 text-xs text-black/45">Cost to Company — include employer-side benefits that are part of your package.</p>
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="salary-basic">Basic salary (% of CTC)</label>
            <input id="salary-basic" className={inputClass} type="number" min="0" max="100" value={basicPercent} onChange={e => setBasicPercent(e.target.value)} />
          </div>
          <fieldset>
            <legend className="text-sm font-semibold">PF contribution basis</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] p-3 text-sm">
                <input className="mt-1 size-4 accent-[#171717]" type="radio" name="pf-mode" checked={pfMode === "capped"} onChange={() => setPfMode("capped")} />
                <span><strong className="block">Capped at ₹15,000/month</strong><span className="text-xs text-black/50">Common simplified estimate</span></span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] p-3 text-sm">
                <input className="mt-1 size-4 accent-[#171717]" type="radio" name="pf-mode" checked={pfMode === "full"} onChange={() => setPfMode("full")} />
                <span><strong className="block">Full basic salary</strong><span className="text-xs text-black/50">For employers calculating PF on full basic</span></span>
              </label>
            </div>
          </fieldset>
          <div>
            <label className="text-sm font-semibold" htmlFor="salary-pt">Professional tax per month</label>
            <input id="salary-pt" className={inputClass} type="number" min="0" value={professionalTax} onChange={e => setProfessionalTax(e.target.value)} />
            <p className="mt-1 text-xs text-black/45">Enter the amount shown on your payslip. Set to 0 if it does not apply.</p>
          </div>
          <button onClick={reset} className="min-h-11 rounded-lg border border-[#d8d4c9] px-4 text-sm font-semibold hover:bg-black/5">Reset</button>
        </div>

        <div className="space-y-4">
          <div className="border border-[#171717] bg-[#f3f0e8] p-5" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Estimated monthly in-hand</p>
            <p className="mt-2 text-3xl font-black tracking-tight">{inr.format(result.monthlyTakeHome)}</p>
            <p className="mt-1 text-sm text-black/50">Annual take-home: {inr.format(result.annualTakeHome)}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Gross salary</p><p className="mt-1 font-bold">{inr.format(result.gross)}</p></div>
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Income tax + cess</p><p className="mt-1 font-bold">{inr.format(result.tax.total)}</p></div>
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Employee PF</p><p className="mt-1 font-bold">{inr.format(result.employeePf)}</p></div>
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Employer PF + gratuity</p><p className="mt-1 font-bold">{inr.format(result.employerPf + result.gratuity)}</p></div>
          </div>
        </div>
      </div>
      <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">Estimate for FY 2026–27 using a simplified salary structure. PF is estimated at 12% of the selected PF wage basis; gratuity provision uses 15 days of wages for each completed year (annualised here as 15/26/12 of basic). Actual payroll can differ based on your employer’s PF arrangement, wage definition, benefits, bonus, professional tax and other deductions. This is not a payslip or tax-filing calculation.</p>
    </div>
  );
}
