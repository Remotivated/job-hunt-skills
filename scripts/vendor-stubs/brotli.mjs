// Export PDFs embed bundled TrueType fonts. WOFF2 decoding is intentionally
// unsupported so the Brotli decoder and its opaque dictionary never ship.
export default function decompressWoff2() {
  throw new Error("WOFF2 fonts are not supported by the document exporter; use TrueType fonts.");
}
