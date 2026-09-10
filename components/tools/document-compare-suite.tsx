"use client";

import { useMemo, useState } from "react";
import { Download, FileArchive, FileImage, FileText, GitCompare, Image as ImageIcon, ScanSearch, Upload, X } from "lucide-react";
import { PDFDocument } from "pdf-lib";

type Variant =
  | "pdf-difference-checker" | "pdf-visual-comparator" | "pdf-layout-checker" | "pdf-text-extractor"
  | "pdf-metadata-viewer" | "pdf-page-analyzer" | "pdf-merger" | "pdf-splitter" | "pdf-to-images"
  | "images-to-pdf" | "pdf-compressor" | "image-similarity-checker" | "screenshot-difference-checker"
  | "image-metadata-viewer" | "image-dimension-checker" | "document-compare";

type PdfInfo = { pages: number; width: number; height: number; text: string; items: Array<{ page: number; x: number; y: number; width: number; height: number; text: string }> };

const labels: Record<Variant, { title: string; description: string }> = {
  "pdf-difference-checker": { title: "Find PDF changes", description: "Compare readable text in two PDFs and see added, removed and changed lines." },
  "pdf-visual-comparator": { title: "Compare PDF visuals", description: "Render two PDFs and inspect matching pages side by side or as an overlay." },
  "pdf-layout-checker": { title: "Check PDF layout", description: "Compare page size, text placement and layout structure between two PDFs." },
  "pdf-text-extractor": { title: "Extract PDF text", description: "Pull readable text from a PDF and copy or download it locally." },
  "pdf-metadata-viewer": { title: "Inspect PDF metadata", description: "View PDF version, page count, dimensions and document metadata." },
  "pdf-page-analyzer": { title: "Analyze PDF pages", description: "See page dimensions, orientation, text density and file size at a glance." },
  "pdf-merger": { title: "Merge PDFs", description: "Combine multiple PDF files into one PDF directly in your browser." },
  "pdf-splitter": { title: "Split a PDF", description: "Select page ranges and create a new PDF from the pages you need." },
  "pdf-to-images": { title: "Convert PDF to images", description: "Render PDF pages as PNG images and download them individually." },
  "images-to-pdf": { title: "Turn images into PDF", description: "Combine JPG, PNG and WebP images into a single PDF locally." },
  "pdf-compressor": { title: "Compress a PDF", description: "Re-render PDF pages at a smaller resolution to reduce file size." },
  "image-similarity-checker": { title: "Compare two images", description: "Measure visual similarity and compare dimensions between two images." },
  "screenshot-difference-checker": { title: "Compare screenshots", description: "Compare expected and actual screenshots and highlight visual differences." },
  "image-metadata-viewer": { title: "Inspect image metadata", description: "View image format, dimensions, file size, transparency and color information." },
  "image-dimension-checker": { title: "Check image dimensions", description: "Get exact image dimensions, aspect ratio, orientation and megapixels." },
  "document-compare": { title: "Compare documents", description: "Compare two supported text documents for content and structure changes." },
};

async function loadPdf(file: File): Promise<PdfInfo> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data, disableWorker: true }).promise;
  let text = "";
  const items: PdfInfo["items"] = [];
  let width = 0; let height = 0;
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const viewport = page.getViewport({ scale: 1 });
    width = Math.max(width, viewport.width); height = Math.max(height, viewport.height);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: { str?: string }) => item.str ?? "").join(" ");
    text += `${pageText}\n`;
    for (const item of content.items) {
      const raw = item as { str?: string; transform?: number[]; width?: number; height?: number };
      if (!raw.str?.trim()) continue;
      items.push({ page: pageNo, x: raw.transform?.[4] ?? 0, y: raw.transform?.[5] ?? 0, width: raw.width ?? 0, height: raw.height ?? 0, text: raw.str });
    }
  }
  return { pages: pdf.numPages, width, height, text, items };
}

function words(value: string) { return new Set(value.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean)); }
function similarity(a: string, b: string) { const x = words(a); const y = words(b); if (!x.size && !y.size) return 100; let common = 0; for (const word of x) if (y.has(word)) common++; return Math.round((common / Math.max(1, new Set([...x, ...y]).size)) * 100); }
function lines(value: string) { return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean); }
function diffLines(a: string, b: string) {
  const aa = lines(a); const bb = lines(b); const setA = new Set(aa); const setB = new Set(bb);
  return { removed: aa.filter((line) => !setB.has(line)).slice(0, 80), added: bb.filter((line) => !setA.has(line)).slice(0, 80) };
}
function prettyBytes(bytes: number) { return `${(bytes / 1024 / 1024).toFixed(2)} MB`; }

