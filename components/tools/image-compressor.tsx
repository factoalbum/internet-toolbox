"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
  }, [outputUrl]);

  const compress = async (selected: File, selectedQuality: number) => {
    setBusy(true);
    setError("");
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

      const type = selected.type === "image/png" ? "image/png" : "image/jpeg";
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
    if (inputRef.current) inputRef.current.value = "";
  };

  const download = () => {
    if (!outputUrl || !file) return;
    const link = document.createElement("a");
    const extension = file.type === "image/png" ? "png" : "jpg";
    link.href = outputUrl;
    link.download = `${file.name.replace(/\.[^.]+$/, "")}-compressed.${extension}`;
    link.click();
  };

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-6 md:p-8">
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="image-file" className="text-sm font-bold">Choose an image</label>
            <button type="button" onClick={reset} disabled={!file && !error} className="min-h-10 rounded-md border border-[#d8d4c9] px-3 text-xs font-bold hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35">Reset</button>
          </div>
          <input ref={inputRef} id="image-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} className="mt-2 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-md file:border-0 file:bg-[#171717] file:px-4 file:font-semibold file:text-white hover:file:bg-black" />
          <p className="mt-2 text-xs leading-5 text-black/45">Processed in your browser. Files are not uploaded to a server. Maximum file size: 20 MB.</p>
        </div>

        {file && <div>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="quality" className="text-sm font-bold">Compression quality</label>
            <output htmlFor="quality" className="font-mono text-sm font-bold">{quality}%</output>
          </div>
          <input id="quality" type="range" min="20" max="95" step="5" value={quality} onChange={(e) => changeQuality(Number(e.target.value))} className="mt-3 w-full" aria-describedby="quality-help" />
          <p id="quality-help" className="mt-1 text-xs text-black/45">Higher quality keeps more detail but may produce a larger file.</p>
        </div>}

        {error && <p role="alert" className="border border-[#171717] bg-[#f3f0e8] p-3 text-sm font-medium">{error}</p>}

        {file && output && <div className="grid gap-3 border-t border-[#d8d4c9] pt-5 sm:grid-cols-2">
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Original</p><p className="mt-1 font-mono text-sm">{formatBytes(file.size)}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Compressed</p><p className="mt-1 font-mono text-sm">{formatBytes(output.size)}</p></div>
        </div>}

        <button type="button" onClick={download} disabled={!output || busy} className="min-h-11 rounded-md bg-[#c8f169] px-5 text-sm font-bold text-[#171717] disabled:cursor-not-allowed disabled:opacity-45">{busy ? "Compressing" : "Download compressed image"}</button>
      </div>
    </div>
  );
}
