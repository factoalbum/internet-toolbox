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

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<CaseName>("upper");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => convert(text, mode), [text, mode]);

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function clearText() {
    setText("");
    setCopied(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-[#171717]" aria-hidden="true">
              <Type size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Change text case</p>
              <p className="text-sm text-black/50">Convert text without uploading it anywhere.</p>
            </div>
          </div>
          <button type="button" onClick={clearText} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-semibold text-black/50 transition hover:border-[#d8d4c9] hover:bg-white hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Clear text">
            <RotateCcw size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="rounded-xl border border-[#d8d4c9] bg-[#f4f1e9] p-1" role="group" aria-label="Text case options">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-7">
            {modes.map((item) => (
              <button key={item.id} type="button" onClick={() => setMode(item.id)} aria-pressed={mode === item.id} className={`min-h-11 rounded-lg border px-2 text-xs font-bold transition focus:outline-none focus:ring-4 focus:ring-[#c8f169] ${mode === item.id ? "border-[#171717] bg-[#171717] text-white" : "border-transparent bg-transparent text-black/55 hover:border-[#d8d4c9] hover:bg-white hover:text-black"}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
            <label htmlFor="case-input" className="block text-sm font-bold">Your text</label>
            <p className="mt-1 text-xs leading-5 text-black/45">Paste or type the text you want to transform.</p>
            <textarea id="case-input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste or type your text here" className="mt-3 min-h-64 w-full resize-y rounded-xl border border-[#bcb8ae] bg-[#fffdf8] p-4 text-base leading-7 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" />
          </div>

          <div className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <label htmlFor="case-output" className="text-sm font-bold">Converted text</label>
                <p className="mt-1 text-xs leading-5 text-black/45">Your result updates as you type.</p>
              </div>
              <button type="button" onClick={copyResult} disabled={!result} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-[#cfcabf] bg-white px-3 text-xs font-bold transition hover:bg-[#f3f0e8] focus:outline-none focus:ring-4 focus:ring-[#c8f169] disabled:cursor-not-allowed disabled:opacity-35" aria-label={copied ? "Converted text copied" : "Copy converted text"}>
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <textarea id="case-output" value={result} readOnly placeholder="Your converted text will appear here" aria-live="polite" className="mt-3 min-h-64 w-full resize-y rounded-xl border border-[#d8d4c9] bg-[#f4f1e9] p-4 text-base leading-7 outline-none placeholder:text-black/25" />
          </div>
        </div>

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Processing happens in your browser. Nothing is sent to a server.</p>
      </div>
    </div>
  );
}
