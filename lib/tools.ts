import { Calculator, Code2, FileText, ImageIcon, Link2, Palette, ShieldCheck, Sparkles, Type } from "lucide-react";

export type ToolCategory = "calculators" | "developer" | "text" | "files";
export type Tool = { slug: string; name: string; description: string; category: ToolCategory; icon: typeof Calculator; status: "live" | "coming-soon" };

export const categories = [
  { slug: "calculators", name: "Calculators", description: "Work out numbers, money and everyday questions.", icon: Calculator },
  { slug: "developer", name: "Developer Tools", description: "Handle common coding and data tasks.", icon: Code2 },
  { slug: "text", name: "Text Tools", description: "Clean, count and change text.", icon: FileText },
  { slug: "files", name: "File & Image Tools", description: "Handle common image and file tasks in your browser.", icon: ImageIcon },
] as const;

export const tools: Tool[] = [
  { slug: "percentage-calculator", name: "Percentage Calculator", description: "Work out percentages, increases and decreases.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "age-calculator", name: "Age Calculator", description: "Find an exact age between two dates.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "discount-calculator", name: "Discount Calculator", description: "Find the sale price and your savings.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "time-converter", name: "Time Converter", description: "Convert seconds, minutes, hours and days.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "emi-calculator", name: "EMI Calculator", description: "Estimate monthly loan payments, interest and total repayment.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "gst-calculator", name: "GST Calculator", description: "Add or remove GST and see the tax amount.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "bmi-calculator", name: "BMI Calculator", description: "Calculate body mass index from height and weight.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "sip-calculator", name: "SIP Calculator", description: "Estimate SIP growth, returns and future value.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "unit-converter", name: "Unit Converter", description: "Convert length, weight, temperature and volume units.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "date-calculator", name: "Date Calculator", description: "Find date differences or add and subtract days.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "fd-calculator", name: "FD Calculator", description: "Estimate fixed deposit interest and maturity amount.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "compound-interest-calculator", name: "Compound Interest Calculator", description: "Calculate compound growth, interest and final amount.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "income-tax-calculator", name: "Income Tax Calculator", description: "Compare estimated income tax under the old and new regimes for FY 2026-27.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "salary-calculator", name: "Salary Calculator", description: "Estimate monthly in-hand salary from annual CTC.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "ppf-calculator", name: "PPF Calculator", description: "Estimate PPF growth, contributions and maturity value.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "hra-calculator", name: "HRA Calculator", description: "Estimate HRA exemption and taxable HRA.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "currency-converter", name: "Currency Converter", description: "Convert currencies using current reference exchange rates.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "gold-silver-rate-converter", name: "Gold & Silver Rate Converter", description: "Check gold and silver reference values in INR by weight and purity.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "random-number-generator", name: "Random Number Generator", description: "Generate random integers in your browser.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "tip-calculator", name: "Tip Calculator", description: "Calculate a tip, final bill and each person's share.", category: "calculators", icon: Calculator, status: "live" },
  { slug: "url-shortener", name: "URL Shortener", description: "Create a shorter, shareable link from a long URL.", category: "text", icon: Link2, status: "live" },
  { slug: "json-formatter", name: "JSON Formatter", description: "Format and inspect JSON with readable indentation.", category: "developer", icon: Code2, status: "live" },
  { slug: "uuid-generator", name: "UUID Generator", description: "Generate UUIDs in your browser.", category: "developer", icon: Code2, status: "live" },
  { slug: "password-generator", name: "Password Generator", description: "Generate strong passwords locally in your browser.", category: "developer", icon: ShieldCheck, status: "live" },
  { slug: "url-encoder-decoder", name: "URL Encoder / Decoder", description: "Encode or decode URL text in your browser.", category: "developer", icon: Code2, status: "live" },
  { slug: "base64-encoder-decoder", name: "Base64 Encoder / Decoder", description: "Encode or decode Base64 text.", category: "developer", icon: Code2, status: "live" },
  { slug: "timestamp-converter", name: "Unix Timestamp Converter", description: "Convert Unix timestamps and dates in either direction.", category: "developer", icon: Code2, status: "live" },
  { slug: "color-converter", name: "Color Converter", description: "Convert HEX, RGB and HSL color values.", category: "developer", icon: Palette, status: "live" },
  { slug: "html-entity-encoder-decoder", name: "HTML Entity Encoder / Decoder", description: "Convert HTML special characters to and from entities.", category: "developer", icon: Code2, status: "live" },
  { slug: "word-counter", name: "Word Counter", description: "Count words, characters and reading time.", category: "text", icon: FileText, status: "live" },
  { slug: "character-counter", name: "Character Counter", description: "Count characters with and without spaces.", category: "text", icon: FileText, status: "live" },
  { slug: "case-converter", name: "Case Converter", description: "Change text between common letter cases.", category: "text", icon: Type, status: "live" },
  { slug: "url-slug-generator", name: "URL Slug Generator", description: "Turn page titles into clean URL slugs.", category: "text", icon: Type, status: "live" },
  { slug: "image-compressor", name: "Image Compressor", description: "Compress JPG, PNG and WebP images in your browser.", category: "files", icon: ImageIcon, status: "live" },
  { slug: "direct-video-downloader", name: "Direct Video Downloader", description: "Download a video from a direct MP4, WebM, MOV or M4V link.", category: "files", icon: ImageIcon, status: "live" },
];

export const featuredTools = [tools[0], tools[4], tools[5], tools[7], tools[6], tools[12], tools[16], tools[17], tools[13], tools[8]];
export const brandIcon = Sparkles;
