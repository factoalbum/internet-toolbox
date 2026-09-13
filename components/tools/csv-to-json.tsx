"use client";

import { useMemo, useState } from "react";

const MAX_ROWS = 5000;
const MAX_INPUT_CHARS = 2_000_000;
const inputClass = "mt-2 w-full rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] px-4 py-3 text-base outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]";

type Row = Record<string, string>;

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
  const headers = rawHeaders.map((header, index) => {
    if (rawHeaders.slice(0, index).includes(header)) return `${header}_${index + 1}`;
    return header;
  });
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

  const changeInput = (value: string) => {
    setInput(value);
    setError("");
    setCopied(false);
  };

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="csv-json-input" className="text-sm font-semibold">CSV input</label>
          <textarea id="csv-json-input" value={input} onChange={(event) => changeInput(event.target.value)} className={`${inputClass} min-h-72 resize-y font-mono text-sm`} placeholder={'name,email,role\nAisha,aisha@example.com,Designer\nRohan,rohan@example.com,Developer'} spellCheck={false} aria-describedby="csv-json-help" />
          <p id="csv-json-help" className="mt-2 text-xs leading-5 text-black/45">The first row becomes JSON property names. Quoted fields, commas and line breaks inside quotes are supported.</p>
          <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={pretty} onChange={(event) => setPretty(event.target.checked)} className="size-4 accent-[#171717]" />Pretty-print JSON</label>
        </div>
        <div>
          <div className="flex items-center justify-between gap-3"><label htmlFor="csv-json-output" className="text-sm font-semibold">JSON output</label><span className="text-xs font-medium text-black/40">{parsed.rows.length.toLocaleString()} rows</span></div>
          <textarea id="csv-json-output" value={parsed.error ? "" : output} readOnly className={`${inputClass} min-h-72 resize-y font-mono text-sm`} placeholder="JSON output appears here" aria-describedby={parsed.error ? "csv-json-error" : undefined} />
          {parsed.error && <p id="csv-json-error" role="alert" className="mt-2 text-sm font-semibold text-red-700">{parsed.error}</p>}
          {error && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={copy} disabled={!output || !!parsed.error} className="min-h-11 rounded-lg bg-[#171717] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{copied ? "Copied" : "Copy JSON"}</button>
            <button type="button" onClick={download} disabled={!output || !!parsed.error} className="min-h-11 rounded-lg border border-[#d8d4c9] px-5 text-sm font-semibold hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40">Download JSON</button>
            <button type="button" onClick={() => changeInput("")} className="min-h-11 rounded-lg border border-[#d8d4c9] px-5 text-sm font-semibold hover:bg-black/5">Clear</button>
          </div>
        </div>
      </div>
      <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Conversion runs in your browser. The converter creates one JSON object per CSV data row and does not infer numbers, booleans or nested objects.</p>
    </div>
  );
}
