"use client";

import { useMemo, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function CtcToInHandCalculator() {
  const [ctc, setCtc] = useState("600000");
  const [bonus, setBonus] = useState("0");
  const [employerPf, setEmployerPf] = useState("12");
  const [gratuity, setGratuity] = useState("4.81");
  const [employeePf, setEmployeePf] = useState("12");
  const [professionalTax, setProfessionalTax] = useState("200");
  const [otherDeductions, setOtherDeductions] = useState("0");

  const result = useMemo(() => {
    const annualCtc = Math.max(0, Number(ctc) || 0);
    const annualBonus = Math.min(Math.max(0, Number(bonus) || 0), annualCtc);
    const employerPfAnnual = Math.max(0, (annualCtc - annualBonus) * (Math.max(0, Number(employerPf) || 0) / 100));
    const gratuityAnnual = Math.max(0, (annualCtc - annualBonus) * (Math.max(0, Number(gratuity) || 0) / 100));
    const grossAnnual = Math.max(0, annualCtc - annualBonus - employerPfAnnual - gratuityAnnual);
    const employeePfAnnual = grossAnnual * (Math.max(0, Number(employeePf) || 0) / 100);
    const professionalTaxAnnual = Math.max(0, Number(professionalTax) || 0) * 12;
    const otherAnnual = Math.max(0, Number(otherDeductions) || 0) * 12;
    const estimatedTakeHomeAnnual = Math.max(0, grossAnnual - employeePfAnnual - professionalTaxAnnual - otherAnnual);
    return { annualBonus, employerPfAnnual, gratuityAnnual, grossAnnual, employeePfAnnual, professionalTaxAnnual, otherAnnual, estimatedTakeHomeAnnual };
  }, [ctc, bonus, employerPf, gratuity, employeePf, professionalTax, otherDeductions]);

  const reset = () => { setCtc("600000"); setBonus("0"); setEmployerPf("12"); setGratuity("4.81"); setEmployeePf("12"); setProfessionalTax("200"); setOtherDeductions("0"); };
  const inputClass = "mt-2 w-full rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] px-4 py-3 text-base outline-none focus:border-[#171717]";

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-5">
          <div><label className="text-sm font-semibold">Annual CTC</label><input className={inputClass} type="number" min="0" value={ctc} onChange={e => setCtc(e.target.value)} placeholder="e.g. 600000" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-semibold">Annual bonus / variable pay</label><input className={inputClass} type="number" min="0" value={bonus} onChange={e => setBonus(e.target.value)} placeholder="0" /></div>
            <div><label className="text-sm font-semibold">Other monthly deductions</label><input className={inputClass} type="number" min="0" value={otherDeductions} onChange={e => setOtherDeductions(e.target.value)} placeholder="0" /></div>
          </div>
          <div className="border-t border-[#e5e1d7] pt-5"><p className="text-sm font-bold">Common salary components</p><p className="mt-1 text-xs leading-5 text-black/50">Adjust these assumptions to match your offer letter.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><div><label className="text-xs font-semibold">Employer PF (%)</label><input className={inputClass} type="number" min="0" max="100" step="0.01" value={employerPf} onChange={e => setEmployerPf(e.target.value)} /></div><div><label className="text-xs font-semibold">Gratuity (%)</label><input className={inputClass} type="number" min="0" max="100" step="0.01" value={gratuity} onChange={e => setGratuity(e.target.value)} /></div><div><label className="text-xs font-semibold">Employee PF (%)</label><input className={inputClass} type="number" min="0" max="100" step="0.01" value={employeePf} onChange={e => setEmployeePf(e.target.value)} /></div><div><label className="text-xs font-semibold">Professional tax / month</label><input className={inputClass} type="number" min="0" value={professionalTax} onChange={e => setProfessionalTax(e.target.value)} /></div></div></div>
          <button onClick={reset} className="min-h-11 rounded-lg border border-[#d8d4c9] px-4 text-sm font-semibold hover:bg-black/5">Reset</button>
        </div>
        <div className="space-y-4">
          <div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Estimated monthly take-home</p><p className="mt-3 text-3xl font-black tracking-tight">{inr.format(result.estimatedTakeHomeAnnual / 12)}</p><p className="mt-2 text-sm text-black/50">Before income-tax/TDS unless entered as another deduction.</p></div>
          <div className="border border-[#d8d4c9] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Annual breakdown</p><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt>Gross salary estimate</dt><dd className="font-semibold">{inr.format(result.grossAnnual)}</dd></div><div className="flex justify-between gap-4"><dt>Employer PF</dt><dd>{inr.format(result.employerPfAnnual)}</dd></div><div className="flex justify-between gap-4"><dt>Gratuity</dt><dd>{inr.format(result.gratuityAnnual)}</dd></div><div className="flex justify-between gap-4"><dt>Employee PF</dt><dd>{inr.format(result.employeePfAnnual)}</dd></div><div className="flex justify-between gap-4"><dt>Professional tax</dt><dd>{inr.format(result.professionalTaxAnnual)}</dd></div><div className="flex justify-between gap-4 border-t border-[#e5e1d7] pt-3"><dt className="font-bold">Estimated annual take-home</dt><dd className="font-bold">{inr.format(result.estimatedTakeHomeAnnual)}</dd></div></dl></div>
        </div>
      </div>
      <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">This is an estimate, not a payroll calculation. CTC structures vary by employer. PF may be capped or calculated on basic pay, gratuity may be structured differently, professional tax varies by state, and income tax/TDS is not automatically included. Check your offer letter and payslip for the actual components.</p>
    </div>
  );
}
