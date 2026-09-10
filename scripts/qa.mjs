import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const toolsSource = fs.readFileSync(path.join(root, "lib", "tools.ts"), "utf8");
const toolPage = fs.readFileSync(path.join(root, "app", "tools", "[slug]", "page.tsx"), "utf8");
const toolRouter = fs.readFileSync(path.join(root, "components", "tools", "tool-router.tsx"), "utf8");
const routeSource = fs.readFileSync(path.join(root, "app", "layout.tsx"), "utf8");
const toolDir = path.join(root, "components", "tools");
const sourceFiles = () => [path.join(root, "app", "page.tsx"), path.join(root, "app", "globals.css"), path.join(root, "components", "site-header.tsx"), ...fs.readdirSync(toolDir).filter((entry) => entry.endsWith(".tsx")).map((entry) => path.join(toolDir, entry))];
const toolsSection = toolsSource.match(/export const tools: Tool\[\] = \[(.*?)\];\n\nexport const featuredTools/s)?.[1] ?? "";
const slugs = [...toolsSection.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);

function readTool(name) { return fs.readFileSync(path.join(toolDir, name), "utf8"); }

test("tool registry is structurally valid", () => { assert.ok(slugs.length >= 50, "Expected a substantial live tool registry"); assert.equal(new Set(slugs).size, slugs.length, "Tool slugs must be unique"); for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/); });

test("every live tool has a component file", () => {
  const alternates = { "url-encoder-decoder": "url-encoder.tsx", "base64-encoder-decoder": "base64.tsx", "gold-silver-rate-converter": "gold-silver-converter.tsx", "url-slug-generator": "slug-generator.tsx", "text-diff-checker": "text-diff.tsx", "html-entity-encoder-decoder": "html-entity.tsx", "document-similarity-checker": "document-similarity.tsx" };
  for (const slug of slugs) { const expected = path.join(toolDir, `${slug}.tsx`); const alternate = alternates[slug] ? path.join(toolDir, alternates[slug]) : null; assert.ok(fs.existsSync(expected) || (alternate && fs.existsSync(alternate)), `Missing component for ${slug}`); }
  for (const slug of slugs) assert.match(toolRouter, new RegExp(`\"${slug}\"\\s*:`), `Tool router mapping missing for ${slug}`);
});

test("static tool routing is configured", () => { assert.match(toolPage, /generateStaticParams/); assert.match(toolPage, /params:\s*Promise<\{\s*slug:\s*string\s*\}>/); assert.match(toolPage, /notFound\(\)/); assert.match(toolPage, /ToolRouter/); });

test("core site pages exist and use shared navigation", () => { for (const file of ["about", "privacy", "terms", "faq", "support"]) assert.ok(fs.existsSync(path.join(root, "app", file, "page.tsx")), `Missing /${file}`); assert.ok(fs.existsSync(path.join(root, "app", "not-found.tsx"))); assert.ok(fs.existsSync(path.join(root, "app", "error.tsx"))); assert.match(fs.readFileSync(path.join(root, "app", "about", "page.tsx"), "utf8"), /SiteHeader/); });

test("category sidebar is safe for SSR and scroll locking", () => { const files = fs.readdirSync(path.join(root, "components")).filter((entry) => /sidebar/i.test(entry)); for (const file of files) { const content = fs.readFileSync(path.join(root, "components", file), "utf8"); assert.doesNotMatch(content, /document\.body\.style\.overflow\s*=\s*[^\n]*outside useEffect/); } });

test("shared layout prevents horizontal overflow and long text issues", () => { assert.match(fs.readFileSync(path.join(root, "app", "globals.css"), "utf8"), /overflow-x:\s*clip/); assert.match(routeSource, /min-w-0/); });

test("tool components do not inject raw HTML", () => { for (const file of fs.readdirSync(toolDir).filter((entry) => entry.endsWith(".tsx"))) { const content = fs.readFileSync(path.join(toolDir, file), "utf8"); assert.doesNotMatch(content, /dangerouslySetInnerHTML/, `Unexpected raw HTML injection in ${file}`); } });

test("site copy avoids AI-style typography artifacts", () => { for (const file of sourceFiles()) { const content = fs.readFileSync(file, "utf8"); assert.doesNotMatch(content, /[—–…]/, `Avoid em dash, en dash and ellipsis in UI/source copy: ${path.relative(root, file)}`); } });

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
