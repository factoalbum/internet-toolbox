export const MAX_FILE_SIZE = 15 * 1024 * 1024;

export function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[character] ?? character));
}

export function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, Math.min(index + chunkSize, bytes.length)));
  }
  return btoa(binary);
}

export function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

export function baseName(name: string) {
  const withoutExtension = name.replace(/\.[^/.]+$/, "");
  return withoutExtension || "file";
}

export async function sha256(bytes: Uint8Array) {
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function buildFilePackageXml(file: File, generatedAt = new Date()) {
  if (file.size > MAX_FILE_SIZE) throw new Error("FILE_TOO_LARGE");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const hash = await sha256(bytes);
  const encoded = bytesToBase64(bytes);
  const mimeType = file.type || "application/octet-stream";

  return `<?xml version="1.0" encoding="UTF-8"?>
<filePackage version="1.1">
  <file>
    <name>${escapeXml(file.name)}</name>
    <extension>${escapeXml(extensionOf(file.name))}</extension>
    <mimeType>${escapeXml(mimeType)}</mimeType>
    <size unit="bytes">${file.size}</size>
    <checksum algorithm="SHA-256">${hash}</checksum>
    <encoding>base64</encoding>
    <generatedAt>${generatedAt.toISOString()}</generatedAt>
    <content>${encoded}</content>
  </file>
</filePackage>
`;
}
