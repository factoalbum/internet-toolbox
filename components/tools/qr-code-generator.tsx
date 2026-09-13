"use client";

import { useEffect, useRef, useState } from "react";
import { Download, QrCode, RotateCcw } from "lucide-react";

const SIZE = 256;
const DEFAULT_VALUE = "https://factoalbum.github.io/internet-toolbox/";
const MAX_LENGTH = 2000;

export default function QrCodeGenerator() {
  const [value, setValue] = useState(DEFAULT_VALUE);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState("");
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      const trimmed = value.trim();
      if (!trimmed) {
        setError("Enter a URL or text to generate a QR code.");
        setIsRendering(false);
        return;
      }
      setIsRendering(true);
      try {
        const QRCode = (await import("qrcode")).default;
        if (cancelled || !canvasRef.current) return;
        await QRCode.toCanvas(canvasRef.current, trimmed, {
          width: SIZE,
          margin: 2,
          errorCorrectionLevel: "M",
          color: { dark: "#171717", light: "#ffffff" },
        });
        if (!cancelled) setError("");
      } catch {
        if (!cancelled) setError("This text is too long to fit into a QR code. Try a shorter value.");
      } finally {
        if (!cancelled) setIsRendering(false);
      }
    }
    void render();
    return () => { cancelled = true; };
  }, [value]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas || error || !value.trim()) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function reset() {
    setValue(DEFAULT_VALUE);
    setError("");
  }

  const characterCount = value.length;
  const canDownload = Boolean(value.trim()) && !error && !isRendering;

  return (
    <section className="grid gap-6 p-5 md:grid-cols-[1fr_auto] md:p-7" aria-labelledby="qr-workspace-title">
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4 border-b border-[#d8d4c9] pb-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[.14em] text-[#6d8e25]">Generator</p>
            <h2 id="qr-workspace-title" className="mt-1 text-xl font-black tracking-tight text-[#171717] md:text-2xl">Create a QR code</h2>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-black/50">Turn a URL or short piece of text into a scannable PNG. The QR code is generated in your browser.</p>
          </div>
          <span className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba] sm:flex" aria-hidden="true"><QrCode size={20} /></span>
        </div>

        <div className="pt-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <label htmlFor="qr-value" className="block text-sm font-bold">Text or URL</label>
              <p id="qr-value-help" className="mt-1 text-xs leading-5 text-black/40">Use a complete URL or the text you want people to scan.</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${characterCount > MAX_LENGTH * 0.9 ? "bg-[#f8eadc] text-[#7b4a20]" : "bg-[#f2efe7] text-black/50"}`} aria-label={`${characterCount} of ${MAX_LENGTH} characters used`}>{characterCount}/{MAX_LENGTH}</span>
          </div>
          <textarea id="qr-value" value={value} onChange={(event) => setValue(event.target.value)} rows={7} maxLength={MAX_LENGTH} placeholder="https://example.com" aria-describedby="qr-value-help qr-status" aria-invalid={Boolean(error)} className="mt-3 min-h-40 w-full resize-y rounded-xl border border-[#bcb8ae] bg-white p-4 text-sm leading-6 text-[#171717] outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" />
          <p className="mt-2 text-xs leading-5 text-black/40">Up to {MAX_LENGTH.toLocaleString()} characters. Very long content may produce a dense QR code that is harder to scan.</p>

          <div id="qr-status" className="mt-4 min-h-6" aria-live="polite" aria-atomic="true">
            {error ? <p className="text-sm font-semibold text-red-700" role="alert">{error}</p> : isRendering ? <p className="text-sm font-medium text-black/45">Updating your QR code…</p> : <p className="text-sm font-medium text-black/45">Ready to download.</p>}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={download} disabled={!canDownload} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-40"><Download size={16} aria-hidden="true" /> Download PNG</button>
            <button type="button" onClick={reset} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-5 text-sm font-bold text-black/65 transition hover:border-[#171717] hover:text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]"><RotateCcw size={15} aria-hidden="true" /> Reset</button>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-center justify-center rounded-2xl border border-[#dedbd3] bg-[#f6f3eb] p-5 md:min-w-[320px] md:p-6" aria-label="QR code preview">
        <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4 shadow-[0_6px_18px_rgba(23,23,23,.05)]">
          <canvas ref={canvasRef} width={SIZE} height={SIZE} aria-label={error ? "QR code unavailable" : `QR code for ${value.trim() || "empty input"}`} className="block size-56 max-w-full sm:size-64" />
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-black/45"><QrCode size={13} aria-hidden="true" /> Generated locally in your browser</p>
        <p className="mt-1 max-w-xs text-center text-[11px] leading-5 text-black/35">Keep the code clear and high contrast for reliable scanning.</p>
      </div>
    </section>
  );
}
