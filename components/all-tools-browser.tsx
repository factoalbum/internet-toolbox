"use client";

import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, tools } from "@/lib/tools";
import { searchAliases } from "@/components/tool-search";

export default function AllToolsBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const aliases = searchAliases[q] ?? [];
    const words = q.split(/\s+/).filter(Boolean);
    const terms = q ? [q, ...aliases, ...words] : [];
    return tools
      .map((tool) => {
        if (category !== "all" && tool.category !== category) return { tool, score: -1 };
        if (!q) return { tool, score: 0 };
        const haystack = `${tool.name} ${tool.slug.replaceAll("-", " ")} ${tool.description} ${tool.category}`.toLowerCase();
        const score = terms.reduce((total, term) => total + (haystack.includes(term) ? (term === q ? 4 : 1) : 0), 0);
        return { tool, score };
      })
      .filter(({ score }) => score >= 0 && (!q || score > 0))
      .sort((a, b) => b.score - a.score)
      .map(({ tool }) => tool);
  }, [query, category]);

  const clearFilters = () => { setQuery(""); setCategory("all"); };

  return <div className="min-w-0">
    <div className="grid min-w-0 gap-3">
      <div className="flex min-h-12 min-w-0 items-center gap-3 rounded-xl border border-[#d8d4c9] bg-[#fffdf8] px-4 transition focus-within:border-[#171717] focus-within:ring-4 focus-within:ring-[#c8f169]">
        <Search size={18} className="shrink-0 text-black/40" aria-hidden="true" />
        <label htmlFor="all-tools-search" className="sr-only">Search all tools</label>
        <input id="all-tools-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by tool or task" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/35" autoComplete="off" enterKeyHint="search" aria-controls="all-tools-results" />
        {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="flex size-8 shrink-0 items-center justify-center rounded-lg text-black/40 hover:bg-black/5 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#c8f169]"><X size={16} /></button>}
      </div>

      <div className="flex min-w-0 items-center gap-2" aria-label="Filter tools by category" role="group">
        <SlidersHorizontal size={15} className="ml-1 shrink-0 text-black/35" aria-hidden="true" />
        <div className="scrollbar-none flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 pt-1">
          <button type="button" onClick={() => setCategory("all")} aria-pressed={category === "all"} className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-bold transition ${category === "all" ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#fffdf8] hover:border-[#171717]"} focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]`}>All tools</button>
          {categories.map((item) => <button key={item.slug} type="button" onClick={() => setCategory(item.slug)} aria-pressed={category === item.slug} className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-bold transition ${category === item.slug ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#fffdf8] hover:border-[#171717]"} focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169]`}>{item.name}</button>)}
        </div>
      </div>
    </div>

    <div className="mt-6 flex items-center justify-between gap-3">
      <p className="text-sm text-black/45" aria-live="polite">Showing {filtered.length} {filtered.length === 1 ? "tool" : "tools"}{query.trim() ? ` matching "${query.trim()}"` : ""}.</p>
      {(query || category !== "all") && <button type="button" onClick={clearFilters} className="shrink-0 rounded-md px-1 text-xs font-bold text-black/55 underline decoration-black/20 underline-offset-4 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#c8f169]">Clear filters</button>}
    </div>

    {filtered.length === 0 ? <div id="all-tools-results" className="mt-5 border border-dashed border-[#bcb8ae] bg-[#fffdf8] px-6 py-12 text-center" role="status"><h2 className="font-bold">No matching tools</h2><p className="mt-2 text-sm text-black/50">Try a broader search such as tax, loan, date, PDF or text.</p><button type="button" onClick={clearFilters} className="mt-5 min-h-11 rounded-lg bg-[#171717] px-5 text-sm font-bold text-white hover:bg-black/80 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Show all tools</button></div> : <div id="all-tools-results" className="mt-5 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">{filtered.map((tool) => { const Icon = tool.icon; const live = tool.status === "live"; const content = <><div className="flex items-start justify-between gap-2"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#e9f4cf] text-[#425515]"><Icon size={17} className="sm:hidden" aria-hidden="true" /><Icon size={19} className="hidden sm:block" aria-hidden="true" /></span><span className={`font-mono text-[8px] font-bold uppercase tracking-[0.12em] sm:text-[10px] sm:tracking-[0.14em] ${live ? "text-[#6d8e25]" : "text-black/30"}`}>{live ? "Live" : "Coming soon"}</span></div><h2 className="mt-auto pt-3 break-words text-xs font-bold leading-4 sm:mt-5 sm:pt-0 sm:text-base sm:leading-normal">{tool.name}</h2><p className="mt-1 line-clamp-2 break-words text-[10px] leading-4 text-black/50 sm:mt-2 sm:text-sm sm:leading-6">{tool.description}</p><span className={`mt-2 inline-flex items-center gap-1 text-[9px] font-bold sm:mt-5 sm:text-xs ${live ? "text-black" : "text-black/35"}`}>{live ? "Open tool" : "Coming soon"}{live && <ArrowRight size={11} className="transition group-hover:translate-x-0.5 sm:size-[13px]" />}</span></>;
      return live ? <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group min-w-0 rounded-2xl border border-[#e1ded6] bg-white p-3.5 aspect-square hover:-translate-y-0.5 hover:border-[#171717] hover:shadow-[0_8px_24px_rgba(23,23,23,.07)] focus:outline-none focus:ring-4 focus:ring-[#c8f169] sm:aspect-auto sm:p-5">{content}</Link> : <div key={tool.slug} aria-label={`${tool.name}, coming soon`} className="min-w-0 rounded-2xl border border-[#e1ded6] bg-[#f2f0ea] p-3.5 aspect-square sm:aspect-auto sm:p-5">{content}</div>; })}</div>}
  </div>;
}
