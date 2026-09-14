"use client";

import { Banknote, RotateCcw } from "lucide-react";
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
  return tax;
}

function incomeTax(gross: number) {
  const taxable = Math.max(0, gross - 75000);
  let tax = slabTax(taxable);

  // Section 87A rebate up to ₹12 lakh taxable income. Above ₹12 lakh,
  // marginal relief limits tax before cess to the income above ₹12 lakh.
  if (taxable <= 1200000) {
    tax = 0;
  } else {
    tax = Math.min(tax, taxable - 1200000);
  }

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

  const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";
  const inputClass = `mt-2 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-base font-semibold text-[#171717] outline-none transition hover:border-black/30 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`;
  const reset = () => { setCtc("1200000"); setBasicPercent("50"); setProfessionalTax("200"); setPfMode("capped"); };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3c9] text-[#58751d]" aria-hidden="true"><Banknote size={21} /></span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#6d8e25]">Money utility</p>
              <h2 className="mt-1 text-lg font-black tracking-[-.025em]">Estimate your take-home salary</h2>
              <p className="mt-1 max-w-xl text-sm leading-5 text-black/50">Enter your CTC and a few salary details to estimate your monthly in-hand pay.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset salary calculator">
            <RotateCcw size={15} aria-hidden="true" /><span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
              <label className="block text-sm font-black" htmlFor="salary-ctc">Annual CTC</label>
              <p className="mt-1 text-xs leading-5 text-black/45">Your total Cost to Company for the year.</p>
              <input id="salary-ctc" className={inputClass} type="number" min="0" step="10000" inputMode="decimal" value={ctc} onChange={e => setCtc(e.target.value)} placeholder="e.g. 1200000" aria-describedby="salary-ctc-help" />
              <p id="salary-ctc-help" className="mt-2 text-xs text-black/40">Include employer-side benefits that are part of your package.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
                <label className="block text-sm font-black" htmlFor="salary-basic">Basic salary</label>
                <p className="mt-1 text-xs leading-5 text-black/45">Basic as a percentage of CTC.</p>
                <div className="relative"><input id="salary-basic" className={`${inputClass} pr-11`} type="number" min="0" max="100" step="1" inputMode="numeric" value={basicPercent} onChange={e => setBasicPercent(e.target.value)} aria-describedby="salary-basic-help" /><span className="pointer-events-none absolute right-4 top-[25px] text-sm font-bold text-black/40">%</span></div>
                <p id="salary-basic-help" className="mt-2 text-xs text-black/40">Common example: 50%.</p>
              </div>
              <div className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
                <label className="block text-sm font-black" htmlFor="salary-pt">Professional tax</label>
                <p className="mt-1 text-xs leading-5 text-black/45">Tax deducted each month.</p>
                <div className="relative"><input id="salary-pt" className={`${inputClass} pl-9`} type="number" min="0" step="50" inputMode="decimal" value={professionalTax} onChange={e => setProfessionalTax(e.target.value)} aria-describedby="salary-pt-help" /><span className="pointer-events-none absolute left-4 top-[25px] text-sm font-bold text-black/40">₹</span></div>
                <p id="salary-pt-help" className="mt-2 text-xs text-black/40">Use the amount on your payslip.</p>
              </div>
            </div>

            <fieldset className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
              <legend className="text-sm font-black">PF contribution basis</legend>
              <p className="mt-1 text-xs leading-5 text-black/45">Choose how your employer calculates provident fund.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${pfMode === "capped" ? "border-[#171717] bg-[#f3f8e7]" : "border-[#d8d4c9] bg-[#faf9f6] hover:bg-white"}`}>
                  <input className="mt-1 size-4 accent-[#171717]" type="radio" name="pf-mode" checked={pfMode === "capped"} onChange={() => setPfMode("capped")} />
                  <span><strong className="block">Capped at ₹15,000/month</strong><span className="text-xs text-black/50">Common simplified estimate.</span></span>
                </label>
                <label className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${pfMode === "full" ? "border-[#171717] bg-[#f3f8e7]" : "border-[#d8d4c9] bg-[#faf9f6] hover:bg-white"}`}>
                  <input className="mt-1 size-4 accent-[#171717]" type="radio" name="pf-mode" checked={pfMode === "full"} onChange={() => setPfMode("full")} />
                  <span><strong className="block">Full basic salary</strong><span className="text-xs text-black/50">For PF calculated on full basic.</span></span>
                </label>
              </div>
            </fieldset>
          </div>

          <div className="min-w-0 rounded-2xl border border-[#e2dfd7] bg-white p-4 md:p-5">
            <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5" aria-live="polite" aria-atomic="true">
              <p className="text-[10px] font-black uppercase tracking-[.15em] text-black/55">Estimated monthly in-hand</p>
              <p className="mt-2 break-words text-3xl font-black tracking-[-.035em] sm:text-4xl">{inr.format(result.monthlyTakeHome)}</p>
              <p className="mt-2 text-sm font-medium text-black/55">Annual take-home: {inr.format(result.annualTakeHome)}</p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Gross salary", result.gross],
                ["Income tax + cess", result.tax.total],
                ["Employee PF", result.employeePf],
                ["Employer PF + gratuity", result.employerPf + result.gratuity],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-xl border border-[#d8d4c9] bg-[#f4f1e9] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/40">{label}</p>
                  <p className="mt-2 break-words text-lg font-black tracking-[-.02em]">{inr.format(value as number)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-[#e2dfd7] bg-[#faf9f6] p-4">
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Estimate based on</p>
              <div className="mt-3 grid gap-2 text-sm text-black/55 sm:grid-cols-2">
                <p><span className="font-bold text-black/70">Basic:</span> {inr.format(result.basic)}/year</p>
                <p><span className="font-bold text-black/70">Taxable:</span> {inr.format(result.tax.taxable)}</p>
                <p><span className="font-bold text-black/70">PF:</span> {inr.format(result.employeePf)}/year</p>
                <p><span className="font-bold text-black/70">Prof. tax:</span> {inr.format(result.pt)}/year</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Estimate for FY 2026-27 using a simplified salary structure. PF is estimated at 12% of the selected PF wage basis; gratuity provision uses 15 days of wages for each completed year (annualised here as 15/26/12 of basic). Income tax uses the new-regime ₹75,000 standard deduction, ₹60,000 Section 87A rebate up to ₹12 lakh taxable income, and marginal relief just above that threshold. Actual payroll can differ based on your employer’s PF arrangement, wage definition, benefits, bonus, professional tax and other deductions. This is not a payslip or tax-filing calculation.</p>
      </div>
    </div>
  );
}
