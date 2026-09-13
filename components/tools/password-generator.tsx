"use client";

import { KeyRound, RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}:;.?,";
const DEFAULT_LENGTH = 16;

function randomIndex(max: number) {
  const limit = Math.floor(0x100000000 / max) * max;
  const values = new Uint32Array(1);
  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);
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
  const [copyError, setCopyError] = useState("");

  const strength = useMemo(() => {
    const score = Number(length >= 12) + Number(length >= 16) + Number(useUpper) + Number(useNumbers) + Number(useSymbols);
    if (score >= 5) return "Strong";
    if (score >= 3) return "Good";
    return "Basic";
  }, [length, useUpper, useNumbers, useSymbols]);

  function generate() {
    setPassword(createPassword(length, useUpper, useNumbers, useSymbols));
    setCopied(false);
    setCopyError("");
  }

  async function copyPassword() {
    if (!password) return;
    setCopyError("");
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
      setCopyError("Copying was blocked by your browser. Select the password and copy it manually.");
    }
  }

  function reset() {
    setLength(DEFAULT_LENGTH);
    setUseUpper(true);
    setUseNumbers(true);
    setUseSymbols(true);
    setPassword("");
    setCopied(false);
    setCopyError("");
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="password-workspace-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true">
              <KeyRound size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.14em] text-black/40">Security utility</p>
              <h2 id="password-workspace-title" className="mt-1 text-xl font-black tracking-tight text-[#171717] md:text-2xl">Generate a secure password</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/55">Create a strong, random password locally in your browser. Nothing is uploaded or saved.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/60 transition hover:border-[#171717] hover:text-[#171717] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60" aria-label="Reset password generator">
            <RotateCcw size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <div className="grid gap-5 p-5 md:grid-cols-[1.15fr_.85fr] md:p-7">
        <div className="rounded-2xl border border-[#ddd9cf] bg-white p-4 md:p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <label htmlFor="generated-password" className="text-sm font-black text-[#171717]">Generated password</label>
              <p className="mt-1 text-xs leading-5 text-black/45">Generate only when you are ready to use it.</p>
            </div>
            <span className="rounded-full bg-[#e8f1ff] px-2.5 py-1 text-[11px] font-bold text-[#315fba]">Local only</span>
          </div>

          <div className="mt-4 rounded-xl border border-[#d8d4c9] bg-[#f8f5ed] p-3">
            <output id="generated-password" aria-label="Generated password" aria-live="polite" className="block min-h-14 overflow-x-auto break-all rounded-lg border border-[#d8d4c9] bg-white px-3 py-3 font-mono text-sm font-semibold leading-6 tracking-wide text-[#171717]">
              {password || "Your password will appear here"}
            </output>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-black/50" aria-live="polite">Strength: <span className="font-bold text-black">{strength}</span></p>
              <button type="button" onClick={copyPassword} disabled={!password} className="min-h-11 rounded-lg border border-[#171717] bg-[#171717] px-4 text-sm font-bold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60" aria-label={copied ? "Password copied" : "Copy generated password"}>
                {copied ? "Copied" : "Copy password"}
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-[#e2dfd7] pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <label htmlFor="password-length" className="text-sm font-bold">Password length</label>
                <p className="mt-1 text-xs text-black/45">Longer passwords are harder to guess.</p>
              </div>
              <output htmlFor="password-length" className="rounded-full border border-[#d8d4c9] bg-[#f8f5ed] px-3 py-1 font-mono text-xs font-bold" aria-label={`Password length ${length}`}>{length}</output>
            </div>
            <input id="password-length" type="range" min="8" max="64" value={length} onChange={(event) => { setLength(Number(event.target.value)); setCopied(false); setCopyError(""); }} aria-describedby="password-length-range" className="mt-4 h-5 w-full cursor-pointer accent-[#171717] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60" />
            <div id="password-length-range" className="mt-1 flex justify-between text-xs text-black/40"><span>8</span><span>64</span></div>
          </div>

          <fieldset className="mt-6 border-t border-[#e2dfd7] pt-6">
            <legend className="text-sm font-bold">Include in the password</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                ["Uppercase letters", useUpper, setUseUpper],
                ["Numbers", useNumbers, setUseNumbers],
                ["Symbols", useSymbols, setUseSymbols],
              ].map(([label, checked, setter]) => (
                <label key={String(label)} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#d8d4c9] bg-[#f8f5ed] px-3 text-sm font-medium transition hover:border-[#171717] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#c8f169]/60">
                  <input type="checkbox" checked={Boolean(checked)} onChange={(event) => { (setter as (value: boolean) => void)(event.target.checked); setCopied(false); setCopyError(""); }} className="size-4 shrink-0 accent-[#171717]" />
                  {String(label)}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={generate} className="min-h-12 flex-1 rounded-xl bg-[#c8f169] px-5 text-sm font-black text-[#171717] transition hover:bg-[#b9e85b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#171717]/20">Generate password</button>
            <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-[#d8d4c9] bg-[#f8f5ed] px-5 text-sm font-bold text-[#171717] transition hover:border-[#171717] hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60">Reset</button>
          </div>

          {copyError && <p className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3 text-sm leading-6 text-[#7b3d31]" role="alert">{copyError}</p>}
        </div>

        <aside className="rounded-2xl border border-[#d8d4c9] bg-[#f4f1e9] p-5 md:p-6" aria-labelledby="password-privacy-title">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#dff4bd] text-[#536b1c]" aria-hidden="true"><ShieldCheck size={20} /></div>
          <p className="mt-4 text-xs font-black uppercase tracking-[.14em] text-black/40">Private by design</p>
          <h2 id="password-privacy-title" className="mt-2 text-xl font-black tracking-tight">Your password stays in your browser.</h2>
          <p className="mt-3 text-sm leading-6 text-black/55">Passwords are generated locally with your browser&apos;s cryptographically secure random number generator. Internet Toolbox does not upload or save them.</p>
          <div className="mt-6 border-t border-[#d8d4c9] pt-5 text-sm leading-6 text-black/55">
            <p><span className="font-bold text-black">Good practice:</span> Use a unique password for every important account. A password manager makes unique passwords easier to manage.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
