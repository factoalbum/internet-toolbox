"use client";

import { useEffect, useMemo, useState } from "react";

type RatesResponse = { result: string; base_code?: string; rates?: Record<string, number>; time_last_update_utc?: string; time_next_update_utc?: string };

const currencies = [
  ["INR", "Indian Rupee", "₹"], ["USD", "US Dollar", "$"], ["EUR", "Euro", "€"], ["GBP", "British Pound", "£"],
  ["AED", "UAE Dirham", "د.إ"], ["SAR", "Saudi Riyal", "﷼"], ["CAD", "Canadian Dollar", "C$"], ["AUD", "Australian Dollar", "A$"],
  ["SGD", "Singapore Dollar", "S$"], ["JPY", "Japanese Yen", "¥"], ["CNY", "Chinese Yuan", "¥"], ["CHF", "Swiss Franc", "CHF"],
  ["NZD", "New Zealand Dollar", "NZ$"], ["HKD", "Hong Kong Dollar", "HK$"], ["QAR", "Qatari Riyal", "﷼"], ["KWD", "Kuwaiti Dinar", "د.ك"],
  ["MYR", "Malaysian Ringgit", "RM"], ["THB", "Thai Baht", "฿"], ["ZAR", "South African Rand", "R"], ["NPR", "Nepalese Rupee", "रू"],
] as const;

const symbols = Object.fromEntries(currencies.map(([code, name, symbol]) => [code, { name, symbol }]));

function format(value: number, code: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: code, maximumFractionDigits: code === "JPY" ? 0 : 2 }).format(value);
}

export default function CurrencyConverter() {
  const [base, setBase] = useState("USD");
  const [target, setTarget] = useState("INR");
  const [amount, setAmount] = useState("1");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [updated, setUpdated] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadRates() {
    setLoading(true); setError("");
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" });
      if (!response.ok) throw new Error("Rate service unavailable");
      const data = (await response.json()) as RatesResponse;
      if (data.result !== "success" || !data.rates) throw new Error("Could not read exchange rates");
      setRates(data.rates);
      setUpdated(data.time_last_update_utc ?? "");
    } catch {
      setError("Live rates could not be loaded. Please try again.");
    } finally { setLoading(false); }
  }

  useEffect(() => { void loadRates(); }, []);

  const result = useMemo(() => {
    const value = Number(amount);
    if (!rates || !Number.isFinite(value) || value < 0 || !rates[base] || !rates[target]) return null;
    return value * (rates[target] / rates[base]);
  }, [amount, base, target, rates]);

  function swap() { setBase(target); setTarget(base); }

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <div><label htmlFor="currency-amount" className="block text-sm font-bold">Amount</label><input id="currency-amount" value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-base outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" /></div>
      <div><label htmlFor="currency-from" className="block text-sm font-bold">From</label><select id="currency-from" value={base} onChange={e => setBase(e.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]">{currencies.map(([code, name]) => <option key={code} value={code}>{code} — {name}</option>)}</select></div>
      <button type="button" onClick={swap} className="min-h-11 rounded-md border border-[#bcb8ae] px-4 text-sm font-bold hover:border-[#171717]" aria-label="Swap currencies">Swap</button>
    </div>
    <div className="mt-4"><label htmlFor="currency-to" className="block text-sm font-bold">To</label><select id="currency-to" value={target} onChange={e => setTarget(e.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]">{currencies.map(([code, name]) => <option key={code} value={code}>{code} — {name}</option>)}</select></div>
    <div className="mt-5 border border-[#171717] bg-[#c8f169] p-5" aria-live="polite"><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Converted amount</p><p className="mt-2 break-all text-3xl font-black">{loading ? "Loading…" : result === null ? "—" : format(result, target)}</p>{result !== null && <p className="mt-2 text-sm text-black/60">1 {base} = {format(rates![target] / rates![base], target)}</p>}</div>
    {error && <p role="alert" className="mt-4 border border-red-700/30 bg-red-50 p-3 text-sm font-semibold text-red-800">{error} <button type="button" onClick={() => void loadRates()} className="ml-1 underline">Retry</button></p>}
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-black/45"><p>Rates update about once per day on this free data source.</p><button type="button" onClick={() => void loadRates()} disabled={loading} className="font-bold underline disabled:opacity-40">Refresh rates</button></div>
    {updated && <p className="mt-2 text-xs text-black/40">Source update: {updated}. Rates are indicative, not bank/card settlement rates.</p>}
    <p className="mt-2 text-xs text-black/40">Rates by ExchangeRate-API. This tool does not add bank spreads, card fees or transfer charges.</p>
  </div>;
}