async function renderPdfPage(file: File, pageNo: number, scale = 0.7) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data, disableWorker: true }).promise;
  const page = await pdf.getPage(Math.min(pageNo, pdf.numPages));
  const viewport = page.getViewport({ scale });
  const canvas = window.document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
  await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
  return { dataUrl: canvas.toDataURL("image/jpeg", 0.76), width: viewport.width, height: viewport.height };
}

function downloadBlob(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const a = window.document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); }

function FileDrop({ label, accept, multiple = false, files, onFiles }: { label: string; accept: string; multiple?: boolean; files: File[]; onFiles: (files: File[]) => void }) {
  return <label className="group block cursor-pointer rounded-2xl border-2 border-dashed border-[#d2cec3] bg-[#faf8f2] p-5 transition hover:border-[#9da08f]">
    <input className="sr-only" type="file" accept={accept} multiple={multiple} onChange={(event) => onFiles(Array.from(event.target.files ?? []))} />
    <div className="flex items-center gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#596b23] shadow-sm"><Upload size={19} /></span><div className="min-w-0 flex-1"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">{label}</p><p className="mt-1 truncate text-sm font-bold">{files.length ? files.map((file) => file.name).join(", ") : "Choose file${multiple ? "s" : ""}"}</p></div></div>
  </label>;
}

function ResultCard({ label, value }: { label: string; value: string | number }) { return <div className="rounded-2xl border border-[#ddd9cf] bg-white p-4"><p className="text-[11px] font-black uppercase tracking-[.12em] text-black/35">{label}</p><p className="mt-2 text-xl font-black">{value}</p></div>; }

