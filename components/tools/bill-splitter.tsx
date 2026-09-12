"use client";

import { useMemo, useState } from "react";
import { RotateCcw, UsersRound } from "lucide-react";

const inputClassName =
  "min-h-12 w-full bg-transparent px-3 text-base font-semibold text-[#171717] outline-none placeholder:text-black/30 focus-visible:ring-4 focus-visible:ring-[#c8f169]";

export default function BillSplitter() {
  const [bill, setBill] = useState(1000);
  const [people, setPeople] = useState(2);
  const [tip, setTip] = useState(0);

  const result = useMemo(() => {
    const safeBill = Math.max(0, Number(bill) || 0);
    const safePeople = Math.max(1, Math.floor(Number(people) || 1));
    const safeTip = Math.max(0, Number(tip) || 0);
    const tipAmount = safeBill * (safeTip / 100);
    const total = safeBill + tipAmount;
    return { safePeople, tipAmount, total, each: total / safePeople };
  }, [bill, people, tip]);

  const reset = () => {
    setBill(1000);
    setPeople(2);
    setTip(0);
  };

  return (
    <div className="bg-[#fffdf8] p-5 sm:p-7 md:p-8">
      <div className="mb-7 flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3c9] text-[#58751d]">
          <UsersRound size={21} aria-hidden="true" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#6d8e25]">Split the bill</p>
          <h3 className="mt-1 text-lg font-black tracking-[-.025em]">Enter the bill details</h3>
          <p className="mt-1 text-sm leading-5 text-black/45">Add a tip if needed, then see exactly what each person pays.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block rounded-2xl border border-[#dedbd3] bg-white p-3 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)]">
          <span className="px-1 text-xs font-black uppercase tracking-[.1em] text-black/45">Bill amount</span>
          <div className="mt-1 flex items-center">
            <span className="pl-1 text-base font-bold text-black/40" aria-hidden="true">₹</span>
            <input aria-label="Bill amount" type="number" min="0" step="0.01" value={bill} onChange={(e) => setBill(Number(e.target.value))} className={inputClassName} />
          </div>
        </label>

        <label className="block rounded-2xl border border-[#dedbd3] bg-white p-3 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)]">
          <span className="px-1 text-xs font-black uppercase tracking-[.1em] text-black/45">People</span>
          <input aria-label="Number of people" type="number" min="1" step="1" value={people} onChange={(e) => setPeople(Number(e.target.value))} className={`${inputClassName} mt-1 px-1`} />
        </label>

        <label className="block rounded-2xl border border-[#dedbd3] bg-white p-3 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)]">
          <span className="px-1 text-xs font-black uppercase tracking-[.1em] text-black/45">Tip</span>
          <div className="mt-1 flex items-center">
            <input aria-label="Tip percentage" type="number" min="0" step="1" value={tip} onChange={(e) => setTip(Number(e.target.value))} className={`${inputClassName} px-1`} />
            <span className="pr-1 text-base font-bold text-black/40" aria-hidden="true">%</span>
          </div>
        </label>
      </div>

      <section className="mt-7" aria-labelledby="split-results">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 id="split-results" className="text-sm font-black">Your split</h3>
          <p className="text-xs font-semibold text-black/40">{result.safePeople} {result.safePeople === 1 ? "person" : "people"}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#dedbd3] bg-[#f3f0e8] p-4 sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/45">Total</p>
            <p className="mt-2 text-2xl font-black tracking-[-.03em]">₹{result.total.toFixed(2)}</p>
            <p className="mt-1 text-xs text-black/40">Bill + tip</p>
          </div>
          <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-4 shadow-[0_5px_14px_rgba(23,23,23,.06)] sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/55">Each person</p>
            <p className="mt-2 text-2xl font-black tracking-[-.03em]">₹{result.each.toFixed(2)}</p>
            <p className="mt-1 text-xs text-black/55">Equal share</p>
          </div>
          <div className="rounded-2xl border border-[#dedbd3] bg-[#f3f0e8] p-4 sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/45">Tip amount</p>
            <p className="mt-2 text-2xl font-black tracking-[-.03em]">₹{result.tipAmount.toFixed(2)}</p>
            <p className="mt-1 text-xs text-black/40">At {Math.max(0, Number(tip) || 0)}%</p>
          </div>
        </div>
      </section>

      <div className="mt-6 rounded-2xl border border-dashed border-[#d8d4c9] bg-[#faf9f6] p-4">
        <p className="text-xs font-black uppercase tracking-[.1em] text-black/45">Quick people count</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick number of people">
          {[2, 3, 4, 5, 6].map((count) => (
            <button
              key={count}
              type="button"
              aria-pressed={people === count}
              onClick={() => setPeople(count)}
              className={`min-h-11 rounded-full border px-4 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#c8f169] ${people === count ? "border-[#171717] bg-[#171717] text-white" : "border-[#d0ccc2] bg-white hover:border-[#171717] hover:bg-[#f7f5ef]"}`}
            >
              {count} people
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={reset} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d0ccc2] bg-white px-4 text-sm font-bold transition hover:border-[#171717] hover:bg-[#f7f5ef] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
        <RotateCcw size={15} aria-hidden="true" />
        Reset
      </button>
    </div>
  );
}
