"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Download, Image as ImageIcon, Upload } from "lucide-react";
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
  const handle = (event: ChangeEvent<HTMLInputElement>) => { const next = event.target.files?.[0]; if (next) onChange(next); };
  return <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-[#d3d0c6] bg-[#faf8f2] p-5 transition hover:border-[#171717] hover:bg-white focus-within:ring-4 focus-within:ring-[#c8f169]"><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={handle} /><div className="flex items-center gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#536b1c] shadow-sm"><Upload size={19} /></span><div className="min-w-0"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Choose an image</p><p className="mt-1 truncate text-sm font-bold">{file?.name ?? "Click here or drop an image"}</p><p className="mt-1 text-xs text-black/35">JPG, PNG or WebP - up to 20 MB - processed locally</p></div></div></label>;
}

function NumberField({ label, value, onChange, min = 1, max = 40000 }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  return <label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">{label}</span><input type="number" min={min} max={max} value={value} onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))} className="mt-2 min-h-11 w-full rounded-lg border border-[#d8d4c9] bg-white px-3 font-mono text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" /></label>;
}

export default function ImageEditSuite({ variant }: { variant: Variant }) {
  const meta = labels[variant];
  const [file, setFile] = useState<File | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [output, setOutput] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
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
    setError(""); setOutput(null); if (outputUrl) URL.revokeObjectURL(outputUrl); setOutputUrl("");
    try {
      const bitmap = await readImage(next);
      setFile(next); setImageSize({ width: bitmap.width, height: bitmap.height });
      setWidth(bitmap.width); setHeight(bitmap.height);
      setCrop({ x: 0, y: 0, width: bitmap.width, height: bitmap.height });
      bitmap.close();
    } catch (err) { setFile(null); setError(err instanceof Error ? err.message : "The image could not be read."); }
  };

  const changeWidth = (next: number) => { setWidth(next); if (lockRatio && imageSize.width) setHeight(Math.max(1, Math.round(next * imageSize.height / imageSize.width))); };
  const changeHeight = (next: number) => { setHeight(next); if (lockRatio && imageSize.height) setWidth(Math.max(1, Math.round(next * imageSize.width / imageSize.height))); };

  async function run() {
    if (!file) { setError("Choose an image first."); return; }
    setBusy(true); setError("");
    try {
      const bitmap = await readImage(file);
      const rad = (rotation * Math.PI) / 180;
      const quarterTurn = rotation === 90 || rotation === 270;
      let outWidth = bitmap.width; let outHeight = bitmap.height;
      if (variant === "image-resizer") { outWidth = width; outHeight = height; }
      else if (variant === "image-cropper") { outWidth = crop.width; outHeight = crop.height; }
      else if (variant === "image-rotate-flip") { outWidth = quarterTurn ? bitmap.height : bitmap.width; outHeight = quarterTurn ? bitmap.width : bitmap.height; }
      const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(outWidth)); canvas.height = Math.max(1, Math.round(outHeight));
      const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas is not available in this browser.");
      if (variant === "image-cropper") ctx.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
      else if (variant === "image-rotate-flip") { ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate(rad); ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1); ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2); }
      else { ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height); }
      bitmap.close();
      const type = outputMimeForEdit(variant, file.type, format);
      const blob = await canvasBlob(canvas, type, type === "image/png" ? undefined : 0.92);
      setOutput(blob); setOutputUrl(URL.createObjectURL(blob));
    } catch (err) { setError(err instanceof Error ? err.message : "The image could not be processed."); }
    finally { setBusy(false); }
  }

  const reset = () => { if (outputUrl) URL.revokeObjectURL(outputUrl); setFile(null); setOutput(null); setOutputUrl(""); setError(""); if (inputRef.current) inputRef.current.value = ""; };
  const extension = variant === "image-format-converter" ? imageExtension(outputMimeForEdit(variant, file?.type ?? "", format)) : imageExtension(outputMimeForEdit(variant, file?.type ?? "", format));
  const outputName = file ? `${file.name.replace(/\.[^.]+$/, "")}-${variant.replace("image-", "")}.${extension}` : "edited-image";

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8"><div className="mx-auto flex max-w-3xl flex-col gap-5"><div className="flex items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-black/40"><ImageIcon size={15} /> File & Image Tools</div><h2 className="text-2xl font-black tracking-tight">{meta.title}</h2><p className="mt-2 text-sm leading-6 text-black/55">{meta.description}</p></div><button type="button" onClick={reset} disabled={!file && !error} className="min-h-10 shrink-0 rounded-md border border-[#d8d4c9] px-3 text-xs font-bold hover:bg-black/5 disabled:opacity-35 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Reset</button></div>
    <FileDrop file={file} onChange={choose} />
    {file && <div className="rounded-xl border border-[#d8d4c9] bg-white p-4"><p className="text-sm font-bold">{imageSize.width} × {imageSize.height}px <span className="font-normal text-black/40">· {formatBytes(file.size)}</span></p></div>}
    {file && variant === "image-resizer" && <div className="grid gap-4 sm:grid-cols-2"><NumberField label="Width (px)" value={width} onChange={changeWidth} /><NumberField label="Height (px)" value={height} onChange={changeHeight} /><label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} className="size-4" /> Keep aspect ratio</label></div>}
    {file && variant === "image-cropper" && <div className="grid gap-4 sm:grid-cols-2"><NumberField label="X" value={crop.x} onChange={(v) => setCrop({ ...crop, x: Math.min(v, Math.max(0, imageSize.width - 1)) })} min={0} max={Math.max(0, imageSize.width - 1)} /><NumberField label="Y" value={crop.y} onChange={(v) => setCrop({ ...crop, y: Math.min(v, Math.max(0, imageSize.height - 1)) })} min={0} max={Math.max(0, imageSize.height - 1)} /><NumberField label="Crop width" value={crop.width} onChange={(v) => setCrop({ ...crop, width: Math.min(v, imageSize.width - crop.x) })} /><NumberField label="Crop height" value={crop.height} onChange={(v) => setCrop({ ...crop, height: Math.min(v, imageSize.height - crop.y) })} /><p className="text-xs leading-5 text-black/45 sm:col-span-2">Coordinates start at the image&apos;s top-left corner. The crop stays inside the original image.</p></div>}
    {file && variant === "image-rotate-flip" && <div className="grid gap-4 sm:grid-cols-3"><label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">Rotation</span><select value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="mt-2 min-h-11 w-full rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"><option value={0}>0°</option><option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option></select></label><label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold"><input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} className="size-4" /> Flip horizontal</label><label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold"><input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} className="size-4" /> Flip vertical</label></div>}
    {file && variant === "image-format-converter" && <label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">Output format</span><select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select><p className="mt-2 text-xs text-black/40">Converting to JPG removes transparency. PNG keeps lossless quality.</p></label>}
    {error && <p role="alert" className="border border-[#171717] bg-[#f3f0e8] p-3 text-sm font-medium">{error}</p>}
    <button type="button" onClick={run} disabled={!file || busy} className="min-h-12 rounded-lg bg-[#c8f169] px-5 text-sm font-black text-[#171717] transition hover:bg-[#b9e85b] disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">{busy ? "Processing..." : meta.action}</button>
    {output && outputUrl && <div className="flex flex-col gap-3 border-t border-[#d8d4c9] pt-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Ready</p><p className="mt-1 text-sm font-semibold">{formatBytes(output.size)} · processed in your browser</p></div><button type="button" onClick={() => download(output, outputName)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#171717] px-4 text-sm font-bold transition hover:bg-black hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><Download size={16} /> Download</button></div>}
  </div></div>;
}

export const ImageResizer = () => <ImageEditSuite variant="image-resizer" />;
export const ImageCropper = () => <ImageEditSuite variant="image-cropper" />;
export const ImageRotateFlip = () => <ImageEditSuite variant="image-rotate-flip" />;
export const ImageFormatConverter = () => <ImageEditSuite variant="image-format-converter" />;
