"use client";

import { useEffect, useRef, useState } from "react";
import { Download, QrCode } from "lucide-react";

const SIZE = 256;

export default function QrCodeGenerator() {
  const [value, setValue] = useState("https://factoalbum.github.io/internet-toolbox/");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function render() {
      if (!value.trim()) {
        setError("Enter a URL or text to generate a QR code.");
        return;
      }
      try {
        const QRCode = (await import("qrcode")).default;
        if (cancelled || !canvasRef.current) return;
        await QRCode.toCanvas(canvasRef.current, value.trim(), {
          width: SIZE,
          margin: 2,
          errorCorrectionLevel: "M",
          color: { dark: "#171717", light: "#ffffff" },
        });
        setError("");
      } catch {
        if (!cancelled) setError("This text is too long to fit into a QR code. Try a shorter value.");
      }
    }
    void render();
    return () => { cancelled = true; };
  }, [value]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas || error) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="grid gap-8 p-5 md:grid-cols-[1fr_auto] md:p-8">
      <div>
        <label htmlFor="qr-value" className="block text-sm font-semibold">Text or URL</label>
        <textarea id="qr-value" value={value} onChange={(event) => setValue(event.target.value)} rows={7} maxLength={2000} placeholder="https://example.com" className="mt-2 min-h-40 w-full resize-y rounded-xl border border-[#bcb8ae] bg-white p-4 text-sm leading-6 outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" />
        <p className="mt-2 text-xs text-black/40">Up to 2,000 characters. Longer content may not fit in a QR code.</p>
        {error && <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
        <button type="button" onClick={download} disabled={Boolean(error) || !value.trim()} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#171717] px-4 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"><Download size={15} /> Download PNG</button>
      </div>
      <div className="flex min-w-0 flex-col items-center justify-center">
        <div className="rounded-2xl border border-[#dedbd3] bg-white p-4 shadow-sm"><canvas ref={canvasRef} width={SIZE} height={SIZE} aria-label="Generated QR code" /></div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-black/40"><QrCode size={13} aria-hidden="true" /> Generated locally in your browser</p>
      </div>
    </div>
  );
}
