"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="container flex min-h-[60vh] items-center py-16 sm:py-20">
      <section className="mx-auto w-full max-w-xl rounded-3xl border border-[#dedbd3] bg-white p-7 text-center shadow-[0_16px_45px_rgb(23_23_23_/6%)] sm:p-10" aria-labelledby="error-title" role="alert">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#e9f4cf] text-lg font-black text-[#171717]" aria-hidden="true">!</div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-black/45">Internet Toolbox</p>
        <h1 id="error-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Something went wrong.</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-black/60">
          The page hit an unexpected problem. Try again, or head back to the toolbox and continue from there.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="min-h-11 rounded-xl bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="flex min-h-11 items-center justify-center rounded-xl border border-[#d8d4c9] bg-[#fffdf8] px-5 py-3 text-sm font-bold transition hover:bg-[#e8e4d9] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
