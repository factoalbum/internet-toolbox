"use client";

import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { tools } from "@/lib/tools";

export default function ToolSearch() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return tools
      .filter((tool) => `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [query]);

  return (
    <div className="relative">
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-2">
        <label htmlFor="tool-search" className="sr-only">Search tools</label>
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-[#171717] ring-0 transition focus-within:ring-4 focus-within:ring-[#c8f169]/30">
          <Search className="shrink-0 text-black/45" size={20} />
          <input
            ref={inputRef}
            id="tool-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a tool…"
            className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-black/35"
            autoComplete="off"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} className="rounded-md p-1 text-black/40 transition hover:bg-black/5 hover:text-black" aria-label="Clear search">
              <X size={16} />
            </button>
          ) : (
            <kbd className="hidden rounded-md bg-black/5 px-2 py-1 font-mono text-[10px] text-black/40 sm:block">⌘ K</kbd>
          )}
        </div>
      </div>

      {query && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden border border-[#d8d4c9] bg-[#fffdf8] text-[#171717] shadow-[8px_8px_0_#171717]">
          {matches.length > 0 ? (
            <div className="divide-y divide-[#e8e4d9]">
              {matches.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} onClick={() => setQuery("")} className="group flex items-center gap-4 p-4 transition hover:bg-[#c8f169]">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#edf7d5]"><Icon size={17} /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{tool.name}</span><span className="block truncate text-xs text-black/45">{tool.description}</span></span>
                    <ArrowUpRight size={16} className="shrink-0 opacity-30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-5"><p className="font-bold">No tool found.</p><p className="mt-1 text-sm text-black/45">Try a different keyword like “JSON”, “date” or “text”.</p></div>
          )}
        </div>
      )}
    </div>
  );
}
