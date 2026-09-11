"use client";

import { useRef, useState } from "react";
import { FilePlus2, GitCompare, Trash2, Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist/webpack.mjs";

type Variant =
  | "pdf-difference-checker" | "pdf-visual-comparator" | "pdf-layout-checker" | "pdf-text-extractor"
  | "pdf-metadata-viewer" | "pdf-page-analyzer" | "pdf-merger" | "pdf-splitter" | "pdf-to-images"
  | "images-to-pdf" | "pdf-compressor" | "image-similarity-checker" | "screenshot-difference-checker"
  | "image-metadata-viewer" | "image-dimension-checker" | "document-compare";

type PdfItem = { page: number; x: number; y: number; width: number; height: number; text: string };
type PdfInfo = { pages: number; width: number; height: number; text: string; items: PdfItem[] };
type Result = { message?: string; similarity?: number; contentSimilarity?: number; layoutSimilarity?: number; text?: string; added?: string[]; removed?: string[]; firstA?: string; firstB?: string; images?: string[]; pages?: number; width?: number; height?: number; orientation?: string; textLength?: number; fileSize?: number; widthA?: number; heightA?: number; widthB?: number; heightB?: number; sameDimensions?: boolean; aspect?: string; megapixels?: string; size?: number };

const META: Record<Variant, { title: string; description: string; action: string }> = {
  "pdf-difference-checker": { title: "Find PDF changes", description: "Compare readable text in two PDFs and see what was added or removed.", action: "Compare changes" },
  "pdf-visual-comparator": { title: "Compare PDF visuals", description: "Render the first page of two PDFs so you can inspect their appearance side by side.", action: "Compare visuals" },
  "pdf-layout-checker": { title: "Check PDF layout", description: "Compare page dimensions and text placement between two PDFs.", action: "Check layout" },
  "pdf-text-extractor": { title: "Extract PDF text", description: "Pull readable text from a PDF and download a local text copy.", action: "Extract text" },
  "pdf-metadata-viewer": { title: "Inspect PDF metadata", description: "View page count, dimensions, file size and readable text volume.", action: "Inspect PDF" },
  "pdf-page-analyzer": { title: "Analyze PDF pages", description: "See page count, dimensions, orientation and text density.", action: "Analyze pages" },
  "pdf-merger": { title: "Merge PDFs", description: "Add two or more PDFs, reorder them, and combine them into one file in your browser.", action: "Merge PDFs" },
  "pdf-splitter": { title: "Split a PDF", description: "Choose pages from a PDF and create a new PDF locally.", action: "Split PDF" },
  "pdf-to-images": { title: "Convert PDF to images", description: "Render up to 12 PDF pages as previewable images.", action: "Render pages" },
  "images-to-pdf": { title: "Turn images into PDF", description: "Add JPG or PNG images and combine them into one PDF locally.", action: "Create PDF" },
  "pdf-compressor": { title: "Compress a PDF", description: "Create a smaller image-based copy for sharing and storage.", action: "Compress PDF" },
  "image-similarity-checker": { title: "Compare two images", description: "Measure visual similarity and compare image dimensions.", action: "Compare images" },
  "screenshot-difference-checker": { title: "Compare screenshots", description: "Compare two screenshots for visual similarity and dimensions.", action: "Find differences" },
  "image-metadata-viewer": { title: "Inspect image metadata", description: "View image format, dimensions, file size and aspect ratio.", action: "Inspect image" },
  "image-dimension-checker": { title: "Check image dimensions", description: "Get exact dimensions, aspect ratio and megapixels.", action: "Check dimensions" },
  "document-compare": { title: "Compare documents", description: "Compare readable content in two PDF documents.", action: "Compare documents" },
};

const MAX_SIZE = 20 * 1024 * 1024;

async function readPdf(file: File): Promise<PdfInfo> {
  const document = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  let text = "";
  let width = 0;
  let height = 0;
  const items: PdfItem[] = [];
  for (let pageNo = 1; pageNo <= document.numPages; pageNo += 1) {
    const page = await document.getPage(pageNo);
    const viewport = page.getViewport({ scale: 1 });
    width = Math.max(width, viewport.width);
    height = Math.max(height, viewport.height);
    const content = await page.getTextContent();
    const pageItems = content.items as unknown as Array<{ str?: string; transform?: number[]; width?: number; height?: number }>;
    for (const item of pageItems) {
      const value = item.str ?? "";
      if (!value.trim()) continue;
      text += `${value} `;
      items.push({ page: pageNo, x: item.transform?.[4] ?? 0, y: item.transform?.[5] ?? 0, width: item.width ?? 0, height: item.height ?? 0, text: value });
    }
    text += "\n";
  }
  return { pages: document.numPages, width, height, text, items };
}

async function renderPdfPage(file: File, pageNo: number, scale = 0.75) {
  const document = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const page = await document.getPage(Math.min(pageNo, document.numPages));
  const viewport = page.getViewport({ scale });
  const canvas = window.document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not create a PDF preview.");
  await page.render({ canvasContext: context, viewport, canvas }).promise;
  return { dataUrl: canvas.toDataURL("image/jpeg", 0.8), width: viewport.width, height: viewport.height };
}

function download(bytes: Uint8Array, name: string, type: string) {
  const copy = new Uint8Array(bytes.length); copy.set(bytes);
  const url = URL.createObjectURL(new Blob([copy], { type }));
  const anchor = window.document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function textSimilarity(a: string, b: string) {
  const left = new Set(a.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean));
  const right = new Set(b.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean));
  if (!left.size && !right.size) return 100;
  let common = 0; for (const word of left) if (right.has(word)) common += 1;
  return Math.round((common / Math.max(1, new Set([...left, ...right]).size)) * 100);
}

