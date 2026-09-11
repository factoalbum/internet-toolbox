import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", "out", ".git", "scripts"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|mjs|css)$/.test(entry.name)) sourceFiles.push(full);
  }
}
walk(root);

const required = ["app/privacy/page.tsx", "app/terms/page.tsx", "app/faq/page.tsx", "app/not-found.tsx", "app/error.tsx", "app/loading.tsx", "app/robots.ts", "app/sitemap.ts", "app/icon.svg", "app/manifest.ts", "components/analytics-consent.tsx"];
for (const file of required) assert.ok(fs.existsSync(path.join(root, file)), `Missing ${file}`);

const layout = fs.readFileSync(path.join(root, "app/layout.tsx"), "utf8"); assert.match(layout, /metadataBase/); assert.match(layout, /title:/); assert.match(layout, /description:/); assert.match(layout, /canonical/); assert.match(layout, /openGraph/); assert.match(layout, /twitter/); assert.match(layout, /AnalyticsConsent/);
const robots = fs.readFileSync(path.join(root, "app/robots.ts"), "utf8"); assert.match(robots, /sitemap/i);
const sitemap = fs.readFileSync(path.join(root, "app/sitemap.ts"), "utf8"); assert.match(sitemap, /categories/);
const analytics = fs.readFileSync(path.join(root, "components/analytics-consent.tsx"), "utf8"); assert.match(analytics, /NEXT_PUBLIC_GA_ID/); assert.match(analytics, /document\.cookie/); assert.match(analytics, /gtag/);
const nextConfig = fs.readFileSync(path.join(root, "next.config.ts"), "utf8"); assert.match(nextConfig, /output:\s*["']export["']/); assert.match(nextConfig, /trailingSlash:\s*true/);
const errorPage = fs.readFileSync(path.join(root, "app/error.tsx"), "utf8"); assert.match(errorPage, /reset/); assert.match(errorPage, /Try again/);
const loadingPage = fs.readFileSync(path.join(root, "app/loading.tsx"), "utf8"); assert.match(loadingPage, /role=["']status["']/); assert.match(loadingPage, /aria-live=["']polite["']/);
const header = fs.readFileSync(path.join(root, "components/site-header.tsx"), "utf8"); assert.match(header, /focus-visible:ring/);

const knownRoutes = new Set(["/", "/tools", "/about", "/privacy", "/terms", "/faq", "/support", "/contact", "/disclaimer", "/categories", "/categories/calculators", "/categories/trading", "/categories/everyday", "/categories/developer", "/categories/text", "/categories/files", "/categories/compare"]);
const linkTargets = new Set();
for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const [, target] of content.matchAll(/href=["'](\/[A-Za-z0-9_./-]+)["']/g)) linkTargets.add(target.replace(/\/$/, "") || "/");
  assert.doesNotMatch(content, /<img(?![^>]*\balt=)/, `Image without alt text in ${path.relative(root, file)}`);
  for (const match of content.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/g)) assert.match(match[0], /rel=["'][^"']*noreferrer[^"']*["']/, `External link missing noreferrer in ${path.relative(root, file)}`);
}
for (const target of linkTargets) { if (target.startsWith("/tools/") || target.startsWith("/categories/")) continue; assert.ok(knownRoutes.has(target), `Possible broken internal link: ${target}`); }

const pageFiles = ["app/page.tsx", "app/tools/page.tsx", "app/categories/page.tsx", "app/about/page.tsx", "app/privacy/page.tsx", "app/terms/page.tsx", "app/faq/page.tsx", "app/support/page.tsx"];
for (const file of pageFiles) { const content = fs.readFileSync(path.join(root, file), "utf8"); assert.match(content, /export const metadata|generateMetadata/, `${file} is missing page metadata`); }

const registry = fs.readFileSync(path.join(root, "lib/tools.ts"), "utf8");
const toolContent = fs.readFileSync(path.join(root, "lib/tool-content.ts"), "utf8");
const extraContent = fs.readFileSync(path.join(root, "lib/tool-content-extra.ts"), "utf8");
const tradingContent = fs.readFileSync(path.join(root, "lib/trading-tool-content.ts"), "utf8");
const toolPage = fs.readFileSync(path.join(root, "app/tools/[slug]/page.tsx"), "utf8");
const toolRouter = fs.readFileSync(path.join(root, "components/tools/tool-router.tsx"), "utf8");
const toolsStart = registry.indexOf("export const tools:"); const featuredStart = registry.indexOf("export const featuredTools");
assert.ok(toolsStart >= 0 && featuredStart > toolsStart, "Could not isolate the main tool registry");
const toolsSection = registry.slice(toolsStart, featuredStart);
const registryEntries = [...toolsSection.matchAll(/\{\s*slug:\s*["']([^"']+)["'][\s\S]*?status:\s*["'](live|coming-soon)["']\s*\}/g)];
const registrySlugs = registryEntries.map((match) => match[1]);
const liveSlugs = registryEntries.filter((match) => match[2] === "live").map((match) => match[1]);
const contentSlugs = new Set([...toolContent.matchAll(/^\s*["']([^"']+)["']:\s*\{/gm), ...extraContent.matchAll(/^\s*["']([^"']+)["']:\s*\{/gm)].map((match) => match[1]));
const tradingSlugs = new Set([...tradingContent.matchAll(/^\s*["']([^"']+)["']:\s*\{/gm)].map((match) => match[1]));
for (const slug of registrySlugs) assert.match(toolRouter, new RegExp(`\"${slug}\"\\s*:`), `Tool router mapping missing for ${slug}`);
for (const slug of liveSlugs) {
  if (slug.endsWith("-calculator") || ["trading-profit-loss-calculator", "break-even-calculator", "average-entry-price-calculator", "trading-expectancy-calculator", "drawdown-calculator"].includes(slug)) {
    assert.ok(tradingSlugs.has(slug) || contentSlugs.has(slug), `Live trading tool is missing editorial content for ${slug}`);
  } else {
    assert.ok(contentSlugs.has(slug), `Live tool is missing editorial content for ${slug}`);
  }
}
assert.equal(tradingSlugs.size, 12, "Trading editorial suite should contain exactly 12 records");

const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length;
const contentRecordPattern = /["']([^"']+)["']:\s*\{\s*overview:\s*"([^"]*)",\s*bestFor:\s*"([^"]*)",\s*tip:\s*"([^"]*)",\s*limitation:\s*"([^"]*)",\s*faq:\s*\["([^"]*)",\s*"([^"]*)"\]/g;
const editorialRecords = new Map();
for (const match of toolContent.matchAll(contentRecordPattern)) editorialRecords.set(match[1], match.slice(2));
for (const match of extraContent.matchAll(contentRecordPattern)) editorialRecords.set(match[1], match.slice(2));
const tradingEditorialRecords = new Map();
for (const match of tradingContent.matchAll(contentRecordPattern)) tradingEditorialRecords.set(match[1], match.slice(2));

for (const slug of liveSlugs) {
  const record = tradingEditorialRecords.get(slug) ?? editorialRecords.get(slug);
  assert.ok(record, `Live tool has an editorial record that could not be parsed for quality checks: ${slug}`);
  const [overview, bestFor, tip, limitation, faqQuestion, faqAnswer] = record;
  assert.ok(countWords(overview) >= 8, `Editorial overview is too short for ${slug}`);
  assert.ok(countWords(bestFor) >= 8, `Editorial bestFor is too short for ${slug}`);
  assert.ok(countWords(tip) >= 8, `Editorial tip is too short for ${slug}`);
  assert.ok(countWords(limitation) >= 8, `Editorial limitation is too short for ${slug}`);
  assert.ok(countWords(faqQuestion) >= 3, `FAQ question is too short for ${slug}`);
  assert.ok(countWords(faqAnswer) >= 6, `FAQ answer is too short for ${slug}`);
}

const editorialFields = ["overview", "bestFor", "tip", "limitation", "faqQuestion", "faqAnswer"];
for (const field of editorialFields) {
  const seen = new Map();
  for (const [slug, record] of [...editorialRecords, ...tradingEditorialRecords]) {
    if (!liveSlugs.includes(slug)) continue;
    const index = editorialFields.indexOf(field);
    const value = record[index]?.trim().toLowerCase();
    if (!value) continue;
    const previous = seen.get(value);
    assert.ok(!previous, `Duplicate ${field} copy reused by ${previous} and ${slug}`);
    seen.set(value, slug);
  }
}

assert.match(toolPage, /generateStaticParams/); assert.match(toolPage, /generateMetadata/); assert.match(toolPage, /getToolContent/); assert.match(toolPage, /ToolRouter/);

console.log(`Site audit passed: ${required.length} readiness files, ${linkTargets.size} explicit internal links, ${registrySlugs.length} registered tools (${liveSlugs.length} live), ${contentSlugs.size + tradingSlugs.size} editorial tool entries and ${sourceFiles.length} source files checked.`);