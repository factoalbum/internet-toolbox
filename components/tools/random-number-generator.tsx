"use client";

import { Dices, RotateCcw } from "lucide-react";
import { useState } from "react";

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 100;
const DEFAULT_COUNT = 1;
const MAX_COUNT = 20;
const LIMIT = 1_000_000_000;

function randomInt(min: number, max: number) {
  const range = max - min + 1;
  const limit = Math.floor(0x100000000 / range) * range;
  const values = new Uint32Array(1);
  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);
  return min + (values[0] % range);
}

function generateNumbers(min: number, max: number, count: number, unique: boolean) {
  if (!unique) return Array.from({ length: count }, () => randomInt(min, max));
  const values = new Set<number>();
  while (values.size < count) values.add(randomInt(min, max));
  return [...values];
}

const inputClass = "mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-base font-semibold text-[#171717] outline-none transition hover:border-black/30 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] focus:ring-offset-1";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(String(DEFAULT_MIN));
  const [max, setMax] = useState(String(DEFAULT_MAX));
  const [count, setCount] = useState(String(DEFAULT_COUNT));
  const [unique, setUnique] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [error, setError] = useState("");

  function generate() {
    const lower = Number(min);
    const upper = Number(max);
    const amount = Number(count);
    if (![lower, upper, amount].every(Number.isInteger)) {
      setError("Enter whole numbers in all fields."); setNumbers([]); return;
    }
    if (lower < -LIMIT || upper > LIMIT || lower > upper) {
      setError(`Use a range from ${-LIMIT.toLocaleString()} to ${LIMIT.toLocaleString()}, with minimum no greater than maximum.`); setNumbers([]); return;
    }
    if (amount < 1 || amount > MAX_COUNT) {
      setError(`Generate between 1 and ${MAX_COUNT} numbers at a time.`); setNumbers([]); return;
    }
    if (unique && upper - lower + 1 < amount) {
      setError("The selected range is too small to generate that many unique numbers."); setNumbers([]); return;
    }
    setNumbers(generateNumbers(lower, upper, amount, unique)); setError("");
  }

  function reset() {
    setMin(String(DEFAULT_MIN)); setMax(String(DEFAULT_MAX)); setCount(String(DEFAULT_COUNT)); setUnique(false); setNumbers([]); setError("");
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="random-number-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3c9] text-[#58751d]" aria-hidden="true"><Dices size={21} /></span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#6d8e25]">Everyday utility</p>
              <h2 id="random-number-title" className="mt-1 text-xl font-black tracking-[-.025em]">Random number generator</h2>
              <p className="mt-1 max-w-xl text-sm leading-5 text-black/50">Choose a range and generate one or more cryptographically secure random numbers in your browser.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Reset random number generator"><RotateCcw size={15} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </header>

      <div className="grid gap-5 p-5 md:grid-cols-[1.05fr_.95fr] md:p-7">
        <div>
          <div className="mb-4"><p className="text-[11px] font-black uppercase tracking-[.15em] text-[#6d8e25]">1. Set the range</p><p className="mt-1 text-xs leading-5 text-black/45">Use whole numbers between −1 billion and 1 billion.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)]"><span className="text-sm font-bold">Minimum</span><span className="mt-1 block text-xs leading-5 text-black/45">Smallest possible number.</span><input aria-label="Minimum number" type="number" value={min} onChange={(event) => { setMin(event.target.value); setError(""); }} className={inputClass} /></label>
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)]"><span className="text-sm font-bold">Maximum</span><span className="mt-1 block text-xs leading-5 text-black/45">Largest possible number.</span><input aria-label="Maximum number" type="number" value={max} onChange={(event) => { setMax(event.target.value); setError(""); }} className={inputClass} /></label>
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 sm:col-span-2 focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)]"><span className="text-sm font-bold">How many numbers?</span><span className="mt-1 block text-xs leading-5 text-black/45">Generate 1–20 numbers at a time.</span><input aria-label="Number of random numbers" type="number" min="1" max={MAX_COUNT} step="1" value={count} onChange={(event) => { setCount(event.target.value); setError(""); }} className={inputClass} /></label>
          </div>

          <label className="mt-4 flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[#e2dfd7] bg-white px-4 py-3 text-sm font-semibold focus-within:ring-4 focus-within:ring-[#c8f169]/40"><input type="checkbox" checked={unique} onChange={(event) => { setUnique(event.target.checked); setError(""); }} className="size-4 accent-[#171717]" />Generate unique numbers only</label>
          <p className="mt-2 pl-1 text-xs leading-5 text-black/40">Unique mode requires the selected range to contain enough different values.</p>

          {error && <p className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3 text-sm font-semibold leading-5 text-[#7b3d31]" role="alert">{error}</p>}
          <button type="button" onClick={generate} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-black text-white transition hover:bg-black/85 focus:outline-none focus:ring-4 focus:ring-[#c8f169]"> <Dices size={16} aria-hidden="true" /> Generate numbers</button>
        </div>

        <aside className="flex min-h-full flex-col rounded-2xl border border-[#d8d4c9] bg-[#f6f3eb] p-5 md:p-6" aria-labelledby="random-result-title">
          <div className="flex items-center justify-between gap-3"><div><p className="text-[11px] font-black uppercase tracking-[.15em] text-[#6d8e25]">2. Your result</p><h3 id="random-result-title" className="mt-1 text-lg font-black">Generated numbers</h3></div><span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-black/50" aria-live="polite">{numbers.length ? `${numbers.length} generated` : "Waiting"}</span></div>
          <div className={`mt-4 flex min-h-40 flex-1 items-start rounded-2xl border p-4 transition ${numbers.length ? "border-[#171717] bg-[#c8f169]" : "border-dashed border-[#d8d4c9] bg-white"}`} aria-live="polite" aria-atomic="true">
            {numbers.length > 0 ? <div className="flex flex-wrap content-start gap-2">{numbers.map((number, index) => <output key={`${number}-${index}`} className="rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-xl font-black shadow-sm">{number.toLocaleString()}</output>)}</div> : <div><p className="text-sm font-bold">Nothing generated yet</p><p className="mt-1 text-sm leading-6 text-black/45">Set your range, then choose Generate numbers.</p></div>}
          </div>
          <p className="mt-4 text-xs leading-5 text-black/50"><strong className="text-black/70">Local and secure:</strong> numbers are generated with your browser&apos;s cryptographically secure random number generator. Nothing is uploaded or stored.</p>
        </aside>
      </div>
    </section>
  );
}
