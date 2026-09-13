"use client";

import { Braces, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const MAX_PATTERN_LENGTH = 300;
const MAX_INPUT_LENGTH = 5_000;
const MAX_MATCHES = 1_000;

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [input, setInput] = useState("Contact hello@example.com or team@example.org.");

  const result = useMemo(() => {
    if (!pattern) return { error: "Enter a regular expression to test.", matches: [] as RegExpExecArray[] };
    if (pattern.length > MAX_PATTERN_LENGTH) return { error: `Keep the regular expression under ${MAX_PATTERN_LENGTH} characters.`, matches: [] as RegExpExecArray[] };
    if (input.length > MAX_INPUT_LENGTH) return { error: `Keep the test text under ${MAX_INPUT_LENGTH.toLocaleString()} characters.`, matches: [] as RegExpExecArray[] };

    try {
      const regex = new RegExp(pattern, flags);
      const matches: RegExpExecArray[] = [];
      if (regex.global || regex.sticky) {
        let match = regex.exec(input);
        while (match && matches.length < MAX_MATCHES) {
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

  const hasError = Boolean(result.error) && Boolean(pattern);
  const matchLimitReached = result.matches.length === MAX_MATCHES;

  return (
    <section aria-labelledby="regex-tester-heading" className="overflow-hidden rounded-2xl border border-[#ddd9cf] bg-[#fffdf8] shadow-[0_8px_28px_rgba(23,23,23,.04)]">
      <header className="border-b border-[#e3dfd5] bg-[#f3f0e8] px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-[#171717]" aria-hidden="true"><Braces size={20} /></span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-[#65748d]">Developer utility</p>
              <h2 id="regex-tester-heading" className="mt-1 text-xl font-black tracking-tight">Test a regular expression</h2>
              <p className="mt-1 text-sm leading-5 text-[#657083]">Write a pattern, paste some text, and inspect every match locally.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d7d3ca] bg-white px-3.5 text-sm font-bold text-[#58657b] transition hover:border-[#101522] hover:text-[#101522] focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Reset regex tester">
            <RotateCcw size={15} aria-hidden="true" /><span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <div className="space-y-6 p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <div>
            <label htmlFor="regex-pattern" className="mb-2 block text-sm font-black text-[#20283a]">Regular expression</label>
            <input id="regex-pattern" value={pattern} onChange={(event) => setPattern(event.target.value)} maxLength={MAX_PATTERN_LENGTH} spellCheck={false} autoComplete="off" aria-invalid={hasError} aria-describedby="regex-pattern-help" className="min-h-12 w-full rounded-xl border border-[#d2cec4] bg-[#faf8f2] px-4 font-mono text-sm text-[#101522] outline-none transition placeholder:text-[#9aa1ad] focus:border-[#101522] focus:ring-4 focus:ring-[#c8f169]" placeholder="e.g. \\d+" />
            <p id="regex-pattern-help" className="mt-1.5 text-xs leading-5 text-[#7a8495]">JavaScript regular-expression syntax. Maximum {MAX_PATTERN_LENGTH} characters.</p>
          </div>
          <div>
            <label htmlFor="regex-flags" className="mb-2 block text-sm font-black text-[#20283a]">Flags</label>
            <input id="regex-flags" value={flags} onChange={(event) => setFlags(event.target.value)} spellCheck={false} autoComplete="off" aria-describedby="regex-flags-help" className="min-h-12 w-full rounded-xl border border-[#d2cec4] bg-[#faf8f2] px-4 font-mono text-sm uppercase text-[#101522] outline-none transition placeholder:text-[#9aa1ad] focus:border-[#101522] focus:ring-4 focus:ring-[#c8f169]" placeholder="gim" />
            <p id="regex-flags-help" className="mt-1.5 text-xs leading-5 text-[#7a8495]">Common: g, i, m, s, u</p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <label htmlFor="regex-input" className="text-sm font-black text-[#20283a]">Text to test</label>
            <span className="text-xs text-[#8a93a1]">{input.length.toLocaleString()} / {MAX_INPUT_LENGTH.toLocaleString()} characters</span>
          </div>
          <textarea id="regex-input" value={input} onChange={(event) => setInput(event.target.value)} maxLength={MAX_INPUT_LENGTH} spellCheck={false} className="min-h-44 w-full resize-y rounded-xl border border-[#d2cec4] bg-[#faf8f2] p-4 text-sm leading-6 text-[#101522] outline-none transition placeholder:text-[#9aa1ad] focus:border-[#101522] focus:ring-4 focus:ring-[#c8f169]" placeholder="Paste text here" />
        </div>

        <div className="border-t border-[#e3dfd5] pt-6" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-[#71809a]">Output</p>
              <h3 className="mt-1 text-xl font-black tracking-tight">Matches</h3>
            </div>
            {!result.error && <p className="rounded-full bg-[#f0f8dc] px-3 py-1.5 text-xs font-black text-[#526b1d]">{result.matches.length} {result.matches.length === 1 ? "match" : "matches"}</p>}
          </div>

          {result.error ? (
            <div className="mt-4 rounded-xl border border-[#efcaca] bg-[#fff6f6] p-4" role="alert">
              <p className="text-sm font-black text-[#a43d3d]">Couldn’t test this pattern</p>
              <p className="mt-1 text-sm leading-5 text-[#a43d3d]/80">{result.error}</p>
            </div>
          ) : result.matches.length > 0 ? (
            <ol className="mt-4 space-y-2.5" aria-label="Regular expression matches">
              {result.matches.map((match, index) => (
                <li key={`${match.index}-${index}`} className="rounded-xl border border-[#ddd9cf] bg-[#faf8f2] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <code className="min-w-0 break-all font-mono text-sm font-bold text-[#101522]">{match[0]}</code>
                    <span className="shrink-0 rounded-full border border-[#ddd9cf] bg-white px-2.5 py-1 text-[11px] font-bold text-[#6f7889]">position {match.index}</span>
                  </div>
                  {match.length > 1 && (
                    <div className="mt-3 flex flex-wrap gap-2" aria-label={`Capture groups for match ${index + 1}`}>
                      {match.slice(1).map((group, groupIndex) => <span key={groupIndex} className="rounded-lg border border-[#e0dcd3] bg-white px-2.5 py-1.5 font-mono text-xs text-[#4d5668]">Group {groupIndex + 1}: {group ?? "(empty)"}</span>)}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-[#cfcac0] bg-[#faf8f2] p-6 text-center">
              <p className="text-sm font-bold text-[#4d5668]">No matches found</p>
              <p className="mt-1 text-xs leading-5 text-[#80899a]">Try adjusting the pattern or adding text to test.</p>
            </div>
          )}
          {matchLimitReached && <p className="mt-3 text-xs leading-5 text-[#7a8495]">Showing the first {MAX_MATCHES.toLocaleString()} matches to keep the tool responsive.</p>}
        </div>

        <div className="rounded-xl border border-[#e0dcd3] bg-[#f7f4ed] p-4">
          <p className="text-xs font-black uppercase tracking-[.12em] text-[#71809a]">Quick reference</p>
          <div className="mt-3 grid gap-2 text-xs text-[#596477] sm:grid-cols-3">
            <span><code className="font-bold text-[#101522]">\\d</code> digit</span>
            <span><code className="font-bold text-[#101522]">\\w</code> word character</span>
            <span><code className="font-bold text-[#101522]">.</code> any character</span>
          </div>
        </div>
      </div>
    </section>
  );
}
