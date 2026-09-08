"use client";

import { useMemo, useState } from "react";

const money = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

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

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Original price</span>
          <input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" type="number" min="0" step="0.01" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717]" aria-label="Original price" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Discount percentage</span>
          <input value={discount} onChange={(event) => setDiscount(event.target.value)} inputMode="decimal" type="number" min="0" max="100" step="0.01" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717]" aria-label="Discount percentage" />
        </label>
      </div>

      {result ? (
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">You save</p><p className="mt-2 text-3xl font-black tracking-[-0.03em]">{money.format(result.savings)}</p></div>
          <div className="border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Sale price</p><p className="mt-2 text-3xl font-black tracking-[-0.03em]">{money.format(result.finalPrice)}</p></div>
        </div>
      ) : <p className="mt-6 text-sm text-black/50">Enter a price and a discount from 0% to 100%.</p>}

      <p className="mt-5 text-xs leading-5 text-black/45">Formula: savings = original price × discount ÷ 100. The sale price is the original price minus the savings.</p>
    </div>
  );
}
