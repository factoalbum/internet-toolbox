"use client";

import { Check, Copy, RotateCcw, ListX } from "lucide-react";
import { useMemo, useState } from "react";

function removeDuplicateLines(value: string) {
  const seen = new Set<string>();
  return value.replace(/\r\n?/g, "\n").split("\n").filter((line) => {
    const key = line.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).join("\n").trim();
}

export default function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => removeDuplicateLines(text), [text]);

  const stats = useMemo(() => {
    const lines = text.replace(/\r\n?/g, "\n").split("\n").filter((line) => line.trim());
    const unique = result ? result.split("\n").filter(Boolean).length : 0;
    return { lines: lines.length, unique, removed: Math.max(0, lines.length - unique) };
  }, [text, result]);

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  function clear() {
    setText("");
    setCopied(false);
  }

  const focusRing = "focus:outline-none focus:ring-4 focus:ring-[#c8f169]";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true">
              <ListX size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Keep one copy of each line</p>
              <p className="text-sm leading-5 text-black/50">Remove repeated non-empty lines while keeping their first occurrence.</p>
            </div>
          </div>
          <button type="button" onClick={clear} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3.5 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Clear text">
            <RotateCcw size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-[#e2dfd7] bg-white p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="duplicate-lines-input" className="text-sm font-bold">Your lines</label>
              <span className="text-[11px] font-semibold text-black/35">{stats.lines.toLocaleString()} non-empty</span>
            </div>
            <textarea id="duplicate-lines-input" value={text} onChange={(event) => { setText(event.target.value); setCopied(false); }} placeholder="Paste one item per line" aria-describedby="duplicate-lines-help" className={`min-h-72 w-full resize-y rounded-xl border border-[#bcb8ae] bg-[#fffdf8] p-4 text-base leading-7 text-[#171717] outline-none transition placeholder:text-black/25 focus:border-[#171717] ${focusRing}`} />
            <p id="duplicate-lines-help" className="mt-2 text-xs leading-5 text-black/40">Blank lines are ignored. Matching is case-sensitive after surrounding whitespace is trimmed.</p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[#e2dfd7] bg-white p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <label htmlFor="duplicate-lines-output" className="text-sm font-bold">Unique lines</label>
                <p className="mt-1 text-xs leading-5 text-black/40">The cleaned result updates as you type.</p>
              </div>
              <button type="button" onClick={copyResult} disabled={!result} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3.5 text-xs font-bold transition hover:border-[#171717] hover:bg-[#f7f5ef] disabled:cursor-not-allowed disabled:opacity-35 ${focusRing}`} aria-label={copied ? "Unique lines copied" : "Copy unique lines"}>
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <textarea id="duplicate-lines-output" value={result} readOnly placeholder="Your unique lines will appear here" aria-label="Unique lines result" className="min-h-72 w-full resize-y rounded-xl border border-[#d8d4c9] bg-[#f3f0e8] p-4 text-base leading-7 text-[#171717] outline-none placeholder:text-black/25" />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-black/40" aria-live="polite" aria-atomic="true">
              <span>{stats.unique.toLocaleString()} unique {stats.unique === 1 ? "line" : "lines"}</span>
              {stats.removed > 0 ? <span className="font-bold text-[#6d8e25]">{stats.removed.toLocaleString()} duplicates removed</span> : <span>No duplicates found</span>}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#e1e6d3] bg-[#f5f8eb] px-4 py-3 text-xs leading-5 text-[#52691f]">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/80" aria-hidden="true"><ListX size={14} /></span>
          <p>Processing happens in your browser. Nothing is sent to a server.</p>
        </div>
      </div>
    </div>
  );
}
