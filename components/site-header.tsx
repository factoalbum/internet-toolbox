import Link from "next/link";
import { Search } from "lucide-react";
import CategorySidebar from "@/components/category-sidebar";
import { categories } from "@/lib/tools";

type SiteHeaderProps = { sticky?: boolean };

export default function SiteHeader({ sticky = false }: SiteHeaderProps) {
  return (
    <header className={`${sticky ? "sticky top-0 z-40 " : ""}border-b border-[#dedbd3] bg-[#fffdf8]/95 backdrop-blur`}>
      <div className="container flex min-h-[68px] items-center gap-4">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-md focus:outline-none focus:ring-4 focus:ring-[#c8f169]" aria-label="Internet Toolbox home">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[#171717] text-[11px] font-black tracking-tight text-white" aria-hidden="true">IT</span>
          <span className="truncate text-[15px] font-extrabold tracking-[-0.02em]">Internet Toolbox</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label="Tool categories">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`} className="rounded-md px-3 py-2 text-xs font-semibold text-black/55 transition hover:bg-[#f3f0e8] hover:text-[#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]">
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link href="/tools" aria-label="Search and browse all tools" className="hidden size-10 items-center justify-center rounded-md border border-[#dedbd3] bg-white text-black/55 transition hover:border-[#171717] hover:text-[#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169] sm:flex">
            <Search size={17} aria-hidden="true" />
          </Link>
          <Link href="/tools" className="hidden rounded-md bg-[#171717] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-black/80 focus:outline-none focus:ring-4 focus:ring-[#c8f169] sm:inline-flex">All tools</Link>
          <CategorySidebar />
        </div>
      </div>
    </header>
  );
}
