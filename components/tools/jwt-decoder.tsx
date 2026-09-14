"use client";

import { Clipboard, Copy, KeyRound, RotateCcw } from "lucide-react";
import { useState } from "react";

const MAX_TOKEN_LENGTH = 20_000;
const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/;

function decodePart(value: string) {
  if (!BASE64URL_PATTERN.test(value) || value.length % 4 === 1) {
    throw new Error("invalid base64url");
  }

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return decodeURIComponent(
    Array.from(atob(padded))
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

function prettyPart(value: string) {
  const decoded = decodePart(value);
  try {
    return JSON.stringify(JSON.parse(decoded), null, 2);
  } catch {
    return decoded;
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"header" | "payload" | null>(null);

  function decodeToken() {
    setError("");
    setHeader("");
    setPayload("");
    setCopied(null);

    const trimmedToken = token.trim();
    if (!trimmedToken) {
      setError("Paste a JWT before decoding it.");
      return;
    }

    if (trimmedToken.length > MAX_TOKEN_LENGTH) {
      setError(`For a responsive browser experience, JWTs are limited to ${MAX_TOKEN_LENGTH.toLocaleString()} characters.`);
      return;
    }

    const parts = trimmedToken.split(".");
    if (parts.length !== 3 || parts.some((part) => !part)) {
      setError("A JWT should contain three dot-separated parts: header, payload and signature.");
      return;
    }

    try {
      setHeader(prettyPart(parts[0]));
      setPayload(prettyPart(parts[1]));
    } catch {
      setHeader("");
      setPayload("");
      setError("The token contains an invalid Base64URL-encoded header or payload.");
    }
  }

  function clear() {
    setToken("");
    setHeader("");
    setPayload("");
    setError("");
    setCopied(null);
  }

  async function copyResult(kind: "header" | "payload", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied((current) => (current === kind ? null : current)), 1800);
    } catch {
      setError("Your browser blocked clipboard access. Select the decoded text and copy it manually.");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="jwt-decoder-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f3c9] text-[#58751d]" aria-hidden="true">
              <KeyRound size={21} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.14em] text-[#6d8e25]">Developer utility</p>
              <h2 id="jwt-decoder-title" className="mt-1 text-xl font-black tracking-[-.025em] text-[#171717] sm:text-2xl">Decode a JWT safely</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/50">Inspect the header and payload of a JSON Web Token without sending it anywhere.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clear}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d0ccc2] bg-white px-3.5 text-sm font-bold text-[#171717] transition hover:border-[#171717] hover:bg-[#f7f5ef] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]"
            aria-label="Clear JWT decoder"
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      <div className="p-5 sm:p-7 md:p-8">
        <section aria-labelledby="jwt-input-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">1. Token</p>
              <h3 id="jwt-input-heading" className="mt-1 text-base font-black text-[#171717]">Paste your JWT</h3>
            </div>
            <p className="text-xs font-semibold text-black/40">Three dot-separated parts</p>
          </div>

          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgba(200,241,105,.35)]">
            <span className="text-sm font-bold">JWT token</span>
            <span id="jwt-token-help" className="mt-1 block text-xs leading-5 text-black/45">Only the header and payload are decoded. The signature is not verified.</span>
            <textarea
              id="jwt-token"
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
                if (error) setError("");
              }}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-describedby="jwt-token-help"
              aria-invalid={Boolean(error)}
              className="mt-3 min-h-44 w-full resize-y rounded-xl border border-[#bcb8ae] bg-white p-4 font-mono text-sm leading-6 text-[#171717] outline-none transition placeholder:text-black/25 focus:border-[#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
            />
          </label>

          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={clear}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d0ccc2] bg-white px-5 text-sm font-bold text-[#171717] transition hover:border-[#171717] hover:bg-[#f7f5ef] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Reset
            </button>
            <button
              type="button"
              onClick={decodeToken}
              disabled={!token.trim()}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#171717] bg-[#171717] px-5 text-sm font-bold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] disabled:cursor-not-allowed disabled:border-[#d8d4c9] disabled:bg-[#e9e6de] disabled:text-black/35 sm:flex-none sm:px-7"
            >
              <KeyRound size={16} aria-hidden="true" />
              Decode token
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-2xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">
            <p className="font-bold">We could not decode that token</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {(header || payload) && (
          <section className="mt-8" aria-labelledby="jwt-results-heading" aria-live="polite" aria-atomic="false">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[.12em] text-black/40">2. Decoded result</p>
                <h3 id="jwt-results-heading" className="mt-1 text-base font-black text-[#171717]">Header and payload</h3>
              </div>
              <p className="text-xs font-semibold text-black/40">Signature is intentionally not decoded</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="min-w-0 overflow-hidden rounded-2xl border border-[#dedbd3] bg-white" aria-labelledby="jwt-header">
                <div className="flex items-center justify-between gap-3 border-b border-[#dedbd3] bg-[#f7f5ef] px-4 py-3">
                  <div>
                    <h4 id="jwt-header" className="text-sm font-black">Header</h4>
                    <p className="mt-0.5 text-xs text-black/40">Algorithm and token metadata</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyResult("header", header)}
                    className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-[#d0ccc2] bg-white px-3 text-xs font-bold text-[#171717] transition hover:border-[#171717] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]"
                    aria-label="Copy decoded JWT header"
                  >
                    {copied === "header" ? <Clipboard size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                    {copied === "header" ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="max-h-80 min-h-40 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-xs leading-6 text-[#171717] sm:p-5 sm:text-sm">{header}</pre>
              </section>

              <section className="min-w-0 overflow-hidden rounded-2xl border border-[#dedbd3] bg-white" aria-labelledby="jwt-payload">
                <div className="flex items-center justify-between gap-3 border-b border-[#dedbd3] bg-[#f7f5ef] px-4 py-3">
                  <div>
                    <h4 id="jwt-payload" className="text-sm font-black">Payload</h4>
                    <p className="mt-0.5 text-xs text-black/40">Claims and application data</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyResult("payload", payload)}
                    className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-[#d0ccc2] bg-white px-3 text-xs font-bold text-[#171717] transition hover:border-[#171717] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]"
                    aria-label="Copy decoded JWT payload"
                  >
                    {copied === "payload" ? <Clipboard size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                    {copied === "payload" ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="max-h-80 min-h-40 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-xs leading-6 text-[#171717] sm:p-5 sm:text-sm">{payload}</pre>
              </section>
            </div>
          </section>
        )}

        {!header && !payload && !error && (
          <div className="mt-8 rounded-2xl border border-dashed border-[#d8d4c9] bg-[#faf9f6] p-5 text-center sm:p-6">
            <p className="text-sm font-bold text-[#171717]">Your decoded token will appear here</p>
            <p className="mt-1 text-sm leading-6 text-black/45">Paste a JWT above and choose Decode token to inspect its readable parts.</p>
          </div>
        )}

        <aside className="mt-7 rounded-2xl border border-[#d8d4c9] bg-[#f8f6ef] p-4 sm:p-5" aria-labelledby="jwt-security-note">
          <h3 id="jwt-security-note" className="text-sm font-black text-[#171717]">Security note</h3>
          <p className="mt-1.5 text-sm leading-6 text-black/55">Decoding does not validate a JWT. Never treat decoded claims as trusted, and avoid pasting tokens containing sensitive credentials into tools you do not trust. Processing happens locally in your browser.</p>
        </aside>
      </div>
    </div>
  );
}
