"use client";

import { Download, Link2, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const videoExtensions = /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i;

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function DirectVideoDownloader() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const trimmedUrl = url.trim();
  const valid = useMemo(() => isHttpUrl(trimmedUrl), [trimmedUrl]);
  const looksLikeVideo = useMemo(() => videoExtensions.test(trimmedUrl), [trimmedUrl]);
  const ready = valid && looksLikeVideo && !error;

  const prepare = () => {
    if (!isHttpUrl(trimmedUrl)) {
      setError("Enter a valid http:// or https:// video URL.");
      return;
    }
    if (!videoExtensions.test(trimmedUrl)) {
      setError("Use a direct .mp4, .webm, .mov or .m4v file URL for reliable browser downloads.");
      return;
    }
    setError("");
  };

  const clear = () => {
    setUrl("");
    setError("");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3c9] text-[#58751d]" aria-hidden="true">
              <Download size={21} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#6d8e25]">Direct file download</p>
              <h3 className="mt-1 text-lg font-black tracking-[-.025em]">Paste a video file URL</h3>
              <p className="mt-1 max-w-xl text-sm leading-5 text-black/50">Prepare a direct video link, then download it straight from your browser.</p>
            </div>
          </div>
          <button type="button" onClick={clear} disabled={!url} aria-label="Clear video URL" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
            <RotateCcw size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <section aria-labelledby="video-input-heading">
          <div className="mb-3 flex items-center gap-2">
            <Link2 size={16} aria-hidden="true" className="text-black/45" />
            <h4 id="video-input-heading" className="text-sm font-black">1. Video URL</h4>
          </div>
          <label htmlFor="video-url" className="sr-only">Direct video URL</label>
          <input
            id="video-url"
            className="min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-4 text-base text-[#171717] outline-none transition placeholder:text-black/30 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]"
            type="url"
            inputMode="url"
            autoComplete="url"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(""); }}
            placeholder="https://example.com/video.mp4"
            aria-describedby="video-help video-error"
            aria-invalid={Boolean(error)}
          />
          <p id="video-help" className="mt-2 text-xs leading-5 text-black/50">Direct file links only: .mp4, .webm, .mov or .m4v. This does not extract videos from YouTube, Instagram, Facebook or other pages.</p>
          {error && <p id="video-error" role="alert" className="mt-3 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3 text-sm font-medium leading-5 text-[#7b3d31]">{error}</p>}
        </section>

        <section className="mt-6" aria-labelledby="video-action-heading">
          <div className="mb-3 flex items-center gap-2">
            <Download size={16} aria-hidden="true" className="text-black/45" />
            <h4 id="video-action-heading" className="text-sm font-black">2. Prepare your download</h4>
          </div>
          <button type="button" onClick={prepare} disabled={!trimmedUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-black text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
            <Download size={16} aria-hidden="true" />
            Prepare download
          </button>
        </section>

        {ready && (
          <section className="mt-6 rounded-2xl border border-[#171717] bg-[#c8f169] p-5" aria-labelledby="video-ready-heading" aria-live="polite">
            <p className="text-[10px] font-black uppercase tracking-[.14em] text-black/55">Ready</p>
            <h4 id="video-ready-heading" className="mt-1 text-base font-black">Direct video link detected</h4>
            <a href={trimmedUrl} download className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-black text-white transition hover:bg-black/85 focus:outline-none focus:ring-4 focus:ring-white/80">
              <Download size={16} aria-hidden="true" />
              Download video
            </a>
            <p className="mt-3 text-xs leading-5 text-black/55">Your browser or the video host may control whether a cross-origin file downloads or opens in a new tab.</p>
          </section>
        )}

        <div className="mt-7 border-t border-[#d8d4c9] pt-5">
          <p className="text-xs leading-5 text-black/50"><strong className="text-black/70">Privacy:</strong> This tool does not upload or process the video. The request goes directly from your browser to the URL you provide.</p>
        </div>
      </div>
    </div>
  );
}
