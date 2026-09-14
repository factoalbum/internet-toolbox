"use client";

import { BarChart3, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(
    () => ({
      characters: [...text].length,
      withoutSpaces: [...text].filter((c) => !/\s/.test(c)).length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text ? text.split(/\r?\n/).length : 0,
    }),
    [text],
  );

  const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="character-counter-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0e8ff] text-[#6b4bb3]" aria-hidden="true">
              <BarChart3 size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-black/45">Writing utility</p>
              <h2 id="character-counter-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] md:text-2xl">Count your text instantly</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/50">Type or paste text to see character, word, line, and space-free counts as you work.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setText("")}
            disabled={!text}
            className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
            aria-label="Clear text"
          >
            <RotateCcw size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      <div className="p-5 md:p-7">
        <section aria-labelledby="character-input-heading">
          <div className="mb-3">
            <p className="text-[11px] font-black uppercase tracking-[.13em] text-black/40">1. Your text</p>
            <h3 id="character-input-heading" className="mt-1 text-base font-black text-[#171717]">Paste or type anything</h3>
          </div>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)]">
            <span className="text-sm font-bold">Text to count</span>
            <span id="character-input-help" className="mt-1 block text-xs leading-5 text-black/40">Everything is processed locally in your browser.</span>
            <textarea
              id="character-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="Type or paste text here..."
              aria-describedby="character-input-help"
              className={`mt-3 min-h-48 w-full resize-y rounded-xl border border-[#bcb8ae] bg-[#fffdf8] p-4 text-base leading-7 text-[#171717] outline-none transition placeholder:text-black/30 focus:border-[#171717] ${focusRing}`}
            />
          </label>
        </section>

        <section className="mt-7" aria-labelledby="character-results-heading" aria-live="polite" aria-atomic="true">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.13em] text-black/40">2. Your result</p>
              <h3 id="character-results-heading" className="mt-1 text-base font-black text-[#171717]">Live text counts</h3>
            </div>
            <span className="text-xs font-semibold text-black/40">Updates as you type</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Characters", stats.characters],
              ["Without spaces", stats.withoutSpaces],
              ["Words", stats.words],
              ["Lines", stats.lines],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-4 transition sm:p-5">
                <p className="text-[10px] font-black uppercase tracking-[.12em] text-black/45">{label}</p>
                <p className="mt-2 break-words text-3xl font-black tracking-[-.04em] tabular-nums text-[#171717]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 rounded-2xl border border-dashed border-[#d8d4c9] bg-[#faf9f6] p-4">
          <p className="text-xs font-bold text-black/55">What gets counted?</p>
          <p className="mt-1 text-xs leading-5 text-black/45">Characters include letters, numbers, punctuation, spaces, and emoji. Nothing is uploaded or stored by this tool.</p>
        </div>
      </div>
    </div>
  );
}
