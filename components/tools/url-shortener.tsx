"use client";

import { Check, Link2, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const inputClass = "mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-base font-semibold text-[#171717] outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]";
const SHORTENER_TIMEOUT_MS = 10000;
type ShortenResponse = { shorturl?: string; errorcode?: number; errormessage?: string };
type ShortenerWindow = Window & { __internetToolboxShortener?: (response: ShortenResponse) => void };

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    scriptRef.current?.remove();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    delete (window as ShortenerWindow).__internetToolboxShortener;
  }, []);

  const clearRequest = () => {
    scriptRef.current?.remove();
    scriptRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    delete (window as ShortenerWindow).__internetToolboxShortener;
  };

  const shorten = () => {
    setError("");
    setCopyError("");
    setShortUrl("");
    setCopied(false);

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

    clearRequest();
    setLoading(true);
    const callbackName = "__internetToolboxShortener";
    const win = window as ShortenerWindow;
    let settled = false;
    const finish = () => {
      if (settled) return false;
      settled = true;
      clearRequest();
      setLoading(false);
      return true;
    };

    win[callbackName] = (response) => {
      if (!finish()) return;
      if (response.shorturl) setShortUrl(response.shorturl);
      else setError(response.errormessage || "The shortening service could not create a short link.");
    };

    const params = new URLSearchParams({ format: "json", callback: callbackName, url: parsed.toString() });
    if (alias.trim()) params.set("shorturl", alias.trim());
    const script = document.createElement("script");
    script.src = `https://is.gd/create.php?${params.toString()}`;
    script.async = true;
    script.onerror = () => {
      if (!finish()) return;
      setError("Could not reach the URL shortening service. Please try again.");
    };
    timeoutRef.current = setTimeout(() => {
      if (!finish()) return;
      setError("The URL shortening service took too long to respond. Please try again.");
    }, SHORTENER_TIMEOUT_MS);
    scriptRef.current = script;
    document.body.appendChild(script);
  };

  const copy = async () => {
    if (!shortUrl) return;
    setCopyError("");
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
      setCopyError("Copy was blocked by your browser. Select the link and copy it manually.");
    }
  };

  const reset = () => {
    clearRequest();
    setLoading(false);
    setUrl("");
    setAlias("");
    setShortUrl("");
    setError("");
    setCopyError("");
    setCopied(false);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="shortener-workspace-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true"><Link2 size={20} /></span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.14em] text-black/40">Web utility</p>
              <h2 id="shortener-workspace-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] md:text-2xl">Shorten a URL</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/55">Turn a long web address into a compact link. An optional custom alias makes it easier to recognize.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/60 transition hover:border-[#171717] hover:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60" aria-label="Reset URL shortener">
            <RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <div className="grid gap-5 p-5 md:grid-cols-[1.15fr_.85fr] md:p-7">
        <div>
          <section aria-labelledby="shortener-input-heading">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Link details</p>
              <h3 id="shortener-input-heading" className="mt-1 text-base font-black">What should we shorten?</h3>
            </div>

            <label htmlFor="shortener-url" className="block rounded-2xl border border-[#ddd9cf] bg-white p-4 md:p-5">
              <span className="text-sm font-bold text-[#171717]">Long URL</span>
              <span className="mt-1 block text-xs leading-5 text-black/45">Use a public http:// or https:// web address.</span>
              <input id="shortener-url" className={inputClass} type="url" value={url} onChange={event => { setUrl(event.target.value); setError(""); setCopyError(""); }} onKeyDown={event => { if (event.key === "Enter") shorten(); }} placeholder="https://example.com/a-very-long-link" autoComplete="url" aria-describedby="shortener-help" aria-invalid={Boolean(error && !url.trim())} />
              <p id="shortener-help" className="mt-2 text-xs leading-5 text-black/40">Press Enter to shorten after entering the link.</p>
            </label>

            <label htmlFor="shortener-alias" className="mt-4 block rounded-2xl border border-[#ddd9cf] bg-white p-4 md:p-5">
              <span className="text-sm font-bold text-[#171717]">Custom alias <span className="font-normal text-black/40">(optional)</span></span>
              <span className="mt-1 block text-xs leading-5 text-black/45">Letters, numbers, hyphens and underscores, up to 30 characters.</span>
              <input id="shortener-alias" className={inputClass} value={alias} onChange={event => { setAlias(event.target.value); setError(""); setCopyError(""); }} placeholder="my-link" maxLength={30} aria-describedby="shortener-alias-help" />
              <p id="shortener-alias-help" className="mt-2 text-xs text-black/40">The shortening service may reject an alias that is already in use.</p>
            </label>
          </section>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={shorten} disabled={loading} className="min-h-12 flex-1 rounded-xl bg-[#171717] px-5 text-sm font-black text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60">
              {loading ? "Shortening…" : "Shorten URL"}
            </button>
            <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-[#d8d4c9] bg-white px-5 text-sm font-bold text-[#171717] transition hover:border-[#171717] hover:bg-[#f7f5ef] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60">Clear</button>
          </div>

          {(error || copyError) && <div role="alert" className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm font-semibold leading-6 text-[#7b3d31]">{error || copyError}</div>}

          {shortUrl && <section className="mt-6" aria-labelledby="shortener-result-heading" aria-live="polite">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">2. Your result</p><h3 id="shortener-result-heading" className="mt-1 text-base font-black">Your short link is ready</h3></div>
              <span className="rounded-full bg-[#e8f3c9] px-2.5 py-1 text-[11px] font-bold text-[#58751d]">Ready</span>
            </div>
            <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-6">
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-black/50">Short link</p>
              <a href={shortUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-lg font-black underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#171717]/20">{shortUrl}</a>
              <button type="button" onClick={copy} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-black text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#171717]/20" aria-label={copied ? "Short link copied" : "Copy short link"}>
                {copied ? <Check size={15} aria-hidden="true" /> : <Link2 size={15} aria-hidden="true" />}
                {copied ? "Copied" : "Copy short link"}
              </button>
            </div>
          </section>}
        </div>

        <aside className="h-fit rounded-2xl border border-[#d8d4c9] bg-[#f4f1e9] p-5 md:p-6" aria-labelledby="shortener-privacy-title">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true"><Link2 size={19} /></div>
          <p className="mt-4 text-xs font-black uppercase tracking-[.14em] text-black/40">Before you shorten</p>
          <h2 id="shortener-privacy-title" className="mt-2 text-xl font-black tracking-tight">Your URL is sent to an external service.</h2>
          <p className="mt-3 text-sm leading-6 text-black/55">Internet Toolbox uses the is.gd URL shortening service to create the short link. The original URL is sent there when you submit it.</p>
          <div className="mt-5 border-t border-[#d8d4c9] pt-5 text-sm leading-6 text-black/55">
            <p><span className="font-bold text-black">Privacy tip:</span> Do not shorten links containing passwords, private tokens or other sensitive information.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
