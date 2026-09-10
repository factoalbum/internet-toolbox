"use client";

import { useCallback, useState } from "react";
import { FileText, LoaderCircle, ScanSearch, ShieldCheck, Upload, XCircle } from "lucide-react";

type Analysis = {
  pages: number;
  text: string;
  tokens: Set<string>;
  blocks: { x: number; y: number; w: number; h: number }[];
  pageSizes: { width: number; height: number }[];
  renders: ImageData[];
};

type Score = { value: number; label: string; note: string };

const MAX_FILE_BYTES = 12 * 1024 * 1024;
const MAX_PAGES = 24;
const MAX_RENDER_PAGES = 8;

function tokenize(text: string) {
  return new Set(text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").split(/\s+/).filter((word) => word.length > 1));
}

function similarity(a: Set<string>, b: Set<string>) {
  if (!a.size && !b.size) return 100;
  const intersection = [...a].filter((item) => b.has(item)).length;
  const union = new Set([...a, ...b]).size;
  return union ? Math.round((intersection / union) * 100) : 0;
}

function clampScore(value: number) { return Math.max(0, Math.min(100, Math.round(value))); }

function labelFor(score: number) {
  if (score >= 90) return "Very high";
  if (score >= 75) return "High";
  if (score >= 50) return "Moderate";
  return "Low";
}

async function loadPdf(file: File): Promise<Analysis> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) throw new Error("Please choose a PDF file.");
  if (file.size > MAX_FILE_BYTES) throw new Error("Each PDF must be 12 MB or smaller.");

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const document = await pdfjs.getDocument({ data: bytes, disableWorker: true }).promise;
  if (document.numPages > MAX_PAGES) throw new Error(`This tool supports up to ${MAX_PAGES} pages per PDF.`);

  const blocks: Analysis["blocks"] = [];
  const pageSizes: Analysis["pageSizes"] = [];
  const textParts: string[] = [];
  const renders: ImageData[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    pageSizes.push({ width: viewport.width, height: viewport.height });
    const content = await page.getTextContent();
    const pageText: string[] = [];
    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      pageText.push(item.str);
      const transform = item.transform;
      const x = transform[4] / viewport.width;
      const y = 1 - transform[5] / viewport.height;
      const w = Math.max(0, item.width / viewport.width);
      const h = Math.max(0, item.height / viewport.height);
      blocks.push({ x, y, w, h });
    }
    textParts.push(pageText.join(" "));

    if (pageNumber <= MAX_RENDER_PAGES && typeof window !== "undefined") {
      const scale = Math.min(0.42, 700 / viewport.width);
      const renderViewport = page.getViewport({ scale });
      const canvas = window.document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(renderViewport.width));
      canvas.height = Math.max(1, Math.floor(renderViewport.height));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (context) {
        await page.render({ canvasContext: context, viewport: renderViewport }).promise;
        renders.push(context.getImageData(0, 0, canvas.width, canvas.height));
      }
    }
  }

  return { pages: document.numPages, text: textParts.join("\n"), tokens: tokenize(textParts.join("\n")), blocks, pageSizes, renders };
}

function layoutScore(a: Analysis, b: Analysis) {
  const pageRatio = Math.min(a.pages, b.pages) / Math.max(a.pages, b.pages);
  const sizeCount = Math.min(a.pageSizes.length, b.pageSizes.length);
  let sizeScore = 0;
  for (let i = 0; i < sizeCount; i += 1) {
    const aw = a.pageSizes[i].width;
    const ah = a.pageSizes[i].height;
    const bw = b.pageSizes[i].width;
    const bh = b.pageSizes[i].height;
    sizeScore += (Math.min(aw, bw) / Math.max(aw, bw) + Math.min(ah, bh) / Math.max(ah, bh)) / 2;
  }
  sizeScore = sizeCount ? sizeScore / sizeCount : 0;
  const blockCountRatio = Math.min(a.blocks.length, b.blocks.length) / Math.max(1, Math.max(a.blocks.length, b.blocks.length));
  const positionCount = Math.min(a.blocks.length, b.blocks.length);
  let positionScore = 0;
  for (let i = 0; i < positionCount; i += 1) {
    const first = a.blocks[i];
    const second = b.blocks[i];
    positionScore += 1 - Math.min(1, Math.hypot(first.x - second.x, first.y - second.y) * 2.4);
  }
  positionScore = positionCount ? positionScore / positionCount : 0;
  return clampScore(pageRatio * 30 + sizeScore * 20 + blockCountRatio * 20 + positionScore * 30);
}

function visualScore(a: Analysis, b: Analysis) {
  const count = Math.min(a.renders.length, b.renders.length);
  if (!count) return 0;
  let total = 0;
  for (let i = 0; i < count; i += 1) {
    const first = a.renders[i];
    const second = b.renders[i];
    const samples = Math.min(first.data.length, second.data.length);
    const step = Math.max(4, Math.floor(samples / 18000));
    let difference = 0;
    let sampleCount = 0;
    for (let j = 0; j < samples; j += step) {
      const firstLum = first.data[j] * 0.299 + first.data[j + 1] * 0.587 + first.data[j + 2] * 0.114;
      const secondLum = second.data[j] * 0.299 + second.data[j + 1] * 0.587 + second.data[j + 2] * 0.114;
      difference += Math.abs(firstLum - secondLum) / 255;
      sampleCount += 1;
    }
    total += Math.max(0, 1 - difference / Math.max(1, sampleCount));
  }
  const pageCoverage = count / Math.max(a.pages, b.pages);
  return clampScore((total / count) * 100 * 0.85 + pageCoverage * 15);
}

