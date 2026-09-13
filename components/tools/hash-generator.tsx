"use client";

import { useState } from "react";

const algorithms = ["SHA-256", "SHA-384", "SHA-512"] as const;

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<(typeof algorithms)[number]>("SHA-256");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  async function generateHash() {
    if (!input) {
      setHash("");
      setCopyState("idle");
      setError("Enter some text to hash.");
      return;
    }
    try {
      const bytes = new TextEncoder().encode(input);
      const digest = await crypto.subtle.digest(algorithm, bytes);
      const value = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
      setHash(value);
      setCopyState("idle");
      setError("");
    } catch {
      setHash("");
      setCopyState("idle");
      setError("The browser could not generate this hash. Try again or use a supported browser.");
    }
  }

  async function copyHash() {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopyState("copied");
      setError("");
    } catch {
      setCopyState("idle");
      setError("Copy was blocked by the browser. Select the hash and copy it manually.");
    }
  }

  function clearAll() {
    setInput("");
    setHash("");
    setError("");
    setCopyState("idle");
  }

  const byteLength = new TextEncoder().encode(input).length;

  return (
    <div className="space-y-5 p-5 md:p-6">
      <header className="flex flex-col gap-3 rounded-2xl border border-[#e3dfd5] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[.14em] text-[#6d8e25]">Security utility</p>
          <h3 className="mt-1 text-base font-black tracking-[-.02em]">Create a SHA hash from text</h3>
          <p className="mt-1 text-xs leading-5 text-black/45">Choose an algorithm, enter your text, then generate a fixed-length digest locally.</p>
        </div>
        <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-[#eef4dc] px-3 py-1.5 text-[11px] font-bold text-[#52691f]">Local processing</span>
      </header>

      <section className="rounded-2xl border border-[#e0ddd5] bg-[#fffdf8] p-4 sm:p-5" aria-labelledby="hash-input-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <label htmlFor="hash-input" id="hash-input-heading" className="text-sm font-bold">Text to hash</label>
            <p className="mt-1 text-xs leading-5 text-black/45">Hashes are sensitive to every character, including spaces and line breaks.</p>
          </div>
          <span className="text-xs font-semibold text-black/40" aria-live="polite">{byteLength} bytes</span>
        </div>
        <textarea
          id="hash-input"
          value={input}
          onChange={(event) => { setInput(event.target.value); setError(""); setCopyState("idle"); }}
          rows={7}
          placeholder="Enter the text you want to hash..."
          aria-describedby="hash-input-help"
          aria-invalid={Boolean(error)}
          className="mt-3 w-full resize-y rounded-2xl border border-[#d8d5cc] bg-[#fcfbf8] p-4 text-sm leading-6 text-[#171717] outline-none transition placeholder:text-black/30 focus:border-[#6d8e25] focus:ring-4 focus:ring-[#c8f169]"
        />
        <p id="hash-input-help" className="mt-2 text-xs leading-5 text-black/40">Nothing is uploaded. The Web Crypto API performs the digest in your browser.</p>
      </section>

      <section className="rounded-2xl border border-[#e0ddd5] bg-[#f5f2ea] p-4 sm:p-5" aria-labelledby="hash-options-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 id="hash-options-heading" className="text-sm font-bold">Choose an algorithm</h2>
            <p className="mt-1 text-xs leading-5 text-black/45">All options create hexadecimal SHA digests.</p>
          </div>
          <div className="grid grid-cols-3 rounded-xl border border-[#d8d5cc] bg-white p-1" role="group" aria-label="Hash algorithm">
            {algorithms.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={algorithm === item}
                onClick={() => { setAlgorithm(item); setCopyState("idle"); }}
                className={`min-h-11 rounded-lg px-3 text-xs font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] ${algorithm === item ? "bg-[#171717] text-white shadow-sm" : "text-black/55 hover:bg-[#f4f2ec] hover:text-black"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={generateHash} className="min-h-11 rounded-xl bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black/85 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]">Generate hash</button>
          <button type="button" onClick={clearAll} disabled={!input && !hash && !error} className="min-h-11 rounded-xl border border-[#d5d1c8] bg-white px-5 text-sm font-bold text-black/65 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]">Clear</button>
        </div>
      </section>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">{error}</p>}

      {hash ? (
        <section aria-labelledby="hash-result" aria-live="polite" className="rounded-2xl border border-[#dfe7c8] bg-[#f4f8e9] p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-[#6d8e25]">Result</p>
              <h2 id="hash-result" className="mt-1 text-sm font-black">{algorithm} hash</h2>
            </div>
            <button type="button" onClick={copyHash} className="min-h-11 rounded-xl border border-[#cfd8b5] bg-white px-4 text-xs font-bold transition hover:border-[#6d8e25] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]">{copyState === "copied" ? "Copied" : "Copy hash"}</button>
          </div>
          <code className="mt-4 block overflow-x-auto break-all rounded-xl border border-[#dfe4d0] bg-white p-4 text-xs leading-6 text-[#3e4b24]">{hash}</code>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-black/45">
            <span>{hash.length} hexadecimal characters</span>
            <span>{algorithm} digest</span>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[#cbc7bd] bg-[#faf8f2] px-5 py-8 text-center" aria-label="Hash result is empty">
          <p className="text-sm font-bold text-black/65">Your hash will appear here</p>
          <p className="mt-1 text-xs leading-5 text-black/40">Enter text above and choose Generate hash.</p>
        </section>
      )}

      <aside className="rounded-xl border border-[#e3e0d8] bg-white px-4 py-3 text-xs leading-5 text-black/45">
        <strong className="font-bold text-black/65">Good to know:</strong> Hashes are one-way digests, not encryption. A hash can help compare data without exposing the original text, but it does not prove where that data came from.
      </aside>
    </div>
  );
}
