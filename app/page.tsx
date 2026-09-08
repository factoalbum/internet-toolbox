import { ArrowRight, Search, Sparkles } from "lucide-react";
import { categories, featuredTools } from "@/lib/tools";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="Internet Toolbox home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white"><Sparkles size={18} /></span>
            <span>Internet Toolbox</span>
          </a>
          <a href="#tools" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">Browse tools</a>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="container py-20 text-center md:py-28">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            <Sparkles size={14} /> Simple tools. Zero friction.
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Useful tools for everyday digital tasks.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Calculate, convert, clean, format and create — without signups, complicated interfaces or unnecessary steps.
          </p>

          <div className="mx-auto mt-9 max-w-2xl">
            <label htmlFor="tool-search" className="sr-only">Search tools</label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm ring-4 ring-slate-100">
              <Search className="shrink-0 text-slate-400" size={21} />
              <input id="tool-search" placeholder="What do you need to do?" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400" />
              <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-400 sm:block">⌘ K</kbd>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="container py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Start here</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Popular tools</h2>
          </div>
          <span className="text-sm text-slate-500">More coming soon</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700">
                    <Icon size={21} />
                  </span>
                  <ArrowRight size={18} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />
                </div>
                <h3 className="mt-5 font-semibold text-slate-950">{tool.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{tool.description}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="container py-16 md:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Explore</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Find the right tool for the job</h2>
            <p className="mt-3 leading-7 text-slate-600">Everything is organized by the kind of problem you are trying to solve.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <a key={category.slug} href={`/categories/${category.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
                  <Icon size={21} className="text-slate-700" />
                  <h3 className="mt-4 font-semibold text-slate-950">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{category.description}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ["Fast by design", "Lightweight tools built to get you from question to answer quickly."],
            ["No unnecessary friction", "Useful tools should be understandable the moment you open them."],
            ["Built for everyone", "Clear language, responsive layouts and accessible controls across devices."],
          ].map(([title, text]) => (
            <div key={title}>
              <h2 className="font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="container flex flex-col gap-3 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Internet Toolbox</p>
          <p>Simple tools. Zero friction.</p>
        </div>
      </footer>
    </main>
  );
}
