"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="container flex min-h-[60vh] items-center py-16">
      <section className="mx-auto w-full max-w-xl text-center" aria-labelledby="error-title">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-black/45">Internet Toolbox</p>
        <h1 id="error-title" className="text-3xl font-black tracking-tight sm:text-4xl">Something went wrong.</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-black/60">
          The page hit an unexpected problem. Try again, or head back to the toolbox and continue from there.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-[#d8d4c9] bg-[#fffdf8] px-5 py-3 text-sm font-bold transition hover:bg-[#e8e4d9] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