function diffLines(a: string, b: string) {
  const left = a.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const right = b.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const rightSet = new Set(right); const leftSet = new Set(left);
  return { removed: left.filter((line) => !rightSet.has(line)).slice(0, 100), added: right.filter((line) => !leftSet.has(line)).slice(0, 100) };
}

async function imageInfo(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const value = new Image(); value.onload = () => resolve(value); value.onerror = () => reject(new Error("The image could not be read.")); value.src = url;
    });
    return { width: image.naturalWidth, height: image.naturalHeight, aspect: (image.naturalWidth / Math.max(1, image.naturalHeight)).toFixed(3), megapixels: ((image.naturalWidth * image.naturalHeight) / 1_000_000).toFixed(2), type: file.type || "Unknown", size: file.size };
  } finally { URL.revokeObjectURL(url); }
}

async function imagePreview(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => { const value = new Image(); value.onload = () => resolve(value); value.onerror = () => reject(new Error("The image could not be previewed.")); value.src = url; });
    const canvas = window.document.createElement("canvas"); const scale = Math.min(1, 900 / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d"); if (!context) throw new Error("Your browser could not preview this image.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height); return canvas.toDataURL("image/jpeg", 0.78);
  } finally { URL.revokeObjectURL(url); }
}

async function imageSimilarity(a: File, b: File) {
  const [first, second] = await Promise.all([imagePreview(a), imagePreview(b)]);
  const [left, right] = await Promise.all([fetch(first).then((r) => r.blob()), fetch(second).then((r) => r.blob())]);
  const [leftBitmap, rightBitmap] = await Promise.all([createImageBitmap(left), createImageBitmap(right)]);
  const canvasA = window.document.createElement("canvas"); const canvasB = window.document.createElement("canvas");
  canvasA.width = 96; canvasA.height = 96; canvasB.width = 96; canvasB.height = 96;
  const contextA = canvasA.getContext("2d"); const contextB = canvasB.getContext("2d"); if (!contextA || !contextB) throw new Error("Your browser could not compare these images.");
  contextA.drawImage(leftBitmap, 0, 0, 96, 96); contextB.drawImage(rightBitmap, 0, 0, 96, 96);
  const aData = contextA.getImageData(0, 0, 96, 96).data; const bData = contextB.getImageData(0, 0, 96, 96).data;
  let total = 0; for (let i = 0; i < aData.length; i += 4) { const delta = Math.abs(aData[i] - bData[i]) + Math.abs(aData[i + 1] - bData[i + 1]) + Math.abs(aData[i + 2] - bData[i + 2]); total += Math.max(0, 1 - delta / 765); }
  leftBitmap.close(); rightBitmap.close(); return Math.round((total / (96 * 96)) * 100);
}

