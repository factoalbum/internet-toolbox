"use client";

import { Braces, Copy, RotateCcw } from "lucide-react";
import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"Internet Toolbox","tools":8}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function formatJson() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  function minifyJson() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="overflow-hidden border border-[#d8d4c9] bg-[#fffdf8]">
      <div className="border-b border-[#d8d4c9] bg-[#e8e4d9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-[#c8f169]"><Braces size={20} /></span><div><p className="font-bold">Format or minify JSON</p><p className="text-sm text-black/45">Everything runs locally in your browser.</p></div></div>
          <button type="button" onClick={() => { setInput(""); setOutput(""); setError(""); }} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-black/45 transition hover:bg-white hover:text-black" aria-label="Reset JSON formatter"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2 md:p-7">
        <div><label htmlFor="json-input" className="mb-2 block text-sm font-bold">Input JSON</label><textarea id="json-input" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} className="min-h-80 w-full resize-y border border-[#cfcabf] bg-[#f8f5ed] p-4 font-mono text-sm leading-6 outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" /></div>
        <div><div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="json-output" className="text-sm font-bold">Output</label><button type="button" onClick={copyOutput} disabled={!output} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#d8d4c9] px-3 text-xs font-bold transition hover:bg-[#c8f169] disabled:cursor-not-allowed disabled:opacity-30"><Copy size={14} /> {copied ? "Copied" : "Copy"}</button></div><textarea id="json-output" value={output} readOnly spellCheck={false} placeholder="Formatted JSON will appear here..." className="min-h-80 w-full resize-y border border-[#cfcabf] bg-[#171717] p-4 font-mono text-sm leading-6 text-[#c8f169] outline-none placeholder:text-white/25" /></div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-[#d8d4c9] px-5 py-4 md:px-7">
        <button type="button" onClick={formatJson} className="min-h-11 border border-[#171717] bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black/80">Format JSON</button>
        <button type="button" onClick={minifyJson} className="min-h-11 border border-[#171717] px-5 text-sm font-bold transition hover:bg-[#c8f169]">Minify</button>
        {error && <p className="w-full text-sm font-medium text-red-700 md:w-auto" role="alert">{error}</p>}
      </div>
    </div>
  );
}
