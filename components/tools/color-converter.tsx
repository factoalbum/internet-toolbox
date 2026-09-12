"use client";

import { Check, Clipboard, Palette, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

function clamp(value: number, min = 0, max = 255) {
  return Math.min(max, Math.max(min, value));
}

function componentToHex(value: number) {
  return Math.round(clamp(value)).toString(16).padStart(2, "0");
}

function parseHex(value: string): [number, number, number] | null {
  const clean = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(clean)) return clean.split("").map((char) => parseInt(char + char, 16)) as [number, number, number];
  if (/^[0-9a-fA-F]{6}$/.test(clean)) return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
  return null;
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255, green = g / 255, blue = b / 255;
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue);
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

const focusRing = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";
const colorPresets = ["#171717", "#c8f169", "#315fba", "#e07a5f", "#8b5cf6"];

export default function ColorConverter() {
  const [hex, setHex] = useState("#5f7429");
  const [r, setR] = useState("95");
  const [g, setG] = useState("116");
  const [b, setB] = useState("41");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const color = useMemo(() => parseHex(hex), [hex]);
  const hsl = color ? rgbToHsl(...color) : null;
  const normalizedHex = color ? `#${componentToHex(color[0])}${componentToHex(color[1])}${componentToHex(color[2])}`.toUpperCase() : "";
  const rgbText = color ? `rgb(${color[0]}, ${color[1]}, ${color[2]})` : "";
  const hslText = hsl ? `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1])}%, ${Math.round(hsl[2])}%)` : "";

  const updateFromHex = (value: string) => {
    setHex(value);
    const parsed = parseHex(value);
    if (!parsed) { setError("Enter a valid 3- or 6-digit hex color."); return; }
    setError(""); setR(String(parsed[0])); setG(String(parsed[1])); setB(String(parsed[2]));
  };

  const updateFromRgb = (channel: "r" | "g" | "b", value: string) => {
    const next = { r, g, b, [channel]: value };
    if (channel === "r") setR(value); if (channel === "g") setG(value); if (channel === "b") setB(value);
    const red = Number(next.r), green = Number(next.g), blue = Number(next.b);
    if ([red, green, blue].every((item) => Number.isFinite(item) && item >= 0 && item <= 255)) {
      setHex(`#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`); setError("");
    } else setError("RGB values must be between 0 and 255.");
  };

  const applyPreset = (value: string) => updateFromHex(value);
  const reset = () => { setHex("#5f7429"); setR("95"); setG("116"); setB("41"); setError(""); setCopied(""); };
  const copyValue = async (label: string, value: string) => {
    if (!value || !navigator.clipboard) return;
    try { await navigator.clipboard.writeText(value); setCopied(label); window.setTimeout(() => setCopied(""), 1400); } catch { setCopied(""); }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.045)]">
      <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f4e8ff] text-[#7042a8]" aria-hidden="true"><Palette size={20} /></span>
            <div className="min-w-0"><p className="font-bold">Convert color values</p><p className="mt-1 text-sm leading-5 text-black/50">Enter HEX or RGB and get matching HEX, RGB, and HSL values.</p></div>
          </div>
          <button type="button" onClick={reset} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d8d4c9] bg-white px-3 text-sm font-bold text-black/55 transition hover:border-[#171717] hover:text-black ${focusRing}`} aria-label="Reset color converter"><RotateCcw size={16}/><span className="hidden sm:inline">Reset</span></button>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:p-7 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block sm:col-span-3 rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
              <span className="text-sm font-bold">HEX color</span><span className="mt-1 block text-xs leading-5 text-black/40">Use 3 or 6 hexadecimal digits, with or without #.</span>
              <input value={hex} onChange={(event) => updateFromHex(event.target.value)} spellCheck={false} aria-invalid={Boolean(error)} className={`mt-3 h-14 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-4 font-mono text-lg font-bold uppercase outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} placeholder="#5F7429" />
            </label>
            {([['Red','r',r],['Green','g',g],['Blue','b',b]] as const).map(([label, channel, value]) => (
              <label key={channel} className="block rounded-2xl border border-[#e2dfd7] bg-white p-4 transition focus-within:border-[#171717] focus-within:shadow-[0_0_0_4px_rgb(200_241_105_/_35%)]">
                <span className="text-sm font-bold">{label}</span><span className="mt-1 block text-xs text-black/40">0–255</span>
                <input type="number" min="0" max="255" inputMode="numeric" value={value} onChange={(event) => updateFromRgb(channel, event.target.value)} aria-label={`${label} RGB value`} className={`mt-3 h-12 w-full rounded-xl border border-[#bcb8ae] bg-[#fffdf8] px-3 font-mono text-base font-bold outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${focusRing}`} />
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-[#e2dfd7] bg-[#f4f1e9] p-4">
            <div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.14em] text-black/45">Quick colors</p><span className="text-xs text-black/40">Tap to use</span></div>
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Color presets">
              {colorPresets.map((preset) => <button key={preset} type="button" onClick={() => applyPreset(preset)} className={`size-11 rounded-xl border border-[#d8d4c9] shadow-sm transition hover:-translate-y-0.5 hover:border-[#171717] ${focusRing}`} style={{ backgroundColor: preset }} aria-label={`Use color ${preset}`} />)}
            </div>
          </div>

          {error && <p className="mt-4 rounded-xl border border-[#ead7d2] bg-[#fff7f5] p-4 text-sm leading-6 text-[#7b3d31]" role="alert">{error}</p>}

          <section className="mt-6" aria-labelledby="color-conversions-heading">
            <div className="flex items-center justify-between gap-3"><h2 id="color-conversions-heading" className="text-xs font-black uppercase tracking-[.14em] text-black/45">Conversions</h2><span className="text-xs text-black/40">Copy any value</span></div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {([['HEX', normalizedHex], ['RGB', rgbText], ['HSL', hslText]] as const).map(([label, value]) => <div key={label} className="rounded-2xl border border-[#d8d4c9] bg-white p-4">
                <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-black/45">{label}</p><button type="button" onClick={() => copyValue(label, value)} disabled={!value} className={`flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-[#d8d4c9] text-black/55 transition hover:border-[#171717] hover:text-black disabled:cursor-not-allowed disabled:opacity-35 ${focusRing}`} aria-label={`Copy ${label} value`}>{copied === label ? <Check size={16}/> : <Clipboard size={16}/>}</button></div>
                <p className="mt-3 break-all font-mono text-sm font-bold">{value || "—"}</p>
              </div>)}
            </div>
          </section>
        </div>

        <aside className="rounded-2xl border border-[#d8d4c9] bg-white p-5">
          <div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.14em] text-black/45">Preview</p><span className="text-xs text-black/40">Live</span></div>
          <div className="mt-4 aspect-square rounded-2xl border border-[#d8d4c9] shadow-inner" style={{ backgroundColor: color ? normalizedHex : "transparent" }} role="img" aria-label={color ? `Color preview for ${normalizedHex}` : "Invalid color preview"} />
          <div className="mt-4 rounded-xl bg-[#f4f1e9] p-3"><p className="text-xs font-bold text-black/45">Current color</p><p className="mt-1 break-all font-mono text-sm font-black">{normalizedHex || "Invalid"}</p></div>
          <p className="mt-4 text-xs leading-5 text-black/50">Everything is processed in your browser. Your color values are not uploaded.</p>
        </aside>
      </div>
    </div>
  );
}
