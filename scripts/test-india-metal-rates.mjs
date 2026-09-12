import assert from "node:assert/strict";
import test from "node:test";
import { parseGoodreturnsGold, parseGoodreturnsSilver, validateIndiaMetalRates } from "../lib/india-metal-rates.ts";

const goldFixture = `
  Mumbai 24K Gold /g ₹15,442 - 109 22K Gold /g ₹14,155 - 100 18K Gold /g ₹11,582 - 81
  12 September 2026 [Input]
`;
const silverFixture = `
  Mumbai Silver /g ₹245 - 10 Silver /kg ₹2,45,000 - 10,000
  12 September 2026 [Input]
`;

test("Goodreturns Mumbai gold parser extracts all purities", () => {
  assert.deepEqual(parseGoodreturnsGold(goldFixture), {
    gold: { "24k": 15442, "22k": 14155, "18k": 11582 },
    updatedAt: "12 September 2026",
  });
});

test("Goodreturns Mumbai silver parser extracts gram and kilogram rates", () => {
  assert.deepEqual(parseGoodreturnsSilver(silverFixture), {
    silver: { perGram: 245, perKg: 245000 },
    updatedAt: "12 September 2026",
  });
});

test("India metal snapshot validation rejects inconsistent data", () => {
  assert.throws(() => validateIndiaMetalRates({ source: "Goodreturns", city: "Mumbai", updatedAt: "12 September 2026", fetchedAt: "2026-09-12T00:00:00.000Z", gold: { "24k": 15442, "22k": 14155, "18k": 11582 }, silver: { perGram: 245, perKg: 240000 } }), /inconsistent/);
  assert.equal(validateIndiaMetalRates({ source: "Goodreturns", city: "Mumbai", updatedAt: "12 September 2026", fetchedAt: "2026-09-12T00:00:00.000Z", gold: { "24k": 15442, "22k": 14155, "18k": 11582 }, silver: { perGram: 245, perKg: 245000 }), true);
});
