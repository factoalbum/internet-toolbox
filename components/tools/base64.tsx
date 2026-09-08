"use client";

import { useMemo, useState } from "react";

function encode(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decode(value: string) {
  return decodeURIComponent(escape(atob(value)));
}

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const result = useMemo(() => {
    if (!input) return { value: "", error: "" };
    try {
      return { value: mode === "encode" ? encode(input) : decode(input), error: "" };
    } catch {
      return { value: "", error: "Invalid Base64 input." };
    }
  }, [input, mode]);

  async function copy() {
    if (result.value) await navigator.clipboard.writeText(result.value);
  }

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7">
      <div className="flex flex-wrap gap-2 border-b border-[#d8d4c9] pb-5">
        <button type="button" onClick={() => setMode("encode")} className={`min-h-11 rounded-md px-4 text-sm font-semibold ${mode === "encode" ? "bg-[#171717] text-white" : "bg-black/5 text-black/60"}`}>Encode</button>
        <button type="button" onClick={() => setMode("decode")} className={`min-h-11 rounded-md px-4 text-sm font-semibold ${mode === "decode" ? "bg-[#171717] text-white" : "bg-black/5 text-black/60"}`}>Decode</button>
      </div>
      <label htmlFor="base64-input" className="mt-6 block text-sm font-semibold">Text</label>
      <textarea id="base64-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} placeholder={mode === "encode" ? "Hello, world!" : "SGVsbG8sIHdvcmxkIQ=="} className="mt-2 min-h-36 w-full resize-y rounded-md border border-[#c9c5ba] bg-white p-3 font-mono text-sm leading-6 outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-xs text-black/45">Processed locally in your browser. Unicode text is supported.</p>
        <button type="button" onClick={copy} disabled={!result.value} className="min-h-11 shrink-0 rounded-md border border-[#171717] px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-35">Copy result</button>
      </div>
      <label htmlFor="base64-output" className="mt-6 block text-sm font-semibold">Result</label>
      <textarea id="base64-output" readOnly value={result.value} spellCheck={false} placeholder="Your result will appear here" className="mt-2 min-h-28 w-full resize-y rounded-md border border-[#d8d4c9] bg-[#f3f0e8] p-3 font-mono text-sm leading-6 outline-none" />
      {result.error && <p className="mt-3 text-sm font-medium text-red-700" role="alert">{result.error}</p>}
    </div>
  );
}
