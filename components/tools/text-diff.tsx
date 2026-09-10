"use client";

import { ArrowLeftRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

type DiffLine = { type: "same" | "added" | "removed"; text: string; number: number };

function diffLines(left: string, right: string): DiffLine[] {
  const a = left ? left.split("\n") : [];
  const b = right ? right.split("\n") : [];
  const rows = a.length * b.length;
  if (rows > 1_000_000) return [{ type: "same", text: "The text is too large to compare safely. Try shorter inputs.", number: 0 }];

  const dp: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let lineNumber = 1;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      result.push({ type: "same", text: a[i], number: lineNumber });
      i += 1; j += 1; lineNumber += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "removed", text: a[i], number: lineNumber });
      i += 1;
    } else {
      result.push({ type: "added", text: b[j], number: lineNumber });
      j += 1; lineNumber += 1;
    }
  }
  while (i < a.length) { result.push({ type: "removed", text: a[i], number: lineNumber }); i += 1; }
  while (j < b.length) { result.push({ type: "added", text: b[j], number: lineNumber }); j += 1; lineNumber += 1; }
  return result;
}

export default function TextDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const diff = useMemo(() => diffLines(left, right), [left, right]);
  const changed = diff.filter((line) => line.type !== "same").length;

  return (
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-[#c8f169]"><ArrowLeftRight size={20} /></span><div><p className="font-bold">Compare two texts</p><p className="text-sm text-black/45">Find added and removed lines directly in your browser.</p></div></div>
          <button type="button" onClick={() => { setLeft(""); setRight(""); }} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-black/45 transition hover:bg-white hover:text-black" aria-label="Clear both texts"><RotateCcw size={16} /><span className="hidden sm:inline">Clear</span></button>
        </div>
      </div>
      <div className="p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <div><label htmlFor="text-diff-left" className="mb-2 block text-sm font-bold">Original text</label><textarea id="text-diff-left" value={left} onChange={(e) => setLeft(e.target.value)} placeholder="Paste the original text" className="min-h-56 w-full resize-y border border-[#cfcabf] bg-[#f8f5ed] p-4 text-sm leading-6 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" /></div>
          <div><label htmlFor="text-diff-right" className="mb-2 block text-sm font-bold">New text</label><textarea id="text-diff-right" value={right} onChange={(e) => setRight(e.target.value)} placeholder="Paste the new text" className="min-h-56 w-full resize-y border border-[#cfcabf] bg-[#f8f5ed] p-4 text-sm leading-6 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" /></div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 border-y border-[#d8d4c9] py-4"><p className="text-sm text-black/55">{changed ? `${changed} changed line${changed === 1 ? "" : "s"}` : "No differences"}</p><div className="flex gap-4 text-xs font-bold uppercase tracking-[0.1em] text-black/45"><span><b className="text-black">−</b> removed</span><span><b className="text-black">+</b> added</span></div></div>
        <div className="mt-5 overflow-x-auto border border-[#d8d4c9] bg-[#f8f5ed] font-mono text-sm leading-6" aria-live="polite">
          {diff.length === 0 ? <p className="p-5 text-black/40">Enter text in both boxes to compare.</p> : diff.map((line, index) => <div key={`${index}-${line.type}`} className={`grid min-w-max grid-cols-[3rem_1fr] border-b border-black/5 px-3 py-1 ${line.type === "added" ? "bg-[#c8f169]/35" : line.type === "removed" ? "bg-[#171717]/5" : ""}`}><span className="select-none pr-3 text-right text-black/30">{line.type === "added" ? "+" : line.type === "removed" ? "−" : line.number}</span><span className="whitespace-pre-wrap pr-4">{line.text || " "}</span></div>)}
        </div>
        <p className="mt-4 text-xs leading-5 text-black/40">Comparison runs locally in your browser. Large inputs are capped to keep the page responsive.</p>
      </div>
    </div>
  );
}
