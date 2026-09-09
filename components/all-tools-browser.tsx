"use client";
import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, tools } from "@/lib/tools";

export default function AllToolsBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (category !== "all" && tool.category !== category) return false;
      return !q || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(q);
    });
  }, [query, category]);

  const clearFilters = () => { setQuery(""); setCategory("all"); };

  return <div>
    <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="flex items-center gap-3 rounded-xl border border-[#d8d4c9] bg-[#fffdf8] px-4 py-3 focus-within:border-[#171717] focus-within:ring-4 focus-within:ring-[#5f7429]/10">
        <Search size={18} className="shrink-0 text-black/40" aria-hidden="true" />
        <label htmlFor="all-tools-search" className="sr-only">Search all tools</label>
        <input id="all-tools-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search calculators, converters, text tools…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/35" autoComplete="off" />
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Filter tools by category">
        <button type="button" onClick={() => setCategory("all")} aria-pressed={category === "all"} className={`min-h-10 rounded-full border px-4 text-xs font-bold ${category === "all" ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#fffdf8]"}`}>All</button>
        {categories.map((item) => <button key={item.slug} type="button" onClick={() => setCategory(item.slug)} aria-pressed={category === item.slug} className={`min-h-10 rounded-full border px-4 text-xs font-bold ${category === item.slug ? "border-[#171717] bg-[#171717] text-white" : "border-[#d8d4c9] bg-[#fffdf8]"}`}>{item.name}</button>)}
      </div>
    </div>
    <p className="mb-5 text-sm text-black/45" aria-live="polite">Showing {filtered.length} {filtered.length === 1 ? "tool" : "tools"}{query.trim() ? ` matching “${query.trim()}”` : ""}.</p>
    {filtered.length === 0 ? <div className="border border-dashed border-[#bcb8ae] bg-[#fffdf8] px-6 py-12 text-center" role="status"><h2 className="font-bold">No matching tools</h2><p className="mt-2 text-sm text-black/50">Try a broader search such as “tax”, “loan”, “date” or “text”.</p><button type="button" onClick={clearFilters} className="mt-5 min-h-11 rounded-lg bg-[#171717] px-5 text-sm font-bold text-white hover:bg-black/80 focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Clear search and filters</button></div> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((tool) => { const Icon = tool.icon; const live = tool.status === "live"; return <Link key={tool.slug} href={`/tools/${tool.slug}`} className={`group border p-5 transition ${live ? "border-[#171717] bg-[#fffdf8] hover:-translate-y-1 hover:shadow-[7px_7px_0_#c8f169] focus:outline-none focus:ring-4 focus:ring-[#c8f169]" : "border-[#d8d4c9] bg-[#ebe7dc]"}`}><div className="flex items-start justify-between"><span className="flex size-10 items-center justify-center rounded-lg bg-[#edf7d5]"><Icon size={19} aria-hidden="true" /></span><span className={`font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${live ? "text-[#5b8b17]" : "text-black/30"}`}>{live ? "Live" : "Soon"}</span></div><h2 className="mt-6 font-bold">{tool.name}</h2><p className="mt-2 text-sm leading-6 text-black/50">{tool.description}</p><span className="mt-5 inline-flex text-xs font-bold uppercase tracking-[0.12em]">{live ? "Open tool" : "Preview"}</span></Link>})}</div>}
  </div>;
}
