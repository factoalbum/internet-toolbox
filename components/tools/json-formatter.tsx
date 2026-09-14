"use client";

import { Braces, Check, Copy, RotateCcw } from "lucide-react";
import { useState } from "react";

const DEFAULT_INPUT = '{"name":"Internet Toolbox","tools":8}';

export default function JsonFormatter() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  function parseInput() {
    try {
      return JSON.parse(input);
    } catch (err) {
      throw err instanceof Error ? err : new Error("Invalid JSON");
    }
  }

  function formatJson() {
    try {
      setOutput(JSON.stringify(parseInput(), null, 2));
      setError("");
      setCopyError("");
      setCopied(false);
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setCopyError("");
      setCopied(false);
    }
  }

  function minifyJson() {
    try {
      setOutput(JSON.stringify(parseInput()));
      setError("");
      setCopyError("");
      setCopied(false);
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setCopyError("");
      setCopied(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    setCopyError("");
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
      setCopyError("Copying was blocked by your browser. Select the output and copy it manually.");
    }
  }

  function reset() {
    setInput(DEFAULT_INPUT);
    setOutput("");
    setError("");
    setCopied(false);
    setCopyError("");
  }

  const inputLines = input ? input.split(/\r?\n/).length : 0;
  const outputLines = output ? output.split(/\r?\n/).length : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="json-workspace-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-6 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#dff4bd] text-[#171717]" aria-hidden="true"><Braces size={21} /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Developer utility</p>
              <h2 id="json-workspace-title" className="mt-1 text-xl font-black tracking-tight text-[#171717] md:text-2xl">JSON formatter & minifier</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/55">Turn compact JSON into readable, indented data or minify it for a smaller payload. Everything runs locally in your browser.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-[#c9c5ba] bg-white px-3.5 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.035] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60" aria-label="Reset JSON formatter"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </header>

      <div className="grid gap-5 p-5 md:grid-cols-2 md:p-7">
        <section className="rounded-xl border border-[#ddd9cf] bg-white p-4 md:p-5" aria-labelledby="json-input-label">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Your JSON</p>
              <label id="json-input-label" htmlFor="json-input" className="mt-1 block text-sm font-bold text-[#171717]">Input JSON</label>
              <p className="mt-1 text-xs leading-5 text-black/45">Paste valid JSON to format or minify.</p>
            </div>
            <span className="rounded-full bg-[#f2efe7] px-2.5 py-1 text-[11px] font-semibold text-black/50">Local only</span>
          </div>
          <textarea id="json-input" value={input} onChange={(event) => { setInput(event.target.value); setError(""); setCopyError(""); setCopied(false); }} spellCheck={false} aria-describedby="json-input-help" aria-invalid={!!error} className="mt-4 min-h-72 w-full resize-y rounded-lg border border-[#c9c5ba] bg-[#fffdf8] p-4 font-mono text-sm leading-6 text-[#171717] outline-none transition-shadow placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-100" />
          <p id="json-input-help" className="mt-2 text-xs leading-5 text-black/45">Formatting preserves the JSON data; it only changes whitespace and indentation.</p>
        </section>

        <section className="rounded-xl border border-[#ddd9cf] bg-[#f6f3eb] p-4 md:p-5" aria-labelledby="json-output-label">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">2. Your result</p>
              <label id="json-output-label" htmlFor="json-output" className="mt-1 block text-sm font-bold text-[#171717]">Formatted JSON</label>
              <p className="mt-1 text-xs leading-5 text-black/45">Your converted JSON appears here.</p>
            </div>
            <button type="button" onClick={copyOutput} disabled={!output} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#bcb8ae] bg-white px-3.5 text-xs font-bold text-[#171717] transition hover:border-[#171717] hover:bg-black/[0.035] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60 disabled:cursor-not-allowed disabled:opacity-35" aria-label={copied ? "JSON result copied" : "Copy JSON result"}><span aria-hidden="true">{copied ? <Check size={14} /> : <Copy size={14} />}</span>{copied ? "Copied" : "Copy"}</button>
          </div>
          <textarea id="json-output" value={output} readOnly spellCheck={false} aria-describedby="json-output-status" placeholder="Your result will appear here after you choose Format or Minify." className="mt-4 min-h-72 w-full resize-y rounded-lg border border-[#d8d4c9] bg-white p-4 font-mono text-sm leading-6 text-[#171717] outline-none placeholder:text-black/25 focus-visible:ring-4 focus-visible:ring-[#c8f169]/40" />
          <div id="json-output-status" className="mt-2 text-xs text-black/45" aria-live="polite">{output ? `${outputLines} ${outputLines === 1 ? "line" : "lines"} · ${output.length.toLocaleString()} characters` : "No result yet"}</div>
        </section>
      </div>

      <footer className="flex flex-col gap-3 border-t border-[#d8d4c9] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-7">
        <div className="space-y-1" aria-live="polite">
          <p className={`text-xs leading-5 ${error ? "font-semibold text-red-700" : copyError ? "font-semibold text-[#7b4a20]" : "text-black/45"}`} role={error || copyError ? "alert" : undefined}>{error || copyError || `Ready to process · ${inputLines} ${inputLines === 1 ? "line" : "lines"} in the input`}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={formatJson} className="min-h-11 rounded-lg border border-[#171717] bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60">Format JSON</button>
          <button type="button" onClick={minifyJson} className="min-h-11 rounded-lg border border-[#d8d4c9] bg-white px-5 text-sm font-bold text-[#171717] transition hover:border-[#171717] hover:bg-[#c8f169] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60">Minify</button>
        </div>
      </footer>
    </div>
  );
}
