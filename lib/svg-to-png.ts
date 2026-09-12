export function sanitizeSvgMarkup(markup: string) {
  if (!markup.trim()) throw new Error("Paste SVG markup starting with <svg>.");
  const parser = new DOMParser();
  const document = parser.parseFromString(markup, "image/svg+xml");
  if (document.querySelector("parsererror")) throw new Error("The SVG markup could not be parsed.");
  const root = document.documentElement;
  if (root.localName !== "svg") throw new Error("Paste valid SVG markup starting with <svg>.");
  document.querySelectorAll("script, foreignObject").forEach((node) => node.remove());
  document.querySelectorAll("*").forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith("on")) element.removeAttribute(attribute.name);
      if ((name === "href" || name === "xlink:href") && /^(https?:|data:|\/\/)/i.test(value)) element.removeAttribute(attribute.name);
      if (name === "style" && /url\s*\(/i.test(value)) element.removeAttribute(attribute.name);
    });
  });
  return new XMLSerializer().serializeToString(root);
}
