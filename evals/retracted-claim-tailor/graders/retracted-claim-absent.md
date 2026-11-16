---
type: regex
target: {source: file, path: my-documents/applications/northgate-logistics-support-operations-manager/resume.md}
pattern: '(\$|€|£|\bUSD ?|\bEUR ?)\s?2(\.0+)?\s?(M|MM|mn|million)\b|\b2(\.0+)?(M|MM|mn)\b|\b2(\.0+)? (million|mn)\b|\btwo million\b|\b2,000,000\b'
flags: i
match: not_contains
---
