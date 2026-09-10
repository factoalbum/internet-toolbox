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
for (const file of required) assert.ok(fs.existsSync(path.join(root, file)), `Missing ${file}`);

const errorPage = fs.readFileSync(path.join(root, "app/error.tsx"), "utf8");
assert.match(errorPage, /reset/);
assert.match(errorPage, /Try again/);
const loadingPage = fs.readFileSync(path.join(root, "app/loading.tsx"), "utf8");
assert.match(loadingPage, /role=["']status["']/);
assert.match(loadingPage, /aria-live=["']polite["']/);
const header = fs.readFileSync(path.join(root, "components/site-header.tsx"), "utf8");
assert.match(header, /focus-visible:ring/);

const knownRoutes = new Set(["/", "/tools", "/about", "/privacy", "/terms", "/faq", "/support", "/categories", "/categories/calculators", "/categories/everyday", "/categories/developer", "/categories/text", "/categories/files"]);
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

const pageFiles = ["app/page.tsx", "app/tools/page.tsx", "app/categories/page.tsx", "app/about/page.tsx", "app/privacy/page.tsx", "app/terms/page.tsx", "app/faq/page.tsx", "app/support/page.tsx"];
for (const file of pageFiles) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  assert.match(content, /export const metadata|generateMetadata/, `${file} is missing page metadata`);
}

const registry = fs.readFileSync(path.join(root, "lib/tools.ts"), "utf8");
const toolPage = fs.readFileSync(path.join(root, "app/tools/[slug]/page.tsx"), "utf8");
const toolsStart = registry.indexOf("export const tools:");
const featuredStart = registry.indexOf("export const featuredTools");
const toolsSection = registry.slice(toolsStart, featuredStart);
const registrySlugs = [...toolsSection.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const seoKeys = [...toolPage.matchAll(/^  "([^"]+)":\s*\{/gm)].map((match) => match[1]);
assert.ok(registrySlugs.length >= 35, "Tool registry unexpectedly small");
for (const slug of registrySlugs) assert.ok(seoKeys.includes(slug), `Missing SEO entry for ${slug}`);

const layout = fs.readFileSync(path.join(root, "app/layout.tsx"), "utf8");
assert.match(layout, /overflow-x-clip|overflow-x:\s*clip/);
const globals = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
assert.match(globals, /overflow-x:\s*clip/);

const analytics = fs.readFileSync(path.join(root, "components/analytics-consent.tsx"), "utf8");
assert.match(analytics, /NEXT_PUBLIC_GA_ID|gtag/);
assert.match(analytics, /localStorage/);

console.log(`Site audit passed: ${required.length} readiness files, ${linkTargets.size} explicit internal links, ${seoKeys.length} tool SEO entries and ${sourceFiles.length} source files checked.`);
