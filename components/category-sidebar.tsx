"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { categories } from "@/lib/tools";

export default function CategorySidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open categories"
        aria-expanded={open}
        className="flex size-10 items-center justify-center rounded-md border border-[#d8d4c9] bg-[#fffdf8] text-[#171717] transition hover:border-[#171717] hover:bg-[#c8f169] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
      >
        <Menu size={21} aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Tool categories">
          <button
            type="button"
            aria-label="Close categories"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/35"
          />
          <aside className="absolute right-0 top-0 flex h-full w-[min(88vw,380px)] flex-col border-l border-[#d8d4c9] bg-[#fffdf8] text-[#171717] shadow-[-12px_0_40px_rgba(0,0,0,.12)]">
            <div className="flex items-center justify-between border-b border-[#d8d4c9] px-5 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/35">Internet Toolbox</p>
                <h2 className="mt-1 text-xl font-black tracking-tight">Browse categories</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close categories"
                className="flex size-9 items-center justify-center rounded-md border border-[#d8d4c9] transition hover:border-[#171717] hover:bg-[#f3f0e8] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4" aria-label="Tool categories">
              <Link
                href="/tools"
                onClick={() => setOpen(false)}
                className="group mb-3 flex items-center justify-between border border-[#171717] bg-[#171717] px-4 py-4 text-sm font-bold text-white transition hover:bg-[#303030]"
              >
                <span>All tools</span>
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>

              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-black/35">Categories</p>
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 border border-[#d8d4c9] bg-[#f3f0e8] p-4 transition hover:border-[#171717] hover:bg-[#c8f169] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#fffdf8]">
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">{category.name}</span>
                        <span className="mt-0.5 block text-xs leading-4 text-black/45">{category.description}</span>
                      </span>
                      <ArrowRight size={15} className="shrink-0 text-black/25 transition group-hover:translate-x-1 group-hover:text-black" />
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-[#d8d4c9] p-4">
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/55">
                <Link href="/about" onClick={() => setOpen(false)} className="border border-[#d8d4c9] p-3 transition hover:border-[#171717] hover:text-[#171717]">About</Link>
                <Link href="/support" onClick={() => setOpen(false)} className="border border-[#d8d4c9] p-3 transition hover:border-[#171717] hover:text-[#171717]">Support</Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
