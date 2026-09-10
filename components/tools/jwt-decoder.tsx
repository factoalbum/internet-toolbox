"use client";

import { useState } from "react";

function decodePart(value: string) {
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

  function decodeToken() {
    setError("");
    setHeader("");
    setPayload("");

    const parts = token.trim().split(".");
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
  }

  return (
    <div className="space-y-5">
      <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-6">
        <label htmlFor="jwt-token" className="text-sm font-bold">JWT token</label>
        <textarea
          id="jwt-token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          spellCheck={false}
          className="mt-2 min-h-36 w-full resize-y border border-[#bcb8ae] bg-white px-3 py-3 font-mono text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]"
          aria-describedby="jwt-privacy-note"
        />
        <p id="jwt-privacy-note" className="mt-2 text-xs leading-5 text-black/50">Decoding happens in your browser. This tool does not verify the signature or prove that a token is authentic.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={decodeToken} className="min-h-11 bg-[#171717] px-5 text-sm font-bold text-white hover:bg-black">Decode token</button>
          <button type="button" onClick={clear} className="min-h-11 border border-[#bcb8ae] px-5 text-sm font-bold hover:border-[#171717]">Clear</button>
        </div>
      </div>

      {error && <div role="alert" className="border border-[#b42318]/30 bg-[#fff5f3] p-4 text-sm leading-6 text-[#7a1b13]">{error}</div>}

      {(header || payload) && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="border border-[#d8d4c9] bg-[#fffdf8]" aria-labelledby="jwt-header">
            <div className="border-b border-[#d8d4c9] px-5 py-4"><h2 id="jwt-header" className="font-bold">Header</h2></div>
            <pre className="min-h-40 overflow-x-auto whitespace-pre-wrap break-words p-5 font-mono text-sm leading-6">{header}</pre>
          </section>
          <section className="border border-[#d8d4c9] bg-[#fffdf8]" aria-labelledby="jwt-payload">
            <div className="border-b border-[#d8d4c9] px-5 py-4"><h2 id="jwt-payload" className="font-bold">Payload</h2></div>
            <pre className="min-h-40 overflow-x-auto whitespace-pre-wrap break-words p-5 font-mono text-sm leading-6">{payload}</pre>
          </section>
        </div>
      )}

      <div className="border border-[#d8d4c9] bg-[#f8f6ef] p-5 text-sm leading-6 text-black/60">
        <strong className="text-[#171717]">Security note:</strong> A decoded JWT payload is not proof that its claims are trusted. Never paste a token containing sensitive credentials into a tool you do not trust, and do not treat decoded data as verified.
      </div>
    </div>
  );
}
