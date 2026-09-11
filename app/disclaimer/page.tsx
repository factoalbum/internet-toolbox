import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Disclaimer",
  description: "Important limitations for Internet Toolbox calculators, reference data and browser utilities.",
  alternates: { canonical: "/disclaimer/" },
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <SiteHeader />
      <section className="border-b border-[#d8d4c9] bg-[#e8e4d9] py-14 md:py-20"><div className="container"><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-black/40">Important information</p><h1 className="mt-4 text-5xl font-black tracking-[-0.045em] md:text-7xl">Disclaimer</h1><p className="mt-6 max-w-2xl text-base leading-7 text-black/55 md:text-lg">Internet Toolbox is designed for practical assistance, not as a replacement for professional advice or authoritative records.</p></div></section>
      <article className="container py-14 md:py-20"><div className="mx-auto max-w-3xl space-y-10 text-base leading-8 text-black/60">
        <section><h2 className="text-2xl font-black text-[#171717]">Calculators are estimates</h2><p className="mt-3">Financial calculators such as EMI, tax, salary, GST, SIP, FD, PPF and HRA tools provide estimates based on the values and assumptions shown on the page. Tax rules, rates, fees, employer policies and lender terms can change. Verify important figures with the relevant official source or a qualified professional.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Health information</h2><p className="mt-3">The BMI calculator is an educational screening tool. BMI does not diagnose a medical condition and does not account for every factor that affects health. Do not use it as a substitute for medical advice.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Market and reference data</h2><p className="mt-3">Currency, gold and silver values can vary by provider, timestamp, spread, purity, location and market conditions. Reference values shown by Internet Toolbox should not be treated as guaranteed transaction prices.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">File processing</h2><p className="mt-3">Browser-based file tools can change file structure, metadata or quality. Keep your original files and review downloaded results before using them in an important workflow. Where a tool sends data to an external provider, its page explains that behavior.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">Third-party links and services</h2><p className="mt-3">Some utilities may use or link to third-party services. Internet Toolbox does not control their availability, accuracy, privacy practices or terms. Use those services only when appropriate and with permission for the material you process.</p></section>
        <section><h2 className="text-2xl font-black text-[#171717]">No guarantee</h2><p className="mt-3">We work to keep the site functional and useful, but no result or service is guaranteed to be complete, current, error-free or suitable for every purpose.</p></section>
      </div></article>
      <SiteFooter />
    </main>
  );
}
