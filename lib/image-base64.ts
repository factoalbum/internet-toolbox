export const IMAGE_BASE64_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const MAX_IMAGE_BASE64_CHARS = Math.ceil((20 * 1024 * 1024 * 4) / 3) + 64;

export function parseImageBase64(value: string, fallbackMime = "image/png") {
  const raw = value.trim();
  if (!raw) return null;

  const normalized = raw.replace(/\s/g, "");
  if (normalized.length > MAX_IMAGE_BASE64_CHARS) return null;

  const match = normalized.match(/^data:(image\/(?:jpeg|png|webp|gif|svg\+xml));base64,([A-Za-z0-9+/=]+)$/i);
  const payload = match?.[2] ?? normalized;
  const mime = match?.[1]?.toLowerCase() ?? fallbackMime;
  const validPayload = /^([A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(payload);

  if (!validPayload || !IMAGE_BASE64_TYPES.has(mime)) return null;
  return { mime, payload, dataUrl: `data:${mime};base64,${payload}` };
}
