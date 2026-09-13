"use client";

import { Check, Copy, FileSpreadsheet, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const MAX_ROWS = 5000;
const MAX_INPUT_CHARS = 2_000_000;

type Row = Record<string, string>;

function makeUniqueHeaders(rawHeaders: string[]): string[] {
  const used = new Set<string>();
  const nextSuffix = new Map<string, number>();

  return rawHeaders.map((header) => {
    if (!used.has(header)) {
      used.add(header);
      nextSuffix.set(header, 2);
      return header;
    }

    let suffix = nextSuffix.get(header) ?? 2;
    let candidate = `${header}_${suffix}`;
    while (used.has(candidate)) {
      suffix += 1;
      candidate = `${header}_${suffix}`;
    }
    used.add(candidate);
    nextSuffix.set(header, suffix + 1);
    return candidate;
  });
}

function parseCsv(input: string): { headers: string[]; rows: Row[] } {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (quoted) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"' && field.length === 0) {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error("CSV contains an unclosed quoted field.");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((value) => value !== "")) rows.push(row);
  }
  if (!rows.length) return { headers: [], rows: [] };

  const rawHeaders = rows[0].map((value) => value.trim());
  if (rawHeaders.some((header) => !header)) throw new Error("The header row contains an empty column name.");
  const headers = makeUniqueHeaders(rawHeaders);
  const data = rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
  return { headers, rows: data };
}

