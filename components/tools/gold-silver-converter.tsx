"use client";

import { useEffect, useMemo, useState } from "react";

const OUNCE_TO_GRAMS = 31.1034768;
type MetalResponse = { price?: number; symbol?: string; name?: string; updatedAt?: string };
type FxResponse = { result: string; rates?: Record<string, number>; time_last_update_utc?: string };

function money(value: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value); }

export default function GoldSilverConverter() {
  const [metal, setMetal] = useState<"XAU" | "XAG">("XAU");
  const [purity, setPurity] = useState("24");
  const [weight, setWeight] = useState("1");
  const [unit, setUnit] = useState("g");
  const [usdInr, setUsdInr] = useState<number | null>(null);
  const [spotUsd, setSpotUsd] = useState<number | null>(null);
  const [updated, setUpdated] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadRates() {
    setLoading(true); setError("");
    try {
      const [metalResponse, fxResponse] = await Promise.all([
        fetch(`https://api.gold-api.com/price/${metal}`, { cache: "no-store" }),
        fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" }),
      ]);
      if (!metalResponse.ok || !fxResponse.ok) throw new Error("Rate service unavailable");
      const metalData = (await metalResponse.json()) as MetalResponse;
      const fxData = (await fxResponse.json()) as FxResponse;
      const price = Number(metalData.price);
      const inr = Number(fxData.rates?.INR);
      if (!Number.isFinite(price) || !Number.isFinite(inr)) throw new Error("Invalid market data");
      setSpotUsd(price); setUsdInr(inr); setUpdated(metalData.updatedAt || fxData.time_last_update_utc || "");
    } catch { setError("Live metal rates could not be loaded. Please try again."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadRates(); }, [metal]);

  const perGram = useMemo(() => {
    if (spotUsd === null || usdInr === null) return null;
    const pureGram = spotUsd * usdInr / OUNCE_TO_GRAMS;
    return metal === "XAU" ? pureGram * (Number(purity) / 24) : pureGram;
  }, [metal, purity, spotUsd, usdInr]);

  const result = useMemo(() => {
    const amount = Number(weight);
    if (perGram === null || !Number.isFinite(amount) || amount < 0) return null;
    const grams = unit === "kg" ? amount * 1000 : unit === "10g" ? amount * 10 : amount;
    return perGram * grams;
  }, [perGram, weight, unit]);

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label htmlFor="metal" className="block text-sm font-bold">Metal</label><select id="metal" value={metal} onChange={e => setMetal(e.target.value as "XAU" | "XAG")} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]"><option value="XAU">Gold (XAU)</option><option value="XAG">Silver (XAG)</option></select></div>
      {metal === "XAU" && <div><label htmlFor="purity" className="block text-sm font-bold">Gold purity</label><select id="purity" value={purity} onChange={e => setPurity(e.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]"><option value="24">24K — 999</option><option value="22">22K — 916</option><option value="18">18K — 750</option></select></div>}
    </div>
    <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px]"><div><label htmlFor="metal-weight" className="block text-sm font-bold">Weight</label><input id="metal-weight" value={weight} onChange={e => setWeight(e.target.value)} inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-base outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" /></div><div><label htmlFor="metal-unit" className="block text-sm font-bold">Unit</label><select id="metal-unit" value={unit} onChange={e => setUnit(e.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]"><option value="g">Gram</option><option value="10g">10 grams</option><option value="kg">Kilogram</option></select></div></div>
    <div className="mt-5 border border-[#171717] bg-[#c8f169] p-5" aria-live="polite"><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Indicative value</p><p className="mt-2 break-all text-3xl font-black">{loading ? "Loading…" : result === null ? "—" : money(result)}</p>{perGram !== null && <p className="mt-2 text-sm text-black/60">{money(perGram)} per gram · {money(spotUsd! * usdInr!)} per troy ounce at spot</p>}</div>
    {error && <p role="alert" className="mt-4 border border-red-700/30 bg-red-50 p-3 text-sm font-semibold text-red-800">{error} <button type="button" onClick={() => void loadRates()} className="ml-1 underline">Retry</button></p>}
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-black/45"><p>Live international spot price converted to INR.</p><button type="button" onClick={() => void loadRates()} disabled={loading} className="font-bold underline disabled:opacity-40">Refresh rates</button></div>
    {updated && <p className="mt-2 text-xs text-black/40">Latest source update: {updated}.</p>}
    <p className="mt-2 text-xs leading-5 text-black/40">This is a spot-price estimate, not a jeweller's final selling price. Indian jewellery prices can include GST, making charges, wastage, local premiums and dealer spreads. Gold API provides the spot metal price; INR conversion uses daily ExchangeRate-API data.</p>
  </div>;
}
