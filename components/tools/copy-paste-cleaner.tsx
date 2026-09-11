"use client";

import { Check, Clipboard, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

function cleanCopiedContent(value: string) {
  const normalized = value.replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");
  const nonEmpty = lines.filter((line) => line.trim()).length;
  const markerLines = lines.filter((line) => /^\s*▎/.test(line)).length;
  const looksLikeClaudeCopy = markerLines > 0 && markerLines >= Math.max(1, Math.ceil(nonEmpty * 0.2));

  return lines
    .map((line) => {
      let next = line;
      if (looksLikeClaudeCopy) next = next.replace(/^\s*▎\s?/, "");
      next = next.replace(/[ \t]+$/g, "");
      return next;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function CopyPasteCleaner() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => cleanCopiedContent(text), [text]);

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
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
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#c8f169]"><Sparkles size={20} aria-hidden="true" /></span>
            <div className="min-w-0"><p className="font-bold">Make copied text ready to paste</p><p className="text-sm text-black/45">Remove Claude-style vertical copy markers and tidy spacing.</p></div>
          </div>
          <button type="button" onClick={clear} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium text-black/45 transition hover:bg-white hover:text-black" aria-label="Clear text"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Clear</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="copy-paste-cleaner-input" className="mb-2 block text-sm font-bold">Paste the copied content</label>
            <textarea id="copy-paste-cleaner-input" value={text} onChange={(event) => { setText(event.target.value); setCopied(false); }} placeholder="Paste the text you copied from Claude or another app here" className="min-h-80 w-full resize-y border border-[#cfcabf] bg-[#f8f5ed] p-4 text-base leading-7 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="copy-paste-cleaner-output" className="text-sm font-bold">Ready-to-paste text</label>
              <button type="button" onClick={copyResult} disabled={!result} className="flex min-h-10 items-center gap-2 rounded-md border border-[#cfcabf] px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-35 hover:bg-[#f3f0e8]">{copied ? <Check size={15} aria-hidden="true" /> : <Clipboard size={15} aria-hidden="true" />}{copied ? "Copied" : "Copy"}</button>
            </div>
            <textarea id="copy-paste-cleaner-output" value={result} readOnly placeholder="Your clean copy will appear here" className="min-h-80 w-full resize-y border border-[#cfcabf] bg-[#f3f0e8] p-4 text-base leading-7 outline-none" />
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-[#dedbd3] bg-[#faf9f6] px-4 py-3 text-xs leading-5 text-black/50"><strong className="text-black/70">What it changes:</strong> Claude-style ▎ prefixes are removed when they appear to be copy markers, trailing spaces are cleaned, and excessive blank lines are reduced. Your wording is not rewritten.</div>
        <p className="mt-3 text-xs leading-5 text-black/40">Processing happens in your browser. Nothing is sent to a server.</p>
      </div>
    </div>
  );
}
