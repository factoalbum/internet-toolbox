"use client";

import { ArrowRightLeft, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

type Category = "length" | "weight" | "temperature" | "volume";
type Unit = { label: string; value: string; factor?: number };

const units: Record<Category, Unit[]> = {
  length: [
    { label: "Millimeters", value: "mm", factor: 0.001 }, { label: "Centimeters", value: "cm", factor: 0.01 }, { label: "Meters", value: "m", factor: 1 }, { label: "Kilometers", value: "km", factor: 1000 },
    { label: "Inches", value: "in", factor: 0.0254 }, { label: "Feet", value: "ft", factor: 0.3048 }, { label: "Yards", value: "yd", factor: 0.9144 }, { label: "Miles", value: "mi", factor: 1609.344 },
  ],
  weight: [
    { label: "Milligrams", value: "mg", factor: 0.000001 }, { label: "Grams", value: "g", factor: 0.001 }, { label: "Kilograms", value: "kg", factor: 1 }, { label: "Ounces", value: "oz", factor: 0.028349523125 }, { label: "Pounds", value: "lb", factor: 0.45359237 },
  ],
  temperature: [{ label: "Celsius", value: "c" }, { label: "Fahrenheit", value: "f" }, { label: "Kelvin", value: "k" }],
  volume: [
    { label: "Milliliters", value: "ml", factor: 0.001 }, { label: "Liters", value: "l", factor: 1 }, { label: "Cups (US)", value: "cup", factor: 0.2365882365 }, { label: "Fluid ounces (US)", value: "floz", factor: 0.0295735295625 }, { label: "Gallons (US)", value: "gal", factor: 3.785411784 },
  ],
};

function convertTemperature(value: number, from: string, to: string) {
  const celsius = from === "c" ? value : from === "f" ? (value - 32) * 5 / 9 : value - 273.15;
  return to === "c" ? celsius : to === "f" ? celsius * 9 / 5 + 32 : celsius + 273.15;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");

  const result = useMemo(() => {
    const number = Number(value);
    if (!value.trim() || !Number.isFinite(number)) return null;
    if (category === "temperature") return convertTemperature(number, from, to);
    const source = units[category].find((unit) => unit.value === from);
    const target = units[category].find((unit) => unit.value === to);
    if (!source?.factor || !target?.factor) return null;
    return number * source.factor / target.factor;
  }, [category, value, from, to]);

  function changeCategory(next: Category) {
    const first = units[next][0].value;
    const second = units[next][1].value;
    setCategory(next);
    setFrom(first);
    setTo(second);
  }

  function reset() {
    setCategory("length");
    setValue("1");
    setFrom("m");
    setTo("ft");
  }

  const options = units[category];
  const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef8d8] text-[#4e7417]" aria-hidden="true"><ArrowRightLeft size={20} /></span>
            <div className="min-w-0"><p className="font-bold">Convert everyday measurements</p><p className="mt-1 text-sm text-black/50">Choose a unit, enter a value, and get the converted result.</p></div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset unit converter"><RotateCcw size={16} /><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="p-5 md:p-7">
        <fieldset>
          <legend className="text-sm font-bold">What do you want to convert?</legend>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl border border-[#d8d4c9] bg-[#e8e4d9] p-1 sm:grid-cols-4">
            {(["length", "weight", "temperature", "volume"] as Category[]).map((item) => (
              <button key={item} type="button" onClick={() => changeCategory(item)} aria-pressed={category === item} className={`min-h-11 rounded-lg px-3 text-sm font-bold capitalize transition ${focusRing} ${category === item ? "bg-[#171717] text-white" : "text-black/50 hover:bg-white hover:text-black"}`}>{item}</button>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr_1fr] md:items-end">
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-bold">Value</span><input id="unit-value" value={value} onChange={(event) => setValue(event.target.value)} inputMode="decimal" placeholder="1" aria-label="Value to convert" className={`mt-2 min-h-14 w-full rounded-xl border border-[#bcb8ae] bg-white px-4 text-xl font-bold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} /></label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-bold">From</span><select id="unit-from" value={from} onChange={(event) => setFrom(event.target.value)} aria-label="Convert from unit" className={`mt-2 min-h-14 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`}>{options.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></label>
          <label className="block rounded-2xl border border-[#e2dfd7] bg-white p-4"><span className="text-sm font-bold">Convert to</span><select id="unit-to" value={to} onChange={(event) => setTo(event.target.value)} aria-label="Convert to unit" className={`mt-2 min-h-14 w-full rounded-xl border border-[#bcb8ae] bg-white px-3 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`}>{options.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></label>
        </div>

        <div className="mt-6 rounded-2xl border border-[#171717] bg-[#171717] p-5 text-white md:p-7" aria-live="polite" aria-atomic="true">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/40">Converted result</p>
          <p className="mt-2 break-all text-4xl font-black tracking-tight md:text-5xl">{result === null ? "Enter a value" : formatNumber(result)}</p>
          {result !== null && <p className="mt-2 text-sm text-white/45">{formatNumber(Number(value))} {options.find((unit) => unit.value === from)?.label} → {formatNumber(result)} {options.find((unit) => unit.value === to)?.label}</p>}
        </div>

        <p className="mt-6 border-t border-[#d8d4c9] pt-5 text-xs leading-5 text-black/45">Conversions use standard measurement relationships. Results are rounded to a practical number of decimal places for readability.</p>
      </div>
    </div>
  );
}
