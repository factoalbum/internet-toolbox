"use client";

import { Check, Clipboard, ClipboardPaste, RotateCcw } from "lucide-react";
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

const focusRing = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

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
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="copy-paste-cleaner-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f3c9] text-[#58751d]" aria-hidden="true">
              <ClipboardPaste size={21} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.14em] text-[#6d8e25]">Text utility</p>
              <h2 id="copy-paste-cleaner-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] sm:text-2xl">Clean copied text</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/50">Remove copy markers and tidy spacing without changing your wording.</p>
            </div>
          </div>
          <button type="button" onClick={clear} disabled={!text} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d0ccc2] bg-white px-3.5 text-sm font-bold text-[#171717] transition hover:border-[#171717] hover:bg-[#f7f5ef] ${focusRing} disabled:cursor-not-allowed disabled:opacity-40`} aria-label="Clear text">
            <RotateCcw size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      <div className="p-5 sm:p-7 md:p-8">
        <section aria-labelledby="copy-paste-input-heading">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Your text</p>
            <h3 id="copy-paste-input-heading" className="mt-1 text-base font-black text-[#171717]">Paste the copied content</h3>
            <p className="mt-1 text-sm leading-5 text-black/45">Paste text from Claude or another app. Cleaning happens as you type.</p>
          </div>

          <label className="block rounded-2xl border border-[#dedbd3] bg-white p-3 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)]">
            <span className="sr-only">Copied content</span>
            <textarea
              id="copy-paste-cleaner-input"
              value={text}
              onChange={(event) => { setText(event.target.value); setCopied(false); }}
              placeholder="Paste the text you copied here"
              aria-describedby="copy-paste-input-help"
              className={`min-h-64 w-full resize-y rounded-xl border border-[#c9c5ba] bg-[#fffdf8] p-4 text-base leading-7 text-[#171717] outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40 ${focusRing}`}
            />
            <div className="mt-2 flex items-center justify-between gap-3 px-1">
              <p id="copy-paste-input-help" className="text-xs leading-5 text-black/45">Your wording is never rewritten.</p>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-black/40">{text.length.toLocaleString("en-IN")} chars</span>
            </div>
          </label>
        </section>

        <section className="mt-8" aria-labelledby="copy-paste-output-heading" aria-live="polite" aria-atomic="true">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">2. Ready to paste</p>
              <h3 id="copy-paste-output-heading" className="mt-1 text-base font-black text-[#171717]">Cleaned text</h3>
            </div>
            <button type="button" onClick={copyResult} disabled={!result} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#171717] bg-white px-4 text-sm font-bold text-[#171717] transition hover:bg-[#f7f5ef] ${focusRing} disabled:cursor-not-allowed disabled:opacity-35`} aria-label={copied ? "Cleaned text copied" : "Copy cleaned text"}>
              {copied ? <Check size={16} aria-hidden="true" /> : <Clipboard size={16} aria-hidden="true" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="rounded-2xl border border-[#d8d4c9] bg-[#f4f1e9] p-3">
            <textarea
              id="copy-paste-cleaner-output"
              value={result}
              readOnly
              aria-label="Cleaned text result"
              placeholder="Your clean copy will appear here"
              className="min-h-64 w-full resize-y rounded-xl border border-[#d8d4c9] bg-white p-4 text-base leading-7 text-[#171717] outline-none placeholder:text-black/25"
            />
            <div className="mt-2 flex items-center justify-between gap-3 px-1">
              <span className="text-xs font-semibold text-black/40">{result ? `${result.length.toLocaleString("en-IN")} chars ready` : "Waiting for input"}</span>
              {result && <span className="rounded-full bg-[#e9f1d8] px-2.5 py-1 text-[11px] font-bold text-[#52691f]">Ready</span>}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-dashed border-[#d8d4c9] bg-[#faf9f6] p-4" aria-labelledby="copy-paste-changes-heading">
          <p id="copy-paste-changes-heading" className="text-xs font-black uppercase tracking-[.1em] text-black/45">What changes</p>
          <p className="mt-2 text-sm leading-6 text-black/55">Claude-style ▎ prefixes are removed when they look like copy markers, trailing spaces are cleaned, and runs of blank lines are reduced. Your wording stays intact.</p>
        </section>

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Processing happens in your browser. Nothing is sent to a server.</p>
      </div>
    </div>
  );
}
