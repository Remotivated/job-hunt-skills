# Vendor bundle licenses

`export-deps.mjs` is built from npm packages by `npm run build:vendor`
(esbuild; see `scripts/vendor-entry.mjs`). It is checked in so users never
run `npm install`. All bundled code is MIT-licensed:

| Package | License | Source |
|---------|---------|--------|
| `docx` | MIT | https://github.com/dolanmiu/docx |
| `pdfmake` (prebuilt browser bundle, which itself inlines `pdfkit`, `fontkit`, and their dependencies) | MIT | https://github.com/bpampuch/pdfmake |
| `markdown-it` | MIT | https://github.com/markdown-it/markdown-it |

MIT license text (applies to each package above; per-package copyright
notices are preserved in the packages' repositories linked above):

```text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

The vendored Gelasio fonts in `templates/fonts/` are licensed under the SIL
Open Font License 1.1 — see `templates/fonts/OFL.txt`.
