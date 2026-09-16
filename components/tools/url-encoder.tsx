"use client";

import { Check, Copy, Link2, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const output = useMemo(() => {
    if (!input) return "";
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return "Invalid encoded URL text.";
    }
  }, [input, mode]);

  const hasError = input.length > 0 && output === "Invalid encoded URL text.";
  const hasDefaultState = input === "" && mode === "encode";

  function updateInput(value: string) {
    setInput(value);
    setCopied(false);
    setCopyError("");
  }

  function updateMode(nextMode: "encode" | "decode") {
    setMode(nextMode);
    setCopied(false);
    setCopyError("");
  }

  async function copy() {
    if (!output || hasError) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setCopyError("");
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
      setCopyError("Copying was blocked by your browser. Select the result and copy it manually.");
    }
  }

  function reset() {
    setInput("");
    setMode("encode");
    setCopied(false);
    setCopyError("");
  }

  const focusRing = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/45 focus-visible:ring-offset-1";

  return (
    <section aria-labelledby="url-workspace-title" className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e6f2ff] text-[#35658f]" aria-hidden="true">
              <Link2 size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-black/45">Developer utility</p>
              <h2 id="url-workspace-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] md:text-2xl">Encode or decode URL text</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/50">Convert spaces, symbols and other URL characters safely. Everything runs locally in your browser.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={hasDefaultState}
            className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 ${focusRing}`}
            aria-label="Reset URL encoder and decoder"
          >
            <RotateCcw size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <div className="p-5 md:p-7">
        <section aria-labelledby="url-mode-label">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Choose an action</p>
              <h3 id="url-mode-label" className="mt-1 text-base font-black text-[#171717]">What do you want to do?</h3>
              <p className="mt-1 text-xs leading-5 text-black/45">Encode plain text for a URL, or decode percent-encoded text back.</p>
            </div>
            <div className="flex rounded-xl border border-[#d8d4c9] bg-[#f3f0e8] p-1" role="group" aria-label="URL conversion mode">
              <button
                type="button"
                onClick={() => updateMode("encode")}
                aria-pressed={mode === "encode"}
                className={`min-h-11 rounded-lg px-4 text-sm font-bold transition ${focusRing} ${mode === "encode" ? "bg-[#171717] text-white shadow-sm" : "text-black/55 hover:bg-white hover:text-black"}`}
              >
                Encode
              </button>
              <button
                type="button"
                onClick={() => updateMode("decode")}
                aria-pressed={mode === "decode"}
                className={`min-h-11 rounded-lg px-4 text-sm font-bold transition ${focusRing} ${mode === "decode" ? "bg-[#171717] text-white shadow-sm" : "text-black/55 hover:bg-white hover:text-black"}`}
              >
                Decode
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6" aria-labelledby="url-workspace-flow">
          <h3 id="url-workspace-flow" className="sr-only">URL conversion workspace</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.28)]">
              <span className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-xs font-black uppercase tracking-[.12em] text-black/40">Input</span>
                  <span className="mt-1 block text-sm font-bold">{mode === "encode" ? "Text or URL" : "Encoded URL text"}</span>
                </span>
                <span className="rounded-full bg-[#f3f0e8] px-2.5 py-1 text-[10px] font-black uppercase tracking-[.1em] text-black/40">Step 2</span>
              </span>
              <span className="mt-1 block text-xs leading-5 text-black/40">
                {mode === "encode" ? "Paste a URL, query value, or any text containing URL characters." : "Paste percent-encoded text such as %3A or %2F."}
              </span>
              <textarea
                id="url-input"
                value={input}
                onChange={(e) => updateInput(e.target.value)}
                placeholder={mode === "encode" ? "https://example.com/search?q=hello world" : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"}
                spellCheck={false}
                aria-describedby="url-input-help"
                aria-invalid={hasError}
                className={`mt-3 min-h-56 w-full resize-y rounded-xl border bg-[#fffdf8] p-4 font-mono text-sm leading-6 outline-none transition placeholder:text-black/30 focus:border-[#171717] ${hasError ? "border-[#c98b80]" : "border-[#bcb8ae]"} ${focusRing}`}
              />
              <span id="url-input-help" className="mt-2 block text-xs text-black/35">Processed locally in your browser.</span>
            </label>

            <section className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-4" aria-labelledby="url-result-label">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="block text-xs font-black uppercase tracking-[.12em] text-black/40">Result</span>
                  <h3 id="url-result-label" className="mt-1 text-sm font-bold">Your converted value</h3>
                  <p className="mt-1 text-xs text-black/40">{output && !hasError ? `${output.length.toLocaleString("en-IN")} characters` : "Ready when you are"}</p>
                </div>
                <button
                  type="button"
                  onClick={copy}
                  disabled={!output || hasError}
                  aria-describedby={copyError ? "url-copy-error" : undefined}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${copied ? "border-[#171717] bg-[#c8f169] text-black" : "border-[#d0ccc2] bg-white hover:border-[#171717] hover:bg-[#c8f169]"} ${focusRing}`}
                  aria-label={copied ? "URL result copied" : "Copy URL result"}
                >
                  {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <textarea
                id="url-output"
                readOnly
                value={output}
                placeholder="Your result will appear here"
                aria-label="URL conversion result"
                aria-invalid={hasError}
                className={`mt-3 min-h-56 w-full resize-y rounded-xl border bg-white p-4 font-mono text-sm leading-6 outline-none transition focus:border-[#171717] ${hasError ? "border-[#c98b80] bg-[#fff7f5] text-[#7b3d31]" : "border-[#d0ccc2]"} ${focusRing}`}
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-black/35">Output is not uploaded.</span>
                {output && !hasError && <span className="rounded-full bg-[#e9f1d8] px-2.5 py-1 text-[11px] font-bold text-[#52691f]">Ready</span>}
              </div>
            </section>
          </div>
        </section>

        {(hasError || copyError) && (
          <p id="url-copy-error" className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-3 text-sm leading-5 text-[#7b3d31]" role="alert">
            {copyError || "The encoded value could not be decoded. Check that the percent-encoding is complete and try again."}
          </p>
        )}

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">
          This tool uses the browser&apos;s standard URI component encoding. It does not send or store your text.
        </p>
      </div>
    </section>
  );
}
