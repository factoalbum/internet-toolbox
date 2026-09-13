"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Check, Download, ImageDown, RotateCcw } from "lucide-react";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_PIXELS = 40_000_000;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [output, setOutput] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
  }, [outputUrl]);

  const compress = async (selected: File, selectedQuality: number) => {
    setBusy(true);
    setError("");
    setDownloaded(false);
    setOutput(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    try {
      const bitmap = await createImageBitmap(selected);
      if (bitmap.width * bitmap.height > MAX_PIXELS) {
        bitmap.close();
        throw new Error("This image has too many pixels for safe browser processing.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) {
        bitmap.close();
        throw new Error("Canvas is not available in this browser.");
      }
      context.drawImage(bitmap, 0, 0);
      bitmap.close();

      const type = selected.type === "image/png" ? "image/png" : selected.type === "image/webp" ? "image/webp" : "image/jpeg";
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, type, selectedQuality / 100);
      });
      if (!blob) throw new Error("The image could not be compressed.");

      setOutput(blob);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      setOutput(null);
      setOutputUrl("");
      setError(
        err instanceof Error && err.message.includes("too many pixels")
          ? "This image is too large in dimensions for safe browser processing. Try a smaller image."
          : "We could not process this image. Try a JPG, PNG, or WebP image below 20 MB.",
      );
    } finally {
      setBusy(false);
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setDownloaded(false);
    if (!selected.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (!selected.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError("Please choose an image smaller than 20 MB.");
      return;
    }
    setFile(selected);
    void compress(selected, quality);
  };

  const changeQuality = (value: number) => {
    setQuality(value);
    if (file) void compress(file, value);
  };

  const reset = () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null);
    setQuality(80);
    setOutput(null);
    setOutputUrl("");
    setError("");
    setDownloaded(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const download = () => {
    if (!outputUrl || !file) return;
    const link = document.createElement("a");
    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    link.href = outputUrl;
    link.download = `${file.name.replace(/\.[^.]+$/, "")}-compressed.${extension}`;
    link.click();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 1800);
  };

  const qualityIsRelevant = file?.type !== "image/png";
  const savings = file && output ? Math.max(0, Math.round((1 - output.size / file.size) * 100)) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true">
              <ImageDown size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Compress an image</p>
              <p className="text-sm leading-5 text-black/50">Make JPG, PNG, or WebP images smaller in your browser.</p>
            </div>
          </div>
          <button type="button" onClick={reset} disabled={!file && !error} className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Reset image compressor">
            <RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,.72fr)]">
          <section className="rounded-2xl border border-[#e2dfd7] bg-white p-4" aria-labelledby="compress-input-heading">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="compress-input-heading" className="text-sm font-bold">1. Choose an image</h3>
                <p className="mt-1 text-xs leading-5 text-black/45">Files stay on this device. Maximum size: 20 MB.</p>
              </div>
              {file && <span className="rounded-full bg-[#eef6dc] px-2.5 py-1 text-xs font-bold text-[#58751d]">Ready</span>}
            </div>

            <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#bcb8ae] bg-[#fffdf8] px-4 text-sm font-bold transition hover:border-[#171717] hover:bg-[#f8f6f0] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
              <ImageDown size={17} aria-hidden="true" />
              {file ? "Choose a different image" : "Browse files"}
            </button>
            <input ref={inputRef} id="image-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} className="sr-only" aria-describedby="image-file-help" />
            <p id="image-file-help" className="mt-3 text-xs leading-5 text-black/45">Supported formats: JPG, PNG, and WebP. Processing happens locally in your browser.</p>

            {file && (
              <div className="mt-4 rounded-xl border border-[#d8d4c9] bg-[#f4f1e9] p-3">
                <p className="truncate text-sm font-bold" title={file.name}>{file.name}</p>
                <p className="mt-1 text-xs text-black/45">{formatBytes(file.size)} · {file.type.replace("image/", "").toUpperCase()}</p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#e2dfd7] bg-white p-4" aria-labelledby="quality-heading">
            <h3 id="quality-heading" className="text-sm font-bold">2. Tune compression</h3>
            <p className="mt-1 text-xs leading-5 text-black/45">Adjust quality and the image will be reprocessed automatically.</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <label htmlFor="quality" className="text-sm font-bold">Quality</label>
              <output htmlFor="quality" className="rounded-full bg-[#f4f1e9] px-2.5 py-1 font-mono text-sm font-bold">{quality}%</output>
            </div>
            <input id="quality" type="range" min="20" max="95" step="5" value={quality} onChange={(e) => changeQuality(Number(e.target.value))} disabled={!file || !qualityIsRelevant || busy} className="mt-4 w-full accent-[#171717] disabled:cursor-not-allowed disabled:opacity-45" aria-describedby="quality-help" />
            <div className="mt-1 flex justify-between text-[11px] font-semibold text-black/35" aria-hidden="true"><span>Smaller</span><span>Higher quality</span></div>
            <p id="quality-help" className="mt-3 text-xs leading-5 text-black/45">{qualityIsRelevant ? "Higher quality keeps more detail but may produce a larger file." : "PNG encoding does not use this quality setting; the image stays in PNG format."}</p>
          </section>
        </div>

        {error ? (
          <p className="mt-5 rounded-2xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">{error}</p>
        ) : output && file ? (
          <section className="mt-6 rounded-2xl border border-[#171717] bg-[#c8f169] p-5 sm:p-6" aria-labelledby="compress-result-heading" aria-live="polite">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[.15em] text-black/55">3. Your compressed image</p>
                <h3 id="compress-result-heading" className="mt-2 text-2xl font-black tracking-[-.03em]">{formatBytes(output.size)}</h3>
                <p className="mt-1 text-sm font-medium text-black/55">Original {formatBytes(file.size)} · {savings > 0 ? `${savings}% smaller` : "Size unchanged"}</p>
              </div>
              <button type="button" onClick={download} disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#171717] bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black/80 focus:outline-none focus:ring-4 focus:ring-[#171717]/25 disabled:cursor-not-allowed disabled:opacity-45" aria-label="Download compressed image">
                {downloaded ? <Check size={17} aria-hidden="true" /> : <Download size={17} aria-hidden="true" />}
                {downloaded ? "Downloaded" : "Download image"}
              </button>
            </div>
          </section>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[#d8d4c9] bg-white p-5" role="status">
            <p className="text-sm font-bold">Your result will appear here</p>
            <p className="mt-1 text-sm leading-5 text-black/45">Choose an image above to compress it locally.</p>
          </div>
        )}

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Images are processed entirely in your browser. Nothing is uploaded. A 40-million-pixel safety limit helps keep processing responsive.</p>
      </div>
    </div>
  );
}
