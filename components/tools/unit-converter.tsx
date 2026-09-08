"use client";

import { useMemo, useState } from "react";

type Category = "length" | "weight" | "temperature" | "volume";

type Unit = { label: string; value: string; factor?: number };

const units: Record<Category, Unit[]> = {
  length: [
    { label: "Millimeters", value: "mm", factor: 0.001 },
    { label: "Centimeters", value: "cm", factor: 0.01 },
    { label: "Meters", value: "m", factor: 1 },
    { label: "Kilometers", value: "km", factor: 1000 },
    { label: "Inches", value: "in", factor: 0.0254 },
    { label: "Feet", value: "ft", factor: 0.3048 },
    { label: "Yards", value: "yd", factor: 0.9144 },
    { label: "Miles", value: "mi", factor: 1609.344 },
  ],
  weight: [
    { label: "Milligrams", value: "mg", factor: 0.000001 },
    { label: "Grams", value: "g", factor: 0.001 },
    { label: "Kilograms", value: "kg", factor: 1 },
    { label: "Ounces", value: "oz", factor: 0.028349523125 },
    { label: "Pounds", value: "lb", factor: 0.45359237 },
  ],
  temperature: [
    { label: "Celsius", value: "c" },
    { label: "Fahrenheit", value: "f" },
    { label: "Kelvin", value: "k" },
  ],
  volume: [
    { label: "Milliliters", value: "ml", factor: 0.001 },
    { label: "Liters", value: "l", factor: 1 },
    { label: "Cups (US)", value: "cup", factor: 0.2365882365 },
    { label: "Fluid ounces (US)", value: "floz", factor: 0.0295735295625 },
    { label: "Gallons (US)", value: "gal", factor: 3.785411784 },
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

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const options = units[category];

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <label className="block text-sm font-bold">What do you want to convert?</label>
      <div className="mt-2 grid grid-cols-2 gap-1 border border-[#d8d4c9] bg-[#e8e4d9] p-1 sm:grid-cols-4">
        {(["length", "weight", "temperature", "volume"] as Category[]).map((item) => (
          <button key={item} type="button" onClick={() => changeCategory(item)} className={`min-h-11 rounded-md px-3 text-sm font-bold capitalize ${category === item ? "bg-[#171717] text-white" : "text-black/50 hover:text-black"}`}>{item}</button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div>
          <label htmlFor="unit-value" className="block text-sm font-bold">Value</label>
          <input id="unit-value" value={value} onChange={(event) => setValue(event.target.value)} inputMode="decimal" className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-base outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
        </div>
        <button type="button" onClick={swap} className="min-h-11 rounded-md border border-[#bcb8ae] px-4 text-sm font-bold hover:border-[#171717]" aria-label="Swap units">Swap</button>
        <div>
          <label htmlFor="unit-from" className="block text-sm font-bold">From</label>
          <select id="unit-from" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]">
            {options.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5 border border-[#171717] bg-[#c8f169] p-5" aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Result</p>
        <p className="mt-2 break-all text-3xl font-black">{result === null ? "—" : formatNumber(result)}</p>
      </div>

      <div className="mt-5">
        <label htmlFor="unit-to" className="block text-sm font-bold">Convert to</label>
        <select id="unit-to" value={to} onChange={(event) => setTo(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-4 text-sm outline-none focus:border-[#171717]">
          {options.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
        </select>
      </div>
      <p className="mt-6 text-xs leading-5 text-black/45">Conversions use standard measurement relationships. Results are rounded for readability.</p>
    </div>
  );
}
