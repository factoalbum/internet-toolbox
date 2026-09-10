import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "app/faq/page.tsx",
  "app/not-found.tsx",
  "app/error.tsx",
  "app/loading.tsx",
  "app/robots.ts",
  "app/sitemap.ts",
  "app/icon.svg",
  "app/manifest.ts",
  "components/analytics-consent.tsx",
];
for (const file of required) assert.ok(fs.existsSync(path.join(root, file)), `Missing deployment-readiness file: ${file}`);

const layout = fs.readFileSync(path.join(root, "app/layout.tsx"), "utf8");
const robots = fs.readFileSync(path.join(root, "app/robots.ts"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "app/sitemap.ts"), "utf8");
const consent = fs.readFileSync(path.join(root, "components/analytics-consent.tsx"), "utf8");
const manifest = fs.readFileSync(path.join(root, "app/manifest.ts"), "utf8");
const nextConfig = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
const errorPage = fs.readFileSync(path.join(root, "app/error.tsx"), "utf8");
const loadingPage = fs.readFileSync(path.join(root, "app/loading.tsx"), "utf8");
const header = fs.readFileSync(path.join(root, "components/site-header.tsx"), "utf8");

assert.match(layout, /metadataBase/);
assert.match(layout, /title:/);
assert.match(layout, /description:/);
assert.match(layout, /alternates:\s*\{\s*canonical/);
assert.match(layout, /openGraph:/);
assert.match(layout, /twitter:/);
assert.match(layout, /og-image\.svg/);
assert.match(layout, /AnalyticsConsent/);
assert.match(robots, /userAgent:\s*"\*"/);
assert.match(robots, /sitemap/);
assert.match(sitemap, /faq/);
assert.match(sitemap, /terms/);
assert.match(sitemap, /tools\.map/);
assert.match(consent, /NEXT_PUBLIC_GA_ID/);
assert.match(consent, /consentKey/);
assert.match(consent, /granted/);
assert.match(consent, /denied/);
assert.match(consent, /googletagmanager\.com/);
assert.match(manifest, /dynamic\s*=\s*["']force-static["']/);
assert.match(manifest, /start_url:\s*["']\.[/]["']/);
assert.match(nextConfig, /output:\s*"export"/);
assert.match(nextConfig, /trailingSlash:\s*true/);
assert.match(errorPage, /reset/);
assert.match(errorPage, /Try again/);
assert.match(loadingPage, /role="status"/);
assert.match(loadingPage, /aria-live="polite"/);
assert.match(header, /focus:ring-4/);

const sourceRoots = [path.join(root, "app"), path.join(root, "components")];
const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts)$/.test(entry.name)) sourceFiles.push(full);
  }
}
sourceRoots.forEach(walk);

const knownRoutes = new Set(["/", "/tools", "/about", "/privacy", "/terms", "/faq", "/support", "/categories/calculators", "/categories/everyday", "/categories/developer", "/categories/text", "/categories/files"]);
const linkTargets = new Set();
for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const [, target] of content.matchAll(/href=["'](\/[A-Za-z0-9_./-]+)["']/g)) linkTargets.add(target.replace(/\/$/, "") || "/");
  assert.doesNotMatch(content, /<img(?![^>]*\balt=)/, `Image without alt text in ${path.relative(root, file)}`);
  for (const match of content.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/g)) assert.match(match[0], /rel=["'][^"']*noreferrer[^"']*["']/, `External link missing noreferrer in ${path.relative(root, file)}`);
}
for (const target of linkTargets) {
  if (target.startsWith("/tools/") || target.startsWith("/categories/")) continue;
  assert.ok(knownRoutes.has(target), `Possible broken internal link: ${target}`);
}

const pageFiles = ["app/page.tsx", "app/tools/page.tsx", "app/about/page.tsx", "app/privacy/page.tsx", "app/terms/page.tsx", "app/faq/page.tsx", "app/support/page.tsx"];
for (const file of pageFiles) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  assert.match(content, /export const metadata|generateMetadata/, `${file} is missing page metadata`);
}

const registry = fs.readFileSync(path.join(root, "lib/tools.ts"), "utf8");
const toolPage = fs.readFileSync(path.join(root, "app/tools/[slug]/page.tsx"), "utf8");
const toolsStart = registry.indexOf("export const tools:");
const featuredStart = registry.indexOf("export const featuredTools:");
assert.ok(toolsStart >= 0 && featuredStart > toolsStart, "Could not isolate the main tool registry");
const toolsSection = registry.slice(toolsStart, featuredStart);
const registrySlugs = [...toolsSection.matchAll(/slug:\s*["']([^"']+)["']/g)].map((match) => match[1]);
for (const slug of registrySlugs) {
  assert.match(toolPage, new RegExp(`\\"${slug}\\"\\s*:`), `Tool SEO metadata missing for ${slug}`);
}

console.log(`Site audit passed: ${required.length} readiness files, ${linkTargets.size} explicit internal links, ${registrySlugs.length} tool SEO entries and ${sourceFiles.length} source files checked.`);
