"use client";

import { useMemo, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

type RegimeResult = { taxable: number; tax: number; cess: number; surcharge: number; total: number };

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

  if (regime === "new" && taxable <= 1_200_000) {
    tax = Math.max(0, tax - Math.min(tax, 60_000));
  }
  if (regime === "old" && taxable <= 500_000) {
    tax = Math.max(0, tax - Math.min(tax, 12_500));
  }

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
  const inputClass = "mt-2 w-full rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] px-4 py-3 text-base outline-none focus:border-[#171717]";

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">Annual gross income</label>
            <input className={inputClass} type="number" min="0" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 1200000" />
          </div>
          <div className="border-t border-[#e5e1d7] pt-5">
            <p className="text-sm font-bold">Old regime deductions</p>
            <p className="mt-1 text-xs leading-5 text-black/50">Optional inputs. The new regime only uses the ₹75,000 salary standard deduction here.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div><label className="text-xs font-semibold">Other deductions</label><input className={inputClass} type="number" min="0" value={deductions} onChange={e => setDeductions(e.target.value)} placeholder="0" /></div>
              <div><label className="text-xs font-semibold">80C</label><input className={inputClass} type="number" min="0" value={old80C} onChange={e => setOld80C(e.target.value)} placeholder="0" /></div>
              <div><label className="text-xs font-semibold">80D</label><input className={inputClass} type="number" min="0" value={old80D} onChange={e => setOld80D(e.target.value)} placeholder="0" /></div>
            </div>
          </div>
          <button onClick={reset} className="min-h-11 rounded-lg border border-[#d8d4c9] px-4 text-sm font-semibold hover:bg-black/5">Reset</button>
        </div>

        <div className="space-y-4">
          <div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5">
            <div className="flex items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">New regime · FY 2026–27</p>{result.best === "new" && <span className="rounded-full bg-[#c8f169] px-2.5 py-1 text-xs font-bold">Lower tax</span>}</div>
            <p className="mt-3 text-3xl font-black tracking-tight">{inr.format(result.newer.total)}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div>Taxable income <strong className="block">{inr.format(result.newer.taxable)}</strong></div><div>Monthly equivalent <strong className="block">{inr.format(result.newer.total / 12)}</strong></div></div>
          </div>
          <div className="border border-[#d8d4c9] p-5">
            <div className="flex items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Old regime · FY 2026–27</p>{result.best === "old" && <span className="rounded-full bg-[#c8f169] px-2.5 py-1 text-xs font-bold">Lower tax</span>}</div>
            <p className="mt-3 text-3xl font-black tracking-tight">{inr.format(result.older.total)}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div>Taxable income <strong className="block">{inr.format(result.older.taxable)}</strong></div><div>Monthly equivalent <strong className="block">{inr.format(result.older.total / 12)}</strong></div></div>
          </div>
          <div className="rounded-lg bg-[#171717] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">Estimated savings</p><p className="mt-2 text-2xl font-black">{inr.format(Math.abs(result.newer.total - result.older.total))}</p><p className="mt-1 text-sm text-white/60">The {result.best === "new" ? "new" : "old"} regime is lower with these inputs.</p></div>
        </div>
      </div>
      <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">Estimate for FY 2026–27 / AY 2027–28 using normal slab-rate income. It includes 4% health & education cess and compares the new and old regimes. It does not model capital gains or other special-rate income, HRA, home-loan-specific rules, or every possible deduction. For filing, verify against your Form 16 and the Income Tax Department.</p>
    </div>
  );
}
