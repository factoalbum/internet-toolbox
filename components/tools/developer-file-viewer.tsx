"use client";

import { useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Check, Clipboard, Code2, Download, FileCode2, FileText, Upload, X } from "lucide-react";

type FileKind = "markdown" | "html" | "json" | "code" | "text";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const supported = [".md", ".markdown", ".html", ".htm", ".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".py", ".java", ".go", ".rs", ".php", ".sql", ".graphql", ".gql", ".sh", ".bash", ".env", ".toml", ".ini", ".conf", ".vue", ".svelte", ".astro", ".json", ".yaml", ".yml", ".xml", ".svg", ".txt", ".csv"];

function extensionOf(name: string) { const dot = name.lastIndexOf("."); return dot === -1 ? "" : name.slice(dot).toLowerCase(); }
function kindOf(name: string): FileKind { const ext = extensionOf(name); if ([".md", ".markdown"].includes(ext)) return "markdown"; if ([".html", ".htm"].includes(ext)) return "html"; if (ext === ".json") return "json"; if ([".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".py", ".java", ".go", ".rs", ".php", ".sql", ".graphql", ".gql", ".sh", ".bash", ".env", ".toml", ".ini", ".conf", ".vue", ".svelte", ".astro", ".yaml", ".yml", ".xml", ".svg"].includes(ext)) return "code"; return "text"; }
function formatBytes(bytes: number) { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }

function inlineMarkdown(value: string): ReactNode[] {
  const parts = value.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^\)]+\))/g);
  return parts.map((part, index) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(part)) return <code key={index} className="rounded bg-[#f0eee8] px-1.5 py-0.5 font-mono text-[0.9em]">{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">{link[1]}</a>;
    return part;
  });
}

function renderMarkdown(source: string): ReactNode[] {
  const lines = source.split(/\r?\n/);
  const output: ReactNode[] = [];
  let inCode = false;
  let code: string[] = [];
  let codeIndex = 0;
  for (const [index, line] of lines.entries()) {
    const key = `${index}-${line}`;
    if (line.trim().startsWith("```")) {
      if (inCode) output.push(<pre key={`code-${codeIndex++}`} className="my-4 overflow-auto rounded-lg bg-[#171717] p-4 font-mono text-xs leading-6 text-white/85">{code.join("\n")}</pre>);
      code = [];
      inCode = !inCode;
      continue;
    }
    if (inCode) { code.push(line); continue; }
    if (!line.trim()) { output.push(<div key={key} className="h-3" aria-hidden="true" />); continue; }
    if (line.startsWith("### ")) { output.push(<h3 key={key} className="mt-5 text-lg font-bold">{inlineMarkdown(line.slice(4))}</h3>); continue; }
    if (line.startsWith("## ")) { output.push(<h2 key={key} className="mt-6 text-xl font-bold">{inlineMarkdown(line.slice(3))}</h2>); continue; }
    if (line.startsWith("# ")) { output.push(<h1 key={key} className="mt-1 text-2xl font-black">{inlineMarkdown(line.slice(2))}</h1>); continue; }
    if (/^[-*] /.test(line)) { output.push(<li key={key} className="ml-5 list-disc leading-7">{inlineMarkdown(line.slice(2))}</li>); continue; }
    if (/^\d+\. /.test(line)) { output.push(<li key={key} className="ml-5 list-decimal leading-7">{inlineMarkdown(line.replace(/^\d+\. /, ""))}</li>); continue; }
    if (line.startsWith("> ")) { output.push(<blockquote key={key} className="border-l-2 border-[#91c63f] pl-4 italic text-black/60">{inlineMarkdown(line.slice(2))}</blockquote>); continue; }
    output.push(<p key={key} className="leading-7 text-black/70">{inlineMarkdown(line)}</p>);
  }
  if (inCode && code.length) output.push(<pre key="trailing-code" className="my-4 overflow-auto rounded-lg bg-[#171717] p-4 font-mono text-xs leading-6 text-white/85">{code.join("\n")}</pre>);
  return output;
}

