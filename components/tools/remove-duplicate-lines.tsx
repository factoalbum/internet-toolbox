"use client";

import { Check, Copy, RotateCcw, Type } from "lucide-react";
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

  return (
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#c8f169]"><Type size={20} aria-hidden="true" /></span>
            <div className="min-w-0"><p className="font-bold">Remove duplicate lines</p><p className="text-sm text-black/45">Keep the first copy of each non-empty line.</p></div>
          </div>
          <button type="button" onClick={clear} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium text-black/45 transition hover:bg-white hover:text-black" aria-label="Clear text"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Clear</span></button>
        </div>
      </div>
      <div className="p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <div><label htmlFor="duplicate-lines-input" className="mb-2 block text-sm font-bold">Your lines</label><textarea id="duplicate-lines-input" value={text} onChange={(event) => { setText(event.target.value); setCopied(false); }} placeholder="Paste one item per line" className="min-h-72 w-full resize-y border border-[#cfcabf] bg-[#f8f5ed] p-4 text-base leading-7 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" /></div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="duplicate-lines-output" className="text-sm font-bold">Result</label><button type="button" onClick={copyResult} disabled={!result} className="flex min-h-10 items-center gap-2 rounded-md border border-[#cfcabf] px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-35 hover:bg-[#f3f0e8]">{copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copied ? "Copied" : "Copy"}</button></div>
            <textarea id="duplicate-lines-output" value={result} readOnly placeholder="Your unique lines will appear here" className="min-h-72 w-full resize-y border border-[#cfcabf] bg-[#f3f0e8] p-4 text-base leading-7 outline-none" />
          </div>
        </div>
        <p className="mt-4 text-xs leading-5 text-black/40">Processing happens in your browser. Nothing is sent to a server.</p>
      </div>
    </div>
  );
}
