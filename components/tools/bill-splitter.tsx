"use client";

import { useMemo, useState } from "react";
import { Check, Copy, RotateCcw, UsersRound } from "lucide-react";

const inputClassName =
  "min-h-12 w-full bg-transparent px-3 text-base font-semibold text-[#171717] outline-none placeholder:text-black/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]";

const toFiniteNumber = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

export default function BillSplitter() {
  const [bill, setBill] = useState(1000);
  const [people, setPeople] = useState(2);
  const [tip, setTip] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const result = useMemo(() => {
    const safeBill = Math.max(0, toFiniteNumber(Number(bill), 0));
    const safePeople = Math.max(1, Math.floor(toFiniteNumber(Number(people), 1)));
    const safeTip = Math.max(0, toFiniteNumber(Number(tip), 0));
    const tipAmount = safeBill * (safeTip / 100);
    const total = safeBill + tipAmount;
    return { safePeople, safeTip, tipAmount, total, each: total / safePeople };
  }, [bill, people, tip]);

  const hasInvalidInput = Number(bill) < 0 || Number(people) < 1 || Number(tip) < 0;
  const isDefault = bill === 1000 && people === 2 && tip === 0;

  const reset = () => {
    setBill(1000);
    setPeople(2);
    setTip(0);
    setCopied(false);
    setCopyError(false);
  };

  const copyResult = async () => {
    if (hasInvalidInput) return;
    const text = `Bill total: ₹${result.total.toFixed(2)}. Each person: ₹${result.each.toFixed(2)}. Tip: ₹${result.tipAmount.toFixed(2)} at ${result.safeTip}%. Split between ${result.safePeople} ${result.safePeople === 1 ? "person" : "people"}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  const updateBill = (value: number) => {
    setBill(value);
    setCopied(false);
    setCopyError(false);
  };
  const updatePeople = (value: number) => {
    setPeople(value);
    setCopied(false);
    setCopyError(false);
  };
  const updateTip = (value: number) => {
    setTip(value);
    setCopied(false);
    setCopyError(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="bill-splitter-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f3c9] text-[#58751d]" aria-hidden="true">
              <UsersRound size={21} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.14em] text-[#6d8e25]">Money utility</p>
              <h2 id="bill-splitter-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] sm:text-2xl">Split a bill fairly</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/50">Enter the bill, number of people, and optional tip to see the exact share for each person.</p>
            </div>
          </div>
          <button type="button" onClick={reset} disabled={isDefault} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d0ccc2] bg-white px-3.5 text-sm font-bold text-[#171717] transition hover:border-[#171717] hover:bg-[#f7f5ef] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#d0ccc2] disabled:hover:bg-white" aria-label="Reset bill splitter">
            <RotateCcw size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <div className="p-5 sm:p-7 md:p-8">
        <section aria-labelledby="bill-inputs-heading">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Bill details</p>
            <h3 id="bill-inputs-heading" className="mt-1 text-base font-black text-[#171717]">What are you splitting?</h3>
            <p className="mt-1 text-xs leading-5 text-black/45">Use the full bill amount before the tip is added.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className={`block rounded-2xl border bg-white p-3 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)] ${Number(bill) < 0 ? "border-[#c46b5c]" : "border-[#dedbd3]"}`}>
              <span className="px-1 text-xs font-black uppercase tracking-[.1em] text-black/45">Bill amount</span>
              <div className="mt-1 flex items-center">
                <span className="pl-1 text-base font-bold text-black/40" aria-hidden="true">₹</span>
                <input id="bill-amount" aria-label="Bill amount in rupees" aria-invalid={Number(bill) < 0} type="number" min="0" step="0.01" inputMode="decimal" value={bill} onChange={(e) => updateBill(Number(e.target.value))} className={inputClassName} />
              </div>
            </label>

            <label className={`block rounded-2xl border bg-white p-3 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)] ${Number(people) < 1 ? "border-[#c46b5c]" : "border-[#dedbd3]"}`}>
              <span className="px-1 text-xs font-black uppercase tracking-[.1em] text-black/45">People</span>
              <span className="mt-1 block px-1 text-xs leading-5 text-black/40">How many people are splitting equally.</span>
              <input id="bill-people" aria-label="Number of people" aria-invalid={Number(people) < 1} type="number" min="1" step="1" inputMode="numeric" value={people} onChange={(e) => updatePeople(Number(e.target.value))} className={`${inputClassName} mt-1 px-1`} />
            </label>

            <label className={`block rounded-2xl border bg-white p-3 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)] ${Number(tip) < 0 ? "border-[#c46b5c]" : "border-[#dedbd3]"}`}>
              <span className="px-1 text-xs font-black uppercase tracking-[.1em] text-black/45">Tip</span>
              <span className="mt-1 block px-1 text-xs leading-5 text-black/40">Optional percentage added before the split.</span>
              <div className="mt-1 flex items-center">
                <input id="bill-tip" aria-label="Tip percentage" aria-invalid={Number(tip) < 0} type="number" min="0" step="1" inputMode="numeric" value={tip} onChange={(e) => updateTip(Number(e.target.value))} className={`${inputClassName} px-1`} />
                <span className="pr-1 text-base font-bold text-black/40" aria-hidden="true">%</span>
              </div>
            </label>
          </div>

          {hasInvalidInput && <p className="mt-3 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3 text-xs font-semibold leading-5 text-[#7b3d31]" role="alert">Use a bill amount of 0 or more, at least 1 person, and a tip of 0% or more.</p>}
        </section>

        <section className="mt-8" aria-labelledby="split-results" aria-live="polite" aria-atomic="true">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">2. Your result</p>
              <h3 id="split-results" className="mt-1 text-base font-black">What each person pays</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-black/40">{result.safePeople} {result.safePeople === 1 ? "person" : "people"}</p>
              <button type="button" onClick={copyResult} disabled={hasInvalidInput} className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-40 ${copied ? "border-[#7aa33b] bg-[#f2f9df] text-[#416318]" : "border-[#d8d4c9] bg-white text-black/60 hover:border-[#171717] hover:text-black"}`} aria-label={copied ? "Bill split result copied" : "Copy bill split result"}>
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy result"}</span>
              </button>
            </div>
          </div>

          {copyError && <p className="mb-3 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3 text-xs font-semibold leading-5 text-[#7b3d31]" role="alert">Could not copy the result. Check your browser permissions and try again.</p>}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#dedbd3] bg-[#f3f0e8] p-4 sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/45">Total</p>
              <p className="mt-2 break-words text-2xl font-black tracking-[-.03em]">₹{result.total.toFixed(2)}</p>
              <p className="mt-1 text-xs text-black/40">Bill + tip</p>
            </div>
            <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-4 shadow-[0_5px_14px_rgba(23,23,23,.06)] sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/55">Each person</p>
              <p className="mt-2 break-words text-2xl font-black tracking-[-.03em]">₹{result.each.toFixed(2)}</p>
              <p className="mt-1 text-xs text-black/55">Equal share</p>
            </div>
            <div className="rounded-2xl border border-[#dedbd3] bg-[#f3f0e8] p-4 sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/45">Tip amount</p>
              <p className="mt-2 break-words text-2xl font-black tracking-[-.03em]">₹{result.tipAmount.toFixed(2)}</p>
              <p className="mt-1 text-xs text-black/40">At {result.safeTip}%</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-dashed border-[#d8d4c9] bg-[#faf9f6] p-4" aria-labelledby="quick-people-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p id="quick-people-heading" className="text-xs font-black uppercase tracking-[.1em] text-black/45">Quick people count</p>
              <p className="mt-1 text-xs leading-5 text-black/40">Pick a common group size.</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick number of people">
            {[2, 3, 4, 5, 6].map((count) => (
              <button key={count} type="button" aria-pressed={people === count} onClick={() => updatePeople(count)} className={`min-h-11 rounded-full border px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] ${people === count ? "border-[#171717] bg-[#171717] text-white" : "border-[#d0ccc2] bg-white hover:border-[#171717] hover:bg-[#f7f5ef]"}`}>
                {count} {count === 1 ? "person" : "people"}
              </button>
            ))}
          </div>
        </section>

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Calculated instantly in your browser. The split is equal, and the tip is added before dividing the total.</p>
      </div>
    </div>
  );
}
