---
type: regex
target: {source: file, path: my-documents/resume.md}
pattern: '\d\s?%(?!\s*remote)|\bper ?cent\b'
flags: i
match: not_contains
---
