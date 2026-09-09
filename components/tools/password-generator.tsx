"use client";

import { useMemo, useState } from "react";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}:;,.?";
const DEFAULT_LENGTH = 16;

function randomIndex(max: number) {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % max;
}

function createPassword(length: number, useUpper: boolean, useNumbers: boolean, useSymbols: boolean) {
  const pools = [LOWER];
  if (useUpper) pools.push(UPPER);
  if (useNumbers) pools.push(NUMBERS);
  if (useSymbols) pools.push(SYMBOLS);

  const all = pools.join("");
  const required = pools.map((pool) => pool[randomIndex(pool.length)]);
  const result = [...required];
  while (result.length < length) result.push(all[randomIndex(all.length)]);

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result.join("");
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(DEFAULT_LENGTH);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const strength = useMemo(() => {
    const score = Number(length >= 12) + Number(length >= 16) + Number(useUpper) + Number(useNumbers) + Number(useSymbols);
    if (score >= 5) return "Strong";
    if (score >= 3) return "Good";
    return "Basic";
  }, [length, useUpper, useNumbers, useSymbols]);

  function generate() {
    const next = createPassword(length, useUpper, useNumbers, useSymbols);
    setPassword(next);
    setCopied(false);
  }

  async function copyPassword() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLength(DEFAULT_LENGTH);
    setUseUpper(true);
    setUseNumbers(true);
    setUseSymbols(true);
    setPassword("");
    setCopied(false);
  }

  return (
    <section className="grid gap-6 md:grid-cols-[1.15fr_.85fr]" aria-label="Password generator">
      <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7">
        <div className="rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] p-4">
          <label htmlFor="generated-password" className="text-xs font-bold uppercase tracking-[0.12em] text-black/45">Generated password</label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <output id="generated-password" aria-label="Generated password" className="min-h-12 flex-1 overflow-x-auto rounded-md border border-[#d8d4c9] bg-[#fffdf8] px-3 py-3 font-mono text-sm font-semibold tracking-wide">{password || "Click Generate password"}</output>
            <button type="button" onClick={copyPassword} disabled={!password} className="min-h-12 rounded-md bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#c8f169] focus:ring-offset-2">{copied ? "Copied" : "Copy"}</button>
          </div>
          <p className="mt-3 text-xs text-black/50" aria-live="polite">Strength: <span className="font-bold text-black">{strength}</span></p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="password-length" className="text-sm font-bold">Password length</label>
            <span className="rounded-full border border-[#d8d4c9] bg-[#f8f5ed] px-3 py-1 font-mono text-xs font-bold">{length}</span>
          </div>
          <input id="password-length" type="range" min="8" max="64" value={length} onChange={(event) => setLength(Number(event.target.value))} className="mt-4 w-full accent-[#171717]" />
          <div className="mt-1 flex justify-between text-xs text-black/40"><span>8</span><span>64</span></div>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-bold">Include</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[["Uppercase letters", useUpper, setUseUpper], ["Numbers", useNumbers, setUseNumbers], ["Symbols", useSymbols, setUseSymbols]].map(([label, checked, setter]) => (
              <label key={String(label)} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-[#d8d4c9] bg-[#f8f5ed] px-3 text-sm font-medium">
                <input type="checkbox" checked={Boolean(checked)} onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)} className="size-4 accent-[#171717]" />
                {String(label)}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={generate} className="min-h-12 flex-1 rounded-md bg-[#c8f169] px-5 text-sm font-black text-[#171717] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2">Generate password</button>
          <button type="button" onClick={reset} className="min-h-12 rounded-md border border-[#d8d4c9] bg-[#f8f5ed] px-5 text-sm font-bold transition hover:border-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2">Reset</button>
        </div>
      </div>

      <aside className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/40">Private by design</p>
        <h2 className="mt-3 text-xl font-black tracking-tight">Your password stays in your browser.</h2>
        <p className="mt-3 text-sm leading-6 text-black/55">Passwords are generated locally with your browser&apos;s cryptographically secure random number generator. Nothing is uploaded or saved by Internet Toolbox.</p>
        <div className="mt-6 border-t border-[#d8d4c9] pt-5 text-sm leading-6 text-black/55">
          <p><span className="font-bold text-black">Tip:</span> Use a unique password for every important account. For critical accounts, a password manager is usually safer than reusing passwords.</p>
        </div>
      </aside>
    </section>
  );
}
