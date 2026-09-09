"use client";

import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { featuredTools, tools } from "@/lib/tools";

const searchAliases: Record<string, string[]> = {
  loan: ["emi", "finance"],
  mortgage: ["emi", "loan"],
  tax: ["income tax", "gst"],
  salary: ["salary", "income"],
  interest: ["emi", "fd", "sip", "compound"],
  investment: ["sip", "ppf", "fd", "interest"],
  money: ["currency", "salary", "gst", "emi"],
  photo: ["image", "compress"],
  picture: ["image", "compress"],
  file: ["image", "compress"],
  text: ["word", "character", "case"],
  coding: ["json", "base64", "uuid", "url", "html"],
  developer: ["json", "base64", "uuid", "url", "timestamp"],
};

export default function ToolSearch() {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
    if (!normalized) return featuredTools.slice(0, 6);

    const terms = [normalized, ...(searchAliases[normalized] ?? [])];
    return tools.filter((tool) => {
      const haystack = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();
      return terms.some((term) => haystack.includes(term));
    }).slice(0, 6);
  }, [query]);

  const showResults = focused || Boolean(query);

  function clearSearch() {
    setQuery("");
    setActiveIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      clearSearch();
      inputRef.current?.focus();
      return;
    }
    if (matches.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % matches.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + matches.length) % matches.length);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      router.push(`/tools/${matches[activeIndex].slug}`);
      clearSearch();
    }
  }

  return (
    <div className="relative" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
      <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-2">
        <label htmlFor="tool-search" className="sr-only">Search tools</label>
        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[#fffdf8] px-4 py-3.5 text-[#171717] transition focus-within:ring-4 focus-within:ring-[#5f7429]/15">
          <Search className="shrink-0 text-black/45" size={20} aria-hidden="true" />
          <input ref={inputRef} id="tool-search" value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(-1); }} onFocus={() => setFocused(true)} onKeyDown={handleKeyDown} placeholder="Search tools or tasks" className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-black/35" autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={showResults} aria-controls="tool-search-results" aria-activedescendant={activeIndex >= 0 ? `tool-result-${matches[activeIndex]?.slug}` : undefined} />
          {query ? <button type="button" onClick={clearSearch} className="shrink-0 rounded-md p-1 text-black/40 transition hover:bg-black/5 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#c8f169]" aria-label="Clear search"><X size={16} /></button> : <kbd className="hidden shrink-0 rounded-md bg-black/5 px-2 py-1 font-mono text-[10px] text-black/40 sm:block">⌘ K</kbd>}
        </div>
      </div>

      {showResults && <div id="tool-search-results" role="listbox" aria-label={query ? "Tool search results" : "Popular tools"} className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[min(60vh,420px)] overflow-y-auto border border-[#d8d4c9] bg-[#fffdf8] text-[#171717] shadow-[8px_8px_0_#171717]">
        {matches.length > 0 ? <>
          {!query && <div className="border-b border-[#e8e4d9] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-black/35">Popular tools</div>}
          <div className="divide-y divide-[#e8e4d9]">{matches.map((tool, index) => { const Icon = tool.icon; return <Link key={tool.slug} id={`tool-result-${tool.slug}`} role="option" aria-selected={index === activeIndex} href={`/tools/${tool.slug}`} onMouseEnter={() => setActiveIndex(index)} onClick={() => { clearSearch(); setFocused(false); }} className={`group flex min-w-0 items-center gap-4 p-4 transition ${index === activeIndex ? "bg-[#c8f169]" : "hover:bg-[#c8f169]"}`}><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#edf7d5]"><Icon size={17} aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{tool.name}</span><span className="block truncate text-xs text-black/45">{tool.description}</span></span><ArrowUpRight size={16} className="shrink-0 opacity-30" aria-hidden="true" /></Link>; })}</div>
        </> : <div className="p-5"><p className="font-bold">No tool found</p><p className="mt-1 text-sm text-black/45">Try loan, tax, image, JSON or date.</p></div>}
      </div>}
    </div>
  );
}
