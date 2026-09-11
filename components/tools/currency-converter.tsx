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

  return <div className="bg-[#fffdf8] p-5 md:p-8">
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4 md:p-5">
        <label htmlFor="currency-amount" className="block text-sm font-black">Amount</label>
        <p className="mt-1 text-xs leading-5 text-black/40">Enter the amount you want to convert.</p>
        <input id="currency-amount" value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" aria-describedby="currency-amount-help" className="mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-base font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
        <span id="currency-amount-help" className="sr-only">Use zero or a positive number.</span>
      </div>
      <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4 md:p-5">
        <label htmlFor="currency-from" className="block text-sm font-black">From</label>
        <p className="mt-1 text-xs leading-5 text-black/40">Choose the currency you are starting with.</p>
        <select id="currency-from" value={base} onChange={e => setBase(e.target.value)} className="mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40">{currencies.map(([code, name]) => <option key={code} value={code}>{code} - {name}</option>)}</select>
      </div>
    </div>

    <div className="mt-4 rounded-2xl border border-[#d8d4c9] bg-white p-4 md:p-5">
      <label htmlFor="currency-to" className="block text-sm font-black">To</label>
      <p className="mt-1 text-xs leading-5 text-black/40">Choose the currency you want to receive the value in.</p>
      <select id="currency-to" value={target} onChange={e => setTarget(e.target.value)} className="mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40">{currencies.map(([code, name]) => <option key={code} value={code}>{code} - {name}</option>)}</select>
    </div>

    <div className="mt-5 rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-6" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-[0.12em] text-black/50">Converted amount</p><p className="mt-2 break-all text-3xl font-black tracking-[-.03em] md:text-4xl">{loading ? "Loading" : result === null ? "Not available" : format(result, target)}</p></div>
        <span className="rounded-full bg-white/55 px-3 py-1.5 text-[11px] font-black text-black/60">{base} → {target}</span>
      </div>
      {result !== null && <p className="mt-3 text-sm font-semibold text-black/60">1 {base} = {format(rates![target] / rates![base], target)}</p>}
    </div>

    {error && <div role="alert" className="mt-4 flex flex-col gap-3 rounded-2xl border border-red-700/25 bg-red-50 p-4 text-sm font-semibold text-red-800 sm:flex-row sm:items-center sm:justify-between"><p>{error}</p><button type="button" onClick={() => void loadRates()} className="min-h-11 shrink-0 rounded-xl border border-red-700/25 bg-white px-4 font-black underline underline-offset-2 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-200">Retry</button></div>}

    <section className="mt-7 border-t border-[#d8d4c9] pt-6" aria-labelledby="popular-currency-rates">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-black/40">Today&apos;s reference</p><h2 id="popular-currency-rates" className="mt-1 text-lg font-black tracking-[-.02em]">Popular rates in INR</h2></div><span className="text-xs text-black/40">1 unit</span></div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{popularRates.map(code => <div key={code} className="rounded-xl border border-[#d8d4c9] bg-[#f8f5ed] p-3.5"><p className="text-xs font-black text-black/45">{code}</p><p className="mt-1 font-bold">{loading ? "Not available" : rateToInr(code) === null ? "Not available" : formatInr(rateToInr(code)!)}</p></div>)}</div>
    </section>

    <div className="mt-6 flex flex-col gap-3 border-t border-[#d8d4c9] pt-5 text-xs text-black/45 sm:flex-row sm:items-center sm:justify-between"><p>Reference rates refresh about once per hour.</p><button type="button" onClick={() => void loadRates()} disabled={loading} className="min-h-11 rounded-xl border border-[#d8d4c9] bg-white px-4 font-black text-black/70 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-[#c8f169]/50">{loading ? "Refreshing…" : "Refresh rates"}</button></div>
    {updated && <p className="mt-3 text-xs leading-5 text-black/40">Source update: {updated}. {sourceName} is indicative and may differ slightly from Google, banks, cards and remittance providers.</p>}
    <p className="mt-2 text-xs leading-5 text-black/40">This tool shows indicative midpoint/reference rates and does not add bank spreads, card fees or transfer charges.</p>
  </div>;
}
