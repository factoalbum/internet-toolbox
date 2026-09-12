"use client";

import { useEffect, useMemo, useState } from "react";

const TOLA_TO_GRAMS = 11.6638125;
type Metal = "gold" | "silver";
type Unit = "mg" | "g" | "10g" | "tola" | "kg";
type Rates = {
  source: string;
  city: string;
  updatedAt: string;
  fetchedAt: string;
  gold: { "24k": number; "22k": number; "18k": number };
  silver: { perGram: number; perKg: number };
};

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
}

function gramsFor(amount: number, unit: Unit) {
  if (unit === "mg") return amount / 1000;
  if (unit === "10g") return amount * 10;
  if (unit === "tola") return amount * TOLA_TO_GRAMS;
  if (unit === "kg") return amount * 1000;
  return amount;
}

function ratesUrl() {
  const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const githubPagesBasePath = window.location.pathname.startsWith("/internet-toolbox") ? "/internet-toolbox" : "";
  return `${configuredBasePath || githubPagesBasePath}/data/india-metal-rates.json`;
}

export default function GoldSilverConverter() {
  const [metal, setMetal] = useState<Metal>("gold");
  const [purity, setPurity] = useState<keyof Rates["gold"]>("24k");
  const [weight, setWeight] = useState("1");
  const [unit, setUnit] = useState<Unit>("g");
  const [rates, setRates] = useState<Rates | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadRates() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(ratesUrl(), { cache: "no-store" });
      if (!response.ok) throw new Error(`Rate snapshot request failed: ${response.status}`);
      const data = await response.json() as Rates;
      const values = [data.gold["24k"], data.gold["22k"], data.gold["18k"], data.silver.perGram, data.silver.perKg];
      if (data.source !== "Goodreturns" || data.city !== "Mumbai" || !data.updatedAt || values.some((value) => !Number.isFinite(value) || value <= 0)) throw new Error("Rate snapshot is invalid");
      setRates(data);
    } catch {
      setRates(null);
      setError("Mumbai gold and silver rates could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadRates(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const perGram = useMemo(() => {
    if (!rates) return null;
    return metal === "gold" ? rates.gold[purity] : rates.silver.perGram;
  }, [metal, purity, rates]);

  const result = useMemo(() => {
    const amount = Number(weight);
    if (perGram === null || !Number.isFinite(amount) || amount < 0) return null;
    return perGram * gramsFor(amount, unit);
  }, [perGram, unit, weight]);

  const stale = rates ? Number.isNaN(Date.parse(rates.updatedAt)) || new Date(rates.updatedAt).toDateString() !== new Date().toDateString() : false;

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="flex flex-col gap-3 border-b border-[#e3dfd5] pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#6d8e25]">India market reference</p>
        <h2 className="mt-1 text-lg font-black">Mumbai gold and silver rates</h2>
        <p className="mt-1 text-xs leading-5 text-black/45">Uses the latest Mumbai reference snapshot from Goodreturns. Rates are indicative and exclude GST, making charges and other levies.</p>
      </div>
      <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-[#e9f1d8] px-3 py-1.5 text-[11px] font-bold text-[#52691f]">India reference data</span>
    </div>

    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <div><label htmlFor="metal" className="block text-sm font-bold">Commodity</label><select id="metal" value={metal} onChange={(event) => setMetal(event.target.value as Metal)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40"><option value="gold">Gold</option><option value="silver">Silver</option></select></div>
      {metal === "gold" && <div><label htmlFor="purity" className="block text-sm font-bold">Gold purity</label><select id="purity" value={purity} onChange={(event) => setPurity(event.target.value as keyof Rates["gold"])} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40"><option value="24k">24K - 999</option><option value="22k">22K - 916</option><option value="18k">18K - 750</option></select></div>}
    </div>

    <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px]">
      <div><label htmlFor="metal-weight" className="block text-sm font-bold">How much?</label><input id="metal-weight" type="number" min="0" step="any" value={weight} onChange={(event) => setWeight(event.target.value)} inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-base outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" placeholder="e.g. 10" /></div>
      <div><label htmlFor="metal-unit" className="block text-sm font-bold">Unit</label><select id="metal-unit" value={unit} onChange={(event) => setUnit(event.target.value as Unit)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40"><option value="mg">Milligram</option><option value="g">Gram</option><option value="10g">10 grams</option><option value="tola">Tola</option><option value="kg">Kilogram</option></select></div>
    </div>

    <div className="mt-5 border border-[#171717] bg-[#c8f169] p-5" aria-live="polite">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Today&apos;s estimated value</p>
      <p className="mt-2 break-all text-3xl font-black">{loading ? "Loading" : result === null ? "Not available" : money(result)}</p>
      {perGram !== null && <p className="mt-2 text-sm text-black/60">{money(perGram)} per gram, {money(perGram * 10)} per 10g, {money(perGram * 1000)} per kg</p>}
    </div>

    {error && <p role="alert" className="mt-4 border border-red-700/30 bg-red-50 p-3 text-sm font-semibold text-red-800">{error} <button type="button" onClick={() => void loadRates()} className="ml-1 underline">Retry</button></p>}

    {rates && <section className="mt-6 border-t border-[#d8d4c9] pt-5" aria-labelledby="metal-rate-board">
      <div className="flex items-end justify-between gap-3"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-black/40">Reference board</p><h2 id="metal-rate-board" className="mt-1 text-lg font-black">Mumbai rates in INR</h2></div><span className="text-xs text-black/40">per gram</span></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {([['24K gold, 999', rates.gold["24k"]], ['22K gold, 916', rates.gold["22k"]], ['18K gold, 750', rates.gold["18k"]], ['Silver, reference', rates.silver.perGram]] as const).map(([label, value]) => <div key={label} className="border border-[#d8d4c9] bg-[#f8f5ed] p-3"><p className="text-xs font-bold text-black/45">{label}</p><p className="mt-1 font-bold">{money(value)}</p></div>)}
      </div>
    </section>}

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-black/45"><p>Source: {rates?.source ?? "Goodreturns"}, {rates?.city ?? "Mumbai"}. {rates?.updatedAt ? `Rate date: ${rates.updatedAt}.` : ""}</p><button type="button" onClick={() => void loadRates()} disabled={loading} className="font-bold underline disabled:opacity-40">Refresh rates</button></div>
    {stale && <p className="mt-2 border border-amber-700/20 bg-amber-50 p-3 text-xs leading-5 text-amber-900">The published reference date is not today. The scheduled rate refresh may be pending. Do not treat this as a live dealer quote.</p>}
    <p className="mt-2 text-xs leading-5 text-black/40">Goodreturns describes these as indicative rates. Your jeweller, city, purity, GST, making charges, TCS, wastage and dealer premiums can produce a different final price.</p>
  </div>;
}
