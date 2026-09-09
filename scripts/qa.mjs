import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const toolsSource = fs.readFileSync(path.join(root, "lib", "tools.ts"), "utf8");
const routeSource = fs.readFileSync(path.join(root, "app", "tools", "[slug]", "page.tsx"), "utf8");

const toolMatches = [...toolsSource.matchAll(/slug:"([^"]+)"[^}]*name:"([^"]+)"[^}]*category:"([^"]+)"[^}]*status:"([^"]+)"/g)];
const tools = toolMatches.map(([, slug, name, category, status]) => ({ slug, name, category, status }));
const categories = new Set(["calculators", "developer", "text", "files"]);
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const componentNames = [...routeSource.matchAll(/import\s+([A-Za-z0-9]+)\s+from\s+"@\/components\/tools\/([^"]+)"/g)]
  .map(([, component, file]) => ({ component, file }));

function componentFileExists(file) {
  return fs.existsSync(path.join(root, "components", "tools", `${file}.tsx`));
}

test("tool registry is structurally valid", () => {
  assert.ok(tools.length >= 20, `Expected at least 20 tools, found ${tools.length}`);
  assert.equal(new Set(tools.map((tool) => tool.slug)).size, tools.length, "Duplicate tool slugs found");

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
    const importEntry = componentNames.find((entry) => entry.component === component);
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
  for (const file of fs.readdirSync(toolDir).filter((entry) => entry.endsWith(".tsx"))) {
    const source = fs.readFileSync(path.join(toolDir, file), "utf8");
    assert.doesNotMatch(source, /dangerouslySetInnerHTML/, `Unexpected raw HTML injection in ${file}`);
  }
});
