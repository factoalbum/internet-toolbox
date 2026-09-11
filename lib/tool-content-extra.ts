export const extraToolContent = {
  "copy-paste-cleaner": {
    overview: "Clean text copied from AI assistants or formatted apps so it is ready to paste into an email, document or chat without changing the wording.",
    bestFor: "Removing Claude-style vertical copy markers, trailing spaces and excessive blank lines from copied messages.",
    tip: "Review the cleaned result before sending it, especially when spacing, indentation or quoted text is intentionally meaningful.",
    limitation: "It cleans visible copy artifacts only; it does not rewrite, fact-check or improve the wording.",
    faq: ["Does it rewrite my message?", "No. It removes detected copy markers and spacing artifacts while keeping the original wording."],
  },
  "structured-file-export": {
    overview: "Turn any supported local file into a well-formed XML package with file metadata, a SHA-256 checksum and encoded file content.",
    bestFor: "Creating a portable XML representation of PDFs, images, documents, spreadsheets and other files for a workflow that accepts a defined XML structure.",
    tip: "Use the generated XML as a package or starting point, then map its fields to the exact schema required by the system receiving it.",
    limitation: "This creates a generic XML package and does not automatically match a third-party system's proprietary XML schema or validation rules.",
    faq: ["Will this XML work with every portal?", "No. The file package is well-formed XML, but a receiving system can require its own exact elements, namespaces, field names and validation rules."],
  },
} as const;
