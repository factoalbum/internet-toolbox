const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;
const AI_LINE_MARKER = /^(?:[\t ]*)(?:▎|│|┃)(?:[\t ]?)(.*)$/;
const DECORATIVE_SEPARATOR = /^\s*(?:-{3,}|_{3,}|\*{3,}|={3,}|─{3,}|—{3,})\s*$/;

/**
 * Clean copied AI/browser text without rewriting its wording.
 * Intended for emails, documents, CMS editors and other plain-text destinations.
 */
export function cleanCopiedContent(value) {
  const normalized = value
    .replace(/\r\n?/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(ZERO_WIDTH, "");

  const lines = normalized.split("\n");
  const cleaned = [];
  let previousWasBlank = false;

  for (const rawLine of lines) {
    const markerMatch = rawLine.match(AI_LINE_MARKER);
    let line = markerMatch ? markerMatch[1] : rawLine;

    if (DECORATIVE_SEPARATOR.test(line)) {
      line = "";
    }

    // Remove accidental repeated spaces inside prose while preserving intentional indentation.
    line = line
      .replace(/(\S)[\t ]{2,}/g, "$1 ")
      .replace(/[\t ]+$/g, "");

    const isBlank = line.trim() === "";
    if (isBlank) {
      if (previousWasBlank) continue;
      cleaned.push("");
      previousWasBlank = true;
      continue;
    }

    cleaned.push(line);
    previousWasBlank = false;
  }

  return cleaned.join("\n").trim();
}

export const copyPasteCleanerExamples = Object.freeze([
  {
    input: "▎Hello   world\n▎\n▎This is Claude text.",
    output: "Hello world\n\nThis is Claude text.",
  },
  {
    input: "### Title\n\nText   with  extra spaces.\n---\nNext paragraph.",
    output: "### Title\n\nText with extra spaces.\n\nNext paragraph.",
  },
]);
