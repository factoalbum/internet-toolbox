"use client";

import { Copy, RotateCcw, Check, Type } from "lucide-react";
import { useMemo, useState } from "react";

function cleanText(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function TextCleaner() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => cleanText(text), [text]);
  const inputCharacters = text.length;
  const resultCharacters = result.length;

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function clear() {
    setText("");
    setCopied(false);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#dedbd3] bg-white">
      <div className="border-b border-[#e8e5dd] bg-[#fbfaf6] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f4c9] text-[#435816]" aria-hidden="true"><Type size={20} /></span>
            <div className="min-w-0">
              <p className="text-sm font-black">Clean up your text</p>
              <p className="mt-1 max-w-xl text-xs leading-5 text-black/45">Remove extra spaces and blank lines from pasted text. The cleaned version updates as you type.</p>
            </div>
          </div>
          <button type="button" onClick={clear} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#dedbd3] bg-white px-3.5 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Clear text">
            <RotateCcw size={15} aria-hidden="true" /><span>Clear</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="text-cleaner-input" className="text-sm font-black">Your text</label>
              <span className="text-[11px] font-semibold text-black/35">{inputCharacters.toLocaleString()} characters</span>
            </div>
            <textarea id="text-cleaner-input" value={text} onChange={(event) => { setText(event.target.value); setCopied(false); }} placeholder="Paste text here" aria-describedby="text-cleaner-help" className="min-h-72 w-full resize-y rounded-2xl border border-[#cfcabf] bg-[#faf9f6] p-4 text-base leading-7 text-[#171717] outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
            <p id="text-cleaner-help" className="mt-2 text-xs leading-5 text-black/40">Extra spaces are reduced and runs of three or more blank lines become one blank line.</p>
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="text-cleaner-output" className="text-sm font-black">Cleaned text</label>
              <button type="button" onClick={copyResult} disabled={!result} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#dedbd3] bg-white px-3.5 text-xs font-black transition hover:border-[#171717] hover:bg-[#faf9f6] disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea id="text-cleaner-output" value={result} readOnly aria-describedby="text-cleaner-result-help" placeholder="Your cleaned text will appear here" className="min-h-72 w-full resize-y rounded-2xl border border-[#cfcabf] bg-[#f3f5ec] p-4 text-base leading-7 text-[#171717] outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
            <div id="text-cleaner-result-help" className="mt-2 flex items-center justify-between gap-3 text-xs text-black/40" aria-live="polite">
              <span>{result ? `${resultCharacters.toLocaleString()} characters after cleaning` : "No text to clean yet"}</span>
              {text && result !== text ? <span className="font-semibold text-[#6d8e25]">Cleaned</span> : null}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-[#e1e6d3] bg-[#f5f8eb] px-4 py-3 text-xs leading-5 text-[#52691f] sm:flex-row sm:items-center sm:justify-between">
          <span>Processing happens in your browser. Nothing is sent to a server.</span>
          <span className="shrink-0 font-bold">Private by default</span>
        </div>
      </div>
    </div>
  );
}
