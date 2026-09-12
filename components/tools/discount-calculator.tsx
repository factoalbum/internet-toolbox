"use client";

import { BadgePercent, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
const discountOptions = [5, 10, 15, 20, 25, 30, 50];
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

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
  const inputClass = `mt-2 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3.5 text-base font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff5cf] text-[#8a6410]" aria-hidden="true"><BadgePercent size={20} /></span>
            <div className="min-w-0"><p className="font-bold">Calculate sale price</p><p className="mt-1 text-sm text-black/50">See your savings and final price before you buy.</p></div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset discount calculator"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">Original price (₹)</span><input aria-label="Original price in rupees" value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" type="number" min="0" step="0.01" className={inputClass} /></label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">Discount percentage</span><div className="relative mt-2"><input aria-label="Discount percentage" value={discount} onChange={(event) => setDiscount(event.target.value)} inputMode="decimal" type="number" min="0" max="100" step="0.01" className={`min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 pr-10 text-base font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-black/35">%</span></div></label>
        </div>

        <div className="mt-6" aria-label="Quick discount percentages">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Common discounts</p>
          <div className="mt-2 flex flex-wrap gap-2">{discountOptions.map((option) => <button key={option} type="button" onClick={() => setDiscount(String(option))} aria-pressed={discount === String(option)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${focusRing} ${discount === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{option}%</button>)}</div>
        </div>

        {result ? <div className="mt-7 grid gap-3 sm:grid-cols-2" aria-live="polite"><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">You save</p><p className="mt-2 text-3xl font-black tracking-[-0.03em]">{money.format(result.savings)}</p></div><div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Sale price</p><p className="mt-2 text-3xl font-black tracking-[-0.03em]">{money.format(result.finalPrice)}</p></div></div> : <p className="mt-6 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">Enter a price and a discount from 0% to 100%.</p>}

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Savings are the original price multiplied by the discount rate. The sale price is the original price minus the savings. Taxes, GST, fees or other charges may change the final amount a seller charges.</p>
      </div>
    </div>
  );
}
