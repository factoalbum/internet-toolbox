"use client";

import { ChangeEvent, useState } from "react";
import { Copy, Download, Image as ImageIcon, Upload } from "lucide-react";

type Variant = "image-to-base64" | "base64-to-image";
const MAX_FILE_SIZE = 20 * 1024 * 1024;

function FilePicker({ onFile }: { onFile: (file: File) => void }) {
  const handle = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) onFile(file); };
  return <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-[#d3d0c6] bg-[#faf8f2] p-5 transition hover:border-[#171717] hover:bg-white focus-within:ring-4 focus-within:ring-[#c8f169]"><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={handle} /><div className="flex items-center gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#536b1c] shadow-sm"><Upload size={19} /></span><div className="min-w-0"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Choose an image</p><p className="mt-1 text-sm font-bold">Click here to select a file</p><p className="mt-1 text-xs text-black/35">JPG, PNG, WebP, GIF or SVG · up to 20 MB · processed locally</p></div></div></label>;
}

export default function ImageBase64Suite({ variant }: { variant: Variant }) {
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState("");
  const [mime, setMime] = useState("image/png");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const reset = () => { setValue(""); setFileName(""); setMime("image/png"); setError(""); setCopied(false); setPreviewUrl(""); };

  const handleFile = (file: File) => {
    setError(""); setCopied(false);
    if (file.size > MAX_FILE_SIZE) { setError("Please choose an image smaller than 20 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { const result = String(reader.result); setValue(result); setFileName(file.name); setMime(file.type || "image/png"); };
    reader.onerror = () => setError("The image could not be read.");
    reader.readAsDataURL(file);
  };

  const decode = () => {
    setError(""); setCopied(false);
    const raw = value.trim();
    if (!raw) { setError("Paste a Base64 image or data URL first."); return; }
    const data = raw.match(/^data:(image\/(?:jpeg|png|webp|gif|svg\+xml));base64,([A-Za-z0-9+/=\s]+)$/i) ? raw : `data:${mime};base64,${raw.replace(/\s/g, "")}`;
    if (!/^data:image\/(jpeg|png|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/i.test(data)) { setError("Use a valid Base64 image or data URL."); return; }
    setPreviewUrl(data); setMime(data.match(/^data:([^;]+)/i)?.[1] ?? mime);
  };

  const copy = async () => { if (!value) return; try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { setError("Clipboard access is unavailable. Select and copy the text manually."); } };

  const extension = mime === "image/jpeg" ? "jpg" : mime === "image/svg+xml" ? "svg" : mime.split("/")[1] || "png";
  const downloadName = fileName || `decoded-image.${extension}`;

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8"><div className="mx-auto flex max-w-3xl flex-col gap-5"><div className="flex items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-black/40"><ImageIcon size={15} /> File & Image Tools</div><h2 className="text-2xl font-black tracking-tight">{variant === "image-to-base64" ? "Image to Base64" : "Base64 to Image"}</h2><p className="mt-2 text-sm leading-6 text-black/55">{variant === "image-to-base64" ? "Turn an image into a copyable Base64 data URL without uploading it anywhere." : "Turn a Base64 image string into a preview and downloadable image in your browser."}</p></div><button type="button" onClick={reset} disabled={!value && !error} className="min-h-10 shrink-0 rounded-md border border-[#d8d4c9] px-3 text-xs font-bold hover:bg-black/5 disabled:opacity-35 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Reset</button></div>
    {variant === "image-to-base64" && <FilePicker onFile={handleFile} />}
    <label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">{variant === "image-to-base64" ? "Base64 data URL" : "Base64 image"}</span><textarea value={value} onChange={(e) => { setValue(e.target.value); setError(""); setCopied(false); }} rows={variant === "image-to-base64" ? 8 : 10} placeholder={variant === "image-to-base64" ? "Choose an image above to generate Base64…" : "Paste a Base64 image string or data URL…"} className="mt-2 min-h-44 w-full resize-y rounded-xl border border-[#d8d4c9] bg-white p-4 font-mono text-xs leading-5 outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" /></label>
    {variant === "base64-to-image" && <label className="block"><span className="text-xs font-black uppercase tracking-[.1em] text-black/45">Image format</span><select value={mime} onChange={(e) => setMime(e.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option><option value="image/gif">GIF</option><option value="image/svg+xml">SVG</option></select><p className="mt-2 text-xs leading-5 text-black/40">If you paste a full data URL, its format is detected automatically.</p></label>}
    {error && <p role="alert" className="border border-[#171717] bg-[#f3f0e8] p-3 text-sm font-medium">{error}</p>}
    <button type="button" onClick={variant === "image-to-base64" ? copy : decode} disabled={!value} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#c8f169] px-5 text-sm font-black text-[#171717] transition hover:bg-[#b9e85b] disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">{variant === "image-to-base64" ? <><Copy size={16} />{copied ? "Copied" : "Copy Base64"}</> : "Decode image"}</button>
    {previewUrl && variant === "base64-to-image" && <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#faf8f2] p-4"><div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Preview</p><a href={previewUrl} download={downloadName} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#171717] bg-white px-3 text-xs font-bold hover:bg-[#171717] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><Download size={14} /> Download image</a></div><div className="flex min-h-40 items-center justify-center overflow-auto rounded-xl border border-[#e5e1d8] bg-white p-4"><img src={previewUrl} alt="Decoded image preview" className="max-h-[420px] max-w-full object-contain" /></div></div>}
  </div></div>;
}

export const ImageToBase64 = () => <ImageBase64Suite variant="image-to-base64" />;
export const Base64ToImage = () => <ImageBase64Suite variant="base64-to-image" />;
