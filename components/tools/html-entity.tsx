"use client";

import { Check, Code2, Copy, RotateCcw, ArrowRightLeft } from "lucide-react";
import { useMemo, useState } from "react";

const namedEntities: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  quot: '"',
  nbsp: "\u00a0",
};

function encodeHtml(value: string) {
  return value.replace(/[\u0026\u003c\u003e\u0022\u0027]/g, (char) => {
    const named = Object.entries(namedEntities).find(([, decoded]) => decoded === char)?.[0];
    return named ? `&${named};` : `&#${char.charCodeAt(0)};`;
  });
}

function decodeHtml(value: string) {
  if (typeof document === "undefined") return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

export default function HtmlEntityTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");

  const output = useMemo(() => (mode === "encode" ? encodeHtml(input) : decodeHtml(input)), [input, mode]);
  const copyLabel = copyState === "success" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy";
  const isDefaultState = mode === "encode" && input.length === 0;

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("success");
      window.setTimeout(() => setCopyState("idle"), 1400);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  }

  function useResult() {
    if (!output) return;
    setInput(output);
    setMode((current) => (current === "encode" ? "decode" : "encode"));
    setCopyState("idle");
  }

  function reset() {
    setMode("encode");
    setInput("");
    setCopyState("idle");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="html-entity-workspace-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true">
              <Code2 size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.14em] text-black/45">Developer utility</p>
              <h2 id="html-entity-workspace-title" className="mt-0.5 text-lg font-black tracking-[-.025em] md:text-xl">Encode & decode HTML entities</h2>
              <p className="mt-1 text-sm leading-5 text-black/50">Convert reserved HTML characters and entities directly in your browser.</p>
            </div>
          </div>
          <button type="button" onClick={reset} disabled={isDefaultState} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#d8d4c9] disabled:hover:text-black/55" aria-label="Reset HTML entity converter">
            <RotateCcw size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="HTML entity mode">
          {["encode", "decode"] as const}.map((item) => (
            <button key={item} type="button" onClick={() => { setMode(item); setCopyState("idle"); }} aria-pressed={mode === item} className={`min-h-11 rounded-xl border px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] ${mode === item ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-white text-black/55 hover:border-[#171717] hover:text-black"}`}>
              {item === "encode" ? "Encode" : "Decode"}
            </button>
          ))}
          <button type="button" onClick={useResult} disabled={!output} className="ml-auto flex min-h-11 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-4 text-sm font-bold text-black/60 transition hover:border-[#171717] hover:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-35">
            <ArrowRightLeft size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Use result as input</span>
            <span className="sm:hidden">Use result</span>
          </button>
        </div>
      </header>

      <div className="p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-[#e2dfd7] bg-white p-4 md:p-5" aria-labelledby="html-entity-input-title">
            <div>
              <h3 id="html-entity-input-title" className="text-sm font-bold">Input</h3>
              <p className="mt-1 text-xs leading-5 text-black/45">{mode === "encode" ? "Type HTML text with reserved characters." : "Paste entities such as &amp; or &#169;."}</p>
            </div>
            <label htmlFor="html-entity-input" className="sr-only">HTML entity input</label>
            <textarea id="html-entity-input" value={input} onChange={(event) => { setInput(event.target.value); setCopyState("idle"); }} placeholder={mode === "encode" ? "Type HTML text here..." : "Paste entities such as &amp; or &#169;..."} className="mt-4 min-h-64 w-full resize-y rounded-xl border border-[#bcb8ae] bg-[#fffdf8] p-4 font-mono text-sm leading-6 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" spellCheck={false} aria-describedby="html-entity-input-help" />
            <p id="html-entity-input-help" className="mt-2 text-xs leading-5 text-black/45">{mode === "encode" ? "Reserved characters like &lt; and &amp; are converted to entities." : "Decoding runs locally without uploading your text."}</p>
          </section>

          <section className="rounded-2xl border border-[#e2dfd7] bg-[#f4f1e9] p-4 md:p-5" aria-labelledby="html-entity-result-title">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="html-entity-result-title" className="text-sm font-bold">Result</h3>
                <p className="mt-1 text-xs leading-5 text-black/45">Your converted value updates as you type.</p>
              </div>
              <button type="button" onClick={copyOutput} disabled={!output} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-35 ${copyState === "error" ? "border-[#b45309] text-[#92400e]" : "border-[#cfcabf] bg-white hover:bg-[#fffdf8]"}`} aria-label={copyState === "success" ? "Result copied" : copyState === "error" ? "Copy result failed" : "Copy result"} aria-describedby={copyState === "error" ? "html-entity-copy-error" : undefined}>
                {copyState === "success" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                <span className="hidden sm:inline">{copyLabel}</span>
              </button>
            </div>
            <textarea id="html-entity-output" readOnly value={output} placeholder="Your result will appear here" aria-label="HTML entity conversion result" className="mt-4 min-h-64 w-full resize-y rounded-xl border border-[#d8d4c9] bg-white p-4 font-mono text-sm leading-6 outline-none placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" />
            {copyState === "error" && <p id="html-entity-copy-error" className="mt-2 text-xs font-medium text-[#92400e]" role="status">Copying was blocked by your browser. Select the result and copy it manually.</p>}
            <p className="mt-3 text-xs font-semibold text-black/40">{output.length.toLocaleString("en-IN")} characters</p>
          </section>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-[#d8d4c9] bg-[#faf9f6] p-4">
          <p className="text-xs font-black uppercase tracking-[.1em] text-black/45">Good to know</p>
          <p className="mt-2 text-sm leading-6 text-black/55">Encoding covers common reserved characters such as <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-black/70">&lt;</code>, <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-black/70">&gt;</code>, <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-black/70">&amp;</code> and quotes. Processing stays on this device.</p>
        </div>
      </div>
    </div>
  );
}
