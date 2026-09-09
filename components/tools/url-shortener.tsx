"use client";

import { useEffect, useRef, useState } from "react";

const inputClass = "mt-2 w-full rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] px-4 py-3 text-base outline-none focus:border-[#171717]";

type ShortenResponse = { shorturl?: string; errorcode?: number; errormessage?: string };

type ShortenerWindow = Window & { __internetToolboxShortener?: (response: ShortenResponse) => void };

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => () => {
    scriptRef.current?.remove();
    delete (window as ShortenerWindow).__internetToolboxShortener;
  }, []);

  const shorten = () => {
    setError("");
    setShortUrl("");

    let parsed: URL;
    try {
      parsed = new URL(url.trim());
      if (!/^https?:$/.test(parsed.protocol)) throw new Error();
    } catch {
      setError("Enter a valid http:// or https:// URL.");
      return;
    }

    if (alias.trim() && !/^[A-Za-z0-9_-]{1,30}$/.test(alias.trim())) {
      setError("Custom alias can use letters, numbers, hyphens and underscores (up to 30 characters).");
      return;
    }

    scriptRef.current?.remove();
    setLoading(true);
    const callbackName = "__internetToolboxShortener";
    const win = window as ShortenerWindow;
    win[callbackName] = (response) => {
      setLoading(false);
      scriptRef.current?.remove();
      scriptRef.current = null;
      delete win[callbackName];
      if (response.shorturl) setShortUrl(response.shorturl);
      else setError(response.errormessage || "The shortening service could not create a short link.");
    };

    const params = new URLSearchParams({ format: "json", callback: callbackName, url: parsed.toString() });
    if (alias.trim()) params.set("shorturl", alias.trim());
    const script = document.createElement("script");
    script.src = `https://is.gd/create.php?${params.toString()}`;
    script.async = true;
    script.onerror = () => {
      setLoading(false);
      script.remove();
      scriptRef.current = null;
      delete win[callbackName];
      setError("Could not reach the URL shortening service. Please try again.");
    };
    scriptRef.current = script;
    document.body.appendChild(script);
  };

  const copy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      setError("Copy was blocked by the browser. Select the link and copy it manually.");
    }
  };

  const reset = () => {
    setUrl("");
    setAlias("");
    setShortUrl("");
    setError("");
  };

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <label htmlFor="shortener-url" className="text-sm font-semibold">Long URL</label>
          <input id="shortener-url" className={inputClass} type="url" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && shorten()} placeholder="https://example.com/a-very-long-link" autoComplete="url" />
        </div>
        <div>
          <label htmlFor="shortener-alias" className="text-sm font-semibold">Custom alias <span className="font-normal text-black/40">(optional)</span></label>
          <input id="shortener-alias" className={inputClass} value={alias} onChange={e => setAlias(e.target.value)} placeholder="my-link" maxLength={30} />
          <p className="mt-2 text-xs text-black/45">Available aliases depend on the shortening service.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={shorten} disabled={loading} className="min-h-11 rounded-lg bg-[#171717] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Shortening…" : "Shorten URL"}</button>
          <button onClick={reset} className="min-h-11 rounded-lg border border-[#d8d4c9] px-5 text-sm font-semibold hover:bg-black/5">Clear</button>
        </div>

        {error && <div role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

        {shortUrl && <div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5" role="status" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Short link</p>
          <a href={shortUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-lg font-bold underline underline-offset-4">{shortUrl}</a>
          <button onClick={copy} className="mt-4 min-h-11 rounded-lg border border-[#171717] px-4 text-sm font-semibold hover:bg-white">Copy short link</button>
        </div>}

        <p className="border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">This tool uses the is.gd URL shortening service to create the short link. Your URL is sent to that service when you shorten it. Do not shorten links containing passwords, private tokens or other sensitive information.</p>
      </div>
    </div>
  );
}
