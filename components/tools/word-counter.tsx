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
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-[#c8f169]"><Type size={20} /></span><div><p className="font-bold">Count your text</p><p className="text-sm text-black/45">Words, characters and reading time update as you type.</p></div></div>
          <button type="button" onClick={() => setText("")} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-black/45 transition hover:bg-white hover:text-black" aria-label="Clear text"><RotateCcw size={16} /><span className="hidden sm:inline">Clear</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <label htmlFor="word-counter-input" className="mb-2 block text-sm font-bold">Your text</label>
        <textarea id="word-counter-input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Start typing or paste text here" className="min-h-72 w-full resize-y border border-[#cfcabf] bg-[#f8f5ed] p-4 text-base leading-7 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-[#d8d4c9] bg-[#d8d4c9] sm:grid-cols-5">
          {[["Words", stats.words], ["Characters", stats.characters], ["No spaces", stats.noSpaces], ["Sentences", stats.sentences], ["Read time", stats.readingMinutes ? `${stats.readingMinutes} min` : "-"]].map(([label, value]) => <div key={label} className="bg-[#fffdf8] p-4"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">{label}</p><p className="mt-2 text-xl font-black">{value}</p></div>)}
        </div>
      </div>
    </div>
  );
}
