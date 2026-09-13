"use client";

import { ArrowLeftRight, Coins, RefreshCw } from "lucide-react";
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
const REQUEST_TIMEOUT_MS = 8000;

function format(value: number, code: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: code, maximumFractionDigits: code === "JPY" ? 0 : 2 }).format(value);
}

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
}

function isUsableRates(rates: Record<string, number> | undefined) {
  return Boolean(rates && Number.isFinite(rates.INR) && rates.INR > 0 && Number.isFinite(rates.USD) && rates.USD > 0);
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
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
      const response = await fetchWithTimeout(HOURLY_SOURCE);
      if (!response.ok) throw new Error("Primary rate service unavailable");
      const data = await response.json() as RatesResponse;
      if (!isUsableRates(data.rates)) throw new Error("Primary rate data incomplete");
      setRates(data.rates!);
      setUpdated(data.date ?? "");
      setSourceName("ExchangeRate.fun hourly reference");
    } catch {
      try {
        const response = await fetchWithTimeout(FALLBACK_SOURCE);
        if (!response.ok) throw new Error("Fallback unavailable");
        const data = await response.json() as FallbackRatesResponse;
        if (data.result !== "success" || !isUsableRates(data.rates)) throw new Error("Fallback data invalid");
        setRates(data.rates!);
        setUpdated(data.time_last_update_utc ?? "");
        setSourceName("ExchangeRate-API daily fallback");
      } catch {
        setRates(null); setUpdated(""); setError("Live rates could not be loaded. Please try again.");
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

  const swapCurrencies = () => {
    setBase(target);
    setTarget(base);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-labelledby="currency-workspace-title">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-[#171717]" aria-hidden="true"><Coins size={20} /></span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-black/45">Money utility</p>
              <h2 id="currency-workspace-title" className="mt-1 text-xl font-black tracking-[-.025em] md:text-2xl">Convert currencies</h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/50">Convert an amount using indicative live reference rates. Rates are refreshed from external providers.</p>
            </div>
          </div>
          <span className="hidden shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black/50 sm:inline-flex sm:items-center sm:gap-1.5"><span className={`size-1.5 rounded-full ${loading ? "bg-black/25" : error ? "bg-[#b45309]" : "bg-[#6d8e25]"}`} aria-hidden="true" />{loading ? "Loading rates" : error ? "Rate unavailable" : "Rates ready"}</span>
        </div>
      </header>

      <div className="p-5 md:p-7">
        <section aria-labelledby="currency-conversion-heading">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div><h3 id="currency-conversion-heading" className="text-sm font-black">Conversion</h3><p className="mt-1 text-xs text-black/40">Choose the currencies and enter an amount.</p></div>
            <span className="hidden text-xs font-semibold text-black/35 sm:block">Updates as you type</span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr_1fr_auto] lg:items-end">
            <label className="block rounded-2xl border border-[#dedbd3] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
              <span className="text-sm font-black">Amount</span>
              <span className="mt-1 block text-xs leading-5 text-black/40">Amount to convert</span>
              <input id="currency-amount" value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" aria-describedby="currency-amount-help" className="mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 text-lg font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
              <span id="currency-amount-help" className="sr-only">Use zero or a positive number.</span>
            </label>

            <label className="block rounded-2xl border border-[#dedbd3] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
              <span className="text-sm font-black">From</span>
              <span className="mt-1 block text-xs leading-5 text-black/40">Starting currency</span>
              <select id="currency-from" value={base} onChange={e => setBase(e.target.value)} className="mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-3 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40">{currencies.map(([code, name]) => <option key={code} value={code}>{code} - {name}</option>)}</select>
            </label>

            <label className="block rounded-2xl border border-[#dedbd3] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
              <span className="text-sm font-black">To</span>
              <span className="mt-1 block text-xs leading-5 text-black/40">Currency you want</span>
              <select id="currency-to" value={target} onChange={e => setTarget(e.target.value)} className="mt-3 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-3 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40">{currencies.map(([code, name]) => <option key={code} value={code}>{code} - {name}</option>)}</select>
            </label>

            <button type="button" onClick={swapCurrencies} aria-label={`Swap ${base} and ${target}`} className="min-h-12 rounded-xl border border-[#d8d4c9] bg-white px-4 text-sm font-bold text-black/65 transition hover:border-[#171717] hover:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/60 lg:size-12 lg:min-h-12 lg:px-0"><ArrowLeftRight size={17} className="mx-auto" aria-hidden="true" /><span className="ml-2 lg:sr-only">Swap currencies</span></button>
          </div>
        </section>

        <section className="mt-6" aria-labelledby="currency-result-heading" aria-live="polite">
          <div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p id="currency-result-heading" className="text-xs font-black uppercase tracking-[0.12em] text-black/50">Converted amount</p><p className="mt-2 break-all text-3xl font-black tracking-[-.03em] md:text-4xl">{loading ? "Loading rates…" : result === null ? "Not available" : format(result, target)}</p></div>
              <span className="rounded-full bg-white/60 px-3 py-1.5 text-[11px] font-black text-black/60">{base} → {target}</span>
            </div>
            {result !== null && <p className="mt-3 text-sm font-semibold text-black/60">1 {base} = {format(rates![target] / rates![base], target)}</p>}
          </div>
        </section>

        {error && <div role="alert" className="mt-4 flex flex-col gap-3 rounded-2xl border border-red-700/25 bg-red-50 p-4 text-sm font-semibold text-red-800 sm:flex-row sm:items-center sm:justify-between"><p>{error}</p><button type="button" onClick={() => void loadRates()} className="min-h-11 shrink-0 rounded-xl border border-red-700/25 bg-white px-4 font-black transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200">Retry</button></div>}

        <section className="mt-7 border-t border-[#d8d4c9] pt-6" aria-labelledby="popular-currency-rates">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-black/40">Reference rates</p><h2 id="popular-currency-rates" className="mt-1 text-lg font-black tracking-[-.02em]">Popular rates in INR</h2></div><span className="text-xs text-black/40">1 unit</span></div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{popularRates.map(code => <div key={code} className="rounded-xl border border-[#d8d4c9] bg-[#f8f5ed] p-3.5"><p className="text-xs font-black text-black/45">{code}</p><p className="mt-1 font-bold">{loading ? "Not available" : rateToInr(code) === null ? "Not available" : formatInr(rateToInr(code)!)}</p></div>)}</div>
        </section>

        <div className="mt-6 flex flex-col gap-3 border-t border-[#d8d4c9] pt-5 text-xs text-black/45 sm:flex-row sm:items-center sm:justify-between"><p>Reference rates refresh about once per hour.</p><button type="button" onClick={() => void loadRates()} disabled={loading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-4 font-black text-black/70 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]/50"><RefreshCw size={14} aria-hidden="true" className={loading ? "animate-spin" : ""} />{loading ? "Refreshing" : "Refresh rates"}</button></div>
        {updated && <p className="mt-3 text-xs leading-5 text-black/40">Source update: {updated}. {sourceName} is indicative and may differ slightly from Google, banks, cards and remittance providers.</p>}
        <p className="mt-2 text-xs leading-5 text-black/40">This tool shows indicative midpoint/reference rates and does not add bank spreads, card fees or transfer charges.</p>
      </div>
    </div>
  );
}
