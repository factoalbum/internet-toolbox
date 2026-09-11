"use client";

import { useState } from "react";
import { FileDiff, Upload, X } from "lucide-react";

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");

type PdfInfo = {
  pages: number;
  text: string;
};

async function readPdf(file: File): Promise<PdfInfo> {
  const pdfjs: PdfJsModule = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push((content.items as Array<{ str?: string }>).map((item) => item.str ?? "").join(" ").trim());
  }

  return { pages: pdf.numPages, text: pages.join("\n") };
}

function compareText(first: string, second: string) {
  const left = first.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const right = second.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const all = new Set([...left, ...right]);
  let common = 0;

  for (const line of all) {
    if (leftSet.has(line) && rightSet.has(line)) common += 1;
  }

  return {
    similarity: Math.round((common / Math.max(1, all.size)) * 100),
    removed: left.filter((line) => !rightSet.has(line)).slice(0, 100),
    added: right.filter((line) => !leftSet.has(line)).slice(0, 100),
  };
}

function FileSlot({
  label,
  file,
  onChange,
  onClear,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  onClear: () => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-black uppercase tracking-[.12em] text-black/45">{label}</p>
      <label className="block min-h-28 cursor-pointer rounded-2xl border-2 border-dashed border-[#d3d0c6] bg-[#faf8f2] p-4 transition hover:border-[#171717] hover:bg-white focus-within:ring-4 focus-within:ring-[#c8f169]">
        <input
          className="sr-only"
          type="file"
          accept=".pdf,application/pdf"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
        <div className="flex h-full min-h-20 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#536b1c] shadow-sm" aria-hidden="true">
            <Upload size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">{file ? file.name : "Choose a PDF"}</p>
            <p className="mt-1 text-xs leading-5 text-black/40">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · processed locally` : "Click to browse or drop a PDF here"}</p>
          </div>
          {file && (
            <button
              type="button"
              onClick={(event) => { event.preventDefault(); event.stopPropagation(); onClear(); }}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-black/35 hover:bg-black/5 hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
              aria-label={`Remove ${label}`}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </label>
    </div>
  );
}

export default function PdfDifferenceCheckerWorkspace() {
  const [first, setFirst] = useState<File | null>(null);
  const [second, setSecond] = useState<File | null>(null);
  const [result, setResult] = useState<ReturnType<typeof compareText> & { firstPages: number; secondPages: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setResult(null);
    if (!first || !second) {
      setError("Choose both the original PDF and the revised PDF first.");
      return;
    }
    if (first.size > 20 * 1024 * 1024 || second.size > 20 * 1024 * 1024) {
      setError("Each PDF must be 20 MB or smaller.");
      return;
    }

    setBusy(true);
    try {
      const [original, revised] = await Promise.all([readPdf(first), readPdf(second)]);
      setResult({ ...compareText(original.text, revised.text), firstPages: original.pages, secondPages: revised.pages });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The PDFs could not be compared. Try different PDF files.");
    } finally {
      setBusy(false);
    }
  }

  const canRun = Boolean(first && second && !busy);

  return (
    <div className="p-4 sm:p-6 md:p-7">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-[#171717]" aria-hidden="true">
          <FileDiff size={19} />
        </span>
        <div>
          <h2 className="text-lg font-black">Find PDF changes</h2>
          <p className="mt-1 text-sm leading-5 text-black/50">Upload the original and revised PDFs to compare their readable text.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FileSlot label="Original PDF" file={first} onChange={setFirst} onClear={() => setFirst(null)} />
        <FileSlot label="Revised PDF" file={second} onChange={setSecond} onClear={() => setSecond(null)} />
      </div>

      <p className="mt-3 text-xs leading-5 text-black/40">Both files are processed in your browser. Scanned PDFs without a readable text layer may produce little or no text to compare.</p>

      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}

      <button
        type="button"
        onClick={run}
        disabled={!canRun}
        className="mt-4 min-h-12 w-full rounded-xl bg-[#171717] px-5 text-sm font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
      >
        {busy ? "Comparing PDFs..." : "Compare changes"}
      </button>

      {result && (
        <div className="mt-6 space-y-4" aria-live="polite">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#171717] p-5 text-white">
              <p className="text-xs font-bold text-white/50">Text similarity</p>
              <p className="mt-1 text-4xl font-black">{result.similarity}%</p>
            </div>
            <div className="rounded-2xl border border-[#ddd9cf] bg-white p-5">
              <p className="text-xs font-bold text-black/40">Original</p>
              <p className="mt-1 text-2xl font-black">{result.firstPages} pages</p>
            </div>
            <div className="rounded-2xl border border-[#ddd9cf] bg-white p-5">
              <p className="text-xs font-bold text-black/40">Revised</p>
              <p className="mt-1 text-2xl font-black">{result.secondPages} pages</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <section className="rounded-2xl border border-[#d8e6b4] bg-[#f5fae8] p-4" aria-labelledby="pdf-added-heading">
              <p id="pdf-added-heading" className="text-xs font-black uppercase tracking-[.12em] text-[#58731d]">Added in revised PDF</p>
              {result.added.length ? <ul className="mt-3 space-y-2 text-sm">{result.added.map((line, index) => <li key={`added-${index}-${line}`} className="break-words">+ {line}</li>)}</ul> : <p className="mt-3 text-sm text-black/50">No added text lines found.</p>}
            </section>
            <section className="rounded-2xl border border-[#e7d1d1] bg-[#fff7f7] p-4" aria-labelledby="pdf-removed-heading">
              <p id="pdf-removed-heading" className="text-xs font-black uppercase tracking-[.12em] text-[#8a4545]">Removed from revised PDF</p>
              {result.removed.length ? <ul className="mt-3 space-y-2 text-sm">{result.removed.map((line, index) => <li key={`removed-${index}-${line}`} className="break-words">− {line}</li>)}</ul> : <p className="mt-3 text-sm text-black/50">No removed text lines found.</p>}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
