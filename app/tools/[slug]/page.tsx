import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Wrench } from "lucide-react";
import SiteHeader from "@/components/site-header";
import AgeCalculator from "@/components/tools/age-calculator";
import Base64Tool from "@/components/tools/base64";
import BillSplitter from "@/components/tools/bill-splitter";
import BmiCalculator from "@/components/tools/bmi-calculator";
import CaseConverter from "@/components/tools/case-converter";
import CharacterCounter from "@/components/tools/character-counter";
import ColorConverter from "@/components/tools/color-converter";
import CompoundInterestCalculator from "@/components/tools/compound-interest-calculator";
import CurrencyConverter from "@/components/tools/currency-converter";
import DateCalculator from "@/components/tools/date-calculator";
import DiscountCalculator from "@/components/tools/discount-calculator";
import DeveloperFileViewer from "@/components/tools/developer-file-viewer";
import EmiCalculator from "@/components/tools/emi-calculator";
import FdCalculator from "@/components/tools/fd-calculator";
import GoldSilverConverter from "@/components/tools/gold-silver-converter";
import GstCalculator from "@/components/tools/gst-calculator";
import HousingAllowanceCalculator from "@/components/tools/hra-calculator";
import HtmlEntityTool from "@/components/tools/html-entity";
import ImageCompressor from "@/components/tools/image-compressor";
import IncomeTaxCalculator from "@/components/tools/income-tax-calculator";
import JsonFormatter from "@/components/tools/json-formatter";
import JsonToCsv from "@/components/tools/json-to-csv";
import JwtDecoder from "@/components/tools/jwt-decoder";
import MessageWriter from "@/components/tools/message-writer";
import PasswordGenerator from "@/components/tools/password-generator";
import PercentageCalculator from "@/components/tools/percentage-calculator";
import PpfCalculator from "@/components/tools/ppf-calculator";
import RandomNumberGenerator from "@/components/tools/random-number-generator";
import RegexTester from "@/components/tools/regex-tester";
import RemoveDuplicateLines from "@/components/tools/remove-duplicate-lines";
import SalaryCalculator from "@/components/tools/salary-calculator";
import SipCalculator from "@/components/tools/sip-calculator";
import SlugGenerator from "@/components/tools/slug-generator";
import TextCleaner from "@/components/tools/text-cleaner";
import TextDiff from "@/components/tools/text-diff";
import TimeConverter from "@/components/tools/time-converter";
import TimeZoneConverter from "@/components/tools/time-zone-converter";
import TimestampConverter from "@/components/tools/timestamp-converter";
import UnitConverter from "@/components/tools/unit-converter";
import UrlEncoder from "@/components/tools/url-encoder";
import UrlShortener from "@/components/tools/url-shortener";
import DirectVideoDownloader from "@/components/tools/direct-video-downloader";
import UuidGenerator from "@/components/tools/uuid-generator";
import WordCounter from "@/components/tools/word-counter";
import TipCalculator from "@/components/tools/tip-calculator";
import { tools } from "@/lib/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://factoalbum.github.io/internet-toolbox";
type ToolSeo = { title: string; description: string; intro: string; uses: string[] };
const toolSeo: Record<string, ToolSeo> = {
  "percentage-calculator": { title: "Percentage Calculator - Free Online % Calculator", description: "Calculate percentages, percentage increase and decrease, and find what percent one number is of another.", intro: "Use this percentage calculator for quick percentage calculations without doing the formulas by hand.", uses: ["Find a percentage of a number", "Calculate percentage increase or decrease", "Work out what percentage one value is of another"] },
  "age-calculator": { title: "Age Calculator - Calculate Your Exact Age", description: "Calculate your exact age in years, months and days from your date of birth and a selected date.", intro: "Enter two dates to find an exact calendar age, plus the total number of days between them.", uses: ["Calculate age from a date of birth", "Check age on a future or past date", "Find the exact number of days between two dates"] },
  "discount-calculator": { title: "Discount Calculator - Sale Price & Savings", description: "Calculate discounts, sale prices and savings from an original price and discount percentage.", intro: "Quickly see how much you save and what you will pay after a percentage discount.", uses: ["Check sale prices", "Calculate savings before buying", "Compare different discount percentages"] },
  "time-converter": { title: "Time Converter - Seconds, Minutes, Hours & Days", description: "Convert seconds, minutes, hours and days instantly with a simple online time converter.", intro: "Convert common time units instantly without manual multiplication or division.", uses: ["Convert seconds to minutes or hours", "Convert hours to days", "Check quick time-unit equivalents"] },
  "time-zone-converter": { title: "Time Zone Converter - Convert Time Worldwide", description: "Convert a date and time between common world time zones and compare local times quickly.", intro: "Pick a date, time and source time zone to see the equivalent time in another location.", uses: ["Plan meetings across countries", "Convert India, UK, US and other time zones", "Check a local time before scheduling"] },
  "emi-calculator": { title: "EMI Calculator - Monthly Loan Payment", description: "Calculate monthly EMI, total interest and total repayment for a loan using amount, rate and tenure.", intro: "Estimate your monthly loan payment and understand how interest and tenure affect total repayment.", uses: ["Estimate home or personal loan EMI", "Compare loan tenures", "See total interest and repayment"] },
  "gst-calculator": { title: "GST Calculator - Add or Remove GST", description: "Calculate GST amount and final price in India. Add GST to a base price or remove GST from an inclusive price.", intro: "Use common Indian GST rates to quickly calculate the tax component and final amount.", uses: ["Add GST to a product price", "Remove GST from an inclusive amount", "Compare 5%, 12%, 18% and 28% GST calculations"] },
  "bmi-calculator": { title: "BMI Calculator - Calculate Body Mass Index", description: "Calculate BMI from height and weight and see the standard BMI screening category.", intro: "Enter height and weight to calculate body mass index. BMI is a screening measure, not a diagnosis.", uses: ["Calculate BMI from height and weight", "Check the standard BMI category", "Track BMI changes over time"] },
  "sip-calculator": { title: "SIP Calculator - Estimate Investment Returns", description: "Estimate SIP future value, total investment and potential returns from monthly investment, rate and duration.", intro: "Estimate how regular monthly investments could grow over time using an assumed annual return.", uses: ["Estimate SIP maturity value", "Compare monthly investment amounts", "Understand invested amount versus estimated returns"] },
  "unit-converter": { title: "Unit Converter - Length, Weight, Temperature & Volume", description: "Convert common length, weight, temperature and volume units instantly with a free online unit converter.", intro: "Choose a category, enter a value and get an instant conversion between common units.", uses: ["Convert length and distance", "Convert weight and mass", "Convert temperature and volume"] },
  "date-calculator": { title: "Date Calculator - Days Between Dates", description: "Calculate the days between two dates or add and subtract a number of days from a date.", intro: "Use calendar dates to find an exact day difference or move a date forward and backward.", uses: ["Count days between two dates", "Find a date after a number of days", "Find a date before a number of days"] },
  "fd-calculator": { title: "FD Calculator - Fixed Deposit Interest & Maturity", description: "Estimate fixed deposit interest and maturity amount from principal, interest rate and investment tenure.", intro: "Estimate how much a fixed deposit could grow and separate the interest from the maturity amount.", uses: ["Estimate FD maturity", "Calculate expected FD interest", "Compare deposit amounts and rates"] },
  "compound-interest-calculator": { title: "Compound Interest Calculator - Growth & Interest", description: "Calculate compound interest, total growth and final amount from principal, rate, time and compounding frequency.", intro: "See how an initial amount can grow when interest is added back to the balance over time.", uses: ["Calculate compound interest", "Compare compounding frequencies", "Estimate long-term growth"] },
  "income-tax-calculator": { title: "Income Tax Calculator FY 2026-27 - India", description: "Estimate Indian income tax for FY 2026-27 and compare the old and new tax regimes using the calculator inputs.", intro: "Use the calculator for an estimate of income tax under the supported FY 2026-27 rules. It is not tax advice.", uses: ["Compare old and new tax regimes", "Estimate tax from annual income", "Understand estimated tax and effective rate"] },
  "salary-calculator": { title: "Salary Calculator - CTC to In-Hand Salary", description: "Estimate monthly in-hand salary from annual CTC with a simple salary calculator for India.", intro: "Enter annual CTC and supported deductions to get an estimated monthly take-home amount.", uses: ["Estimate monthly take-home salary", "Compare job offers by CTC", "Understand annual versus monthly pay"] },
  "ppf-calculator": { title: "PPF Calculator - Estimate Maturity & Returns", description: "Estimate PPF contributions, interest and maturity value from yearly deposits and the investment period.", intro: "Estimate PPF growth from recurring contributions using the calculator's supported assumptions.", uses: ["Estimate PPF maturity", "Compare yearly contribution amounts", "Separate contributions from estimated interest"] },
  "hra-calculator": { title: "HRA Calculator - Exemption & Taxable HRA", description: "Estimate HRA exemption and taxable HRA using salary, rent, HRA received and location details.", intro: "Calculate an estimated HRA exemption and see the remaining taxable HRA amount.", uses: ["Estimate HRA exemption", "Check the effect of rent and salary", "Compare metro and non-metro HRA calculations"] },
  "currency-converter": { title: "Currency Converter - Convert Exchange Rates", description: "Convert currencies using current reference exchange rates and see the converted amount instantly.", intro: "Choose currencies and enter an amount to get a quick reference conversion.", uses: ["Convert USD, INR and other currencies", "Estimate travel spending", "Check a reference exchange rate"] },
  "gold-silver-rate-converter": { title: "Gold & Silver Rate Converter - INR Value", description: "Convert international gold and silver reference values into INR by weight and purity for quick estimates.", intro: "Use the hourly reference data to estimate gold or silver value by weight and purity. Local prices can differ.", uses: ["Estimate gold value by weight", "Convert silver reference values to INR", "Compare common purity levels"] },
  "random-number-generator": { title: "Random Number Generator - Free & Secure", description: "Generate random integers between a minimum and maximum value directly in your browser.", intro: "Set a range and generate a random integer locally in your browser.", uses: ["Pick a random number", "Choose winners from a numbered range", "Generate test values"] },
  "tip-calculator": { title: "Tip Calculator - Tip, Total & Per Person", description: "Calculate a tip, final bill total and each person's share with an easy online tip calculator.", intro: "Enter the bill and tip percentage to see the tip, total and optional split amount.", uses: ["Calculate restaurant tips", "Split the final bill", "Compare different tip percentages"] },
  "bill-splitter": { title: "Bill Splitter - Split Bills & Tips", description: "Split a bill between people and include an optional tip to see each person's share.", intro: "Enter the bill, number of people and optional tip to calculate a simple equal split.", uses: ["Split restaurant bills", "Include a shared tip", "Quickly calculate each person's share"] },
  "url-shortener": { title: "URL Shortener - Create Short Links", description: "Turn a long URL into a shorter shareable link using a simple online URL shortener.", intro: "Paste a valid public URL to request a shorter link through the supported shortening service.", uses: ["Shorten long links", "Create cleaner links for messages", "Share easier-to-read URLs"] },
  "message-writer": { title: "Caption & Message Writer - Ready-to-Use Text", description: "Turn a few details into a ready-to-use caption, message, request or short piece of everyday writing.", intro: "Describe what you need to say and choose a format to create a concise draft you can edit and use.", uses: ["Write social media captions", "Draft polite requests", "Turn rough notes into a clear message"] },
  "json-formatter": { title: "JSON Formatter - Format & Inspect JSON", description: "Format, validate and inspect JSON with readable indentation in your browser.", intro: "Paste JSON to make it easier to read and spot structural errors.", uses: ["Pretty-print API responses", "Inspect nested JSON", "Find invalid JSON structure"] },
  "json-to-csv": { title: "JSON to CSV Converter - Convert JSON to CSV", description: "Convert a JSON array of objects into CSV data in your browser, then copy or download the result.", intro: "Paste a JSON array of objects to turn structured data into spreadsheet-friendly CSV. Conversion happens locally in your browser.", uses: ["Convert API data to CSV", "Prepare JSON data for spreadsheets", "Download tabular data without uploading it"] },
  "uuid-generator": { title: "UUID Generator - Generate UUIDs Online", description: "Generate UUIDs directly in your browser for IDs, development work and testing.", intro: "Generate UUID values locally when you need unique identifiers for development or testing.", uses: ["Create test IDs", "Generate identifiers for development", "Create multiple UUID values quickly"] },
  "password-generator": { title: "Password Generator - Strong Random Passwords", description: "Generate strong random passwords locally in your browser with configurable length and character sets.", intro: "Create a random password locally without sending the generated password to a server.", uses: ["Create a new account password", "Generate long random passwords", "Create test credentials for development"] },
  "url-encoder-decoder": { title: "URL Encoder & Decoder - Encode URL Text", description: "Encode or decode URL text with percent encoding directly in your browser.", intro: "Convert special characters to URL-safe percent encoding or decode encoded URL text.", uses: ["Encode query parameters", "Decode percent-encoded URLs", "Inspect URL-safe text"] },
  "base64-encoder-decoder": { title: "Base64 Encoder & Decoder - Encode Text", description: "Encode text to Base64 or decode Base64 text directly in your browser.", intro: "Convert text between normal text and Base64 representation for development and debugging.", uses: ["Encode text as Base64", "Decode Base64 strings", "Inspect encoded payloads"] },
  "timestamp-converter": { title: "Unix Timestamp Converter - Timestamp to Date", description: "Convert Unix timestamps to dates and dates to Unix timestamps with a simple online converter.", intro: "Convert Unix epoch timestamps and human-readable dates in either direction.", uses: ["Decode API timestamps", "Generate Unix timestamps", "Debug time values in applications"] },
  "color-converter": { title: "Color Converter - HEX, RGB & HSL", description: "Convert colors between HEX, RGB and HSL values with an easy browser-based color converter.", intro: "Enter a supported color value to get equivalent HEX, RGB and HSL representations.", uses: ["Convert HEX to RGB", "Convert RGB to HSL", "Check CSS color values"] },
  "html-entity-encoder-decoder": { title: "HTML Entity Encoder & Decoder", description: "Encode special characters as HTML entities or decode HTML entities back into readable text.", intro: "Convert characters such as ampersands, quotes and angle brackets to and from HTML entities.", uses: ["Encode HTML special characters", "Decode HTML entities", "Inspect escaped HTML text"] },
  "regex-tester": { title: "Regex Tester - Test Regular Expressions", description: "Test regular expressions against text and inspect matches and capture groups in your browser.", intro: "Enter a regular expression and test it against sample text while inspecting matches and groups.", uses: ["Test JavaScript regular expressions", "Check matches and capture groups", "Debug patterns before coding"] },
  "jwt-decoder": { title: "JWT Decoder - Decode JSON Web Tokens Online", description: "Decode JWT headers and payloads locally in your browser without sending the token to a server or verifying its signature.", intro: "Paste a JSON Web Token to inspect its header and payload. This tool decodes the token but does not verify its signature or authenticity.", uses: ["Inspect JWT headers and algorithms", "Read JWT payload claims", "Debug authentication tokens during development"] },
  "developer-file-viewer": { title: "Developer File Viewer - Preview Code & Markdown Files", description: "Open Markdown, HTML, CSS, JavaScript, TypeScript, JSON, YAML and XML files in your browser.", intro: "Choose a local developer file to preview Markdown or HTML and inspect source code without uploading it.", uses: ["Preview README and Markdown files", "Inspect HTML files safely", "Read CSS, JS, TS, JSON, YAML and XML files"] },
  "word-counter": { title: "Word Counter - Words, Characters & Reading Time", description: "Count words and characters and estimate reading time from text you paste into the browser.", intro: "Paste or type text to see useful counts immediately.", uses: ["Count words in an article", "Check character limits", "Estimate reading time"] },
  "character-counter": { title: "Character Counter - Count Text Length", description: "Count characters with and without spaces using a simple online character counter.", intro: "Paste text to instantly see total characters and the count excluding spaces.", uses: ["Check social media limits", "Measure text length", "Compare character counts"] },
  "case-converter": { title: "Case Converter - Uppercase, Lowercase & More", description: "Convert text to uppercase, lowercase and other common letter cases in your browser.", intro: "Paste text and convert it into a consistent case without manually editing every word.", uses: ["Convert text to uppercase", "Convert text to lowercase", "Prepare headings and labels"] },
  "text-cleaner": { title: "Text Cleaner - Remove Extra Spaces & Lines", description: "Clean pasted text by removing extra spaces and blank lines with a quick browser-based text cleaner.", intro: "Paste messy text to normalize common spacing and blank-line problems.", uses: ["Clean copied text", "Remove repeated blank lines", "Prepare text before pasting into another app"] },
  "remove-duplicate-lines": { title: "Remove Duplicate Lines - Clean Lists Online", description: "Remove duplicate lines from pasted text while keeping the first copy of each non-empty line.", intro: "Paste a list and quickly create a version without repeated lines.", uses: ["Clean copied lists", "Deduplicate names or values", "Prepare unique line-based data"] },
  "url-slug-generator": { title: "URL Slug Generator - Create Clean Slugs", description: "Turn titles and phrases into clean, readable URL slugs for pages, posts and content.", intro: "Enter a title and generate a lowercase, search-friendly slug with unnecessary punctuation removed.", uses: ["Create blog URL slugs", "Prepare SEO-friendly page paths", "Normalize titles for URLs"] },
  "text-diff-checker": { title: "Text Diff Checker - Compare Two Texts", description: "Compare two pieces of text and highlight added and removed lines with a simple online diff checker.", intro: "Paste the original and updated text to quickly spot line-level changes.", uses: ["Compare document revisions", "Check configuration changes", "Review copied text differences"] },
  "image-compressor": { title: "Image Compressor - Compress JPG, PNG & WebP", description: "Compress JPG, PNG and WebP images in your browser with adjustable quality and no server upload.", intro: "Choose an image, adjust quality and download a smaller version directly from your browser.", uses: ["Reduce image file size", "Prepare images for websites", "Compress photos before sharing"] },
  "direct-video-downloader": { title: "Direct Video Downloader - Save Direct Video Files", description: "Download a video from a direct MP4, WebM, MOV or M4V file URL using your browser.", intro: "Provide a direct video-file URL to download the file when the server permits browser access.", uses: ["Save a direct video file", "Download an MP4 or WebM URL", "Move a directly hosted video between devices"] },
};

