"use client";

import { useMemo, useState } from "react";
import { convertLocalDateTime } from "../../lib/time-zone";

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

function defaultDateTime() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

export default function TimeZoneConverter() {
  const [value, setValue] = useState(defaultDateTime);
  const [from, setFrom] = useState("Asia/Kolkata");
  const [to, setTo] = useState("America/New_York");

  const result = useMemo(() => convertLocalDateTime(value, from, to), [value, from, to]);

  return (
    <div className="border border-[#d8d4c9] bg-[#fffdf8] p-5 md:p-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="timezone-date" className="block text-sm font-bold">Date and time</label>
          <input id="timezone-date" type="datetime-local" value={value} onChange={(event) => setValue(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40" />
        </div>
        <div>
          <label htmlFor="timezone-from" className="block text-sm font-bold">From</label>
          <select id="timezone-from" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40">
            {zones.map((zone) => <option key={zone.value} value={zone.value}>{zone.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="timezone-to" className="block text-sm font-bold">Convert to</label>
          <select id="timezone-to" value={to} onChange={(event) => setTo(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border border-[#bcb8ae] bg-white px-3 text-sm outline-none focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169]/40">
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
