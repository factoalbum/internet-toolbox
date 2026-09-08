"use client";

import { useMemo, useState } from "react";

function clamp(value: number, min = 0, max = 255) {
  return Math.min(max, Math.max(min, value));
}

function componentToHex(value: number) {
  return Math.round(clamp(value)).toString(16).padStart(2, "0");
}

function parseHex(value: string): [number, number, number] | null {
  const clean = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return clean.split("").map((char) => parseInt(char + char, 16)) as [number, number, number];
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
  }
  return null;
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  if (max === min) return [0, 0, lightness * 100] as [number, number, number];
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;
  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;
  return [hue * 60, saturation * 100, lightness * 100] as [number, number, number];
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#5f7429");
  const [r, setR] = useState("95");
  const [g, setG] = useState("116");
  const [b, setB] = useState("41");
  const [error, setError] = useState("");

  const color = useMemo(() => parseHex(hex), [hex]);
  const hsl = color ? rgbToHsl(...color) : null;

  const updateFromHex = (value: string) => {
    setHex(value);
    const parsed = parseHex(value);
    if (!parsed) {
      setError("Enter a valid 3- or 6-digit hex color.");
      return;
    }
    setError("");
    setR(String(parsed[0]));
    setG(String(parsed[1]));
    setB(String(parsed[2]));
  };

  const updateFromRgb = (channel: "r" | "g" | "b", value: string) => {
    const next = { r, g, b, [channel]: value };
    if (channel === "r") setR(value);
    if (channel === "g") setG(value);
    if (channel === "b") setB(value);
    const red = Number(next.r);
    const green = Number(next.g);
    const blue = Number(next.b);
    if ([red, green, blue].every((item) => Number.isFinite(item) && item >= 0 && item <= 255)) {
      setHex(`#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`);
      setError("");
    } else {
      setError("RGB values must be between 0 and 255.");
    }
  };

  const normalizedHex = color ? `#${componentToHex(color[0])}${componentToHex(color[1])}${componentToHex(color[2])}`.toUpperCase() : "";
  const rgbText = color ? `rgb(${color[0]}, ${color[1]}, ${color[2]})` : "";
  const hslText = hsl ? `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1])}%, ${Math.round(hsl[2])}%)` : "";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="border border-[#d8d4c9] bg-[#fffdf8] p-6 md:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold">HEX</span>
            <input value={hex} onChange={(event) => updateFromHex(event.target.value)} spellCheck={false} className="h-12 w-full border border-[#bcb8ae] bg-white px-3 font-mono text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" placeholder="#5f7429" />
          </label>
          {[['Red', 'r', r], ['Green', 'g', g], ['Blue', 'b', b]].map(([label, channel, value]) => (
            <label key={channel as string} className="block">
              <span className="mb-2 block text-sm font-semibold">{label as string}</span>
              <input type="number" min="0" max="255" value={value as string} onChange={(event) => updateFromRgb(channel as "r" | "g" | "b", event.target.value)} className="h-12 w-full border border-[#bcb8ae] bg-white px-3 font-mono text-sm outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#c8f169]" />
            </label>
          ))}
        </div>
        {error && <p className="mt-4 text-sm font-medium text-red-700" role="alert">{error}</p>}
        <div className="mt-8 border-t border-[#d8d4c9] pt-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/40">Conversions</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[['HEX', normalizedHex], ['RGB', rgbText], ['HSL', hslText]].map(([label, value]) => (
              <div key={label} className="border border-[#d8d4c9] bg-[#f3f0e8] p-4"><p className="text-xs font-bold text-black/45">{label}</p><p className="mt-2 break-all font-mono text-sm">{value || "—"}</p></div>
            ))}
          </div>
        </div>
      </div>
      <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-black/40">Preview</p>
        <div className="mt-4 aspect-square border border-[#d8d4c9]" style={{ backgroundColor: color ? normalizedHex : "transparent" }} aria-label={color ? `Color preview for ${normalizedHex}` : "Invalid color preview"} />
        <p className="mt-4 text-xs leading-5 text-black/50">Everything is processed in your browser. No color values are uploaded.</p>
      </div>
    </div>
  );
}
