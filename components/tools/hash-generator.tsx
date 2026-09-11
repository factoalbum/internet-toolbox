"use client";

import { useState } from "react";

const algorithms = ["SHA-256", "SHA-384", "SHA-512"] as const;

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<(typeof algorithms)[number]>("SHA-256");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");

  async function generateHash() {
    if (!input) {
      setHash("");
      setError("Enter some text to hash.");
      return;
    }
    try {
      const bytes = new TextEncoder().encode(input);
      const digest = await crypto.subtle.digest(algorithm, bytes);
      const value = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
      setHash(value);
      setError("");
    } catch {
      setHash("");
      setError("The browser could not generate this hash. Try again or use a supported browser.");
    }
  }

  async function copyHash() {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
    } catch {
      setError("Copy was blocked by the browser. Select the hash and copy it manually.");
    }
  }

  return (
    <div className="space-y-5 p-5 md:p-6">
      <div>
        <label htmlFor="hash-input" className="text-sm font-bold">Text to hash</label>
        <textarea id="hash-input" value={input} onChange={(event) => { setInput(event.target.value); setError(""); }} rows={6} placeholder="Enter the text you want to hash..." className="mt-2 w-full resize-y rounded-2xl border border-[#d8d5cc] bg-[#fcfbf8] p-4 text-sm leading-6 outline-none transition focus:border-[#6d8e25] focus:ring-4 focus:ring-[#c8f169]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <label htmlFor="hash-algorithm" className="text-sm font-bold">Hash algorithm</label>
          <select id="hash-algorithm" value={algorithm} onChange={(event) => setAlgorithm(event.target.value as (typeof algorithms)[number])} className="mt-2 min-h-11 w-full rounded-xl border border-[#d8d5cc] bg-white px-3 text-sm font-semibold outline-none focus:border-[#6d8e25] focus:ring-4 focus:ring-[#c8f169]">
            {algorithms.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <button type="button" onClick={generateHash} className="min-h-11 rounded-xl bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Generate hash</button>
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      {hash && <section aria-labelledby="hash-result" className="rounded-2xl border border-[#dfe7c8] bg-[#f4f8e9] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="hash-result" className="text-sm font-black">{algorithm} result</h2><button type="button" onClick={copyHash} className="min-h-10 rounded-lg border border-[#cfd8b5] bg-white px-3 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Copy hash</button></div>
        <code className="mt-3 block break-all rounded-xl border border-[#dfe4d0] bg-white p-4 text-xs leading-6 text-[#3e4b24]">{hash}</code>
      </section>}
      <p className="text-xs leading-5 text-black/45">Hashes are one-way digests, not encryption. This tool processes the text locally in your browser and does not verify that a hash belongs to a particular file or source.</p>
    </div>
  );
}
