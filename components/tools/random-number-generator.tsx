"use client";

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
      setError("Enter whole numbers in all fields.");
      setNumbers([]);
      return;
    }
    if (lower < -LIMIT || upper > LIMIT || lower > upper) {
      setError(`Use a range from ${-LIMIT.toLocaleString()} to ${LIMIT.toLocaleString()}, with minimum no greater than maximum.`);
      setNumbers([]);
      return;
    }
    if (amount < 1 || amount > MAX_COUNT) {
      setError(`Generate between 1 and ${MAX_COUNT} numbers at a time.`);
      setNumbers([]);
      return;
    }
    if (unique && upper - lower + 1 < amount) {
      setError("The selected range is too small to generate that many unique numbers.");
      setNumbers([]);
      return;
    }

    setNumbers(generateNumbers(lower, upper, amount, unique));
    setError("");
  }

  function reset() {
    setMin(String(DEFAULT_MIN));
    setMax(String(DEFAULT_MAX));
    setCount(String(DEFAULT_COUNT));
    setUnique(false);
    setNumbers([]);
    setError("");
  }

  return (
    <section className="grid gap-6 md:grid-cols-[1.15fr_.85fr]" aria-label="Random number generator">
      <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          {[["Minimum", min, setMin], ["Maximum", max, setMax], ["How many", count, setCount]].map(([label, value, setter], index) => (
            <label key={String(label)} className={index === 2 ? "sm:col-span-2" : ""}>
              <span className="text-sm font-bold">{String(label)}</span>
              <input type="number" value={String(value)} onChange={(event) => (setter as (value: string) => void)(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#d8d4c9] bg-[#f8f5ed] px-3 text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" />
            </label>
          ))}
        </div>

        <label className="mt-5 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={unique} onChange={(event) => setUnique(event.target.checked)} className="size-4 accent-[#171717]" />
          Generate unique numbers only
        </label>

        {error && <p className="mt-5 rounded-md border border-[#171717] bg-[#f8f5ed] p-3 text-sm font-medium" role="alert">{error}</p>}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={generate} className="min-h-12 flex-1 rounded-md bg-[#c8f169] px-5 text-sm font-black focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2">Generate numbers</button>
          <button type="button" onClick={reset} className="min-h-12 rounded-md border border-[#d8d4c9] bg-[#f8f5ed] px-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2">Reset</button>
        </div>
      </div>

      <aside className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/40">Your result</p>
        <div className="mt-3 min-h-32 rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] p-4" aria-live="polite">
          {numbers.length > 0 ? <div className="flex flex-wrap gap-2">{numbers.map((number, index) => <output key={`${number}-${index}`} className="rounded-md border border-[#d8d4c9] bg-[#fffdf8] px-3 py-2 font-mono text-lg font-bold">{number.toLocaleString()}</output>)}</div> : <p className="text-sm text-black/45">Your generated number will appear here.</p>}
        </div>
        <p className="mt-5 text-sm leading-6 text-black/55">Generated locally with your browser&apos;s cryptographically secure random number generator. Nothing is uploaded or stored.</p>
      </aside>
    </section>
  );
}