export default function DocumentCompareSuite({ variant }: { variant: Variant }) {
  const [files, setFiles] = useState<File[]>([]); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const label = labels[variant];
  const pdfMode = variant.startsWith("pdf-") || variant === "document-compare";
  const accept = pdfMode ? ".pdf,application/pdf" : "image/*,.txt,.md,.markdown,.csv,.json,.html,.htm,.css,.js,.ts,.tsx";
  const maxFiles = variant === "pdf-merger" || variant === "images-to-pdf" ? 10 : variant === "pdf-to-images" ? 1 : variant === "pdf-splitter" || variant === "pdf-compressor" || variant === "pdf-text-extractor" || variant === "pdf-metadata-viewer" || variant === "pdf-page-analyzer" ? 1 : 2;
  const ready = files.length >= (maxFiles === 1 ? 1 : 2);
  const action = useMemo(() => ({
    "pdf-difference-checker": "Compare changes", "pdf-visual-comparator": "Compare visuals", "pdf-layout-checker": "Check layout", "pdf-text-extractor": "Extract text", "pdf-metadata-viewer": "Inspect PDF", "pdf-page-analyzer": "Analyze pages", "pdf-merger": "Merge PDFs", "pdf-splitter": "Split PDF", "pdf-to-images": "Render pages", "images-to-pdf": "Create PDF", "pdf-compressor": "Compress PDF", "image-similarity-checker": "Compare images", "screenshot-difference-checker": "Find differences", "image-metadata-viewer": "Inspect image", "image-dimension-checker": "Check dimensions", "document-compare": "Compare documents",
  } as Record<Variant, string>)[variant], [variant]);

  async function run() {
    setBusy(true); setError(""); setResult(null);
    try {
      if (!ready) throw new Error(`Choose ${maxFiles === 1 ? "a file" : "two files"} first.`);
      if (files.some((file) => file.size > 20 * 1024 * 1024)) throw new Error("Each file must be 20 MB or smaller.");
      if (variant === "pdf-merger") { const out = await PDFDocument.create(); for (const file of files) { const doc = await PDFDocument.load(await file.arrayBuffer()); const pages = await out.copyPages(doc, doc.getPageIndices()); pages.forEach((page) => out.addPage(page)); } downloadBlob(new Blob([await out.save()], { type: "application/pdf" }), "merged.pdf"); setResult({ message: `${files.length} PDFs merged successfully.` }); return; }
      if (variant === "images-to-pdf") { const out = await PDFDocument.create(); for (const file of files) { const bytes = await file.arrayBuffer(); const image = file.type === "image/png" ? await out.embedPng(bytes) : await out.embedJpg(bytes); const page = out.addPage([image.width, image.height]); page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height }); } downloadBlob(new Blob([await out.save()], { type: "application/pdf" }), "images.pdf"); setResult({ message: `${files.length} images added to the PDF.` }); return; }
      if (variant === "pdf-splitter") { const doc = await PDFDocument.load(await files[0].arrayBuffer()); const selected = window.prompt(`Enter pages to keep (example: 1-3,5). PDF has ${doc.getPageCount()} pages.`); if (!selected) return; const indices = parsePageSelection(selected, doc.getPageCount()); const out = await PDFDocument.create(); const pages = await out.copyPages(doc, indices); pages.forEach((page) => out.addPage(page)); downloadBlob(new Blob([await out.save()], { type: "application/pdf" }), "split.pdf"); setResult({ message: `${indices.length} pages exported.` }); return; }
      if (variant === "pdf-to-images") { const rendered = []; const info = await loadPdf(files[0]); for (let page = 1; page <= Math.min(info.pages, 12); page++) rendered.push(await renderPdfPage(files[0], page)); setResult({ images: rendered, count: rendered.length }); return; }
      if (variant === "pdf-compressor") { const info = await loadPdf(files[0]); const out = await PDFDocument.create(); for (let page = 1; page <= Math.min(info.pages, 24); page++) { const rendered = await renderPdfPage(files[0], page, 0.55); const response = await fetch(rendered.dataUrl); const bytes = await response.arrayBuffer(); const image = await out.embedJpg(bytes); const p = out.addPage([rendered.width / 0.55, rendered.height / 0.55]); p.drawImage(image, { x: 0, y: 0, width: p.getWidth(), height: p.getHeight() }); } const bytes = await out.save(); downloadBlob(new Blob([bytes], { type: "application/pdf" }), "compressed.pdf"); setResult({ message: `Created a re-rendered PDF from ${info.pages} pages.`, size: bytes.byteLength, original: files[0].size }); return; }
      if (!pdfMode) { await runImageTool(); return; }
      const a = await loadPdf(files[0]); const b = await loadPdf(files[1]);
      if (variant === "pdf-text-extractor") { downloadBlob(new Blob([a.text], { type: "text/plain" }), `${files[0].name.replace(/\.pdf$/i, "")}.txt`); setResult({ text: a.text, pages: a.pages }); return; }
      if (variant === "pdf-metadata-viewer" || variant === "pdf-page-analyzer") { setResult({ pages: a.pages, width: Math.round(a.width), height: Math.round(a.height), orientation: a.width >= a.height ? "Landscape" : "Portrait", textLength: a.text.length, size: files[0].size }); return; }
      if (variant === "pdf-difference-checker" || variant === "document-compare") { const d = diffLines(a.text, b.text); setResult({ similarity: similarity(a.text, b.text), ...d }); return; }
      if (variant === "pdf-layout-checker") { const count = Math.min(a.items.length, b.items.length); let near = 0; for (let i = 0; i < count; i++) { const x = a.items[i]; const y = b.items[i]; const tolerance = 8; if (x.page === y.page && Math.abs(x.x - y.x) <= tolerance && Math.abs(x.y - y.y) <= tolerance) near++; } setResult({ similarity: similarity(a.text, b.text), layout: count ? Math.round((near / count) * 100) : 0, pagesA: a.pages, pagesB: b.pages, sizeA: `${Math.round(a.width)} × ${Math.round(a.height)}`, sizeB: `${Math.round(b.width)} × ${Math.round(b.height)}` }); return; }
      const renderedA = await renderPdfPage(files[0], 1); const renderedB = await renderPdfPage(files[1], 1); setResult({ similarity: similarity(a.text, b.text), pagesA: a.pages, pagesB: b.pages, firstA: renderedA.dataUrl, firstB: renderedB.dataUrl });
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong. Try again."); } finally { setBusy(false); }
  }

  async function runImageTool() {
    const [a, b] = files; const imageA = await imageInfo(a); if (variant === "image-metadata-viewer" || variant === "image-dimension-checker") { setResult(imageA); return; }
    const imageB = await imageInfo(b); const similarityScore = await compareImages(a, b); setResult({ similarity: similarityScore, widthA: imageA.width, heightA: imageA.height, widthB: imageB.width, heightB: imageB.height, sameDimensions: imageA.width === imageB.width && imageA.height === imageB.height, firstA: await preview(a), firstB: await preview(b) });
  }

  return <div className="p-4 sm:p-6 md:p-7">
    <div className="mb-5 flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-[#171717]"><GitCompare size={19} /></span><div><h2 className="text-lg font-black">{label.title}</h2><p className="mt-1 text-sm leading-5 text-black/50">{label.description}</p></div></div>
    <div className="grid gap-3 md:grid-cols-2">{Array.from({ length: maxFiles }).map((_, index) => <div key={index} className="relative">{files[index] && <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== index))} className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-white shadow-sm" aria-label={`Remove file ${index + 1}`}><X size={15} /></button>}<FileDrop label={maxFiles === 1 ? "PDF file" : `${index === 0 ? "First" : "Second"} file`} accept={accept} multiple={maxFiles > 2} files={files[index] ? [files[index]] : []} onFiles={(selected) => setFiles((current) => { const next = [...current]; if (maxFiles > 2 && selected.length) return [...current, ...selected].slice(0, maxFiles); next[index] = selected[0]; return next.filter(Boolean); })} /></div>)}</div>
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"><button type="button" disabled={busy || !ready} onClick={run} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#c8f169] px-5 text-sm font-black text-[#171717] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45">{busy ? "Working..." : action}<ScanSearch size={17} /></button><p className="text-center text-xs text-black/40 sm:max-w-xs">Files are processed locally in your browser.</p></div>
    {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {result && <div className="mt-6 space-y-4">{typeof result.similarity === "number" && <div className="grid gap-3 sm:grid-cols-3"><ResultCard label="Similarity" value={`${result.similarity}%`} /><ResultCard label="File 1 pages" value={String(result.pagesA ?? "-")} /><ResultCard label="File 2 pages" value={String(result.pagesB ?? "-")} /></div>}{typeof result.layout === "number" && <ResultCard label="Layout match" value={`${result.layout}%`} />}{typeof result.message === "string" && <div className="rounded-xl bg-[#eef7d8] p-4 text-sm font-bold">{result.message}</div>}{typeof result.text === "string" && <textarea readOnly value={result.text} className="min-h-64 w-full resize-y rounded-xl border border-[#ddd9cf] bg-white p-4 font-mono text-xs leading-5 outline-none" aria-label="Extracted text" />}{Array.isArray(result.removed) && <div className="grid gap-3 md:grid-cols-2"><DiffBlock title="Removed" items={result.removed as string[]} /><DiffBlock title="Added" items={result.added as string[]} /></div>}{Array.isArray(result.images) && <div className="grid gap-3 sm:grid-cols-2">{(result.images as Array<{ dataUrl: string }>).map((image, i) => <img key={i} src={image.dataUrl} alt={`Rendered PDF page ${i + 1}`} className="w-full rounded-xl border border-[#ddd9cf]" />)}</div>}{typeof result.firstA === "string" && typeof result.firstB === "string" && <div className="grid gap-3 md:grid-cols-2"><Preview src={result.firstA} label="First file" /><Preview src={result.firstB} label="Second file" /></div>}{typeof result.size === "number" && <p className="text-xs text-black/45">Original: {prettyBytes(Number(result.original))} · New: {prettyBytes(Number(result.size))}</p>}</div>}
  </div>;
}

