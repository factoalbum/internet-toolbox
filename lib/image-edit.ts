export type SupportedImageMime = "image/jpeg" | "image/png" | "image/webp";
export type ImageEditVariant = "image-resizer" | "image-cropper" | "image-rotate-flip" | "image-format-converter";

const SUPPORTED_MIMES = new Set<SupportedImageMime>(["image/jpeg", "image/png", "image/webp"]);

export function outputMimeForEdit(
  variant: ImageEditVariant,
  sourceType: string,
  requestedFormat: string,
): SupportedImageMime {
  if (variant === "image-format-converter" && SUPPORTED_MIMES.has(requestedFormat as SupportedImageMime)) {
    return requestedFormat as SupportedImageMime;
  }

  if (SUPPORTED_MIMES.has(sourceType as SupportedImageMime)) {
    return sourceType as SupportedImageMime;
  }

  return "image/jpeg";
}

export function imageExtension(mime: SupportedImageMime): "jpg" | "png" | "webp" {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}
