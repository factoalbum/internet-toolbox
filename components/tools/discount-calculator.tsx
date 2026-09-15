"use client";

import { BadgePercent, Check, Copy, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
const discountOptions = [5, 10, 15, 20, 25, 30, 50];
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function DiscountCalculator() {
  const [price, setPrice] = useState("1000");
  const [discount, setDiscount] = useState("20");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const result = useMemo(() => {
    const original = Number(price);
    const rate = Number(discount);
    if (!Number.isFinite(original) || !Number.isFinite(rate) || original < 0 || rate < 0 || rate > 100) return null;
    const savings = original * (rate / 100);
    return { savings, finalPrice: original - savings };
  }, [price, discount]);

  const reset = () => { setPrice("1000"); setDiscount("20"); setCopied(false); setCopyError(false); };
  const inputClass = `mt-2 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3.5 text-base font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`;
  const hasInvalidInput = result === null;
  const isPristine = price === "1000" && discount === "20";

  const updatePrice = (value: string) => { setPrice(value); setCopied(false); setCopyError(false); };
  const updateDiscount = (value: string) => { setDiscount(value); setCopied(false); setCopyError(false); };

  const copyResult = async () => {
    if (!result) return;
    const text = `Discount: ${discount}% off ${money.format(Number(price))}. Savings: ${money.format(result.savings)}. Sale price: ${money.format(result.finalPrice)}.`;
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="discount-workspace-title">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff5cf] text-[#8a6410]" aria-hidden="true"><BadgePercent size={20} /></span>
            <div className="min-w-0"><p className="text-xs font-black uppercase tracking-[.14em] text-black/45">Money utility</p><h2 id="discount-workspace-title" className="mt-1 font-bold">Calculate sale price</h2><p className="mt-1 text-sm leading-5 text-black/50">See your savings and final price before you buy.</p></div>
          </div>
          <button type="button" onClick={reset} disabled={isPristine} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#d8d4c9] disabled:hover:text-black/55 ${focusRing}`} aria-label="Reset discount calculator"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.3)]">
            <span className="text-sm font-bold">Original price</span>
            <span className="mt-1 block text-xs leading-5 text-black/40">Enter the price before the discount.</span>
            <div className="mt-2 flex items-center rounded-xl border border-[#bcb8ae] bg-[#fffdf8] focus-within:border-[#171717] focus-within:ring-4 focus-within:ring-[#c8f169]">
              <span className="pl-3.5 text-sm font-bold text-black/40" aria-hidden="true">₹</span>
              <input aria-label="Original price in rupees" value={price} onChange={(event) => updatePrice(event.target.value)} inputMode="decimal" type="number" min="0" step="0.01" aria-invalid={hasInvalidInput} className={`${inputClass} mt-0 border-0 bg-transparent px-2.5 focus:ring-0`} />
            </div>
          </label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.3)]">
            <span className="text-sm font-bold">Discount percentage</span>
            <span className="mt-1 block text-xs leading-5 text-black/40">Use a value from 0% to 100%.</span>
            <div className="relative mt-2">
              <input aria-label="Discount percentage" value={discount} onChange={(event) => updateDiscount(event.target.value)} inputMode="decimal" type="number" min="0" max="100" step="0.01" aria-invalid={hasInvalidInput} className={`min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-3.5 pr-10 text-base font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-black/35" aria-hidden="true">%</span>
            </div>
          </label>
        </div>

        <div className="mt-6" aria-labelledby="common-discounts-heading">
          <div className="flex items-center justify-between gap-3"><p id="common-discounts-heading" className="text-xs font-black uppercase tracking-[.12em] text-black/40">Common discounts</p><span className="text-xs text-black/40">Quick select</span></div>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Quick discount percentages">{discountOptions.map((option) => <button key={option} type="button" onClick={() => updateDiscount(String(option))} aria-pressed={discount === String(option)} className={`min-h-11 rounded-full border px-3.5 text-sm font-semibold transition ${focusRing} ${discount === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white"}`}>{option}%</button>)}</div>
        </div>

        {result ? <section className="mt-7" aria-labelledby="discount-results-heading" aria-live="polite"><div className="mb-3 flex items-center justify-between gap-3"><h3 id="discount-results-heading" className="text-sm font-black">Your savings</h3><span className="text-xs font-semibold text-black/40">{discount}% off</span></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">You save</p><p className="mt-2 break-words text-3xl font-black tracking-[-.03em]">{money.format(result.savings)}</p><p className="mt-1 text-xs text-black/40">Discount amount</p></div><div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Sale price</p><p className="mt-2 break-words text-3xl font-black tracking-[-.03em]">{money.format(result.finalPrice)}</p><p className="mt-1 text-xs text-black/55">What remains after the discount</p></div></div><div className="mt-3 flex items-center justify-between gap-3"><p className="text-xs leading-5 text-black/40">Copy the exact savings summary for sharing or saving.</p><button type="button" onClick={copyResult} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-sm font-bold transition ${copied ? "border-[#7aa33b] bg-[#f2f9df] text-[#416318]" : "border-[#d0ccc2] bg-white text-[#171717] hover:border-[#171717] hover:bg-[#f7f5ef]"} ${focusRing}`} aria-label={copied ? "Discount result copied" : "Copy discount result"}><span aria-hidden="true">{copied ? <Check size={15} /> : <Copy size={15} />}</span>{copied ? "Copied" : "Copy result"}</button></div>{copyError && <p className="mt-3 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3 text-sm leading-5 text-[#7b3d31]" role="alert">We could not copy the result. Please select and copy it manually.</p>}<p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{copied ? "Discount result copied to clipboard." : ""}</p></section> : <p className="mt-6 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">Enter a price of 0 or more and a discount from 0% to 100%.</p>}

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Calculated locally in your browser. Savings are the original price multiplied by the discount rate; taxes, GST, fees or other charges may change the final amount a seller charges.</p>
      </div>
    </div>
  );
}
