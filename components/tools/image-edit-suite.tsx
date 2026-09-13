"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { Check, Download, Image as ImageIcon, Upload } from "lucide-react";
import { imageExtension, outputMimeForEdit } from "../../lib/image-edit";

type Variant = "image-resizer" | "image-cropper" | "image-rotate-flip" | "image-format-converter";
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_PIXELS = 40_000_000;

const labels: Record<Variant, { title: string; description: string; action: string }> = {
  "image-resizer": { title: "Resize an image", description: "Change image dimensions while keeping the proportions you want.", action: "Create resized image" },
  "image-cropper": { title: "Crop an image", description: "Crop an image to an exact rectangle using pixel coordinates.", action: "Create cropped image" },
  "image-rotate-flip": { title: "Rotate or flip an image", description: "Rotate an image by 90°, 180° or 270°, or flip it horizontally or vertically.", action: "Create edited image" },
  "image-format-converter": { title: "Convert image format", description: "Convert JPG, PNG and WebP images directly in your browser.", action: "Convert image" },
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function readImage(file: File) {
  if (!file.type.match(/^image\/(jpeg|png|webp)$/)) throw new Error("Please choose a JPG, PNG, or WebP image.");
  if (file.size > MAX_FILE_SIZE) throw new Error("Please choose an image smaller than 20 MB.");
  const bitmap = await createImageBitmap(file);
  if (bitmap.width * bitmap.height > MAX_PIXELS) { bitmap.close(); throw new Error("This image has too many pixels for safe browser processing."); }
  return bitmap;
}

async function canvasBlob(canvas: HTMLCanvasElement, type: string, quality = 0.92) {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  if (!blob) throw new Error("Your browser could not create the edited image.");
  return blob;
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function FileDrop({ file, onChange }: { file: File | null; onChange: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const handle = (event: ChangeEvent<HTMLInputElement>) => { const next = event.target.files?.[0]; if (next) onChange(next); };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setDragging(false); const next = event.dataTransfer.files?.[0]; if (next) onChange(next); };
  return (
    <div className={`rounded-2xl border-2 border-dashed p-5 transition focus-within:ring-4 focus-within:ring-[#c8f169] ${dragging ? "border-[#171717] bg-white" : "border-[#d3d0c6] bg-[#faf8f2] hover:border-[#171717] hover:bg-white"}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
      <input ref={inputRef} id="image-edit-file" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={handle} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#536b1c] shadow-sm" aria-hidden="true"><Upload size={19} /></span><div className="min-w-0"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Choose an image</p><p className="mt-1 truncate text-sm font-bold">{file?.name ?? "Select or drop an image"}</p><p className="mt-1 text-xs leading-5 text-black/35">JPG, PNG or WebP · up to 20 MB · processed locally</p></div></div>
        <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-[#171717] bg-white px-4 text-sm font-bold transition hover:bg-[#171717] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">{file ? "Choose another" : "Browse files"}</button>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, min = 1, max = 40000, help }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; help?: string }) {
  const id = `image-edit-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return <label htmlFor={id} className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_30%)]"><span className="text-sm font-bold">{label}</span>{help && <span className="mt-1 block text-xs leading-5 text-black/40">{help}</span>}<input id={id} type="number" min={min} max={max} value={value} onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))} className="mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-3 font-mono text-sm outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" /></label>;
}

export default function ImageEditSuite({ variant }: { variant: Variant }) {
  const meta = labels[variant];
  const [file, setFile] = useState<File | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [output, setOutput] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [lockRatio, setLockRatio] = useState(true);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 800, height: 600 });
  const [rotation, setRotation] = useState(90);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [format, setFormat] = useState("image/jpeg");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);

  const choose = async (next: File) => {
    setError(""); setDownloaded(false); setOutput(null); if (outputUrl) URL.revokeObjectURL(outputUrl); setOutputUrl("");
    try { const bitmap = await readImage(next); setFile(next); setImageSize({ width: bitmap.width, height: bitmap.height }); setWidth(bitmap.width); setHeight(bitmap.height); setCrop({ x: 0, y: 0, width: bitmap.width, height: bitmap.height }); bitmap.close(); }
    catch (err) { setFile(null); setError(err instanceof Error ? err.message : "The image could not be read."); }
  };

  const changeWidth = (next: number) => { setWidth(next); if (lockRatio && imageSize.width) setHeight(Math.max(1, Math.round(next * imageSize.height / imageSize.width))); };
  const changeHeight = (next: number) => { setHeight(next); if (lockRatio && imageSize.height) setWidth(Math.max(1, Math.round(next * imageSize.width / imageSize.height))); };

  async function run() {
    if (!file) { setError("Choose an image first."); return; }
    setBusy(true); setError(""); setDownloaded(false);
    try {
      const bitmap = await readImage(file); const rad = (rotation * Math.PI) / 180; const quarterTurn = rotation === 90 || rotation === 270;
      let outWidth = bitmap.width; let outHeight = bitmap.height;
      if (variant === "image-resizer") { outWidth = width; outHeight = height; } else if (variant === "image-cropper") { outWidth = crop.width; outHeight = crop.height; } else if (variant === "image-rotate-flip") { outWidth = quarterTurn ? bitmap.height : bitmap.width; outHeight = quarterTurn ? bitmap.width : bitmap.height; }
      if (!Number.isFinite(outWidth) || !Number.isFinite(outHeight) || outWidth < 1 || outHeight < 1 || outWidth * outHeight > MAX_PIXELS) {
        bitmap.close();
        throw new Error("Choose output dimensions within the 40 million pixel processing limit.");
      }
      const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(outWidth)); canvas.height = Math.max(1, Math.round(outHeight));
      const ctx = canvas.getContext("2d"); if (!ctx) { bitmap.close(); throw new Error("Canvas is not available in this browser."); }
      if (variant === "image-cropper") ctx.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
      else if (variant === "image-rotate-flip") { ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate(rad); ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1); ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2); }
      else ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close(); const type = outputMimeForEdit(variant, file.type, format); const blob = await canvasBlob(canvas, type, type === "image/png" ? undefined : 0.92); setOutput(blob); setOutputUrl(URL.createObjectURL(blob));
    } catch (err) { setError(err instanceof Error ? err.message : "The image could not be processed."); } finally { setBusy(false); }
  }

  const reset = () => { if (outputUrl) URL.revokeObjectURL(outputUrl); setFile(null); setOutput(null); setOutputUrl(""); setError(""); setDownloaded(false); if (inputRef.current) inputRef.current.value = ""; };
  const extension = imageExtension(outputMimeForEdit(variant, file?.type ?? "", format));
  const outputName = file ? `${file.name.replace(/\.[^.]+$/, "")}-${variant.replace("image-", "")}.${extension}` : "edited-image";

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="image-edit-title">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-black/40"><ImageIcon size={15} aria-hidden="true" /> File &amp; Image Tools</div><h2 id="image-edit-title" className="text-2xl font-black tracking-tight">{meta.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">{meta.description}</p></div><button type="button" onClick={reset} disabled={!file && !error && !output} className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/60 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Reset</button></div></div>
      <div className="space-y-5 p-5 md:p-7">
        <FileDrop file={file} onChange={choose} />
        {file && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d8d4c9] bg-white p-4" aria-label="Selected image details"><div><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Selected image</p><p className="mt-1 break-all text-sm font-bold">{file.name}</p></div><span className="rounded-full bg-[#f4f1e9] px-3 py-1.5 text-xs font-bold text-black/55">{imageSize.width} × {imageSize.height}px · {formatBytes(file.size)}</span></div>}
        {file && variant === "image-resizer" && <div className="rounded-2xl border border-[#e2dfd7] bg-[#faf8f2] p-4 md:p-5"><div className="mb-4"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">New dimensions</p><p className="mt-1 text-sm text-black/50">Set the output size in pixels.</p></div><div className="grid gap-4 sm:grid-cols-2"><NumberField label="Width (px)" value={width} onChange={changeWidth} help="Output width" /><NumberField label="Height (px)" value={height} onChange={changeHeight} help="Output height" /></div><label className="mt-4 flex min-h-11 items-center gap-3 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-semibold"><input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} className="size-4 accent-[#171717]" /> Keep aspect ratio</label></div>}
        {file && variant === "image-cropper" && <div className="rounded-2xl border border-[#e2dfd7] bg-[#faf8f2] p-4 md:p-5"><div className="mb-4"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Crop area</p><p className="mt-1 text-sm text-black/50">Coordinates start at the image&apos;s top-left corner.</p></div><div className="grid gap-4 sm:grid-cols-2"><NumberField label="X" value={crop.x} onChange={(v) => setCrop({ ...crop, x: Math.min(v, Math.max(0, imageSize.width - 1)), width: Math.min(crop.width, imageSize.width - Math.min(v, Math.max(0, imageSize.width - 1))) })} min={0} max={Math.max(0, imageSize.width - 1)} help="Left offset" /><NumberField label="Y" value={crop.y} onChange={(v) => setCrop({ ...crop, y: Math.min(v, Math.max(0, imageSize.height - 1)), height: Math.min(crop.height, imageSize.height - Math.min(v, Math.max(0, imageSize.height - 1))) })} min={0} max={Math.max(0, imageSize.height - 1)} help="Top offset" /><NumberField label="Crop width" value={crop.width} onChange={(v) => setCrop({ ...crop, width: Math.min(v, imageSize.width - crop.x) })} max={Math.max(1, imageSize.width - crop.x)} help="Output width" /><NumberField label="Crop height" value={crop.height} onChange={(v) => setCrop({ ...crop, height: Math.min(v, imageSize.height - crop.y) })} max={Math.max(1, imageSize.height - crop.y)} help="Output height" /></div></div>}
        {file && variant === "image-rotate-flip" && <div className="rounded-2xl border border-[#e2dfd7] bg-[#faf8f2] p-4 md:p-5"><div className="mb-4"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Transform</p><p className="mt-1 text-sm text-black/50">Choose a rotation and optional flips.</p></div><div className="grid gap-4 sm:grid-cols-3"><label className="block"><span className="text-sm font-bold">Rotation</span><select value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="mt-2 min-h-11 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-sm font-semibold outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"><option value={90}>90 degrees</option><option value={180}>180 degrees</option><option value={270}>270 degrees</option></select></label><label className="flex min-h-11 items-center gap-3 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-semibold"><input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} className="size-4 accent-[#171717]" /> Flip horizontally</label><label className="flex min-h-11 items-center gap-3 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-semibold"><input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} className="size-4 accent-[#171717]" /> Flip vertically</label></div></div>}
        {file && variant === "image-format-converter" && <div className="rounded-2xl border border-[#e2dfd7] bg-[#faf8f2] p-4 md:p-5"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Output format</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{[["image/jpeg", "JPG"], ["image/png", "PNG"], ["image/webp", "WebP"]].map(([value, name]) => <label key={value} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm font-bold transition ${format === value ? "border-[#171717] bg-white" : "border-[#d8d4c9] bg-white/70 hover:border-[#171717]"}`}><input type="radio" name="image-format" value={value} checked={format === value} onChange={() => setFormat(value)} className="size-4 accent-[#171717]" /> {name}</label>)}</div></div>}
        {error && <div role="alert" className="rounded-xl border border-[#b42318]/25 bg-[#fff4f2] px-4 py-3 text-sm font-semibold text-[#8f1d14]">{error}</div>}
        <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={run} disabled={!file || busy} className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-[#171717] px-5 text-sm font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">{busy ? "Processing..." : meta.action}</button>{output && <button type="button" onClick={() => { download(output, outputName); setDownloaded(true); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#171717] bg-white px-5 text-sm font-black transition hover:bg-[#171717] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">{downloaded ? <Check size={16} aria-hidden="true" /> : <Download size={16} aria-hidden="true" />} {downloaded ? "Downloaded" : "Download"}</button>}</div>
        <p className="text-center text-xs leading-5 text-black/40">Files stay in your browser. Nothing is uploaded to a server.</p>
      </div>
    </section>
  );
}