export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const tool = tools.find((item) => item.slug === slug);
    if (!tool) return {};
    const seo = toolSeo[slug];
    const title = seo?.title ?? tool.name;
    const description = seo?.description ?? `${tool.description} Free to use.`;
    const toolUrl = `${siteUrl}/tools/${tool.slug}`;
    return { title, description, alternates: { canonical: toolUrl }, openGraph: { type: "website", title: `${title} | Internet Toolbox`, description, url: toolUrl }, twitter: { card: "summary", title: `${title} | Internet Toolbox`, description } };
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) notFound();
  const Icon = tool.icon;
  const seo = toolSeo[slug];
  const relatedTools = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug && item.status === "live").slice(0, 3);
  const toolUrl = `${siteUrl}/tools/${tool.slug}/`;
  const categoryUrl = `${siteUrl}/categories/${tool.category}/`;
  const categoryName = tool.category === "calculators" ? "Money & Calculators" : tool.category === "everyday" ? "Everyday Tools" : tool.category === "developer" ? "Developer Tools" : tool.category === "text" ? "Text Tools" : "File & Image Tools";
  const structuredData = [{ "@context": "https://schema.org", "@type": "WebApplication", name: tool.name, description: seo?.description ?? tool.description, url: toolUrl, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: categoryName, item: categoryUrl }, { "@type": "ListItem", position: 3, name: tool.name, item: toolUrl }] }];

  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#171717]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteHeader />
      <section className="container py-7 md:py-10 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-semibold text-black/45">
            <Link href="/tools" className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#d8d4c9] bg-[#fffdf8] px-3 transition hover:border-[#171717] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><ArrowLeft size={13} />All tools</Link>
            <span aria-hidden="true">/</span><span>{categoryName}</span><span aria-hidden="true">/</span><span className="truncate text-black">{tool.name}</span>
          </nav>

          <header className="grid gap-7 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-[18px] border border-[#cfd8b7] bg-[#e8f4c9] text-[#435816] shadow-[4px_4px_0_#171717]" aria-hidden="true"><Icon size={25} /></div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6d8e25]">{categoryName}</p>
                  <p className="mt-1 text-xs font-semibold text-black/40">A simple tool for getting one thing done.</p>
                </div>
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl md:text-6xl">{tool.name}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-black/55 md:text-lg">{seo?.intro ?? tool.description}</p>
            </div>
            <aside className="rounded-[22px] border border-[#d8d4c9] bg-[#fffdf8] p-5 shadow-[5px_5px_0_#d8d4c9]">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-black/35">Before you start</p>
              <div className="mt-4 space-y-3">
                {["No sign-up required", "Simple, focused workspace", "Free to use"].map((item) => <p key={item} className="flex items-center gap-2.5 text-sm font-bold"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#c8f169]"><Check size={13} strokeWidth={3} /></span>{item}</p>)}
              </div>
            </aside>
          </header>

          <section data-tool-workspace className="mt-9 rounded-[28px] border-2 border-[#171717] bg-[#fffdf8] p-2.5 shadow-[8px_8px_0_#171717] md:mt-11 md:p-3" aria-labelledby="workspace-title">
            <div className="mb-2 flex items-center justify-between gap-4 rounded-[20px] border border-[#e1ded5] bg-[#f8f5ed] px-4 py-3 md:px-5">
              <div className="min-w-0"><p id="workspace-title" className="text-sm font-black">Use the tool</p><p className="hidden text-xs text-black/40 sm:block">Enter your details below. Your result appears right away.</p></div>
              <span className="shrink-0 rounded-full border border-[#d8d4c9] bg-white px-3 py-1.5 text-[11px] font-bold text-black/45">Free tool</span>
            </div>
            <div className="overflow-hidden rounded-[22px]">
              {slug === "percentage-calculator" && <PercentageCalculator />}{slug === "age-calculator" && <AgeCalculator />}{slug === "discount-calculator" && <DiscountCalculator />}{slug === "time-converter" && <TimeConverter />}{slug === "time-zone-converter" && <TimeZoneConverter />}{slug === "emi-calculator" && <EmiCalculator />}{slug === "gst-calculator" && <GstCalculator />}{slug === "hra-calculator" && <HousingAllowanceCalculator />}{slug === "bmi-calculator" && <BmiCalculator />}{slug === "sip-calculator" && <SipCalculator />}{slug === "unit-converter" && <UnitConverter />}{slug === "date-calculator" && <DateCalculator />}{slug === "fd-calculator" && <FdCalculator />}{slug === "compound-interest-calculator" && <CompoundInterestCalculator />}{slug === "income-tax-calculator" && <IncomeTaxCalculator />}{slug === "salary-calculator" && <SalaryCalculator />}{slug === "ppf-calculator" && <PpfCalculator />}{slug === "currency-converter" && <CurrencyConverter />}{slug === "gold-silver-rate-converter" && <GoldSilverConverter />}{slug === "random-number-generator" && <RandomNumberGenerator />}{slug === "tip-calculator" && <TipCalculator />}{slug === "bill-splitter" && <BillSplitter />}{slug === "url-shortener" && <UrlShortener />}{slug === "message-writer" && <MessageWriter />}{slug === "json-formatter" && <JsonFormatter />}{slug === "json-to-csv" && <JsonToCsv />}{slug === "uuid-generator" && <UuidGenerator />}{slug === "password-generator" && <PasswordGenerator />}{slug === "url-encoder-decoder" && <UrlEncoder />}{slug === "base64-encoder-decoder" && <Base64Tool />}{slug === "timestamp-converter" && <TimestampConverter />}{slug === "color-converter" && <ColorConverter />}{slug === "html-entity-encoder-decoder" && <HtmlEntityTool />}{slug === "regex-tester" && <RegexTester />}{slug === "jwt-decoder" && <JwtDecoder />}{slug === "developer-file-viewer" && <DeveloperFileViewer />}{slug === "word-counter" && <WordCounter />}{slug === "character-counter" && <CharacterCounter />}{slug === "case-converter" && <CaseConverter />}{slug === "text-cleaner" && <TextCleaner />}{slug === "remove-duplicate-lines" && <RemoveDuplicateLines />}{slug === "url-slug-generator" && <SlugGenerator />}{slug === "text-diff-checker" && <TextDiff />}{slug === "image-compressor" && <ImageCompressor />}{slug === "direct-video-downloader" && <DirectVideoDownloader />}
              {!tool.status.includes("live") && <div className="flex min-h-64 flex-col items-center justify-center text-center"><Wrench size={28} /><h2 className="mt-4 font-bold">Coming soon</h2><p className="mt-2 text-sm text-black/50">We are building this tool with the same straightforward experience.</p></div>}
            </div>
          </section>

          {seo && <section className="mt-12 grid gap-8 border-t border-[#d8d4c9] pt-9 md:grid-cols-[0.75fr_1.25fr] md:gap-12" aria-labelledby="tool-guide">
            <div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6d8e25]">Quick guide</p><h2 id="tool-guide" className="mt-2 text-3xl font-black tracking-[-0.04em]">How it works</h2><p className="mt-3 text-sm leading-6 text-black/45">No complicated setup. Enter what you know, use the main action, and take your result.</p></div>
            <ul className="grid gap-3">
              {seo.uses.map((use, index) => <li key={use} className="flex gap-4 rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] p-4"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-black text-white">{index + 1}</span><span className="pt-1 text-sm font-semibold leading-6">{use}</span></li>)}
            </ul>
          </section>}

          {relatedTools.length > 0 && <section className="mt-12 border-t border-[#d8d4c9] pt-9" aria-labelledby="related-tools">
            <div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6d8e25]">Keep going</p><h2 id="related-tools" className="mt-2 text-3xl font-black tracking-[-0.04em]">You might also need</h2></div><Link href="/tools" className="hidden items-center gap-2 rounded-full border border-[#d8d4c9] bg-[#fffdf8] px-4 py-2 text-xs font-black transition hover:border-[#171717] sm:inline-flex">All tools <ArrowRight size={13} /></Link></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {relatedTools.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`} className="group rounded-[22px] border border-[#d8d4c9] bg-[#fffdf8] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#171717] hover:shadow-[5px_5px_0_#171717] focus:outline-none focus:ring-4 focus:ring-[#c8f169]"><span className="flex size-10 items-center justify-center rounded-xl bg-[#e8f4c9] text-[#435816]"><item.icon size={18} aria-hidden="true" /></span><h3 className="mt-5 text-sm font-black">{item.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-black/45">{item.description}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[#6d8e25]">Open tool <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" /></span></Link>)}
            </div>
          </section>}
        </div>
      </section>

      <footer className="mt-4 border-t-2 border-[#171717] bg-[#171717] text-white">
        <div className="container flex flex-col gap-5 py-9 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black">Internet Toolbox</p><p className="mt-1 text-xs text-white/45">Small tools. Less friction.</p></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-white/55"><Link href="/about" className="hover:text-white">About</Link><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/support" className="hover:text-white">Support</Link><Link href="/tools" className="font-bold text-white">All tools</Link></div></div>
      </footer>
    </main>
  );
}