function FileSlot({ label, accept, file, onChange }: { label: string; accept: string; file?: File; onChange: (file?: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const choose = (next?: File) => { if (next) onChange(next); };
  return <div className="space-y-2"><div className="flex items-center justify-between"><p className="text-sm font-black">{label}</p>{file && <button type="button" onClick={() => { onChange(undefined); if (inputRef.current) inputRef.current.value = ""; }} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-black/50 hover:bg-black/5 hover:text-black"><Trash2 size={14} /> Remove</button>}</div><div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files[0]); }} className={`rounded-2xl border-2 border-dashed p-4 transition ${dragging ? "border-[#536b1c] bg-[#f0f8dc]" : "border-[#d3d0c6] bg-[#faf8f2]"}`}><input ref={inputRef} className="sr-only" type="file" accept={accept} onChange={(event) => choose(event.target.files?.[0])} /><button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-24 w-full items-center gap-3 text-left focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#536b1c] shadow-sm"><Upload size={18} /></span><span className="min-w-0"><span className="block text-xs font-black uppercase tracking-[.12em] text-black/40">{file ? "Selected file" : "Choose or drop a file"}</span><span className="mt-1 block truncate text-sm font-bold">{file?.name ?? "Click to browse"}</span><span className="mt-1 block text-xs text-black/35">{accept.includes("pdf") ? "PDF only" : "JPG or PNG"} · max 20 MB · stays in your browser</span></span></button></div></div>;
}

function MultiFiles({ accept, files, setFiles }: { accept: string; files: File[]; setFiles: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const add = (incoming: File[]) => setFiles([...files, ...incoming].slice(0, 10));
  return <div className="space-y-3"><div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); add(Array.from(event.dataTransfer.files)); }} className={`rounded-2xl border-2 border-dashed p-4 transition ${dragging ? "border-[#536b1c] bg-[#f0f8dc]" : "border-[#d3d0c6] bg-[#faf8f2]"}`}><input ref={inputRef} className="sr-only" type="file" accept={accept} multiple onChange={(event) => add(Array.from(event.target.files ?? []))} /><button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-20 w-full items-center gap-3 text-left focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#536b1c] shadow-sm"><FilePlus2 size={18} /></span><span><span className="block text-xs font-black uppercase tracking-[.12em] text-black/40">Add files</span><span className="mt-1 block text-sm font-bold">Choose multiple files or drop them here</span><span className="mt-1 block text-xs text-black/35">2–10 PDFs or images · max 20 MB each · stays in your browser</span></span></button></div>{files.length > 0 && <ol className="space-y-2">{files.map((file, index) => <li key={`${file.name}-${file.size}-${index}`} className="flex items-center gap-3 rounded-xl border border-[#ddd9cf] bg-white p-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#f0f8dc] text-xs font-black">{index + 1}</span><span className="min-w-0 flex-1 truncate text-sm font-bold">{file.name}</span><button type="button" onClick={() => setFiles(files.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${file.name}`} className="rounded-lg p-2 text-black/40 hover:bg-black/5 hover:text-black"><Trash2 size={15} /></button></li>)}</ol>}</div>;
}

export default function DocumentToolsSuite({ variant }: { variant: Variant }) {
  const meta = META[variant];
  const isPdf = variant.startsWith("pdf-") || variant === "document-compare";
  const isSingle = ["pdf-text-extractor", "pdf-metadata-viewer", "pdf-page-analyzer", "pdf-splitter", "pdf-to-images", "pdf-compressor", "image-metadata-viewer", "image-dimension-checker"].includes(variant);
  const isMulti = variant === "pdf-merger" || variant === "images-to-pdf";
  const [files, setFiles] = useState<File[]>([]);
  const [first, setFirst] = useState<File>(); const [second, setSecond] = useState<File>();
  const [result, setResult] = useState<Result>(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const accept = isPdf ? ".pdf,application/pdf" : "image/*";

  const pick = (setter: (file?: File) => void, file?: File) => { if (!file) return setter(undefined); if (file.size > MAX_SIZE) return setError("Each file must be 20 MB or smaller."); setter(file); setError(""); setResult(undefined); };

  async function run() {
    setBusy(true); setError(""); setResult(undefined);
    try {
      if (isMulti) {
        if (files.length < (variant === "pdf-merger" ? 2 : 1)) throw new Error(variant === "pdf-merger" ? "Add at least two PDFs to merge." : "Add at least one image.");
        if (files.some((file) => file.size > MAX_SIZE)) throw new Error("Each file must be 20 MB or smaller.");
      } else if (isSingle) {
        if (!first) throw new Error("Choose a file first.");
        if (first.size > MAX_SIZE) throw new Error("The file must be 20 MB or smaller.");
      } else {
        if (!first || !second) throw new Error("Choose both files first.");
        if (first.size > MAX_SIZE || second.size > MAX_SIZE) throw new Error("Each file must be 20 MB or smaller.");
      }

      if (variant === "pdf-merger") {
        const out = await PDFDocument.create();
        for (const file of files) { const source = await PDFDocument.load(await file.arrayBuffer()); const pages = await out.copyPages(source, source.getPageIndices()); pages.forEach((page) => out.addPage(page)); }
        const bytes = await out.save(); download(bytes, "merged.pdf", "application/pdf"); setResult({ message: `${files.length} PDFs merged successfully.` }); return;
      }
      if (variant === "images-to-pdf") {
        const out = await PDFDocument.create();
        for (const file of files) { if (!/^image\/(png|jpe?g)$/i.test(file.type)) throw new Error("Only JPG and PNG images are supported."); const bytes = new Uint8Array(await file.arrayBuffer()); const image = file.type === "image/png" ? await out.embedPng(bytes) : await out.embedJpg(bytes); const page = out.addPage([image.width, image.height]); page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height }); }
        download(await out.save(), "images.pdf", "application/pdf"); setResult({ message: `${files.length} images added to the PDF.` }); return;
      }
      if (variant === "pdf-splitter") {
        const source = await PDFDocument.load(await first!.arrayBuffer());
        const value = window.prompt(`Pages to keep, for example 1-3,5. This PDF has ${source.getPageCount()} pages.`); if (!value) return;
        const selected = new Set<number>(); for (const part of value.split(",")) { const [startRaw, endRaw] = part.trim().split("-"); const start = Number(startRaw); const end = Number(endRaw ?? startRaw); if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > source.getPageCount()) throw new Error(`Enter pages from 1 to ${source.getPageCount()}.`); for (let page = start; page <= end; page += 1) selected.add(page - 1); }
        const out = await PDFDocument.create(); const pages = await out.copyPages(source, [...selected].sort((a, b) => a - b)); pages.forEach((page) => out.addPage(page)); download(await out.save(), "split.pdf", "application/pdf"); setResult({ message: `${selected.size} pages exported.` }); return;
      }
      if (variant === "pdf-to-images") { const info = await readPdf(first!); const images: string[] = []; for (let page = 1; page <= Math.min(info.pages, 12); page += 1) images.push((await renderPdfPage(first!, page)).dataUrl); setResult({ images, pages: info.pages }); return; }
      if (variant === "pdf-compressor") { const info = await readPdf(first!); const out = await PDFDocument.create(); const count = Math.min(info.pages, 24); for (let page = 1; page <= count; page += 1) { const rendered = await renderPdfPage(first!, page, 0.55); const bytes = await fetch(rendered.dataUrl).then((response) => response.arrayBuffer()); const image = await out.embedJpg(new Uint8Array(bytes)); const target = out.addPage([rendered.width / 0.55, rendered.height / 0.55]); target.drawImage(image, { x: 0, y: 0, width: target.getWidth(), height: target.getHeight() }); } const bytes = await out.save(); download(bytes, "compressed.pdf", "application/pdf"); setResult({ message: `Created a re-rendered PDF from ${count} pages.`, size: bytes.byteLength }); return; }
      if (!isPdf) {
        const infoA = await imageInfo(first!); if (variant === "image-metadata-viewer" || variant === "image-dimension-checker") { setResult(infoA); return; }
        const infoB = await imageInfo(second!); const [firstA, firstB] = await Promise.all([imagePreview(first!), imagePreview(second!)]); setResult({ similarity: await imageSimilarity(first!, second!), widthA: infoA.width, heightA: infoA.height, widthB: infoB.width, heightB: infoB.height, sameDimensions: infoA.width === infoB.width && infoA.height === infoB.height, firstA, firstB }); return;
      }
      const infoA = await readPdf(first!);
      if (variant === "pdf-text-extractor") { const text = infoA.text.trim(); download(new TextEncoder().encode(text), `${first!.name.replace(/\.pdf$/i, "")}.txt`, "text/plain"); setResult({ text, pages: infoA.pages }); return; }
      if (variant === "pdf-metadata-viewer" || variant === "pdf-page-analyzer") { setResult({ pages: infoA.pages, width: Math.round(infoA.width), height: Math.round(infoA.height), orientation: infoA.width >= infoA.height ? "Landscape" : "Portrait", textLength: infoA.text.length, fileSize: first!.size }); return; }
      const infoB = await readPdf(second!);
      if (variant === "pdf-difference-checker" || variant === "document-compare") setResult({ similarity: textSimilarity(infoA.text, infoB.text), ...diffLines(infoA.text, infoB.text) });
      else if (variant === "pdf-layout-checker") { const count = Math.min(infoA.items.length, infoB.items.length); let near = 0; for (let index = 0; index < count; index += 1) { const a = infoA.items[index]; const b = infoB.items[index]; if (a.page === b.page && Math.abs(a.x - b.x) <= 8 && Math.abs(a.y - b.y) <= 8) near += 1; } setResult({ contentSimilarity: textSimilarity(infoA.text, infoB.text), layoutSimilarity: count ? Math.round((near / count) * 100) : 0, pages: infoA.pages, width: Math.round(infoA.width), height: Math.round(infoA.height) }); }
      else { const [pageA, pageB] = await Promise.all([renderPdfPage(first!, 1), renderPdfPage(second!, 1)]); setResult({ similarity: textSimilarity(infoA.text, infoB.text), pages: infoA.pages, width: Math.round(infoA.width), height: Math.round(infoA.height), firstA: pageA.dataUrl, firstB: pageB.dataUrl }); }
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong. Try again."); } finally { setBusy(false); }
  }

  return <div className="p-4 sm:p-6 md:p-7">
    <div className="mb-5 flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-[#171717]"><GitCompare size={19} /></span><div><h2 className="text-lg font-black">{meta.title}</h2><p className="mt-1 text-sm leading-5 text-black/50">{meta.description}</p></div></div>
    {isMulti ? <MultiFiles accept={accept} files={files} setFiles={(next) => { setFiles(next); setResult(undefined); setError(""); }} /> : isSingle ? <FileSlot label="Input file" accept={accept} file={first} onChange={(file) => pick(setFirst, file)} /> : <div className="grid gap-4 md:grid-cols-2"><FileSlot label="First file" accept={accept} file={first} onChange={(file) => pick(setFirst, file)} /><FileSlot label="Second file" accept={accept} file={second} onChange={(file) => pick(setSecond, file)} /></div>}
    {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
    <button type="button" onClick={run} disabled={busy} className="mt-4 min-h-12 w-full rounded-xl bg-[#171717] px-5 text-sm font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">{busy ? "Working..." : meta.action}</button>
    {result && <div className="mt-6 space-y-4">
      {result.message && <div className="rounded-2xl border border-[#cfe0a5] bg-[#f0f8dc] p-4 text-sm font-bold">{result.message}</div>}
      {result.similarity !== undefined && <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#171717] p-5 text-white"><p className="text-xs font-bold text-white/50">Similarity</p><p className="mt-1 text-4xl font-black">{result.similarity}%</p></div>{result.contentSimilarity !== undefined && <div className="rounded-2xl border border-[#ddd9cf] bg-white p-5"><p className="text-xs font-bold text-black/40">Content</p><p className="mt-1 text-2xl font-black">{result.contentSimilarity}%</p></div>}{result.layoutSimilarity !== undefined && <div className="rounded-2xl border border-[#ddd9cf] bg-white p-5"><p className="text-xs font-bold text-black/40">Layout</p><p className="mt-1 text-2xl font-black">{result.layoutSimilarity}%</p></div>}</div>}
      {result.text !== undefined && <textarea readOnly value={result.text} className="min-h-64 w-full resize-y rounded-2xl border border-[#ddd9cf] bg-[#faf8f2] p-4 font-mono text-xs leading-5 outline-none" aria-label="Extracted PDF text" />}
      {result.added && <div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-[#d8e6b4] bg-[#f5fae8] p-4"><p className="text-xs font-black uppercase tracking-[.12em] text-[#58731d]">Added</p><ul className="mt-3 space-y-2 text-sm">{result.added.map((line) => <li key={`added-${line}`} className="break-words">+ {line}</li>)}</ul></div><div className="rounded-2xl border border-[#ead2d2] bg-[#fff7f7] p-4"><p className="text-xs font-black uppercase tracking-[.12em] text-[#9a3c3c]">Removed</p><ul className="mt-3 space-y-2 text-sm">{result.removed?.map((line) => <li key={`removed-${line}`} className="break-words">- {line}</li>)}</ul></div></div>}
      {result.firstA && result.firstB && <div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-[#ddd9cf] bg-white p-3"><p className="mb-2 text-xs font-bold text-black/40">First file</p><img src={result.firstA} alt="First file preview" className="max-h-[520px] w-full rounded-lg object-contain" /></div><div className="rounded-2xl border border-[#ddd9cf] bg-white p-3"><p className="mb-2 text-xs font-bold text-black/40">Second file</p><img src={result.firstB} alt="Second file preview" className="max-h-[520px] w-full rounded-lg object-contain" /></div></div>}
      {result.images && <div className="grid gap-3 sm:grid-cols-2">{result.images.map((image, index) => <div key={image} className="rounded-2xl border border-[#ddd9cf] bg-white p-3"><p className="mb-2 text-xs font-bold text-black/40">Page {index + 1}</p><img src={image} alt={`PDF page ${index + 1}`} className="w-full rounded-lg" /></div>)}</div>}
      {result.pages !== undefined && result.width !== undefined && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl border border-[#ddd9cf] bg-white p-4"><p className="text-xs text-black/40">Pages</p><p className="mt-1 text-xl font-black">{result.pages}</p></div><div className="rounded-2xl border border-[#ddd9cf] bg-white p-4"><p className="text-xs text-black/40">Page size</p><p className="mt-1 text-xl font-black">{result.width} × {result.height}</p></div>{result.orientation && <div className="rounded-2xl border border-[#ddd9cf] bg-white p-4"><p className="text-xs text-black/40">Orientation</p><p className="mt-1 text-xl font-black">{result.orientation}</p></div>}{result.textLength !== undefined && <div className="rounded-2xl border border-[#ddd9cf] bg-white p-4"><p className="text-xs text-black/40">Text</p><p className="mt-1 text-xl font-black">{result.textLength}</p></div>}</div>}
      {result.aspect && <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[#ddd9cf] bg-white p-4"><p className="text-xs text-black/40">Dimensions</p><p className="mt-1 text-xl font-black">{result.width} × {result.height}</p></div><div className="rounded-2xl border border-[#ddd9cf] bg-white p-4"><p className="text-xs text-black/40">Aspect ratio</p><p className="mt-1 text-xl font-black">{result.aspect}</p></div><div className="rounded-2xl border border-[#ddd9cf] bg-white p-4"><p className="text-xs text-black/40">Megapixels</p><p className="mt-1 text-xl font-black">{result.megapixels}</p></div></div>}
    </div>}
  </div>;
}

export const PdfDifferenceChecker = () => <DocumentToolsSuite variant="pdf-difference-checker" />;
export const PdfVisualComparator = () => <DocumentToolsSuite variant="pdf-visual-comparator" />;
export const PdfLayoutChecker = () => <DocumentToolsSuite variant="pdf-layout-checker" />;
export const PdfTextExtractor = () => <DocumentToolsSuite variant="pdf-text-extractor" />;
export const PdfMetadataViewer = () => <DocumentToolsSuite variant="pdf-metadata-viewer" />;
export const PdfPageAnalyzer = () => <DocumentToolsSuite variant="pdf-page-analyzer" />;
export const PdfMerger = () => <DocumentToolsSuite variant="pdf-merger" />;
export const PdfSplitter = () => <DocumentToolsSuite variant="pdf-splitter" />;
export const PdfToImages = () => <DocumentToolsSuite variant="pdf-to-images" />;
export const ImagesToPdf = () => <DocumentToolsSuite variant="images-to-pdf" />;
export const PdfCompressor = () => <DocumentToolsSuite variant="pdf-compressor" />;
export const ImageSimilarityChecker = () => <DocumentToolsSuite variant="image-similarity-checker" />;
export const ScreenshotDifferenceChecker = () => <DocumentToolsSuite variant="screenshot-difference-checker" />;
export const ImageMetadataViewer = () => <DocumentToolsSuite variant="image-metadata-viewer" />;
export const ImageDimensionChecker = () => <DocumentToolsSuite variant="image-dimension-checker" />;
export const DocumentCompare = () => <DocumentToolsSuite variant="document-compare" />;
