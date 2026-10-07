// Markdown exports contain text, rules and lists. SVG rendering is outside
// that contract; reject it explicitly instead of bundling an unused renderer.
export default function renderSvg() {
  throw new Error("SVG is not supported by the document exporter.");
}
