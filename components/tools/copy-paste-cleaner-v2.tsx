"use client";

import { Check, Clipboard, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { cleanCopiedContent } from "../../lib/copy-paste-cleaner";

export default function CopyPasteCleanerV2() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => cleanCopiedContent(text), [text]);

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
      return;
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = result;
      fallback.setAttribute("readonly", "true");
      fallback.style.position = "fixed";
      fallback.style.left = "-9999px";
      document.body.appendChild(fallback);
      fallback.select();
      try {
        if (!document.execCommand("copy")) throw new Error("Copy failed");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      } catch {
        setCopied(false);
      } finally {
        fallback.remove();
      }
    }
  }

  function clear() {
    setText("");
    setCopied(false);
  }

  return (
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#c8f169]"><Sparkles size={20} aria-hidden="true" /></span>
            <div className="min-w-0"><p className="font-bold">Clean AI copied text</p><p className="text-sm text-black/45">Clean Claude, ChatGPT and browser copy for emails, documents and CMS editors.</p></div>
          </div>
          <button type="button" onClick={clear} disabled={!text} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium text-black/45 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-35" aria-label="Clear text"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Clear</span></button>
        </div>
      </div>
      <div className="p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="copy-paste-cleaner-input" className="mb-2 block text-sm font-bold">Paste copied content</label>
            <textarea id="copy-paste-cleaner-input" value={text} onChange={(event) => { setText(event.target.value); setCopied(false); }} placeholder="Paste text copied from Claude, ChatGPT, a browser or another app" className="min-h-80 w-full resize-y border border-[#cfcabf] bg-[#f8f5ed] p-4 text-base leading-7 outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="copy-paste-cleaner-output" className="text-sm font-bold">Clean text</label><button type="button" onClick={copyResult} disabled={!result} className="flex min-h-10 items-center gap-2 rounded-md border border-[#cfcabf] px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-35 hover:bg-[#f3f0e8] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">{copied ? <Check size={15} aria-hidden="true" /> : <Clipboard size={15} aria-hidden="true" />}{copied ? "Copied" : "Copy"}</button></div>
            <textarea id="copy-paste-cleaner-output" value={result} readOnly placeholder="Clean text appears here as you paste" className="min-h-80 w-full resize-y border border-[#cfcabf] bg-[#f3f0e8] p-4 text-base leading-7 outline-none" />
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-[#dedbd3] bg-[#faf9f6] px-4 py-3 text-xs leading-5 text-black/50"><strong className="text-black/70">Cleans:</strong> Claude-style ▎ markers, common vertical quote markers, zero-width characters, repeated spaces, trailing whitespace, line-ending differences and decorative separator lines. It keeps your wording unchanged.</div>
        <p className="mt-3 text-xs leading-5 text-black/40">Processing happens in your browser. Nothing is sent to a server.</p>
      </div>
    </div>
  );
}
