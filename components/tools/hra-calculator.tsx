"use client";

import { Building2, RotateCcw } from "lucide-react";
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

  const reset = () => {
    setBasic("600000");
    setDa("0");
    setHra("240000");
    setRent("240000");
    setMetro(true);
  };

  const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-base outline-none transition placeholder:text-black/30 focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]";

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]" aria-label="HRA calculator">
      <header className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#315fba]" aria-hidden="true">
              <Building2 size={20} />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Estimate your HRA exemption</p>
              <p className="mt-1 text-sm leading-5 text-black/50">Enter your annual salary, HRA and rent. Results update as you type.</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Reset HRA calculator">
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <div className="p-5 md:p-7">
        <div className="grid gap-7 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div>
            <div className="mb-5">
              <p className="text-[11px] font-black uppercase tracking-[.15em] text-black/40">Your details</p>
              <p className="mt-1 text-sm leading-5 text-black/50">Use annual amounts for all four fields.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
                <span className="text-sm font-bold">Basic salary</span>
                <span className="mt-1 block text-xs leading-5 text-black/40">Annual basic salary.</span>
                <input id="hra-basic" className={inputClass} type="number" min="0" inputMode="decimal" value={basic} onChange={e => setBasic(e.target.value)} aria-describedby="hra-basic-help" />
                <span id="hra-basic-help" className="sr-only">Enter your annual basic salary in rupees.</span>
              </label>

              <label className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
                <span className="text-sm font-bold">Eligible DA</span>
                <span className="mt-1 block text-xs leading-5 text-black/40">DA that forms part of salary for HRA.</span>
                <input id="hra-da" className={inputClass} type="number" min="0" inputMode="decimal" value={da} onChange={e => setDa(e.target.value)} aria-describedby="hra-da-help" />
                <span id="hra-da-help" className="sr-only">Enter only the annual dearness allowance amount that forms part of salary for HRA purposes.</span>
              </label>

              <label className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
                <span className="text-sm font-bold">HRA received</span>
                <span className="mt-1 block text-xs leading-5 text-black/40">HRA received during the year.</span>
                <input id="hra-received" className={inputClass} type="number" min="0" inputMode="decimal" value={hra} onChange={e => setHra(e.target.value)} aria-describedby="hra-received-help" />
                <span id="hra-received-help" className="sr-only">Enter the HRA you received during the year in rupees.</span>
              </label>

              <label className="rounded-2xl border border-[#e2dfd7] bg-white p-4">
                <span className="text-sm font-bold">Rent paid</span>
                <span className="mt-1 block text-xs leading-5 text-black/40">Total rent paid during the year.</span>
                <input id="hra-rent" className={inputClass} type="number" min="0" inputMode="decimal" value={rent} onChange={e => setRent(e.target.value)} aria-describedby="hra-rent-help" />
                <span id="hra-rent-help" className="sr-only">Enter the total rent paid during the year in rupees.</span>
              </label>
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-bold">City type</legend>
              <p className="mt-1 text-xs leading-5 text-black/40">This changes the salary percentage limit used in the estimate.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border p-4 transition focus-within:ring-4 focus-within:ring-[#c8f169] ${metro ? "border-[#171717] bg-[#f4f1e9]" : "border-[#e2dfd7] bg-white hover:border-[#171717]"}`}>
                  <input className="size-4 accent-[#171717]" type="radio" name="hra-city" checked={metro} onChange={() => setMetro(true)} />
                  <span>
                    <strong className="block text-sm">Metro city</strong>
                    <span className="text-xs text-black/45">50% salary limit</span>
                  </span>
                </label>
                <label className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border p-4 transition focus-within:ring-4 focus-within:ring-[#c8f169] ${!metro ? "border-[#171717] bg-[#f4f1e9]" : "border-[#e2dfd7] bg-white hover:border-[#171717]"}`}>
                  <input className="size-4 accent-[#171717]" type="radio" name="hra-city" checked={!metro} onChange={() => setMetro(false)} />
                  <span>
                    <strong className="block text-sm">Non-metro</strong>
                    <span className="text-xs text-black/45">40% salary limit</span>
                  </span>
                </label>
              </div>
            </fieldset>
          </div>

          <div className="lg:sticky lg:top-6" aria-live="polite" aria-atomic="true">
            <p className="text-[11px] font-black uppercase tracking-[.15em] text-black/40">Your estimate</p>
            <div className="mt-2 rounded-2xl border border-[#171717] bg-[#c8f169] p-5 md:p-6">
              <p className="text-sm font-bold text-black/60">Estimated HRA exemption</p>
              <p className="mt-2 text-3xl font-black tracking-[-.035em] sm:text-4xl">{inr.format(result.exempt)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-black/15 pt-4 text-sm">
                <span className="font-semibold text-black/55">Estimated taxable HRA</span>
                <strong>{inr.format(result.taxable)}</strong>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4">
                <p className="text-xs font-semibold text-black/45">HRA received</p>
                <p className="mt-1 text-lg font-black">{inr.format(result.hraReceived)}</p>
              </div>
              <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4">
                <p className="text-xs font-semibold text-black/45">Rent after 10% salary</p>
                <p className="mt-1 text-lg font-black">{inr.format(result.rentExcess)}</p>
              </div>
              <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4">
                <p className="text-xs font-semibold text-black/45">Salary percentage limit</p>
                <p className="mt-1 text-lg font-black">{inr.format(result.salaryLimit)}</p>
              </div>
              <div className="rounded-2xl border border-[#d8d4c9] bg-white p-4">
                <p className="text-xs font-semibold text-black/45">Rent paid</p>
                <p className="mt-1 text-lg font-black">{inr.format(result.annualRent)}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-7 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/50">Estimate based on the common HRA exemption calculation: minimum of actual HRA received, rent paid minus 10% of salary, and 50% of salary for specified metro cities or 40% elsewhere. Actual eligibility depends on your salary components, employment and tax records. Keep rent receipts and other supporting documents where required. This is not a tax-filing calculation.</p>
      </div>
    </section>
  );
}
