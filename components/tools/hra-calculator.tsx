"use client";

import { useMemo, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function HraCalculator() {
  const [basic, setBasic] = useState("600000");
  const [da, setDa] = useState("0");
  const [hra, setHra] = useState("240000");
  const [rent, setRent] = useState("240000");
  const [metro, setMetro] = useState(true);

  const result = useMemo(() => {
    const annualBasic = Math.max(0, Number(basic) || 0);
    const annualDa = Math.max(0, Number(da) || 0);
    const hraReceived = Math.max(0, Number(hra) || 0);
    const annualRent = Math.max(0, Number(rent) || 0);
    const salaryForHra = annualBasic + annualDa;
    const rentExcess = Math.max(0, annualRent - salaryForHra * 0.1);
    const salaryLimit = salaryForHra * (metro ? 0.5 : 0.4);
    const exempt = Math.min(hraReceived, rentExcess, salaryLimit);
    return { hraReceived, annualRent, rentExcess, salaryLimit, exempt, taxable: Math.max(0, hraReceived - exempt) };
  }, [basic, da, hra, rent, metro]);

  const inputClass = "mt-2 w-full rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] px-4 py-3 text-base outline-none focus:border-[#171717]";
  const reset = () => { setBasic("600000"); setDa("0"); setHra("240000"); setRent("240000"); setMetro(true); };

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-5">
          <div><label className="text-sm font-semibold" htmlFor="hra-basic">Annual basic salary</label><input id="hra-basic" className={inputClass} type="number" min="0" value={basic} onChange={e => setBasic(e.target.value)} /></div>
          <div><label className="text-sm font-semibold" htmlFor="hra-da">Annual DA forming part of retirement benefits</label><input id="hra-da" className={inputClass} type="number" min="0" value={da} onChange={e => setDa(e.target.value)} /><p className="mt-1 text-xs text-black/45">Enter only the DA amount that forms part of salary for HRA purposes.</p></div>
          <div><label className="text-sm font-semibold" htmlFor="hra-received">HRA received per year</label><input id="hra-received" className={inputClass} type="number" min="0" value={hra} onChange={e => setHra(e.target.value)} /></div>
          <div><label className="text-sm font-semibold" htmlFor="hra-rent">Rent paid per year</label><input id="hra-rent" className={inputClass} type="number" min="0" value={rent} onChange={e => setRent(e.target.value)} /></div>
          <fieldset><legend className="text-sm font-semibold">City type</legend><div className="mt-2 grid gap-2 sm:grid-cols-2"><label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] p-3 text-sm"><input className="mt-1 size-4 accent-[#171717]" type="radio" name="hra-city" checked={metro} onChange={() => setMetro(true)} /><span><strong className="block">Metro city</strong><span className="text-xs text-black/50">50% salary limit</span></span></label><label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#d8d4c9] bg-[#f8f5ed] p-3 text-sm"><input className="mt-1 size-4 accent-[#171717]" type="radio" name="hra-city" checked={!metro} onChange={() => setMetro(false)} /><span><strong className="block">Non-metro</strong><span className="text-xs text-black/50">40% salary limit</span></span></label></div></fieldset>
          <button onClick={reset} className="min-h-11 rounded-lg border border-[#d8d4c9] px-4 text-sm font-semibold hover:bg-black/5">Reset</button>
        </div>
        <div className="space-y-4">
          <div className="border border-[#171717] bg-[#f3f0e8] p-5" aria-live="polite"><p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Estimated HRA exemption</p><p className="mt-2 text-3xl font-black tracking-tight">{inr.format(result.exempt)}</p><p className="mt-1 text-sm text-black/50">Estimated taxable HRA: {inr.format(result.taxable)}</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">HRA received</p><p className="mt-1 font-bold">{inr.format(result.hraReceived)}</p></div>
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Rent minus 10% salary</p><p className="mt-1 font-bold">{inr.format(result.rentExcess)}</p></div>
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Salary percentage limit</p><p className="mt-1 font-bold">{inr.format(result.salaryLimit)}</p></div>
            <div className="border border-[#d8d4c9] p-4"><p className="text-xs text-black/45">Rent paid</p><p className="mt-1 font-bold">{inr.format(result.annualRent)}</p></div>
          </div>
        </div>
      </div>
      <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">Estimate based on the common HRA exemption calculation: minimum of actual HRA received, rent paid minus 10% of salary, and 50% of salary for specified metro cities or 40% elsewhere. Actual eligibility depends on your salary components, employment and tax records. Keep rent receipts and other supporting documents where required. This is not a tax-filing calculation.</p>
    </div>
  );
}