export default function DeveloperFileViewer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [tab, setTab] = useState<"preview" | "source">("preview");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [reading, setReading] = useState(false);

  const kind = file ? kindOf(file.name) : "text";
  const canPreview = kind === "markdown" || kind === "html" || kind === "json";
  const lineCount = useMemo(() => content ? content.split(/\r?\n/).length : 0, [content]);
  const wordCount = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content]);
  const displayContent = useMemo(() => { if (kind !== "json" || !content.trim()) return content; try { return JSON.stringify(JSON.parse(content), null, 2); } catch { return content; } }, [content, kind]);
  const markdownPreview = useMemo(() => kind === "markdown" && content ? renderMarkdown(content) : null, [content, kind]);

  const readFile = (selected: File) => {
    const ext = extensionOf(selected.name);
    if (!supported.includes(ext)) { setError("Unsupported file type. Try a common text/code file such as .md, .html, .js, .ts, .py, .json or .yaml."); return; }
    if (selected.size > MAX_FILE_SIZE) { setError("This tool supports files up to 5 MB."); return; }
    setError(""); setCopied(false); setFile(selected); setTab("preview"); setContent(""); setReading(true);
    const reader = new FileReader();
    reader.onload = () => { setContent(typeof reader.result === "string" ? reader.result : ""); setReading(false); };
    reader.onerror = () => { setReading(false); setError("Could not read this file in your browser."); };
    reader.readAsText(selected);
  };
  const onInput = (event: ChangeEvent<HTMLInputElement>) => { const selected = event.target.files?.[0]; if (selected) readFile(selected); };
  const clear = () => { setFile(null); setContent(""); setError(""); setCopied(false); setReading(false); if (inputRef.current) inputRef.current.value = ""; };
  const copy = async () => { try { await navigator.clipboard.writeText(content); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch { setError("Copy was blocked by the browser. Select the source text and copy it manually."); } };
  const download = () => { if (!file) return; const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = file.name; document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 0); };

  return <div className="space-y-5">
    {!file ? <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); const dropped = event.dataTransfer.files[0]; if (dropped) readFile(dropped); }} className={`flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${dragging ? "border-[#6d8e25] bg-[#edf7d5]" : "border-[#d8d4c9] bg-[#faf9f6] hover:border-[#171717]"}`}>
      <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm"><Upload size={23} aria-hidden="true" /></span><span className="mt-5 text-lg font-black">Drop a developer file here</span><span className="mt-1 text-sm text-black/50">or choose one from your device</span><span className="mt-5 rounded-lg bg-[#171717] px-5 py-3 text-sm font-bold text-white">Choose file</span><span className="mt-4 max-w-2xl text-xs leading-5 text-black/40">README, HTML, CSS, JavaScript, TypeScript, Python, Java, Go, Rust, PHP, SQL, GraphQL, Shell, JSON, YAML, XML, SVG, config files and more. Up to 5 MB. Everything stays in your browser.</span>
    </button> : <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-[#dedbd3] bg-[#faf9f6] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e9f4cf] text-[#425515]"><FileCode2 size={19} aria-hidden="true" /></span><div className="min-w-0"><p className="truncate text-sm font-bold">{file.name}</p><p className="mt-0.5 text-xs text-black/45">{formatBytes(file.size)} · {lineCount} lines · {wordCount} words</p></div></div><div className="flex shrink-0 gap-2"><button type="button" onClick={copy} disabled={reading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-xs font-bold hover:border-[#171717] disabled:opacity-40">{copied ? <Check size={14} /> : <Clipboard size={14} />}{copied ? "Copied" : "Copy"}</button><button type="button" onClick={download} disabled={reading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-xs font-bold hover:border-[#171717] disabled:opacity-40"><Download size={14} />Save</button><button type="button" onClick={clear} aria-label="Close file" className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-[#d8d4c9] bg-white hover:border-[#171717]"><X size={15} /></button></div></div>
      {canPreview && <div className="flex gap-1 rounded-lg bg-[#f0eee8] p-1" role="tablist" aria-label="File view"><button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")} className={`min-h-10 rounded-md px-4 text-xs font-bold ${tab === "preview" ? "bg-white shadow-sm" : "text-black/50"}`}>Preview</button><button type="button" role="tab" aria-selected={tab === "source"} onClick={() => setTab("source")} className={`min-h-10 rounded-md px-4 text-xs font-bold ${tab === "source" ? "bg-white shadow-sm" : "text-black/50"}`}>Source</button></div>}
      {reading && <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-[#d8d4c9] bg-white"><p className="text-sm font-semibold text-black/45">Reading file...</p></div>}
      {!reading && tab === "preview" && kind === "html" && <div className="min-h-[70vh] overflow-hidden rounded-xl border border-[#d8d4c9] bg-white"><iframe title={`Preview of ${file.name}`} sandbox="" srcDoc={content} className="block h-[70vh] min-h-[680px] w-full border-0 bg-white" /></div>}
      {!reading && tab === "preview" && kind === "markdown" && <article className="min-h-[320px] rounded-xl border border-[#d8d4c9] bg-white p-6 md:p-8">{markdownPreview}</article>}
      {!reading && tab === "preview" && kind === "json" && <pre className="min-h-[320px] overflow-auto rounded-xl border border-[#d8d4c9] bg-[#171717] p-5 font-mono text-sm leading-6 text-white/85">{displayContent || "No JSON content"}</pre>}
      {!reading && (tab === "source" || !canPreview) && <pre className="max-h-[620px] min-h-[320px] overflow-auto rounded-xl border border-[#d8d4c9] bg-[#171717] p-5 font-mono text-[13px] leading-6 text-white/85">{displayContent}</pre>}
      <div className="flex items-start gap-3 border-t border-[#e4e1d9] pt-4 text-xs leading-5 text-black/45"><Code2 size={15} className="mt-0.5 shrink-0" aria-hidden="true" /><p>{kind === "html" ? "HTML is previewed in a sandboxed frame. Scripts are not given permission to run." : "Your file stays in this browser tab. It is not uploaded to the server."}</p></div>
    </div>}
    <input ref={inputRef} type="file" accept={supported.join(",")} className="sr-only" onChange={onInput} />
    {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
    {!file && <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-[#dedbd3] bg-white p-4"><FileText size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">README preview</p><p className="mt-1 text-xs leading-5 text-black/45">Turn Markdown into a readable document.</p></div><div className="rounded-xl border border-[#dedbd3] bg-white p-4"><Code2 size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">Any source file</p><p className="mt-1 text-xs leading-5 text-black/45">Read common programming and config files quickly.</p></div><div className="rounded-xl border border-[#dedbd3] bg-white p-4"><FileCode2 size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">HTML preview</p><p className="mt-1 text-xs leading-5 text-black/45">Preview a standalone HTML file safely.</p></div></div>}
  </div>;
}
