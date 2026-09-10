export default function Loading() {
  return (
    <main className="container flex min-h-[50vh] items-center justify-center py-16">
      <div className="text-center" role="status" aria-live="polite">
        <span className="mx-auto block size-8 animate-pulse rounded-full border-4 border-[#d8d4c9] border-t-[#171717]" aria-hidden="true" />
        <p className="mt-4 text-sm font-semibold text-black/60">Loading…</p>
      </div>
    </main>
  );
}
