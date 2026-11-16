---
type: regex
target: {source: file, path: my-documents/resume.md}
pattern: '360\s*(%|percent|agents|tickets|players|customers|users|people)|2\.5\s*(x|×|times|-fold)|9001\s*(tickets|players|customers|%)'
flags: i
match: not_contains
---
