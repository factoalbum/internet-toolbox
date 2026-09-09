"use client";

import { useMemo, useState } from "react";

type Zone = { value: string; label: string };

const zones: Zone[] = [
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Riyadh", label: "Riyadh (AST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Kathmandu", label: "Kathmandu (NPT)" },
  { value: "Europe/London", label: "London (UK)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "America/Chicago", label: "Chicago (CT)" },
  { value: "America/Denver", label: "Denver (MT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { value: "Australia/Sydney", label: "Sydney (AET)" },
];

function partsFor(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
}

function offsetAt(date: Date, timeZone: string) {
  const parts = partsFor(date, timeZone);
  const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
  return asUtc - date.getTime();
}

function localTimeToInstant(value: string, timeZone: string) {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const wallTime = Date.UTC(year, month - 1, day, hour, minute, 0);
  let instant = new Date(wallTime - offsetAt(new Date(wallTime), timeZone));
  const correctedOffset = offsetAt(instant, timeZone);
  if (correctedOffset !== offsetAt(new Date(wallTime), timeZone)) instant = new Date(wallTime - correctedOffset);
  return instant;
}

function formatResult(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function defaultDateTime() {
  const now = new Date();
  const parts = partsFor(now, "Asia/Kolkata");
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export default function TimeZoneConverter() {
  const [value, setValue] = useState(defaultDateTime);
  const [from, setFrom] = useState("Asia/Kolkata");
  const [to, setTo] = useState("America/New_York");

  const result = useMemo(() => {
    if (!value) return null;
    const instant = localTimeToInstant(value, from);
    return Number.isNaN(instant.getTime()) ? null : formatResult(instant, to);
  }, [value, from, to]);

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="timezone-date" className="block text-sm font-bold">Date and time</label>
          <input id="timezone-date" type="datetime-local" value={value} onChange={(event) => setValue(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
        </div>
        <div>
          <label htmlFor="timezone-from" className="block text-sm font-bold">From</label>
          <select id="timezone-from" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717]">
            {zones.map((zone) => <option key={zone.value} value={zone.value}>{zone.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="timezone-to" className="block text-sm font-bold">Convert to</label>
          <select id="timezone-to" value={to} onChange={(event) => setTo(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717]">
            {zones.map((zone) => <option key={zone.value} value={zone.value}>{zone.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5 border border-[#171717] bg-[#c8f169] p-5" aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Converted time</p>
        <p className="mt-2 break-words text-2xl font-black md:text-3xl">{result || "Enter a date and time"}</p>
      </div>

      <p className="mt-6 text-xs leading-5 text-black/45">Uses your selected IANA time zones and accounts for daylight saving changes where applicable. The conversion runs in your browser.</p>
    </div>
  );
}