function DiffBlock({ title, items }: { title: string; items: string[] }) { return <div className="rounded-xl border border-[#ddd9cf] bg-white p-4"><p className="text-xs font-black uppercase tracking-[.12em]">{title} ({items.length})</p>{items.length ? <ul className="mt-3 space-y-2 text-xs leading-5 text-black/65">{items.map((item, i) => <li key={`${item}-${i}`} className="rounded-lg bg-[#f7f5ef] p-2">{item}</li>)}</ul> : <p className="mt-3 text-sm text-black/40">No unique lines found.</p>}</div>; }
function Preview({ src, label }: { src: string; label: string }) { return <div><p className="mb-2 text-xs font-black uppercase tracking-[.1em] text-black/40">{label}</p><img src={src} alt={`${label} preview`} className="w-full rounded-xl border border-[#ddd9cf] bg-white" /></div>; }
function parsePageSelection(value: string, max: number) { const set = new Set<number>(); for (const part of value.split(",")) { const [startRaw, endRaw] = part.trim().split("-"); const start = Math.max(1, Number(startRaw)); const end = Math.min(max, Number(endRaw ?? startRaw)); for (let i = start; i <= end; i++) if (Number.isFinite(i)) set.add(i - 1); } return [...set].sort((a, b) => a - b); }
async function preview(file: File) { return new Promise<string>((resolve, reject) => { const url = URL.createObjectURL(file); const image = new Image(); image.onload = () => { const canvas = window.document.createElement("canvas"); const scale = Math.min(1, 900 / image.width); canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale)); canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height); URL.revokeObjectURL(url); resolve(canvas.toDataURL("image/jpeg", .8)); }; image.onerror = reject; image.src = url; }); }
async function imageInfo(file: File) { const url = URL.createObjectURL(file); const image = new Image(); await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = reject; image.src = url; }); const width = image.width; const height = image.height; URL.revokeObjectURL(url); return { width, height, aspectRatio: (width / height).toFixed(3), megapixels: ((width * height) / 1e6).toFixed(2), size: prettyBytes(file.size), type: file.type || "Unknown", name: file.name, orientation: width >= height ? "Landscape" : "Portrait" }; }
async function compareImages(a: File, b: File) { const [ia, ib] = await Promise.all([imageData(a), imageData(b)]); const width = 80; const height = 80; let error = 0; for (let i = 0; i < width * height; i++) { const ai = i * 4; error += Math.abs(ia[ai] - ib[ai]) + Math.abs(ia[ai + 1] - ib[ai + 1]) + Math.abs(ia[ai + 2] - ib[ai + 2]); } return Math.max(0, Math.round(100 - (error / (width * height * 3 * 255)) * 100)); }
async function imageData(file: File) { return new Promise<Uint8ClampedArray>((resolve, reject) => { const url = URL.createObjectURL(file); const image = new Image(); image.onload = () => { const canvas = window.document.createElement("canvas"); canvas.width = 80; canvas.height = 80; canvas.getContext("2d")!.drawImage(image, 0, 0, 80, 80); URL.revokeObjectURL(url); resolve(canvas.getContext("2d")!.getImageData(0, 0, 80, 80).data); }; image.onerror = reject; image.src = url; }); }