function scoreNote(score: number, subject: string) {
  if (score >= 90) return `${subject} looks extremely close between the two files.`;
  if (score >= 75) return `${subject} is strongly aligned, with some differences to review.`;
  if (score >= 50) return `${subject} has a noticeable overlap, but the documents are not the same.`;
  return `${subject} differs substantially between the two files.`;
}

export default function DocumentSimilarity() {
  const [first, setFirst] = useState<File | null>(null);
  const [second, setSecond] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<{ first: Analysis; second: Analysis } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const choose = useCallback((setter: (file: File | null) => void, file?: File) => {
    setError("");
    setAnalysis(null);
    setter(file ?? null);
  }, []);

  async function compare() {
    if (!first || !second) { setError("Choose both PDF files before comparing them."); return; }
    setBusy(true); setError(""); setAnalysis(null);
    try {
      const [firstAnalysis, secondAnalysis] = await Promise.all([loadPdf(first), loadPdf(second)]);
      setAnalysis({ first: firstAnalysis, second: secondAnalysis });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not read these PDFs.");
    } finally { setBusy(false); }
  }

  const textScore = analysis ? similarity(analysis.first.tokens, analysis.second.tokens) : 0;
  const layout = analysis ? layoutScore(analysis.first, analysis.second) : 0;
  const visual = analysis ? visualScore(analysis.first, analysis.second) : 0;
  const overall = analysis ? clampScore(textScore * 0.45 + layout * 0.3 + visual * 0.25) : 0;
  const scores: Score[] = [
    { value: textScore, label: "Content similarity", note: scoreNote(textScore, "The written content") },
    { value: layout, label: "Alignment & layout", note: scoreNote(layout, "Text placement, page sizes and structure") },
    { value: visual, label: "Visual similarity", note: scoreNote(visual, "The rendered page appearance") },
  ];

  return (
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8] shadow-[6px_6px_0_#171717]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-5 md:px-7">
        <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#c8f169]" aria-hidden="true"><ScanSearch size={20} /></span><div><p className="font-bold">Compare two PDFs</p><p className="mt-1 text-sm leading-5 text-black/50">Check whether two documents are similar in content, alignment and visual style.</p></div></div>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2 md:p-7">
        {([['First PDF', first, setFirst], ['Second PDF', second, setSecond]] as const).map(([label, file, setter]) => (
          <label key={label} className="group block cursor-pointer rounded-2xl border-2 border-dashed border-[#c9c5bb] bg-[#f8f5ed] p-5 transition hover:border-[#171717] hover:bg-white focus-within:border-[#171717]">
            <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => choose(setter, event.target.files?.[0])} />
            <span className="flex items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#c62828] shadow-sm"><FileText size={20} /></span><span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-black/40">{label}</span><span className="mt-1 block truncate text-sm font-bold">{file?.name ?? "Choose a PDF"}</span></span></span>
            <span className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-bold text-white transition group-hover:bg-black">{file ? "Replace file" : <><Upload size={16} /> Choose PDF</>}</span>
            {file && <span className="mt-2 block text-xs text-black/40">{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
          </label>
        ))}
      </div>
      <div className="px-5 pb-5 md:px-7 md:pb-7"><button type="button" onClick={compare} disabled={busy || !first || !second} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c8f169] px-5 text-sm font-black text-[#171717] transition hover:bg-[#b8e656] disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">{busy ? <><LoaderCircle size={18} className="animate-spin" /> Comparing PDFs...</> : <><ScanSearch size={18} /> Compare documents</>}</button><p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-black/40"><ShieldCheck size={14} /> Files are processed locally in your browser and are not uploaded.</p></div>
      {error && <div className="mx-5 mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 md:mx-7"><XCircle size={18} className="mt-0.5 shrink-0" /><p>{error}</p></div>}
      {analysis && <section className="border-t border-[#d8d4c9] bg-white p-5 md:p-7" aria-live="polite"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/40">Similarity result</p><p className="mt-1 text-4xl font-black tracking-tight">{overall}%</p><p className="mt-1 text-sm text-black/50">{labelFor(overall)} overall similarity</p></div><div className="rounded-xl bg-[#e9f4cf] px-4 py-3 text-sm font-bold text-[#425515]">{analysis.first.pages} pages vs {analysis.second.pages} pages</div></div><div className="mt-6 grid gap-3 md:grid-cols-3">{scores.map((score) => <div key={score.label} className="rounded-xl border border-[#e1ded6] bg-[#fffdf8] p-4"><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold">{score.label}</span><span className="text-lg font-black">{score.value}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8e4d9]"><div className="h-full rounded-full bg-[#171717]" style={{ width: `${score.value}%` }} /></div><p className="mt-3 text-xs leading-5 text-black/45">{score.note}</p></div>)}</div><div className="mt-5 rounded-xl border border-[#e1ded6] bg-[#f8f5ed] p-4"><p className="text-sm font-bold">What this checks</p><ul className="mt-2 grid gap-1 text-xs leading-5 text-black/50 sm:grid-cols-3"><li>• Text overlap and wording</li><li>• Page dimensions and text placement</li><li>• Rendered visual appearance</li></ul></div><p className="mt-4 text-xs leading-5 text-black/35">Similarity scores are an automated comparison, not proof that documents are identical. Scanned PDFs without selectable text may produce lower content scores.</p></section>}
    </div>
  );
}
