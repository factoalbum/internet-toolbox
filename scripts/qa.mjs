import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const toolsSource = fs.readFileSync(path.join(root, "lib", "tools.ts"), "utf8");
const routeSource = fs.readFileSync(path.join(root, "app", "tools", "[slug]", "page.tsx"), "utf8");
const currencySource = fs.readFileSync(path.join(root, "components", "tools", "currency-converter.tsx"), "utf8");
const metalsSource = fs.readFileSync(path.join(root, "components", "tools", "gold-silver-converter.tsx"), "utf8");

const toolMatches = [...toolsSource.matchAll(/slug:"([^"]+)"[^}]*name:"([^"]+)"[^}]*category:"([^"]+)"[^}]*status:"([^"]+)"/g)];
const tools = toolMatches.map(([, slug, name, category, status]) => ({ slug, name, category, status }));
const categories = new Set(["calculators", "developer", "text", "files"]);
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const componentNames = [...routeSource.matchAll(/import\s+([A-Za-z0-9]+)\s+from\s+"@\/components\/tools\/([^"]+)"/g)].map(([, component, file]) => ({ component, file }));

function componentFileExists(file) { return fs.existsSync(path.join(root, "components", "tools", `${file}.tsx`)); }
function source(slug) { return fs.readFileSync(path.join(root, "components", "tools", `${slug}.tsx`), "utf8"); }
function assertContains(file, patterns) {
  const content = source(file);
  for (const pattern of patterns) assert.match(content, pattern, `${file} is missing expected QA invariant: ${pattern}`);
}

test("tool registry is structurally valid", () => {
  assert.ok(tools.length >= 20, `Expected at least 20 tools, found ${tools.length}`);
  assert.equal(new Set(tools.map(tool => tool.slug)).size, tools.length, "Duplicate tool slugs found");
  for (const tool of tools) {
    assert.match(tool.slug, validSlug, `Invalid slug: ${tool.slug}`);
    assert.ok(tool.name.trim(), `Missing name for ${tool.slug}`);
    assert.ok(categories.has(tool.category), `Invalid category for ${tool.slug}: ${tool.category}`);
    assert.equal(tool.status, "live", `Unexpected non-live tool in registry: ${tool.slug}`);
    assert.ok(routeSource.includes(`slug===\"${tool.slug}\"`), `Missing route renderer for ${tool.slug}`);
  }
});

test("every live tool has a component file", () => {
  for (const tool of tools) {
    const rendered = routeSource.match(new RegExp(`slug===\\\"${tool.slug}\\\"&&<([A-Za-z0-9]+)`));
    assert.ok(rendered, `No JSX renderer found for ${tool.slug}`);
    const component = rendered[1];
    const importEntry = componentNames.find(entry => entry.component === component);
    assert.ok(importEntry, `Renderer ${component} for ${tool.slug} is not imported`);
    assert.ok(componentFileExists(importEntry.file), `Missing component file for ${tool.slug}: ${importEntry.file}.tsx`);
  }
});

test("static tool routing is configured", () => {
  assert.match(routeSource, /export function generateStaticParams\(\)/);
  assert.match(routeSource, /tools\.map\(tool=>\(\{slug:tool\.slug\}\)\)/);
  assert.match(routeSource, /if\(!tool\)notFound\(\)/);
});

test("core site pages exist", () => {
  for (const page of ["app/page.tsx", "app/tools/page.tsx", "app/about/page.tsx", "app/privacy/page.tsx", "app/support/page.tsx"]) {
    assert.ok(fs.existsSync(path.join(root, page)), `Missing required page: ${page}`);
  }
});

test("tool components do not inject raw HTML", () => {
  const toolDir = path.join(root, "components", "tools");
  for (const file of fs.readdirSync(toolDir).filter(entry => entry.endsWith(".tsx"))) {
    const content = fs.readFileSync(path.join(toolDir, file), "utf8");
    assert.doesNotMatch(content, /dangerouslySetInnerHTML/, `Unexpected raw HTML injection in ${file}`);
  }
});

test("financial calculators guard invalid inputs and expose estimates", () => {
  assertContains("emi-calculator", [/p <= 0/, /annual < 0/, /n <= 0/, /r === 0/, /Estimate only/]);
  assertContains("gst-calculator", [/value < 0/, /tax < 0/, /tax > 100/, /1 \+ tax \/ 100/, /simple GST estimate/]);
  assertContains("fd-calculator", [/principal/, /rate/, /years/, /compounding/, /Estimate/]);
  assertContains("compound-interest-calculator", [/principal/, /rate/, /years/, /compounding/, /Estimate/]);
  assertContains("sip-calculator", [/monthly/, /annual/, /years/, /market-linked/]);
  assertContains("ppf-calculator", [/150000|1\.5/, /15/, /7\.1/]);
  assertContains("hra-calculator", [/rent/, /metro/, /taxable/]);
});

test("tax and salary calculators contain current-rule safeguards", () => {
  assertContains("income-tax-calculator", [/75000|75_000/, /60000|60_000/, /1200000|1_200_000/, /0\.04|4/]);
  assertContains("salary-calculator", [/75000|75_000/, /marginal/, /professional tax|professionalTax/i]);
});

test("simple calculators expose numeric validation", () => {
  assertContains("percentage-calculator", [/Number\(/, /Number\.isFinite/]);
  assertContains("discount-calculator", [/Number\(/, /Number\.isFinite/]);
  assertContains("bmi-calculator", [/Number\(/, /Number\.isFinite/]);
});

test("live market tools use explicit external rate sources", () => {
  assert.match(currencySource, /https:\/\/open\.er-api\.com\/v6\/latest\/USD/);
  assert.match(currencySource, /rates\[target\] \/ rates\[base\]/);
  assert.match(currencySource, /popularRates/);
  assert.match(currencySource, /rateToInr/);
  assert.match(metalsSource, /https:\/\/api\.gold-api\.com\/price\/\$\{metal\}/);
  assert.match(metalsSource, /https:\/\/open\.er-api\.com\/v6\/latest\/USD/);
  assert.match(metalsSource, /31\.1034768/);
  assert.match(metalsSource, /Number\(purity\) \/ 24/);
  assert.match(metalsSource, /gold24/);
  assert.match(metalsSource, /gold22/);
  assert.match(metalsSource, /gold18/);
  assert.match(metalsSource, /perGram \* 10/);
  assert.match(metalsSource, /perGram \* 1000/);
  assert.doesNotMatch(metalsSource, /₹\s*1[0-9]{4,6}/, "Metal tool must not hardcode a current INR price");
});

test("market tools handle failed rate requests", () => {
  assert.match(currencySource, /response\.ok/);
  assert.match(currencySource, /role=\"alert\"/);
  assert.match(currencySource, /Retry/);
  assert.match(metalsSource, /response\.ok/);
  assert.match(metalsSource, /role=\"alert\"/);
  assert.match(metalsSource, /Retry/);
});
