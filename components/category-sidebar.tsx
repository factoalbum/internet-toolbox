"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { categories } from "@/lib/tools";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CategorySidebar() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const drawer = mounted && open
    ? createPortal(
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Tool categories">
          <button
            type="button"
            aria-label="Close categories"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/40"
          />

          <aside className="absolute right-0 top-0 flex h-dvh w-[min(92vw,400px)] max-w-full flex-col overflow-hidden border-l border-[#d8d4c9] bg-[#fffdf8] text-[#171717] shadow-[-16px_0_48px_rgba(0,0,0,.16)]">
            <div className="flex shrink-0 items-center justify-between border-b border-[#d8d4c9] px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-black/35">Internet Toolbox</p>
                <h2 className="mt-1 text-xl font-black tracking-tight">Browse categories</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close categories"
                className="ml-3 flex size-10 shrink-0 items-center justify-center rounded-md border border-[#d8d4c9] transition hover:border-[#171717] hover:bg-[#f3f0e8] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5" aria-label="Tool categories">
              <Link
                href="/tools"
                onClick={() => setOpen(false)}
                className="group mb-4 flex min-h-12 items-center justify-between border border-[#171717] bg-[#171717] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#303030] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
              >
                <span>All tools</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>

              <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-black/35">Categories</p>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex min-h-16 items-start gap-3 border border-[#d8d4c9] bg-[#f3f0e8] p-4 transition hover:border-[#171717] hover:bg-[#c8f169] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#fffdf8]">
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">{category.name}</span>
                        <span className="mt-1 block text-xs leading-5 text-black/50">{category.description}</span>
                      </span>
                      <ArrowRight size={15} className="mt-0.5 shrink-0 text-black/25 transition group-hover:translate-x-1 group-hover:text-black" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="shrink-0 border-t border-[#d8d4c9] bg-[#fffdf8] p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/55">
                <Link href="/about" onClick={() => setOpen(false)} className="min-h-11 border border-[#d8d4c9] p-3 transition hover:border-[#171717] hover:text-[#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">About</Link>
                <Link href="/support" onClick={() => setOpen(false)} className="min-h-11 border border-[#d8d4c9] p-3 transition hover:border-[#171717] hover:text-[#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Support</Link>
              </div>
            </div>
          </aside>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open categories"
        aria-expanded={open}
        className="flex size-10 shrink-0 items-center justify-center rounded-md border border-[#d8d4c9] bg-[#fffdf8] text-[#171717] transition hover:border-[#171717] hover:bg-[#c8f169] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
      >
        <Menu size={21} aria-hidden="true" />
      </button>
      {drawer}
    </>
  );
}
