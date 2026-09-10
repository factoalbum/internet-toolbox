"use client";

import Script from "next/script";
import { useState } from "react";

const consentKey = "internet-toolbox-analytics-consent";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

function readConsent() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${consentKey}=([^;]*)`));
  return match?.[1] === "granted" ? "granted" : match?.[1] === "denied" ? "denied" : null;
}

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<string | null>(() => readConsent());

  function choose(value: "granted" | "denied") {
    document.cookie = `${consentKey}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
    setConsent(value);
  }

  return (
    <>
      {gaId && consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
      {gaId && consent === null && (
        <aside className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl border border-[#171717] bg-[#fffdf8] p-4 shadow-[6px_6px_0_#171717]" aria-label="Analytics consent">
          <div className="sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div><p className="text-sm font-bold">Help us improve Internet Toolbox</p><p className="mt-1 text-xs leading-5 text-black/55">Optional analytics help us understand which tools are useful. No analytics loads unless you allow it. See our <a href="/privacy" className="font-semibold underline">privacy policy</a>.</p></div>
            <div className="mt-3 flex shrink-0 gap-2 sm:mt-0"><button type="button" onClick={() => choose("denied")} className="min-h-10 rounded-lg border border-[#bcb8ae] px-4 text-xs font-bold">No thanks</button><button type="button" onClick={() => choose("granted")} className="min-h-10 rounded-lg bg-[#171717] px-4 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#c8f169]">Allow analytics</button></div>
          </div>
        </aside>
      )}
    </>
  );
}
