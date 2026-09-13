"use client";

import { Check, Copy, Download, RotateCcw, Table2 } from "lucide-react";
import { useState } from "react";

const sample = '[{"name":"Alice","age":30,"city":"Mumbai"},{"name":"Bob","age":28,"city":"Pune"}]';
const MAX_ROWS = 5000;

function escapeCsv(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

function toCsv(value: unknown) {
  if (!Array.isArray(value) || value.length === 0 || value.some((row) => row === null || typeof row !== "object" || Array.isArray(row))) {
    throw new Error("Input must be a JSON array of objects.");
  }
  if (value.length > MAX_ROWS) throw new Error("Please convert " + MAX_ROWS.toLocaleString() + " rows or fewer at a time.");

  const rows = value as Record<string, unknown>[];
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  if (columns.length === 0) throw new Error("The JSON objects do not contain any fields.");
  return [columns.map(escapeCsv).join(","), ...rows.map((row) => columns.map((column) => escapeCsv(row[column])).join(","))].join("\n");
}

export default function JsonToCsv() {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  function convert() {
    try {
      setOutput(toCsv(JSON.parse(input)));
      setError("");
      setCopyError("");
      setCopied(false);
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Could not convert the JSON.");
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
      setCopyError("Copying was blocked by your browser. Select the CSV output and copy it manually.");
    }
  }

  function download() {
    if (!output) return;
    const url = URL.createObjectURL(new Blob(["\uFEFF", output], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setInput(sample);
    setOutput("");
    setError("");
    setCopied(false);
    setCopyError("");
  }

  const inputLabel = `${input.length.toLocaleString()} characters`;
  const outputLabel = output ? `${output.length.toLocaleString()} characters` : "Waiting for conversion";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e7f6d4] text-[#496d16]" aria-hidden="true"><Table2 size={20} /></span>
            <div className="min-w-0"><p className="font-bold">Convert JSON to CSV</p><p className="text-sm leading-5 text-black/50">Turn an array of JSON objects into a spreadsheet-ready CSV file.</p></div>
          </div>
          <button type="button" onClick={reset} className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Reset JSON to CSV converter"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </header>

      <div className="p-5 md:p-7">
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="min-w-0 rounded-2xl border border-[#e2dfd7] bg-white p-4 md:p-5" aria-labelledby="json-csv-input-heading">
            <div className="flex items-start justify-between gap-3">
              <div><h2 id="json-csv-input-heading" className="text-sm font-bold">JSON input</h2><p className="mt-1 text-xs leading-5 text-black/45">Use an array of objects. Fields become CSV columns.</p></div>
              <span className="shrink-0 text-xs font-semibold text-black/40" aria-label={inputLabel}>{inputLabel}</span>
            </div>
            <label htmlFor="json-csv-input" className="sr-only">JSON array to convert</label>
            <textarea id="json-csv-input" value={input} onChange={(event) => { setInput(event.target.value); setError(""); setCopyError(""); setCopied(false); }} spellCheck={false} aria-invalid={Boolean(error)} aria-describedby={error ? "json-csv-error" : "json-csv-help"} className="mt-4 min-h-72 w-full resize-y rounded-xl border border-[#cfcabf] bg-[#f8f5ed] p-4 font-mono text-sm leading-6 text-[#171717] outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
            <p id="json-csv-help" className="mt-3 text-xs leading-5 text-black/45">Nested objects and arrays are kept as JSON inside their CSV cell.</p>
          </section>

          <section className="min-w-0 rounded-2xl border border-[#e2dfd7] bg-white p-4 md:p-5" aria-labelledby="json-csv-output-heading">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 id="json-csv-output-heading" className="text-sm font-bold">CSV output</h2><p className="mt-1 text-xs leading-5 text-black/45">Copy it or download a UTF-8 CSV file.</p></div>
              <span className="text-xs font-semibold text-black/40">{outputLabel}</span>
            </div>
            <label htmlFor="json-csv-output" className="sr-only">Converted CSV output</label>
            <textarea id="json-csv-output" value={output} readOnly spellCheck={false} aria-live="polite" placeholder="Your CSV will appear here after conversion." className="mt-4 min-h-72 w-full resize-y rounded-xl border border-[#cfcabf] bg-[#f8f5ed] p-4 font-mono text-sm leading-6 text-[#171717] outline-none transition placeholder:text-black/30 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={copyOutput} disabled={!output} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-4 text-sm font-bold text-black/65 transition hover:border-[#171717] hover:bg-[#f4f1e9] hover:text-black disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label={copied ? "CSV output copied" : "Copy CSV output"}>{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copied ? "Copied" : "Copy CSV"}</button>
              <button type="button" onClick={download} disabled={!output} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#171717] bg-[#171717] px-4 text-sm font-bold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Download CSV file"><Download size={16} aria-hidden="true" />Download CSV</button>
            </div>
          </section>
        </div>

        <div className="mt-5 rounded-2xl border border-[#d8d4c9] bg-[#f4f1e9] p-4 md:flex md:items-center md:justify-between md:gap-5">
          <div className="min-w-0"><p className="text-sm font-bold">Ready to convert?</p><p className="mt-1 text-xs leading-5 text-black/50">Up to {MAX_ROWS.toLocaleString()} JSON rows are supported. Conversion happens in your browser.</p></div>
          <button type="button" onClick={convert} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#171717] bg-[#171717] px-5 text-sm font-black text-white transition hover:bg-black/85 focus:outline-none focus:ring-4 focus:ring-[#c8f169] md:mt-0 md:w-auto">Convert to CSV</button>
        </div>

        {(error || copyError) && <p id="json-csv-error" className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] px-4 py-3 text-sm leading-6 text-[#7b3d31]" role="alert">{error || copyError}</p>}
        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Only JSON arrays of objects can be converted. Columns follow the order in which unique fields first appear.</p>
      </div>
    </div>
  );
}
