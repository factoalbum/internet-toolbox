"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

function createUuid() {
  return crypto.randomUUID();
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, createUuid));
  const [copied, setCopied] = useState<string | null>(null);

  function generate() {
    setUuids(Array.from({ length: count }, createUuid));
    setCopied(null);
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1400);
  }

  async function copyAll() {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopied("all");
    window.setTimeout(() => setCopied(null), 1400);
  }

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="flex flex-col gap-4 border-b border-[#d8d4c9] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label htmlFor="uuid-count" className="block text-sm font-semibold">How many UUIDs?</label>
          <select
            id="uuid-count"
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="mt-2 min-h-11 rounded-md border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717]"
          >
            {[1, 5, 10, 20].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={generate} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#171717] px-4 text-sm font-semibold text-white transition hover:bg-black/80">
            <RefreshCw size={15} /> Generate
          </button>
          <button type="button" onClick={copyAll} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#bcb8ae] px-4 text-sm font-semibold transition hover:bg-black/5">
            <Copy size={15} /> {copied === "all" ? "Copied" : "Copy all"}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-2" aria-live="polite">
        {uuids.map((uuid) => (
          <div key={uuid} className="flex items-center gap-3 border border-[#e2ded3] bg-[#f3f0e8] p-3">
            <code className="min-w-0 flex-1 break-all font-mono text-xs leading-6 text-black/75 md:text-sm">{uuid}</code>
            <button
              type="button"
              onClick={() => copy(uuid)}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border border-[#bcb8ae] bg-[#fffdf8] px-3 text-xs font-semibold transition hover:bg-white"
              aria-label={`Copy ${uuid}`}
            >
              <Copy size={14} /> <span className="hidden sm:inline">{copied === uuid ? "Copied" : "Copy"}</span>
            </button>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-black/45">UUIDs are generated locally in your browser using the built-in cryptographic random UUID generator.</p>
    </div>
  );
}
