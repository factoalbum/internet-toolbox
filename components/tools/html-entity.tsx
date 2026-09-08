"use client";

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
  return value.replace(/[&<>"']/g, (char) => {
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
  const output = useMemo(() => (mode === "encode" ? encodeHtml(input) : decodeHtml(input)), [input, mode]);

  const swap = () => {
    setMode((current) => (current === "encode" ? "decode" : "encode"));
    setInput(output);
  };

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7">
      <div className="flex flex-wrap gap-2" role="group" aria-label="HTML entity mode">
        {(["encode", "decode"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setMode(item)} className={`min-h-11 rounded-md border px-4 text-sm font-semibold transition ${mode === item ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#f3f0e8] text-black/60 hover:border-[#171717]"}`}>
            {item === "encode" ? "Encode" : "Decode"}
          </button>
        ))}
        <button type="button" onClick={swap} disabled={!output} className="ml-auto min-h-11 rounded-md border border-[#d8d4c9] px-4 text-sm font-semibold text-black/60 hover:border-[#171717] disabled:cursor-not-allowed disabled:opacity-40">Use result as input</button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-black/45">Input</span>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === "encode" ? "Type HTML text here…" : "Paste entities such as &amp; or &#169;…"} className="min-h-72 w-full resize-y rounded-md border border-[#d8d4c9] bg-white p-4 font-mono text-sm leading-6 outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]" spellCheck={false} />
        </label>
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-black/45">Result</span>
          <div className="relative min-h-72 rounded-md border border-[#d8d4c9] bg-[#f3f0e8] p-4">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6">{output || "Your result will appear here."}</pre>
            <button type="button" onClick={() => navigator.clipboard?.writeText(output)} disabled={!output} className="absolute bottom-3 right-3 min-h-10 rounded-md bg-[#171717] px-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-30">Copy</button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-black/45">Encoding converts reserved HTML characters such as &lt; and &amp; into entities. Decoding reverses them in your browser.</p>
    </div>
  );
}
