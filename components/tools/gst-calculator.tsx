"use client";

import { Banknote, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
const amountPresets = [500, 1000, 2500, 5000];
const ratePresets = [5, 12, 18, 28];
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

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
  const inputClass = `mt-2 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3.5 text-base font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`;
  const selectedPill = "border-[#171717] bg-[#171717] text-white";
  const idlePill = "border-[#d8d4c9] bg-[#f3f0e8] hover:border-[#171717] hover:bg-white";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef8d8] text-[#4e7417]" aria-hidden="true"><Banknote size={20} /></span>
            <div className="min-w-0"><p className="font-bold">Calculate GST on an amount</p><p className="mt-1 text-sm text-black/50">Add GST to a price or work backwards from a GST-inclusive total.</p></div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset GST calculator"><RotateCcw size={16} aria-hidden="true" /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <div className="rounded-2xl border border-[#e2dfd7] bg-white p-2" role="group" aria-label="GST operation">
          <div className="grid grid-cols-2 gap-1">
            <button type="button" aria-pressed={mode === "add"} onClick={() => setMode("add")} className={`min-h-11 rounded-xl text-sm font-bold transition ${focusRing} ${mode === "add" ? "bg-[#171717] text-white" : "text-black/45 hover:bg-[#f3f0e8] hover:text-black"}`}>Add GST</button>
            <button type="button" aria-pressed={mode === "remove"} onClick={() => setMode("remove")} className={`min-h-11 rounded-xl text-sm font-bold transition ${focusRing} ${mode === "remove" ? "bg-[#171717] text-white" : "text-black/45 hover:bg-[#f3f0e8] hover:text-black"}`}>Remove GST</button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">{mode === "add" ? "Amount before GST (₹)" : "Amount including GST (₹)"}</span><input aria-label={mode === "add" ? "Amount before GST" : "Amount including GST"} value={amount} onChange={e => setAmount(e.target.value)} type="number" min="0" step="0.01" inputMode="decimal" className={inputClass} /></label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-semibold">GST rate</span><select aria-label="GST rate" value={rate} onChange={e => setRate(e.target.value)} className={inputClass}><option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option></select></label>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2" aria-label="Quick GST presets">
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Quick amount</p><div className="mt-2 flex flex-wrap gap-2">{amountPresets.map(value => <button key={value} type="button" onClick={() => setAmount(String(value))} aria-pressed={amount === String(value)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${focusRing} ${amount === String(value) ? selectedPill : idlePill}`}>₹{value.toLocaleString("en-IN")}</button>)}</div></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-black/40">Common GST rates</p><div className="mt-2 flex flex-wrap gap-2">{ratePresets.map(value => <button key={value} type="button" onClick={() => setRate(String(value))} aria-pressed={rate === String(value)} className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${focusRing} ${rate === String(value) ? selectedPill : idlePill}`}>{value}%</button>)}</div></div>
        </div>

        {result ? <div className="mt-7 grid gap-3 sm:grid-cols-3" aria-live="polite"><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Base amount</p><p className="mt-2 text-2xl font-black tracking-tight">{money.format(result.base)}</p></div><div className="rounded-2xl border border-[#d8d4c9] bg-[#f3f0e8] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">GST</p><p className="mt-2 text-2xl font-black tracking-tight">{money.format(result.gst)}</p></div><div className="rounded-2xl border border-[#171717] bg-[#c8f169] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Total</p><p className="mt-2 text-3xl font-black tracking-tight">{money.format(result.total)}</p></div></div> : <p className="mt-6 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">Enter a valid amount and a GST rate between 0% and 100%.</p>}

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">This is a simple GST estimate. Actual tax treatment can depend on the transaction, place of supply, applicable rate and other GST rules. This calculator does not determine whether a transaction is taxable.</p>
      </div>
    </div>
  );
}
