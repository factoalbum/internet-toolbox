"use client";

import { Copy, RotateCcw, Check, Type } from "lucide-react";
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

  return (
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-[#c8f169]"><Type size={20} /></span><div><p className="font-bold">Change text case</p><p className="text-sm text-black/45">Convert text without uploading it anywhere.</p></div></div>
          <button type="button" onClick={() => { setText(""); setCopied(false); }} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-black/45 transition hover:bg-white hover:text-black" aria-label="Clear text"><RotateCcw size={16} /><span className="hidden sm:inline">Clear</span></button>
        </div>
      </div>
      <div className="p-5 md:p-7">
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Text case options">
          {modes.map((item) => <button key={item.id} type="button" onClick={() => setMode(item.id)} className={`min-h-10 rounded-md border px-3 text-xs font-bold transition ${mode === item.id ? "border-[#171717] bg-[#171717] text-white" : "border-[#cfcabf] bg-[#f8f5ed] hover:border-[#171717]"}`}>{item.label}</button>)}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div><label htmlFor="case-input" className="mb-2 block text-sm font-bold">Your text</label><textarea id="case-input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste or type your text here" className="min-h-64 w-full resize-y border border-[#cfcabf] bg-[#f8f5ed] p-4 text-base leading-7 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" /></div>
          <div><div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="case-output" className="text-sm font-bold">Converted text</label><button type="button" onClick={copyResult} disabled={!result} className="flex min-h-10 items-center gap-2 rounded-md border border-[#cfcabf] px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-35 hover:bg-[#f3f0e8]">{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy"}</button></div><textarea id="case-output" value={result} readOnly placeholder="Your converted text will appear here" className="min-h-64 w-full resize-y border border-[#cfcabf] bg-[#f3f0e8] p-4 text-base leading-7 outline-none" /></div>
        </div>
        <p className="mt-4 text-xs leading-5 text-black/40">Processing happens in your browser. Nothing is sent to a server.</p>
      </div>
    </div>
  );
}
