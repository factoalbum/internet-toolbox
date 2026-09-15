import fs from "node:fs/promises";
import { parseGoodreturnsGold, parseGoodreturnsSilver, validateIndiaMetalRates } from "../lib/india-metal-rates.ts";

const GOLD_URL = "https://www.goodreturns.in/gold-rates/mumbai.html";
const SILVER_URL = "https://www.goodreturns.in/silver-rates/mumbai.html";
const OUTPUT = new URL("../public/data/india-metal-rates.json", import.meta.url);

async function fetchHtml(url) {
  const headers = {
    accept: "text/html,application/xhtml+xml",
    "accept-language": "en-IN,en;q=0.9",
    "cache-control": "no-cache",
    "user-agent": "Mozilla/5.0 (compatible; InternetToolboxRateUpdater/1.0; +https://factoalbum.github.io/internet-toolbox/)",
  };
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new Error(`Goodreturns request failed: ${response.status} ${url}`);
      return response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  throw lastError;
}

export async function fetchIndiaMetalRates() {
  const [goldHtml, silverHtml] = await Promise.all([fetchHtml(GOLD_URL), fetchHtml(SILVER_URL)]);
  const gold = parseGoodreturnsGold(goldHtml);
  const silver = parseGoodreturnsSilver(silverHtml);
  if (!gold.updatedAt || !silver.updatedAt || gold.updatedAt !== silver.updatedAt) throw new Error(`Goodreturns date mismatch: ${gold.updatedAt} vs ${silver.updatedAt}`);
  const snapshot = {
    source: "Goodreturns",
    city: "Mumbai",
    updatedAt: gold.updatedAt,
    fetchedAt: new Date().toISOString(),
    gold: gold.gold,
    silver: silver.silver,
  };
  validateIndiaMetalRates(snapshot);
  return snapshot;
}

async function main() {
  const previous = await fs.readFile(OUTPUT, "utf8").catch(() => "");
  try {
    const snapshot = await fetchIndiaMetalRates();
    const next = `${JSON.stringify(snapshot, null, 2)}\n`;
    if (previous !== next) {
      await fs.mkdir(new URL("../public/data/", import.meta.url), { recursive: true });
      await fs.writeFile(OUTPUT, next, "utf8");
      console.log(`Updated India metal rates for ${snapshot.updatedAt}.`);
    } else {
      console.log("India metal rate snapshot is unchanged.");
    }
  } catch (error) {
    if (!previous) throw error;
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Unable to refresh India metal rates; keeping the last known snapshot. ${message}`);
    console.warn("The committed snapshot remains available to the site and retains its original fetchedAt timestamp.");
  }
}

if (process.argv[1] && process.argv[1].endsWith("update-india-metal-rates.mjs")) {
  await main();
}
