"use client";

import { Clipboard, RotateCcw, Type } from "lucide-react";
import { useMemo, useState } from "react";

const MAX_TEXT_LENGTH = 500_000;

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const noSpaces = text.replace(/\s/g, "").length;
    const sentences = text.trim() ? (text.match(/[.!?]+(?=\s|$)/g) ?? []).length : 0;
    const readingMinutes = words ? Math.max(1, Math.ceil(words / 200)) : 0;
    return { words, characters, noSpaces, sentences, readingMinutes };
  }, [text]);

  const copyCounts = async () => {
    const summary = `Words: ${stats.words}\nCharacters: ${stats.characters}\nCharacters without spaces: ${stats.noSpaces}\nSentences: ${stats.sentences}\nEstimated reading time: ${stats.readingMinutes ? `${stats.readingMinutes} min` : "-"}`;
    setCopyError("");
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      setCopyError("Copying was blocked by your browser. The counts are still available above to copy manually.");
    }
  };

  const clearText = () => {
    setText("");
    setCopied(false);
    setCopyError("");
  };

  return (
    <section aria-labelledby="word-counter-title" className="overflow-hidden rounded-2xl border border-[#dedbd3] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.04)]">
      <div className="border-b border-[#e3dfd5] bg-[#f5f2ea] px-5 py-5 md:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-[#171717]" aria-hidden="true"><Type size={20} /></span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-[#6d8e25]">Writing utility</p>
              <h2 id="word-counter-title" className="mt-1 text-xl font-black tracking-[-.025em] md:text-2xl">Count your text</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-black/50">Paste or type text below. Counts and estimated reading time update instantly in your browser.</p>
            </div>
          </div>
          <button type="button" onClick={clearText} disabled={!text} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-4 text-sm font-bold text-black/60 transition hover:border-[#171717] hover:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Clear text"><RotateCcw size={16} aria-hidden="true" /><span>Clear</span></button>
        </div>
      </div>

      <div className="min-w-0 p-5 md:p-7">
        <section aria-labelledby="word-counter-input-heading">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 id="word-counter-input-heading" className="text-sm font-black">Your text</h3>
              <p className="mt-1 text-xs leading-5 text-black/40">Words, characters and sentences are counted as you type.</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#e9f1d8] px-2.5 py-1 text-[11px] font-bold text-[#52691f]">Local only</span>
          </div>
          <textarea
            id="word-counter-input"
            value={text}
            onChange={(event) => { setText(event.target.value); setCopied(false); setCopyError(""); }}
            placeholder="Start typing or paste text here..."
            aria-describedby="word-counter-help word-counter-limit"
            maxLength={MAX_TEXT_LENGTH}
            className="mt-3 min-h-72 w-full resize-y rounded-xl border border-[#cfcabf] bg-[#faf9f6] p-4 text-base leading-7 text-[#171717] outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/45"
          />
          <div className="mt-2 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <p id="word-counter-help" className="text-xs leading-5 text-black/40">Tip: keep punctuation in place for a more useful sentence count.</p>
            <p id="word-counter-limit" className="shrink-0 text-xs font-medium tabular-nums text-black/40" aria-live="polite">{text.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()} characters</p>
          </div>
        </section>

        <section className="mt-6" aria-labelledby="word-counter-results-heading" aria-live="polite" aria-atomic="true">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-[#6d8e25]">Live counts</p>
              <h3 id="word-counter-results-heading" className="mt-1 text-base font-black">Your text at a glance</h3>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="sr-only" aria-live="polite" aria-atomic="true">{copied ? "Text counts copied." : ""}</span>
              <button type="button" onClick={copyCounts} disabled={!text} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3.5 text-xs font-bold text-[#171717] transition hover:border-[#171717] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]" aria-label={copied ? "Text counts copied" : "Copy text counts"}>
                <Clipboard size={15} aria-hidden="true" />
                <span>{copied ? "Copied" : "Copy counts"}</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[["Words", stats.words], ["Characters", stats.characters], ["No spaces", stats.noSpaces], ["Sentences", stats.sentences], ["Read time", stats.readingMinutes ? `${stats.readingMinutes} min` : "-"]].map(([label, value], index) => (
              <div key={label} className={`rounded-xl border p-4 ${index === 0 ? "border-[#b9df55] bg-[#f3f8e7]" : "border-[#e0ddd5] bg-white"}`}>
                <p className="text-[10px] font-black uppercase tracking-[.14em] text-black/40">{label}</p>
                <p className="mt-2 text-xl font-black tabular-nums tracking-[-.03em] sm:text-2xl">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {copyError && <p className="mt-5 rounded-xl border border-[#ead9c8] bg-[#fff7ed] p-4 text-sm leading-6 text-[#7b4a20]" role="alert">{copyError}</p>}
        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Everything is counted locally in your browser. No text is uploaded or stored by this tool.</p>
      </div>
    </section>
  );
}
