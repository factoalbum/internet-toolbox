"use client";

import { RotateCcw, Type } from "lucide-react";
import { useMemo, useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const noSpaces = text.replace(/\s/g, "").length;
    const sentences = text.trim() ? (text.match(/[.!?]+(?=\s|$)/g) ?? []).length : 0;
    const readingMinutes = words ? Math.max(1, Math.ceil(words / 200)) : 0;
    return { words, characters, noSpaces, sentences, readingMinutes };
  }, [text]);

  return (
    <section aria-labelledby="word-counter-title" className="overflow-hidden rounded-2xl border border-[#dedbd3] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.04)]">
      <div className="border-b border-[#e3dfd5] bg-[#f5f2ea] px-5 py-5 md:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-[#171717]" aria-hidden="true"><Type size={20} /></span>
            <div className="min-w-0">
              <h2 id="word-counter-title" className="text-base font-black tracking-[-.02em]">Count your text</h2>
              <p className="mt-1 max-w-xl text-sm leading-5 text-black/50">Paste or type text below. Counts and estimated reading time update instantly in your browser.</p>
            </div>
          </div>
          <button type="button" onClick={() => setText("")} disabled={!text} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-4 text-sm font-bold text-black/60 transition hover:border-[#171717] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Clear text"><RotateCcw size={16} aria-hidden="true" /><span>Clear</span></button>
        </div>
      </div>

      <div className="min-w-0 p-5 md:p-7">
        <div className="flex items-end justify-between gap-3">
          <label htmlFor="word-counter-input" className="text-sm font-black">Your text</label>
          <span className="text-xs font-medium text-black/35">Processed locally</span>
        </div>
        <textarea
          id="word-counter-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Start typing or paste text here…"
          aria-describedby="word-counter-help"
          className="mt-2 min-h-72 w-full resize-y rounded-xl border border-[#cfcabf] bg-[#faf9f6] p-4 text-base leading-7 text-[#171717] outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/45"
        />
        <p id="word-counter-help" className="mt-2 text-xs leading-5 text-black/40">Tip: keep punctuation in place for a more useful sentence count.</p>

        <div aria-live="polite" aria-atomic="true" className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[["Words", stats.words], ["Characters", stats.characters], ["No spaces", stats.noSpaces], ["Sentences", stats.sentences], ["Read time", stats.readingMinutes ? `${stats.readingMinutes} min` : "-"]].map(([label, value], index) => (
            <div key={label} className={`rounded-xl border p-4 ${index === 0 ? "border-[#b9df55] bg-[#f3f8e7]" : "border-[#e0ddd5] bg-white"}`}>
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-black/40">{label}</p>
              <p className="mt-2 text-xl font-black tracking-[-.03em] sm:text-2xl">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
