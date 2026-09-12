"use client";

import { useRef, useState } from "react";
import { Check, Clipboard, Download, FileCode2, RotateCcw, Upload } from "lucide-react";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[character] ?? character));
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) binary += String.fromCharCode(...bytes.subarray(index, Math.min(index + chunkSize, bytes.length)));
  return btoa(binary);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

async function sha256(bytes: Uint8Array) {
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function buildXml(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const hash = await sha256(bytes);
  const encoded = bytesToBase64(bytes);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<filePackage version="1.0">\n  <file>\n    <name>${escapeXml(file.name)}</name>\n    <extension>${escapeXml(extensionOf(file.name))}</extension>\n    <mimeType>${escapeXml(file.type || "application/octet-stream")}</mimeType>\n    <size unit="bytes">${file.size}</size>\n    <sha256>${hash}</sha256>\n    <encoding>base64</encoding>\n    <generatedAt>${new Date().toISOString()}</generatedAt>\n    <content>${encoded}</content>\n  </file>\n</filePackage>\n`;
}

export default function FileToXmlGenerator() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [xml, setXml] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const focusRing = "focus:outline-none focus:ring-4 focus:ring-[#c8f169] focus:ring-offset-2 focus:ring-offset-[#fffdf8]";

  async function selectFile(selected: File) {
    setError(""); setCopied(false);
    if (selected.size > MAX_FILE_SIZE) { setError("This tool supports files up to 15 MB. Larger files create very large XML payloads because the file is Base64 encoded."); return; }
    setFile(selected); setXml(""); setBusy(true);
    try { setXml(await buildXml(selected)); } catch { setXml(""); setError("The file could not be read or converted in this browser."); } finally { setBusy(false); }
  }

  function clear() { setFile(null); setXml(""); setError(""); setCopied(false); if (inputRef.current) inputRef.current.value = ""; }

  async function copyXml() {
    if (!xml) return;
    try { await navigator.clipboard.writeText(xml); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }
    catch { setError("Copy was blocked by the browser. Select the XML and copy it manually."); }
  }

  function downloadXml() {
    if (!xml || !file) return;
    const url = URL.createObjectURL(new Blob([xml], { type: "application/xml;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${file.name.replace(/\.[^/.]+$/, "") || "file"}.xml`; document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
        <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f4cf] text-[#425515]" aria-hidden="true"><FileCode2 size={20} /></span>
            <div className="min-w-0">
              <p className="font-bold">Package a file as XML</p>
              <p className="text-sm leading-5 text-black/50">Wrap a file with metadata, checksum and Base64 content in one XML document.</p>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-7">
          {!file ? <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); const dropped = event.dataTransfer.files[0]; if (dropped) void selectFile(dropped); }} className={`flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${dragging ? "border-[#6d8e25] bg-[#edf7d5]" : "border-[#d8d4c9] bg-[#faf9f6] hover:border-[#171717] hover:bg-white"} ${focusRing}`} aria-describedby="xml-upload-help">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm"><Upload size={23} aria-hidden="true" /></span>
            <span className="mt-5 text-lg font-black">Drop a file here</span>
            <span className="mt-1 text-sm text-black/50">or choose one from your device</span>
            <span className="mt-5 rounded-lg bg-[#171717] px-5 py-3 text-sm font-bold text-white">Choose file</span>
            <span id="xml-upload-help" className="mt-4 max-w-2xl text-xs leading-5 text-black/40">Documents, images, spreadsheets, PDFs, archives and other files up to 15 MB. Conversion happens locally in your browser.</span>
          </button> : <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-[#dedbd3] bg-[#faf9f6] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e9f4cf] text-[#425515]"><FileCode2 size={19} aria-hidden="true" /></span><div className="min-w-0"><p className="truncate text-sm font-bold">{file.name}</p><p className="mt-0.5 text-xs text-black/45">{formatBytes(file.size)} · {file.type || "unknown type"}</p></div></div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copyXml} disabled={!xml || busy} className={`inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-xs font-bold transition hover:border-[#171717] disabled:opacity-35 ${focusRing}`} aria-label={copied ? "XML copied" : "Copy generated XML"}>{copied ? <Check size={14} aria-hidden="true" /> : <Clipboard size={14} aria-hidden="true" />}{copied ? "Copied" : "Copy XML"}</button>
                <button type="button" onClick={downloadXml} disabled={!xml || busy} className={`inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#171717] bg-[#171717] px-3 text-xs font-bold text-white transition hover:bg-black disabled:opacity-35 ${focusRing}`}><Download size={14} aria-hidden="true" />Download XML</button>
                <button type="button" onClick={clear} aria-label="Remove selected file" className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#d8d4c9] bg-white transition hover:border-[#171717] ${focusRing}`}><RotateCcw size={15} aria-hidden="true" /></button>
              </div>
            </div>
            {busy ? <div className="rounded-xl border border-[#d8d4c9] bg-[#faf9f6] p-5 text-sm font-semibold" role="status" aria-live="polite">Generating XML locally…</div> : <div className="overflow-hidden rounded-xl border border-[#d8d4c9] bg-[#171717]"><div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><span className="text-xs font-bold text-white/70">Generated XML</span><span className="text-[11px] text-white/40">{formatBytes(new Blob([xml]).size)}</span></div><textarea aria-label="Generated XML" value={xml} readOnly spellCheck={false} className={`min-h-[420px] w-full resize-y border-0 bg-[#171717] p-5 font-mono text-xs leading-6 text-white/85 outline-none ${focusRing}`} /></div>}
            <div className="rounded-xl border border-[#dedbd3] bg-[#faf9f6] px-4 py-3 text-xs leading-5 text-black/50"><strong className="text-black/70">What this creates:</strong> a well-formed XML package containing the filename, MIME type, size, SHA-256 checksum and the complete file encoded as Base64.</div>
          </div>}
        </div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-[#ead7d2] bg-[#fff7f5] px-4 py-3 text-sm leading-6 text-[#7b3d31]">{error}</div>}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#dedbd3] bg-white p-4"><FileCode2 size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">Any file type</p><p className="mt-1 text-xs leading-5 text-black/45">Binary files remain intact because their bytes are encoded safely.</p></div>
        <div className="rounded-xl border border-[#dedbd3] bg-white p-4"><Check size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">Checksum included</p><p className="mt-1 text-xs leading-5 text-black/45">A SHA-256 digest helps verify the packaged file was not changed.</p></div>
        <div className="rounded-xl border border-[#dedbd3] bg-white p-4"><Clipboard size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">Copy or download</p><p className="mt-1 text-xs leading-5 text-black/45">Copy the XML or save it as a .xml file for another workflow.</p></div>
      </div>
      <p className="text-xs leading-5 text-black/40">Privacy: the file is read and converted in this browser. Nothing is uploaded by this tool. This produces a generic XML package; systems that require a specific XML schema still need their required fields and structure.</p>
      <input ref={inputRef} type="file" className="sr-only" onChange={(event) => { const selected = event.target.files?.[0]; if (selected) void selectFile(selected); }} />
    </div>
  );
}
