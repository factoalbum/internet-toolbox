"use client";

import { RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [input, setInput] = useState("Contact hello@example.com or team@example.org.");

  const result = useMemo(() => {
    if (!pattern) return { error: "Enter a regular expression to test.", matches: [] as RegExpExecArray[] };
    try {
      const regex = new RegExp(pattern, flags);
      const matches: RegExpExecArray[] = [];
      if (regex.global || regex.sticky) {
        let match = regex.exec(input);
        while (match) {
          matches.push(match);
          if (match[0] === "") regex.lastIndex += 1;
          match = regex.exec(input);
        }
      } else {
        const match = regex.exec(input);
        if (match) matches.push(match);
      }
      return { error: "", matches };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid regular expression.", matches: [] as RegExpExecArray[] };
    }
  }, [pattern, flags, input]);

  function reset() {
    setPattern("");
    setFlags("g");
    setInput("");
  }

  return (
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-[#c8f169]"><Search size={20} /></span><div><p className="font-bold">Test a regular expression</p><p className="text-sm text-black/45">Matching runs locally in your browser.</p></div></div>
          <button type="button" onClick={reset} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-black/45 transition hover:bg-white hover:text-black" aria-label="Reset regex tester"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="space-y-5 p-5 md:p-7">
        <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
          <div><label htmlFor="regex-pattern" className="mb-2 block text-sm font-bold">Regular expression</label><input id="regex-pattern" value={pattern} onChange={(event) => setPattern(event.target.value)} spellCheck={false} className="min-h-12 w-full border border-[#cfcabf] bg-[#f8f5ed] px-4 font-mono text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" placeholder="e.g. \\d+" /></div>
          <div><label htmlFor="regex-flags" className="mb-2 block text-sm font-bold">Flags</label><input id="regex-flags" value={flags} onChange={(event) => setFlags(event.target.value)} spellCheck={false} className="min-h-12 w-full border border-[#cfcabf] bg-[#f8f5ed] px-4 font-mono text-sm uppercase outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" placeholder="gim" aria-describedby="regex-flags-help" /><p id="regex-flags-help" className="mt-1 text-xs text-black/40">Common: g, i, m, s, u</p></div>
        </div>

        <div><label htmlFor="regex-input" className="mb-2 block text-sm font-bold">Text to test</label><textarea id="regex-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} className="min-h-40 w-full resize-y border border-[#cfcabf] bg-[#f8f5ed] p-4 text-sm leading-6 outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" placeholder="Paste text here..." /></div>

        <div className="border-t border-[#d8d4c9] pt-5">
          {result.error ? <p className="text-sm font-medium text-red-700" role="alert">{result.error}</p> : <>
            <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-lg font-black">Matches</h2><p className="text-sm text-black/45">{result.matches.length} {result.matches.length === 1 ? "match" : "matches"}</p></div>
            {result.matches.length > 0 ? <ol className="mt-4 space-y-2" aria-label="Regular expression matches">{result.matches.map((match, index) => <li key={`${match.index}-${index}`} className="border border-[#d8d4c9] bg-[#f8f5ed] p-3 text-sm"><div className="flex flex-wrap justify-between gap-3"><code className="break-all font-mono font-bold">{match[0]}</code><span className="shrink-0 text-xs text-black/40">position {match.index}</span></div>{match.length > 1 && <div className="mt-2 flex flex-wrap gap-2">{match.slice(1).map((group, groupIndex) => <span key={groupIndex} className="rounded-full border border-[#d8d4c9] bg-[#fffdf8] px-2.5 py-1 font-mono text-xs">Group {groupIndex + 1}: {group ?? "—"}</span>)}</div>}</li>)}</ol> : <p className="mt-4 border border-dashed border-[#bcb8ae] p-5 text-sm text-black/50">No matches found in the text.</p>}
          </>}
        </div>
      </div>
    </div>
  );
}
