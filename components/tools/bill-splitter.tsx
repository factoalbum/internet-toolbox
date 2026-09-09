"use client";

import { useMemo, useState } from "react";

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
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 sm:p-7">
      <div className="grid gap-5 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-semibold">Bill amount</span>
          <div className="mt-2 flex items-center border border-[#bcb8ae] bg-white px-3 focus-within:border-[#171717]">
            <span className="text-black/45">₹</span>
            <input aria-label="Bill amount" type="number" min="0" step="0.01" value={bill} onChange={(e) => setBill(Number(e.target.value))} className="min-h-12 w-full bg-transparent px-2 outline-none" />
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">People</span>
          <input aria-label="Number of people" type="number" min="1" step="1" value={people} onChange={(e) => setPeople(Number(e.target.value))} className="mt-2 min-h-12 w-full border border-[#bcb8ae] bg-white px-3 outline-none focus:border-[#171717]" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Tip</span>
          <div className="mt-2 flex items-center border border-[#bcb8ae] bg-white px-3 focus-within:border-[#171717]">
            <input aria-label="Tip percentage" type="number" min="0" step="1" value={tip} onChange={(e) => setTip(Number(e.target.value))} className="min-h-12 w-full bg-transparent outline-none" />
            <span className="text-black/45">%</span>
          </div>
        </label>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="border border-[#d8d4c9] bg-[#f3f0e8] p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">Total</p><p className="mt-2 text-2xl font-black">₹{result.total.toFixed(2)}</p></div>
        <div className="border border-[#171717] bg-[#c8f169] p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/55">Each person</p><p className="mt-2 text-2xl font-black">₹{result.each.toFixed(2)}</p></div>
        <div className="border border-[#d8d4c9] bg-[#f3f0e8] p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">Tip amount</p><p className="mt-2 text-2xl font-black">₹{result.tipAmount.toFixed(2)}</p></div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[2, 3, 4, 5, 6].map((count) => <button key={count} type="button" onClick={() => setPeople(count)} className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${people === count ? "border-[#171717] bg-[#171717] text-white" : "border-[#bcb8ae] bg-white hover:border-[#171717]"}`}>{count} people</button>)}
      </div>

      <button type="button" onClick={reset} className="mt-6 min-h-11 border border-[#bcb8ae] bg-white px-4 text-sm font-semibold hover:border-[#171717]">Reset</button>
    </div>
  );
}
