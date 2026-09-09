"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

export default function DiscountCalculator() {
  const [price, setPrice] = useState("1000");
  const [discount, setDiscount] = useState("20");

  const result = useMemo(() => {
    const original = Number(price);
    const rate = Number(discount);
    if (!Number.isFinite(original) || !Number.isFinite(rate) || original < 0 || rate < 0 || rate > 100) return null;
    const savings = original * (rate / 100);
    return { savings, finalPrice: original - savings };
  }, [price, discount]);

  const reset = () => { setPrice("1000"); setDiscount("20"); };

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-bold">Calculate sale price</p>
          <p className="mt-1 text-sm text-black/50">See your savings and final price instantly.</p>
        </div>
        <button type="button" onClick={reset} className="flex min-h-11 items-center gap-2 rounded-lg border border-[#d8d4c9] px-3 text-sm font-bold text-black/55 transition hover:bg-black/5 hover:text-black" aria-label="Reset discount calculator"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Original price</span>
          <input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" type="number" min="0" step="0.01" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Discount percentage</span>
          <div className="relative mt-2">
            <input value={discount} onChange={(event) => setDiscount(event.target.value)} inputMode="decimal" type="number" min="0" max="100" step="0.01" className="min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 pr-10 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-black/35">%</span>
          </div>
        </label>
      </div>

      {result ? (
        <div className="mt-7 grid gap-3 sm:grid-cols-2" aria-live="polite">
          <div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">You save</p><p className="mt-2 text-3xl font-black tracking-[-0.03em]">{money.format(result.savings)}</p></div>
          <div className="border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Sale price</p><p className="mt-2 text-3xl font-black tracking-[-0.03em]">{money.format(result.finalPrice)}</p></div>
        </div>
      ) : <p className="mt-6 text-sm text-black/50" role="alert">Enter a price and a discount from 0% to 100%.</p>}

      <p className="mt-5 text-xs leading-5 text-black/45">Formula: savings = original price × discount ÷ 100. The sale price is the original price minus the savings. This does not include sales tax, GST, fees or other charges that a seller may apply.</p>
    </div>
  );
}
