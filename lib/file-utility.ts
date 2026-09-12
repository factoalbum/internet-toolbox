import { PDFDocument, degrees } from "pdf-lib";

export const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const MAX_PDF_PAGES = 100;

export function validatePdfMetadata(file: { type: string; size: number }) {
  if (file.type !== "application/pdf") throw new Error("Please choose a PDF file.");
  if (file.size > MAX_FILE_SIZE) throw new Error("Please choose a PDF smaller than 25 MB.");
}

async function loadPdf(file: { type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> }) {
  validatePdfMetadata(file);
  const pdf = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()));
  if (pdf.getPageCount() > MAX_PDF_PAGES) throw new Error("This PDF has more than 100 pages. Please use a smaller document.");
  return pdf;
}

export async function getPdfPageCount(file: { type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> }) {
  const pdf = await loadPdf(file);
  return pdf.getPageCount();
}

function assertPageOrder(pages: number[], pageCount: number) {
  if (!pages.length) throw new Error("The PDF has no pages to organize.");
  if (pages.some((page) => !Number.isInteger(page) || page < 0 || page >= pageCount)) throw new Error("The selected page order is invalid.");
  if (new Set(pages).size !== pages.length) throw new Error("The selected page order contains a duplicate page.");
}

export async function organizePdf(file: { type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> }, pages: number[]) {
  const pdf = await loadPdf(file);
  assertPageOrder(pages, pdf.getPageCount());
  const result = await PDFDocument.create();
  const copied = await result.copyPages(pdf, pages);
  copied.forEach((page) => result.addPage(page));
  return result.save();
}

export async function rotatePdfPage(
  file: { type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> },
  pageNumber: number,
  rotation: number,
) {
  const pdf = await loadPdf(file);
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pdf.getPageCount()) throw new Error("The selected PDF page is invalid.");
  if (![90, 180, 270].includes(rotation)) throw new Error("Rotation must be 90, 180 or 270 degrees.");
  const page = pdf.getPage(pageNumber - 1);
  page.setRotation(degrees(page.getRotation().angle + rotation));
  return pdf.save();
}
