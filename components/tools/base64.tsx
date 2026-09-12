"use client";

import { useMemo, useState } from "react";

function encode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decode(value: string) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input) return { value: "", error: "" };
    try {
      return { value: mode === "encode" ? encode(input) : decode(input), error: "" };
    } catch {
      return { value: "", error: "Invalid Base64 input." };
    }
  }, [input, mode]);

  async function copy() {
    if (!result.value) return;
    try {
      await navigator.clipboard.writeText(result.value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  function useResult() {
    if (!result.value || result.error) return;
    setInput(result.value);
    setMode(mode === "encode" ? "decode" : "encode");
    setCopied(false);
  }

  function reset() {
    setInput("");
    setMode("encode");
    setCopied(false);
  }

  const inputPlaceholder = mode === "encode" ? "Hello, world!" : "SGVsbG8sIHdvcmxkIQ==";

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7" aria-labelledby="base64-workspace-title">
      <header className="border-b border-[#d8d4c9] pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Developer utility</p>
            <h2 id="base64-workspace-title" className="mt-1 text-xl font-bold tracking-tight text-[#171717] md:text-2xl">Base64 encoder & decoder</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/55">Convert text to Base64 or turn an encoded value back into readable text. Everything runs locally in your browser.</p>
          </div>
          <span aria-hidden="true" className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dff4bd] text-lg font-black text-[#171717] sm:flex">B64</span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-lg bg-black/[0.045] p-1" role="group" aria-label="Base64 operation">
            <button type="button" onClick={() => { setMode("encode"); setCopied(false); }} aria-pressed={mode === "encode"} className={`min-h-11 rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60 ${mode === "encode" ? "bg-[#171717] text-white shadow-sm" : "text-black/60 hover:bg-white hover:text-[#171717]"}`}>Encode</button>
            <button type="button" onClick={() => { setMode("decode"); setCopied(false); }} aria-pressed={mode === "decode"} className={`min-h-11 rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60 ${mode === "decode" ? "bg-[#171717] text-white shadow-sm" : "text-black/60 hover:bg-white hover:text-[#171717]"}`}>Decode</button>
          </div>
          <button type="button" onClick={reset} className="min-h-11 rounded-md border border-[#c9c5ba] bg-white px-4 text-sm font-semibold text-[#171717] transition-colors hover:bg-black/[0.035] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60">Reset</button>
        </div>
      </header>

      <div className="grid gap-5 pt-6 md:grid-cols-2" aria-live="polite">
        <section className="rounded-xl border border-[#ddd9cf] bg-white p-4 md:p-5" aria-labelledby="base64-input-label">
          <div className="flex items-end justify-between gap-3">
            <div>
              <label id="base64-input-label" htmlFor="base64-input" className="block text-sm font-bold text-[#171717]">Input</label>
              <p className="mt-1 text-xs leading-5 text-black/45">{mode === "encode" ? "Plain text to encode" : "Base64 value to decode"}</p>
            </div>
            <span className="rounded-full bg-[#f2efe7] px-2.5 py-1 text-[11px] font-semibold text-black/50">Local only</span>
          </div>
          <textarea id="base64-input" value={input} onChange={(event) => { setInput(event.target.value); setCopied(false); }} spellCheck={false} placeholder={inputPlaceholder} aria-describedby="base64-input-help" className="mt-4 min-h-56 w-full resize-y rounded-lg border border-[#c9c5ba] bg-[#fffdf8] p-4 font-mono text-sm leading-6 text-[#171717] outline-none transition-shadow placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
          <p id="base64-input-help" className="mt-2 text-xs leading-5 text-black/45">Tip: whitespace is ignored when decoding.</p>
        </section>

        <section className="rounded-xl border border-[#ddd9cf] bg-[#f6f3eb] p-4 md:p-5" aria-labelledby="base64-output-label">
          <div className="flex items-end justify-between gap-3">
            <div>
              <label id="base64-output-label" htmlFor="base64-output" className="block text-sm font-bold text-[#171717]">Result</label>
              <p className="mt-1 text-xs leading-5 text-black/45">Your converted value appears here</p>
            </div>
            <button type="button" onClick={copy} disabled={!result.value} aria-label={copied ? "Result copied" : "Copy result"} className="min-h-11 rounded-md border border-[#bcb8ae] bg-white px-3.5 text-xs font-bold text-[#171717] transition-colors hover:bg-black/[0.035] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60 disabled:cursor-not-allowed disabled:opacity-35">{copied ? "Copied" : "Copy"}</button>
          </div>
          <textarea id="base64-output" readOnly value={result.value} spellCheck={false} placeholder="Your result will appear here" aria-describedby="base64-status" className="mt-4 min-h-56 w-full resize-y rounded-lg border border-[#d8d4c9] bg-white p-4 font-mono text-sm leading-6 text-[#171717] outline-none placeholder:text-black/25" />
        </section>
      </div>

      <div id="base64-status" className="mt-5 flex flex-col gap-3 border-t border-[#d8d4c9] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className={`text-xs leading-5 ${result.error ? "font-semibold text-red-700" : "text-black/45"}`} role={result.error ? "alert" : undefined}>{result.error || "Processed locally in your browser. Nothing is uploaded."}</p>
        <button type="button" onClick={useResult} disabled={!result.value || !!result.error} className="min-h-11 rounded-md border border-[#171717] bg-[#171717] px-4 text-sm font-semibold text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60 disabled:cursor-not-allowed disabled:opacity-35">Use result as input</button>
      </div>
    </div>
  );
}
