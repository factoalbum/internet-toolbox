"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

function createUuid() {
  return crypto.randomUUID();
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState("");

  function generate() {
    setUuids(Array.from({ length: count }, createUuid));
    setCopied(null);
    setCopyError("");
  }

  async function copy(value: string, label: string) {
    setCopyError("");
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      setCopied(null);
      setCopyError("Copying was blocked by your browser. Select the UUID and copy it manually.");
    }
  }

  return (
    <div className="bg-[#faf9f6] p-1 sm:p-2">
      <div className="rounded-2xl border border-[#dedbd3] bg-[#fffdf8] p-4 shadow-[0_8px_24px_rgba(23,23,23,.035)] sm:p-5 md:p-6">
        <div className="flex flex-col gap-5 border-b border-[#e3dfd5] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.14em] text-[#6d8e25]">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#e9f1d8]" aria-hidden="true"><RefreshCw size={13} /></span>
              UUID generator
            </div>
            <h3 className="mt-2 text-xl font-black tracking-[-.03em] sm:text-2xl">Generate unique IDs in seconds</h3>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-black/50">Create cryptographically random UUID v4 values locally in your browser. Choose how many you need, then copy one or all.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-52 sm:flex-row sm:items-end">
            <label htmlFor="uuid-count" className="min-w-0 flex-1 sm:flex-none">
              <span className="text-[10px] font-black uppercase tracking-[.12em] text-black/45">Number of UUIDs</span>
              <select
                id="uuid-count"
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] sm:w-28"
              >
                {[1, 5, 10, 20].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <button
              type="button"
              onClick={generate}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-bold text-white transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
            >
              <RefreshCw size={15} aria-hidden="true" /> {uuids.length ? "Generate" : "Generate UUIDs"}
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/40">Generated results</p>
            <p className="mt-1 text-sm font-semibold">{uuids.length ? `${uuids.length} UUID${uuids.length === 1 ? "" : "s"} ready to use` : "Choose a quantity and generate your UUIDs"}</p>
          </div>
          {uuids.length > 0 && (
            <button
              type="button"
              onClick={() => copy(uuids.join("\n"), "all")}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#bcb8ae] bg-white px-4 text-sm font-bold transition hover:border-[#171717] hover:bg-[#faf8f2] focus:outline-none focus:ring-4 focus:ring-[#c8f169] sm:w-auto"
            >
              <Copy size={15} aria-hidden="true" /> {copied === "all" ? "Copied all" : "Copy all"}
            </button>
          )}
        </div>

        {uuids.length > 0 ? (
          <div className="mt-3 space-y-2" aria-live="polite" aria-label="Generated UUIDs">
            {uuids.map((uuid, index) => (
              <div key={uuid} className="flex min-w-0 items-center gap-2 rounded-xl border border-[#e2ded3] bg-[#f3f0e8] p-2.5 sm:gap-3 sm:p-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-black text-black/40" aria-hidden="true">{index + 1}</span>
                <code className="min-w-0 flex-1 break-all font-mono text-xs leading-6 text-black/75 sm:text-sm">{uuid}</code>
                <button
                  type="button"
                  onClick={() => copy(uuid, uuid)}
                  className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-3 text-xs font-bold transition hover:border-[#171717] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
                  aria-label={`Copy UUID ${index + 1}`}
                >
                  <Copy size={14} aria-hidden="true" /> <span className="hidden sm:inline">{copied === uuid ? "Copied" : "Copy"}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-dashed border-[#d8d4c9] bg-[#faf9f6] px-5 py-8 text-center">
            <p className="text-sm font-bold text-[#171717]">No UUIDs generated yet</p>
            <p className="mt-1 text-xs leading-5 text-black/45">Generation starts only when you press the button, so the page stays hydration-safe and predictable.</p>
          </div>
        )}

        {copyError && <p role="alert" className="mt-3 rounded-xl border border-[#ead9c8] bg-[#fff7ed] px-3 py-2.5 text-xs font-medium leading-5 text-[#7b4a20]">{copyError}</p>}

        <div className="mt-5 flex flex-col gap-2 border-t border-[#e3dfd5] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-black/45">Generated locally with your browser&apos;s built-in cryptographic UUID generator. Nothing is uploaded.</p>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#e9f1d8] px-3 py-1.5 text-[10px] font-bold text-[#52691f]">Local processing</span>
        </div>
      </div>
    </div>
  );
}
