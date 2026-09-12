export type IndiaMetalRates = {
  source: string;
  city: string;
  updatedAt: string;
  fetchedAt: string;
  gold: { "24k": number; "22k": number; "18k": number };
  silver: { perGram: number; perKg: number };
};

function normalizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#8377;|&#x20b9;/gi, "₹")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function amount(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function updatedDate(text: string) {
  return text.match(/(\d{1,2}\s+[A-Za-z]+\s+\d{4})\s+\[Input\]/)?.[1] ?? null;
}

export function parseGoodreturnsGold(html: string) {
  const text = normalizeHtml(html);
  const match = text.match(/Mumbai\s+24K\s+Gold\s+\/g\s+₹([\d,.]+).*?22K\s+Gold\s+\/g\s+₹([\d,.]+).*?18K\s+Gold\s+\/g\s+₹([\d,.]+)/i);
  if (!match) throw new Error("Could not parse Mumbai gold rates from Goodreturns");
  const gold = { "24k": amount(match[1]), "22k": amount(match[2]), "18k": amount(match[3]) };
  if (!gold["24k"] || !gold["22k"] || !gold["18k"]) throw new Error("Goodreturns gold rates were invalid");
  return { gold, updatedAt: updatedDate(text) };
}

export function parseGoodreturnsSilver(html: string) {
  const text = normalizeHtml(html);
  const match = text.match(/Mumbai\s+Silver\s+\/g\s+₹([\d,.]+).*?Silver\s+\/kg\s+₹([\d,.]+)/i);
  if (!match) throw new Error("Could not parse Mumbai silver rates from Goodreturns");
  const perGram = amount(match[1]);
  const perKg = amount(match[2]);
  if (!perGram || !perKg) throw new Error("Goodreturns silver rates were invalid");
  return { silver: { perGram, perKg }, updatedAt: updatedDate(text) };
}

export function validateIndiaMetalRates(value: IndiaMetalRates) {
  const values = [value.gold["24k"], value.gold["22k"], value.gold["18k"], value.silver.perGram, value.silver.perKg];
  if (value.source !== "Goodreturns" || value.city !== "Mumbai" || !value.updatedAt || !value.fetchedAt || values.some((item) => !Number.isFinite(item) || item <= 0)) {
    throw new Error("Invalid India metal rate snapshot");
  }
  if (Math.abs(value.silver.perKg - value.silver.perGram * 1000) > 1) throw new Error("Silver gram/kg values are inconsistent");
  return true;
}
