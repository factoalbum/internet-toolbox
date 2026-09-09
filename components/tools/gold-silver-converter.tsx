"use client";

import { useEffect, useMemo, useState } from "react";

const OUNCE_TO_GRAMS = 31.1034768;
const TOLA_TO_GRAMS = 11.6638125;
type Metal = "XAU" | "XAG";
type Unit = "mg" | "g" | "10g" | "tola" | "kg";
type MetalResponse = { price?: number; symbol?: string; name?: string; updatedAt?: string };
type FxResponse = { result: string; rates?: Record<string, number>; time_last_update_utc?: string };

function money(value: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value); }
function gramsFor(amount: number, unit: Unit) { return unit === "mg" ? amount / 1000 : unit === "10g" ? amount * 10 : unit === "tola" ? amount * TOLA_TO_GRAMS : unit === "kg" ? amount * 1000 : amount; }

export default function GoldSilverConverter() {
  const [metal, setMetal] = useState<Metal>("XAU");
  const [purity, setPurity] = useState("24");
  const [weight, setWeight] = useState("1");
  const [unit, setUnit] = useState<Unit>("g");
  const [usdInr, setUsdInr] = useState<number | null>(null);
  const [goldUsd, setGoldUsd] = useState<number | null>(null);
  const [silverUsd, setSilverUsd] = useState<number | null>(null);
  const [updated, setUpdated] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadRates() {
    setLoading(true); setError("");
    try {
      const [goldResponse, silverResponse, fxResponse] = await Promise.all([
        fetch("https://api.gold-api.com/price/XAU", { cache: "no-store" }),
        fetch("https://api.gold-api.com/price/XAG", { cache: "no-store" }),
        fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" }),
      ]);
      if (!goldResponse.ok || !silverResponse.ok || !fxResponse.ok) throw new Error("Rate service unavailable");
      const [goldData, silverData, fxData] = await Promise.all([
        goldResponse.json() as Promise<MetalResponse>,
        silverResponse.json() as Promise<MetalResponse>,
        fxResponse.json() as Promise<FxResponse>,
      ]);
      const gold = Number(goldData.price);
      const silver = Number(silverData.price);
      const inr = Number(fxData.rates?.INR);
      if (![gold, silver, inr].every((value) => Number.isFinite(value) && value > 0)) throw new Error("Invalid market data");
      setGoldUsd(gold); setSilverUsd(silver); setUsdInr(inr);
      setUpdated(goldData.updatedAt || silverData.updatedAt || fxData.time_last_update_utc || "");
    } catch { setError("Live gold and silver rates could not be loaded. Please try again."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadRates(); }, []);

  const pureGoldPerGram = goldUsd !== null && usdInr !== null ? goldUsd * usdInr / OUNCE_TO_GRAMS : null;
  const silverPerGram = silverUsd !== null && usdInr !== null ? silverUsd * usdInr / OUNCE_TO_GRAMS : null;
  const selectedPerGram = (metal === "XAU" ? pureGoldPerGram : silverPerGram);
  const perGram = selectedPerGram === null ? null : metal === "XAU" ? selectedPerGram * (Number(purity) / 24) : selectedPerGram;

  const result = useMemo(() => {
    const amount = Number(weight);
    if (perGram === null || !Number.isFinite(amount) || amount < 0) return null;
    return perGram * gramsFor(amount, unit);
  }, [perGram, weight, unit]);

  const snapshot = useMemo(() => pureGoldPerGram === null || silverPerGram === null ? null : ({
    gold24: pureGoldPerGram,
    gold22: pureGoldPerGram * 22 / 24,
    gold18: pureGoldPerGram * 18 / 24,
    silver: silverPerGram,
  }), [pureGoldPerGram, silverPerGram]);

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label htmlFor="metal" className="block text-sm font-bold">Commodity</label><select id="metal" value={metal} onChange={e => setMetal(e.target.value as Metal)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]"><option value="XAU">Gold</option><option value="XAG">Silver</option></select></div>
      {metal === "XAU" && <div><label htmlFor="purity" className="block text-sm font-bold">Gold purity</label><select id="purity" value={purity} onChange={e => setPurity(e.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]"><option value="24">24K — 999</option><option value="22">22K — 916</option><option value="18">18K — 750</option></select></div>}
    </div>
    <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px]"><div><label htmlFor="metal-weight" className="block text-sm font-bold">How much?</label><input id="metal-weight" value={weight} onChange={e => setWeight(e.target.value)} inputMode="decimal" min="0" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-base outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" placeholder="e.g. 10" /></div><div><label htmlFor="metal-unit" className="block text-sm font-bold">Unit</label><select id="metal-unit" value={unit} onChange={e => setUnit(e.target.value as Unit)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]"><option value="mg">Milligram</option><option value="g">Gram</option><option value="10g">10 grams</option><option value="tola">Tola</option><option value="kg">Kilogram</option></select></div></div>
    <div className="mt-5 border border-[#171717] bg-[#c8f169] p-5" aria-live="polite"><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Today’s estimated value</p><p className="mt-2 break-all text-3xl font-black">{loading ? "Loading…" : result === null ? "—" : money(result)}</p>{perGram !== null && <p className="mt-2 text-sm text-black/60">{money(perGram)} per gram · {money(perGram * 10)} per 10g · {money(perGram * 1000)} per kg</p>}</div>
    {error && <p role="alert" className="mt-4 border border-red-700/30 bg-red-50 p-3 text-sm font-semibold text-red-800">{error} <button type="button" onClick={() => void loadRates()} className="ml-1 underline">Retry</button></p>}

    <section className="mt-6 border-t border-[#d8d4c9] pt-5" aria-labelledby="metal-rate-board">
      <div className="flex items-end justify-between gap-3"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-black/40">Today’s reference</p><h2 id="metal-rate-board" className="mt-1 text-lg font-black">Gold & silver in INR</h2></div><span className="text-xs text-black/40">per gram</span></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="border border-[#d8d4c9] bg-[#f8f5ed] p-3"><p className="text-xs font-bold text-black/45">24K gold · 999</p><p className="mt-1 font-bold">{loading || !snapshot ? "—" : money(snapshot.gold24)}</p></div>
        <div className="border border-[#d8d4c9] bg-[#f8f5ed] p-3"><p className="text-xs font-bold text-black/45">22K gold · 916</p><p className="mt-1 font-bold">{loading || !snapshot ? "—" : money(snapshot.gold22)}</p></div>
        <div className="border border-[#d8d4c9] bg-[#f8f5ed] p-3"><p className="text-xs font-bold text-black/45">18K gold · 750</p><p className="mt-1 font-bold">{loading || !snapshot ? "—" : money(snapshot.gold18)}</p></div>
        <div className="border border-[#d8d4c9] bg-[#f8f5ed] p-3"><p className="text-xs font-bold text-black/45">Silver · spot</p><p className="mt-1 font-bold">{loading || !snapshot ? "—" : money(snapshot.silver)}</p></div>
      </div>
    </section>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-black/45"><p>Live international spot prices converted to INR.</p><button type="button" onClick={() => void loadRates()} disabled={loading} className="font-bold underline disabled:opacity-40">Refresh rates</button></div>
    {updated && <p className="mt-2 text-xs text-black/40">Latest source update: {updated}.</p>}
    <p className="mt-2 text-xs leading-5 text-black/40">This is a live international spot-price estimate, not a jeweller's, MCX or city bullion-board final selling price. Indian prices can include GST, import duties, making charges, wastage, local premiums and dealer spreads. Gold API supplies the metal spot prices; INR conversion uses ExchangeRate-API data.</p>
  </div>;
}
