"use client";

import { ArrowLeftRight, Check, Clipboard, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

function encode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decode(value: string) {
  const normalized = value.replace(/\s/g, "");
  if (!normalized) return "";
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 !== 0) {
    throw new Error("Invalid Base64 input.");
  }
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

const focusRing = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const result = useMemo(() => {
    if (!input) return { value: "", error: "" };
    try {
      return { value: mode === "encode" ? encode(input) : decode(input), error: "" };
    } catch {
      return { value: "", error: "Invalid Base64 input. Use a complete Base64 value with valid padding." };
    }
  }, [input, mode]);

  async function copy() {
    if (!result.value) return;
    setCopyError("");
    try {
      await navigator.clipboard.writeText(result.value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
      setCopyError("Copying was blocked by your browser. Select the result and copy it manually.");
    }
  }

  function useResult() {
    if (!result.value || result.error) return;
    setInput(result.value);
    setMode(mode === "encode" ? "decode" : "encode");
    setCopied(false);
    setCopyError("");
  }

  function reset() {
    setInput("");
    setMode("encode");
    setCopied(false);
    setCopyError("");
  }

  const inputPlaceholder = mode === "encode" ? "Hello, world!" : "SGVsbG8sIHdvcmxkIQ==";
  const inputLength = input.length;
  const outputLength = result.value.length;
  const isDirty = Boolean(input) || mode !== "encode" || copied || Boolean(copyError);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="base64-workspace-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true"><ArrowLeftRight size={20} /></span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-black/45">Developer utility</p>
              <h2 id="base64-workspace-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] md:text-2xl">Base64 encoder & decoder</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/55">Convert text to Base64 or decode an encoded value. Everything runs locally in your browser.</p>
            </div>
          </div>
          <button type="button" onClick={reset} disabled={!isDirty} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 ${focusRing}`} aria-label="Reset Base64 converter"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit rounded-xl border border-[#d8d4c9] bg-white p-1" role="group" aria-label="Base64 operation">
            <button type="button" onClick={() => { setMode("encode"); setCopied(false); setCopyError(""); }} aria-pressed={mode === "encode"} className={`min-h-11 rounded-lg px-5 text-sm font-bold transition-colors ${mode === "encode" ? "bg-[#171717] text-white shadow-sm" : "text-black/55 hover:bg-[#f4f1e9] hover:text-[#171717]"} ${focusRing}`}>Encode</button>
            <button type="button" onClick={() => { setMode("decode"); setCopied(false); setCopyError(""); }} aria-pressed={mode === "decode"} className={`min-h-11 rounded-lg px-5 text-sm font-bold transition-colors ${mode === "decode" ? "bg-[#171717] text-white shadow-sm" : "text-black/55 hover:bg-[#f4f1e9] hover:text-[#171717]"} ${focusRing}`}>Decode</button>
          </div>
          <span className="text-xs font-semibold text-black/40">{mode === "encode" ? "Text to Base64" : "Base64 to text"}</span>
        </div>
      </header>

      <div className="p-5 md:p-7">
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#e2dfd7] bg-white p-4 md:p-5" aria-labelledby="base64-input-heading">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 id="base64-input-heading" className="text-sm font-black text-[#171717]">Input</h3>
                <p className="mt-1 text-xs leading-5 text-black/45">{mode === "encode" ? "Plain text to encode" : "Base64 value to decode"}</p>
              </div>
              <span className="rounded-full bg-[#e9f1d8] px-2.5 py-1 text-[11px] font-bold text-[#52691f]">Local only</span>
            </div>
            <textarea id="base64-input" value={input} onChange={(event) => { setInput(event.target.value); setCopied(false); setCopyError(""); }} spellCheck={false} placeholder={inputPlaceholder} aria-describedby="base64-input-help" aria-invalid={Boolean(result.error)} className={`mt-4 min-h-56 w-full resize-y rounded-xl border bg-[#fffdf8] p-4 font-mono text-sm leading-6 text-[#171717] outline-none transition placeholder:text-black/25 ${result.error ? "border-[#b95c4b]" : "border-[#c9c5ba]"} focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40`} />
            <div className="mt-2 flex items-start justify-between gap-3">
              <p id="base64-input-help" className="text-xs leading-5 text-black/45">Whitespace is ignored when decoding.</p>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-black/40">{inputLength.toLocaleString("en-IN")} chars</span>
            </div>
          </section>

          <section className="rounded-2xl border border-[#d8d4c9] bg-[#f4f1e9] p-4 md:p-5" aria-labelledby="base64-output-heading">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 id="base64-output-heading" className="text-sm font-black text-[#171717]">Result</h3>
                <p className="mt-1 text-xs leading-5 text-black/45">Your converted value appears here</p>
              </div>
              <button type="button" onClick={copy} disabled={!result.value} aria-label={copied ? "Result copied" : "Copy result"} aria-describedby={copyError ? "base64-copy-error" : undefined} className={`min-h-11 rounded-xl border border-[#bcb8ae] bg-white px-4 text-xs font-black text-[#171717] transition hover:border-[#171717] hover:bg-white ${focusRing} disabled:cursor-not-allowed disabled:opacity-35`}>{copied ? <span className="inline-flex items-center gap-1.5"><Check size={15} aria-hidden="true" />Copied</span> : <span className="inline-flex items-center gap-1.5"><Clipboard size={15} aria-hidden="true" />Copy</span>}</button>
            </div>

            <textarea id="base64-output" readOnly value={result.value} spellCheck={false} placeholder="Your result will appear here" aria-label="Base64 conversion result" className={`mt-4 min-h-56 w-full resize-y rounded-xl border border-[#d8d4c9] bg-white p-4 font-mono text-sm leading-6 text-[#171717] outline-none placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40 ${focusRing}`} />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-black/40">{outputLength ? `${outputLength.toLocaleString("en-IN")} chars` : "Waiting for input"}</span>
              {result.value && <span className="rounded-full bg-[#e9f1d8] px-2.5 py-1 text-[11px] font-bold text-[#52691f]" role="status">Ready</span>}
            </div>
          </section>
        </div>

        {result.error ? (
          <p className="mt-5 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">{result.error}</p>
        ) : copyError ? (
          <p id="base64-copy-error" className="mt-5 rounded-xl border border-[#ead9c8] bg-[#fff7ed] p-4 text-sm leading-6 text-[#7b4a20]" role="alert">{copyError}</p>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 border-t border-[#d8d4c9] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-black/55">Local browser processing</p>
            <p className="mt-1 text-xs leading-5 text-black/45">Your text is converted on this device and is not uploaded.</p>
          </div>
          <button type="button" onClick={useResult} disabled={!result.value || !!result.error} className={`min-h-11 rounded-xl bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black/80 ${focusRing} disabled:cursor-not-allowed disabled:opacity-35`}>Use result as input</button>
        </div>
      </div>
    </div>
  );
}
