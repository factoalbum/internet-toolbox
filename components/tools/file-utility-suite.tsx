"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Download, FileText, RotateCcw, Upload } from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";

type Variant = "image-base64" | "base64-to-image" | "svg-to-png" | "pdf-page-organizer" | "pdf-page-rotator";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_PDF_PAGES = 100;

const labels: Record<Variant, { title: string; description: string; action: string }> = {
  "image-base64": { title: "Image to Base64", description: "Convert an image into a Base64 data URL you can copy or download.", action: "Convert to Base64" },
  "base64-to-image": { title: "Base64 to Image", description: "Turn a Base64 image data URL back into a downloadable image.", action: "Create image" },
  "svg-to-png": { title: "SVG to PNG", description: "Convert SVG markup into a PNG image directly in your browser.", action: "Convert to PNG" },
  "pdf-page-organizer": { title: "PDF Page Organizer", description: "Reorder or remove PDF pages, then download the organized document.", action: "Create organized PDF" },
  "pdf-page-rotator": { title: "PDF Page Rotator", description: "Rotate individual PDF pages by 90°, 180° or 270°.", action: "Create rotated PDF" },
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function FileDrop({ accept, file, onChange, label }: { accept: string; file: File | null; onChange: (file: File) => void; label: string }) {
  const handle = (event: ChangeEvent<HTMLInputElement>) => { const next = event.target.files?.[0]; if (next) onChange(next); };
  return <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-[#d3d0c6] bg-[#faf8f2] p-5 transition hover:border-[#171717] hover:bg-white focus-within:ring-4 focus-within:ring-[#c8f169]"><input className="sr-only" type="file" accept={accept} onChange={handle} /><div className="flex items-center gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#536b1c] shadow-sm"><Upload size={19} /></span><div className="min-w-0"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">{label}</p><p className="mt-1 truncate text-sm font-bold">{file?.name ?? "Click here or choose a file"}</p><p className="mt-1 text-xs text-black/35">Up to 25 MB · processed locally</p></div></div></label>;
}

async function loadPdf(file: File) {
  if (file.type !== "application/pdf") throw new Error("Please choose a PDF file.");
  if (file.size > MAX_FILE_SIZE) throw new Error("Please choose a PDF smaller than 25 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await PDFDocument.load(bytes);
  if (pdf.getPageCount() > MAX_PDF_PAGES) throw new Error("This PDF has more than 100 pages. Please use a smaller document.");
  return pdf;
}

export default function FileUtilitySuite({ variant }: { variant: Variant }) {
  const meta = labels[variant];
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [output, setOutput] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pages, setPages] = useState<number[]>([]);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [selectedPage, setSelectedPage] = useState(1);
  const [rotateBy, setRotateBy] = useState(90);
  const [base64Preview, setBase64Preview] = useState("");
  const [svgWidth, setSvgWidth] = useState(1200);
  const [svgHeight, setSvgHeight] = useState(800);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (base64Preview.startsWith("blob:")) URL.revokeObjectURL(base64Preview); }, [base64Preview]);

  const reset = () => {
    if (base64Preview.startsWith("blob:")) URL.revokeObjectURL(base64Preview);
    setFile(null); setText(""); setOutput(null); setError(""); setPages([]); setRotations({}); setSelectedPage(1); setBase64Preview("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const chooseFile = async (next: File) => {
    setError(""); setOutput(null); setFile(null);
    try {
      if (variant === "image-base64") {
        if (!/^image\/(png|jpeg|webp|gif|svg\+xml)$/.test(next.type)) throw new Error("Please choose a PNG, JPG, WebP, GIF, or SVG image.");
        if (next.size > MAX_FILE_SIZE) throw new Error("Please choose an image smaller than 25 MB.");
      } else {
        const pdf = await loadPdf(next); const count = pdf.getPageCount();
        setPages(Array.from({ length: count }, (_, index) => index)); setRotations({}); setSelectedPage(1);
      }
      setFile(next);
    } catch (err) { setError(err instanceof Error ? err.message : "The file could not be read."); }
  };

  async function run() {
    setBusy(true); setError(""); setOutput(null);
    try {
      if (variant === "image-base64") {
        if (!file) throw new Error("Choose an image first.");
        const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("The image could not be read.")); reader.readAsDataURL(file); });
        setText(dataUrl); setBase64Preview(dataUrl); return;
      }
      if (variant === "base64-to-image") {
        const value = text.trim();
        if (!/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=\s]+$/.test(value)) throw new Error("Paste a valid Base64 image data URL, including data:image/...;base64,...");
        const blob = await (await fetch(value)).blob(); setOutput(blob); setBase64Preview(URL.createObjectURL(blob)); return;
      }
      if (variant === "svg-to-png") {
        const svg = text.trim();
        if (!svg.startsWith("<svg") || !svg.includes(">")) throw new Error("Paste valid SVG markup starting with <svg>.");
        const blob = new Blob([svg], { type: "image/svg+xml" }); const url = URL.createObjectURL(blob);
        try {
          const image = new Image(); image.decoding = "async"; image.src = url; await image.decode();
          const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.min(8000, svgWidth)); canvas.height = Math.max(1, Math.min(8000, svgHeight));
          const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas is not available in this browser.");
          ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png")); if (!png) throw new Error("PNG conversion failed.");
          setOutput(png); setBase64Preview(URL.createObjectURL(png));
        } finally { URL.revokeObjectURL(url); }
        return;
      }
      if (!file) throw new Error("Choose a PDF first.");
      const pdf = await loadPdf(file);
      if (variant === "pdf-page-organizer") {
        if (!pages.length) throw new Error("The PDF has no pages to organize.");
        const result = await PDFDocument.create(); const copied = await result.copyPages(pdf, pages); copied.forEach((page) => result.addPage(page));
        setOutput(new Blob([await result.save()], { type: "application/pdf" }));
      } else {
        const angle = rotations[selectedPage - 1] ?? 0;
        if (!angle) throw new Error("Choose a rotation for the selected page first.");
        const page = pdf.getPage(selectedPage - 1); page.setRotation(degrees(page.getRotation().angle + angle));
        setOutput(new Blob([await pdf.save()], { type: "application/pdf" }));
      }
    } catch (err) { setError(err instanceof Error ? err.message : "The file could not be processed."); }
    finally { setBusy(false); }
  }

  const movePage = (index: number, direction: -1 | 1) => {
    const target = index + direction; if (target < 0 || target >= pages.length) return;
    setPages((current) => { const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });
  };
  const removePage = (index: number) => setPages((current) => current.length > 1 ? current.filter((_, i) => i !== index) : current);
  const outputName = variant === "svg-to-png" ? "converted.svg-to-png.png" : variant === "base64-to-image" ? "decoded-image.png" : variant === "pdf-page-organizer" ? "organized.pdf" : variant === "pdf-page-rotator" ? "rotated-pages.pdf" : "image-base64.txt";
  const disabled = busy || (variant === "image-base64" ? !file : variant === "base64-to-image" || variant === "svg-to-png" ? !text.trim() : !file);

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8"><div className="mx-auto flex max-w-3xl flex-col gap-5"><div className="flex items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-black/40"><FileText size={15} /> File & Image Tools</div><h2 className="text-2xl font-black tracking-tight">{meta.title}</h2><p className="mt-2 text-sm leading-6 text-black/55">{meta.description}</p></div><button type="button" onClick={reset} disabled={!file && !text && !error} className="min-h-10 shrink-0 rounded-md border border-[#d8d4c9] px-3 text-xs font-bold hover:bg-black/5 disabled:opacity-35"><RotateCcw size={14} className="inline mr-1" />Reset</button></div>
    {variant === "image-base64" && <FileDrop accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" file={file} onChange={chooseFile} label="Choose an image" />}
    {variant === "base64-to-image" && <label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">Base64 image data URL</span><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="data:image/png;base64,iVBORw0KGgo…" className="mt-2 min-h-48 w-full resize-y rounded-xl border border-[#d8d4c9] bg-white p-3 font-mono text-xs leading-5 outline-none focus:border-[#171717]" /><p className="mt-2 text-xs text-black/40">For security, only image data URLs are accepted.</p></label>}
    {variant === "svg-to-png" && <><label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">SVG markup</span><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">…</svg>'} className="mt-2 min-h-56 w-full resize-y rounded-xl border border-[#d8d4c9] bg-white p-3 font-mono text-xs leading-5 outline-none focus:border-[#171717]" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">PNG width</span><input type="number" min="1" max="8000" value={svgWidth} onChange={(e) => setSvgWidth(Math.max(1, Math.min(8000, Number(e.target.value) || 1)))} className="mt-2 min-h-11 w-full rounded-lg border border-[#d8d4c9] bg-white px-3 font-mono text-sm" /></label><label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">PNG height</span><input type="number" min="1" max="8000" value={svgHeight} onChange={(e) => setSvgHeight(Math.max(1, Math.min(8000, Number(e.target.value) || 1)))} className="mt-2 min-h-11 w-full rounded-lg border border-[#d8d4c9] bg-white px-3 font-mono text-sm" /></label></div></>}
    {(variant === "pdf-page-organizer" || variant === "pdf-page-rotator") && <FileDrop accept="application/pdf" file={file} onChange={chooseFile} label="Choose a PDF" />}
    {variant === "pdf-page-organizer" && file && <div className="rounded-xl border border-[#d8d4c9] bg-white p-4"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold">{pages.length} pages in output</p><p className="text-xs text-black/40">Use arrows to reorder · remove unwanted pages</p></div><div className="flex flex-col gap-2">{pages.map((_, index) => <div key={`${index}-${pages[index]}`} className="flex items-center gap-2 rounded-lg border border-[#e5e1d7] bg-[#faf8f2] p-2"><span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-xs font-black">{index + 1}</span><span className="min-w-0 flex-1 text-sm font-semibold">Original page {pages[index] + 1}</span><button type="button" onClick={() => movePage(index, -1)} disabled={index === 0} className="min-h-9 rounded-md border px-2 text-xs disabled:opacity-30" aria-label="Move page up"><ArrowUp size={14} /></button><button type="button" onClick={() => movePage(index, 1)} disabled={index === pages.length - 1} className="min-h-9 rounded-md border px-2 text-xs disabled:opacity-30" aria-label="Move page down"><ArrowDown size={14} /></button><button type="button" onClick={() => removePage(index)} disabled={pages.length === 1} className="min-h-9 rounded-md border px-2 text-xs font-bold text-red-700 disabled:opacity-30">Remove</button></div>)}</div></div>}
    {variant === "pdf-page-rotator" && file && <div className="grid gap-4 rounded-xl border border-[#d8d4c9] bg-white p-4 sm:grid-cols-2"><label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">Page</span><select value={selectedPage} onChange={(e) => setSelectedPage(Number(e.target.value))} className="mt-2 min-h-11 w-full rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm">{pages.map((_, index) => <option key={index} value={index + 1}>Page {index + 1}</option>)}</select></label><label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">Rotation</span><select value={rotateBy} onChange={(e) => { const value = Number(e.target.value); setRotateBy(value); setRotations((current) => ({ ...current, [selectedPage - 1]: value })); }} className="mt-2 min-h-11 w-full rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm"><option value={90}>90° clockwise</option><option value={180}>180°</option><option value={270}>270° clockwise</option></select></label><p className="text-xs leading-5 text-black/45 sm:col-span-2">Select a page and its rotation. The output applies that rotation while keeping the rest of the PDF unchanged.</p></div>}
    {error && <p role="alert" className="border border-[#171717] bg-[#f3f0e8] p-3 text-sm font-medium">{error}</p>}
    <button type="button" onClick={run} disabled={disabled} className="min-h-12 rounded-lg bg-[#c8f169] px-5 text-sm font-black text-[#171717] disabled:cursor-not-allowed disabled:opacity-45">{busy ? "Processing…" : meta.action}</button>
    {output && <div className="flex flex-col gap-3 border-t border-[#d8d4c9] pt-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Ready</p><p className="mt-1 text-sm font-semibold">{formatBytes(output.size)} · processed in your browser</p></div><button type="button" onClick={() => download(output, outputName)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#171717] px-4 text-sm font-bold hover:bg-black hover:text-white"><Download size={16} /> Download</button></div>}
    {base64Preview && variant === "image-base64" && <div className="rounded-xl border border-[#d8d4c9] bg-white p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Base64 output</p><button type="button" onClick={() => navigator.clipboard?.writeText(text)} className="rounded-md border px-3 py-2 text-xs font-bold">Copy</button></div><textarea readOnly value={text} className="mt-3 min-h-40 w-full rounded-lg border border-[#e5e1d7] bg-[#faf8f2] p-3 font-mono text-xs leading-5" /></div>}
  </div></div>;
}

export const ImageBase64 = () => <FileUtilitySuite variant="image-base64" />;
export const Base64ToImage = () => <FileUtilitySuite variant="base64-to-image" />;
export const SvgToPng = () => <FileUtilitySuite variant="svg-to-png" />;
export const PdfPageOrganizer = () => <FileUtilitySuite variant="pdf-page-organizer" />;
export const PdfPageRotator = () => <FileUtilitySuite variant="pdf-page-rotator" />;
