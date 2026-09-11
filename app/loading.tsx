export default function Loading() {
  return (
    <main className="container flex min-h-[50vh] items-center justify-center py-16 sm:py-20" aria-busy="true">
      <div className="w-full max-w-sm rounded-3xl border border-[#dedbd3] bg-white p-8 text-center shadow-[0_16px_45px_rgb(23_23_23_/6%)]" role="status" aria-live="polite">
        <span className="mx-auto flex size-10 items-center justify-center rounded-full border-4 border-[#e9f4cf] border-t-[#171717]" aria-hidden="true">
          <span className="size-2 rounded-full bg-[#c8f169]" />
        </span>
        <p className="mt-5 text-base font-black tracking-tight text-[#171717]">Loading your tools</p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-black/55">Getting the page ready. This should only take a moment.</p>
      </div>
    </main>
  );
}
