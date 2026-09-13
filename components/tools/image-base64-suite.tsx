"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Check, Copy, Download, Image as ImageIcon, RotateCcw, Upload } from "lucide-react";
import { IMAGE_BASE64_TYPES, MAX_IMAGE_BASE64_CHARS, parseImageBase64 } from "../../lib/image-base64";

type Variant = "image-to-base64" | "base64-to-image";
const MAX_FILE_SIZE = 20 * 1024 * 1024;

function FilePicker({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-[#d3d0c6] bg-[#faf8f2] p-5 transition hover:border-[#171717] hover:bg-white focus-within:ring-4 focus-within:ring-[#c8f169]">
      <input ref={inputRef} id="image-base64-file" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={handle} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#536b1c] shadow-sm" aria-hidden="true"><Upload size={19} /></span>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Choose an image</p>
            <p className="mt-1 text-sm font-bold">Select a file to get started</p>
            <p className="mt-1 text-xs leading-5 text-black/35">JPG, PNG, WebP, GIF or SVG · up to 20 MB · processed locally</p>
          </div>
        </div>
        <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-[#171717] bg-white px-4 text-sm font-bold transition hover:bg-[#171717] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
          Browse files
        </button>
      </div>
    </div>
  );
}

export default function ImageBase64Suite({ variant }: { variant: Variant }) {
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState("");
  const [mime, setMime] = useState("image/png");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const readRequestRef = useRef(0);

  const reset = () => { readRequestRef.current += 1; setValue(""); setFileName(""); setMime("image/png"); setError(""); setCopied(false); setPreviewUrl(""); };

  const handleFile = (file: File) => {
    const requestId = ++readRequestRef.current;
    setError(""); setCopied(false); setPreviewUrl("");
    if (!IMAGE_BASE64_TYPES.has(file.type)) { setValue(""); setFileName(""); setError("Please choose a supported image file: JPG, PNG, WebP, GIF or SVG."); return; }
    if (file.size > MAX_FILE_SIZE) { setValue(""); setFileName(""); setError("Please choose an image smaller than 20 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      if (requestId !== readRequestRef.current) return;
      const result = String(reader.result);
      setValue(result); setFileName(file.name); setMime(file.type);
    };
    reader.onerror = () => {
      if (requestId !== readRequestRef.current) return;
      setValue(""); setFileName(""); setError("The image could not be read. Please try another file.");
    };
    reader.readAsDataURL(file);
  };

  const decode = () => {
    setError(""); setCopied(false); setPreviewUrl("");
    if (!value.trim()) { setError("Paste a Base64 image or data URL first."); return; }
    const normalizedLength = value.trim().replace(/\s/g, "").length;
    if (normalizedLength > MAX_IMAGE_BASE64_CHARS) { setError("The Base64 image is larger than the 20 MB browser limit."); return; }
    const parsed = parseImageBase64(value, mime);
    if (!parsed) { setError("Use a valid Base64 image or data URL."); return; }
    setPreviewUrl(parsed.dataUrl); setMime(parsed.mime);
  };

  const copy = async () => {
    if (!value) return;
    try { await navigator.clipboard.writeText(value); setCopied(true); setError(""); setTimeout(() => setCopied(false), 1600); }
    catch { setError("Clipboard access is unavailable. Select and copy the text manually."); }
  };

  const extension = mime === "image/jpeg" ? "jpg" : mime === "image/svg+xml" ? "svg" : mime.split("/")[1] || "png";
  const downloadName = fileName || `decoded-image.${extension}`;
  const isEncode = variant === "image-to-base64";

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="image-base64-title">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-black/40"><ImageIcon size={15} aria-hidden="true" /> File &amp; Image Tools</div>
            <h2 id="image-base64-title" className="text-2xl font-black tracking-tight">{isEncode ? "Image to Base64" : "Base64 to Image"}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">{isEncode ? "Turn an image into a copyable Base64 data URL without uploading it anywhere." : "Turn a Base64 image string into a preview and downloadable image in your browser."}</p>
          </div>
          <button type="button" onClick={reset} disabled={!value && !error && !previewUrl} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/60 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Reset image Base64 tool">
            <RotateCcw size={15} aria-hidden="true" /><span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="space-y-5 p-5 md:p-7">
        {isEncode && <FilePicker onFile={handleFile} />}

        <div className="rounded-2xl border border-[#e2dfd7] bg-white p-4 md:p-5">
          <label htmlFor="image-base64-value" className="block">
            <span className="text-xs font-black uppercase tracking-[.1em] text-black/45">{isEncode ? "Base64 data URL" : "Base64 image"}</span>
            <span className="mt-1 block text-xs leading-5 text-black/40">{isEncode ? (fileName ? `Loaded from ${fileName}` : "Your encoded image appears here after you choose a file.") : "Paste a Base64 string or complete data URL to preview it."}</span>
            <textarea id="image-base64-value" value={value} onChange={(e) => { setValue(e.target.value); setError(""); setCopied(false); setPreviewUrl(""); }} rows={isEncode ? 8 : 10} placeholder={isEncode ? "Choose an image above to generate Base64..." : "Paste a Base64 image string or data URL..."} spellCheck={false} className="mt-3 min-h-44 w-full resize-y rounded-xl border border-[#d8d4c9] bg-[#fffdf8] p-4 font-mono text-xs leading-5 outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" aria-describedby="image-base64-help" aria-invalid={Boolean(error)} />
          </label>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-black/40">
            <span id="image-base64-help">{isEncode ? "Local browser processing · no upload" : "Whitespace is ignored while validating the Base64 data"}</span>
            <span className="shrink-0 font-semibold tabular-nums">{value.length.toLocaleString("en-IN")} chars</span>
          </div>
        </div>

        {!isEncode && (
          <div className="rounded-2xl border border-[#e2dfd7] bg-white p-4 md:p-5">
            <label htmlFor="image-base64-format" className="block text-xs font-black uppercase tracking-[.1em] text-black/45">Image format</label>
            <select id="image-base64-format" value={mime} onChange={(e) => { setMime(e.target.value); setPreviewUrl(""); }} className="mt-3 min-h-12 w-full rounded-xl border border-[#d8d4c9] bg-[#fffdf8] px-3 text-sm outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]">
              <option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option><option value="image/gif">GIF</option><option value="image/svg+xml">SVG</option>
            </select>
            <p className="mt-2 text-xs leading-5 text-black/40">If you paste a full data URL, its format is detected automatically.</p>
          </div>
        )}

        {error && <p role="alert" className="rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm font-medium leading-6 text-[#7b3d31]">{error}</p>}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={isEncode ? copy : decode} disabled={!value} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#c8f169] px-5 text-sm font-black text-[#171717] transition hover:bg-[#b9e85b] disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
            {isEncode ? (copied ? <><Check size={16} aria-hidden="true" /> Copied</> : <><Copy size={16} aria-hidden="true" /> Copy Base64</>) : "Decode image"}
          </button>
          {!isEncode && previewUrl && <a href={previewUrl} download={downloadName} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#171717] bg-white px-5 text-sm font-bold transition hover:bg-[#171717] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><Download size={16} aria-hidden="true" /> Download image</a>}
        </div>

        {previewUrl && !isEncode && (
          <div className="rounded-2xl border border-[#d8d4c9] bg-[#faf8f2] p-4 md:p-5" aria-live="polite">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Preview</p><p className="mt-1 text-xs text-black/40">Decoded locally in your browser</p></div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black/55">{extension.toUpperCase()}</span>
            </div>
            <div className="flex min-h-40 items-center justify-center overflow-auto rounded-xl border border-[#e5e1d8] bg-white p-4">
              <img src={previewUrl} alt="Decoded image preview" className="max-h-[420px] max-w-full object-contain" />
            </div>
          </div>
        )}

        <p className="border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Images are processed entirely in your browser. Nothing is uploaded to a server by this tool.</p>
      </div>
    </section>
  );
}

export const ImageToBase64 = () => <ImageBase64Suite variant="image-to-base64" />;
export const Base64ToImage = () => <ImageBase64Suite variant="base64-to-image" />;
