"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Clipboard, Code2, Download, FileCode2, FileText, Upload, X } from "lucide-react";

type FileKind = "markdown" | "html" | "code" | "json" | "text";

const supported = [".md", ".markdown", ".html", ".htm", ".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json", ".yaml", ".yml", ".xml", ".txt"];

function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
}

function kindOf(name: string): FileKind {
  const ext = extensionOf(name);
  if (ext === ".md" || ext === ".markdown") return "markdown";
  if (ext === ".html" || ext === ".htm") return "html";
  if (ext === ".json") return "json";
  if ([".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".yaml", ".yml", ".xml"].includes(ext)) return "code";
  return "text";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function renderMarkdown(source: string) {
  return source.split(/\r?\n/).map((line, index) => {
    const key = `${index}-${line}`;
    if (!line.trim()) return <div key={key} className="h-3" />;
    if (line.startsWith("### ")) return <h3 key={key} className="mt-4 text-lg font-bold">{line.slice(4)}</h3>;
    if (line.startsWith("## ")) return <h2 key={key} className="mt-5 text-xl font-bold">{line.slice(3)}</h2>;
    if (line.startsWith("# ")) return <h1 key={key} className="mt-2 text-2xl font-black">{line.slice(2)}</h1>;
    if (/^[-*] /.test(line)) return <li key={key} className="ml-5 list-disc leading-7">{line.slice(2)}</li>;
    if (/^\d+\. /.test(line)) return <li key={key} className="ml-5 list-decimal leading-7">{line.replace(/^\d+\. /, "")}</li>;
    if (line.startsWith("> ")) return <blockquote key={key} className="border-l-2 border-[#91c63f] pl-4 italic text-black/60">{line.slice(2)}</blockquote>;
    if (line.startsWith("```")) return null;
    return <p key={key} className="leading-7 text-black/70">{line}</p>;
  });
}

export default function DeveloperFileViewer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [tab, setTab] = useState<"preview" | "source">("preview");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const kind = file ? kindOf(file.name) : "text";
  const lineCount = content ? content.split(/\r?\n/).length : 0;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const canPreview = kind === "markdown" || kind === "html" || kind === "json";
  const displayContent = useMemo(() => {
    if (kind !== "json" || !content.trim()) return content;
    try { return JSON.stringify(JSON.parse(content), null, 2); } catch { return content; }
  }, [content, kind]);

  const readFile = (selected: File) => {
    const ext = extensionOf(selected.name);
    if (!supported.includes(ext)) {
      setError(`Unsupported file type. Try ${supported.slice(0, 8).join(", ")} or another supported text file.`);
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("This tool supports files up to 5 MB.");
      return;
    }
    setError("");
    setCopied(false);
    setFile(selected);
    setTab("preview");
    const reader = new FileReader();
    reader.onload = () => setContent(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => setError("Could not read this file in your browser.");
    reader.readAsText(selected);
  };

  const clear = () => {
    setFile(null);
    setContent("");
    setError("");
    setCopied(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(displayContent);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Copy was blocked by the browser. Select the source text and copy it manually.");
    }
  };

  const download = () => {
    if (!file) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); const dropped = event.dataTransfer.files[0]; if (dropped) readFile(dropped); }} className={`flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${dragging ? "border-[#6d8e25] bg-[#edf7d5]" : "border-[#d8d4c9] bg-[#faf9f6] hover:border-[#171717]"}`}>
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm"><Upload size={23} aria-hidden="true" /></span>
          <span className="mt-5 text-lg font-black">Drop a file here</span>
          <span className="mt-1 text-sm text-black/50">or choose a file from your device</span>
          <span className="mt-5 rounded-lg bg-[#171717] px-5 py-3 text-sm font-bold text-white">Choose file</span>
          <span className="mt-4 max-w-xl text-xs leading-5 text-black/40">Markdown, HTML, CSS, JavaScript, TypeScript, JSON, YAML, XML and text files. Up to 5 MB. Everything is read locally in your browser.</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-[#dedbd3] bg-[#faf9f6] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e9f4cf] text-[#425515]"><FileCode2 size={19} aria-hidden="true" /></span><div className="min-w-0"><p className="truncate text-sm font-bold">{file.name}</p><p className="mt-0.5 text-xs text-black/45">{formatBytes(file.size)} · {lineCount} lines · {wordCount} words</p></div></div>
            <div className="flex shrink-0 gap-2"><button type="button" onClick={copy} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-xs font-bold hover:border-[#171717]">{copied ? <Check size={14} /> : <Clipboard size={14} />}{copied ? "Copied" : "Copy"}</button><button type="button" onClick={download} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-xs font-bold hover:border-[#171717]"><Download size={14} />Save</button><button type="button" onClick={clear} aria-label="Close file" className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-[#d8d4c9] bg-white hover:border-[#171717]"><X size={15} /></button></div>
          </div>

          {canPreview && <div className="flex gap-1 rounded-lg bg-[#f0eee8] p-1" role="tablist" aria-label="File view"><button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")} className={`min-h-10 rounded-md px-4 text-xs font-bold ${tab === "preview" ? "bg-white shadow-sm" : "text-black/50"}`}>Preview</button><button type="button" role="tab" aria-selected={tab === "source"} onClick={() => setTab("source")} className={`min-h-10 rounded-md px-4 text-xs font-bold ${tab === "source" ? "bg-white shadow-sm" : "text-black/50"}`}>Source</button></div>}

          {tab === "preview" && kind === "html" && <iframe title={`Preview of ${file.name}`} sandbox="" srcDoc={content} className="h-[560px] w-full rounded-xl border border-[#d8d4c9] bg-white" />}
          {tab === "preview" && kind === "markdown" && <article className="min-h-[320px] rounded-xl border border-[#d8d4c9] bg-white p-6 md:p-8">{renderMarkdown(content)}</article>}
          {tab === "preview" && kind === "json" && <pre className="min-h-[320px] overflow-auto rounded-xl border border-[#d8d4c9] bg-[#171717] p-5 text-sm leading-6 text-white/85">{displayContent || "No JSON content"}</pre>}
          {(tab === "source" || !canPreview) && <pre className="max-h-[620px] min-h-[320px] overflow-auto rounded-xl border border-[#d8d4c9] bg-[#171717] p-5 font-mono text-[13px] leading-6 text-white/85">{displayContent}</pre>}

          <div className="flex items-start gap-3 border-t border-[#e4e1d9] pt-4 text-xs leading-5 text-black/45"><Code2 size={15} className="mt-0.5 shrink-0" aria-hidden="true" /><p>{kind === "html" ? "HTML is previewed in a sandboxed frame. Scripts are not given permission to run." : "Your file stays in this browser tab. It is not uploaded to the server."}</p></div>
        </div>
      )}
      <input ref={inputRef} type="file" accept={supported.join(",")} className="sr-only" onChange={(event) => { const selected = event.target.files?.[0]; if (selected) readFile(selected); }} />
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
      {!file && <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-[#dedbd3] bg-[#faf9f6] p-4"><FileText size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">Markdown preview</p><p className="mt-1 text-xs leading-5 text-black/45">See headings, lists and notes as a readable document.</p></div><div className="rounded-xl border border-[#dedbd3] bg-[#faf9f6] p-4"><Code2 size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">Code viewer</p><p className="mt-1 text-xs leading-5 text-black/45">Open source files without installing an editor.</p></div><div className="rounded-xl border border-[#dedbd3] bg-[#faf9f6] p-4"><FileCode2 size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">HTML preview</p><p className="mt-1 text-xs leading-5 text-black/45">See what a standalone HTML file renders like.</p></div></div>}
    </div>
  );
}
