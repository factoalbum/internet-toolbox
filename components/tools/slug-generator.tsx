"use client";

import { Copy, RotateCcw, Check } from "lucide-react";
import { useState } from "react";

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SlugGenerator() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const result = slugify(text);

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <p className="font-bold">Create a URL slug</p>
        <p className="mt-1 text-sm text-black/45">Turn a page title into a clean, lowercase, search-friendly slug.</p>
      </div>
      <div className="p-5 md:p-7">
        <label htmlFor="slug-input" className="mb-2 block text-sm font-bold">Page title or text</label>
        <input id="slug-input" value={text} onChange={(event) => setText(event.target.value)} placeholder="e.g. 10 Easy Ways to Learn JavaScript" className="min-h-12 w-full border border-[#cfcabf] bg-[#f8f5ed] px-4 text-base outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
        <label htmlFor="slug-output" className="mb-2 mt-6 block text-sm font-bold">Slug</label>
        <div className="flex gap-2">
          <input id="slug-output" value={result} readOnly placeholder="your-page-title" className="min-h-12 min-w-0 flex-1 border border-[#cfcabf] bg-[#f8f5ed] px-4 font-mono text-sm outline-none" aria-label="Generated URL slug" />
          <button type="button" onClick={copy} disabled={!result} className="flex min-h-12 items-center gap-2 border border-[#171717] bg-[#171717] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-35">{copied ? <Check size={16} /> : <Copy size={16} />}<span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span></button>
        </div>
        <button type="button" onClick={() => setText("")} className="mt-4 flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-black/45 transition hover:bg-black/5 hover:text-black"><RotateCcw size={16} /> Clear</button>
      </div>
    </div>
  );
}
