"use client";

import { useMemo, useState } from "react";
import { Landmark, RotateCcw } from "lucide-react";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-[#d8d4c9] bg-[#f8f5ed] px-4 text-base font-medium text-[#171717] outline-none transition placeholder:text-black/30 hover:border-black/30 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] focus:ring-offset-1";

type RegimeResult = { taxable: number; tax: number; cess: number; surcharge: number; total: number };
type NumberFieldProps = { label: string; value: string; setValue: (value: string) => void; hint?: string };

function NumberField({ label, value, setValue, hint }: NumberFieldProps) {
  return (
    <label className="block min-w-0 rounded-2xl border border-[#e2ded4] bg-white p-4">
      <span className="block text-sm font-bold">{label}</span>
      {hint && <span className="mt-1 block text-xs leading-5 text-black/45">{hint}</span>}
      <input className={inputClass} type="number" min="0" value={value} onChange={e => setValue(e.target.value)} inputMode="decimal" />
    </label>
  );
}

function slabTax(income: number, slabs: { limit: number; rate: number }[]) {
  let tax = 0;
  let previous = 0;
  for (const slab of slabs) {
    if (income <= previous) break;
    const taxable = Math.min(income, slab.limit) - previous;
    tax += taxable * slab.rate;
    previous = slab.limit;
    if (income <= slab.limit) break;
  }
  return tax;
}

function surchargeRate(income: number, regime: "old" | "new") {
  if (income <= 5_000_000) return 0;
  if (income <= 10_000_000) return 0.1;
  if (income <= 20_000_000) return 0.15;
  return regime === "old" ? (income <= 50_000_000 ? 0.25 : 0.37) : 0.25;
}

function calculate(income: number, regime: "old" | "new", deductions: number): RegimeResult {
  const taxable = Math.max(0, income - deductions);
  const slabs = regime === "new"
    ? [
        { limit: 400_000, rate: 0 },
        { limit: 800_000, rate: 0.05 },
        { limit: 1_200_000, rate: 0.1 },
        { limit: 1_600_000, rate: 0.15 },
        { limit: 2_000_000, rate: 0.2 },
        { limit: 2_400_000, rate: 0.25 },
        { limit: Number.POSITIVE_INFINITY, rate: 0.3 },
      ]
    : [
        { limit: 250_000, rate: 0 },
        { limit: 500_000, rate: 0.05 },
        { limit: 1_000_000, rate: 0.2 },
        { limit: Number.POSITIVE_INFINITY, rate: 0.3 },
      ];

  let tax = slabTax(taxable, slabs);
  if (regime === "new") {
    if (taxable <= 1_200_000) tax = Math.max(0, tax - Math.min(tax, 60_000));
    else tax = Math.min(tax, taxable - 1_200_000);
  }
  if (regime === "old" && taxable <= 500_000) tax = Math.max(0, tax - Math.min(tax, 12_500));

  const rate = surchargeRate(taxable, regime);
  const surcharge = tax * rate;
  const cess = (tax + surcharge) * 0.04;
  return { taxable, tax, cess, surcharge, total: tax + surcharge + cess };
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState("1200000");
  const [deductions, setDeductions] = useState("0");
  const [old80C, setOld80C] = useState("0");
  const [old80D, setOld80D] = useState("0");

  const result = useMemo(() => {
    const gross = Math.max(0, Number(income) || 0);
    const standardNew = 75_000;
    const standardOld = 50_000;
    const additionalOld = Math.min(Math.max(0, Number(deductions) || 0), 1_500_000) + Math.min(Math.max(0, Number(old80C) || 0), 150_000) + Math.min(Math.max(0, Number(old80D) || 0), 100_000);
    const newer = calculate(gross, "new", standardNew);
    const older = calculate(gross, "old", standardOld + additionalOld);
    const best = newer.total <= older.total ? "new" : "old";
    return { newer, older, best };
  }, [income, deductions, old80C, old80D]);

  const reset = () => { setIncome("1200000"); setDeductions("0"); setOld80C("0"); setOld80D("0"); };

  return (
    <div className="bg-[#fffdf8] p-3 sm:p-5 md:p-7">
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#e2ded4] bg-[#f5f2ea] p-4 sm:p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f2c9] text-[#58721e]"><Landmark size={21} aria-hidden="true" /></span>
        <div className="min-w-0"><p className="text-xs font-black uppercase tracking-[.14em] text-[#6d8e25]">FY 2026-27</p><h3 className="mt-1 text-base font-black">Compare your estimated income tax</h3><p className="mt-1 text-xs leading-5 text-black/50">Enter gross annual income first. Add deductions only when comparing the old regime.</p></div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_.95fr] lg:gap-7">
        <div className="space-y-5">
          <NumberField label="Annual gross income" value={income} setValue={setIncome} hint="Before deductions and tax." />
          <section className="rounded-2xl border border-[#e2ded4] bg-[#faf9f6] p-4 sm:p-5" aria-labelledby="old-regime-deductions">
            <div><h4 id="old-regime-deductions" className="text-sm font-black">Old regime deductions</h4><p className="mt-1 text-xs leading-5 text-black/45">Optional. These inputs affect the old-regime estimate only.</p></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <NumberField label="Other deductions" value={deductions} setValue={setDeductions} hint="Capped in this estimate" />
              <NumberField label="Section 80C" value={old80C} setValue={setOld80C} hint="Up to ₹1.5 lakh" />
              <NumberField label="Section 80D" value={old80D} setValue={setOld80D} hint="Up to ₹1 lakh" />
            </div>
          </section>
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-4 text-sm font-bold transition hover:border-[#171717] hover:bg-[#f5f2ea] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><RotateCcw size={15} aria-hidden="true" />Reset</button>
        </div>

        <div className="space-y-4" aria-live="polite">
          <div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.14em] text-black/45">New regime</p>{result.best === "new" && <span className="shrink-0 rounded-full bg-[#c8f169] px-2.5 py-1 text-[11px] font-black">Lower tax</span>}</div>
            <p className="mt-3 text-3xl font-black tracking-[-.03em] sm:text-4xl">{inr.format(result.newer.total)}</p><p className="mt-1 text-xs text-black/45">Estimated total tax</p>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#d8d4c9] pt-4 text-xs text-black/50"><div>Taxable income<strong className="mt-1 block text-sm text-[#171717]">{inr.format(result.newer.taxable)}</strong></div><div>Monthly equivalent<strong className="mt-1 block text-sm text-[#171717]">{inr.format(result.newer.total / 12)}</strong></div></div>
          </div>
          <div className="rounded-2xl border border-[#d8d4c9] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.14em] text-black/45">Old regime</p>{result.best === "old" && <span className="shrink-0 rounded-full bg-[#c8f169] px-2.5 py-1 text-[11px] font-black">Lower tax</span>}</div>
            <p className="mt-3 text-3xl font-black tracking-[-.03em] sm:text-4xl">{inr.format(result.older.total)}</p><p className="mt-1 text-xs text-black/45">Estimated total tax</p>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#e3dfd5] pt-4 text-xs text-black/50"><div>Taxable income<strong className="mt-1 block text-sm text-[#171717]">{inr.format(result.older.taxable)}</strong></div><div>Monthly equivalent<strong className="mt-1 block text-sm text-[#171717]">{inr.format(result.older.total / 12)}</strong></div></div>
          </div>
          <div className="rounded-2xl bg-[#171717] p-5 text-white sm:p-6"><p className="text-xs font-black uppercase tracking-[.14em] text-white/50">Estimated difference</p><p className="mt-2 text-2xl font-black tracking-[-.02em]">{inr.format(Math.abs(result.newer.total - result.older.total))}</p><p className="mt-1 text-sm leading-6 text-white/60">The {result.best === "new" ? "new" : "old"} regime is lower with these inputs.</p></div>
        </div>
      </div>
      <p className="mt-6 rounded-2xl border border-[#e2ded4] bg-[#f8f5ed] p-4 text-xs leading-5 text-black/50">Estimate for FY 2026-27 / AY 2027-28 using normal slab-rate income. It includes 4% health & education cess and compares the new and old regimes. It does not model capital gains or other special-rate income, HRA, home-loan-specific rules, or every possible deduction. For filing, verify against your Form 16 and the Income Tax Department.</p>
    </div>
  );
}
