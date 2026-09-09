"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
const amountPresets = [500, 1000, 2500, 5000];
const ratePresets = [5, 12, 18, 28];

export default function GstCalculator() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const result = useMemo(() => {
    const value = Number(amount), tax = Number(rate);
    if (!Number.isFinite(value) || !Number.isFinite(tax) || value < 0 || tax < 0 || tax > 100) return null;
    if (mode === "add") {
      const gst = value * tax / 100;
      return { base: value, gst, total: value + gst };
    }
    const base = value / (1 + tax / 100);
    return { base, gst: value - base, total: value };
  }, [amount, rate, mode]);

  const reset = () => { setAmount("1000"); setRate("18"); setMode("add"); };
  const inputClass = "mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-base outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]";
  const selectedPill = "border-[#171717] bg-[#171717] text-white";
  const idlePill = "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717]";

  return <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div><p className="font-bold">Add or remove GST instantly</p><p className="mt-1 text-sm text-black/50">Useful for checking an invoice price before you pay or quote it.</p></div>
      <button type="button" onClick={reset} className="flex min-h-11 items-center gap-2 rounded-lg border border-[#d8d4c9] px-3 text-sm font-bold text-black/55 transition hover:bg-black/5 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#c8f169]" aria-label="Reset GST calculator"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
    </div>

    <div className="flex gap-1 border border-[#d8d4c9] bg-[#e8e4d9] p-1" role="tablist" aria-label="GST operation">
      <button type="button" role="tab" aria-selected={mode === "add"} onClick={()=>setMode("add")} className={`min-h-11 flex-1 rounded-md text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#c8f169] ${mode === "add" ? "bg-[#171717] text-white" : "text-black/45 hover:text-black"}`}>Add GST</button>
      <button type="button" role="tab" aria-selected={mode === "remove"} onClick={()=>setMode("remove")} className={`min-h-11 flex-1 rounded-md text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#c8f169] ${mode === "remove" ? "bg-[#171717] text-white" : "text-black/45 hover:text-black"}`}>Remove GST</button>
    </div>

    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <label className="block"><span className="text-sm font-semibold">{mode === "add" ? "Amount before GST (₹)" : "Amount including GST (₹)"}</span><input aria-label={mode === "add" ? "Amount before GST" : "Amount including GST"} value={amount} onChange={e=>setAmount(e.target.value)} type="number" min="0" step="0.01" inputMode="decimal" className={inputClass} /></label>
      <label className="block"><span className="text-sm font-semibold">GST rate</span><select aria-label="GST rate" value={rate} onChange={e=>setRate(e.target.value)} className={inputClass}><option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option></select></label>
    </div>

    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Quick amount</p><div className="mt-2 flex flex-wrap gap-2">{amountPresets.map(value=><button key={value} type="button" onClick={()=>setAmount(String(value))} aria-pressed={amount === String(value)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#c8f169] ${amount === String(value) ? selectedPill : idlePill}`}>₹{value.toLocaleString("en-IN")}</button>)}</div></div>
      <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Common GST rates</p><div className="mt-2 flex flex-wrap gap-2">{ratePresets.map(value=><button key={value} type="button" onClick={()=>setRate(String(value))} aria-pressed={rate === String(value)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#c8f169] ${rate === String(value) ? selectedPill : idlePill}`}>{value}%</button>)}</div></div>
    </div>

    {result ? <div className="mt-7 grid gap-3 sm:grid-cols-3" aria-live="polite"><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Base amount</p><p className="mt-2 text-2xl font-black">{money.format(result.base)}</p></div><div className="border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">GST</p><p className="mt-2 text-2xl font-black">{money.format(result.gst)}</p></div><div className="border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Total</p><p className="mt-2 text-2xl font-black">{money.format(result.total)}</p></div></div> : <p className="mt-6 text-sm text-black/50" role="alert">Enter a valid amount and GST rate.</p>}

    <p className="mt-5 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Simple GST estimate. Actual tax treatment can depend on the supply, place of supply, applicable rate and other GST rules. This calculator does not determine whether a transaction is taxable.</p>
  </div>;
}
