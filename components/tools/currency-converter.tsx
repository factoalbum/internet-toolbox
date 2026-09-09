"use client";

import { useEffect, useMemo, useState } from "react";

type RatesResponse = { base?: string; date?: string; rates?: Record<string, number> };
type FallbackRatesResponse = RatesResponse & { result?: string; time_last_update_utc?: string };

const currencies = [
  ["INR", "Indian Rupee"], ["USD", "US Dollar"], ["EUR", "Euro"], ["GBP", "British Pound"],
  ["AED", "UAE Dirham"], ["SAR", "Saudi Riyal"], ["CAD", "Canadian Dollar"], ["AUD", "Australian Dollar"],
  ["SGD", "Singapore Dollar"], ["JPY", "Japanese Yen"], ["CNY", "Chinese Yuan"], ["CHF", "Swiss Franc"],
  ["NZD", "New Zealand Dollar"], ["HKD", "Hong Kong Dollar"], ["QAR", "Qatari Riyal"], ["KWD", "Kuwaiti Dinar"],
  ["MYR", "Malaysian Ringgit"], ["THB", "Thai Baht"], ["ZAR", "South African Rand"], ["NPR", "Nepalese Rupee"],
] as const;

const popularRates = ["USD", "EUR", "GBP", "AED", "SAR", "JPY"] as const;
const HOURLY_SOURCE = "https://api.exchangerate.fun/latest?base=USD";
const FALLBACK_SOURCE = "https://open.er-api.com/v6/latest/USD";

function format(value: number, code: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: code, maximumFractionDigits: code === "JPY" ? 0 : 2 }).format(value);
}

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
}

export default function CurrencyConverter() {
  const [base, setBase] = useState("USD");
  const [target, setTarget] = useState("INR");
  const [amount, setAmount] = useState("1");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [updated, setUpdated] = useState("");
  const [sourceName, setSourceName] = useState("Hourly reference rates");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadRates() {
    setLoading(true); setError("");
    try {
      const response = await fetch(HOURLY_SOURCE, { cache: "no-store" });
      if (!response.ok) throw new Error("Primary rate service unavailable");
      const data = await response.json() as RatesResponse;
      if (!data.rates || !Number.isFinite(data.rates.INR) || !Number.isFinite(data.rates.SAR)) throw new Error("Primary rate data incomplete");
      setRates(data.rates);
      setUpdated(data.date ?? "");
      setSourceName("ExchangeRate.fun hourly reference");
    } catch {
      try {
        const response = await fetch(FALLBACK_SOURCE, { cache: "no-store" });
        if (!response.ok) throw new Error("Fallback unavailable");
        const data = await response.json() as FallbackRatesResponse;
        if (data.result !== "success" || !data.rates || !Number.isFinite(data.rates.INR)) throw new Error("Fallback data invalid");
        setRates(data.rates);
        setUpdated(data.time_last_update_utc ?? "");
        setSourceName("ExchangeRate-API daily fallback");
      } catch {
        setError("Live rates could not be loaded. Please try again.");
      }
    } finally { setLoading(false); }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadRates(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const result = useMemo(() => {
    const value = Number(amount);
    if (!rates || !Number.isFinite(value) || value < 0 || rates[base] === undefined || rates[target] === undefined || rates[base] <= 0) return null;
    return value * (rates[target] / rates[base]);
  }, [amount, base, target, rates]);

  const rateToInr = (code: string) => {
    if (!rates || rates[code] === undefined || rates[code] <= 0) return null;
    return rates.INR / rates[code];
  };

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
      <div><label htmlFor="currency-amount" className="block text-sm font-bold">Amount</label><input id="currency-amount" value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-base outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" /></div>
      <div><label htmlFor="currency-from" className="block text-sm font-bold">From</label><select id="currency-from" value={base} onChange={e => setBase(e.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]">{currencies.map(([code, name]) => <option key={code} value={code}>{code} - {name}</option>)}</select></div>
    </div>
    <div className="mt-4"><label htmlFor="currency-to" className="block text-sm font-bold">To</label><select id="currency-to" value={target} onChange={e => setTarget(e.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]">{currencies.map(([code, name]) => <option key={code} value={code}>{code} - {name}</option>)}</select></div>
    <div className="mt-5 border border-[#171717] bg-[#c8f169] p-5" aria-live="polite"><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Converted amount</p><p className="mt-2 break-all text-3xl font-black">{loading ? "Loading" : result === null ? "Not available" : format(result, target)}</p>{result !== null && <p className="mt-2 text-sm text-black/60">1 {base} = {format(rates![target] / rates![base], target)}</p>}</div>
    {error && <p role="alert" className="mt-4 border border-red-700/30 bg-red-50 p-3 text-sm font-semibold text-red-800">{error} <button type="button" onClick={() => void loadRates()} className="ml-1 underline">Retry</button></p>}

    <section className="mt-6 border-t border-[#d8d4c9] pt-5" aria-labelledby="popular-currency-rates">
      <div className="flex items-end justify-between gap-3"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-black/40">Today's reference</p><h2 id="popular-currency-rates" className="mt-1 text-lg font-black">Popular rates in INR</h2></div><span className="text-xs text-black/40">1 unit</span></div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{popularRates.map(code => <div key={code} className="border border-[#d8d4c9] bg-[#f8f5ed] p-3"><p className="text-xs font-bold text-black/45">{code}</p><p className="mt-1 font-bold">{loading ? "Not available" : rateToInr(code) === null ? "Not available" : formatInr(rateToInr(code)!)}</p></div>)}</div>
    </section>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-black/45"><p>Reference rates refresh about once per hour.</p><button type="button" onClick={() => void loadRates()} disabled={loading} className="font-bold underline disabled:opacity-40">Refresh rates</button></div>
    {updated && <p className="mt-2 text-xs text-black/40">Source update: {updated}. {sourceName} is indicative and may differ slightly from Google, banks, cards and remittance providers.</p>}
    <p className="mt-2 text-xs text-black/40">This tool shows indicative midpoint/reference rates and does not add bank spreads, card fees or transfer charges.</p>
  </div>;
}
