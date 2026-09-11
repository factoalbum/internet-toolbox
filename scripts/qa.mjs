import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const toolDir = path.join(root, "components", "tools");
const readTool = (name) => fs.readFileSync(path.join(toolDir, name), "utf8");
const sourceFiles = () => {
  const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : entry.name.match(/\.(tsx|ts|css|md)$/) ? [full] : [];
  });
  return [...walk(path.join(root, "app")), ...walk(path.join(root, "components")), ...walk(path.join(root, "lib")), ...walk(path.join(root, "docs"))];
};
const toolsSection = fs.readFileSync(path.join(root, "lib", "tools.ts"), "utf8");
const routeSource = fs.readFileSync(path.join(root, "app", "tools", "[slug]", "page.tsx"), "utf8");
const downloader = readTool("direct-video-downloader.tsx");

test("tool registry is structurally valid", () => { assert.match(toolsSection, /export const tools/); assert.match(toolsSection, /slug:/); assert.match(toolsSection, /component:/); });
test("every live tool has a component file", () => { for (const match of toolsSection.matchAll(/component:\s*"([^"]+)"/g)) assert.ok(fs.existsSync(path.join(toolDir, match[1])), `Missing component ${match[1]}`); });
test("static tool routing is configured", () => { assert.match(routeSource, /generateStaticParams/); assert.match(routeSource, /notFound/); });
test("AdSense trust and transparency pages exist", () => { for (const page of ["about", "contact", "privacy", "terms", "disclaimer", "support", "faq"]) assert.ok(fs.existsSync(path.join(root, "app", page, "page.tsx")), `Missing ${page} page`); });
test("sitemap includes trust pages and only live tools", () => { const sitemap = fs.readFileSync(path.join(root, "app", "sitemap.ts"), "utf8"); assert.match(sitemap, /about|contact|privacy|terms|disclaimer|support|faq/); assert.match(sitemap, /tools/); });
test("tool pages expose substantive editorial guidance", () => { const content = fs.readFileSync(path.join(root, "lib", "tool-content.ts"), "utf8"); assert.match(content, /howToUse|bestFor|limitations|faq/); });
test("policy-sensitive tools carry clear guardrails", () => { assert.match(downloader, /permission|authorized|DRM|access control/i, "Downloader is missing authorization guidance"); });
test("category sidebar is safe for SSR and scroll locking", () => { const files = fs.readdirSync(path.join(root, "components")).filter((entry) => /sidebar/i.test(entry)); for (const file of files) { const content = fs.readFileSync(path.join(root, "components", file), "utf8"); assert.doesNotMatch(content, /document\.body\.style\.overflow\s*=\s*[^\n]*outside useEffect/); } });
test("shared layout prevents horizontal overflow and long text issues", () => { assert.match(fs.readFileSync(path.join(root, "app", "globals.css"), "utf8"), /overflow-x:\s*clip/); assert.match(routeSource, /min-w-0/); });
test("tool components do not inject raw HTML", () => { for (const file of fs.readdirSync(toolDir).filter((entry) => entry.endsWith(".tsx"))) { const content = fs.readFileSync(path.join(toolDir, file), "utf8"); assert.doesNotMatch(content, /dangerouslySetInnerHTML/, `Unexpected raw HTML injection in ${file}`); } });
test("site copy avoids AI-style typography artifacts", () => { for (const file of sourceFiles()) { const content = fs.readFileSync(file, "utf8"); assert.doesNotMatch(content, /[—…]/, `Avoid em dash and ellipsis in UI/source copy: ${path.relative(root, file)}`); assert.doesNotMatch(content, /(?<!\d)–|–(?!\d)/, `Avoid decorative en dash in UI/source copy: ${path.relative(root, file)}`); } });
test("tool descriptions stay short and human-readable", () => { for (const tool of toolsSection.matchAll(/description:\s*"([^"]+)"/g)) { assert.ok(tool[1].length <= 100, "Tool description is too long"); assert.doesNotMatch(tool[1], /\b(instantly|effortlessly|seamlessly|powerful|robust|comprehensive)\b/i, "Tool description uses marketing-heavy wording"); } });
test("message writer stays local and context-driven", () => { const content = readTool("message-writer.tsx"); assert.match(content, /hasEnoughContext/); assert.match(content, /buildMessage/); assert.doesNotMatch(content, /pretend|guarantee|expert/i); });
test("duplicate line remover preserves order and ignores blank duplicates", () => { const content = readTool("remove-duplicate-lines.tsx"); assert.match(content, /Set/); assert.match(content, /filter/); });
test("financial calculators guard invalid inputs and expose estimates", () => { for (const file of ["emi-calculator.tsx", "fd-calculator.tsx", "compound-interest-calculator.tsx", "sip-calculator.tsx", "ppf-calculator.tsx", "hra-calculator.tsx"]) { const content = readTool(file); assert.match(content, /Number|parseFloat/); assert.match(content, /if \(|disabled=|Math\.(min|max)/); } });
test("tax and salary calculators contain current-rule safeguards", () => { assert.match(readTool("income-tax-calculator.tsx"), /FY 2026-27|financial year|tax year/i); assert.match(readTool("salary-calculator.tsx"), /estimate|estimated/i); });
test("simple calculators expose numeric validation", () => { for (const file of ["percentage-calculator.tsx", "discount-calculator.tsx", "tip-calculator.tsx", "bill-splitter.tsx", "bmi-calculator.tsx"]) { const content = readTool(file); assert.match(content, /Number\(|inputMode=|type="number"/); } });
test("date and age calculators use calendar-safe date math", () => { assert.match(readTool("age-calculator.tsx"), /Date|UTC/); assert.match(readTool("date-calculator.tsx"), /Date|UTC/); });
test("local generators use browser cryptographic randomness", () => { assert.match(readTool("password-generator.tsx"), /crypto\.getRandomValues/); assert.match(readTool("random-number-generator.tsx"), /crypto\.getRandomValues/); assert.match(readTool("uuid-generator.tsx"), /crypto\.randomUUID\(\)|crypto\.getRandomValues/); });
test("live market tools use explicit external rate sources", () => { assert.match(readTool("currency-converter.tsx"), /https:\/\/api\.exchangerate\.fun/); assert.match(readTool("gold-silver-converter.tsx"), /exchangerate\.fun|gold-api/i); });
test("market tools handle failed rate requests", () => { for (const file of ["currency-converter.tsx", "gold-silver-converter.tsx"]) assert.match(readTool(file), /catch|error|Retry/i); });
