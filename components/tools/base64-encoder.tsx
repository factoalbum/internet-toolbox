"use client";

import { useMemo, useState } from "react";

function encode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function decode(value: string) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input) return { value: "", error: "" };
    try {
      return { value: mode === "encode" ? encode(input) : decode(input), error: "" };
    } catch {
      return { value: "", error: "That is not valid Base64 text." };
    }
  }, [input, mode]);

  async function copyResult() {
    if (!result.value) return;
    await navigator.clipboard.writeText(result.value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function swap() {
    if (!result.value || result.error) return;
    setInput(result.value);
    setMode(mode === "encode" ? "decode" : "encode");
    setCopied(false);
  }

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-7">
      <div className="flex flex-wrap gap-2 border-b border-[#d8d4c9] pb-5">
        <button type="button" onClick={() => setMode("encode")} className={`min-h-11 rounded-md px-4 text-sm font-semibold ${mode === "encode" ? "bg-[#171717] text-white" : "bg-black/5 text-black/60"}`}>Encode</button>
        <button type="button" onClick={() => setMode("decode")} className={`min-h-11 rounded-md px-4 text-sm font-semibold ${mode === "decode" ? "bg-[#171717] text-white" : "bg-black/5 text-black/60"}`}>Decode</button>
      </div>

      <div className="grid gap-5 pt-6 md:grid-cols-2">
        <div>
          <label htmlFor="base64-input" className="block text-sm font-semibold">Input</label>
          <textarea id="base64-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} placeholder={mode === "encode" ? "Hello, Internet Toolbox" : "SGVsbG8sIEludGVybmV0IFRvb2xib3g="} className="mt-2 min-h-52 w-full resize-y rounded-md border border-[#c9c5ba] bg-white p-4 font-mono text-sm leading-6 outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="base64-output" className="text-sm font-semibold">Result</label>
            <button type="button" onClick={copyResult} disabled={!result.value} className="min-h-9 rounded-md border border-[#bcb8ae] px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-35">{copied ? "Copied" : "Copy"}</button>
          </div>
          <textarea id="base64-output" value={result.value} readOnly spellCheck={false} placeholder="Your result will appear here" className="mt-2 min-h-52 w-full resize-y rounded-md border border-[#d8d4c9] bg-[#f3f0e8] p-4 font-mono text-sm leading-6 outline-none" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#d8d4c9] pt-5">
        <p className={`text-xs ${result.error ? "font-semibold text-red-700" : "text-black/45"}`} role={result.error ? "alert" : undefined}>{result.error || "Processed locally in your browser. Nothing is uploaded."}</p>
        <button type="button" onClick={swap} disabled={!result.value || !!result.error} className="min-h-11 rounded-md border border-[#171717] px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-35">Use result as input</button>
      </div>
    </div>
  );
}