export function PdfDifferenceChecker() { return <DocumentCompareSuite variant="pdf-difference-checker" />; }
export function PdfVisualComparator() { return <DocumentCompareSuite variant="pdf-visual-comparator" />; }
export function PdfLayoutChecker() { return <DocumentCompareSuite variant="pdf-layout-checker" />; }
export function PdfTextExtractor() { return <DocumentCompareSuite variant="pdf-text-extractor" />; }
export function PdfMetadataViewer() { return <DocumentCompareSuite variant="pdf-metadata-viewer" />; }
export function PdfPageAnalyzer() { return <DocumentCompareSuite variant="pdf-page-analyzer" />; }
export function PdfMerger() { return <DocumentCompareSuite variant="pdf-merger" />; }
export function PdfSplitter() { return <DocumentCompareSuite variant="pdf-splitter" />; }
export function PdfToImages() { return <DocumentCompareSuite variant="pdf-to-images" />; }
export function ImagesToPdf() { return <DocumentCompareSuite variant="images-to-pdf" />; }
export function PdfCompressor() { return <DocumentCompareSuite variant="pdf-compressor" />; }
export function ImageSimilarityChecker() { return <DocumentCompareSuite variant="image-similarity-checker" />; }
export function ScreenshotDifferenceChecker() { return <DocumentCompareSuite variant="screenshot-difference-checker" />; }
export function ImageMetadataViewer() { return <DocumentCompareSuite variant="image-metadata-viewer" />; }
export function ImageDimensionChecker() { return <DocumentCompareSuite variant="image-dimension-checker" />; }
export function DocumentCompare() { return <DocumentCompareSuite variant="document-compare" />; }