export default function CsvToJson() {
  const [input, setInput] = useState("");
  const [pretty, setPretty] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => {
    if (!input.trim()) return { headers: [], rows: [] as Row[] };
    try {
      if (input.length > MAX_INPUT_CHARS) throw new Error("CSV is too large. Keep the input below 2 MB.");
      const result = parseCsv(input.replace(/^\uFEFF/, ""));
      if (result.rows.length > MAX_ROWS) throw new Error(`CSV is limited to ${MAX_ROWS.toLocaleString()} data rows.`);
      return result;
    } catch (err) {
      return { headers: [], rows: [], error: err instanceof Error ? err.message : "Could not parse the CSV." };
    }
  }, [input]);

  const output = useMemo(() => JSON.stringify(parsed.rows, null, pretty ? 2 : 0), [parsed.rows, pretty]);

  const copy = async () => {
    if (!output || parsed.error) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setError("");
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setError("Copy was blocked by the browser. Select the JSON result and copy it manually.");
    }
  };

  const download = () => {
    if (!output || parsed.error) return;
    const blob = new Blob([`${output}\n`], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "converted.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setInput("");
    setError("");
    setCopied(false);
  };

  const inputLines = input ? input.split(/\r?\n/).length : 0;
  const outputLines = output ? output.split(/\r?\n/).length : 0;
  const hasResult = !!output && !parsed.error && parsed.rows.length > 0;

  return (
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8]" aria-labelledby="csv-json-workspace-title">
      <header className="border-b border-[#d8d4c9] px-5 py-6 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#dff4bd] text-[#171717]" aria-hidden="true"><FileSpreadsheet size={21} /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Developer utility</p>
              <h2 id="csv-json-workspace-title" className="mt-1 text-xl font-black tracking-tight text-[#171717] md:text-2xl">CSV to JSON converter</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/55">Turn CSV rows into JSON objects instantly. Conversion happens locally in your browser.</p>
            </div>
          </div>
          <button type="button" onClick={clear} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-[#c9c5ba] bg-white px-3.5 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.035] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60" aria-label="Clear CSV converter"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Clear</span></button>
        </div>
      </header>

      <div className="grid gap-5 p-5 md:grid-cols-2 md:p-7">
        <section className="rounded-xl border border-[#ddd9cf] bg-white p-4 md:p-5" aria-labelledby="csv-input-label">
          <div className="flex items-end justify-between gap-3">
            <div>
              <label id="csv-input-label" htmlFor="csv-json-input" className="block text-sm font-bold text-[#171717]">CSV input</label>
              <p className="mt-1 text-xs leading-5 text-black/45">Paste a header row followed by your data.</p>
            </div>
            <span className="rounded-full bg-[#f2efe7] px-2.5 py-1 text-[11px] font-semibold text-black/50">Local only</span>
          </div>
          <textarea id="csv-json-input" value={input} onChange={(event) => { setInput(event.target.value); setError(""); setCopied(false); }} className="mt-4 min-h-72 w-full resize-y rounded-lg border border-[#c9c5ba] bg-[#fffdf8] p-4 font-mono text-sm leading-6 text-[#171717] outline-none transition-shadow placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40 aria-[invalid=true]:border-red-400" placeholder={'name,email,role\nAisha,aisha@example.com,Designer\nRohan,rohan@example.com,Developer'} spellCheck={false} aria-describedby="csv-json-help" aria-invalid={!!parsed.error} />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-black/45">
            <p id="csv-json-help">Supports quoted fields, commas and line breaks inside quotes.</p>
            <span>{input.length.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()} characters</span>
          </div>
          <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-[#ddd9cf] bg-[#faf9f6] px-3.5 text-sm font-semibold focus-within:ring-4 focus-within:ring-[#c8f169]/40"><input type="checkbox" checked={pretty} onChange={(event) => setPretty(event.target.checked)} className="size-4 accent-[#171717]" />Pretty-print JSON</label>
        </section>

        <section className="rounded-xl border border-[#ddd9cf] bg-[#f6f3eb] p-4 md:p-5" aria-labelledby="csv-output-label">
          <div className="flex items-end justify-between gap-3">
            <div>
              <label id="csv-output-label" htmlFor="csv-json-output" className="block text-sm font-bold text-[#171717]">JSON result</label>
              <p className="mt-1 text-xs leading-5 text-black/45">One JSON object is created for each CSV data row.</p>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-black/50">{parsed.rows.length.toLocaleString()} rows</span>
          </div>
          <textarea id="csv-json-output" value={parsed.error ? "" : output} readOnly className="mt-4 min-h-72 w-full resize-y rounded-lg border border-[#d8d4c9] bg-[#171717] p-4 font-mono text-sm leading-6 text-white/90 outline-none placeholder:text-white/25 focus-visible:ring-4 focus-visible:ring-[#c8f169]/40" placeholder="JSON result appears here..." aria-describedby="csv-output-status" />
          <div id="csv-output-status" className="mt-2 text-xs text-black/45" aria-live="polite">{hasResult ? `${outputLines} ${outputLines === 1 ? "line" : "lines"} · ${output.length.toLocaleString()} characters` : parsed.error ? "Conversion needs attention" : "No result yet"}</div>
          {parsed.error && <p role="alert" className="mt-3 rounded-xl border border-[#ead7d2] bg-[#fff7f5] px-3 py-2.5 text-sm font-semibold leading-5 text-[#7b3d31]">{parsed.error}</p>}
          {error && <p role="alert" className="mt-3 rounded-xl border border-[#ead7d2] bg-[#fff7f5] px-3 py-2.5 text-sm font-semibold leading-5 text-[#7b3d31]">{error}</p>}
        </section>
      </div>

      <footer className="flex flex-col gap-3 border-t border-[#d8d4c9] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-7">
        <p className="text-xs leading-5 text-black/45">{input ? `${inputLines} ${inputLines === 1 ? "line" : "lines"} in input` : "Paste CSV to get started"} · Max {MAX_ROWS.toLocaleString()} data rows</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={copy} disabled={!hasResult} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#171717] bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60 disabled:cursor-not-allowed disabled:opacity-35" aria-label={copied ? "JSON result copied" : "Copy JSON result"}><span aria-hidden="true">{copied ? <Check size={14} /> : <Copy size={14} />}</span>{copied ? "Copied" : "Copy JSON"}</button>
          <button type="button" onClick={download} disabled={!hasResult} className="min-h-11 rounded-md border border-[#171717] bg-white px-5 text-sm font-bold text-[#171717] transition hover:bg-[#c8f169] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60 disabled:cursor-not-allowed disabled:opacity-35">Download JSON</button>
        </div>
      </footer>
    </div>
  );
}
