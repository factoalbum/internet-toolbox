"use client";

import { ArrowLeftRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

type DiffLine = { type: "same" | "added" | "removed"; text: string; number: number };
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

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
  const hasInput = Boolean(left || right);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true"><ArrowLeftRight size={20} /></span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-black/45">Text utility</p>
              <h2 className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] md:text-2xl">Compare two texts</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/55">Find added and removed lines directly in your browser. Nothing is uploaded.</p>
            </div>
          </div>
          <button type="button" onClick={() => { setLeft(""); setRight(""); }} disabled={!hasInput} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`} aria-label="Clear both texts">
            <RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      <div className="p-5 md:p-7">
        <section aria-labelledby="text-diff-inputs">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div><h3 id="text-diff-inputs" className="text-sm font-black">Text to compare</h3><p className="mt-1 text-xs leading-5 text-black/45">Paste the original and updated versions below.</p></div>
            <span className="hidden rounded-full bg-[#e9f1d8] px-2.5 py-1 text-[11px] font-bold text-[#52691f] sm:inline-flex">Local only</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.3)]">
              <span className="text-sm font-bold">Original text</span>
              <span className="mt-1 block text-xs leading-5 text-black/40">The earlier version</span>
              <textarea id="text-diff-left" value={left} onChange={(e) => setLeft(e.target.value)} placeholder="Paste the original text" aria-label="Original text" rows={8} className={`mt-3 min-h-52 w-full resize-y rounded-xl border border-[#c9c5ba] bg-[#fffdf8] p-4 text-sm leading-6 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40 ${focusRing}`} />
              <span className="mt-2 block text-xs font-medium tabular-nums text-black/35">{left.length.toLocaleString("en-IN")} characters</span>
            </label>
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.3)]">
              <span className="text-sm font-bold">New text</span>
              <span className="mt-1 block text-xs leading-5 text-black/40">The updated version</span>
              <textarea id="text-diff-right" value={right} onChange={(e) => setRight(e.target.value)} placeholder="Paste the new text" aria-label="New text" rows={8} className={`mt-3 min-h-52 w-full resize-y rounded-xl border border-[#c9c5ba] bg-[#fffdf8] p-4 text-sm leading-6 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40 ${focusRing}`} />
              <span className="mt-2 block text-xs font-medium tabular-nums text-black/35">{right.length.toLocaleString("en-IN")} characters</span>
            </label>
          </div>
        </section>

        <section className="mt-7" aria-labelledby="text-diff-results">
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#d8d4c9] py-4">
            <div><h3 id="text-diff-results" className="text-sm font-black">Comparison result</h3><p className="mt-1 text-xs leading-5 text-black/45" aria-live="polite">{changed ? `${changed} changed line${changed === 1 ? "" : "s"}` : hasInput ? "No differences" : "Enter both texts to compare"}</p></div>
            <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.1em] text-black/45" aria-label="Diff legend"><span><b className="text-black">−</b> removed</span><span><b className="text-[#5b7025]">+</b> added</span></div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-[#d8d4c9] bg-[#f8f5ed] font-mono text-sm leading-6" aria-live="polite" aria-label="Text comparison">
            {diff.length === 0 ? <p className="p-5 text-sm text-black/40">Your comparison will appear here as you type.</p> : diff.map((line, index) => <div key={`${index}-${line.type}`} className={`grid min-w-max grid-cols-[3.5rem_1fr] border-b border-black/5 px-3 py-1.5 last:border-b-0 ${line.type === "added" ? "bg-[#c8f169]/35" : line.type === "removed" ? "bg-black/[.035]" : ""}`}><span className="select-none border-r border-black/5 pr-3 text-right text-black/30 tabular-nums">{line.type === "added" ? "+" : line.type === "removed" ? "−" : line.number}</span><span className="whitespace-pre-wrap pl-3 pr-4">{line.text || " "}</span></div>)}
          </div>
        </section>

        <p className="mt-5 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/40">Comparison runs locally in your browser. Large inputs are capped to keep the page responsive.</p>
      </div>
    </div>
  );
}
