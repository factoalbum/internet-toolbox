"use client";

import { useRef, useState } from "react";
import { Check, Clipboard, Download, FileCode2, RotateCcw, ShieldCheck, Upload } from "lucide-react";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[character] ?? character));
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, Math.min(index + chunkSize, bytes.length)));
  }
  return btoa(binary);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

function baseName(name: string) {
  const withoutExtension = name.replace(/\.[^/.]+$/, "");
  return withoutExtension || "file";
}

async function sha256(bytes: Uint8Array) {
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function buildXml(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const hash = await sha256(bytes);
  const encoded = bytesToBase64(bytes);
  const mimeType = file.type || "application/octet-stream";
  const generatedAt = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<filePackage version="1.1">
  <file>
    <name>${escapeXml(file.name)}</name>
    <extension>${escapeXml(extensionOf(file.name))}</extension>
    <mimeType>${escapeXml(mimeType)}</mimeType>
    <size unit="bytes">${file.size}</size>
    <checksum algorithm="SHA-256">${hash}</checksum>
    <encoding>base64</encoding>
    <generatedAt>${generatedAt}</generatedAt>
    <content>${encoded}</content>
  </file>
</filePackage>
`;
}

function isWellFormedXml(xml: string) {
  if (typeof DOMParser === "undefined") return true;
  const document = new DOMParser().parseFromString(xml, "application/xml");
  return !document.querySelector("parsererror");
}

export default function StructuredExport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [xml, setXml] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function selectFile(selected: File) {
    setError("");
    setCopied(false);
    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      setXml("");
      setError("This tool supports files up to 15 MB. Base64 makes the resulting XML larger than the original file.");
      return;
    }

    setFile(selected);
    setXml("");
    setBusy(true);
    try {
      const generated = await buildXml(selected);
      if (!isWellFormedXml(generated)) throw new Error("Generated XML is not well formed");
      setXml(generated);
    } catch {
      setXml("");
      setError("The file could not be read or converted in this browser.");
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setFile(null);
    setXml("");
    setError("");
    setCopied(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function copyXml() {
    if (!xml) return;
    try {
      await navigator.clipboard.writeText(xml);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
      return;
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = xml;
      fallback.setAttribute("readonly", "true");
      fallback.style.position = "fixed";
      fallback.style.left = "-9999px";
      document.body.appendChild(fallback);
      fallback.select();
      try {
        if (!document.execCommand("copy")) throw new Error("Copy failed");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      } catch {
        setError("Copy was blocked by the browser. Select the XML and copy it manually.");
      } finally {
        fallback.remove();
      }
    }
  }

  function downloadXml() {
    if (!xml || !file) return;
    const url = URL.createObjectURL(new Blob([xml], { type: "application/xml;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${baseName(file.name)}.xml`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-5">
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); const dropped = event.dataTransfer.files[0]; if (dropped) void selectFile(dropped); }}
          className={`flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${dragging ? "border-[#6d8e25] bg-[#edf7d5]" : "border-[#d8d4c9] bg-[#faf9f6] hover:border-[#171717]"}`}
        >
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm"><Upload size={23} aria-hidden="true" /></span>
          <span className="mt-5 text-lg font-black">Drop any file here</span>
          <span className="mt-1 text-sm text-black/50">or choose one from your device</span>
          <span className="mt-5 rounded-lg bg-[#171717] px-5 py-3 text-sm font-bold text-white">Choose file</span>
          <span className="mt-4 max-w-2xl text-xs leading-5 text-black/40">PDFs, images, spreadsheets, documents, archives and other files up to 15 MB. Processing stays in this browser.</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-[#dedbd3] bg-[#faf9f6] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e9f4cf] text-[#425515]"><FileCode2 size={19} aria-hidden="true" /></span>
              <div className="min-w-0"><p className="truncate text-sm font-bold">{file.name}</p><p className="mt-0.5 text-xs text-black/45">{formatBytes(file.size)} · {file.type || "unknown type"}</p></div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button type="button" onClick={copyXml} disabled={!xml || busy} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-xs font-bold disabled:opacity-35 hover:border-[#171717]">{copied ? <Check size={14} aria-hidden="true" /> : <Clipboard size={14} aria-hidden="true" />}{copied ? "Copied" : "Copy XML"}</button>
              <button type="button" onClick={downloadXml} disabled={!xml || busy} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d8d4c9] bg-white px-3 text-xs font-bold disabled:opacity-35 hover:border-[#171717]"><Download size={14} aria-hidden="true" />Download XML</button>
              <button type="button" onClick={clear} aria-label="Remove file" className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-[#d8d4c9] bg-white hover:border-[#171717]"><RotateCcw size={15} aria-hidden="true" /></button>
            </div>
          </div>

          {busy ? (
            <div className="rounded-xl border border-[#d8d4c9] bg-[#faf9f6] p-5 text-sm font-semibold" role="status">Reading file, calculating SHA-256 and generating XML locally...</div>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-[#d8e6bd] bg-[#f5faea] px-4 py-3 text-sm font-semibold text-[#405217]" role="status"><ShieldCheck size={17} aria-hidden="true" />XML generated and validated as well-formed.</div>
              <textarea aria-label="Generated XML" value={xml} readOnly className="min-h-[480px] w-full resize-y rounded-xl border border-[#d8d4c9] bg-[#171717] p-5 font-mono text-xs leading-6 text-white/85 outline-none focus:ring-4 focus:ring-[#c8f169]/40" />
            </>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#dedbd3] bg-white p-4"><FileCode2 size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">Complete file preserved</p><p className="mt-1 text-xs leading-5 text-black/45">The original bytes are Base64 encoded, so binary files can be carried inside the XML.</p></div>
            <div className="rounded-xl border border-[#dedbd3] bg-white p-4"><ShieldCheck size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">SHA-256 checksum</p><p className="mt-1 text-xs leading-5 text-black/45">Use the checksum to verify that the packaged bytes have not changed.</p></div>
            <div className="rounded-xl border border-[#dedbd3] bg-white p-4"><Clipboard size={17} aria-hidden="true" /><p className="mt-3 text-sm font-bold">Ready to use</p><p className="mt-1 text-xs leading-5 text-black/45">Copy the XML or download it as a .xml file for another workflow.</p></div>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" className="sr-only" onChange={(event) => { const selected = event.target.files?.[0]; if (selected) void selectFile(selected); }} />
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
      <div className="rounded-xl border border-[#dedbd3] bg-[#faf9f6] px-4 py-3 text-xs leading-5 text-black/50"><strong className="text-black/70">Important:</strong> this creates a generic, well-formed XML package. It is not automatically an ICEGATE/CBIC submission file. A government or business system that requires a specific XML schema still needs its exact field names, namespaces, validation rules and required data.</div>
      <p className="text-xs leading-5 text-black/40">Privacy: your file is processed locally in this browser and is not uploaded by this tool.</p>
    </div>
  );
}
