"use client";

import { RefreshCw, RotateCcw, Scale } from "lucide-react";
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

const focusRing = "focus:outline-none focus:ring-4 focus:ring-[#c8f169]/45";

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

  const amount = Number(weight);
  const validWeight = Number.isFinite(amount) && amount >= 0;
  const result = useMemo(() => {
    if (perGram === null || !validWeight) return null;
    return perGram * gramsFor(amount, unit);
  }, [amount, perGram, unit, validWeight]);

  const stale = rates ? Number.isNaN(Date.parse(rates.updatedAt)) || new Date(rates.updatedAt).toDateString() !== new Date().toDateString() : false;
  const quickWeights = unit === "g" ? [1, 5, 10, 20, 50] : unit === "10g" ? [1, 2, 5, 10, 20] : [];

  const reset = () => {
    setMetal("gold");
    setPurity("24k");
    setWeight("1");
    setUnit("g");
    setError("");
  };

  return <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
    <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true"><Scale size={21} /></span>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[.14em] text-[#6d8e25]">Money &amp; Investing</p>
            <h2 className="mt-1 text-lg font-black tracking-[-.02em]">Gold &amp; silver value</h2>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-black/50">Estimate the value of a gold or silver weight using the latest Mumbai reference rates.</p>
          </div>
        </div>
        <button type="button" onClick={reset} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset gold and silver converter">
          <RotateCcw size={15} aria-hidden="true" /><span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>

    <div className="p-5 md:p-7">
      <section aria-labelledby="metal-choice-heading">
        <div className="flex items-end justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-[.12em] text-black/45">1. Choose a metal</p><h3 id="metal-choice-heading" className="mt-1 text-base font-black">What are you checking?</h3></div>
          <span className="text-xs text-black/40">Mumbai reference</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-[#f0eee8] p-1" role="group" aria-label="Choose metal">
          {(["gold", "silver"] as const).map((option) => (
            <button key={option} type="button" aria-pressed={metal === option} onClick={() => setMetal(option)} className={`min-h-12 rounded-xl px-4 text-sm font-black capitalize transition ${focusRing} ${metal === option ? "border border-[#171717] bg-white text-[#171717] shadow-sm" : "border border-transparent text-black/50 hover:text-black"}`}>
              {option}
            </button>
          ))}
        </div>
      </section>

      {metal === "gold" && <section className="mt-5" aria-labelledby="purity-heading">
        <label htmlFor="purity" className="block text-sm font-bold" id="purity-heading">2. Gold purity</label>
        <select id="purity" value={purity} onChange={(event) => setPurity(event.target.value as keyof Rates["gold"])} className={`mt-2 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-4 text-sm outline-none transition focus:border-[#171717] ${focusRing}`}>
          <option value="24k">24K - 999 fine</option><option value="22k">22K - 916 fine</option><option value="18k">18K - 750 fine</option>
        </select>
      </section>}

      <section className="mt-5" aria-labelledby="weight-heading">
        <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
          <div>
            <label htmlFor="metal-weight" id="weight-heading" className="block text-sm font-bold">{metal === "gold" ? "3. How much?" : "2. How much?"}</label>
            <div className="mt-2 rounded-xl border border-[#bcb8ae] bg-white transition focus-within:border-[#171717] focus-within:ring-4 focus-within:ring-[#c8f169]/45">
              <input id="metal-weight" type="number" min="0" step="any" value={weight} onChange={(event) => setWeight(event.target.value)} inputMode="decimal" aria-invalid={!validWeight} className="min-h-12 w-full bg-transparent px-4 text-base outline-none" placeholder="e.g. 10" />
            </div>
          </div>
          <div>
            <label htmlFor="metal-unit" className="block text-sm font-bold">Unit</label>
            <select id="metal-unit" value={unit} onChange={(event) => setUnit(event.target.value as Unit)} className={`mt-2 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-4 text-sm outline-none transition focus:border-[#171717] ${focusRing}`}>
              <option value="mg">Milligram</option><option value="g">Gram</option><option value="10g">10 grams</option><option value="tola">Tola</option><option value="kg">Kilogram</option>
            </select>
          </div>
        </div>
        {quickWeights.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Quick weight choices">
          <span className="mr-1 text-xs font-semibold text-black/40">Quick:</span>
          {quickWeights.map((quick) => <button key={quick} type="button" aria-pressed={weight === String(quick)} onClick={() => setWeight(String(quick))} className={`min-h-10 rounded-full border px-3 text-xs font-bold transition ${focusRing} ${weight === String(quick) ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-white text-black/55 hover:border-[#171717] hover:text-black"}`}>{quick}{unit === "g" ? "g" : " x 10g"}</button>)}
        </div>}
      </section>

      <section className="mt-7" aria-labelledby="metal-result-heading" aria-live="polite" aria-atomic="true">
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-[.12em] text-black/45">Estimated value</p><h3 id="metal-result-heading" className="mt-1 text-base font-black">What your weight is worth</h3></div>
          {loading && <span className="text-xs font-semibold text-black/40">Loading rates</span>}
        </div>
        <div className="mt-3 rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-6">
          <p className="break-all text-3xl font-black tracking-[-.035em] sm:text-4xl">{loading ? "Loading" : result === null ? "Not available" : money(result)}</p>
          {perGram !== null && <p className="mt-2 text-sm leading-5 text-black/60">{money(perGram)} per gram · {money(perGram * 10)} per 10g · {money(perGram * 1000)} per kg</p>}
          {!loading && result !== null && <p className="mt-3 text-xs font-semibold text-black/50">Based on {weight || "0"} {unit === "10g" ? "x 10g" : unit} of {metal}{metal === "gold" ? ` (${purity.toUpperCase()})` : ""}.</p>}
        </div>
      </section>

      {error && <div role="alert" className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]">
        <p className="font-semibold">{error}</p>
        <button type="button" onClick={() => void loadRates()} disabled={loading} className={`mt-2 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#7b3d31]/25 bg-white px-3 text-xs font-bold transition hover:border-[#7b3d31] disabled:opacity-40 ${focusRing}`}><RefreshCw size={14} aria-hidden="true" />Retry loading rates</button>
      </div>}

      {rates && <section className="mt-7 border-t border-[#d8d4c9] pt-6" aria-labelledby="metal-rate-board">
        <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.12em] text-black/40">Reference board</p><h3 id="metal-rate-board" className="mt-1 text-lg font-black">Mumbai rates in INR</h3></div><span className="text-xs text-black/40">per gram</span></div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {([['24K gold · 999', rates.gold["24k"]], ['22K gold · 916', rates.gold["22k"]], ['18K gold · 750', rates.gold["18k"]], ['Silver · reference', rates.silver.perGram]] as const).map(([label, value]) => <div key={label} className="rounded-xl border border-[#d8d4c9] bg-[#f8f5ed] p-4"><p className="text-xs font-bold text-black/45">{label}</p><p className="mt-1 text-base font-black">{money(value)}</p></div>)}
        </div>
      </section>}

      <div className="mt-6 flex flex-col gap-3 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45 sm:flex-row sm:items-center sm:justify-between">
        <div><p>Source: {rates?.source ?? "Goodreturns"}, {rates?.city ?? "Mumbai"}.</p><p>{rates?.updatedAt ? `Reference date: ${rates.updatedAt}.` : "Reference rates are loading."}</p></div>
        <button type="button" onClick={() => void loadRates()} disabled={loading} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-xs font-bold text-black/60 transition hover:border-[#171717] hover:text-black disabled:opacity-40 ${focusRing}`}><RefreshCw size={14} aria-hidden="true" className={loading ? "animate-spin" : ""} />Refresh rates</button>
      </div>
      {stale && <p className="mt-3 rounded-xl border border-amber-700/20 bg-amber-50 p-3 text-xs leading-5 text-amber-900">The published reference date is not today. The scheduled rate refresh may be pending. Do not treat this as a live dealer quote.</p>}
      <p className="mt-3 text-xs leading-5 text-black/40">These are indicative reference rates. Jeweller pricing can differ because of GST, making charges, wastage, TCS, dealer premiums and local market conditions.</p>
    </div>
  </div>;
}
