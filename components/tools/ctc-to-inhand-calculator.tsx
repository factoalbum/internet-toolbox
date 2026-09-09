"use client";

import { useMemo, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

type Regime = "new" | "old";

function slabTax(income: number, slabs: { limit: number; rate: number }[]) {
  let tax = 0;
  let previous = 0;
  for (const slab of slabs) {
    if (income <= previous) break;
    tax += (Math.min(income, slab.limit) - previous) * slab.rate;
    previous = slab.limit;
    if (income <= slab.limit) break;
  }
  return tax;
}

function incomeTax(grossSalary: number, regime: Regime) {
  const standardDeduction = regime === "new" ? 75_000 : 50_000;
  const taxable = Math.max(0, grossSalary - standardDeduction);
  const slabs = regime === "new"
    ? [{ limit: 400_000, rate: 0 }, { limit: 800_000, rate: 0.05 }, { limit: 1_200_000, rate: 0.10 }, { limit: 1_600_000, rate: 0.15 }, { limit: 2_000_000, rate: 0.20 }, { limit: 2_400_000, rate: 0.25 }, { limit: Infinity, rate: 0.30 }]
    : [{ limit: 250_000, rate: 0 }, { limit: 500_000, rate: 0.05 }, { limit: 1_000_000, rate: 0.20 }, { limit: Infinity, rate: 0.30 }];
  let tax = slabTax(taxable, slabs);
  if (regime === "new" && taxable <= 1_200_000) tax = 0;
  if (regime === "old" && taxable <= 500_000) tax = Math.max(0, tax - 12_500);
  return tax * 1.04;
}

export default function CtcToInhandCalculator() {
  const [ctc, setCtc] = useState("1200000");
  const [basicPercent, setBasicPercent] = useState("40");
  const [variablePercent, setVariablePercent] = useState("0");
  const [pfMode, setPfMode] = useState<"cap" | "full">("cap");
  const [professionalTax, setProfessionalTax] = useState("200");
  const [regime, setRegime] = useState<Regime>("new");

  const result = useMemo(() => {
    const annualCtc = Math.max(0, Number(ctc) || 0);
    const basic = annualCtc * Math.min(100, Math.max(0, Number(basicPercent) || 0)) / 100;
    const variable = annualCtc * Math.min(100, Math.max(0, Number(variablePercent) || 0)) / 100;
    const employerPf = Math.min(basic * 0.12, 21_600);
    const gratuity = basic * 0.0481;
    const gross = Math.max(0, annualCtc - employerPf - gratuity);
    const employeePf = pfMode === "cap" ? 21_600 : basic * 0.12;
    const tax = incomeTax(Math.max(0, gross - variable), regime);
    const pt = Math.max(0, Number(professionalTax) || 0) * 12;
    const annualInHand = Math.max(0, gross - employeePf - pt - tax);
    return { annualCtc, basic, variable, employerPf, gratuity, gross, employeePf, tax, pt, annualInHand, monthly: annualInHand / 12 };
  }, [ctc, basicPercent, variablePercent, pfMode, professionalTax, regime]);

  const inputClass = "mt-2 w-full rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] px-4 py-3 text-base outline-none focus:border-[#171717]";
  const reset = () => { setCtc("1200000"); setBasicPercent("40"); setVariablePercent("0"); setPfMode("cap"); setProfessionalTax("200"); setRegime("new"); };

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-5">
          <div><label className="text-sm font-semibold">Annual CTC</label><input className={inputClass} type="number" min="0" value={ctc} onChange={e => setCtc(e.target.value)} placeholder="e.g. 1200000" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-semibold">Basic salary (% of CTC)</label><input className={inputClass} type="number" min="0" max="100" value={basicPercent} onChange={e => setBasicPercent(e.target.value)} /></div>
            <div><label className="text-sm font-semibold">Variable pay (% of CTC)</label><input className={inputClass} type="number" min="0" max="100" value={variablePercent} onChange={e => setVariablePercent(e.target.value)} /></div>
          </div>
          <div><label className="text-sm font-semibold">Employee PF</label><select className={inputClass} value={pfMode} onChange={e => setPfMode(e.target.value as "cap" | "full")}><option value="cap">₹1,800/month statutory-style cap</option><option value="full">12% of basic salary</option></select></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-semibold">Professional tax / month</label><input className={inputClass} type="number" min="0" value={professionalTax} onChange={e => setProfessionalTax(e.target.value)} /></div>
            <div><label className="text-sm font-semibold">Tax regime</label><select className={inputClass} value={regime} onChange={e => setRegime(e.target.value as Regime)}><option value="new">New regime · FY 2026-27</option><option value="old">Old regime · FY 2026-27</option></select></div>
          </div>
          <button onClick={reset} className="min-h-11 rounded-lg border border-[#d8d4c9] px-4 text-sm font-semibold hover:bg-black/5">Reset</button>
        </div>
        <div className="space-y-4">
          <div className="border border-[#171717] bg-[#171717] p-6 text-white"><p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">Estimated monthly in-hand</p><p className="mt-3 text-4xl font-black tracking-tight">{inr.format(result.monthly)}</p><p className="mt-2 text-sm text-white/60">Annual take-home: {inr.format(result.annualInHand)}</p></div>
          <div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Annual breakdown</p><div className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><span>Gross salary</span><strong>{inr.format(result.gross)}</strong></div><div className="flex justify-between gap-4"><span>Employee PF</span><strong>-{inr.format(result.employeePf)}</strong></div><div className="flex justify-between gap-4"><span>Income tax + cess</span><strong>-{inr.format(result.tax)}</strong></div><div className="flex justify-between gap-4"><span>Professional tax</span><strong>-{inr.format(result.pt)}</strong></div></div></div>
          <div className="border border-[#d8d4c9] p-5 text-sm"><p className="font-bold">What is included in CTC</p><p className="mt-2 leading-6 text-black/55">This estimate removes employer PF and an estimated gratuity provision from CTC before calculating take-home. Variable pay is excluded from the regular monthly estimate when entered.</p></div>
        </div>
      </div>
      <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">Estimate for FY 2026-27. Actual take-home varies by employer salary structure, PF rules, professional-tax state rules, bonus timing, deductions, exemptions and payroll treatment. This simplified calculator does not model HRA, ESI, NPS, perquisites, capital gains or every tax deduction. Use your payslip and Form 16 for the authoritative amount.</p>
    </div>
  );
}
