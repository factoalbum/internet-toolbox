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

  const focusRing = "focus:outline-none focus:ring-4 focus:ring-[#c8f169]";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0e8ff] text-[#6b4bb3]" aria-hidden="true">
              <BarChart3 size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Count characters instantly</p>
              <p className="text-sm leading-5 text-black/50">Type or paste text to see useful counts as you work.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setText("")}
            className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`}
            aria-label="Clear text"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4">
          <span className="text-sm font-bold">Your text</span>
          <span className="mt-1 block text-xs leading-5 text-black/40">Everything is processed locally in your browser.</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Type or paste text here..."
            aria-label="Text to count"
            className={`mt-3 min-h-48 w-full resize-y rounded-xl border border-[#bcb8ae] bg-white p-4 text-base leading-7 outline-none transition placeholder:text-black/30 focus:border-[#171717] ${focusRing}`}
          />
        </label>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite" aria-atomic="true">
          {[
            ["Characters", stats.characters],
            ["Without spaces", stats.withoutSpaces],
            ["Words", stats.words],
            ["Lines", stats.lines],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/45">{label}</p>
              <p className="mt-1 break-words text-2xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">
          Character counts include letters, numbers, punctuation and emoji. Nothing is uploaded or stored by this tool.
        </p>
      </div>
    </div>
  );
}
