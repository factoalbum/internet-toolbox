"use client";

import { Check, Copy, RotateCcw, Type } from "lucide-react";
import { useMemo, useState } from "react";

type CaseName = "upper" | "lower" | "title" | "sentence" | "camel" | "snake" | "kebab";

const modes: { id: CaseName; label: string }[] = [
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
];

function words(value: string) {
  return value.trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

function convert(value: string, mode: CaseName) {
  const parts = words(value);
  if (!value) return "";
  if (mode === "upper") return value.toUpperCase();
  if (mode === "lower") return value.toLowerCase();
  if (mode === "title") return parts.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  if (mode === "sentence") {
    const lower = value.toLowerCase().trim();
    return lower ? lower.charAt(0).toUpperCase() + lower.slice(1) : "";
  }
  const normalized = parts.map((word) => word.toLowerCase());
  if (mode === "camel") return normalized.map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join("");
  if (mode === "snake") return normalized.join("_");
  return normalized.join("-");
}

const focusRing = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<CaseName>("upper");
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const result = useMemo(() => convert(text, mode), [text, mode]);

  async function copyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopyState("success");
      window.setTimeout(() => setCopyState("idle"), 1400);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  }

  function clearText() {
    setText("");
    setCopyState("idle");
  }

  const copyLabel = copyState === "success" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="case-workspace-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-[#171717]" aria-hidden="true">
              <Type size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-black/45">Text utility</p>
              <h2 id="case-workspace-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] md:text-2xl">Change text case</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/55">Convert text to a different case without uploading it anywhere.</p>
            </div>
          </div>
          <button type="button" onClick={clearText} disabled={!text} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 ${focusRing}`} aria-label="Clear text">
            <RotateCcw size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      <div className="p-5 md:p-7">
        <fieldset>
          <legend className="text-xs font-black uppercase tracking-[.12em] text-black/45">Choose a format</legend>
          <p className="mt-1 text-xs font-semibold text-black/40">Result updates as you type</p>
          <div className="mt-3 rounded-xl border border-[#d8d4c9] bg-[#f4f1e9] p-1" role="group" aria-label="Text case options">
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-7">
              {modes.map((item) => (
                <button key={item.id} type="button" onClick={() => { setMode(item.id); setCopyState("idle"); }} aria-pressed={mode === item.id} className={`min-h-11 rounded-lg border px-2 text-xs font-bold transition ${mode === item.id ? "border-[#171717] bg-[#171717] text-white" : "border-transparent bg-transparent text-black/55 hover:border-[#d8d4c9] hover:bg-white hover:text-black"} ${focusRing}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-[#e2dfd7] bg-white p-4 md:p-5" aria-labelledby="case-input-heading">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 id="case-input-heading" className="text-sm font-black text-[#171717]">1. Your text</h3>
                <p className="mt-1 text-xs leading-5 text-black/45">Paste or type the text you want to transform.</p>
              </div>
              <span className="rounded-full bg-[#e9f1d8] px-2.5 py-1 text-[11px] font-bold text-[#52691f]">Local only</span>
            </div>
            <textarea id="case-input" value={text} onChange={(event) => { setText(event.target.value); setCopyState("idle"); }} placeholder="Paste or type your text here" aria-describedby="case-input-help" className={`mt-4 min-h-64 w-full resize-y rounded-xl border border-[#bcb8ae] bg-[#fffdf8] p-4 text-base leading-7 text-[#171717] outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40 ${focusRing}`} />
            <div className="mt-2 flex items-center justify-between gap-3">
              <p id="case-input-help" className="text-xs leading-5 text-black/45">Works with letters, numbers, and punctuation.</p>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-black/40">{text.length.toLocaleString("en-IN")} chars</span>
            </div>
          </section>

          <section className="rounded-2xl border border-[#d8d4c9] bg-[#f4f1e9] p-4 md:p-5" aria-labelledby="case-output-heading">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="case-output-heading" className="text-sm font-black text-[#171717]">2. Your result</h3>
                <p className="mt-1 text-xs leading-5 text-black/45">Your converted text appears here.</p>
              </div>
              <button type="button" onClick={copyResult} disabled={!result} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#bcb8ae] bg-white px-4 text-xs font-black text-[#171717] transition hover:border-[#171717] ${focusRing} disabled:cursor-not-allowed disabled:opacity-35`} aria-label={copyState === "success" ? "Converted text copied" : copyState === "error" ? "Copy converted text failed" : "Copy converted text"}>
                {copyState === "success" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                <span>{copyLabel}</span>
              </button>
            </div>
            <textarea id="case-output" value={result} readOnly placeholder="Your converted text will appear here" aria-label="Converted text result" className="mt-4 min-h-64 w-full resize-y rounded-xl border border-[#d8d4c9] bg-white p-4 text-base leading-7 text-[#171717] outline-none placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold tabular-nums text-black/40">{result.length ? `${result.length.toLocaleString("en-IN")} chars` : "Waiting for input"}</span>
              {result && <span className="rounded-full bg-[#e9f1d8] px-2.5 py-1 text-[11px] font-bold text-[#52691f]">Ready</span>}
            </div>
            {copyState === "error" && <p className="mt-3 rounded-lg bg-[#fff7ed] px-3 py-2 text-xs leading-5 text-[#92400e]" role="alert">Copying was blocked by your browser. Select the result and copy it manually.</p>}
          </section>
        </div>

        <div className="mt-5 flex items-start gap-2 border-t border-[#d8d4c9] pt-5">
          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#b8d95f]" aria-hidden="true" />
          <p className="text-xs leading-5 text-black/45">Processing happens in your browser. Nothing is sent to a server.</p>
        </div>
      </div>
    </div>
  );
}
