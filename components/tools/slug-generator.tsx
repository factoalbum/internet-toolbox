"use client";

import { Check, Copy, Link2, RotateCcw } from "lucide-react";
import { useState } from "react";

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SlugGenerator() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const result = slugify(text);

  async function copy() {
    if (!result) return;
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopyError(true);
    }
  }

  function clear() {
    setText("");
    setCopied(false);
    setCopyError(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true">
              <Link2 size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Create a clean URL slug</p>
              <p className="text-sm leading-5 text-black/50">Turn a page title into a lowercase, search-friendly URL slug.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clear}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
            aria-label="Clear slug generator"
          >
            <RotateCcw size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.3)]">
            <span className="text-sm font-bold">Page title or text</span>
            <span className="mt-1 block text-xs leading-5 text-black/45">Spaces become hyphens; punctuation is removed while letters from other languages are preserved.</span>
            <textarea
              id="slug-input"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setCopied(false);
                setCopyError(false);
              }}
              placeholder="e.g. 10 Easy Ways to Learn JavaScript"
              rows={4}
              className="mt-3 min-h-32 w-full resize-y rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 py-3 text-base leading-6 outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] focus:ring-offset-1"
            />
            <span className="mt-2 block text-xs font-medium text-black/40">{text.length.toLocaleString("en-IN")} characters</span>
          </label>

          <section aria-labelledby="slug-result" className="rounded-2xl border border-[#171717] bg-[#c8f169] p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p id="slug-result" className="text-[11px] font-black uppercase tracking-[.15em] text-black/55">Generated slug</p>
                <p className="mt-1 text-xs leading-5 text-black/55">Ready to copy into your page URL.</p>
              </div>
              <span className="rounded-full border border-black/10 bg-white/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-[.1em] text-black/55" aria-label="Slug status">
                {result ? "Ready" : "Waiting"}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-black/10 bg-white/75 p-3">
              <p className="min-h-12 break-all font-mono text-sm leading-6 text-[#171717]" aria-live="polite">
                {result || "your-page-title"}
              </p>
            </div>

            <button
              type="button"
              onClick={copy}
              disabled={!result}
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#171717] bg-[#171717] px-4 text-sm font-bold text-white transition hover:bg-black/85 focus:outline-none focus:ring-4 focus:ring-white/70 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={copied ? "Slug copied" : "Copy generated slug"}
            >
              {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
              {copied ? "Copied" : "Copy slug"}
            </button>

            {copyError && (
              <p className="mt-3 rounded-xl border border-[#ead7d2] bg-[#fff7f5] px-3 py-2 text-xs font-semibold leading-5 text-[#7b3d31]" role="alert">
                Your browser blocked clipboard access. Select the slug and copy it manually.
              </p>
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Lowercase", "Consistent URLs are easier to read."],
            ["Simple", "Punctuation is removed automatically."],
            ["Shareable", "Short hyphenated words scan well."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-[#d8d4c9] bg-[#faf9f6] p-4">
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-1 text-xs leading-5 text-black/45">{description}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">
          Everything runs in your browser. The text is normalized, lowercased, and converted locally without sending it to a server.
        </p>
      </div>
    </div>
  );
}
