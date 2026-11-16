---
type: regex
target: {source: file, path: my-documents/applications/lumen-freight-support-operations-lead/resume.md}
pattern: 'Kustomer|Looker|\bSQL\b|cost per ticket|(team of|manag\w*|lead\w*|led|hir\w*)[^.\n]{0,20}\b(15|fifteen)\b'
flags: i
match: not_contains
---
