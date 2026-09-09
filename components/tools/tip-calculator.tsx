"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
const tipOptions = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  const [bill, setBill] = useState("1000");
  const [tip, setTip] = useState("10");
  const [people, setPeople] = useState("2");

  const result = useMemo(() => {
    const amount = Number(bill);
    const tipRate = Number(tip);
    const count = Number(people);
    if (!Number.isFinite(amount) || !Number.isFinite(tipRate) || !Number.isFinite(count) || amount < 0 || tipRate < 0 || tipRate > 100 || count < 1 || count > 100 || !Number.isInteger(count)) return null;
    const tipAmount = amount * tipRate / 100;
    const total = amount + tipAmount;
    return { tipAmount, total, perPerson: total / count };
  }, [bill, tip, people]);

  const reset = () => { setBill("1000"); setTip("10"); setPeople("2"); };
  const inputClass = "mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]";

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-bold">Split the bill in seconds</p>
          <p className="mt-1 text-sm text-black/50">Calculate the tip, final bill and each person&apos;s share.</p>
        </div>
        <button type="button" onClick={reset} className="flex min-h-11 items-center gap-2 rounded-lg border border-[#d8d4c9] px-3 text-sm font-bold text-black/55 transition hover:bg-black/5 hover:text-black" aria-label="Reset tip calculator"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="block"><span className="text-sm font-semibold">Bill amount (₹)</span><input aria-label="Bill amount in rupees" value={bill} onChange={(event) => setBill(event.target.value)} type="number" min="0" step="0.01" inputMode="decimal" className={inputClass} /></label>
        <label className="block"><span className="text-sm font-semibold">Tip percentage</span><div className="relative mt-2"><input aria-label="Tip percentage" value={tip} onChange={(event) => setTip(event.target.value)} type="number" min="0" max="100" step="1" inputMode="decimal" className="min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 pr-10 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-black/35">%</span></div></label>
        <label className="block"><span className="text-sm font-semibold">People</span><input aria-label="Number of people" value={people} onChange={(event) => setPeople(event.target.value)} type="number" min="1" max="100" step="1" inputMode="numeric" className={inputClass} /></label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Quick tip percentages">
        {tipOptions.map((option) => <button key={option} type="button" onClick={() => setTip(String(option))} aria-pressed={tip === String(option)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${tip === String(option) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717]"}`}>{option}%</button>)}
      </div>

      {result ? (
        <div className="mt-7 grid gap-3 sm:grid-cols-3" aria-live="polite">
          <div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Tip</p><p className="mt-2 text-2xl font-black">{money.format(result.tipAmount)}</p></div>
          <div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Total bill</p><p className="mt-2 text-2xl font-black">{money.format(result.total)}</p></div>
          <div className="border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">Each person</p><p className="mt-2 text-3xl font-black">{money.format(result.perPerson)}</p></div>
        </div>
      ) : <p className="mt-6 text-sm text-black/50" role="alert">Enter a valid bill, tip from 0% to 100%, and a whole number of people.</p>}

      <p className="mt-5 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Tip and split amounts are estimates. Rounding at the restaurant or payment counter can make the final amount differ by a small amount.</p>
    </div>
  );
}
