"use client";

import { Copy, Download, RotateCcw, Table2 } from "lucide-react";
import { useState } from "react";

const sample = '[{"name":"Alice","age":30,"city":"Mumbai"},{"name":"Bob","age":28,"city":"Pune"}]';
const MAX_ROWS = 5000;

function escapeCsv(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(text)
    ? '"' + text.replaceAll('"', '""') + '"'
    : text;
}

function toCsv(value: unknown) {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((row) => row === null || typeof row !== "object" || Array.isArray(row))
  ) {
    throw new Error("Input must be a JSON array of objects.");
  }
  if (value.length > MAX_ROWS) {
    throw new Error("Please convert " + MAX_ROWS.toLocaleString() + " rows or fewer at a time.");
  }

  const rows = value as Record<string, unknown>[];
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  if (columns.length === 0) {
    throw new Error("The JSON objects do not contain any fields.");
  }
  return [
    columns.map(escapeCsv).join(","),
    ...rows.map((row) => columns.map((column) => escapeCsv(row[column])).join(",")),
  ].join("\n");
}

export default function JsonToCsv() {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function convert() {
    try {
      setOutput(toCsv(JSON.parse(input)));
      setError("");
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Could not convert the JSON.");
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function download() {
    if (!output) return;
    const url = URL.createObjectURL(new Blob([output], { type: "text/csv;charset=utf-8" }));
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
  }

  return (
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#c8f169]">
              <Table2 size={20} />
            </span>
            <div>
              <p className="font-bold">Convert JSON array to CSV</p>
              <p className="text-sm text-black/45">Everything runs locally in your browser.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-black/45 transition hover:bg-white hover:text-black"
            aria-label="Reset JSON to CSV converter"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2 md:p-7">
        <div>
          <label htmlFor="json-csv-input" className="mb-2 block text-sm font-bold">
            JSON array
          </label>
          <textarea
            id="json-csv-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            className="min-h-80 w-full resize-y border border-[#cfcabf] bg-[#f8f5ed] p-4 font-mono text-sm leading-6 outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="json-csv-output" className="text-sm font-bold">
              CSV output
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#d8d4c9] px-3 text-xs font-bold transition hover:bg-[#c8f169] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Copy size={14} />
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={download}
                disabled={!output}
                className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#d8d4c9] px-3 text-xs font-bold transition hover:bg-[#c8f169] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          </div>
          <textarea
            id="json-csv-output"
            value={output}
            readOnly
            spellCheck={false}
            placeholder="CSV will appear here..."
            className="min-h-80 w-full resize-y border border-[#cfcabf] bg-[#171717] p-4 font-mono text-sm leading-6 text-[#c8f169] outline-none placeholder:text-white/25"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-[#d8d4c9] px-5 py-4 md:px-7">
        <button
          type="button"
          onClick={convert}
          className="min-h-11 border border-[#171717] bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black/80"
        >
          Convert to CSV
        </button>
        {error && (
          <p className="w-full text-sm font-medium text-red-700 md:w-auto" role="alert">
            {error}
          </p>
        )}
      </div>

      <p className="border-t border-[#d8d4c9] px-5 py-3 text-xs leading-5 text-black/45 md:px-7">
        Accepts a JSON array where each item is an object. Nested values are kept as JSON inside their CSV cell.
      </p>
    </div>
  );
}
