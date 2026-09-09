"use client";

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

  const valid = useMemo(() => isHttpUrl(url.trim()), [url]);
  const looksLikeVideo = useMemo(() => videoExtensions.test(url.trim()), [url]);

  const prepare = () => {
    const value = url.trim();
    if (!isHttpUrl(value)) {
      setError("Enter a valid http:// or https:// video URL.");
      return;
    }
    if (!videoExtensions.test(value)) {
      setError("For reliable browser downloads, use a direct .mp4, .webm, .mov or .m4v file URL.");
      return;
    }
    setError("");
  };

  const clear = () => {
    setUrl("");
    setError("");
  };

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="max-w-2xl">
        <label htmlFor="video-url" className="text-sm font-semibold">Direct video URL</label>
        <input
          id="video-url"
          className="mt-2 w-full rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] px-4 py-3 text-base outline-none focus:border-[#171717]"
          type="url"
          inputMode="url"
          autoComplete="url"
          value={url}
          onChange={e => { setUrl(e.target.value); setError(""); }}
          placeholder="https://example.com/video.mp4"
          aria-describedby="video-help video-error"
          aria-invalid={Boolean(error)}
        />
        <p id="video-help" className="mt-2 text-xs leading-5 text-black/50">Works with direct video file links. It does not extract videos from YouTube, Instagram, Facebook or other pages.</p>

        {error && <p id="video-error" role="alert" className="mt-4 text-sm font-medium text-red-700">{error}</p>}

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={prepare} disabled={!url.trim()} className="min-h-11 rounded-lg bg-[#171717] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-35">Prepare download</button>
          <button type="button" onClick={clear} disabled={!url} className="min-h-11 rounded-lg border border-[#d8d4c9] px-5 text-sm font-semibold hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35">Clear</button>
        </div>

        {valid && looksLikeVideo && !error && (
          <div className="mt-6 border border-[#d8d4c9] bg-[#f3f0e8] p-5" aria-live="polite">
            <p className="text-sm font-semibold">Direct video link detected.</p>
            <a href={url.trim()} download className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#c8f169] px-5 text-sm font-bold hover:brightness-95">Download video</a>
            <p className="mt-3 text-xs leading-5 text-black/50">Your browser or the video host may control whether a cross-origin file downloads or opens in a new tab.</p>
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">
        <strong className="text-black/70">Privacy:</strong> This tool does not upload or process the video. The download request goes directly from your browser to the URL you provide.
      </div>
    </div>
  );
}
