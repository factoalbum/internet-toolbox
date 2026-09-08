"use client";

import { useMemo, useState } from "react";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const output = useMemo(() => {
    if (!input) return "";
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return "Invalid encoded URL text.";
    }
  }, [input, mode]);

  async function copy() {
    if (output) await navigator.clipboard.writeText(output);
  }

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7">
      <div className="flex flex-wrap gap-2 border-b border-[#d8d4c9] pb-5">
        <button type="button" onClick={() => setMode("encode")} className={`min-h-11 rounded-md px-4 text-sm font-semibold ${mode === "encode" ? "bg-[#171717] text-white" : "bg-black/5 text-black/60"}`}>Encode</button>
        <button type="button" onClick={() => setMode("decode")} className={`min-h-11 rounded-md px-4 text-sm font-semibold ${mode === "decode" ? "bg-[#171717] text-white" : "bg-black/5 text-black/60"}`}>Decode</button>
      </div>
      <label className="mt-6 block text-sm font-semibold" htmlFor="url-input">Text or URL</label>
      <textarea id="url-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? "https://example.com/search?q=hello world" : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"} className="mt-2 min-h-36 w-full resize-y rounded-md border border-[#c9c5ba] bg-white p-3 font-mono text-sm outline-none focus:border-[#171717]" />
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-xs text-black/45">Processed locally in your browser.</span>
        <button type="button" onClick={copy} disabled={!output} className="min-h-11 rounded-md border border-[#171717] px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-35">Copy result</button>
      </div>
      <label className="mt-6 block text-sm font-semibold" htmlFor="url-output">Result</label>
      <textarea id="url-output" readOnly value={output} placeholder="Your result will appear here" className="mt-2 min-h-28 w-full resize-y rounded-md border border-[#d8d4c9] bg-[#f3f0e8] p-3 font-mono text-sm outline-none" />
    </div>
  );
}
